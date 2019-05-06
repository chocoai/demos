import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Modal, message, Spin } from 'antd';
import { Config } from '../../Config/Index';
import BaseService from '../../Services/BaseService';

import './style/uploadImg.less';
// import addImg from '../../Assets/Images/icon_add--pictures.png'
import choseImg from '../../Assets/Images/upload__choose.png'
import fileImg from '../../Assets/Images/icon_enclosure.png'
import nullImg from '../../Assets/Images/nodata-bg.png'

/**
 * 进件图片上传
 */
class UploadImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: props.code,
            loading: true,
            fileList: null,
            imgList: [],         // 选中图标
            deleteCodeList: [],
            bizType: Object.values(Config.bizType).join(',')
        };
    }
    componentWillMount () {
        const {code, bizType} = this.state
        this.initOSS()
        this.getFileList({bizCode: code, bizType: bizType, fileTypes: '*'})
    }
    initOSS () {
        // OSS
        const that = this
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
    getFile = (e) => {
        const that = this
        this.setState({
            loading: true
        })
        for (let file of e.target.files) {
            that.upload(file)
        }
        this.input.value = ''
    }
    upload = (file) => {
        const that = this
        // let file = e.target.files[0];
        const {code, bizType} = that.state
        let {type} = that.props
        // if (!type.includes('BORROW')) {
        //     type = `${type}_OTH`
        // }
        // todo 进件文件上传处理
        if (bizType.includes( `${type}_OTH`)) type = `${type}_OTH`;
        let fileArray = file.name.split('.');
        let key = Config.localItem('ENTERP_CODE') + '/' + Config.bizType.loanPersonCredit + '/' + Config.localItem('LOGIN_USER_ID') + '/' + Config.getOssUUID() + (new Date()).getTime() + '.' + fileArray[fileArray.length - 1];
        let cbParams = {
            style: '',
            size: file.size,
            mimeType: file.type,
            // bizCode: routeParams.code,
            bizCode: code,
            enterpriseCode: Config.localItem('ENTERP_CODE'),
            bizType: type
        };
        // to do
        const fileListBizType = bizType;
        if (that.ossClient && that.ossClient.multipartUpload && typeof that.ossClient.multipartUpload == 'function') {
            that.uploadFile(cbParams, that.ossClient, key, file, fileListBizType);
        } else {
            that.initOSS()
            message.destroy()
            message.error('上传失败，请重试');
            that.setState({
                loading: false
            })
        }
    }

    uploadFile = (cbParams, client, key, file, fileListBizType) => {
        const that = this
        // dispatch(loading(true));
        client.multipartUpload(key, file, {}).then(function (res) {
            cbParams.bucket = res.bucket || Config.ossKey.bucket;
            cbParams.objKey = res.name || key;
            cbParams.etag = res.etag;
            that.uploadCallback(cbParams, fileListBizType); // 上传成功
        }).catch(error => {
            that.initOSS()
            message.destroy()
            message.error('上传失败，请重试');
            that.setState({
                loading: false
            })
        })
    }
    uploadCallback = (params, fileListBizType) => {
        const that = this
        BaseService.ossUploadCb(params, (res) => {
            // dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                message.destroy()
                message.success('上传成功');
                that.getFileList({bizCode: params.bizCode, bizType: fileListBizType, fileTypes: '*'})
            } else {
                message.error(res.msg);
                that.setState({
                    loading: false
                })
            }
        })
    }
    getFileList = (params) => {
        this.setState({
            loading: true
        })
        BaseService.getFileList(params, (res) => {
            // dispatch(loading(false));
            if(res.code == Config.errorCode.success) {
                // dispatch(fileListSuccess(res));
                if( res.data['LOAN_PERSON'] ) {
                    res.data['LOAN_PERSON'] = res.data['LOAN_PERSON'].filter(i => i.bizType != "LOAN_PERSON_IDENTITY_FRONT" && i.bizType != "LOAN_PERSON_IDENTITY_BACK" && i.bizType != "LOAN_PERSON_IDENTITY_FACE")
                }
                this.setState({
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
    deleteFile = () => {
        const that = this
        const {deleteCodeList, code, bizType, fileList} = that.state
        const {type} = that.props
        if (fileList && fileList[type] && !deleteCodeList.length) return message.error("请先选择要删除的文件");
        if (!(fileList && fileList[type])) return message.error("请先上传");
        that.setState({
            loading: true
        })
        const fileListParams = {
            bizCode: code,
            bizType: bizType,
            fileTypes: '*'
        };
        const params = {
            codes: deleteCodeList.join(",")
        };
        // dispatch(loading(true));
        BaseService.delOssFile(params, (res) => {
            if(res.code == Config.errorCode.success) {
                message.success('删除成功');
                // dispatch(getFileList(fileListParams));
                that.getFileList(fileListParams)
            } else {
                message.error(res.msg);
            }
        });
    }
    changeChose = (index, code) => {
        const that = this
        const {fileList} = that.state
        const {type} = that.props
        let temArr = that.state.imgList;
        // 显示
        if (temArr[index]) {
            temArr[index] = false
            that.setState({
                imgList: [...temArr],
                deleteCodeList: that.state.deleteCodeList.filter(i => i != code)
            })
        } else {
            let deleteCodeList = []
            if (type == 'BORROW' && fileList[type][index].bizType == 'BORROW_PIC' ) {
                temArr[index] = false
                deleteCodeList = that.state.deleteCodeList
            } else {
                temArr[index] = true
                deleteCodeList = [...that.state.deleteCodeList, code]
            }
            that.setState({
                imgList: [...temArr],
                deleteCodeList: deleteCodeList
            })
        }
    }
    choseAll = () => {
        const {fileList} = this.state
        const {type} = this.props
        if (!fileList[type]) return message.error("请先上传")
        let imgList = Array.from(fileList[type], _ => true)
        let deleteCodeList = []
        if (type == 'BORROW') {
            for (let index = 0; index < fileList[type].length; index++) {
                const element = fileList[type][index].bizType;
                if (element == 'BORROW_PIC') {
                    imgList[index] = false
                } else {
                    deleteCodeList.push(fileList[type][index].code)
                }
            }
        } else {
            deleteCodeList = Array.from(fileList[type], i => i.code)
        }
        this.setState({
            imgList: imgList,
            deleteCodeList: deleteCodeList
        })
    }
    onCancel = () => {
        const {closeUploadImg,cancelUploadImg} = this.props
        this.setState({
            imgList: [],
            deleteCodeList: []
        })
        if(cancelUploadImg){
            cancelUploadImg()
        }else{
            closeUploadImg()
        }
    }
    render () {
        const that = this
        const {fileList, imgList, loading} = that.state
        const {closeUploadImg, visible, type,modalTitle} = that.props;
        return (
            <Modal
                title={modalTitle||"文件操作"}
                visible={visible}
                onOk={closeUploadImg}
                onCancel={that.onCancel}
                wrapClassName = "ipieces-uploadImg-container"
                width = {680}
                destroyOnClose
            >
                <Spin spinning={loading}>
                    <div className="top">
                        <div className="chose-wrapper">
                            <p className="chose-tips">点击添加照片或附件</p>
                            <input type="file" className="file-chose" multiple onChange={this.getFile} ref={input => {this.input = input}} />
                        </div>
                        <p>
                            <span className="choseAll" onClick = {this.choseAll}>全选</span>
                            <span className="delete" onClick = {this.deleteFile}>删除</span>
                        </p>
                    </div>
                    <div className="img-wrapper">
                        {
                            fileList && fileList[type] && fileList[type].length ?
                             fileList[type].sort((a1, a2) => a1.fileId - a2.fileId).map((item, index) => (
                                item.bizType != 'LOAN_PERSON_CREDIT' &&
                                <div className="img-list-wrapper" key={index} style={{background: imgList[index]? '#e5e5e5' : '#fff'}}>
                                  {
                                      item.picFlag?
                                      <img className="img-list" src={item.srcUrl} alt="show" onClick = {() => this.changeChose(index, item.code)} />
                                      : <img className="file-list" src={fileImg} alt="show" onClick = {() => this.changeChose(index, item.code)} />
                                  }
                                  {
                                      imgList[index] ?
                                      <img className="img-chose" src={choseImg} alt="chose" />
                                      : null
                                  }
                                  <p className="img-title">{ item.fileName.length > 8? `${item.fileName.slice(0, 8)}...` : item.fileName}</p>
                                </div>
                            ))
                            :
                            <div className="null-img-wrapper">
                                <img className="null-img" src={nullImg} alt='null' />
                            </div>
                        }
                        {/* <div className="add-wrapper">
                            <img className="add-img" src={addImg} alt="add" />
                            <input type="file" className="file-input" multiple onChange={this.getFile} ref={input => {this.input = input}} />
                        </div> */}
                    </div>
                </Spin>
            </Modal>
        )
    }
}

const pureUploadImg = pureRender(UploadImg);

export default pureUploadImg;
