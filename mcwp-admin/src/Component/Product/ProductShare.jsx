import React, { Component } from 'react'; // 引入了React
// import pureRender from 'pure-render-decorator';
import { Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import { message } from 'antd';
import { Config } from '../../Config/Index';
import './style/productShare.less';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';

class ProductShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            code: props.routeParams.code,
            productDetail:null,
            QRImg:null,
            prdVisible: false
        }
    }
    componentDidMount() {
        // const { routeParams, prodShare } = this.props;
        // const qrcodeParams = {
        //     code: routeParams.id || '',
        //     width: 160,
        //     height: 160
        // };
        // prodShare(qrcodeParams);
        this.getQRImg()
    }
    componentWillUnmount() { // 组件销毁
        if(this.timer) clearTimeout(this.timer);
    }
    getQRImg(){//获取二维码
        let params = {
            code : this.state.code,
        }
        Config.get('/v1/prod/share', params , (res) => {
            if(res.code == Config.errorCode.success) {
                this.setState({
                    QRImg:res.data
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    copyUrl = (url, type) => { // 复制链接
        copy(url);
        const that = this;
        if(type=="reqUrl") {
            that.setState({
                visible: true
            });
        } else {
            that.setState({
                prdVisible: true
            });
        }
        that.timer = setTimeout(function() {
            clearTimeout(that.timer);
            that.setState({
                visible: false
            })
        }, 1000);
    }
    render() {
        const that = this;
        // const { productShare } = that.props;
        const { visible , QRImg, prdVisible } = that.state;
        const bcrumb = [{
            'link': '/product/all',
            'value': '产品管理'
        }, {
            'link': null,
            'value':'产品分享',
		}];
        return (
            // <div className='common-content-container product-share-container'>
            //     二维码
            // { QRImg ?
            // <div>
            //     <input type="text" className="url-input"  defaultValue={QRImg.prdUrl} ref='url'/><Button style={{display:'inline-block'}} onClick={() =>this.CopyAll()}>复制</Button><br/>
            //     <img className='QR-img' style={{width:'180px',height:'180px'}} src={`data:image/png;base64,${QRImg.picture}`} alt='product-qrc-img' />
            // </div>
            // : <p className='product-word'>二维码获取失败</p>
            // }
            // </div>
            <div className='productShare-container'>
                <BcrumbItem bcrumb={bcrumb} />
                { QRImg ?
                <div className='productShare-content'>
                    <div className="share-qrcode"> <img className='QR-img' src={`data:image/png;base64,${QRImg.picture}`} alt='product-qrc-img' /></div>
                    <div className="share-content">您的产品“{QRImg.prdName}”已发布成功，可扫描上方二维码进行分享</div>
                    <div className="share-enter">
                        <span className="enter-label">申请入口：</span>
                        <span className="share-url"><font>{QRImg.reqUrl}</font></span>
                        <Tooltip placement="bottom" title='已复制' trigger={'click'} visible={visible} >
                            <span onClick={() => this.copyUrl(QRImg.reqUrl, 'reqUrl')} className="copy-img"></span>
                        </Tooltip>
                    </div>
                    <div className="share-enter">
                        <span className="enter-label">产品说明：</span>
                        <span className="share-url"><font>{QRImg.prdUrl}</font></span>
                        <Tooltip placement="bottom" title='已复制' trigger={'click'} visible={prdVisible} >
                            <span onClick={() => this.copyUrl(QRImg.prdUrl, 'prdUrl')} className="copy-img"></span>
                        </Tooltip>
                    </div>
                </div>:null}
            </div>
        )
    }
}

// const pureProductShare = pureRender(ProductShare);
// export default pureProductShare;
export default ProductShare;
