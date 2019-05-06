import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/editFarmBalance.less';

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
            var numString  = value.toString();
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
    //高流动性资产=柜面现金+其他手头现金+银行活期账户+银行定期存款
    totalCashFromOperationYearCalc(){
        let total = (this.accountCashFinal.value * 100 + this.otherCashFinal.value * 100 + this.currentAccountFinal.value * 100
                    + this.depositAmountFinal.value * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            totalCashFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroFinal.totalCash': total,
        });
        return total;
    }
    totalCashFromOperationMonthCalc(){
        let total = (this.accountCashBegin.value * 100 + this.otherCashBegin.value * 100 + this.currentAccountBegin.value * 100
            + this.depositAmountBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalCashBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroBegin.totalCash': total,
        });
        return total;
    }
    //应收账款=应收账款+预付款+其他应收款+运输中的货品+其他应收账户
    totalAccountRecFromOperationYearCalc(){
        let total = (this.accountReceivableRecFinal.value * 100 + this.prepaymentFinal.value * 100 + this.amountReceivableOthFinal.value * 100
                    + this.transitGoodsFinal.value * 100 + this.accountReceivableOthFinal.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalAccountRecFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroFinal.totalAccountRec': total,
        });
        return total;
    }
    totalAccountRecFromOperationMonthCalc(){
        let total = (this.accountReceivableRecBegin.value * 100 + this.prepaymentBegin.value * 100 + this.amountReceivableOthBegin.value * 100
            + this.transitGoodsBegin.value * 100 + this.accountReceivableOthBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalAccountRecBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroBegin.totalAccountRec': total,
        });
        return total;
    }
    //存货=货物材料库存+种植已花费+其他存货
    totalStockFromOperationYearCalc(){
        let total = (this.mateialStockFinal.value * 100 + this.usedPlantFinal.value * 100 + this.othStockFinal.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalStockFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroFinal.totalStock': total,
        });
        return total;
    }
    totalStockFromOperationMonthCalc(){
        let total = (this.mateialStockBegin.value * 100 + this.usedPlantBegin.value * 100 + this.othStockBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalStockBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroBegin.totalStock': total,
        });
        return total;
    }
    //流动资产=高流动性资产+应收账款+存货
    totalLiquidAssetBalanceYearCalc(totalCashFromOperationYearCalc,totalAccountRecFromOperationYearCalc,totalStockFromOperationYearCalc){
        let total = (totalCashFromOperationYearCalc * 100 + totalAccountRecFromOperationYearCalc * 100 + totalStockFromOperationYearCalc * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalLiquidAssetFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroFinal.totalLiquidAsset': total,
        });
        return total;
    }
    totalLiquidAssetBalanceMonthCalc(totalCashFromOperationMonthCalc,totalAccountRecFromOperationMonthCalc,totalStockFromOperationMonthCalc){
        let total = ( totalCashFromOperationMonthCalc * 100 + totalAccountRecFromOperationMonthCalc * 100 + totalStockFromOperationMonthCalc * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalLiquidAssetBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroBegin.totalLiquidAsset': total,
        });
        return total;
    }
    //总资产=流动资产+固定资产
    totalAssetBalanceYearCalc(totalLiquidAssetBalanceYearCalc){
        let total = (totalLiquidAssetBalanceYearCalc * 100 + this.fixedAssetsFinal.value* 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalAssetFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroFinal.totalAsset': total,
        });
        return total;
    }
    totalAssetBalanceMonthCalc(totalLiquidAssetBalanceMonthCalc){
        let total = ( totalLiquidAssetBalanceMonthCalc * 100 + this.fixedAssetsBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalAssetBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroBegin.totalAsset': total,
        });
        return total;
    }
    //总计=应付工资+应付税金和罚款+其他应付款
    totalPayFromOperationYearCalc(){
        let total = (this.wagesPayableFinal.value * 100 + this.taxesPayableFinal.value * 100 + this.othPayableFinal.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalPayFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroFinal.totalPay': total,
        });
        return total;
    }
    totalPayFromOperationMonthCalc(){
        let total = (this.wagesPayableBegin.value * 100 + this.taxesPayableBegin.value * 100 + this.othPayableBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalPayBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroBegin.totalPay': total,
        });
        return total;
    }
    //应付账款=应付账款+预收款+运输中的货品+其他应收账款
    totalAccountPayFromOperationYearCalc(){
        let total = (this.accountPayableFinal.value * 100 + this.preReceivableFinal.value * 100 + this.goodsPayableFinal.value * 100
            + this.othBillPayableFinal.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalAccountPayFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroFinal.totalAccountPay': total,
        });
        return total;
    }
    totalAccountPayFromOperationMonthCalc(){
        let total = (this.accountPayableBegin.value * 100 + this.preReceivableBegin.value * 100 + this.goodsPayableBegin.value * 100
            + this.othBillPayableBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalAccountPayBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroBegin.totalAccountPay': total,
        });
        return total;
    }
    //贷款=个人债务+短期贷款+长期贷款+其他贷款
    totalLoanFromOperationYearCalc(){
        let total = (this.personDebtFinal.value * 100 + this.shortLoansFinal.value * 100 + this.longLoansFinal.value * 100
            + this.othLoansFinal.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalLoanFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroFinal.totalLoan': total,
        });
        return total;
    }
    totalLoanFromOperationMonthCalc(){
        let total = (this.personDebtBegin.value * 100 + this.shortLoansBegin.value * 100 + this.longLoansBegin.value * 100
            + this.othLoansBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalLoanBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroBegin.totalLoan': total,
        });
        return total;
    }
    //总负债=总计+应收账款+贷款
    totalDebtBalanceYearCalc(totalAccountPayFromOperationYearCalc,totalPayFromOperationYearCalc,totalLoanFromOperationYearCalc){
        let total = (totalAccountPayFromOperationYearCalc * 100 + totalPayFromOperationYearCalc * 100 + totalLoanFromOperationYearCalc * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalDebtFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroFinal.totalDebt': total,
        });
        return total;
    }
    totalDebtBalanceMonthCalc(totalAccountPayFromOperationMonthCalc,totalPayFromOperationMonthCalc,totalLoanFromOperationMonthCalc){
        let total = ( totalAccountPayFromOperationMonthCalc * 100 + totalPayFromOperationMonthCalc * 100 + totalLoanFromOperationMonthCalc * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalDebtBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroBegin.totalDebt': total,
        });
        return total;
    }
    //权益=总资产-总负债
    totalRightsBalanceYearCalc(totalAssetBalanceYearCalc,totalDebtBalanceYearCalc){
        let total = (totalAssetBalanceYearCalc * 100 - totalDebtBalanceYearCalc * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            totalRightsFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroFinal.totalRights': total,
        });
        return total;
    }
    totalRightsBalanceMonthCalc(totalAssetBalanceMonthCalc,totalDebtBalanceMonthCalc){
        let total = ( totalAssetBalanceMonthCalc * 100 - totalDebtBalanceMonthCalc * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            totalRightsBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroBegin.totalRights': total,
        });
        return total;
    }
    //权益+负债=总负债+权益
    totalRightsDebtBalanceYearCalc(totalDebtBalanceYearCalc,totalDebtBalanceMonthCalc){
        let total = (totalDebtBalanceYearCalc * 100 + totalDebtBalanceMonthCalc * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            totalRightsDebtFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroFinal.totalRightsDebt': total,
        });
        return total;
    }
    totalRightsDebtBalanceMonthCalc(totalDebtBalanceMonthCalc,totalRightsBalanceMonthCalc){
        let total = ( totalDebtBalanceMonthCalc * 100 + totalRightsBalanceMonthCalc * 100 )/100;
        total = total.toFixed(2);
        this.setState({
            totalRightsDebtBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetAgroBegin.totalRightsDebt': total,
        });
        return total;
    }
    calculate(){
        let totalCashFromOperationYearCalc = this.totalCashFromOperationYearCalc(),
            totalCashFromOperationMonthCalc = this.totalCashFromOperationMonthCalc(),
            totalAccountRecFromOperationYearCalc = this.totalAccountRecFromOperationYearCalc(),
            totalAccountRecFromOperationMonthCalc = this.totalAccountRecFromOperationMonthCalc(),
            totalStockFromOperationYearCalc = this.totalStockFromOperationYearCalc(),
            totalStockFromOperationMonthCalc = this.totalStockFromOperationMonthCalc(),
            totalPayFromOperationYearCalc = this.totalPayFromOperationYearCalc(),
            totalPayFromOperationMonthCalc = this.totalPayFromOperationMonthCalc(),
            totalLiquidAssetBalanceYearCalc = this.totalLiquidAssetBalanceYearCalc(totalCashFromOperationYearCalc,totalAccountRecFromOperationYearCalc,totalStockFromOperationYearCalc),
            totalLiquidAssetBalanceMonthCalc = this.totalLiquidAssetBalanceMonthCalc(totalCashFromOperationMonthCalc,totalAccountRecFromOperationMonthCalc,totalStockFromOperationMonthCalc),
            totalAssetBalanceYearCalc = this.totalAssetBalanceYearCalc(totalLiquidAssetBalanceYearCalc),
            totalAssetBalanceMonthCalc = this.totalAssetBalanceMonthCalc(totalLiquidAssetBalanceMonthCalc),
            totalAccountPayFromOperationYearCalc = this.totalAccountPayFromOperationYearCalc(),
            totalAccountPayFromOperationMonthCalc = this.totalAccountPayFromOperationMonthCalc(),
            totalLoanFromOperationYearCalc = this.totalLoanFromOperationYearCalc(),
            totalLoanFromOperationMonthCalc = this.totalLoanFromOperationMonthCalc(),
            totalDebtBalanceYearCalc = this.totalDebtBalanceYearCalc(totalAccountPayFromOperationYearCalc,totalPayFromOperationYearCalc,totalLoanFromOperationYearCalc),
            totalDebtBalanceMonthCalc = this.totalDebtBalanceMonthCalc(totalAccountPayFromOperationMonthCalc,totalPayFromOperationMonthCalc,totalLoanFromOperationMonthCalc),
            totalRightsBalanceYearCalc = this.totalRightsBalanceYearCalc(totalAssetBalanceYearCalc,totalDebtBalanceYearCalc),
            totalRightsBalanceMonthCalc = this.totalRightsBalanceMonthCalc(totalAssetBalanceMonthCalc,totalDebtBalanceMonthCalc);
            this.totalRightsDebtBalanceYearCalc(totalDebtBalanceYearCalc,totalRightsBalanceYearCalc);
            this.totalRightsDebtBalanceMonthCalc(totalDebtBalanceMonthCalc,totalRightsBalanceMonthCalc);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { farmBalance } = this.props;
        let  loanAssetAgroFinal,loanAssetAgroBegin;
        farmBalance.map((item,index)=>{
            if (item.type == 1) {
                loanAssetAgroFinal = item
            }
            if (item.type == 2) {
                loanAssetAgroBegin = item
            }
        })
        return (
            <div className='editFarmBalance-container'>
                 <Form>
                    <table className='finance-table'>
                        <thead>
                            <tr className='finance-head'>
                                <th className='finance-table-title'>资产</th>
                                <th className='finance-table-head'>期末金额</th>
                                <th className='finance-table-head'>年初金额</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='finance-table-title'>高流动性资产</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.totalCash', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.totalCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalCashFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.totalCash', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.totalCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalCashBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>柜面现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.accountCash', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.accountCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accountCashFinal => {this.accountCashFinal = accountCashFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.accountCash', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.accountCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accountCashBegin => {this.accountCashBegin = accountCashBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他手头现金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.otherCash', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.otherCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherCashFinal => {this.otherCashFinal = otherCashFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.otherCash', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.otherCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherCashBegin => {this.otherCashBegin = otherCashBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>银行活期账户</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.currentAccount', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.currentAccount.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={currentAccountFinal => {this.currentAccountFinal = currentAccountFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.currentAccount', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.currentAccount.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={currentAccountBegin => {this.currentAccountBegin = currentAccountBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>银行定期存款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.depositAmount', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.depositAmount.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={depositAmountFinal => {this.depositAmountFinal = depositAmountFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.depositAmount', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.depositAmount.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={depositAmountBegin => {this.depositAmountBegin = depositAmountBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>应收账款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.totalAccountRec', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.totalAccountRec.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalAccountRecFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.totalAccountRec', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.totalAccountRec.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalAccountRecBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>应收账款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.accountReceivable', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.accountReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accountReceivableRecFinal => this.accountReceivableRecFinal = accountReceivableRecFinal} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.accountReceivable', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.accountReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accountReceivableRecBegin => {this.accountReceivableRecBegin = accountReceivableRecBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>预付款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.prepayment', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.prepayment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={prepaymentFinal => {this.prepaymentFinal = prepaymentFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.prepayment', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.prepayment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={prepaymentBegin => {this.prepaymentBegin = prepaymentBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>其他应收款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.amountReceivableOth', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.amountReceivableOth.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={amountReceivableOthFinal => {this.amountReceivableOthFinal = amountReceivableOthFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.amountReceivableOth', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.amountReceivableOth.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={amountReceivableOthBegin => {this.amountReceivableOthBegin = amountReceivableOthBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>运输中的货品</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.transitGoods', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.transitGoods.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={transitGoodsFinal => {this.transitGoodsFinal = transitGoodsFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.transitGoods', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.transitGoods.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={transitGoodsBegin => {this.transitGoodsBegin = transitGoodsBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>其他应收账户</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.accountReceivableOth', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.accountReceivableOth.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accountReceivableOthFinal => {this.accountReceivableOthFinal = accountReceivableOthFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.accountReceivableOth', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.accountReceivableOth.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accountReceivableOthBegin => {this.accountReceivableOthBegin = accountReceivableOthBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>存货</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.totalStock', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.totalStock.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalStockFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.totalStock', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.totalStock.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalStockBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>货物材料库存</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.mateialStock', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.mateialStock.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={mateialStockFinal => {this.mateialStockFinal = mateialStockFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.mateialStock', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.mateialStock.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={mateialStockBegin => {this.mateialStockBegin = mateialStockBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>种植已花费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.usedPlant', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.usedPlant.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={usedPlantFinal => {this.usedPlantFinal = usedPlantFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.usedPlant', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.usedPlant.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={usedPlantBegin => {this.usedPlantBegin = usedPlantBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他存货</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.othStock', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.othStock.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={othStockFinal => {this.othStockFinal = othStockFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.othStock', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.othStock.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={othStockBegin => {this.othStockBegin = othStockBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>流动资产合计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.totalLiquidAsset', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.totalLiquidAsset.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalLiquidAssetFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.totalLiquidAsset', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.totalLiquidAsset.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalLiquidAssetBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>固定资产</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.fixedAssets', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.fixedAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={fixedAssetsFinal => {this.fixedAssetsFinal = fixedAssetsFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.fixedAssets', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.fixedAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={fixedAssetsBegin => {this.fixedAssetsBegin = fixedAssetsBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>资产总计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.totalAsset', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.totalAsset.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalAssetFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.totalAsset', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.totalAsset.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalAssetBegin}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className='finance-table'>
                        <thead>
                            <tr className='finance-head'>
                                <th className='finance-table-title'>负债和所有者权益</th>
                                <th className='finance-table-head'>期末金额</th>
                                <th className='finance-table-head'>年初金额</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                                <td className='finance-table-title'>总计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.totalPay', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.totalPay.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalPayFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.totalPay', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.totalPay.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalPayBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付工资</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.wagesPayable', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.wagesPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={wagesPayableFinal => {this.wagesPayableFinal = wagesPayableFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.wagesPayable', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.wagesPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={wagesPayableBegin => {this.wagesPayableBegin = wagesPayableBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付税金和罚款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.taxesPayable', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.taxesPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={taxesPayableFinal => {this.taxesPayableFinal = taxesPayableFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.taxesPayable', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.taxesPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={taxesPayableBegin => {this.taxesPayableBegin = taxesPayableBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他应付款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.othPayable', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.othPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={othPayableFinal => {this.othPayableFinal = othPayableFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.othPayable', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.othPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={othPayableBegin => {this.othPayableBegin = othPayableBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'></td>
                                <td className='finance-title-content'>
                                </td>
                                <td className='finance-title-content'>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>应付账款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.totalAccountPay', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.totalAccountPay.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalAccountPayFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.totalAccountPay', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.totalAccountPay.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalAccountPayBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付款(设备租赁/服务)</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.accountPayable', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.accountPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accountPayableFinal => {this.accountPayableFinal = accountPayableFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.accountPayable', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.accountPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accountPayableBegin => {this.accountPayableBegin = accountPayableBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>预收款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.preReceivable', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.preReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={preReceivableFinal => {this.preReceivableFinal = preReceivableFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.preReceivable', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.preReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={preReceivableBegin => {this.preReceivableBegin = preReceivableBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>应付货款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.goodsPayable', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.goodsPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={goodsPayableFinal => {this.goodsPayableFinal = goodsPayableFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.goodsPayable', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.goodsPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={goodsPayableBegin => {this.goodsPayableBegin = goodsPayableBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>其他应付账款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.othBillPayable', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.othBillPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={othBillPayableFinal => {this.othBillPayableFinal = othBillPayableFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.othBillPayable', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.othBillPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={othBillPayableBegin => {this.othBillPayableBegin = othBillPayableBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>货款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.totalLoan', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.totalLoan.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalLoanFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.totalLoan', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.totalLoan.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalLoanBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>个人债务</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.personDebt', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.personDebt.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={personDebtFinal => {this.personDebtFinal = personDebtFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.personDebt', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.personDebt.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={personDebtBegin => {this.personDebtBegin = personDebtBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>短期贷款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.shortLoans', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.shortLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={shortLoansFinal => {this.shortLoansFinal = shortLoansFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.shortLoans', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.shortLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={shortLoansBegin => {this.shortLoansBegin = shortLoansBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>长期贷款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.longLoans', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.longLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={longLoansFinal => {this.longLoansFinal = longLoansFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.longLoans', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.longLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={longLoansBegin => {this.longLoansBegin = longLoansBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他借款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.othLoans', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.othLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={othLoansFinal => {this.othLoansFinal = othLoansFinal}}/>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.othLoans', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.othLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={othLoansBegin => {this.othLoansBegin = othLoansBegin}}/>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>总负债</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.totalDebt', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.totalDebt.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalDebtFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.totalDebt', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.totalDebt.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalDebtBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>权益</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.totalRights', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.totalRights.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalRightsFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.totalRights', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.totalRights.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalRightsBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>权益+负债</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroFinal.totalRightsDebt', {
                                            initialValue: loanAssetAgroFinal && loanAssetAgroFinal.totalRightsDebt.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalRightsDebtFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetAgroBegin.totalRightsDebt', {
                                            initialValue: loanAssetAgroBegin && loanAssetAgroBegin.totalRightsDebt.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalRightsDebtBegin}</p>
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
