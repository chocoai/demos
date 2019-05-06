import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import Ueditor from '../../Component/Ueditor/Ueditor';
import TemplateService from '../../Services/TemplateService'

import './style/templateAdd.less';

import { Select, Button, Modal, message } from 'antd';
const Option = Select.Option;
const confirm = Modal.confirm;
class OperateTemplateAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 300,
            width: 700,
            id: 'template-editor',
            content: '',
            toolbars: [['customstyle']],
            signature: [],
            selectSignature: undefined,
            templateId: props.routeParams.code,
            templateContent: null,   // 初始内容
            htmlContent: '',
            templateType:1,
        };
    }
    componentWillMount() {
        this.initialData()
    }
    componentDidMount() {
        Config.calculateSize(this);
    }
    async initialData() {
        this.getInfo('/v1/message/signature/pass', 'signature') // 签名列表
        if(this.state.templateId){
            let info = this.getInfo('/v1/message/template/info','info') // 短信模版
        info = await info;
        // let variable = this.getInfo('/v1/message/template/variable','variable', info.applyScene) // 短信模版
        // // res = await res;
        // variable = await variable;
        // variable = Array.from(variable, item => ({ddText: item}))
        this.setState({
        	templateContent: info.content,
        	htmlContent: info.htmlContent,
        	selectSignature: info.signature,
        })
        }	
    }
    getInfo(url, type, applyScene) {
        let that=this;
        return new Promise(resolve => {
            let params = {};
            if(that.state.templateId){
                params = {
                    id: that.state.templateId
                }
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
    handleOk=(e)=> {
        const { selectSignature,templateType,templateId} = this.state;
        let UE = window.UE;
        let ue = UE.getEditor(this.state.id);
        // htmlContent html文本  content  text文本
        let htmlContent = ue.getContent();
        htmlContent = htmlContent.replace(/<input value=/g, '<input label=');
        let tempContent = htmlContent.toString().replace(/(<input)(\s)(label="{)([\u4E00-\u9FFF]+)(}" readonly="" style="font-family: FangSong; font-size: 16px; text-align: center; width: )(\d+)(px; border: none;"\/>)/g, '<span>{$4}</span>')
        ue.execCommand('cleardoc')
        ue.execCommand('inserthtml', tempContent);
        let content = ue.getContentTxt();
        // content = content.split(' ').join('');
        htmlContent = htmlContent.replace(/<input label=/g, '<input value=');
        // ue.execCommand('cleardoc')
        // ue.execCommand('inserthtml', htmlContent);
        if(!selectSignature) return message.warning("请选择短信签名")
        if(!content&&!htmlContent) return message.warning("请输入短信内容")
        let params = {
            signature: selectSignature,
            content,
            htmlContent,
            templateType:templateType,
        }
        if(templateId){
            params.id=templateId;
            this.editOperateTemplate(params)
        }else{
            this.addOperateTemplate(params)
        }
    }
    async addOperateTemplate(params){
        let res = await TemplateService.addOperateTemplate(params)
        if (res.code == Config.errorCode.success) {
            message.success('新增成功！')
            browserHistory.goBack();
        }
    }
    async editOperateTemplate(params){
        let res = await TemplateService.editOperateTemplate(params)
        if (res.code == Config.errorCode.success) {
            message.success('修改成功！')
            browserHistory.goBack();
        }
    }
    goBack = (e) => {
        browserHistory.goBack();
    }
    changeInput = (inp, e) => { // input值变化
        this.setState({
            selectSignature: e
        })
    }
    render() {
        const { variable, width, height, id, templateContent, toolbars, signature,selectSignature, htmlContent, templateId,} = this.state;
        const bcrumb = [{
            'link': '/template/operate',
            'value': '消息模板管理'
        }, {
            'link': null,
            'value': templateId ? '编辑短信模板' : '新增短信模板'
        }];
        return (
            <div className="templateAdd-container">
                <BcrumbItem bcrumb={bcrumb} />
                <div className="template-add-content">
                    <div className='template-add-detail'>
                        <span className='template-add-title'>选择短信签名</span>
                        {templateId?signature && selectSignature?<Select placeholder="请选择签名" style={{ width: 150 }}
                             defaultValue={selectSignature} 
                            onChange={this.changeInput.bind(this, 'custType')}>
                            {signature.map((item, index) => (
                                <Option key={index} value={item.signature}>{item.signature}</Option>
                            ))}
                        </Select>:null:<Select placeholder="请选择签名" style={{ width: 150 }}
                             defaultValue={selectSignature} 
                            onChange={this.changeInput.bind(this, 'custType')}>
                            {signature.map((item, index) => (
                                <Option key={index} value={item.signature}>{item.signature}</Option>
                            ))}
                        </Select>}
                        
                    </div>
                    <div className='template-add-detail'>
                        <span className='template-add-title'>短信内容</span>
                        <span>短链前后需要1个空格</span>
                    </div>
                    {templateId?height && width && templateContent?<Ueditor id={id} height={height} width={width} htbl={variable} search={this.search} submit={this.submit} content={htmlContent || templateContent} toolbars={toolbars} wordCount={true} maximumWords={300} />:null:<Ueditor id={id} height={height} width={width} htbl={variable} search={this.search} submit={this.submit} content={htmlContent || templateContent} toolbars={toolbars} wordCount={true} maximumWords={300} />}
                    
                    <div style={{ paddingTop: '20px' }}>
                        <Button className="template-submit" type="primary" onClick={this.handleOk}>提交</Button>
                        <Button className="template-cancel" type="primary" onClick={this.goBack}>取消</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default OperateTemplateAdd;

