import React, { Component } from 'react';
import { Config } from '../../Config/Index';
import { Link } from 'react-router';
import { Menu, Icon, message } from 'antd';
import BaseService from '../../Services/BaseService';//调用数据
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
/**
 * 公共菜单
 *
 * @export
 * @class Lmenu
 * @extends {Component}
 */
class Lmenu extends Component {
	constructor(props, context) {
		super(props, context); //后才能用this获取实例化对象
		const openKeys = Config.localItem('OPENKEY') ? [Config.localItem('OPENKEY')] : [];
		this.state = {
			openKeys: openKeys,
			menuData: ''
		};
	}
	triggerMenu = (e) => {
		//hy 当Config.localItem的参数长度为2时，那么会是 return localStorage.setItem(key, value);
		//hy this.props.cbModalVisible(true, e.key); props来自于Layout.jsx的  setModalVisible
        Config.localItem('SELECTEDKEY', e.key);
		this.props.cbModalVisible(true, e.key);
    }
    onOpenChange = (openKeys) => {
	    const state = this.state;
	    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
	    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

	    let nextOpenKeys = [];
	    if (latestOpenKey) {
	      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
	    }
	    if (latestCloseKey) {
	      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
	    }
	    Config.localItem('OPENKEY', nextOpenKeys);
	    this.setState({ openKeys: nextOpenKeys });
    }
    getAncestorKeys = (key) => {
	    const map = {
	      sub3: ['sub2'],
	    };
	    return map[key] || [];
	}
	componentWillMount() {
		this.getMenus();
	}
	//获取菜单
	getMenus = (param) => {
		BaseService.getMenus(param, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
					menuData: res.data
                })
            } else {
				message.error(res.msg);
            }
        });
	}
	render() {
		// const defaultRouter = window.location.pathname;
		// const defaultSelectedKey = Config.localItem('OPENKEY') == '/' + defaultRouter ? [Config.localItem('OPENKEY')] : [];
		let funcs = this.state.menuData.funcs || [];  // 功能列表
		let menus = this.state.menuData.menus || [];  // 菜单列表
        let selectedKeyTmp = Config.localItem('SELECTEDKEY');
        if (!selectedKeyTmp) return;
		// 后退处理
		let selectedKey
		if (selectedKeyTmp.split('/')[1] == window.location.pathname.split('/')[1]) {
			selectedKey = selectedKeyTmp
		} else {
			selectedKey = window.location.pathname
		}
		return (
			<Menu mode="inline" defaultSelectedKeys={[selectedKey]} selectedKeys={[selectedKey]} defaultOpenKeys={['function', 'manage']} className="layout-menu" onClick={this.triggerMenu} openKeys={this.state.openKeys} onOpenChange={this.onOpenChange} >
		        {
                funcs.length > 0 ? <MenuItemGroup key="function" title={<span><Icon className="custom-icon icon-function" />功能</span>}>
		        	{funcs.map((result,key)=>(
                        <Menu.Item className={selectedKey == result.funcUrl ? 'menu-selected funcs-menu' : 'funcs-menu' } key={result.funcUrl}><Link to={result.funcUrl}>{result.funcName}</Link></Menu.Item>
		        	))}
          		</MenuItemGroup> : null
                }
                <MenuItemGroup key="manage" title={<span><Icon className="custom-icon icon-manage" />管理</span>}>
                    {
                        menus.map((result, key) => (
                            !result.menuUrl && result.subMenu.length > 0 ? <SubMenu key={result.menuName} title={<span>{result.menuName}</span>}>
                                {
                                    result.subMenu.map((subResult, subKey) => (
                                        <Menu.Item key={subResult.menuUrl}><Link to={subResult.menuUrl} className="submenu-title">{subResult.menuName}</Link></Menu.Item>
                                    ))
                                }
                            </SubMenu> : <Menu.Item key={result.menuUrl}>
                                <span><Link to={result.menuUrl} className="menu-title">{result.menuName}</Link></span>
                            </Menu.Item>
                        ))
                    }
                </MenuItemGroup>
	        </Menu>
		)
	}
}

export default Lmenu;
