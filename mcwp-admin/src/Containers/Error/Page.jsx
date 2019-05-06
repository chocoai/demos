import React, { Component } from 'react'; // 引入了React
import { Link } from 'react-router';
import './style/page.less';

// 公共头部
import { Hheader } from '../../Component/Layout/HeightHeader';

import { Layout } from 'antd';

class ErrorPage extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
        const code = this.props.params.code;
        let content = null;
        if (code == 'timeout') {
            content = <div className="error-page-container">
                <i className="icon-page-error"></i>
                <div className="msg-content">
                    <h2>登录超时，请重新<Link to="/login">登录</Link></h2>
                </div>
            </div>;
        }
		return (
			<Layout className="base-container">
		    	<Hheader />
                { content }
    		</Layout>
		);
	}
}

export default ErrorPage;
