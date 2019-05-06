import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';

import SignManagement from './../../Component/Template/SignManagement';
import TemplateManagement from './../../Component/Template/TemplateManagement';
import OperateTemplate from './../../Component/Template/OperateTemplate';

import './style/template.less';

import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

/**
 * 消息模版
 * @Author: 赵俊
 * @Date:   2017-08-07
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-08-07
 */
class Template extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
			defaultTab: 'sign',
		};
	}
	componentDidMount() {
        const that = this;
        const { routeParams } = that.props;
        that.setState({
            defaultTab: routeParams.tab ? routeParams.tab : 'sign',
		});
    }
	changeTabs = (key) => { // 切换选项卡
        Config.localItem('DEFAULT_TAB', key)
        // if (key == 'sign') { // 网点设置
        //     this.setState({
        //         defaultTab: key
        //     })
        // }
        // if (key == 'board') { // 自定义菜单
        //     this.setState({
        //         defaultTab: key
        //     })
		// }
        browserHistory.push('/template/' + key);
    }
	render() {
		const that = this;
		const { defaultTab } = that.state;
		return (
			<div className="common-tab-container template-container">
				<Tabs className='template-tabs' defaultActiveKey={defaultTab} activeKey={defaultTab} onChange={this.changeTabs} animated={false}>
					<TabPane tab="签名管理" key="sign">
						<SignManagement />
					</TabPane>
					<TabPane tab="通知模板管理" key="board">
						<TemplateManagement signClass={'board'} routeParams={this.props.routeParams}/>
					</TabPane>
					<TabPane tab="营销短信模板" key="operate">
						<OperateTemplate/>
					</TabPane>
					<TabPane tab="系统短信模板" key="system">
						<TemplateManagement signClass={'system'}/>
					</TabPane>
				</Tabs>
		    </div>
		);
	}
}

export default Template;
