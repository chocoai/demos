import React, { Component } from 'react';
import { Modal, Button, Input, message, Row, Col, Select, Radio  } from 'antd';
import BaseService from '../../Services/BaseService';
import MarketService from '../../Services/MarketService';
import { Config } from '../../Config/Index';
import './style/modTemModal.less';
import imgPicture from '../../Assets/Images/img_picture.png';
const Option = Select.Option
const RadioGroup = Radio.Group
/**
 * Modal对话框(修改产品模版)
 *
 * @export
 * @class ModTemModal
 * @extends {Component}
 */
class ModTemModal extends Component {
	constructor(props) {
		super(props); //后才能用this获取实例化对象
		this.state = {
            imageUrl: '',
            pageUrl: '',
            pageLink: '',
            jumpType: '',
            jumpPrdCode: undefined,
            jumpPage: undefined,
            tplType: Object.values(Config.tplType).join(',')
		};
    }
    componentWillMount () {
        this.initOSS()
    }
    componentDidMount () {
        // 获取已上传图片
        this.getEditTpl ()
    }
    async getEditTpl () {
        let {commCode, defaultTab} = this.props
        if (!commCode) return;
        let res = await MarketService.getProdTpl({tplCode: commCode});
        let data = res.data
        if (defaultTab == 'cpmb') {
            this.setState({
                imageUrl: data && data.coverUrl || '',
                pageUrl: data && data.pageUrl || ''
            })
        } else {
            this.setState({
                pageUrl:  data && data.pageUrl || '',
                jumpType: data && +data.jumpType || '',
                pageLink: data && data.jumpUrl || '',
                jumpPrdCode: data && data.jumpPrdCode || undefined,
                jumpPage: data && data.jumpPage || undefined
            })
        }
    }
    setModalVisible (){
        this.props.closeModal()
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
    getFile = (e,type) => {
        const that = this
        this.setState({
            loading: true
        })
        for (let file of e.target.files) {
            if(file.type == 'image/jpeg' || file.type == 'image/png') {
                that.upload(file,type)
            } else {
                message.error('上传文件格式不对')
                return
            }
        }
        // this.input.value = ''
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if(type == 'cover') {
                this.setState({
                    imageUrl: reader.result
                });
            } else {
                this.setState({
                    pageUrl: reader.result
                });
            }
        };
        reader.readAsDataURL(files[0]);
    }
    upload = (file,type) => {
        const that = this
        const {tplType} = that.state
        let {commCode, defaultTab} = this.props
        let fileType
        if (type == 'cover') {
            fileType = 'TPL_PRODUCT_COVER'
        } else {
            if( defaultTab == 'cpmb') {
                fileType = 'TPL_PRODUCT_PAGE'
            } else {
                fileType = 'TPL_MARKET'
            }
        }
        let fileArray = file.name.split('.');
        let key = Config.localItem('ENTERP_CODE') + '/' + fileType + '/' + Config.localItem('LOGIN_USER_ID') + '/' + Config.getOssUUID() + (new Date()).getTime() + '.' + fileArray[fileArray.length - 1];
        let cbParams = {
            style: '',
            size: file.size,
            mimeType: file.type,
            bizCode: commCode,
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
            } else {
                message.error(res.msg);
                that.setState({
                    loading: false
                })
            }
        })
    }
    changeUrl (e) {
        this.setState({
            pageLink: e.target.value,
        });
    }
    changeJump = (e) => {
        this.setState({
            jumpType: e.target.value,
        });
    }
    changeProd (e) {
        this.setState({
            jumpPrdCode: e,
        });
    }
    changePage (e) {
        this.setState({
            jumpPage: e,
        });
    }
    addProdTpl () {
        let { imageUrl, pageUrl, pageLink, jumpType, jumpPrdCode, jumpPage,  } = this.state
        let { commCode, defaultTab, onOff } = this.props
        let type, params
        if(onOff) return false
        if(defaultTab =='cpmb') {
            if ( !imageUrl) {
                message.error('请上传产品封面')
                return
            }
            if ( !pageUrl) {
                message.error('请上传页面图片')
                return
            }
            type = 1
            params = {
                code: commCode,
                type: type
            }
        }else {
            if ( !pageUrl) {
                message.error('请上传页面图片')
                return
            }
            if ( !pageLink) {
                message.error('请上传页面链接')
                return
            }
            if ( !jumpType) {
                message.error('请选择跳转链接')
                return
            }
            if (jumpType == 2 && !jumpPrdCode) {
                message.error('请选择产品')
                return
            }
            if (jumpType == 2 && !jumpPage) {
                message.error('请选择产品说明')
                return
            }
            type = 2
            params = {
                code: commCode,
                type: type,
                jumpUrl: pageLink,
                jumpType: jumpType,
                jumpPrdCode: jumpPrdCode || '',
                jumpPage: jumpPage || ''
            }
        }
        this.props.closeOnOff()
        this.props.addProdTpl(params)
    }
	render() {
        let { mVisible, defaultTab, prodList, editMode } = this.props;
        let { imageUrl, pageUrl, jumpType, jumpPage, jumpPrdCode, pageLink } = this.state;
		return (
			<Modal
	          title={editMode? "编辑模版" : "新增模板"}
	          visible={mVisible}
	          footer={null}
	          onCancel={()=>this.setModalVisible()}
			  width = {560}
	          wrapClassName="modTem-modal"
	        >
                {
                    defaultTab == 'cpmb' && <Row className="modal-row">
                        <Col span={4} className="row-title">产品封面</Col>
                        <Col span={8} className="upload-container">
                            {
                                imageUrl ?
                                <img className="idcard-img" src={imageUrl} alt="cover"/> :
                                <img className="idcard-img" src={imgPicture} alt="cover"/>
                            }
                        </Col>
                        <Col span={12} className="row-tip">
                            <p>建议图片格式为png,jpg格式</p>
                            <p>大小为984*656</p>
                            <input className="idcard-file" type="file" onChange={(e)=>this.getFile(e,'cover')} multiple/>
                            <p className="action-btn">上传图片</p>
                        </Col>
                    </Row>
                }
                <Row className="modal-row row-second">
                    <Col span={4} className="row-title">页面图片</Col>
                    <Col span={8} className="upload-container">
                    {
                        pageUrl ?
                        <img className="idcard-img" src={pageUrl} alt="page"/> :
                        <img className="idcard-img" src={imgPicture} alt="page"/>
                    }
                    </Col>
                    <Col span={12} className="row-tip">
                        <p>建议图片格式为png,jpg格式</p>
                        <p>大小为1080*1920</p>
                        <input className="idcard-file" type="file" onChange={(e)=>this.getFile(e,'page')} multiple/>
                        <p className="action-btn">上传图片</p>
                    </Col>
                </Row>
                {
                    defaultTab == 'yxtgy' && <Row className="modal-row">
                        <Col span={4} className="row-title">页面链接</Col>
                        <Col span={20}>
                            <Input placeholder="请输入" type="text" onChange={(e)=>this.changeUrl(e)} value={pageLink} />
                        </Col>
                    </Row>
                }
                {
                    defaultTab == 'yxtgy' && <Row className="modal-row">
                        <Col span={4} className="row-title">跳转至</Col>
                        <Col span={20}>
                        <RadioGroup onChange={this.changeJump} value={jumpType}>
                            <Radio value={1}>估值工具</Radio>
                            <Radio value={2}>贷款产品</Radio>
                        </RadioGroup>
                        </Col>
                    </Row>
                }
                {
                    defaultTab == 'yxtgy' && jumpType == 2  && <Row className="modal-row">
                        <Col span={4} className="row-title">贷款产品</Col>
                        <Col span={20}>
                        <Select style={{ width: 150 }} placeholder="请选择" onChange={(e)=>this.changeProd(e)} value={jumpPrdCode}>
                            {
                                prodList && prodList.length >0 && prodList.map((item,index)=>(
                                    <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                ))
                            }
                        </Select>
                        <Select className="modTem-select" placeholder="请选择" style={{ width: 150 }} onChange={(e)=>this.changePage(e)} value={jumpPage}>
                            <Option value="1">产品说明</Option>
                            <Option value="2">申请入口</Option>
                        </Select>
                        </Col>
                    </Row>
                }
                <Row className="row-butList">
                    <Button type="primary" onClick={()=>this.addProdTpl()}>保存</Button>
                    <Button type="primary" onClick={()=>this.setModalVisible()} className="cancle-btn">取消</Button>
                </Row>
	        </Modal>
		)
	}
}

export default ModTemModal;
