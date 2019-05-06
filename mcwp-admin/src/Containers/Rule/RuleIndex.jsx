import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import get from 'lodash.get'
import { browserHistory } from 'react-router';
import { Spin, Modal, message, Form, Button, Tabs } from 'antd';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import RuleService from '../../Services/RuleService';//调用数据
import CommonService from '../../Services/CommonService';//调用数据

import RuleLogic from '../../Component/Rule/RuleLogic'//逻辑校验规则
import RulePhotoAdd from '../../Component/Rule/RulePhotoAdd'//现场拍照规则
import RuleMaxAmount from '../../Component/Rule/RuleMaxAmount'//最高可贷额度规则
import RuleDistribution from '../../Component/Rule/RuleDistribution'//客户经理分配规则
import RuleCheck from '../../Component/Rule/RuleCheck'//审查规则
import RuleApproval from '../../Component/Rule/RuleApproval'//审批规则
import RuleLoanafter from '../../Component/Rule/RuleLoanafter'//贷后规则
import ChannelList from '../../Component/Rule/ChannelList'//渠道分配规则
import './style/rule.less';
const TabPane = Tabs.TabPane;
const RuleMaxAmountForm = Form.create()(RuleMaxAmount)
const RuleDistributionForm = Form.create()(RuleDistribution)
const ChannelListForm = Form.create()(ChannelList)
const RulePhotoAddForm = Form.create()(RulePhotoAdd)
const RuleCheckForm = Form.create()(RuleCheck)
const RuleApprovalForm = Form.create()(RuleApproval)
const RuleLoanafterForm = Form.create()(RuleLoanafter)
const flatten = arr => {
    return arr.reduce((acc, value) => {
        const newFields = Object.assign({}, acc.fields, value.fields)
        const newErrs = Object.assign({}, acc.errs, value.errs)
        return Object.assign(acc, { fields: newFields }, { errs: newErrs })
    })
}
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
            code: props.location.query.code,
            type: props.location.query.type,
            chooseTab: '',//选中的tab页
            ruleList: [],//行业列表
            maxAmountList: [],//最高可贷
            channelList: null,//渠道分配规则
            channelNewList:[],
            channelItemList: null,//渠道列表字典
            channelTeamList: null,
            taskPerson: null,//客户经理字典列表
            distributionList: null,//客户经理分配
            disRuleList: [],//客户经理分配规则列表
            disTeamList: [],//客户经理分配小组列表
            photoDetail: [],//拍照规则
            photoDetailDiff: [],//需要对比的数组
            examinerMember: [],//审查员列表
            auditorMember: [],//贷审员列表
            examineMode: [],//审查方式
            auditMode: [],//审批方式
            assignRule: [],//审查的分配规则
            checkDetail: [],//审查规则
            approvalDetail: [],//审批规则
            loanafterList: [],//贷后规则下拉项
            onWayList: [],//贷后规则下拉项
            loanafterDetail: [],//贷后规则
            proCode: '',
            proCodeTab: [],//配置项列表
            rulePagination: {
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
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentWillMount() {
        let { code, type } = this.state;
        // 获取tab标签
        this.getConfiguresTab({ prdType: type });
        // 获取渠道分配原则
        this.getData('getChannelList', { prdCode: code }, 'channelList')
        // 获取客户经理分配原则
        this.getData('getDistribution', { prdCode: code }, 'distributionList')
        // 获取规则下拉项（规则）
        this.getData('getDisRuleItem', {}, 'disRuleList')
        // 获取规则下拉项（小组）
        this.getData('getDisTeamItem', {}, 'disTeamList')
        this.getDictItems({ code: 'scfs,fpgz,spfs' })
        // 获取审查员
        this.getData('getExaminerMember', {}, 'examinerMember')
        // 获取审查规则
        this.getData('getCheckRule', { prdCode: code }, 'checkDetail')
        // 获取贷审员
        this.getData('getAuditorMember', {}, 'auditorMember')
        // 获取审批规则
        this.getData('getApprovalRule', { prdCode: code }, 'approvalDetail')
        // 贷后规则中的下拉项
        this.getData('getLoanAfterItem', {}, 'loanafterList')
        this.getData('getLoanAfterOnWayItem', {}, 'onWayList')
        // 获取贷后规则
        this.getData('getLoanAfter', { prdCode: code }, 'loanafterDetail')
        // 获取渠道列表
        this.getChannelList()
        // 获取客户经理列表
        this.getTaskPerson()
    }
    componentDidMount() {
    }
    // 获取渠道
    getChannelList() {
        Config.get('/v1/channelType/channelType', {}, (res) => {
            this.setState({ loading: false });
            if (res.code == Config.errorCode.success) {
                let tmpArr = []
                res.data.sort((i1, i2) => i1.index - i2.index).map(i => {
                    if (i.dictDTOS && i.dictDTOS.length) {
                        i.dictDTOS.map(i => {
                            tmpArr.push(i)
                        })
                    }
                })
                this.setState({
                    channelItemList: tmpArr
                });
            } else {
                message.error(res.msg);
            }
        })
    }
    // 获取有权限的客户经理
    getTaskPerson() {
        Config.get('/v1/user/role/select', {hasNull: false}, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    taskPerson: res.data
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    async getDictItems(params) {
        const res = await CommonService.getDictItems(params);
        this.setState({
            examineMode: res.data.scfs,
            assignRule: res.data.fpgz,
            auditMode: res.data.spfs
        })
    }
    goBack = () => {
        browserHistory.goBack();
    }
    /**
    * 上传表单
    * @param {url} 地址
    * @param {fields} 表单内容
    */
    putForm(url, fields, method) {
        return new Promise(resolve => {
            if (!fields) return resolve({});
            // if (JSON.stringify(fields) == "{}") return resolve({});
            if (url != '/rule/examine/edit' && url != '/rule/audit/edit') {
                fields.prdCode = this.state.code;
            }
            let params = Config.serializeObjectsTwo(fields);
            for (let key in params) {
                if (params[key] === undefined || params[key] === null || params[key] === '') {
                    // if (/\[/.test(key) && /]/.test(key)) {
                    delete params[key]
                    // } else {
                    //     params[key] = ''
                    // }
                }
                if (typeof params[key] == 'object') {
                    if (Array.isArray(params[key])) {
                        if (params[key].length == 0) {
                            delete params[key]
                        } else {
                            params[key] = params[key][0].unix() * 1000 + ',' + params[key][1].unix() * 1000;
                        }
                    } else {
                        params[key] = params[key].unix() * 1000;
                    }
                }
            }
            if (method == 'post') {
                Config.post(url, params, (res) => {
                    if (res.code == Config.errorCode.success) {
                        resolve('成功');
                    } else {
                        message.error(res.msg);
                    }
                });
            } else {
                Config.put(url, params, (res) => {
                    if (res.code == Config.errorCode.success) {
                        resolve(res);
                    } else {
                        message.error(res.msg);
                        resolve('异常');
                    }
                });
            }
        })
    }
    // 获取表单的数据
    getSubFormValue(formName) {
        let { disRuleList } = this.state;
        return new Promise(resolve => {
            if (this[formName]) {
                this[formName].validateFields((errs, fields) => {
                    if (errs) {
                        message.error('存在不符合要求项，请及时修改')
                    } else {
                        if (formName == 'ruleDistributionForm') {
                            fields.loanAllotConfigureBOList = fields.loanAllotConfigureBOList.map(item => {
                                if (item.value) {
                                    item.value = item.value.join(",");
                                }
                                return item
                            });
                            let tmpValues = JSON.parse(JSON.stringify(fields));
                            let tmpValue = tmpValues.loanAllotConfigureBOList.map(i => { delete i.value; return JSON.stringify(i) })
                            if (tmpValue.length !== [...new Set(tmpValue)].length) {
                                let result = JSON.parse(tmpValue.filter(i => tmpValue.indexOf(i) != tmpValue.lastIndexOf(i))[0])
                                let ddText = disRuleList.filter(i => i.type == result.configType)[0]
                                return message.error(`${ddText.name}重复设置`)
                            }
                        }

                        if (formName == 'channelListForm') {
                            if(get(fields,'loanChannelAllotConfigureBOS')){
                                fields.loanChannelAllotConfigureBOS=fields.loanChannelAllotConfigureBOS.filter(item=>item!='')
                                fields.loanChannelAllotConfigureBOS.map(i => {
                                    if (i.channel) {
                                        i.channel = i.channel.join(',');
                                    }
                                    if (i.value) {
                                        i.value = i.value.join(',');
                                    }
                                    return i;
                                })
                            }
                        }
                        if (formName == 'ruleLoanafterForm') {
                            if(fields.prdCodes){
                                fields.prdCodes=fields.prdCodes.join(',')
                            }
                        }
                        if (formName == 'ruleCheckForm') {
                            fields.examineRules.map(i => {
                                if (i.examineUserId) {
                                    i.examineUserId = i.examineUserId.join(',');
                                }
                                return i;
                            })
                        }
                        if (formName == 'ruleApprovalForm') {
                            fields.auditRules.map(i => {
                                if (i.auditUserId) {
                                    i.auditUserId = i.auditUserId.join(',');
                                }
                                if (i.greaterEqualRule1 || i.greaterEqualRule2) {
                                    i.greaterEqualRule = i.greaterEqualRule1 + ':' + i.greaterEqualRule2;
                                }
                                if (i.lessRule1 || i.lessRule2) {
                                    i.lessRule = i.lessRule1 + ':' + i.lessRule2;

                                }
                                if (i.greaterAndLessRule) {
                                    i.greaterAndLessRule = i.lessRule1 + ':' + i.greaterEqualRule1 + ':' + i.greaterAndLessRule;
                                }
                                delete i.lessRule1;
                                delete i.lessRule2;
                                delete i.greaterEqualRule1;
                                delete i.greaterEqualRule2;
                                return i;
                            })
                        }
                        resolve({ errs, fields })
                    }
                })
            } else {
                resolve({})
            }
        })
    }
    // 获取tab标签
    async getConfiguresTab(params) {
        const res = await RuleService.getConfiguresTab(params);
        if (res.code == Config.errorCode.success) {
            this.setState({
                proCodeTab: res.data,
                chooseTab: res.data.filter(item => item.selected == true)[0].tabKey,
            })
            let { params, code, type } = this.state;
            if (res.data.filter(i => i.tabKey == 'LOGIC_CHECK').length > 0) {
                params.prdCode = code;
                // 行业规则列表
                this.getIndustryRule(params)
            }
            if (res.data.filter((i) => i.tabKey == 'MAX_CREDIT').length > 0) {
                // 最高可贷额度
                this.getData('getMaxConfig', { prdCode: code }, 'maxAmountList')
            }
            if (res.data.filter((i) => i.tabKey == 'SCENE_PHOTO').length > 0) {
                // 拍照规则
                this.getData('getPhoto', { prdCode: code, prdType: type }, 'photoDetail')
            }
        } else {
            message.error(res.msg);
        }
    }
    // 行业规则列表
    getIndustryRule(params) {
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
    // 跳转行业规则详情
    addNewRule = (record) => {
        const { code, type } = this.state;
        browserHistory.push('/rule/add?code=' + code + '&type=' + type);
    }
    // 切换选项卡
    changeTabs = (key) => {
        this.setState({
            chooseTab: key,
        })
    }
    // 切换逻辑规则页码
    changeRuleTable = (page, pageSize) => {
        let that = this
        let params = that.state.params;
        params.page = page.current;
        params.rows = page.pageSize;
        this.getIndustryRule(params);
    }
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
    // 获取数据
    async getData(fetchName, params, dataList) {
        const res = await RuleService[fetchName](params);
        if(fetchName=='getChannelList'){
            if (res.data) {
                let arr=JSON.parse(JSON.stringify(res.data))
                res.data.map(i => {
                    if (i.channel) {
                        i.channel = i.channel.split(",");
                    }
                    if (i.value) {
                        i.value = i.value.split(",");
                    }
                    return i;
                });
                this.setState({
                    channelNewList:arr,
                })
            }
        }
        if (fetchName == 'getDistribution') {
            if (res.data) {
                res.data.map(i => {
                    if (i.value) {
                        i.value = i.value.split(",");
                    } else {
                        delete i.value;
                    }
                    return i;
                });
            }
        }
        if (fetchName == 'getCheckRule') {
            if (res.data) {
                res.data.map(i => {
                    if (i.examineUserId) {
                        i.examineUserId = i.examineUserId.split(",");
                    }
                    return i;
                });
            }
        }
        if (fetchName == 'getApprovalRule') {
            if (res.data) {
                res.data.map(i => {
                    if (i.auditUserId) {
                        i.auditUserId = i.auditUserId.split(",");
                    }
                    return i;
                });
            }
        }
        if (fetchName == 'getLoanAfter') {
            if (res.data) {
                res.data.prdCodes=res.data.prdCodes.split(',');
            }
        }
        if (fetchName == 'getPhoto') {
            if (res.data) {
                let submitArr = [];
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i]) {
                        for (let j = 0; j < res.data[i].configureDTOS.length; j++) {
                            if (res.data[i].configureDTOS[j].ismust) {
                                let arrList = {
                                    itemDict: res.data[i].configureDTOS[j].itemDict
                                }
                                submitArr.push(arrList)
                            }
                        }
                    }
                }
                this.setState({
                    photoDetailDiff: submitArr
                })
            }
        }
        this.setState({
            [dataList]: res.data,
        })
    }
    saveData = () => {
        const { checkDetail } = this.state;
        Promise.all([
            this.getSubFormValue('ruleDistributionForm'),
            this.getSubFormValue('ruleMaxAmountForm'),
            this.getSubFormValue('rulePhotoAddForm'),
            this.getSubFormValue('ruleLoanafterForm'),
            this.getSubFormValue('ruleApprovalForm'),
            this.getSubFormValue('ruleCheckForm'),
            this.getSubFormValue('channelListForm'),
        ]).then(result => {
            let arr = [];
            arr[0] = flatten([result[0]]);
            arr[1] = flatten([result[1]]);
            let oldArr = result[2] && result[2].fields && result[2].fields.configureDTOS;
            if (oldArr) {
                let submitArr = [];
                for (let i = 0; i < oldArr.length; i++) {
                    if (oldArr[i]) {
                        for (let j = 0; j < oldArr[i].length; j++) {
                            if (oldArr[i][j]) {
                                let arrList = {
                                    itemDict: oldArr[i][j]
                                }
                                submitArr.push(arrList)
                            }
                        }
                    }
                }
                result[2].fields.configureDTOS = submitArr;
            }
            arr[2] = flatten([result[2]]);
            arr[3] = flatten([result[3]]);
            arr[4] = flatten([result[4]]);
            arr[5] = flatten([result[5]]);
            if (arr[5].fields) {
                if (arr[4].fields && (!arr[4].fields.auditRules[0].isAudit) && (arr[5].fields.examineRules[0].isExamine)) {
                    return message.error('授信审批已关闭，审查不能开启')
                }
            } else {
                if (arr[4].fields && (!arr[4].fields.auditRules[0].isAudit) && (checkDetail.filter(i => i.examineType == 1)[0].isExamine)) {
                    return message.error('授信审批已关闭，审查不能开启')
                }
            }
            arr[6] = flatten([result[6]]);

            // console.log(arr)
            this.putFormData(arr);
        });
    }
    // 提交数据
    putFormData(arr) {
        const { maxAmountList, loanafterDetail, distributionList, photoDetailDiff, checkDetail, approvalDetail,channelList,channelNewList } = this.state;
        var newArr = [];
        // 分配规则
        if (arr[0].fields) {
            if (arr[0].fields.loanAllotConfigureBOList.length != distributionList.length) {
                newArr.push(this.putForm('/v1/allot/save/configure', arr[0].fields))
            } else {
                if (!Config.diff(arr[0].fields.loanAllotConfigureBOList.map(i => { if (!i.value) delete i.value; return i }), distributionList).isAllSame) {
                    newArr.push(this.putForm('/v1/allot/save/configure', arr[0].fields))
                }
            }
        }
        // 最高可贷
        maxAmountList.map(i => { delete i.processName; delete i.itemType; return i })
        if (arr[1].fields && !Config.diff(arr[1].fields.list, maxAmountList).isAllSame) {
            newArr.push(this.putForm('/v1/configure/process', arr[1].fields))
        }
        // 拍照规则
        if (arr[2].fields) {
            if (arr[2].fields.configureDTOS.length != photoDetailDiff.length) {
                newArr.push(this.putForm('/v1/configure/pictureConfigure', arr[2].fields))
            } else {
                if (!Config.diff(arr[2].fields.configureDTOS, photoDetailDiff).isAllSame) {
                    newArr.push(this.putForm('/v1/configure/pictureConfigure', arr[2].fields))
                }
            }
        }
        // 贷后规则
        if (arr[3].fields && !Config.diff(arr[3].fields, loanafterDetail).isAllSame) {
            newArr.push(this.putForm('/v1/loan/save/configure', arr[3].fields))
        }
        // 审批规则
        if (arr[4].fields && !Config.diff(arr[4].fields.auditRules, approvalDetail).isAllSame) {
            newArr.push(this.putForm('/rule/audit/edit', arr[4].fields))
        }
        // 审查规则
        if (arr[5].fields && !Config.diff(arr[5].fields.examineRules, checkDetail).isAllSame) {
            newArr.push(this.putForm('/rule/examine/edit', arr[5].fields))
        }
        // 渠道配置规则
        if(channelNewList.length>0){
            if (get(arr[6].fields,'loanChannelAllotConfigureBOS') && !Config.diff(arr[6].fields.loanChannelAllotConfigureBOS, channelNewList).isAllSame) {
                newArr.push(this.putForm('/v1/allot/save/channel/configure', arr[6].fields))
            }else{
                newArr.push(this.putForm('/v1/allot/save/channel/configure',{}))
            }
        }else{
            if(get(arr[6].fields,'loanChannelAllotConfigureBOS')){
                newArr.push(this.putForm('/v1/allot/save/channel/configure', arr[6].fields))
            }
        }
        Promise.all(newArr).then(result => {
            if (result.filter((item) => item.code != 0).length == 0) {
                message.success("保存成功");
                browserHistory.push('/rule');

            }
        });
    }
    render() {
        const { loading, ruleList, code, type, rulePagination, chooseTab, proCodeTab, maxAmountList, distributionList, disRuleList, disTeamList, photoDetail, checkDetail, approvalDetail, loanafterDetail, loanafterList, examinerMember, examineMode, assignRule, auditorMember, auditMode, onWayList, channelList, channelItemList,taskPerson } = this.state;
        const bcrumb = [{
            'link': '/rule',
            'value': '规则配置'
        }, {
            'link': null,
            'value': '配置',
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="rule-index-container">
                    <BcrumbItem bcrumb={bcrumb} />
                    <Tabs className='activity-tabs' defaultActiveKey={chooseTab} activeKey={chooseTab} onChange={this.changeTabs} animated={false}>
                        {
                            proCodeTab && proCodeTab.map((item, index) =>
                                <TabPane tab={item.tabName} key={item.tabKey}>
                                    {/* 逻辑校验规则 */}
                                    {item.tabKey == 'LOGIC_CHECK' ? <RuleLogic code={code} type={type} rulePagination={rulePagination} ruleList={ruleList} addNewRule={this.addNewRule} changeRuleTable={this.changeRuleTable} deleteRule={this.deleteRule} /> : null}
                                    {/* 现场拍照规则 */}
                                    {item.tabKey == 'SCENE_PHOTO' ? <RulePhotoAddForm photoDetail={photoDetail} ref={form => { this.rulePhotoAddForm = form }} code={code} type={type} /> : null}
                                    {/* 最高可贷额度规则 */}
                                    {item.tabKey == 'MAX_CREDIT' ? <RuleMaxAmountForm ref={form => { this.ruleMaxAmountForm = form }} maxAmountList={maxAmountList} /> : null}
                                    {/* 渠道分配规则 */}
                                    {item.tabKey == 'CHANNEL_RULE' && channelList&&channelItemList&&disTeamList&&taskPerson ? <ChannelListForm ref={form => { this.channelListForm = form }} len={channelList.length} channelList={channelList} channelItemList={channelItemList} disTeamList={disTeamList} taskPerson={taskPerson}/> : null}
                                    {/* 客户经理分配规则 */}
                                    {item.tabKey == 'ALLOT_RULE' && distributionList && disRuleList && disTeamList ? <RuleDistributionForm ref={form => { this.ruleDistributionForm = form }} len={distributionList.length} distributionList={distributionList} disRuleList={disRuleList} disTeamList={disTeamList} /> : null}
                                    {/* 审查规则 */}
                                    {item.tabKey == 'EXAMINE_RULE' ? <RuleCheckForm ref={form => { this.ruleCheckForm = form }} checkDetail={checkDetail} examinerMember={examinerMember} examineMode={examineMode} assignRule={assignRule} /> : null}
                                    {/* 审批规则 */}
                                    {item.tabKey == 'AUDIT_RULE' ? <RuleApprovalForm ref={form => { this.ruleApprovalForm = form }} type={type} auditorMember={auditorMember} auditMode={auditMode} assignRule={assignRule} approvalDetail={approvalDetail} /> : null}
                                    {/* 贷后规则 */}
                                    {item.tabKey == 'LOAN_AFTER' ? <RuleLoanafterForm ref={form => { this.ruleLoanafterForm = form }} loanafterDetail={loanafterDetail} loanafterList={loanafterList} onWayList={onWayList} /> : null}



                                    {item.tabKey == 'LOGIC_CHECK' ? null : <div className='btn-warp'><Button className="rule-button" type="primary" onClick={this.saveData}>保存</Button>
                                        <Button className="rule-button" onClick={this.goBack}>取消</Button>
                                    </div>}
                                </TabPane>
                            )
                        }
                    </Tabs>
                </div>
            </Spin>
        );
    }
}

export default RuleIndex;
