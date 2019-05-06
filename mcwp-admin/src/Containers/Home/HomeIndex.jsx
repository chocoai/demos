import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';

import './style/home.less';

import { Row, Col, Card, Spin } from 'antd';


/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
    	super(props);
        this.state = {
            userAccount: '',
            loading: true
        };
    }
    componentWillMount() {
    	// this.props.getData('/user/v1/account', {}, (res) => {
        //     if(res.code == Config.errorCode.success) {
        //     	this.setState({
        //     		userAccount: res.data,
        //     		loading: false
        //     	});
        //  	} else {
        //  		message.error(res.msg);
        //  	}
        // },'userAccount', 'GET');
    }
    componentDidMount() {
        this.setState({
            loading: false
        });
    }
	render() { 
        const bodyStyle = {
        	height: '96px',
        	textAlign: 'center'
        };
        let userAccount = this.state.userAccount;
		return (
		<Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
			<div className="home-container">
	            <Row gutter={24}>
	            	<Col span={8} style={bodyStyle}>
	                    <Card bordered={false}>
	                    	<p>{userAccount.total || 0}</p>
	                    	<p>总客户数</p>
	                    </Card>                      
	                </Col>
	                <Col span={8} style={bodyStyle}>
	                    <Card bordered={false}>
	                    	<p>{userAccount.part || 0}</p>
	                    	<p>新增客户</p>
	                    </Card>                      
	                </Col>
	                <Col span={8} style={bodyStyle}>
	                    <Card bordered={false}>
	                      <p>0</p>
	                      <p>待处理工单</p>
	                    </Card>                      
	                </Col>
	            </Row>
            </div>
        </Spin>
		);
	}
}

export default Main;