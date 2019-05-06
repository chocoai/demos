import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';
import ActivityService from '../../Services/ActivityService';
import moment from 'moment';
import qrImg from './../../Assets/Images/img-qr.png';

import './style/activityItem.less';
import { message, Popover, Button, Modal } from 'antd';
const confirm = Modal.confirm;

/**
 * 活动列表
 * @Author: 
 * @Date:   2017-12-25
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-12-25
 */

class ActivityItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: Config.localItem('CUR_ROLE'),
        }
    }
    componentDidMount() {
        // console.log(moment(parseInt(1518763720000)).format('MMMM Do YYYY, h:mm:ss a'))
    }
    activityView = (info) => {
        const { defaultTab } = this.props;
        if (defaultTab == 'draw') {
            browserHistory.push('/market/drawActivity/detail/' + info.code)
        } else if (defaultTab == 'jigsaw'||defaultTab == 'shake') {
            browserHistory.push('/market/jigsawActivity/detail/' + info.code+'?type='+defaultTab)
        }
    }
    activityEdit = (info) => {
        const { defaultTab } = this.props;
        if (defaultTab == 'draw') {
            browserHistory.push('/market/drawActivity/add/' + info.code)
        } else if (defaultTab == 'jigsaw') {
            browserHistory.push('/market/jigsawActivity/add/' + info.code)
        }else if (defaultTab == 'shake') {
            browserHistory.push('/market/shakeActivity/add/' + info.code)
        }

    }
    prodEnd = (info) => {
        let that = this
        let params;
        const { defaultTab } = this.props;
        if (defaultTab == 'test') {
            params = {
                code: info.code
            }
        } else {
            params = {
                activityCode: info.code
            }
        }
        if (defaultTab == 'draw') {
            confirm({
                title: '确认结束',
                content: '活动结束后改活动将失效，是否结束？',
                onOk() {
                    ActivityService.postActivityPause(params, (res) => {
                        if (res.code == Config.errorCode.success) {
                            message.success('活动已结束');
                            that.props.getActivityList()
                        } else {
                            message.error(res.msg);
                        }
                    })
                },
                onCancel() {
                },
            });
        } else if (defaultTab == 'jigsaw') {
            confirm({
                title: '确认结束',
                content: '确认结束该活动么？',
                onOk() {
                    that.putEnd(params, 'putJigsawEnd')
                },
            });

        } else if (defaultTab == 'test') {
            params.status = 0;
            confirm({
                title: '确认结束',
                content: '确认结束该活动么？',
                onOk() {
                    that.putEnd(params, 'putAnswerEndorPublish')
                },
            });

        } else if (defaultTab == 'shake') {
            params.status = 0;
            confirm({
                title: '确认结束',
                content: '确认结束该活动么？',
                onOk() {
                    that.putEnd(params, 'putShakeEnd')
                },
            });

        }
    }
    prodPublish = (info) => {
        let that = this
        let params;
        const { defaultTab } = this.props;
        if (defaultTab == 'test') {
            params = {
                code: info.code
            }
        } else {
            params = {
                activityCode: info.code
            }
        }
        if (defaultTab == 'draw') {
            confirm({
                title: '确认发布',
                content: '活动发布后部分设置将无法修改，是否发布？',
                onOk() {
                    that.putPublish(params, 'publishActivitys')
                    // ActivityService.publishActivity(params, (res) => {
                    //     if (res.code == Config.errorCode.success) {
                    //         message.success('发布成功');
                    //         that.props.getActivityList()
                    //     } else {
                    //         message.error(res.msg);
                    //     }
                    // })
                },
                onCancel() {
                },
            });
        } else if (defaultTab == 'jigsaw') {
            confirm({
                title: '确认发布',
                content: '确认发布该活动么？',
                onOk() {
                    that.putPublish(params, 'putJigsawPublish')
                },
            });

        } else if (defaultTab == 'test') {
            params.status = 1;
            confirm({
                title: '确认发布',
                content: '确认发布该活动么？',
                onOk() {
                    that.putPublish(params, 'putAnswerEndorPublish')
                },
            });

        }else if (defaultTab == 'shake') {
            params.status = 1;
            confirm({
                title: '确认发布',
                content: '确认发布该活动么？',
                onOk() {
                    that.putPublish(params, 'putShakePublish')
                },
            });

        }
    }
    async putPublish(params, type) {
        let that = this;
        let res = await ActivityService[type](params);
        if (res.code == Config.errorCode.success) {
            message.success('发布成功!');
            that.props.getActivityList()
        }
    }
    async putEnd(params, type) {
        let that = this;
        let res = await ActivityService[type](params);
        if (res.code == Config.errorCode.success) {
            message.success('活动已经结束！');
            that.props.getActivityList()
        }
    }
    getQRImg = (info) => {
        let params= {
            code: info.code
        };
        const { defaultTab } = this.props;
        if (defaultTab == 'draw') {
            Config.get('/v1/op/activity/qrcode', params, (res) => {
                if (res.code == Config.errorCode.success) {
                    this.setState({
                        QRImg: res.data
                    })
                } else {
                    message.error(res.msg);
                }
            });
        } else if (defaultTab == 'jigsaw') {
            this.getQRImgs(params, 'getJigsawQRImg')
        } else if (defaultTab == 'test') {
            this.getQRImgs(params, 'getAnswerQRImg')
        } else if (defaultTab == 'shake') {
            this.getQRImgs(params, 'getShakeQRImg')
        }

    }
    async getQRImgs(params, type) {
        let res = await ActivityService[type](params);
        if (res.code == Config.errorCode.success) {
            this.setState({
                QRImg: res.data
            })
        }
    }
    CopyAll = () => {//点击复制文本框内容
        let ele = this.refs.url;
        ele.focus();
        ele.select();
        document.execCommand('Copy');
        message.success('已复制！');
    }
    render() {
        let that = this;
        const { info, defaultTab } = that.props;
        const { currentRole, QRImg } = that.state;
        let prdStatus = null;
        const content = (
            <div>
                {QRImg ?
                    <div>
                        <input type="text" readonly="readonly" className="url-input" value={QRImg.Url} ref='url' /><Button style={{ display: 'inline-block' }} onClick={() => this.CopyAll()}>复制</Button><br />
                        <img className='QR-img' style={{ width: '180px', height: '180px' }} src={`data:image/png;base64,${QRImg.picture}`} alt='product-qrc-img' />
                    </div>
                    : <p className='product-word'>二维码获取失败</p>
                }
            </div>
        );
        if (defaultTab == 'test') {
            if (info && info.answerActiveStatus == 0) {
                prdStatus = <ul className='activity-operate'><li className='callOff' onClick={() => this.prodPublish(info)}>发布</li></ul>
            } else if (info && info.answerActiveStatus == 1) {
                prdStatus = <ul className='activity-operate'><li className='callOff' onClick={() => this.prodEnd(info)}>结束</li></ul>
            }
        } else {
            if (info && info.activeStatus == 1) { // 未发布
                prdStatus = <ul className='activity-operate'><li className='edit' onClick={() => this.activityView(info)}>{defaultTab == 'jigsaw'||defaultTab == 'shake'?'兑奖详情':'中奖详情'}</li><li className='edit' onClick={() => this.activityEdit(info)}>编辑</li><li className='callOff' style={{ color: '#FFC125' }} onClick={() => this.prodPublish(info)}>发布</li></ul>;
            } else if (info && info.activeStatus == 2) { // 进行中
                prdStatus = <ul className='activity-operate'><li className='edit' onClick={() => this.activityView(info)}>{defaultTab == 'jigsaw'||defaultTab == 'shake'?'兑奖详情':'中奖详情'}</li><li className='edit' onClick={() => this.activityEdit(info)}>编辑</li><li className='callOff' style={{ color: '#FFC125' }} onClick={() => this.prodEnd(info)}>结束</li></ul>;
            } else if (info && info.activeStatus == 3) { // 已结束
                prdStatus = <ul className='activity-operate'><li className='edit' onClick={() => this.activityView(info)}>{defaultTab == 'jigsaw'||defaultTab == 'shake'?'兑奖详情':'中奖详情'}</li><li className='edit' onClick={() => this.activityEdit(info)}>编辑</li></ul>;
            } else { // 未开始
                prdStatus = <ul className='activity-operate'><li className='edit' onClick={() => this.activityView(info)}>{defaultTab == 'jigsaw'||defaultTab == 'shake'?'兑奖详情':'中奖详情'}</li><li className='edit' onClick={() => this.activityEdit(info)}>编辑</li></ul>;
            }
        }

        return (
            <div className='common-content-container activityItem-container'>
                {defaultTab == 'test' ? <div className="activity-banner">
                    {info.answerActiveStatus == 1 ? <p className='credit-word comeOn'>进行中</p> : <p className='credit-word endOn'>未发布</p>}
                    {info.coverUrl ?
                        <img className='activity-img' src={`${info.coverUrl}`} alt='activity-img' />
                        : <img className='activity-img' src={require('../../Assets/Images/img_default_tast.png')} alt='activity-img' />
                    }
                </div> : <div className="activity-banner">
                        {info.activeStatus && info.activeStatusText ? info.activeStatus == 1 || info.activeStatus == 4 ?
                            <p className='credit-word'>{info.activeStatusText}</p> : info.activeStatus == 2 ? <p className='credit-word comeOn'>{info.activeStatusText}</p> : <p className='credit-word endOn'>{info.activeStatusText}</p> : null}
                        {info.coverUrl ?
                            <img className='activity-img' src={`${info.coverUrl}`} alt='activity-img' />
                            :defaultTab=='jigsaw'?<img className='activity-img' src={require('../../Assets/Images/img_default_activity.png')} alt='activity-img' />:<img className='activity-img' src={require('../../Assets/Images/img_activity.png')} alt='activity-img' />
                        }
                    </div>}
                {defaultTab == 'test' ? <div className='activity-content'>
                    <h3 className='activity-title'>{info.answerActiveName}</h3>
                    <p className='activity-num answer-num'>参与人数：{info.answerPlayNum && info.answerPlayNum + '人'}</p>
                </div> : <div className='activity-content'>
                        <h3 className='activity-title'>{info.activeName}</h3>
                        <p className='activity-time'><span className='activity-money'>活动时间：{info.activeTime ? moment(parseInt(info.activeTime.split(',')[0])).format('YYYY-MM-DD HH:mm:ss') + '到' + moment(parseInt(info.activeTime.split(',')[1])).format('YYYY-MM-DD HH:mm:ss') : '未录入'}</span></p>
                        {
                            info.activeStatus != 1 ?
                                <p className='activity-num'>参与人数：{info.peopleNum && info.peopleNum + '人'}</p> : null
                        }
                    </div>}

                {currentRole.indexOf('ROLE_SUPER_ADMIN') > -1 || currentRole.indexOf('ROLE_TOP_MANAGER') > -1 || currentRole.indexOf('ROLE_MID_MANAGER') > -1 ? prdStatus : null}
                {defaultTab == 'test' ?
                    <div className='qr-info'>
                        <Popover placement="leftTop" content={content} trigger="hover">
                            `<img className='preivew-delete' src={qrImg} onMouseOver={() => this.getQRImg(info)} alt='product-qr-info' />
                        </Popover>
                    </div> : info.activeStatus != 1 ?
                        <div className='qr-info'>
                            <Popover placement="leftTop" content={content} trigger="hover">
                                `<img className='preivew-delete' src={qrImg} onMouseOver={() => this.getQRImg(info)} alt='product-qr-info' />
                            </Popover>
                        </div> : null}
            </div>
        )
    }
}

const pureActivityItem = pureRender(ActivityItem);

export default pureActivityItem;