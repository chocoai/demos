import React, { Component } from 'react'; // 引入了React
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Config } from '../../Config/Index';
import { Link } from 'react-router';
import ResetSearch from './../../Component/Common/ResetSearch';
import ProductItem from '../../Component/Product/ProductItem';
import moment from 'moment';
import { getProdPage, deleteProduct, prodPub } from '../../Redux/Action/Product/ProductAction';
import './style/product.less';
import BaseService from '../../Services/BaseService';

import { Button, Input, Pagination, Spin, Select, message } from 'antd';
const Option = Select.Option;
const Search = Input.Search;

/* 以类的方式创建一个组件 */
class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {
                page: 1,
                rows: 3
            },
            dictItems: '',
            currentRole: Config.localItem('CUR_ROLE')
        }
    }
    componentDidMount() {
        const that = this;
        const { actions } = that.props;
        const { params } = that.state;
        actions.getProdPage(params);
        that.getProductDict({ ddItem: 'cplx' });
    }
    getProductDict(params) { // 根据字典代码,企业编码获取字典列表
        const that = this;
        BaseService.getProductDict(params, (res) => {
            if (res.code == Config.errorCode.success) {
                that.setState({
                    dictItems: res.data
                });
            } else {
                message.error(res.msg);
            }
        })
    }
    changePro = (page, pageSize) => { // 分页、排序、筛选变化时触发
        let params = this.props.params;
        params.page = page;
        params.rows = pageSize;
        this.props.actions.getProdPage(params);
    }
    searchProduct(value, dateString, key) { // 按条件查询渠道
        const that = this;
        const { actions } = that.props;
        let { params } = that.state;
        if (key === 'prdType') { // 产品类型
            if (value) {
                params.prdType = value;
            } else {
                delete params.prdType;
            }
        }
        if (key === 'prdName') {
            if (value) {
                params.prdName = value;
            } else {
                delete params.prdName;
            }
        }
        if (key === 'time' && value) {
            params.startTime = moment().subtract(value, 'days').format('YYYY-MM-DD');
            params.endTime = moment().format('YYYY-MM-DD');
            that.setState({
                dateKey: value
            });
        }
        params.page = 1;
        that.setState({
            params: params
        });
        actions.getProdPage(params);
    }
    render() {
        const that = this;
        const { loading, params, pagination, productInfo, actions } = that.props;
        const { currentRole, dictItems, dateKey } = that.state;
        const Page = productInfo.length > 0 ? <Pagination
            current={pagination.current}
            pageSize={params.rows}
            total={pagination.total}
            showTotal={(total, range) => `共  ${total}  条`}
            style={{ float: 'none', display: 'table', margin: '16px auto' }}
            onChange={this.changePro}
            onShowSizeChange={this.changePro}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={pagination.pageSizeOptions}
        /> : null;
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="common-console-container product-container">
                    <div className="common-search-section">
                        <div className="date-search-container">
                            <Select
                                className="search-item"
                                style={{ width: 180 }}
                                placeholder="产品类型"
                                optionFilterProp="children"
                                onChange={(value, options) => that.searchProduct(value, options, 'prdType')}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {
                                    dictItems && dictItems.cplx && dictItems.cplx.map((item, index) => (
                                        <Option value={item.ddValue + ''} key={index}>{item.ddText}</Option>
                                    ))
                                }
                            </Select>
                            <Search className="search-item" placeholder="产品名称" style={{ width: 180 }} onSearch={(value) => that.searchProduct(value, '', 'prdName')} />
                            <div className='search-item'>
                                <span className={`time-item ${dateKey == 6 ? "time-selected" : ""}`} onClick={() => that.searchProduct(6, '', 'time')}>近一周</span>
                                <span className={`time-item ${dateKey == 29 ? "time-selected" : ""}`} onClick={() => that.searchProduct(29, '', 'time')}>近一月</span>
                                <span className={`time-item ${dateKey == 89 ? "time-selected" : ""}`} onClick={() => that.searchProduct(89, '', 'time')}>近三个月</span>
                            </div>
                            <ResetSearch />
                        </div>
                    </div>
                    <div className="common-action-section">
                        {currentRole.indexOf('ROLE_OPERATE') > -1 || currentRole.indexOf('ROLE_SUPER_ADMIN') > -1 || currentRole.indexOf('ROLE_TOP_MANAGER') > -1 ? <Link to={`/product/add/${0}`}><Button className="common-btn" icon="plus" type="primary">新产品</Button></Link> : null}
                    </div>
                    {productInfo && productInfo.length > 0 ?
                        productInfo.map((info, index) => (
                            <ProductItem key={index} router={this.context.router} info={info} params={params} delProduct={actions.deleteProduct} prodPub={actions.prodPub} />
                        )) :
                        <div className="product-nodata">
                            <p className="no-data-p">还没有任何数据</p>
                        </div>
                    }
                    {Page}
                </div>
            </Spin>
        );
    }
}

Product.contextTypes = {
    router: React.PropTypes.object.isRequired
};

// 将 store 中的数据作为 props 绑定到 Product 上
const mapStateToProps = (state, ownProps) => {
    let { Common, Product } = state;
    return {
        loading: Common.loading,
        pubStep: Product.pubStep,
        params: Product.params,
        productInfo: Product.productInfo,
        pagination: Product.pagination
    }
}

// 将 action 作为 props 绑定到 Product 上。
const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators({ getProdPage, deleteProduct, prodPub }, dispatch)
});

const Main = connect(mapStateToProps, mapDispatchToProps)(Product); // 连接redux

export default Main;

