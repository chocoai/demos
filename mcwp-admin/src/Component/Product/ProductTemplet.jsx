import React, { Component, PropTypes } from 'react'; // 引入了React和PropTypes
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import Slider from 'react-slick';

import { browserHistory } from 'react-router';
import productBg from './../../Assets/Images/product_bg_exhibition-min.png';
import templet from './../../Assets/Images/product-img.png';
import deleteImg from './../../Assets/Images/product_icon_close_pressed.png';
import './style/productTemplet.less';

import { message, Modal, Tabs, Switch, Button, Carousel } from 'antd';
const TabPane = Tabs.TabPane;

class ProductTemplet extends Component {
        constructor(props) {
        super(props);
        this.state = {
            code: props.routeParams.id,
            prepareWordCount:0,
            passWordCount:0,
            rejectWordCount:0,
            prepareContent:"尊敬的客户{客户姓名}，您好！我是{银行名字}的客户经理{客户经理姓名}，您的{贷款名字}现场调查时间为{预约调查时间}，地点为{预约地点}。届时请您准备好相关材料：你本人的身份证、户口本、收入情况证明材料；配偶的身份证、收入情况证明材料；经营场所营业执照、租赁合同、账本、进货票据、存货信息；车辆行驶证、产权证；房屋产权证、房屋合同。有什么问题请随时拨打电话{客户经理手机号}，祝您生活愉快！退订回N",
            passContent:"尊敬的客户{客户姓名}，您好！恭喜您，您的{贷款名字}贷款申请已经审批通过！届时请您携带身份证前往{银行名字}进行面签，祝您生活愉快！退订回N",
            rejectContent:"尊敬的客户{客户姓名}，很抱歉，由于{审批拒绝原因}，您的{贷款名字}贷款申请已被我行审批拒绝！希望有机会能够再为您服务，祝您生活愉快！退订回N",
            data: {
                code: props.routeParams.id,
                msgs: [
                    {
                        msgTpl:"尊敬的客户{客户姓名}，您好！我是{银行名字}的客户经理{客户经理姓名}，您的{贷款名字}现场调查时间为{预约调查时间}，地点为{预约地点}。届时请您准备好相关材料：你本人的身份证、户口本、收入情况证明材料；配偶的身份证、收入情况证明材料；经营场所营业执照、租赁合同、账本、进货票据、存货信息；车辆行驶证、产权证；房屋产权证、房屋合同。有什么问题请随时拨打电话{客户经理手机号}，祝您生活愉快！退订回N",
                        msgType: 1,     //1.调查准备，2.审批通过，3.审批拒绝
                        msgFlag: 1,     //默认开通1,关闭0
                    },
                    {
                        msgTpl:"尊敬的客户{客户姓名}，您好！恭喜您，您的{贷款名字}贷款申请已经审批通过！届时请您携带身份证前往{银行名字}进行面签，祝您生活愉快！退订回N",
                        msgType: 2,     //1.调查准备，2.审批通过，3.审批拒绝
                        msgFlag: 1,     //默认开通1,关闭0
                    },
                    {
                        msgTpl:"尊敬的客户{客户姓名}，很抱歉，由于{审批拒绝原因}，您的{贷款名字}贷款申请已被我行审批拒绝！希望有机会能够再为您服务，祝您生活愉快！退订回N",
                        msgType: 3,     //1.调查准备，2.审批通过，3.审批拒绝
                        msgFlag: 1,     //默认开通1,关闭0
                    }
                ]
            },
            preview: false,
            proType: true,       //经营贷true还是网贷false 
            defaultKey: ''
		};
    }

