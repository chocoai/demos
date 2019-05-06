import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import { Link } from 'react-router';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import RuleService from '../../Services/RuleService';//调用数据

import './style/ruleDetail.less';

import { Spin, Col, Icon, Row, message } from 'antd';

/**
 * 规则库详情
 * @Author: 赵俊
 * @Date:   2017-09-20
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-09-20
 */
class RuleDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			code: props.routeParams.id,
			ruleDetail: {},
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
	}
	componentWillMount() {
		let code = this.state.code;
		let params = {
			code: code
		}
		this.getRuleDetail(params)
	}
	getRuleDetail (params) { // 行业规则详情
		this.setState({ loading: true });
        RuleService.getRuleDetail(params, (res) => {
            if (res.code == Config.errorCode.success) {
				const data = res.data;
                this.setState({
					loading: false,
					ruleDetail: data
                })   
            } else {
				message.error(res.msg);
            }
        });
	}
	render() {
		const {loading, ruleDetail, code} = this.state;
		const bcrumb = [{
            'link': '/rule',
            'value': '逻辑校验规则'
        }, {
            'link': null,
            'value': '查看行业规则'
		}];
		console.log(ruleDetail)
		return(
		<Spin tip={Config.warnInfo.spinText} spinning={loading}>
			<div className="rule-detail-container">
				<BcrumbItem bcrumb={bcrumb} />
				<div className="rule-content">
					<Row className="row-p">
						<Col span={24} className="rule-industry">
							<span>选择行业：</span>
							<span>{ ruleDetail.length && ruleDetail[0].industryText }</span>
						</Col>           	
					</Row>
					<Row className="row-title">
						<Col span={20} className="rule-title">
							<span>权益逻辑校验偏差率阈值设定编辑</span>
						</Col>
						<Col span={3} className="rule-action">
							<Link className="rule-view" to={"/rule/bank/right/detail/" + code}><Icon type="file-text" className='rule-icon'/>查看规则</Link>
						</Col>           	
					</Row>
					<Row className="row-content">
						<Col span={12} className="rule-p">
							<span>权益逻辑校验：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[0].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[0].deviationThresholdUp + '%' }</span>							
						</Col>          	
					</Row>
					<Row className="row-title">
						<Col span={20} className="rule-title">
							<span>毛利逻辑校验偏差率阈值设定编辑</span>
						</Col>
						<Col span={3} className="rule-action">
							<Link className="rule-view" to={"/rule/bank/gross/detail/" + code}><Icon type="file-text" className='rule-icon'/>查看规则</Link>
						</Col>           	
					</Row>
					<Row className="row-content">
						<Col span={12} className="rule-p">
							<span>主要产品加权毛利率计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[1].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[1].deviationThresholdUp + '%' }</span>
						</Col>
						<Col span={12} className="rule-p ">
							<span>营业额与采购额计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[2].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[2].deviationThresholdUp + '%' }</span>
						</Col>
						<Col span={12} className="rule-p">
							<span>行业平均毛利率计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[3].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[3].deviationThresholdUp + '%' }</span>
						</Col>          	
					</Row>
					<Row className="row-title">
						<Col span={20} className="rule-title">
							<span>销售额逻辑校验偏差率阈值设定编辑</span>
						</Col>
						<Col span={3} className="rule-action">
							<Link className="rule-view" to={"/rule/bank/sale/detail/" + code}><Icon type="file-text" className='rule-icon'/>查看规则</Link>
						</Col>           	
					</Row>
					<Row className="row-content">
						<Col span={12} className="rule-p">
							<span>按计件工资计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[4].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[4].deviationThresholdUp + '%' }</span>
						</Col>
						<Col span={12} className="rule-p ">
							<span>按天计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[5].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[5].deviationThresholdUp + '%' }</span>
						</Col>
						<Col span={12} className="rule-p">
							<span>按月计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[6].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[6].deviationThresholdUp + '%' }</span>
						</Col>
						<Col span={12} className="rule-p ">
							<span>按客户账本计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[7].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[7].deviationThresholdUp + '%' }</span>
						</Col>
						<Col span={12} className="rule-p">
							<span>按提成工资计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[8].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[8].deviationThresholdUp + '%' }</span>
						</Col>
						<Col span={12} className="rule-p ">
							<span>按客户手头现金计算的销售额：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[9].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[9].deviationThresholdUp + '%' }</span>
						</Col>
						<Col span={12} className="rule-p">
							<span>按存折（银行流水）计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[10].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[10].deviationThresholdUp + '%' }</span>
						</Col>
						<Col span={12} className="rule-p ">
							<span>按电脑销售记录计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[11].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[11].deviationThresholdUp + '%' }</span>
						</Col>
						<Col span={12} className="rule-p">
							<span>按进货周期、进货量、毛利率计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[12].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[12].deviationThresholdUp + '%' }</span>
						</Col>          	
					</Row>
					<Row className="row-title">
						<Col span={20} className="rule-title">
							<span>采购额逻辑校验偏差率阈值设定编辑</span>
						</Col>
						<Col span={3} className="rule-action">
							<Link className="rule-view" to={"/rule/bank/purchase/detail/" + code}><Icon type="file-text" className='rule-icon'/>查看规则</Link>
						</Col>           	
					</Row>
					<Row className="row-content">
						<Col span={12} className="rule-p">
							<span>按汇款金额与汇款频率计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[13].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[13].deviationThresholdUp + '%' }</span>
						</Col>
						<Col span={12} className="rule-p ">
							<span>按汇款金额与汇款频率计算：</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[14].deviationThresholdDown + '%' }</span>
                            <span className='ageLimit-line'>—</span>
							<span className='setting-value'>{ ruleDetail.length && ruleDetail[14].deviationThresholdUp + '%' }</span>
						</Col>          	
					</Row>
				</div>
		    </div>
		</Spin>
		);
	}
}

export default RuleDetail;