import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';
import { Row, Col, Card, Button, message, Icon, Menu, Dropdown, Spin } from 'antd';
import WechatService from '../../Services/WechatService';

import './style/wechat.less';

/**
 * 微信公众号
 * @Author: 魏昌华
 * @Date:   2017-08-16
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-08-16
 */
class Wechat extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
            boundInfo: '',
            loading: true
        };
	}
	componentDidMount() {
        const that = this;
		WechatService.getBoundInfo({}, (res) => { // 获取企业绑定公众号
            if(res.code == Config.errorCode.success) {
                that.setState({
                    boundInfo: res.data,
                    loading: false
                });
            } else {
                message.error(res.msg);
            }
        })
    }
    goAuth = () => { // 授权绑定
        const that = this;
        WechatService.getAuthUrl({}, (res) => {
            if(res.code == Config.errorCode.success) { 
                if (res.data) {
                    let redirectUri = res.data.split('&redirect_uri=');
                    const refererUrl = that.getReferer();
                    const midUrl = encodeURIComponent(encodeURIComponent(encodeURIComponent(window.location.href)));
                    redirectUri = redirectUri[0] + '&redirect_uri=' + encodeURIComponent(refererUrl + decodeURIComponent(redirectUri[1])  + '?midUrl=' + midUrl);
                    window.location.href = refererUrl + "/weauth?redirectUrl="+ encodeURIComponent(redirectUri);
                }
            } else {
                message.error(res.msg);
            }
        });
    }
    getReferer() { // 获取不同环境来源页面链接
        const currentUrl = window.location.href;
        if (currentUrl.indexOf('mp-test.zhudb.com') > -1) {
            return 'https://mp-test.zhudb.com'; // 预生产
        } 
        if (currentUrl.indexOf('mp.zhudb.com') > -1) {
            return 'https://mp.zhudb.com'; // 生产
        }
        return 'http://mcwp.test.zhudb.com'; // 测试
    }
    onDropdown = (e) => { // 新账号、解绑
        if (e.key == 0) {
            this.goAuth();
        }
    }
    goWechatSet = (info) => { // 进入公众号平台
        Config.localItem('WX_APPID', info.appid); 
        Config.localItem('WX_WECHAT', info.nickname);
        browserHistory.push('/wechat/set/menu');
    }
	render() {
        const that = this;
        const { boundInfo, loading } = that.state;
        const menu = (
            <Menu onClick={this.onDropdown}>
              <Menu.Item key="0">新账号</Menu.Item>
              <Menu.Item key="1"><a href="https://mp.weixin.qq.com/"  rel="nofollow me noopener noreferrer" target="_blank">解绑</a></Menu.Item>
            </Menu>
          );
		return (
            <Spin spinning={loading} >
                <div className="common-console-container wechat-container">
                    { boundInfo && boundInfo.length > 0 ? <Row justify="center" gutter={48}>
                        <Col span={6}>
                            { boundInfo.map((info, key) => (
                                <Card key={key} className="wechat-card">
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <Icon className="card-icon" type="ellipsis" />
                                    </Dropdown>
                                    <div className="card-title">{info.nickname}</div>
                                    <img className="card-img" src={info.headimg} alt={info.nickname} />
                                    <Button className="card-btn common-btn" type="primary" onClick={that.goWechatSet.bind(that, info)}>进入公众号平台</Button>
                                </Card>
                            )) }
                        </Col>
                    </Row>
                        : <Card className="wechat-card unbound-card">
                        <img className="card-img" src={require('../../Assets/Images/img-male.png')} alt="授权绑定LOGO" />
                        <Button className="card-btn" type="primary" onClick={this.goAuth}>授权绑定</Button>
                    </Card> }    
                </div>        
		    </Spin>
		);
	}
}

export default Wechat;