    componentWillMount(){
        this.getProMsg();
        this.getInfo();
    }
    componentDidMount() {
        // this.setDefaultValue(this.state.data.msgs);
    }
    //获取初始模版，不存在则设置为默认模板
    getProMsg() {
        let params = {
            code: this.state.data.code
        }
        Config.get('/v1/prod/listProdMsg/' + params.code, params, (res) => {
            if(res.code == Config.errorCode.success) {
                if (res.data.length) {
                    this.setProMsg(res.data);
                }
         	} else {
         		// message.error(res.msg);
         	}
        });
    }
    //设置初始模版
    setProMsg(data) {
        this.setState({
            data: {
                code: this.state.data.code,
                msgs: data
            }
        })
        // data.map((item,index)=> {
        //     if( item.msgType == 1 ) {
        //         this.prepareContent.value = item.msgTpl
        //     }
        // })
    }
    //获取产品信息
    //此处有待优化，可以减少本次请求，利用redux或者父组件
    getInfo() {
        let params = {
            code: this.state.code
        };
        Config.get('/v1/prod/info/', params, (res) => {
            if(res.code == Config.errorCode.success) {
                if(res.data.prdType == 2) {
                    this.setState({
                        proType: true,
                        defaultKey: '1'
                    })
                } else {
                    this.setState({
                        proType: false,
                        defaultKey: '2'
                    })
                }
            } else {    
            }
        });
    }
    //设置调查通知初始值
    setDefaultValue(data) {
        data.map((item,index)=> {
            if( item.msgType == 1 ) {
                this.prepareContent.value = item.msgTpl
            }
        })
    }
    
    prepareChange(checked) {
        let newMsgs = this.state.data.msgs;
        let oldMsgs = newMsgs.filter((item, index)=>(
            item.msgType == 1
        ));
        oldMsgs[0].msgFlag = checked? 1 : 0;
        newMsgs = newMsgs.filter((item, index)=>(
            item.msgType != 1
        ));
        newMsgs.push(oldMsgs[0]);
        this.setState({data: {
            code: this.state.data.code,
            msgs:Object.assign(this.state.data.msgs,newMsgs)}
        })
    }
    passChange(checked) {
        let newMsgs = this.state.data.msgs;
        let oldMsgs = newMsgs.filter((item, index)=>(
            item.msgType == 2
        ));
        oldMsgs[0].msgFlag = checked? 1 : 0;
        newMsgs = newMsgs.filter((item, index)=>(
            item.msgType != 2
        ));
        newMsgs.push(oldMsgs[0]);
        this.setState({data: {
            code: this.state.data.code,
            msgs:Object.assign(this.state.data.msgs,newMsgs)}
        })
    }
    rejectChange(checked) {
        let newMsgs = this.state.data.msgs;
        let oldMsgs = newMsgs.filter((item, index)=>(
            item.msgType == 3
        ));
        oldMsgs[0].msgFlag = checked? 1 : 0;
        newMsgs = newMsgs.filter((item, index)=>(
            item.msgType != 3
        ));
        newMsgs.push(oldMsgs[0]);
        this.setState({data: {
            code: this.state.data.code,
            msgs:Object.assign(this.state.data.msgs,newMsgs)}
        })
    }
    prepareTemplet(e) {
        if ( e.target.value.length>300 ) {
            e.target.value = e.target.value.substr(0, 300);
            return;
        }
        let newMsgs = this.state.data.msgs;
        let oldMsgs = newMsgs.filter((item, index)=>(
            item.msgType == 1
        ));
        oldMsgs[0].msgTpl = e.target.value;
        newMsgs = newMsgs.filter((item, index)=>(
            item.msgType != 1
        ));
        newMsgs.push(oldMsgs[0]);
        this.setState({data: {
            code: this.state.data.code,
            msgs:Object.assign(this.state.data.msgs,newMsgs)}
        })
        this.setState({
            prepareWordCount: e.target.value.length
        })
    }
    //调查准备恢复
    prepareBackInitial() {
        let newMsgs = this.state.data.msgs;
        let oldMsgs = newMsgs.filter((item, index)=>(
            item.msgType == 1
        ));
        oldMsgs[0].msgTpl = this.state.prepareContent;
        newMsgs = newMsgs.filter((item, index)=>(
            item.msgType != 1
        ));
        newMsgs.push(oldMsgs[0]);
        this.setState({data: {
            code: this.state.data.code,
            msgs:Object.assign(this.state.data.msgs,newMsgs)}
        })
        this.setState({
            prepareWordCount: this.state.prepareContent.length
        })
        this.prepareContent.value = this.state.prepareContent;
    }

