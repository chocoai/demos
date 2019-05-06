/**
 * 数据服务 -- 详情
 * @Author: 魏昌华
 * @Date:   2017-07-06
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-07-06
 */

import React, { Component } from 'react'; // 引入了React
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';

import { getSrvDetail } from '../../Redux/Action/Data/ServiceAction';

import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import './style/serviceDetail.less';

import marked from 'marked';

import { Spin} from 'antd';

marked.setOptions({
    renderer : new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: true
});

/* 以类的方式创建一个组件 */
class ServiceDetail extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    componentDidMount() {
        const { routeParams, actions } = this.props;
        actions.getSrvDetail({code: routeParams.code});
    }
	render() {
        const that = this;
        const { loading, serviceDetail } = that.props;
        let markedText = '';
        if (serviceDetail && serviceDetail.srvMarkdown && typeof serviceDetail.srvMarkdown == 'string') {
            markedText = marked(serviceDetail.srvMarkdown);
        }
        const bcrumb = serviceDetail && serviceDetail.srvType === 1 ? [{
            'link': '/datas/risk',
            'value': '数据服务管理'
        }, {
            'link': null,
            'value': '供应商详情'
        }] : [{
            'link': '/datas/verify',
            'value': '数据服务管理'
        }, {
            'link': null,
            'value': '数据验证详情'
        }];
        console.log(serviceDetail)
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="service-detail-container">
                    <BcrumbItem bcrumb={bcrumb} />
                    <div className="detail-main">
                        {
                            serviceDetail &&
                            <div>
                                {
                                    serviceDetail.srvType === 1 ?
                                    <div className="detail-title">
                                        <img className="srv-logo" src={serviceDetail.srvSLogo} alt={serviceDetail.srvSupplierName}/>
                                        <span className="srv-name">{serviceDetail.srvSupplierName}_<font>{serviceDetail.srvNickName}</font></span>
                                    </div>
                                    :
                                    <div className="detail-title">{serviceDetail.srvNickName}</div>
                                }
                            </div>
                        }
                        <div className="marked-content" dangerouslySetInnerHTML={{__html: markedText}}></div>
                    </div>
                </div>
			</Spin>
		);
	}
}

// 将 store 中的数据作为 props 绑定到 ServiceDetail 上
const mapStateToProps = (state, ownProps) => {
    let { Common, DataServ } = state;
    return {
        loading: Common.loading,
        serviceDetail: DataServ.serviceDetail
    }
}

// 将 action 作为 props 绑定到 ServiceDetail 上。
const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators({ getSrvDetail }, dispatch)
});

const Main = connect(mapStateToProps, mapDispatchToProps)(ServiceDetail); // 连接redux

export default Main;
