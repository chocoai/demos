import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import { message, Modal, Popover, Button } from 'antd';
import ProductService from '../../Services/ProductService';
import { browserHistory } from 'react-router';
import qrImg from './../../Assets/Images/img-qr.png';
import './style/productItem.less';

class ProductItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: Config.localItem('CUR_ROLE'),
            QRImg: {},
            coverFlag: false,
        }
    }
    delPro = (code, prdName, params) => { // 删除产品
        const confirm = Modal.confirm;
        let { delProduct } = this.props;
        params.page = 1; // 重置页码
        confirm({
            title: '删除' + prdName,
            content: '确定删除' + prdName + '产品吗?',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                delProduct(params, code);
            }
        });
    }

    prodPub = (info, prdStatus) => { // 产品发布、停贷、启用
        if (prdStatus == 3) { // 停贷
            const confirm = Modal.confirm;
            confirm({
                title: '停用' + info.prdName,
                content: '确定停用' + info.prdName + '产品吗?',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    let params = {
                        code: info.code,
                        pubOp: 3,
                        coverFlag: true,
                    }
                    Config.put('/v1/prod/prodPub', params, (res) => {   //停贷
                        if (res.code == 0) {
                            message.success('已停贷！');
                            browserHistory.push('/product/all');
                        } else {
                            message.error(res.msg);
                        }
                    });
                }
            });
        } else if (prdStatus == 2) { // 发布
            // let that = this;
            if (info && info.creditOn) {
                let params = {
                    code: info.code,
                    pubOp: 2,
                    coverFlag: true,
                }
                Config.put('/v1/prod/prodPub', params, (res) => {   // 添加
                    if (res.code == 0) {
                        message.success('发布成功！');
                        browserHistory.push('/product/share/' + params.code);
                    } else {
                        message.error(res.msg);
                    }
                });
                // that.getCreditOn((res) => {
                //     if (!res) {

                //     } else {
                //         const confirm = Modal.confirm;
                //         confirm({
                //             title: '覆盖确认',
                //             content: res.prdName + '产品已经开启预授信模式，发布将替换原有预授信模式产品，是否发布该产品？',
                //             okText: '确定',
                //             cancelText: '取消',
                //             onOk() {
                //                 let params = {
                //                     code: info.code,
                //                     pubOp: 2,
                //                     coverFlag: true,
                //                 }
                //                 Config.put('/v1/prod/prodPub', params, (res) => {   // 添加
                //                     if (res.code == 0) {
                //                         message.success('发布成功！');
                //                         // browserHistory.push('/product/all' );
                //                         browserHistory.push('/product/share/' + params.code);
                //                     } else {
                //                         message.error(res.msg);
                //                     }
                //                 });
                //             }
                //         });
                //     }
                // })
            } else {
                let params = {
                    code: info.code,
                    pubOp: 2,
                    coverFlag: true,
                }
                Config.put('/v1/prod/prodPub', params, (res) => {   // 添加
                    if (res.code == 0) {
                        message.success('发布成功！');
                        // browserHistory.push('/product/all' );
                        browserHistory.push('/product/share/' + params.code);
                    } else {
                        message.error(res.msg);
                    }
                });
            }
        } else { // 启用
            // let that = this;
            if (info && info.creditOn) {
                let params = {
                    code: info.code,
                    pubOp: 4,
                    coverFlag: true,
                }
                Config.put('/v1/prod/prodPub', params, (res) => {   // 添加
                    if (res.code == 0) {
                        message.success('启用成功！');
                        // browserHistory.push('/product/all' );
                        browserHistory.push('/product/share/' + params.code);
                    } else {
                        message.error(res.msg);
                    }
                });
                // that.getCreditOn((res) => {
                //     if (!res) {

                //     } else {
                //         const confirm = Modal.confirm;
                //         console.log(res.data.prdName)
                //         confirm({
                //             title: '覆盖确认',
                //             content: res.prdName + '产品已经开启预授信模式，发布将替换原有预授信模式产品，是否发布该产品？',
                //             okText: '确定',
                //             cancelText: '取消',
                //             onOk() {
                //                 let params = {
                //                     code: info.code,
                //                     pubOp: 4,
                //                     coverFlag: true,
                //                 }
                //                 Config.put('/v1/prod/prodPub', params, (res) => {
                //                     if (res.code == 0) {
                //                         message.success('启用成功！');
                //                         // browserHistory.push('/product/all' );
                //                         browserHistory.push('/product/share/' + params.code);
                //                     } else {
                //                         message.error(res.msg);
                //                     }
                //                 });
                //             }
                //         });
                //     }
                // })
            } else {
                let params = {
                    code: info.code,
                    pubOp: 4,
                    coverFlag: true,
                }
                Config.put('/v1/prod/prodPub', params, (res) => {   // 添加
                    if (res.code == 0) {
                        message.success('发布成功！');
                        // browserHistory.push('/product/all' );
                        browserHistory.push('/product/share/' + params.code);
                    } else {
                        message.error(res.msg);
                    }
                });
            }
        }
    }
    // getCreditOn = (cb) => {
    //     ProductService.getCreditOn({}, (res) => {
    //         if (res.code == Config.errorCode.success) {
    //             cb(res.data);
    //         }
    //     })
    // }
    prodEdit = (info) => { // 产品编辑
        // let index = info.editedIndex;
        // 发布的产品停贷编辑
        // if (index==4) index = 3;
        // Config.localItem('PRODUCT_STEP', index);
        // this.props.router.push({
        //     pathname: '/product/add/0/' + info.code
        // });
        // window.open('/product/add/0/' + info.code, '_blank')
        browserHistory.push('/product/add/0/' + info.code);
    }
    //产品复制
    prodCopy = (info) => {
        let params = {
            code: info.code
        }
        Config.post('/v1/prod/copy/' + info.code, params, (res) => {
            if (res.code == Config.errorCode.success) {
                let index = info.editedIndex == 4 ? 3 : info.editedIndex;
                Config.localItem('PRODUCT_STEP', index);
                this.props.router.push({
                    pathname: '/product/add/' + (index - 1) + '/' + res.data
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    prodView = (info) => {
        let code = info.code
        // window.open('/product/detail/' + code, '_blank')
        browserHistory.push('/product/detail/' + code, '_blank');
    }
    getQRImg() {//获取二维码
        let params = {
            code: this.props.info.code,
        }
        Config.get('/v1/prod/share', params, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    QRImg: res.data
                })
            } else {
                this.setState({
                    QRImg: null
                })
                message.error(res.msg);
            }
        });

    }
    CopyAll = () => {//点击复制文本框内容
        let ele = this.refs.url;
        ele.focus();
        ele.select();
        document.execCommand("Copy");
    }
    changeQRPrdUrl = (e) => {
    }
    render() {
        const that = this;
        const { info, params } = that.props;
        const { QRImg } = that.state;
        const content = (
            <div>
                {QRImg ?
                    QRImg.prdUrl ?
                        <div>
                            <input type="text" className="url-input" value={QRImg.prdUrl} onChange={this.changeQRPrdUrl} ref='url' /><Button style={{ display: 'inline-block' }} onClick={() => this.CopyAll()}>复制</Button><br />
                            <img className='QR-img' style={{ width: '180px', height: '180px' }} src={`data:image/png;base64,${QRImg.picture}`} alt='product-qrc-img' />
                        </div> : null
                    : <p className='product-word'>二维码获取失败</p>
                }
            </div>
        );
        const { currentRole } = that.state;
        let prdStatus = null;
        if (info && info.prdStatus == 1) { // 未发布
            prdStatus = <ul className='product-operate'><li className='copy' onClick={() => this.prodCopy(info)}>复制</li><li className='edit' onClick={() => this.prodEdit(info)}>编辑</li><li className='publish' onClick={() => this.prodPub(info, 2)}>发布</li><li className='delete' onClick={() => this.delPro(info.code, info.prdName, params)}>删除</li></ul>;
        } else if (info.prdStatus == 2) { // 已发布
            prdStatus = <ul className='product-operate'><li className='edit' onClick={() => this.prodView(info)}>查看</li><li className='callOff' style={{ color: '#ff4f02' }} onClick={() => this.prodPub(info, 3)}>停贷</li></ul>;
        } else if (info.prdStatus == 3) { // 已停贷
            prdStatus = <ul className='product-operate'><li className='copy' onClick={() => this.prodCopy(info)}>复制</li><li className='edit' onClick={() => this.prodEdit(info)}>编辑</li><li className='callOff' onClick={() => this.prodPub(info, 4)}>启用</li></ul>;
        }
        return (
            <div className='productItem-container'>
                <div className="product-banner">
                    {info.prdStatus == 2 && info && info.creditOn ?
                        <p className='credit-word'>预授信</p> : null}
                    {info.coverUrl ?
                        <img className='product-img' src={`${info.coverUrl}`} alt='product-img' />
                        : <img className='product-img' src={require('../../Assets/Images/product-new-img.png')} alt='product-img' />
                    }
                </div>
                <div className='product-content'>
                    <h3 className='product-title'>{info.prdName}</h3>
                    <p className='product-profit'><span className='product-profit-number'>{info.loanRate}</span><span className='ten-thousand'>%</span><span className='product-describe'>日利率</span></p>
                    <p className='product-cycle'><span className='product-money'>{info.loanLimit}万</span><span className='product-describe'>最高额度</span><span className='product-month'>{info.loanAuthDays}个月</span><span className='product-describe'>最长授信周期</span></p>
                    <ul className='product-ways'>
                        <li className='product-way'>
                            <img className='product-icon' src={require('../../Assets/Images/product_icon_repayment.png')} alt="product-icon" />
                            <span className='product-way-describe'>还款方式</span>
                            <div className='product-detail'><p className='product-word'>{info.repaymentText}</p></div>
                        </li>
                        <li className='product-way'>
                            <img className='product-icon' src={require('../../Assets/Images/product_icon_Interest.png')} alt="product-icon" />
                            <span className='product-way-describe'>计息方式</span>
                            <div className='product-detail'><p className='product-word'>{info.interestText}</p></div>
                        </li>
                        <li className='product-way'>
                            <img className='product-icon' src={require('../../Assets/Images/product_icon_credittype.png')} alt="product-icon" />
                            <span className='product-way-describe'>授信类型</span>
                            <div className='product-detail'><p className='product-word'>{info.authText}</p></div>
                        </li>
                        {/* <li className='product-way'>
                            <span className='product-way-describe' onMouseOver={() => this.getQRImg(info)} >查看二维码</span>
                        { QRImg ?
                            <div className='product-detail wrap-img ' > <img className='QR-img' src={`data:image/png;base64,${QRImg.picture}`} alt='product-qrcode' /></div>
                            : <div className='product-detail' ><p className='product-word'>二维码获取失败</p></div>
                        }
                        </li> */}
                    </ul>
                </div>
                {currentRole.indexOf('ROLE_OPERATE') > -1 || currentRole.indexOf('ROLE_SUPER_ADMIN') > -1 || currentRole.indexOf('ROLE_TOP_MANAGER') > -1 ?
                    prdStatus :
                    (currentRole.indexOf('ROLE_CUSTOMER_MANAGER') > -1 || currentRole.indexOf('ROLE_RISK_MANAGER') > -1 || currentRole.indexOf('ROLE_MID_MANAGER') > -1) && info.prdStatus == 2 ?
                        <ul className='product-operate'><li className='edit' onClick={() => this.prodView(info)}>查看</li></ul>
                        : null
                }
                {info.prdStatus == 2 ?
                    <div className='qr-info'>
                        <Popover placement="leftTop" content={content} trigger="hover">
                            <img className='preivew-delete' src={qrImg} onMouseOver={() => this.getQRImg(info)} alt='product-qr-info' />
                        </Popover>
                    </div> : null}
            </div>
        )
    }
}

const pureProductItem = pureRender(ProductItem);

export default pureProductItem;
