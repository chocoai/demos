import React, { Component } from 'react'; // 引入了React
import { browserHistory } from 'react-router';

import { Button } from 'antd';

import './style/notFound.less';

class Main extends Component {
    constructor(props) {
    	super(props);
        this.state = {};
    }
    goBack() {
        browserHistory.goBack();
    }
	render() {
		return (
            <div className="not-found-container">
                <i className="icon-page-error"></i>
                <div className="msg-content">
                    <h2>抱歉，你访问的页面不存在</h2>
                    <Button type="primary" className="common-small-btn" onClick={() => this.goBack()}>返回</Button>
                </div>
            </div>
		);
	}
}

export default Main;
