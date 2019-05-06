import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Link } from 'react-router';
import ResetSearch from './../../Component/Common/ResetSearch';

import MarRateService from '../../Services/MarRateService'; // services层 营销管理 —— 利率营销

import './style/rate.less';

import { Spin, Table, DatePicker, Button, message, Tooltip, Input } from 'antd';
const Search = Input.Search;

/**
 * 营销管理 —— 利率营销
 * @Author: 魏昌华
 * @Date:   2018-06-05
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2018-06-05
 */
class Rate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            params: {
                page: 1,
                rows: 10
            },
            startValue: null,          // 搜索开始时间
            endValue: null,             // 搜索结束时间
            pagination: {
                showSizeChanger: true, // 是否可以改变 pageSize
                showQuickJumper: true, // 是否可以快速跳转至某页
                pageSizeOptions: ['5', '10', '15'],// 指定每页可以显示多少条
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`
            },
            rates: [] // 利率营销列表信息
        }
    }
    componentDidMount() {
        const that = this;
        const { params } = that.state;
        that.getRates(params);
    }
    async getRates(params) { // 获取利率营销列表信息
        const that = this;
        const res = await MarRateService.getRates(params);
        if (res.code == Config.errorCode.success) {
            const { pagination } = that.state;
            pagination.total = res.recordsTotal;
            that.setState({
                rates: res.data,
                pagination: pagination
            });
        } else {
            message.error(res.msg);
        }
    }
     // 根据开始和禁用时间来设置this.state.startValue  OR  endValue
     onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }
    searchRates(value, dateString, key) { // 按条件查询渠道
        const that = this;
        const { params } = that.state;
        if (key === 'startTime') { // 开始时间
            this.onChange('startValue', value)
            if (value) {
                params.startTime = value.format('YYYY-MM-DD');
            } else {
                delete params.startTime;
            }
        }
        if (key === 'endTime') { // 结束时间
            this.onChange('endValue', value)
            if (value) {
                params.endTime = value.format('YYYY-MM-DD');
            } else {
                delete params.endTime;
            }
        }
        if (key === 'keyWord') { // 客户姓名、联系方式、申请产品
            if (value) {
                params.keyWord = value;
            } else {
                delete params.keyWord;
            }
        }
        if (key !== 'search') {
            params.page = 1;
            that.setState({
                params: params
            });
        }
        that.getRates(params);
    }
    changeTable = (page, pageSize) => { // 表格改变
        const that = this;
        const { params } = that.state;
        params.page = page.current;
        params.rows = page.pageSize;
        that.getRates(params);
    }
    //  禁用结束时间
    disabledDate = (value, type) => {
        if (type === 'start') {
            const endValue = this.state.endValue;
            if (!value || !endValue) {
            return false;
            }
            return value.valueOf() > endValue.valueOf();
        }
        if (type === 'end') {
            const startValue = this.state.startValue;
            if (!value || !startValue) {
            return false;
            }
            return value.valueOf() <= startValue.valueOf();
        }
    }
    downloadRate = (e) => { // 下载列表
        const that = this;
        let params = that.state.params;
        if (params.page) delete params.page;
        if (params.rows) delete params.rows;
        params.token = Config.localItem('USER_AUTHORIZATION');
        let url = [];
        for(let c in params) {
            url.push(c + '=' + params[c]);
        }
        e.target.href = Config.target + '/comm/rateList/download?' + url.join('&')
    }
    render() {
        const that = this;
        const columns = [{
            title: '客户姓名',
            dataIndex: 'custName',
            key: 'custName',
            render: (text) => (
                <span style={text.length > 8 ? {cursor: "pointer"} : {}}>
                    { text ? (text.length > 8 ? <Tooltip placement="top" title={text}>{text.slice(0, 8) + '...'}</Tooltip> : text) : '——'}
                </span>
            )
        }, {
            title: '联系方式',
            dataIndex: 'custMobile',
            key: 'custMobile'
        }, {
            title: '申请产品',
            dataIndex: 'proName',
            key: 'proName',
            render: (text) => (
                <span style={text.length > 18 ? {cursor: "pointer"} : {}}>
                    { text ? (text.length > 18 ? <Tooltip placement="top" title={text}>{text.slice(0, 18) + '...'}</Tooltip> : text) : '——'}
                </span>
            )
        }, {
            title: '助力人数',
            dataIndex: 'helpNum',
            key: 'helpNum',
        }, {
            title: '初始日利率',
            dataIndex: 'startRateStr',
            key: 'startRateStr',
        }, {
            title: '最终日利率',
            dataIndex: 'finalRateStr',
            key: 'finalRateStr',
        }, {
            title: '授信时间',
            dataIndex: 'creditDate',
            key: 'creditDate',
            render: (text, record) => (
                <span>
                    { text ? Config.formatDateTime(text) : '--' }
                </span>
            )
        }];
        const { loading, rates, pagination } = that.state;
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="common-console-container rate-container">
                    <div className="common-search-section">
                        <div className="date-search-container">
                            <div className='search-item' data-flex="dir:left">
                                <DatePicker
                                    ref='startTime'
                                    placeholder="开始时间"
                                    style={{ width: 200 }}
                                    onChange={(value, dateString) => that.searchRates(value, dateString, 'startTime')}
                                    format='YYYY-MM-DD'
                                    disabledDate={(value) => that.disabledDate(value, 'start')}
                                    getCalendarContainer={trigger => trigger.parentNode}
                                />
                                <DatePicker
                                    placeholder="结束时间"
                                    style={{ width: 200 }}
                                    onChange={(value, dateString) => that.searchRates(value, dateString, 'endTime')}
                                    format='YYYY-MM-DD'
                                    disabledDate={(value) => that.disabledDate(value, 'end')}
                                    getCalendarContainer={trigger => trigger.parentNode}
                                />
                            </div>
                            <Search placeholder="客户姓名/联系方式/申请产品" onSearch={(value) => that.searchRates(value, '', 'keyWord')} className='search-item' style={{ width: 200 }} />
                            <ResetSearch />
                        </div>
                    </div>
                    <div className="common-action-section">
                        <Link to="/marketing/rate/rule"><Button className="common-btn" type="primary">设置规则</Button></Link>
                        <Button className="common-btn" type="primary"><Link onClick={(e) => that.downloadRate(e)}>下载列表</Link></Button>
                    </div>
                    <Table
                        rowKey={record => record.code}
                        pagination={pagination}
                        columns={columns}
                        className="common-content-container"
                        dataSource={rates}
                        onChange={that.changeTable}
                    />
                </div>
            </Spin>
        );
    }
}

export default Rate;
