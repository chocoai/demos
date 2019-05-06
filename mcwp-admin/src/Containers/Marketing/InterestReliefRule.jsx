import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';
import { Validate } from '../../Config/Validate';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import './style/rateRule.less';
import InterestReliefService from '../../Services/InterestReliefService';
import CommonService from '../../Services/CommonService';
import ProductService from '../../Services/ProductService';

import ActivityShare from '../../Component/Common/Share';
import InterestReliefRule from '../../Component/InterestRelief/InterestReliefRule';

import { Spin, Button, Col, Row, message, Form } from 'antd';
const ActivityShareForm = Form.create()(ActivityShare)
const InterestReliefRuleForm = Form.create()(InterestReliefRule)
const flatten = arr => {
    return arr.reduce((acc, value) => {
        const newFields = Object.assign({}, acc.fields, value.fields)
        const newErrs = Object.assign({}, acc.errs, value.errs)
        return Object.assign(acc, { fields: newFields }, { errs: newErrs })
    })
}
class InterestReliefRules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            interestReliefRuleConfs: null,
            description: 0,
            useDescription: 0,
            titleLen: 0,
            summaryLen: 0,
            shareConfs: null,
            onlyCode: window.localStorage.getItem('ENTERP_CODE') + 'bonus',
            jumpPrds:null,
            dictItems:null,
            prodShow:false,
        };
    }
    async componentDidMount() {
        let {onlyCode}=this.state;
        this.getDropProd({ prdStatus: 2 });
        this.getDictItems({ code: 'yxqdtj' })
        this.getShareConfs({ type: 7, activityCode: onlyCode });//类型：1,首页，2，拼图，3，分享有礼，4抽奖，5，摇一摇，6，砍利率,7 抵息红包
        this.getInterestReliefRuleConfs()
    }
    async getDropProd(params) { // 获取产品列表（用于下拉）
        const that = this;
        const res = await ProductService.getDropProd(params);
        if (res.code == Config.errorCode.success) {
            that.setState({
                jumpPrds: res.data,
            });
        }
    }
     // 获取字典值
     async getDictItems(params) {
        const res = await CommonService.getDictItems(params);
        if (res.code == Config.errorCode.success) {
            this.setState({
                dictItems: res.data,
            });
        }
    }
    async getInterestReliefRuleConfs(params) {
        const res = await InterestReliefService.getInterestReliefRuleConfs(params);
        if(res.code==Config.errorCode.success){
            if(res.data&&res.data.proType=='1'){
                this.setState({
                    prodShow:true
                })
            }
            this.setState({
                interestReliefRuleConfs:res.data,
                description: res.data&&res.data.description&&res.data.description.length||0,
                useDescription: res.data&&res.data.useDescription&&res.data.useDescription.length||0,
            })
        }
    }
    async getShareConfs(params) {
        const res = await CommonService.getShareConfs(params);
        this.setState({
            shareConfs: res.data,
            titleLen: res.data&&res.data.title&&res.data.title.length||0,
            summaryLen: res.data&&res.data.summary&&res.data.summary.length||0,
        })
    }
    getSubFormValue(formName) {
        return new Promise(resolve => {
            if (this[formName]) {
                this[formName].validateFields((errs, fields) => {
                    if (errs) {
                        message.error('存在不符合要求项，请及时修改')
                        console.log(errs)
                        // resolve({ errs, fields })
                    } else {
                        resolve({ errs, fields })
                    }
                })
            } else {
                resolve({})
            }
        })
    }
    handleOkSen = () => { //提交数据
        let that=this;
        Promise.all([
            this.getSubFormValue('interestReliefRuleForm'),
            this.getSubFormValue('activityShareForm'),
        ]).then(async result => {
            let arr = [];
            arr[0] = flatten([result[0]]);
            arr[1] = flatten([result[1]]);
            let params = arr[0].fields;
            if (arr[1].fields) {
                let shareParams = arr[1].fields;
                delete shareParams.srcUrl;
                shareParams.type = 7;
                shareParams.activityCode = that.state.onlyCode;
                shareParams.bankCode = window.localStorage.getItem('ENTERP_CODE')
                var res1 = await CommonService.putShareConfs(shareParams);
            }
            if (arr[0].fields) {
                delete params.activityBonusGraphic;
                delete params.activityBonusHelp;
                delete params.activityBonusHelpProd;
                delete params.activityBonusHelpQrcode;
                params.code=that.state.onlyCode;
                var res = await InterestReliefService.putInterestReliefRuleConfs(params);
            }
            // console.log(arr)
            if (res.code == Config.errorCode.success && res1.code == Config.errorCode.success) {
                message.success('设置成功！')
                browserHistory.push('/marketing/interestRelief')
            }
        })
    }
    textareaChangeThree = (e,type) => {
        let that = this;
        that.setState({
            [type]: e.target.value.length
        })
    }
    textareaChange=(e,type)=> {
        if(type=='title'){
            this.setState({
                titleLen: e.target.value.length
            })
        }else if(type=='abstract'){
            this.setState({
                summaryLen: e.target.value.length
            })
        }
        
    }
    changeTzz=(value)=>{
        if(value==1){
            this.setState({
                prodShow:true
            })
        }else{
            this.setState({
                prodShow:false
            })
        }
    }
    render() {
        const that = this;
        const { loading, interestReliefRuleConfs,shareConfs,description,useDescription,summaryLen,titleLen,onlyCode,jumpPrds, dictItems,prodShow} = that.state;
        const bcrumb = [{
            'link': '/marketing/interestRelief',
            'value': '抵息红包'
        }, {
            'link': null,
            'value': '规则设置'
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="interest-rule-container">
                    <BcrumbItem bcrumb={bcrumb} />
                    <div className="rule-content common-console-container">
                        <InterestReliefRuleForm ref={form => { this.interestReliefRuleForm = form }} interestReliefRuleConfs={interestReliefRuleConfs} textareaChangeThree={this.textareaChangeThree} description={description} useDescription={useDescription} code={onlyCode} type={[Config.bizType.activityBonusGraphic, Config.bizType.activityBonusHelp,Config.bizType.activityBonusHelpProd,Config.bizType.activityBonusHelpQrcode]} jumpPrds={jumpPrds} yxqdtj={dictItems&&dictItems.yxqdtj} changeTzz={this.changeTzz} prodShow={prodShow}/>
                        <Row className="knife-set" type="flex" justify="start">
                            <Col span={24} className='title-col'>分享链接</Col>
                            <ActivityShareForm ref={form => { this.activityShareForm = form }} shareConfs={shareConfs}required={true} titleLen={titleLen} summaryLen={summaryLen} textareaChange={this.textareaChange} code={onlyCode} type={Config.bizType.shareBonus}/>
                        </Row>
                        <Button className="common-btn" type="primary" onClick={this.handleOkSen}>保存设置</Button>
                        <Button className="common-btn cancel-btn" onClick={() => browserHistory.goBack()}>取消</Button>
                    </div>
                </div>
            </Spin>
        );
    }
}
export default InterestReliefRules;
