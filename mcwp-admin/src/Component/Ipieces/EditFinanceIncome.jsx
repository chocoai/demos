import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import './style/editFinanceIncome.less';

import { Form } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑财务情况损益表
 * @Author: 赵俊
 * @Date:   2017-06-19
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-06
 */
class EditFinanceIncome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            income:props.income || [],
            profitFromOperationYear: '',
            profitFromOperationMonth: ''
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
        if(value == '-' || value == '0-' || value == '--') return e.target.value = '-';
        if (isNaN(number)) {
            var numString  = value.toString();
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

    //营业利润=营业收入-营业成本-营业税金及附加-销售费用-管理费用-财务费用
    profitFromOperationYearCalc(){
        let total = (this.revenueYear.value * 100 - this.costOfSalesYear.value * 100 - this.countSalesTaxYear.value * 100
                    - this.saleExpenseYear.value * 100 - this.manageExpenseYear.value * 100 - this.financeExpenseYear.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            profitFromOperationYear: total
        })
        this.props.form.setFieldsValue({
            'loanAssetYearIncstat.profitFromOperation': total,
        });
        return total;
    }
    profitFromOperationMonthCalc(){
        let total = (this.revenueMonth.value * 100 - this.costOfSalesMonth.value * 100 - this.countSalesTaxMonth.value * 100
                    - this.saleExpenseMonth.value * 100 - this.manageExpenseMonth.value * 100 - this.financeExpenseMonth.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            profitFromOperationMonth: total
        })
        this.props.form.setFieldsValue({
            'loanAssetMonthIncstat.profitFromOperation': total,
        });
        return total;
    }

    //利润总额=营业利润+营业外收入-营业外支出
    profitBeforeTaxYearCalc(profitFromOperationYear){
        let total = ( profitFromOperationYear * 100 + this.nonOperatingIncomeYear.value * 100 - this.nonOperatingExpenseYear.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            profitBeforeTaxYear: total
        })
        this.props.form.setFieldsValue({
            'loanAssetYearIncstat.profitBeforeTax': total,
        });
        return total;
    }
    profitBeforeTaxMonthCalc(profitFromOperationMonth){
        let total = ( profitFromOperationMonth * 100 + this.nonOperatingIncomeMonth.value * 100 - this.nonOperatingExpenseMonth.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            profitBeforeTaxMonth: total
        })
        this.props.form.setFieldsValue({
            'loanAssetMonthIncstat.profitBeforeTax': total,
        });
        return total;
    }

    //净利润=利润总额-所得税
    netProfitYearCalc(profitBeforeTaxYear){
        let total = (profitBeforeTaxYear * 100 - this.incomeTaxYear.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            netProfitYear: total
        })
        this.props.form.setFieldsValue({
            'loanAssetYearIncstat.netProfit': total,
        });
        return total;
    }
    netProfitMonthCalc(profitBeforeTaxMonth){
        let total = (profitBeforeTaxMonth * 100 - this.incomeTaxMonth.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            netProfitMonth: total
        })
        this.props.form.setFieldsValue({
            'loanAssetMonthIncstat.netProfit': total,
        });
        return total;
    }



    calculate(){
        let profitFromOperationYear = this.profitFromOperationYearCalc(),
            profitFromOperationMonth = this.profitFromOperationMonthCalc(),
            profitBeforeTaxYear = this.profitBeforeTaxYearCalc(profitFromOperationYear),
            profitBeforeTaxMonth = this.profitBeforeTaxMonthCalc(profitFromOperationMonth);

    this.netProfitYearCalc(profitBeforeTaxYear);
    this.netProfitMonthCalc(profitBeforeTaxMonth);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let  loanAssetYearIncstat,loanAssetMonthIncstat;
        const { income } = this.state;
        income.map((item,index)=>{
            if (item.type == 1) {
                loanAssetYearIncstat = item
            }
            if (item.type == 2) {
                loanAssetMonthIncstat = item
            }
        })
        return (
            <div className='editFinanceIncome-container'>
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
                                <td className='finance-title-first'>营业收入</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.revenue', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.revenue.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={revenueYear => {this.revenueYear = revenueYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.revenue', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.revenue.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={revenueMonth => {this.revenueMonth = revenueMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>减：营业成本</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.costOfSales', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.costOfSales.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={costOfSalesYear => {this.costOfSalesYear = costOfSalesYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.costOfSales', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.costOfSales.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={costOfSalesMonth => {this.costOfSalesMonth = costOfSalesMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-third'>营业税金及附加</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.countSalesTax', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.countSalesTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={countSalesTaxYear => {this.countSalesTaxYear = countSalesTaxYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.countSalesTax', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.countSalesTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={countSalesTaxMonth => {this.countSalesTaxMonth = countSalesTaxMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-fourth'>消费税</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.exciseTax', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.exciseTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.exciseTax', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.exciseTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-fourth'>营业税</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.salesTax', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.salesTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.salesTax', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.salesTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-fourth'>城市维护建设税</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.constructionTax', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.constructionTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.constructionTax', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.constructionTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-fourth'>资源税</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.resourceTax', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.resourceTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.resourceTax', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.resourceTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-fourth'>土地增值税</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.landValueIncrementTax', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.landValueIncrementTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.landValueIncrementTax', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.landValueIncrementTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-fourth'>城镇土地使用税、房产税、车船税、印花税</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.uhvsTax', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.uhvsTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.uhvsTax', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.uhvsTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-fourth'>教育费附加、矿产资源补偿费、排污费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.emsTax', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.emsTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.emsTax', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.emsTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>销售费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.saleExpense', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.saleExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={saleExpenseYear => {this.saleExpenseYear = saleExpenseYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.saleExpense', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.saleExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={saleExpenseMonth => {this.saleExpenseMonth = saleExpenseMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-third'>商品维修费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.repairExpense', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.repairExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.repairExpense', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.repairExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-third'>广告费和业务宣传费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.publicityExpense', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.publicityExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.publicityExpense', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.publicityExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>管理费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.manageExpense', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.manageExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={manageExpenseYear => {this.manageExpenseYear = manageExpenseYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.manageExpense', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.manageExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={manageExpenseMonth => {this.manageExpenseMonth = manageExpenseMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-third'>开办费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.startExpense', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.startExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.startExpense', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.startExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-third'>业务招待费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.entertainExpense', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.entertainExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.entertainExpense', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.entertainExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-third'>研究费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.researchExpense', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.researchExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.researchExpense', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.researchExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>财务费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.financeExpense', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.financeExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={financeExpenseYear => {this.financeExpenseYear = financeExpenseYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.financeExpense', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.financeExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={financeExpenseMonth => {this.financeExpenseMonth = financeExpenseMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-third'>利息费用（收入以"-"号填列）</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.interestExpense', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.interestExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.interestExpense', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.interestExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>加：投资收益（亏损以"-"号填列）</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.investmentIncome', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.investmentIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.investmentIncome', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.investmentIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-first'>营业利润：投资收益（亏损以"-"号填列）</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.profitFromOperation', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.profitFromOperation.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.profitFromOperationYear}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.profitFromOperation', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.profitFromOperation.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.profitFromOperationMonth}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>加：营业外收入</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.nonOperatingIncome', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.nonOperatingIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={nonOperatingIncomeYear => {this.nonOperatingIncomeYear = nonOperatingIncomeYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.nonOperatingIncome', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.nonOperatingIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={nonOperatingIncomeMonth => {this.nonOperatingIncomeMonth = nonOperatingIncomeMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-third'>政府补助</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.subsidyIncome', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.subsidyIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.subsidyIncome', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.subsidyIncome.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>减：营业外支出</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.nonOperatingExpense', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.nonOperatingExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={nonOperatingExpenseYear => {this.nonOperatingExpenseYear = nonOperatingExpenseYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.nonOperatingExpense', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.nonOperatingExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={nonOperatingExpenseMonth => {this.nonOperatingExpenseMonth = nonOperatingExpenseMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-third'>坏账损失</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.badDebtLoss', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.badDebtLoss.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.badDebtLoss', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.badDebtLoss.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-fourth'>无法收回的长期债券投资损失</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.bondInvestmentLoss', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.bondInvestmentLoss.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.bondInvestmentLoss', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.bondInvestmentLoss.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-fourth'>无法收回的长期股权投资损失</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.equityInvestmentLoss', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.equityInvestmentLoss.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.equityInvestmentLoss', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.equityInvestmentLoss.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-fourth'>自然灾害等不可抗力因素造成的损失</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.naturalDisasterLoss', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.naturalDisasterLoss.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.naturalDisasterLoss', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.naturalDisasterLoss.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-fourth'>税收滞纳金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.taxLatePayment', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.taxLatePayment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.taxLatePayment', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.taxLatePayment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>利润总额（亏损总额以"-"号填列）</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.profitBeforeTax', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.profitBeforeTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.profitBeforeTaxYear}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.profitBeforeTax', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.profitBeforeTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.profitBeforeTaxMonth}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-third'>减：所得税费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.incomeTax', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.incomeTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={incomeTaxYear => {this.incomeTaxYear = incomeTaxYear}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.incomeTax', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.incomeTax.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={incomeTaxMonth => {this.incomeTaxMonth = incomeTaxMonth}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-second'>净利润（净亏损以"-"号填列）</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.netProfit', {
                                            initialValue: loanAssetYearIncstat && loanAssetYearIncstat.netProfit.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.netProfitYear}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.netProfit', {
                                            initialValue: loanAssetMonthIncstat && loanAssetMonthIncstat.netProfit.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.netProfitMonth}</p>
                                </td>

                                <td className='finance-title-content' style={{display:'none'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetYearIncstat.type', {
                                            initialValue: 1,
                                            rules: [{ required: false }],
                                        })(
                                            <p />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content' style={{display:'none'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetMonthIncstat.type', {
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

const pureEditFinanceIncome = pureRender(EditFinanceIncome);

export default pureEditFinanceIncome;
