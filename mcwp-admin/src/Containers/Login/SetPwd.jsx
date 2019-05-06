import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';

import './style/setPwd.less';
import unverifiedImg from '../../Assets/Images/entrymanagement_icon_unverified.png';
import differenceImg from '../../Assets/Images/entrymanagement_icon_difference.png';
import verifiedImg from '../../Assets/Images/entrymanagement_icon_verified.png';

// 公共头部
import { Hheader } from '../../Component/Layout/HeightHeader';

import { Spin, Input, Button, Layout, message } from 'antd';

const { Footer, Content } = Layout;

/* 以类的方式创建一个组件 */
class resetPass extends Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			repPassword: '',
			loginBtnLoading: false,
			loginBtnText: '设置',
			loginSpinning: true,
			strength: '',
			strengthColor: ['#ff6e6d', '#febe5b', '#55c79a'],
			showColor: ['#eee', '#eee', '#eee'],
			strengthWord: ['低', '中', '高'],
			verifiedOne: 0,
			verifiedTwo: 0,
			verifiedThree: 0,
			verifiedStatus: [unverifiedImg, verifiedImg, differenceImg],	// 状态图片
			verifiedWord: ['长度为8-20位字符', '包含字母（区分大小写）、数字、符号中至少3种', '密码强度中及以上', '两次密码不相同，请重新输入！'],			// 验证三项
			verifiedReject: 99,			// 拒绝理由
			repPasswordReject: 99
		};
	}

	// 验证密码
	checkPassword = (e) => {
		let value = e.target.value
		//和确认密码比较
		if(this.state.repPassword) {
			this.setState({
				repPasswordReject: value != this.state.repPassword? 3 : '',
			})
		}
		// 强度清空
		// 检验第一项长度, 检验第二项含三种
		this.setState({
			password: value,
			verifiedOne: value.length>7 && value.length<21? 1 : 0,
			verifiedTwo: (/\d/.test(value) + /[A-Z]/.test(value) + /[a-z]/.test(value) + /[^A-Za-z0-9]/.test(value)) > 2? 1 : 0,
		})
		// 检验第三项
		// 长度不足前不做请求
		if (value.length<8) {
			this.setState({
				showColor: ['#eee', '#eee', '#eee'],
				verifiedThree: 0,
				strength: ''
			})
		} else {
			Config.post('/comm/v1/password/validate', {password: value}, (res) => {
				if(res.code == 0) {
					let num;
					if(res.data == 1) num = 0;
					if(res.data == 2 || res.data == 3) num = 1;
					if(res.data == 4) num = 2;
					this.setState({
						strength: num,
						showColor: this.state.strengthColor.map((item, index) => (index > num? '#eee' : item)),
						password: value,
						verifiedThree: num != 0? 1:0
					})
				} else {
					message.error(res.msg)
				}
			});
		}
	}
	checkRepPassword = (e) => {
		let value = e.target.value
		this.setState({
			repPassword: value,
			repPasswordReject: value != this.state.password?  3 : '',
		})
	}
	handleSubmit = (e) => {
		e.preventDefault();
		const {verifiedWord, verifiedReject, repPasswordReject, password, repPassword} = this.state;
		if (verifiedReject == 99) {
			this.setState({
				verifiedReject: 0
			})
		}
		if (repPasswordReject == 99) {
			this.setState({
				repPasswordReject: 3
			})
		}
		if ( verifiedReject == 99 || repPasswordReject == 99 || verifiedWord[verifiedReject] || verifiedWord[repPasswordReject]) return;
		let token = Config.getQueryString('token')||'';
		// 请求参数
		let forgetParams = {
			token: token,
			password: password,
			repPassword: repPassword
		};
		Config.put('/comm/v1/user/password/reset', forgetParams, (res) => {
			if(res.code == 0) {
                message.success(res.msg);
                window.location.href = Config.domain + '/login'
			} else {
				message.error(res.msg)
			}
		});
	}
	/**
	 * 在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。
	 * 在生命周期中的这个时间点，组件拥有一个 DOM 展现，
	 * 你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
	 */
	componentDidMount() {
		this.setState({
			loginSpinning: false
		});
	}
	showBar = (e) => {
		this.setState({
			showBar: 'show',
			verifiedReject: ''
		})
	}
	hideBar = (e) => {
		const { verifiedOne, verifiedTwo, verifiedThree } = this.state;
		// 隐藏的时候检验是否存在未通过项目
		this.setState({
			showBar: '',
			verifiedReject: [verifiedOne, verifiedTwo, verifiedThree].findIndex(item => item == 0)
		})
	}

	render() {
		const { strength, showColor, strengthWord, showBar, verifiedOne, verifiedTwo, verifiedThree, verifiedStatus, verifiedWord, verifiedReject, repPasswordReject  } = this.state;
		return(
			<Layout className="base-container">
		    	<Hheader />
		    	<Content className="login-content">
					<div className="login-img"></div>
					<div className="login-frame">
						<Spin tip="载入中..." spinning={this.state.loginSpinning}>
							<div className="form-title">设置密码</div>
								<Input className='password' size="large" type="password" placeholder="请输入您的新密码" onChange={this.checkPassword} onFocus={this.showBar} onBlur={this.hideBar} maxLength="20" />
								<div className={`password-detail ${showBar}`}>
									<p><span className="password-bar" style={{backgroundColor: showColor[0]}}  /><span className="password-bar" style={{backgroundColor: showColor[1]}} /><span className="password-bar" style={{backgroundColor: showColor[2]}} /></p>
									<p className='password-item'>密码强度：{strengthWord[strength]}</p>
									<p className='password-item'><img className='password-img' src={verifiedStatus[verifiedOne]} alt="password-img" />{verifiedWord[0]}</p>
									<p className='password-item'><img className='password-img' src={verifiedStatus[verifiedTwo]} alt="password-img" /><span style={{verticalAlign: 'middle'}}>{verifiedWord[1]}</span></p>
									<p className='password-item'><img className='password-img' src={verifiedStatus[verifiedThree]} alt="password-img" />{verifiedWord[2]}</p>
								</div>
								<p className={`password-reject-item ${verifiedWord[verifiedReject]? '' : 'pwd-item-hide'}`}  style={{height: verifiedReject == 1? '40px' : null}}><img className='password-img' src={verifiedStatus[2]} alt="password-img" /><span style={{verticalAlign: 'middle'}}>{verifiedWord[verifiedReject]}</span></p>
								<Input className='repPassword' size="large" type="password" placeholder="请再次输入您的新密码" onChange={this.checkRepPassword} maxLength="20" />
								<p className={`password-reject-item ${verifiedWord[repPasswordReject]? '' : 'pwd-item-hide'}`}><img className='password-img' src={verifiedStatus[2]} alt="password-img" /><span style={{verticalAlign: 'middle'}}>{verifiedWord[repPasswordReject]}</span></p>
								<Button onClick={this.handleSubmit} className='password-reset common-large-btn' type="primary" htmlType="submit" loading={this.state.loginBtnLoading}>{this.state.loginBtnText}</Button>
						</Spin>
					</div>
		    	</Content>
		    	<Footer className="login-footer">{ Config.footerText }</Footer>
    		</Layout>
		);
	}
}


export default resetPass;
