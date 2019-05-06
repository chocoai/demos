import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Spin, Table, DatePicker, Input, Select, Button, Menu, Tooltip } from 'antd';
import ResetSearch from './../../Component/Common/ResetSearch';
import shopImg from '../../Assets/Images/icon_shop.png';
import MarShareService from '../../Services/MarShareService'; // services层
import ProductService from '../../Services/ProductService'; // services层 产品管理
import { browserHistory, Link } from 'react-router';
import './style/marketShare.less';
const Search = Input.Search;
const Option = Select.Option;

class MarketNewShare extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,//加载状态
			startValue: null,          // 搜索开始时间
			endValue: null,             // 搜索结束时间
			shareInfo: null,
			select: null,
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
			downParams: {
				token: window.localStorage.getItem("USER_AUTHORIZATION"),
			},
			productList: [],//产品列表
			selectList: []
		};
	}
	componentWillMount() {
	}
	componentDidMount() {
		let that = this;
		let params = that.state.params;
		// 获取奖励条件
		this.getDictItems()
		// 获取产品列表
		that.getproCode({ prdStatus: 2 })
		// 获取积分奖励列表
		that.getRewardList(params);

	}
	async getDictItems() {
		const res = await MarShareService.getRewardType();
		this.setState({
			selectList: res.data || [],
		})
	}
	// 获取产品列表
	async getproCode(params) {
		const that = this;
		const res = await ProductService.getDropProd(params)
		that.setState({
			productList: res.data || []
		})
	}
	// 获取分享积分奖励列表信息
	async getRewardList(params) {
		this.setState({ loading: true });
		const res = await MarShareService.getRewardList(params);
		this.setState({ loading: false });
		let pagination = { ...this.state.pagination };
		pagination.total = res.recordsTotal; // 总页数
		pagination.current = params.page; // 当前页数
		this.setState({
			shareInfo: res.data,
			pagination
		});
	}
	// 下载
	download = (e) => {
		let downParams = this.state.downParams;
		let url = '';
		for (let c in downParams) {
			url += c + "=" + downParams[c] + '&';
		}
		e.target.href = Config.target + '/comm/rewardList/download/?' + url

	}
	// 根据时间筛选 重置页码
	onStartTimeChange = (value) => {
		this.onChange('startValue', value)
		let params = this.state.params;
		let downParams = this.state.downParams;
		if (value) {
			params.startTime = value.format('YYYY-MM-DD');
			downParams.startTime = value.format('YYYY-MM-DD');
		} else {
			delete params.startTime;
			delete downParams.startTime;
		}
		params.page = 1;
		this.setState({
			downParams: downParams
		});
		this.getRewardList(params);
	}
	onEndTimeChange = (value) => {
		this.onChange('endValue', value)
		let params = this.state.params;
		let downParams = this.state.downParams;
		if (value) {
			params.endTime = value.format('YYYY-MM-DD');
			downParams.endTime = value.format('YYYY-MM-DD');
		} else {
			delete params.endTime;
			delete downParams.endTime;
		}
		params.page = 1;
		this.setState({
			downParams: downParams
		});
		this.getRewardList(params);
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
	searchData = (value) => {
		let keyWord = value.trim();
		let { params } = this.state;
		let downParams = this.state.downParams;
		if (Config.isNull(keyWord)) {
			delete params.keyWord;
			delete downParams.keyWord;
		} else {
			params.keyWord = keyWord;
			downParams.keyWord = keyWord;
		}
		params.page = 1;
		this.setState({
			downParams: downParams
		});
		this.getRewardList(params);
	}
	// 页数变化时
	changeTable = (pagination) => {
		let params = this.state.params;
		params.page = pagination.current;
		params.rows = pagination.pageSize;
		this.getRewardList(params);
	}
	// 选项变化时
	handleChange = (value, type) => {
		let params = this.state.params;
		let downParams = this.state.downParams;
		if (type == 'rewardif') {
			if (value) {
				params.rewardTerm = value.key;
				downParams.rewardTerm = value.key;
			} else {
				delete params.rewardTerm;
				delete downParams.rewardTerm;
			}
		} else if (type == 'pro') {
			if (value) {
				params.proCode = value.key;
				downParams.proCode = value.key;
			} else {
				delete params.proCode;
				delete downParams.proCode;
			}
		}
		this.setState({
			params: params,
			downParams: downParams
		});
		this.getRewardList(params);
	}
	shareRule = () => {
		browserHistory.push('/market/sharerule');
	}
	render() {
		const that = this;
		const { productList, shareInfo, selectList } = that.state;
		const columnsInteRew = [{//积分奖励列表
			title: '姓名',
			dataIndex: 'sharedName',
			key: 'sharedName',
			render: (text, record) => (
				record.isMerchant == 1 ?
					<span>
						<img src={shopImg} alt='shop' style={{ marginRight: '5px' }} />{text ? text.length > 10 ? text.substring(0, 10) + '...' : text : '--'}
					</span> :
					<span>
						{text ? text.length > 10 ? text.substring(0, 11) : text : '--'}
					</span>
			)
		}, {
			title: '联系方式',
			dataIndex: 'sharedTelephone',
			key: 'sharedTelephone',
			render: (text) => (
				<span>
					{text ? text : '--'}
				</span>
			)
		}, {
			title: '奖励条件',
			dataIndex: 'rewardTermText',
			key: 'rewardTermText',
			render: (text) => (
				<span>
					{text ? text : '--'}
				</span>
			)
		}, {
			title: '产品名称',
			dataIndex: 'proName',
			key: 'proName',
			render: (text) => (
				<span style={text.length > 18 ? { cursor: "pointer" } : {}}>
					{text ? (text.length > 18 ? <Tooltip placement="top" title={text}>{text.slice(0, 18) + '...'}</Tooltip> : text) : '——'}
				</span>
			)
		}, {
			title: '奖励时间',
			dataIndex: 'rewardTime',
			key: 'rewardTime',
			render: (text, record) => (
				<span>
					{text ? Config.formatDateTime(text) : '--'}
				</span>
			)
		}, {
			title: '被推广人',
			dataIndex: 'linkName',
			key: 'linkName',
			render: (text) => (
				<span>
					{text ? text : '--'}
				</span>
			)
		}, {
			title: '联系方式',
			dataIndex: 'linkTelephone',
			key: 'linkTelephone',
			render: (text) => (
				<span>
					{text ? text : '--'}
				</span>
			)
		}, {
			title: '积分',
			dataIndex: 'rewardScore',
			key: 'rewardScore',
			render: (text) => (
				<span>
					{text || text == 0 ? text + '个' : '--'}
				</span>
			)
		},];
		return (
			<Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
				<div className="common-console-container marketShare-container" id="area">
					<div className="common-tab-container">
						<div className="common-tab-content">
							<div className="common-search-section">
								<div className="date-search-container">
									<div className='search-item' data-flex="dir:left">
										<DatePicker
											ref='startTime'
											placeholder="开始时间"
											style={{ width: 150 }}
											onChange={this.onStartTimeChange}
											format='YYYY-MM-DD'
											disabledDate={this.disabledStartDate}
											getCalendarContainer={trigger => trigger.parentNode}
										/>
										<DatePicker
											placeholder="结束时间"
											style={{ width: 150 }}
											onChange={this.onEndTimeChange}
											format='YYYY-MM-DD'
											disabledDate={this.disabledEndDate}
											getCalendarContainer={trigger => trigger.parentNode}
										/>
									</div>
									<div className='search-item' data-flex="dir:left">
										<Select
											labelInValue
											style={{ width: 150, height: 36 }}
											placeholder="奖励条件"
											optionFilterProp="children"
											onChange={(value) => this.handleChange(value, 'rewardif')}
											filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
											getPopupContainer={trigger => trigger.parentNode}
										>
											{selectList.map((item, index) =>
												<Option key={index} value={item.ddValue}>{item.ddText}</Option>
											)}
										</Select>
									</div>
									<div className='search-item' data-flex="dir:left">
										<Select
											labelInValue
											style={{ width: 150, height: 36 }}
											placeholder="产品名称"
											optionFilterProp="children"
											onChange={(value) => this.handleChange(value, 'pro')}
											filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
											getPopupContainer={trigger => trigger.parentNode}
										>
											{
												productList && productList.map((item, index) =>
													<Option value={item.code} key={index}>{item.prdName}</Option>
												)
											}
										</Select>
									</div>
									<Search placeholder="姓名/联系方式" onSearch={this.searchData} className='search-item' ref='searchData' style={{ width: 180 }} />
									<ResetSearch />

								</div>
							</div>

							<div className="common-search-section integral-search-section">
								<Button type="primary" onClick={this.shareRule} style={{ height: '36px', marginRight: '16px' }} > 设置分享规则 </Button>
								<Button className="common-btn" type="primary"><Link onClick={(e) => this.download(e)}>下载列表</Link> </Button>
							</div>
							<div className='common-content-container marketShare-content'>
								<Table
									rowKey={record => record.code}
									pagination={this.state.pagination}
									columns={columnsInteRew}
									onChange={this.changeTable}
									dataSource={shareInfo}
								/>
							</div>
						</div>
					</div>
				</div>
			</Spin>
		);
	}
}

export default MarketNewShare;
