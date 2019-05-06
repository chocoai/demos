import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Spin, Table, DatePicker, Input, Select, Button, Menu, Tooltip } from 'antd';
import ResetSearch from './../../Component/Common/ResetSearch';
import shopImg from '../../Assets/Images/icon_shop.png';
import IntegralService from '../../Services/IntegralService'; // services层
import CommonService from '../../Services/CommonService'; // services层
import { browserHistory, Link } from 'react-router';
import './style/integral.less';
const Search = Input.Search;
const Option = Select.Option;

class IntegralIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultTab: ['reward'],//默认选择的tab
			choseTab: 'reward',//选择的tab
			loading: false,//加载状态
			startValue: null,          // 搜索开始时间
			endValue: null,             // 搜索结束时间
			shareInfo: null,
			shareInfoDedu: [],//积分扣除列表
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
			giftList: [],//礼品列表
			selectList: []
		};
	}
	componentWillMount() {
		let that = this;
		const { routeParams } = that.props;
		that.setState({
			defaultTab: routeParams.tab ? routeParams.tab.split() : ['reward'],
			choseTab: routeParams.tab ? routeParams.tab : 'reward'
		});
	}
	componentDidMount() {
		let that = this;
		const { routeParams } = that.props;
		let params = that.state.params;
		// 获取礼品列表奖励条件列表
		this.getDictItems({code:'czlx,jltj'})
		// 获取积分奖励列表
		if (routeParams.tab == 'deduction') {
			that.getRewardDeduct(params);

		} else {
			that.getRewardList(params);
		}

	}
	async getDictItems(params){
		const res = await CommonService.getDictItems(params);
		this.setState({
			giftList: res.data.czlx || [],
			selectList: res.data.jltj || []
		})
	}
	// 切换选项卡
	changeTabs = (e) => {
		if (e.key == 'reward') { // 积分奖励
			browserHistory.push('/integral/reward');
		}
		if (e.key == 'deduction') { // 积分扣除
			browserHistory.push('/integral/deduction');
		}
	}
	// 获取分享积分奖励列表信息
	async getRewardDeduct(params) {
		this.setState({ loading: true });
		const res = await IntegralService.getRewardDeduct(params);
		this.setState({ loading: false });
		let pagination = { ...this.state.pagination };
		pagination.total = res.recordsTotal; // 总页数
		pagination.current = params.page; // 当前页数
		this.setState({
			shareInfoDedu: res.data,
			pagination
		});
	}
	// 获取分享积分扣除列表信息
	async getRewardList(params) {
		this.setState({ loading: true });
		const res = await IntegralService.getRewardList(params);
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
		let choseTab = this.state.choseTab;
		let url = '';
		for (let c in downParams) {
			url += c + "=" + downParams[c] + '&';
		}
		if (choseTab == 'reward') { // 积分奖励
			e.target.href = Config.target + '/comm/scoreList/download/?' + url
		}
		if (choseTab == 'deduction') { // 积分扣除
			e.target.href = Config.target + '/comm/consumerList/download/?' + url
		}

	}
	// 根据时间筛选 重置页码
	onStartTimeChange = (value) => {
		this.onChange('startValue', value)
		let params = this.state.params;
		let downParams = this.state.downParams;
		let choseTab = this.state.choseTab;
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
		if (choseTab == 'reward') { // 积分奖励
			this.getRewardList(params);
		}
		if (choseTab == 'deduction') { // 积分扣除
			this.getRewardDeduct(params);
		}
	}
	onEndTimeChange = (value) => {
		this.onChange('endValue', value)
		let params = this.state.params;
		let downParams = this.state.downParams;
		let choseTab = this.state.choseTab;
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
		if (choseTab == 'reward') { // 积分奖励
			this.getRewardList(params);
		}
		if (choseTab == 'deduction') { // 积分扣除
			this.getRewardDeduct(params);
		}
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
		let { params, choseTab } = this.state;
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
		if (choseTab == 'reward') { // 积分奖励
			this.getRewardList(params);
		}
		if (choseTab == 'deduction') { // 积分扣除
			this.getRewardDeduct(params);
		}
	}
	// 页数变化时
	changeTable = (pagination) => {
		let params = this.state.params;
		let choseTab = this.state.choseTab;
		params.page = pagination.current;
		params.rows = pagination.pageSize;
		if (choseTab == 'reward') { // 积分奖励
			this.getRewardList(params);
		}
		if (choseTab == 'deduction') { // 积分扣除
			this.getRewardDeduct(params);
		}
	}
	// 选项变化时
	handleChange = (value, type) => {
		let params = this.state.params;
		let downParams = this.state.downParams;
		let choseTab = this.state.choseTab;
		if (choseTab == 'reward') { // 积分奖励
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

		if (choseTab == 'deduction') { // 积分扣除
			if (type == 'gift') {
				if (value) {
					params.giftType = value.key;
					downParams.giftType = value.key;
				} else {
					delete params.giftType;
					delete downParams.giftType;
				}
			}
			this.setState({
				params: params,
				downParams: downParams
			});
			this.getRewardDeduct(params);
		}
	}
	shareRule = () => {
		browserHistory.push('/integral/rule/set');
	}
	render() {
		const that = this;
		const { defaultTab, choseTab, giftList, shareInfo, shareInfoDedu, selectList } = that.state;
		const columnsInteDedu = [{//积分扣除列表
			title: '姓名',
			dataIndex: 'sharedName',
			key: 'sharedName',
			render: (text, record) => (
				record.isMerchant == 1 ?
					<span>
						<img src={shopImg} alt='shop' style={{marginRight:'5px'}}/>{text ? text : '--'}
					</span> :
					<span>
						{text ? text : '--'}
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
			title: '礼品名称',
			dataIndex: 'giftName',
			key: 'giftName',
			render: (text) => (
				<span>
					{text ? text : '--'}
				</span>
			)
		}, {
			title: '实付金额',
			dataIndex: 'payMoney',
			key: 'payMoney',
			render: (text) => (
				<span>
					{text || text == 0 ? text+'元' : '--'}
				</span>
			)
		}, {
			title: '兑换时间',
			dataIndex: 'consumerTime',
			key: 'consumerTime',
			render: (text, record) => (
				<span>
					{text ? Config.formatDateTime(text) : '--'}
				</span>
			)
		}, {
			title: '扣除积分',
			dataIndex: 'consumerScore',
			key: 'consumerScore',
			render: (text) => (
				<span>
					{text || text == 0 ? text+'个' : '--'}
				</span>
			)
		}, {
			title: '积分余额',
			dataIndex: 'surplusScore',
			key: 'surplusScore',
			render: (text) => (
				<span>
					{text || text == 0 ? text+'个': '--'}
				</span>
			)
		},];
		const columnsInteRew = [{//积分奖励列表
			title: '姓名',
			dataIndex: 'custName',
			key: 'custName',
			render: (text, record) => (
				record.isMerchant == 1 ?
					<span>
						<img src={shopImg} alt='shop' style={{marginRight:'5px'}}/>{text ? text.length>10?text.substring(0,10)+'...':text : '--'}
					</span> :
					<span>
						{text ? text.length>10?text.substring(0,11):text : '--'}
					</span>
			)
		}, {
			title: '联系方式',
			dataIndex: 'telephone',
			key: 'telephone',
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
			title: '奖励时间',
			dataIndex: 'rewardTime',
			key: 'rewardTime',
			render: (text, record) => (
				<span>
					{text ? Config.formatDateTime(text) : '--'}
				</span>
			)
		}, {
			title: '积分',
			dataIndex: 'rewardScore',
			key: 'rewardScore',
			render: (text) => (
				<span>
					{text || text == 0 ? text+'个' : '--'}
				</span>
			)
		},];
		return (
			<Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
				<div className="common-console-container integral-container" id="area">
					<div className="common-tab-container">
						<div className="share-tabs">
							<Menu className="share-search-menu" defaultSelectedKeys={defaultTab} mode="horizontal" onClick={this.changeTabs}>
								<Menu.Item key="reward">积分奖励</Menu.Item>
								<Menu.Item key="deduction">积分扣除</Menu.Item>
							</Menu>
						</div>
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
									{choseTab == 'reward' ? <div className='search-item' data-flex="dir:left">
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
									</div> : null}
									{choseTab == 'deduction' ? <div className='search-item' data-flex="dir:left">
										<Select
											labelInValue
											style={{ width: 150, height: 36 }}
											placeholder="礼品类型"
											optionFilterProp="children"
											onChange={(value) => this.handleChange(value, 'gift')}
											filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
											getPopupContainer={trigger => trigger.parentNode}
										>
											{
												giftList && giftList.map((item, index) =>
													<Option value={item.ddValue} key={index}>{item.ddText}</Option>
												)
											}

										</Select>
									</div> : null}
									<Search placeholder="姓名/联系方式" onSearch={this.searchData} className='search-item' ref='searchData' style={{ width: 180 }} />
									<ResetSearch />

								</div>
							</div>

							<div className="common-search-section integral-search-section">
								<Button type="primary" onClick={this.shareRule} style={{ height: '36px', marginRight: '16px' }} > 设置积分规则 </Button>
								<Button className="common-btn" type="primary"><Link onClick={(e) => this.download(e)}>下载列表</Link> </Button>
							</div>
							<div className='common-content-container integral-content'>
								{choseTab == 'reward' ? <Table
									rowKey={record => record.code}
									pagination={this.state.pagination}
									columns={columnsInteRew}
									onChange={this.changeTable}
									dataSource={shareInfo}
								/> : <Table
										rowKey={record => record.code}
										pagination={this.state.pagination}
										columns={columnsInteDedu}
										onChange={this.changeTable}
										dataSource={shareInfoDedu}
									/>}
							</div>
						</div>
					</div>
				</div>
			</Spin>
		);
	}
}

export default IntegralIndex;
