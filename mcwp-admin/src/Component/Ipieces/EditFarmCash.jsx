import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/editFarmCash.less';

import { Form } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑农贷财务情况资产负债表
 * @Author: 钟观发
 * @Date:   2017-09-29
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-09-29
 */
class EditFarmCash extends Component {
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
                this.props.pushCash(type,e.target.value)
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
                    this.props.pushCash(type,e.target.value)
                }
                this.calculate();
                return;
            }
            e.target.value = 0;
            if(type) {
                this.props.pushCash(type,e.target.value)
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
                this.props.pushCash(type,e.target.value)
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
                this.props.pushCash(type,e.target.value)
            }
        } else {
            number = number.toString().slice(0,-1);
            e.target.value = number;
            if(type) {
                this.props.pushCash(type,e.target.value)
            }
        }
        this.calculate();
    }
    //现金流入合计=变卖库存+回收应收账款+获得贷款+其他生意收入+机械设备出租收入+加工服务的收入
    totalCashInflowYearCalc(){
        let total = (this.sellStock.value * 100 + this.recAccount.value * 100 + this.acquireLoan.value * 100
                    + this.othBusiIncome.value * 100 + this.machineLeaseIncome.value * 100 + this.machiningIncome.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalCashInflow: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroCashFlow.totalCashInflow': total,
        });
        return total;
    }
    //经营活动现金流出合计 = 土地租金+农用设备维修费+税款+工人工资+雇工伙食费+杂费、管理费+房屋租金+房屋修理费用+招待费+仓储费用+安保费用+其他生意的费用+私人交通费
    operateCashOutflowYearCalc(){
        let total = (this.landLease.value * 100 + this.farmingRepair.value * 100 + this.taxs.value * 100
                    + this.workerSalary.value * 100 + this.employeeMeals.value * 100 + this.overhead.value * 100
                    + this.houseLease.value * 100 + this.houseRepair.value * 100 + this.invitationFee.value * 100
                    + this.storageFee.value * 100 + this.securityFee.value * 100 + this.othBillFee.value * 100
                    + this.traffic.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            operateCashOutflow: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroCashFlow.operateCashOutflow': total,
        });
        return total;
    }
    //其他的现金流出合计 = 办理贷款的费用+其他贷款的还款+贷款的还款+退款的支付+私人债务+投资+家庭和其他的个人支出+ 有针对性使用要求的贷款
    otherCashOutflowYearCalc(){
        let total = (this.loanFee.value * 100 + this.payOthLoan.value * 100 + this.payLoan.value * 100
                    + this.payRefund.value * 100 + this.investment.value * 100 + this.familyPersonPay.value * 100
                    + this.specificLoan.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            otherCashOutflow: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroCashFlow.otherCashOutflow': total,
        });
        return total;
    }
    //期末现金 = 期初现金 + 现金流入合计 - 经营活动现金流出合计 - 其他现金流出合计
    finalCashBalanceYearCalc(totalCashInflowYearCalc,operateCashOutflowYearCalc,otherCashOutflowYearCalc){
        let total = (this.initialCash.value * 100 +totalCashInflowYearCalc * 100 - operateCashOutflowYearCalc * 100 - otherCashOutflowYearCalc * 100)/100;
        total = total.toFixed(2);
        this.setState({
            finalCashBalance: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroCashFlow.finalCashBalance': total,
        });
        return total;
    }
    calculate(){
        let totalCashInflowYearCalc = this.totalCashInflowYearCalc(),
            operateCashOutflowYearCalc = this.operateCashOutflowYearCalc(),
            otherCashOutflowYearCalc = this.otherCashOutflowYearCalc();
            this.finalCashBalanceYearCalc(totalCashInflowYearCalc,operateCashOutflowYearCalc,otherCashOutflowYearCalc);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { farmCash } = this.props;
        let  loanAssetAgroCashFlow = farmCash.loanAssetAgroCashFlow;
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
                                <td className='finance-title-first'>期初现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.initialCash', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.initialCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={initialCash => {this.initialCash = initialCash}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>现金流入合计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.totalCashInflow', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.totalCashInflow.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalCashInflow}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>变卖库存</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.sellStock', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.sellStock.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={sellStock => {this.sellStock = sellStock}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>回收应收账款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.recAccount', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.recAccount.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={recAccount => {this.recAccount = recAccount}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>获得贷款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.acquireLoan', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.acquireLoan.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={acquireLoan => {this.acquireLoan = acquireLoan}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>其他生意收入</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.othBusiIncome', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.othBusiIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={othBusiIncome => {this.othBusiIncome = othBusiIncome}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>机械设备出租收入</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.machineLeaseIncome', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.machineLeaseIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={machineLeaseIncome => {this.machineLeaseIncome = machineLeaseIncome}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>加工服务的收入</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.machiningIncome', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.machiningIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={machiningIncome => {this.machiningIncome = machiningIncome}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>经营活动现金流出合计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.operateCashOutflow', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.operateCashOutflow.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.operateCashOutflow}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>土地租金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.landLease', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.landLease.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'landLease')} autoComplete="off"  ref={landLease => {this.landLease = landLease}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>农用设备的维修费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.farmingRepair', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.farmingRepair.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'farmingRepair')} autoComplete="off"  ref={farmingRepair => {this.farmingRepair = farmingRepair}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>税款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.taxs', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.taxs.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'taxs')} autoComplete="off"  ref={taxs => {this.taxs = taxs}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>工人工资</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.workerSalary', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.workerSalary.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'workerSalary')} autoComplete="off"  ref={workerSalary => {this.workerSalary = workerSalary}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>雇工伙食费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.employeeMeals', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.employeeMeals.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'employeeMeals')} autoComplete="off"  ref={employeeMeals => {this.employeeMeals = employeeMeals}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>杂费，管理费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.overhead', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.overhead.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'overhead')} autoComplete="off"  ref={overhead => {this.overhead = overhead}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>房屋租金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.houseLease', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.houseLease.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'houseLease')} autoComplete="off"  ref={houseLease => {this.houseLease = houseLease}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>房屋修理费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.houseRepair', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.houseRepair.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'houseRepair')} autoComplete="off"  ref={houseRepair => {this.houseRepair = houseRepair}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>招待费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.invitationFee', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.invitationFee.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'invitationFee')} autoComplete="off"  ref={invitationFee => {this.invitationFee = invitationFee}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>仓储费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.storageFee', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.storageFee.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'storageFee')} autoComplete="off"  ref={storageFee => {this.storageFee = storageFee}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>安保费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.securityFee', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.securityFee.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'securityFee')} autoComplete="off"  ref={securityFee => {this.securityFee = securityFee}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>其他生意的费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.othBillFee', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.othBillFee.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'othBillFee')} autoComplete="off"  ref={othBillFee => {this.othBillFee = othBillFee}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>私人交通费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.traffic', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.traffic.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={(e)=>this.NumberOnly(e,'traffic')} autoComplete="off"  ref={traffic => {this.traffic = traffic}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>其他现金流出合计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.otherCashOutflow', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.otherCashOutflow.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.otherCashOutflow}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>办理贷款的费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.loanFee', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.loanFee.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={loanFee => {this.loanFee = loanFee}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>其他贷款的还款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.payOthLoan', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.payOthLoan.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={payOthLoan => {this.payOthLoan = payOthLoan}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>贷款的还款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.payLoan', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.payLoan.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={payLoan => {this.payLoan = payLoan}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>退款支付，私人债务</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.payRefund', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.payRefund.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={payRefund => {this.payRefund = payRefund}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>投资</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.investment', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.investment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={investment => {this.investment = investment}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>家庭和其他的个人支出</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.familyPersonPay', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.familyPersonPay.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={familyPersonPay => {this.familyPersonPay = familyPersonPay}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>有针对性使用要求的贷款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.specificLoan', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.specificLoan.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={specificLoan => {this.specificLoan = specificLoan}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>期末现金余额</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroCashFlow.finalCashBalance', {
                                            initialValue: loanAssetAgroCashFlow && loanAssetAgroCashFlow.finalCashBalance.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.finalCashBalance}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Form>
            </div>
        )
    }
}

const pureEditFarmCash = pureRender(EditFarmCash);

export default pureEditFarmCash;
