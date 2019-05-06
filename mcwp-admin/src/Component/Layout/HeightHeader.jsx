import React, { Component } from 'react';
import { Config } from '../../Config/Index';
import './style/heightHeader.less';
import { Layout } from 'antd';

const { Header } = Layout;

/**
 * 公共头部(登录界面，忘记密码界面)
 *
 * @export
 * @class Hheader
 * @extends {Component}
 */
export class Hheader extends Component {
	render() {
		return (
			<Header className={`height-header ${this.props.hasBottom == true ? 'hheader-bottom':''}`}>
	    		<span className="hheader-logo"></span><span className="hheader-title">{Config.baseText.name}</span>
	    	</Header> 
		)
	}
}