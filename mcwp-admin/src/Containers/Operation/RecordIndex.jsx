import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import './style/record.less';
import { Table, Input, DatePicker, Spin } from 'antd';
import moment from 'moment';
import ResetSearch from './../../Component/Common/ResetSearch';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const Search = Input.Search;

/* 以类的方式创建一个组件 */
class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			dateKey: 0,
			opLogs: [],
			pagination: {
				showSizeChanger: true, // 是否可以改变 pageSize
				showQuickJumper: true, // 是否可以快速跳转至某页
				total: 0,
                showTotal: (total, range) => `共  ${total}  条`,
				pageSizeOptions: ['5', '10', '15'] // 指定每页可以显示多少条
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
	componentWillMount() {
		let params = this.state.params;
		this.getData(params); // 页面初始化获取数据  
	}

	disabledStartDate = (startValue) => {
	    const endValue = this.state.endValue;
	    if (!startValue || !endValue) {
	      return false;
	    }
	    return startValue.valueOf() > endValue.valueOf();
	}
	disabledEndDate = (endValue) => {
	    const startValue = this.state.startValue;
	    if (!endValue || !startValue) {
	      return false;
	    }
	    return endValue.valueOf() <= startValue.valueOf();
	}
	onStartTimeChange = (value) => {    // 按开始时间查询
		this.onChange('startValue', value);
		let params = this.state.params;
		if(value) {
			params.startTime = value.format('YYYY-MM-DD');
		} else {
			delete params.startTime;
		}
		params.page = 1;
		delete params.dateKey;  // 重置日期搜索
		this.setState({dateKey: 0});
		this.getData(params);
	}
	onEndTimeChange = (value) => {      // 按结束时间查询
		this.onChange('endValue', value);
		let params = this.state.params;
		if(value) {
			params.endTime = value.format('YYYY-MM-DD');
		} else {
			delete params.endTime;
		}
		params.page = 1;
		delete params.dateKey;  // 重置日期搜索
		this.setState({dateKey: 0});
		this.getData(params);
	}
	getData = (params={}) => { // 获取数据
		this.setState({ loading: true });
	
		Config.get('/v1/sys/userOpLogs', params, (res) => {
            if(res.code == Config.errorCode.success) {
            	const pagination = { ...this.state.pagination };
            	pagination.total = res.recordsTotal; // 总页数
            	pagination.current = params.page; // 当前页数
			    this.setState({
			        opLogs: res.data,
					loading: false,
			        pagination
			    });	
         	} else {
         		this.setState({ loading: false });
         	}
        });
	}
	searchDateKey = (dateKey) => { // 本周、本月、近三个月
		
		let params = this.state.params;
        params.startTime = moment().subtract(dateKey, 'days').format('YYYY-MM-DD');
        params.endTime = moment().format('YYYY-MM-DD');
        this.setState({
            dateKey: dateKey
        })
		params.page = 1;
		this.getData(params);
	}
	searchData = (value) => { // 查询数据
		let keyWord = value;
		let params = this.state.params;
		if(Config.isNull(keyWord)) {
			delete params.keyWord;
		} else {
			params.keyWord = keyWord;
		}
		this.setState({
			params: params
		});
		params.page = 1; // 查询数据
		this.getData(params);
	}
    changeTable = (pagination) => { // 分页、排序、筛选变化时触发
		let params = this.state.params;
		params.page = pagination.current;
		params.rows = pagination.pageSize;		
		this.getData(params);
	}
	onChange = (field, value) => {
	    this.setState({
	      [field]: value,
	    });
    }
	render() {
		const columns = [{
			title: '姓名',
			dataIndex: 'opeventName',
			key: 'opeventName'
		}, {
			title: '创建时间',
			dataIndex: 'opeventDate',
			key: 'opeventDate',
			render: (text, record) => (
    			<span>
     				{Config.formatDateTime(text)}
    			</span>
  			)
		}, {
			title: '操作描述',
			dataIndex: 'opeventAction',
			key: 'opeventAction'
		}];

		const data = this.state.opLogs;
		const dateFormat = 'YYYY-MM-DD';
		const { startValue, endValue } = this.state;
		return(
		<Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
			<div className="common-console-container operation-record">
                <div className="common-search-section">
                    <div className="date-search-container">
                        <div className='search-item' data-flex="dir:left">
							<DatePicker disabledDate={this.disabledStartDate} placeholder='开始时间' format={dateFormat} value={startValue} onChange={this.onStartTimeChange} getCalendarContainer={trigger => trigger.parentNode} />
                            <DatePicker disabledDate={this.disabledEndDate} placeholder='结束时间' format={dateFormat} value={endValue} onChange={this.onEndTimeChange} getCalendarContainer={trigger => trigger.parentNode} />
                        </div>
                        <Search className="search-item" placeholder="姓名" style={{ width: 200 }} onSearch={this.searchData} />
                        <div className="search-item">
                            <span className={`time-item ${this.state.dateKey == 6 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 6)}>近一周</span>
                            <span className={`time-item ${this.state.dateKey == 29 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 29)}>近一月</span>
                            <span className={`time-item ${this.state.dateKey == 89 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 89)}>近三个月</span>
                        </div>
                        <ResetSearch />
                    </div>
		        </div>
		        <Table 
		        	rowKey={record => record.opeventId} 
		        	pagination={this.state.pagination}
		        	columns={columns} 
		        	dataSource={data} 
                    onChange={this.changeTable}
                    className="common-content-container"
		        />
		    </div>
		</Spin>
		);
	}
}

export default Main;