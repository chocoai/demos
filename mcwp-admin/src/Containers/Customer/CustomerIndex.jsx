import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, browserHistory } from 'react-router';
import { Config } from '../../Config/Index';
import { getSysDict } from '../../Redux/Action/Index';
import { getCustomers, editCustomerType, delCustomer, getManagerList } from '../../Redux/Action/Customer/CustomerAction';
import ResetSearch from './../../Component/Common/ResetSearch';
import './style/customer.less';

import { Spin, Table, Button, Input, Select, Modal, message } from 'antd';
const Search = Input.Search;
const Option = Select.Option;

/**
 * 客户管理
 * @Author: 魏昌华
 * @Date:   2017-07-04
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-28
 */

class CustomerList extends Component {
    constructor(props) {
    	super(props);
        this.state = {
            codes: '',
            params: {
                page: 1,
                rows: 10
            },
            dataCompare:'' //对比选择的是否都为黑名单或者白名单
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    componentDidMount() {
        const { actions} = this.props;
        const { params } = this.state;
        actions.getCustomers(params);
        actions.getSysDict({code: 'khlx'});
        actions.getManagerList();
	}
    changeTable = (pagination) => { // 分页、排序、筛选变化时触发
        const {params, actions} = this.props;
		params.page = pagination.current;
		params.rows = pagination.pageSize;
		actions.getCustomers(params);
	}
    searchData = (value) => { // 搜索客户信息
        const {params, actions} = this.props;
		if(Config.isNull(value)) {
			delete params.word;
		} else {
			params.word = value;
		}
		params.page = 1; // 查询数据重置页码
		actions.getCustomers(params);
    }
    changeManage = (value) => {
        const {params, actions} = this.props;
        params.owners = value;
        params.page = 1; // 查询数据重置页码
		actions.getCustomers(params);
    }
    changeCustType = (value) => {
        const {params, actions} = this.props;
        params.custType = value;
        params.page = 1; // 查询数据重置页码
		actions.getCustomers(params);
    }
    changeRowSelect = (selectedRowKeys, selectedRows) => {
        this.setState({
            codes: selectedRowKeys.join('|'),
            dataCompare: selectedRows,
        });
    }
    editCustType = (code, type) => { // 客户信息编辑(批量修改客户类型)
        const that = this;
        const { params, actions } = that.props;
        const { codes, dataCompare } = that.state;
        if (!codes && code == -1) {
            message.error('请选择客户!');
            return;
        }
        let onOff = false;
        if( type == 1) {
            dataCompare.map((item, index)=>(
                item.custTypeName == '白名单'? null : onOff=true
            ))
        }
        if( type == 2) {
            dataCompare.map((item, index)=>(
                item.custTypeName == '黑名单'? null : onOff=true
            ))
        }
        if (!onOff && code == -1) {
            type == 1?message.error('客户已加入白名单'):message.error('客户已加入黑名单');
            return;
        }
        let confirm = Modal.confirm;
        if(code === -1) { // 加入黑名单、白名单
            if( type == 1) {
                confirm({
                    title: '提示' ,
                    content: '确认要加入白名单吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk() {
                        actions.editCustomerType({codes: codes, type: type}, params);
                        let dataComp = dataCompare;
                        dataCompare.map((item, index)=>(
                            item.custTypeName = '白名单'
                        ))
                        that.setState({
                            dataCompare: dataComp,
                        })
                    }
                });
            } else {
                confirm({
                    title: '提示' ,
                    content: '确认要加入黑名单吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk() {
                        actions.editCustomerType({codes: codes, type: type}, params);
                        let dataComp = dataCompare;
                        dataCompare.map((item, index)=>(
                            item.custTypeName = '黑名单'
                        ))
                        that.setState({
                            dataCompare: dataComp
                        })
                    }
                });
            }


        } else {
            actions.editCustomerType({codes: code, type: type}, params);
            // 此处这种做法存在一些瑕疵，因为全部改变，但不影响结果
            let dataComp = dataCompare;
            dataCompare.map((item, index)=>(
                item.custTypeName = '正常'
            ))
            that.setState({
                dataCompare: dataComp
            })
        }
    }
    goCustomerDesc = (record) => { // 跳转详情
        // const currentClassName = event.target.className;
        // if(currentClassName.indexOf('J_no_detail') > -1) return;
        browserHistory.push('/customer/detail/' + record.code);
    }
    delCustomer = (code, name) => {  // 删除客户
    	const {params, actions} = this.props;
    	const confirm = Modal.confirm;
        params.page = 1; // 查询数据重置页码
    	confirm({
		    title: '删除客户',
		    content: '确定删除'+ name +'该用户吗?',
		    okText: '确定',
   			cancelText: '取消',
		    onOk() {
		        actions.delCustomer(params, code);
		    }
		});
    }
	render() {
        const { loading, pagination, customerList, sysDictItems, managerList } = this.props;
        const columns = [{
			title: '客户姓名',
			dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
    			<span className="name-container">
                    { record.wechat ? <span className="wexin-tip">{text}</span> : <span>{text}</span> }
    			</span>
  			)
		}, {
			title: '身份证号',
			dataIndex: 'idCardNo',
			key: 'idCardNo'
		}, {
			title: '联系方式',
			dataIndex: 'telephone',
			key: 'telephone'
		}, {
			title: '客户类型',
			dataIndex: 'custTypeName',
			key: 'custTypeName'
		}, {
			title: '归属客户经理',
			dataIndex: 'ownerName',
            key: 'ownerName',
            render: (text, record) => (
    			<span>
                    { text ?<span>{text}</span> : "——" }
    			</span>
  			)
        },{
			title: '创建时间',
			dataIndex: 'createDate',
			key: 'createDate',
			render: (text, record) => (
    			<span>
     				{Config.formatDateTime(text)}
    			</span>
  			)
		}, {
			title: '操作',
		  	key: 'action',
		  	render: (text, record) => (
		  		<span>
                    <Link className="J_no_detail customer-handle" onClick={this.goCustomerDesc.bind(this, record)}>查看</Link>
                    <span className="J_no_detail ant-divider" />
                    <Link className="J_no_detail customer-handle" to={"/customer/handle/" + record.code}>编辑</Link>
                    <span className="J_no_detail ant-divider" />
                    <span className="J_no_detail customer-handle" style={{cursor: 'pointer'}} onClick={this.delCustomer.bind(this, record.code, record.name)} style={{'color': '#f00'}}>删除</span>
                    { record.remove ? <span className="J_no_detail ant-divider" /> : null }
                    { record.remove ? <span style={{cursor: 'pointer'}} onClick={this.editCustType.bind(this, record.code, 3)} className="J_no_detail customer-handle ant-dropdown-link">移出</span> : null }
                </span>
		  	)
		}];
        const rowSelection = {
            onChange: this.changeRowSelect
        };
        // const addManager = {
        //     userId:0,
        //     name:"无归属关系",
        //     code:0
        // };
        let managerLists = managerList;
        if(managerLists[0] && managerLists[0].name == '无归属关系'){
        }else{
            managerLists.unshift({
                userId:0,
                name:"无归属关系",
                code:0
            });
         }
		return (
		<Spin tip={Config.warnInfo.spinText} spinning={loading}>
			<div className="common-console-container customer-container">
		        <div className="common-search-section">
                    <div className="date-search-container">
                        <Select
                            className="search-customer-account-manager"
                            mode="multiple"
                            showSearch
                            style={{ width: 150 }}
                            placeholder="归属客户经理"
                            optionFilterProp="children"
                            size={"large"}
                            onChange={this.changeManage}
                            getPopupContainer={trigger => trigger.parentNode}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {
                                managerLists && managerLists.length > 0 && managerLists.map((item, index)=>(
                                    <Option key={index} value={item.userId.toString()}>{item.name}</Option>
                                ))
                            }
                        </Select>
                        <Select
                            className="search-item"
                            showSearch
                            style={{ width: 150 }}
                            size={"large"}
                            placeholder="客户类型"
                            optionFilterProp="children"
                            onChange={this.changeCustType}
                            getPopupContainer={trigger => trigger.parentNode}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {
                                sysDictItems.khlx && sysDictItems.khlx.length > 0 && sysDictItems.khlx.map((item, index)=>(
                                    <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                ))
                            }
                        </Select>
                        <Search
                            className="search-item"
                            placeholder="客户姓名或联系方式"
                            style={{ width: 150 }}
                            size={"large"}
                            onSearch={this.searchData}
                        />
                        <ResetSearch />
                    </div>
                </div>
                <div className="common-action-section">
                    <Link to="/customer/handle"><Button className="common-btn" icon="plus" type="primary">新客户</Button></Link>
                    <Button className="common-btn" type="primary" onClick={this.editCustType.bind(this, -1, 2)}>加入黑名单</Button>
                    <Button className="common-btn" type="primary" onClick={this.editCustType.bind(this, -1, 1)}>加入白名单</Button>
                    <Link to="/customer/export"><Button className="common-btn" type="primary">批量导入</Button></Link>
                </div>
		        <Table
		        	rowKey={record => record.code}
		        	pagination={pagination}
		        	columns={columns}
                    rowSelection={rowSelection}
		        	dataSource={customerList}
                    onChange={this.changeTable}
                    className="common-content-container"
                    locale = {{
                        emptyText: '暂无客户相关信息',
                    }}
		        />
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
        params: Customer.params,
        sysDictItems: Common.sysDictItems,
        customerList: Customer.customerList,
        pagination: Customer.pagination,
        managerList: Customer.managerList
    }
}

// 将 action 作为 props 绑定到 CustomerList 上。
const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators({ getManagerList, getCustomers, editCustomerType, delCustomer, getSysDict }, dispatch)
});

const Main = connect(mapStateToProps, mapDispatchToProps)(CustomerList); // 连接redux

export default Main;

