import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import moment from 'moment';
import { browserHistory, Link } from 'react-router';
import CommonService from '../../Services/CommonService';
import ContractService from '../../Services/ContractService';
import ContractTEM from './../../Component/Contract/ContractTEM';
import ResetSearch from './../../Component/Common/ResetSearch';
import './style/contract.less';

import { message, Table, Spin, Input, DatePicker, Tabs, Select } from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

/**
 * 合同管理
 * @Author: 赵俊
 * @Date:   2017-08-08
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-08-08
 */
class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templateList: [],
            ContractTEMListOn: [],//线上合同列表
            ContractTEMListUnder: [],//线下合同列表
            allLoad: [],
            allCredit: [],
            dateKey: 0,
            defaultTab: 'yhmb',
            loading: false,
            startValue: null,          // 搜索开始时间
            endValue: null,            // 搜索结束时间
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
            selectList: [],
            online: false,//线上合同状态
            underline: false,//线下合同状态

        };
    }
    componentDidMount() {
        const that = this;
        const { routeParams } = that.props;
        that.setState({
            defaultTab: routeParams.tab ? routeParams.tab : 'yhmb',
        });
        that.getDict({code:'htlb'})
        if (routeParams.tab == 'user') {
            that.getTemplateList();
        }
        if (routeParams.tab == 'board') {
            that.getTplIsOpen()
        }
    }
    getTplIsOpen=async()=>{
        let that=this;
		let res=await ContractService.getTplIsOpen();
		if(res.code==Config.errorCode.success){
			this.setState({
				online:res.data[1],
				underline:res.data[2]
            })
            that.getContractTEMList({type:1},'online');
            if(res.data[2]){
                that.getContractTEMList({type:2},'underline');
            }else{
                this.setState({
                    ContractTEMListUnder:[]
                })
            }
		}
	}
    async getDict(params){
		let res=await CommonService.getDict(params);
		if(res.code==Config.errorCode.success){
			this.setState({
				selectList:res.data.htlb||[]
			})
		}
	}
    onStartTimeChange = (value) => {  // 按开始时间查询
        this.onChange('startValue', value);
        let params = this.state.params;
        if (value) {
            params.startTime = value.format('YYYY-MM-DD');
        } else {
            delete params.startTime;
        }
        this.setState({
            dateKey: 0,
            params: params
        });
        this.getData(params);
    }
    onEndTimeChange = (value) => {  // 按结束时间查询
        this.onChange('endValue', value);
        let params = this.state.params;
        if (value) {
            params.endTime = value.format('YYYY-MM-DD');
        } else {
            delete params.endTime;
        }
        this.setState({
            dateKey: 0,
            params: params
        });
        this.getData(params);
    }
    searchData = (value) => {  // 模糊搜索关键字
        let searchKey = value;
        let params = this.state.params;
        if (Config.isNull(searchKey)) {
            delete params.searchKey;
        } else {
            params.searchKey = searchKey;
        }
        params.page = 1; // 查询数据重置页码
        this.setState({
            params: params
        });
        this.getData(params);
    }
    searchDateKey = (dateKey) => { // 本周、本月、近三个月
        let params = this.state.params;
        params.startTime = moment().subtract(dateKey, 'days').format('YYYY-MM-DD');
        params.endTime = moment().format('YYYY-MM-DD');
        this.setState({
            dateKey: dateKey,
            params: params,
            endValue: null,
            startValue: null
        });
        params.page = 1; //重置页码
        this.getData(params);
    }
    handleChange(value){
        let params = this.state.params;
        if (value) {
            params.type = value.key;
        } else {
            delete params.type;
        }
        params.page=1;
        this.setState({
			params: params,
		});
		this.getData(params);
    }
    getData(params) {	//根据tab页key获取数据
        const that = this;
        const { defaultTab } = that.state;
        if (defaultTab == 'user') {
            that.getTemplateList(params);
        } else {
            that.getTEMList();
        }
    }
    disabledStartDate = (startValue) => {  // 禁用开始时间
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    disabledEndDate = (endValue) => {  // 禁用结束时间
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }
    changeTabs = (key) => {	//切换TAB页切换数据
        Config.localItem('DEFAULT_TAB', key)
        browserHistory.push('/contract/' + key);
    }
    // 页码改变 或者 页面表格条数改变
    changeTable = (pagination) => {
        let params = this.state.params;
        params.page = pagination.current;
        params.rows = pagination.pageSize;
        this.getData(params);
    }
    getTemplateList(params) {
        this.setState({ loading: true });
        params = this.state.params
        Config.get('/v1/contract/info/list', params, (res) => {
            if (res.code == Config.errorCode.success) {
                const pagination = { ...this.state.pagination };
                pagination.total = res.recordsTotal; // 总页数
                pagination.current = params.page; // 当前页数
                this.setState({
                    templateList: res.data,
                    pagination,
                    loading: false
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    getContractTEMList = (params,type) => {
        Config.get('/v1/contract/tpl/list', params, (res) => {
            if (res.code == Config.errorCode.success) {
                if(type=='online'){
                    this.setState({
                        ContractTEMListOn: res.data
                    });
                }else{
                    this.setState({
                        ContractTEMListUnder: res.data
                    });
                }
               
            } else {
                message.error(res.msg);
            }
        });
    }
    postTplIsOpen=async(params)=>{
        let res=await ContractService.postTplIsOpen(params);
        if (res.code == Config.errorCode.success) {
            this.getTplIsOpen()
        }
    }
    download = (code, e) => {
        // window.open(Config.target + '/comm/contract/down/' + code)
        e.target.href = Config.target + '/comm/contract/down/' + code
    }
    previewWord=(e,path)=>{
        if(path.indexOf('https://file.zhudb.com')>=0){
            e.target.href=path;
        }else{
            e.target.href='https://view.officeapps.live.com/op/view.aspx?src='+Config.target+path
        }
    }
    render() {
        const { startValue, endValue, defaultTab, selectList,underline,online } = this.state;
        const dateFormat = 'YYYY-MM-DD';
        const columns = [{
            title: '合同编号',
            dataIndex: 'contractNo',
            key: 'contractNo',
            width: 200,
        }, {
            title: '姓名',
            dataIndex: 'custName',
            key: 'custName',
            width: 150,
        }, {
            title: '身份证',
            dataIndex: 'idCardNo',
            key: 'idCardNo',
            width: 120,
        }, {
            title: '合同类型',
            dataIndex: 'contractTypeName',
            key: 'contractTypeName',
            width: 100,
            render: (text, record) => (
                <span>
                    {text?text:'--'}
                </span>
            )
        }, {
            title: '合同名称',
            dataIndex: 'typeName',
            key: 'typeName',
            width: 100,
            render: (text, record) => (
                <span>
                    {text?text:'--'}
                </span>
            )
        }, {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
            width: 150,
            render: (text, record) => (
                <span>
                    {Config.formatDateTime(text)}
                </span>
            )
        }, {
            title: '操作',
            key: 'action',
            width: 100,
            render: (text, record) => (
                <span>
                    <Link onClick={(e)=>this.previewWord(e,record.srcUrl)} target="_blank">查看</Link>
                    <span className="J_no_detail ant-divider" />
                    <Link style={{ cursor: 'pointer' }} onClick={this.download.bind(this, record.fileCode)}>下载</Link>
                </span>
            )
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="common-tab-container contract-container">
                    <Tabs className='contract-tabs' defaultActiveKey={defaultTab} activeKey={defaultTab} onChange={this.changeTabs} animated={false}>
                        <TabPane tab="用户合同" key="user">
                            <div className="common-tab-content">
                                <div className="common-search-section">
                                    <div className="date-search-container">
                                        <div className='search-item' data-flex="dir:left">
                                            <DatePicker disabledDate={this.disabledStartDate} placeholder='开始时间' format={dateFormat} value={startValue} onChange={this.onStartTimeChange} getCalendarContainer={trigger => trigger.parentNode} />
                                            <DatePicker disabledDate={this.disabledEndDate} placeholder='结束时间' format={dateFormat} value={endValue} onChange={this.onEndTimeChange} getCalendarContainer={trigger => trigger.parentNode} />
                                        </div>
                                        <div className='search-item' data-flex="dir:left">
                                            <Select
                                                labelInValue
                                                style={{ width: 150, height: 36 }}
                                                placeholder="类型"
                                                optionFilterProp="children"
                                                onChange={(value) => this.handleChange(value)}
                                                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                getPopupContainer={trigger => trigger.parentNode}
                                            >
                                                {selectList.map((item, index) =>
                                                    <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                )}
                                            </Select>
                                        </div>
                                        <Search className="search-item" placeholder='合同名称/姓名' style={{ width: 200 }} onSearch={this.searchData} />
                                        <div className="search-item">
                                            <span className={`time-item ${this.state.dateKey == 6 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 6)}>近一周</span>
                                            <span className={`time-item ${this.state.dateKey == 29 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 29)}>近一月</span>
                                            <span className={`time-item ${this.state.dateKey == 89 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 89)}>近三个月</span>
                                        </div>
                                        <ResetSearch />
                                    </div>
                                </div>
                                <Table
                                    rowKey={record => record.contractNo}
                                    columns={columns}
                                    className="common-content-container"
                                    dataSource={this.state.templateList}
                                    pagination={this.state.pagination}
                                    onChange={this.changeTable}
                                />
                            </div>
                        </TabPane>
                        <TabPane tab="合同模板" key="board">
                            <div className="common-tab-content">
                                <ContractTEM ContractTEMListOn={this.state.ContractTEMListOn} ContractTEMListUnder={this.state.ContractTEMListUnder} getContractTEMList={this.getContractTEMList} startTime={this.state.startValue} endTime={this.state.endValue} online={online} underline={underline} postTplIsOpen={this.postTplIsOpen} getTplIsOpen={this.getTplIsOpen}/>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </Spin>
        );
    }
}

export default Contact;
