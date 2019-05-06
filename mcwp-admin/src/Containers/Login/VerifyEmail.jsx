import React, { Component } from 'react'; // 引入了React
import { browserHistory, Link } from 'react-router';
import { Config } from '../../Config/Index';

import './style/login.less';

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
			loginBtnText: '邮箱验证',
			loginSpinning: true,
			loginError: '',
			captchaImg: Config.target +  Config.getCaptchaImg(1,104,36)
		};
	}
	changeCaptcha = () => { // 更换验证码
		this.setState({
			captchaImg: Config.target + Config.getCaptchaImg(1,104,36)
		});
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if(!err) {
				var username = values.username,
					password = values.password,
					captcha = values.captcha,
					remember = values.remember;
				if(Config.isNull(username)) {
					this.setState({
						loginError: Config.login.usernameNull
					});
					return;
				} else if(Config.isNull(password)) {
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
					loginBtnText: '邮箱验证中...' 
				});	
				// 请求参数
				let loginParams = {
					userName: username, 
					password: password, 
					userType: Config.fetchParams.userType,
					verifyCode: captcha
				};
				this.props.getData('/user/v1/login', loginParams, (res) => {
	                if(res.code == 0) {
	                	let data = res.data;
	                	// 登录成功 todo
	                	Config.localItem('CUR_ROLE_LEVEL', data.roleLevel);   // 本地存储用户权限等级
	                	Config.localItem('USER_AUTHORIZATION', data.token);
	                	// 记住账号
						if(remember) {
							Config.localItem('REMEMBER_USERNAME', username);
						} else {
							Config.removeLocalItem('REMEMBER_USERNAME');
						}
                        // 跳转首页
                        browserHistory.push('/home');
						return;
	             	} else if (res.code == Config.errorCode.loginCaptcha) {
	             		// todo 
	             		let s = 3600;
	             		let expireTime = Config.getExpire(s);
	               		// 显示登录验证码
	               		this.setState({
	               			loginCaptcha: false
	               		});
	               		Config.localItem('CAPTCHA_EXPIRE', expireTime);
	               		Config.removeLocalItem('CUR_ROLE_LEVEL');   // 删除本地存储用户权限等级
	               	} else {
	               		message.error(res.msg);
	               	} 	
					this.setState({
						loginBtnLoading: false,
						loginBtnText: '邮箱验证',
						loginError: res.msg,
						captchaImg: Config.target + Config.getCaptchaImg(1,104,36)
					});
	            },'userLogin', 'POST');
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
			loginSpinning: false,
			captchaImg: this.state.captchaImg + '&v=' + Math.random()
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		var loginError = this.state.loginError ? <FormItem><div className="login-error">{this.state.loginError}</div></FormItem> : null;
		let loginCaptcha = !this.state.loginCaptcha ?
		<FormItem>
			<Row gutter={16}>
	            <Col span={12}>
		            {getFieldDecorator('captcha', {rules: [{}]})(
		            	<Input className="captcha-input" size="large" placeholder="验证码" maxLength="4" />
		            )}
	            </Col>
	            <Col span={12}>
	            	<img onClick={ this.changeCaptcha } className="captcha-img" src={ this.state.captchaImg } alt="captcha-img" />
	            </Col>
	        </Row>
	    </FormItem> : null;
		return(
			<Layout className="base-container">
		    	<Hheader />
		    	<Content className="login-content">
		    		{/* <Row className="login-row">
				    	<Col span={12} className="login-col"> */}
				    		<div className="login-img"></div>
				    	{/* </Col>
				    	<Col span={12} className="login-col"> */}
					    	<div className="login-frame">
								<Spin tip="载入中..." spinning={this.state.loginSpinning}>
									<div className="form-title">账户验证</div>
									<Form className="login-form" onSubmit={this.handleSubmit}>
										{ loginError }
								        <FormItem>
									        {getFieldDecorator('email')(
									            <Input size="large" placeholder="邮件" />
									        )}  
								        </FormItem>
								        <FormItem>
									        {getFieldDecorator('password', {})(
									        	<Input size="large" type="password" placeholder="密码" />
									        )}
								        </FormItem>
								        { loginCaptcha }
								        <FormItem>
								        {getFieldDecorator('remember', {
							            	valuePropName: 'checked',
							            	initialValue: true,
							            })(
							            	<Checkbox className="login-form-remember">我已阅读并接受<Link to="/userAgreement" className="user-agreement">《用户协议》</Link></Checkbox>
							            )}
									    </FormItem>
									    <FormItem className="login-submit">
									    	<Button type="primary" className='common-large-btn' htmlType="submit" size="large" loading={this.state.loginBtnLoading}>{this.state.loginBtnText}</Button>
							        	</FormItem>
							        </Form>
						        </Spin>
							</div>
				    	{/* </Col>
				    </Row> */}
		    	</Content>
		    	<Footer className="login-footer">{ Config.footerText }</Footer>
    		</Layout>
		);
	}
}

const Main = Form.create()(Login);

export default Main;