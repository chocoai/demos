import React, { Component } from 'react';
import { Config } from '../../Config/Index'
import ResetSearch from './../../Component/Common/ResetSearch';
import { Table, Spin, Menu, Radio, DatePicker, Select, Button, Input, TreeSelect, Cascader } from 'antd';
import { browserHistory, Link } from 'react-router';
import ReportsService from '../../Services/ReportsSservice'; // services层 客户数据统计
import './style/Reports.less'

class marketReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultTab: ['citizen'],
            choseTab: 'citizen',
            choseTabTwo: 'customer',
            filterTab: 'month',
            loading: false,
            startValue: null,          // 搜索开始时间
            endValue: null,            // 搜索结束时间
            dictCode: "dkzt",   // 要获取的字典值
            yearList: [],
            quarterList: [],
            pagination: {
				showSizeChanger: true, // 是否可以改变 pageSize
				showQuickJumper: true, // 是否可以快速跳转至某页
				total: 0,//总页数
                showTotal: (total, range) => `共  ${total}  条`,
				pageSizeOptions: ['5', '10','15'] // 指定每页可以显示多少条
            },
            params: {
                page: 1,
                rows: 10
            },
            downParams: {
                // userCode: window.localStorage.getItem("LOGIN_USER_CODE"),
                page: 1,
                rows: 10
			},
            customerList: []
        }
    }
    componentWillMount(){
		let that = this;
		const { routeParams} = that.props;
		that.setState({
			choseTabTwo : routeParams.tab ? routeParams.tab : 'customer'
		});
	}
    componentDidMount() {
        const {params} = this.state
        this.yearList();
        this.getTeamDown();
        this.getPointDown();//支行网点
        this.getTaskPerson();
        this.getDictItem();
        this.postReportsCustomer(params);
    }
    //循环年份
    yearList () {
        let newdate = new Date();
        let newYear = parseInt(newdate.getFullYear());
        let yearList = this.state.yearList;
        let quarterList = this.state.quarterList;
        for(let y = 2017; y <= newYear; y++){
            quarterList.push({
                value: `${y}`,
                label: `${y}年`,
                children: [{
                    value: '01',
                    label: '第一季度'},
                    {value: '04',
                    label: '第二季度'},
                    {value: '07',
                    label: '第三季度'},
                    {value: '10',
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
        if(e.key == 'customer') {
            browserHistory.push('/reports/loan/customer')
        }
    }
    //切换时间筛选
    changeFilterTabs = (e) => {
        let filterTab = this.state.filterTab;
        if(e.target.value == 'month') {
            filterTab = e.target.value;
        }else if(e.target.value == 'quarter') {
            filterTab = e.target.value
        }else if(e.target.value == 'year') {
            filterTab = e.target.value
        }
        this.setState({
            filterTab: filterTab
        })
    }
    // 根据时间筛选 重置页码
    onStartTimeChange = (value) => {
		this.onChange('startValue', value)
		let params = this.state.params;
		let downParams = this.state.downParams;
		let choseTabTwo = this.state.choseTabTwo;
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
        if (choseTabTwo == 'customer') { // 开始时间客户数据
			this.postReportsCustomer(params);
		}
	}
	onEndTimeChange = (value) => {
		this.onChange('endValue', value)
		let params = this.state.params;
		let downParams = this.state.downParams;
		let choseTabTwo = this.state.choseTabTwo;
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
		if (choseTabTwo == 'customer') { // 客户数据统计
			this.postReportsCustomer(params);
		}
    }
    //按季度查询
    quarterStart = (value) => {
        let params = this.state.params;
        let downParams = this.state.downParams;
        let choseTabTwo = this.state.choseTabTwo;
        if(value) {
            params.startTime = value.join('-');
            downParams.startTime = value.join('-');
        } else {
            delete params.startTime;
            delete downParams.startTime;
        }
        params.page = 1;
		this.setState({
			downParams: downParams
		});
		if (choseTabTwo == 'customer') { // 客户数据统计
            this.postReportsCustomer(params);
		}
    }
    //季度结束时间
    quarterEnd = (value) => {
        let params = this.state.params;
        let downParams = this.state.downParams;
        let choseTabTwo = this.state.choseTabTwo;
        if (value) {
            params.endTime = value.join('-');
            downParams = value.join('-');
        }else{
            delete params.endTime;
            delete downParams.endTime;
        }
        params.page = 1;
        this.setState({
			downParams: downParams
		});
		if (choseTabTwo == 'customer') { // 客户数据统计
            this.postReportsCustomer(params);
		}
    }
    //姓名/联系方式搜索
    searchData = (value) => {
		let keyword = value.trim();
		let {params,choseTabTwo}= this.state;
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
			this.postReportsCustomer(params);
		}
    }
    //审批下拉
    getDictItem = () => {
        const that = this
        const { dictCode: code } = this.state
        Config.get('/comm/sys/dict/items', { code }, (res) => {
            if (res.code == Config.errorCode.success) {
                // todo 以后数据量过大优化，对yxqdlb做处理
                that.setState({
                    dkzt: res.data.dkzt,
                })
            }
        });
    }
     // 审批查询
     auditStatusChange = (value) => {
        let downParams = this.state.downParams;
        let params = this.state.params;
        if (value) {
            params.auditStatus = value
            downParams.auditStatus = value
        } else {
            delete params.auditStatus;
            delete downParams.auditStatus;
        }
        params.page = 1
        this.setState({
			downParams: downParams
		});
        this.postReportsCustomer(params);
    }
     //下拉查询
     changeSelect(value, dateString, key) { // 下拉框改变
        const that = this;
        let { params, downParams } = that.state;
        if (key === 'personTask') { // 归属客户经理
            if(value) {
                params.cmCode = value;
                downParams.cmCode = value;
            } else {
                delete params.cmCode;
                delete downParams.cmCode;
            }
            params.page = 1;
            this.setState({
                downParams: downParams
            });
            that.postReportsCustomer(params);
        }
        if (key === 'teamDown') { // 归属客户经理
            if(value) {
                params.teamCode = value;
                downParams.teamCode = value;
            } else {
                delete params.teamCode;
                delete downParams.teamCode;
            }
            params.page = 1;
            this.setState({
                downParams: downParams
            });
            that.postReportsCustomer(params);
        }
        if (key === 'pointDown') { // 支行网点
            if(value) {
                params.branchCode = value;
                downParams.branchCode = value;
            } else {
                delete params.branchCode;
                delete downParams.branchCode;
            }
            params.page = 1;
            this.setState({
                downParams: downParams
            });
            that.postReportsCustomer(params);
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
			url += c + "=" + urlParams[c] + '&';
        }
        url += `token=${Config.localItem('USER_AUTHORIZATION')}`
        if (choseTabTwo == 'customer') { // 客户数据
			e.target.href = Config.target + '/comm/loandatelist/download/?' + url
		}
		// if (choseTab == 'deduction') { //
		// 	e.target.href = Config.target + '/comm/consumerList/download/?' + url
		// }

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
    //获取客户数据列表
    async postReportsCustomer(params) {
        const that = this;
        const res = await ReportsService.postReportsCustomer(params)
        const pagination = { ...this.state.pagination };
        pagination.total = res.recordsTotal; // 总页数
        pagination.current = params.page; // 当前页数
        that.setState({
            customerList: res.data || [],
            pagination
        })
    }
    changeTable = (pagination) => { // 分页、排序、筛选变化时触发
        const {params} = this.state
		params.page = pagination.current;
		params.rows = pagination.pageSize;
        this.postReportsCustomer(params);
	}
    // 获取有权限的客户经理
    getTaskPerson() {
        Config.get('/v1/user/role/select', {hasNull: true}, (res) => {
            if (res.code == Config.errorCode.success) {
                let tmpArr = []
                res.data.map(i => {
                    i.label = i.name
                    i.value = i.code
                    i.key = i.name
                    tmpArr.push(i)
                })
                this.setState({
                    taskPerson: tmpArr
                });
            }
        });
    }
    // 获取小组下拉
    getTeamDown() {
        Config.get('/v1/team/team/list', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                let tmpArr = []
                res.data.map(i => {
                    i.label = i.teamName
                    i.value = i.code
                    i.key = i.code
                    tmpArr.push(i)
                })
                this.setState({
                    teamDown: tmpArr
                });
            }
        });
    }
    // 获取支行网点
    getPointDown() {
        Config.get('/comm/bw/v1/branch/list', {enterpriseCode: Config.localItem('ENTERP_CODE')}, (res) => {
            if (res.code == Config.errorCode.success) {
                let tmpArr = []
                res.data.map(i => {
                    i.label = i.bankName
                    i.value = i.code
                    i.key = i.code
                    tmpArr.push(i)
                })
                this.setState({
                    pointDown: tmpArr
                });
            }
        });
    }
    render() {
        const that = this;
        const { defaultTab, choseTabTwo, filterTab, dkzt, taskPerson, teamDown,pointDown, yearList,quarterList } = that.state;
        const columns = [];
        const customer = [{
            title: '客户姓名',
            width: 100,
			dataIndex: 'custName',
            key: 'custName',
            fixed: 'left',
            render: (text) => (
                text ?
                    <span> {text} </span>
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
			title: '产品名称',
			dataIndex: 'prodName',
            key: 'prodName',
            render: (text) => (
                text ?
                    <span> {text} </span>
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
		}, {
			title: '申请金额',
			dataIndex: 'loanAmoney',
            key: 'loanAmoney',
            render: (text) => (
                text ?
                    <span> {text}元 </span>
                    :
                    <span>--</span>
            )
		},{
			title: '综合授信建议金额',
			dataIndex: 'amount',
            key: 'amount',
            render: (text) => (
                text ?
                    <span> {text}元 </span>
                    :
                    <span>--</span>
            )
		}, {
			title: '审批金额',
			dataIndex: 'authMoney',
            key: 'authMoney',
            render: (text) => (
                text ?
                    <span> {text}元 </span>
                    :
                    <span>--</span>
            )
		},  {
			title: '放款金额',
			dataIndex: 'lendMoney',
            key: 'lendMoney',
            render: (text) => (
                text ?
                    <span> {text}元 </span>
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
			title: '综合授信时间',
			dataIndex: 'personAuditDate',
            key: 'personAuditDate',
            render: (text) => (
                text ?
                    <span> {Config.formatDateTime(text)} </span>
                    :
                    <span>--</span>
            )
		}, {
			title: '人工审批时间',
			dataIndex: 'auditDate',
            key: 'auditDate',
            render: (text) => (
                text ?
                    <span> {Config.formatDateTime(text)} </span>
                    :
                    <span>--</span>
            )
		}, {
			title: '放款时间',
			dataIndex: 'makeLoanDate',
            key: 'makeLoanDate',
            render: (text) => (
                text ?
                    <span> {Config.formatDateTime(text)} </span>
                    :
                    <span>--</span>
            )
		}, {
			title: '客户开发周期',
			dataIndex: 'periodDate',
            key: 'periodDate',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
		}, {
			title: '拒绝原因',
			dataIndex: 'rejectReasonOther',
            key: 'rejectReasonOther',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
		},{
			title: '身份证号',
			dataIndex: 'idCardNo',
            key: 'idCardNo',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
		},{
			title: '学历',
			dataIndex: 'educationText',
            key: 'educationText',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
		},{
			title: '婚姻状况',
			dataIndex: 'maritalStatusText',
            key: 'maritalStatusText',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
		},{
			title: '居住地址',
			dataIndex: 'homeAddr',
            key: 'homeAddr',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
		}];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="common-console-container marketShare-container" style={{padding:0}}>
					<div className="common-tab-container">
						<div className="share-tabs">
                            <Menu className="share-search-menu" mode="horizontal" defaultSelectedKeys={defaultTab} onSelect={this.changeTabs}>
                                <Menu.Item key="citizen">市民贷产品</Menu.Item>
                                {/* <Menu.Item key="house">房抵贷产品</Menu.Item> */}
                            </Menu>
                        </div>
                        <div className="common-tab-content">
                            {/* <div className="common-search-section" style={{marginBottom:'20px'}}>
                                <Radio.Group defaultValue="customer" buttonStyle="solid" onChange={this.changeTabsTwo}>
                                    <Radio.Button value="customer">渠道客户统计</Radio.Button>
                                </Radio.Group>
                            </div> */}
                            <Menu className="common-subtab-section" defaultSelectedKeys={['customer']} mode="horizontal" onClick={this.changeTabsTwo}>
                                <Menu.Item className="common-subtab-item" key="customer">客户数据统计</Menu.Item>
                            </Menu>
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
                                <div className="date-search-container" style={{margin:0}}>
                                    <div className='search-item' data-flex="dir:left">
                                        <Radio.Group defaultValue="month" style={{lineHeight:'34px'}} onChange={this.changeFilterTabs}>
                                            <Radio.Button style={{border:'none', boxShadow:'none'}} value="month">按月汇总</Radio.Button>
                                            <Radio.Button style={{border:'none', boxShadow:'-1px 0 0 #ccc'}} value="quarter">按季汇总</Radio.Button>
                                            <Radio.Button style={{border:'none', boxShadow:'-1px 0 0 #ccc'}} value="year">按年汇总</Radio.Button>
                                        </Radio.Group>
                                    </div>
                                </div>
                            </div> : null}
                            {choseTabTwo == 'channel' ? <div className="common-search-section">
                                {filterTab == 'month' ? <div className="date-search-container">
                                    <DatePicker.MonthPicker
                                        ref='startTime'
                                        placeholder="开始月份"
                                        style={{ width: 150 }}
                                        onChange={this.onStartTimeChange}
                                        format='YYYY-MM'
                                        disabledDate={this.disabledStartDate}
                                        getCalendarContainer={trigger => trigger.parentNode}
                                    />
                                    <DatePicker.MonthPicker
                                        placeholder="结束月份"
                                        style={{ width: 150 }}
                                        onChange={this.onEndTimeChange}
                                        format='YYYY-MM'
                                        disabledDate={this.disabledEndDate}
                                        getCalendarContainer={trigger => trigger.parentNode}
                                    />
                                </div> : null}
                                {filterTab == 'quarter' ? <div className="date-search-container">
                                    <Cascader style={{height:'26px',marginRight:'10px'}} onChange={this.quarterStart} options={quarterList} placeholder="开始季度" />
                                    <Cascader style={{height:'26px'}} options={quarterList} onChange={this.quarterEnd} placeholder="结束季度" />
                                </div> : null}
                                {filterTab == 'year' ? <div className="date-search-container">
                                    <Cascader style={{height:'26px',marginRight:'10px'}} onChange={this.quarterStart} options={yearList} placeholder="开始年份" />
                                    <Cascader style={{height:'26px'}} options={yearList} onChange={this.quarterEnd} placeholder="结束年份" />
                                </div> : null}
                            </div> : null}
                            <div className="common-search-section">
                                <Input.Search placeholder="姓名/联系方式" onSearch={this.searchData} className='search-item' ref='searchData' style={{ width: 150 }} />
                                <div className='search-item' data-flex="dir:left">
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
                                </div>
                                <div className='search-item' data-flex="dir:left">
                                    <TreeSelect
                                        showSearch
                                        style={{ width: 150 }}
                                        size={'large'}
                                        dropdownStyle={{ width: '150px', maxHeight: 400, overflow: 'auto' }}
                                        placeholder="归属客户经理"
                                        treeData={taskPerson}
                                        allowClear
                                        treeDefaultExpandAll
                                        treeNodeFilterProp={'label'}
                                        onChange={(value, options) => that.changeSelect(value, options, 'personTask')}
                                        getPopupContainer={trigger => trigger.parentNode}
                                        // className="common-search-treeSelect"
                                    />
                                </div>
                                <div className='search-item' data-flex="dir:left">
                                    <TreeSelect
                                        showSearch
                                        style={{ width: 150 }}
                                        size={'large'}
                                        dropdownStyle={{ width: '150px', maxHeight: 400, overflow: 'auto' }}
                                        placeholder="归属小组"
                                        treeData={teamDown}
                                        allowClear
                                        treeDefaultExpandAll
                                        treeNodeFilterProp={'label'}
                                        onChange={(value, options) => that.changeSelect(value, options, 'teamDown')}
                                        // className="common-search-treeSelect"
                                        getPopupContainer={trigger => trigger.parentNode}
                                    />
                                </div>
                                <div className='search-item' data-flex="dir:left">
                                    <TreeSelect
                                        showSearch
                                        style={{ width: 150 }}
                                        size={'large'}
                                        dropdownStyle={{ width: '150px', maxHeight: 400, overflow: 'auto' }}
                                        placeholder="支行网点"
                                        treeData={pointDown}
                                        allowClear
                                        treeDefaultExpandAll
                                        treeNodeFilterProp={'label'}
                                        onChange={(value, options) => that.changeSelect(value, options, 'pointDown')}
                                        // className="common-search-treeSelect"
                                        getPopupContainer={trigger => trigger.parentNode}
                                    />
                                </div>
                                {/* <Button type="primary" style={{ height: '32px', margin: '2px 16px 0 0', }} > 搜索 </Button> */}
                                <ResetSearch />
                            </div>
                            <div className="common-search-section integral-search-section">
								<Button className="common-btn" type="primary"><Link style={{color: '#fff'}} onClick={(e) => this.download(e)}>导出</Link></Button>
							</div>
                            <div className='common-content-container marketShare-content'>
								{choseTabTwo == 'customer' ? <Table
                                    pagination={this.state.pagination}
                                    columns={customer}
                                    scroll={{ x: 2000 }}
                                    dataSource={this.state.customerList}
                                    rowKey={ (record,index)=> index}
                                    onChange={this.changeTable}
                                    className="common-content-container"
                                /> : <Table
                                        pagination={this.state.pagination}
                                        columns={columns}
                                        dataSource={this.state.dataList}
                                        rowKey={ (record,index)=> index}
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
