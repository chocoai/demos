import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import './style/activityAdd.less';
import ActivityService from '../../Services/ActivityService';
import CommonService from '../../Services/CommonService';
import BaseService from '../../Services/BaseService';

import ActivityBasic from '../../Component/Activity/JigsawBasic';
import ActivityWinner from '../../Component/Activity/JigsawGame';
import ActivityPrize from '../../Component/Activity/JigsawPrize';
import ActivityShare from '../../Component/Activity/ActivityShare';

import { Tabs, Form, Button, message, Modal } from 'antd';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const ActivityBasicForm = Form.create()(ActivityBasic)
const ActivityWinnerForm = Form.create()(ActivityWinner)
const ActivityPrizeForm = Form.create()(ActivityPrize)
const ActivityShareForm = Form.create()(ActivityShare)

const flatten = arr => {
    return arr.reduce((acc, value) => {
        const newFields = Object.assign({}, acc.fields, value.fields)
        const newErrs = Object.assign({}, acc.errs, value.errs)
        return Object.assign(acc, { fields: newFields }, { errs: newErrs })
    })
}
class ActivityAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultTab: 'basic',
            code: props.routeParams.code,
            activityData: '',
            shareConfs:null,
            activeStatus: '',//活动状态（1未发布2进行中3已结束4未开始）
            winForm: false,
            jxdjList: null,//奖项等级下拉
            fgfsList: null,//切割方式下拉
            brankLogoUrl: null,//银行logo图片
            brankQrcodeUrl: null,//银行二维码图片
            gameImgUrl: null,//游戏图片
            srcUrl: null,//分享图片
            tplType: Object.values(Config.tplType).join(','),
            ispublish: false,
            titleLen: 0,
            summaryLen: 0,
        }
    }
    componentWillMount() {
        this.initOSS()
    }
    componentDidMount() {
        this.getDictItems({ code: 'jxdj,fgfs' })
        let { code } = this.state
        if (code) {
            let params = {
                activityCode: code
            }
            this.getJigsawEdit(params);
            this.getShareConfs({ type: 2, activityCode: code });//类型：1,首页，2，拼图，3，分享有礼，4抽奖，5，摇一摇，6，砍利率
            this.getPictureInfo([Config.bizType.jigsawActivityConfLogo, Config.bizType.jigsawActivityConfQrcode,Config.bizType.shareJigsaw])
        } else {
            this.getCommId()
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
    // 获取全局唯一code
    async getCommId() {
        const res = await CommonService.getCommId();
        this.setState({
            code: res.data
        })
    }
    async getPictureInfo(arr) {  // 照片信息
        let code = this.state.code;
        let fileType = '/' + Object.values(Config.bizType).join(',')
        let res = await CommonService.getPictureInfo(code, fileType)
        if (res.code == Config.errorCode.success) {
            if (res.data && res.data[arr[0]] && res.data[arr[0]][0]) {
                this.setState({
                    brankLogoUrl: res.data[arr[0]][0].srcUrl,
                });
            }
            if (res.data && res.data[arr[1]] && res.data[arr[1]][0]) {
                this.setState({
                    brankQrcodeUrl: res.data[arr[1]][0].srcUrl,
                });
            }
            if (res.data && res.data[arr[2]] && res.data[arr[2]][0]) {
                this.setState({
                    srcUrl: res.data[arr[2]][0].srcUrl,
                });
            }
        }
    }
    // 获取字典值
    async getDictItems(params) {
        const res = await CommonService.getDictItems(params);
        this.setState({
            jxdjList: res.data.jxdj || [],
            fgfsList: res.data.fgfs || []
        })
    }
    // 获取编辑信息
    async getJigsawEdit(params) {
        let that = this;
        let res = await ActivityService.getJigsawEdit(params)
        if (res.code == Config.errorCode.success) {
            const data = res.data;
            if (data) {
                that.setState({
                    activityData: data,
                    activeStatus: data.operateJigsawActivity && data.operateJigsawActivity.activeStatus,
                    ispublish: data.operateJigsawActivity && data.operateJigsawActivity.public
                });
            }
        }
    }
    changeTabs = (key) => { // 切换选项卡
        this.setState({
            defaultTab: key
        })
    }
    /**
     * 上传表单
     * @param {url} 地址
     * @param {fields} 表单内容
     */
    putForm(url, fields, method) {
        return new Promise(resolve => {
            if (!fields) return resolve({});
            if (JSON.stringify(fields) == "{}") return resolve({});
            for (let key in fields) {
                if (typeof fields[key] == 'object') {
                    if (Array.isArray(fields[key])) {
                        fields[key] = fields[key].filter((items, index) => {
                            for (let item in items) {
                                if (Array.isArray(items[item])) {
                                    if (items[item][0] && items[item][1]) {
                                        items[item] = items[item][0].unix() * 1000 + ',' + items[item][1].unix() * 1000;
                                    } else {
                                        items[item] = ''
                                    }
                                }
                            }
                            if(Object.values(items).filter(i=>i).length>0){
                                return items
                            } 
                        })
                    }
                    console.log(fields[key])
                }
            }
            let params = Config.serializeObjectsTwo(fields)
            for (let key in params) {
                if (params[key] === undefined || params[key] === null || params[key] === '') {
                    // if (/\[/.test(key) && /]/.test(key)) {
                    //     delete params[key]
                    // } else {
                        params[key] = ''
                    // }
                }
                if (typeof params[key] == 'object') {
                    if (Array.isArray(params[key])) {
                        if (params[key].length == 0) {
                            delete params[key]
                        } else {
                            if (params[key][0] && params[key][1]) {
                                params[key] = params[key][0].unix() * 1000 + ',' + params[key][1].unix() * 1000;
                            } else {
                                delete params[key]
                            }
                        }
                    } else {
                        params[key] = params[key].unix() * 1000;
                    }
                }
            }
            if (method == 'post') {
                Config.post(url, params, (res) => {
                    if (res.code == Config.errorCode.success) {
                        resolve('成功');
                    } else {
                        message.error(res.msg);
                    }
                });
            } else {
                Config.put(url, params, (res) => {
                    if (res.code == Config.errorCode.success) {
                        resolve(res);
                    } else {
                        message.error(res.msg);
                        resolve('异常');
                    }
                });
            }
        })
    }
    async putFarmData(type, arr,arr2) {
        let that = this
        let pubParams = {
            activityCode: this.state.code,
        }
        let params = arr[0];
        params.code = this.state.code;
        params.operateJigsawActivity.activeType = 1;//拼图的类型为1
        // params.type = 1; // 默认为保存
        // if (type == 'publish') params.type = 2; // 保存并发布
        // let postArr=[this.putForm('/v1/op/jigsaw/conf', params)]
        if (arr2) {
            let shareParams = arr2;
            shareParams.type = 2;
            shareParams.publish = false;
            if (type == 'publish') shareParams.publish = true; // 保存并发布
            shareParams.activityCode = this.state.code;
            shareParams.bankCode = window.localStorage.getItem('ENTERP_CODE')
            let res = await that.putForm('/v1/active/share/config', shareParams)
            if (res.code == Config.errorCode.success) {
                if (type == 'publish') {
                    let res2 = await this.putForm('/v1/op/jigsaw/conf', params)
                    if (res2.code == Config.errorCode.success) {
                        let res3 = await ActivityService.putJigsawPublish(pubParams)
                        if (res3.code == Config.errorCode.success) {
                            message.success(type == 'publish' ? '发布成功' : '保存成功');
                            browserHistory.push('/market/activity/jigsaw')
                        }
                    }
                } else {
                    let res2 = await this.putForm('/v1/op/jigsaw/conf', params)
                    if (res2.code == Config.errorCode.success) {
                        message.success(type == 'publish' ? '发布成功' : '保存成功');
                        browserHistory.push('/market/activity/jigsaw')
                    }
                }

            }
        }else{
            if (type == 'publish') {
                let res2 = await this.putForm('/v1/op/jigsaw/conf', params)
                if (res2.code == Config.errorCode.success) {
                    let res3 = await ActivityService.putJigsawPublish(pubParams)
                    if (res3.code == Config.errorCode.success) {
                        message.success(type == 'publish' ? '发布成功' : '保存成功');
                        browserHistory.push('/market/activity/jigsaw')
                    }
                }
            } else {
                let res2 = await this.putForm('/v1/op/jigsaw/conf', params)
                if (res2.code == Config.errorCode.success) {
                    message.success(type == 'publish' ? '发布成功' : '保存成功');
                    browserHistory.push('/market/activity/jigsaw')
                }
            }
        }
        
        // Promise.all(postArr).then(result => {
        //     if (result[0].code == 0) {
        //         //此处用于以后添加返回结果的处理
        //         message.success(type == 'publish' ? '发布成功' : '保存成功');
        //         browserHistory.push('/market/activity/jigsaw')
        //     }
        // });
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
    saveEditAll = (type) => {
        Promise.all([
            this.getSubFormValue('activityBasicForm'),
            this.getSubFormValue('activityWinnerForm'),
            this.getSubFormValue('activityPrizeForm'),
            this.getSubFormValue('activityShareForm'),
        ]).then(result => {
            let arr = [];
            arr[0] = flatten([result[0]]);
            arr[1] = flatten([result[1]]);
            arr[2] = flatten([result[2]]);
            arr[3] = flatten([result[3]]);
            let newarr = [{
                operateJigsawActivity: arr[0].fields.operateJigsawActivity,
            }];
            if (arr[0].fields.operateJigsawActivity && arr[0].fields.operateJigsawActivity.brankLogoUrl && arr[0].fields.operateJigsawActivity.brankQrcodeUrl) {
                delete arr[0].fields.operateJigsawActivity.brankLogoUrl;
                delete arr[0].fields.operateJigsawActivity.brankQrcodeUrl;
            }
            if (arr[1].fields && arr[1].fields.operateJigsawConf) {
                arr[1].fields.operateJigsawConf.map((item) => {
                    delete item.gameImgUrl;
                    return item;
                })
                newarr[0].operateJigsawActivity = Object.assign(arr[0].fields.operateJigsawActivity, arr[1].fields.operateJigsawActivity);
                newarr[0].operateJigsawConf = arr[1].fields.operateJigsawConf
            }
            if (arr[2].fields && arr[2].fields.jigsawPrizes) {
                newarr[0].jigsawPrizes = arr[2].fields.jigsawPrizes
            }
            if (newarr[0].jigsawPrizes) {
                newarr[0].jigsawPrizes = newarr[0].jigsawPrizes.filter(item => item != '')
            }
            if (newarr[0].operateJigsawConf) {
                newarr[0].operateJigsawConf = newarr[0].operateJigsawConf.filter(item => item != '')
            }

            // console.log(newarr)
            this.putFarmData(type, newarr,arr[3].fields);
        });
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
        let { activityData } = this.state;
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
            if (type == 'brankLogo') {
                this.setState({
                    brankLogoUrl: reader.result
                });
            } else if (type == 'brankQrcode') {
                this.setState({
                    brankQrcodeUrl: reader.result
                });
            }else if (type == 'share') {
                this.setState({
                    srcUrl: reader.result
                });
            }
        };
        reader.readAsDataURL(files[0]);
    }
    upload = (file, type, codes) => {
        const that = this
        const { tplType } = that.state
        let { code } = this.state
        if (codes) {
            code = codes
        }
        let fileType
        if (type == 'brankLogo') {
            fileType = Config.bizType.jigsawActivityConfLogo
        } else if (type == 'brankQrcode') {
            fileType = Config.bizType.jigsawActivityConfQrcode
        } else if (type == 'gameImg') {
            fileType = Config.bizType.jigsawConfigGameImg
        } else if (type == 'share') {
            fileType = Config.bizType.shareJigsaw
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
        const { defaultTab, activityData, activeStatus, code, totalProb, jxdjList, fgfsList, brankLogoUrl, brankQrcodeUrl,shareConfs, srcUrl,ispublish,summaryLen,titleLen } = that.state;
        return (
            <div className='activityAdd-container'>
                <Breadcrumb className='breadcrumb'>
                    <Breadcrumb.Item className='breadcrumb-item'><Link to='/market/activity'>活动管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item className='breadcrumb-item'><Link to='/market/activity/jigsaw'>拼图活动</Link></Breadcrumb.Item>
                    {
                        this.props.routeParams.code ?
                            <Breadcrumb.Item className='breadcrumb-item'>编辑活动</Breadcrumb.Item> :
                            <Breadcrumb.Item className='breadcrumb-item'>新增活动</Breadcrumb.Item>
                    }
                </Breadcrumb>
                <Tabs className='activity-tabs' defaultActiveKey={defaultTab} activeKey={defaultTab} onChange={this.changeTabs} animated={false}>
                    <TabPane tab="基础设置" key="basic">
                        {code == this.props.routeParams.code ? activityData && activityData.operateJigsawActivity && <ActivityBasicForm name='operateJigsawActivity' ref={form => { this.activityBasicForm = form }} operateActivity={activityData.operateJigsawActivity} getFile={this.getFile} brankLogoUrl={brankLogoUrl} brankQrcodeUrl={brankQrcodeUrl} ispublish={ispublish}/> : <ActivityBasicForm name='operateJigsawActivity' ref={form => { this.activityBasicForm = form }} operateActivity={activityData && activityData.operateJigsawActivity} getFile={this.getFile} brankLogoUrl={brankLogoUrl} brankQrcodeUrl={brankQrcodeUrl} ispublish={ispublish}/>}
                    </TabPane>
                    <TabPane tab="游戏设置" key="game">
                        <ActivityWinnerForm ref={form => { this.activityWinnerForm = form }} operateJigsawConf={activityData && activityData.operateJigsawConf} totalProb={totalProb || 0} fgfsList={fgfsList} upload={this.upload} len={activityData && activityData.operateJigsawConf && activityData.operateJigsawConf.length > 0 ? activityData.operateJigsawConf.length : 1}ispublish={ispublish}/>
                    </TabPane>
                    <TabPane tab="奖项设置" key="winning">
                        <ActivityPrizeForm ref={form => { this.activityPrizeForm = form }} jigsawPrizes={activityData && activityData.jigsawPrizes} len={activityData && activityData.jigsawPrizes && activityData.jigsawPrizes.length > 0 ? activityData.jigsawPrizes.length : 1} jxdjList={jxdjList} range={activityData&&activityData.operateJigsawActivity&&activityData.operateJigsawActivity.public} ispublish={ispublish}/>
                    </TabPane>
                    <TabPane tab="分享设置" key="share">
                        <ActivityShareForm ref={form => { this.activityShareForm = form }} shareConfs={shareConfs} srcUrl={srcUrl} getFile={this.getFile} required={ispublish} titleLen={titleLen} summaryLen={summaryLen} textareaChange={this.textareaChange}/>
                    </TabPane>
                </Tabs>
                <div className="botton-list">
                    {
                        activeStatus == 2 || activeStatus == 4 ? null :
                            <Button className="activity-botton publish" type="primary" onClick={() => this.saveEditAll('publish')}>发布</Button>
                    }
                    <Button className="activity-botton save" type="primary" onClick={() => this.saveEditAll('save')}>保存</Button>
                </div>
            </div>
        )
    }
}

const pureActivityAdd = pureRender(ActivityAdd);

export default pureActivityAdd;