    passTemplet(e) {
        if ( e.target.value.length>300 ) {
            e.target.value = e.target.value.substr(0, 300);
            return;
        }
        let newMsgs = this.state.data.msgs;
        let oldMsgs = newMsgs.filter((item, index)=>(
            item.msgType == 2
        ));
        oldMsgs[0].msgTpl = e.target.value;
        newMsgs = newMsgs.filter((item, index)=>(
            item.msgType != 2
        ));
        newMsgs.push(oldMsgs[0]);
        this.setState({data: {
            code: this.state.data.code,
            msgs:Object.assign(this.state.data.msgs,newMsgs)}
        })
        this.setState({
            passWordCount: e.target.value.length
        })
    }
    passBackInitial () {
        let newMsgs = this.state.data.msgs;
        let oldMsgs = newMsgs.filter((item, index)=>(
            item.msgType == 2
        ));
        oldMsgs[0].msgTpl = this.state.passContent;
        newMsgs = newMsgs.filter((item, index)=>(
            item.msgType != 2
        ));
        newMsgs.push(oldMsgs[0]);
        this.setState({data: {
            code: this.state.data.code,
            msgs:Object.assign(this.state.data.msgs,newMsgs)}
        })
        this.setState({
            passWordCount: this.state.passContent.length
        })
        this.passContent.value = this.state.passContent;
    }



    rejectTemplet(e) {
        if ( e.target.value.length>300 ) {
            e.target.value = e.target.value.substr(0, 300);
            return;
        }
        let newMsgs = this.state.data.msgs;
        let oldMsgs = newMsgs.filter((item, index)=>(
            item.msgType == 3
        ));
        oldMsgs[0].msgTpl = e.target.value;
        newMsgs = newMsgs.filter((item, index)=>(
            item.msgType != 3
        ));
        newMsgs.push(oldMsgs[0]);
        this.setState({data: {
            code: this.state.data.code,
            msgs:Object.assign(this.state.data.msgs,newMsgs)}
        })
        this.setState({
            rejectWordCount: e.target.value.length
        })
    }

    rejectBackInitial () {
        let newMsgs = this.state.data.msgs;
        let oldMsgs = newMsgs.filter((item, index)=>(
            item.msgType == 2
        ));
        oldMsgs[0].msgTpl = this.state.rejectContent;
        newMsgs = newMsgs.filter((item, index)=>(
            item.msgType != 2
        ));
        newMsgs.push(oldMsgs[0]);
        this.setState({data: {
            code: this.state.data.code,
            msgs:Object.assign(this.state.data.msgs,newMsgs)}
        })
        this.setState({
            rejectWordCount: this.state.rejectContent.length
        })
        this.rejectContent.value = this.state.rejectContent;
    }
    
    prepareContentSync(){
        //此步为了让删减的时候高度改变
        this.prepareContent.style.height = 200 + 'px';
        this.prepareContent.style.height = this.prepareContent.scrollHeight + 'px';    
    }
    passContentSync(){  
        this.passContent.style.height = 200 + 'px';
        this.passContent.style.height = this.passContent.scrollHeight + 'px';   
    }
    rejectContentSync(){
        this.rejectContent.style.height = 200 + 'px';
        this.rejectContent.style.height = this.rejectContent.scrollHeight + 'px';  
    }

