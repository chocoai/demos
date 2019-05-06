import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/template.less';

import { Table, Button, Modal, Form, Input, message } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;

/**
 * 消息模版
 * @Author: 赵俊
 * @Date:   2017-08-07
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-08-07
 */
class SignManagement extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
			codes: '',
			templateList: [],
			signVal: '',
			mainModalKey: 0,
    		pagination: {
				showSizeChanger: true, // 是否可以改变 pageSize
				showQuickJumper: true, // 是否可以快速跳转至某页
				pageSizeOptions: ['5', '10','15'],// 指定每页可以显示多少条
				total: 0,
                showTotal: (total, range) => `共  ${total}  条`,
				visible: false //模态款控制
			},
			params: {
				page: 1,
				rows: 10,
			}
		};
	}
	componentDidMount() {
		let {params}=this.state;
		this.getTemplateList(params);
    }
	changeTable = (pagination) => { // 分页、排序、筛选变化时触发
	}
	showModal = () => {
		this.setState({
			visible: true,
			signVal : ''
		});
	}
	handleOk = (e) => {
		let {params,signVal} = this.state;
		if (!signVal) return message.error('请输入签名！');
		if (signVal.length > 10 || signVal.length < 2) return message.error('签名长度为2-10！');
		if (!/^[\u4e00-\u9fa5|\w]{2,10}$/.test(signVal)) return message.error('签名输入格式错误！');
		let pagerows = {smsSign: signVal}
		Config.post('/v1/message/signature/add', pagerows, (res) => {
			if(res.code == Config.errorCode.success) {
                message.success('增加成功');
                this.setState({
                    visible:false
                });
                // 点击操作后 重新请求后台数据 渲染页面
                this.getTemplateList(params);
            } else {
                message.error(res.msg);
            }
		})
	}
	handleCancel = (e) => {
		this.setState({
			visible: false,
			mainModalKey:this.state.mainModalKey+1
		});
	}
	getTemplateList (params) {
		this.setState({ loading: true });
        Config.get('/v1/message/signature', params, (res) => {
            if(res.code == Config.errorCode.success) {
            	this.setState({
					templateList: res.data,
					loading: false
            	});
         	} else {
                message.error(res.msg);
         	}
		});
	}
	changeSign = (e) => {
		let value = e.target.value;
		this.setState({
			signVal : value
		});
	}
	// 网点删除
    deletePoint= (record) => {
        let params = { id : record.id };
        let pagerows = this.state.params;
        let templateList = this.state.templateList;
        let that = this;
        confirm({
            title: '确认删除',
            content: '您确定要删除该签名吗？',
            onOk() {
                Config.delete('/v1/message/signature/del', params,(res)=>{
                    if(res.code == Config.errorCode.success) {
                        message.success('删除成功');
                        // 点击操作后 重新请求后台数据 渲染页面
                        if(templateList.length == 1){
                            pagerows.page =1;
                            that.getTemplateList(pagerows);
                        }else{
                            that.getTemplateList(pagerows);
                        }
                    } else {
                        message.error(res.msg);
                    }
                })
            },
            onCancel() {
            },
		});
	}
	render() {
		const { signVal } = this.state;
		const columns = [{
			title: '短信签名',
			dataIndex: 'signature',
			key: 'signature',
			width: 100,
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
			title: '拒绝原因',
			dataIndex: 'rejectReason',
			key: 'rejectReason',
			width: 200,
			render: (text, record) => (
    			<span className="reason-text">
     				{ text ?<span>{text}</span> : "——" }
    			</span>
  			)
		}, {
		  	title: '操作',
			key: 'delStatus',
			width: 100,
		  	render: (text, record) => (
				<span>
				{ record.delStatus ? <a className="delete" onClick={this.deletePoint.bind(this,record)}>删除</a> : null }
				</span>
		  	)
		}];
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		return (
            <div className="signTemplate-container common-tab-content">
                <div className="common-action-section">
                    <Button className="common-btn" onClick={this.showModal} icon="plus" type="primary">新签名</Button>
                </div>
                <div className="common-content-container">
                    <div className="search-top">
                        <span className="search-tip">签名显示在短信内容最前面，显示这条短信来自哪家公司产品网站。签名需经过审核，请耐心等待。</span>
                    </div>
                    <Modal
                        title="新增签名"
                        className="signTemplate-modal"
                        key={this.state.mainModalKey}
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer=""
                    >
                        <p className="search-tip">人工审批会在30分钟内操作，请耐心等待</p>
                        <Form onSubmit={this.handleSubmit} className="add-signManage-form" >
                            <FormItem
                            {...formItemLayout}
                            label="填写签名"
                            hasFeedback
                            >
                                <Input placeholder='请输入2-10个字符'  size="large"  onChange={this.changeSign} value={signVal} />
                            </FormItem>
                            <FormItem className="button-group">
                                <Button type="primary" onClick={this.handleOk} htmlType="submit">确定</Button>
                                <Button type="primary" onClick={this.handleCancel} htmlType="submit" className="ant-form-cancel">取消</Button>
                            </FormItem>
                        </Form>
                    </Modal>
                    <Table
                        rowKey={record => record.createDate}
                        columns={columns}
                        dataSource={this.state.templateList}
                        pagination={this.state.pagination}
                        onChange={this.changeTable}
                    />
                </div>
		    </div>
		);
	}
}

const pureSignManagement = pureRender(SignManagement);

export default pureSignManagement;
