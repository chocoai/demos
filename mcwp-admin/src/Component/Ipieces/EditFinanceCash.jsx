import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import './style/editFinanceCash.less';

import { Form } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑财务情况现金流量表
 * @Author: 赵俊
 * @Date:   2017-06-19
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-06
 */
class EditFinanceCash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // operatingActivitiesCashYear: ''
            cash:props.cash || []
        }
    }

    componentWillMount() {
    }
    componentDidMount(){
        this.calculate();
    }

    NumberOnly = (e) => {
        let value = e.target.value;
        let number = parseFloat(value);
        // if (!value) return;
        if(value == '-' || value == '0-' || value == '--') return e.target.value = '-';
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
                this.calculate();
                return;
            }
            e.target.value = 0;
            this.calculate();
            return;
        }
        if (/^([-]?)(\d{1,10})(\.?)(\d{0,2})$/.test(value)) {
            //排除首位为0的情况
            let numString  = value.toString();
            if(numString[0] == 0 && numString[1] != '.') {
                e.target.value = number;
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
        } else {
            number = number.toString().slice(0,-1);
            e.target.value = number;
        }
        this.calculate();
    }

    //经营活动产生的现金流量净额= -（销售产成品、商品、提供劳务收到的现金+收到其他与经营活动有关的现金+购买原材料、商品、接受劳务支付的现金+支付的职工薪酬+支付的税费+支付其他与经营活动有关的现金）
    operatingActivitiesCashYearCalc(){
        let total = - ( this.saleActivitiesCashYear.value * 100 + this.otherCashYear.value * 100 + this.commoditiesLaborCashYear.value * 100
                    + this.employeesCashYear.value * 100 + this.cashpaidTaxesYear.value * 100 + this.otherOperatingActivitiesCashYear.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            operatingActivitiesCashYear: total
        })
        this.props.form.setFieldsValue({
            'loanAssetYearCashFlow.operatingActivitiesCash': total,
        });
        return total;
    }
    operatingActivitiesCashMonthCalc(){
        let total = - ( this.saleActivitiesCashMonth.value * 100 + this.otherCashMonth.value * 100 + this.commoditiesLaborCashMonth.value * 100
                    + this.employeesCashMonth.value * 100 + this.cashpaidTaxesMonth.value * 100 + this.otherOperatingActivitiesCashMonth.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            operatingActivitiesCashMonth: total
        })
        this.props.form.setFieldsValue({
            'loanAssetMouthCashflow.operatingActivitiesCash': total,
        });
        return total;
    }


    //投资活动产生的现金流量净额=收回短期投资、长期债券投资和长期股权投资收到的现金+取得投资收益收到的现金+处置固定资产、无形资产和其他非流动资产收回的现金净额+短期投资、长期债券投资和长期股权投资支付的现金+购建固定资产、无形资产和其他非流动资产支付的现金
    investmentActivitiesCashYearCalc(){
        let total = ( this.recoveryCashYear.value * 100 + this.profitCashYear.value * 100 + this.fixedAssetsCashYear.value * 100
                    + this.investmentCashYear.value * 100 + this.structureCashYear.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            investmentActivitiesCashYear: total
        })
        this.props.form.setFieldsValue({
            'loanAssetYearCashFlow.investmentActivitiesCash': total,
        });
        return total;
    }
    investmentActivitiesCashMonthCalc(){
        let total = ( this.recoveryCashMonth.value * 100 + this.profitCashMonth.value * 100 + this.fixedAssetsCashMonth.value * 100
                    + this.investmentCashMonth.value * 100 + this.structureCashMonth.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            investmentActivitiesCashMonth: total
        })
        this.props.form.setFieldsValue({
            'loanAssetMouthCashflow.investmentActivitiesCash': total,
        });
        return total;
    }

    //筹资活动产生的现金流量净额=取得借款收到的现金+吸收投资者投资收到的现金+偿还借款本金支付的现金+偿还借款利息支付的现金+分配利润支付的现金
    financingActivitiesPaidYearCalc(){
        let total = ( this.borrowingsYear.value * 100 + this.investorCashYear.value * 100 + this.debtPaidYear.value * 100
                    + this.borrowingInterestPaidYear.value * 100 + this.distributionProfitPaidYear.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            financingActivitiesPaidYear: total
        })
        this.props.form.setFieldsValue({
            'loanAssetYearCashFlow.financingActivitiesPaid': total,
        });
        return total;
    }
    financingActivitiesPaidMonthCalc(){
        let total = ( this.borrowingsMonth.value * 100 + this.investorCashMonth.value * 100 + this.debtPaidMonth.value * 100
                    + this.borrowingInterestPaidMonth.value * 100 + this.distributionProfitPaidMonth.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            financingActivitiesPaidMonth: total
        })
        this.props.form.setFieldsValue({
            'loanAssetMouthCashflow.financingActivitiesPaid': total,
        });
        return total;
    }

    //现金净增加额=筹资活动产生的现金流量净额+投资活动产生的现金流量净额+经营活动产生的现金流量净额
    netCashIncreaseYearCalc(operatingActivitiesCashYear,investmentActivitiesCashYear,financingActivitiesPaidYear){
        let total = (operatingActivitiesCashYear * 100 + investmentActivitiesCashYear * 100 + financingActivitiesPaidYear * 100)/100;
        total = total.toFixed(2);
        this.setState({
            netCashIncreaseYear: total
        })
        this.props.form.setFieldsValue({
            'loanAssetYearCashFlow.netCashIncrease': total,
        });
        return total;
    }
    netCashIncreaseMonthCalc(operatingActivitiesCashMonth,investmentActivitiesCashMonth,financingActivitiesPaidMonth){
        let total = (operatingActivitiesCashMonth * 100 + investmentActivitiesCashMonth * 100 + financingActivitiesPaidMonth * 100)/100;
        total = total.toFixed(2);
        this.setState({
            netCashIncreaseMonth: total
        })
        this.props.form.setFieldsValue({
            'loanAssetMouthCashflow.netCashIncrease': total,
        });
        return total;
    }

    //期末现金余额=现金净增加额+期初现金余额
    finalCashBalanceYearCalc(netCashIncreaseYear){
        let total = (netCashIncreaseYear * 100 + this.beginningCashBalanceYear.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            finalCashBalanceYear: total
        })
        this.props.form.setFieldsValue({
            'loanAssetYearCashFlow.finalCashBalance': total,
        });
        return total;
    }
    finalCashBalanceMonthCalc(netCashIncreaseMonth){
        let total = (netCashIncreaseMonth * 100 + this.beginningCashBalanceMonth.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            finalCashBalanceMonth: total
        })
        this.props.form.setFieldsValue({
            'loanAssetMouthCashflow.finalCashBalance': total,
        });
        return total;
    }


    calculate(){
        let operatingActivitiesCashYear = this.operatingActivitiesCashYearCalc(),
            operatingActivitiesCashMonth = this.operatingActivitiesCashMonthCalc(),
            investmentActivitiesCashYear = this.investmentActivitiesCashYearCalc(),
            investmentActivitiesCashMonth = this.investmentActivitiesCashMonthCalc(),
            financingActivitiesPaidYear = this.financingActivitiesPaidYearCalc(),
            financingActivitiesPaidMonth = this.financingActivitiesPaidMonthCalc(),
            netCashIncreaseYear = this.netCashIncreaseYearCalc(operatingActivitiesCashYear,investmentActivitiesCashYear,financingActivitiesPaidYear),
            netCashIncreaseMonth = this.netCashIncreaseMonthCalc(operatingActivitiesCashMonth,investmentActivitiesCashMonth,financingActivitiesPaidMonth);

        this.finalCashBalanceYearCalc(netCashIncreaseYear);
        this.finalCashBalanceMonthCalc(netCashIncreaseMonth);

    }


    render() {
        const { getFieldDecorator } = this.props.form;
        let  loanAssetYearCashFlow,loanAssetMouthCashflow;
        const { cash } = this.state;
        cash.map((item,index)=>{
            if (item.type == 1) {
                loanAssetYearCashFlow = item
            }
            if (item.type == 2) {
                loanAssetMouthCashflow = item
            }
        })
        return (
            <div className='editFinanceCash-container'>
                <Form>
                    <table className='finance-table'>
                        <thead className='finance-head'>
                            <tr>
                                <th className='finance-head-first'>项目</th>
                                <th className='finance-head-second'>本年累计金额</th>
                                <th className='finance-head-second'>本月金额</th>
                            </tr>
                        </thead>
                        <tbody>
                           <tr>
                                <td className='finance-title-first'>经营活动产生的现金流量</td>
                                <td className='finance-title-content'>
                                </td>
                                <td className='finance-title-content'>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>销售产成品、商品、提供劳务收到的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.saleActivitiesCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.saleActivitiesCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off"  ref={saleActivitiesCashYear => {this.saleActivitiesCashYear = saleActivitiesCashYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.saleActivitiesCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.saleActivitiesCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={saleActivitiesCashMonth => {this.saleActivitiesCashMonth = saleActivitiesCashMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>收到其他与经营活动有关的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.otherCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.otherCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherCashYear => {this.otherCashYear = otherCashYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.otherCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.otherCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherCashMonth => {this.otherCashMonth = otherCashMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>购买原材料、商品、接受劳务支付的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.commoditiesLaborCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.commoditiesLaborCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={commoditiesLaborCashYear => {this.commoditiesLaborCashYear = commoditiesLaborCashYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.commoditiesLaborCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.commoditiesLaborCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={commoditiesLaborCashMonth => {this.commoditiesLaborCashMonth = commoditiesLaborCashMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>支付的职工薪酬</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.employeesCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.employeesCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={employeesCashYear => {this.employeesCashYear = employeesCashYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.employeesCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.employeesCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={employeesCashMonth => {this.employeesCashMonth = employeesCashMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>支付的税费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.cashpaidTaxes', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.cashpaidTaxes.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={cashpaidTaxesYear => {this.cashpaidTaxesYear = cashpaidTaxesYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.cashpaidTaxes', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.cashpaidTaxes.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={cashpaidTaxesMonth => {this.cashpaidTaxesMonth = cashpaidTaxesMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>支付其他与经营活动有关的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.otherOperatingActivitiesCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.otherOperatingActivitiesCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherOperatingActivitiesCashYear => {this.otherOperatingActivitiesCashYear = otherOperatingActivitiesCashYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.otherOperatingActivitiesCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.otherOperatingActivitiesCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherOperatingActivitiesCashMonth => {this.otherOperatingActivitiesCashMonth = otherOperatingActivitiesCashMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                           <tr>
                                <td className='finance-title-third'>经营活动产生的现金流量净额</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.operatingActivitiesCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.operatingActivitiesCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.operatingActivitiesCashYear}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.operatingActivitiesCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.operatingActivitiesCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.operatingActivitiesCashMonth}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>投资活动产生的现金流量</td>
                                <td className='finance-title-content'>
                                </td>
                                <td className='finance-title-content'>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>收回短期投资、长期债券投资和长期股权投资收到的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.recoveryCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.recoveryCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={recoveryCashYear => {this.recoveryCashYear = recoveryCashYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.recoveryCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.recoveryCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={recoveryCashMonth => {this.recoveryCashMonth = recoveryCashMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>取得投资收益收到的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.profitCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.profitCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={profitCashYear => {this.profitCashYear = profitCashYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.profitCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.profitCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={profitCashMonth => {this.profitCashMonth = profitCashMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>处置固定资产、无形资产和其他非流动资产收回的现金净额</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.fixedAssetsCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.fixedAssetsCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={fixedAssetsCashYear => {this.fixedAssetsCashYear = fixedAssetsCashYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.fixedAssetsCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.fixedAssetsCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={fixedAssetsCashMonth => {this.fixedAssetsCashMonth = fixedAssetsCashMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>短期投资、长期债券投资和长期股权投资支付的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.investmentCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.investmentCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={investmentCashYear => {this.investmentCashYear = investmentCashYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.investmentCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.investmentCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={investmentCashMonth => {this.investmentCashMonth = investmentCashMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>购建固定资产、无形资产和其他非流动资产支付的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.structureCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.structureCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={structureCashYear => {this.structureCashYear = structureCashYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.structureCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.structureCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={structureCashMonth => {this.structureCashMonth = structureCashMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-third'>投资活动产生的现金流量净额</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.investmentActivitiesCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.investmentActivitiesCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.investmentActivitiesCashYear}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.investmentActivitiesCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.investmentActivitiesCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.investmentActivitiesCashMonth}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>筹资活动产生的现金流量</td>
                                <td className='finance-title-content'>
                                </td>
                                <td className='finance-title-content'>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>取得借款收到的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.borrowings', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.borrowings.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={borrowingsYear => {this.borrowingsYear = borrowingsYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.borrowings', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.borrowings.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={borrowingsMonth => {this.borrowingsMonth = borrowingsMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>吸收投资者投资收到的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.investorCash', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.investorCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={investorCashYear => {this.investorCashYear = investorCashYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.investorCash', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.investorCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={investorCashMonth => {this.investorCashMonth = investorCashMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>偿还借款本金支付的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.debtPaid', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.debtPaid.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={debtPaidYear => {this.debtPaidYear = debtPaidYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.debtPaid', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.debtPaid.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={debtPaidMonth => {this.debtPaidMonth = debtPaidMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>偿还借款利息支付的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.borrowingInterestPaid', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.borrowingInterestPaid.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={borrowingInterestPaidYear => {this.borrowingInterestPaidYear = borrowingInterestPaidYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.borrowingInterestPaid', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.borrowingInterestPaid.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={borrowingInterestPaidMonth => {this.borrowingInterestPaidMonth = borrowingInterestPaidMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>分配利润支付的现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.distributionProfitPaid', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.distributionProfitPaid.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={distributionProfitPaidYear => {this.distributionProfitPaidYear = distributionProfitPaidYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.distributionProfitPaid', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.distributionProfitPaid.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={distributionProfitPaidMonth => {this.distributionProfitPaidMonth = distributionProfitPaidMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-third'>筹资活动产生的现金流量净额</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.financingActivitiesPaid', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.financingActivitiesPaid.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.financingActivitiesPaidYear}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.financingActivitiesPaid', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.financingActivitiesPaid.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.financingActivitiesPaidMonth}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>现金净增加额</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.netCashIncrease', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.netCashIncrease.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.netCashIncreaseYear}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.netCashIncrease', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.netCashIncrease.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.netCashIncreaseMonth}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>加：期初现金余额</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.beginningCashBalance', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.beginningCashBalance.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={beginningCashBalanceYear => {this.beginningCashBalanceYear = beginningCashBalanceYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.beginningCashBalance', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.beginningCashBalance.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={beginningCashBalanceMonth => {this.beginningCashBalanceMonth = beginningCashBalanceMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>期末现金余额</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.finalCashBalance', {
                                            initialValue: loanAssetYearCashFlow && loanAssetYearCashFlow.finalCashBalance.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.finalCashBalanceYear}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.finalCashBalance', {
                                            initialValue: loanAssetMouthCashflow && loanAssetMouthCashflow.finalCashBalance.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.finalCashBalanceMonth}</p>
                                </td>

                                <td className='finance-title-content' style={{display:'none'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearCashFlow.type', {
                                            initialValue: 1,
                                            rules: [{ required: false }],
                                        })(
                                            <p />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content' style={{display:'none'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMouthCashflow.type', {
                                            initialValue: 2,
                                            rules: [{ required: false }],
                                        })(
                                            <p />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Form>
            </div>
        )
    }
}

const pureEditFinanceCash = pureRender(EditFinanceCash);

export default pureEditFinanceCash;
