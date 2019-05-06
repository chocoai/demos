import React, { Component } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { browserHistory } from 'react-router';

import { Config } from '../../Config/Index';
import './style/modpwdModal.less';
import unverifiedImg from '../../Assets/Images/entrymanagement_icon_unverified.png';
import differenceImg from '../../Assets/Images/entrymanagement_icon_difference.png';
import verifiedImg from '../../Assets/Images/entrymanagement_icon_verified.png';

/**
 * Modal对话框(修改密码)
 *
 * @export
 * @class Modpwdmodal
 * @extends {Component}
 */
class Modpwdmodal extends Component {
	constructor(props) {
		super(props); //后才能用this获取实例化对象
		this.state = {
    		mVisible: false,
			oldPassword: '',
			password: '',
			repPassword: '',
			strength: '',
			strengthColor: ['#ff6e6d', '#febe5b', '#55c79a'],
			showColor: ['#eee', '#eee', '#eee'],
			strengthWord: ['低', '中', '高'],
			verifiedOne: 0,
			verifiedTwo: 0,
			verifiedThree: 0,
			verifiedStatus: [unverifiedImg, verifiedImg, differenceImg],	// 状态图片
			verifiedWord: ['长度为8-20位字符', '包含字母（区分大小写）、数字、符号中至少3种', '密码强度中及以上', '两次密码不相同，请重新输入！', '原密码不能为空！', '原密码不正确！'],			// 验证三项
			verifiedReject: 99,			// 拒绝理由
			repPasswordReject: 99,
			oldPwdReject: 99,
			updateError:''				// 返回的错误
		};
	}
	handleSubmit = (e) => {
		e.preventDefault();
		const {verifiedWord, verifiedReject, repPasswordReject, oldPassword, password, repPassword, oldPwdReject} = this.state;
		if (oldPwdReject == 99) {
			this.setState({
				oldPwdReject: 4
			})
		}
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
		if ( oldPwdReject == 99 || verifiedReject == 99 || repPasswordReject == 99 || verifiedWord[verifiedReject] || verifiedWord[repPasswordReject]) return;
		// 请求参数
		let changePsParams = {
			oldPassword: oldPassword, 
			password: password,
			repPassword: repPassword
		};
		Config.put('/v1/user/password/update', changePsParams, (res) => {
			if(res.code == Config.errorCode.success) {
				this.props.cbModalVisible(false);
				message.success('修改成功！');
				Config.put('/v1/user/logout', {}, (res) => { 
					if(res.code == 0) {
						Config.removeLocalItem();
						// 跳转登录界面
						browserHistory.push({
							pathname: '/login'
						});
					} 
				}, (err) => {
					message.error(err);
				});
			} else {
				if (res.msg == '旧密码不正确') {
					this.setState({
						updateError: 5
					});
				} else {
					message.error(res.msg)
				}
			}   	
		});
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
	setModalVisible = () => {
		this.props.cbModalVisible(false);
	}
	checkOldPwd = (e) => {
		let value = e.target.value
		this.setState({
			oldPassword: value,
			oldPwdReject: value?  '' : 4,
			updateError: ''
		})
	}
	render() {
		let { mVisible } = this.props;
		const { strength, showColor, strengthWord, showBar, verifiedOne, verifiedTwo, verifiedThree, verifiedStatus, verifiedWord, verifiedReject, repPasswordReject, oldPwdReject, updateError } = this.state;
		return (
			<Modal
	          title="修改密码"
	          visible={mVisible}
	          footer={null}
	          onCancel={this.setModalVisible}
			  width = {480}
	          wrapClassName="modpwd-modal"
	        >
				<Input  className='password' type="password" placeholder="原密码" maxLength="20" onChange={this.checkOldPwd} />
				<p className={`password-reject-item ${verifiedWord[updateError]? '' : 'pwd-item-hide'}`}><img className='password-img' src={verifiedStatus[2]} alt="password-img" /><span style={{verticalAlign: 'middle'}}>{verifiedWord[updateError]}</span></p>
				<p className={`password-reject-item ${verifiedWord[oldPwdReject]? '' : 'pwd-item-hide'}`}><img className='password-img' src={verifiedStatus[2]} alt="password-img" /><span style={{verticalAlign: 'middle'}}>{verifiedWord[oldPwdReject]}</span></p>
				<Input className='password' size="large" type="password" placeholder="请输入您的新密码" onChange={this.checkPassword} onFocus={this.showBar} onBlur={this.hideBar} />
				<div className={`password-detail ${showBar}`}>
					<p><span className="password-bar" style={{backgroundColor: showColor[0]}}  /><span className="password-bar" style={{backgroundColor: showColor[1]}} /><span className="password-bar" style={{backgroundColor: showColor[2]}} /></p>
					<p className='password-item'>密码强度：{strengthWord[strength]}</p>
					<p className='password-item'><img className='password-img' src={verifiedStatus[verifiedOne]} alt="password-img" />{verifiedWord[0]}</p>
					<p className='password-item'><img className='password-img' src={verifiedStatus[verifiedTwo]} alt="password-img" /><span style={{verticalAlign: 'middle'}}>{verifiedWord[1]}</span></p>
					<p className='password-item'><img className='password-img' src={verifiedStatus[verifiedThree]} alt="password-img" />{verifiedWord[2]}</p>
				</div>
				<p className={`password-reject-item ${verifiedWord[verifiedReject]? '' : 'pwd-item-hide'}`}><img className='password-img' src={verifiedStatus[2]} alt="password-img" /><span style={{verticalAlign: 'middle'}}>{verifiedWord[verifiedReject]}</span></p>
				<Input className='password' size="large" type="password" placeholder="确认密码" onChange={this.checkRepPassword} />
				<p className={`password-reject-item ${verifiedWord[repPasswordReject]? '' : 'pwd-item-hide'}`}><img className='password-img' src={verifiedStatus[2]} alt="password-img" /><span style={{verticalAlign: 'middle'}}>{verifiedWord[repPasswordReject]}</span></p>
				<Button onClick={this.handleSubmit} className='password-button' type="primary" htmlType="submit" size="large">确认修改</Button>
	        </Modal>
		)
	}
}

export default Modpwdmodal;