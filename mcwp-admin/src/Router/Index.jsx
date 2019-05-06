/**
* 疑惑一：
* React createClass 和 extends React.Component 有什么区别?
* 之前写法：
* let app = React.createClass({
*  	getInitialState: function(){
*    	// some thing
*  	}
*  })
* ES6写法(通过es6类的继承实现时state的初始化要在constructor中声明)：
* class exampleComponent extends React.Component {
*    constructor(props) {
*        super(props);
*        this.state = {example: 'example'}
*    }
* }
*/

import React, { Component } from 'react'; // react核心
import { Router, Route, Redirect, IndexRoute, browserHistory } from 'react-router'; // 创建route所需
import BasicLayout from '../Component/Layout/BasicLayout'; // 布局界面
import login from '../Containers/Login/LoginIndex'; // 登录界面
import weauth from '../Containers/Wechat/Weauth'; // 微信公授权中间页

import { Config } from '../Config/Index';
import IntegralIndex from '../Containers/Integral/IntegralIndex';

/**
 * (路由根目录组件，显示当前符合条件的组件)
 *
 * @class LoginLayout
 * @extends {Component}
 */
class LoginLayout extends Component {
	render() {
		// 这个组件是一个包裹组件，所有的路由跳转的页面都会以this.props.children的形式加载到本组件下
		return (
			<div className="root-container">{this.props.children}</div>
		);
	}
}

const history = browserHistory;

// 重发验证到邮箱
const verifyEmail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Login/VerifyEmail').default);
    }, 'verifyEmail');
}

// 忘记密码
const forgotPwd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Login/ForgotPwd').default);
    }, 'forgotPwd');
}

//设置密码
const setPwd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Login/SetPwd').default);
    }, 'setPwd');
}

//版本升级
const versionUp = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Common/VersionUp').default);
    }, 'versionUp');
}

// 设置管理员密码
const setManagePwd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Login/SetmanagePwd').default);
    }, 'setManagePwd');
}

// 首页
const home = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Home/HomeIndex').default);
    }, 'home');
}

// 用户管理
const user = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/User/UserIndex').default);
    }, 'user');
}
// 小组管理
const group = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Group/GroupIndex').default);
    }, 'group');
}
// 新增小组
const addGroup = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Group/AddGroup').default);
    }, 'addGroup');
}

// 新增用户
const addUser = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/User/AddNewuser').default);
    }, 'addUser');
}

// 新增任务
const addTask = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Task/AddTask').default);
    }, 'addTask');
}

// 权限管理
const authority = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Authority/AuthorityIndex').default);
    }, 'authority');
}

// 操作记录
const oRecord = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Operation/RecordIndex').default);
    }, 'oRecord');
}

// 任务管理
const task = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Task/TaskIndex').default);
    }, 'task');
}

// 任务详情
const taskDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Task/TaskDetail').default);
    }, 'taskDetail');
}

// 产品管理
const product = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Product/ProductIndex').default);
    }, 'product');
}
// 产品管理详情
const productDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Product/ProductDetail').default);
    }, 'productDetail');
}
// 产品分享
const productShare = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/Product/ProductShare').default);
    }, 'productShare');
}
// 新增产品
const productAdd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Product/ProductAdd').default);
    }, 'productAdd');
}

// 进件管理
const iPieces = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Ipieces/IpiecesIndex').default);
    }, 'iPieces');
}

// 进件下载导出文件
const ipiecesExport = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Ipieces/IpiecesExport').default);
    }, 'ipiecesExport');
}

// 调查报告编辑
const ipiecesEdit = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Ipieces/IpiecesEdit').default);
    }, 'ipiecesEdit');
}

// 调查报告编辑录入详细报表
const ipiecesEditDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Ipieces/IpiecesEditDetail').default);
    }, 'ipiecesEditDetail');
}

// 调查报告编辑逻辑校验
const ipiecesEditVerify = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Ipieces/IpiecesEditVerify').default);
    }, 'ipiecesEditVerify');
}

// 进件管理详情
const ipiecesDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Ipieces/IpiecesDetail').default);
    }, 'ipiecesDetail');
}
const ipiecesPersonDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Ipieces/IpiecesPersonDetail').default);
    }, 'ipiecesPersonDetail');
}
// 进件管理详情-共同借款人/担保人征信查看
const ipiecesViewDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Ipieces/IpiecesViewDetail').default);
    }, 'ipiecesViewDetail');
}
// 经营贷详情
const operateLoanDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Ipieces/OperateLoanDetail').default);
    });
}

