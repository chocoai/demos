import React, { Component } from 'react';
import { Config } from '../../Config/Index'
import ResetSearch from './../../Component/Common/ResetSearch';
import { Table, Spin, Menu, Radio, DatePicker, Select, Button, Input, TreeSelect, Cascader } from 'antd';
import { browserHistory, Link } from 'react-router';
import ReportsService from '../../Services/ReportsSservice'; // services层 客户数据统计
import MarChannelService from '../../Services/MarChannelService'; // services层 营销管理 —— 渠道管理
import './style/Reports.less'

class marketReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultTab: ['citizen'],
            choseTab: 'citizen',
            defaultValue: props.routeParams.tab ? [props.routeParams.tab] : ['channel'],
            choseTabTwo: props.routeParams.tab ? props.routeParams.tab : 'channel',
            filterTab: 'default',
            loading: false,
            startValue: null,          // 搜索开始时间
            endValue: null,            // 搜索结束时间
            dictCode: "yxqdlb,dkzt",   // 要获取的字典值
            yearList: [],
            quarterList: [],
            pagination: {
                showSizeChanger: true, // 是否可以改变 pageSize
                showQuickJumper: true, // 是否可以快速跳转至某页
                total: 0,//总页数
                showTotal: (total, range) => `共  ${total}  条`,
                pageSizeOptions: ['5', '10', '15'] // 指定每页可以显示多少条
            },
            params: {
                page: 1,
                rows: 10,
                timeType: 1
            },
            downParams: {
                // userCode: window.localStorage.getItem("LOGIN_USER_CODE"),
                page: 1,
                rows: 10,
                timeType: 1
            },
            customerList: [],
            channelList: []
        }
    }
    componentDidMount() {
        const { params, defaultValue } = this.state
        this.yearList();
        this.getDictItem();
        this.getChannelType();
        if (defaultValue[0] == 'channel') {
            this.postReportsChannel(params);
        } else {
            this.postReportsCustList(params);
        }
    }
    //循环年份
    yearList() {
        let newdate = new Date();
        let newYear = parseInt(newdate.getFullYear());
        let yearList = this.state.yearList;
        let quarterList = this.state.quarterList;
        for (let y = 2017; y <= newYear; y++) {
            quarterList.push({
                value: `${y}`,
                label: `${y}年`,
                children: [{
                    value: '1',
                    label: '第一季度'
                },
                {
                    value: '2',
                    label: '第二季度'
                },
                {
                    value: '3',
                    label: '第三季度'
                },
                {
                    value: '4',
                    label: '第四季度'
                }]
            })
            yearList.push({
                value: `${y}`,
                label: `${y}年`,
            })
        }
        this.setState({
            yearList: yearList,
            quarterList: quarterList
        })
    }
    //切换二级导航
    changeTabsTwo = (e) => {
        if (e.key == 'customer') {
            browserHistory.push('/reports/marketing/customer')
        }
        if (e.key == 'channel') {
            browserHistory.push('/reports/marketing/channel')
        }
    }
    //切换时间筛选
    changeFilterTabs = (e) => {
        let {params, downParams, filterTab, choseTabTwo} = this.state

        if (e.target.value == 'all') {
            filterTab = e.target.value;
            params.timeType =5;
            downParams.timeType = 5;
        } else if (e.target.value == 'month') {
            filterTab = e.target.value;
            params.timeType = 2;
            downParams.timeType = 2;
        } else if (e.target.value == 'quarter') {
            filterTab = e.target.value
            params.timeType = 3;
            downParams.timeType = 3;
        } else if (e.target.value == 'year') {
            filterTab = e.target.value
            params.timeType = 4;
            downParams.timeType = 4;
        }
        delete params.startTime;
        delete params.endTime;
        // delete params.timeType;
        delete downParams.startTime;
        delete downParams.endTime;
        // delete downParams.timeType;
        if (choseTabTwo == 'customer') {
            this.postReportsCustList(params);
        }
        if (choseTabTwo == 'channel') {
            this.postReportsChannel(params);
        }
        this.setState({
            filterTab,
            params,
            downParams
        })
    }
    // 审批查询
    auditStatusChange = (value) => {
        let params = this.state.params;
        let downParams = this.state.downParams;
        let choseTabTwo = this.state.choseTabTwo;
        if (value) {
            params.auditStatus = value;
            downParams.auditStatus = value;
        } else {
            delete params.auditStatus;
            delete downParams.auditStatus;
        }
        params.page = 1;
        this.setState({
            downParams: downParams
        });
        if (choseTabTwo == 'customer') {
            this.postReportsCustList(params);
        }
        if (choseTabTwo == 'channel') {
            this.postReportsChannel(params);
        }
    }
    //渠道类别查询
    channelCategory = (value) => {
        let params = this.state.params;
        let downParams = this.state.downParams;
        let choseTabTwo = this.state.choseTabTwo;
        if (value) {
            params.category = value;
            downParams.category = value;
        } else {
            delete params.category;
            delete downParams.category;
        }
        params.page = 1;
        this.setState({
            downParams: downParams
        });
        if (choseTabTwo == 'customer') {
            this.postReportsCustList(params);
        }
        if (choseTabTwo == 'channel') {
            this.postReportsChannel(params);
        }
    }
    //姓名/联系方式搜索
    searchData = (value) => {
        let keyword = value.trim();
        let { params, choseTabTwo } = this.state;
        let downParams = this.state.downParams;
        if (Config.isNull(keyword)) {
            delete params.keyword;
            delete downParams.keyword;
        } else {
            params.keyword = keyword;
            downParams.keyword = keyword;
        }
        params.page = 1;
        this.setState({
            downParams: downParams
        });
        if (choseTabTwo == 'customer') { // 客户数据
            this.postReportsCustList(params);
        }
        if (choseTabTwo == 'channel') { //渠道数据
            this.postReportsChannel(params);
        }
    }
    //审批下拉、渠道类别下拉
    getDictItem = () => {
        const that = this
        const { dictCode: code } = this.state
        Config.get('/comm/sys/dict/items', { code }, (res) => {
            if (res.code == Config.errorCode.success) {
                // todo 以后数据量过大优化，对yxqdlb做处理
                that.setState({
                    dkzt: res.data.dkzt,
                    yxqdlb: res.data.yxqdlb
                })
            }
        });
    }
    //查询
    changeSelect(value, dateString, key) { // 下拉框改变
        const that = this;
        let { params, choseTabTwo, downParams } = that.state;
        if (key === 'channel') { // 渠道筛选
            if (choseTabTwo == 'customer') { //客户数据
                if (value) {
                    params.channel = value;
                    downParams.channel = value;
                } else {
                    delete params.channel;
                    delete downParams.channel;
                }
                params.page = 1;
                this.setState({
                    downParams: downParams
                });
                that.postReportsCustList(params);
            } else if (choseTabTwo == 'channel') { //渠道数据
                if (value) {
                    params.channel = value;
                    downParams.channel = value;
                } else {
                    delete params.channel;
                    delete downParams.channel;
                }
                params.page = 1;
                this.setState({
                    downParams: downParams
                });
                that.postReportsChannel(params);
            }
        }
    }
    // 根据时间筛选 重置页码
    onStartTimeChange = (value, type) => {
        this.onChange('startValue', value)
        let params = this.state.params;
        let downParams = this.state.downParams;
        let choseTabTwo = this.state.choseTabTwo;
        if (choseTabTwo == 'customer') {
            if (value) {
                params.startTime = value.format('YYYY-MM-DD');
                downParams.startTime = value.format('YYYY-MM-DD');
            } else {
                delete params.startTime;
                delete downParams.startTime;
            }
        }
        if (choseTabTwo == 'channel' && type == 'channelDate') {
            if (value) {
                params.startTime = value.format('YYYY-MM-DD');
                params.timeType = 1;
                downParams.startTime = value.format('YYYY-MM-DD');
                downParams.timeType = 1;
            } else {
                delete params.startTime;
                // delete params.timeType;
                delete downParams.startTime;
                // delete downParams.timeType;
            }
        }
        if (choseTabTwo == 'channel' && type == 'channelMonth') {
            if (value) {
                params.startTime = value.format('YYYY-MM');
                params.timeType = 2;
                downParams.startTime = value.format('YYYY-MM');
                downParams.timeType = 2;
            } else {
                delete params.startTime;
                // delete params.timeType;
                delete downParams.startTime;
                // delete downParams.timeType;
            }
        }

        params.page = 1;
        this.setState({
            downParams: downParams
        });
        if (choseTabTwo == 'customer') { // 开始时间客户数据
            this.postReportsCustList(params);
        }
        if (choseTabTwo == 'channel') { // 开始时间渠道数据
            this.postReportsChannel(params);
        }
    }
    onEndTimeChange = (value, type) => {
        this.onChange('endValue', value)
        let params = this.state.params;
        let downParams = this.state.downParams;
        let choseTabTwo = this.state.choseTabTwo;
        if (choseTabTwo == 'customer') {
            if (value) {
                params.endTime = value.format('YYYY-MM-DD');
                downParams.endTime = value.format('YYYY-MM-DD');
            } else {
                delete params.endTime;
                delete downParams.endTime;
            }
        }
        if (choseTabTwo == 'channel' && type == 'channelDate') {
            if (value) {
                params.endTime = value.format('YYYY-MM-DD');
                params.timeType = 1;
                downParams.endTime = value.format('YYYY-MM-DD');
                downParams.timeType = 1;
            } else {
                delete params.endTime;
                // delete params.timeType;
                delete downParams.endTime;
                // delete downParams.timeType;
            }
        }
        if (choseTabTwo == 'channel' && type == 'channelMonth') {
            if (value) {
                params.endTime = value.format('YYYY-MM');
                params.timeType = 2;
                downParams.endTime = value.format('YYYY-MM');
                downParams.timeType = 2;
            } else {
                delete params.endTime;
                // delete params.timeType;
                delete downParams.endTime;
                // delete downParams.timeType;
            }
        }
        params.page = 1;
        this.setState({
            downParams: downParams
        });
        if (choseTabTwo == 'customer') { // 结束时间客户数据
            this.postReportsCustList(params);
        }
        if (choseTabTwo == 'channel') { // 结束时间渠道数据
            this.postReportsChannel(params);
        }
    }
    //季度开始时间
    quarterStart = (value) => {
        let params = this.state.params;
        let downParams = this.state.downParams;
        let choseTabTwo = this.state.choseTabTwo;
        let filterTab = this.state.filterTab;
        if (value) {
            params.startTime = value.join('-');
            params.timeType = filterTab == 'year' ? 4 : 3;
            downParams.startTime = value.join('-');
            downParams.timeType = filterTab == 'year' ? 4 : 3;;
        } else {
            delete params.startTime;
            // delete params.timeType;
            delete downParams.startTime;
            // delete downParams.timeType;
        }
        params.page = 1;
        this.setState({
            downParams: downParams
        });
        if (choseTabTwo == 'channel') { // 渠道数据
            this.postReportsChannel(params);
        }
    }
    //季度结束时间
    quarterEnd = (value) => {
        let params = this.state.params;
        let downParams = this.state.downParams;
        let choseTabTwo = this.state.choseTabTwo;
        let filterTab = this.state.filterTab;
        if (value) {
            params.endTime = value.join('-');
            params.timeType = filterTab == 'year' ? 4 : 3;
            downParams.endTime = value.join('-');
            downParams.timeType = filterTab == 'year' ? 4 : 3;
        } else {
            delete params.endTime;
            // delete params.timeType;
            delete downParams.endTime;
            // delete downParams.timeType;
        }
        params.page = 1;
        this.setState({
            downParams: downParams
        });
        if (choseTabTwo == 'channel') { // 渠道数据
            this.postReportsChannel(params);
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
    //获取渠道数据
    async postReportsChannel(params) {
        const res = await ReportsService.postReportsChannel(params)
        const pagination = { ...this.state.pagination };
        pagination.total = res.recordsTotal; // 总页数
        pagination.current = params.page; // 当前页数
        this.setState({
            channelList: res.data || [],
            pagination
        })
    }
    //获取客户数据列表
    async postReportsCustList(params) {
        const that = this;
        const res = await ReportsService.postReportsCustList(params)
        const pagination = { ...this.state.pagination };
        pagination.total = res.recordsTotal; // 总页数
        pagination.current = params.page; // 当前页数
        that.setState({
            customerList: res.data || [],
            pagination
        })
    }
    changeTable = (pagination) => { // 分页、排序、筛选变化时触发
        const { params, choseTabTwo } = this.state
        params.page = pagination.current;
        params.rows = pagination.pageSize;
        if (choseTabTwo == 'channel') {
            this.postReportsChannel(params);
        } else {
            this.postReportsCustList(params);
        }
    }
    // 下载
    download = (e) => {
        const {downParams, params, choseTabTwo} = this.state
        let url = '';
        let urlParams = Object(downParams, params)
        delete urlParams.page;
        delete urlParams.rows;
        for (let c in urlParams) {
            url += c + "=" + downParams[c] + '&';
        }
        url += `token=${Config.localItem('USER_AUTHORIZATION')}`
        if (choseTabTwo == 'customer') { // 客户数据
            e.target.href = Config.target + '/comm/channelcust/download/?' + url
        }
        if (choseTabTwo == 'channel') { //渠道数据
        	e.target.href = Config.target + '/comm/report/channel/download?' + url
        }
    }

    //渠道
    async getChannelType() {
        const that = this;
        const res = await MarChannelService.getChannelType();
        if (res.code == Config.errorCode.success) {
            // todo 以后数据量过大优化，对yxqdlb做处理
            let tmpArr = []
            res.data.sort((i1, i2) => i1.index - i2.index).map(i => {
                if (i.dictDTOS && i.dictDTOS.length) {
                    i.dictDTOS.map(i => {
                        i.label = i.ddText
                        i.value = i.ddValue
                        i.key = i.ddValue
                        tmpArr.push(i)
                    })
                }
            })
            tmpArr.push({
                label: '公共进件',
                value: '-1',
                key: '-1'
            },{
                label: '自主营销',
                value: '-2',
                key: '-2'
            })
            that.setState({
                channelTypeData: tmpArr,
                channelType: res.data
            })
        }
    }
    render() {
        const that = this;
        const { defaultTab, defaultValue, pagination, filterTab, choseTabTwo, channelTypeData, dkzt, yxqdlb, yearList, quarterList } = that.state;
        const channel = [{
            title: '统计时间',
            dataIndex: 'date',
            key: 'date',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '渠道',
            dataIndex: 'channelName',
            key: 'channelName',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
        },{
            title: '进件量',
            dataIndex: 'count',
            key: 'count',
            render: (text) => (
                text ?
                    <span> {text}笔 </span>
                    :
                    <span>--</span>
            )
        },  {
            title: '初审通过量',
            dataIndex: 'csNum',
            key: 'csNum',
            render: (text) => (
                text ?
                    <span> {text}笔 </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '综合授信审核通过量',
            dataIndex: 'zhNum',
            key: 'zhNum',
            render: (text) => (
                text ?
                    <span> {text}笔 </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '人工审批通过量',
            dataIndex: 'rgNum',
            key: 'rgNum',
            render: (text) => (
                text ?
                    <span> {text}笔 </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '总授信额度',
            dataIndex: 'authMoney',
            key: 'authMoney',
            render: (text) => (
                text ?
                    <span> {text}元 </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '总放款量',
            dataIndex: 'loanCount',
            key: 'loanCount',
            render: (text) => (
                text ?
                    <span> {text}笔 </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '总放款金额',
            dataIndex: 'loanMoney',
            key: 'loanMoney',
            render: (text) => (
                text ?
                    <span> {text}元 </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '平均开发周期',
            dataIndex: 'hour',
            key: 'hour',
            render: (text) => (
                text ?
                    <span> {text}小时 </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '平均贷款周期',
            dataIndex: 'periodAvg',
            key: 'periodAvg',
            render: (text) => (
                text ?
                    <span> {text}期</span>
                    :
                    <span>--</span>
            )
        }];
        const customer = [{
            title: '客户姓名',
            dataIndex: 'custName',
            key: 'custName',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '联系方式',
            dataIndex: 'telephone',
            key: 'telephone',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '渠道',
            dataIndex: 'channelName',
            key: 'channelName',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '申请时间',
            dataIndex: 'reqDate',
            key: 'reqDate',
            render: (text) => (
                text ?
                    <span> {Config.formatDateTime(text)} </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '归属客户经理',
            dataIndex: 'ownerName',
            key: 'ownerName',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '归属小组',
            dataIndex: 'teamName',
            key: 'teamName',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '人工授信额度',
            dataIndex: 'authMoney',
            key: 'authMoney',
            render: (text) => (
                text ?
                    <span> {text}元 </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '放款金额',
            dataIndex: 'borrowMoney',
            key: 'borrowMoney',
            render: (text) => (
                text ?
                    <span> {text}元 </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '贷款状态',
            dataIndex: 'realLoanStatus',
            key: 'realLoanStatus',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="common-console-container marketShare-container" style={{ padding: 0 }}>
                    <div className="common-tab-container">
                        <div className="share-tabs">
                            <Menu className="share-search-menu" mode="horizontal" defaultSelectedKeys={defaultTab} onSelect={this.changeTabs}>
                                <Menu.Item key="citizen">市民贷产品</Menu.Item>
                                {/* <Menu.Item key="house">房抵贷产品</Menu.Item> */}
                            </Menu>
                        </div>
                        <div className="common-tab-content">
                            {/* <div className="common-search-section" style={{ marginBottom: '20px' }}>
                                <Radio.Group defaultValue={defaultValue} buttonStyle="solid" onChange={this.changeTabsTwo}>
                                    <Radio.Button value="channel">渠道数据统计</Radio.Button>
                                    <Radio.Button value="customer">渠道客户统计</Radio.Button>
                                </Radio.Group>
                            </div> */}
                            <Menu className="common-subtab-section" defaultSelectedKeys={defaultValue} mode="horizontal" onClick={this.changeTabsTwo}>
                                <Menu.Item className="common-subtab-item" key="channel">渠道数据统计</Menu.Item>
                                <Menu.Item className="common-subtab-item" key="customer">渠道客户统计</Menu.Item>
                            </Menu>
                            <div className="date-search-container" style={{ margin: 0 }}>
                                {choseTabTwo == 'customer' ? <div className="common-search-section">
                                    <div className="date-search-container">
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
                                </div> : null}
                                {choseTabTwo == 'channel' ? <div className="common-search-section">
                                    <div className="date-search-container" style={{ margin: 0 }}>
                                        <div className='search-item' data-flex="dir:left">
                                            <Radio.Group defaultValue="" style={{ lineHeight: '34px' }} onChange={this.changeFilterTabs}>
                                                <Radio.Button style={{ border: 'none', boxShadow: 'none' }} value="all">全部</Radio.Button>
                                                <Radio.Button style={{ border: 'none', boxShadow: '-1px 0 0 #ccc' }} value="month">按月汇总</Radio.Button>
                                                <Radio.Button style={{ border: 'none', boxShadow: '-1px 0 0 #ccc' }} value="quarter">按季汇总</Radio.Button>
                                                <Radio.Button style={{ border: 'none', boxShadow: '-1px 0 0 #ccc' }} value="year">按年汇总</Radio.Button>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                </div> : null}
                                {choseTabTwo == 'channel' ? <div className="common-search-section">
                                    {
                                        filterTab == 'default' ?
                                            <div className="date-search-container">
                                                <DatePicker
                                                    ref='startTime'
                                                    placeholder="开始时间"
                                                    style={{ width: 150 }}
                                                    onChange={(value) => this.onStartTimeChange(value, 'channelDate')}
                                                    format='YYYY-MM-DD'
                                                    disabledDate={this.disabledStartDate}
                                                    getCalendarContainer={trigger => trigger.parentNode}
                                                />
                                                <DatePicker
                                                    placeholder="结束时间"
                                                    style={{ width: 150 }}
                                                    onChange={(value) => this.onEndTimeChange(value, 'channelDate')}
                                                    format='YYYY-MM-DD'
                                                    disabledDate={this.disabledEndDate}
                                                    getCalendarContainer={trigger => trigger.parentNode}
                                                />
                                            </div> : null
                                    }
                                    {filterTab == 'month' ? <div className="date-search-container">
                                        <DatePicker.MonthPicker
                                            ref='startTime'
                                            placeholder="开始月份"
                                            style={{ width: 150 }}
                                            onChange={(value) => this.onStartTimeChange(value, 'channelMonth')}
                                            format='YYYY-MM'
                                            disabledDate={this.disabledStartDate}
                                            getCalendarContainer={trigger => trigger.parentNode}
                                        />
                                        <DatePicker.MonthPicker
                                            placeholder="结束月份"
                                            style={{ width: 150 }}
                                            onChange={(value) => this.onEndTimeChange(value, 'channelMonth')}
                                            format='YYYY-MM'
                                            disabledDate={this.disabledEndDate}
                                            getCalendarContainer={trigger => trigger.parentNode}
                                        />
                                    </div> : null}
                                    {filterTab == 'quarter' ? <div className="date-search-container">
                                        <Cascader style={{ width: 150, height: 36 }} onChange={this.quarterStart} options={quarterList} placeholder="开始季度" />
                                        <Cascader style={{ width: 150, height: 36 }} options={quarterList} onChange={this.quarterEnd} placeholder="结束季度" />
                                    </div> : null}
                                    {filterTab == 'year' ? <div className="date-search-container">
                                        <Cascader style={{ width: 150, height: 36 }} onChange={this.quarterStart} options={yearList} placeholder="开始年份" />
                                        <Cascader style={{ width: 150, height: 36 }} options={yearList} onChange={this.quarterEnd} placeholder="结束年份" />
                                    </div> : null}
                                </div> : null}
                                <div className="common-search-section">
                                    {choseTabTwo == 'customer' ? <Input.Search placeholder="姓名/联系方式" onSearch={this.searchData} className='search-item' ref='searchData' style={{ width: 150 }} /> : null}
                                    {choseTabTwo == 'customer' ? <div className='search-item' data-flex="dir:left">
                                        <Select
                                            // className='search-item'
                                            style={{ width: 160, height: 36 }}
                                            placeholder="贷款状态"
                                            allowClear
                                            optionFilterProp="children"
                                            onChange={this.auditStatusChange}
                                            getPopupContainer={trigger => trigger.parentNode}
                                        >
                                            {
                                                dkzt && dkzt.map((item, index) => (
                                                    <Select.Option value={item.ddValue} key={index}>{item.ddText}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </div> : null}
                                    {choseTabTwo == 'channel' ? <div className='search-item' data-flex="dir:left">
                                        <Select
                                            // className='search-item'
                                            style={{ width: 160, height: 36 }}
                                            placeholder="渠道类别"
                                            allowClear
                                            optionFilterProp="children"
                                            onChange={this.channelCategory}
                                            getPopupContainer={trigger => trigger.parentNode}
                                        >
                                            {
                                                yxqdlb && yxqdlb.map((item, index) => (
                                                    <Select.Option value={item.ddValue + ''} key={index}>{item.ddText}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </div> : null}
                                    <div className='search-item' data-flex="dir:left">
                                        <TreeSelect
                                            showSearch
                                            style={{ width: 150 }}
                                            size={'large'}
                                            dropdownStyle={{ width: '150px', maxHeight: 400, overflow: 'auto' }}
                                            placeholder="渠道"
                                            treeData={channelTypeData}
                                            allowClear
                                            treeDefaultExpandAll
                                            treeNodeFilterProp={'label'}
                                            onChange={(value, options) => that.changeSelect(value, options, 'channel')}
                                            getPopupContainer={trigger => trigger.parentNode}
                                        // className="common-search-treeSelect"
                                        />
                                    </div>
                                    {/* <Button type="primary" style={{ height: '32px', margin: '2px 16px 0 0', }} > 搜索 </Button> */}
                                    <ResetSearch />
                                </div>
                            </div>
                            <div className="common-search-section integral-search-section">
                                <Button className="common-btn" type="primary"><Link style={{ color: '#fff' }} onClick={(e) => this.download(e)}>导出</Link></Button>
                            </div>
                            <div className='common-content-container marketShare-content'>
                                {choseTabTwo == 'customer' ? <Table
                                    pagination={pagination}
                                    columns={customer}
                                    dataSource={this.state.customerList}
                                    rowKey={(record, index) => index}
                                    onChange={this.changeTable}
                                    className="common-content-container"
                                /> : <Table
                                        pagination={pagination}
                                        columns={channel}
                                        dataSource={this.state.channelList}
                                        rowKey={(record, index) => index}
                                        onChange={this.changeTable}
                                        className="common-content-container"
                                    />}
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}
export default marketReport;
