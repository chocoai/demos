import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import { browserHistory, Link } from 'react-router';
import './style/template.less';
import TemplateService from '../../Services/TemplateService'
import { Table, Switch, Modal, message, Button, Menu } from 'antd';
const confirm = Modal.confirm;

/**
 * 消息模版
 * @Author: 赵俊
 * @Date:   2017-08-07
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-08-07
 */
class TemplateManagement extends Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultTab: [],
			templateList: [],
			menuList:[],
			pagination: {
				showSizeChanger: true, // 是否可以改变 pageSize
				showQuickJumper: true, // 是否可以快速跳转至某页
				total: 0,
				showTotal: (total, range) => `共  ${total}  条`,
				pageSizeOptions: ['5', '10', '15'] // 指定每页可以显示多少条
			},
			params: {
				page: 1,
				rows: 10,
			},
			currentRole: Config.localItem('CUR_ROLE')
		};
	}
	componentWillMount() {	
	}
	componentDidMount() {
		this.initialData()
	}
	async initialData(){
		const { params } = this.state
		const { routeParams,signClass } = this.props;
		if(signClass=='board'){
			let res=await TemplateService.getTab();
			params.useType=routeParams.type ? routeParams.type.split() : (res.data&&res.data.filter(item=>item.selected==true)[0].tabKey);
			params.templateType=0;
			this.setState({
				menuList:res.data,
				defaultTab: routeParams.type ? routeParams.type.split() : (res.data&&res.data.filter(item=>item.selected==true)[0].tabKey.split()||[]),
			})
		}else{
			params.templateType=2;
		}
		this.setState({
			params:params
		})
		this.getTemplateList(params);
	}
	switchRisk = (record) => { // 服务开启/关闭
		let that = this
		const { params: pageParams } = this.state
		if (!record.isenable) {
			let params = {
				id: record.id,
				isenable: true
			}
			confirm({
				title: '提示',
				content: '关闭后将不会发送短信通知，确认要关闭吗',
				okText: '确定',
				cancelText: '取消',
				onCancel() {
					that.getTemplateList(pageParams);
				},
				onOk() {
					that.closeSwitch(params)
				},
			});
		} else {
			let params = {
				id: record.id,
				isenable: false
			}
			that.closeSwitch(params)
		}
	}
	closeSwitch(params) {
		let that = this;
		const { params: pageParams } = this.state
		Config.put('/v1/message/template/edit', params, (res) => {
			if (res.code == Config.errorCode.success) {
				that.getTemplateList(pageParams);
			} else {
				message.error(res.msg);
			}
		});
	}
	changeTable = (pagination) => { // 分页、排序、筛选变化时触发
		let { params } = this.state;
		params.page = pagination.current;
		params.rows = pagination.pageSize;
		this.getTemplateList(params);
	}
	getTemplateList(params) {
		this.setState({ loading: true });
		Config.get('/v1/message/template', params, (res) => {
			if (res.code == Config.errorCode.success) {
				const { pagination } = this.state;
				pagination.total = res.recordsTotal; // 总页数
				pagination.current = params.page; // 当前页数
				this.setState({
					templateList: res.data,
					loading: false,
					pagination
				});
			} else {
				message.error(res.msg);
			}
		});
	}
	deleteTemplate = (id) => {
		let that = this;
		confirm({
			title: '提示',
			content: '删除后客户将不会收到这条短信通知，确认要删除吗？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				that.deleteSure({ id: id })
			},
		});
	}
	async deleteSure(delparams) {
		const { params } = this.state
		let res = await TemplateService.delSureTemplate(delparams);
		if (res.code == Config.errorCode.success) {
			message.success('删除成功！')
			this.getTemplateList(params);
		}
	}
	triggerType = (e) => {
		browserHistory.push('/template/board/' + e.key);
	}
	render() {
		const columns = [{
			title: '短信运用场景',
			dataIndex: 'applyScene',
			key: 'applyScene',
			width: 100,
		}, {
			title: '模板内容',
			dataIndex: 'content',
			key: 'content',
			width: 200,
		}, {
			title: '创建时间',
			dataIndex: 'createDate',
			key: 'createDate',
			render: (text, record) => (
				<span>
					{text ? Config.formatDateTime(text) : null}
				</span>
			)
		}, {
			title: '短信签名',
			dataIndex: 'signature',
			key: 'signature'
		}, {
			title: '短信类型',
			dataIndex: 'channel',
			key: 'channel',
			render: (text, record) => (
				<span className="reason-text">
					{text ? <span>{text}</span> : "——"}
				</span>
			)
		}, {
			title: '开关',
			dataIndex: 'isenable',
			key: 'isenable',
			render: (text, record) => {
				return <Switch disabled={record.applyScene == "发送验证码" ? true : false} onChange={this.switchRisk.bind(this, record)} checked={!record.isenable} />;
			}
		}, {
			title: '操作',
			dataIndex: 'id',
			key: 'action',
			render: (text, record) => (
				<div>
					<Link className="edit" to={'/template/add/tpl/' + text}>编辑</Link>
					<span className="delete" onClick={() => this.deleteTemplate(record.id)}>删除</span>
				</div>
			)
		}];
		const { currentRole, defaultTab, menuList} = this.state;
		const {signClass}=this.props;
		return (
			<div className="templateManage-container common-tab-content">
				<div className="search-top">
					<span className="search-tip">模板内容需经过审核，请耐心等待</span>
					{currentRole.indexOf('ROLE_SUPER_ADMIN') > -1 ? <div className='operate-add'>
						<Link to={`/template/add/tpl${defaultTab.length>0?'?useType='+defaultTab.join():''}`}><Button className="search-button" icon="plus" type="primary">新模板</Button></Link>
					</div> : null}
				</div>
				{signClass=='board'&&defaultTab.length>0?<Menu className="common-subtab-section" defaultSelectedKeys={defaultTab} mode="horizontal" onClick={this.triggerType}>
					{menuList.map((item,index)=><Menu.Item className="common-subtab-item" key={item.tabKey}>{item.tabName}</Menu.Item>)}
					
					{/* <Menu.Item className="common-subtab-item" key="car">车贷</Menu.Item>
					<Menu.Item className="common-subtab-item" key="business">经营贷</Menu.Item> */}
				</Menu>:null}
				<Table
					rowKey={record => record.id}
					columns={columns}
					dataSource={this.state.templateList}
					pagination={this.state.pagination}
					onChange={this.changeTable}
				/>
			</div>
		);
	}
}

const pureTemplateManagement = pureRender(TemplateManagement);

export default pureTemplateManagement;