// 网贷详情
const netLoanDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Ipieces/NetLoanDetail').default);
    }, 'netLoanDetail');
}

// 规则库列表
const rule = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Rule/RuleList').default);
    }, 'rule');
}
// 规则库tab
const ruleConfig = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Rule/RuleIndex').default);
    }, 'ruleConfig');
}

// 规则库查看
const ruleBank = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Rule/Bank').default);
    }, 'ruleBank');
}

// 规则库详情
const ruleDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Rule/RuleDetail').default);
    }, 'ruleDetail');
}

// 规则库新增
const ruleAdd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Rule/RuleAdd').default);
    }, 'ruleAdd');
}

// 规则库现场调查拍照项新增
const rulePhotoAdd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Rule/RulePhotoAdd').default);
    }, 'rulePhotoAdd');
}

// 规则库现场调查拍照项新增
const rulePhotoDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Rule/RulePhotoDetail').default);
    }, 'rulePhotoDetail');
}

// 数据服务
const dataService = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Data/Service').default);
    }, 'dataService');
}

// 数据服务详情
const dataServiceDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Data/ServiceDetail').default);
    }, 'dataServiceDetail');
}

// 客户管理
const customer = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Customer/CustomerIndex').default);
    }, 'customer');
}

// 客户管理 -- 新增客户/编辑客户
const customerHandle = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Customer/CustomerHandle').default);
    }, 'customerHandle');
}

// 客户管理 -- 客户详情
const customerDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Customer/CustomerDetail').default);
    }, 'customerDetail');
}

// 客户管理 -- 导入客户
const customerExport = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Customer/CustomerExport').default);
    }, 'customerExport');
}

// 消息模版管理
const template = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Template/Template').default);
    }, 'template');
}

// 消息模版新增
const templateAdd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Template/TemplateAdd').default);
    }, 'templateAdd');
}
// 营销消息模版新增
const operateTemplateAdd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Template/OperateTemplateAdd').default);
    }, 'operateTemplateAdd');
}

// 授信额度管理
const creditLine = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/CreditLine/CreditLine').default);
    }, 'creditLine');
}
// 借款管理
const loanIndex = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Loan/LoanIndex').default);
    }, 'loanIndex');
}
// 借款审批或借款详情
const loanOperate = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Loan/LoanOperate').default);
    }, 'loanOperate');
}

// 合同管理
const contract = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Contract/Contract').default);
    }, 'contract');
}

// 合同详情
const contractDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Contract/ContractDetail').default);
    }, 'contractDetail');
}

// 合同编辑
const contractEdit = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Contract/ContractEdit').default);
    }, 'contractEdit');
}

//报表-营销数据统计
const marketReports = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Reports/Marketing').default)
    }, 'marketReports')
}

//报表-贷款数据统计
const loanReports = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Reports/Loan').default)
    }, 'loanReports')
}
//报表-数据汇总统计
const dataSumReports = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Reports/DataSum').default)
    }, 'dataSumReports')
}

// 微信公众号授权/已绑定
const wechat = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Wechat/Wechat').default);
    }, 'wechat');
}

// 微信公众号设置
const wechatSet = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Wechat/WechatSet').default);
    }, 'wechatSet');
}
// 微信公众号 银行网点新增和编辑
const pointHandle = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Wechat/PointOperate').default);
    }, 'pointHandle');
}

// 数据分析服务
const daIndex = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/DA/DAIndex').default);
    }, 'daIndex');
}

// 催收管理
const collection = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Collection/Collection.jsx').default);
    }, 'collection');
}
// 催收管理详情
const collectionDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Collection/CollectionDetail.jsx').default);
    }, 'collectionDetail');
}

// 版本管理
const version = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Version/Version').default);
    }, 'version');
}

// 版本管理详情
const versionDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Version/VersionDetail').default);
    }, 'versionDetail');
}

// 报账管理
const report = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Report/Report').default);
    }, 'report');
}

