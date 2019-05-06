import React, { Component } from 'react'; // 引入了React

import './style/versionUp.less';

// 公共头部
import {Hheader} from '../../Component/Layout/HeightHeader';

/**
 * 版本升级
 * @Author: 赵俊
 * @Date:   2017-07-26
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-26
 */

class VersionUp extends Component {
	render() {
		return (	
            <div className='versionUp-container'>
                <Hheader />
                <div className="versionUp-content">
                    <p className="versionUp-p">助贷宝作业平台不支持你的浏览器</p>
                    <p className="versionUp-p">请使用浏览器Chrome或IE9及以上版本</p>
                    <a className="versionUp-a" href="http://www.google.cn/chrome/browser/desktop/index.html">下载链接:http://www.google.cn/chrome/browser/desktop/index.html</a>
                </div>
            </div>
		);
	}
}


export default VersionUp;

