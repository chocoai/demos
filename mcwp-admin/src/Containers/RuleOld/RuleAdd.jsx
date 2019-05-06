import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import { browserHistory, Link } from 'react-router';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';

import './style/ruleAdd.less';

import RuleService from '../../Services/RuleService';//调用数据
import BaseService from '../../Services/BaseService';
import { Spin, Button, Col, Row, message, Input, Cascader} from 'antd';

/**
 * 规则库新增
 * @Author: 赵俊
 * @Date:   2017-09-20
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-09-20
 */
class RuleIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {
            loading: false,
            industryArr: [],
			code: props.routeParams.id,
			ruleDetail: [],
            ruleData: [],
            jylbItems: '',
            indValue: null,
            bcrumbValue: '增加行业规则',	//面包屑值
            cascaderItem: {
                placeholder: '必选项'
            },
			rightLegal: {logicCountType: 1,deviationThresholdDown:-10,deviationThresholdUp:10},
			grossProfit1: {logicCountType: 2,deviationThresholdDown:-10,deviationThresholdUp:10},
			grossProfit2: {logicCountType: 3,deviationThresholdDown:-10,deviationThresholdUp:10},
			grossProfit3: {logicCountType: 4,deviationThresholdDown:-10,deviationThresholdUp:10},
			salesVolume1: {logicCountType: 5,deviationThresholdDown:-10,deviationThresholdUp:10},
			salesVolume2: {logicCountType: 6,deviationThresholdDown:-10,deviationThresholdUp:10},
			salesVolume3: {logicCountType: 7,deviationThresholdDown:-10,deviationThresholdUp:10},
			salesVolume4: {logicCountType: 8,deviationThresholdDown:-10,deviationThresholdUp:10},
			salesVolume5: {logicCountType: 9,deviationThresholdDown:-10,deviationThresholdUp:10},
			salesVolume6: {logicCountType: 10,deviationThresholdDown:-10,deviationThresholdUp:10},
			salesVolume7: {logicCountType: 11,deviationThresholdDown:-10,deviationThresholdUp:10},
			salesVolume8: {logicCountType: 12,deviationThresholdDown:-10,deviationThresholdUp:10},
			salesVolume9: {logicCountType: 13,deviationThresholdDown:-10,deviationThresholdUp:10},
			Purchases1: {logicCountType: 14,deviationThresholdDown:-10,deviationThresholdUp:10},
			Purchases2: {logicCountType: 15,deviationThresholdDown:-10,deviationThresholdUp:10},
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
	}
	componentDidMount() {
		let code = this.state.code;
		let params = {
			code: code
		}
		if(code){
			this.getRuleDetail(params)
			this.setState({
				bcrumbValue: '编辑行业规则'
			})
        }
        BaseService.getSysDictItems({code: 'jylb'}, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    jylbItems: res.data.jylb
                })
            } else {
                message.error(res.msg);
            }
        })
	}
	getRuleDetail (params) { // 行业规则详情
		this.setState({ loading: true });
        RuleService.getRuleDetail(params, (res) => {
            if (res.code == Config.errorCode.success) {
				const data = res.data;
				let newData = data;
				for( var i = 0; i< data.length; i++) {
					delete newData[i].enterpriseCode;
					delete newData[i].industryText;
                }
                this.setState({
					loading: false,
                    ruleDetail: data,
                    indValue: newData[0].industryId,
                    industryArr: [newData[0].industryId],
					rightLegal: newData[0],
					grossProfit1:  newData[1],
					grossProfit2:  newData[2],
					grossProfit3:  newData[3],
					salesVolume1:  newData[4],
					salesVolume2:  newData[5],
					salesVolume3:  newData[6],
					salesVolume4:  newData[7],
					salesVolume5:  newData[8],
					salesVolume6:  newData[9],
					salesVolume7:  newData[10],
					salesVolume8:  newData[11],
					salesVolume9:  newData[12],
					Purchases1:  newData[13],
					Purchases2:  newData[14]
                })
            } else {
				message.error(res.msg);
            }
        });
	}
	// 获取input值
    changePut = (e, id) => {
		const { rightLegal, grossProfit1, grossProfit2, grossProfit3, salesVolume1, salesVolume2, salesVolume3, salesVolume4, salesVolume5, salesVolume6, salesVolume7, salesVolume8, salesVolume9, Purchases1, Purchases2 } = this.state;
		Config.changeTypeValue(e);
		let value = e.target.value;
		// 暂时写死了行业ID
        if(id == 'oneDown'){
			rightLegal.deviationThresholdDown = parseFloat(value);
		}else if(id == 'oneUp'){
			rightLegal.deviationThresholdUp = parseFloat(value);
		}else if(id == 'twoDown'){
			grossProfit1.deviationThresholdDown = parseFloat(value);
		}else if(id == 'twoUp'){
			grossProfit1.deviationThresholdUp = parseFloat(value);
		}else if(id == 'threeDown'){
			grossProfit2.deviationThresholdDown = parseFloat(value);
		}else if(id == 'threeUp'){
			grossProfit2.deviationThresholdUp = parseFloat(value);
		}else if(id == 'fourDown'){
			grossProfit3.deviationThresholdDown = parseFloat(value);
		}else if(id == 'fourUp'){
			grossProfit3.deviationThresholdUp = parseFloat(value);
		}else if(id == 'fiveDown'){
			salesVolume1.deviationThresholdDown = parseFloat(value);
		}else if(id == 'fiveUp'){
			salesVolume1.deviationThresholdUp = parseFloat(value);
		}else if(id == 'sixDown'){
			salesVolume2.deviationThresholdDown = parseFloat(value);
		}else if(id == 'sixUp'){
			salesVolume2.deviationThresholdUp = parseFloat(value);
		}else if(id == 'sevenDown'){
			salesVolume3.deviationThresholdDown = parseFloat(value);
		}else if(id == 'sevenUp'){
			salesVolume3.deviationThresholdUp = parseFloat(value);
		}else if(id == 'eightDown'){
			salesVolume4.deviationThresholdDown = parseFloat(value);
		}else if(id == 'eightUp'){
			salesVolume4.deviationThresholdUp = parseFloat(value);
		}else if(id == 'nightDown'){
			salesVolume5.deviationThresholdDown = parseFloat(value);
		}else if(id == 'nightUp'){
			salesVolume5.deviationThresholdUp = parseFloat(value);
		}else if(id == 'tenDown'){
			salesVolume6.deviationThresholdDown = parseFloat(value);
		}else if(id == 'tenUp'){
			salesVolume6.deviationThresholdUp = parseFloat(value);
		}else if(id == 'elevenDown'){
			salesVolume7.deviationThresholdDown = parseFloat(value);
		}else if(id == 'elevenUp'){
			salesVolume7.deviationThresholdUp = parseFloat(value);
		}else if(id == 'twelveDown'){
			salesVolume8.deviationThresholdDown = parseFloat(value);
		}else if(id == 'twelveUp'){
			salesVolume8.deviationThresholdUp = parseFloat(value);
		}else if(id == 'thirteenDown'){
			salesVolume9.deviationThresholdDown = parseFloat(value);
		}else if(id == 'thirteenUp'){
			salesVolume9.deviationThresholdUp = parseFloat(value);
		}else if(id == 'fourteenDown'){
			Purchases1.deviationThresholdDown = parseFloat(value);
		}else if(id == 'fourteenUp'){
			Purchases1.deviationThresholdUp = parseFloat(value);
		}else if(id == 'fifteenDown'){
			Purchases2.deviationThresholdDown = parseFloat(value);
		}else if(id == 'fifteenUp'){
			Purchases2.deviationThresholdUp = parseFloat(value);
		}
		this.setState({
			rightLegal: rightLegal,
			grossProfit1: grossProfit1,
			grossProfit2: grossProfit2,
			grossProfit3: grossProfit3,
			salesVolume1: salesVolume1,
			salesVolume2: salesVolume2,
			salesVolume3: salesVolume3,
			salesVolume4: salesVolume4,
			salesVolume5: salesVolume5,
			salesVolume6: salesVolume6,
			salesVolume7: salesVolume7,
			salesVolume8: salesVolume8,
			salesVolume9: salesVolume9,
			Purchases1: Purchases1,
			Purchases2: Purchases2
		})
	}
	handleOkSen = () => { //提交数据
        let { ruleData, rightLegal, grossProfit1, grossProfit2, grossProfit3, salesVolume1, salesVolume2, salesVolume3, salesVolume4, salesVolume5, salesVolume6, salesVolume7, salesVolume8, salesVolume9, Purchases1, Purchases2, industryArr } = this.state;
		ruleData = [];
        if (industryArr.length == 0) return message.error('请选择行业');
		rightLegal.industryId = industryArr[industryArr.length - 1];
		if (rightLegal && grossProfit1 && grossProfit2 && grossProfit3 && salesVolume1 && salesVolume2  && salesVolume3 && salesVolume4 && salesVolume5 && salesVolume6 && salesVolume7 && salesVolume8 && salesVolume9 && Purchases1 && Purchases2 ){
			ruleData.push(rightLegal,grossProfit1,grossProfit2,grossProfit3,salesVolume1,salesVolume2,salesVolume3,salesVolume4,salesVolume5,salesVolume6,salesVolume7,salesVolume8,salesVolume9,Purchases1,Purchases2);
			let params = Config.serializeObjects({loanLogicVerifyDts: ruleData})
			this.postIndustryRule(params);
		}else{
			message.error('请输入必要参数,参数输入范围[0.01-99.99]');
		}
	}
	goBack = () => {
		browserHistory.goBack();
	}
	postIndustryRule (params) { // 新增行业规则
		let { code } = this.state;
		if(code){
			RuleService.putIndustryRule(params, (res) => {
				if (res.code == Config.errorCode.success) {
					message.success('修改成功');
					browserHistory.goBack();
				} else {
					message.error(res.msg);
				}
			});
		}else{
			RuleService.postIndustryRule(params, (res) => {
				if (res.code == Config.errorCode.success) {
					message.success('增加成功');
					browserHistory.goBack();
				} else {
					message.error(res.msg);
				}
			});
		}
    }
    changeInd = (value) => {
        const that = this;
        if (value && value.length > 0) {
            that.setState({
                cascaderItem: {
                    value: value
                }
            });
        } else {
            that.setState({
                cascaderItem: {
                    placeholder: '必选项'
                }
            })
        }
        that.setState({
            industryArr: value,
            indValue: null
        });
    }
	render() {
        let {loading, ruleDetail, bcrumbValue, jylbItems, indValue, industryArr, code, cascaderItem} = this.state;
        let treeData = [];
        if (jylbItems && jylbItems.length > 0) {
            jylbItems.map((item, index) => {
                let tree = {
                    value: item.ddValue,
                    label: item.ddText
                };
                let cTreeData = [];
                item.dictDTOS.map((cItem, cIndex) => {
                    if (indValue && cItem.ddValue === indValue) {
                        industryArr = [cItem.parentValue, industryArr[0]];
                    }
                    let cTree = {
                        value:  cItem.ddValue,
                        label: cItem.ddText
                    };
                    cTreeData.push(cTree);
                });
                tree.children = cTreeData;
                treeData.push(tree);
            })
        }
		const bcrumb = [{
            'link': '/rule',
            'value': '逻辑校验规则'
        }, {
            'link': null,
            'value': bcrumbValue
		}];
		return(
		<Spin tip={Config.warnInfo.spinText} spinning={loading}>
			<div className="rule-add-container">
				<BcrumbItem bcrumb={bcrumb} />
                <div className="rule-content common-console-container">
                    <div className="tree-select"><span className="tree-label">选择行业</span>
                        {industryArr.length > 0 ? <Cascader
							key="Cascader_2"
							expandTrigger="hover"
                            style={{ width: 300 }}
                            size={'large'}
                            options={treeData}
                            onChange={this.changeInd}
                            value={industryArr}
                            allowClear
                            disabled={ code ? true : false }
                            changeOnSelect
                            getPopupContainer={trigger => trigger.parentNode} /> : <Cascader
							style={{ width: 300 }}
							key="Cascader_1"
							expandTrigger="hover"
                            size={'large'}
                            options={treeData}
                            onChange={this.changeInd}
                            allowClear
                            changeOnSelect
                            getPopupContainer={trigger => trigger.parentNode}
                            {...cascaderItem} />
                        }
                    </div>
					<Row className="row-title">
						<Col span={20} className="rule-title">
							<span>权益逻辑校验偏差率阈值设定编辑</span>
						</Col>
						<Col span={3} className="rule-action">
						{
							code ? <Link className="rule-view" to={"/rule/bank/right/edit/" + code}><img alt="文件详情" src={require('../../Assets/Images/icon_rule.png')} className='rule-icon'/>查看规则</Link> :
							<Link className="rule-view" to={"/rule/bank/right/add" }><img alt="文件详情" src={require('../../Assets/Images/icon_rule.png')} className='rule-icon'/>查看规则</Link>
						}
						</Col>
					</Row>
					<Row className="row-content">
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>权益逻辑校验</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[0].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'oneDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'oneDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[0].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'oneUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'oneUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
					</Row>
					<Row className="row-title">
						<Col span={20} className="rule-title">
							<span>毛利逻辑校验偏差率阈值设定编辑</span>
						</Col>
						<Col span={3} className="rule-action">
						{
							code ? <Link className="rule-view" to={"/rule/bank/gross/edit/" + code}><img alt="文件详情" src={require('../../Assets/Images/icon_rule.png')} className='rule-icon'/>查看规则</Link> :
							<Link className="rule-view" to={"/rule/bank/gross/add"}><img alt="文件详情" src={require('../../Assets/Images/icon_rule.png')} className='rule-icon'/>查看规则</Link>
						}
						</Col>
					</Row>
					<Row className="row-content">
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>主要产品加权毛利率</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[1].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'twoDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'twoDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[1].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'twoUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'twoUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>营业额与采购额</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[2].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'threeDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'threeDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[2].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'threeUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'threeUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>行业平均毛利率</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[3].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'fourDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'fourDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[3].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'fourUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'fourUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
					</Row>
					<Row className="row-title">
						<Col span={20} className="rule-title">
							<span>销售额逻辑校验偏差率阈值设定编辑</span>
						</Col>
						<Col span={3} className="rule-action">
						{
							code ? <Link className="rule-view" to={"/rule/bank/sale/edit/" + code }><img alt="文件详情" src={require('../../Assets/Images/icon_rule.png')} className='rule-icon'/>查看规则</Link> :
							<Link className="rule-view" to={"/rule/bank/sale/add"}><img alt="文件详情" src={require('../../Assets/Images/icon_rule.png')} className='rule-icon'/>查看规则</Link>
						}
						</Col>
					</Row>
					<Row className="row-content">
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>按计件工资计算</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[4].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'fiveDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'fiveDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[4].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'fiveUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'fiveUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>按天计算</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[5].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'sixDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'sixDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[5].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'sixUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'sixUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>按月计算</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[6].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'sevenDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'sevenDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[6].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'sevenUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'sevenUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>按客户账本计算</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[7].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'eightDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'eightDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[7].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'eightUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'eightUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>按提成工资计算</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[8].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'nightDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'nightDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[8].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'nightUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'nightUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>按客户手头现金计算的销售额</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[9].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'tenDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'tenDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[9].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'tenUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'tenUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>按存折（银行流水）计算</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[10].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'elevenDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'elevenDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[10].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'elevenUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'elevenUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>按电脑销售记录计算</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[11].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'twelveDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'twelveDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[11].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'twelveUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'twelveUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>按进货周期、进货量、毛利率计算</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[12].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'thirteenDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'thirteenDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[12].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'thirteenUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'thirteenUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
					</Row>
					<Row className="row-title">
						<Col span={20} className="rule-title">
							<span>采购额逻辑校验偏差率阈值设定编辑</span>
						</Col>
						<Col span={3} className="rule-action">
						{
							code ? <Link className="rule-view" to={"/rule/bank/purchase/edit/" + code}><img alt="文件详情" src={require('../../Assets/Images/icon_rule.png')} className='rule-icon'/>查看规则</Link> :
							<Link className="rule-view" to={"/rule/bank/purchase/add"}><img alt="文件详情" src={require('../../Assets/Images/icon_rule.png')} className='rule-icon'/>查看规则</Link>
						}
						</Col>
					</Row>
					<Row className="row-content">
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>按汇款金额与汇款频率计算</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[13].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'fourteenDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'fourteenDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[13].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'fourteenUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'fourteenUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
						<Col span={12}>
							<Col span={8} className="rule-p">
								<span>按汇款金额与汇款频率计算</span>
							</Col>
							<Col span={16} className="rule-input">
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[14].deviationThresholdDown} onChange={(e)=>this.changePut(e, 'fifteenDown')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='-10' onChange={(e)=>this.changePut(e, 'fifteenDown')}/>
								}
								<span>%</span>
								<span className='ageLimit-line'>&nbsp;—&nbsp;</span>
								{ ruleDetail.length ?
									<input className='setting-edit' defaultValue={ruleDetail.length && ruleDetail[14].deviationThresholdUp} onChange={(e)=>this.changePut(e, 'fifteenUp')}  ref={ref=>{this.right=ref}} />
									: <Input  className='setting-edit'  defaultValue='10' onChange={(e)=>this.changePut(e, 'fifteenUp')}/>
								}
								<span>%</span>
							</Col>
						</Col>
					</Row>
					<Button className="rule-button rule-submit" type="primary" onClick={this.handleOkSen}>提交</Button>
					<Button className="rule-button rule-cancel" type="primary" onClick={this.goBack}>取消</Button>
				</div>
		    </div>
		</Spin>
		);
	}
}

export default RuleIndex;
