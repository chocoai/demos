/**
 * 经营贷产品详情页
 * @Author: 魏昌华
 * @Date:   2017-05-27
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-07-04
 */
import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router'; // 创建route所需

import DetailVerifyResult from '../../Component/Ipieces/DetailVerifyResult'; // 进件详情审批状态
import DetailLoanAudit from '../../Component/Ipieces/DetailLoanAudit'; // 进件详情审批信息
import DetailTrialReport from '../../Component/Ipieces/DetailTrialReport'; // 进件详情 —— 头部初审报告
import DetailLoanInfo from '../../Component/Ipieces/DetailLoanInfo'; // 进件详情查看老客户
import DetailTopInfo from '../../Component/Ipieces/DetailTopInfo'; // 进件详情头部信息
import IpiecesPerson from '../../Component/Ipieces/IpiecesPerson';  // 进件详情人员信息
import UploadImg from '../../Component/Ipieces/UploadImg';

import IpiecesBreadcrumb from '../../Component/Ipieces/IpiecesBreadcrumb'
import CarouselImg from '../../Component/Ipieces/CarouselImg';
import DetailImg from '../../Component/Ipieces/DetailImg';
import ApproveCheck from '../../Component/Ipieces/ApproveCheck'
import trialReportImg from '../../Assets/Images/icon_trial_report.png';

import IpiecesService from '../../Services/IpiecesService';
import ModExplainModal from '../../Component/Modal/ModExplainModal';

import './style/operateLoanDetail.less';
// import modifyImg from '../../Assets/Images/icon_modify.png';
import { message, Modal, Tabs} from 'antd';
import getContent from '../../Config/Ipieces';
import marked from 'marked';
// 表单配置传入
import TabConfig from '../../Config/Ipieces/TabConfig'
import BaseInfoConfig from '../../Config/Ipieces/BasicInfo';
import ComBoGuaConfig from '../../Config/Ipieces/ComBoGua';


marked.setOptions({
  renderer : new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: true
});

