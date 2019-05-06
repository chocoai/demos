import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import moment from 'moment';
import { Config } from '../../Config/Index';
import { browserHistory, Link } from 'react-router';
import ResetSearch from './../../Component/Common/ResetSearch';
import './style/loanIndex.less';
import loanCancelImg from '../../Assets/Images/img_loan_cancel.png';
import loanMarkImg from '../../Assets/Images/loan-mark.png';
import mortgageImg from '../../Assets/Images/img_mortgage.png';

import { Menu, Table, Icon, Input, Button, Spin, message, Modal, DatePicker, Select } from 'antd';
const Search = Input.Search;
const Option = Select.Option;


/**
 * 借款管理
 * @Author: 赵俊
 * @Date:   2017-08-08
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-08-08
 */
/**
* 参考进件
* 放款确认 结清借款 模态框
* 搜索框 根据 借款状态 开始和结束时间 客户名字进行搜索
* 借款状态字典与高度问题actions.getSysDict({code: 'khlx'}); select的option利用字典进行map
* 角色不同，所能查看的内容不同 let menuItem =  this.getMenuItem(curRole);   获取进件类型菜单
* 切换menu，获取不同的数据 triggerIpiecesType 切换进件类型
* 查看 审批 放款确认 下载合同 要根据借款的信息进行判断
*
*/

class LoanIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmVisible: false,
            loading: false,
            loanInfo: [],
            loanNum: {},
            dateKey: 0,
            defaultTab: ['all'],
            pagination: {
                showSizeChanger: true, // 是否可以改变 pageSize
                showQuickJumper: true, // 是否可以快速跳转至某页
                pageSizeOptions: ['5', '10', '15'], // 指定每页可以显示多少条
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`
            },
            params: {
                page: 1,
                rows: 10
            },
            startValue: null,          // 搜索开始时间
            endValue: null,             // 搜索结束时间
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentWillMount() {
        let that = this;
        let params = that.state.params;
        const { routeParams } = that.props;
        that.setState({
            defaultTab: routeParams.tab ? routeParams.tab.split() : ['all'],
        });
        let loanStatus = 0;   // 审核状态
        switch (routeParams.tab) {
            case 'await':
                loanStatus = 1;
                break;
            case 'pass':
                loanStatus = 2;
                break;
            case 'reject':
                loanStatus = 3;
                break;
            case 'secur':
                loanStatus = 4;
                break;
            case 'settled':
                loanStatus = 5;
                break;
            case 'examine':
                loanStatus = 7;
                break;
            default:
                break;
        }
        if (loanStatus > 0) {
            params.loanStatus = loanStatus;
        } else {
            delete params.loanStatus;
        }
        that.getLoanList(params);  // 获取借款列表
        let params1 = {
            page: 1,
            rows: 10
        };
        that.getLoanNum(params1);   // 获取借款状态的数量
    }

    // 获取借款列表
    getLoanList = (params) => {
        this.setState({ loading: true });
        Config.get('/v1/loan/borrowInfos', params, (res) => {
            this.setState({ loading: false });
            if (res.code == Config.errorCode.success) {
                let pagination = { ...this.state.pagination };
                pagination.total = res.recordsTotal; // 总页数
                pagination.current = params.page; // 当前页数
                this.setState({
                    loanInfo: res.data,
                    pagination
                });
            } else {
                message.error(res.msg)
            }
        })
    }
    // 获取借款状态的数量
    getLoanNum = (params) => {
        // let getParams = params ? params : {};
        Config.get('/v1/loan/borrowInfo/count', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    loanNum: res.data,
                });
            } else {
                message.error(res.msg);
            }
        });

    }
    // 切换menu查看不同阶段状态菜单
    triggerLoanType = (e) => {
        // let loanStatus = 0;   // 审核状态
        // switch (e.key) {
        //     case  'awaitAppro' :
        //     loanStatus = 1;         // 待审批
        //     break;
        //     case  'passAppro' :
        //     loanStatus = 2;         // 审批通过
        //     break;
        //     case  'rejectAppro' :
        //     loanStatus = 3;         // 审批拒绝
        //     break;
        //     case  'securLoan' :
        //     loanStatus = 4;         // 已放款
        //     break;
        //     case  'settled' :
        //     loanStatus = 5;         // 已结清
        //     break;
        // }
        // let params = this.state.params;
        // if(loanStatus > 0) {
        //     params.loanStatus = loanStatus;
        // } else {
        //     delete params.loanStatus;
        // }
        // // 重置页面到第一页
        // params.page = 1;
        // this.setState({
        //     params: params
        // });
        // // 获取数据 重新渲染Table的dataSourse
        // this.getLoanList(params);
        // Config.localItem('DEFAULT_TAB', e.key)
        browserHistory.push('/loans/' + e.key);
    }
    // 本周 本月 近三个月
    searchDateKey = (dateKey) => {
        let params = this.state.params;
        params.startTime = moment().subtract(dateKey, 'days').format('YYYY-MM-DD');
        params.endTime = moment().format('YYYY-MM-DD');
        this.setState({
            dateKey: dateKey
        })
        params.page = 1;
        this.getLoanList(params);
        this.getLoanNum(params);
    }


    // 根据时间来搜索借款 重置页码
    onStartTimeChange = (value) => {
        this.onChange('startValue', value)
        let params = this.state.params;
        if (value) {
            params.startTime = value.format('YYYY-MM-DD');
        } else {
            delete params.startTime;
        }
        params.page = 1;
        this.getLoanList(params);
        this.getLoanNum(params);
    }
    onEndTimeChange = (value) => {
        this.onChange('endValue', value)
        let params = this.state.params;
        if (value) {
            params.endTime = value.format('YYYY-MM-DD');
        } else {
            delete params.endTime;
        }
        params.page = 1;
        this.getLoanList(params);
        this.getLoanNum(params);
    }
    // 禁用开始时间
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    //  禁用结束时间
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    // 根据开始和禁用时间来设置this.state.startValue  OR  endValue
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    // 根据客户姓名搜索借款(模糊搜索) 重置页码
    searchData = (value) => {
        let keyWord = value;
        let params = this.state.params;
        if (Config.isNull(keyWord)) {
            delete params.keyWord;
        } else {
            params.keyWord = keyWord;
        }
        params.page = 1;
        this.getLoanList(params);
        this.getLoanNum(params);
    }
    loanCancelChange = (value) => {
        let params = this.state.params;
        if (value) {
            params.isCancel = value
        } else {
            delete params.isCancel;
        }
        params.page = 1; // 查询数据重置页码
        this.getLoanList(params);
        this.getLoanNum(params);
    }
    infoChange = (value) => {
        let params = this.state.params;
        if (value) {
            params.hasLoanAfterData = value
        } else {
            delete params.hasLoanAfterData;
        }
        params.page = 1; // 查询数据重置页码
        this.getLoanList(params);
        this.getLoanNum(params);
    }
    // 页码改变 或者 页面表格条数改变
    changeTable = (pagination) => {
        let params = this.state.params;
        params.page = pagination.current;
        params.rows = pagination.pageSize;
        this.getLoanList(params);
    }
    // 操作分类
    operationItems = (record, curRole) => {
        let loanStatus = record.loanStatus;
        let curUser = Config.localItem('LOGIN_USER_ID');  // 当前用户角色Id
        return (
            <span>
                <Link href={'/loan/detail/' + record.code} style={{ 'color': '#108ee9' }} target='_blank'>查看</Link>
            </span>
        )
        // // 超级管理员
        // if(curRole.indexOf('ROLE_SUPER_ADMIN') > -1 ) {
        //     // 拥有全部权限
        //     if(loanStatus == 1) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                 <span className="ant-divider" />
        //                 <Link to={'/loan/appro/'+ record.code} style={{'color': '#108ee9'}} >审批</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 2) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                  <span className="ant-divider" />
        //                  <span style={{'color': '#108ee9', cursor: 'pointer'}} onClick={this.confirmLoan.bind(this,record)}>放款确认</span>
        //             </span>
        //         )
        //     } else if(loanStatus == 3) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 4) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                 <span className="ant-divider" />
        //                 <span style={{'color': '#108ee9', cursor: 'pointer'}} onClick={this.settledLoan.bind(this,record)}>结清确认</span>
        //                 <span className="ant-divider" />
        //                 <Link style={{cursor: 'pointer'}} onClick={this.downloadContract.bind(this,record)}>下载合同</Link>
        //                 {
        //                     record.smsSwitch?
        //                     <div style={{display: 'inline-block'}}>
        //                         <span className="ant-divider" />
        //                         {
        //                             record.overdueButton ?
        //                             <Link style={{'color':  '#108ee9'}} onClick={() => this.sendOverdueTask(record)}>催收</Link>:
        //                             <Link style={{'color':  'rgba(0, 0, 0, .65)'}} >催收</Link>
        //                         }
        //                     </div>
        //                     : null
        //                 }
        //                 {
        //                     record.smsSwitch?
        //                     <div style={{display: 'inline-block'}}>
        //                         <span className="ant-divider" />
        //                         {
        //                             record.smsButton ?
        //                             <Link style={{'color':  '#108ee9'}} onClick={() => this.sendOverdueMsg(record)}>催收短信</Link>:
        //                             <Link style={{'color':  'rgba(0, 0, 0, .65)'}} >催收短信</Link>
        //                         }
        //                     </div>
        //                     : null
        //                 }
        //             </span>
        //         )
        //     } else if(loanStatus == 5) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                 <span className="ant-divider" />
        //                 <Link style={{cursor: 'pointer'}} onClick={this.downloadContract.bind(this,record)}>下载合同</Link>
        //             </span>
        //         )
        //     }
        //     else if(loanStatus == 7) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     }
        // // 客户经理 与 业务主管
        // } else if(curRole.indexOf('ROLE_CUSTOMER_MANAGER') > -1 || curRole.indexOf('ROLE_TOP_MANAGER') > -1 ||curRole.indexOf('ROLE_MID_MANAGER') > -1) {
        //     // 权限：1待审批：查看借款详情； 2审批通过：查看借款详情、放款确认； 3审批拒绝：查看借款详情；
        //     // 4已放款：查看借款详情、结清确认、下载合同; 5已结清：查看借款详情、下载合同
        //     if(loanStatus == 1) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 2) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                  <span className="ant-divider" />
        //                  <span style={{'color': '#108ee9', cursor: 'pointer'}} onClick={this.confirmLoan.bind(this,record)}>放款确认</span>
        //             </span>
        //         )
        //     } else if(loanStatus == 3) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 4) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                 <span className="ant-divider" />
        //                 <span style={{'color': '#108ee9', cursor: 'pointer'}} onClick={this.settledLoan.bind(this,record)}>结清确认</span>
        //                 <span className="ant-divider" />
        //                 <Link style={{cursor: 'pointer'}} onClick={this.downloadContract.bind(this,record)}>下载合同</Link>
        //                 {
        //                     record.smsSwitch?
        //                     <div style={{display: 'inline-block'}}>
        //                         <span className="ant-divider" />
        //                         {
        //                             record.overdueButton ?
        //                             <Link style={{'color':  '#108ee9'}} onClick={() => this.sendOverdueTask(record)}>催收</Link>:
        //                             <Link style={{'color':  'rgba(0, 0, 0, .65)'}} >催收</Link>
        //                         }
        //                     </div>
        //                     : null
        //                 }
        //                 {
        //                     record.smsSwitch?
        //                     <div style={{display: 'inline-block'}}>
        //                         <span className="ant-divider" />
        //                         {
        //                             record.smsButton ?
        //                             <Link style={{'color':  '#108ee9'}} onClick={() => this.sendOverdueMsg(record)}>催收短信</Link>:
        //                             <Link style={{'color':  'rgba(0, 0, 0, .65)'}} >催收短信</Link>
        //                         }
        //                     </div>
        //                     : null
        //                 }
        //             </span>
        //         )
        //     } else if(loanStatus == 5) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                 <span className="ant-divider" />
        //                 <Link style={{cursor: 'pointer'}} onClick={this.downloadContract.bind(this,record)}>下载合同</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 7) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     }
        // // 审查员
        // } else if(curRole.indexOf('ROLE_EXAMINANT') > -1) {
        //     // 权限：1待审批：审批； 2审批通过：查看借款详情； 3审批拒绝：查看借款详情；
        //     // 4已放款：查看借款详情、下载合同; 5已结清：查看借款详情、下载合同
        //     if(loanStatus == 1) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 2) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 3) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 4) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                 <span className="ant-divider" />
        //                 <Link style={{cursor: 'pointer'}} onClick={this.downloadContract.bind(this,record)}>下载合同</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 5) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                 <span className="ant-divider" />
        //                 <Link style={{cursor: 'pointer'}} onClick={this.downloadContract.bind(this,record)}>下载合同</Link>
        //             </span>
        //         )
        //     }
        //     else if(loanStatus == 7) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/examine/'+ record.code} style={{'color': '#108ee9'}} >审查</Link>
        //             </span>
        //         )
        //     }
        // // 待审员
        // } else if(curRole.indexOf('ROLE_CR_MANAGER') > -1) {
        //     // 权限：1待审批：审批； 2审批通过：查看借款详情； 3审批拒绝：查看借款详情；
        //     // 4已放款：查看借款详情、下载合同; 5已结清：查看借款详情、下载合同
        //     if(loanStatus == 1) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/appro/'+ record.code} style={{'color': '#108ee9'}} >审批</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 2) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 3) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 4) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                 <span className="ant-divider" />
        //                 <Link style={{cursor: 'pointer'}} onClick={this.downloadContract.bind(this,record)}>下载合同</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 5) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                 <span className="ant-divider" />
        //                 <Link style={{cursor: 'pointer'}} onClick={this.downloadContract.bind(this,record)}>下载合同</Link>
        //             </span>
        //         )
        //     }
        //     else if(loanStatus == 7) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     }
        // // 风控主管
        // } else if(curRole.indexOf('ROLE_RISK_MANAGER') > -1) {
        //     // 权限：1待审批：查看借款详情； 2审批通过：查看借款详情； 3审批拒绝：查看借款详情；
        //     // 4已放款：查看借款详情、下载合同; 5已结清：查看借款详情、下载合同
        //     if(loanStatus == 1) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 2) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 3) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 4) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                 <span className="ant-divider" />
        //                 <Link style={{cursor: 'pointer'}} onClick={this.downloadContract.bind(this,record)}>下载合同</Link>
        //             </span>
        //         )
        //     } else if(loanStatus == 5) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //                 <span className="ant-divider" />
        //                 <Link style={{cursor: 'pointer'}} onClick={this.downloadContract.bind(this,record)}>下载合同</Link>
        //             </span>
        //         )
        //     }
        //     else if(loanStatus == 7) {
        //         return (
        //             <span>
        //                 <Link to={'/loan/detail/'+ record.code} style={{'color': '#108ee9'}} >查看</Link>
        //             </span>
        //         )
        //     }
        // }

    }
    render() {
        // 获取借款各个状态的数量
        let loanNum = this.state.loanNum;
        let all = (loanNum && loanNum.all) || 0;
        let readyToExamine = (loanNum && loanNum.readyToExamine) || 0;
        let readyToAudit = (loanNum && loanNum.readyToAudit) || 0;
        let auditPass = (loanNum && loanNum.auditPass) || 0;
        let auditReject = (loanNum && loanNum.auditReject) || 0;
        let securedLoan = (loanNum && loanNum.securedLoan) || 0;
        let closedAccount = (loanNum && loanNum.closedAccount) || 0;
        // 当前用户角色
        const curRole = Config.localItem('CUR_ROLE');
        const that = this;
        const { defaultTab, bankNo, startBankNo, confirmLoading, borrowMoney } = that.state;
        const columns = [{
            title: '姓名',
            dataIndex: 'custName',
            key: 'custName'
        }, {
            title: '身份证号',
            dataIndex: 'idCardNo',
            key: 'idCardNo'
        }, {
            title: '借款金额(元)',
            dataIndex: 'borrowMoney',
            key: 'borrowMoney'
        }, {
            title: '申请时间',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (text, record) => (
                <span>
                    {Config.formatDateTime(text)}
                </span>
            )
        }, {
            title: '贷款状态',
            dataIndex: 'loanStatusText',
            key: 'loanStatusText',
            render: (text, record) => (
                <span>
                    {text}
                    {record.isCancel ? <img src={loanCancelImg} alt='loan-cancel' style={{marginLeft:'5px'}}/> : null}
                    {record.hasLoanAfterData ? <img src={loanMarkImg} alt='loan-mark' style={{marginLeft:'5px'}}/> : null}
                    {record.hasMortgage ? <img src={mortgageImg} alt='loan-mark' style={{marginLeft:'5px'}}/> : null}
                </span>
            )
        }, {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text, record) => (
                this.operationItems(record, curRole)
            )
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="common-console-container loanIndex-container">
                    <div className="common-search-section">
                        <div className="date-search-container">
                            <div className='search-item' data-flex="dir:left">
                                <DatePicker
                                    ref='startTime'
                                    placeholder="开始时间"
                                    onChange={this.onStartTimeChange}
                                    format='YYYY-MM-DD'
                                    disabledDate={this.disabledStartDate}
                                    getCalendarContainer={trigger => trigger.parentNode}
                                />
                                <DatePicker
                                    placeholder="结束时间"
                                    onChange={this.onEndTimeChange}
                                    format='YYYY-MM-DD'
                                    disabledDate={this.disabledEndDate}
                                    getCalendarContainer={trigger => trigger.parentNode}
                                />
                            </div>
                            <Select
                                className='search-item'
                                style={{ width: 160, height: 36 }}
                                placeholder="撤销状态"
                                allowClear
                                optionFilterProp="children"
                                onChange={this.loanCancelChange}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                <Option value='0'>未撤销</Option>
                                <Option value='1'>已撤销</Option>

                            </Select>
                            <Select
                                className='search-item'
                                style={{ width: 160, height: 36 }}
                                placeholder="贷款资料状态"
                                allowClear
                                optionFilterProp="children"
                                onChange={this.infoChange}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                <Option value='1'>已上传</Option>
                                <Option value='0'>未上传</Option>

                            </Select>
                            <Search placeholder="客户姓名" style={{ width: 200 }} onSearch={this.searchData} className='search-item' ref='searchData' />
                            <div className="search-item">
                                <span className={`time-item ${this.state.dateKey == 6 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 6)}>近一周</span>
                                <span className={`time-item ${this.state.dateKey == 29 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 29)}>近一月</span>
                                <span className={`time-item ${this.state.dateKey == 89 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 89)}>近三个月</span>
                            </div>
                            <ResetSearch />
                        </div>
                    </div>
                    <Menu className="common-subtab-section" defaultSelectedKeys={defaultTab} mode="horizontal" onClick={this.triggerLoanType}>
                        <Menu.Item className="common-subtab-item" key="all">所有借款( {all} )</Menu.Item>
                        <Menu.Item className="common-subtab-item" key="examine">待审查( {readyToExamine} )</Menu.Item>
                        <Menu.Item className="common-subtab-item" key="await">待审批( {readyToAudit} )</Menu.Item>
                        <Menu.Item className="common-subtab-item" key="pass">审批通过( {auditPass} )</Menu.Item>
                        <Menu.Item className="common-subtab-item" key="reject">审批拒绝( {auditReject} )</Menu.Item>
                        <Menu.Item className="common-subtab-item" key="secur">已放款( {securedLoan} )</Menu.Item>
                        <Menu.Item className="common-subtab-item" key="settled">已结清( {closedAccount} )</Menu.Item>
                    </Menu>
                    <Table
                        rowKey={record => record.code}
                        pagination={this.state.pagination}
                        columns={columns}
                        className="common-content-container"
                        dataSource={this.state.loanInfo}
                        onChange={this.changeTable}
                    />
                </div>
            </Spin>
        );
    }
}

export default LoanIndex;

