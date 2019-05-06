import React, { Component } from 'react'; // 引入了React
import { Config  } from '../../Config/Index';
import { browserHistory, Link } from 'react-router';
import WechatService from '../../Services/WechatService';
import WechatMenu from '../../Component/Wechat/WechatMenu';
import WechatPoint from '../../Component/Wechat/WechatPoint';

import './style/wechatSet.less';
import { Row, Col, Card, Tabs, Button, Icon, message } from 'antd';
const TabPane = Tabs.TabPane;

/**
 * 微信公众号自定义菜单/网点设置
 * @Author: 魏昌华
 * @Date:   2017-08-17
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-08-17
 */
class Wechat extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
            defaultTab: 'menu',
            followUser: '',
            syncMenu: '',
            actMenu: '',
            operations: <Button className="wechat-set-btn common-btn" onClick={()=>this.syncData()}>同步微信菜单</Button>
        };
	}
	componentDidMount() {
        const that = this;
        const { routeParams } = that.props;
        const appId = Config.localItem('WX_APPID');
        const params = {
            appId: appId
        };
        that.setState({
            defaultTab: routeParams.tab ? routeParams.tab : 'menu',
            operations: routeParams.tab == 'dot' ? <Button className="wechat-set-btn common-btn" type="primary"><Link to='/wechat/handle'><Icon type="plus" /> 新网点 </Link></Button> : <Button className="wechat-set-btn common-btn" onClick={()=>this.syncData()}>同步微信菜单</Button>
        });
        // 查询公众号关注人数
        WechatService.getFollowUser(params, (res) => {
            if(res.code == Config.errorCode.success) {
                that.setState({
                    followUser: res.data
                });
            } else {
                message.error(res.msg);
            }
        });
        // 获取缓存自定义菜单
        WechatService.getCacheMenu(params, (res) => {
            if(res.code == Config.errorCode.success) {
                if(res.data) {
                    that.setState({
                        syncMenu: JSON.parse(res.data),
                        actMenu: 'cache'
                    });
                }
            } else {
                message.error(res.msg);
            }
        });
    }
    saveMenu = (params, act) => { // 保存菜单
        WechatService.saveWxMenu(params, (res) => {
            if(res.code == Config.errorCode.success) {
                message.success('已保存成功');
                this.setState({
                    syncMenu: JSON.parse(params.menu),
                    actMenu: act
                });
            } else {
                message.error(res.msg);
            }
        })
    }
    syncData() {
        let that = this;
        const appId = Config.localItem('WX_APPID');
        WechatService.getSyncMenu({appId: appId}, (res) => {
            if(res.code == Config.errorCode.success) {
                document.getElementById('publish').scrollIntoView(true);
                let sData = res.data;
                if (sData && typeof sData == 'string') sData = JSON.parse(sData); 
                if (sData.is_menu_open == 1) that.setState({
                    syncMenu: sData.selfmenu_info,
                    actMenu: 'sync'
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    
    changeTabs = (key) => { // 切换选项卡
        Config.localItem('DEFAULT_TAB', key)
        if (key == 'dot') { // 网点设置
            this.setState({
                operations: <Button className="wechat-set-btn common-btn" type="primary"><Link to='/wechat/handle'><Icon type="plus" /> 新网点 </Link></Button>,
                defaultTab: key
            })
        }
        if (key == 'menu') { // 自定义菜单
            this.setState({
                operations: <Button className="wechat-set-btn common-btn" onClick={()=>this.syncData()}>同步微信菜单</Button>,
                defaultTab: key
            })
        }
        browserHistory.push('/wechat/set/' + key);
    }
	render() {
        const that = this;
        const { followUser, defaultTab, operations, syncMenu, actMenu } = that.state;
		return (
            <div id="wechatset" className="wechatset-container">
                <Card className="wechatset-count">
                    <Row justify="center" align="middle">
                        <Col span={8}>
                            <p>新关注人数（昨日）</p>
                            <p>{followUser.newUser || 0}</p>
                        </Col>
                        <Col span={8}>
                            <p>取消关注人数（昨日）</p>
                            <p>{followUser.cancelUser || 0}</p>
                        </Col>
                        <Col span={8}>
                            <p>总用户量</p>
                            <p>{followUser.cumulateUser || 0}</p>
                        </Col>
                    </Row>
                </Card> 
                <div className="wechatset-content common-console-container">
                    <Tabs tabBarExtraContent={operations} className='wechatset-tabs' defaultActiveKey={defaultTab} activeKey={defaultTab} onChange={that.changeTabs} animated={false}>
                        <TabPane tab="自定义菜单" key="menu">
                            <WechatMenu menu={syncMenu} save={that.saveMenu} act={actMenu} />
                        </TabPane>
                        <TabPane tab="网点设置" key="dot">
                            <WechatPoint />
                        </TabPane>
                    </Tabs>
                </div>
		    </div>
		);
	}
}


Wechat.contextTypes = {}

export default Wechat;