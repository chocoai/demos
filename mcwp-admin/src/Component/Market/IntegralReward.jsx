import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Spin, message, Table, DatePicker, Input, Select, Button } from 'antd';
import ResetSearch from './../../Component/Common/ResetSearch';
import ProductService from '../../Services/ProductService';
import { browserHistory, Link } from 'react-router';
import './style/integralReward.less';
const Search = Input.Search;
const Option = Select.Option;

class IntegralReward extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
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
                enterpriseCode: window.localStorage.getItem("ENTERP_CODE"),
                page: 1,
                rows: 10
            },
            productList: [],//产品列表
        }
    }
    componentDidMount() {
        let that = this;
        let params = that.state.params;
        // 获取产品列表
        that.getProName()
        that.getShareList(params);
    }
    // 获取产品列表
    getProName = () => {
        const that = this;
        Config.get('/v1/prod/name', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                if (Array.isArray(res.data)) res.data = [...new Set(res.data)]
                that.setState({
                    productList: res.data || []
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    getShareList = (params) => { //获取列表数据
        this.setState({ loading: true });
        Config.get('/v1/share/flows', params, (res) => {
            this.setState({ loading: false });
            if (res.code == Config.errorCode.success) {
                let pagination = { ...this.state.pagination };
                pagination.total = res.recordsTotal; // 总页数
                pagination.current = params.page; // 当前页数
                res.data.map((item, index) => {
                    item.indexKey = index
                    item.awardAmount = '￥' + item.awardAmount
                })
                this.setState({
                    shareInfo: res.data,
                    pagination
                });
            } else {
                message.error(res.msg)
            }
        })
    }
    download = (e) => {//下载列表
        let downParams = this.state.downParams;
        let url = '';
        for (let c in downParams) {
            url += c + "=" + downParams[c] + '&';
        }
        e.target.href = Config.target + '/comm/shareFlow/Download/?' + url

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
        downParams.page = 1;
        this.setState({
            downParams: downParams
        });
        this.getShareList(params);
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
        downParams.page = 1;
        this.setState({
            downParams: downParams
        });
        this.getShareList(params);
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
    searchData = (value) => { // 根据银行名称或姓名搜索 重置页码
        let keyWord = value;
        let params = this.state.params;
        let downParams = this.state.params;
        if (Config.isNull(keyWord)) {
            delete params.keyWord;
            delete downParams.keyWord;
        } else {
            params.keyWord = keyWord;
            downParams.keyWord = keyWord;
        }
        params.page = 1;
        downParams.page = 1;
        this.setState({
            downParams: downParams
        });
        this.getShareList(params);
    }
    changeTable = (pagination) => { //页码或者条数改变
        let params = this.state.params;
        params.page = pagination.current;
        params.rows = pagination.pageSize;
        let downParams = this.state.params;
        downParams.page = pagination.current;
        downParams.rows = pagination.pageSize;
        this.setState({
            downParams: downParams
        });
        this.getShareList(params);
    }
    handleChange = (value) => {//企业服务 按企业筛选
        let params = this.state.params;
        let downParams = this.state.params;
        if (value && value.key == 2 || value.key == 3) {
            params.awardRule = value.key;
            downParams.awardRule = value.key;
        } else {
            delete params.awardRule;
            delete downParams.awardRule;
        }
        this.setState({
            params: params,
            downParams: downParams
        });
        this.getShareList(params);
    }
    shareRule = () => {
        browserHistory.push('/market/sharerule');
    }
    render() {
        const { loading, shareInfo, productList } = this.state
        const columnsMarShare = [{
            title: '姓名',
            dataIndex: 'shareName',
            key: 'shareName',
        }, {
            title: '联系方式',
            dataIndex: 'sharePhone',
            key: 'sharePhone',
        }, {
            title: '奖励条件',
            dataIndex: 'awardRule',
            key: 'awardRule',
        }, {
            title: '奖励时间',
            dataIndex: 'awardDate',
            key: 'awardDate',
            render: (text, record) => (
                <span>
                    {Config.formatDateTime(text)}
                </span>
            )
        }, {
            title: '被分享者',
            dataIndex: 'beShareName',
            key: 'beShareName',
        }, {
            title: '联系方式',
            dataIndex: 'beSharePhone',
            key: 'beSharePhone',
        }, {
            title: '积分',
            dataIndex: 'integral',
            key: 'integral',
        },];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="common-console-container integral-container">
                    <div className="common-search-section">
                        <div className="date-search-container">
                            {/* <div className='search-item' data-flex="dir:left">
                            <Button  type="primary" onClick={this.shareRule} style={{height:'36px'}} > 设置分享规则 </Button>
                        </div> */}
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
                                    onChange={this.handleChange}
                                    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    getPopupContainer={trigger => trigger.parentNode}
                                >
                                    <Option key={1} value='all'>全部</Option>
                                    <Option key={2} value='2'>注册</Option>
                                    <Option key={3} value='3'>借款已放款</Option>

                                </Select>
                            </div>
                            <div className='search-item' data-flex="dir:left">
                                <Select
                                    labelInValue
                                    style={{ width: 150, height: 36 }}
                                    placeholder="产品名称"
                                    optionFilterProp="children"
                                    onChange={this.handleChange}
                                    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    getPopupContainer={trigger => trigger.parentNode}
                                >
                                    {
                                        productList && productList.map((item, index) =>
                                            <Option value={item} key={index}>{item}</Option>
                                        )
                                    }
                                </Select>
                            </div>
                            <Search placeholder="姓名/联系方式" onSearch={this.searchData} className='search-item' ref='searchData' style={{ width: 180 }} />
                            <Button type="primary" style={{ height: '32px', margin: '2px 16px 0 0', }} > 搜索 </Button>
                            <ResetSearch />
                            {/* <div className='list-down-wrap' style={{height:'16px',position:'relative',marginTop:'10px',marginLeft:'16px'}}>
						    <Link className='list-download' onClick={(e) => this.download(e)}>下载列表</Link>
                        </div> */}
                        </div>
                    </div>
                    <div className="common-search-section integral-search-section">
                        <Button type="primary" onClick={this.shareRule} style={{ height: '36px', marginRight: '16px' }} > 设置分享规则 </Button>
                        <Button className="common-btn" type="primary"><Link onClick={(e) => this.download(e)}>下载列表</Link> </Button>
                    </div>
                    <div className='common-content-container marketShare-content'>
                        <Table
                            rowKey={record => record.indexKey}
                            pagination={this.state.pagination}
                            columns={columnsMarShare}
                            onChange={this.changeTable}
                            dataSource={shareInfo}
                        />
                    </div>
                </div>
            </Spin>
        )
    }
}

export default IntegralReward;
