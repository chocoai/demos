import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import ResetSearch from './../../Component/Common/ResetSearch';
import './style/user.less';
import { Link } from 'react-router';
import { Table, Input, Button, Spin, Form, message, Modal} from 'antd';
const Search = Input.Search;

/* 以类的方式创建一个组件 */
class UserIndex extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
    		loading: false,
    		userInfo: [],
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
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    componentDidMount() {
		let params = this.state.params;
		this.getUserInfo(params);
	}
    saveLoading = (loading) => { // 设置页面和区块的加载中状态
		this.setState({
			loading: loading
		});
	}
    getUserInfo = (params={}) => {  // 加载用户列表信息
    	this.setState({ loading: true });
        Config.get('/v1/users', params, (res) => {
            this.saveLoading(false);
            if(res.code == Config.errorCode.success) {
            	const pagination = { ...this.state.pagination };
            	pagination.total = res.recordsTotal; // 总页数
            	pagination.current = params.page; // 当前页数
            	this.setState({
            		userInfo: res.data,
			        pagination
            	});
         	} else {
                message.error(res.msg);
         	}
        });
	}
    changeState = (id, name, available) => {  // 停用或启用
    	let cur = this;
    	const confirm = Modal.confirm;
    	let titleText = '';
    	if(available){
    		titleText = '停用';
    	}else{
    		titleText = '启用';
    	}
    	confirm({
		    title: titleText,
		    content: '确定' + titleText + '该用户吗?',
		    okText: '确定',
   			cancelText: '取消',
   			onOk() {
   				let data = cur.state;
   				// 请求参数
				let changeParams = {
					name: name,
					code: id
				};
		    	if(available){
		    		Config.put('/v1/user/stop', changeParams, (res) => {   // 停用
			            if(res.code == 0) {
			            	data.userInfo.map((result) => {
					    		if(result.code==id){
					    			result.available = 0;
					    		}
					    	});
			            	cur.setState({data:data});
			            } else {
			            	message.error(res.msg);
			            }
			        });
		    	} else {
		    		Config.put('/v1/user/startup', changeParams, (res) => {    // 启用
			            if(res.code == 0) {
			            	data.userInfo.map((result) => {
					    		if(result.code==id){
					    			result.available = 1;
                                }
                                return;
					    	});
			            	cur.setState({data:data});
			            } else {
			            	message.error(res.msg);
			            }
			        });
		    	}
   			}
   		});
    }
    delUser = (id, name) => {  // 删除用户
    	let cur = this;
    	const confirm = Modal.confirm;
    	confirm({
		    title: '删除用户',
		    content: '确定删除该用户吗?',
		    okText: '确定',
   			cancelText: '取消',
		    onOk() {
		        let userInfo = cur.state.userInfo;
		    	let newData = [];
		    	// 请求参数
				let delParams = {
					name: name,
					code: id
				};
		    	Config.delete('/v1/user', delParams, (res) => {
		            if(res.code == 0) {
		            	userInfo.map((result) => {
				    		if(result.code==id) return;
				    		newData.push(result);
				    	});
		            	cur.setState({userInfo:newData});
		            } else {
		            	message.error(res.msg);
		            }
		        });
		    }
		});
    }
	searchData = (value) => { // 搜索用户信息
		let keyWord = value;
		let params = this.state.params;
		if(Config.isNull(keyWord)) {
			delete params.keyWord;
		} else {
			params.keyWord = keyWord;
		}
		params.page = 1; // 查询数据重置页码
		this.setState({
			params: params
		});
		this.getUserInfo(params);
	}
	changeTable = (pagination) => { // 分页、排序、筛选变化时触发
		let params = this.state.params;
		params.page = pagination.current;
		params.rows = pagination.pageSize;
		this.getUserInfo(params);
	}
	render() {
        let curRoleLevel = parseInt(Config.localItem('CUR_ROLE_LEVEL'));  // 读取当前用户权限等级
     	const columns = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '性别',
			dataIndex: 'sex',
			key: 'sex'
		}, {
			title: '手机号',
			dataIndex: 'telephone',
			key: 'telephone'
		}, {
			title: '邮箱',
		  	dataIndex: 'email',
		  	key: 'email'
		}, {
		  	title: '角色',
		  	dataIndex: 'roleNickName',
		  	key: 'roleNickName'
		}, {
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
		  		(record.roleLevel>curRoleLevel) ?
			  		<span>
			    		<Link to={"/addnew?code=" + record.code}>编辑</Link>
			    		<span className="ant-divider" />
                        { record.status == 1 ? <span className="ant-dropdown-link" onClick={this.changeState.bind(this, record.code, record.name, record.available)} style={record.available == 1 ? {color:'gray', cursor: 'default'} : {color:'#108ee9', cursor: 'pointer'}}>{record.available == 1 ? '停用' : '启用' }</span> : null }
			    		{ record.status == 1 ? <span className="ant-divider" /> : null }
			    		<span style={{'color': '#f00', cursor: 'pointer'}} onClick={this.delUser.bind(this, record.code, record.name)}>删除</span>
			    	</span>
				    :
			     	<span>
						 {curRoleLevel==0?<Link to={"/addnew?code=" + record.code+'&roleLevel='+record.roleLevel}>编辑</Link>:<span className="cole5e5e5">编辑</span>}
			    		<span className="ant-divider"/>
			    		<span className="cole5e5e5">{record.available==1?'停用':'启用'}</span>
			    		<span className="ant-divider" />
			    		<span className="cole5e5e5">删除</span>
			    	</span>
		  	)
		}];

		let userInfo = this.state.userInfo;  // 用户信息数据
		return (
		<Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
			<div className="common-console-container user-container">
                <div className="common-search-section">
                    <div className="date-search-container">
                        <Search className="search-item" placeholder="姓名" style={{ width: 200 }} onSearch={this.searchData} />
                        <div className="search-item">
                            <ResetSearch />
                        </div>
                    </div>
                </div>
                <div className="common-action-section">
                    <Link to="/addnew"><Button className="common-btn" icon="plus" type="primary">新用户</Button></Link>
                </div>
		        <Table
		        	rowKey={record => record.code}
		        	pagination={this.state.pagination}
		        	columns={columns}
		        	dataSource={userInfo}
                    onChange={this.changeTable}
                    className="common-content-container"
		        />
		    </div>
		</Spin>
		);
	}
}

const Main = Form.create()(UserIndex);

export default Main;

