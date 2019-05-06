import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Spin, message, Row, Col, Card, Pagination, Tabs, Popover, Button, Modal } from 'antd';
import BaseService from '../../Services/BaseService';
import SliderImg from '../../Component/Common/SliderImg';
import ModTemModal from '../../Component/Modal/ModTemModal';
import defaultImg from './../../Assets/Images/img_default.png';
import editImg from './../../Assets/Images/market-edit-tmp.png';
// import yxtgyTmp1 from './../../Assets/Images/yxtgy-tmp1.png';
// import yxtgyTmp2 from './../../Assets/Images/yxtgy-tmp2.png';
import qrImg from './../../Assets/Images/img-qr.png';
import './style/marketTemplate.less';
import copy from 'copy-to-clipboard'; // 复制
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
class MarketTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tipCode: null,
            QRImg: null,
            defaultTab: 'cpmb',
            markeyTpls: [],
            loading: false,
            coverTpls: null,
            preTplurl: null,
            page: 1,
            pagination: {
                showSizeChanger: true, // 是否可以改变 pageSize
                // showQuickJumper: true, // 是否可以快速跳转至某页
                pageSizeOptions: ['20'], // 指定每页可以显示多少条
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`
            },
            paginationMarket: {
                showSizeChanger: true, // 是否可以改变 pageSize
                // showQuickJumper: true, // 是否可以快速跳转至某页
                pageSizeOptions: ['20'], // 指定每页可以显示多少条
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`
            },
            addTemModal: false,
            prodList: [],
            commCode: '',
            onOff: false,    //保存按钮开关
            codeKey: 0
        }
    }

    componentDidMount() {
        let that = this;
        const enterprCode = Config.localItem('ENTERP_CODE');  // 当前用户企业
        that.getCoverTpls()//获取模板数据
        that.getMarkeyTpls()//获取模板数据
        that.getProdList(enterprCode)
    }
    async getQRCode(params) {
        const that = this;
        const res = await BaseService.getQRCode(params);
        let codeKey = that.state.codeKey
        if (res.code == Config.errorCode.success) {
            that.setState({
                QRImg: res.data,
                codeKey: codeKey + 1
            });
        } else {
            message.error(res.msg);
        }
    }
    getCoverTpls = () => {//获取模板数据
        const { page } = this.state;
        let params = {
            page: page,
            rows: 20,
            type: 1,
        }
        Config.get('/v1/prod/coverTpls', params, (res) => {
            if (res.code == 0) {
                res.data.map((item, index) => {
                    item.indexKey = index
                })
                const pagination = this.state.pagination;
                pagination.total = res.recordsTotal; // 总页数
                pagination.rows = params.rows; // 页数
                pagination.current = params.page; // 当前页数
                this.setState({
                    coverTpls: res.data,
                    pagination
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    getMarkeyTpls = () => {//获取模板数据
        const { page } = this.state;
        let that = this
        let params = {
            page: page,
            rows: 20,
            type: 2,
        }
        Config.get('/v1/prod/coverTpls', params, (res) => {
            if (res.code == 0) {
                res.data.map((item, index) => {
                    item.indexKey = index
                })
                const paginationMarket = that.state.paginationMarket;
                paginationMarket.total = res.recordsTotal; // 总页数
                paginationMarket.rows = params.rows; // 页数
                paginationMarket.current = params.page; // 当前页数
                that.setState({
                    markeyTpls: res.data,
                    paginationMarket
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    // 新增或编辑
    addProdTpl = (params) => {
        const {editMode} = this.state
        if (editMode) {
            Config.put('/v1/prodTpl/edit', params, (res) => {
                if (res.code == 0) {
                    this.setState({
                        editMode: false,
                        addTemModal: false,
                        onOff: false
                    })
                    message.success('上传成功!');
                    this.getCoverTpls()
                    this.getMarkeyTpls()
                } else {
                    message.error(res.msg);
                }
            });
        } else {
            Config.post('/v1/prodTpl', params, (res) => {
                if (res.code == 0) {
                    this.setState({
                        editMode: false,
                        addTemModal: false,
                        onOff: false
                    })
                    message.success('上传成功!');
                    this.getCoverTpls()
                    this.getMarkeyTpls()
                } else {
                    message.error(res.msg);
                }
            });
        }
    }
    sliderShow = (e) => {
        this.setState({
            preTplurl: e.tplViewUrl,
        })
        if (!this.refs.sliderImg) message.error('暂无数据')
        this.refs.sliderImg.previewShow()
    }
    setDefault = (e) => {//设置默认
        // let params = e.fileCode;
        Config.get('/v1/prodTpl/defult/' + e.tplType, '', (res) => {
            if (res.code == 0) {
                message.success(res.msg);
                this.getCoverTpls();
                this.getMarkeyTpls();
            } else {
                message.error(res.msg);
            }
        });
    }
    deleteTpl = (e, item, type) => {
        let that = this
        let params = {
            tplCode: item.code,
            action: type
        }
        let title, content
        if (type) {
            title = '确认禁用'
            content = '是否要禁用该模板？'
        } else {
            title = '确认启用'
            content = '是否要启用该模板？'
        }
        confirm({
            title: title,
            content: content,
            onOk() {
                Config.delete('/v1/prodTpl', params, (res) => {
                    if (res.code == 0) {
                        message.success(res.msg);
                        that.getCoverTpls();
                        that.getMarkeyTpls();
                    } else {
                        message.error(res.msg);
                    }
                });
            },
            onCancel() {
            },
        });
    }
    copyUrl(code) { // 复制链接
        const that = this;
        copy(that.getYxtgyUrl());
        that.setState({
            tipCode: code
        });
        that.timer = setTimeout(function () {
            clearTimeout(that.timer);
            that.setState({
                tipCode: null
            })
        }, 1000);
    }
    getQRImg(e, item) {
        const that = this;
        that.getQRCode({ url: that.getYxtgyUrl(item) });
    }
    getYxtgyUrl(item) {
        let copyUrl = item.jumpUrl;
        if (copyUrl.indexOf('http') == -1) {
            let target = window.location.protocol + '//' + window.location.host;
            if (target.indexOf('zhudb.com') == -1) target = 'http://mcwp.test.zhudb.com'; // TODO 临时性写法
            copyUrl = target + copyUrl + '?tplType=' + item.tplType + '&enterpriseCode=' + Config.localItem('ENTERP_CODE');
        }
        return copyUrl;
    }
    getProdList(enterprCode) { // 行业规则详情
        const that = this
        let params = {
            enterprCode: enterprCode
        }
        Config.get('/comm/prod/list/' + enterprCode, params, (res) => {
            if (res.code == Config.errorCode.success) {
                let data = res.data
                if (data && data.length > 0) {
                    let newArr = [];
                    for (let i = 0; i < data.length; i++) {
                        newArr.push({
                            ddItem: 'cplb',
                            ddText: data[i].prdName,
                            ddValue: data[i].code,
                            dictDTOS: [],
                            index: i + 10,
                            parentValue: '0'
                        })
                    }
                    that.setState({
                        prodList: that.state.prodList.concat(newArr)
                    })
                }

            } else {
                message.error(res.msg);
            }
        });
    }
    getCommCode() { // 获取唯一code
        const that = this
        Config.get('/comm/uuid', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                that.setState({
                    commCode: res.data
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    changeTab = (activeKey) => {
        this.setState({
            defaultTab: activeKey
        });
    }
    showModal() {
        this.setState({
            commCode: '',
            addTemModal: true
        })
        this.getCommCode()
    }
    editTpl(commCode) {
        this.setState({
            editMode: true,
            addTemModal: true,
            commCode
        })
    }
    closeModal() {
        this.setState({
            editMode: false,
            addTemModal: false
        })
    }
    CopyAll = () => {//点击复制文本框内容
        let ele = this.refs.url;
        ele.focus();
        ele.select();
        document.execCommand("Copy");
    }
    closeOnOff = () => {
        this.setState({
            onOff: true
        })
    }
    render() {
        const that = this;
        const { editMode, loading, coverTpls, preTplurl, defaultTab, QRImg, addTemModal, prodList, commCode, markeyTpls, onOff, codeKey } = that.state;
        const content = (
            <div>
                {QRImg ?
                    <div key={codeKey}>
                        <input type="text" className="url-input" value={QRImg.prdUrl} readOnly ref='url' /><Button style={{ display: 'inline-block' }} onClick={() => this.CopyAll()}>复制</Button><br />
                        <img className='QR-img' style={{ width: '180px', height: '180px' }} src={`data:image/png;base64,${QRImg.picture}`} alt='product-qrc-img' />
                    </div>
                    : <p className='product-word'>二维码获取失败</p>
                }
            </div>
        );
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="common-tab-container marketTemplate-container ">
                    <Tabs defaultActiveKey={defaultTab} onChange={this.changeTab} animated={false}>
                        <TabPane tab="产品模板" key="cpmb">
                            <div className="common-tab-content">
                                <Button className="common-btn" onClick={() => this.showModal()} icon="plus" type="primary">新模板</Button>
                                <Row type="flex" justify="start" gutter={16} style={{ padding: "30px 0" }}>
                                    {
                                        coverTpls && coverTpls.map((item, index) => (
                                            <Col key={item.enterpriseId} className="market-tpl-col" span={6} key={index}>
                                                <Card style={{ width: 220, height: 314 }} bodyStyle={{ padding: 0 }}>
                                                    <div className='market-tpl-img'>
                                                        {item.isdefault ? <img className='default-img' src={defaultImg} alt="defaultImg" /> : null}
                                                        {
                                                            item.code ?
                                                                <div className='market-tpl-edit'>
                                                                    <img className='tpl-edit' src={editImg} alt='editImg' onClick={() => this.editTpl(item.code)} />
                                                                </div> : null
                                                        }
                                                        {item.tplViewUrl ?
                                                            <img className='template-img' style={{ width: '100%' }} src={`${item.tplViewUrl}`} alt='template-img' /> : null
                                                        }
                                                    </div>
                                                    <div className='market-tpl-content'>
                                                        <p className="card-preview" onClick={this.sliderShow.bind(this, item)}>预览</p>
                                                        {item.isdefault || item.isdel ?
                                                            <p className="card-set-false" >默认</p> :
                                                            <p className="card-set" onClick={this.setDefault.bind(this, item)}>默认</p>
                                                        }
                                                        {index > 2 && !item.isdefault ? item.isdel ?
                                                            <p className="card-delete-false" onClick={(e) => this.deleteTpl(e, item, false)}>启用</p> :
                                                            <p className="card-delete" onClick={(e) => this.deleteTpl(e, item, true)}>禁用</p> : <p className="card-default-disabled cursor-none">禁用</p>
                                                        }
                                                        <p className="card-tpl-name">{item.tplName}</p>
                                                    </div>
                                                </Card>
                                            </Col>
                                        ))
                                    }
                                    <Col span={24}>
                                        <Pagination defaultCurrent={1} total={this.state.pagination.total} />
                                    </Col>
                                </Row>
                            </div>
                        </TabPane>
                        <TabPane tab="营销推广页" key="yxtgy">
                            <div className="common-tab-content">
                                <Button className="common-btn market-btn" onClick={() => this.showModal()} icon="plus" type="primary">新模板</Button>
                                <Row type="flex" justify="start" gutter={16} style={{ padding: "10px 20px" }}>
                                    {
                                        markeyTpls && markeyTpls.map((item, index) => (
                                            <Col key={item.code} className="market-tpl-col" span={6}>
                                                <Card style={{ width: 220, height: 314 }} bodyStyle={{ padding: 0 }}>
                                                    <div className='market-tpl-img'>
                                                        {item.tplViewUrl ?
                                                            <img className='template-img' style={{ width: '100%' }} src={`${item.tplViewUrl}`} alt='template-img' /> : null
                                                        }
                                                        {
                                                            item.code ?
                                                                <div className='market-tpl-edit'>
                                                                    <img className='tpl-edit' src={editImg} alt='editImg' onClick={() => this.editTpl(item.code)} />
                                                                </div> : null
                                                        }
                                                    </div>
                                                    <div className='market-tpl-content'>
                                                        <p className="card-preview markey-card-p" onClick={this.sliderShow.bind(this, item)}>预览</p>
                                                        {item.isdel ?
                                                            <p className="card-delete-false" onClick={(e) => this.deleteTpl(e, item, false)}>启用</p> :
                                                            <p className="card-delete" onClick={(e) => this.deleteTpl(e, item, true)}>禁用</p>
                                                        }
                                                        <div className="card-tpl-name">{item.tplName}
                                                            <div className='qr-info'>
                                                                <Popover placement="rightTop" content={content} trigger="hover">
                                                                    `<img src={qrImg} onMouseOver={(e) => this.getQRImg(e, item)} alt='qr-info' />
                                                                </Popover>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Col>
                                        ))
                                    }
                                    {
                                        markeyTpls && markeyTpls.length > 0 && <Col span={24}>
                                            <Pagination defaultCurrent={1} total={this.state.paginationMarket.total} />
                                        </Col>
                                    }
                                </Row>
                            </div>
                        </TabPane>
                    </Tabs>
                    {
                        coverTpls ? <div className='slider-img'><SliderImg preTplurl={preTplurl} onChange={this.getSliderImg} ref='sliderImg' /></div> : null
                    }
                    {
                        addTemModal && <div className='market-modal'><ModTemModal defaultTab={defaultTab} editMode = {editMode} addProdTpl={this.addProdTpl} onOff={onOff} closeOnOff={this.closeOnOff} commCode={commCode} prodList={prodList} mVisible={addTemModal} closeModal={() => this.closeModal()}></ModTemModal></div>
                    }
                </div>
            </Spin>
        )
    }
}

export default MarketTemplate;
