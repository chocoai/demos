import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import { Link } from 'react-router';
import './style/template.less';
import TemplateService from '../../Services/TemplateService'

import { Table, Switch, Modal, message, Button } from 'antd';
const confirm = Modal.confirm;
class OperateTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templateList: [],
            pagination: {
                showSizeChanger: true, // 是否可以改变 pageSize
                showQuickJumper: true, // 是否可以快速跳转至某页
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`,
                pageSizeOptions: ['5', '10', '15'] // 指定每页可以显示多少条
            },
            params: {
                page: 1,
                rows: 10,
                templateType: 1
            },
        };
    }
    componentDidMount() {
        const { params } = this.state
        this.getTemplateList(params);
    }
    switchRisk = (record) => { // 服务开启/关闭
        let that = this
        const { params: pageParams} = this.state
        if (!record.isenable) {
            let params = {
                id: record.id,
                isenable: true
            }
            confirm({
                title: '提示',
                content: '关闭后将不会发送短信通知，确认要关闭吗',
                okText: '确定',
                cancelText: '取消',
                onCancel() {
                    that.getTemplateList(pageParams);
                },
                onOk() {
                    that.closeSwitch(params)
                },
            });
        } else {
            let params = {
                id: record.id,
                isenable: false
            }
            that.closeSwitch(params)
        }
    }
    // 删除模板
    deletePoint(id) {
        let params = { id : id };
        let that = this;
        confirm({
            title: '确认删除',
            content: '确认删除该模板？',
            onOk() {
                that.delOperateTemplate(params)
            },
		});
	}
    async closeSwitch(params) {
        let pageParams=this.state.params;
        let res = await TemplateService.editTemplate(params)
        if (res.code == Config.errorCode.success) {
            this.getTemplateList(pageParams);
        }
    }
    async delOperateTemplate(params){
        let that = this;
        let res = await TemplateService.delOperateTemplate(params)
        if (res.code == Config.errorCode.success) {
            if(res.data){
                this.delSureOperateTemplate(params)
            }else{
                confirm({
                    title: '确认删除',
                    content: '使用该模板的短信有发送失败或发送中的记录，确认删除该模板？',
                    onOk() {
                        that.delSureOperateTemplate(params)
                    },
                });
            }
        }
       
    }
    async delSureOperateTemplate(params){
        let pageParams=this.state.params;
        let res = await TemplateService.delSureOperateTemplate(params)
        if (res.code == Config.errorCode.success) {
            message.success('删除成功');
            this.getTemplateList(pageParams);
        }
       
    }
    changeTable = (pagination) => { // 分页、排序、筛选变化时触发
        let { params } = this.state;
        params.page = pagination.current;
        params.rows = pagination.pageSize;
        this.getTemplateList(params);
    }
    getTemplateList(params) {
        this.setState({ loading: true });
        Config.get('/v1/message/template', params, (res) => {
            if (res.code == Config.errorCode.success) {
                const { pagination } = this.state;
                pagination.total = res.recordsTotal; // 总页数
                pagination.current = params.page; // 当前页数
                this.setState({
                    templateList: res.data,
                    loading: false,
                    pagination
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    render() {
        const columns = [{
            title: '模板内容',
            dataIndex: 'content',
            key: 'content',
            width: 200,
        }, {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (text, record) => (
                <span>
                    {text ? Config.formatDateTime(text) : null}
                </span>
            )
        }, {
            title: '短信签名',
            dataIndex: 'signature',
            key: 'signature'
        }, {
            title: '审核状态',
            dataIndex: 'auditStatus',
            key: 'auditStatus',
            render: (text, record) => (
                <span className="reason-text">
                    {text ? <span>{text}</span> : "——"}
                </span>
            )
        }, {
            title: '拒绝原因',
            dataIndex: 'rejectReason',
            key: 'rejectReason',
            render: (text, record) => (
                <span className="reason-text">
                    {text ? <span>{text}</span> : "——"}
                </span>
            )
        }, {
            title: '开关',
            dataIndex: 'isenable',
            key: 'isenable',
            render: (text, record) => {
                return <Switch disabled={record.applyScene == "发送验证码" ? true : false} onChange={this.switchRisk.bind(this, record)} checked={!record.isenable} />;
            }
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'action',
            render: (text,record) => (
                <div>
                    <Link className="edit" to={'/template/add/operate/' + text}>编辑</Link>
                    <span style={{marginLeft:'5px'}}>
                        <a className="delete" onClick={()=>this.deletePoint(text)}>删除</a>
                    </span>
                </div>

            )
        }];
        return (
            <div className="operate-template-container common-tab-content">
                <div className="operate-search-top">
                    <p className="search-tip">模板内容需经过审核，请耐心等待</p>
                    <div className='operate-add'>
                        <Link to="/template/add/operate"><Button className="search-button" icon="plus" type="primary">新模板</Button></Link>
                    </div>

                </div>
                <Table
                    rowKey={record => record.id}
                    columns={columns}
                    dataSource={this.state.templateList}
                    pagination={this.state.pagination}
                    onChange={this.changeTable}
                />
            </div>
        );
    }
}

const pureOperateTemplate = pureRender(OperateTemplate);

export default pureOperateTemplate;

