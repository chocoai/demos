import React, { Component } from 'react'; // 引入了React
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import RiskItem from '../../Component/Data/RiskItem'; // 风控供应商
import ResetSearch from './../../Component/Common/ResetSearch';
import ValidateItem from '../../Component/Data/ValidateItem'; // 数据验证

import { Config } from '../../Config/Index';
import { getSrvList, operationServ } from '../../Redux/Action/Data/ServiceAction';
import './style/dataService.less';

import { Input, Tabs, Pagination, Spin } from 'antd';
const TabPane = Tabs.TabPane;
const Search = Input.Search;

/**
 * 数据服务
 * @Author: 魏昌华
 * @Date:   2017-07-04
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-07-04
 */

class DataService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholderWord: '供应商名字',
            defaultTab: 'risk'
        };
    }
    componentDidMount() {
        const that = this;
        const { routeParams } = that.props;
        that.setState({
            defaultTab: routeParams.tab ? routeParams.tab : 'risk'
        });
        const { params, actions } = that.props;
        params.page = 1; // 重置页码
        if (routeParams.tab == 'verify') {
            params.srvType = 2;
            that.setState({
                placeholderWord: '数据验证名称'
            })
        }
        if (routeParams.tab == 'risk') {
            params.srvType = 1;
            that.setState({
                placeholderWord: '数据验证名称'
            })
        }
        delete params.keyWord;
        actions.getSrvList(params);
    }
    changeTab = (key) => { // 切换选项卡
        Config.localItem('DEFAULT_TAB', key)
        browserHistory.push('/datas/' + key);
        // params.page = 1; // 重置页码
        // params.srvType = key;
        // actions.getSrvList(params);
        // if ( key == 2) {
        //     this.setState({
        //         placeholderWord: '数据验证名称'
        //     })
        // } else {
        //     this.setState({
        //         placeholderWord: '供应商名字'
        //     })
        // }
    }
    changePro = (page, pageSize) => { // 分页、排序、筛选变化时触发
        const { params, actions } = this.props;
        params.page = page;
        params.rows = pageSize;
        actions.getSrvList(params);
    }
    searchData = (value) => {
        const { params, actions } = this.props;
        params.keyWord = value;
        params.page = 1; // 重置页码
        actions.getSrvList(params);
    }
    switchRisk = (srvStatus) => {
        const { actions } = this.props;
        actions.operationServ({});
    }
    render() {
        const { loading, params, pagination, serviceInfo, actions } = this.props;
        const { defaultTab } = this.state;
        const Page = serviceInfo.length > 0 ? <Pagination
            current={pagination.current}
            pageSize={params.rows}
            total={pagination.total}
            showTotal={(total, range) => `共  ${total}  条`}
            style={{ float: 'none', display: 'table', margin: '16px auto' }}
            onChange={this.changePro}
            onShowSizeChange={this.changePro}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={pagination.pageSizeOptions}
            className="service-page"
        /> : null;
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="common-tab-container service-container">
                    <Tabs defaultActiveKey={defaultTab} activeKey={defaultTab} onChange={this.changeTab} animated={false}>
                        <TabPane tab="风控供应商" key="risk">
                            <div className="common-tab-content">
                                <div className="common-action-section">
                                    <Search className="search-item" placeholder={this.state.placeholderWord} style={{ width: 200, height: 36 }} onSearch={this.searchData} />
                                    <ResetSearch />
                                </div>
                                {
                                    serviceInfo.map((info, index) => (
                                        <RiskItem key={index} info={info} switchRisk={actions.operationServ} params={params} />
                                    ))
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="数据验证" key="verify">
                            <div className="common-tab-content">
                                {
                                    serviceInfo.map((info, index) => (
                                        <ValidateItem key={index} info={info} switchRisk={this.switchRisk} params={params} />
                                    ))
                                }
                            </div>
                        </TabPane>
                    </Tabs>
                    {Page}
                </div>
            </Spin>
        );
    }
}

// 将 store 中的数据作为 props 绑定到 DataService 上
const mapStateToProps = (state, ownProps) => {
    let { Common, DataServ } = state;
    return {
        loading: Common.loading,
        params: DataServ.params,
        serviceInfo: DataServ.serviceInfo,
        pagination: DataServ.pagination
    }
}

// 将 action 作为 props 绑定到 DataService 上。
const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators({ getSrvList, operationServ }, dispatch)
});

const Main = connect(mapStateToProps, mapDispatchToProps)(DataService); // 连接redux

export default Main;

