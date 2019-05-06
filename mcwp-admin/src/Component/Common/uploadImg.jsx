import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import pureRender from 'pure-render-decorator';
import { Form, Row, Col, message } from 'antd';
import imgPicture from '../../Assets/Images/img_picture.png';
import BaseService from '../../Services/BaseService';
import CommonService from '../../Services/CommonService';
import './style/uploadImg.less';
const FormItem = Form.Item;
class UploadImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: props.code,
            type:props.type,
            // activityImg: ''
        }
    }
    componentWillMount() {
        let {type}=this.state;
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
        let {code}=this.state;
        let fileType = '/' + Object.values(Config.bizType).join(',')
        let res = await CommonService.getPictureInfo(code, fileType)
        if (res.code == Config.errorCode.success) {
            if (res.data && res.data[type] && res.data[type][0]) {
                this.setState({
                    activityImg: res.data[type][0].srcUrl
                })
            }
        }
    }
    getFile = (e, type,code) => {
        const that = this
        for (let file of e.target.files) {
            if (file.type == 'image/jpeg' || file.type == 'image/png') {
                that.upload(file, type,code)
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
            this.setState({
                activityImg: reader.result
            });

        };
        reader.readAsDataURL(files[0]);
    }
    upload = (file, type,code) => {
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
        BaseService.ossUploadCb(params, (res) => {
            if (res.code == Config.errorCode.success) {
                message.destroy()
                message.success('上传成功');
            } else {
                message.error(res.msg);
            }
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 }
        };
        const {activityImg}=this.state;
        const { label, name, rules, size, getFieldDecorator,type,code } = this.props
        return (
            <FormItem label={label} {...formItemLayout}>
                {getFieldDecorator(name, {
                    initialValue: activityImg,
                    rules: rules,
                })(
                    <Row className="modal-row">
                        <Col span={8} className="upload-container">
                            {
                                activityImg ? <img className="idcard-img" src={activityImg} alt="page" /> :
                                    <img className="idcard-img" src={imgPicture} alt="page" />
                            }
                        </Col>
                        <Col span={12} className="row-tip">
                            <p>建议图片为png,jpg,jpeg格式</p>
                            <p>大小为{size}</p>
                            <input className="idcard-file" type="file" multiple onChange={(e) => this.getFile(e, type,code)} />
                            <p className="action-btn">上传图片</p>
                        </Col>
                    </Row>
                )}
            </FormItem>
        )
    }
}
const pureUploadImg = pureRender(UploadImg)
export default pureUploadImg;