import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
// import  ReportHeader  from '../../Component/Report/ReportHeader';
import { browserHistory } from 'react-router';
import ResetSearch from './../../Component/Common/ResetSearch';
import { Input , Row , Col, DatePicker , Tabs , Table , Spin } from 'antd';
import './style/report.less';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
// const Option = Select.Option;

/**
 * 报账管理
 * @Author: 钟观发
 * @Date:   2017-10-17
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-10-17
 */
class Report extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
            loading: false,
            defaultTab: ['dataSerCount'],
            pagination: {
				showSizeChanger: true, // 是否可以改变 pageSize
				showQuickJumper: true, // 是否可以快速跳转至某页
                pageSizeOptions: ['5', '10','15'], // 指定每页可以显示多少条
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`
			},
            params: {
                page: 1, 
                rows: 10
            },
		};
	}
	componentDidMount() {
        const that = this;
        // const curRole = Config.localItem('CUR_ROLE'); // 用户权限
        const { routeParams } = that.props;
        that.setState({
            defaultTab:  routeParams.tab  ?  routeParams.tab  : 'dataSerCount' 
        });
        if(routeParams.tab == 'dataSerCount') {
            // that.getDataTrend(); 
            that.setState({
                // showDatePicker: false,
                // showMultiple: false
            })
        } else if(routeParams.tab == 'enterpriseSerCount') {
            // this.getDataProduct()
            this.setState({
                // showDatePicker: true,
                // showMultiple: false
            })
        }
    }
    // goSearchData = (params) => { // 公共搜索数据方法
    //     const that = this;
    //     const { routeParams } = that.props;
    //     const { searchParams } = that.state;
    //     if (searchParams && searchParams.taskType) params.taskType = searchParams.taskType;
    //     if(routeParams.tab == 'marketing') {
    //         that.getDataTrend(params); // 营销数据
    //         that.getDataConvert(params); // 营销转化率
    //         that.getMarketProduct(params); // 数据概况 => 浏览量、进件量、进件率
    //     } else if(routeParams.tab == 'product') {
    //         that.getDataProduct(params);
    //     } else if(routeParams.tab == 'user') {
    //         that.getDataSex(params);
    //         that.getDataUse(params);
    //         that.getDataAge(params);
    //     } else if(routeParams.tab == 'task'){
    //         params = Config.serializeObjects(params);
    //         that.getDataTaskPie(params);
    //         that.getDataTask(params);
    //     }
    //     that.setState({
    //         searchParams: params
    //     });
    // }
    changeTabs = (key) => { // 切换选项卡
        // Config.localItem('DEFAULT_TAB', key)
        this.setState({
            defaultTab: key
        })
        browserHistory.push('/report/' + key);
    }
    disabledStartDate = (startValue) => { // 禁用开始日期(搜索)
        const endValue = this.state.endValue;
        if (!startValue || !endValue) return false;
        return startValue.valueOf() > endValue.valueOf();
    }
    disabledEndDate = (endValue) => { // 禁用结束日期(搜索)
        const startValue = this.state.startValue;
        if (!endValue || !startValue) return false;
        return endValue.valueOf() <= startValue.valueOf();
    }
    onStartChange = (value, dateString) => { // 按开始时间查询
        let params = this.state.params;
        if(value) {
			params.startTime = dateString;
		} else {
			delete params.startTime;
        }
        params.page = 1; // 重置页数
        this.setState({
            params: params,
            dateKey: 0
		});
        this.getTasks(params); // 获取任务
        this.onChange('startValue', value);
    }
    onEndChange = (value, dateString) => { // 按结束时间查询
        let params = this.state.params;
        if(value) {
			params.endTime = dateString;
		} else {
			delete params.endTime;
        }
        params.page = 1; // 重置页数
        this.setState({
            params: params,
            dateKey: 0
		});
        this.getTasks(params); // 获取任务
        this.onChange('endValue', value);
    }
    // 获取列表
    // getReportList = (params) => {
    //     this.setState({ loading: true });
    //     Config.get('/v1/loan/collections', params, (res) => {
    //         this.setState({ loading: false });
    //         if(res.code == Config.errorCode.success) {
    //             let pagination = { ...this.state.pagination };
    //             pagination.total = res.recordsTotal; // 总页数
    //             pagination.current = params.page; // 当前页数
    //             this.setState({ 
    //                 collectionInfo: res.data,
    //                 pagination
    //             });
    //         } else {
    //             message.error(res.msg)
    //         }
    //     })
    // }
     // 页码改变 或者 页面表格条数改变
     changeTable = (pagination) => {
        let params = this.state.params;
        params.page = pagination.current;
        params.rows = pagination.pageSize;
        // this.getCollectionList(params);
        //切换无法重新获得数据
    }
	render() {
        // const { defaultTab } = this.state;
        const columns = [{
			title: '服务类型',
			// dataIndex: 'custName',
			key: 'custName',
			width: 200,
		}, {
			title: '服务商',
			// dataIndex: 'idCardNo',
            key: 'idCardNo',
            width: 150
		},  {
			title: '计费方式',
			// dataIndex: 'telephone',
			key: 'telephone',
			width: 120,
        }, {
			title: '启用时间',
			// dataIndex: 'startTime',
			key: 'startTime',
			width: 120,
        },
        {
			title: '停用时间',
			key: 'endTime',
			width: 120,
		}, {
          title: '操作',
        key: 'action',
        width: 100,
        //   render: (text, record) => (
        //     查看
        //   )
    }];
		return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="report-container">
                    {/* <ReportHeader /> */}
                    <div className='report-content'>
                    <Row className="report-search" type="flex" justify="space-between" align="top">
                            <Col span={24} style={{ width: 700 ,marginLeft:383}}>
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    format="YYYY-MM-DD"
                                    placeholder="开始时间"
                                    className="task-date-picker"
                                    onChange={this.onStartChange}

                                />
                                <span className="middle-line"></span>
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    format="YYYY-MM-DD"
                                    placeholder="结束时间"
                                    className="task-date-picker"
                                    onChange={this.onEndChange}
                                />
                            
                                <ResetSearch />
                                {/* <Select
                                    className="search-select select-manager"
                                    showSearch
                                    style={{ width: 120 ,height:36, marginLeft:23}}
                                    placeholder="选择企业"
                                    optionFilterProp="children"
                                    onChange={this.searchStatus}
                                    getPopupContainer={trigger => trigger.parentNode}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        ownerList.map((item, index)=>(
                                            <Option value={ item.userId + '' } key={index}>{ item.name }</Option>
                                        ))
                                    }
                                </Select> */}
                                
                                <Search className="task-search-input" placeholder="搜索" style={{ width: 180 ,height:36, marginLeft:90 }} onSearch={this.searchData} />
                            </Col> 
                        </Row>
                        <Tabs className='report-tabs'  onChange={this.changeTabs} >
                            <TabPane tab="数据服务统计" key="dataSerCount" className="TabPane">
                                <div>
                                <Table 
                                    rowKey={record => record.reportId} 
                                    pagination={this.state.pagination}
                                    columns={columns} 
                                    onChange={this.changeTable}
                                /> 
                                </div>
                            </TabPane>
                            <TabPane tab="企业服务统计" key="enterpriseSerCount" className="TabPane">
                                <div>
                                <Table 
                                    rowKey={record => record.collectionId} 
                                    pagination={this.state.pagination}
                                    columns={columns} 
                                    onChange={this.changeTable}
                                /> 
                                </div>
                            </TabPane>
                        </Tabs>
                        {/* <Row className="task-search" type="flex" justify="space-between" align="middle">
                            <Col span={12}>
                                <Menu className="task-search-menu" defaultSelectedKeys={defaultTab} mode="horizontal" onClick={this.triggerMenu}>
                                    <Menu.Item  key="all">数据服务统计</Menu.Item>
                                    <Menu.Item  key="market">企业服务统计</Menu.Item>
                                    <Menu.Item  key="invest">页面三</Menu.Item>
                                    <Menu.Item  key="collection">页面四</Menu.Item>
                                </Menu>
                                
                            </Col>
                        </Row> */}
                    </div>
                </div>
            </Spin>
		);
	}
}

export default Report;