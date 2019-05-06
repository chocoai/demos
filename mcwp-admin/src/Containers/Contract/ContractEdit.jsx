import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';
import Ueditor from '../../Component/Ueditor/Ueditor';
import ContractPDF from '../../Component/Contract/ContractPDF';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';

import './style/contractEdit.less';

import { message, Select, Button ,Modal } from 'antd';
const confirm = Modal.confirm;
const Option = Select.Option;

/**
 * 合同编辑
 * @Author: 赵俊
 * @Date:   2017-08-08
 * @Last Modified by: 赵俊
 * @Last Modified time: 2017-08-08
 */
class ContractEdit extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
			code: props.routeParams.code,
			tplName:'',						// 合同名称
			id: 'contract-editor',			// 富文本编辑器id
			content: null,					// 富文本编辑器初始内容
			width:null,						// 富文本编辑器初始宽度
			height: 300,					// 富文本编辑器初始高度
			contractType:null, 				// 合同类型选择
			tplType: '', 					// 合同类型
			htbl:null, 						// 合同变量
			defaultContent: null, 			// 合同恢复默认值
			toolbars: [['customstyle', 'fontfamily', 'fontsize', 'bold', 'underline']]
		};
	}
	componentDidMount(){
		Promise.all([
			this.getContractTpl(),
			this.getContractType()
		]).then(result => {
            this.setState({
				tplType: result[0].toString()
			})
			Config.calculateSize(this);
        });
	}
	getContractTpl() {
        return new Promise(resolve => {
			const { code } = this.state;
			let params = {
				code: code
			};
			Config.get('/v1/contract/tpl/info/' + code , params, (res) => {
				if(res.code == Config.errorCode.success) {
					this.setState({
						tplName: res.data.tplName,
						content: res.data.tplContent,
						defaultContent: res.data.tplContent
					})
					resolve(res.data.tplType);
				} else {
					message.error(res.msg);
				}
			});
		})
	}
	getContractType() {
        return new Promise(resolve => {
			let params = {
				code: 'htlx,htbl'
			};
			Config.get('/comm/sys/dict/items/all', params, (res) => {
				if(res.code == Config.errorCode.success) {
					this.setState({
						contractType: res.data.htlx,
						htbl: res.data.htbl
					})
					resolve(res.data);
				} else {
					message.error(res.msg);
				}
			});
		})
	}
	tplName = (e) => {
		this.setState({
			tplName: e.target.value
		})
	}
	// 替换标签label换为value
	replaceTag(origin){
		let target = origin.replace(/<input label=/g, '<input value=');
		// target = target.replace(/宋体/g, 'SimSun');
		// target = target.replace(/黑体/g, 'SimHei');
		// target = target.replace(/仿宋/g, 'FangSong');
		return target;
	}
	preview = () => {
        let UE = window.UE;
        let params = {
            content: this.replaceTag(UE.getEditor(this.state.id).getContent())
        }
        Config.put('/v1/contract/tpl/tmp', params, (res) => {
            if(res.code == Config.errorCode.success) {
				this.setState({
					tmpCode: res.data,
					previewShow: true
				})
         	} else {
                message.error(res.msg);
         	}
        });
	}
	previewClose = () => {
		this.setState({
			previewShow: false
		})
	}
    save = () => {
        const { tplName, code } = this.state;
        let UE = window.UE;
        let params = {
			code: code,
            tplContent:this.replaceTag(UE.getEditor(this.state.id).getContent()),
			tplName
        }
        Config.put('/v1/contract/tpl/edit', params, (res) => {
            if(res.code == Config.errorCode.success) {
				confirm({
					title: '保存编辑',
					content: '是否保存此次修改',
					onOk() {
						// browserHistory.push('/contract')
						browserHistory.goBack();
					},
					onCancel() {
					  console.log('Cancel');
					},
				  });

         	} else {
                message.error(res.msg);
         	}
        });
    }
	cancel = () => {
		confirm({
			title: '取消编辑',
			content: '编辑内容未保存是否放弃此次编辑？',
			onOk() {
				// browserHistory.push('/contract')
				browserHistory.goBack();
			},
			onCancel() {
			  console.log('Cancel');
			},
		  });
	}
	// insert = (value) => {
    //     let ue = UE.getEditor(this.state.id);
    //     ue.execCommand('inserthtml', `<input class="variable" type="text" value=${value} readonly="" style="font-size:16px;text-align:center;width:${value.length * 15 + 10}px;border:none;" />`);
	// }
    // search = () => {
	// 	var location = UE.dom.domUtils.getXY( window.frames[1].document.getElementsByClassName("variable")[0] );
	// 	console.log(location)
    // }
	handleChange = (value) => {
		this.setState({
			tplType: value
		})
	}
	backDefault = () => {
        let UE = window.UE;
		const { content } = this.state;
		let ue = UE.getEditor(this.state.id);
		confirm({
			title: '恢复默认值',
			content: '您确认放弃当前编辑内容？',
			onOk() {
				// 先清空
				ue.execCommand('cleardoc')
				ue.execCommand('inserthtml', content);
			},
			onCancel() {
			  console.log('Cancel');
			},
		  });
	}
	render() {
		const { toolbars, id, content, height, width, tmpCode, previewShow, tplName, contractType, tplType, htbl } = this.state;
		const bcrumb = [{
            'link': '/contract/user',
            'value': '合同管理'
        }, {
            'link': null,
            'value': '编辑合同'
		}];
		return (
			<div className="contractEdit-container">
				<BcrumbItem bcrumb={bcrumb} />
				<div className='contract-edit-content'>
					<div className='row-container'>
						<div className='contract-title'>
							<span className='contract-describe'>合同名称</span>
							<input className='contract-title-content' value = {tplName} onChange={this.tplName} />
						</div>
						<div className='contract-type'>
							<span className='contract-describe'>合同类型</span>
							<Select disabled placeholder="请选择" value={tplType} style={{ width: 150 }} onChange={this.handleChange}>
								{
									contractType && contractType.map((item, index) =>(
										<Option key={index} value={item.ddValue}>{item.ddText}</Option>
									))
								}
							</Select>
						</div>
					</div>
					{/*<div className='contract-variable'>
						<span className='contract-describe'>合同详情</span>
						<Select value={<span className='contract-select'>手机号</span>} style={{ width: 150 }} onSelect={this.insert}>
							<Option key='1' value="18812345678">手机号</Option>
							<Option key='2' value="钱袋">公司名</Option>
						</Select>
					</div>*/}
					{
						height && width?
						<Ueditor id={id} height={height} width ={width} search = {this.search} toolbars={toolbars} submit = {this.submit} content = { content } htbl={ htbl } />
						: null
					}
					<p className='contract-default' style={{width: `${width}px`}}>
						<span className='contract-restore' onClick={this.backDefault}>恢复默认值</span>
					</p>
					{
						previewShow?
						<ContractPDF width = {width} code = {tmpCode} previewClose = {this.previewClose} />:
						null
					}
					<Button className='save' type="primary" onClick={this.save}>保存</Button>
					<Button className='preview' type="primary" onClick={this.preview}>预览</Button>
					<Button className='cancel' type="primary" onClick={this.cancel}>取消</Button>
					<div id='testdiv' style={{height: '1in', left: '-100%', position: 'absolute', top: '-100%', width: '1in'}}></div>
				</div>
		    </div>
		);
	}
}

export default ContractEdit;

