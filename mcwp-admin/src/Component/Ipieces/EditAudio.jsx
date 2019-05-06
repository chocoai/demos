import React, { Component, PropTypes } from 'react'; // 引入了React和PropTypes
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';

import './style/editAudio.less';

/**
 * 进件编辑音频
 * @Author: 赵俊
 * @Date:   2017-07-25
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-25
 */
class EditAudio extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='editAudio-container'>
                {/* <button className="warp-word">转文字</button><span>10.000"(语音总时长10.000)</span>
                <div className="editAudio-content">
                    <ul className="content-nav">
                        <li className="nav-li">1</li>
                        <li className="nav-li">1</li>
                        <li className="nav-li">1</li>
                        <li className="nav-li">1</li>
                        <li className="nav-li">1</li>
                    </ul>
                    <div className="content-list">
                        <div>
                            <h3>借款人与配偶信息 2017-07-01 13:00</h3>
                            <ul>
                                <li>1.</li>
                                <li>1.</li>
                                <li>1.</li>
                            </ul>
                        </div>
                        <div>
                            <h3>借款人与配偶信息 2017-07-01 13:00</h3>
                            <ul>
                                <li>1.</li>
                                <li>1.</li>
                                <li>1.</li>
                            </ul>
                        </div>
                        <div>
                            <h3>借款人与配偶信息 2017-07-01 13:00</h3>
                            <ul>
                                <li>1.</li>
                                <li>1.</li>
                                <li>1.</li>
                            </ul>
                        </div>
                    </div>
                </div> */}
            </div>
        )
    }
}

const pureEditAudio = pureRender(EditAudio);

export default pureEditAudio;