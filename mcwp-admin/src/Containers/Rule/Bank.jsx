import React, { Component } from 'react'; // 引入了React和PropTypes
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';
import { getRule, editRule, changeRule, putRule } from '../../Redux/Action/Rule/RuleAction';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';

// import RuleWeightedProfit from './../../Component/Rule/RuleWeightedProfit';
import RuleRight from './../../Component/Rule/RuleRight';
import RuleProfit from './../../Component/Rule/RuleProfit';
import RuleSale from './../../Component/Rule/RuleSale';
import RulePurchase from './../../Component/Rule/RulePurchase';

import './style/bank.less';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;


/**
 * 规则库查看
 * @Author: 魏昌华
 * @Date:   2017-07-04
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-07
 */

class RuleBank extends Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultTab: props.routeParams.tab,
			code: props.routeParams.id,
			type: props.routeParams.type,
			procode: props.location.query.code,
			protype: props.location.query.type,
			bcrumbValue: '增加行业规则',
			bcrumbLink: ''
		};
	}
	componentWillMount() {
		const that = this;
		const { routeParams } = that.props;
		that.setState({
			defaultTab: routeParams.tab ? routeParams.tab : 'right'
		});
		// this.props.actions.getRule();
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
	}
	changeTabs = (key) => { // 切换选项卡
		const { procode, protype } = this.state;
		Config.localItem('DEFAULT_TAB', key)
		// browserHistory.push('/rule');
		browserHistory.push('/rule/bank/' + key+ '?code=' + procode + '&type=' + protype);
	}
	render() {
		const { ruleData, ruleStatus, actions } = this.props;
		const { defaultTab, code, type, procode, protype } = this.state;
		let bcrumbLink = this.state.bcrumbLink;
		let bcrumbValue = this.state.bcrumbValue;
		if (code) {
			if (type == 'edit') {
				bcrumbValue = '编辑行业规则';
				bcrumbLink = '/rule/add/' + code + '?code=' + procode + '&type=' + protype;
			} else if (type == 'detail') {
				bcrumbValue = '查看行业规则';
				bcrumbLink = '/rule/detail/' + code + '?code=' + procode + '&type=' + protype;
			} else {
				bcrumbValue = '添加行业规则';
				bcrumbLink = '/rule/add?code=' + procode + '&type=' + protype
			}
		} else {
			bcrumbValue = '添加行业规则';
			bcrumbLink = '/rule/add?code=' + procode + '&type=' + protype
		}
		const bcrumb = [{
			'link': '/rule',
			'value': '规则配置'
		},
		{
			'link': '/rule/logic?code=' + procode + '&type=' + protype,
			'value': '逻辑校验规则'
		},
		{
			'link': bcrumbLink,
			'value': bcrumbValue
		}, {
			'link': null,
			'value': '查看规则'
		}];
		return (
			<div className="bank-container">
				<BcrumbItem bcrumb={bcrumb} />
				<div className='rule-bank-container'>
					<Tabs className='rule-tabs' defaultActiveKey={defaultTab} activeKey={defaultTab} onChange={this.changeTabs}>
						{/* <TabPane tab="加权利润率" key="1">
							<RuleWeightedProfit />
						</TabPane> */}
						<TabPane tab="权益逻辑校验" key="right">
							<RuleRight ruleData={ruleData} rightStatus={ruleStatus.rightStatus} changeRule={actions.changeRule} editRule={actions.editRule} putRule={actions.putRule} />
						</TabPane>
						<TabPane tab="毛利逻辑校验" key="gross">
							<RuleProfit ruleData={ruleData} profitStatus={ruleStatus.profitStatus} changeRule={actions.changeRule} editRule={actions.editRule} putRule={actions.putRule} />
						</TabPane>
						<TabPane tab="销售额逻辑校验" key="sale">
							<RuleSale ruleData={ruleData} saleStatus={ruleStatus.saleStatus} changeRule={actions.changeRule} editRule={actions.editRule} putRule={actions.putRule} />
						</TabPane>
						<TabPane tab="采购额逻辑校验" key="purchase">
							<RulePurchase ruleData={ruleData} purchaseStatus={ruleStatus.purchaseStatus} changeRule={actions.changeRule} editRule={actions.editRule} putRule={actions.putRule} />
						</TabPane>
					</Tabs>
				</div>
			</div>
		);
	}
}


const mapStateToProps = state => ({
	ruleData: state.Rule,
	ruleStatus: state.RuleStatus
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ getRule, editRule, changeRule, putRule }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleBank);
