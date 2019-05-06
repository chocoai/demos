import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Validate } from '../../Config/Validate';
import AddIcon from './../../Assets/Images/entrymanagement_icon_add.png';
import DeleteIcon from './../../Assets/Images/icon_remove.png';
import { Config } from '../../Config/Index';

import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';

import { getSysDict } from '../../Redux/Action/Index';
import { getCustomer, saveCustomer, addCustomer, editCustomer, getManagerList, putItemArr, clearData } from '../../Redux/Action/Customer/CustomerAction';

import './style/customerHandle.less';

import { Row, Col, Button, Form, Input, Select, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 客户管理 -- 新增客户/编辑客户
 * @Author: 魏昌华
 * @Date:   2017-07-04
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-07-04
 */

class CustomerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addUserError: '', // 出错提示文案
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentDidMount() {
        const { routeParams, actions } = this.props;
        actions.getSysDict({ code: 'khlx,hyzk,lxrgx' });
        actions.getManagerList();
        if (routeParams.code) actions.getCustomer(routeParams.code);
    }
    componentWillUnmount() { // 组件销毁清空数组
        const { actions } = this.props;
        actions.saveCustomer(null); // 组件销毁清空数组
        actions.clearData(); // 组件销毁清空数组
    }
    goBack = () => { // 取消按钮
        browserHistory.goBack();
    }
    handleSubmit = (e) => { // 新增客户、编辑客户
        e.preventDefault();
        const { form, routeParams, actions } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(values.guaranteeInfos&&values.guaranteeInfos.length){
                    values.guaranteeInfos = values.guaranteeInfos.filter(item => item != '')
                }
                let params = Config.serializeObjects(values);
                for (let key in params) {
                    if (params[key] === undefined || params[key] === null || params[key] === '') {
                        delete params[key]
                    }
                }
                if (routeParams.code) { // 编辑客户
                    params.code = routeParams.code;
                    actions.editCustomer(params, browserHistory);
                } else { // 新增客户
                    actions.addCustomer(params, browserHistory);
                }
            }
        });
    }
    ItemAdd = () => {
        const { actions, max } = this.props;
        actions.putItemArr([...this.props.itemArr, max]);
    }
    //删除
    ItemDelete = (itemDelete) => {
        const { actions } = this.props;
        let data = this.props.itemArr.filter((item, index) => item != itemDelete);
        actions.putItemArr(data);
    }
    changeInput = (inp, e) => { // input值变化
        const { actions } = this.props;
        let { customerInfo } = this.props;
        let customer = {};
        if (customerInfo) {
            customer = {
                name: customerInfo.name,
                custType: customerInfo.custType,
                idCardNo: customerInfo.idCardNo,
                telephone: customerInfo.telephone,
                maritalStatus: customerInfo.maritalStatus || '',
                orgName: customerInfo.orgName || '',
                address: customerInfo.address || '',
                owner: customerInfo.owner || ''
            };
        }
        if (!customerInfo) customerInfo = {};
        if (inp == 'name') customer.name = e.target.value;
        if (inp == 'custType') customer.custType = e;
        if (inp == 'idCardNo') customer.idCardNo = e.target.value;
        if (inp == 'telephone') customer.telephone = e.target.value;
        if (inp == 'maritalStatus') customer.maritalStatus = e;
        if (inp == 'orgName') customer.orgName = e.target.value;
        if (inp == 'address') customer.address = e.target.value;
        if (inp == 'owner') customer.owner = e;
        // actions.saveCustomer(customer); // 暂存数据
    }
    render() {
        const { loading, sysDictItems, routeParams, managerList } = this.props;
        let { customerInfo, itemArr } = this.props;
        const code = routeParams.code;
        const bcrumb = [{
            'link': '/customer/list',
            'value': '客户管理'
        }, {
            'link': null,
            'value': code ? '编辑客户' : '新增客户'
        }];
        if (!code) customerInfo = '';
        let guaranteeInfos = customerInfo && customerInfo.guaranteeInfos || []
        const { getFieldDecorator } = this.props.form;
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
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 14,
                }
            }
        };
        const addManager = {
            userId: 0,
            name: "无归属关系",
            code: 0
        };
        const curRole = Config.localItem('CUR_ROLE');
        const userName = Config.localItem('LOGIN_USER_NAME');
        let addUserError = this.state.addUserError ? <FormItem><div className="change-error">{this.state.addUserError}</div></FormItem> : null;
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="customer-handle">
                    <BcrumbItem bcrumb={bcrumb} />
                    <Form onSubmit={this.handleSubmit} className="handle-form" hideRequiredMark={true}>
                        {addUserError}
                        <Row className="pan-info">
                            <Col span={4} className="titles">
                                <span>个人信息</span>
                            </Col>
                        </Row>
                        <Row style={{ paddingLeft: '30px' }}>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="客户姓名" >
                                    {getFieldDecorator('name', { initialValue: customerInfo && customerInfo.name, rules: [{ required: true, message: Config.warnInfo.customerNameNull }] })(
                                        <Input autoComplete="off" placeholder="必填项" maxLength="25" onChange={this.changeInput.bind(this, 'name')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="客户类型" >
                                    {
                                        customerInfo && customerInfo.custType ? getFieldDecorator('custType', { initialValue: customerInfo && customerInfo.custType, rules: [{ required: true, message: Config.warnInfo.custTypeNull }] })(
                                            <Select placeholder="请选择" getPopupContainer={trigger => trigger.parentNode} onChange={this.changeInput.bind(this, 'custType')}>
                                                {
                                                    sysDictItems.khlx && sysDictItems.khlx.length > 0 && sysDictItems.khlx.map((item, index) => (
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        ) : getFieldDecorator('custType', { rules: [{ required: true, message: Config.warnInfo.custTypeNull }] })(
                                            <Select placeholder="请选择" getPopupContainer={trigger => trigger.parentNode} onChange={this.changeInput.bind(this, 'custType')}>
                                                {
                                                    sysDictItems.khlx && sysDictItems.khlx.length > 0 && sysDictItems.khlx.map((item, index) => (
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )
                                    }

                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="身份证号" >
                                    {getFieldDecorator('idCardNo', { initialValue: customerInfo && customerInfo.idCardNo, rules: [{ required: true, message: '请输入身份证号' }, { validator: Validate.checkIdCard, message: Validate.warnInfo.idCard }] })(
                                        <Input autoComplete="off" placeholder="必填项" maxLength="18" onChange={this.changeInput.bind(this, 'idCardNo')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="联系方式" >
                                    {getFieldDecorator('telephone', { initialValue: customerInfo && customerInfo.telephone, rules: [{ required: true, message: '请输入联系方式' }, { validator: Validate.checkPhoneNum, message: Validate.warnInfo.phoneNum }] })(
                                        <Input autoComplete="off" placeholder="必填项" maxLength="11" onChange={this.changeInput.bind(this, 'telephone')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="婚姻状况" >
                                    {
                                        customerInfo && customerInfo.maritalStatus ? getFieldDecorator('maritalStatus', { initialValue: customerInfo && customerInfo.maritalStatus, rules: [{ required: false, message: Config.warnInfo.maritalStatusNull }] })(
                                            <Select placeholder="请选择" getPopupContainer={trigger => trigger.parentNode} onChange={this.changeInput.bind(this, 'maritalStatus')}>
                                                {
                                                    sysDictItems.hyzk && sysDictItems.hyzk.length > 0 && sysDictItems.hyzk.map((item, index) => (
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        ) : getFieldDecorator('maritalStatus', { rules: [{ required: false, message: Config.warnInfo.maritalStatusNull }] })(
                                            <Select placeholder="请选择" getPopupContainer={trigger => trigger.parentNode} onChange={this.changeInput.bind(this, 'maritalStatus')}>
                                                {
                                                    sysDictItems.hyzk && sysDictItems.hyzk.length > 0 && sysDictItems.hyzk.map((item, index) => (
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="企业名称" >
                                    {getFieldDecorator('orgName', { initialValue: customerInfo && customerInfo.orgName, rules: [{ required: false, message: Config.warnInfo.orgNameNull }] })(
                                        <Input autoComplete="off" maxLength="25" placeholder="选填项" onChange={this.changeInput.bind(this, 'orgName')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="居住地址" >
                                    {getFieldDecorator('address', { initialValue: customerInfo && customerInfo.address, rules: [{ required: false, message: Config.warnInfo.addressNull }] })(
                                        <Input autoComplete="off" maxLength="64" placeholder="选填项" onChange={this.changeInput.bind(this, 'address')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="归属客户经理" >
                                    {
                                        customerInfo && customerInfo.owner ? curRole && curRole == "ROLE_CUSTOMER_MANAGER" ? customerInfo.ownerName : getFieldDecorator('owner', { initialValue: customerInfo && customerInfo.owner.toString(), rules: [{ required: false, message: Config.warnInfo.manageNull }] })(
                                            <Select placeholder="请选择" getPopupContainer={trigger => trigger.parentNode} onChange={this.changeInput.bind(this, 'owner')}>
                                                <Option key={addManager.code} value={addManager.userId.toString()}>{addManager.name}</Option>
                                                {
                                                    managerList && managerList.map((item, index) => (
                                                        <Option key={index} value={item.userId.toString()}>{item.name}</Option>
                                                    ))
                                                }
                                            </Select>
                                        ) : curRole && curRole == "ROLE_CUSTOMER_MANAGER" ? userName : getFieldDecorator('owner', { rules: [{ required: false, message: Config.warnInfo.manageNull }] })(
                                            <Select placeholder="请选择" getPopupContainer={trigger => trigger.parentNode} onChange={this.changeInput.bind(this, 'owner')}>
                                                <Option key={addManager.code} value={addManager.userId.toString()}>{addManager.name}</Option>
                                                {
                                                    managerList && managerList.map((item, index) => (
                                                        <Option key={index} value={item.userId.toString()}>{item.name}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="pan-info">
                            <Col span={4} className="titles">
                                <span>联系人信息</span>
                            </Col>
                        </Row>
                        {itemArr && itemArr.map((item, index) =>
                            <Row className='dash-line' key={item}>
                                <Col span={12} style={{ display: 'none' }}>
                                    <FormItem {...formItemLayout} >
                                        {getFieldDecorator('guaranteeInfos[' + item + '].code', { initialValue: guaranteeInfos && guaranteeInfos[item] && guaranteeInfos[item].code, rules: [{ required: false, message: "请输入" }] })(
                                            <Input autoComplete="off" placeholder="必填项" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="姓名" >
                                        {getFieldDecorator('guaranteeInfos[' + item + '].name', { initialValue: guaranteeInfos && guaranteeInfos[item] && guaranteeInfos[item].name, rules: [{ required: true, message: "请输入联系人姓名" }, { validator: Validate.checkWordLen2to20, message: Validate.warnInfo.wordLen2to20 }] })(
                                            <Input autoComplete="off" placeholder="必填项" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="联系方式" >
                                        {getFieldDecorator('guaranteeInfos[' + item + '].telephone', { initialValue: guaranteeInfos && guaranteeInfos[item] && guaranteeInfos[item].telephone, rules: [{ required: true, message: '请输入联系人联系方式' }, { validator: Validate.checkPhoneNum, message: Validate.warnInfo.phoneNum }] })(
                                            <Input autoComplete="off" placeholder="必填项" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="身份证号" >
                                        {getFieldDecorator('guaranteeInfos[' + item + '].idCardNo', { initialValue: guaranteeInfos && guaranteeInfos[item] && guaranteeInfos[item].idCardNo, rules: [{ required: true, message: '请输入联系人身份证号' }, { validator: Validate.checkIdCard, message: Validate.warnInfo.idCard }] })(
                                            <Input autoComplete="off" placeholder="必填项" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="关系" >
                                        {getFieldDecorator('guaranteeInfos[' + item + '].relationship', { initialValue: guaranteeInfos && guaranteeInfos[item] && guaranteeInfos[item].relationship && guaranteeInfos[item].relationship.toString(), rules: [{ required: true, message: '请选择联系人关系' }] })(
                                            <Select placeholder="请选择" getPopupContainer={trigger => trigger.parentNode}>
                                                {
                                                    sysDictItems.lxrgx && sysDictItems.lxrgx.length > 0 && sysDictItems.lxrgx.map((item, index) => (
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <img className='customer-delete' src={DeleteIcon} alt='delete' onClick={() => this.ItemDelete(item)} />
                            </Row>
                        )}
                        <div className='customer-add' onClick={this.ItemAdd}>
                            <img className='customer-add-img' src={AddIcon} alt='add' />
                            <span className='customer-add-detail'>添加联系人</span>
                        </div>
                        <FormItem {...tailFormItemLayout}>
                            <Button className="handle-btn" type="primary" htmlType="submit" size="large">{code ? "保存" : "新增"}</Button>
                            <Button className="handle-btn cancel-btn" size="large" onClick={this.goBack}>取消</Button>
                        </FormItem>
                    </Form>
                </div>
            </Spin>
        );
    }
}

// 将 store 中的数据作为 props 绑定到 CustomerList 上
const mapStateToProps = (state, ownProps) => {
    let { Common, Customer } = state;
    return {
        loading: Common.loading,
        sysDictItems: Common.sysDictItems,
        customerInfo: Customer.customerInfo,
        managerList: Customer.managerList,
        itemArr: Customer.itemArr,
        max: Customer.max
    }
}

// 将 action 作为 props 绑定到 CustomerList 上。
const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators({ getManagerList, getCustomer, saveCustomer, addCustomer, editCustomer, getSysDict, putItemArr, clearData }, dispatch)
});

const CustomerRedux = connect(mapStateToProps, mapDispatchToProps)(CustomerList); // 连接redux

const CustomerForm = Form.create()(CustomerRedux);


export default CustomerForm;

