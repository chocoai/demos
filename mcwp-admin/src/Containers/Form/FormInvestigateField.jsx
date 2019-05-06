import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import FormService from '../../Services/FormService';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import {Config} from '../../Config/Index';
import { Table, Checkbox, Modal, Button, message } from 'antd';

import './style/formConf.less'
/**
 * 系统配置 —— 调查表模块字段配置
 * @Author: 赵俊
 * @Date:   2018-03-08
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-03-08
 */
class FormInvestigateField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldConf: [],
            pFormEnName: props.routeParams.formEnName,
            formEnName: props.routeParams.moudleEnName,
            prdType: props.routeParams.prdType,
            visible: false,        // 编辑窗口显示
            defaultValue: '',       // 默认文本
            record: {},             // 当前编辑模块
            modalKey: 'formInvestigateField',
            formBreadValue: JSON.parse(Config.localItem(Config.formConfLocal.formInvestigateConf)).filter(i => i.formEnName == props.routeParams.formEnName)[0].formChName,
            moduleBreadValue: JSON.parse(Config.localItem(Config.formConfLocal.formInvestigateModule)).filter(i => i.formEnName == props.routeParams.moudleEnName)[0].formChName
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    async componentWillMount() {
        this.getFieldConf()
    }
    // 获取最新数据
    async getFieldConf () {
        const {formEnName, prdType} = this.state
        let fieldConfRes = await FormService.getFieldConf({ formEnName, prdType })
        this.setState({
            fieldConf: fieldConfRes.data
        })
    }
    // 是否必填
    async require (formEnName, fieldEnName, action) {
        const {prdType} = this.state
        let fieldRequireRes = await FormService.postFieldRequire({ formEnName, fieldEnName, action, prdType })
        if (fieldRequireRes) this.getFieldConf()
    }
    // 是否显示
    async show (formEnName, fieldEnName, action) {
        const {prdType} = this.state
        let fieldRequireRes = await FormService.postFieldShow({ formEnName, fieldEnName, action, prdType })
        if (fieldRequireRes) this.getFieldConf()
    }
    confirm = async () => {
        const {record, modalKey, prdType} = this.state
        let value = this.refs.input.value
        // 不采取受控组件
        if(!value.length) return message.error('不能为空')
        if(value.length > 20) return message.error('最多不能超过二十个字')
        let fieldNameRes = await FormService.postFieldName({ fieldEnName: record.fieldEnName, fieldChName: value, formEnName: record.formEnName, prdType })
        // 获取最新字段
        this.getFieldConf()
        if(fieldNameRes) {
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
            defaultValue: record.fieldChName,
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
    render() {
        const {pFormEnName, fieldConf, prdType, visible, modalKey, defaultValue, formBreadValue, moduleBreadValue} = this.state
        const columns = [{
            title: '字段名称',
            dataIndex: 'fieldChName',
            key: 'fieldChName',
            width: '20%'
        }, {
            title: '是否必填',
            dataIndex: 'isrequire',
            key: 'isrequire',
            width: '20%',
            render: (text, record, index) => (
                <Checkbox onChange={() => this.require(record.formEnName, record.fieldEnName, !text)} checked={text} disabled={record.requireBan} />
            )
        }, {
            title: '是否显示',
            dataIndex: 'isshow',
            key: 'isshow',
            width: '20%',
            render: (text, record, index) => (
                <Checkbox onChange={() => this.show(record.formEnName, record.fieldEnName, !text)} checked={text} disabled={record.requireBan} />
            )
        }, {
            title: '操作',
            key: 'action',
            render: (text, record, index) => (
                <span className="form-button" onClick={() => this.edit(record)}>编辑</span>
            )
        }];
        const bcrumb = [{
            'link': '/form',
            'value': '表单配置'
        }, {
            'link': `/form/investigate/${prdType}`,
            'value': '调查表配置'
        }, {
            'link': `/form/investigate/${pFormEnName}/${prdType}`,
            'value': `${formBreadValue}配置`
        }, {
            'link': null,
            'value': `${moduleBreadValue}配置`
		}];
        return (
            <div className="formApplyField-container">
                <BcrumbItem bcrumb={bcrumb} />
                <div className="form-conf-wrapper">
                    <Table
                        rowKey={record => record.fieldEnName}
                        pagination={false}
                        columns={columns}
                        dataSource={fieldConf}
                        className="common-content-container"
                        onChange={this.changeTable}
                    />
                </div>
                <Modal
                    visible={visible}
                    className='form-conf-modal'
                    width={400}
                    onCancel={this.cancel}
                    title="修改字段名称"
                    key={modalKey}
                    footer={null}
                >
                    <div className='form-wrapper'>
                        <span className='form-title'>字段名称</span>
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

export default FormInvestigateField;
