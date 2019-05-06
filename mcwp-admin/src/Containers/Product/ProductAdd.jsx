import React, { Component } from 'react'; // 引入了React
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Config } from '../../Config/Index';
import ProductAttr from '../../Component/Product/ProductAttr';
// import PrdocutMarket from '../../Component/Product/PrdocutMarket';
// import ProductStep from '../../Component/Product/ProductStep';
// import ProductTemplet from '../../Component/Product/ProductTemplet'; // 产品管理 - 设置消息模板
// import ProductShare from '../../Component/Product/ProductShare'; // 产品管理 - 发布成功后分享
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import { getSysDict,getProductDict,clearEnterDict } from '../../Redux/Action/Index';
import { prodShare } from '../../Redux/Action/Product/ProductAction';
import './style/productAdd.less';

import { Spin } from 'antd';
// const Step = Steps.Step;

/* 以类的方式创建一个组件 */
class ProductAdd extends Component {
    constructor(props) {
    	super(props);
        this.state = {
            proInfo:'',
            pageTitle:'新增产品',
            code: props.routeParams.id
        }
    }

    componentWillMount() {
        const { routeParams, actions } = this.props;
        if(routeParams.step ) { // 产品属性 - 字典数据
            let params = {
                code: 'sxlx,hkfs,jxfs,zccs,szhy,hkqs'
            };
            let productType={
                ddItem:'cplx'
            }
            actions.getSysDict(params);
            actions.getProductDict(productType);
        }
        //判断产品code是否存在
        if(routeParams.id){
            this.setState({
                pageTitle:'编辑产品'
            })
            let params = {
                code: routeParams.id
            };
            Config.get('/v1/prod/info/', params, (res) => {
                if(res.code == Config.errorCode.success) {
                    this.setState({
                        proInfo:res.data
                    })
                } else {
                    this.context.router.push({
                        pathname: '/product'
                    });
                }
            });
        }
	}

    componentDidMount() {
        const { routeParams } = this.props;
        const current = +routeParams.step;
        this.context.router.setRouteLeaveHook(
            this.props.route,
            (nextLocation) => {
                const props = this.props;
                const routeParams = props.routeParams;
                if(!routeParams.id && !current && current != 0) return '您确定要离开?';
            }
        )
    }
    componentWillUnmount(){
        this.props.actions.clearEnterDict()
    }
	render() {
        const { loading, sysDictItems,enterDictItems } = this.props;
        const { code } = this.state;
        // const current = +routeParams.step;
        // const productCode = routeParams.id;
        // const steps = [{
        //     title: '产品属性',
        //     content: sysDictItems && sysDictItems.cplx ? <ProductAttr sysDictItems={sysDictItems} current={current} router={this.context.router} code={productCode} /> : null
        //     }, {
        //     title: '营销宣传',
        //     content: <PrdocutMarket router={this.context.router} prdAd= { proInfo && proInfo.prdAd } current={current} routeParams = {routeParams} />
        //     }, {
        //     title: '设定流程',
        //     content: <ProductStep router={this.context.router} current={current} routeParams = {routeParams} />
        //     }, {
        //     title: '发布成功',
        //     content: <ProductShare productShare={productShare} prodShare = {actions.prodShare} routeParams = {routeParams} />
        // }];
        const bcrumb = [{
            'link': '/product/all',
            'value': '产品管理'
        }, {
            'link': null,
            'value': code ? '编辑产品' : '新增产品'
        }];
		return (
		<Spin tip={Config.warnInfo.spinText} spinning={loading}>
			<div className="product-add-container">
                <BcrumbItem bcrumb={bcrumb} />
                <div className="product-attr-content">
                    {/* <Steps id='step-bg' current={current}>
                        {steps.map((item, index) => (
                            routeParams.step >= index && proInfo.prdStatus != 2 && proInfo.prdStatus != 4 && routeParams.step < 3 ?
                            <Step key={item.title} title={<Link to={`/product/add/${index}/${productCode}`}>{item.title}</Link>} />
                            :
                            <Step key={item.title} title={item.title} />
                        ) )}
                    </Steps> */}
                    {/* <div className="steps-content">{steps[current].content}</div> */}
                   { sysDictItems&&enterDictItems && enterDictItems.cplx ? <ProductAttr sysDictItems={sysDictItems}enterDictItems={enterDictItems} code = {this.state.code}   />:null }
                </div>
		    </div>
        </Spin>
		);
	}
}

ProductAdd.contextTypes = {
    router: React.PropTypes.object.isRequired
};

// 将 store 中的数据作为 props 绑定到 Product 上
const mapStateToProps = (state, ownProps) => {
    let { Common, Product } = state;
    return {
        loading: Common.loading,
        sysDictItems: Common.sysDictItems,
        enterDictItems: Common.enterDictItems,
        productShare: Product.productShare
    }
}

// 将 action 作为 props 绑定到 Product 上。
const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators({ getSysDict,clearEnterDict,getProductDict, prodShare }, dispatch)
});

const Main = connect(mapStateToProps, mapDispatchToProps)(ProductAdd); // 连接redux

export default Main;

