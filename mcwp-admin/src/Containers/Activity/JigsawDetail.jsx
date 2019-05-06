import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/activityDetail.less';
import { Link } from 'react-router';
import ActivityService from '../../Services/ActivityService';

import { Table, Button,Breadcrumb } from 'antd';
class ActivityDetail extends Component {//摇一摇和拼图公用了页面
    constructor(props) {
        super(props);
        this.state = {
            code: props.routeParams.code,
            activityList:[],
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
            type:props.location.query.type
        };
    }
    componentDidMount() {
        let that = this
        const { params, code } = that.state;
        params.activityCode = code
        that.getActivityDetail(params)
    }
    async getActivityDetail(params) {
        let {type}=this.state;
        let that = this;
        let pagination = that.state.pagination;
        let res;
        if(type=='jigsaw'){
            res = await ActivityService.getJigsawDetail(params)
        }else if(type=='shake'){
            res = await ActivityService.getShakeDetail(params)
        }
        if (res.code == Config.errorCode.success) {
            const data = res.data;
            pagination.total = res.recordsTotal
            if (data) {
                that.setState({
                    activityList: data,
                    pagination: pagination
                });
            }
        }
    }
    changeTable = (page, pageSize) => {
        let that = this
        let params = that.state.params;
        params.page = page.current;
        params.rows = page.pageSize;
        this.getActivityDetail(params);
    }
    // 下载
    download = (e) => {
        let { code } = this.state;
        let url = `activityCode=${code}&token=${Config.localItem('USER_AUTHORIZATION')}`
        e.target.href = Config.target + '/comm/jigsaw/winner/download?' + url

    }
    render() {
        const { activityList, pagination,type } = this.state
        const columns = [{
            title: '姓名',
            dataIndex: 'userName',
            key: 'userName',
            width: 100,
            render: (text, record) => (
                <span className="reason-text">
                    {text ? <span>{text}</span> : "-"}
                </span>
            )
        }, {
            title: '联系方式',
            dataIndex: 'userPhone',
            key: 'userPhone',
            width: 150,
            render: (text, record) => (
                <span className="reason-text">
                    {text ? <span>{text}</span> : "-"}
                </span>
            )
        }, {
            title: '地址',
            dataIndex: 'userAddress',
            key: 'userAddress',
            width: 200,
            render: (text, record) => (
                <span className="reason-text">
                    {text ? <span>{text}</span> : "-"}
                </span>
            )
        }, {
            title: '奖品',
            dataIndex: 'prizeName',
            key: 'prizeName',
            width: 200,
            render: (text, record) => (
                <span className="reason-text">
                    {text ? <span>{text}</span> : "-"}
                </span>
            )
        }, {
            title: '助力人数',
            dataIndex: 'helpNum',
            key: 'helpNum',
            width: 100,
            render: (text, record) => (
                <span className="reason-text">
                    {text || text == 0 ? <span>{text}个</span> : "-"}
                </span>
            )
        }, {
            title: '兑奖时间',
            dataIndex: 'winTime',
            key: 'winTime',
            width: 200,
            render: (text, record) => (
                <span>
                    {text ? Config.formatDateTime(text) : '-'}
                </span>
            )
        }];
        return (
            <div className="activityDetail-container">
                <Breadcrumb className='breadcrumb'>
                    <Breadcrumb.Item className='breadcrumb-item'><Link to="/market/activity">活动管理</Link></Breadcrumb.Item>
                    {type=='jigsaw'? <Breadcrumb.Item className='breadcrumb-item'><Link to="/market/activity/jigsaw">拼图活动</Link></Breadcrumb.Item>: <Breadcrumb.Item className='breadcrumb-item'><Link to="/market/activity/shake">摇一摇</Link></Breadcrumb.Item>}
                    <Breadcrumb.Item className='breadcrumb-item'>中奖详情</Breadcrumb.Item>
                </Breadcrumb>
                <div className="common-search-section activityDetail-search-section">
                    <Button className="common-btn" type="primary"><Link onClick={(e) => this.download(e)}>下载列表</Link> </Button>
                </div>
                <div className="common-content-container activity-tabs">
                    <Table
                        rowKey={record => record.code}
                        columns={columns}
                        dataSource={activityList}
                        pagination={pagination}
                        onChange={this.changeTable}
                    />
                </div>
            </div>
        );
    }
}

const pureActivityDetail = pureRender(ActivityDetail);

export default pureActivityDetail;