// 报账管理详情
const reportDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Report/ReportDetail').default);
    }, 'reportDetail');
}
// 意见反馈
const suggestionEdit = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Suggestion/SuggestionEdit').default);
    }, 'suggestionEdit');
}

// 营销模板
const marketTemplate = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Market/MarketTemplate').default);
    }, 'marketTemplate');
}

// 营销管理-群发记录
const marketMessage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Message/MessageRecord').default);
    }, 'marketMessage');
}
// 营销管理-微站管理
const wxStation = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/WxStation/WxStation').default);
    }, 'wxStation');
}
// 营销管理-群发短信
const messageSend = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Message/MessageSend').default);
    }, 'messageSend');
}
// 营销分享得积分
const marketNewShare = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Market/MarketNewShare').default);
    }, 'marketNewShare');
}
// 营销分享规则
const marketShareRule = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Market/MarketShareNewRule').default);
    }, 'marketShareRule');
}
// 积分管理
const integralIndex = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Integral/IntegralIndex').default);
    }, 'integralIndex');
}
// 营销分享规则
const integralRule = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Integral/IntegralRule').default);
    }, 'integralRule');
}

// 投屏显示
const screen = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Screen/Screen').default);
    }, 'screen');
}
// 数据工作台
const workbench = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Screen/DataScreen').default);
    }, 'workbench');
}

// 活动管理
const activityIndex = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Activity/ActivityIndex').default);
    }, 'activityIndex');
}

// 活动管理
const activityAdd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Activity/ActivityAdd').default);
    }, 'activityAdd');
}
const jigsawAdd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Activity/JigsawAdd').default);
    }, 'jigsawAdd');
}
const shakeAdd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Activity/ShakeAdd').default);
    }, 'shakeAdd');
}
// 活动管理
const activityDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Activity/ActivityDetail').default);
    }, 'activityDetail');
}
const jigsawDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Activity/JigsawDetail').default);
    }, 'jigsawDetail');
}

// 营销管理 -- 营销记录
const valuationIndex = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Valuation/ValuationIndex').default);
    }, 'valuationIndex');
}

// 营销管理 -- 营销记录详情
const valuationDetail = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('../Containers/Valuation/ValuationDetail').default);
  }, 'valuationDetail');
}


// 进件PDF，临时导入
const ipiecesPDF = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/Ipieces/PDF/PDF').default);
    }, 'ipiecesPDF');
}

// 系统配置 —— 表单配置
const formConf = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../Containers/Form/FormConf').default);
  }, 'sysFrom')
}

// 系统配置 —— 申请表单配置
const formApplyConf = (location, cb) => {
    require.ensure([], require => {
      cb(null, require('../Containers/Form/FormApplyConf').default);
    }, 'sysFrom')
}

// // 系统配置 —— 申请表单字段配置
// const formApplyField = (location, cb) => {
//     require.ensure([], require => {
//       cb(null, require('../Containers/Form/FormApplyField').default);
//     }, 'sysFrom')
// }

// 系统配置 —— 共用字段配置
const formField = (location, cb) => {
    require.ensure([], require => {
      cb(null, require('../Containers/Form/FormField').default);
    }, 'sysFrom')
}

// 系统配置 —— 调查表单配置
const formInvestigateConf = (location, cb) => {
    require.ensure([], require => {
      cb(null, require('../Containers/Form/FormInvestigateConf').default);
    }, 'sysFrom')
}

// 系统配置 —— 调查表单模块配置
const formInvestigateModule = (location, cb) => {
    require.ensure([], require => {
      cb(null, require('../Containers/Form/FormInvestigateModule').default);
    }, 'sysFrom')
}

// 系统配置 —— 调查表单字段配置
const formInvestigateField = (location, cb) => {
    require.ensure([], require => {
      cb(null, require('../Containers/Form/FormInvestigateField').default);
    }, 'sysFrom')
}

// 系统配置 —— 现场调查表单配置
const formSiteConf = (location, cb) => {
    require.ensure([], require => {
      cb(null, require('../Containers/Form/FormSiteConf').default);
    }, 'sysFrom')
}

// 营销管理 —— 利率营销
const marketRate = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Marketing/Rate').default);
    }, 'marketRate');
}
// 营销管理 —— 抵息红包
const interestRelief = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Marketing/InterestRelief').default);
    }, 'interestRelief');
}

