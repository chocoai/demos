import React, { Component } from 'react';
import { Config } from '../../Config/Index';
import './style/addNewuser.less';
import { browserHistory } from 'react-router'; // 创建route所需
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import SubbranchService from '../../Services/SubbranchService';
import { Row, Col, Button, Form, Input, message, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
/**
 * 新增用户
 *
 * @export
 * @class Addnewmodal
 * @extends {Component}
 */
class Addusermodal extends Component {
    constructor(props) {
        super(props); //后才能用this获取实例化对象
        this.state = {
            layout: 'inline',
            mRole: '',									// 用户角色
            addUserError: '',							// 出错提示文案
            roleIdArray: [],   						// 初始化角色选择id
            roleNameArr: [], // 初始化角色昵称
            editFlag: Config.getQueryString('code'),    // 编辑标识
            roleLevelFlag: Config.getQueryString('roleLevel'),    // 角色标识
            modalItem: '',                               // 编辑用户数据
            isActived: false,
            branchItems: [],
            isBranch: false
        };
    }
    // 验证姓名
    checkName = (rule, value, callback) => {
        if (Config.isNull(value)) {
            callback();
        } else if (value.length > 16) {
            callback(Config.warnInfo.nameRule);
        } else {
            callback();
        }
    }
    // 验证手机号
    checkTelephone = (rule, value, callback) => {
        if (Config.isNull(value)) {
            callback();
        } else if (!Config.checkTelephone(value)) {
            callback(Config.warnInfo.telephoneRule);
        } else {
            callback();
        }
    }
    // 验证邮箱
    checkEmail = (rule, value, callback) => {
        const that = this;
        const { modalItem } = that.state;
        if (modalItem.email == value) {
            that.setState({
                isActived: false
            });
        } else {
            that.setState({
                isActived: true
            });
        }
        callback();
    }
    getUserRoles = () => {
        let editFlag = this.state.editFlag;
        Config.get('/v1/roles', {}, (res) => {  // 查询用户角色
            if (res.code == Config.errorCode.success) {
                res.data.map((result, key) => {
                    result.className = 'list';
                    result.select = false;
                    return;
                });
                this.setState({
                    mRole: res.data
                });
                // 调用编辑用户信息接口
                if (editFlag) {
                    this.getEditUserInfo(editFlag);
                }

            } else {
                message.error(res.msg);
            }
        });
    }
    getEditUserInfo = (code) => {
        Config.get('/v1/user/code', { code: code }, (res) => {  // 获取编辑用户数据回显
            if (res.code == 0) {
                let roleId = res.data.roleId ? res.data.roleId.split(",") : [];
                let mRole = this.state.mRole || [];
                let roleIdArray = this.state.roleIdArray;  // 选中角色id数组
                let roleNameArr = [];
                if (roleId && roleId.length) {
                    roleId.map(function (value) {
                        mRole.map(function (result) {
                            if (result.roleId == value) {
                                roleNameArr.push(result.roleName);
                                result.className = 'list listSelected';
                                result.select = true;
                                roleIdArray.push(value);
                            }
                            return;
                        });
                        return;
                    });
                    this.setState({
                        mRole: mRole,
                        roleIdArray: roleIdArray,
                        roleNameArr: roleNameArr,
                        isBranch: Config.isContain(roleNameArr, 'ROLE_CUSTOMER_MANAGER')||Config.isContain(roleNameArr,"ROLE_MID_MANAGER")
                    });
                }
                this.setState({
                    modalItem: res.data
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    componentDidMount() {
        this.getUserRoles();
        this.getbranchItems({enterpriseCode: Config.localItem('ENTERP_CODE')});
    }
    async getbranchItems(params) {
        const res = await SubbranchService.getBranchItems(params);
        if (res.code == Config.errorCode.success) {
            this.setState({
                branchItems: res.data
            });
        } else {
            message.error(res.msg);
        }
    }
    selectRole = (selectedRule) => { // 角色被选中时
        const roleId = selectedRule.roleId;
        let roleIdArray = this.state.roleIdArray;  // 选中角色id数组
        let roleNameArr = this.state.roleNameArr;
        let mRole = this.state.mRole;              // 现有角色对象
        mRole.map((result) => {
            if (result.roleId != roleId) {
                return;
            }
            let select = result.select;   // 选中标记
            if (select) {
                result.className = 'list';
                result.select = false;
                roleIdArray.map((data, key) => {
                    if (data == roleId) {
                        roleIdArray.splice(key, 1);
                        roleNameArr.splice(key, 1);
                        return;
                    }
                });
                this.setState({
                    roleIdArray: roleIdArray,
                    roleNameArr: roleNameArr
                });
            } else {
                result.className = 'list listSelected';
                result.select = true;
                roleIdArray.push(roleId);
                roleNameArr.push(selectedRule.roleName);
                this.setState({
                    roleIdArray: roleIdArray,
                    roleNameArr: roleNameArr
                });
            }
        });
        this.setState({
            mRole: mRole,
            isBranch: Config.isContain(roleNameArr, 'ROLE_CUSTOMER_MANAGER')||Config.isContain(roleNameArr,"ROLE_MID_MANAGER")
        });
    }
    goBack = () => {
        browserHistory.goBack();
    }
    activateUser = () => { // 用户激活
        const that = this;
        const url = Config.domain + '/setPwd';
        const { modalItem } = that.state;
        let resentParams = {
            email: modalItem.email,
            url: url
        };
        Config.get('/comm/v1/user/active/resend', resentParams, (res) => {
            if (res.code == Config.errorCode.success) {
                message.success('邮件已发送请注意激活');
                that.setState({
                    isActived: true
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    handleSubmit = (e) => { // 增加用户
        const that = this;
        const { modalItem,roleLevelFlag } = that.state;
        e.preventDefault();
        that.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var name = values.name,
                    telephone = values.telephone,
                    email = values.email,
                    sex = values.sex,
                    branchCode = values.branchCode,
                    rId = this.state.roleIdArray,
                    url = Config.domain + '/setPwd';
                let userParams = {
                    name: name,
                    telephone: Config.clearSpecChars(telephone),
                    email: email,
                    sex: sex,
                    branchCode: branchCode,
                    roleId: rId,
                    url: url
                };
                let edit = this.state.editFlag; // 编辑标识
                if (edit) { // 编辑用户
                    let editUserParams = {};     // 编辑用户参数
                    userParams.code = editUserParams.code = modalItem.code;    // 回显更新界面的id跟编辑的id赋值
                    editUserParams.name = name;
                    editUserParams.telephone = telephone;
                    editUserParams.email = email;
                    editUserParams.sex = sex;
                    editUserParams.branchCode = branchCode || '';
                    if(roleLevelFlag==0){
                        editUserParams.roleId = 7;//如果是超级管理员默认角色传7
                    }else{
                        editUserParams.roleId = rId;
                    }
                    // if (!editUserParams.branchCode) editUserParams.branchCode = '';
                    Config.put('/v1/user', editUserParams, (res) => {
                        if (res.code == 0) {
                            // 跳转用户管理页面 超管修改后跳转到登录页
                            if(roleLevelFlag==0){
                                message.success('修改成功，请重新登录！');
                                browserHistory.push('/login');  
                            }else{
                                message.success('修改成功！');
                                browserHistory.push('/user');
                            }
                        } else {
                            message.error(res.msg);
                        }
                    });
                } else { // 新增用户
                    if (!userParams.branchCode) delete userParams.branchCode;
                    Config.post('/v1/user', userParams, (res) => {
                        if (res.code == 0) {
                            message.success('添加成功！');
                            // 跳转用户管理页面
                            browserHistory.push('/user');
                        } else {
                            message.error(res.msg);
                        }
                    });
                }
            }
        });
    }
    render() {
        const that = this;
        const { editFlag, modalItem, mRole, isActived, branchItems, isBranch,roleLevelFlag } = that.state;
        const { getFieldDecorator } = that.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 }
            }
        };
        let addUserError = that.state.addUserError ? <FormItem><div className="change-error">{that.state.addUserError}</div></FormItem> : null;
        const bcrumb = [{
            'link': '/user',
            'value': '用户管理'
        }, {
            'link': null,
            'value': editFlag ? '编辑用户' : '新增用户'
        }];
        return (
            <div className="add-or-edit-user">
                {/* <Breadcrumb className='breadcrumb'>
                    <Breadcrumb.Item className='breadcrumb-item'><Link to="/user">用户管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item className='breadcrumb-item'>{editFlag ? '编辑用户' : '新增用户'}</Breadcrumb.Item>
                </Breadcrumb> */}
                <BcrumbItem bcrumb={bcrumb} />
                <Form onSubmit={that.handleSubmit} className="add-user-form" hideRequiredMark={true}>
                    {addUserError}
                    <Row>
                        { modalItem && modalItem.status == 0 && <Col span={24} className="activate">{ !isActived ? <span className="activate-btn" onClick={() => that.activateUser()}>立即激活</span> : <span className="activate-btn activate-text">立即激活</span> }<span className="activate-text">(该用户暂未激活成功，请核对邮箱信息后再次激活！)</span></Col>}
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="姓名" hasFeedback>
                                {getFieldDecorator('name', { initialValue: modalItem && modalItem.name, rules: [{ required: true, message: Config.warnInfo.nameNull }, { validator: this.checkName }] })(
                                    <Input placeholder="必填项" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="手机" hasFeedback>
                                {getFieldDecorator('telephone', { initialValue: modalItem && modalItem.telephone, rules: [{ required: true, message: Config.warnInfo.telephoneNull }, { validator: this.checkTelephone }] })(
                                    <Input placeholder="必填项" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="邮箱账号" hasFeedback>
                                {getFieldDecorator('email', { initialValue: modalItem && modalItem.email, rules: [{ required: true, message: Config.warnInfo.emailNull }, { type: 'email', message: Config.warnInfo.emailRule }, { validator: that.checkEmail }] })(
                                    <Input placeholder="必填项" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="性别" hasFeedback>
                                {
                                    modalItem && modalItem.sex ? getFieldDecorator('sex', { initialValue: modalItem && modalItem.sex, rules: [] })(
                                        <Select placeholder="请选择性别" getPopupContainer={trigger => trigger.parentNode}>
                                            <Option value="男">男</Option>
                                            <Option value="女">女</Option>
                                        </Select>
                                    ) : getFieldDecorator('sex', { rules: [] })(
                                        <Select placeholder="请选择性别" getPopupContainer={trigger => trigger.parentNode}>
                                            <Option value="男">男</Option>
                                            <Option value="女">女</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        { isBranch && <Col span={12}>
                            <FormItem {...formItemLayout} label="支行信息" hasFeedback>
                                { modalItem && modalItem.branchCode ? getFieldDecorator('branchCode', { initialValue: modalItem && modalItem.branchCode, rules: [{ required: true, message: '请选择支行信息' },] })(
                                    <Select placeholder="请选择支行信息" allowClear>
                                        { branchItems.map((item) => (
                                            <Option key={item.code} value={item.code}>{item.bankName}</Option>
                                        )) }
                                    </Select>
                                ) : getFieldDecorator('branchCode', { rules: [{ required: true, message: '请选择支行信息' },] })(
                                    <Select placeholder="请选择支行信息" allowClear>
                                        { branchItems.map((item) => (
                                            <Option key={item.code} value={item.code}>{item.bankName}</Option>
                                        )) }
                                    </Select>
                                )}
                            </FormItem>
                        </Col> }
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="角色">
                                <div className="select-role" className={roleLevelFlag!=0?'select-role':`select-role roleLevel`}>
                                    {
                                        mRole && mRole.length > 0 ? mRole.map((item, index) => {
                                            return <div className={item.className} key={item.roleId} onClick={this.selectRole.bind(this, item)}>{item.roleNickName}</div>
                                        }) : null
                                    }
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <div className="add-btns">
                        <Button className="common-small-btn" type="primary" htmlType="submit">{editFlag ? "保存" : "新增"}</Button>
                        <Button className="common-small-btn" onClick={this.goBack}>取消</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

const Main = Form.create()(Addusermodal);

export default Main;
