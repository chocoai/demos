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

import ActivityBasic from '../../Component/Activity/ActivityBasic';
import ActivityWinner from '../../Component/Activity/ActivityWinner';
import ActivityPrize from '../../Component/Activity/ActivityPrize';
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
/**
 * 活动新增或编辑
 * @Author: 
 * @Date:   2017-12-25
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-12-25
 */

class ActivityAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultTab: 'basic',
            code: props.routeParams.code,
            activityData: '',
            activeStatus: '',
            winForm: false,
            shareConfs: null,
            srcUrl: null,//分享图片
            titleLen: 0,
            summaryLen: 0,
        }
    }
    componentDidMount(params) {
        this.initOSS()
        let { code } = this.state
        if (code) {
            let params = {
                activityCode: code
            }
            this.getShareConfs({ type: 4, activityCode: code });//类型：1,首页，2，拼图，3，分享有礼，4抽奖，5，摇一摇，6，砍利率
            this.getActivityEdit(params)
            this.getPictureInfo([Config.bizType.shareLottery])
        } else {
            this.getCommId()
        }
    }
    async getPictureInfo(arr) {  // 照片信息
        let code = this.state.code;
        let fileType = '/' + Object.values(Config.bizType).join(',')
        let res = await CommonService.getPictureInfo(code, fileType)
        if (res.code == Config.errorCode.success) {
            if (res.data && res.data[arr[0]] && res.data[arr[0]][0]) {
                this.setState({
                    srcUrl: res.data[arr[0]][0].srcUrl,
                });
            }
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
    // 获取编辑信息r
    getActivityEdit = (params) => {
        let that = this
        ActivityService.getActivityEdit(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                if (data) {
                    that.setState({
                        activityData: data,
                        activeStatus: data.operateActivityInfo && data.operateActivityInfo.activeStatus
                    });
                }
            } else {
                message.error(res.msg);
            }
        })
    }
    changeTabs = (key) => { // 切换选项卡
        let that = this;
        if (key == 'winning') {
            that.setState({
                winForm: true
            })
        }
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
            let params = Config.serializeObjectsTwo(fields);
            for (let key in params) {
                if (params[key] === undefined || params[key] === null || params[key] === '') {
                    if (/\[/.test(key) && /]/.test(key)) {
                        delete params[key]
                    } else {
                        params[key] = ''
                    }
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
    getActivityFieldsValue = (type, activeStatus) => {
        Promise.all([
            this.getSubFormValue('activityBasicForm', '', activeStatus),
            this.getSubFormValue('activityWinnerForm', '', activeStatus),
            this.getSubFormValue('activityPrizeForm', '', activeStatus),
            this.getSubFormValue('activityShareForm', '', activeStatus),
        ]).then(result => {
            let arr = [];
            arr[0] = flatten([result[0], result[1], result[2]]);
            if (result[3].fields) {
                delete result[3].fields.srcUrl;
            }
            this.putFarmData(type, arr, result[3].fields, activeStatus);
        });
    }
    async putFarmData(type, arr, arr2, activeStatus) {
        let that = this
        let postArr = []
        let pubParams = {
            activityCode: this.state.code,
        }
        let params = arr[0].fields;
        params.code = this.state.code;
        if (arr2) {
            let shareParams = arr2;
            shareParams.type = 4;
            shareParams.publish = false;
            if (type == 'publish') shareParams.publish = true; // 保存并发布
            shareParams.activityCode = this.state.code;
            shareParams.bankCode = window.localStorage.getItem('ENTERP_CODE')
            let res = await that.putForm('/v1/active/share/config', shareParams)
            if (res.code == Config.errorCode.success) {
                if (type == 'publish') {
                    let res2 = await that.putForm('/v1/op/activity/save', params)
                    if (res2.code == Config.errorCode.success) {
                        let res3 = await ActivityService.publishActivitys(pubParams)
                        if (res3.code == Config.errorCode.success) {
                            message.success(type == 'publish' ? '发布成功' : '保存成功');
                            browserHistory.push('/market/activity')
                        }
                    }
                } else {
                    let res2 = await that.putForm('/v1/op/activity/save', params)
                    if (res2.code == Config.errorCode.success) {
                        message.success(type == 'publish' ? '发布成功' : '保存成功');
                        browserHistory.push('/market/activity')
                    }
                }

            }
        }else{
            if (type == 'publish') {
                let res2 = await that.putForm('/v1/op/activity/save', params)
                if (res2.code == Config.errorCode.success) {
                    let res3 = await ActivityService.publishActivitys(pubParams)
                    if (res3.code == Config.errorCode.success) {
                        message.success(type == 'publish' ? '发布成功' : '保存成功');
                        browserHistory.push('/market/activity')
                    }
                }
            } else {
                let res2 = await that.putForm('/v1/op/activity/save', params)
                if (res2.code == Config.errorCode.success) {
                    message.success(type == 'publish' ? '发布成功' : '保存成功');
                    browserHistory.push('/market/activity')
                }
            }
        }
       
        // if (activeStatus == 1 || !activeStatus) {
        //     params.type = 1; // 默认为保存
        //     if (type == 'publish') params.type = 2; // 保存并发布
        //     postArr.push(this.putForm('/v1/op/activity/save', params))
        //     Promise.all(postArr).then(result => {
        //         if (result[0].code == 0) {
        //             //此处用于以后添加返回结果的处理
        //             message.success(type == 'publish' ? '发布成功' : '保存成功');
        //             browserHistory.push('/market/activity')
        //         }
        //     });
        // } else {
        //     let { winForm } = that.state;
        //     if (!winForm) { // 未切换到中奖设置，即未修改任何内容，则直接跳转
        //         browserHistory.push('/market/activity');
        //     } else {
        //         postArr.push(this.putForm('/v1/op/activity/edit', params))
        //         Promise.all(postArr).then(result => {
        //             if (result[0].code == 0) {
        //                 message.success('保存成功');
        //                 browserHistory.push('/market/activity')
        //             }
        //         });
        //     }
        // }
    }
    getSubFormValue(formName, param, activeStatus) {
        return new Promise(resolve => {
            if (this[formName]) {
                this[formName].validateFields((errs, fields) => {
                    if (errs) {
                        message.error('存在不符合要求项，请及时修改')
                    } else {
                        resolve({ errs, fields })
                    }
                })
            } else {
                resolve({})
            }
        })
    }
    saveEditAll = (activeStatus) => {
        this.getActivityFieldsValue('save', activeStatus)
    }
    publishEditAll = () => {
        let that = this
        const { activeStatus } = that.state;
        confirm({
            title: '确认发布',
            content: '活动发布后部分设置将无法修改，是否发布？',
            onOk() {
                that.getActivityFieldsValue('publish', activeStatus)
            },
            onCancel() {
            },
        });
    }
    calculateTotalProb = () => {
        let that = this
        Promise.all([
            this.getSubFormValue('activityPrizeForm'),
        ]).then(result => {
            let arr = [];
            let totalProb = 0;
            arr = flatten([result[0]]).fields.prizeList;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] && arr[i].prizeChance) {
                    totalProb = totalProb + Number(arr[i].prizeChance)
                }
            }
            this.activityWinnerForm.setFieldsValue({
                [`operateDrawConf.prizeChanceCount`]: totalProb,
            });
            that.setState({
                totalProb: totalProb
            })
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
        if (type == 'share') {
            fileType = Config.bizType.shareLottery
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
        const { defaultTab, activityData, activeStatus, code, totalProb, shareConfs, srcUrl,summaryLen,titleLen } = that.state;
        return (
            <div className='activityAdd-container'>
                <Breadcrumb className='breadcrumb'>
                    <Breadcrumb.Item className='breadcrumb-item'><Link to="/market/activity">活动管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item className='breadcrumb-item'><Link to="/market/activity">抽奖活动</Link></Breadcrumb.Item>
                    {
                        code ?
                            <Breadcrumb.Item className='breadcrumb-item'>编辑活动</Breadcrumb.Item> :
                            <Breadcrumb.Item className='breadcrumb-item'>新增活动</Breadcrumb.Item>
                    }
                </Breadcrumb>
                <Tabs className='activity-tabs' defaultActiveKey={defaultTab} activeKey={defaultTab} onChange={this.changeTabs} animated={false}>
                    <TabPane tab="基础设置" key="basic">
                        <ActivityBasicForm ref={form => { this.activityBasicForm = form }} operateActivityInfo={activityData && activityData.operateActivityInfo} activeStatus={activeStatus || 1} />
                    </TabPane>
                    <TabPane tab="中奖设置" key="winning">
                        <ActivityWinnerForm ref={form => { this.activityWinnerForm = form }} operateDrawConf={activityData && activityData.operateDrawConf} activeStatus={activeStatus || 1} totalProb={totalProb || 0} />
                        <ActivityPrizeForm ref={form => { this.activityPrizeForm = form }} prizeList={activityData && activityData.prizeList} len={activityData && activityData.prizeList && activityData.prizeList.length > 0 ? activityData.prizeList.length : 1} activeStatus={activeStatus || 1} calculateTotalProb={this.calculateTotalProb} />
                    </TabPane>
                    <TabPane tab="分享设置" key="share">
                        <ActivityShareForm ref={form => { this.activityShareForm = form }} shareConfs={shareConfs} srcUrl={srcUrl} getFile={this.getFile} titleLen={titleLen} summaryLen={summaryLen} textareaChange={this.textareaChange}/>
                    </TabPane>
                </Tabs>

                <div className="botton-list">
                    {
                        activeStatus != 2 && activeStatus != 3 && activeStatus != 4 ?
                            <Button className="activity-botton publish" type="primary" onClick={this.publishEditAll}>发布</Button> : null
                    }
                    {
                        activeStatus != 3 ? <Button className="activity-botton save" type="primary" onClick={() => this.saveEditAll(activeStatus)}>保存</Button> : null
                    }
                </div>
            </div>
        )
    }
}

const pureActivityAdd = pureRender(ActivityAdd);

export default pureActivityAdd;