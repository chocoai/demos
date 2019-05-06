import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import closeImg from '../../../Assets/Images/tape_icon_close_narrow.png'
import pauseImg from '../../../Assets/Images/tape_icon_pause_narrow.png'
import playImg from '../../../Assets/Images/tape_icon_play_narrow.png'
import './style/audioMini.less';

// 此组件暂时不使用
class AudioMini extends Component {
    render() {
        const that = this;
        const { nowUrl, audioState } = that.props;
        return (
            <div className="audio-mini-container">
                <audio ref={audioNative => {this.audioNative = audioNative}} style={{display:'none'}} src={nowUrl} controls='controls' loop>
                    您的浏览器不支持 audio 标签。
                </audio>
                <div className="audio-item">
                    <div className="audio-item-title">
                        <span className="audio-item-start" ref={audioStart => {this.audioStart = audioStart}}>00:00:00</span>/
                        <span className="audio-item-end" ref={audioEnd => {this.audioEnd = audioEnd}}>00:00:00</span>
                    </div>
                    {
                        audioState?
                        <img className="audio-item-play" src={playImg} onClick={()=>that.audioPlay()} alt='play' />                                                        
                        :
                        <img className="audio-item-stop" src={pauseImg} onClick={()=>that.audioStop()} alt='stop' />
                    }
                    <img className="audio-item-close" src={closeImg} onClick={()=>that.audioClose()} alt='pause' />
                    <div className="audio-item-bar" ref={audioBar => {this.audioBar = audioBar}} onClick={ this.audioBarChange }>
                        <div className="audio-item-now" ref={audioNow => {this.audioNow = audioNow}}></div>
                    </div>
                </div>
            </div>
        )
    }
}

const pureAudioMini = pureRender(AudioMini);

export default pureAudioMini;