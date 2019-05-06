import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { browserHistory } from 'react-router';
import { Config } from '../../Config/Index';
import './style/wechatPoint.less';

import { Modal, Table, message,Spin } from 'antd';
const confirm = Modal.confirm;

class WechatPoint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
			loading: false,
			pointList: [],
    		pagination: {
				showSizeChanger: true, // 是否可以改变 pageSize
                showQuickJumper: true, // 是否可以快速跳转至某页
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`,
				pageSizeOptions: ['5', '10','15'] // 指定每页可以显示多少条
			},
			params: {
				page: 1,
				rows: 10
			}
		};
    }
    componentWillMount() {

        let params = this.state.params;
        // 获取网点列表
		this.getPointList(params);

    }
    // 获取网点列表函数
    getPointList = (params) => {
        this.setState({ loading: true });
        Config.get('/v1/sys/wx/bankout/list', params, (res) => {
            this.setState({ loading: false });
            if(res.code == Config.errorCode.success) {
                const pagination = { ...this.state.pagination };
                pagination.total = res.recordsTotal; // 总条数
                pagination.current = params.page; // 当前页数

                this.setState({
                    pointList: res.data,
                    pagination
                });

            } else {
                message.error(res.msg)
            }
        })
    }
    // 分页、排序、筛选变化时触发
	changeTable = (pagination) => {
		let params = this.state.params;
		params.page = pagination.current;
		params.rows = pagination.pageSize;
		this.getPointList(params);
    }
    // 网点编辑
    editPoint = (record) => {
        browserHistory.push('/wechat/handle/' + record.code)
    }
    // 网点删除
    deletePoint= (record) => {
        let params = { code: record.code };
        let pagerows = this.state.params;
        let pointList = this.state.pointList;
        let that = this;
        confirm({
            title: '确认删除',
            content: '删除该支行信息，用户将看不到该支行地址，确认删除？',
            onOk() {
                Config.delete('/v1/sys/wx/bankout/' + record.code , params,(res)=>{
                    if(res.code == Config.errorCode.success) {
                        message.success('删除成功');
                        // 点击操作后 重新请求后台数据 渲染页面
                        if(pointList.length == 1){
                            pagerows.page =1;
                            that.getPointList(pagerows);
                        }else{
                            that.getPointList(pagerows);
                        }
                    } else {
                        message.error(res.msg);
                    }
                })
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }
    render(){
        const columns = [{
			title: '网点名称',
			dataIndex: 'bltName',
			key: 'bltName'
		}, {
			title: '网点地址',
			dataIndex: 'bltAddress',
			key: 'bltAddress'
		}, {
			title: '联系方式',
			dataIndex: 'telephone',
			key: 'telephone'
		}, {
			title: '操作',
			dataIndex: 'operate',
			key: 'operate',
			render: (text, record) => (
    			<span>
			    	<span style={{cursor: 'pointer'}} className='edit-point'  onClick={this.editPoint.bind(this,record)}>编辑</span>
                    <span className="ant-divider" />
                    <span style={{cursor: 'pointer'}} className='delete-point'  onClick={this.deletePoint.bind(this,record)}>删除</span>
				</span>
  			)
		}];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <Table
                    className='common-content-container pointlist-container'
                    pagination={this.state.pagination}
                    columns={columns}
                    dataSource={this.state.pointList}
                    rowKey={record => record.code}
                    onChange={this.changeTable}
                />
            </Spin>
        )
    }
}

const pureWechatPoint = pureRender(WechatPoint);

export default pureWechatPoint;
