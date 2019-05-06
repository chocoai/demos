import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import FormService from '../../Services/FormService';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import { Link } from 'react-router';
import {Config} from '../../Config/Index';
import { Table, Modal, Button, message } from 'antd';

import './style/formConf.less'
/**
 * 系统配置 —— 调查表配置
 * @Author: 赵俊
 * @Date:   2018-03-07
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-03-07
 */
class FormInvestigateConf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formType: 2,        // 1申请表2后台调查表3现场调查表
            formConf: [],
            prdType: props.routeParams.prdType,
            visible: false,        // 编辑窗口显示
            defaultValue: '',       // 默认文本
            record: {},             // 当前编辑模块
            modalKey: 'formInvestigateConf'
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    async componentDidMount() {
        this.getFormConf()
    }
    async getFormConf () {
        const {formType, prdType} = this.state
        let formConfRes = await FormService.getFormConf({ formType, prdType })
        this.setState({
            formConf: formConfRes.data.sort((i1, i2) => i1.position - i2.position)
        })
        Config.localItem(Config.formConfLocal.formInvestigateConf, JSON.stringify(formConfRes.data))
    }
    confirm = async () => {
        const {record, prdType, modalKey} = this.state
        let value = this.refs.input.value
        // 不采取受控组件
        if(!value.length) return message.error('不能为空')
        if(value.length > 20) return message.error('最多不能超过二十个字')
        let formNameRes = await FormService.putFormName({ formEnName: record.formEnName, formChName: value, prdType })
        // 获取最新字段
        this.getFormConf()
        if(formNameRes) {
            this.setState({
                visible: false,
                modalKey: modalKey + 1
            })
        }
    }
    // 编辑
    edit = (record) => {
        this.setState({
            visible: true,
            defaultValue: record.formChName,
            record
        })
    }
    // 取消
    cancel = () => {
        const {modalKey} = this.state
        this.setState({
            visible: false,
            modalKey: modalKey + 1
        })
    }
    // 移动
    move = async (formEnName, action) => {
        const {prdType} = this.state
        let formNameMove = await FormService.postFormMove({ formEnName, action, prdType })
        if(formNameMove) this.getFormConf()
    }
    // 启用禁用
    onOff = async (formEnName, action) => {
        if (formEnName == 'basicInfo') return;
        const {prdType} = this.state
        let formNameMove = await FormService.postFormOnoff({ formEnName, action, prdType })
        if(formNameMove) this.getFormConf()
    }
    render() {
        const {formConf, visible, defaultValue, modalKey, prdType} = this.state
        const columns = [{
            title: '模块名称',
            dataIndex: 'formChName',
            key: 'formEnName',
            width: '20%'
        }, {
            title: '状态',
            key: 'isenable',
            render: (text, record, index) => (
                <span>
                    {record.isenable?'启用': '禁用'}
                </span>
            ),
            width: '10%'
        }, {
            title: '操作',
            key: 'action',
            render: (text, record, index) => (
                <div>
                    {/* 基本信息basicInfo禁用禁用 */}
                    {
                        record.isenable?
                        <span className={`${record.disableBan ? 'form-disable-button' : ''} form-button`}  onClick={() =>this.onOff(record.formEnName, false)}>禁用</span>
                        :  <span className="form-button" onClick={() => this.onOff(record.formEnName, true)}>启用</span>
                    }
                    <span className="form-button" onClick={() => this.edit(record)}>编辑</span>
                    {
                        /softInfo|creditQueryInfo/.test(record.formEnName)?
                        <Link className="form-disable-button form-button">配置</Link>:
                        <Link className="form-button" to={`/form/investigate/${record.formEnName}/${prdType}`}>配置</Link>
                    }
                    <span className={`${index == 0? 'form-disable-button' : ''} form-button`} onClick={() => this.move(record.formEnName, true)}>上移</span>
                    <span className={`${index == formConf.length - 1? 'form-disable-button' : ''} form-button`} onClick={() => this.move(record.formEnName, false)}>下移</span>
                </div>
            )
        }];
        const bcrumb = [{
            'link': '/form',
            'value': '表单配置'
        }, {
            'link': null,
            'value': '调查表配置'
		}];
        return (
            <div className="form-investigate-container">
                <BcrumbItem bcrumb={bcrumb} />
                <div className="form-conf-wrapper">
                    <Table
                        rowKey={record => record.formEnName}
                        pagination={false}
                        columns={columns}
                        dataSource={formConf}
                        className="common-content-container"
                        onChange={this.changeTable}
                    />
                </div>
                <Modal
                    visible={visible}
                    className='form-conf-modal'
                    width={400}
                    onCancel={this.cancel}
                    title="修改模块名称"
                    key={modalKey}
                    footer={null}
                >
                    <div className='form-wrapper'>
                        <span className='form-title'>模块名称</span>
                        <input className='form-input' defaultValue={defaultValue} ref="input" />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Button key="ok" type="primary" size="large" onClick={this.confirm}>确定</Button>
                        <Button key="cancel" size="large" style={{ marginLeft: '20px' }} onClick={this.cancel}>取消</Button>,
                    </div>
                </Modal>
            </div>
        );
    }
}

export default FormInvestigateConf;