/* 以类的方式创建一个组件 */
class OperateLoanDetail extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
            uploadImg: {
                uploadImgVisible: false,
                type: null
            },
    		previewPic: false,           // 预览照片信息
            idcard: false,                 // 身份证还是人脸区别
            detailPic: false,             // 人脸识别详细
            previewCred: false,          // 预览征信报告
            explainShow: false,          // 查看评分说明
            auditInfo:'',               //审批记录信息
    		topInfo: '',                 // 经营贷头部信息
    		baseInfo: '',                // 经营贷基本信息
            loanBusinessBase: '',        //经营基本信息
            businessOtherData: '',       //其他经营信息
            businessAnalysisData: '',    // 生产情况分析（主营业务分析）
            loanCreditHisData: '',      //信贷历史
            loanGuaranteeData: '',       // 共同借款人及担保人信息
            logicData:'',               // 逻辑校验
            assetsData:'',              // 资产信息
            softInfo:'',                //软信息
            sigleSoftInfo:'',            //获取单条软信息
    		code: props.routeParams.id,  // 进件编码
            type: props.routeParams.type,   // 进件类型
    		analysisClass: '',           // 经营分析类别
    		pictureInfo: {},             // 照片信息
    		suveyCredit: [],             // 征信报告
    		personCredit: '',            // 个人征信报告
    		coborrowerCredit: '',        // 共同借款人征信报告
    		guaranteeCredit: '',         // 共同担保人征信报告
    		pictureType: '',              // 获取照片类型
            // passModal: false,            // 审批通过模态对话框
            // rejectModal: false,           // 审批拒绝模态对话框
            // rebackModal: false,           // 审批打回模态对话框
            // reBackReason: '',          // 打回原因
            comment: '',               // 备注信息
			balance:[],   				//资产负债表
            income: [],  				//损益表
            cash:[],    				//现金流量表
            loanAuditList: '',          //审批记录列表
            validateError: '', // 验证错误
            // authMoney: '', // 授信金额
            // rejectReason: '', // 拒绝原因
            // rejectReasonOther: '', // 选择其他时输入的拒绝原因
            // spjjyy: '', // 审批拒绝原因
            eduDict:'',      //学历
            activeKey: 'basicInfo',
            mismatch: '',
            animated: true,
            hkqs: [],
            hkfs:[],
            creditConfirm: {},
            modifyStatus: true,    // 审批通过的是否修改
            isFinish: false,      // 请求是否完成
            showLoanInfo: false,  //是否显示借款列表
            rebackModalKey: 0,
            showLoanComment: false,
            trialReport: '',
            trialReportModal: false,
            explainContent: null,   //查看说明对象
            bcrumb: {
                loan: [{
                    'link': '/loan',
                    'value': '借款管理'
                }, {
                    'link': null,
                    'goBack': true,
                    'value': /\/detail\//g.test(window.location.pathname) ? '借款详情' : '借款审批'
                }, {
                    'link': null,
                    'value': '进件详情'
                }],
                default: [{
                    'link': '/ipieces/operate',
                    'value': '进件管理'
                }, {
                    'link': null,
                    'value': '进件详情'
                }],
                check: [{
                    'link': '/ipieces/operate',
                    'value': '进件管理'
                }, {
                    'link': null,
                    'goBack': true,
                    'value': '进件详情'
                }, {
                    'link': null,
                    'value': '进件审查'
                }],
                approve: [{
                    'link': '/ipieces/operate',
                    'value': '进件管理'
                }, {
                    'link': null,
                    'goBack': true,
                    'value': '进件详情'
                }, {
                    'link': null,
                    'goBack': true,
                    'value': '进件审批'
                }],
                customer: [{
                    'link': '/customer/list',
                    'value': '客户管理'
                }, {
                    'link': null,
                    'goBack': true,
                    'value': '客户详情'
                }, {
                    'link': null,
                    'value': '进件详情'
                }]
            }[props.routeParams.from || props.routeParams.action  || 'default']
		};
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    // }
    componentWillMount() {
		this.getInfo('/v1/loan/basic', 'baseInfo', BaseInfoConfig);                         //基本信息
        this.getInfo('/v1/loan/loanAudit','auditInfo')                      //获取审批记录
    }

    componentDidMount() {
        const { code, type } = this.state;
    	this.getTopInfo(code);               // 获取进件头部信息，以此确定tab展示页
        // this.getSuveyCredit();               // 获取经营贷征信报告信息
        this.getPictureInfo();               // 获取经营贷照片信息
        this.getDict();                      // 获取学历字典值
        this.getDictCustom();               // 获取和产品类型相关的字典值
        this.getInfo('/v1/loan/verifyResult/mismatch','mismatch');                 //进件各类校验项不匹配信息
		this.getInfo('/v1/loan/business/info', 'loanBusinessBase');         //经营基本信息
		this.getInfo('/v1/loan/business/other', 'businessOtherData');       //其他经营信息
        this.getInfo('/v1/loan/business/analysis', 'businessAnalysisData'); // 生产情况分析（主营业务分析）
		this.getInfo('/v1/loan/guarantee', 'loanGuaranteeData', ComBoGuaConfig);            // 共同借款人及担保人信息，同时进行判断
        if ( type == 7 || type == 8 ) {
            this.getInfo('/v1/loan/creditHis','loanCreditHisData');   //获取信贷历史
        } else {
            this.getInfo('/v1/loan/creditHis/customer','loanCreditHisData');   //获取信贷历史
        }
        if (type == 8) {
            this.getInfo('/v1/loan/proInfo','proInfoData');   //获取职业信息
        }
        if ( type == 6 ||  type == 8) {
            this.getInfo('/v1/loan/assets/info','balance');                 //财务情况资产负债表
            this.getInfo('/v1/loan/assets/incstat', 'income');              //财务情况损益表
            this.getInfo('/v1/loan/assets/cash/flow', 'cash');              //财务情况现金流量
        }else {
            //财务情况资产负债表
            this.getInfo('/v1/loan/agro/assets','farmBalance');
            //财务情况损益表
            this.getInfo('/v1/loan/agro/assets/incstat', 'farmIncome');
            //财务情况现金流量
            this.getInfo('/v1/loan/agro/assets/cash/flow', 'farmCash');
            //经营信息
            this.getInfo('/v1/loan/business/agricultural', 'farmBase'); //获取农贷经营信息
            //上下游
            this.getInfo('/v1/loan/business/agricultural/updowninfo', 'loanDownStream'); //获取上下游信息
        }
		this.getInfo('/v1/loan/logicVerify/dr', 'logicData');              // 逻辑校验
        this.getInfo('/v1/loan/assets', 'assetsData');                  // 资产信息
        this.getInfo('/v1/survey/softLisy','softInfo');                 //获取软信息
        this.getInfo('/v1/survey/softInfo','sigleSoftInfo');                 //获取单条软信息
        // if(/\/approve|check/g.test(window.location.pathname)) {
        //     this.getInfo('/v1/loan/audit/credit','creditConfirm');                 //进价提交审批通过展示授信信息
        // }
    }
    //获取信息
    getInfo(url, type, fieldConfig){
        let params = {
            code: this.state.code
        }
        Config.get(url, params, (res) => {
            if(res.code == Config.errorCode.success) {
                if (res.data && res.data.moduleConfig) {
                    res.data.moduleName = {}
                    res.data.moduleConfig.map(i => res.data.moduleName[i.formEnName] = i.formChName)
                }
                // 表单配置提前合并
                if (fieldConfig) {
                    res.data.fieldConfigMerge = fromJS(fieldConfig).mergeDeep(res.data.fieldConfig).toJS()
                    this.setState({
                        [type]: res.data
                    })
                } else {
                    this.setState({
                        [type]: res.data
                    })
                }
                if(type == 'creditConfirm') {
                    this.setState({
                        authMoney: res.data.creditAmount,
                        dailyRate: res.data.dailyRate,
                        repaymentPeriod: res.data.repaymentPeriod
                    })
                }
         	} else {
                message.error(res.msg);
         	}
        });
    }

    //字典值查询
    //学历
    getDict(){
        let params = {
            code: 'education,jsfs,gdlx,bcgx,hkfs,spjjyy'
        }
        Config.get('/v1/sys/dict/items/all', params, (res) => {
            if(res.code == Config.errorCode.success) {
                this.setState({
                    eduDict: res.data.education,
                    // hkqs: res.data.hkqs,
                    hkfs: res.data.hkfs,
                    cultiLand: res.data.gdlx,
                    setMethod: res.data.jsfs,
                    relationship: res.data.bcgx,
                    spjjyy: res.data.spjjyy
                })
         	} else {
                message.error(res.msg);
         	}
        });
    }
    getDictCustom(){
        let params = {
            ddItem: 'hkqs',
            prdType: this.state.type
        }
        Config.get('/comm/sys/dict/items/custom', params, (res) => {
            if(res.code == Config.errorCode.success) {
                this.setState({
                    hkqs: res.data.hkqs
                })
         	} else {
                message.error(res.msg);
         	}
        });
    }

    getPictureInfo = () => {  // 照片信息
    	// (个人：LOAN_PERSON，配偶：LOAN_SPOUSE,家庭信息：LOAN_FAMILY，进件主营基本信息：LOAN_BUSIBASE, 经营状况：LOAN_BUSIINFO,
    	// 担保人：LOAN_GUARANTEE，房产：LOAN_HOUSE，车辆：LOAN_CAR)
      // 人脸 LOAN_PERSON_IDENTITY_FACE 身份证正面 LOAN_PERSON_IDENTITY_FRONT 身份证反面 LOAN_PERSON_IDENTITY_BACK
    	let type = '/' + Object.values(Config.bizType).join(',')
      let code = this.state.code;
    	Config.get('/v1/oss/'+ code + type + '/*', {}, (res) => {
        if(res.code == Config.errorCode.success) {
          if(res.data){
            // this.setState({pictureInfo: res.data});
            res.data[Config.showType.loanPersonSpouse] = [...res.data[Config.bizType.loanPerson] || [], ...res.data[Config.bizType.loanSpouse] || []]
            res.data[Config.showType.loanPledgeAll] = [...res.data[Config.bizType.loanPledge] || [], ...res.data[Config.bizType.loanPledgehouse] || []]
            this.setState({
                pictureInfo: Object.assign(this.state.pictureInfo,res.data)
            })
            this.getSuveyCredit();
          }
        } else {
            message.error(res.msg);
        }
      });
    }
    // 此处要对担保人做个判断
    showPicture = (type, code) => {
        const {pictureInfo} = this.state
        if(type == 'LOAN_GUARANTEE_CREDIT') {
            let obj = pictureInfo;
            obj[type] = obj[type].filter(i=>i.bizCode == code)
            this.setState({
                pictureType: type,
                previewPic: true,
                pictureInfo: obj
            })
        }else {
            this.setState({
                pictureType: type,
                previewPic: true
            });
        }
	}
    showDetail = (idcard) => {
        if(idcard == "idcard") {
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
        const {guaranteeCredit, pictureInfo} = this.state
        let obj = pictureInfo;
        obj['LOAN_GUARANTEE_CREDIT'] = guaranteeCredit;
        this.setState({
            pictureType: '',
            [type]: false,
            idcard: ''
        });
    }
    getSuveyCredit = () => {   // 征信调查
    	let type = '/LOAN_PERSON_CREDIT,LOAN_COBORROWER_CREDIT,LOAN_GUARANTEE_CREDIT';
    	let code = this.state.code;
    	Config.get('/v1/oss/'+ code + type + '/*', {}, (res) => {
             if(res.code == Config.errorCode.success) {
            	// 个人、共同借款人、共同贷款人
                let {LOAN_PERSON_CREDIT:LOAN_PERSON_CREDIT='', LOAN_COBORROWER_CREDIT:LOAN_COBORROWER_CREDIT='',LOAN_GUARANTEE_CREDIT:LOAN_GUARANTEE_CREDIT=''} = res.data
            	this.setState({
            		personCredit : LOAN_PERSON_CREDIT,
            		coborrowerCredit: LOAN_COBORROWER_CREDIT,
            		guaranteeCredit: LOAN_GUARANTEE_CREDIT,
                    pictureInfo: Object.assign(this.state.pictureInfo,res.data),
                    isFinish: true
            	});
            } else {
                message.error(res.msg);
            }
        });
    }
	getTopInfo = (code) => {   // 获取进件头部信息
		Config.get('/v1/loan/top', {code: code}, (res) => {
            if(res.code == Config.errorCode.success) {
            	let { analysisClass } = this.state;
                if(res.data) analysisClass = res.data.analysisClass; // 分析类别,0生产情况分析，1主营业务分析
                // 如果tab配置不存在
                if(!res.data.tabConfig) {
                    // 配置前顺序前端定
                    res.data.tabConfig = TabConfig.filter(i => res.data.tabShow.includes(i.formChName)).map(i => {
                        i.position = res.data.tabShow.findIndex( value => value == i.formChName);
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
                res.data.tabConfig.map( i => {
                    res.data.tabName[i.formEnName] = i.formChName
                    res.data.tabEnName.push(i.formEnName)
                })
                this.setState({
                	analysisClass: analysisClass,
                    topInfo: res.data
                });
            } else {
                message.error(res.msg);
            }
        });
	}
    showApproModal = () => { // 设置审批记录模态对话框
        this.setState({
            showApproModal: true,
        });
    }
    handleApproOk = () => {
        this.setState({
            showApproModal: false,
        });
    }
    handleApproCancel = () => {
        this.setState({
            showApproModal: false,
        });
    }
    showModal = () => { // 设置借款记录模态对话框
        this.setState({
            showLoanInfo: true,
        });
    }
    showComment = () => {
        this.setState({
            showLoanComment: true,
        });
    }
    closeComment = () => {
        this.setState({
            showLoanComment: false,
        });
    }
    handleOk = () => {
        this.setState({
            showLoanInfo: false,
        });
    }

    handleCancel = () => {
        this.setState({
            showLoanInfo: false,
        });
    }
    // // 目前采取类型判断处理，等区分度更大的时候拆分组件
    // // todo
    // approvalPass = () => {
    //     const { code, authMoney, dailyRate, repaymentPeriod, creditConfirm, kind, period, comment } = this.state;
    //     const { action } = this.props.routeParams;
    //     if(!authMoney) return message.error("授信金额不能为空");
    //     if(!dailyRate) return message.error("借款日利率不能为空");
    //     if ( action == 'approve' ) {
    //         if (creditConfirm && creditConfirm.creditOn) {
    //             if(!repaymentPeriod) return message.error("最长还款期数不能为空");
    //         }else {
    //             if(!(period || (creditConfirm && creditConfirm.period))) return message.error("还款期数不能为空");
    //             if(!(kind || (creditConfirm && creditConfirm.kind))) return message.error("还款方式不能为空");
    //         }
    //     }
    //     let reg = /^[0-9]{1}\d*(\.\d{1,2})?$/
    //     let rateReg = /^0.\d{1,4}$/
    //     if (!reg.test(authMoney)) return message.error('授信金额为数字小数点后且最多两位');
    //     if (!rateReg.test(dailyRate)) return message.error('借款日利率小于1，且小数点后最多四位');
    //     // 审查
    //     if (action == 'check') {
    //         let params = {
    //             reqCode: code,
    //             authMoney: authMoney,
    //             dailyRate: dailyRate,
    //         };
    //         Config.put('/v1/loan/examine/pass', params, (res) => {
    //             if(res.code == Config.errorCode.success) {
    //                 message.success('审查成功');
    //                 browserHistory.push('/ipieces/operate');
    //             } else {
    //                 message.error(res.msg);
    //                 //此处以后要添加判断，目前只做跳转
    //                 browserHistory.push('/ipieces/operate');
    //             }
    //         });
    //         return;
    //     }
    //     // 审批
    //     if (creditConfirm && creditConfirm.creditOn) {
    //         let params = {
    //             reqCode: code,
    //             authMoney: authMoney,
    //             dailyRate: dailyRate,
    //             repaymentPeriod: repaymentPeriod,
    //             comment: comment
    //         };
    //         Config.put('/v1/loan/audit/pass', params, (res) => {
    //             if(res.code == Config.errorCode.success) {
    //                 message.success('审批成功');
    //                 browserHistory.push('/ipieces/operate');
    //             } else {
    //                 message.error(res.msg);
    //                 //此处以后要添加判断，目前只做跳转
    //                 browserHistory.push('/ipieces/operate');
    //             }
    //         });
    //     } else {
    //         let params = {
    //             reqCode: code,
    //             authMoney: authMoney,
    //             dailyRate: dailyRate,
    //             period: period || creditConfirm.period,
    //             kind: kind  || creditConfirm.kind,
    //             comment: comment
    //         };
    //         Config.put('/v1/loan/audit/pass', params, (res) => {
    //             if(res.code == Config.errorCode.success) {
    //                 message.success('审批成功');
    //                 browserHistory.push('/ipieces/operate');
    //             } else {
    //                 message.error(res.msg);
    //                 //此处以后要添加判断，目前只做跳转
    //                 browserHistory.push('/ipieces/operate');
    //             }
    //         });
    //     }
    // }
    // approvalReject = () => { // 审批拒绝
    //     const { code, rejectReason, rejectReasonOther } = this.state;
    //     const { action } = this.props.routeParams;
    //     if(!rejectReason) return message.error('请选择审批拒绝原因');
    //     if (rejectReason == 15 && !rejectReasonOther) return message.error('请输入其他原因')
    //     if (rejectReason == 15 && rejectReasonOther.length > 64) return message.error('其他原因不能超过64个字')
    //     const params = {
    //         code: code,
    //         rejectReason: rejectReason,
    //         rejectReasonOther: rejectReason == 15 ?rejectReasonOther:''
    //     };
    //     Config.put(`${action == 'approve'? '/v1/loan/audit/reject' : '/v1/loan/examine/reject'}`, params, (res) => {
    //         if(res.code == Config.errorCode.success) {
    //             message.success('审批成功');
    //             browserHistory.push('/ipieces/operate');
    //         } else {
    //             message.error(res.msg);
    //             // browserHistory.push('/ipieces/operate');
    //         }
    //     });
    // }
    // // 重新打回模态款 确定
    // approvalReBack = () => {
    //     // 这个params是从LoanOperate传来的，是借款编码，已经是object了
    //     let reBackReason = this.state.reBackReason;
    //     if(Config.isNull(reBackReason)){
    //         message.error('请输入打回原因')
    //         return
    //     }
    //     let params = {
    //         code: this.state.code,
    //         repulseReason: reBackReason
    //     }
    //     Config.put('/v1/loan/audit/repulse',params,(res) =>{
    //         if(res.code == Config.errorCode.success) {
    //             message.success('贷款打回成功！');
    //             this.setState({
    //                 reBackReason:false
    //             })
    //             browserHistory.push('/ipieces/operate');
    //         } else {
    //             message.error(res.msg)
    //         }
    //     })
    // }
    //自动跳转到相应部分
    autoNav = (activeKey, id) => {
        //此处增加动画关闭处理，否则跳转的时候获取位置会出错，容易出现tab部分消失
        //动画不开启则不用处理
        this.setState({
            activeKey,
            animated: false
        },()=>{
            document.getElementById(id).scrollIntoView();
            this.setState({
                animated: true
            })
        })
    }
    changeActiveKey = (activeKey) => {
        this.setState({
            activeKey
        })
    }
    // changeModify = () => {
    //     this.setState({
    //         modifyStatus: false
    //     })
    // }
    async getFirstAudit (visible) {
        const that = this;
        if (visible) {
            const { code } = that.state;
            const res = await IpiecesService.getFirstAudit({reqCode: code});
            that.setState({
                trialReport: res.data,
                trialReportModal: true
            })
        } else {
            that.setState({
                trialReportModal: false
            })
        }
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
    openUploadImg = (type) => {
        this.setState({
            uploadImg: Object.assign(this.state.uploadImg, { uploadImgVisible: true, type })
        })
    }
    closeUploadImg=async()=>{
        let res=await IpiecesService.postReplenishData({code:this.state.code});
        if (res.code == Config.errorCode.success) {
            this.setState({
                uploadImg: Object.assign(this.state.uploadImg, { uploadImgVisible: false })
            })
            message.success('信息补充成功');
            browserHistory.push('/ipieces/operate');
        }
    }
    cancelUploadImg = (e) => {
        this.setState({
            uploadImg: Object.assign(this.state.uploadImg, { uploadImgVisible: false })
        })
    }
	render() {
    const { routeParams } = this.props;
    const state = this.state;
    // const { bcrumb, type, isFinish, modifyStatus, creditConfirm, hkqs , hkfs , idcard, activeKey,spjjyy, passModal, rejectModal, topInfo, auditInfo, mismatch, baseInfo,softInfo,loanBusinessBase, businessOtherData,animated, businessAnalysisData, loanCreditHisData, loanGuaranteeData, logicData, assetsData, analysisClass, pictureInfo, personCredit, coborrowerCredit, guaranteeCredit, pictureType, eduDict, sigleSoftInfo, cultiLand, setMethod, relationship, rebackModal, code, proInfoData} = state;
    const { spjjyy, code, type, hkqs , hkfs , idcard, activeKey, topInfo, mismatch, baseInfo, animated, pictureInfo, pictureType, explainShow, explainContent} = state;
    let { bcrumb } = state
    bcrumb = {
        loan: [{
            'link': '/loan',
            'value': '借款管理'
        }, {
            'link': null,
            'goBack': true,
            'value': /\/detail\//g.test(window.location.pathname) ? '借款详情' : '借款审批'
        }, {
            'link': null,
            'value': '进件详情'
        }],
        default: [{
            'link': '/ipieces/operate',
            'value': '进件管理'
        }, {
            'link': null,
            'value': '进件详情'
        }],
        check: [{
            'link': '/ipieces/operate',
            'value': '进件管理'
        }, {
            'link': null,
            'goBack': true,
            'value': '进件详情'
        }, {
            'link': null,
            'value': '进件审查'
        }],
        approve: [{
            'link': '/ipieces/operate',
            'value': '进件管理'
        }, {
            'link': null,
            'goBack': true,
            'value': '进件详情'
        }, {
            'link': null,
            'goBack': true,
            'value': '进件审批'
        }],
        customer: [{
            'link': '/customer/list',
            'value': '客户管理'
        }, {
            'link': null,
            'goBack': true,
            'value': '客户详情'
        }, {
            'link': null,
            'value': '进件详情'
        }]
    }[routeParams.from || routeParams.action || 'default']
    let action = routeParams.action
    let markedText = '';
    if (topInfo && topInfo.comment) markedText = marked(topInfo.comment);
    // const surveyStatus = topInfo.surveyStatus;   // 进件调查状态
		// let detailTabPane = '';
        // 以后有待修改
        let onOff = false;
        if(mismatch) {
            for(let key in mismatch) {
                if(mismatch[key]) onOff = true
            }
        }
        const { trialReportModal, trialReport,uploadImg } = this.state;
		return (
			<div className="operateloan-detail-container">
                <IpiecesBreadcrumb spjjyy={spjjyy} bcrumb={bcrumb} action={action} code={code} topInfo={topInfo} getTopInfo = {this.getTopInfo} type={type} openUploadImg={this.openUploadImg}/>
                <div className="operateloan-detail-content">
                    <div style={{overflow: 'hidden'}}>
                        { /* DetailLoanAudit：审批记录无状态组件 */ }
                        {
                            (topInfo && topInfo.loanAuditVOList && topInfo.loanAuditVOList.length != 0) ?
                                <DetailLoanAudit loanAuditVOList={topInfo.loanAuditVOList}/>
                                :null
                        }

                        {
                            topInfo && topInfo.loanOperatorVO && topInfo.loanOperatorVO.loanOver ?
                            <IpiecesPerson loanOperatorVO = {topInfo && topInfo.loanOperatorVO} />
                            : null
                        }

                        { topInfo && topInfo.isHouseAuditSubmit && <div className='trial-report' onClick={() => this.getFirstAudit(true)}><img className='trial-report-img' src={trialReportImg} alt='list' /><span className='trial-report-title'>初审报告</span></div> }
                        <Modal
                            title="初审报告"
                            visible={trialReportModal}
                            onCancel={() => this.getFirstAudit(false)}
                            wrapClassName='trial-report-modal'
                            width = {580}
                            footer={null}
                            >
                            <DetailTrialReport trialReport={trialReport} />
                        </Modal>
                        {/* 代码长度增加则改为公共组件 */}
                        {
                            topInfo && topInfo.loanOperatorVO && !topInfo.loanOperatorVO.loanOver && topInfo.loanOperatorVO.escortCustomer ?
                            <p style={{lineHeight: '34px', float: 'right'}}>
                            {
                                topInfo && topInfo.loanOperatorVO && topInfo.loanOperatorVO.mainCustomer ?
                                <span>主调客户经理：{topInfo.loanOperatorVO.mainCustomer}</span>
                                : null
                            }
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {
                                topInfo && topInfo.loanOperatorVO && topInfo.loanOperatorVO.escortCustomer ?
                                <span>陪调客户经理：{topInfo.loanOperatorVO.escortCustomer}</span>
                                : null
                            }
                            </p>
                            : null
                        }
                    </div>
                    {
                        topInfo.auditStatusText || onOff?
                        <DetailVerifyResult showExplainModal={this.showExplainModal} topInfo={topInfo} showComment={this.showComment} autoNav = {this.autoNav} mismatch ={mismatch} type = { type } />
                        : null
                    }
                    {
                        this.state.showLoanInfo ?
                        <Modal
                            title="贷款记录"
                            visible={this.state.showLoanInfo}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            wrapClassName = 'loanInfo-modal'
                            width = {580}
                            footer=""
                            >
                            <DetailLoanInfo customerLoanList={topInfo.loanReqRecord} customerBorrowList={topInfo.borrowInfoRecord}/>
                        </Modal>
                        :null
                    }
                    {
                        explainShow && <ModExplainModal mVisible={explainShow} closeExplainModal={()=>this.closeExplainModal()} topInfo={explainContent} type={type}></ModExplainModal>
                    }
                    <DetailTopInfo topInfo={topInfo} showModal={this.showModal} type={type}/>
                    {/*{ detailTabPane }    	              	            	*/}
                    <Tabs defaultActiveKey="basicInfo" activeKey={activeKey} className="detail-tabs" onChange={this.changeActiveKey} animated={animated}>
                        {/* {
                            topInfo.tabShow?
                                tabArr.filter((item, index)=>(topInfo.tabShow.includes(item.name) && item.type.includes(type))).map(item=>item.content):null
                        } */}
                        {getContent(this, 'detailContent')}
                    </Tabs>
                    { action == 'approve' || action == 'check' ?
                        <ApproveCheck {...{code, action, baseInfo, hkqs, hkfs, type}} />:null
                    }
                </div>
                <Modal
                    title="查看备注"
                    visible={this.state.showLoanComment}
                    onCancel={this.closeComment}
                    wrapClassName = 'loanComment-modal'
                    width = {580}
                    footer=""
                    >
                    <div className="comment-p" dangerouslySetInnerHTML={{__html: markedText}}></div>
                </Modal>
                {
                    Object.keys(pictureInfo).length?
                    <CarouselImg pictureInfo = {pictureInfo} previewHide={this.previewHide} previewPic={this.state.previewPic} pictureType={this.state.pictureType}/>:
                    ''
                }
                {
                    Object.keys(pictureInfo).length && baseInfo && idcard?
                    <DetailImg idcard={idcard} baseInfo = {baseInfo} detailPic = {this.state.detailPic}  previewHide={this.previewHide} pictureInfo={pictureInfo} />:
                    null
                }
                 {uploadImg.uploadImgVisible?<UploadImg code={code} type={uploadImg.type} visible={uploadImg.uploadImgVisible} openUploadImg={this.openUploadImg} closeUploadImg={this.closeUploadImg} cancelUploadImg={this.cancelUploadImg} modalTitle={'补充信息'}/>:null}
			</div>
		);
	}
}

export default OperateLoanDetail;
