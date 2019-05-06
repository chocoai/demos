import React, { Component } from 'react';
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import './style/group.less';
import { browserHistory } from 'react-router'; // 创建route所需
import get from 'lodash.get'
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import { Row, Col, Button, Form, Input, message, Select, Spin } from 'antd';
import GroupService from '../../Services/GroupService'; // services层
import CommonService from '../../Services/CommonService'; // services层
const FormItem = Form.Item;
const Option = Select.Option;
/**
 * 新增用户
 *
 * @export
 * @class Addnewmodal
 * @extends {Component}
 */
class AddGroup extends Component {
    constructor(props) {
        super(props); //后才能用this获取实例化对象
        this.state = {
            loading: false,
            editFlag: Config.getQueryString('code'),    // 编辑标识
            teamLeaderList: [],//组长列表
            teamMemberList: [],//组员列表
            teamMemberNum:0,
            groupItem: {},//小组详情
            unableEdit: false,//是否不可编辑 (true为不可编辑)
        };
    }
    componentDidMount() {
        this.getUserMaxRole()
    }
    async getUserMaxRole(){
        const { editFlag, unableEdit } = this.state;
        let res= await CommonService.getUserMaxRole();
        if((res.data=='ROLE_MID_MANAGER')&&(/ROLE_MID_MANAGER/.test(Config.localItem('CUR_ROLE')))){
            this.setState({
                unableEdit:true
            })
        }
         // 获取主管和成员信息 
         if (editFlag) {
            this.getteamInfo({ memberType: 1, teamCode: editFlag })
            if ((res.data=='ROLE_MID_MANAGER')&&(/ROLE_MID_MANAGER/.test(Config.localItem('CUR_ROLE')))) {
                this.getteamInfo({ memberType: 2, teamCode: editFlag,branchCode:Config.localItem('BRANCH_CODE')})
            }else{
                this.getteamInfo({ memberType: 2, teamCode: editFlag })
            }
            this.getGroupItem({ teamCode: editFlag })
        } else {
            this.getteamInfo({ memberType: 1 })
            if ((res.data=='ROLE_MID_MANAGER')&&(/ROLE_MID_MANAGER/.test(Config.localItem('CUR_ROLE')))) {
                this.getteamInfo({ memberType: 2,branchCode:Config.localItem('BRANCH_CODE')})
            }else{
                this.getteamInfo({ memberType: 2 })
            }
            if ((res.data=='ROLE_MID_MANAGER')&&(/ROLE_MID_MANAGER/.test(Config.localItem('CUR_ROLE')))) {
                this.setState({
                    groupItem: { zgCode: [Config.localItem('LOGIN_USER_CODE')] }
                })
            }
        }
    }
    goBack = () => {
        browserHistory.goBack();
    }
    // 获取组员详情
    async getGroupItem(params) {
        this.setState({ loading: true })
        const res = await GroupService.getGroupItem(params);
        this.setState({ loading: false })
        if (res.data) {
            if (res.data.zgCode) {
                res.data.zgCode = res.data.zgCode.split(',');
            } else {
                res.data.zgCode = [];
            }
        }
        this.setState({
            groupItem: res.data
        })
    }
    // 获取主管和成员信息
    async getteamInfo(params) {
        const res = await GroupService.getteamInfo(params);
        if (params.memberType == 1) {
            this.setState({
                teamLeaderList: res.data
            })
        } else {
            this.setState({
                teamMemberList: res.data,
                teamMemberNum:res.data.lenght
            })
        }

    }
    // 新增/编辑小组
    async putGroupInfo(params) {
        const { editFlag } = this.state;
        const res = await GroupService.putGroupInfo(params);
        if (res.code == Config.errorCode.success) {
            if (editFlag) {
                message.success('修改成功！');
            } else {
                message.success('创建成功！');
            }
            browserHistory.push('/group');
        }
    }
    // 提交
    handleSubmit = () => {
        const { editFlag } = this.state;
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                let params = {
                    teamName: values.teamName,
                    cyCode: values.cyCode.join(","),
                    zgCode: values.zgCode.join(","),
                };
                if (editFlag) {
                    params.code = editFlag;
                }
                this.putGroupInfo(params)
            }
        })
    }
    render() {
        const that = this;
        const { editFlag, loading, teamLeaderList, teamMemberList, groupItem, unableEdit } = that.state;
        let arr1=teamMemberList.map(item=>JSON.stringify(item)); 
        let arr2=groupItem.cyDTOList&&groupItem.cyDTOList.map(item=>JSON.stringify(item)); 
        let newTeamMemberList=[];
        if(arr2){
            newTeamMemberList=[...new Set([...arr1,...arr2])].map(item=>JSON.parse(item))
        }else{
            newTeamMemberList=teamMemberList
        }
        // console.log(newTeamMemberList)
        const { getFieldDecorator } = that.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 3 },
                sm: { span: 3 }
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 }
            }
        };
        const bcrumb = [{
            'link': '/group',
            'value': '小组管理'
        }, {
            'link': null,
            'value': editFlag ? '编辑小组' : '新增小组'
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="groupContainer">
                    <BcrumbItem bcrumb={bcrumb} />
                    <div className="common-console-container group-console-container">
                        <Form className="add-group-form" hideRequiredMark={true}>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="小组名称">
                                        {getFieldDecorator('teamName', {
                                            initialValue: groupItem.teamName,
                                            rules: [{ required: true, message: '请填写' }, { validator: Validate.checkWordLen25, message: Validate.warnInfo.wordLen25 }],
                                        })(
                                            <Input placeholder="必填项" autoComplete="off"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="小组主管" {...formItemLayout}>
                                        {getFieldDecorator('zgCode', {
                                            initialValue: groupItem.zgCode,
                                            rules: [{ required: true, message: '请选择' }],
                                        })(

                                            <Select
                                                mode="multiple"
                                                placeholder="必选项"
                                                // onChange={this.giftChange}
                                                disabled={unableEdit}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                className="friend-input">
                                                {
                                                    teamLeaderList && teamLeaderList.map((item, index) =>
                                                        <Option value={item.code} key={item.code}>{item.userName}</Option>
                                                    )
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="小组成员" {...formItemLayout}>
                                        {getFieldDecorator('cyCode', {
                                            initialValue: groupItem.cyDTOList&&groupItem.cyDTOList.map(item=>item.code),
                                            rules: [{ required: true, message: '请选择' }],
                                        })(

                                            <Select
                                                mode="multiple"
                                                placeholder="必选项"
                                                // onChange={this.giftChange}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                className="friend-input">
                                                {
                                                    newTeamMemberList.map((item, index) =>
                                                        <Option disabled={index>teamMemberList.length-1} value={item.code} key={item.code}>{item.userName}</Option>
                                                    )
                    
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <div className="add-btns">
                                <Button className="common-btn" onClick={this.handleSubmit} type="primary" htmlType="submit">{editFlag ? "保存" : "新增"}</Button>
                                <Button className="common-btn cancel-btn" onClick={this.goBack}>取消</Button>
                            </div>
                        </Form>
                    </div>

                </div>
            </Spin>
        )
    }
}

const Main = Form.create()(AddGroup);

export default Main;
