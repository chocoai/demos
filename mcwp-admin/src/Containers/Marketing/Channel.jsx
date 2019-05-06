import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import ResetSearch from './../../Component/Common/ResetSearch';

import copy from 'copy-to-clipboard'; // 复制

import BaseService from '../../Services/BaseService';
import MarChannelService from '../../Services/MarChannelService'; // services层 营销管理 —— 渠道管理
import CommonService from '../../Services/CommonService'; // services层
import ProductService from '../../Services/ProductService'; // services层 产品管理

import './style/channel.less';
import { browserHistory, Link } from 'react-router';
import qrImg from './../../Assets/Images/img-qr.png';

import { Popover, Spin, Table, DatePicker, Select, Button, Modal, message, Checkbox, Tooltip, Menu, Input } from 'antd';
const Option = Select.Option;
const Search = Input.Search;

/**
 * 营销管理 —— 渠道管理
 * @Author: 魏昌华
 * @Date:   2018-03-05
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2018-03-05
 */
class Channel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false, // 模态框显示与隐藏
            channelVisible: false, // 渠道管理模态框显示与隐藏
            tipCode: null,
            yxqdDict: [],
            searchYxqdDict: [],
            defaultYxqdDict: [],
            params: {
                page: 1,
                rows: 10
            },
            addChannel: {

            },
            defaultaddChannel: {

            },
            addParams: {
                jumpType: 1 // 跳转url类型：1估值管理 2产品
            },
            defaultAddParams: {
                jumpType: 1 // 跳转url类型：1估值管理 2产品
            },
            pagination: {
                showSizeChanger: true, // 是否可以改变 pageSize
                showQuickJumper: true, // 是否可以快速跳转至某页
                pageSizeOptions: ['5', '10', '15'],// 指定每页可以显示多少条
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`
            },
            channels: [], // 渠道管理列表
            hrefs: [], // 渠道短链列表
            dictItems: '',
            jumpPrds: [], // 跳转产品
            checkboxOptions: [],
            checkboxOptionsComm: [],
            defaultTab: props.routeParams.tab ? props.routeParams.tab.split() : ['channellist'],
            chooseTab: props.routeParams.tab ? props.routeParams.tab : 'channellist',
            checkStateList: [],
            channelTitle:'新增渠道',
            selectLb:true
        }
    }
    componentDidMount() {
        const that = this;
        that.isAddChannel = false; // 未新增短链接
        const { params, chooseTab } = that.state;
        // 获取审核状态
		this.getDictItems({code:'shzt'})
        that.getDropProd({ prdStatus: 2 });
        that.getChannelType()
        // 短链列表
        if (chooseTab == 'channellist') {
            that.getChannelList(params);
        } else {
            that.getOpChannels(params);
        }
    }
    async getDictItems(params){
		const res = await CommonService.getDictItems(params);
		this.setState({
			checkStateList: res.data.shzt || [],
		})
	}
    // 切换选项卡
    changeTabs = (e) => {
        if (e.key == 'channellist') { // 积分奖励
            browserHistory.push('/marketing/channel/channellist');
        }
        if (e.key == 'hreflist') { // 积分扣除
            browserHistory.push('/marketing/channel/hreflist');
        }
    }
    async getChannelType() {
        const that = this;
        const res = await MarChannelService.getChannelType();
        if (res.code == Config.errorCode.success) {
            // todo 以后数据量过大优化，对yxqdlb做处理
            let tmpArr = []
            res.data.sort((i1, i2) => i1.index - i2.index).map(i => {
                if (i.dictDTOS && i.dictDTOS.length) {
                    i.dictDTOS.map(i => {
                        i.label = i.ddText
                        i.value = i.ddValue
                        i.key = i.ddValue
                        tmpArr.push(i)
                    })
                }
            })
            that.setState({
                channelTypeData: tmpArr,
                channelType: res.data
            })
            that.getSysDictItems({ code: 'yxqdlb,yxqd,yxqdtj' }, res.data);
        } else {
            message.error(res.msg);
        }
    }
    async getChannelList(params) { // 获取渠道管理列表
        const that = this;
        const res = await MarChannelService.getChannelList(params);
        if (res.code == Config.errorCode.success) {
            const { pagination } = that.state;
            pagination.total = res.recordsTotal;
            that.setState({
                channels: res.data,
                pagination: pagination
            });
        } else {
            message.error(res.msg);
        }
    }
    async getOpChannels(params) { // 获取渠道短链列表
        const that = this;
        const res = await MarChannelService.getOpChannels(params);
        if (res.code == Config.errorCode.success) {
            const { pagination } = that.state;
            pagination.total = res.recordsTotal;
            that.setState({
                hrefs: res.data,
                pagination: pagination
            });
        } else {
            message.error(res.msg);
        }
    }
    getSysDictItems(params, yxqdlb) { // 根据字典代码获取字典列表
        const that = this;
        BaseService.getSysDictItems(params, (res) => {
            if (res.code == Config.errorCode.success) {
                let { addParams, defaultAddParams, addChannel, defaultaddChannel } = that.state;
                const categoryDict = yxqdlb && yxqdlb.length > 0 && yxqdlb[0];
                const category = categoryDict && categoryDict.ddValue;
                const channel = categoryDict && categoryDict.dictDTOS && categoryDict.dictDTOS.length > 0 && categoryDict.dictDTOS[0].ddValue;
                const jumpPage = res.data && res.data.yxqdtj && res.data.yxqdtj.length > 0 && res.data.yxqdtj[0].ddValue;
                let searchYxqdDict = [];
                yxqdlb.forEach((item) => {
                    searchYxqdDict = searchYxqdDict.concat(item.dictDTOS)
                });
                that.setState({
                    dictItems: res.data,
                    addChannel: Object.assign(addChannel, {
                        channelType: category,
                    }),
                    defaultaddChannel: Object.assign(defaultaddChannel, {
                        channelType: category,
                    }),
                    addParams: Object.assign(addParams, {
                        category: category,
                        channel: channel,
                        jumpPage: jumpPage
                    }),
                    searchYxqdDict: searchYxqdDict,
                    yxqdDict: categoryDict && categoryDict.dictDTOS,
                    defaultYxqdDict: categoryDict && categoryDict.dictDTOS,
                    defaultAddParams: Object.assign(defaultAddParams, {
                        category: category,
                        channel: channel,
                        jumpPage: jumpPage
                    })
                });
            } else {
                message.error(res.msg);
            }
        })
    }
    async getDropProd(params) { // 获取产品列表（用于下拉）
        const that = this;
        const res = await ProductService.getDropProd(params);
        if (res.code == Config.errorCode.success) {
            let { addParams, defaultAddParams } = that.state;
            const jumpPrdCode = res && res.data && res.data.length > 0 && res.data[0].code;
            that.setState({
                jumpPrds: res.data,
                addParams: Object.assign(addParams, {
                    jumpPrdCode: jumpPrdCode
                }),
                defaultAddParams: Object.assign(defaultAddParams, {
                    jumpPrdCode: jumpPrdCode
                })
            });
        } else {
            message.error(res.msg);
        }
    }
    doChannel(type) { // 进行增加短链/渠道
        const that = this;
        const { defaultYxqdDict, defaultAddParams, channelType, } = that.state;
        const checkboxOptions = channelType;
        let options = [];
        let optionsComm = [];
        if (checkboxOptions) {
            checkboxOptions.forEach((item, key) => {
                // 没有自有员工处理
                if (item.dictDTOS && item.dictDTOS.length) {
                    options.push({
                        label: item.ddText,
                        value: item.ddValue
                    })
                }
                // 普通渠道要有全部的父类(不包括合作商家)
                if(item.ddValue!=8){
                    optionsComm.push({
                        label: item.ddText,
                        value: item.ddValue
                    })
                }
            })
        }
        if (type == 'channel') {
            that.setState({
                channelVisible: true,
                checkboxOptionsComm: optionsComm,
                channelTitle:'新增渠道',
                selectLb:true
            });
        } else {
            that.setState({
                visible: true,
                checkboxOptions: options,
                yxqdDict: defaultYxqdDict,
                addParams: Object.assign({}, defaultAddParams)
            });
        }

    }
    delChannel(record) { // 删除渠道
        const that = this;
        const { params } = that.state;
        const confirm = Modal.confirm;
        confirm({
            title: '删除短链接',
            content: '确认要删除该短链接吗？',
            okText: '确定',
            cancelText: '取消',
            async onOk() {
                const res = await MarChannelService.delChannel({ code: record.code });
                if (res.code == Config.errorCode.success) {
                    message.success('删除短链接成功！');
                    params.page = 1; // 查询数据重置页码
                    that.getOpChannels(params); // 重新获取数据
                } else {
                    message.error(res.msg);
                }
            }
        });
    }
    searchChannel(value, key) { // 按条件查询渠道
        const that = this;
        const { params, chooseTab } = that.state;
        if (key === 'startTime') { // 开始时间
            if (value) {
                params.startTime = value.format('YYYY-MM-DD');
            } else {
                delete params.startTime;
            }
        }
        if (key === 'endTime') { // 结束时间
            if (value) {
                params.endTime = value.format('YYYY-MM-DD');
            } else {
                delete params.endTime;
            }
        }
        if (key === 'category') { // 类别
            if (value) {
                params.category = value;
            } else {
                delete params.category;
            }
        }
        if (key === 'check') { // 审核状态
            if (value) {
                params.checkStatus = value;
            } else {
                delete params.checkStatus;
            }
        }
        if (key === 'channel') { // 渠道
            if (value) {
                params.word = value;
            } else {
                delete params.word;
            }
        }
        if (key !== 'search') {
            params.page = 1;
            that.setState({
                params: params
            });
        }
        if (chooseTab == 'channellist') {
            that.getChannelList(params);
        } else if (chooseTab == 'hreflist') {
            that.getOpChannels(params);
        }

    }
    async addChannel(key) { // 添加短链
        const that = this;
        const { addParams, params } = that.state;
        if (key == 'cancel') { // 点击取消
            that.setState({
                visible: false
            });
        }
        if (key === 'ok') { // 点击确定
            if (that.isAddChannel) return;
            that.isAddChannel = true;
            if (addParams.jumpType != 2) {
                delete addParams.jumpPrdCode;
                delete addParams.jumpPage;
            }
            const res = await MarChannelService.addChannel(addParams);
            if (res.code == Config.errorCode.success) {
                message.success('新增短链接成功！');
                params.page = 1;
                that.getOpChannels(params); // 重新获取数据
                that.setState({
                    visible: false
                });
                that.addTimer = setTimeout(function () {
                    clearTimeout(that.addTimer);
                    that.isAddChannel = false;
                }, 1500);
            } else {
                that.isAddChannel = false;
                message.error(res.msg);
            }
        }
    }
    // 获取全局唯一id
    async getCommId() {
        let { addChannel } = this.state;
        const res = await MarChannelService.getCommId();
        addChannel.code = res.data;
        this.setState({
            addChannel: addChannel,
        });
    }
    // 添加渠道
    async newChannel(type) {
        let { addChannel, params, defaultaddChannel } = this.state;
        if (type == 'cancel') { // 点击取消
            this.setState({
                channelVisible: false,
                addChannel: Object.assign({}, defaultaddChannel)
            });
        }
        if (type === 'ok') { // 点击确定
            if (!addChannel.channelName) return message.error('请输入渠道！')
            if (!addChannel.channelType) return message.error('请选择类别！')
            if (addChannel.channelType==9&&(!addChannel.telephone)) return message.error('请输入联系方式！')
            if (addChannel.channelName.length > 30 || addChannel.channelName.length < 1) return message.error('请输入1-30个汉字！')
            if(addChannel.telephone&&(!Config.checkTelephone(addChannel.telephone))) return message.error('请输入正确的手机号！');
            if(addChannel.code){
                const res = await MarChannelService.editChannel(addChannel);
                if (res.code == Config.errorCode.success) {
                    message.success('修改渠道成功！');
                    params.page = 1;
                    this.getChannelList(params); // 重新获取数据
                    this.setState({
                        channelVisible: false,
                        addChannel: Object.assign({}, defaultaddChannel)
                    });
                }
            }else{
                const res = await MarChannelService.newChannel(addChannel);
                if (res.code == Config.errorCode.success) {
                    message.success('新增渠道成功！');
                    params.page = 1;
                    this.getChannelList(params); // 重新获取数据
                    this.setState({
                        channelVisible: false,
                        addChannel: Object.assign({}, defaultaddChannel)
                    });
                }
            }
        }
    }
    changeInput = (e) => {
        let { addChannel } = this.state;
        this.setState({
            addChannel: Object.assign(addChannel, { channelName: e.target.value })
        })
    }
    changeTel=(e)=>{
        let { addChannel } = this.state;
        this.setState({
            addChannel: Object.assign(addChannel, { telephone: e.target.value })
        })
    }
    changeCheckbox(checkedValues, key) { // 模态框多选框变化
        const that = this;
        let { addParams, channelType, addChannel } = that.state;
        if (key === 'lb') { // 类别
            // let yxqdlbDict = dictItems.yxqdlb;
            let yxqdDict = null;
            if (checkedValues.length > 0) {
                addParams.category = checkedValues.pop();
            }
            channelType.forEach((item) => {
                if (item.ddValue == addParams.category) yxqdDict = item.dictDTOS;
            });
            addParams.channel = yxqdDict[0].ddValue;
            that.setState({
                addParams: addParams,
                yxqdDict: yxqdDict
            });
        }
        if (key === 'qdlb') { //渠道类别
            this.setState({
                addChannel: Object.assign(addChannel, { channelType: checkedValues.pop() })
            })
        }
        if (key === 'tzz') { // 跳转至
            if (checkedValues.length > 0) {
                addParams.jumpType = checkedValues.pop();
            }
            that.setState({
                addParams: addParams
            });
        }
    }
    changeSelect(value, dateString, key) { // 模态框下来框改变
        const that = this;
        let { addParams } = that.state;
        if (key === 'channel') { // 渠道名称
            addParams.channel = value.key;
            that.setState({
                addParams: addParams
            });
        }
        if (key === 'jumpPrdCode') { // 跳转产品code
            addParams.jumpPrdCode = value.key;
            that.setState({
                addParams: addParams
            });
        }
        if (key === 'jumpPage') { // 产品说明
            addParams.jumpPage = value.key;
            that.setState({
                addParams: addParams
            });
        }
    }
    copyUrl(record) { // 复制链接
        copy(record.shortUrl);
        const that = this;
        that.setState({
            tipCode: record.code
        });
        that.timer = setTimeout(function () {
            clearTimeout(that.timer);
            that.setState({
                tipCode: null
            })
        }, 1000);
    }
    CopyAll = () => {//点击复制文本框内容
        let ele = this.refs.url;
        ele.focus();
        ele.select();
        document.execCommand("Copy");
    }
    changeTable = (page, pageSize) => { // 表格改变
        let that = this;
        const { params, chooseTab } = that.state;
        params.page = page.current;
        params.rows = page.pageSize;
        if (chooseTab == 'channellist') {
            that.getChannelList(params);
        } else if (chooseTab == 'hreflist') {
            that.getOpChannels(params);
        }
    }
    // 获取二维码
    async getQRImg(record) {
        this.setState({
            QRImg: {
                url: record.shortUrl,
                pic: Config.target + "/comm/downQRCode?code=" + record.code
            }
        })
    }
    // 停用/启用
    async checkIsUes(record, status) {
        const that = this;
        let { params } = that.state;
        console.log(params)
        let putParams = {
            merchantCode: record.merchantCode,
            isUse: status
        }
        const res = await MarChannelService.checkIsUes(putParams);
        if (res.code == Config.errorCode.success) {
            message.success('修改成功！');
            that.getChannelList(params);
        } else {
            message.error(res.msg);
        }
    }
    // 获取普通渠道详情
    async getChannelComm(params) {
        let { addChannel } = this.state;
        const res = await MarChannelService.getChannelComm(params);
        if (res.code == Config.errorCode.success) {
            this.setState({
                addChannel: Object.assign(addChannel, { channelType: res.data.channelType, channelName: res.data.channelName,telephone:res.data.telephone })
            })
        } else {
            message.error(res.msg);
        }
    }
    // 编辑普通渠道
    editChannel(record) {
        const that = this;
        const { channelType,addChannel} = that.state;
        const checkboxOptions = channelType;
        let optionsComm = [];
        if (checkboxOptions) {
            checkboxOptions.forEach((item, key) => {
                if(item.ddValue!=8){
                    optionsComm.push({
                        label: item.ddText,
                        value: item.ddValue
                    })
                }
            })
        }
        let params = {
            code: record.code
        }
        this.getChannelComm(params)
        that.setState({
            channelVisible: true,
            addChannel:Object.assign(addChannel,{code:record.code}),
            checkboxOptionsComm: optionsComm,
            channelTitle:'编辑渠道',
            selectLb:false
        });
    }
    render() {
        const that = this;
        const { QRImg,selectLb } = that.state;
        const content = (
            <div>
                {QRImg ?
                    <div>
                        <input type="text" className="url-input" defaultValue={QRImg.url} ref='url' /><Button style={{ display: 'inline-block' }} onClick={() => this.CopyAll()}>复制</Button><br />
                        <img className='QR-img' style={{ width: '180px', height: '180px' }} src={QRImg.pic} alt='product-qrc-img' />
                    </div>
                    : <p className='product-word'>二维码获取失败</p>
                }
            </div>
        );
        const channelColumns = [{
            title: '类别',
            dataIndex: 'channelTypeText',
            key: 'channelTypeText',
            render: (text, record) => (
                text ?
                    <span>{text}</span>
                    :
                    <span>——</span>
            )
        }, {
            title: '渠道',
            dataIndex: 'channelName',
            key: 'channelName',
            render: (text, record) => (
                text ?
                    <span>{text}</span>
                    :
                    <span>——</span>
            )
        }, {
            title: '审核状态',
            dataIndex: 'checkStatusText',
            key: 'checkStatusText',
            render: (text, record) => (
                text ?
                    <span>{text}</span>
                    :
                    <span>——</span>
            )
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text, record) => (
                <span>
                    {text ? Config.formatDateTime(text) : '——'}
                </span>
            )
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <div>
                    {record.channelType == 8 ?
                        <div>
                            {record.checkStatus == 1 || record.checkStatus == 2 ?
                                <div>
                                    <Link to={'/marketing/channeledit/' + record.merchantCode} style={{ marginRight: '10px' }}>
                                        <span style={{ cursor: 'pointer', 'color': '#1c7bef' }}>编辑</span>
                                    </Link>
                                    {record.checkStatus == 1 ? <Link to={'/marketing/channeldetail/' + record.merchantCode + '?type=1'}>
                                        <span style={{ cursor: 'pointer', 'color': '#1c7bef' }}>审核</span>
                                    </Link> :
                                        <span>
                                            {record.merchantIsUse == 0 ? <span style={{ cursor: 'pointer', 'color': '#1c7bef' }} onClick={() => this.checkIsUes(record, 1)}>启用</span> : <span style={{ cursor: 'pointer', 'color': '#1c7bef' }} onClick={() => this.checkIsUes(record, 0)}>停用</span>}
                                        </span>
                                    }

                                </div> : <Link to={'/marketing/channeldetail/' + record.merchantCode}>
                                    <span style={{ cursor: 'pointer', 'color': '#1c7bef' }}>查看</span>
                                </Link>}
                        </div> :
                        <span style={{ cursor: 'pointer', 'color': '#1c7bef' }} onClick={() => this.editChannel(record)}>编辑</span>
                    }
                </div>
            )
        }]
        const columns = [{
            title: '类别',
            dataIndex: 'categoryText',
            key: 'categoryText',
            width: 100,
        }, {
            title: '渠道',
            dataIndex: 'channelText',
            key: 'channelText',
            width: 150,
            render: (text, record) => (
                text ?
                    <span>{text}</span>
                    :
                    <span>——</span>
            )
        }, {
            title: '跳转页面',
            dataIndex: 'jumpPageText',
            key: 'jumpPageText',
            width: 120,
        }, {
            title: '短链',
            dataIndex: 'shortUrl',
            key: 'shortUrl',
            width: 200,
            render: (text, record) => (
                text ?
                    <span>
                        <Tooltip placement="bottom" title='已复制' trigger={'click'} visible={record.code == tipCode} >
                            {text}
                            <span onClick={() => that.copyUrl(record)} className="copy-img"></span>
                            {/* <span className='qr-info'> */}
                            <Popover placement="leftTop" content={content} trigger="hover">
                                <img className='qr-preivew' src={qrImg} onMouseOver={() => this.getQRImg(record)} alt='product-qr-info' />
                            </Popover>
                            {/* </span> */}
                        </Tooltip>
                    </span>
                    :
                    <span>——</span>
            )
        }, {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
            width: 150,
            render: (text, record) => (
                <span>
                    {Config.formatDateTime(text)}
                </span>
            )
        }, {
            title: '操作',
            key: 'action',
            width: 100,
            render: (text, record) => (
                <span style={{ cursor: 'pointer', 'color': '#f00' }} onClick={() => that.delChannel(record)}>删除</span>
            )
        }];
        const { loading, channels, pagination, dictItems, visible, tipCode, checkboxOptions, addParams, jumpPrds, yxqdDict, defaultTab, checkStateList, chooseTab, hrefs, channelVisible, addChannel,checkboxOptionsComm ,channelTitle} = that.state;
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="channel-tabs">
                    <Menu className="channel-search-menu" defaultSelectedKeys={defaultTab} mode="horizontal" onClick={this.changeTabs}>
                        <Menu.Item key="channellist">渠道管理</Menu.Item>
                        <Menu.Item key="hreflist">短链管理</Menu.Item>
                    </Menu>
                </div>
                <div className="common-console-container channel-container">
                    <div className="common-search-section">
                        <div className="date-search-container">
                            <div className='search-item' data-flex="dir:left">
                                <DatePicker
                                    ref='startTime'
                                    placeholder="开始时间"
                                    style={{ width: 150 }}
                                    onChange={value => that.searchChannel(value, 'startTime')}
                                    format='YYYY-MM-DD'
                                    disabledDate={that.disabledStartDate}
                                    getCalendarContainer={trigger => trigger.parentNode}
                                />
                                <DatePicker
                                    placeholder="结束时间"
                                    style={{ width: 150 }}
                                    onChange={value => that.searchChannel(value, 'endTime')}
                                    format='YYYY-MM-DD'
                                    disabledDate={that.disabledEndDate}
                                    getCalendarContainer={trigger => trigger.parentNode}
                                />
                            </div>
                            <Select
                                className="search-item"
                                style={{ width: 150 }}
                                placeholder="类别"
                                allowClear
                                optionFilterProp="children"
                                onChange={value => that.searchChannel(value, 'category')}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {
                                    dictItems && dictItems.yxqdlb && dictItems.yxqdlb.map((item, index) => (
                                        <Option value={item.ddValue + ''} key={index}>{item.ddText}</Option>
                                    ))
                                }
                            </Select>
                            {chooseTab == 'channellist' ? <Select
                                className="search-item"
                                style={{ width: 150 }}
                                placeholder="审核状态"
                                allowClear
                                optionFilterProp="children"
                                onChange={value => that.searchChannel(value, 'check')}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {
                                    checkStateList.map((item, index) => (
                                        <Option value={item.ddValue + ''} key={index}>{item.ddText}</Option>
                                    ))
                                }
                            </Select> : null}
                            <Search placeholder="渠道名称" onSearch={value => that.searchChannel(value, 'channel')} className='search-item' ref='searchData' style={{ width: 180 }} />
                            <ResetSearch />
                        </div>
                    </div>
                    <div className="common-action-section">
                        {chooseTab == 'channellist' ?
                            <div><Button onClick={() => that.doChannel('channel')} className="common-btn" icon="plus" type="primary">新渠道</Button><Button className="common-btn channel-btn" type="primary"><Link className='channel-batch' to={'/marketing/channelBatchAdd'}>自有员工批量创建</Link></Button> </div>: <Button onClick={() => that.doChannel('href')} className="common-btn" icon="plus" type="primary">新短链</Button>}
                    </div>
                    {chooseTab == 'channellist' ? <Table
                        rowKey={record => record.code}
                        pagination={pagination}
                        columns={channelColumns}
                        className="common-content-container"
                        dataSource={channels}
                        onChange={that.changeTable}
                    /> : <Table
                            rowKey={record => record.code}
                            pagination={pagination}
                            columns={columns}
                            className="common-content-container"
                            dataSource={hrefs}
                            onChange={that.changeTable}
                        />}
                    <Modal
                        title={channelTitle}
                        className="market-channel-modal"
                        key={this.state.mainModalKey}
                        visible={channelVisible}
                        onCancel={() => that.newChannel('cancel')}
                        footer={null}
                    >
                        <div className="form-item" style={{ marginBottom: '20px' }}>
                            <p className="form-item-title" style={{width:'100px'}}>类别</p>
                            <Checkbox.Group className="channel-input"disabled={!selectLb} onChange={(e) => that.changeCheckbox(e, 'qdlb')} options={checkboxOptionsComm} value={[addChannel && addChannel.channelType]}>
                            </Checkbox.Group>
                        </div>
                        <div className="form-item">
                            <p className="form-item-title">渠道</p>
                            <Input placeholder="渠道名称" value={addChannel && addChannel.channelName} onChange={this.changeInput} />
                        </div>
                        {addChannel && addChannel.channelType==9?<div className="form-item">
                            <p className="form-item-title">联系方式</p>
                            <Input placeholder="联系方式" value={addChannel && addChannel.telephone} onChange={this.changeTel} />
                        </div>:null}
                        <div style={{ textAlign: 'center', marginTop: '20px', width: '100%' }}>
                            <Button key="ok" type="primary" className="common-btn reset-button" onClick={() => that.newChannel('ok')}>确定</Button>
                            <Button key="cancel" className="common-btn reset-button" style={{ marginLeft: '20px' }} onClick={() => that.newChannel('cancel')}>取消</Button>
                        </div>
                    </Modal>
                    <Modal
                        title="新增短链"
                        className="market-channel-modal"
                        key={this.state.mainModalKey}
                        visible={visible}
                        onCancel={() => that.addChannel('cancel')}
                        footer={null}
                    >
                        <div className="form-item" style={{ marginBottom: '20px' }}>
                            <p className="form-item-title">类别</p>
                            <Checkbox.Group className="channel-input" onChange={(e) => that.changeCheckbox(e, 'lb')} options={checkboxOptions} value={[addParams && addParams.category]}>
                            </Checkbox.Group>
                        </div>
                        <div className="form-item">
                            <p className="form-item-title">渠道</p>
                            <Select
                                labelInValue
                                placeholder="渠道名称"
                                optionFilterProp="children"
                                style={{ width: 140, height: 32 }}
                                value={{ key: addParams.channel }}
                                onChange={(value, options) => that.changeSelect(value, options, 'channel')}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {
                                    yxqdDict && yxqdDict.map((item, index) => (
                                        <Option value={item.ddValue + ''} key={index}>{item.ddText}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className="form-item big-checkbox">
                            <p className="form-item-title">跳转至</p>
                            <Checkbox.Group onChange={(e) => that.changeCheckbox(e, 'tzz')} options={[{
                                label: '估值工具',
                                value: 1
                            }, {
                                label: '贷款产品',
                                value: 2
                            }, {
                                label: '营销推广页',
                                value: 3
                            }]} value={[addParams && addParams.jumpType]}>
                            </Checkbox.Group>
                        </div>
                        {addParams.jumpType == 2 ?
                            <div className="form-item">
                                <p className="form-item-title">贷款产品</p>
                                <Select
                                    labelInValue
                                    placeholder="链接地址"
                                    optionFilterProp="children"
                                    style={{ width: 140, height: 32 }}
                                    value={{ key: addParams.jumpPrdCode }}
                                    onChange={(value, options) => that.changeSelect(value, options, 'jumpPrdCode')}
                                    getPopupContainer={trigger => trigger.parentNode}
                                >
                                    {
                                        jumpPrds && jumpPrds.map((item, index) => (
                                            <Option value={item.code} key={index}>{item.prdName}</Option>
                                        ))
                                    }
                                </Select>
                                <Select
                                    labelInValue
                                    placeholder="产品说明"
                                    optionFilterProp="children"
                                    style={{ width: 140, height: 32 }}
                                    value={{ key: addParams.jumpPage }}
                                    onChange={(value, options) => that.changeSelect(value, options, 'jumpPage')}
                                    getPopupContainer={trigger => trigger.parentNode}
                                >
                                    {
                                        dictItems && dictItems.yxqdtj && dictItems.yxqdtj.map((item, index) => (
                                            <Option value={item.ddValue + ''} key={index}>{item.ddText}</Option>
                                        ))
                                    }
                                </Select>
                            </div>
                            : null
                        }
                        <div style={{ textAlign: 'center', marginTop: '20px', width: '100%' }}>
                            <Button key="ok" type="primary" className="common-btn reset-button" onClick={() => that.addChannel('ok')}>确定</Button>
                            <Button key="cancel" className="common-btn reset-button" style={{ marginLeft: '20px' }} onClick={() => that.addChannel('cancel')}>取消</Button>
                        </div>
                    </Modal>
                </div>
            </Spin>
        );
    }
}

export default Channel;
