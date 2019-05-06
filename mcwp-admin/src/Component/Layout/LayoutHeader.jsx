import React, { Component, PropTypes } from 'react';
import { browserHistory, Link } from 'react-router';
import { is, fromJS } from 'immutable';
import { Layout, Menu, Icon, message , Popover } from 'antd';
import linkUrlBg from './../../Assets/Images/link-url-bg.png';
import iconData from './../../Assets/Images/icon_data.png';
import BaseService from '../../Services/BaseService';//调用数据
import { Config } from '../../Config/Index';
import more from '../../Assets/Images/title_icon_more.png';
const { Header } = Layout;


/**
 * 公共头部
 *
 * @export
 * @class Lheader
 * @extends {Component}
 */
class Lheader extends Component {
	constructor(props) {
    	super(props);
		this.state = {
			pullDown:true,
			workbenchShow:false,
		}
    }
	shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
	}
	componentDidMount() {
		// console.log(Config.menuKey.modpwd,'Config.menuKey.modpwd')
		// this.getZaDecisionUrl();
		this.getSysDictItems({code:'tpdj'})
	}
	getSysDictItems(params){
		BaseService.getSysDictItems(params, (res) => {
			if (res.code == Config.errorCode.success) {
				let arr=res.data.tpdj.map(item=>item.ddValue)
				if(arr.includes(Config.localItem('ENTERP_CODE'))&&(/ROLE_SUPER_ADMIN|ROLE_TOP_MANAGER/.test(Config.localItem('CUR_ROLE')))){
					this.setState({
						workbenchShow:true
					})
				}
			} else {
				message.error(res.msg);
			}
		});
	}
	show(){
		if(this.state.pullDown == true){
			this.setState({
				pullDown:false,
			})
		}else{
			this.setState({
				pullDown:true,
			})
		}
	}
	hide(){
		this.setState({
			pullDown:false,
        })
	}
	toggle = () => {
		this.props.toggle(!this.props.collapsed);
	  }
  	triggerMenu= (e) => {
		  // 退出
  		if(e == Config.menuKey.logout) {
            Config.put('/v1/user/logout', {}, (res) => {
                if(res.code == 0) {
                	Config.removeLocalItem();
	  				// 跳转登录界面
					this.context.router.push({
						pathname: '/login'
					});
                }
            }, (err) => {
                message.error(err);
            });
  		} else if(e == Config.menuKey.modpwd) {
  			this.props.cbModalVisible(true, e);
  		}
	  }
	changePage(e){
		browserHistory.push(e);
	}
	rooterHome = () => {
		console.log(1)
		let curRooter = Config.localItem('DEFALtEDKEY');  // 跳转路由地址
		console.log(curRooter)
		browserHistory.push(curRooter);
	}
	// getZaDecisionUrl = () => {
	// 	BaseService.getZaDecisionUrl({}, (res) => {
	// 		if (res.code == Config.errorCode.success) {
	// 			this.setState({
	// 				zaDecisionUrl: res.data
	// 			})
	// 		} else {
	// 			message.error(res.msg);
	// 		}
	// 	});
	// }
	// linkToNav = (e) => {
	// 	this.getZaDecisionUrl();
	// 	let zaDecisionUrl = this.state.zaDecisionUrl
	// 	window.open(zaDecisionUrl)
	// }
	linkToScreen=(e)=>{
		this.launchFullScreen(document.documentElement)
		browserHistory.push({
			pathname: '/workbench/header'
		});
	}
	launchFullScreen(document) {
        if (document.requestFullscreen) {
            document.requestFullscreen();
        }
        else if (document.mozRequestFullScreen) {
            document.mozRequestFullScreen();
        }
        else if (document.msRequestFullscreen) {
            document.msRequestFullscreen();
        }
        else if (document) {
            document.webkitRequestFullScreen();
        }
    }
	render() {
		const content = (
			  <div className="pull-down">
			  <ul className="pull-ul" onClick={this.triggerMenu}>
				  <li onClick = {()=>this.changePage('/suggestion/edit')}>意见反馈</li>
				  <li onClick = {()=>this.changePage('/version')}>版本管理</li>
				  <li onClick={()=>this.triggerMenu('modpwd')}>密码修改</li>
				  <li onClick={()=>this.triggerMenu('logout')}>注销</li>
			  </ul>
		  </div>
		  );
        const userAvatar = Config.localItem('LOGIN_SEX') == "女" ? require("./../../Assets/Images/img-female.png") : require("./../../Assets/Images/img-male.png");
		return (
			<Header className="layout-header">
				<Link onClick={this.rooterHome}>
					<div className="layout-header-title">
						<span className="title-logo" style={{background: 'url(' + Config.localItem('ENTERP_LOGO') + ') no-repeat',width: '40px',height: '40px', backgroundSize: 'cover'}}></span>
						<span className="title-text">{Config.localItem('ENTERP_NAME')}</span>
					</div>
	      </Link>
				<div className='more-select'>
					<Popover placement="bottomRight" overlayClassName="header-popover"  content={content} trigger="hover" arrowPointAtCenter>
						<img src={more}  alt={more} className='imgmore' onClick={()=>this.show()} />
					</Popover>
        </div>
        <Menu className="layout-header-menu" mode="horizontal" onClick={this.triggerMenu}>
		{
			this.state.workbenchShow? <Menu.Item key="screen" className="disabled">
			 <div className="rooter-content" onClick={(e)=>this.linkToScreen(e)}>
			   <img className="rooter-img" src={iconData}  alt="rooter-img" /><span className="rooter-span">数据工作台</span>
			 </div>
		   </Menu.Item>:null
		}
          {/* {
            this.state.zaDecisionUrl ?
            <Menu.Item key="linkto" className="disabled">
              <div className="rooter-content" onClick={(e)=>this.linkToNav(e)}>
                <img className="rooter-img" src={linkUrlBg}  alt="rooter-img" /><span className="rooter-span">决策系统</span>
              </div>
            </Menu.Item> : null
          } */}
          <Menu.Item key="user" className="disabled"><Icon className="icon-user" style={{background: 'url(' + userAvatar + ') no-repeat center center', backgroundSize: 'cover'}}/>{Config.localItem('LOGIN_USER_NAME')}</Menu.Item>
        </Menu>
		  </Header>
		)
	}
}
Lheader.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Lheader;

