import React, { Component } from 'react'; // 引入了React

import './style/reportDetail.less';


/**
 * 报账管理
 * @Author: 钟观发
 * @Date:   2017-10-17
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-10-17
 */
class ReportDetail extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
		};
	}
	componentDidMount() {
    }
	render() {
		return (
			<div className="reportDetail-container">
				报账管理详情
		    </div>
		);
	}
}

export default ReportDetail;