import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import moment from 'moment';
import { Config } from '../../Config/Index';
import './style/collection.less';
import { browserHistory, Link } from 'react-router';
import ResetSearch from './../../Component/Common/ResetSearch';

import { Menu, Table, Input, Spin, message , DatePicker} from 'antd';
const Search = Input.Search;

/**
 * 催收管理
 */
class collectionIndex extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
            collection:[],
            visible: false,
            confirmVisible: false,
			loading: false,
            collectionInfo: [],
            collectionNum: {},
            dateKey: 0 ,
            defaultTab: ['all'],
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
            startValue: null,          // 搜索开始时间
            endValue: null,             // 搜索结束时间
            startContract:null,         // 合同开始日期
            endContract:null            // 合同结束日期
		};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    componentWillMount() { 
        let that = this;
        let params = that.state.params;
        const { routeParams} = that.props;
		that.setState({
            defaultTab: routeParams.tab ? routeParams.tab.split() : ['all'],
        });
        let collectionStatus = 0;   // 催收状态 待催收1，催收中2，已催收3
        switch (routeParams.tab) {
            case  'completeCount' :
            collectionStatus = 3;
            break;
            case  'processCount' :
            collectionStatus = 2;
            break;
            case  'unCompleteCount' :
            collectionStatus = 1;
            break; 
            default:
            break;
        } 
        if(collectionStatus > 0) {
            params.collectionStatus = collectionStatus;
           
        } else {
            delete params.collectionStatus;
        }
        that.getCollectionList(params);  // 获取借款列表
        let params1 = {
            page: 1,
            rows: 10				
        };
        that.getcollectionNum(params1);   // 获取借款状态的数量  
    }
    // 获取催收列表
    getCollectionList = (params) => {
        this.setState({ loading: true });
        Config.get('/v1/loan/collections', params, (res) => {
            this.setState({ loading: false });
            if(res.code == Config.errorCode.success) {
                let pagination = { ...this.state.pagination };
                pagination.total = res.recordsTotal; // 总页数
                pagination.current = params.page; // 当前页数
                this.setState({ 
                    collectionInfo: res.data,
                    pagination
                });
            } else {
                message.error(res.msg)
            }
        })
    }
    // 获取催收状态的数量
     getcollectionNum = (params) => { 
        let getParams = params ? params : {};
        Config.get('/v1/loan/collection/count', getParams, (res) => {
            if(res.code == Config.errorCode.success) {   
                this.setState({ 
                    collectionNum: res.data,
                });
            } else {
                message.error(res.msg);
            }
        
        });  
     }
    // 切换menu查看不同阶段状态菜单
    triggerLoanType = (e) => {
        Config.localItem('DEFAULT_TAB', e.key)
        browserHistory.push('/collection/' + e.key);
    }
    // 本周 本月 近三个月
    searchDateKey = (dateKey) => {
        let params = this.state.params;
        params.startTime = moment().subtract(dateKey, 'days').format('YYYY-MM-DD');
        params.endTime = moment().format('YYYY-MM-DD');
        this.setState({
            dateKey: dateKey
        })
        params.page = 1;
        this.getCollectionList(params);
        this.getcollectionNum(params);
     }

    // 根据时间来搜索催收 重置页码
    onStartTimeChange = (value) => {
        this.onChange('startValue',value)
      
        let params = this.state.params;
        if(value) {
            params.startTime = value.format('YYYY-MM-DD');
        } else {
            delete params.startTime;
        }
        params.page = 1;
        this.getCollectionList(params);
        this.getcollectionNum(params);
    }
    onEndTimeChange = (value) => {
        this.onChange('endValue',value)
        let params = this.state.params;
        if(value) {
            params.endTime = value.format('YYYY-MM-DD');
        } else {
            delete params.endTime;
        }
        params.page = 1;
        this.getCollectionList(params);
        this.getcollectionNum(params);
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

    // 根据客户姓名搜索借款(模糊搜索) 重置页码
    searchData = (value) => {
        let keyWord = value;
        let params = this.state.params;
        if(Config.isNull(keyWord)){
            delete params.keyWord;
        } else {
            params.keyWord = keyWord;
        }
        params.page = 1;
        this.getCollectionList(params);
        this.getcollectionNum(params);
    }
    // 页码改变 或者 页面表格条数改变
    changeTable = (pagination) => {
        let params = this.state.params;
        params.page = pagination.current;
        params.rows = pagination.pageSize;
        this.getCollectionList(params);
        //切换无法重新获得数据
    }
	render() {	
        // 获取催收各个状态的数量
        let collectionNum = this.state.collectionNum;
        let allCount = (collectionNum && collectionNum.allCount) || 0;  
        let unCompleteCount = (collectionNum && collectionNum.unCompleteCount) || 0;  
        let processCount = (collectionNum && collectionNum.processCount) || 0; 
        let completeCount = (collectionNum && collectionNum.completeCount) || 0; 
        const that = this;
        const { defaultTab } = that.state;
        const columns = [{
			title: '姓名',
			dataIndex: 'custName',
			key: 'custName',
			width: 100,
		}, {
			title: '身份证号',
			dataIndex: 'idCardNo',
            key: 'idCardNo',
            width: 150
		},  {
			title: '联系方式',
			dataIndex: 'telephone',
			key: 'telephone',
			width: 120,
		}, {
            title: '催收发起时间',
            dataIndex: 'createDate',
          key: 'createDate',
          width: 150,
          render: (text, record) => (
              <span>
                   {Config.formatDateTime(text)}
              </span>
            )
      },{
        title: '催收状态',
        dataIndex: 'collectionStatusName',
        key: 'collectionStatus',
        width: 100,
    }, {
          title: '操作',
        key: 'action',
        width: 100,
          render: (text, record) => (		    	
            <Link to={"/collection/detail/"+ record.code} activeClassName="active" >
            查看
            </Link>
          )
    }];
	return (
		<Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
			<div className="common-console-container collection-container">
                <div className="common-search-section">
                    <div className="date-search-container">
                        <div className='search-item' data-flex="dir:left">
                            <DatePicker 
                                ref='startTime'
                                placeholder="开始时间"  
                                onChange={this.onStartTimeChange}
                                format='YYYY-MM-DD'
                                disabledDate={this.disabledStartDate}
                                getCalendarContainer={trigger => trigger.parentNode}
                            />                             	
                            <DatePicker  
                                placeholder="结束时间" 
                                onChange={this.onEndTimeChange}
                                format='YYYY-MM-DD'
                                disabledDate={this.disabledEndDate}
                                getCalendarContainer={trigger => trigger.parentNode}
                            />  
                        </div>
                        <Search placeholder="客户姓名" onSearch={this.searchData} className='search-item' ref='searchData' style={{ width: 200 }} />  
                        <div className="search-item" data-flex="dir:left">
                            <span className={`time-item ${this.state.dateKey == 6 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 6)}>近一周</span>
                            <span className={`time-item ${this.state.dateKey == 29 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 29)}>近一月</span>
                            <span className={`time-item ${this.state.dateKey == 89 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 89)}>近三个月</span>
                        </div>
                        <ResetSearch />
                    </div>
		        </div>
                <Menu className="common-subtab-section" defaultSelectedKeys={defaultTab} mode="horizontal" onClick={this.triggerLoanType}>
                    <Menu.Item className="common-subtab-item" key="all">所有催收( {allCount} )</Menu.Item>                          
                    <Menu.Item className="common-subtab-item" key="unCompleteCount">待催收( {unCompleteCount} )</Menu.Item>   
                    <Menu.Item className="common-subtab-item" key="processCount">催收中( {processCount} )</Menu.Item>
                    <Menu.Item className="common-subtab-item" key="completeCount">已催收( {completeCount} )</Menu.Item>
                </Menu>
                <Table 
                    rowKey={record => record.collectionId} 
		        	pagination={this.state.pagination}
                    columns={columns} 
                    className="common-content-container" 
		        	dataSource={this.state.collectionInfo} 
                    onChange={this.changeTable}
		        />            
		    </div>
		</Spin>
		);
	}
}

export default collectionIndex;

