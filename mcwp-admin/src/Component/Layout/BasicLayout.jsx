import React, { Component } from 'react'; // 引入了React和PropTypes。PropTypes是用于检查props参数类型，可有可无，最好是有
import { is, fromJS } from 'immutable';
import { message, Spin } from 'antd';
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router'; // 创建route所需
import developmentCode from './../../Assets/Images/development-code.png';
// import linkUrlBg from './../../Assets/Images/link-url-bg.png';
import releaseCode from './../../Assets/Images/pre-release-code.png';
import productCode from './../../Assets/Images/product-code.png';
import hoverImg from './../../Assets/Images/icon_scan.png';
import noticeImg from './../../Assets/Images/icon_notice.png';
import BaseService from '../../Services/BaseService';//调用数据
import UserService from '../../Services/UserService';
// 公共头部
import Lheader from './LayoutHeader';

// 公共菜单
import Lmenu from './LayoutMenu';

// Modal对话框(修改密码)
import Modpwdmodal from '../Modal/ModpwdModal';

// 布局样式
import './style/layout.less';

import { Layout } from 'antd';
const { Content, Sider } = Layout;

/**
 * (路由根目录组件，显示当前符合条件的组件)
 *
 * @class Main
 * @extends {Component}
 */
class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mKey: '',
    		mVisible: false,
			roles: '',
			showCode: false,
			science: 1,
			noticeData: null,
			zaDecisionUrl: null,
			loading: true,
			isOp: false
		};
	}
	componentWillMount() {
		this.loginOperate();
		this.getNotice();
	}
	componentDidMount() {
		const that = this;
		const currentUrl = window.location.href;
        if (currentUrl.indexOf('mp-test.zhudb.com') > -1) {
			that.setState({
				science: 2
			});
        } else if (currentUrl.indexOf('mp.zhudb.com') > -1) {
            that.setState({
				science: 3
			});
        } else {
			that.setState({
				science: 1
			});
		}
		that.setState({
			loading: false
		})
	}
	async loginOperate() {
		const that = this;
		const enterpCode = Config.getQueryString('enterpCode');
		const str = Config.getQueryString('str');
		if (enterpCode && str && sessionStorage.getItem('LOGIN_STR') != str) {
			that.setState({
				isOp: true
			});
			const res = await UserService.loginOperate({enterpCode: enterpCode, str: str});
			if (res.code == Config.errorCode.success) {
				let data = res.data;
				// 登录成功
				// 所有运营平台角色跳转后放开所有看到模块权限
				// ROLE_SUPER_ADMIN ROLE_OPERATE
				let roleArr = data.roles;
				if (!roleArr.includes('ROLE_SUPER_ADMIN')) roleArr.push('ROLE_SUPER_ADMIN')
				let roles = roleArr.join('&');
				Config.localItem('CUR_ROLE', roles);       // 本地存储用户角色
				Config.localItem('CUR_ROLE_LEVEL', data.roleLevel);   // 本地存储用户权限等级
				Config.localItem('USER_AUTHORIZATION', data.token);   // 本地存储token
				Config.localItem('LOGIN_USER', data.userName);             // 本地存储用户名
				Config.localItem('LOGIN_USER_NAME', data.nickName);   // 本地存储姓名
				Config.localItem('LOGIN_SEX', data.sex);   // 登录用户性别
				Config.localItem('LOGIN_USER_ID', data.userId);       // 本地存储用户ID
				Config.localItem('ENTERP_NAME', data.enterpName); // 企业名称
				Config.localItem('ENTERP_LOGO', data.logo); // 企业LOGO
				Config.localItem('ENTERP_CODE', data.enterpCode); // 企业编号
				Config.localItem('SELECTEDKEY', '/data/analysis/marketing');
				Config.localItem('OPENKEY', '业务管理');
				sessionStorage.setItem('LOGIN_STR', str);
				that.setState({
					isOp: false
				});
			} else {
				browserHistory.push('/error/timeout');
			}
		}
	}
	//获取版本公告
	getNotice = (param) => {
		BaseService.getNotice(param, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
					noticeData: res.data && res.data.content
                })
            } else {
				message.error(res.msg);
            }
        });
	}
	// getZaDecisionUrl = () => {
	// 	BaseService.getZaDecisionUrl({}, (res) => {
    //         if (res.code == Config.errorCode.success) {
    //             this.setState({
	// 				zaDecisionUrl: res.data
    //             })
    //         } else {
	// 			message.error(res.msg);
    //         }
    //     });
	// }
    setModalVisible = (newState, k) => { // 设置Modal对话框状态
        if (k == '/product/add/0') {}
		if (arguments.length > 0) {
			this.setState({
				mKey: k,
				mVisible: newState
			});
		}
	}
	showCode = () => {
		this.setState({
			showCode: true
		});
	}
	hideCode = () => {
		this.setState({
			showCode: false
		});
	}
	// linkToNav = (e) => {
	// 	let zaDecisionUrl = this.state.zaDecisionUrl
	// 	window.open(zaDecisionUrl)
	// }
  	shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
	}
	render() {
		// 这个组件是一个包裹组件，所有的路由跳转的页面都会以this.props.children的形式加载到本组件下
		const { mKey , noticeData } = this.state;
		var mFrame = '';
		switch(mKey) {
	        case Config.menuKey.addcc: // Modal对话框(创建企业账户)
	            // mFrame = <Addccmodal mVisible={this.state.mVisible} cbModalVisible={this.setModalVisible} />;
	            break;
	        case Config.menuKey.addnew: // Modal对话框(新增用户)
	            // mFrame = <Addnewmodal mRole={this.state.roles} mVisible={this.state.mVisible} cbModalVisible={this.setModalVisible} />;
	            break;
	        case Config.menuKey.modpwd: // Modal对话框(修改密码)
	            mFrame = <Modpwdmodal mVisible={this.state.mVisible} cbModalVisible={this.setModalVisible} />;
                break;
            default:
                break;
		}
		const isOp = this.state.isOp;
		return (
			<Spin tip="Loading..." spinning={this.state.loading} size="large">
				{ isOp ?
					<Layout className="layout"></Layout>
					:
					<Layout className="layout">
						<Lheader cbModalVisible={this.setModalVisible} />
						<Layout>
							<Sider className="layout-sider" width={208}>
								<Lmenu cbModalVisible={this.setModalVisible} className="layout-menu"/>
							</Sider>
							<Content className="layout-content">
							{/* <p className='version-notice'><img className="notice-img" src={noticeImg} alt="notice-img" />版本公告：版本公告版本公告版本公告版本公告版本公告</p>
							{noticeData ?
								<p className='version-notice'><img className="notice-img" src={noticeImg} alt="notice-img" />{noticeData}</p>:null} */}
								{/* <div className='version-notice'>
									<img className="notice-img" src={noticeImg} alt="notice-img" />
									<p className="version-word">版本公告文字版本公告文字版本公告文字版本</p>
								</div>  */}
								{ noticeData ?
								<div className='version-notice'><img className="notice-img" src={noticeImg} alt="notice-img" /><p className="version-word">{noticeData}</p></div>:null
								}
								{this.props.children}
								<div className="layout-fixedtool">
									{ this.state.showCode ? <div className="layout-code" onMouseOver={this.showCode} onMouseLeave={this.hideCode}>
										{ this.state.science == 1 ?<img className="code-img" src={developmentCode} alt="code-img" />:null}
										{ this.state.science == 2 ?<img className="code-img" src={releaseCode} alt="code-img" />:null}
										{ this.state.science == 3 ?<img className="code-img" src={productCode} alt="code-img"/>:null}
										<span className="code-span">APP下载</span>
									</div> : null}
									<div className="default-container" onMouseOver={this.showCode} onMouseLeave={this.hideCode}>
										<div className=" default-fixedtool">
											{ this.state.showCode ? <p className="code-p">下载APP</p> : <img className="code-img" src={hoverImg} alt="code-img" />}
										</div>
									</div>
								</div>
								{/* {
									this.state.zaDecisionUrl ?
									<div className="rooter-content" onClick={(e)=>this.linkToNav(e)}>
										<img className="rooter-img" src={linkUrlBg}  alt="rooter-img" /><span className="rooter-span">决策系统</span>
									</div> : null
								} */}
							</Content>
						</Layout>
						{mFrame}
					</Layout>
				}
			</Spin>
		);
	}
}

export default Main;
