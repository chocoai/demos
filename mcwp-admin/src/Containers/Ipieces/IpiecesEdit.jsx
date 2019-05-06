import React, { Component } from 'react'; // 引入了React
import { browserHistory } from 'react-router';

import UploadImg from '../../Component/Ipieces/UploadImg';
import DetailLoanInfo from '../../Component/Ipieces/DetailLoanInfo'; // 进件详情查看老客户
import DetailLoanAudit from '../../Component/Ipieces/DetailLoanAudit'; // 进件详情审批信息

import VoiceShortIcon from '../../Component/Ipieces/voiceShortIcon'; // 进件管理 》 编辑调查报告 》 语音速记图标
import VoiceShorts from '../../Component/Ipieces/VoiceShorts'; // 进件管理 》 编辑调查报告 》 语音速记列表
import DetailTopInfo from '../../Component/Ipieces/DetailTopInfo'; // 进件详情头部信息
import ModExplainModal from '../../Component/Modal/ModExplainModal';

import './style/ipiecesEdit.less';
import ExplainImg from './../../Assets/Images/icon_explain.png';
import IpiecesService from '../../Services/IpiecesService';
import CarouselImg from '../../Component/Ipieces/CarouselImg';
import { Config } from '../../Config/Index';
import { fromJS } from 'immutable';
import DetailImg from '../../Component/Ipieces/DetailImg';

// 表单配置传入
import TabConfig from '../../Config/Ipieces/TabConfig'
import BaseInfoConfig from '../../Config/Ipieces/BasicInfo';
import ComBoGuaConfig from '../../Config/Ipieces/ComBoGua';


import { message, Modal, Tabs, Button, Spin, Popover, Radio, Row, Col } from 'antd';
import getContent from '../../Config/Ipieces';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
const RadioGroup = Radio.Group;

const flatten = arr => {
    return arr.reduce((acc, value) => {
        const newFields = Object.assign({}, acc.fields, value.fields)
        const newErrs = Object.assign({}, acc.errs, value.errs)
        return Object.assign(acc, { fields: newFields }, { errs: newErrs })
    })
}

/**
 * 进件编辑
 * @Author: 赵俊
 * @Date:   2017-05-31
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-07-27
 */

class IpiecesEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            fields: {}, // 存放所有fieldsValue
            errs: {},   // 存放所有error
            explainShow: false,          // 查看评分说明
            explainContent: null,   //查看说明对象
            code: props.routeParams.code,
            type: props.routeParams.type,
            businessInfoData: '', //进件基本信息
            businessOtherData: '', //进件其他信息
            businessAnalysisData: '', //进件生产分析
            assetsData: '', //资产信息
            softInfo: '',    //软信息
            logicData: '', //逻辑验证
            balance: '',   //资产负债表
            income: '',  //损益表
            cash: '',    //现金流量表
            farmBalance: '',   //农贷资产负债表
            farmIncome: '',  //农贷损益表
            farmCash: '',    //农贷现金流量表
            loanDownStream: '', //上下游
            farmBase: '', //农贷经营
            guaranteeData: '',
            baseData: '',
            creditHisData: '',
            topInfo: '', //类型判断
            modalVisible: false,
            audioState: 1, //音频状态,开始1,暂停0
            timer: '',
            transTimer: undefined,
            audioError: 0, //无法播放,错误1,正常0
            url: [],
            nowUrl: {},
            nowIndex: 0,
            voiceLength: 0,
            surveyCredit: '',
            eduDict: [],     //学历字典值
            repayPeriod: [], //还款方式字典值
            setMethod: [],   //结算方式字段值
            defaultTabs: "basicInfo",
            defaultTab: '1',
            vShortVisible: false,
            soft: '',
            voiceList: '',
            voiceTran: [],
            pictureInfo: {},             // 照片信息
            preview: false,
            financeValue: 1,
            comeArr: {},
            pictureType: '',              // 获取照片类型
            cashArr: {},
            diffNewArr: [],
            diffNewShow: false,
            showLoanInfo: false,  //是否显示借款列表
            rejectModal: false,
            rebackModalKey: 0,
            spjjyy: '', // 审批拒绝原因
            idcard: false,                 // 身份证还是人脸区别
            confirmLoading: false,
            farmCheck: {
                landLease: '土地租金',
                farmingRepair: '农用设备的维修费',
                taxs: '税款',
                workerSalary: '工人工资',
                employeeMeals: '雇工伙食费',
                overhead: '杂费，管理费',
                houseLease: '房屋租金',
                houseRepair: '房屋修理费用',
                invitationFee: '招待费',
                storageFee: '仓储费用',
                securityFee: '安保费用',
                othBillFee: '其他生意的费用',
                traffic: '私人交通费'
            },
            FormData: [],
            carPrice: 0,
            housePrice: 0,
            machinePrice: 0,
            uploadImg: {
                visible: false,
                type: null
            },
            userAction: 'save', // 用户行为：保存 提价审批
            mismatch: '',
            autoNav: {
                bizInfo: 'busInfo',  //id和所在区域key
                coborrower: 'comLoan',
                creditHis: 'creditHis',
                customer: 'basicInfo',
                guarantor: 'comLoan',
                logicDr: 'logic',
                spouse: 'basicInfo',
            },
            nsr: null,
            flxs: null,
            jylb: null,//经营贷所属行业
        }
    }
    componentWillMount() {
        this.getInfo('/v1/loan/basic', 'baseData', BaseInfoConfig);  //获取基本信息
        this.getInfo('/v1/loan/top', 'topInfo');   //判断生产型还是制造型
        this.getInfo('/v1/loan/verifyResult/mismatch', 'mismatch');        //进件各类校验项不匹配信息
        // this.getInfo('/v1/loan/loanAudit','auditInfo')  //获取审批记录
        this.getDict();                             //查询字典值
        this.getDictCustom()
        this.getSsq()                               // 获取省市区
        this.getVoice();                            //获取音频
        this.getSuveyCredit();                      //征信调查
        this.getSysDictItems();                     //获取拒绝原因
        if (this.props.location.state) {
            this.setState({
                // BUG此处等农贷一起处理，传递方式要修改
                defaultTabs: this.props.location.state.key || 'basicInfo',
                defaultTab: this.props.location.state.tab || '1',
            })
            this.props.location.state = {}
        }
    }
    componentDidMount() {
        const { type } = this.state;
        const that = this
        that.getInfo('/v1/loan/assets', 'assetsData');   //获取资产信息数据
        that.getInfo('/v1/loan/business/info', 'businessInfoData');   //获取进件基本信息
        that.getInfo('/v1/loan/guarantee', 'guaranteeData', ComBoGuaConfig);   //获取共同借款人和担保人
        that.getInfo('/v1/loan/logicVerify/dr', 'logicData');   //获取逻辑验证数据
        that.getInfo('/v1/loan/business/other', 'businessOtherData');   //获取进件其他信息
        that.getInfo('/v1/loan/business/analysis', 'businessAnalysisData');   //获取进件生产，主营业务分析
        that.getInfo('/v1/survey/softLisy', 'softInfo');     //获取软信息
        if (type == 7 || type == 8) {
            that.getInfo('/v1/loan/creditHis', 'creditHisData');   //获取信贷历史
        } else {
            that.getInfo('/v1/loan/creditHis/customer', 'creditHisData');   //获取信贷历史
        }
        if (type == 8) {
            that.getInfo('/v1/loan/proInfo', 'proInfoData');   //获取职业信息
        }
        if (type == 6 || type == 8) { //经验贷请求
            //财务情况资产负债表
            that.getInfo('/v1/loan/assets/info', 'balance');
            //财务情况损益表
            that.getInfo('/v1/loan/assets/incstat', 'income');
            //财务情况现金流量
            that.getInfo('/v1/loan/assets/cash/flow', 'cash');
        } else {
            //财务情况资产负债表
            that.getInfo('/v1/loan/agro/assets', 'farmBalance');
            //财务情况损益表
            that.getInfo('/v1/loan/agro/assets/incstat', 'farmIncome');
            //财务情况现金流量
            that.getInfo('/v1/loan/agro/assets/cash/flow', 'farmCash');
            //经营信息
            that.getInfo('/v1/loan/business/agricultural', 'farmBase'); //获取农贷经营信息
            //上下游
            that.getInfo('/v1/loan/business/agricultural/updowninfo', 'loanDownStream'); //获取上下游信息
        }
        //软信息
        that.getInfo('/v1/survey/softInfo', 'soft');
        this.context.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
    }
    getSysDictItems() { // 获取审批拒绝原因字典值
        Config.get('/v1/sys/dict/items', { code: 'spjjyy,jylb' }, (res) => {
            if (res.code == Config.errorCode.success) {
                if (res.data) {
                    this.setState({
                        spjjyy: res.data.spjjyy,
                        jylb: res.data.jylb
                    });
                }
            } else {
                message.error(res.msg);
            }
        });
    }
    // 权益表字段比较
    pushCome = (type, val) => {
        let comeArr = this.state.comeArr;
        comeArr[type] = parseFloat(val);
        this.setState({
            comeArr: comeArr
        })
    }
    // 现金表字段比较
    pushCash = (type, val) => {
        let cashArr = this.state.cashArr;
        cashArr[type] = parseFloat(val);
        this.setState({
            cashArr: cashArr
        })
    }
    // 获取共同借款人担保人信息
    getGuarantee = (type, val) => {
        this.getInfo('/v1/loan/guarantee', 'guaranteeData');   //获取共同借款人和担保人
    }
    //定时器删除
    routerWillLeave = (nextLocation) => {
        const that = this;
        if (that.state.timer) clearInterval(that.state.timer);
        if (that.state.transTimer) clearInterval(that.state.transTimer);
    }
    //获取音频
    getVoice() {
        const that = this;
        const { code } = that.state;
        IpiecesService.getSurveyList({ busiCode: code, busiType: 1 }, (res) => {
            if (res.code == Config.errorCode.success) {
                if (res.data && res.data.length) {
                    that.setState({
                        voiceLength: res.data.length
                    });
                }
            } else {
                message.error(res.msg);
            }
        })
    }
    getVoiceShort = () => { // 显示语音速记
        const that = this;
        that.setState({
            vShortVisible: true
        });
    }
    //字典值查询
    //学历
    getDict() {
        let params = {
            code: 'education,jsfs,gdlx,hkqs,bcgx,hkfs,znqk,hyzk,ssq,smdsshy,nsr,flxs',
        }
        Config.get('/v1/sys/dict/items/all', params, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    eduDict: res.data.education,
                    education: res.data.education,
                    setMethod: res.data.jsfs,
                    cultiLand: res.data.gdlx,
                    repaymentPeriod: res.data.hkqs,
                    relationship: res.data.bcgx,
                    repaymentKind: res.data.hkfs,
                    znqkKind: res.data.znqk,
                    hyzkKind: res.data.hyzk,
                    ssqList: res.data.ssq,
                    // smdsshy: res.data.smdsshy,
                    nsr: res.data.nsr,
                    flxs: res.data.flxs,
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    getSsq() {
        Config.get('/comm/citizen/v1/ssq', { code: this.state.code }, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    ssqProList: res.data
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    getDictCustom() {
        let params = { ddItem: 'smdsshy,smdjkyt', prdType: this.state.type, enterpriseCode: Config.localItem('ENTERP_CODE') }
        Config.get('/comm/sys/dict/items/custom', params, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    smdsshy: res.data.smdsshy
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    getSuveyCredit = () => {   // 征信调查
        // let type = '/LOAN_PERSON_CREDIT,LOAN_COBORROWER_CREDIT,LOAN_GUARANTEE_CREDIT';
        let type = '/' + Object.values(Config.bizType).join(',')
        let code = this.state.code;
        Config.get('/v1/oss/' + code + type + '/*', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                let { LOAN_PERSON_CREDIT: LOAN_PERSON_CREDIT = '', LOAN_SPOUSE_CREDIT: LOAN_SPOUSE_CREDIT = '', LOAN_COBORROWER_CREDIT: LOAN_COBORROWER_CREDIT = '', LOAN_GUARANTEE_CREDIT: LOAN_GUARANTEE_CREDIT = '' } = res.data
                this.setState({
                    personCredit: LOAN_PERSON_CREDIT,
                    spouseCredit: LOAN_SPOUSE_CREDIT,
                    coborrowerCredit: LOAN_COBORROWER_CREDIT,
                    guaranteeCredit: LOAN_GUARANTEE_CREDIT,
                    pictureInfo: Object.assign(this.state.pictureInfo, res.data),
                });
            } else {
                message.error(res.msg);
            }
        });
    }

    //获取信息
    getInfo(url, type, formConfig) {
        let params = {
            code: this.state.code
        }
        if (type == 'softInfo' || type == 'loanDownStream' || type == 'farmBase' || type == 'farmBalance') {
            params.reqCode = this.state.code
        }
        Config.get(url, params, (res) => {
            if (res.code == Config.errorCode.success) {
                if (type == 'farmIncome') {
                    let { comeArr } = this.state;
                    comeArr.landLease = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.landLease || 0; // 土地租金
                    comeArr.farmingRepair = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.farmingRepair || 0; // 农用设备的维修费
                    comeArr.taxs = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.taxs || 0; // 税款
                    comeArr.workerSalary = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.workerSalary || 0; // 工人工资
                    comeArr.employeeMeals = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.employeeMeals || 0; // 雇工伙食费
                    comeArr.overhead = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.overhead || 0; // 杂费，管理费
                    comeArr.houseLease = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.houseLease || 0; // 房屋租金
                    comeArr.houseRepair = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.houseRepair || 0; // 房屋修理费用
                    comeArr.invitationFee = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.invitationFee || 0; // 招待费
                    comeArr.storageFee = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.storageFee || 0; // 仓储费用
                    comeArr.securityFee = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.securityFee || 0; // 安保费用
                    comeArr.othBillFee = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.othBillFee || 0; // 其他生意的费用
                    comeArr.traffic = res.data && res.data.loanAssetAgroIncstat && res.data.loanAssetAgroIncstat.traffic || 0; // 私人交通费
                    this.setState({
                        comeArr: comeArr
                    });
                }
                if (type == 'farmCash') {
                    let { cashArr } = this.state;
                    cashArr.landLease = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.landLease || 0; // 土地租金
                    cashArr.farmingRepair = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.farmingRepair || 0; // 农用设备的维修费
                    cashArr.taxs = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.taxs || 0; // 税款
                    cashArr.workerSalary = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.workerSalary || 0; // 工人工资
                    cashArr.employeeMeals = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.employeeMeals || 0; // 雇工伙食费
                    cashArr.overhead = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.overhead || 0; // 杂费，管理费
                    cashArr.houseLease = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.houseLease || 0; // 房屋租金
                    cashArr.houseRepair = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.houseRepair || 0; // 房屋修理费用
                    cashArr.invitationFee = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.invitationFee || 0; // 招待费
                    cashArr.storageFee = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.storageFee || 0; // 仓储费用
                    cashArr.securityFee = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.securityFee || 0; // 安保费用
                    cashArr.othBillFee = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.othBillFee || 0; // 其他生意的费用
                    cashArr.traffic = res.data && res.data.loanAssetAgroCashFlow && res.data.loanAssetAgroCashFlow.traffic || 0; // 私人交通费
                    this.setState({
                        cashArr: cashArr
                    });
                }
                if (type == 'balance') {
                    this.setState({
                        priceSum: res.data && res.data[0] && res.data[0].cost || 0
                    });
                }
                if (type == 'assetsData') {
                    let tmpCar, tmpHouse, tmpMachine
                    if (res.data && res.data.loanAssetCars) {
                        tmpCar = res.data.loanAssetCars.reduce((sum, i) => sum += + i.carTotal, 0)
                    }
                    if (res.data && res.data.loanAssetHouses) {
                        tmpHouse = res.data.loanAssetHouses.reduce((sum, i) => sum += + i.houseTotal, 0)
                    }
                    if (res.data && res.data.loanAssetMachines) {
                        tmpMachine = res.data.loanAssetMachines.reduce((sum, i) => sum += + i.balance, 0)
                    }
                    this.setState({
                        carPrice: tmpCar,
                        housePrice: tmpHouse,
                        machinePrice: tmpMachine
                    })
                }
                if (type == 'topInfo') {
                    // 如果tab配置不存在
                    if (!res.data.tabConfig) {
                        // 配置前顺序前端定
                        res.data.tabConfig = TabConfig.filter(i => res.data.tabShow.includes(i.formChName)).map(i => {
                            i.position = res.data.tabShow.findIndex(value => value == i.formChName);
                            return i
                        })
                    } else {
                        // 配置后顺序后端定
                        res.data.tabConfig.sort((i1, i2) => i1.position - i2.position)
                        res.data.tabConfig.map(i => {
                        })
                    }
                    // tab页名字
                    res.data.tabName = {}
                    res.data.tabEnName = []
                    res.data.tabConfig.map(i => {
                        res.data.tabName[i.formEnName] = i.formChName
                        res.data.tabEnName.push(i.formEnName)

                    })
                }
                // 表单配置提前合并
                if (formConfig) {
                    res.data.formConfigMerge = fromJS(formConfig).mergeDeep(res.data.formConfig).toJS()
                    this.setState({
                        [type]: res.data
                    })
                } else {
                    this.setState({
                        [type]: res.data
                    })
                }

            } else {
                message.error(res.msg);
            }
            // 判断结束后再关闭loading
            if (type == 'topInfo') {
                this.setState({
                    loading: false
                })
                Config.countPlus({
                    'env': Config.getReferer(),
                    'userName': Config.localItem('LOGIN_USER'),
                    'enterCode': Config.localItem('ENTERP_CODE')
                }, 'register')
                Config.countPlus({
                    'prodName': res.data.prdName,
                    'prodType': res.data.prdType
                }, 'save')
                Config.countPlus('开始编辑报告', 'send')
            }
        });
    }

    //获取信息
    getPromiseInfo(url, type, itemArr) {
        return new Promise(resolve => {
            let params = {
                code: this.state.code
            }
            Config.get(url, params, (res) => {
                if (res.code == Config.errorCode.success) {
                    this.setState({
                        [type]: res.data
                    })
                    if (itemArr) {
                        // 不是从0到N
                        res.data.loanCoBorrower && res.data.loanCoBorrower.map((i, index) => {
                            let idIndex = itemArr[index]
                            this.editComLoanForm.setFieldsValue({
                                ['loanCoBorrower[' + idIndex + '].loanGuaranteeInfoId']: i.loanGuaranteeInfoId
                            })
                        })
                        res.data.loanGuarantee && res.data.loanGuarantee.map((i, index) => {
                            let idIndex = itemArr[index]
                            this.editComGuaranForm.setFieldsValue({
                                ['loanGuarantor[' + idIndex + '].loanGuaranteeInfoId']: i.loanGuaranteeInfoId
                            })
                        })
                        return
                    }
                    resolve(res.data)
                } else {
                    message.error(res.msg);
                    resolve('')
                }
            });
        })
    }
    /**
     * 上传表单
     * @param {url} 地址
     * @param {fields} 表单内容
     */
    putForm(url, fields, method) {
        return new Promise(resolve => {
            if (!fields) return resolve({});
            if (JSON.stringify(fields) == "{}") return resolve({});
            fields.reqCode = this.state.code;
            let params = Config.serializeObjectsTwo(fields);
            for (let key in params) {
                if (params[key] === undefined || params[key] === null || params[key] === '') {
                    if (/\[/.test(key) && /]/.test(key)) {
                        delete params[key]
                    } else {
                        params[key] = ''
                    }
                }
                if (/loanSpouse.monthIncome|loanSpouse.monthDebt|loanSpouse.creditcardSumamt/.test(key)) {
                    if (params[key] === undefined || params[key] === null || params[key] === '') {
                        delete params[key]
                    }
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
                        resolve('异常');
                    }
                });
            } else {
                Config.put(url, params, (res) => {
                    if (res.code == Config.errorCode.success) {
                        resolve('成功');
                    } else {
                        message.error(res.msg);
                        resolve('异常');
                    }
                });
            }
        })
    }
    // 字段提醒确认提交
    // handleDiffOk = () => {
    //     const { formDataArr, formDataParam, formDataUrl } = this.state;
    //     this.putFormData(formDataArr,formDataParam,formDataUrl);
    //     this.setState({
    //         diffNewShow: false
    //     });
    // }
    // 字段提醒返回修改
    handleDiffCancel = () => {
        this.setState({
            diffNewShow: false
        });
    }
    getAllFieldsValue = (param, url) => {
        this.setState({
            userAction: param
        })
        Promise.all([
            //基本信息表单数据获取0
            this.getSubFormValue('editBaseForm', param),
            //经营基本情况表单数据获取1-2
            this.getSubFormValue('editManageBaseForm', param),
            this.getSubFormValue('editManageSitForm', param),
            //其他经营信息表单数据获取3-6
            this.getSubFormValue('editManageOtherForm', param),
            this.getSubFormValue('editManageOthMainForm', param),
            this.getSubFormValue('editManageOthCusForm', param),
            this.getSubFormValue('editManageOthYearForm', param),
            //生产情况分析表单数据获取7-8
            this.getSubFormValue('editManageTrendForm', param),
            this.getSubFormValue('editManageTypeForm', param),
            //主营业务分析9
            this.getSubFormValue('editManageProForm', param),
            //共同
            //共同借款人表单数据获取10
            this.getSubFormValue('editComLoanForm', param),
            //共同担保人表单数据获取11
            this.getSubFormValue('editComGuaranForm', param),
            //财务情况
            //资产信息资产负债表12
            this.getSubFormValue('editFinanceBalanceForm', param),
            //资产信息损益表13
            this.getSubFormValue('editFinanceIncomeForm', param),
            //资产信息现金流量表14
            this.getSubFormValue('editFinanceCashForm', param),
            //逻辑校验表单数据获取15
            this.getSubFormValue('editLogicForm', param),
            //资产信息表单数据获取16-17
            this.getSubFormValue('editAssetHousesForm', param),
            this.getSubFormValue('editAssetCarsForm', param),
            //软信息18
            this.getSubFormValue('editSoftInfoForm', param),
            //上下游19
            this.getSubFormValue('editManageDownForm', param),
            //农贷经营信息20
            this.getSubFormValue('editManageFarmForm', param),
            //农贷资产信息资产负债表21
            this.getSubFormValue('editFarmBalanceForm', param),
            //农贷资产信息损益表22
            this.getSubFormValue('editFarmIncomeForm', param),
            //农贷资产信息现金流量表23
            this.getSubFormValue('editFarmCashForm', param),
            //资产信息表单机器设备数据获取24
            this.getSubFormValue('editAssetMachineForm', param),
            //职业信息数据获取25
            this.getSubFormValue('editProInfoForm', param),
            //抵质押信息数据获取26
            this.getSubFormValue('editGuarantyForm', param),
            //南郊基本信息配偶数据获取27
            this.getSubFormValue('editNJBaseSpouseForm', param),
        ]).then(result => {
            let arr = [];
            arr[0] = flatten([result[0], result[26], result[27]]);
            arr[1] = flatten([result[1], result[2]]);
            arr[2] = flatten([result[3], result[4], result[5], result[6]]);
            this.state.topInfo && this.state.topInfo.analysisClass ?
                arr[3] = flatten([result[9]]) :
                arr[3] = flatten([result[7], result[8]]);
            arr[4] = flatten([result[10]]);
            arr[5] = flatten([result[11]]);
            arr[6] = flatten([result[12]]);
            arr[7] = flatten([result[13]]);
            arr[8] = flatten([result[14]]);
            arr[9] = flatten([result[15]]);
            arr[10] = flatten([result[16], result[17], result[24]]);
            arr[11] = flatten([result[18]]);
            arr[12] = flatten([result[19]]);
            arr[13] = flatten([result[20]]);
            arr[14] = flatten([result[21]]);
            arr[15] = flatten([result[22]]);
            arr[16] = flatten([result[23]]);
            arr[17] = flatten([result[25]]);
            const { cashArr, comeArr, farmCheck } = this.state;
            let diffArr = Config.getNotEqualProps(cashArr, comeArr);
            if (diffArr && diffArr.length > 0) {
                let newArr = [];
                for (let i = 0; i < diffArr.length; i++) {
                    if (farmCheck.hasOwnProperty(diffArr[i])) {
                        newArr.push(farmCheck[diffArr[i]])
                    }
                }
                this.setState({
                    diffNewArr: newArr,
                    modalVisible: false,
                    diffNewShow: true
                })
            } else {
                this.putFormData(arr, param, url);
            }
        });
    }
    getAllSubFormValue = (param, url) => {
        Promise.all([
            //基本信息表单数据获取0
            this.getSubFormValue('editBaseForm', param),
            //经营基本情况表单数据获取1-2
            this.getSubFormValue('editManageBaseForm', param),
            this.getSubFormValue('editManageSitForm', param),
            //其他经营信息表单数据获取3-6
            this.getSubFormValue('editManageOtherForm', param),
            this.getSubFormValue('editManageOthMainForm', param),
            this.getSubFormValue('editManageOthCusForm', param),
            this.getSubFormValue('editManageOthYearForm', param),
            //生产情况分析表单数据获取7-8
            this.getSubFormValue('editManageTrendForm', param),
            this.getSubFormValue('editManageTypeForm', param),
            //主营业务分析9
            this.getSubFormValue('editManageProForm', param),
            //共同
            //共同借款人表单数据获取10
            this.getSubFormValue('editComLoanForm', param),
            //共同担保人表单数据获取11
            this.getSubFormValue('editComGuaranForm', param),
            //财务情况
            //资产信息资产负债表12
            this.getSubFormValue('editFinanceBalanceForm', param),
            //资产信息损益表13
            this.getSubFormValue('editFinanceIncomeForm', param),
            //资产信息现金流量表14
            this.getSubFormValue('editFinanceCashForm', param),
            //逻辑校验表单数据获取15
            this.getSubFormValue('editLogicForm', param),
            //资产信息表单数据获取16-17
            this.getSubFormValue('editAssetHousesForm', param),
            this.getSubFormValue('editAssetCarsForm', param),
            //软信息18
            this.getSubFormValue('editSoftInfoForm', param),
            //上下游19
            this.getSubFormValue('editManageDownForm', param),
            //农贷经营贷20
            this.getSubFormValue('editManageFarmForm', param),
            //农贷资产信息资产负债表21
            this.getSubFormValue('editFarmBalanceForm', param),
            //农贷资产信息损益表22
            this.getSubFormValue('editFarmBalanceForm', param),
            //农贷资产信息现金流量表23
            this.getSubFormValue('editFarmCashForm', param),
            //资产信息表单机器设备数据获取24
            this.getSubFormValue('editAssetMachineForm', param),
            //职业信息数据获取25
            this.getSubFormValue('editProInfoForm', param),
            //抵质押信息数据获取26
            this.getSubFormValue('editGuarantyForm', param),
            //南郊基本信息配偶数据获取27
            this.getSubFormValue('editNJBaseSpouseForm', param),
        ]).then(result => {
            console.log('获取表单数据')
        });
    }
    putFormData(arr, param, url) {
        Promise.all([
            //基本信息
            this.putForm('/v1/loan/basic', arr[0].fields),
            //经营基本情况
            this.putForm('/v1/loan/business/info', arr[1].fields),
            //其他经营信息
            this.putForm('/v1/loan/business/other', arr[2].fields),
            this.state.topInfo && this.state.topInfo.analysisClass ?
                this.putForm('/v1/loan/business/analysis/ordinary', arr[3].fields) :    //主营业务分析
                this.putForm('/v1/loan/business/analysis/production', arr[3].fields), //生产情况分析
            //共同借款人
            (arr[4].fields && arr[4].fields.loanCoBorrower) || (arr[5].fields && arr[5].fields.loanGuarantor) ?
                this.putForm('/v1/loan/guarantee', { loanCoBorrower: arr[4].fields ? arr[4].fields.loanCoBorrower : {}, loanGuarantor: arr[5].fields ? arr[5].fields.loanGuarantor : {} }, 'post')
                : this.putForm('/v1/loan/guarantee', null, 'post'),
            //共同担保人
            // this.putForm('/v1/loan/guarantee',arr[5].fields, 'post'),
            //财务情况
            //资产信息资产负债表
            this.putForm('/v1/loan/assets/info', arr[6].fields),
            //资产信息损益表
            this.putForm('/v1/loan/assets/incstat', arr[7].fields),
            //资产信息现金流量表
            this.putForm('/v1/loan/assets/cash/flow', arr[8].fields),
            //逻辑校验表单数据
            this.putForm('/v1/loan/logicVerify', arr[9].fields),
            //资产信息表单数据
            this.putForm('/v1/loan/assets', arr[10].fields),
            //软信息
            this.putForm('/v1/survey/editSoftInfo', arr[11].fields, 'post'),
            //上下游
            this.putForm('/v1/loan/business/agricultural/updowninfo', arr[12].fields, 'put'),
            //农贷经营贷
            this.putForm('/v1/loan/business/agricultural', arr[13].fields, 'put'),
            //农贷资产信息资产负债表
            this.putForm('/v1/loan/agro/assets', arr[14].fields),
            //农贷资产信息损益表
            this.putForm('/v1/loan/agro/assets/incstat', arr[15].fields),
            //农贷资产信息现金流量表
            this.putForm('/v1/loan/agro/assets/cash/flow', arr[16].fields),
            //个体经营贷职业信息表
            this.putForm('/v1/loan/editProInfo', arr[17].fields, 'post'),
        ]).then(result => {
            // 此处代码待优化
            result.map((item, index) => {
                if (item == '异常') {
                    this.submitLoading = false
                    // if(index == 0) message.error('基本信息存在异常，请联系运维人员')
                    // if(index == 1) message.error('经营基本情况存在异常，请联系运维人员')
                    // if(index == 2) message.error('其他经营信息存在异常，请联系运维人员')
                    return;
                }
            })
            if (result.includes('异常')) return;
            this.getInfo('/v1/loan/business/analysis', 'businessAnalysisData');   //获取进件生产，主营业务分析
            //此处用于以后添加返回结果的处理
            if (param == 'put') {
                this.changeStatus();
                return;
            }
            if (param == 'autoSave') {
                return;
            }
            if (param == 'link') {
                // winHandler.location.href = url
                browserHistory.push(url)
                // return;
            }
            if (param == 'save') {
                Config.countPlus('保存编辑报告', 'send')
            }
            message.success('保存成功');
        });
    }

    getSubFormValue(formName, param) {
        return new Promise(resolve => {
            if (this[formName]) {
                this[formName].validateFields((errs, fields) => {
                    if (errs) {
                        // if (param == 'link') {
                        message.destroy()
                        message.error('存在不符合要求项，请先修改')
                        //     return;
                        // }
                        // message.destroy()
                        // message.error('存在不符合要求项，请及时修改')
                        // if (param == 'put') {
                        //     message.destroy()
                        //     message.error('存在不符合要求项，请及时修改')
                        // } else {
                        //     resolve({errs, fields})
                        // }
                        // resolve({ errs, fields })
                    } else {
                        //房产信息省市区信息格式化暂时处理
                        if (formName == 'editAssetHousesForm') {
                            for (let i = 0; i < fields.loanAssetHouseDtolist.length; i++) {
                                for (let key in fields.loanAssetHouseDtolist[i]) {
                                    if (fields.loanAssetHouseDtolist[i][key] && fields.loanAssetHouseDtolist[i][key].__proto__.constructor == Array) {
                                        fields.loanAssetHouseDtolist[i][key] = fields.loanAssetHouseDtolist[i][key].join('/')
                                    }
                                }
                            }
                            resolve({ errs, fields })
                        } else if (formName == 'editManageBaseForm') {
                            if (fields.loanBusinessEntityDto.scope) {
                                fields.loanBusinessEntityDto.scope = fields.loanBusinessEntityDto.scope[1]
                            }
                            resolve({ errs, fields })
                        } else {
                            resolve({ errs, fields })
                        }
                    }
                })
            } else {
                resolve({})
            }
        })
    }
    //提交审批
    // todo
    changeStatus() {
        const { code, type } = this.state
        let params = {
            code
        }
        // 目前 13 特殊处理
        if (Object.keys(Config.ipiecesTypeConfig).includes(type)) {
            this.setState({
                confirmLoading: true
            })
            Config.post(Config.ipiecesTypeConfig[type].finalAuditUrl, { code }, (res) => {
                this.submitLoading = false
                if (res.code == Config.errorCode.success) {
                    browserHistory.push('/ipieces/operate')
                } else {
                    this.setState({
                        confirmLoading: false
                    })
                    message.error(res.msg);
                }
            });
            return;
        } else {
            Config.put('/v1/loan/audit/submit', params, (res) => {
                this.submitLoading = false
                if (res.code == Config.errorCode.success) {
                    this.setState({
                        modalVisible: false,
                    });
                    Config.countPlus('提交审批报告', 'send')
                    message.success('提交成功！');
                    browserHistory.push('/ipieces');
                } else {
                    message.error(res.msg);
                }
            });
        }
    }
    showModal = () => {
        this.setState({
            modalVisible: true
        });
    }
    showReject = () => {
        this.setState({
            rejectModal: true
        });
    }
    closeReject = () => {
        this.setState({
            rejectModal: false,
            rebackModalKey: this.state.rebackModalKey + 1
        });
    }
    handleOk = (e) => {
        const { code, type } = this.state
        // 市民贷，提交审批
        if (type == 12) {
            this.setState({
                confirmLoading: true
            })
            Config.post('/v1/loan/citizen/finalAudit', { code }, (res) => {
                if (res.code == Config.errorCode.success) {
                    browserHistory.push('/ipieces/operate')
                } else {
                    this.setState({
                        confirmLoading: false
                    })
                    message.error(res.msg);
                }
            });
            return;
        } else {
            // todo
            if (this.submitLoading) return;
            this.submitLoading = true
            this.getAllFieldsValue('put');
        }
    }
    handleCancel = (e) => {
        this.setState({
            modalVisible: false,
        });
    }
    showExplainModal = (object) => {
        this.setState({
            explainShow: true,
            explainContent: object
        })
    }
    closeExplainModal = () => {
        this.setState({
            explainShow: false
        })
    }
    approvalReject = () => {
        const { code, rejectReason, rejectReasonOther, type } = this.state;
        if (!rejectReason) return message.error('请选择审批拒绝原因');
        if (rejectReason == 15 && !rejectReasonOther) return message.error('请输入其他原因')
        if (rejectReason == 15 && rejectReasonOther.length > 64) return message.error('其他原因不能超过64个字')
        const params = {
            code: code,
            rejectReason: rejectReason,
            rejectReasonOther: rejectReason == 15 ? rejectReasonOther : ''
        };
        if (Config.ipiecesShow.ipiecesEditReject.includes(+type)) {
            Config.post('/v1/loan/audit/citizen/reject', params, (res) => {
                if (res.code == Config.errorCode.success) {
                    message.success(res.msg);
                    this.setState({
                        reBackReason: false
                    })
                    browserHistory.push('/ipieces/operate');
                } else {
                    message.error(res.msg)
                }
            })
        } else {
            Config.put('/v1/loan/audit/reject/cm', params, (res) => {
                if (res.code == Config.errorCode.success) {
                    message.success(res.msg);
                    this.setState({
                        reBackReason: false
                    })
                    browserHistory.push('/ipieces/operate');
                } else {
                    message.error(res.msg)
                }
            })
        }
    }
    changeRadio(e) {
        const value = e.target.value,
            ddtext = e.target.ddtext,
            reasonOtherContent = this.reasonOtherContent;
        if (ddtext == '其他') {
            reasonOtherContent.style.display = 'inline-block';
        } else {
            reasonOtherContent.style.display = 'none';
        }
        this.setState({
            rejectReason: value
        });
    }
    changeInput = (inp, e, value) => { // input值变化
        this.setState({
            [inp]: e.target.value
        });
    }
    // creatAudio = (e) => {
    //     let audioNative = this.audioNative;
    //     let audioStart = this.audioStart;
    //     let audioEnd = this.audioEnd;
    //     let audioNow = this.audioNow;
    //     //音频的元数据已加载
    //     audioNative.addEventListener('loadedmetadata', () => {
    //         audioEnd.innerHTML = Config.conversion(audioNative.duration);
    //         audioStart.innerHTML = Config.conversion(audioNative.currentTime);
    //         audioNow.style.width = audioNative.currentTime / audioNative.duration.toFixed(3) * 100 + '%';
    //     })
    //     //发生错误无法播放
    //     audioNative.addEventListener('error', () => {
    //         this.setState({
    //             audioError: 1
    //         })
    //     })
    //准备好开始播放
    // audioNative.addEventListener('canplay', () => {
    //     this.setState({
    //         audioError: 0
    //     })
    // })
    // }
    // audioBarChange = (e) => {
    //     if(this.state.audioError) return;
    //     let coordStart = this.audioBar.getBoundingClientRect().left;
    //     let coordEnd = e.pageX;
    //     let p = (coordEnd - coordStart) / this.audioBar.offsetWidth;
    //     this.audioNow.style.width = p.toFixed(3) * 100 + '%';
    //     this.audioNative.currentTime = p * this.audioNative.duration;
    //     // this.audioPlay();
    //     if(!this.state.audioState) return;
    //     this.audioNative.play();
    //     // this.audioPlaySoon();
    //     let timer = setInterval(() => {
    //         this.audioStart.innerHTML = Config.conversion(this.audioNative.currentTime);
    //         this.audioEnd.innerHTML = Config.conversion(this.audioNative.duration);
    //         this.audioNow.style.width = this.audioNative.currentTime / this.audioNative.duration.toFixed(3) * 100 + '%';
    //     }, 1000);
    //     this.setState({
    //         audioState: 0,
    //         timer : timer
    //     })
    // }
    audioPlay = (e) => {
        if (this.state.audioError) return;
        this.audioNative.play();
        if (!this.state.audioState) return;
        this.audioPlaySoon();
        let timer = setInterval(() => {
            this.audioStart.innerHTML = Config.conversion(this.audioNative.currentTime);
            this.audioEnd.innerHTML = Config.conversion(this.audioNative.duration);
            this.audioNow.style.width = this.audioNative.currentTime / this.audioNative.duration.toFixed(3) * 100 + '%';
        }, 1000);
        this.setState({
            audioState: 0,
            timer: timer
        })
    }
    audioStop = (e) => {
        this.audioNative.pause();
        this.setState({
            audioState: 1
        });
        clearInterval(this.state.timer);
    }
    audioPlaySoon = () => {
        this.audioStart.innerHTML = Config.conversion(this.audioNative.currentTime);
        this.audioNow.style.width = this.audioNative.currentTime / this.audioNative.duration.toFixed(3) * 100 + '%';
    }
    // id存在即为转化，避免全部更新导致音频播放重置
    getSurveyList = (timer, id) => {
        const that = this;
        const { code } = that.state;
        IpiecesService.getSurveyList({ busiCode: code, busiType: 1 }, (res) => {
            if (res.code == Config.errorCode.success) {
                let voiceTraning = [];
                if (res.data) {
                    res.data.map((item, index) => {
                        if (item && item.loanSurveyInfoDTOS && item.loanSurveyInfoDTOS.length > 0) {
                            item.loanSurveyInfoDTOS.map((itemDto, indexDto) => {
                                if (itemDto.status == 2) voiceTraning.push(itemDto.infoId);
                            })
                        }
                    });
                    if (voiceTraning.length == 0 && timer) clearInterval(timer);
                }

                that.setState({
                    voiceList: res.data
                });
            } else {
                message.error(res.msg);
            }
        })
    }
    goTranslate = (id) => { // 转文字
        const that = this;
        const params = {
            infoId: id
        };
        IpiecesService.translateVoice(params, (res) => {
            if (res.code == Config.errorCode.success) {
                that.getSurveyList(undefined, id);
                let transTimer = setInterval(function () {
                    that.getSurveyList(transTimer, id);
                }, 5000);
            } else {
                message.error(res.msg);
            }
        })
    }
    closeModal = () => { // 关闭弹窗
        const that = this;
        clearInterval(that.state.transTimer);
        that.setState({
            vShortVisible: false,
            transTimer: undefined
        });
    }

    changeTabs = (key) => {
        const { type } = this.props.routeParams
        const { carPrice, housePrice, machinePrice } = this.state
        if (key == 'logic') {
            this.getAllFieldsValue('autoSave');
            this.getInfo('/v1/loan/logicVerify/dr', 'logicData');   //获取逻辑验证数据
        } else {
            this.getAllSubFormValue('autoTest');
        }
        if (key == 'analysisBus' || key == 'analysisPro') {
            this.getInfo('/v1/loan/business/analysis', 'businessAnalysisData');   //获取进件生产，主营业务分析
        } else if (key == 'finance' && (type == 6 || type == 8)) {
            this.setState({
                priceSum: (carPrice + housePrice + machinePrice) * 10000 + ''
            }, () => {
                setTimeout(() => {
                    this.editFinanceBalanceForm.setFieldsValue({
                        'loanAssetFinalInfo.cost': this.state.priceSum,
                        'loanAssetBeginInfo.cost': this.state.priceSum
                    })
                }, 0)
            })
        }
        if (key == 'finance') {
            Config.countPlus('财务情况—资产负债表', 'send')
        }
    }
    linkTo = (url) => {
        this.getAllFieldsValue('link', url);
    }
    // 此处要对担保人做个判断
    showPicture = (type, code) => {
        const { pictureInfo } = this.state
        if (type == 'LOAN_GUARANTEE_CREDIT') {
            let obj = pictureInfo;
            obj[type] = obj[type].filter(i => i.bizCode == code)
            this.setState({
                pictureType: type,
                previewPic: true,
                pictureInfo: obj
            })
        } else {
            this.setState({
                pictureType: type,
                previewPic: true
            });
        }
    }
    showDetail = (idcard) => {
        if (idcard == "idcard") {
            this.setState({
                detailPic: true,
                idcard: 'idcard'
            })
        } else {
            this.setState({
                detailPic: true,
                idcard: 'name'
            })
        }
    }
    previewHide = (type) => {
        const { guaranteeCredit, pictureInfo } = this.state
        let obj = pictureInfo;
        obj['LOAN_GUARANTEE_CREDIT'] = guaranteeCredit;
        this.setState({
            [type]: false,
            pictureInfo: obj,
            idcard: ''
        });
    }
    financeChange = (value) => {
        if (value == 1) Config.countPlus('财务情况—资产负债表', 'send')
        if (value == 2) Config.countPlus('财务情况—损益表', 'send')
        if (value == 3) Config.countPlus('财务情况—现金流量表', 'send')
        this.setState({
            financeValue: value,
            defaultTab: value,
        });
    }
    showLoanModal = () => { // 设置模态对话框
        this.setState({
            showLoanInfo: true,
        });
    }
    handleLoanOk = () => {
        this.setState({
            showLoanInfo: false,
        });
    }
    handleLoanCancel = () => {
        this.setState({
            showLoanInfo: false,
        });
    }

    // 资产信息中所有房产、车辆、机器设备的价格之和等于资产负债表中的“固定资产原价”
    loanAssetInfoCost = (type, value) => {
        let numValue = parseFloat(value)
        if (isNaN(numValue)) numValue = 0
        this.setState({
            [type]: numValue,
        })
    }

    // 核身模型验证
    postIdentityVerify = (index, type, itemArr, fn) => {
        let that = this
        // this.setState({
        //     loading: true
        // })
        Promise.all([
            //共同借款人和担保人
            that.getSubFormValue('editComLoanForm'),
            that.getSubFormValue('editComGuaranForm')
        ]).then(result => {
            let arr = [];
            arr[0] = flatten([result[0]]);
            arr[1] = flatten([result[1]]);
            return (arr[0].fields && arr[0].fields.loanCoBorrower) || (arr[1].fields && arr[1].fields.loanGuarantor) ?
                that.putForm('/v1/loan/guarantee', { loanCoBorrower: arr[0].fields ? arr[0].fields.loanCoBorrower : {}, loanGuarantor: arr[1].fields ? arr[1].fields.loanGuarantor : {} }, 'post')
                : that.putForm('/v1/loan/guarantee', null, 'post')
        }).then(result => {
            if (result == '成功') {
                return that.getPromiseInfo('/v1/loan/guarantee', 'guaranteeData')
            }
        }).then(result => {
            if (result) {
                let params = { code: result[type][index].code }
                IpiecesService.postIdentityVerify(params, (res) => {
                    if (res.code == Config.errorCode.success) {
                        // that.getGuarantee();
                        that.getPromiseInfo('/v1/loan/guarantee', 'guaranteeData', itemArr)
                        fn && fn()
                    } else if (res.code == 'IDENTITY_MODEL_DONE') {
                        message.success(res.msg);
                    } else {
                        message.error(res.msg);
                    }
                })
            }
            // this.setState({
            //     loading: false
            // })
        })

    }
    // 征信模型模型编辑
    postCreditVerify = (index, type, itemArr) => {
        let that = this
        Promise.all([
            //共同借款人和担保人
            that.getSubFormValue('editComLoanForm'),
            that.getSubFormValue('editComGuaranForm')
        ]).then(result => {
            let arr = [];
            arr[0] = flatten([result[0]]);
            arr[1] = flatten([result[1]]);
            return (arr[0].fields && arr[0].fields.loanCoBorrower) || (arr[1].fields && arr[1].fields.loanGuarantor) ?
                that.putForm('/v1/loan/guarantee', { loanCoBorrower: arr[0].fields ? arr[0].fields.loanCoBorrower : {}, loanGuarantor: arr[1].fields ? arr[1].fields.loanGuarantor : {} }, 'post')
                : that.putForm('/v1/loan/guarantee', null, 'post')
        }).then(result => {
            if (result == '成功') {
                return that.getPromiseInfo('/v1/loan/guarantee', 'guaranteeData')
            }
        }).then(result => {
            if (result) {
                if (result.prdType == '6') {
                    if (type == 'loanCoBorrower') {
                        that.linkTo('/ipieces/detail/loan/' + result[type][index].code)
                    } else {
                        that.linkTo('/ipieces/detail/guaran/' + result[type][index].code)
                    }
                } else {
                    that.linkTo('/ipieces/details/' + result[type][index].code)
                }
                // if(type == 'loanCoBorrower') {
                //     that.linkTo('/ipieces/detail/loan/'+ result[type][index].code)
                // } else {
                //     that.linkTo('/ipieces/detail/guaran/'+ result[type][index].code)
                // }
            }
        })
    }
    openUploadImg = (type) => {
        this.setState({
            uploadImg: Object.assign(this.state.uploadImg, { visible: true, type })
        })
    }
    closeUploadImg = (e) => {
        this.setState({
            uploadImg: Object.assign(this.state.uploadImg, { visible: false })
        })
    }
    //自动跳转到相应部分
    autoNav = (activeKey, id) => {
        //此处增加动画关闭处理，否则跳转的时候获取位置会出错，容易出现tab部分消失
        //动画不开启则不用处理
        this.setState({
            activeKey,
            animated: false
        }, () => {
            document.getElementById(id).scrollIntoView();
            this.setState({
                animated: true
            })
        })
    }
    goBack() {
        browserHistory.goBack()
    }
    render() {
        const that = this;
        const { confirmLoading, idcard, type, mismatch, loading, code, uploadImg, baseData, topInfo, defaultTabs, vShortVisible, voiceLength, voiceList, pictureInfo, pictureType, previewPic, rejectModal, spjjyy, smdsshy, nsr, explainShow, explainContent } = that.state;
        // type 6 经营贷  7 农贷
        const creContent = (
            <div>
                <p className="creContent-p">征信较差:分值范围[-,490]</p>
                <p className="creContent-p">征信一般:分值范围[490,510]</p>
                <p className="creContent-p">征信良好:分值范围[510,530]</p>
                <p className="creContent-p">征信优秀:分值范围[530,+]</p>
            </div>
        );
        let arr = [];
        if (mismatch) {
            for (let key in mismatch) {
                if (key == 'guarantorMismatch' && mismatch[key]) {
                    mismatch[key].map((item, index) => arr.push({ title: 'coborrower', content: `${item}` }))
                    continue
                }
                if (mismatch[key]) arr.push({ title: key.slice(0, -8), content: `${mismatch[key]}` })
            }
        }
        const bcrumb = [{
            'link': '/ipieces/operate',
            'value': '进件管理'
        }, {
            'link': null,
            'goBack': true,
            'value': '查看调查报告'
        }, {
            'link': null,
            'value': '编辑调查报告'
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                {uploadImg.visible && <UploadImg code={code} type={uploadImg.type} visible={uploadImg.visible} openUploadImg={this.openUploadImg} closeUploadImg={this.closeUploadImg} />}
                <div className='ipieces-edit-container'>
                    <BcrumbItem bcrumb={bcrumb} />
                    <div className="ipieces-edit-content">
                        {/*<EditAudio />*/}
                        <div style={{ overflow: 'hidden' }}>
                            {
                                (baseData && baseData.loanAuditVOList && baseData.loanAuditVOList.length != 0) ?
                                    <DetailLoanAudit loanAuditVOList={baseData.loanAuditVOList} />
                                    : null
                            }
                            {/* 代码长度增加则改为公共组件 */}
                            {
                                baseData && baseData.loanOperatorVO && !baseData.loanOperatorVO.loanOver && baseData.loanOperatorVO.escortCustomer ?
                                    <p style={{ lineHeight: '34px', float: 'right' }}>
                                        {
                                            baseData.loanOperatorVO.mainCustomer ?
                                                <span>主调客户经理：{baseData.loanOperatorVO.mainCustomer}</span>
                                                : null
                                        }
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                            {
                                            baseData.loanOperatorVO.mainCustomer ?
                                                <span>陪调客户经理：{baseData.loanOperatorVO.escortCustomer}</span>
                                                : null
                                        }
                                    </p>
                                    : null
                            }
                        </div>
                        {
                            topInfo.auditStatus && topInfo.auditStatus == '征信审核通过' ?
                                <div className='result-container'>
                                    <div className='result-show'>
                                        <p className='result-type'>审核结果: <span className='result-final-pass'>{topInfo.auditStatus}</span></p>
                                        <p className='result-reason'>
                                            <span>评分: {topInfo.pbocStore}</span><span>({topInfo.pbocScore < 490 ? '征信较差' : 490 < topInfo.pbocScore && topInfo.pbocScore < 510 ? '征信一般' : 510 < topInfo.pbocScore && topInfo.pbocScore < 530 ? '征信良好' : '征信优秀'})</span>
                                            <Popover placement="rightTop" overlayClassName="explain-popover" content={creContent} trigger="hover">
                                                <img className='credit-on-img' src={ExplainImg} alt='creditOnImg' />
                                            </Popover>
                                        </p>
                                    </div>
                                </div>
                                : null
                        }
                        {
                            arr && arr.length > 0 ?
                                <div className='result-container'>
                                    <div className='result-content-wrapper'>
                                        {
                                            arr.map((item, index) => (
                                                <p key={index}><span className='result-content' style={{ cursor: 'auto' }}>{item.content}</span></p>
                                            ))
                                        }
                                    </div>
                                </div>
                                : null
                        }
                        {
                            this.state.showLoanInfo ?
                                <Modal
                                    title="贷款记录"
                                    visible={this.state.showLoanInfo}
                                    onOk={this.handleLoanOk}
                                    onCancel={this.handleLoanCancel}
                                    wrapClassName='loanInfo-modal'
                                    width={580}
                                    footer=""
                                >
                                    <DetailLoanInfo customerLoanList={topInfo.loanReqRecord} customerBorrowList={topInfo.borrowInfoRecord} />
                                </Modal>
                                : null
                        }
                        <DetailTopInfo topInfo={topInfo} showModal={this.showLoanModal} type={type} />
                        <Tabs defaultActiveKey={defaultTabs} onChange={this.changeTabs}>
                            {/* {
                                topInfo.tabShow?
                                    tabArr.filter((item, index)=>(topInfo.tabShow.includes(item.name) && item.type.includes(type))).map(item=>item.content):null
                            } */}
                            {getContent(this, 'editContent')}
                        </Tabs>
                        <div>
                            <Button className='submit' type="primary" onClick={this.showModal}>提交审批</Button>
                            {/* BTNJ 14 SYNS 15 暂时删除 E3.1.1 */}
                            {
                                type == 14 || type == 15 || type == 16 || type == 17 ? null :
                                    <Button className="reject" type="primary" onClick={this.showReject}>审批拒绝</Button>
                            }
                            <Button className='save' type="primary" onClick={() => this.getAllFieldsValue('save')}>保存</Button>
                        </div>
                        <Modal
                            visible={this.state.modalVisible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            confirmLoading={confirmLoading}
                            wrapClassName={'edit-ipieces-submit'}
                        >
                            <p>提交后信息不可修改，确认要提交吗？</p>
                        </Modal>
                        <Modal
                            visible={rejectModal}
                            className='rejects-modal'
                            onCancel={this.closeReject}
                            key={this.state.rebackModalKey}
                            title="拒绝原因"
                            footer={[
                                <Button key="cancel" className='reback-button' size="large" onClick={this.closeReject}>取消</Button>,
                                <Button key="ok" className='reback-button' type="primary" size="large" onClick={this.approvalReject}>确定</Button>
                            ]}
                        >
                            <RadioGroup onChange={(e) => { this.changeRadio(e) }}>
                                <Row>
                                    {
                                        spjjyy ? spjjyy.map((info, index) => (
                                            info.ddText == '其他' ?
                                                <Col key={index} span={24} style={{ padding: '15px 0' }}>
                                                    <Radio ddtext={info.ddText} value={info.ddValue}>{info.ddText}</Radio><input ref={ref => { this.reasonOtherContent = ref }} className="ant-input" onChange={this.changeInput.bind(this, 'rejectReasonOther')} style={{ width: '80%', marginLeft: '20px', display: 'none' }} placeholder="请输入授信拒绝原因" />
                                                </Col> :
                                                <Col key={index} span={12} style={{ padding: '15px 0' }}>
                                                    <Radio value={info.ddValue}>{info.ddText}</Radio>
                                                </Col>
                                        )) : null
                                    }
                                </Row>
                            </RadioGroup>
                        </Modal>
                    </div>
                    {
                        this.state.diffNewArr ?
                            <Modal
                                visible={this.state.diffNewShow}
                                className='confirm-modal'
                                title="字段确认"
                                onCancel={this.handleDiffCancel}
                                wrapClassName={'confirm-diff-modal'}
                                footer={[
                                    <Button key="back" size="large" onClick={this.handleDiffCancel}>确认</Button>
                                ]}
                            >
                                <p className="tip-p">现金流量表与损益表中,以下数据项不一致，请修改后重新提交:</p>
                                {
                                    this.state.diffNewArr ?
                                        <p className='secure-title'>{this.state.diffNewArr.join("、")}</p>
                                        : null
                                }
                            </Modal> : null
                    }
                    {
                        explainShow && <ModExplainModal mVisible={explainShow} closeExplainModal={() => this.closeExplainModal()} topInfo={explainContent} ></ModExplainModal>
                    }
                    {voiceLength > 0 ? <VoiceShortIcon onClick={this.getVoiceShort} visible={vShortVisible} /> : null}
                    {/* { vShortVisible ? <VoiceShorts translateVoice={that.goTranslate} voiceList={voiceList} visible={vShortVisible} onCancel={() => this.closeModal()} /> : null } */}
                    <VoiceShorts translateVoice={that.goTranslate} getSurveyList={this.getSurveyList} voiceList={voiceList} visible={vShortVisible} onCancel={() => this.closeModal()} />
                    {
                        Object.keys(pictureInfo).length && pictureType && previewPic ?
                            <CarouselImg pictureInfo={pictureInfo} previewHide={this.previewHide} previewPic={this.state.previewPic} pictureType={this.state.pictureType} /> :
                            ''
                    }
                    {
                        Object.keys(pictureInfo).length && baseData && idcard ?
                            <DetailImg idcard={idcard} baseInfo={baseData} detailPic={this.state.detailPic} previewHide={this.previewHide} pictureInfo={pictureInfo} /> :
                            null
                    }
                </div>
            </Spin>
        )
    }
}

IpiecesEdit.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default IpiecesEdit;
