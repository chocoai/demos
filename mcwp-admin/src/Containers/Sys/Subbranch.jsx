import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import SubbranchService from '../../Services/SubbranchService'
import { Link } from 'react-router';
import { Config } from '../../Config/Index';

import { Table, message, Tooltip, Button, Modal } from 'antd';
/**
 * 系统配置 —— 支行网点配置
 * @Author: 魏昌华
 * @Date:   2018-05-23
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2018-05-23
 */
class Subbranch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branchList: [],
            pagination: {
                showSizeChanger: true, // 是否可以改变 pageSize
                showQuickJumper: true, // 是否可以快速跳转至某页
                pageSizeOptions: ['5', '10', '15'],// 指定每页可以显示多少条
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`,
                visible: false //模态款控制
            },
            params: {
                page: 1,
                rows: 10
            }
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentDidMount() {
        const that = this;
        const { params } = that.state;
        that.getBranchList(params);
    }
    // 支行网点列表
    async getBranchList(params) {
        const that = this;
        const res = await SubbranchService.getBranchList(params);
        if (res.code == Config.errorCode.success) {
            const pagination = { ...that.state.pagination };
            pagination.total = res.recordsTotal; // 总页数
            pagination.current = params.page; // 当前页数
            that.setState({
                branchList: res.data,
                pagination
            });
        } else {
            message.error(res.msg);
        }
    }
    changeTable = (pagination) => { // 分页、排序、筛选变化时触发
      const that = this;
      let params = that.state.params;
      params.page = pagination.current;
      params.rows = pagination.pageSize;
      that.getBranchList(params);
	}
    // 删除支行网点信息
    delBranch = (record) => {
        const that = this;
        const confirm = Modal.confirm;
        const { params } = that.state;
    	confirm({
		    title: '删除支行',
		    content: '确定删除该支行网点吗?',
		    okText: '确定',
   			cancelText: '取消',
		    async onOk() {
                const res = await SubbranchService.delBranch({code: record.code});
                if (res.code == Config.errorCode.success) {
                    that.getBranchList(params);
                } else {
                    message.error(res.msg);
                }
		    }
		});
    }
    render() {
        const that = this;
        const { branchList, pagination } = that.state
        const columns = [{
            title: '支行名称',
            dataIndex: 'bankName',
            key: 'bankName',
            render: (text) => (
                <span>
                    {text ? (text.length > 20 ? <Tooltip placement="top" title={text}>{text.slice(0, 20) + '...'}</Tooltip> : text) : '——'}
                </span>
            )
        }, {
            title: '地址',
            dataIndex: 'bankAddress',
            key: 'bankAddress',
            render: (text) => (
                <span>
                    {text ? (text.length > 24 ? <Tooltip placement="top" title={text}>{text.slice(0, 24) + '...'}</Tooltip> : text) : '——'}
                </span>
            )
        }, {
            title: '联系电话',
            dataIndex: 'bankPhone',
            key: 'bankPhone'
        }, {
            title: '营业时间',
            dataIndex: 'businessTime',
            key: 'businessTime'
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Link to={"/subbranch/opt/" + record.code}>编辑</Link>
                    <span className="ant-divider" />
                    <a onClick={() => that.delBranch(record)} style={{ 'color': '#f00' }}>删除</a>
                </span>
            )
        }];
        return (
            <div className="common-console-container form-container">
                <div className="common-action-section">
                    <Link to="/subbranch/opt"><Button className="common-btn" icon="plus" type="primary">新支行</Button></Link>
                </div>
                <Table
                    rowKey={record => record.code}
                    pagination={pagination}
                    columns={columns}
                    dataSource={branchList}
                    className="common-content-container"
                    onChange={that.changeTable}
                />
            </div>
        );
    }
}

export default Subbranch;
