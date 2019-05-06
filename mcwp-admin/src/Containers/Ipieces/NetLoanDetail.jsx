/**
 * 网贷产品详情页
 * @Author: 朱亚珍
 * @Date:   2017-05-27
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-06
 */
import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
// import { browserHistory } from 'react-router';
import './style/netLoanDetail.less';
import DetailNetBaseInfo from './../../Component/Ipieces/DetaiNetBaseInfo';
import DetailNetAsset from './../../Component/Ipieces/DetailNetAsset';
import CarouselImg from './../../Component/Ipieces/CarouselImg';
// import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import IpiecesBreadcrumb from '../../Component/Ipieces/IpiecesBreadcrumb'

import DetailVerifyResult from '../../Component/Ipieces/DetailVerifyResult'; // 进件详情审批状态
import DetailLoanAudit from '../../Component/Ipieces/DetailLoanAudit'; // 进件详情审批信息
import DetailLoanInfo from '../../Component/Ipieces/DetailLoanInfo'; // 进件详情查看老客户
import ApproveCheck from '../../Component/Ipieces/ApproveCheck'
import IpiecesPerson from '../../Component/Ipieces/IpiecesPerson';  // 进件详情人员信息

// 表单配置传入
import TabConfig from '../../Config/Ipieces/TabConfig'

