import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import { browserHistory, Link } from 'react-router';

import RuleService from '../../Services/RuleService';//调用数据

import './style/rule.less';
import { Spin, Table, Button, Modal, message, Tabs, Switch } from 'antd';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

/**
 * 规则库列表
 * @Author: 赵俊
 * @Date:   2017-09-20
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-09-20
 */
class RuleIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            ruleList: [],
            configList: [],
            defaultTab: 'logic',
            editInput: true,
            houseCode: '',
            houseValue: '',
            defaultHouseParams: [],
            houseParams: [],
            defaultValuationParams: [],
            valuationParams: [],
            personalParams: [],
            rulePagination: {
                showSizeChanger: true, // 是否可以改变 pageSize
                showQuickJumper: true, // 是否可以快速跳转至某页
                pageSizeOptions: ['5', '10', '15'],// 指定每页可以显示多少条
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`,
                visible: false //模态款控制
            },
            proPagination: {
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
            configParams: {
                prdType: 6
            },
            configuresList: []
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentWillMount() {
        let { params, configParams } = this.state;
        this.getIndustryRule(params)
        this.getConfigures(configParams)
        this.getPictureConfigures(params)
    }
    componentDidMount() {
        const that = this;
        const { routeParams } = that.props;
        that.setState({
            defaultTab: routeParams.tab ? routeParams.tab : 'logic',
        });
    }
    getPictureConfigures(params) { // 获取所有产品配置项
        RuleService.getPictureConfigures(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                const {proPagination} = this.state;
                proPagination.total = res.recordsTotal; // 总页数
                proPagination.current = params.page; // 当前页数
                this.setState({
                    configuresList: data,
                    proPagination
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    delPictureConfigure(params) { // 删除产品配置项
        RuleService.delPictureConfigure(params, (res) => {
            if (res.code == Config.errorCode.success) {
                let { params } = this.state;
                this.getPictureConfigures(params)
            } else {
                message.error(res.msg);
            }
        });
    }
    getIndustryRule(params) { // 行业规则列表
        this.setState({ loading: true });
        RuleService.getIndustryRule(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                const rulePagination = this.state;
                rulePagination.total = res.recordsTotal; // 总页数
                rulePagination.current = params.page; // 当前页数
                this.setState({
                    ruleList: data,
                    loading: false,
                    rulePagination
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    getConfigures(params) { // 获取配置列表
        this.setState({ loading: true });
        if (!params) {
            params = this.state.configParams;
        }
        RuleService.getConfigures(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                let personalParams = [];
                let defaultHouseParams = [];
                let defaultValuationParams = [];
                data.forEach((item, index) => {
                    // 房抵贷产品额度设置 或 估值工具可贷额度设置
                    const { code, prdType, itemId, value } = item;
                    if (prdType == '8') {
                        defaultHouseParams.push({
                            code: code,
                            prdType: prdType,
                            itemId: itemId,
                            value: value
                        })
                    }
                    if (prdType == '-999') {
                        defaultValuationParams.push({
                            code: code,
                            prdType: prdType,
                            itemId: itemId,
                            value: value
                        })
                    }
                    if (prdType == '6' && itemId != '1') {
                        personalParams.push({
                            code: code,
                            prdType: prdType,
                            itemId: itemId,
                            value: value
                        });
                    }
                });
                this.setState({
                    configList: data,
                    defaultHouseParams: defaultHouseParams,
                    houseParams: defaultHouseParams,
                    defaultValuationParams: defaultValuationParams,
                    valuationParams: defaultValuationParams,
                    personalParams: personalParams,
                    loading: false
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    changeTabs = (key) => { // 切换选项卡
        this.setState({
            defaultTab: key
        })
        browserHistory.push('/rule/' + key);
    }
    goRuleDesc = (record) => { // 跳转行业规则详情
        browserHistory.push('/rule/bank/' + record.code);
    }
    addNewRule = (record) => { // 跳转行业规则详情
        browserHistory.push('/rule/add');
    }
    // changeTable = (pagination) => { // 分页、排序、筛选变化时触发
    // 	const {params} = this.state;
    // 	params.page = pagination.current;
    // 	params.rows = pagination.pageSize;
    // 	this.getIndustryRule(params)
    // }
    // 规则删除
    deleteRule = (record) => {
        let that = this;
        let params = { code: record.code };
        let pageParams = that.state.params;
        confirm({
            title: '确认删除',
            content: '您确定要删除该行业规则吗？',
            onOk() {
                RuleService.deleteIndustryRule(params, (res) => {
                    if (res.code == Config.errorCode.success) {
                        message.success('删除成功');
                        that.getIndustryRule(pageParams)
                    } else {
                        message.error(res.msg);
                    }
                });
            },
            onCancel() {
            },
        });
    }
    switchRisk = (result) => { // 服务开启/关闭
        let that = this;
        const { personalParams } = that.state;
        let params = [];
        personalParams.forEach((item, index) => {
            if (item.code == result.code) {
                params.push({
                    code: result.code,
                    itemId: result.itemId,
                    prdType: result.prdType,
                    value: result.value == '1' ? 0 : 1
                })
            } else {
                params.push(item);
            }
        })
        if (result.value == '1') {
            if (result.itemId == 1) {
                confirm({
                    title: '提示',
                    content: '关闭后客户在申请流程将不提供经营流水信息，确认关闭吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onCancel() {
                        that.getConfigures();
                    },
                    onOk() {
                        that.closeSwitch(params)
                    },
                });
            } else if (result.itemId == 2) {
                confirm({
                    title: '提示',
                    content: '关闭后综合授信模型审核后，将不会有人工审批流程，最终授信以综合授信额度为准，确认要关闭吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onCancel() {
                        that.getConfigures();
                    },
                    onOk() {
                        that.closeSwitch(params)
                    },
                });
            }
        } else {
            that.closeSwitch(params)
        }
    }
    deletePhoto = (result) => {	// 删除配置规则
        let that = this;
        let params = {
            prdCode: result.prdCode
        }
        confirm({
            title: '提示',
            content: '确实要删除这条业务规则吗？',
            okText: '确定',
            cancelText: '取消',
            onCancel() {
            },
            onOk() {
                that.delPictureConfigure(params)
            },
        })
    }
    closeSwitch(params) {
        let that = this;
        RuleService.putConfigures(Config.serializeObjectsTwo({ list: params }), (res) => {
            if (res.code == Config.errorCode.success) {
                that.getConfigures();
            } else {
                message.error(res.msg);
            }
        });
    }
    changePut = (e, result, type) => {
        const that = this;
        const { houseParams, valuationParams } = that.state;
        Config.changeValue100(e);
        let params = [];
        if (type == 'house') {
            houseParams.forEach((item, index) => {
                if (item.code == result.code) {
                    params.push({
                        code: result.code,
                        itemId: result.itemId,
                        prdType: result.prdType,
                        value: e.target.value
                    })
                } else {
                    params.push(item);
                }
            })
            this.setState({
                houseParams: params
            })
        }
        if (type == 'valuation') {
            valuationParams.forEach((item, index) => {
                if (item.code == result.code) {
                    params.push({
                        code: result.code,
                        itemId: result.itemId,
                        prdType: result.prdType,
                        value: e.target.value
                    })
                } else {
                    params.push(item);
                }
            })
            this.setState({
                valuationParams: params
            })
        }
    }
    addPhotos = () => {
        browserHistory.push('/rule/photo/add')
    }
    editInput = (type, show) => {
        const that = this;
        const { valuationParams, houseParams, defaultHouseParams, defaultValuationParams } = that.state;
        if (type == 'keepHouse') {
            that.closeSwitch(houseParams);
        }
        if (type == 'cancelHouse') {
            that.setState({
                houseParams: defaultHouseParams
            })
        }
        if (type == 'cancelValuation') {
            that.setState({
                valuationParams: defaultValuationParams
            });
        }
        if (type == 'keepValuation') {
            that.closeSwitch(valuationParams);
        }
        this.setState({
            editInput: type
        });
    }
    changeRuleTable = (page, pageSize) => {
        let that = this
        let params = that.state.params;
        params.page = page.current;
        params.rows = page.pageSize;
        this.getIndustryRule(params);
    }
    changePhotoTable = (page, pageSize) => {
        let that = this
        let params = that.state.params;
        params.page = page.current;
        params.rows = page.pageSize;
        this.getPictureConfigures(params);
    }
    render() {
        const { loading, ruleList, proPagination, rulePagination, defaultTab, configList, editInput } = this.state;
        const columns = [{
            title: '行业名称',
            dataIndex: 'industryText',
            key: 'industryText',
            width: 100,
        }, {
            title: '操作',
            key: 'status',
            width: 100,
            render: (text, record) => (
                <span>
                    <Link className="J_no_detail customer-handle" to={"/rule/detail/" + record.code}>查看</Link>
                    <span className="J_no_detail ant-divider" />
                    <Link className="J_no_detail customer-handle" to={"/rule/add/" + record.code}>编辑</Link>
                    <span className="J_no_detail ant-divider" />
                    <a className="J_no_detail customer-handle" onClick={this.deleteRule.bind(this, record)} style={{ 'color': '#f00' }}>删除</a>
                </span>
            )
        }];
        const columnsPhoto = [{
            title: '产品名称',
            dataIndex: 'name',
            key: 'name',
            width: 100,
        }, {
            title: '操作',
            key: 'status',
            width: 100,
            render: (text, record) => (
                <span>
                    <Link className="J_no_detail customer-handle" to={"/rule/photo/detail/" + record.prdCode}>查看</Link>
                    <span className="J_no_detail ant-divider" />
                    <Link className="J_no_detail customer-handle" to={"/rule/photo/add/" + record.prdCode}>编辑</Link>
                    <span className="J_no_detail ant-divider" />
                    <a className="J_no_detail customer-handle" onClick={() => this.deletePhoto(record)} style={{ 'color': '#f00' }}>删除</a>
                </span>
            )
        }];
        let personalConf = [];
        let houseConf = [];
        let valuatConf = [];
        if (configList && configList.length > 0) {
            configList.filter((item, index) => {
                if (item.prdType == '6' && item.itemId != '1') { // 个体经营贷产品流程定义
                    personalConf.push(item);
                }
                if (item.prdType == '8') { // 房抵贷产品额度设置
                    houseConf.push(item);
                }
                if (item.prdType == '-999') { // 估值工具可贷额度设置
                    valuatConf.push(item);
                }
            })
        }
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="common-tab-container rule-index-container">
                    <Tabs className='template-tabs' defaultActiveKey={defaultTab} activeKey={defaultTab} onChange={this.changeTabs} animated={false}>
                        <TabPane tab="逻辑校验规则" key="logic">
                            <div className="common-tab-content">
                                <div className="common-action-section">
                                    <Button className="common-btn" onClick={this.addNewRule} icon="plus" type="primary">新规则</Button>
                                </div>
                                <Table
                                    rowKey={record => record.code}
                                    columns={columns}
                                    dataSource={ruleList}
                                    pagination={rulePagination}
                                    onChange={this.changeRuleTable}
                                    className="common-content-container"
                                />
                            </div>
                        </TabPane>
                        <TabPane tab="业务规则" key="business">
                            <div className="common-tab-content">
                                <div className="rule-title">
                                    <p className="rule-p">个体经营贷产品流程定义</p>
                                </div>
                                <ul className="rule-list">
                                    {
                                        personalConf.length > 0 && personalConf.map((result, key) => {
                                            return (
                                                <li className="rule-li" key={`personal${key}`}><span className="rule-span">{result.processName}</span><Switch onChange={() => this.switchRisk(result)} checked={result.value == '0' ? false : true} /></li>
                                            );
                                        })
                                    }
                                </ul>
                                <div className="rule-title">
                                    <p className="rule-p">房抵贷产品额度设置
								{
                                            editInput == 'editHouse' ?
                                                <span>
                                                    <span className="edit-input" onClick={() => this.editInput('cancelHouse', true)}>取消</span>
                                                    <span className="edit-input" onClick={() => this.editInput('keepHouse', true)}>保存</span>
                                                </span>
                                                :
                                                <span className="edit-input" onClick={() => this.editInput('editHouse', false)}>编辑</span>
                                        }
                                    </p>
                                </div>
                                <ul className="rule-list">
                                    {

                                        houseConf.length > 0 && houseConf.map((result, key) => {
                                            return (
                                                <li className="rule-li" key={`house${key}`}>
                                                    <span className="rule-span">{result.processName}</span>
                                                    {
                                                        editInput == 'editHouse' ?
                                                            <input className='setting-edit' defaultValue={result.value} onChange={(e) => this.changePut(e, result, 'house')} ref={ref => { this.right = ref }} />
                                                            :
                                                            <span>{result.value}</span>
                                                    }
                                                    <span>%</span>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                                <div className="rule-title">
                                    <p className="rule-p">估值工具可贷额度设置
								{
                                            editInput == 'editValuation' ?
                                                <span>
                                                    <span className="edit-input" onClick={() => this.editInput('cancelValuation', true)}>取消</span>
                                                    <span className="edit-input" onClick={() => this.editInput('keepValuation', true)}>保存</span>
                                                </span>
                                                :
                                                <span className="edit-input" onClick={() => this.editInput('editValuation', false)}>编辑</span>
                                        }
                                    </p>
                                </div>
                                <ul className="rule-list">
                                    {
                                        valuatConf.length > 0 && valuatConf.map((result, key) => {
                                            return (
                                                <li className="rule-li" key={`Valuation${key}`}>
                                                    <span className="rule-span">{result.processName}</span>
                                                    {
                                                        editInput == 'editValuation' ?
                                                            <input className='setting-edit' defaultValue={result.value} onChange={(e) => this.changePut(e, result, 'valuation')} ref={ref => { this.right = ref }} />
                                                            :
                                                            <span>{result.value}</span>
                                                    }
                                                    <span>%</span>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                                <div className="rule-title">
                                    <p className="rule-p">现场调查拍照项配置
									<span className="edit-input" onClick={() => this.addPhotos()}>+新规则</span>:
								</p>
                                </div>
                                <Table
                                    rowKey={record => `configures${record.prdCode}`}
                                    columns={columnsPhoto}
                                    dataSource={this.state.configuresList}
                                    pagination={proPagination}
                                    onChange={this.changePhotoTable}
                                    className="photo-tab"
                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </Spin>
        );
    }
}

export default RuleIndex;
