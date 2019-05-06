import React, { Component } from 'react'; // 引入了React
import { browserHistory, Link } from 'react-router';
import { Config } from '../../Config/Index';
import LoginService from '../../Services/LoginService'; // 调用数据
import './style/login.less';
import qrLoginImg from '../../Assets/Images/qrlogin_default.png';
import passwordLoginImg from '../../Assets/Images/password_login_default.png';

// 公共头部
import { Hheader } from '../../Component/Layout/HeightHeader';

import { Spin, Form, Input, Button, Checkbox, Layout, Row, Col, message } from 'antd';
const { Footer, Content } = Layout;
const FormItem = Form.Item;

/* 以类的方式创建一个组件 */
class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loginCaptcha: Config.isExpire(),
			loginBtnLoading: false,
			loginBtnText: '登录',
			enterpCode: Config.getQueryString('enterpCode'),
			loginSpinning: false,
			loginError: '',
			isActive: true, // 账号是否激活
			captchaImg: '',
			smsText: '获取验证码',
			smsCount: 60,
			qrLogin: false,
			qrPicture: null,
			showQrRefresh: false
		};
	}
	// 验证用户名
	checkUsername = (rule, value, callback) => {
		if (Config.isNull(value)) {
			callback();
		} else if (!Config.checkUsername(value)) {
			callback(Config.warnInfo.usernameRule);
		} else {
			callback();
		}
	}
	// 验证密码
	checkPassword = (rule, value, callback) => {
		if (Config.isNull(value)) {
			callback();
		} else if (!Config.checkPassword(value)) {
			callback(Config.warnInfo.passwordRule);
		} else {
			callback();
		}
	}
	changeCaptcha = () => { // 更换验证码
		this.setState({
			captchaImg: Config.target + Config.getCaptchaImg(1, 104, 36)
		});
	}
	saveLocal = (data) => {
		let roles = data.roles.join('&');
		Config.localItem('CUR_ROLE', roles);       // 本地存储用户角色
		Config.localItem('CUR_ROLE_LEVEL', data.roleLevel);   // 本地存储用户权限等级
		Config.localItem('CUR_MAX_ROLE', data.maxRole);   // 本地存储用户权限等级
		Config.localItem('USER_AUTHORIZATION', data.token);   // 本地存储token
		Config.localItem('LOGIN_USER', data.userName);             // 本地存储用户名
		Config.localItem('LOGIN_USER_NAME', data.nickName);   // 本地存储姓名
		Config.localItem('LOGIN_USER_CODE', data.code);   // 本地存储用户code
		Config.localItem('LOGIN_SEX', data.sex);   // 登录用户性别
		Config.localItem('LOGIN_USER_ID', data.userId);       // 本地存储用户ID
		Config.localItem('ENTERP_NAME', data.enterpName); // 企业名称
		Config.localItem('ENTERP_LOGO', data.logo); // 企业LOGO
		Config.localItem('ENTERP_CODE', data.enterpCode); // 企业编号
		Config.localItem('BRANCH_CODE', data.branchCode); // 支行code
		Config.removeLocalItem('CAPTCHA_EXPIRE');
		Config.removeLocalItem('SENDSMS'); // 清除发送验证码标记

		if (Config.isRoleAdmin()) { // 管理员
			// 跳转用户列表
			Config.localItem('SELECTEDKEY', '/user');
			Config.localItem('DEFALtEDKEY', '/user');
			Config.localItem('OPENKEY', '用户管理');
			browserHistory.push('/user');
        } else 	if (Config.isOnlyRoleRiskManager()) { // 管理员
			// 跳转用户列表
			Config.localItem('SELECTEDKEY', '/ipieces/operate');
			Config.localItem('DEFALtEDKEY', '/ipieces/operate');
			Config.localItem('OPENKEY', '进件管理');
			browserHistory.push('/ipieces/operate');
		} else {
			Config.localItem('SELECTEDKEY', '/data/analysis/marketing');
			Config.localItem('DEFALtEDKEY', '/data/analysis/marketing');
			Config.localItem('OPENKEY', '业务管理');
			browserHistory.push('/data/analysis/marketing'); // 数据分析
		}
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				var username = Config.trimSides(values.username),
					smsVerifyCode = Config.trimSides(values.smsVerifyCode),
					password = Config.trimSides(values.password),
					captcha = Config.trimSides(values.captcha),
					remember = values.remember;
				if (Config.isNull(username)) {
					this.setState({
						loginError: Config.login.usernameNull
					});
					return;
				} else if (Config.isNull(smsVerifyCode)) {
					this.setState({
						loginError: '请输入短信验证码'
					});
					return;
				} else if (Config.isNull(password)) {
					this.setState({
						loginError: Config.login.passwordNull
					})
					return;
				} else if (!this.state.loginCaptcha && Config.isNull(captcha)) {
					this.setState({
						loginError: Config.login.captchaNull
					})
					return;
				}
				this.setState({
					loginBtnLoading: true,
					loginBtnText: '登录中...'
				});
				// 请求参数
				let loginParams = {
					userName: username,
					smsVerifyCode: smsVerifyCode,
					password: password,
					verifyCode: captcha
				};
				// POST请求
				Config.post('/comm/v1/user/login', loginParams, (res) => {
					if (res.code == 0) {
						let data = res.data;
						// 登录成功 todo
						this.saveLocal(data)
						// 记住账号
						if (remember) {
							Config.localItem('REMEMBER_USERNAME', username);
						} else {
							Config.removeLocalItem('REMEMBER_USERNAME');
						}
						return;
					} else if (res.code == Config.errorCode.loginCaptcha) {
						let expireTime = Config.getExpire(res.data);
						const { loginCaptcha } = this.state;
						if (!loginCaptcha) {
							// 删除已填验证码
							this.props.form.setFieldsValue({
								'captcha': '',
							});
						}
						// 显示登录验证码
						this.setState({
							loginCaptcha: false
						});
						Config.localItem('CAPTCHA_EXPIRE', expireTime);
						Config.removeLocalItem('CUR_ROLE_LEVEL');   // 删除本地存储用户权限等级
					} else if (res.code == Config.errorCode.invalidLoginCaptcha) {
						const { loginCaptcha } = this.state;
						if (!loginCaptcha) {
							// 删除已填验证码
							this.props.form.setFieldsValue({
								'captcha': '',
							});
						}
						// 显示登录验证码
						this.setState({
							loginCaptcha: false
						});
					} else if (res.code == Config.errorCode.notActive) { // 此账户暂未激活
						this.setState({
							isActive: false // 账户未激活
						});
					} else {
						message.error(res.msg);
					}
					this.setState({
						loginBtnLoading: false,
						loginBtnText: '登录',
						loginError: res.msg,
						captchaImg: Config.target + Config.getCaptchaImg(1, 104, 36)
					});
				}, (err) => {
					message.error(err);
					this.setState({
						loginBtnLoading: false,
						loginBtnText: '登录',
						loginError: err,
						captchaImg: Config.target + Config.getCaptchaImg(1, 104, 36)
					});
				});
			}
		});
	}
	/**
	 * 在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。
	 * 在生命周期中的这个时间点，组件拥有一个 DOM 展现，
	 * 你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
	 */
	componentDidMount() {
		if (!this.state.loginCaptcha) this.changeCaptcha();
		this.setState({
			loginSpinning: false
		});
	}
	componentWillUnmount() {
		const that = this;
		if (that.timer) clearInterval(that.timer);
		if (that.qrTimer) clearInterval(that.qrTimer);
	}
	// 获取短信验证码
	getSmsVerifyCode = () => {
		const that = this
		const { form } = this.props;
		// const { smsCount } = this.state;
		if (that.timerSwitch) return;
		that.timerSwitch = true
		// if (smsCount != 60) return;
		const userName = form.getFieldValue('username');
		if (!userName) {
			this.setState({
				loginError: '请输入手机号/邮箱'
			})
			return;
		}
		let params = {
			userName: userName
		};
		LoginService.smsVerifyCode(params, (res) => {
			if (res.code == 0) {
				this.timeCountDown(60);
				message.success('已发送成功，请注意查收');
				Config.localItem('SENDSMS', true);
				this.setState({
					loginError: ''
				})
			} else {
				this.setState({
					loginError: res.msg
				})
				return;
			}
		})
	}
	timeCountDown = (smsCount) => {
		const that = this;
		that.timer = setInterval((e) => {
			smsCount--;
			that.setState({
				smsText: smsCount + 's后重发',
				smsCount: smsCount
			});
			if (smsCount == 0) {
				if (that.timer) clearInterval(that.timer);
				that.timerSwitch = false;
				that.setState({
					smsText: '重新发送',
					smsCount: 60
				});
				// smsCount = 60;
			}
		}, 1000);
	}
	hasErrors = () => {
		const { form } = this.props;
		const { loginCaptcha } = this.state;
		const isSendCode = Config.localItem('SENDSMS');
		const userName = form.getFieldValue('username');
		const smsVerifyCode = form.getFieldValue('smsVerifyCode');
		const password = form.getFieldValue('password');
		const captcha = form.getFieldValue('captcha');
		if (Config.getReferer() == 'prod' && (!userName || !smsVerifyCode || !password || !isSendCode || (!loginCaptcha && !captcha))) return true;
	}
	changeLogin = () => {
		const that = this
		const { qrLogin } = that.state
		clearInterval(that.qrTimer)
		// 改变登录方式
		this.setState({
			qrLogin: !qrLogin
		})
		// 获取扫码
		if (!qrLogin) {
			this.qrChange()
		}
	}
	qrChange() {
		const that = this
		that.setState({
			loginSpinning: true,
			showQrRefresh: false
		})
		let param = window.location.origin == 'http://localhost:3000' ? { url: 'http://mcwp.test.zhudb.com' } : { url: window.location.origin }
		LoginService.getQrCode(param, (res) => {
			if (res.code == 0) {
				that.setState({
					qrPicture: res.data.picture,
					loginSpinning: false
				})
				clearInterval(that.qrTimer)
				that.qrTimer = setInterval(() => {
					that.loginStatus(res.data.nonceStr)
				}, 2000)
			} else {
				that.setState({
					loginSpinning: false,
				})
				message.error(res.msg)
			}
		})
	}
	loginStatus(nonceStr) {
		const that = this
		LoginService.qrLoginStatus({ nonceStr }, (res) => {
			if (res.code == Config.errorCode.success) {
				if (res.data) {
					let data = res.data
					clearInterval(that.qrTimer)
					this.saveLocal(data)
				}
			} else if (res.code == Config.errorCode.qrCodeTimeout) {
				that.setState({
					showQrRefresh: true
				})
				clearInterval(that.qrTimer)
			} else {
				message.error(res.msg)
			}
		})
	}
	refreshQr = () => {
		this.qrChange()
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { showQrRefresh, qrPicture, qrLogin, smsText, smsCount } = this.state;
		const loginError = this.state.loginError ? <FormItem><div className="login-error">{this.state.loginError}</div></FormItem> : null;
		const defaultUsername = Config.localItem('REMEMBER_USERNAME');
		let loginCaptcha = !this.state.loginCaptcha ?
			<FormItem>
				<Row gutter={16}>
					<Col span={12}>
						{getFieldDecorator('captcha', { initialValue: '', rules: [] })(
							<Input className="captcha-input" size="large" autoComplete="off" placeholder="验证码" maxLength="4" />
						)}
					</Col>
					<Col span={12}>
						<img onClick={this.changeCaptcha} className="captcha-img" src={this.state.captchaImg} alt="captcha-img" />
					</Col>
				</Row>
			</FormItem> : null;
		return (
			<Layout className="base-container">
				<Hheader />
				<Content className="login-content">
					{/*<Row className="login-row">*/}
					{/*<Col span={12} className="login-col">*/}
					<div className="login-img"></div>
					{/*</Col>*/}
					{/*<Col span={12} className="login-col">*/}
					<div className="login-frame">
						{
							!qrLogin ?
								<img className="qr-click" src={qrLoginImg} alt="qr" onClick={this.changeLogin} />
								: <img className="qr-click" src={passwordLoginImg} alt="qr" onClick={this.changeLogin} />
						}
						<Spin tip="载入中..." spinning={this.state.loginSpinning}>
							{
								!qrLogin ?
									<div>
										<div className="form-title">用户登录</div>
										<Form className="login-form" onSubmit={this.handleSubmit}>
											{loginError}
											<FormItem>
												{getFieldDecorator('username', { initialValue: defaultUsername, rules: [] })(
													<Input type="text" name="user" placeholder="手机号/邮箱" autoComplete="off" />
												)}
											</FormItem>
											<FormItem>
												{getFieldDecorator('password', { rules: [] })(
													<Input type="password" placeholder="密码" autoComplete="off" />
												)}
											</FormItem>
											<FormItem>
												{getFieldDecorator('smsVerifyCode', { initialValue: '', rules: [] })(
													<Input autoComplete="off" placeholder="短信验证码" maxLength="6" />
												)}
												<span className={smsCount == 60 ? 'smsVerifyCode' : 'smsVerifyCode disabled'} onClick={this.getSmsVerifyCode}>{smsText}</span>
											</FormItem>
											{loginCaptcha}
											<FormItem>
												{getFieldDecorator('remember', {
													valuePropName: 'checked',
													initialValue: true,
												})(
													<Checkbox className="login-form-remember">记住账号</Checkbox>
												)}
												<Link to="/forgotPwd" className="login-form-forgot">忘记密码？</Link>
											</FormItem>
											<FormItem className="login-submit">
												<Button className="common-large-btn" type="primary" htmlType="submit" disabled={this.hasErrors()} loading={this.state.loginBtnLoading}>{this.state.loginBtnText}</Button>
											</FormItem>
										</Form>
									</div> :
									<div className="qr-login">
										<div className="form-title">扫码登录</div>
										{qrPicture ?
											<div className='qr-img-wrapper'>
												<img className='qr-img' src={`data:image/png;base64,${qrPicture}`} alt='product-qrc-img' />
												{showQrRefresh ?
													<div className="qr-refresh-wrapper">
														<div>
															<p>二维码已失效</p>
															<p style={{ textAlign: "center" }}>请点击<span className="qr-refresh" onClick={this.refreshQr}>刷新</span></p>
														</div>
													</div>
													: null
												}
											</div>
											: null
										}
										{/* {showQrRefresh? <p className="qr-code">二维码已失效，请点击<span className="qr-refresh" onClick={this.refreshQr}>刷新</span></p> : null } */}
										<p className="qr-code">打开<span style={{ fontWeight: "bold" }}>助贷宝app</span>扫一扫登录</p>
									</div>
							}
						</Spin>
					</div>
					{/*</Col>*/}
					{/*</Row>*/}
				</Content>
				<Footer className="login-footer">{Config.baseText.footer}</Footer>
			</Layout>
		);
	}
}

const Main = Form.create()(Login);

export default Main;