import DetailImg from '../../Component/Ipieces/DetailImg';
// import modifyImg from '../../Assets/Images/icon_modify.png';
import { Row, Col, message, Modal, Tabs, Card} from 'antd';
import marked from 'marked';
// const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
// const Option = Select.Option;

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
class NetLoanDetail extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
    		previewPic: false,           // 预览照片信息
            idcard: false,               // 区分人脸和身份证
            detailPic: false,             // 人脸识别详细
    		previewCred: false,          // 预览征信报告
    		pictureType: '',             // 获取照片类型
            auditInfo:'',                // 审批记录信息
    		topInfo: '',                 // 页面头部信息
    		baseInfo: '',                // 网贷基本信息
    		pictureInfo: '',             // 照片信息
    		personCredit: [],            // 征信报告
    		code: props.routeParams.id,  // 进件编码
            passModal: false,            // 审批通过模态对话框
            rejectModal: false,          // 审批拒绝模态对话框
            validateError: '',           // 验证错误
            authMoney: '',               // 授信金额
            rejectReason: '',            // 拒绝原因
            rejectReasonOther: '',       // 选择其他时输入的拒绝原因
            spjjyy: '',                  // 审批拒绝原因
            eduDict:'',                   //学历
            mismatch: '',
            animated: true,
            hkqs: [],
            creditConfirm: {},
            modifyStatus: true,    // 审批通过的是否修改
            showLoanInfo: false,  //是否显示借款列表
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
            }[props.routeParams.from || 'default']
		};
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    componentWillMount() {
        // this.getInfo('/v1/loan/loanAudit','auditInfo');   // 获取审批记录
        this.getInfo('/v1/loan/basic','baseInfo');        // 获取基本信息
        this.getInfo('/v1/loan/top','topInfo');          // 获取进件头部信息
    }
    componentDidMount() {
    	// let code = this.state.code;
        this.getPictureInfo();
        // this.getSuveyCredit(code);                          // 征信调查
        this.getDict();                                     //获取学历字典值
        this.getInfo('/v1/loan/assets','baseAssetInfo');    // 获取资产信息
        this.getInfo('/v1/loan/verifyResult/mismatch','mismatch');          //进件各类校验项不匹配信息
        // if(/\/approve/g.test(window.location.pathname)) {
        //     this.getInfo('/v1/loan/audit/credit','creditConfirm');                 //进价提交审批通过展示授信信息
        // }
    }

    //获取信息
    getInfo(url,type){
        let params = {
            code: this.state.code
        }
        Config.get(url, params, (res) => {
            if(res.code == Config.errorCode.success) {
                if (type == 'topInfo') {
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
                }
                this.setState({
                    [type]: res.data
                })
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
            code: 'education,hkqs,bcgx,znqk,hkfs,spjjyy'
        }
        Config.get('/v1/sys/dict/items/all', params, (res) => {
            if(res.code == Config.errorCode.success) {
                this.setState({
                    eduDict: res.data.education,
                    hkqs: res.data.hkqs,
                    relationship: res.data.bcgx,
                    znqkList: res.data.znqk,
                    hkfs: res.data.hkfs,
                    spjjyy: res.data.spjjyy
                })
         	} else {
                message.error(res.msg);
         	}
        });
    }
    getSysDictItems() { // 获取审批拒绝原因字典值
        Config.get('/v1/sys/dict/items', {code: 'spjjyy'}, (res) => {
            if(res.code == Config.errorCode.success) {
            	if(res.data){
            		this.setState({
                        spjjyy: res.data.spjjyy,
                        rejectModal: !this.state.rejectModal
                    });
            	}
            } else {
                message.error(res.msg);
            }
        });
    }
    showPicture = (type) => {
		this.setState({
    		pictureType: type,
    		previewPic: true
    	});
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
        this.setState({
            [type]: false,
            idcard: ''
        });
    }
    getPictureInfo = () => {  // 照片信息
    	// (个人：LOAN_PERSON，配偶：LOAN_SPOUSE,房产：LOAN_HOUSE，车辆：LOAN_CAR)
        // 人脸 LOAN_PERSON_IDENTITY_FACE 身份证正面 LOAN_PERSON_IDENTITY_FRONT 身份证反面 LOAN_PERSON_IDENTITY_BACK
    	let type = '/LOAN_PERSON,LOAN_SPOUSE,LOAN_GUARANTEE,LOAN_HOUSE,LOAN_CAR,LOAN_PERSON_IDENTITY_FACE,LOAN_PERSON_IDENTITY_FRONT,LOAN_PERSON_IDENTITY_BACK'
    	let code = this.state.code;
    	Config.get('/v1/oss/'+ code + type + '/picture', {}, (res) => {
            if(res.code == Config.errorCode.success) {
            	if(res.data){
            		this.setState({pictureInfo: res.data});
            	}
                this.getSuveyCredit(code);
            } else {
                message.error(res.msg);
            }
        });
    }
    getSuveyCredit = (code) => {   // 征信调查
    	Config.get('/v1/oss/'+ code + '/LOAN_PERSON_CREDIT/*', {}, (res) => {
            if(res.code == Config.errorCode.success) {
            	let data = res.data;
            	let LOAN_PERSON_CREDIT = data&&data.LOAN_PERSON_CREDIT ? data.LOAN_PERSON_CREDIT[0].srcUrl : '';  // 个人
                this.setState({
                    personCredit: LOAN_PERSON_CREDIT,
                    pictureInfo: Object.assign(this.state.pictureInfo,res.data)
                });
            } else {
                message.error(res.msg);
            }
        });
    }

    //  setModal(modal) { // 设置模态对话框
    //     if(modal == 'pass') {
    //         this.setState({
    //             passModal: !this.state.passModal,
    //             modifyStatus: !this.state.passModal
    //         });
    //     } else if(modal == 'reject') {
    //         this.getSysDictItems();
    //     }
    // }
    // approvalPass = () => {
    //     const { code, authMoney, dailyRate, repaymentPeriod, creditConfirm, kind, period } = this.state;
    //     if(!authMoney) return message.error("授信金额不能为空");
    //     if(!dailyRate) return message.error("借款日利率不能为空");
    //     if (creditConfirm && creditConfirm.creditOn) {
    //         if(!repaymentPeriod) return message.error("最长还款期数不能为空");
    //     }else {
    //         if(!(period || (creditConfirm && creditConfirm.period))) return message.error("还款期数不能为空");
    //         if(!(kind || (creditConfirm && creditConfirm.kind))) return message.error("最长方式不能为空");
    //     }
    //     let reg = /^[0-9]{1}\d*(\.\d{1,2})?$/
    //     let rateReg = /^0.\d{1,4}$/
    //     if (!reg.test(authMoney)) return message.error('授信金额为数字小数点后且最多两位');
    //     if (!rateReg.test(dailyRate)) return message.error('借款日利率小于1，且小数点后最多四位');
    //     if (creditConfirm && creditConfirm.creditOn) {
    //         let params = {
    //             reqCode: code,
    //             authMoney: authMoney,
    //             dailyRate: dailyRate,
    //             repaymentPeriod: repaymentPeriod
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
    //             kind: kind  || creditConfirm.kind
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
    //     if(!rejectReason) return message.error('请选择审批拒绝原因');
    //     if (rejectReason == 15 && !rejectReasonOther) return message.error('请输入其他原因')
    //     if (rejectReason == 15 && rejectReasonOther.length > 64) return message.error('其他原因不能超过64个字')
    //     const params = {
    //         code: code,
    //         rejectReason: rejectReason,
    //         rejectReasonOther: rejectReason == 15 ?rejectReasonOther:''
    //     };
    //     Config.put('/v1/loan/audit/reject', params, (res) => {
    //         if(res.code == Config.errorCode.success) {
    //             message.success('审批成功');
    //             browserHistory.push({pathname:"/ipieces/operate", state: {prdType : '1'}})
    //         } else {
    //             message.error(res.msg);
    //             browserHistory.push({pathname:"/ipieces/operate", state: {prdType : '1'}})
    //         }
    //     });
    // }
    // changeRadio(e) {
    //     const value = e.target.value,
    //         ddtext = e.target.ddtext,
    //         reasonOtherContent = this.reasonOtherContent;
    //     if(ddtext == '其他') {
    //         reasonOtherContent.style.display = 'inline-block';
    //     } else {
    //         reasonOtherContent.style.display = 'none';
    //     }
    //     this.setState({
    //         rejectReason: value
    //     });
    // }
    // changeInput = (inp, e, value) => { // input值变化
    //     if(inp == 'repaymentPeriod' || inp == 'period' || inp == 'kind') {
    //         this.setState({
    //             [inp]: value
    //         });
    //     } else {
    //         this.setState({
    //             [inp]: e.target.value
    //         });
    //     }
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
    // changeModify = () => {
    //     this.setState({
    //         modifyStatus: false
    //     })
    // }
    showLoanModal = () => { // 设置模态对话框
        this.setState({
            showLoanInfo: true,
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
	render() {
        const { routeParams } = this.props;
		let state = this.state;
        const {code, bcrumb, hkqs, hkfs, spjjyy, idcard, mismatch, baseInfo, baseAssetInfo, topInfo, pictureInfo, pictureType, eduDict, znqkList, relationship} = state;
        let action = routeParams.action
        // 以后有待修改
        let onOff = false;
        let markedText = '';
        if (topInfo && topInfo.comment) markedText = marked(topInfo.comment);
        if(mismatch) {
            for(let key in mismatch) {
                if(mismatch[key]) onOff = true
            }
        }
        let busiCheck = baseInfo.duplicateBusiCheck;
		return (
			<div className="netloan-detail-container">
                {/*{
                    /\/loan\//g.test(window.location.pathname)?
                    <Breadcrumb className='breadcrumb'>
                        <Breadcrumb.Item className='breadcrumb-item'><Link to="/loan">借款管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item className='breadcrumb-item'><Link onClick={()=>browserHistory.goBack()}>{/\/detail\//g.test(window.location.pathname) ? '借款详情' : '借款审批'}</Link></Breadcrumb.Item>
                        <Breadcrumb.Item className='breadcrumb-item'>进件详情</Breadcrumb.Item>
                    </Breadcrumb>
                    :
                    <Breadcrumb className='breadcrumb'>
                        <Breadcrumb.Item className='breadcrumb-item'><Link to="/ipieces/operate">进件管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item className='breadcrumb-item'>进件详情</Breadcrumb.Item>
                    </Breadcrumb>
                }*/}
                <IpiecesBreadcrumb spjjyy={spjjyy} bcrumb={bcrumb} action={action} code={code} topInfo={topInfo} getTopInfo = { () => this.getInfo('/v1/loan/top','topInfo')} />
                <div className="netloan-detail-content">
                    {
                        topInfo && topInfo.custType == 2?
                        <p className='ipieces-cust-type'>该客户已被标识为黑名单用户</p>
                        : null
                    }
                    <div className="button-list">
                    {
                        (topInfo && topInfo.loanAuditVOList && topInfo.loanAuditVOList.length != 0) ?
                            <DetailLoanAudit loanAuditVOList={topInfo.loanAuditVOList} /> : null
                    }
                    {
                        topInfo && topInfo.loanOperatorVO && topInfo.loanOperatorVO.loanOver ?
                        <IpiecesPerson loanOperatorVO = {topInfo && topInfo.loanOperatorVO} />
                        : null
                    }
                    </div>
                    {
                        busiCheck && busiCheck.length > 0?
                        <div>
                            {
                                busiCheck.map((item, index) => (
                                    <p key={index}className='result-content'><span style={{cursor: 'pointer'}}  onClick={this.showLoanModal}>{item + '>>>'}</span></p>
                                ))
                            }
                        </div>
                        :
                        null
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
                    <div style={{overflow: 'hidden'}}>
                        {
                            topInfo && topInfo.loanOperatorVO && !topInfo.loanOperatorVO.loanOver && topInfo.prdType != 5 ?
                            <p style={{lineHeight: '34px', float: 'right'}}>
                            {
                                topInfo && topInfo.loanOperatorVO && topInfo.loanOperatorVO.mainCustomer ?
                                <span>主调客户经理：{topInfo.loanOperatorVO.mainCustomer}</span>
                                : null
                            }
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {
                                topInfo && topInfo.loanOperatorVO && topInfo.loanOperatorVO.mainCustomer ?
                                <span>陪调客户经理：{topInfo.loanOperatorVO.mainCustomer}</span>
                                : null
                            }
                            </p>
                            : null
                        }
                    </div>
                    {
                        topInfo.auditStatus || onOff?
                        <DetailVerifyResult topInfo={topInfo} showComment={this.showComment} autoNav = {this.autoNav} mismatch ={mismatch} />
                        : null
                    }
                	{topInfo ?
                        <div>
                            <Row className="netloan-title">
                                <Col span={12}>
                                    <span>产品类型：{topInfo.prdTypeText || '未录入'}</span>
                                </Col>
                                <Col span={12}>
                                    <span>产品名称：{topInfo.prdName || '未录入'}</span>
                                </Col>
                                <Col span={12}>
                                    <span>授信类型：{topInfo.authTypeText || '未录入'}</span>
                                </Col>
                                <Col span={12}>
                                    <span>借款用途：{topInfo.loanUseText || '未录入'}</span>
                                </Col>
                            </Row>
                        </div> : null
                	}

                    <Card className="card" title="黑名单" bordered={false}>
                        {
                            topInfo && topInfo.blackLists && topInfo.blackLists.length ?
                                <ul>
                                    {
                                        topInfo.blackLists.map((item,index)=>(
                                            <li className='card-item' key={index}>{item.riskInfo}</li>
                                        ))
                                    }
                                </ul>
                                :<p className='detail-noInfo'>暂无相关信息</p>
                        }
                    </Card>
                    <Tabs defaultActiveKey="basicInfo" className='detail-tabs'>
                        <TabPane tab="基本信息" key="basicInfo">
                            {
                                baseInfo?
                                <DetailNetBaseInfo baseInfo={ baseInfo } pictureInfo={ pictureInfo } showPicture = {this.showPicture} eduDict = { eduDict } znqkList = { znqkList } relationship = { relationship } showDetail = {this.showDetail} />
                                :null
                            }
                        </TabPane>
                        <TabPane tab="资产信息" key="assetHouse">
                            <DetailNetAsset baseAssetInfo={ baseAssetInfo } pictureInfo={ pictureInfo } showPicture = {this.showPicture} />
                        </TabPane>
                    </Tabs>
                    { action == 'approve' || action == 'check' ?
                        <ApproveCheck {...{code, action, baseInfo, hkqs, hkfs, type: 'netLoan'}} />:null
                    }
                </div>
                {
                    pictureInfo && pictureType?
                    <CarouselImg pictureInfo = {pictureInfo} previewHide={this.previewHide} previewPic={this.state.previewPic} pictureType={this.state.pictureType} />:
                    ''
                }
                {
                    pictureInfo && baseInfo && idcard?
                    <DetailImg idcard={idcard} baseInfo = {baseInfo} detailPic = {this.state.detailPic}  previewHide={this.previewHide} pictureInfo={pictureInfo} />:
                    null
                }
			</div>
		);
	}
}

export default NetLoanDetail;
