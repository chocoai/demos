import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Modal, Row, Col, Spin } from 'antd';
import { Config } from '../../Config/Index';
import pauseImg from '../../Assets/Images/tape_icon_pause.png'
import playImg from '../../Assets/Images/tape_icon_play.png'
import closeMiniImg from '../../Assets/Images/tape_icon_close_narrow.png'
import pauseMiniImg from '../../Assets/Images/tape_icon_pause_narrow.png'
import playMiniImg from '../../Assets/Images/tape_icon_play_narrow.png'

import './style/voiceShorts.less';

/**
 * 进件管理 》 编辑调查报告 》 语音速记列表
 * @Author: 魏昌华
 * @Date:   2017-07-27
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-03-02
 */
class VoiceShorts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playId: 0,
            audioState: 1, //音频状态,开始1,暂停0
            audioList: [],
            currentTime: null,
            miniVisible: true,      // true 隐藏 false显示
            nowAudio: {}
        };
    }
    componentWillMount () {
        this.props.getSurveyList()
    }
    componentWillUnmount() {
        const that = this;
        if (that.audioTimer) clearInterval(that.audioTimer);
        if(that.timer) clearInterval(that.timer);
    }
    // change 1为弹出 2为mini
    audioPlay = (e, item, change) => {
        const that = this;
        const {playId, audioList, nowAudio} = that.state;

        item = item || nowAudio;
        let id = item.infoId,
            len = item.speechLength

        let tmpArr, onRepeat = true
        if (!audioList.includes(id)) {
            tmpArr = [...audioList, id];
            onRepeat = false
        }
        const playAudio = this[`audioNative${id}`]
        // 防止两个同时播放，无论什么时候都对前一个音频做停止处理
        if (playId) this[`audioNative${playId}`].pause();
        // 切换播放状态
        that.setState({
            [`${playId}`]: 0,
            [`${id}`]: 1,
            audioList: tmpArr || audioList,
            playId: id,
            nowAudio: item,
            audioState: 0
        })
        // 音频变化，重新加载音频元素
        if (!onRepeat) playAudio.load();

        // 改变进度条时候触发
        if (change == 1) {
            let coordStart = this[`audioBar${id}`].getBoundingClientRect().left;
            let coordEnd = e.pageX;
            let p = (coordEnd - coordStart) / this[`audioBar${id}`].offsetWidth;
            this[`audioNow${id}`].style.width = p.toFixed(3) * 100 + '%';
            this[`audioNative${id}`].currentTime = p * (this[`audioNative${id}`].duration || len);
        }
        if (change == 2) {
            let coordStart = this.audioMiniBar.getBoundingClientRect().left;
            let coordEnd = e.pageX;
            let p = (coordEnd - coordStart) / this.audioMiniBar.offsetWidth;
            this.audioMiniNow.style.width = p.toFixed(3) * 100 + '%';
            this[`audioNative${id}`].currentTime = p * (this[`audioNative${id}`].duration || len);
        }

        playAudio.play();

        // 清除播放
        if (that.audioTimer) clearInterval(that.audioTimer);
        that.audioTimer = setInterval(() => {
            if (playAudio.ended) {
                if (that.audioTimer) clearInterval(that.audioTimer);
                that.setState({
                    [`${id}`]: 0,
                    audioState: 1
                });
            }
        }, 500);
        // 设置进度条
        if(that.timer) clearInterval(that.timer);
        that.timer = setInterval(() => {
            this[`audioStart${id}`].innerHTML = Config.conversionHour(playAudio.currentTime);
            this[`audioNow${id}`].style.width = playAudio.currentTime / playAudio.duration.toFixed(3) * 100 + '%';
            this.audioMiniStart.innerHTML = Config.conversionHour(playAudio.currentTime);
            this.audioMiniNow.style.width = playAudio.currentTime / playAudio.duration.toFixed(3) * 100 + '%';
        }, 50);
    }
    audioStop = () => {
        const that = this;
        const {playId} = this.state
        const playAudio = this[`audioNative${playId}`]
        playAudio.pause();
        this.setState({
            [`${playId}`]: 0,
            audioState: 1
        });
        if(that.timer) clearInterval(that.timer);
    }

    audioMiniClose = () => {
        this.audioStop()
        this.setState({
            miniVisible: true
        })
    }
    goTranslate = (id) => {
        const that = this;
        const { translateVoice } = that.props;
        translateVoice(id);
    }
    cancel = () => {
        const {onCancel} = this.props
        const {playId} = this.state
        if (playId) {
            this.setState({
                miniVisible: false
            })
        }
        // if (playId) {
        //     // 对mini模式进行初始化
        //     if (that.timer) clearInterval(that.timer)
        //     that.timer = setInterval(() => {
        //         this.audioMiniStart.innerHTML = Config.conversionHour(playAudio.currentTime);
        //         this.audioMiniNow.style.width = playAudio.currentTime / playAudio.duration.toFixed(3) * 100 + '%';
        //         this[`audioStart${playId}`].innerHTML = Config.conversionHour(playAudio.currentTime);
        //         this[`audioNow${playId}`].style.width = playAudio.currentTime / playAudio.duration.toFixed(3) * 100 + '%';
        //     }, 50);
        // }
        onCancel()
    }
    render() {
        const that = this;
        const { voiceList, visible, onCancel, ...others } = that.props;
        const { audioState, miniVisible, nowAudio } = that.state;
        return (
            <div>
                <Modal
                title='语音速记'
                wrapClassName="vertical-center-modal"
                className="voice-short"
                width={780}
                style={{ height: 600 }}
                footer={null}
                visible = {visible}
                onCancel = {that.cancel}
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
                                                <span className='audioWrap'>
                                                    <audio id={cItem.infoId} ref={audioNative => {this[`audioNative${cItem.infoId}`] = audioNative}} style={{display:'none'}} src={cItem.srcUrl} controls='controls'>
                                                        您的浏览器不支持 audio 标签。
                                                    </audio>
                                                    <div className="audio">
                                                        {
                                                            !this.state[cItem.infoId]?
                                                            <img className="audio-play" src={playImg} onClick={(e)=>that.audioPlay(e, cItem)} alt='play' />
                                                            :
                                                            <img className="audio-stop" src={pauseImg} onClick={()=>that.audioStop()} alt='pause' />
                                                        }
                                                        <div className="audio-bar" ref={audioBar => {this[`audioBar${cItem.infoId}`] = audioBar}} onClick={ (e) => this.audioPlay(e, cItem, 1) }>
                                                            <div className="now" ref={audioNow => {this[`audioNow${cItem.infoId}`] = audioNow}}></div>
                                                        </div>
                                                        <span className="start" ref={audioStart => {this[`audioStart${cItem.infoId}`] = audioStart}}>00:00:00</span>/
                                                        <span className="end" ref={audioEnd => {this[`audioEnd${cItem.infoId}`] = audioEnd}}>{Config.conversionHour(cItem.speechLength || 0)}</span>
                                                        {/* <span className="audio-next" onClick={this.audioPre}>上一首</span>
                                                        <span className="audio-next" onClick={this.audioNext}>下一首</span> */}
                                                    </div>
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
                <div className="audio-mini-container">
                    <div className={`audio-item ${visible || miniVisible? 'audio-out' : 'audio-in'}`}>
                        <div className="audio-item-title">
                            <span className="audio-item-start" ref={audioStart => {this.audioMiniStart = audioStart}}>00:00:00</span>/
                            <span className="audio-item-end" ref={audioEnd => {this.audioEnd = audioEnd}}>{Config.conversionHour(nowAudio.speechLength || 0)}</span>
                        </div>
                        {
                            audioState?
                            <img className="audio-item-play" src={playMiniImg} onClick={(e)=>that.audioPlay(e)} alt='play' />
                            :
                            <img className="audio-item-stop" src={pauseMiniImg} onClick={()=>that.audioStop()} alt='stop' />
                        }
                        <img className="audio-item-close" src={closeMiniImg} onClick={()=>that.audioMiniClose()} alt='pause' />
                        <div className="audio-item-bar" ref={audioBar => {this.audioMiniBar = audioBar}} onClick={(e)=>that.audioPlay(e, null, 2)}>
                            <div className="audio-item-now" ref={audioNow => {this.audioMiniNow = audioNow}}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const pureVoiceShorts = pureRender(VoiceShorts);

export default pureVoiceShorts;
