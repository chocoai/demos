import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/activityDetail.less';
import { Link } from 'react-router';
import ActivityService from '../../Services/ActivityService';
import CommonService from '../../Services/CommonService';
import ResetSearch from './../../Component/Common/ResetSearch';

import { Input, Table, Breadcrumb, message, Modal, Select, Button } from 'antd';
const confirm = Modal.confirm;
const Search = Input.Search;
const Option = Select.Option;
/**
 * 活动详情
 * @Author: 钟观发
 * @Date:   2018-01-02
 * @Last Modified by:   钟观发
 * @Last Modified time: 2018-01-02
 */
class ActivityDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code: props.routeParams.code,
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
			},
			downParams: {
				code: props.routeParams.code,
				token: Config.localItem('USER_AUTHORIZATION')
			},
			cashStatusList: []
		};
	}
	componentDidMount() {
		let that = this
		const { params, code } = that.state;
		params.code = code;
		that.getDict({code:'djzt'})
		that.getActivityDetail(params)
	}
	async getDict(params){
		let res=await CommonService.getDict(params);
		if(res.code==Config.errorCode.success){
			let data=res.data.djzt.filter(item=>item.ddValue!=1)
			this.setState({
				cashStatusList:data
			})
		}
	}
	getActivityDetail = (params) => {
		let that = this;
		let pagination = that.state.pagination;
		ActivityService.getActivityDetail(params, (res) => {
			if (res.code == Config.errorCode.success) {
				const data = res.data;
				pagination.total = res.recordsTotal
				if (data) {
					that.setState({
						activityList: data,
						pagination: pagination
					});
				} else {
					that.setState({
						activityList: [],
					});
				}
			} else {
				message.error(res.msg);
			}
		})
	}
	cashPrize = (info) => {
		let that = this
		confirm({
			title: '确认兑奖',
			content: '是否兑奖？',
			onOk() {
				let params = {
					code: info.code
				}
				ActivityService.getCashPrize(params, (res) => {
					if (res.code == Config.errorCode.success) {
						message.success('兑奖成功');
						let activityParams = that.state.params;
						let code = that.state.code;
						activityParams.code = code
						that.getActivityDetail(activityParams)
					} else {
						message.error(res.msg);
					}
				})
			},
			onCancel() {
			},
		});
	}
	searchData = (value) => {
		let { params, downParams } = this.state;
		if (value) {
			params.name = value;
			downParams.name = value;
		} else {
			delete params.name;
			delete downParams.name;
		}
		params.page = 1; // 重置页码
		this.setState({
			params: params,
			downParams: downParams
		})
		this.getActivityDetail(params);
	}
	handleChange = (value) => {
		let { params, downParams } = this.state;
		if (value.key) {
			params.cashStatus = value.key;
			downParams.cashStatus = value.key;
		} else {
			delete params.cashStatus;
			delete downParams.cashStatus;
		}
		params.page = 1; // 重置页码
		this.setState({
			params: params,
			downParams: downParams
		})
		this.getActivityDetail(params);
	}
	changeTable = (page, pageSize) => {
		let that = this
		let params = that.state.params;
		params.page = page.current;
		params.rows = page.pageSize;
		this.getActivityDetail(params);
	}
	download = (e) => {
		let downParams = this.state.downParams;
		let url = '';
		for (let c in downParams) {
			url += c + "=" + downParams[c] + '&';
		}
		console.log(url)
		e.target.href = Config.target + '/comm/draw/winner/download/?' + url
	}
	render() {
		const { activityList, pagination,cashStatusList } = this.state
		const columns = [{
			title: '姓名',
			dataIndex: 'custName',
			key: 'custName ',
			width: 100,
			render: (text, record) => (
				<span className="reason-text">
					{text ? <span>{text}</span> : "-"}
				</span>
			)
		}, {
			title: '联系方式',
			dataIndex: 'telephone',
			key: 'telephone',
			width: 150,
			render: (text, record) => (
				<span className="reason-text">
					{text ? <span>{text}</span> : "-"}
				</span>
			)
		}, {
			title: '奖项名称',
			dataIndex: 'awardName',
			key: 'awardName',
			width: 100,
		}, {
			title: '奖项类型',
			dataIndex: 'prizeTypeText',
			key: 'prizeTypeText',
			width: 100,
		}, {
			title: '奖品',
			dataIndex: 'prizeName',
			key: 'prizeName',
			width: 200,
		}, {
			title: '中奖时间',
			dataIndex: 'winningDate',
			key: 'winningDate',
			width: 200,
			render: (text, record) => (
				<span>
					{Config.formatDateTime(text)}
				</span>
			)
		}, {
			title: '中奖进度',
			dataIndex: 'cashStatusText',
			key: 'cashStatusText',
			width: 150,
			render: (text, record) => (
				<span className="reason-text">
					{text ? <span>{text}</span> : "-"}
				</span>
			)
		}, {
			title: '操作',
			key: 'cashStatus',
			width: 200,
			render: (text, record) => (
				<span className="reason-text">
					{record.cashStatus == 2 && record.prizeType == 2 ? <span className="edit active-pointer" onClick={() => this.cashPrize(record)}>兑奖</span> : record.cashStatus == 3 && record.prizeType == 2 ? <span>兑换成功</span> : <span>-</span>}
				</span>
			)
		}];
		return (
			<div className="activityDetail-container">
				<Breadcrumb className='breadcrumb'>
					<Breadcrumb.Item className='breadcrumb-item'><Link to="/market/activity">活动管理</Link></Breadcrumb.Item>
					<Breadcrumb.Item className='breadcrumb-item'><Link to="/market/activity">抽奖活动</Link></Breadcrumb.Item>
					<Breadcrumb.Item className='breadcrumb-item'>抽奖活动后台</Breadcrumb.Item>
				</Breadcrumb>
				<div className="activityDetail-search-section">
					<div className="common-search-section">
						<div className='search-item' data-flex="dir:left">
							<Select
								labelInValue
								style={{ width: 180, height: 36 }}
								placeholder="兑奖状态"
								optionFilterProp="children"
								onChange={this.handleChange}
								filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								getPopupContainer={trigger => trigger.parentNode}
							>
								<Option key={1} value=''>全部</Option>
								{cashStatusList.length&&cashStatusList.map(item =>
									<Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
								)}
							</Select>
						</div>
						<div className="date-search-container">
							<Search className='search-item' style={{ width: '200px' }} placeholder="请输入姓名" onSearch={this.searchData} />
							<ResetSearch />
						</div>
					</div>
					<Button className="common-btn" type="primary"><Link onClick={(e) => this.download(e)}>下载列表</Link> </Button>
				</div>

				<div className="common-content-container activity-tabs">
					<Table
						rowKey={record => record.code}
						columns={columns}
						dataSource={activityList}
						pagination={pagination}
						onChange={this.changeTable}
					/>
				</div>
			</div >
		);
	}
}

const pureActivityDetail = pureRender(ActivityDetail);

export default pureActivityDetail;
