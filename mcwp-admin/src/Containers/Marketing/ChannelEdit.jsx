import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import { Spin, Button, Form, Row, Col, Input, message } from 'antd';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import UploadImg from '../../Component/Ipieces/UploadImg';
import CarouselImg from '../../Component/Ipieces/CarouselImg';
import MarChannelService from '../../Services/MarChannelService'; // services层 营销管理 —— 渠道管理
import './style/channelEdit.less';
import { browserHistory } from 'react-router';
const FormItem = Form.Item;
class ChannelDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            code: props.routeParams.code,
            pictureInfo: '',
            preview: false,
            channelDetail: null,
            uploadImg: {
                visible: false,
                type: null
            },
        }
    }
    componentDidMount() {
        this.getChannelDetail({ merchantCode: this.state.code })
    }
    // 获取详情
    async getChannelDetail(params) {
        let res = await MarChannelService.getChannelDetail(params);
        this.setState({
            channelDetail: res.data || {},
        });
    }
    // 保存
    saveChannel = () => {
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            let params = values;
            params.code=this.state.code;
            console.log(params)
            if (!err) {
                this.putChannelInfo(params)
            }
        })
    }
    async putChannelInfo(params) {
        let res = await MarChannelService.putChannelInfo(params);
        if (res.code == Config.errorCode.success) {
            message.success('修改成功！');
            browserHistory.push('/marketing/channel');
        }
    }
    previewHide = () => {
        this.setState({
            preview: false,
            pictureInfo: ''
        })
    }

    openUploadImg = (type) => {
        this.setState({
            uploadImg: Object.assign(this.state.uploadImg, { visible: true, type })
        })
    }
    closeUploadImg = (e) => {
        this.setState({
            uploadImg: Object.assign(this.state.uploadImg, { visible: false })
        })
    }
    getPictureInfo = (type) => {  // 照片信息
        let code = this.state.code;
        let fileType = '/' + Object.values(Config.bizType).join(',')
        Config.get('/v1/oss/' + code + fileType + '/*', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                if (!(res.data[type] && res.data[type].length)) return message.error(Config.warnInfo.uploadImg);
                this.setState({
                    pictureInfo: res.data[type],
                    preview: true
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    onExit() {
        browserHistory.push('/marketing/channel');
    }
    render() {
        const { loading, pictureInfo, uploadImg, code, channelDetail } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formMinItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 15 }
        };
        const bcrumb = [{
            'link': '/marketing/channel',
            'value': '渠道管理'
        }, {
            'link': null,
            'value': '编辑',
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="channel-edit-container">
                    <BcrumbItem bcrumb={bcrumb} />
                    <div className="channel-content">
                        <div className='channel-subtitle-container'>
                            <p className='channel-subtitle' id='spouse'>渠道信息</p>
                            <div>
                                <span className='channel-subtitle-attachment' onClick={() => this.openUploadImg(Config.bizType.merchantInfoFileOth)}>添加文件</span>
                                <span className='channel-subtitle-attachment' onClick={() => this.getPictureInfo(Config.bizType.merchantInfoFile)}>查看文件</span>
                            </div>
                        </div>
                        <Row className='channel-edit-row'>
                            <Col span={12} className='channel-edit-col'>
                                <span>类别：{channelDetail&&channelDetail.channelTypeText}</span>
                            </Col>
                            <Col span={12} className='channel-edit-col'>
                                <span>渠道：{channelDetail&&channelDetail.channelName}</span>
                            </Col>
                            <Col span={12}>
                                <FormItem label="店铺名称" {...formMinItemLayout}>
                                    {getFieldDecorator('merchantName', {
                                        initialValue: channelDetail && channelDetail.merchantName,
                                        rules: [{ required: true, message:'请输入'},{message: Validate.warnInfo.wordLen30, validator: Validate.checkWordLen30 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="负责人" {...formMinItemLayout}>
                                    {getFieldDecorator('merchantPerson', {
                                        initialValue: channelDetail && channelDetail.merchantPerson,
                                        rules: [{ required: true, message:'请输入'},{message: Validate.warnInfo.wordLen2to15, validator: Validate.checkWordLen2to15 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="联系方式" {...formMinItemLayout}>
                                    {getFieldDecorator('merchantPhone', {
                                        initialValue: channelDetail && channelDetail.merchantPhone,
                                        rules: [{ required: true, message:'请输入'},{ message: Validate.warnInfo.phoneNum, validator: Validate.checkPhoneAndMobile }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="店铺地址" {...formMinItemLayout}>
                                    {getFieldDecorator('merchantAddress', {
                                        initialValue: channelDetail && channelDetail.merchantAddress,
                                        rules: [{ required: true, message:'请输入'},{message: Validate.warnInfo.wordLen2to60, validator: Validate.checkWordLen2to60 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="推荐人" {...formMinItemLayout}>
                                    {getFieldDecorator('merchantReferee', {
                                        initialValue: channelDetail && channelDetail.merchantReferee,
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen2to15, validator: Validate.checkWordLen2to15 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>

                        </Row>
                        <div className='btn-warp'><Button className="rule-button" type="primary" onClick={this.saveChannel}>保存</Button>
                            <Button className="rule-button" onClick={() => this.onExit()}>取消</Button>
                        </div>
                        {uploadImg.visible && <UploadImg code={code} type={uploadImg.type} visible={uploadImg.visible} openUploadImg={this.openUploadImg} closeUploadImg={this.closeUploadImg} />}
                        <CarouselImg pictureInfo={pictureInfo} previewPic={this.state.preview} previewHide={this.previewHide} />
                    </div>
                </div>
            </Spin>
        )
    }
}
const ChannelDetailForm = Form.create()(ChannelDetail);
export default ChannelDetailForm;
