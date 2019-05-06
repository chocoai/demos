import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import audioImg from '../../Assets/Images/icon_audio.png'
import audioChoseImg from '../../Assets/Images/icon_audio_chose.png'
import './style/voiceShortIcon.less';

/**
 * 进件管理 》 编辑调查报告 》 语音速记图标
 * @Author: 魏昌华
 * @Date:   2017-07-27 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-03-02 
 */
class VoiceShortIcon extends Component {
    render() {
        const that = this;
        const { visible, ...others } = that.props;
        return (
            <div className='voice-short-icon' >
                <img className="short-icon" src={visible? audioChoseImg : audioImg} alt='audio' {...others} />
            </div>
        )
    }
}

const pureVoiceShortIcon = pureRender(VoiceShortIcon);

export default pureVoiceShortIcon;