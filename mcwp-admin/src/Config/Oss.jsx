import {Config} from './Index'
import BaseService from '../Services/BaseService';
import { message } from 'antd';

// 初始化
export const initOSS = (that) =>  {
    // OSS
    const pScript = Config.appendScript(Config.baseText.pScript);
    pScript.onload = function() {
        const oScript = Config.appendScript(Config.baseText.oScript);
        oScript.onload = function() {
            let OSS = window.OSS;
            const wOSS = OSS.Wrapper,
            bucket = Config.ossKey.bucket,
            region = Config.ossKey.region;
            let ossClient = null;
            if(Config.localItem('OOS_CLIENT')) ossClient = JSON.parse(Config.localItem('OOS_CLIENT'));
            let currentTime = (new Date()).getTime();
            if(!ossClient || currentTime >= ossClient.expiration) {
                BaseService.getStsToken({}, (res) => {
                    if(res.code == Config.errorCode.success) {
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
// file上传文件、code上传code、bizType上传类型、that
export const upload = (file, code, bizType, that) => {
    // const that = this
    // let file = e.target.files[0];
    // const {code} = that.state
    let fileArray = file.name.split('.');
    let key = Config.localItem('ENTERP_CODE') + '/' + Config.bizType.loanPersonCredit + '/' + Config.localItem('LOGIN_USER_ID') + '/' + Config.getOssUUID() + (new Date()).getTime() + '.' + fileArray[fileArray.length - 1];
    let cbParams = {
        style: '',
        size: file.size,
        mimeType: file.type,
        // bizCode: routeParams.code,
        bizCode: code,
        enterpriseCode: Config.localItem('ENTERP_CODE'),
        bizType: bizType
    };
    // to do
    const fileListBizType = Object.values(Config.bizType).join(',');
    if (that.ossClient && that.ossClient.multipartUpload && typeof that.ossClient.multipartUpload == 'function') {
        uploadFile(cbParams, that.ossClient, key, file, fileListBizType, that);
    } else {
        initOSS(that)
        message.destroy()
        message.error('上传失败，请重试');
        that.setState({
            loading: false
        })
        if (that.input) that.input.value = ""
    }
}
// 上传
export const uploadFile = (cbParams, client, key, file, fileListBizType, that) => {
    // const that = this
    // dispatch(loading(true));
    client.multipartUpload(key, file, {}).then(function (res) {
        cbParams.bucket = res.bucket || Config.ossKey.bucket;
        cbParams.objKey = res.name || key;
        cbParams.etag = res.etag;
        uploadCallback(cbParams, fileListBizType, that); // 上传成功
    }).catch(error => {
        initOSS(that)
        message.destroy()
        message.error('上传失败，请重试');
        that.setState({
            loading: false
        })
        if (that.input) that.input.value = ""
    })
}
// 上传回调
export const uploadCallback = (params, fileListBizType, that) => {
    // const that = this
    BaseService.ossUploadCb(params, (res) => {
        // dispatch(loading(false));
        if(res.code == Config.errorCode.success) {
            message.destroy()
            message.success('上传成功');
            getFileList({bizCode: params.bizCode, bizType: fileListBizType, fileTypes: '*'}, that)
        } else {
            message.error(res.msg);
            that.setState({
                loading: false
            })
        }
    })
}
// 获取列表fileList
export const getFileList = (params, that) => {
    that.setState({
        loading: true
    })
    BaseService.getFileList(params, (res) => {
        // dispatch(loading(false));
        if(res.code == Config.errorCode.success) {
            // dispatch(fileListSuccess(res));
            // 合并个人的信息
            if( res.data['LOAN_PERSON'] ) {
                res.data['LOAN_PERSON'] = res.data['LOAN_PERSON'].filter(i => i.bizType != "LOAN_PERSON_IDENTITY_FRONT" && i.bizType != "LOAN_PERSON_IDENTITY_BACK" && i.bizType != "LOAN_PERSON_IDENTITY_FACE")
            }
            that.setState({
                fileList: res.data,
                imgList: [],
                deleteCodeList: [],
                loading: false
            })
        } else {
            message.error(res.msg);
        }
    });
}
// 删除
export const deleteFile = (code, bizType, deleteCode, that) => {
    // const {deleteCodeList, code, bizType, fileList} = that.state
    // const {type} = that.props
    // if (fileList && fileList[type] && !deleteCodeList.length) return message.error("请先选择要删除的文件");
    // if (!(fileList && fileList[type])) return message.error("请先上传");
    that.setState({
        loading: true
    })
    const fileListParams = {
        bizCode: code,
        bizType: bizType,
        fileTypes: '*'
    };
    // const params = {
    //     codes: deleteCode.join(",")
    // };
    // dispatch(loading(true));
    BaseService.delOssFile({codes: deleteCode}, (res) => {
        if(res.code == Config.errorCode.success) {
            message.success('删除成功');
            // dispatch(getFileList(fileListParams));
            getFileList(fileListParams, that)
        } else {
            message.error(res.msg);
        }
    });
}