    previewTask = () => {
        this.setState({
            preview: true
        })
    }
    previewHide = () => {
        this.setState({
            preview: false
        })
    }
    previous() {
        this.slider.slickPrev()
    }
    //保存
    saveProduct = () => {
        let params = Config.serializeObjects(this.state.data);
        for(let key in params) {
            if(params[key] === undefined || params[key] === null || key.indexOf('createDate') != -1 || key.indexOf('updateDate') != -1){
                delete params[key]
            } 
        }
        Config.put('/v1/prod/batchInsertProdNotify', params, (res) => {
            if(res.code == Config.errorCode.success) {
                this.props.router.push({
                    pathname: '/product/all'
                });
         	} else {
                message.error(res.msg);
         	}
        });
    }
    //发布
    nextProduct = () => {
        let params = Config.serializeObjects(this.state.data);
        for(let key in params) {
            if(params[key] === undefined || params[key] === null || key.indexOf('createDate') != -1 || key.indexOf('updateDate') != -1){
                delete params[key]
            } 
        }
        let current = this.props.current + 1;
        Config.put('/v1/prod/batchInsertProdNotify', params, (res) => {
            if(res.code == Config.errorCode.success) {
                // Config.localItem('PRODUCT_STEP', current);
                // this.props.router.push({
                //     pathname: '/product/add/' + current + '/' + params.code
                // });
                this.putProduct();
         	} else {
                message.error(res.msg);
         	}
        });
    }
    putProduct(){
        let params = {
            code: this.state.data.code,
            pubOp: 2
        }
        let current = this.props.current + 1;
        Config.put('/v1/prod/prodPub/' + params.code, params, (res) => {
            if(res.code == Config.errorCode.success) {
                Config.localItem('PRODUCT_STEP', current);
                this.props.router.push({
                    pathname: '/product/add/' + current + '/' + params.code
                });
         	} else {
                message.error(res.msg);
         	}
        });
    }
    render(){
        const settings = {
        };
        const { proType, defaultKey, data } = this.state;
        let prepareDefault,passDefault,rejectDefault;
        this.state.data.msgs.map((item,index)=>{
            if( item.msgType == 1 ) {
                prepareDefault = item.msgTpl
            }
            if( item.msgType == 2 ) {
                passDefault = item.msgTpl
            }
            if( item.msgType == 3 ) {
                rejectDefault = item.msgTpl
            }
        })
        return (
            <div className='productTemplet-container'>
                {
                    defaultKey?
                        <Tabs defaultActiveKey={defaultKey}  onChange={this.changeTab}>
                            {
                                proType ?
                                    <TabPane tab="调查准备通知" key="1">
                                        <div className="productTemplet-content">
                                            <span className="templet-title">是否启用</span>
                                            <Switch checked={!!data.msgs.filter((item, index)=>(item.msgType == 1))[0].msgFlag} onChange={this.prepareChange.bind(this)} />
                                        </div>
                                        <div className="productTemplet-content">
                                            <label htmlFor="taskName" className="templet-title">内容模版</label>
                                            <div className="templet-wrapper">
                                                <textarea  id="taskName" className="templet-content" placeholder="必填项" value={data.msgs.filter((item, index)=>(item.msgType == 1))[0].msgTpl} ref={ref=>{this.prepareContent=ref}} onChange={(e)=>{this.prepareTemplet(e);this.prepareContentSync()}}></textarea>
                                                <p>短信总长度不得超过<span className="word-style">300</span>个字，超过<span className="word-style">65</span>个字时将会拆分成多条短信发送，大括号内内容可进行修改</p>
                                                <Button className="back-initial" type="primary" htmlType="submit" size="large" onClick={()=>this.prepareBackInitial()}>恢复默认</Button>
                                            </div>
                                            <p className="templet-count">{this.state.prepareWordCount || this.state.prepareContent.length}/300</p>
                                        </div>
                                    </TabPane>
                                    :null
                            }

                            <TabPane tab="审批通过通知" key="2">
                                <div className="productTemplet-content">
                                    <span className="templet-title">是否启用</span>
                                    <Switch checked={!!data.msgs.filter((item, index)=>(item.msgType == 2))[0].msgFlag} onChange={this.passChange.bind(this)} />
                                </div>
                                <div className="productTemplet-content">
                                    <label htmlFor="taskName" className="templet-title">内容模版</label>
                                    <div className="templet-wrapper">
                                        <textarea  id="taskName" className="templet-content" placeholder="必填项" value={data.msgs.filter((item, index)=>(item.msgType == 2))[0].msgTpl} ref={ref=>{this.passContent=ref}} onChange={(e)=>{this.passTemplet(e);this.passContentSync()}}></textarea>
                                        <p>短信总长度不得超过<span className="word-style">300</span>个字，超过<span className="word-style">65</span>个字时将会拆分成多条短信发送，大括号内内容可进行修改</p>
                                        <Button className="back-initial" type="primary" htmlType="submit" size="large" onClick={()=>this.passBackInitial()}>恢复默认</Button>
                                    </div>
                                    <p className="templet-count">{this.state.passWordCount || this.state.passContent.length}/300</p>
                                </div>
                            </TabPane>
                            <TabPane tab="审批拒绝通知" key="3">
                                <div className="productTemplet-content">
                                    <span className="templet-title">是否启用</span>
                                    <Switch checked={!!data.msgs.filter((item, index)=>(item.msgType == 3))[0].msgFlag} onChange={this.rejectChange.bind(this)} />
                                </div>
                                <div className="productTemplet-content">
                                    <label htmlFor="taskName" className="templet-title">内容模版</label>
                                    <div className="templet-wrapper">
                                        <textarea  id="taskName" className="templet-content" placeholder="必填项" value={data.msgs.filter((item, index)=>(item.msgType == 3))[0].msgTpl} ref={ref=>{this.rejectContent=ref}} onChange={(e)=>{this.rejectTemplet(e);this.rejectContentSync()}}></textarea>
                                        <p>短信总长度不得超过<span className="word-style">300</span>个字，超过<span className="word-style">65</span>个字时将会拆分成多条短信发送，大括号内内容可进行修改</p>
                                        <Button className="back-initial" type="primary" htmlType="submit" size="large" onClick={()=>this.rejectBackInitial()}>恢复默认</Button>
                                    </div>
                                    <p className="templet-count">{this.state.rejectWordCount || this.state.rejectContent.length}/300</p>
                                </div>
                            </TabPane>
                        </Tabs>:null
                }

                {/*<Button className="templet-preview" type="primary" htmlType="submit" size="large" onClick={this.previewTask}>预览发布</Button>*/}
                <Button className="templet-publishNow" type="primary" htmlType="submit" size="large" onClick={this.nextProduct}>发布</Button>
                <Button className="templet-save" type="primary" htmlType="submit" size="large" onClick={this.saveProduct}>保存</Button>
                <div className={this.state.preview?'preview':'preview-hidden'}>
                    {/*<img className="preview-bg" src={productBg} alt='bg' />*/}
                    <div className='preview-carousel'>
                        <Slider {...settings}>
                            <div>
                                <div className='preivew-detail'>
                                    <h3 className='preivew-detail-title'>申请贷款</h3>
                                </div>
                                <ul>
                                    <li className='preivew-detail-content'>
                                        <p className='preivew-detail-item'>姓名</p>
                                        <input className='preivew-detail-input' type="text" placeholder='请输入姓名' />
                                    </li>
                                    <li className='preivew-detail-content'>
                                        <p className='preivew-detail-item'>联系方式</p>
                                        <input className='preivew-detail-input' type="text" placeholder='请输入手机号' />
                                    </li>
                                    <li className='preivew-detail-content'>
                                        <p className='preivew-detail-item'>验证码</p>
                                        <input className='preivew-detail-input' type="text" placeholder='请输入验证码' />
                                        <p className='preivew-detail-verify'>获取验证码</p>
                                    </li>
                                    <li className='preivew-detail-content'>
                                        <p className='preivew-detail-item'>借款用途</p>
                                        <input className='preivew-detail-input' type="text" placeholder='请选择' />
                                    </li>
                                </ul>
                                <button className='preivew-detail-nexxt'>下一步</button>
                            </div>
                            <div><img className='preivew-img' src={templet} /></div>
                            <div><img className='preivew-img' src={templet} /></div>
                            <div><img className='preivew-img' src={templet} /></div>
                        </Slider>
                        <img className='preivew-delete' src={deleteImg} onClick={this.previewHide} />
                        <Button className="templet-publish" type="primary" htmlType="submit" size="large" onClick={this.nextProduct}>发布</Button>
                    </div>
                </div>
            </div>
        )
    }
}

const pureProductTemplet = pureRender(ProductTemplet);

export default pureProductTemplet;