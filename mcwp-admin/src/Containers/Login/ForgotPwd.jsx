import React, { Component } from 'react'; // 引入了React
import { Link } from 'react-router';
import { Config } from '../../Config/Index';

// 公共头部
import { Hheader } from '../../Component/Layout/HeightHeader';

import './style/forgotPwd.less';

import { Form, Input, Button, Layout, Row, Col, message } from 'antd';
const { Content } = Layout;
const FormItem = Form.Item;

/* 以类的方式创建一个组件 */
class Forgot extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
    		forgetError: '',
    		showForm: true,    // 显示找回密码的表单还是发送邮件提示信息
			hasBottom: true,
			captchaImg: Config.target + Config.getCaptchaImg(2,104,36),
			sendEmail: '',
			sendFlag: true,                  // 重发邮件标识
			completeBtnText: '重新发送',     // 重发按钮文案
			completeBtnTextColor: '#5292fc'  // 重发按钮文案颜色
    	};
    }
    // timeCountDown = (reSecond) => {	
    //     this.setState({
	// 		sendFlag: false,
	// 		completeBtnText: reSecond + 's后可重发',
	// 		completeBtnTextColor: '#cccdcd'
	// 	});
    //     let time=setInterval( (e) => {
    //         reSecond=reSecond-1;
    //         this.setState({
	// 			completeBtnText:  reSecond + 's后可重发',
	// 		});
    //         if(reSecond==0){
    //             this.setState({
	// 				sendFlag: true,
	// 				completeBtnText: '重新发送',
	// 				completeBtnTextColor: '#5292fc'
	// 			});
    //             clearInterval(time);
    //             reSecond=60;
    //         }
    //     },1000);
    // }
  	handleSubmit = (e) => {
    	e.preventDefault();
	    this.props.form.validateFieldsAndScroll((err, values) => {
		    if (!err) {
		    	var email = values.email,
					captcha = values.captcha,
					url = Config.domain + '/setPwd';

		    	// 请求参数
				let forgetParams = {
					email: email, 
					verifyCode: captcha,
					url: url
				};

				// 重置初始状态
				this.setState({
					sendEmail: email,
					forgetError: '',
					showForm: true
				});

				Config.get('/comm/v1/user/password/forget', forgetParams, (res) => {
	                if(res.code == 0) {
	                	this.setState({
							showForm: false
						});
	                	// this.timeCountDown(60);  // 调用定时器方法

	                } else {
	                	this.setState({
							forgetError: res.msg
						});
						return;
	                }   	
	            });
		    }
	    });
	}
	repeatSubmit = (e) => {
		e.preventDefault();
    	var url = Config.domain + '/setPwd';

    	// 请求参数
		let resentParams = {
			email: this.state.sendEmail,
			url: url
		};
	    let sendFlag = this.state.sendFlag;  // 重发邮件标识
    	if(sendFlag){
    		Config.get('/comm/v1/user/email/resend', resentParams, (res) => {
                if(res.code == 0) {
                	this.setState({
						showForm: false
					});
					message.success('重新发送成功！');
					// this.timeCountDown(60);  // 调用定时器方法
                } else {
                	this.setState({
						forgetError: res.msg
					});
					return;
                }   	
            });
    	}
	}
	checkConfirm = (rule, value, callback) => {
		const form = this.props.form;
	    if (value && this.state.passwordDirty) {
	    	form.validateFields(['confirm'], { force: true });
	    }
	    callback();
	}
	changeCaptcha = () => {
		this.setState({ captchaImg: Config.target + Config.getCaptchaImg(2,104,36) });
	}
	/**
     * 在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。
     * 在生命周期中的这个时间点，组件拥有一个 DOM 展现，
     * 你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
     */
    componentDidMount() {
        this.setState({ loginSpinning: false });
    }
	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
		    labelCol: {
		        xs: { span: 24 },
		        sm: { span: 6 }
		    },
		    wrapperCol: {
		    	xs: { span: 24 },
		        sm: { span: 14 }
		    }
	    };
	    const tailFormItemLayout = {
		    wrapperCol: {
		        xs: {
		        	span: 24,
		        	offset: 0
		    	},
		        sm: {
		        	span: 14,
		        	offset: 6
		        }
		    }
		};
		// mailbox
		let sendEmail = this.state.sendEmail;
		let num = sendEmail.indexOf('@');
		let mailbox = sendEmail.substring(num+1)
	    let forgetError = this.state.forgetError ? <FormItem><div className="login-error">{this.state.forgetError}</div></FormItem> : null;
	    // 找回密码表单
	    let formContent = <Form onSubmit={this.handleSubmit} className="forgot-form">
            <FormItem {...formItemLayout} label=" " colon={false}>
                <div className="forgot-form-title">忘记密码</div>
            </FormItem>
            { forgetError }
            <FormItem {...formItemLayout} label="邮箱">
                {getFieldDecorator('email', {rules: [{required: true, message: Config.warnInfo.emailNull},{type: 'email', message: Config.warnInfo.emailRule}]})(
                    <Input placeholder="邮箱" />
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="验证码">
                <Row>
                    <Col span={12}>
                        {getFieldDecorator('captcha', {rules: [{required: true, message: Config.login.captchaNull}]})(
                            <Input size="large" placeholder="验证码" maxLength="4" />
                        )}
                    </Col>
                    <Col span={12}>
                        <img onClick={this.changeCaptcha} className="captcha-img" src={this.state.captchaImg} alt="captcha-img" />
                    </Col>
                </Row>
            </FormItem>
            <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" className="common-small-btn">找回</Button>
            </FormItem>
        </Form>;  

     	 // 发送邮件提示
     	let sendMailPrompt = <div className="send-email">
            <div className="logo"></div> 
            <p className="title">邮件已发送成功</p>
            <p className="text">
                <span className='mail-content'>我们已经向您的邮箱<span className='mail-focus'>{sendEmail}</span>发送了一封邮件，<br/>
                请按照邮件中说明进行操作
                </span>
            </p>
            {/* <p className="text">请按照邮件中说明进行操作</p> */}
            <p className="text goto-mailbox">
                <Button type="primary" className="common-btn"><a href={'https://mail.'+ mailbox} target='_blank'>前往邮箱</a></Button>
                <Button className="common-btn cancel"><Link to={'/login'}>回到登录页</Link></Button>
            </p>
        </div>;

	    let forgetContent = this.state.showForm ? formContent : sendMailPrompt;
	    
		return (
			<Layout className="base-container">
		    	<Hheader hasBottom={this.state.hasBottom} />
		    	<Content className="forgot-content">
		    		{forgetContent}
		    	</Content>
    		</Layout>
		);
	}
}

const Main = Form.create()(Forgot);

export default Main;