// 利率营销 —— 规则设置
const marketRateRule = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Marketing/RateRule').default);
    }, 'marketRateRule');
  }
// 抵息红包 —— 规则设置
const interestReliefRule = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Marketing/InterestReliefRule').default);
    }, 'interestReliefRule');
  }

// 营销管理 —— 渠道管理
const marketChannel = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('../Containers/Marketing/Channel').default);
  }, 'marketChannel');
}

// 营销管理 —— 渠道管理详情
const channelDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Marketing/ChannelDetail').default);
    }, 'channelDetail');
  }
  // 营销管理 —— 渠道管理编辑
const channelEdit = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Marketing/ChannelEdit').default);
    }, 'channelEdit');
  }
  // 营销管理 —— 渠道管理-自有员工批量添加
const channelBatchAdd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Marketing/ChannelBatchAdd').default);
    }, 'channelBatchAdd');
  }
// 系统配置 —— 支行网点配置
const subbranch = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Sys/Subbranch').default);
    }, 'subbranch');
}

// 系统配置 —— 支行网点配置 —— 编辑/新增
const subbranchOpt = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Sys/SubbranchOpt').default);
    }, 'subbranchOpt');
}

// 扫码登录
const scan = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Scan/Scan').default);
    }, 'scan');
}

// 错误页面 超时页面 异常页面
const ErrorPage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Error/Page').default);
    }, 'ErrorPage');
}

const NotFound = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Containers/Error/NotFound').default);
    }, 'ErrorPage');
}

// 登录验证
const requireAuth = async (nextState, replace) => {
    const enterpCode = Config.getQueryString('enterpCode');
    const str = Config.getQueryString('str');
	if(!localStorage.USER_AUTHORIZATION && (!enterpCode || !str)) {
		replace({
			pathname: '/login',
			state: { nextPathname: nextState.location.pathname }
		});
	} else {

        // if(currentStep && step && currentStep > step) {
        //     replace({
        //         pathname: '/product/add/' + step + '/' + params.id,
        //         state: { nextPathname: nextState.location.pathname }
        //     });
        // } else if((currentStep > 0 && params.id == 'undefined') || (currentStep > 0 && !params.id)) {
        //     replace({
        //         pathname: '/product/add/0',
        //         state: { nextPathname: nextState.location.pathname }
        //     });
        // } else if(!currentStep || currentStep == 'undefined' || (step != 3 && currentStep != 0)) {
        //     Config.removeLocalItem('PRODUCT_STEP');
        // } else if (currentStep && step && currentStep < step && step != 3 && currentStep != 0) {
        //     Config.localItem('PRODUCT_STEP', currentStep);
        // }
    }
}

// 此处为要点击刷新的组件
const arr = [
    user, authority, oRecord, task,
    product, iPieces, ruleDetail, ruleBank,
    ruleAdd, rule, dataService, customer,
    template, creditLine, contract,
    loanIndex, daIndex, collection, marketNewShare,integralIndex,activityIndex,
    marketChannel, marketRate, interestRelief,marketReports, loanReports,dataSumReports
]
// 开关优化
let onOff =false;
// 页面强制刷新，如果需要强制刷新在路由中添加onChange事件以及在组件数组添加
const createElement=(component, props) =>{
    if (props.children && onOff || props.children && arr.includes(props.routes.slice(-1)[0].getComponent)) {
        let children = Object.assign({}, props.children, {key : `${window.location.pathname}` + new Date().getTime()})
        props = { ...props, children };
        onOff = false;
    }
    return React.createElement(component, props)
 }
 const onChange = (props, next) => {
     onOff = true
     console.log(`${next.location.pathname}`, 'change');
    //  browserHistory.push('/empty');
    //  browserHistory.push(`${next.location.pathname}`);
 }


