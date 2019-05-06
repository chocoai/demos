import React, { Component } from 'react';
import { Config } from '../../Config/Index'
import { Spin, Menu, DatePicker, Button } from 'antd';
import { Link } from 'react-router';
import ReportsService from '../../Services/ReportsSservice'; // services层 客户数据统计
import CommonService from '../../Services/CommonService';
import get from 'lodash.get'
import './style/Reports.less'

class marketReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultTab: null,
            loading: false,
            startValue: null,          // 搜索开始时间
            endValue: null,            // 搜索结束时间
            data: null,
            params: {
            },
            downParams: {
                token: window.localStorage.getItem("USER_AUTHORIZATION"),
            },
            tabList: null
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this.getTabs();
    }
    async getTabs() {
        let { params, downParams } = this.state;
        let res = await CommonService.getProductType({ ddItem: 'cplx' });
        if (res.code == Config.errorCode.success) {
            params.prdType = res.data.cplx[0].ddValue;
            downParams.prdType = res.data.cplx[0].ddValue;
            this.setState({
                tabList: res.data.cplx,
                defaultTab: [res.data.cplx[0].ddValue + ''],
                params,
                downParams
            })
            this.getDataSum(params);
        }
    }
    async getDataSum(params) {
        let res = await ReportsService.getDataSum(params);
        this.setState({
            data: res.data
        })
    }
    // 根据时间筛选 重置页码
    onStartTimeChange = (value) => {
        this.onChange('startValue', value)
        let { params, downParams } = this.state;
        if (value) {
            params.startTime = value.format('YYYY-MM-DD');
            downParams.startTime = value.format('YYYY-MM-DD');
        } else {
            delete params.startTime;
            delete downParams.startTime;
        }
        this.setState({
            params,
            downParams
        });
        this.getDataSum(params)
    }
    onEndTimeChange = (value) => {
        this.onChange('endValue', value)
        let { params, downParams } = this.state;
        if (value) {
            params.endTime = value.format('YYYY-MM-DD');
            downParams.endTime = value.format('YYYY-MM-DD');
        } else {
            delete params.endTime;
            delete downParams.endTime;
        }
        this.setState({
            params,
            downParams
        });
        this.getDataSum(params)
    }

    // 下载
    download = (e) => {
        const { downParams } = this.state;
        let url = '';
        for (let c in downParams) {
            url += c + "=" + downParams[c] + '&';
        }
        e.target.href = Config.target + '/comm/report/summary/download/?' + url
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
    changeTabs = (tab) => {
        let { params, downParams } = this.state
        this.setState({
            defaultTab: tab.selectedKeys
        })
        params.prdType = tab.selectedKeys[0];
        downParams.prdType = tab.selectedKeys[0];
        this.setState({
            params,
            downParams
        })
        if (Config.ipiecesShow.dataSum.includes(+tab.selectedKeys[0])) {
            this.getDataSum(params)
        }
    }
    render() {
        const that = this;
        const { defaultTab, tabList, startValue, endValue, data } = that.state;
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="common-console-container marketShare-container" style={{ padding: 0 }}>
                    <div className="common-tab-container">
                        <div className="share-tabs">
                            {defaultTab && <Menu className="share-search-menu" mode="horizontal" defaultSelectedKeys={defaultTab} selectedKeys={defaultTab} onSelect={this.changeTabs}>
                                {tabList && tabList.map(item => <Menu.Item key={item.ddValue}>{item.ddText}</Menu.Item>)}
                            </Menu>}
                        </div>
                        {defaultTab && Config.ipiecesShow.dataSum.includes(+defaultTab[0]) ?
                            <div>
                                <div className="common-tab-content">
                                    <div className="common-search-section">
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
                                    </div>
                                    <div className="common-search-section reports-search-section">
                                        <Button className="common-btn" type="primary"><Link style={{ color: '#fff' }} onClick={(e) => this.download(e)}>导出</Link></Button>
                                    </div>
                                </div>

                                <div className='common-content-container data-sum-content'>
                                    <div className="data-sum-date">{`统计时间：${startValue && startValue.format('YYYY-MM-DD') || '--'}~${endValue && endValue.format('YYYY-MM-DD') || '--'}`}</div>
                                    <div className="data-sum-warp">
                                        <div className="data-sum-left">
                                            <p>申请进件</p>
                                            <p className='data-sum-p-4'>初审</p>
                                            <p className='data-sum-p-4'>综合授信审批</p>
                                            <p className='data-sum-p-4'>人工审批</p>
                                            <p className='data-sum-p-2'>放款</p>
                                        </div>
                                        <div className="data-sum-left">
                                            <p>总进件数</p>
                                            <p>通过笔数</p>
                                            <p>拒绝笔数</p>
                                            <p>通过率</p>
                                            <p>预授信总额度</p>
                                            <p>通过笔数</p>
                                            <p>拒绝笔数</p>
                                            <p>通过率</p>
                                            <p>综合授信总额度</p>
                                            <p>通过笔数</p>
                                            <p>拒绝笔数</p>
                                            <p>通过率</p>
                                            <p>人工授信总额度</p>
                                            <p>笔数</p>
                                            <p>放款总金额</p>
                                        </div>
                                        <div className="data-sum-value">
                                            <p>{`${data && data.total || 0}笔`}</p>
                                            <p>{`${data && data.csNum || 0}笔`}</p>
                                            <p>{`${data && data.csjjNum || 0}笔`}</p>
                                            <p>{`${data && data.csL || 0}%`}</p>
                                            <p>{`${data && data.csMoney || 0}万`}</p>
                                            <p>{`${data && data.zhNum || 0}笔`}</p>
                                            <p>{`${data && data.zhjjNum || 0}笔`}</p>
                                            <p>{`${data && data.zhL || 0}%`}</p>
                                            <p>{`${data && data.zhMoney || 0}万`}</p>
                                            <p>{`${data && data.rgNum || 0}笔`}</p>
                                            <p>{`${data && data.rgjjNum || 0}笔`}</p>
                                            <p>{`${data && data.rgL || 0}%`}</p>
                                            <p>{`${data && data.rgMoney || 0}万`}</p>
                                            <p>{`${data && data.fkNum || 0}笔`}</p>
                                            <p>{`${data && data.fkMoney || 0}万`}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="product-nodata">
                                <p>还没有任何数据</p>
                            </div>}
                    </div>
                </div>
            </Spin >
        );
    }
}
export default marketReport;
