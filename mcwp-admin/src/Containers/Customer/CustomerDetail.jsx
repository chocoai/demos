import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { Config } from '../../Config/Index';
import CustomerService from '../../Services/CustomerService';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import { getCustomer, getCustomerLoan, getCustomerBorrow } from '../../Redux/Action/Customer/CustomerAction';
import './style/customerDetail.less';
import { Row, Col, Spin, Table, Tabs } from 'antd';
const TabPane = Tabs.TabPane;

/**
 * 客户管理 -- 客户详情
 * @Author: 魏昌华
 * @Date:   2017-07-04
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-07-04
 */

class CustomerDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CustomerPartners: null,
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentDidMount() {
        const { routeParams, actions, loanParams, borrowParams } = this.props;
        const code = routeParams.code;
        if (code) {
            loanParams.code = code;
            actions.getCustomer(code);
            actions.getCustomerLoan(loanParams);
            borrowParams.customerCode = code;
            actions.getCustomerBorrow(borrowParams);
            // this.getCustomerPartners(code);
        }
    }
    // getCustomerPartners(code) {
    //     CustomerService.getCustomerPartners(code, (res) => {
    //         if (res.code == Config.errorCode.success) {
    //             const data = res.data;
    //             this.setState({
    //                 CustomerPartners: data
    //             })
    //         } else {
    //             // message.error(res.msg);
    //         }
    //     });
    // }
    changeTable = (pagination) => { // 分页、排序、筛选变化时触发
        const { loanParams, actions } = this.props;
        loanParams.page = pagination.current;
        loanParams.rows = pagination.pageSize;
        actions.getCustomerLoan(loanParams);
    }
    changeBorrowTable = (pagination) => { // 分页、排序、筛选变化时触发
        const { borrowParams, actions } = this.props;
        borrowParams.page = pagination.current;
        borrowParams.rows = pagination.pageSize;
        actions.getCustomerBorrow(borrowParams);
    }
    render() {
        // const { CustomerPartners } = this.state;
        const { loading, loanPagination, customerInfo, customerLoanList, customerBorrowList, borrowPagination } = this.props;
        const columns = [{
            title: '申请时间',
            dataIndex: 'reqDate',
            key: 'reqDate',
            render: (text, record) => (
                <span>
                    {Config.formatDateTime(text)}
                </span>
            )
        }, {
            title: '产品名称',
            dataIndex: 'prodName',
            key: 'prodName'
        }, {
            title: '产品类型',
            dataIndex: 'prdTypeText',
            key: 'prdTypeText'
        }, {
            title: '审批状态',
            dataIndex: 'auditStatus',
            key: 'auditStatus'
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span> {
                    record.prdType == 5 ?
                        <Link className="customer-handle" to={`/customer/detail/ipieces/netLoan/${record.code}`}>查看</Link> :
                        <Link className="customer-handle" to={`/customer/detail/ipieces/operate/${record.code}/${record.prdType}`}>查看</Link>
                } </span>
            )
        }];
        const columnsLoan = [{
            title: '申请时间',
            dataIndex: 'createDate',
            key: 'createDate',
            width: 300,
            render: (text, record) => (
                <span>
                    {Config.formatDateTime(text)}
                </span>
            )
        }, {
            title: '借款金额(元)',
            dataIndex: 'borrowMoney',
            key: 'borrowMoney',
            width: 100,
        }, {
            title: '借款状态',
            dataIndex: 'loanStatusText',
            key: 'loanStatusText',
            width: 200,
        }, {
            title: '操作',
            key: 'action',
            width: 300,
            render: (text, record) => (
                <span> {
                    <Link className="customer-handle" to={'/loan/detail/' + record.code}>查看</Link>
                } </span>
            )
        }];
        const bcrumb = [{
            'link': '/customer/list',
            'value': '客户管理'
        }, {
            'link': null,
            'value': '客户详情'
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <BcrumbItem bcrumb={bcrumb} />
                <div className="customer-detail">
                    <Row className="personal-info">
                        <Col span={4} className="title">
                            <span>个人信息</span>
                        </Col>
                    </Row>
                    <Row className="personal-info-content" style={{ border: 'none' }}>
                        <Col span={6} className="title">
                            <span>姓名：{customerInfo && customerInfo.name || '未录入'}</span>
                        </Col>
                        <Col span={6} className="title">
                            <span>婚姻状况：{customerInfo && customerInfo.maritalStatusName || '未录入'}</span>
                        </Col>
                        <Col span={6} className="title">
                            <span>客户类型：{customerInfo && customerInfo.custTypeName || '未录入'}</span>
                        </Col>
                        <Col span={6} className="title">
                            <span>归属客户经理：{customerInfo && customerInfo.ownerName || '未录入'}</span>
                        </Col>
                        <Col span={6} className="title">
                            <span>授信额度：{customerInfo && customerInfo.creditAmount && customerInfo.creditAmount + '元' || '未录入'}</span>
                        </Col>
                        <Col span={6} className="title">
                            <span>借款日利率：{customerInfo && customerInfo.dailyRate && customerInfo.dailyRate + '%' || '未录入'}</span>
                        </Col>
                        <Col span={12} className="title">
                            <span>最长还款期数：{customerInfo && customerInfo.repaymentPeriodName && customerInfo.repaymentPeriodName + '期' || '未录入'}</span>
                        </Col>
                        <Col span={12} className="title">
                            <span>身份证号：{customerInfo && customerInfo.idCardNo || '未录入'}</span>
                        </Col>
                        <Col span={12} className="title">
                            <span>联系方式：{customerInfo && customerInfo.telephone || '未录入'}</span>
                        </Col>
                        <Col span={12} className="title">
                            <span>企业名称：{customerInfo && customerInfo.orgName || '未录入'}</span>
                        </Col>
                        <Col span={12} className="title">
                            <span>居住地址：{customerInfo && customerInfo.address || '未录入'}</span>
                        </Col>
                    </Row>
                    {customerInfo && customerInfo.guaranteeInfos.length ?
                        <div>
                            <Row className="personal-info">
                                <Col span={4} className="title">
                                    <span>联系人信息</span>
                                </Col>
                            </Row>
                            {customerInfo.guaranteeInfos.map(item => 
                            <Row className="personal-info-content">
                                <Col span={12} className="title">
                                    <span>姓名：{item.name || '未录入'}</span>
                                </Col>
                                <Col span={12} className="title">
                                    <span>关系：{item.relationshipText || '未录入'}</span>
                                </Col>
                                <Col span={12} className="title">
                                    <span>身份证号：{item.idCardNo || '未录入'}</span>
                                </Col>
                                <Col span={12} className="title">
                                    <span>联系方式：{item.telephone || '未录入'}</span>
                                </Col>
                            </Row>)}
                        </div>: null}
                    <Tabs className='customer-detail-tabs' defaultActiveKey="1">
                        <TabPane tab="申请记录" key="1">
                            <Table
                                rowKey={record => record.code}
                                pagination={loanPagination}
                                columns={columns}
                                dataSource={customerLoanList}
                                onChange={this.changeTable}
                            />
                        </TabPane>
                        <TabPane tab="借款记录" key="2">
                            <Table
                                rowKey={record => record.code}
                                pagination={borrowPagination}
                                columns={columnsLoan}
                                dataSource={customerBorrowList}
                                onChange={this.changeBorrowTable}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </Spin>
        );
    }
}

// 将 store 中的数据作为 props 绑定到 CustomerDetail 上
const mapStateToProps = (state, ownProps) => {
    let { Common, Customer } = state;
    return {
        loading: Common.loading,
        customerInfo: Customer.customerInfo,
        loanParams: Customer.loanParams,
        loanPagination: Customer.loanPagination,
        customerLoanList: Customer.customerLoanList,
        borrowParams: Customer.borrowParams,
        borrowPagination: Customer.borrowPagination,
        customerBorrowList: Customer.customerBorrowList
    }
}

// 将 action 作为 props 绑定到 CustomerDetail 上。
const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators({ getCustomer, getCustomerLoan, getCustomerBorrow }, dispatch)
});

const Main = connect(mapStateToProps, mapDispatchToProps)(CustomerDetail); // 连接redux

export default Main;

