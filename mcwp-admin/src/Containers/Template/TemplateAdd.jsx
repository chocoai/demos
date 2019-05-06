import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import CommonService from '../../Services/CommonService';
import Ueditor from '../../Component/Ueditor/Ueditor';

import './style/templateAdd.less';
import PromptImg from '../../Assets/Images/icon_prompt.png';

import { Select, Button, Modal, message, Input, Switch } from 'antd';
const Option = Select.Option;
const confirm = Modal.confirm;

/**
 * 消息模版
 * @Author: 赵俊
 * @Date:   2017-08-07
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-08-11
 */
class TemplateAdd extends Component {
	constructor(props) {
		super(props);
		this.state = {
			applyScene: null,
			sensitiveWord: null,
			applySceneInfo: '',
			height: 300,
			id: 'template-editor',
			content: '',
			toolbars: [['customstyle']],
			signature: '',
			selectSignature: '',
			templateId: props.routeParams.id,
			templateContent: null,   // 初始内容
			htmlContent: '',
			templateType: null,
			useType:null,
			isenable: 1,//是否开启
			dxtd: null,
			channel: '',//短信类型
		};
	}
	componentWillMount() {
		this.initialData();
		this.getDictItems();
	}
	componentDidMount() {
		Config.calculateSize(this);
	}
	async getDictItems() {
		let res = await CommonService.getDictItems({ code: 'dxtd' });
		this.setState({
			dxtd: res.data.dxtd
		})
	}
	async initialData() {
		const {location}=this.props;
		this.getInfo('/v1/message/signature/pass', 'signature') // 签名列表
		if (this.state.templateId) {
			let info = this.getInfo('/v1/message/template/info', 'info') // 模板详情
			info = await info;
			let variable = this.getInfo('/v1/message/template/variable', 'variable', info.applyScene) // 短信模版
			variable = await variable;
			variable = Array.from(variable, item => ({ ddText: item }))
			this.setState({
				useType:info.useType,
				templateType:info.templateType,
				templateContent: info.content,
				applySceneInfo: info.applySceneInfo,
				htmlContent: info.htmlContent,
				selectSignature: info.signature,
				applyScene: info.applyScene,
				channel: info.channel,
				variable: variable
			})
		}else{
			if(location.query.useType){
				this.setState({
					templateType:0,
				})
			}else{
				this.setState({
					templateType:2,
				})
			}	
		}
	}
	getInfo(url, type, applyScene) {
		return new Promise(resolve => {
			let params = {
				id: this.state.templateId
			}
			if (type == 'variable') {
				params.applyScene = applyScene
			}
			Config.get(url, params, (res) => {
				if (res.code == Config.errorCode.success) {
					this.setState({
						[type]: res.data
					})
					resolve(res.data)
				} else {
					message.error(res.msg);
				}
			});
		})
	}
	handleOkSen = (e) => {
		const { selectSignature, applyScene, applySceneInfo,channel } = this.state;
		if (!applyScene) {
			message.warning('请填写短信应用场景！')
			return
		} else if (applyScene.length > 25) {
			message.warning('短信应用场景1-25个字符')
			return
		}
		if (!applySceneInfo) {
			message.warning('请填写使用场景说明！')
			return
		} else if (applySceneInfo.length > 100) {
			message.warning('使用场景说明1-100个字符')
			return
		}
		if (!selectSignature) {
			message.warning('请选择短信签名！')
			return
		}
		if (!channel) {
			message.warning('请选择短信类型！')
			return
		}
		let UE = window.UE;
		let ue = UE.getEditor(this.state.id);
		let content = ue.getContentTxt();
		if (!content) {
			message.warning('请填写短信内容！')
			return
		}
		content = content.split(' ').join('');
		this.handleOk(e)
		// Config.post('/v1/message/blackCheck', { text: content }, (res) => {
		// 	if (res.code == Config.errorCode.success) {
		// 		if (res.data) {
		// 			this.setState({
		// 				sensitiveWord: res.data.join(',')
		// 			})
		// 			message.error(`存在敏感词${res.data.join(',')}`);
		// 			return false
		// 		} else {
		// 			this.setState({
		// 				sensitiveWord: ''
		// 			})
		// 			this.handleOk(e)
		// 		}
		// 	} else {
		// 		message.error(res.msg);
		// 	}
		// });
	}
	handleOk = (e) => {
		// if(!this.changeColor()) return message.error('存在敏感词，请修改')
		const { selectSignature, applyScene, templateId, templateType,useType, applySceneInfo, isenable ,channel} = this.state;
		const {location}=this.props;
		let UE = window.UE;
		let ue = UE.getEditor(this.state.id);
		// htmlContent html文本  content  text文本
		let htmlContent = ue.getContent();
		htmlContent = htmlContent.replace(/<input value=/g, '<input label=');
		let tempContent = htmlContent.toString().replace(/(<input)(\s)(label="{)([\u4E00-\u9FFF]+)(}" readonly="" style="font-family: FangSong; font-size: 16px; text-align: center; width: )(\d+)(px; border: none;"\/>)/g, '<span>{$4}</span>')
		ue.execCommand('cleardoc')
		ue.execCommand('inserthtml', tempContent);
		let content = ue.getContentTxt();
		content = content.split(' ').join('');
		htmlContent = htmlContent.replace(/<input label=/g, '<input value=');
		// ue.execCommand('cleardoc')
		// ue.execCommand('inserthtml', htmlContent);
		let params = {
			signature: selectSignature,
			content,
			applyScene,
			applySceneInfo,
			channel,
			htmlContent,
			templateType: templateType,
		}
		if(templateType==0){
			if(templateId){
				params.useType=useType;
			}else{
				params.useType=location.query.useType;
			}	
		}
		let url, type;
		if (templateId) {
			params.id = templateId;
			type = 'put'
			url = '/v1/message/template/edit'
		} else {
			params.isenable = isenable
			type = 'post'
			url = '/v1/message/template/add'
		}
		Config[type](url, params, (res) => {
			if (res.code == Config.errorCode.success) {
				message.success("模板提交成功！")
				browserHistory.goBack();
			} else {
				message.error(res.msg);
			}
		});
	}
	backDefault = () => {
		const { id, templateContent } = this.state;
		let UE = window.UE;
		let ue = UE.getEditor(id);
		confirm({
			title: '恢复默认值',
			content: '您确认放弃当前编辑内容？',
			onOk() {
				// 先清空
				ue.execCommand('cleardoc')
				ue.execCommand('inserthtml', templateContent);
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}
	goBack = (e) => {
		browserHistory.goBack();
	}
	// changeColor = () => {
	// 	let UE = window.UE;
	// 	let ue = UE.getEditor(this.state.id);
	// 	let content = ue.getContentTxt();
	// 	if (!content) {
	// 		message.warning('请填写短信内容！')
	// 		return
	// 	}
	// 	content = content.split(' ').join('');
	// 	Config.post('/v1/message/blackCheck', { text: content }, (res) => {
	// 		if (res.code == Config.errorCode.success) {
	// 			if (res.data) {
	// 				this.setState({
	// 					sensitiveWord: res.data.join(',')
	// 				})
	// 				return false
	// 			} else {
	// 				this.setState({
	// 					sensitiveWord: ''
	// 				})
	// 				message.success('短信内容中不存在敏感词');
	// 			}
	// 		} else {
	// 			message.error(res.msg);
	// 		}
	// 	});
	// }
	changeInput = (inp, e) => { // input值变化
		this.setState({
			selectSignature: e
		})
	}
	inputChange(e, type) {
		this.setState({
			[type]: e.target.value
		})
	}
	selectChange(type,value){
		this.setState({
			[type]:value
		})
	}
	swithChange(value) {
		if (value) {
			this.setState({
				isenable: 0
			})
		} else {
			this.setState({
				isenable: 1
			})
		}

	}
	render() {
		const { variable, width, height, id, templateContent, toolbars, signature, sensitiveWord, applyScene, selectSignature, htmlContent, applySceneInfo, templateId, dxtd, channel } = this.state;
		const bcrumb = [{
			'goBack': true,
			'value': '消息模板管理'
		}, {
			'link': null,
			'value': templateId ? '编辑短信模板' : '新增短信模板'
		}];
		return (
			<div className="templateAdd-container">
				<BcrumbItem bcrumb={bcrumb} />
				<div className="template-add-content">
					{templateId ? <p className='template-add-tip'><img src={PromptImg} alt='人工' style={{ paddingRight: '20px' }} />请耐心等待人工审批</p> : <p className='template-add-detail'><span className='template-add-title'>是否开启</span>
						<Switch onChange={(value) => { this.swithChange(value) }} />
					</p>}
					<p className='template-add-detail'><span className='template-add-title'>短信应用场景</span>
						{templateId ? <span className='template-add-msg'>{applyScene}</span> : <Input placeholder="必填项" value={applyScene} className='template-input' onChange={(e) => this.inputChange(e, 'applyScene')} />}
					</p>
					<p className='template-add-detail'>
						<span className='template-add-title'>使用场景说明</span>
						{templateId ? <span className='template-add-msg'>{applySceneInfo}</span> : <Input placeholder="必填项" value={applySceneInfo} className='template-input' onChange={(e) => this.inputChange(e, 'applySceneInfo')} />}
					</p>
					<div className='template-add-detail'>
						<span className='template-add-title'>选择短信签名</span>
						{
							templateId ? signature && selectSignature ?
								<Select placeholder="请选择签名" style={{ width: 150 }} defaultValue={selectSignature} onChange={this.changeInput.bind(this, 'custType')} getPopupContainer={trigger => trigger.parentNode}>
									{signature.map((item, index) => (
										<Option key={index} value={item.signature}>{item.signature}</Option>
									))}
								</Select> : null : <Select placeholder="请选择签名" style={{ width: 150 }} onChange={this.changeInput.bind(this, 'custType')} getPopupContainer={trigger => trigger.parentNode}>
									{signature && signature.map((item, index) => (
										<Option key={index} value={item.signature}>{item.signature}</Option>
									))}
								</Select>
						}

					</div>
					<div className='template-add-detail'>
						<span className='template-add-title'>选择短信类型</span>
						{
							templateId ? dxtd && channel ?
								<Select placeholder="请选择短信类型" style={{ width: 150 }} defaultValue={channel} onChange={this.selectChange.bind(this, 'channel')} getPopupContainer={trigger => trigger.parentNode}>
									{dxtd.map((item, index) => (
										<Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
									))}
								</Select> : null : <Select placeholder="请选择短信类型" style={{ width: 150 }} onChange={this.selectChange.bind(this, 'channel')} getPopupContainer={trigger => trigger.parentNode}>
									{dxtd&&dxtd.map((item, index) => (
										<Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
									))}
								</Select>
						}

					</div>
					<div className='template-add-detail'>
						<span className='template-add-title'>短信内容</span>
						{/*<Select placeholder="插入变量" style={{ width: 150 }}>
							<Option value="插入变量">插入变量</Option>
							<Option value="不插入变量">不插入变量</Option>
						</Select>*/}
						{/* <span className="sensitive-words" onClick={this.changeColor}>验证敏感词</span> */}
						{/* <span style={{ paddingLeft: '10px', color: '#fc5b5e' }}>{sensitiveWord}</span> */}
					</div>
					{/*<textarea className='message-content' placeholder='请输入' onChange={this.wordChange} />*/}
					{
						templateId ? height && width && templateContent && variable ?
							<Ueditor id={id} height={height} width={width} htbl={variable} search={this.search} submit={this.submit} content={htmlContent || templateContent} toolbars={toolbars} wordCount={true} maximumWords={300} />
							: null : height && width && <Ueditor id={id} height={height} width={width} search={this.search} submit={this.submit} toolbars={toolbars} wordCount={true} maximumWords={300} />
					}
					<p className='template-message-count' style={{ width: `${width}px` }}>
						{/*<span className="template-count">当前总共输出100字(短信长度不得超过300字)</span>*/}
						<span className="template-default" onClick={this.backDefault}>恢复默认值</span>
					</p>
					<Button className="template-submit" type="primary" onClick={this.handleOkSen}>提交</Button>
					<Button className="template-cancel" type="primary" onClick={this.goBack}>取消</Button>
				</div>
			</div>
		);
	}
}

export default TemplateAdd;

