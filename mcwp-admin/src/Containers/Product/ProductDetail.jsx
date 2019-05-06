import React, { Component } from 'react'; // 引入了React

import './style/productDetail.less';
// import { browserHistory, Link } from 'react-router';
import { Col , Row , message} from 'antd';
import { Config } from '../../Config/Index';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';

/**
 * 产品管理详情
 * @Date:   2017-11-6
 * @Last Modified time: 2017-11-6
 */
class productDetail extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
            code: props.routeParams.code,
            items:null,
            productDetail:null,
		};
	}
	componentDidMount() {
        this.getProductDetail();
        this.getTips();
    }
    getTips = () => {
        let params ={
          code:'szhy,sxlx,hkfs,hkqs'
        }
         Config.get('/comm/sys/dict/items', params, (res) => {
             if(res.code == Config.errorCode.success) {
                 this.setState({
                     items: res.data,
                 });
             } else {
                 message.error(res.msg);
             }

         });
      }
    getProductDetail = () => {
       const { code } = this.state
       let params ={
         code:code
       }
        Config.get('/v1/prod/info', params, (res) => {
            if(res.code == Config.errorCode.success) {
                this.setState({
                    productDetail: res.data,
                });
            } else {
                message.error(res.msg);
            }

        });
     }
	render() {
        const{ productDetail } = this.state;
        // items && items.cplx.filter(function(item,index){
        //     if(item.ddText !== productDetail.typeLabel ){
        //         return false;
        //     }
        //     // item && item.dictDTOS.filter(function(vItem,index){
        //     //     if(vItem.ddValue !== 8 ){
        //     //         return false;
        //     //     }
        //     // })
        // })
        const bcrumb = [{
            'link': '/product/all',
            'value': '产品管理'
        }, {
            'link': null,
            'value':'产品详情',
        }];
		return (
			<div className="productDetail-container">
				<BcrumbItem bcrumb={bcrumb} />
                <div className="productDetail-content">
                    <Row className="personal-info">
                            <Col span={20} className="title">
                                <span>产品信息</span>
                            </Col>
					</Row>
                    <Row className="personal-info-content">
						<Col span={12} className="info-detail">
							<span>产品名称：{ productDetail && productDetail.prdName ? productDetail.prdName : '未录入' }</span>
						</Col>
						<Col span={12} className="info-detail">
							<span>产品类型：{ (productDetail && productDetail.prdTypeText) || '未录入' }</span>
						</Col>
                        <Col span={12} className="info-detail">
							<span>最高额度：{ productDetail && productDetail.loanLimit ? productDetail.loanLimit + '万元' : '未录入'}</span>
						</Col>
                        <Col span={12} className="info-detail">
							<span>最长授信周期: { productDetail &&  productDetail.loanAuthDays ? productDetail.loanAuthDays + '个月': '未录入'}</span>
						</Col>
                        <Col span={12} className="info-detail">
							<span>最长用信周期：{ productDetail && productDetail.loanMonths ? productDetail.loanMonths + '个月'  : '未录入'}</span>
						</Col>
                        <Col span={12} className="info-detail">
							<span>年化利率：{ productDetail &&  productDetail.loanRate ? (Math.floor(productDetail.loanRate * 10000) * 360 /10000) + '%': '未录入' }</span>
						</Col>
                        <Col span={12} className="info-detail">
							<span>授信类型：{ productDetail && productDetail.authText ? productDetail.authText  : '未录入'}</span>
						</Col>
                        <Col span={12} className="info-detail">
							<span>还款方式：{ productDetail && productDetail.repaymentText ? productDetail.repaymentText  : '未录入'}</span>
						</Col>
                        <Col span={12} className="info-detail">
							<span>计息方式：{ productDetail && productDetail.interestType == 1 ? '按月计息' : (productDetail && productDetail.interestType == 2 ? '按天计息':'未录入')}</span>
						</Col>
                        <Col span={12} className="info-detail">
							<span>支持城市 ：{ productDetail && productDetail.citiesText ? productDetail.citiesText  : '未录入'}</span>
						</Col>
                        <Col span={12} className="info-detail">
							<span>年龄限制: { productDetail && productDetail.ageLimit ? productDetail.ageLimit + '岁' : '未录入'}-{ productDetail && productDetail.ageMax ? productDetail.ageMax + '岁' : '未录入'}</span>
						</Col>
                        <Col span={12} className="info-detail">
							<span>受众行业: { productDetail && productDetail.industryText ? productDetail.industryText  : '未录入'}</span>
						</Col>
                        {/* <Col span={12} className="info-detail">
							<span>审批人数：{ productDetail && productDetail.approveNum ? productDetail.approveNum  + '人' : '未录入'}</span>
						</Col>
                        <Col span={12} className="info-detail">
							<span>审查人数：{ productDetail && productDetail.examineNum ? productDetail.examineNum  + '人' : '未录入'}</span>
						</Col> */}
                        <Col span={12} className="info-detail">
                            <Col span={4}>宣传语：</Col>
                            <Col span={20} className="info-content">{ productDetail &&  productDetail.prdAd  ? productDetail.prdAd  : productDetail && productDetail.prdName }</Col>
						</Col>
                        <Col span={12} className="info-detail">
                            <Col span={4}>放款方式：</Col>
                            <Col span={20} className="info-content">
                            { productDetail &&  productDetail.loanType ? productDetail.loanType   : '未录入' }
                            </Col>
						</Col>
                        <Col span={12} className="info-detail">
                            <Col span={4}>申请资质：</Col>
                            <Col span={20} className="info-content">
                            { productDetail && productDetail.reqCondition ? productDetail.reqCondition : '未录入' }
                            </Col>
						</Col>
						<Col span={12} className="info-detail">
                            <Col span={4}>适用人群：</Col>
                            <Col span={20}>
                            { productDetail && productDetail.audience ? productDetail.audience : '未录入' }
                            </Col>
						</Col>
                        <Col span={12} className="info-detail">
                            <Col span={4}>产品模板：</Col>
                            <Col span={20}>
                            { productDetail && productDetail.tplCode ?  '模板' + productDetail.tplCode.slice(7) : '未录入' }
                            </Col>
						</Col>
					</Row>
                </div>
		    </div>
		);
	}
}

export default productDetail;
