import React, { Component } from 'react'; // 引入了React
import { fromJS } from 'immutable';
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import WechatService from '../../Services/WechatService';
import './style/wechatMenu.less';

import { Form, Radio, Popover, Icon, Button, Menu, Modal, Tag, message, Spin } from 'antd';
const FormItem = Form.Item;
const RadioButton = Radio.Button;

class WechatMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tmplMenu: '',
            optMenu: '',
            menuName: '',
            menuUrl: '',
            tagUrl: '',
            ruleName: '',
            ruleUrl: false,
            optKey: '',
            menuBtn: '',
            isSync: false,
            loading: false,
            previewImg: ''
        };
    }
    componentDidMount () {
        const that = this;
        const appId = Config.localItem('WX_APPID');
        const params = {
            appId: appId
        };
        WechatService.getTmplMenu(params, (res) => {
            if(res.code == Config.errorCode.success) {
                that.setState({
                    tmplMenu: res.data
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        const that = this;
        let defaultBtn = [{"name": "", "sub_button": ""}, {"name": "", "sub_button": ""}, {"name": "", "sub_button": ""}];
        let menuBtn = '';
        if (nextProps.menu && nextProps.menu.button) {
            let menuButton = nextProps.menu.button;
            let nextMenuBtn = [];
            for (let i = 0; i < menuButton.length; i++) {
                if (menuButton[i].name) {
                    nextMenuBtn.push({name: menuButton[i].name});
                    nextMenuBtn[nextMenuBtn.length-1].sub_button = (menuButton[i].sub_button && menuButton[i].sub_button.list) || menuButton[i].sub_button;
                    if (menuButton[i].type) nextMenuBtn[nextMenuBtn.length-1].type = menuButton[i].type;
                    if(menuButton[i].url) nextMenuBtn[nextMenuBtn.length-1].url = menuButton[i].url;
                }
            }
            menuBtn = fromJS(defaultBtn).merge(nextMenuBtn).toJS();
            let { optKey }  = that.state;
            let optMenu = '';
            let pIndex = '';
            let cIndex = '';
            if (optKey) {
                pIndex = optKey.split('menu')[0];
                cIndex = optKey.split('menu')[1];
                if (cIndex == -2) {
                    optMenu = menuBtn[pIndex];
                } else if (cIndex == -1) {
                    optMenu = menuBtn[pIndex].sub_button[menuBtn[pIndex].sub_button.length-1];
                    optKey = pIndex + 'menu' + (menuBtn[pIndex].sub_button.length-1);
                } else if (cIndex > -1) {
                    if (menuBtn[pIndex].sub_button) optMenu = menuBtn[pIndex].sub_button[cIndex];
                    
                }
            }
            const act = nextProps.act;
            if (act == 'sync') {
                that.setState({
                    menuBtn: menuBtn,
                    optMenu: '',
                    optKey: '',
                    menuName: '',
                    menuUrl: '',
                    isSync: false
                });
            } else if (act == 'remove') {
                if (cIndex == 0) {
                    let pName = menuBtn[pIndex].name;
                    // let pUrl = menuBtn[pIndex].url;
                    that.setState({
                        menuBtn: menuBtn,
                        optMenu: {
                            name: pName,
                            url: ''
                        },
                        optKey: pIndex + 'menu-2',
                        menuName: pName,
                        menuUrl: '',
                        tagUrl: false,
                        ruleUrl: true
                    });
                } else {
                    that.setState({
                        menuBtn: menuBtn,
                        optMenu: '',
                        optKey: '',
                        menuName: '',
                        menuUrl: '',
                        isSync: false
                    });
                }
            } else {
                that.setState({
                    menuBtn: menuBtn,
                    optMenu: optMenu,
                    optKey: optKey
                });
            }
        } else {
            that.setState({
                menuBtn: defaultBtn,
                optMenu: '',
                optKey: '',
                isSync: false
            });
        }
        that.setState({
            loading: false
        });
    }
    handleReset = () => { // 重置菜单
        const that = this;
        let { optMenu, tmplMenu } = that.state;
        let tagUrl = '';
        tmplMenu.map((ele) => {
            if (optMenu && ele.url == optMenu.url) {
                tagUrl = ele.name;
            }
        });
        that.setState({
            optMenu: optMenu,
            tagUrl: tagUrl,
            menuName: (optMenu && optMenu.name) || '' ,
            menuUrl: (optMenu && optMenu.url) || ''
        });
    }
    handleSubmit = (e) => {
        if (e) e.preventDefault();
        const that = this;
        let { optKey, menuBtn, optMenu, menuName, menuUrl }  = that.state;
        const pIndex = optKey.split('menu')[0];
        const cIndex = optKey.split('menu')[1];
        if ((cIndex == -2 && (!menuName || Config.getLength(menuName) > 8)) || (cIndex != -2 && (!menuName || Config.getLength(menuName) > 16))) {
            that.setState({
                ruleName: !menuName ? (cIndex == -2 ? '请输入父菜单名称' : '请输入子菜单名称') : '字数已达到上限'
            });
            return;
        } else {
            that.setState({
                ruleName: ''
            });
        }
        if ((!optMenu || !optMenu.sub_button || optMenu.sub_button.length == 0) && (!menuUrl || (menuUrl.indexOf('http://') == -1 && menuUrl.indexOf('https://') == -1))) {
            that.setState({
                ruleUrl: true
            });
            return;
        } else {
            that.setState({
                ruleUrl: false
            });
        }
        // 请求参数
        if (cIndex == -2) {
            menuBtn[pIndex].name = menuName;
            menuBtn[pIndex].url = menuUrl;
            if (!menuBtn[pIndex].sub_button) menuBtn[pIndex].type = 'view';
        } else if (cIndex == -1) {
            if(menuBtn[pIndex].url) delete menuBtn[pIndex].url;
            let subBtn = menuBtn[pIndex].sub_button;
            if (subBtn && subBtn.length && subBtn.length > -1) {
                menuBtn[pIndex].sub_button.push({name: menuName, url: menuUrl, type: 'view'});
            } else {
                menuBtn[pIndex].sub_button = [{name: menuName, url: menuUrl, type: 'view'}];
            }
        } else if (cIndex > -1) {
            menuBtn[pIndex].sub_button[cIndex] = {name: menuName, url: menuUrl, type: 'view'};
        }
        const appId = Config.localItem('WX_APPID');
        let menuBtnParams = [];
        for (let i = 0; i < menuBtn.length; i++) {
            if (menuBtn[i].name) {
                let midMenuBtn = menuBtn[i];
                if (!midMenuBtn.sub_button || midMenuBtn.sub_button.length == 0) delete midMenuBtn.sub_button;
                menuBtnParams.push(midMenuBtn);
            }
        }
        const params = {
            appId: appId,
            menu: JSON.stringify({button: menuBtnParams})
        };
        that.setState({
            loading: true
        });
        that.props.save(params, 'save');
    }
    removeMenu = () => {
        const that = this;
        const confirm = Modal.confirm;
        confirm({
		    title: '删除菜单',
		    content: '删除菜单后将删除菜单下设置的所有数据？',
		    okText: '确定',
   			cancelText: '取消',
   			onOk() {
                const appId = Config.localItem('WX_APPID');
                let { optKey, menuBtn }  = that.state;
                const pIndex = optKey.split('menu')[0];
                const cIndex = optKey.split('menu')[1];
                if (cIndex == -2) {
                    menuBtn.splice(pIndex, 1);
                    that.setState({
                        menuName: '',
                        menuUrl: ''
                    });
                } else if (cIndex > -1) {
                    menuBtn[pIndex].sub_button.splice(cIndex, 1);
                }
                let menuBtnParams = [];
                for (let i = 0; i < menuBtn.length; i++) {
                    if (menuBtn[i].name) {
                        if (menuBtn[i].name) {
                            let midMenuBtn = menuBtn[i];
                            if (!midMenuBtn.sub_button || midMenuBtn.sub_button.length == 0) delete midMenuBtn.sub_button;
                            menuBtnParams.push(midMenuBtn);
                        }
                    }
                }
                const params = {
                    appId: appId,
                    menu: JSON.stringify({button: menuBtnParams})
                };
                that.props.save(params, 'remove');
   			}
   		});
    }
    setMenu = (k) => { // 点击菜单
        const that = this;
        let { menuBtn, menuName, menuUrl, optMenu, tmplMenu } = that.state;
        if (typeof k == 'object') {
            k = k.key;
        }
        let pIndex = k.split('menu')[0];
        let cIndex = k.split('menu')[1];
        if (optMenu) {
            if (!optMenu.name) optMenu.name = '';
            if (!optMenu.url) optMenu.url = '';
        }
        if (menuName != ( optMenu && optMenu.name) || menuUrl != (optMenu && optMenu.url)) {
            const confirm = Modal.confirm;
            confirm({
                title: '保存菜单',
                content: '您未保存正在编辑的菜单，确认保存？',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    that.handleSubmit(); 
                },
                onCancel() {
                    let curOptMenu = '';
                    if (cIndex == -2) {
                        curOptMenu = menuBtn[pIndex];
                    } else if (cIndex == -1) {
                        curOptMenu = '';
                    } else if (cIndex > -1) {
                        curOptMenu = menuBtn[pIndex].sub_button;
                        if(curOptMenu && curOptMenu.list) {
                            curOptMenu = curOptMenu.list[cIndex]
                        } else {
                            curOptMenu = curOptMenu[cIndex]
                        }
                    }
                    let tagUrl = '';
                    tmplMenu.map((ele) => {
                        if (curOptMenu && ele.url == curOptMenu.url) {
                            tagUrl = ele.name;
                        }
                    });
                    that.setState({
                        isSync: true,
                        tagUrl: tagUrl,
                        optKey: k,
                        optMenu: curOptMenu,
                        ruleName: '',
                        ruleUrl: false,
                        menuName: (curOptMenu && curOptMenu.name) || '' ,
                        menuUrl: (curOptMenu && curOptMenu.url) || ''
                    });
                }
            });
        } else {
            if (typeof k == 'object') {
                k = k.key;
            }
            let pIndex = k.split('menu')[0];
            let cIndex = k.split('menu')[1];
            let curOptMenu = '';
            if (cIndex == -2) {
                curOptMenu = menuBtn[pIndex];
            } else if (cIndex == -1) {
                curOptMenu = '';
            } else if (cIndex > -1) {
                curOptMenu = menuBtn[pIndex].sub_button;
                if(curOptMenu && curOptMenu.list) {
                    curOptMenu = curOptMenu.list[cIndex]
                } else {
                    curOptMenu = curOptMenu[cIndex]
                }
            }
            let tagUrl = '';
            tmplMenu.map((ele) => {
                if (curOptMenu && ele.url == curOptMenu.url) {
                    tagUrl = ele.name;
                }
            });
            that.setState({
                isSync: true,
                tagUrl: tagUrl,
                optKey: k,
                optMenu: curOptMenu,
                ruleName: '',
                ruleUrl: false,
                menuName: (curOptMenu && curOptMenu.name) || '' ,
                menuUrl: (curOptMenu && curOptMenu.url) || ''
            });
        }
    }
    useMenuTmpl = (info) => { // 使用地址模板
        const that = this;
        that.setState({
            menuUrl: info.url,
            tagUrl: info.name,
            ruleUrl: false
        });
    }
    previewImg = (img) => { // 预览
        const that = this;
        if (!img) {
            that.setState({
                previewImg: ''
            });
            return;
        }
        let previewImg = '';
        if (img == 'grzx') {
            previewImg = require('./../../Assets/Images/wechat-user.png');
        } else if (img == 'cplb') {
            previewImg = require('./../../Assets/Images/wechat-product.png');
        } else if (img == 'hkjh') {
            previewImg = require('./../../Assets/Images/wechat-repay.png');
        } else if (img == 'hkjd') {
            previewImg = require('./../../Assets/Images/wechat-loan.png');
        } else if (img == 'wdlb') {
            previewImg = require('./../../Assets/Images/wechat-dot.png');
        } else if (img == 'gzgj') {
            previewImg = require('./../../Assets/Images/wechat-gzgj.png');
        } else if (img == 'HDLB') {
            previewImg = require('./../../Assets/Images/wechat-hdlb.png');
        }
        that.setState({
            previewImg: previewImg
        });
    }
    changeInput(e, inp) { // input 数值变化
        const that = this;
        let { optKey } = this.state;
        let cIndex = optKey.split('menu')[1];
        let inputValue = e.target.value;
        if (inp == 'name') {
            if ((cIndex == -2 && (!inputValue || Config.getLength(inputValue) > 8)) || (cIndex != -2 && (!inputValue || Config.getLength(inputValue) > 16))) {
                that.setState({
                    ruleName: !inputValue ? (cIndex == -2 ? '请输入父菜单名称' : '请输入子菜单名称') : '字数已达到上限'
                });
            } else {
                that.setState({
                    ruleName: ''
                });
            }
            that.setState({
                menuName: inputValue
            });
        }
        if (inp == 'url') {
            if (!inputValue || (inputValue.indexOf('http://') == -1 && inputValue.indexOf('https://') == -1)) {
                that.setState({
                    ruleUrl: true
                });
            } else {
                that.setState({
                    ruleUrl: false
                });
            }
            that.setState({
                menuUrl: inputValue
            });
        }
    }
    closeTag = (e) => {
        e.preventDefault();
        this.setState({
            menuUrl: '',
            tagUrl: ''
        });
    }
    releaseMenu = () => { // 发布菜单
        const that = this;
        let { optKey, optMenu, menuName, menuUrl, menuBtn }  = that.state;
        let midOptKey = '';
        let midOptMenu = '';
        for (let i = 0; i < menuBtn.length; i++) {
            if (menuBtn[i].name && !menuBtn[i].sub_button && !menuBtn[i].url) {
                midOptKey = i + 'menu-2';
                midOptMenu = {
                    name: menuBtn[i].name,
                    url: menuUrl || ''
                };
            }
        }
        if (midOptKey && midOptMenu) {
            that.setState({
                isSync: true,
                tagUrl: '',
                optKey: midOptKey,
                optMenu: midOptMenu,
                ruleName: '',
                ruleUrl: true,
                menuName: (midOptMenu && midOptMenu.name) || '' ,
                menuUrl: midOptMenu && midOptMenu.url
            });
            return;
        }
        let cIndex = '';
        if (optKey) {
            cIndex = optKey.split('menu')[1];
            if ((cIndex == -2 && (!menuName || Config.getLength(menuName) > 8)) || (cIndex != -2 && (!menuName || Config.getLength(menuName) > 16))) {
                that.setState({
                    ruleName: !menuName ? (cIndex == -2 ? '请输入父菜单名称' : '请输入子菜单名称') : '字数已达到上限'
                });
                return;
            } else {
                that.setState({
                    ruleName: ''
                });
            }
            if ((!optMenu || !optMenu.sub_button || optMenu.sub_button.length == 0) && (!menuUrl || (menuUrl.indexOf('http://') == -1 && menuUrl.indexOf('https://') == -1))) {
                that.setState({
                    ruleUrl: true
                });
                return;
            } else {
                that.setState({
                    ruleUrl: false
                });
            }
        }
        if (optMenu && (optMenu.name != menuName || (!optMenu.sub_button && optMenu.url != menuUrl) )) return message.error('发布菜单前请先保存！');
        const confirm = Modal.confirm;
        confirm({
		    title: '确认发布',
		    content: '发布成功后会覆盖原版本，且24小时内对所有用户生效，确认发布?',
		    okText: '确认',
   			cancelText: '取消',
   			onOk() {
                const appId = Config.localItem('WX_APPID');
                that.setState({
                    loading: true
                });
                const params = {
                    appId: appId
                };
                WechatService.releaseWxMenu(params, (res) => {
                    that.setState({
                        loading: false
                    });
                    if(res.code == Config.errorCode.success) {
                        message.success('已发布成功');
                    } else if(res.code == '40119' || res.code == '40120') {
                        message.error('此功能必须是微信认证过的服务号，订阅号暂无法使用');
                    } else {
                        message.error(res.msg);
                    }
                })
   			}
   		});
    }
    render() {
        const that = this;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 6 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 14 },
            }
        };
        const nickName = Config.localItem('WX_WECHAT');
        let { tmplMenu, menuBtn, isSync, optMenu, optKey, menuName, menuUrl, ruleName, ruleUrl, previewImg, tagUrl, loading } = that.state;
        let cIndex = '';
        if (optKey) cIndex = optKey.split('menu')[1];
        return (
            <div className='common-content-container wechatmenu-container'>
                <Spin spinning={loading} tip={'加载中...'}>
                <div data-flex=''>
                    <div className="wechatmenu-mobile" data-flex-box='0'>
                        <div className="wechat-nickname">{nickName}</div>
                        { menuBtn && menuBtn.length > 0 ? 
                        <div className="menu-keyboard">
                            <div className="menu-keyboard-img">
                                <img src={require('../../Assets/Images/icon_keyboard.png')} alt="" />
                            </div>
                            <div className="wechat-menu" data-flex="box:mean">
                                { menuBtn.map((info, index)=> (
                                    <Popover key={index} content={info.sub_button && ((info.sub_button.list && info.sub_button.list.length > 0) || (info.sub_button && info.sub_button.length > 0)) ? <Menu onClick={that.setMenu} >{(info.sub_button.length > 0 ? info.sub_button : info.sub_button.list).map((subInfo, subIndex) => (
                                        <Menu.Item key={index + 'menu' + subIndex} className={optKey == (index + 'menu' + subIndex) ? 'clicked-menu-item' : null}>{subInfo.name}</Menu.Item>
                                    ))}<Menu.Item key={index + 'menu-1'} className={optKey == (index + 'menu-1') ? 'clicked-menu-item' : null}><Icon type="plus" /></Menu.Item></Menu> : (info.name ? <Menu onClick={() => {that.setMenu(index + 'menu-1')}}><Menu.Item className={optKey == (index + 'menu-1') ? 'clicked-menu-item' : null}><Icon type="plus" /></Menu.Item></Menu> : null)} visible={true} getPopupContainer={trigger => trigger.parentNode}>
                                        <RadioButton className={optKey == (index + 'menu-2') ? 'clicked-radio-item' : null} onClick={() => {that.setMenu(index + 'menu-2')}} value={info.name}>{info.name ? <Icon type="appstore-o" style={{ marginRight: '5px' }} /> : <Icon type="plus" /> }{info.name}</RadioButton>
                                    </Popover>
                                )) } 
                            </div>
                        </div> : null }
                    </div>
                    { isSync ? <div className="wechatmenu-content" data-flex-box='1'>
                        <div className="wechatmenu-oper">
                            <div className="wechatmenu-oper-top">
                                <span className="add">{!optMenu || !optMenu.name ? "新建菜单" : optMenu.name}</span>
                                { !optMenu || !optMenu.name ? null : <span className="remove" onClick={this.removeMenu}>删除菜单</span>} 
                            </div>
                            <Form onSubmit={this.handleSubmit} hideRequiredMark={true} className="wechatmenu-oper-form">
                                <FormItem
                                    {...formItemLayout}
                                    label="菜单名称"
                                    extra={cIndex == -2 ? '字数不超过4个汉字或8个字母' : '字数不超过8个汉字或16个字母'}>
                                    <input className="ant-input ant-input-lg" placeholder="菜单名称" value={menuName} maxLength="16" autoComplete="off" onChange={(e) => that.changeInput(e, 'name')} />
                                    { ruleName ? <span className="wechatmenu-error">{ruleName}</span> : null }
                                </FormItem>
                                { (optMenu.name && !optMenu.sub_button) || (optMenu.name && optMenu.url) || (!optMenu.name && !optMenu.url) ? <div style={{height: '320px'}}>
                                    <FormItem label="" {...formItemLayout} className="wechatmenu-form-warn">粉丝点击该菜单会跳转到以下链接</FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="页面地址">
                                        { tagUrl ? <div className="ant-input ant-input-lg"><Tag className="wechatmenu-tag" closable onClose={that.closeTag}>{tagUrl}</Tag></div> : <input className="ant-input ant-input-lg" placeholder="页面地址" value={menuUrl} autoComplete="off" onChange={(e) => that.changeInput(e, 'url')}/> }
                                        { ruleUrl ? <span className="wechatmenu-error">请输入合法的页面地址</span> : null }
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="地址模板">
                                        <ul className="wechatmenu-form-tmpl">
                                            { tmplMenu && tmplMenu.length > 0 && tmplMenu.map((info, index) => (
                                                <li key={index}><span>{info.name}</span><span onClick={() => that.useMenuTmpl(info)}>使用</span><span onClick={() => that.previewImg(info.img)}>预览</span></li>
                                            )) }
                                        </ul>
                                    </FormItem>
                                </div> : <div style={{height: '320px'}}></div> }
                                <FormItem {...formItemLayout} className="wechatmenu-form-btn">
                                    <Button type="primary" htmlType="submit">保存</Button><Button style={{ marginLeft: 20 }} onClick={that.handleReset}>重置</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </div> : <div className="wechatmenu-content" data-flex-box='1' data-flex="main:center cross:center">
                        <div className="wechatmenu-oper-remind">
                            <p>同步微信菜单</p>
                            <p>点击左侧菜单进行操作</p>
                        </div>
                    </div> }
                    <div className={previewImg ? 'wechatmenu-preview' : 'preview-visible'}>
                    <div className='wechatmenu-preview-img' >
                            <div style={{overflow: "scroll", height: "100%", width: "100%"}}>
                                <img className='idcard-img' src={previewImg} alt='' />
                            </div>
                            <img className='wechatmenu-preview-close' alt="wechatmenu-preview-close" src={require('./../../Assets/Images/product_icon_close_pressed.png')} onClick={()=>that.previewImg('')} />                        
                        </div>
                    </div>
                </div>
                <div id="publish" className="wechatset-publish"><Button type="primary" size='large' onClick={this.releaseMenu}>发布</Button></div>
                </Spin>
            </div>
        )
    }
}

const pureWechatMenu = pureRender(WechatMenu);

const formWechatMenu = Form.create()(pureWechatMenu);

export default formWechatMenu;