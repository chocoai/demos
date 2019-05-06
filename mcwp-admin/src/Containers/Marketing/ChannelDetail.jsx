import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Spin, message, Button, Row, Col, Modal } from 'antd';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import CarouselImg from '../../Component/Ipieces/CarouselImg';
import MarChannelService from '../../Services/MarChannelService'; // services层 营销管理 —— 渠道管理
import './style/channelDetail.less';
import { browserHistory } from 'react-router';

class ChannelDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pictureInfo: '',
            preview: false,
            channelDetail: null,
            code: props.routeParams.code,
            type: props.location.query.type ? props.location.query.type : 0,
        }
    }
    componentDidMount() {
        this.getChannelDetail({ merchantCode: this.state.code })
    }
    async getChannelDetail(params) {
        let res = await MarChannelService.getChannelDetail(params);
        this.setState({
            channelDetail: res.data || {},
        });
    }
    // 审核通过/拒绝
     putChannelCheck(status) {
        let confirm = Modal.confirm;
        let con = status == 2 ? '确认审核通过吗？' : '确认审核拒绝吗？';
        let { code } = this.state;
        let params = {
            merchantCode: code,
            status: status
        }
        confirm({
            title: '提示',
            content: con,
            okText: '确定',
            cancelText: '取消',
            async onOk() {
                let res = await MarChannelService.putChannelCheck(params);
                if (res.code == Config.errorCode.success) {
                    message.success("操作成功！");
                    browserHistory.push('/marketing/channel');
                } else {
                    message.error(res.msg)
                }
            }
        });


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
    previewHide = () => {
        this.setState({
            preview: false,
            pictureInfo: ''
        })
    }
    render() {
        const { loading, channelDetail, type, pictureInfo } = this.state;
        const bcrumb = [{
            'link': '/marketing/channel',
            'value': '渠道管理'
        }, {
            'link': null,
            'value': '查看',
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="channel-container">
                    <BcrumbItem bcrumb={bcrumb} />
                    <div className="channel-content">
                        <div className='channel-subtitle-container'>
                            <p className='channel-subtitle' id='spouse'>渠道信息</p>
                            <div>
                                <span className='channel-subtitle-attachment' onClick={() => this.getPictureInfo(Config.bizType.merchantInfoFile)}>查看文件</span>
                            </div>
                        </div>
                        {channelDetail && <Row>
                            <Col span={12}>
                                <span>类别：{channelDetail.channelTypeText}</span>
                            </Col>
                            <Col span={12}>
                                <span>渠道：{channelDetail.channelName}</span>
                            </Col>
                            <Col span={12}>
                                <span>店铺名称：{channelDetail.merchantName}</span>
                            </Col>
                            <Col span={12}>
                                <span>负责人：{channelDetail.merchantPerson}</span>
                            </Col>
                            <Col span={12}>
                                <span>联系方式：{channelDetail.merchantPhone}</span>
                            </Col>
                            <Col span={12}>
                                <span>店铺地址：{channelDetail.merchantAddress}</span>
                            </Col>
                            <Col span={12}>
                                <span>推荐人：{channelDetail.merchantReferee}</span>
                            </Col>
                        </Row>}
                        {type == 1 ? <div className='btn-warp'>
                            <Button className="rule-button" type="primary" onClick={() => this.putChannelCheck(2)}>审核通过</Button>
                            <Button className="rule-button rejct-button" onClick={() => this.putChannelCheck(3)}>审核拒绝</Button>
                        </div> : null}
                    </div>
                    <CarouselImg pictureInfo={pictureInfo} previewPic={this.state.preview} previewHide={this.previewHide} />
                </div>
            </Spin>
        )
    }
}
export default ChannelDetail;
