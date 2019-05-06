import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Modal, Row, Col, Spin } from 'antd';
import { Config } from '../../Config/Index';
import IpiecesService from '../../Services/IpiecesService';

import './style/voiceShorts.less';

/**
 * 进件管理 》 编辑调查报告 》 语音速记列表
 * @Author: 魏昌华
 * @Date:   2017-07-27 
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-07-27 
 */
class VoiceShorts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playId: 0
        };
    }
    componentWillUnmount() {
        const that = this;
        if (that.audioTimer) clearInterval(that.audioTimer);
    }
    audioPlay = (id) => { 
        const that = this;
        const {playId} = that.state;
        const playAudio = document.getElementById(id);
        if (playId) document.getElementById(playId).pause();
        playAudio.load(); // 重新加载音频元素
        playAudio.play();
        that.audioTimer = setInterval(() => {
            if (playAudio.ended) {
                if (that.audioTimer) clearInterval(that.audioTimer);
                that.setState({
                    playId: 0
                });
            }
        }, 500);
        that.setState({
            playId: id
        });
    }
    goTranslate = (id) => {
        const that = this;
        const { translateVoice } = that.props;
        translateVoice(id);
    }
    render() {
        const that = this;
        const { voiceList, ...others } = that.props;
        const { playId } = that.state;
        return (
            <Modal
	          title='语音速记'
              wrapClassName="vertical-center-modal"
	          className="voice-short"
              width={780}
              style={{ height: 600 }}
              footer={null}
              {...others}
            >    
                {
                    voiceList && voiceList.map((item, index) => (
                    <Row key={index}>
                        <Col key={index} className="voice-classify">
                            <span>{item.msgName}</span>
                            <span className="voice-time">{Config.formatDateTime(item.time)}</span>
                        </Col>
                        {
                            item.loanSurveyInfoDTOS && item.loanSurveyInfoDTOS.map((cItem, cIndex) => (
                                <Row key={cIndex}>
                                    <Col className="voice-item">
                                        <span className="voice-order">{cIndex+1}.</span>
                                        {
                                            cItem.voice ? 
                                            <span>
                                                <audio id={cItem.infoId} style={{display:'none'}} src={cItem.srcUrl} controls='controls'>
                                                    您的浏览器不支持 audio 标签。
                                                </audio>
                                                <span className={playId == cItem.infoId ? 'voice-icon voice-git' : 'voice-icon'} onClick={()=>that.audioPlay(cItem.infoId)}></span>
                                                <span className="voice-duration">{cItem.speechLength || 0}''</span>
                                                { cItem.status == 1 || cItem.status == 4 ? <span className="voice-translate" onClick={()=>that.goTranslate(cItem.infoId)}>转文字{cItem.status == 4 ? <em className='fail'>转化失败</em> : null}</span> : (cItem.status == 2 ? <Spin className="voice-spin" /> : null)}
                                            </span>
                                            : <span className="voice-name">{cItem.msg || cItem.msgName}</span>
                                        }
                                    </Col>
                                    {
                                        cItem.voice && cItem.status == 3 ? <Col className="translated-text">
                                        <span className="voice-order">译：</span>
                                        <span>{cItem.voiceMsg}</span>
                                    </Col> : null
                                    }
                                </Row>
                            ))
                        }
                    </Row>
                    ))
                }
            </Modal>
        )
    }
}

const pureVoiceShorts = pureRender(VoiceShorts);

export default pureVoiceShorts;