import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import { Spin, message, Button, Form, Row } from 'antd';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import ruleDescription from './../../Assets/Images/icon_ruledescription.png';
import MarShareService from '../../Services/MarShareService'; // services层
import CommonService from '../../Services/CommonService';
import ProductService from '../../Services/ProductService'; // services层 产品管理
import ActivityShare from '../../Component/Activity/ActivityShare';
import MarketShareRule from '../../Component/Market/MarketShareRule';
import BaseService from '../../Services/BaseService';
import './style/marketShareRule.less';
import { browserHistory } from 'react-router';
const ActivityShareForm = Form.create()(ActivityShare)
const MarketShareRuleForm = Form.create()(MarketShareRule)
const flatten = arr => {
    return arr.reduce((acc, value) => {
        const newFields = Object.assign({}, acc.fields, value.fields)
        const newErrs = Object.assign({}, acc.errs, value.errs)
        return Object.assign(acc, { fields: newFields }, { errs: newErrs })
    })
}
class MarketShareRules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            itemArr: [0],
            selfRewardConfigDTO: {},//个人奖励设置
            merchantRewardConfigDTO: {},//商家奖励设置
            description: '',
            productItem: [],//产品列表
            activityImg: null,
            activityRemark: 0,
            titleLen1: 0,
            summaryLen1: 0,
            titleLen2: 0,
            summaryLen2: 0,
            shareConfs1: null,
            srcUrl1: null,//分享图片
            shareConfs2: null,
            srcUrl2: null,//分享图片
            onlyCode: window.localStorage.getItem('ENTERP_CODE') + 'share',
        }
    }
    componentDidMount() {
        let onlyCode = window.localStorage.getItem('ENTERP_CODE') + 'share'
        this.initOSS()
        this.getShareConfs({ type: 3, activityCode: onlyCode });//类型：1,首页，2，拼图，3，分享有礼，4抽奖，5，摇一摇，6，砍利率
        this.getShareConfs({ type: 1, activityCode: onlyCode });//类型：1,首页，2，拼图，3，分享有礼，4抽奖，5，摇一摇，6，砍利率
        this.getPictureInfo([Config.bizType.shareActivity, Config.bizType.shareShare, Config.bizType.shareIndex])
        // 获取产品列表
        this.getProName({ prdStatus: 2 })
        // 获取分享的设置信息
        this.getMarShareInfo()
    }
    async getShareConfs(params) {
        const res = await CommonService.getShareConfs(params);
        if (params.type == 1) {
            this.setState({
                shareConfs2: res.data,
                titleLen2: res.data&&res.data.title&&res.data.title.length||0,
                summaryLen2: res.data&&res.data.summary&&res.data.summary.length||0,
            })
        } else {
            this.setState({
                shareConfs1: res.data,
                titleLen1: res.data&&res.data.title&&res.data.title.length||0,
                summaryLen1: res.data&&res.data.summary&&res.data.summary.length||0,
            })
        }

    }
    async getPictureInfo(arr) {  // 照片信息
        let code = this.state.onlyCode;
        let fileType = '/' + Object.values(Config.bizType).join(',')
        let res = await CommonService.getPictureInfo(code, fileType)
        if (res.code == Config.errorCode.success) {
            if (res.data && res.data[arr[0]] && res.data[arr[0]][0]) {
                this.setState({
                    activityImg: res.data[arr[0]][0].srcUrl
                })
            }
            if (res.data && res.data[arr[1]] && res.data[arr[1]][0]) {
                this.setState({
                    srcUrl1: res.data[arr[1]][0].srcUrl
                })
            }
            if (res.data && res.data[arr[2]] && res.data[arr[2]][0]) {
                this.setState({
                    srcUrl2: res.data[arr[2]][0].srcUrl
                })
            }
        }
    }
    // 获取产品列表
    async getProName(params) {
        const that = this;
        const res = await ProductService.getDropProd(params);
        that.setState({
            productItem: res.data || []
        })
    }
    //获取当前设置状态
    async getMarShareInfo() {
        const that = this;
        const res = await MarShareService.getShareConf();
        if (res.data) {
            let dataobj1 = res.data.activityShareRewardConfigDTOS.filter(item => item.configType == 1)[0];
            let dataobj2 = res.data.activityShareRewardConfigDTOS.filter(item => item.configType == 2)[0];
            dataobj1.registerSwitch = dataobj1.registerSwitch ? '1' : '0';//注册状态 0关闭 1开启
            if (dataobj2.proCode) dataobj2.proCode = dataobj2.proCode.split(",");
            that.setState({
                selfRewardConfigDTO: dataobj1,
                merchantRewardConfigDTO: dataobj2,
                description: res.data.description,
                activityRemark: res.data.description.length
            })
        }
    }
    async putMarShareInfo(params, shareParams1, shareParams2) {//修改分享规则
        const res2 = await CommonService.putShareConfs(shareParams1);
        const res3 = await CommonService.putShareConfs(shareParams2);
        const res = await MarShareService.putShareConf(params);
        if (res.code == Config.errorCode.success && res2.code == Config.errorCode.success && res3.code == Config.errorCode.success) {
            message.success('设置成功！');
            browserHistory.push('/market/share');
        }

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
    onSave = () => {//保存
        const that = this;
        Promise.all([
            this.getSubFormValue('marketShareRule'),
            this.getSubFormValue('activityShareForm1'),
            this.getSubFormValue('activityShareForm2'),
        ]).then(result => {
            console.log(result)
            let arr = [];
            arr[0] = flatten([result[0]]);
            arr[1] = flatten([result[1]]);
            arr[2] = flatten([result[2]]);
            if (Array.isArray(arr[0].fields.activityShareRewardConfigDTOS[1].proCode)) {
                arr[0].fields.activityShareRewardConfigDTOS[1].proCode = arr[0].fields.activityShareRewardConfigDTOS[1].proCode.join(",")
            }
            let params = Config.serializeObjects(arr[0].fields);
            let configType1 = 'activityShareRewardConfigDTOS[0].configType'
            let configType2 = 'activityShareRewardConfigDTOS[1].configType'
            params[configType1] = 1;
            params[configType2] = 2;
            delete params.rateKnifeBg;
            let shareParams1;
            let shareParams2;
            if (arr[1].fields) {
                shareParams1 = arr[1].fields;
                delete shareParams1.srcUrl;
                shareParams1.type = 3;
                shareParams1.activityCode = that.state.onlyCode;
                shareParams1.bankCode = window.localStorage.getItem('ENTERP_CODE')
            }
            if (arr[2].fields) {
                shareParams2 = arr[2].fields;
                delete shareParams2.srcUrl;
                shareParams2.type = 1;
                shareParams2.activityCode = that.state.onlyCode;
                shareParams2.bankCode = window.localStorage.getItem('ENTERP_CODE')
            }
            this.putMarShareInfo(params, shareParams1, shareParams2)
        })
    }
    onExit() {
        browserHistory.push('/market/share');
    }
    awarChange = (value, type) => {//改变奖励规则
        let { selfRewardConfigDTO, merchantRewardConfigDTO } = this.state;
        if (type == 'regist') {
            this.setState({
                selfRewardConfigDTO: Object.assign(selfRewardConfigDTO, { registerSwitch: value }),
            });
        }
        if (type == 'selfloan') {
            this.setState({
                selfRewardConfigDTO: Object.assign(selfRewardConfigDTO, { rewardLoanType: value }),
            });
        }
        if (type == 'selfaudit') {
            this.setState({
                selfRewardConfigDTO: Object.assign(selfRewardConfigDTO, { rewardAuditType: value }),
            });
        }
        if (type == 'meraudit') {
            this.setState({
                merchantRewardConfigDTO: Object.assign(merchantRewardConfigDTO, { rewardAuditType: value }),
            });
        }
        if (type == 'merloan') {
            this.setState({
                merchantRewardConfigDTO: Object.assign(merchantRewardConfigDTO, { rewardLoanType: value }),
            });
        }
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
            if (type == 'activity') {
                this.setState({
                    srcUrl1: reader.result
                });
            } else if (type == 'index') {
                this.setState({
                    srcUrl2: reader.result
                });
            } else if (type == 'shareActivity') {
                this.setState({
                    activityImg: reader.result
                });
            }
        };
        reader.readAsDataURL(files[0]);
    }
    upload = (file, type, codes) => {
        const that = this
        const { tplType } = that.state
        let code = this.state.onlyCode;
        let fileType
        if (type == 'activity') {
            fileType = Config.bizType.shareShare
        } else if (type == 'index') {
            fileType = Config.bizType.shareIndex
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
    textareaChange1=(e,type)=> {
        if(type=='title'){
            this.setState({
                titleLen1: e.target.value.length
            })
        }else if(type=='abstract'){
            this.setState({
                summaryLen1: e.target.value.length
            })
        }
    }
    textareaChange2=(e,type)=> {
        if(type=='title'){
            this.setState({
                titleLen2: e.target.value.length
            })
        }else if(type=='abstract'){
            this.setState({
                summaryLen2: e.target.value.length
            })
        }
        
    }
    render() {
        const that = this;
        const { loading, productItem, selfRewardConfigDTO, merchantRewardConfigDTO, activityRemark, shareConfs1, srcUrl1, shareConfs2, srcUrl2, activityImg, description,summaryLen2,summaryLen1,titleLen1,titleLen2 } = this.state;
        const bcrumb = [{
            'link': '/market/share',
            'value': '分享有礼'
        }, {
            'link': null,
            'value': '规则设置',
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="marketShareRule-container">
                    <BcrumbItem bcrumb={bcrumb} />
                    <div className='common-console-container marketShareRule-content'>
                        <div className='rule-description'>
                            <h3 className='rule-description-title'><img className='rule-description-img' src={ruleDescription} alt='ruleDescription' /><span className='rule-description-word'>分享说明</span></h3>
                            <div className='rule-description-content'>
                                <p className='rule-description-p'>分享有礼是给客户提供的一种营销活动，让客户能自主进行传播，从而达到增大获客量；</p>
                                <p className='rule-description-p'>平台用户A分享产品给B，B满足奖励条件，则A获得积分奖励</p>
                            </div>
                        </div>
                        <div className='marketShareRule-box'>
                            <MarketShareRuleForm ref={form => this.marketShareRule = form} productItem={productItem} selfRewardConfigDTO={selfRewardConfigDTO} merchantRewardConfigDTO={merchantRewardConfigDTO} awarChange={this.awarChange} textareaChangeThree={this.textareaChangeThree} activityRemark={activityRemark} activityImg={activityImg} getFile={this.getFile} description={description} />
                            <div className="shareBox">
                                <div className="shareBox-title">
                                    <p className="shareBox-p">活动分享链接</p>
                                </div>
                                <Row className='size'>
                                    <ActivityShareForm ref={form => { this.activityShareForm1 = form }} shareConfs={shareConfs1} srcUrl={srcUrl1} getFile={this.getFile} type={'activity'} required={true} titleLen={titleLen1} summaryLen={summaryLen1} textareaChange={this.textareaChange1}/>
                                </Row>
                            </div>
                            <div className="shareBox">
                                <div className="shareBox-title">
                                    <p className="shareBox-p">微站分享链接</p>
                                </div>
                                <Row className='size'>
                                    <ActivityShareForm ref={form => { this.activityShareForm2 = form }} shareConfs={shareConfs2} srcUrl={srcUrl2} getFile={this.getFile} type={'index'} required={true} titleLen={titleLen2} summaryLen={summaryLen2} textareaChange={this.textareaChange2}/>
                                </Row>
                            </div>
                            <Button className='button' type="primary" onClick={this.onSave}>保存设置</Button>
                            <Button className='button button-exit' onClick={() => this.onExit()} >取消</Button>
                        </div>
                    </div>
                </div>
            </Spin>
        )
    }
}
export default MarketShareRules;