const RouteConfig = (
	<Router history={history} createElement = {createElement}>
        <Route path="/" component={BasicLayout}>
            <IndexRoute getComponent={home} onEnter={requireAuth} /> {/* 默认加载的组件，比如访问www.test.com,会自动跳转到www.test.com/home */}
			<Route path="/" getComponent={home} onEnter={requireAuth} /> {/* 首页 */}
			<Route path="/user" getComponent={user} onChange = {onChange} onEnter={requireAuth} /> {/* 用户管理 */}
			<Route path="/group" getComponent={group} onChange = {onChange} onEnter={requireAuth} /> {/* 小组管理 */}
			<Route path="/addgroup" getComponent={addGroup} onChange = {onChange} onEnter={requireAuth} /> {/* 新增小组 */}
            <Route path="/addnew" getComponent={addUser} onEnter={requireAuth} onChange = {onChange}/> {/* 新增用户 */}
            <Route path="/addtask" getComponent={addTask} onEnter={requireAuth} /> {/* 新增任务 */}
            <Route path="/authority" getComponent={authority} onChange = {onChange} onEnter={requireAuth} /> {/* 权限管理 */}
			<Route path="/orecord" getComponent={oRecord} onChange = {onChange} onEnter={requireAuth} /> {/* 操作记录 */}
            <Route path="/tasks/details/:id" getComponent={taskDetail} onEnter={requireAuth} /> {/* 任务详情 */}
            <Route path="/tasks/all" getComponent={task} onChange = {onChange} onEnter={requireAuth} /> {/* 任务管理 */}
            <Route path="/product/add/:step(/:id)" getComponent={productAdd} onChange = {onChange} onEnter={requireAuth} /> {/* 新增、编辑产品 */}
            <Route path="/product/share/:code" getComponent={productShare} onEnter={requireAuth} /> {/* 产品分享 */}
            <Route path="/product(/:tab)" getComponent={product} onChange = {onChange} onEnter={requireAuth} /> {/* 产品管理 */}
            <Route path="/product/detail/:code" getComponent={productDetail} onChange = {onChange} onEnter={requireAuth} /> {/* 产品管理详情 */}
            <Route path="/ipieces/export" getComponent={ipiecesExport} onEnter={requireAuth} /> {/* 进件下载导出文件 */}
            <Route path="/ipieces/edit/detail/:id/:type(/:tab)" getComponent={ipiecesEditDetail} onEnter={requireAuth} /> {/* 调查报告编辑 */}
            <Route path="/ipieces/edit/verify/:type/:id/:ipiecesType" getComponent={ipiecesEditVerify} onEnter={requireAuth} /> {/* 调查报告编辑 */}
            <Route path="/ipieces/edit/:code/:type" getComponent={ipiecesEdit} onEnter={requireAuth} /> {/* 调查报告编辑 */}
            <Route path="/ipieces/view/detail/:type/:code" getComponent={ipiecesViewDetail} onEnter={requireAuth} />
            <Route path="/ipieces/details/:code" getComponent={ipiecesPersonDetail} onEnter={requireAuth} />
            <Route path="/ipieces/detail/:type/:code" getComponent={ipiecesDetail} onEnter={requireAuth} />
            <Route path="/ipieces(/:tab)" getComponent={iPieces} onChange = {onChange} onEnter={requireAuth} /> {/* 调进件管理 */}
            <Route path="/:from/:action/ipieces/operate/:id/:type" getComponent={operateLoanDetail} onEnter={requireAuth} /> {/* 借款经营贷详情 */}
            <Route path="/ipieces/operate/:id/:type(/:action)" getComponent={operateLoanDetail} onEnter={requireAuth} /> {/* 经营贷详情 */}
            <Route path="/:from/:action/ipieces/netLoan/:id" getComponent={netLoanDetail} onEnter={requireAuth} /> {/* 借款网贷详情 */}
            <Route path="/ipieces/netLoan/:id(/:action)" getComponent={netLoanDetail} onEnter={requireAuth} /> {/* 网贷详情 */}
            <Route path="/rule/detail(/:id)" getComponent={ruleDetail} onChange = {onChange} onEnter={requireAuth} /> {/* 规则库详情 */}
            <Route path="/rule/bank(/:tab)(/:type)(/:id)" getComponent={ruleBank} onChange = {onChange} onEnter={requireAuth} /> {/* 规则库 */}
            <Route path="/rule/add(/:id)" getComponent={ruleAdd} onChange = {onChange} onEnter={requireAuth} /> {/* 规则库新增 */}
            <Route path="/rule/photo/add(/:id)" getComponent={rulePhotoAdd} onChange = {onChange} onEnter={requireAuth} /> {/* 规则库列表 */}
            <Route path="/rule/photo/detail(/:id)" getComponent={rulePhotoDetail} onChange = {onChange} onEnter={requireAuth} /> {/* 规则库列表 */}
            <Route path="/rule" getComponent={rule} onChange = {onChange} onEnter={requireAuth} /> {/* 规则库列表 */}
            <Route path="/rule/:tab" getComponent={ruleConfig} onChange = {onChange} onEnter={requireAuth} /> {/* 规则库列表 */}
            <Route path="/data/service/:code" getComponent={dataServiceDetail} onEnter={requireAuth} /> {/* 数据服务详情 */}
            <Route path="/datas(/:tab)" getComponent={dataService} onChange = {onChange} onEnter={requireAuth} /> {/* 数据服务 */}
            <Route path="/customer/list" getComponent={customer} onChange = {onChange} onEnter={requireAuth} /> {/* 客户管理 */}
            <Route path="/customer/detail/:code" getComponent={customerDetail} onEnter={requireAuth} /> {/* 客户管理 -- 客户详情 */}
            <Route path="/customer/handle(/:code)" getComponent={customerHandle} onEnter={requireAuth} /> {/* 客户管理 -- 新增客户 */}
            <Route path="/customer/export" getComponent={customerExport} onEnter={requireAuth} />  {/* 客户管理 -- 导入客户 */}
            <Route path="/template/add/tpl(/:id)" getComponent={templateAdd} onEnter={requireAuth} /> {/* 消息模版管理 */}
            <Route path="/template/add/operate" getComponent={operateTemplateAdd} onEnter={requireAuth} /> {/* 消息模版管理-新增营销模板 */}
            <Route path="/template/add/operate/:code" getComponent={operateTemplateAdd} onEnter={requireAuth} /> {/* 消息模版管理-编辑营销模板 */}
            <Route path="/template(/:tab)(/:type)" getComponent={template} onChange = {onChange} onEnter={requireAuth} /> {/* 消息模版管理 */}
            <Route path="/credit" getComponent={creditLine} onChange = {onChange} onEnter={requireAuth} /> {/* 授信额度管理 */}
            <Route path="/contract(/:tab)" getComponent={contract} onChange = {onChange} onEnter={requireAuth} /> {/* 合同管理 */}
            <Route path="/contract/detail/:code" getComponent={contractDetail} onEnter={requireAuth} /> {/* 合同详情 */}
            <Route path="/contract/edit/:code" getComponent={contractEdit} onEnter={requireAuth} /> {/* 合同编辑 */}
            <Route path="/reports/marketing(/:tab)" getComponent={marketReports} onChange = {onChange} onEnter={requireAuth} /> {/* 营销数据统计 */}
            <Route path="/reports/loan(/:tab)" getComponent={loanReports} onChange = {onChange} onEnter={requireAuth} /> {/* 贷款数据统计 */}
            <Route path="/reports/datasum(/:tab)" getComponent={dataSumReports} onChange = {onChange} onEnter={requireAuth} /> {/* 贷款数据统计 */}
            <Route path="/loan/:type" getComponent={loanOperate} onEnter={requireAuth}/> {/* 借款审批或借款详情 */}
            <Route path="/loan/:type/:code" getComponent={loanOperate} onEnter={requireAuth}/> {/* 借款审批或借款详情 */}
            <Route path="/loans(/:tab)" getComponent={loanIndex} onChange = {onChange} onEnter={requireAuth} /> {/* 借款管理 */}
            <Route path="/wechat" getComponent={wechat} onEnter={requireAuth} /> {/* 微信公众号授权/已绑定 */}
            <Route path="/wechat/set/:tab" getComponent={wechatSet} onEnter={requireAuth} /> {/* 微信公众号设置 */}
            <Route path="/wechat/handle(/:code)" getComponent={pointHandle} onEnter={requireAuth} /> {/* 微信公众号 网点新增和编辑 */}
            <Route path="/collection/detail/:code" getComponent={collectionDetail} onEnter={requireAuth} /> {/* 催收管理详情 */}
            <Route path="/collection(/:tab)" getComponent={collection} onChange = {onChange} onEnter={requireAuth} /> {/* 催收管理 */}
            <Route path="/data/analysis/marketing" getComponent={daIndex} onChange = {onChange} onEnter={requireAuth} /> {/* 微信公众号 网点新增和编辑 */}
            <Route path="/version" getComponent={version} onEnter={requireAuth} /> {/* 版本管理 */}
            <Route path="/version/detail/:code" getComponent={versionDetail} onEnter={requireAuth} /> {/* 版本管理 */}
            <Route path="/report/detail/:code" getComponent={reportDetail} onEnter={requireAuth} onChange = {onChange} /> {/* 报账管理详情 */}
            <Route path="/report(/:tab)" getComponent={report} onEnter={requireAuth} onChange = {onChange} /> {/* 报账管理 */}
            <Route path="/suggestion/edit" getComponent={suggestionEdit} onEnter={requireAuth} /> {/* 意见反馈 */}
            <Route path="/market/template" getComponent={marketTemplate} onEnter={requireAuth} /> {/* 营销模版 */}
            <Route path="/market/message" getComponent={marketMessage} onChange = {onChange} onEnter={requireAuth} /> {/* 群发记录 */}
            <Route path="/market/wxstation" getComponent={wxStation} onChange = {onChange} onEnter={requireAuth} /> {/* 微站管理 */}
            <Route path="/market/sendmessage" getComponent={messageSend} onEnter={requireAuth} /> {/* 群发短信 */}
            <Route path="/market/share(/:tab)" getComponent={marketNewShare} onChange = {onChange} onEnter={requireAuth} /> {/* 营销分享 */}
            <Route path="/integral(/:tab)" getComponent={integralIndex} onChange = {onChange} onEnter={requireAuth} /> {/* 积分管理 */}
            <Route path="/integral/rule/set" getComponent={integralRule} onEnter={requireAuth} /> {/*积分规则 */}
            <Route path="/market/sharerule" getComponent={marketShareRule} onEnter={requireAuth} /> {/* 营销分享规则 */}
            <Route path="/market/activity(/:tab)" getComponent={activityIndex} onChange = {onChange} onEnter={requireAuth} /> {/* 活动管理 */}
            <Route path="/market/drawActivity/add(/:code)" getComponent={activityAdd} onChange = {onChange} onEnter={requireAuth} /> {/* 活动新增 */}
            <Route path="/market/jigsawActivity/add(/:code)" getComponent={jigsawAdd} onChange = {onChange} onEnter={requireAuth} /> {/* 拼图活动新增 */}
            <Route path="/market/shakeActivity/add(/:code)" getComponent={shakeAdd} onChange = {onChange} onEnter={requireAuth} /> {/* 摇一摇活动新增 */}
            <Route path="/market/drawActivity/detail(/:code)" getComponent={activityDetail} onChange = {onChange} onEnter={requireAuth} /> {/* 活动详情 */}
            <Route path="/market/jigsawActivity/detail(/:code)" getComponent={jigsawDetail} onChange = {onChange} onEnter={requireAuth} /> {/* 拼图活动详情 */}
            <Route path="/market/valuation" getComponent={valuationIndex} onChange = {onChange} onEnter={requireAuth} /> {/* 活动管理 */}
            <Route path="/market/valuation" getComponent={valuationIndex} onChange = {onChange} onEnter={requireAuth} /> {/* 营销管理 -- 营销记录 */}
            <Route path="/market/valuation/detail/:code" getComponent={valuationDetail} onEnter={requireAuth} /> {/* 营销管理 -- 营销记录详情 */}
            <Route path="/form" getComponent={formConf} onChange={onChange} onEnter={requireAuth} /> {/* 系统管理 —— 表单配置 */ }
            <Route path="/form/apply/:prdType" getComponent={formApplyConf} onChange={onChange} onEnter={requireAuth} /> {/* 系统管理 —— 申请表配置 */ }
            <Route path="/form/apply/:formEnName/:prdType" getComponent={formField} onChange={onChange} onEnter={requireAuth} /> {/* 系统管理 —— 申请表字段配置 */ }
            <Route path="/form/investigate/:prdType" getComponent={formInvestigateConf} onChange={onChange} onEnter={requireAuth} /> {/* 系统管理 —— 调查表配置 */ }
            <Route path="/form/investigate/:formEnName/:prdType" getComponent={formInvestigateModule} onChange={onChange} onEnter={requireAuth} /> {/* 系统管理 —— 调查表模块配置 */ }
            <Route path="/form/investigate/:formEnName/:moudleEnName/:prdType" getComponent={formInvestigateField} onChange={onChange} onEnter={requireAuth} /> {/* 系统管理 —— 调查表字段配置 */ }
            <Route path="/form/site/:prdType" getComponent={formSiteConf} onChange={onChange} onEnter={requireAuth} /> {/* 系统管理 —— 现场调查表配置 */ }
            <Route path="/form/site/:formEnName/:prdType" getComponent={formField} onChange={onChange} onEnter={requireAuth} /> {/* 系统管理 —— 现场调查表字段配置 */ }
            <Route path="/subbranch" getComponent={subbranch} onChange={onChange} onEnter={requireAuth} /> {/* 系统配置 —— 支行网点配置 */ }
            <Route path="/subbranch/opt(/:code)" getComponent={subbranchOpt} onChange={onChange} onEnter={requireAuth} /> {/* 系统配置 —— 支行网点配置 */ }
            <Route path="/404" getComponent={NotFound} onEnter={requireAuth} />
		</Route>
        <Route path="marketing" component={BasicLayout} onEnter={requireAuth}> {/* 营销管理 */}
            <IndexRoute getComponent={home} onEnter={requireAuth} /> {/* 默认路由，目前为首页，后期可能改为 Not found 页面 */}
            <Route path="rate" getComponent={marketRate} onEnter={requireAuth} /> {/* 营销管理 —— 利率营销 */}
            <Route path="interestRelief" getComponent={interestRelief} onEnter={requireAuth} /> {/* 营销管理 —— 抵息红包 */}
            <Route path="rate/rule" getComponent={marketRateRule} onEnter={requireAuth} /> {/* 利率营销 —— 规则设置 */}
            <Route path="interestRelief/rule" getComponent={interestReliefRule} onEnter={requireAuth} /> {/* 利率营销 —— 规则设置 */}
            <Route path="channel(/:tab)" getComponent={marketChannel} onEnter={requireAuth} /> {/* 营销管理 —— 渠道管理 */}
            <Route path="channeldetail/:code" getComponent={channelDetail} onEnter={requireAuth} /> {/* 营销管理 —— 渠道管理详情 */}
            <Route path="channeledit/:code" getComponent={channelEdit} onEnter={requireAuth} /> {/* 营销管理 —— 渠道管理编辑 */}
            <Route path="channelBatchAdd" getComponent={channelBatchAdd} onEnter={requireAuth} /> {/* 营销管理 —— 渠道管理-自由员工批量创建 */}
        </Route>
		<Route path="/login" component={LoginLayout}> {/* 所有的访问，都跳转到LoginLayout */}
			<IndexRoute component={login} /> {/* 默认加载的组件，比如访问www.test.com,会自动跳转到www.test.com/home */}
			<Route path="/forgotPwd" getComponent={forgotPwd} /> {/* 忘记密码 */}
			<Route path="/setPwd" getComponent={setPwd} /> {/* 设置密码 */}
            <Route path="/setManagePwd" getComponent={setManagePwd} /> {/* 设置管理员密码 */}
            <Route path="/verifyEmail" getComponent={verifyEmail} /> {/* 重发验证到邮箱 */}
            <Route path="/version" getComponent={versionUp} /> {/* 版本升级 */}
            <Route path="/error/:code" getComponent={ErrorPage} /> {/* 错误页面 */}
        </Route>
        <Route path="/weauth" component={LoginLayout}>
            <IndexRoute component={weauth} />
        </Route>
        <Route path="/scan">
            <IndexRoute getComponent={scan} />
        </Route>
        <Route path="/screen" component={LoginLayout} onEnter={requireAuth}>
            <IndexRoute getComponent={screen} onEnter={requireAuth}/>
        </Route>
        <Route path="/workbench/:type" component={LoginLayout} onEnter={requireAuth}>
            <IndexRoute getComponent={workbench} onEnter={requireAuth}/>
        </Route>
        <Route path="/test/ipieces/pdf/:code/:type" component={LoginLayout} onEnter={requireAuth}>
            <IndexRoute getComponent={ipiecesPDF} onEnter={requireAuth}/>
        </Route>
		<Redirect from="*" to="/404" />
	</Router>
);

export default RouteConfig;
