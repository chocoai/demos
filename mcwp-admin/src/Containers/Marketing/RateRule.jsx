import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';
import { Validate } from '../../Config/Validate';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import './style/rateRule.less';
import MarRateService from '../../Services/MarRateService';//调用数据
import ProductService from '../../Services/ProductService'; // services层 产品管理
import CommonService from '../../Services/CommonService';
import BaseService from '../../Services/BaseService';

import ActivityShare from '../../Component/Activity/ActivityShare';
import RateRule from '../../Component/Rate/RateRule';

import { Spin, Button, Col, Row, message, Form } from 'antd';
const ActivityShareForm = Form.create()(ActivityShare)
const RateRuleForm = Form.create()(RateRule)
const flatten = arr => {
    return arr.reduce((acc, value) => {
        const newFields = Object.assign({}, acc.fields, value.fields)
        const newErrs = Object.assign({}, acc.errs, value.errs)
        return Object.assign(acc, { fields: newFields }, { errs: newErrs })
    })
}
/**
 * 利率营销 —— 规则设置
 * @Author: 魏昌华
 * @Date:   2018-06-05
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2018-06-05
 */
class RateRules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            helpConfig: [],
            rateConf: null,
            isHelp: true,
            activityRemark: 0,
            titleLen: 0,
            summaryLen: 0,
            productItem: null,
            imgobj: {},
            shareConfs: null,
            srcUrl: null,//分享图片
            onlyCode: window.localStorage.getItem('ENTERP_CODE') + 'knife',
        };
    }
    async componentDidMount() {
        const that = this;
        let onlyCode = window.localStorage.getItem('ENTERP_CODE') + 'knife'
        this.initOSS()
        this.getShareConfs({ type: 6, activityCode: onlyCode });//类型：1,首页，2，拼图，3，分享有礼，4抽奖，5，摇一摇，6，砍利率
        this.getPictureInfo([Config.bizType.rateKnifeBg, Config.bizType.rateHelpBg, Config.bizType.rateProdImg, Config.bizType.rateQrcode, Config.bizType.shareRate])
        this.getProName({ prdStatus: 2 })
        const res = await MarRateService.getRateConf();
        if (res.code == Config.errorCode.success) {
            that.startRate = (res.data && res.data.startRate) || 0;
            that.minimumRate = (res.data && res.data.minimumRate) || 0;
            let helpConfig = (res.data && res.data.helpConfig) || null;
            if (helpConfig.indexOf(',') > -1) {
                helpConfig = helpConfig.split(',');
            } else if (helpConfig) {
                helpConfig = [helpConfig];
            }
            // let prodCode = (res.data && res.data.prodCode) || null;
            if (res.data && res.data.prodCode && res.data.prodCode.indexOf(',') > -1) {
                res.data.prodCode = res.data.prodCode.split(',');
            } else if (res.data.prodCode) {
                res.data.prodCode = [res.data.prodCode];
            }
            that.setState({
                rateConf: res.data,
                helpConfig: helpConfig || [],
                activityRemark:res.data&&res.data.description&&res.data.description.length||0
            });
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
    async getPictureInfo(arr) {  // 照片信息
        let code = this.state.onlyCode;
        let { imgobj } = this.state;
        let fileType = '/' + Object.values(Config.bizType).join(',')
        let res = await CommonService.getPictureInfo(code, fileType)
        if (res.code == Config.errorCode.success) {
            if (res.data && res.data[arr[0]] && res.data[arr[0]][0]) {
                imgobj.rateKnifeBg = res.data[arr[0]][0].srcUrl;
            }
            if (res.data && res.data[arr[1]] && res.data[arr[1]][0]) {
                imgobj.rateHelpBg = res.data[arr[1]][0].srcUrl;
            }
            if (res.data && res.data[arr[2]] && res.data[arr[2]][0]) {
                imgobj.rateProdImg = res.data[arr[2]][0].srcUrl;
            }
            if (res.data && res.data[arr[3]] && res.data[arr[3]][0]) {
                imgobj.rateQrcode = res.data[arr[3]][0].srcUrl;
            }
            if (res.data && res.data[arr[4]] && res.data[arr[4]][0]) {
                this.setState({
                    srcUrl: res.data[arr[4]][0].srcUrl
                })
            }
            this.setState({
                imgobj: imgobj
            })
        }
    }
    // 获取产品列表
    async getProName(params) {
        const that = this;
        const res = await ProductService.getDropProdCity(params);
        that.setState({
            productItem: res.data || []
        })
    }
    validatorForm = (rule, value, callback) => { // 表单验证
        const that = this;
        let { helpConfig } = that.state;
        if (rule.field == 'startRate') { // 初始日利率
            that.startRate = value;
            if (Config.isNull(value)) {
                callback('请录入初始日利率');
            } else if (parseFloat(value) < 0.01 || parseFloat(value) > 99.99) {
                callback('初始日利率录入范围为0.01-99.99');
            } else if (!Config.checkNumberTwo(value)) {
                callback('初始日利率只能录入正整数或2位以内的小数');
            } else {
                callback();
            }
        }
        if (rule.field == 'minimumRate') { // 日利率最低砍至
            that.minimumRate = value;
            if (Config.isNull(value)) {
                callback('请录入最低日利率');
            } else if (parseFloat(value) < 0.01 || parseFloat(value) > 99.99) {
                callback('最低日利率录入的范围为0.01-99.99');
            } else if (!Config.checkNumberTwo(value)) {
                callback('最低日利率只能录入正整数或2位以内的小数');
            } else if (parseFloat(value) >= parseFloat(that.startRate)) {
                callback('初始日利率应高于最低利率，请修改数值');
            } else {
                callback();
            }
        }
        if (rule.field == 'helpNum') { // 帮忙助力好友个数
            if (Config.isNull(value)) {
                callback('请录入帮忙助力好友个数');
            } else if (value <= 0 || !Config.checkNumber(value)) {
                callback('帮忙助力好友个数只能录入正整数');
            } else if (value < 1 || value > 100) {
                callback('帮忙助力好友个数录入范围为1-100');
            } else {
                callback();
            }
        }
        if (rule.field.indexOf('helpConfig') > -1) {
            const index = rule.field.split('helpConfig')[1];
            helpConfig.splice(index, 1, value);
            that.setState({
                helpConfig: helpConfig
            });
            if (Config.isNull(value)) {
                callback(`请录入第${parseInt(index) + 1}刀砍获日利率`);
            } else if (parseFloat(value) < 0.01 || parseFloat(value) > 99.99) {
                callback('砍获日利率录入的范围为0.01-99.99');
            } else if (!Config.checkNumberTwo(value)) {
                callback('砍获日利率只能录入正整数或2位以内的小数');
            } else {
                callback();
            }
        }
        const sum = that.reduceHelp(helpConfig);
        that.setState({
            isHelp: sum == ((Math.round(that.startRate * 10000) - Math.round(that.minimumRate * 10000)) / 10000)
        });
    }
    reduceHelp(arr) {
        return arr.reduce(function (a, b) {
            return (Math.round(parseFloat(a || 0) * 10000) + Math.round(parseFloat(b || 0) * 10000)) / 10000;
        })
    }
    helpConfigFn = (key) => { // 增加或减少刀数
        const that = this;
        let { helpConfig } = that.state;
        if (key === 'add') {
            helpConfig.push('');
        }
        if (key === 'remove') {
            helpConfig.pop();
        }
        const sum = that.reduceHelp(helpConfig);
        that.setState({
            helpConfig: helpConfig,
            isHelp: sum == ((Math.round(that.startRate * 10000) - Math.round(that.minimumRate * 10000)) / 10000)
        });
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
        const that = this;
        const { isHelp, helpConfig } = that.state;
        Promise.all([
            this.getSubFormValue('rateRuleForm'),
            this.getSubFormValue('activityShareForm'),
        ]).then(async result => {
            console.log(result)
            let arr = [];
            arr[0] = flatten([result[0]]);
            arr[1] = flatten([result[1]]);
            let params = arr[0].fields;
            if (arr[1].fields) {
                let shareParams = arr[1].fields;
                delete shareParams.srcUrl;
                shareParams.type = 6;
                shareParams.activityCode = that.state.onlyCode;
                shareParams.bankCode = window.localStorage.getItem('ENTERP_CODE')
                var res1 = await CommonService.putShareConfs(shareParams);
            }
            if (isHelp) {
                delete params.rateKnifeBg;
                delete params.rateHelpBg;
                delete params.rateProdImg;
                delete params.rateQrcode;
                if (Array.isArray(params.prodCode)) {
                    params.prodCode = params.prodCode.join(",")
                }
                params.helpConfig = helpConfig.join(',')
                var res = await MarRateService.putRateConf(params);
            }
            
            if (res.code == Config.errorCode.success && res1.code == Config.errorCode.success) {
                message.success('设置成功！');
                browserHistory.push('/marketing/rate');
            }
        })
    }
    textareaChangeThree = (e) => {
        let that = this;
        that.setState({
            activityRemark: e.target.value.length
        })
    }
    initOSS() {
        // OSS
        const that = this
        const pScript = Config.appendScript(Config.baseText.pScript);
        pScript.onload = function () {
            const oScript = Config.appendScript(Config.baseText.oScript);
            oScript.onload = function () {
                let OSS = window.OSS;
                const wOSS = OSS.Wrapper,
                    bucket = Config.ossKey.bucket,
                    region = Config.ossKey.region;
                let ossClient = null;
                if (Config.localItem('OOS_CLIENT')) ossClient = JSON.parse(Config.localItem('OOS_CLIENT'));
                let currentTime = (new Date()).getTime();
                if (!ossClient || currentTime >= ossClient.expiration) {
                    BaseService.getStsToken({}, (res) => {
                        if (res.code == Config.errorCode.success) {
                            let expiration = currentTime + res.data.durationSeconds * 1000;
                            let wOssParams = {
                                region: region,
                                secure: true,
                                accessKeyId: res.data.accessKeyId,
                                accessKeySecret: res.data.accessKeySecret,
                                stsToken: res.data.securityToken,
                                bucket: bucket
                            };
                            const client = new wOSS(wOssParams);
                            that.ossClient = client
                            wOssParams.expiration = expiration;
                            Config.localItem('OOS_CLIENT', JSON.stringify(wOssParams));
                        } else {
                            message.error(res.msg);
                        }
                    });
                } else {
                    delete ossClient.expiration;
                    const client = new wOSS(ossClient);
                    that.ossClient = client
                }
            }
        }
    }
    getFile = (e, type, codes, index) => {
        const that = this
        let { imgobj } = this.state;
        for (let file of e.target.files) {
            if (file.type == 'image/jpeg' || file.type == 'image/png') {
                that.upload(file, type, codes)
            } else {
                message.error('上传文件格式不对')
                return
            }
        }
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (type == 'share') {
                this.setState({
                    srcUrl: reader.result
                });
            } else if (type == 'rateKnifeBg') {
                imgobj.rateKnifeBg = reader.result
            } else if (type == 'rateHelpBg') {
                imgobj.rateHelpBg = reader.result
            } else if (type == 'rateProdImg') {
                imgobj.rateProdImg = reader.result
            } else if (type == 'rateQrcode') {
                imgobj.rateQrcode = reader.result
            }
            this.setState({
                imgobj: imgobj
            })
        };
        reader.readAsDataURL(files[0]);
    }
    upload = (file, type, codes) => {
        const that = this
        const { tplType } = that.state
        let code = this.state.onlyCode;
        let fileType
        if (type == 'share') {
            fileType = Config.bizType.shareRate
        } else {
            fileType = Config.bizType[type]
        }
        let fileArray = file.name.split('.');
        let key = Config.localItem('ENTERP_CODE') + '/' + fileType + '/' + Config.localItem('LOGIN_USER_ID') + '/' + Config.getOssUUID() + (new Date()).getTime() + '.' + fileArray[fileArray.length - 1];
        let cbParams = {
            style: '',
            size: file.size,
            mimeType: file.type,
            bizCode: code,
            enterpriseCode: Config.localItem('ENTERP_CODE'),
            bizType: fileType
        };
        const fileListBizType = tplType;
        if (that.ossClient && that.ossClient.multipartUpload && typeof that.ossClient.multipartUpload == 'function') {
            that.uploadFile(cbParams, that.ossClient, key, file, fileListBizType);
        } else {
            that.initOSS()
            message.destroy()
            message.error('上传失败，请重试');
        }
    }
    uploadFile = (cbParams, client, key, file, fileListBizType) => {
        const that = this
        client.multipartUpload(key, file, {}).then(function (res) {
            cbParams.bucket = res.bucket || Config.ossKey.bucket;
            cbParams.objKey = res.name || key;
            cbParams.etag = res.etag;
            that.uploadCallback(cbParams, fileListBizType); // 上传成功
        }).catch(error => {
            that.initOSS()
            message.destroy()
            message.error('上传失败，请重试');
        })
    }
    uploadCallback = (params, fileListBizType) => {
        const that = this
        BaseService.ossUploadCb(params, (res) => {
            if (res.code == Config.errorCode.success) {
                message.destroy()
                message.success('上传成功');
            } else {
                message.error(res.msg);
            }
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
    render() {
        const that = this;
        const { loading, rateConf, helpConfig, isHelp, productItem, imgobj, shareConfs, srcUrl, activityRemark,summaryLen,titleLen } = that.state;
        const bcrumb = [{
            'link': '/marketing/rate',
            'value': '利率营销'
        }, {
            'link': null,
            'value': '规则设置'
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="rate-rule-container">
                    <BcrumbItem bcrumb={bcrumb} />
                    <div className="rule-content common-console-container">
                        <RateRuleForm ref={form => { this.rateRuleForm = form }} rateConf={rateConf} helpConfig={helpConfig.length && helpConfig} isHelp={isHelp} productItem={productItem} imgobj={imgobj} reduceHelp={this.reduceHelp} helpConfigFn={this.helpConfigFn} validatorForm={this.validatorForm} textareaChangeThree={this.textareaChangeThree} activityRemark={activityRemark} getFile={this.getFile}/>
                        <Row className="knife-set" type="flex" justify="start">
                            <Col span={24} className='title-col'>分享链接</Col>
                            <ActivityShareForm ref={form => { this.activityShareForm = form }} shareConfs={shareConfs} srcUrl={srcUrl} getFile={this.getFile} required={true} titleLen={titleLen} summaryLen={summaryLen} textareaChange={this.textareaChange}/>
                        </Row>
                        <Button className="common-btn" type="primary" onClick={this.handleOkSen}>保存设置</Button>
                        <Button className="common-btn cancel-btn" onClick={() => browserHistory.goBack()}>取消</Button>
                    </div>
                </div>
            </Spin>
        );
    }
}
export default RateRules;
