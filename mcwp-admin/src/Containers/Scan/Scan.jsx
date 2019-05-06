import React, { Component } from 'react';
import ScanService from '../../Services/ScanService';
import { Spin, message } from 'antd';
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';

import './style/scan.less'

export default class Scan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scanSpinning: false,
            showQrRefresh: false
        }
    }
    componentWillMount() {
        this.qrChange()
    }
    qrChange = async () => {
        const that = this
        that.setState({
            scanSpinning: true,
            showQrRefresh: false
        })
        let param = window.location.origin == 'http://localhost:3000' ? { url: 'http://mcwp.test.zhudb.com' } : { url: window.location.origin }
        let res = await ScanService.getQrCode(param)
        if (res.code == 0) {
            that.setState({
                qrPicture: res.data.picture,
                scanSpinning: false
            })
            clearInterval(that.qrTimer)
            that.qrTimer = setInterval(() => {
                that.scanStatus(res.data.nonceStr)
            }, 2000)
        } else {
            that.setState({
                scanSpinning: false,
            })
            message.error(res.msg)
        }
    }
    async scanStatus(nonceStr) {
        const that = this
        let res = await ScanService.qrScanStatus({ nonceStr })
        if (res.code == Config.errorCode.success) {
            if (res.data) {
                let data = res.data
                clearInterval(that.qrTimer)
                Config.localItem('USER_AUTHORIZATION', data.token);   // 本地存储token
                that.launchFullScreen(document.documentElement)
                browserHistory.push({
                    pathname: '/workbench/scan'
                });
            }
        } else if (res.code == Config.errorCode.qrCodeTimeout) {
            that.setState({
                showQrRefresh: true
            })
            clearInterval(that.qrTimer)
        } else {
            message.error(res.msg)
        }
    }
    launchFullScreen(document) {
        if (document.requestFullscreen) {
            document.requestFullscreen();
        }
        else if (document.mozRequestFullScreen) {
            document.mozRequestFullScreen();
        }
        else if (document.msRequestFullscreen) {
            document.msRequestFullscreen();
        }
        else if (document) {
            document.webkitRequestFullScreen();
        }
    }
    render() {
        const { scanSpinning, qrPicture, showQrRefresh } = this.state
        return (
            <div className="scan-container">
                <div className="scan-content">
                    <Spin tip="载入中..." spinning={scanSpinning}>
                        <p className="scan-title">为保障数据安全，请用微信扫码验证身份</p>
                        <div className='scan-qr-wrapper'>
                            <img className="scan-qr" src={`data:image/png;base64,${qrPicture}`} alt="product-qrc-img" />
                            {showQrRefresh ?
                                <div className="qr-refresh-wrapper">
                                    <div>
                                        <p>二维码已失效</p>
                                        <p style={{ textAlign: "center" }}>请点击<span className="qr-refresh" onClick={this.qrChange}>刷新</span></p>
                                    </div>
                                </div>
                                : null
                            }
                        </div>
                    </Spin>
                </div>
            </div>
        )
    }
}
