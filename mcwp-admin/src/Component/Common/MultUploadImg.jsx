import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import pureRender from 'pure-render-decorator';
import { Form, Row, Col, message } from 'antd';
import addImg from '../../Assets/Images/icon_add--pictures.png';
import iconColse from '../../Assets/Images/icon_close.png';
import BaseService from '../../Services/BaseService';
import CommonService from '../../Services/CommonService';
import './style/multUploadImg.less';
const FormItem = Form.Item;
class UploadImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: props.code,
            type: props.type,
            fileId: []			// 文件列表
            // activityImg: ''
        }
    }
    componentWillMount() {
        let { type } = this.state;
        this.initOSS();
        this.getPictureInfo(type)
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
    async getPictureInfo(type) {  // 照片信息
        let { code } = this.state;
        let fileType = '/' + Object.values(Config.bizType).join(',')
        let res = await CommonService.getPictureInfo(code, fileType)
        if (res.code == Config.errorCode.success) {
            if (res.data && res.data[type]) {
                this.setState({
                    fileId: res.data[type]
                })
            }else{
                this.setState({
                    fileId: []
                }) 
            }
        }
    }
    getFile = (e) => {
        const that = this
        const {fileId} = this.state;
        const {type,code} = this.props;
        if (fileId.length == 5) {
			e.target.value = ''
			return message.error('图片最多上传5张')
        }
        for (let file of e.target.files) {
            if (file.type == 'image/jpeg' || file.type == 'image/png') {
                that.upload(file, type, code)
            } else {
                message.error('上传文件格式不对')
                return
            }
        }
        e.target.value = ''
        this.props.loadingShow();
    }
    upload = (file, type, code) => {
        const that = this
        const { tplType } = that.state
        // let code = this.state.code;
        let fileType = type;
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
        const {type}=this.props
        BaseService.ossUploadCb(params, (res) => {
            if (res.code == Config.errorCode.success) {
                message.destroy()
                message.success('上传成功');
               this.props.loadingHide();
                this.getPictureInfo(type)
            } else {
                message.error(res.msg);
            }
        })
    }
    deleteImg=(code)=>{	
        let that=this;					//点击删除图片=>调用此方法;
        const {type}=this.props;
        let params={
            codes:code
        }
        BaseService.delOssFile(params, (res) => {
            if(res.code == Config.errorCode.success) {
                message.success('删除成功');
                that.getPictureInfo(type)
            } else {
                message.error(res.msg);
            }
        });
	}
    render() {
        const { fileId } = this.state;
        return (
            <Row className="img-info mult">
                <Col span={4} className="img">
                    <input type="file" className="file" onChange={this.getFile.bind(this)} ref="img" />
                    <div className="addImg"><img className='addImgPic' src={addImg} alt="addImgPic" /> </div>
                </Col>
                {
                    fileId.length && fileId.map((item, index) => (
                        <Col key={index} span={4} className="img preview">
                            <img className='iconColse' src={iconColse} onClick={() => this.deleteImg(item.code)} alt="iconColse" />
                            <img className='previewImg' src={item.srcUrl} alt="previewImg" />
                        </Col>
                    ))
                }
            </Row>
        )
    }
}
const pureUploadImg = pureRender(UploadImg)
export default pureUploadImg;