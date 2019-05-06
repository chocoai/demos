import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import FormService from '../../Services/FormService';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import { Link } from 'react-router';
import {Config} from '../../Config/Index';
import { Table, Modal, Button, message } from 'antd';

import './style/formConf.less'
/**
 * 系统配置 —— 调查表模块配置
 * @Author: 赵俊
 * @Date:   2018-03-08
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-03-08
 */
class FormInvestigateModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moduleConf: [],
            formEnName: props.routeParams.formEnName,
            prdType: props.routeParams.prdType,
            visible: false,        // 编辑窗口显示
            defaultValue: '',       // 默认文本
            record: {},             // 当前编辑模块
            modalKey: 'formInvestigateModule',
            breadValue: JSON.parse(Config.localItem(Config.formConfLocal.formInvestigateConf)).filter(i => i.formEnName == props.routeParams.formEnName)[0].formChName
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    async componentDidMount() {
        this.getModuleConf()
    }
    // 获取模块
    async getModuleConf () {
        const {formEnName, prdType} = this.state
        let moduleConfRes = await FormService.getModuleConf({ formEnName, prdType })
        this.setState({
            moduleConf: moduleConfRes.data.sort((i1, i2) => i1.position - i2.position)
        })
        Config.localItem(Config.formConfLocal.formInvestigateModule, JSON.stringify(moduleConfRes.data))
    }
    confirm = async () => {
        const {record, prdType, modalKey} = this.state
        let value = this.refs.input.value
        // 不采取受控组件
        if(!value.length) return message.error('不能为空')
        if(value.length > 20) return message.error('最多不能超过二十个字')
        let formNameRes = await FormService.putFormName({ formEnName: record.formEnName, formChName: value, prdType })
        // 获取最新字段
        this.getModuleConf()
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
        if(formNameMove) this.getModuleConf()
    }
    // 启用禁用
    onOff = async (formEnName, action) => {
        if (formEnName == 'loanCustomer') return;
        const {prdType} = this.state
        let formNameMove = await FormService.postFormOnoff({ formEnName, action, prdType })
        if(formNameMove) this.getModuleConf()
    }
    render() {
        const {moduleConf, visible, defaultValue, modalKey, prdType, breadValue, formEnName} = this.state
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
                    {/* 个人基本信息loanCustomer禁用禁用 */}
                    {
                        record.isenable?
                        <span className={`${record.disableBan? 'form-disable-button' : ''} form-button`}  onClick={() =>this.onOff(record.formEnName, false)}>禁用</span>
                        :  <span className="form-button" onClick={() => this.onOff(record.formEnName, true)}>启用</span>
                    }
                    <span className="form-button" onClick={() => this.edit(record)}>编辑</span>
                    {
                        /loanAssetInfo|loanAssetIncstat|loanAssetCashFlow|loanAssetAgro|loanAssetAgroIncstat|loanAssetAgroCashFlow/.test(record.formEnName)?
                        <Link className="form-disable-button form-button">配置</Link>:
                        <Link className="form-button" to={`/form/investigate/${formEnName}/${record.formEnName}/${prdType}`}>配置</Link>
                    }
                    <span className={`${index == 0? 'form-disable-button' : ''} form-button`} onClick={() => this.move(record.formEnName, true)}>上移</span>
                    <span className={`${index == moduleConf.length - 1? 'form-disable-button' : ''} form-button`} onClick={() => this.move(record.formEnName, false)}>下移</span>
                </div>
            )
        }];
        const bcrumb = [{
            'link': '/form',
            'value': '表单配置'
        }, {
            'link': `/form/investigate/${prdType}`,
            'value': '调查表配置'
        }, {
            'link': null,
            'value': `${breadValue}配置`
		}];
        return (
            <div className="form-investigate-container">
                <BcrumbItem bcrumb={bcrumb} />
                <div className="form-conf-wrapper">
                    <Table
                        rowKey={record => record.formEnName}
                        pagination={false}
                        columns={columns}
                        dataSource={moduleConf}
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

export default FormInvestigateModule;
