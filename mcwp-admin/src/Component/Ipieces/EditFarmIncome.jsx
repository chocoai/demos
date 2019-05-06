import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/editFarmIncome.less';

import { Form } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑农贷财务情况资产负债表
 * @Author: 钟观发
 * @Date:   2017-09-29
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-09-29
 */
class EditFarmBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
        this.calculate();
    }
    NumberOnly = (e,type) => {
        let value = e.target.value;
        let number = parseFloat(value);
        // if (!value) return;
        if(value == '-' || value == '0-' || value == '--') {
            e.target.value = '-'
            if(type) {
                this.props.pushCome(type,e.target.value)
            }
            return
        }
        if (isNaN(number)) {
            let numString  = value.toString();
            //排除首位不为数字和符号的情况
            if( /([-]?)(\d{1,10})(\.?)(\d{0,2})$/.test(value)){
                numString = numString.slice(1);
                //排除在首位之后插入其他字符的情况
                if(parseFloat(numString) != parseFloat(numString)){
                    numString = numString.slice(1);
                }
                e.target.value = numString;
                if(type) {
                    this.props.pushCome(type,e.target.value)
                }
                this.calculate();
                return;
            }
            e.target.value = 0;
            if(type) {
                this.props.pushCome(type,e.target.value)
            }
            this.calculate();
            return;
        }
        if (/^([-]?)(\d{1,10})(\.?)(\d{0,2})$/.test(value)) {
            //排除首位为0的情况
            let numString  = value.toString();
            if(numString[0] == 0 && numString[1] != '.') {
                e.target.value = number;
            }
            if(type) {
                this.props.pushCome(type,e.target.value)
            }
            this.calculate();
            return;
        }
        if (/^([-]?)(\d{1,10})(\.?)(\d{0,2})$/.test(number)) {
            //排除倒数第二位为.的时候重置
            let numString  = value.toString();
            if(numString.slice(-2,-1) == '.') {
                e.target.value = number + '.';
                this.calculate();
                return;
            }
            e.target.value = number;
            if(type) {
                this.props.pushCome(type,e.target.value)
            }
        } else {
            number = number.toString().slice(0,-1);
            e.target.value = number;
            if(type) {
                this.props.pushCome(type,e.target.value)
            }
        }
        this.calculate();
    }
    //销售收入=种植收入+养殖收入+其他生意收入+机械设备出租收入+加工服务的收入
    sellIncomeYearCalc(){
        let total = (this.plantIncome.value * 100 + this.farmIncome.value * 100 + this.othBusiIncome.value * 100
                    + this.machineLeaseIncome.value * 100 + this.machiningIncome.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            sellIncome: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroIncstat.sellIncome': total,
        });
        return total;
    }
    //经营直接成本 =种植成本+喂养成本+其他生意成本+其他成本
    operateCostYearCalc(){
        let total = (this.plantCost.value * 100 + this.farmCost.value * 100 + this.othBusiCost.value * 100
                    + this.othCost.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            operateCost: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroIncstat.operateCost': total,
        });
        return total;
    }
    //农业周期的杂费 =购买的用于育肥的幼畜+防疫及受精成本+包装的成本+收割的装卸和饲料的装卸+秋收和饲料的运输成本
    agricultureCostYearCalc(){
        let total = (this.neonate.value * 100 + this.epidemicCost.value * 100 + this.packageCost.value * 100
                    + this.bargeCost.value * 100 + this.trasportCost.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            agricultureCost: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroIncstat.agricultureCost': total,
        });
        return total;
    }
    //经营毛利润=销售收入 - 经营直接成本 - 农业周期的杂费
    grossProfitYearCalc(sellIncomeYearCalc,operateCostYearCalc,agricultureCostYearCalc){
        let total = (sellIncomeYearCalc * 100 - operateCostYearCalc * 100 - agricultureCostYearCalc * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            grossProfit: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroIncstat.grossProfit': total,
        });
        return total;
    }
    //经营杂费 = 土地租金+农用设备维修费+税款+工人工资+雇工伙食费+杂费、管理费+房屋租金+房屋修理费用+招待费+仓储费用+安保费用+其他生意的费用+私人交通费
    incidentalExpensesYearCalc(){
        let total = (this.landLease.value * 100 + this.farmingRepair.value * 100 + this.taxs.value * 100
                    + this.workerSalary.value * 100 + this.employeeMeals.value * 100 + this.overhead.value * 100
                    + this.houseLease.value * 100 + this.houseRepair.value * 100 + this.invitationFee.value * 100
                    + this.storageFee.value * 100 + this.securityFee.value * 100 + this.othBillFee.value * 100
                    + this.traffic.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            incidentalExpenses: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroIncstat.incidentalExpenses': total,
        });
        return total;
    }
    //经营净利润 = 经营毛利润 - 经营杂费
    netProfitYearCalc(grossProfitYearCalc,incidentalExpensesYearCalc){
        let total = (grossProfitYearCalc * 100 - incidentalExpensesYearCalc * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            netProfit: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroIncstat.netProfit': total,
        });
        return total;
    }
    //年可支 = 经营净利润 + 其他收入 - 家庭支出
    disposableCostYearCalc(netProfitYearCalc){
        let total = (netProfitYearCalc * 100 + this.othIncome.value * 100 - this.familyPay.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            disposable: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroIncstat.disposable': total,
        });
        return total;
    }
    calculate(){
        let sellIncomeYearCalc = this.sellIncomeYearCalc(),
            operateCostYearCalc = this.operateCostYearCalc(),
            agricultureCostYearCalc = this.agricultureCostYearCalc(),
            incidentalExpensesYearCalc = this.incidentalExpensesYearCalc(),
            grossProfitYearCalc = this.grossProfitYearCalc(sellIncomeYearCalc,operateCostYearCalc,agricultureCostYearCalc),
            netProfitYearCalc = this.netProfitYearCalc(grossProfitYearCalc,incidentalExpensesYearCalc);
            this.disposableCostYearCalc(netProfitYearCalc);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { farmIncome, code,linkTo} = this.props;
        let  loanAssetAgroIncstat = farmIncome.loanAssetAgroIncstat;
        return (
            <div className='editFarmIncome-container'>
                <Form>
                    <table className='finance-table'>
                        <thead className='finance-head'>
                            <tr>
                                <th className='finance-head-first'>项目</th>
                                <th className='finance-head-second'>本年累计金额</th>
                            </tr>
                        </thead>
                        <tbody>
                           <tr>
                                <td className='finance-title-first'>销售收入</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.sellIncome', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.sellIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.sellIncome}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second finance-table-link' onClick = {()=>linkTo('/ipieces/edit/detail/' + code + '/7/1')}>种植收入</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.plantIncome', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.plantIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={plantIncome => {this.plantIncome = plantIncome}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second finance-table-link' onClick = {()=>linkTo('/ipieces/edit/detail/' + code + '/7/2')}>养殖收入</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.farmIncome', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.farmIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={farmIncome => {this.farmIncome = farmIncome}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>其他生意收入</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.othBusiIncome', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.othBusiIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={othBusiIncome => {this.othBusiIncome = othBusiIncome}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>机械设备出租收入</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.machineLeaseIncome', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.machineLeaseIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={machineLeaseIncome => {this.machineLeaseIncome = machineLeaseIncome}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>加工服务收入</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.machiningIncome', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.machiningIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={machiningIncome => {this.machiningIncome = machiningIncome}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>经营直接成本</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.operateCost', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.operateCost.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.operateCost}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second finance-table-link'  onClick = {()=>linkTo('/ipieces/edit/detail/' + code + '/7/1')}>种植成本</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.plantCost', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.plantCost.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={plantCost => {this.plantCost = plantCost}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second finance-table-link'  onClick = {()=>linkTo('/ipieces/edit/detail/' + code + '/7/2')}>喂养成本</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.farmCost', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.farmCost.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={farmCost => {this.farmCost = farmCost}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>其他生意成本</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.othBusiCost', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.othBusiCost.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={othBusiCost => {this.othBusiCost = othBusiCost}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>其他成本</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.othCost', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.othCost.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={othCost => {this.othCost = othCost}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>农业周期杂费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.agricultureCost', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.agricultureCost.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.agricultureCost}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>购买的用于育肥的幼畜</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.neonate', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.neonate.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={neonate => {this.neonate = neonate}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>防疫及受精成本</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.epidemicCost', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.epidemicCost.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={epidemicCost => {this.epidemicCost = epidemicCost}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>包装的成本</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.packageCost', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.packageCost.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={packageCost => {this.packageCost = packageCost}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>收割的装卸和饲料的装卸</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.bargeCost', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.bargeCost.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={bargeCost => {this.bargeCost = bargeCost}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>秋收和饲料的运输成本</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.trasportCost', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.trasportCost.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={trasportCost => {this.trasportCost = trasportCost}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>经营的毛利润</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.grossProfit', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.grossProfit.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.grossProfit}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>经营的杂费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.incidentalExpenses', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.incidentalExpenses.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.incidentalExpenses}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>土地租金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.landLease', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.landLease.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'landLease')} autoComplete="off" ref={landLease => {this.landLease = landLease}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>农用设备的维修费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.farmingRepair', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.farmingRepair.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'farmingRepair')} autoComplete="off" ref={farmingRepair => {this.farmingRepair = farmingRepair}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>税款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.taxs', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.taxs.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'taxs')} autoComplete="off" ref={taxs => {this.taxs = taxs}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>工人工资</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.workerSalary', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.workerSalary.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'workerSalary')} autoComplete="off" ref={workerSalary => {this.workerSalary = workerSalary}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>雇工伙食费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.employeeMeals', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.employeeMeals.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'employeeMeals')} autoComplete="off" ref={employeeMeals => {this.employeeMeals = employeeMeals}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>杂费，管理费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.overhead', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.overhead.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'overhead')} autoComplete="off" ref={overhead => {this.overhead = overhead}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>房屋租金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.houseLease', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.houseLease.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'houseLease')} autoComplete="off" ref={houseLease => {this.houseLease = houseLease}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>房屋修理费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.houseRepair', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.houseRepair.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'houseRepair')} autoComplete="off" ref={houseRepair => {this.houseRepair = houseRepair}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>招待费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.invitationFee', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.invitationFee.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'invitationFee')} autoComplete="off" ref={invitationFee => {this.invitationFee = invitationFee}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>仓储费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.storageFee', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.storageFee.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'storageFee')} autoComplete="off" ref={storageFee => {this.storageFee = storageFee}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>安保费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.securityFee', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.securityFee.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'securityFee')} autoComplete="off" ref={securityFee => {this.securityFee = securityFee}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>其他生意的费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.othBillFee', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.othBillFee.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'othBillFee')} autoComplete="off" ref={othBillFee => {this.othBillFee = othBillFee}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>私人交通费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.traffic', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.traffic.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'traffic')} autoComplete="off" ref={traffic => {this.traffic = traffic}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>经营净利润</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.netProfit', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.netProfit.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.netProfit}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>其他收入</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.othIncome', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.othIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={othIncome => {this.othIncome = othIncome}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>家庭支出</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.familyPay', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.familyPay.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={familyPay => {this.familyPay = familyPay}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>年可支</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroIncstat.disposable', {
                                            initialValue: loanAssetAgroIncstat && loanAssetAgroIncstat.disposable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.disposable}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Form>
            </div>
        )
    }
}

const pureEditFarmBalance = pureRender(EditFarmBalance);

export default pureEditFarmBalance;
