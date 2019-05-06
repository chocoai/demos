import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
// import { browserHistory, Link } from 'react-router';
import { Link, browserHistory } from 'react-router';
import ActivityService from '../../Services/ActivityService';

import ResetSearch from './../../Component/Common/ResetSearch';
import ActivityItem from '../../Containers/Activity/ActivityItem';

import './style/activity.less';

import { Spin, Input, Button, Pagination, message, Menu } from 'antd';
const Search = Input.Search;
/**
 * 活动管理
 * @Author:
 * @Date:   2017-12-25
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-12-25
 */
class AuthorityIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,//加载状态
            defaultTab: props.routeParams.tab ? props.routeParams.tab.split() : ['draw'],
            activityList: '',
            pagination: {
                pageSizeOptions: ['5', '10', '15'],// 指定每页可以显示多少条
                total: 0
            },
            params: {
                page: 1,
                rows: 10
            }
        };
    }
    componentDidMount() {
        let that = this;
        // const { params } = that.state;
        that.getActivityList()
    }
    changeTabs = (e) => {
        if (e.key == 'draw') { // 抽奖活动
            browserHistory.push('/market/activity/draw');
        }
        if (e.key == 'test') { // 测试答题
            browserHistory.push('/market/activity/test');
        }
        if (e.key == 'jigsaw') { // 拼图游戏
            browserHistory.push('/market/activity/jigsaw');
        }
        if (e.key == 'shake') { // 摇一摇
            browserHistory.push('/market/activity/shake');
        }
    }
    async getActivityList() {
        let that = this;
        let { params, defaultTab } = that.state;
        let pagination = that.state.pagination;
        let res;
        if (defaultTab == 'draw') {
            res = await ActivityService.getActivityList(params)
        } else if (defaultTab == 'test') {
            res = await ActivityService.getAnswerList(params)
        } else if (defaultTab == 'jigsaw') {
            params.activeType=1;
            res = await ActivityService.getJigsawList(params)
        } else if (defaultTab == 'shake') {
            params.activeType=2;
            res = await ActivityService.getShakeList(params)
        }
        if (res&&(res.code == Config.errorCode.success)) {
            const data = res.data;
            pagination.total = res.recordsTotal
            that.setState({
                activityList: data,
                pagination: pagination
            });
        }
    }
    searchData = (value) => {
        let { params, defaultTab } = this.state;
        if(defaultTab=='draw'||defaultTab=='test'){
            params.activeName = value;
        }else{
            params.keyWord=value;
        }
        params.page = 1; // 重置页码
        this.getActivityList(params);
    }
    changePro = (page, pageSize) => {
        let that = this
        let params = that.state.params;
        params.page = page;
        params.rows = pageSize;
        this.getActivityList(params);
    }
    render() {
        const that = this;
        const { activityList, pagination, params, defaultTab } = that.state;
        const Page = activityList && activityList.length > 0 ? <Pagination
            pageSize={params.rows}
            total={pagination.total}
            showTotal={(total, range) => `共  ${total}  条`}
            style={{ float: 'none', display: 'table', margin: '16px auto' }}
            onChange={this.changePro}
            onShowSizeChange={this.changePro}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={pagination.pageSizeOptions}
        /> : null;
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="common-tab-container activity-container">
                    <Menu className="activity-menu" defaultSelectedKeys={defaultTab} mode="horizontal" onClick={this.changeTabs}>
                        <Menu.Item key="draw">抽奖活动</Menu.Item>
                        <Menu.Item key="test">测试答题 </Menu.Item>
                        <Menu.Item key="jigsaw">拼图游戏 </Menu.Item>
                        <Menu.Item key="shake">摇一摇</Menu.Item>
                    </Menu>
                    <div className="common-tab-content">
                        <div className="common-search-section">
                            <div className="date-search-container">
                                <Search className='search-item' style={{ width: '200px' }} placeholder="活动名称" onSearch={this.searchData} />
                                <ResetSearch />
                            </div>
                        </div>
                        {defaultTab == 'draw' ? <div className="common-action-section">
                            <Link to={'/market/drawActivity/add'}><Button className="common-btn" icon="plus" type="primary">新活动</Button></Link>
                        </div> : null}
                        {defaultTab == 'jigsaw' ? <div className="common-action-section">
                            <Link to={'/market/jigsawActivity/add'}><Button className="common-btn" icon="plus" type="primary">新活动</Button></Link>
                        </div> : null}
                        {defaultTab == 'shake' ? <div className="common-action-section">
                            <Link to={'/market/shakeActivity/add'}><Button className="common-btn" icon="plus" type="primary">新活动</Button></Link>
                        </div> : null}
                        {activityList && activityList.length > 0 ?
                            activityList.map((info, index) => (
                                <ActivityItem key={index} router={this.context.router} getActivityList={()=>this.getActivityList()} info={info} params={params} defaultTab={defaultTab}/>
                            )) :
                            <div className="product-nodata">
                                <p>还没有任何数据</p>
                            </div>
                        }
                        {Page}
                    </div>

                </div>
            </Spin>
        );
    }
}

export default AuthorityIndex;
