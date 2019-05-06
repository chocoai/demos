import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { browserHistory } from 'react-router';
import './style/editFinanceBalance.less';

import { Form } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑财务情况资产负债表
 * @Author: 赵俊
 * @Date:   2017-06-19
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-06
 */
class EditFinanceBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCurrentAssetsFinal: '',   //流动资产合计期末
            totalCurrentAssetsBegin: '',   //流动资产合计年初
            countNotCurrentAssetsFinal: '',//非流动资产合计期末
            countNotCurrentAssetsBegin:'',  //非流动资产合计年初
            totalAssetsFinal:'',            //资产总计期末
            totalAssetsBegin:'',             //资产总计年初
            fixedAssetsFinal: '',           //固定资产账面价值期末
            fixedAssetsBegin: '',            //固定资产账面价值年初
            totalCurrentLiabilityFinal:'',  //流动负债合计期末
            totalCurrentLiabilityBegin:'',   //流动负债合计年初
            countNotCurrentLiabilityFinal:'',//非流动负债合计期末
            countNotCurrentLiabilityBegin:'',//非流动负债合计年初
            totalEquityFinal:'',            //所有者权益(或股东权益)合计期末
            totalEquityBrgin:'',            //所有者权益(或股东权益)合计年初
            totalLiabilityEquityFinal: '',  //负债和所有者权益合计期末
            totalLiabilityEquityBegin: '',  //负债和所有者权益合计年初
            totalShortLoanFinal:'',         //短期借款期末
            totalShortLoanBegin:'',          //短期借款年初
            balance:props.balance || []
        }
    }

    componentDidMount() {
        this.calculate();
    }
    componentWillReceiveProps (nextProps) {
        // 初始化时候this.state.priceSum != undefined判断
        if(nextProps.priceSum != this.props.priceSum || this.state.priceSum != nextProps.priceSum) {
            this.calculate(nextProps.priceSum);
        }
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
    //流动资产合计,流动资产合计=货币资金+短期投资+应收票据+应收账款+预付账款+应收股利+应收利息+其他应收款+存货+其他流动资产
    totalCurrentAssetsFinalCalc() {
        let total = (this.bankCashFinal.value * 100 + this.currentInvestmentFinal.value * 100 + this.notesReceivableFinal.value * 100 + this.accountReceivableFinal.value * 100
                    + this.prepaymentFinal.value * 100 + this.dividendReceivableFinal.value * 100 + this.interestReceivableFinal.value * 100 + this.otherReceivableFinal.value * 100
                    + this.inventoryFinal.value * 100 + this.otherCurrentAssetsFinal.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalCurrentAssetsFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetFinalInfo.totalCurrentAssets': total,
        });
        return total;
    }
    totalCurrentAssetsBeginCalc() {
        let total = (this.bankCashBegin.value * 100 + this.currentInvestmentBegin.value * 100 + this.notesReceivableBegin.value * 100 + this.accountReceivableBegin.value * 100
                    + this.prepaymentBegin.value * 100 + this.dividendReceivableBegin.value * 100 + this.interestReceivableBegin.value * 100 + this.otherReceivableBegin.value * 100
                    + this.inventoryBegin.value * 100 + this.otherCurrentAssetsBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalCurrentAssetsBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetBeginInfo.totalCurrentAssets': total,
        });
        return total;
    }
    //固定资产账面价值 = 固定资产原价-累计折旧
    fixedAssetsFinalCalc(costFinal){
        if (!costFinal) costFinal = 0
        let total = (costFinal * 100 - this.accumulatedDepreciationFinal.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            fixedAssetsFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetFinalInfo.fixedAssets': total,
        });
        return total;
    }
    fixedAssetsBeginCalc(costBegin){
        if (!costBegin) costBegin = 0
        let total = (costBegin * 100 - this.accumulatedDepreciationBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            fixedAssetsBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetBeginInfo.fixedAssets': total,
        });
        return total;
    }

    //非流动资产合计=长期债券投资+长期股权投资+固定资产账面价值+在建工程+工程物资+固定资产清理+生产性生物资产+无形资产+开发支出+长期待摊费用+其他非流动资产
    countNotCurrentAssetsFinalCalc (fixedAssetsFinal) {
        let total = (this.longDebtInvestmentFinal.value * 100 + this.longEquityInvestmentFinal.value * 100 + fixedAssetsFinal * 100
                    + this.constructionInProgressFinal.value * 100 + this.engineeringMaterialsFinal.value * 100 + this.fixedAssetsDisposedFinal.value * 100
                    + this.biologicalAssetsFinal.value * 100 + this.intangibleAssetsFinal.value * 100 + this.developmentExpenditureFinal.value * 100
                    + this.longDeferredExpenseFinal.value * 100 + this.otherNotCurrentAssetsFinal.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            countNotCurrentAssetsFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetFinalInfo.countNotCurrentAssets': total,
        });
        return total;
    }
    countNotCurrentAssetsBeginCalc (fixedAssetsBegin) {
        let total = (this.longDebtInvestmentBegin.value * 100 + this.longEquityInvestmentBegin.value * 100 + fixedAssetsBegin * 100
                    + this.constructionInProgressBegin.value * 100 + this.engineeringMaterialsBegin.value * 100 + this.fixedAssetsDisposedBegin.value * 100
                    + this.biologicalAssetsBegin.value * 100 + this.intangibleAssetsBegin.value * 100 + this.developmentExpenditureBegin.value * 100
                    + this.longDeferredExpenseBegin.value * 100 + this.otherNotCurrentAssetsBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            countNotCurrentAssetsBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetBeginInfo.countNotCurrentAssets': total,
        });
        return total;
    }
    //资产总计=流动资产合计+非流动资产合计
    totalAssetsFinalCalc (totalCurrentAssetsFinal,countNotCurrentAssetsFinal) {
        let total = (totalCurrentAssetsFinal * 100 + countNotCurrentAssetsFinal * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalAssetsFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetFinalInfo.totalAssets': total,
        });
        return total;
    }
    totalAssetsBeginCalc (totalCurrentAssetsFinal,countNotCurrentAssetsFinal) {
        let total = (totalCurrentAssetsFinal * 100 + countNotCurrentAssetsFinal * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalAssetsBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetBeginInfo.totalAssets': total,
        });
        return total;
    }

    //流动负债合计=短期借款+应付票据+应付账款+预收账款+应付职工薪酬+应交税费+应付利息+应付利润+其他应付款+其他流动负债
    totalCurrentLiabilityFinalCalc(totalShortLoanFinal) {
        let total = ( totalShortLoanFinal * 100 + this.notesPayableFinal.value * 100 + this.accountsPayableFinal.value * 100
                    + this.advanceFromCustomersFinal.value * 100 + this.payrollPayableFinal.value * 100 + this.taxesPayableFinal.value * 100
                    + this.interestPayableFinal.value * 100 + this.profitPayableFinal.value * 100 + this.otherPayableFinal.value * 100
                    + this.otherCurrentLiabilityFinal.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalCurrentLiabilityFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetFinalInfo.totalCurrentLiability': total,
        });
        return total;
    }
    totalCurrentLiabilityBeginCalc(totalShortLoanBegin) {
        let total = (  totalShortLoanBegin * 100 + this.notesPayableBegin.value * 100 + this.accountsPayableBegin.value * 100
                    + this.advanceFromCustomersBegin.value * 100 + this.payrollPayableBegin.value * 100 + this.taxesPayableBegin.value * 100
                    + this.interestPayableBegin.value * 100 + this.profitPayableBegin.value * 100 + this.otherPayableBegin.value * 100
                    + this.otherCurrentLiabilityBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalCurrentLiabilityBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetBeginInfo.totalCurrentLiability': total,
        });
        return total;
    }
    //非流动负债合计=长期借款+长期应付款+递延收益+其他非流动负债
    countNotCurrentLiabilityFinalCalc(){
        let total = (this.longLoansFinal.value * 100 + this.longPayableFinal.value * 100
                    + this.deferredRevenueFinal.value * 100 + this.otherNotCurrentLiabilityFinal.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            countNotCurrentLiabilityFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetFinalInfo.countNotCurrentLiability': total,
        });
        return total;
    }
    countNotCurrentLiabilityBeginCalc(){
        let total = (this.longLoansBegin.value * 100 + this.longPayableBegin.value * 100
                    + this.deferredRevenueBegin.value * 100 + this.otherNotCurrentLiabilityBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            countNotCurrentLiabilityBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetBeginInfo.countNotCurrentLiability': total,
        });
        return total;
    }

    //负债合计=流动负债合计+非流动负债合计
    totalLiabilityFinalCalc(totalCurrentLiabilityFinal,countNotCurrentLiabilityFinal){
        let total = (totalCurrentLiabilityFinal * 100 + countNotCurrentLiabilityFinal * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalLiabilityFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetFinalInfo.totalLiability': total,
        });
        return total;
    }
    totalLiabilityBeginCalc(totalCurrentLiabilityBegin,countNotCurrentLiabilityBegin){
        let total = (totalCurrentLiabilityBegin * 100 + countNotCurrentLiabilityBegin * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalLiabilityBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetBeginInfo.totalLiability': total,
        });
        return total;
    }

    //所有者权益（或股东权益）= 实收资本（或股本）+资本公积+ 盈余公积+未分配利润
    totalEquityFinalCalc(){
        let total = (this.paidInCapitalFinal.value * 100 + this.capitalReservesFinal.value * 100
                    + this.surplusReservesFinal.value * 100 + this.undistributedProfitFinal.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalEquityFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetFinalInfo.totalEquity': total,
        });
        return total;
    }
    totalEquityBeginlCalc(){
        let total = (this.paidInCapitalBegin.value * 100 + this.capitalReservesBegin.value * 100
                    + this.surplusReservesBegin.value * 100 + this.undistributedProfitBegin.value * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalEquityBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetBeginInfo.totalEquity': total,
        });
        return total;
    }
    //负债和所有者权益合计（或股东权益）=负债合计+所有者权益（或股东权益）
    totalLiabilityEquityFinalCalc(totalLiabilityFinal,totalEquityFinal){
        let total = (totalLiabilityFinal * 100 + totalEquityFinal * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalLiabilityEquityFinal: total
        })
        this.props.form.setFieldsValue({
            'loanAssetFinalInfo.totalLiabilityEquity': total,
        });
        return total;
    }
    totalLiabilityEquityBeginCalc(totalLiabilityBegin,totalEquityBegin){
        let total = (totalLiabilityBegin * 100 + totalEquityBegin * 100)/100;
        total = total.toFixed(2);
        this.setState({
            totalLiabilityEquityBegin: total
        })
        this.props.form.setFieldsValue({
            'loanAssetBeginInfo.totalLiabilityEquity': total,
        });
        return total;
    }
 //短期借款 = 银行卡信用卡贷款 + 私人借款
 totalShortLoanFinalCalc(){
    let total = (this.creditCardLoansFinal.value * 100 + this.personalLoansFinal.value * 100)/100;
    total = total.toFixed(2);
    this.setState({
        totalShortLoanFinal: total
    })
    this.props.form.setFieldsValue({
        'loanAssetFinalInfo.shortLoans': total,
    });
    return total;
}
totalShortLoanBeginCalc(){
    let total = (this.creditCardLoansBegin.value * 100 + this.personalLoansBegin.value * 100)/100;
    total = total.toFixed(2);
    this.setState({
        totalShortLoanBegin: total
    })
    this.props.form.setFieldsValue({
        'loanAssetBeginInfo.shortLoans': total,
    });
    return total;
}
    //计算汇总
    calculate = (priceSum) => {
        const {balance} = this.state
        let costFinal, costBegin
        if (priceSum || priceSum == 0) {
            costFinal = priceSum
            costBegin = costFinal
            this.setState({
                priceSum: priceSum
            })
        } else {
            let loanAssetFinalInfo;
            if (!this.state.priceSum) {
                balance && balance.map((item,index)=>{
                    if (item.type == 1) {
                        loanAssetFinalInfo = item
                    }
                })
            }
            // 考虑为0的情况
            if (this.state.priceSum == 0) {
                costFinal = 0
            } else {
                costFinal = this.state.priceSum || loanAssetFinalInfo && loanAssetFinalInfo.cost
            }
            costBegin = costFinal
        }
        let totalShortLoanFinal = this.totalShortLoanFinalCalc(),
            totalShortLoanBegin = this.totalShortLoanBeginCalc();

        let totalCurrentAssetsFinal = this.totalCurrentAssetsFinalCalc(),
            totalCurrentAssetsBegin = this.totalCurrentAssetsBeginCalc(),
            fixedAssetsFinal = this.fixedAssetsFinalCalc(costFinal),
            fixedAssetsBegin = this.fixedAssetsBeginCalc(costBegin),
            countNotCurrentAssetsFinal = this.countNotCurrentAssetsFinalCalc(fixedAssetsFinal),
            countNotCurrentAssetsBegin = this.countNotCurrentAssetsBeginCalc(fixedAssetsBegin);

        this.totalAssetsFinalCalc(totalCurrentAssetsFinal,countNotCurrentAssetsFinal);
        this.totalAssetsBeginCalc(totalCurrentAssetsBegin,countNotCurrentAssetsBegin);

        let totalCurrentLiabilityFinal = this.totalCurrentLiabilityFinalCalc(totalShortLoanFinal),
            totalCurrentLiabilityBegin = this.totalCurrentLiabilityBeginCalc(totalShortLoanBegin),
            countNotCurrentLiabilityFinal = this.countNotCurrentLiabilityFinalCalc(),
            countNotCurrentLiabilityBegin = this.countNotCurrentLiabilityBeginCalc();

        let totalLiabilityFinal = this.totalLiabilityFinalCalc(totalCurrentLiabilityFinal,countNotCurrentLiabilityFinal),
            totalLiabilityBegin = this.totalLiabilityBeginCalc(totalCurrentLiabilityBegin,countNotCurrentLiabilityBegin);

        let totalEquityFinal = this.totalEquityFinalCalc(),
            totalEquityBegin = this.totalEquityBeginlCalc();

        this.totalLiabilityEquityFinalCalc(totalLiabilityFinal,totalEquityFinal);
        this.totalLiabilityEquityBeginCalc(totalLiabilityBegin,totalEquityBegin);
    }
    redirect = () => {
        browserHistory.push({
            pathname:'/ipieces/edit/detail/' + this.props.code,
            state: {some: 'state'}
        });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { linkTo, code, priceSum } = this.props;
        // const { balance } = this.state;
        let  loanAssetFinalInfo,loanAssetBeginInfo;
        this.props.balance && this.props.balance.map((item,index)=>{
            if (item.type == 1) {
                loanAssetFinalInfo = item
            }
            if (item.type == 2) {
                loanAssetBeginInfo = item
            }
        })
        return (
            <div className='editFinanceBalance-container'>
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
                                <td className='finance-table-title'>流动资产</td>
                                <td className='finance-title-content'>
                                </td>
                                <td className='finance-title-content'>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>货币资金</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.bankCash', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.bankCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={bankCashFinal => {this.bankCashFinal = bankCashFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.bankCash', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.bankCash.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={bankCashBegin => {this.bankCashBegin = bankCashBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>短期投资</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.currentInvestment', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.currentInvestment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={currentInvestmentFinal => {this.currentInvestmentFinal = currentInvestmentFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.currentInvestment', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.currentInvestment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={currentInvestmentBegin => {this.currentInvestmentBegin = currentInvestmentBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应收票据</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.notesReceivable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.notesReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={notesReceivableFinal => {this.notesReceivableFinal = notesReceivableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.notesReceivable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.notesReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={notesReceivableBegin => {this.notesReceivableBegin = notesReceivableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle finance-table-link' onClick = {()=>linkTo('/ipieces/edit/detail/' + code+'/6/1')} >应收账款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.accountReceivable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.accountReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accountReceivableFinal => {this.accountReceivableFinal = accountReceivableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.accountReceivable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.accountReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accountReceivableBegin => {this.accountReceivableBegin = accountReceivableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle finance-table-link' onClick = {()=>linkTo('/ipieces/edit/detail/' + code+'/6/4')}>预付账款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.prepayment', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.prepayment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={prepaymentFinal => {this.prepaymentFinal = prepaymentFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.prepayment', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.prepayment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={prepaymentBegin => {this.prepaymentBegin = prepaymentBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应收股利</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.dividendReceivable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.dividendReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={dividendReceivableFinal => {this.dividendReceivableFinal = dividendReceivableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.dividendReceivable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.dividendReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={dividendReceivableBegin => {this.dividendReceivableBegin = dividendReceivableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应收利息</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.interestReceivable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.interestReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={interestReceivableFinal => {this.interestReceivableFinal = interestReceivableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.interestReceivable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.interestReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={interestReceivableBegin => {this.interestReceivableBegin = interestReceivableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他应收款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.otherReceivable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.otherReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherReceivableFinal => {this.otherReceivableFinal = otherReceivableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.otherReceivable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.otherReceivable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherReceivableBegin => {this.otherReceivableBegin = otherReceivableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title finance-table-link' onClick = {()=>linkTo('/ipieces/edit/detail/' + code+'/6/5')}>存货</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.inventory', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.inventory.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={inventoryFinal => {this.inventoryFinal = inventoryFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.inventory', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.inventory.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={inventoryBegin => {this.inventoryBegin = inventoryBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>其中：原材料</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.rawMaterial', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.rawMaterial.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.rawMaterial', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.rawMaterial.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail finance-content-detail'>在产品</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.onSaleProducts', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.onSaleProducts.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.onSaleProducts', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.onSaleProducts.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail finance-content-detail'>库存商品</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.stockProducts', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.stockProducts.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.stockProducts', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.stockProducts.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail finance-content-detail'>周转材料</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.turnoverMaterial', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.turnoverMaterial.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.turnoverMaterial', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.turnoverMaterial.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他流动资产</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.otherCurrentAssets', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.otherCurrentAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherCurrentAssetsFinal => {this.otherCurrentAssetsFinal = otherCurrentAssetsFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.otherCurrentAssets', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.otherCurrentAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherCurrentAssetsBegin => {this.otherCurrentAssetsBegin = otherCurrentAssetsBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-total'>流动资产合计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.totalCurrentAssets', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.totalCurrentAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalCurrentAssetsFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.totalCurrentAssets', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.totalCurrentAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display: 'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalCurrentAssetsBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>非流动资产</td>
                                <td className='finance-title-content'>
                                </td>
                                <td className='finance-title-content'>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>长期债券投资</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.longDebtInvestment', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.longDebtInvestment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={longDebtInvestmentFinal => {this.longDebtInvestmentFinal = longDebtInvestmentFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.longDebtInvestment', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.longDebtInvestment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={longDebtInvestmentBegin => {this.longDebtInvestmentBegin = longDebtInvestmentBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>长期股权投资</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.longEquityInvestment', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.longEquityInvestment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={longEquityInvestmentFinal => {this.longEquityInvestmentFinal = longEquityInvestmentFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.longEquityInvestment', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.longEquityInvestment.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={longEquityInvestmentBegin => {this.longEquityInvestmentBegin = longEquityInvestmentBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>固定资产原价</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.cost', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.cost.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" style={{display:'none'}} onChange={this.NumberOnly} autoComplete="off" ref={costFinal => {this.costFinal = costFinal}} />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{priceSum && (+priceSum).toFixed(2) || loanAssetFinalInfo && loanAssetFinalInfo.cost.toFixed(2) || '0.00'}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.cost', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.cost.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" style={{display:'none'}} onChange={this.NumberOnly} autoComplete="off" ref={costBegin => {this.costBegin = costBegin}} />
                                        )}
                                    </FormItem>
                                     <p className='detail-first'>{priceSum && (+priceSum).toFixed(2) || loanAssetBeginInfo && loanAssetBeginInfo.cost.toFixed(2) || '0.00'}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>减：累计折旧</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.accumulatedDepreciation', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.accumulatedDepreciation.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accumulatedDepreciationFinal => {this.accumulatedDepreciationFinal = accumulatedDepreciationFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.accumulatedDepreciation', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.accumulatedDepreciation.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accumulatedDepreciationBegin => {this.accumulatedDepreciationBegin = accumulatedDepreciationBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>固定资产账面价值</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.fixedAssets', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.fixedAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={fixedAssetsFinal => {this.fixedAssetsFinal = fixedAssetsFinal}} />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.fixedAssetsFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.fixedAssets', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.fixedAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={fixedAssetsBegin => {this.fixedAssetsBegin = fixedAssetsBegin}} />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.fixedAssetsBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>在建工程</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.constructionInProgress', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.constructionInProgress.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={constructionInProgressFinal => {this.constructionInProgressFinal = constructionInProgressFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.constructionInProgress', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.constructionInProgress.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={constructionInProgressBegin => {this.constructionInProgressBegin = constructionInProgressBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>工程物资</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.engineeringMaterials', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.engineeringMaterials.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={engineeringMaterialsFinal => {this.engineeringMaterialsFinal = engineeringMaterialsFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.engineeringMaterials', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.engineeringMaterials.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={engineeringMaterialsBegin => {this.engineeringMaterialsBegin = engineeringMaterialsBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>固定资产清理</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.fixedAssetsDisposed', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.fixedAssetsDisposed.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={fixedAssetsDisposedFinal => {this.fixedAssetsDisposedFinal = fixedAssetsDisposedFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.fixedAssetsDisposed', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.fixedAssetsDisposed.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={fixedAssetsDisposedBegin => {this.fixedAssetsDisposedBegin = fixedAssetsDisposedBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>生产性生物资产</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.biologicalAssets', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.biologicalAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={biologicalAssetsFinal => {this.biologicalAssetsFinal = biologicalAssetsFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.biologicalAssets', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.biologicalAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={biologicalAssetsBegin => {this.biologicalAssetsBegin = biologicalAssetsBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>无形资产</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.intangibleAssets', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.intangibleAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={intangibleAssetsFinal => {this.intangibleAssetsFinal = intangibleAssetsFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.intangibleAssets', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.intangibleAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={intangibleAssetsBegin => {this.intangibleAssetsBegin = intangibleAssetsBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>开发支出</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.developmentExpenditure', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.developmentExpenditure.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={developmentExpenditureFinal => {this.developmentExpenditureFinal = developmentExpenditureFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.developmentExpenditure', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.developmentExpenditure.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={developmentExpenditureBegin => {this.developmentExpenditureBegin = developmentExpenditureBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>长期待摊费用</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.longDeferredExpense', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.longDeferredExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={longDeferredExpenseFinal => {this.longDeferredExpenseFinal = longDeferredExpenseFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.longDeferredExpense', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.longDeferredExpense.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={longDeferredExpenseBegin => {this.longDeferredExpenseBegin = longDeferredExpenseBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他非流动资产</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.otherNotCurrentAssets', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.otherNotCurrentAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherNotCurrentAssetsFinal => {this.otherNotCurrentAssetsFinal = otherNotCurrentAssetsFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.otherNotCurrentAssets', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.otherNotCurrentAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherNotCurrentAssetsBegin => {this.otherNotCurrentAssetsBegin = otherNotCurrentAssetsBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-total'>非流动资产合计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.countNotCurrentAssets', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.countNotCurrentAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={countNotCurrentAssetsFinal => {this.countNotCurrentAssetsFinal = countNotCurrentAssetsFinal}} />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.countNotCurrentAssetsFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.countNotCurrentAssets', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.countNotCurrentAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={countNotCurrentAssetsBegin => {this.countNotCurrentAssetsBegin = countNotCurrentAssetsBegin}} />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.countNotCurrentAssetsBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>资产总计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.totalAssets', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.totalAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={totalAssetsFinal => {this.totalAssetsFinal = totalAssetsFinal}} />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalAssetsFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.totalAssets', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.totalAssets.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={totalAssetsBegin => {this.totalAssetsBegin = totalAssetsBegin}} />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalAssetsBegin}</p>
                                </td>
                                <td className='finance-title-content' style={{display:'none'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.type', {
                                            initialValue: 1,
                                            rules: [{ required: false }],
                                        })(
                                            <p />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content' style={{display:'none'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.type', {
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
                    <table className='finance-table'>
                        <thead>
                            <tr className='finance-head'>
                                <th className='finance-table-title finance-title-adjust'>负债和所有者权益</th>
                                <th className='finance-table-head'>期末金额</th>
                                <th className='finance-table-head'>年初金额</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='finance-table-title'>流动负债</td>
                                <td className='finance-title-content'>
                                </td>
                                <td className='finance-title-content'>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>短期借款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.shortLoans', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.shortLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <p className='detail-first'>{this.state.totalShortLoanFinal}</p>
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.shortLoans', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.shortLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <p className='detail-first'>{this.state.totalShortLoanBegin}</p>
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>其中：银行贷款，信用卡</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.creditCardLoans', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.creditCardLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={creditCardLoansFinal => {this.creditCardLoansFinal = creditCardLoansFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.creditCardLoans', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.creditCardLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={creditCardLoansBegin => {this.creditCardLoansBegin = creditCardLoansBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail finance-content-detail'>私人借款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.personalLoans', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.personalLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={personalLoansFinal => {this.personalLoansFinal = personalLoansFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.personalLoans', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.personalLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={personalLoansBegin => {this.personalLoansBegin = personalLoansBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付票据</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.notesPayable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.notesPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={notesPayableFinal => {this.notesPayableFinal = notesPayableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.notesPayable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.notesPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={notesPayableBegin => {this.notesPayableBegin = notesPayableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle finance-table-link' onClick = {()=>linkTo('/ipieces/edit/detail/' + code + '/6/2')}>应付账款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.accountsPayable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.accountsPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accountsPayableFinal => {this.accountsPayableFinal = accountsPayableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.accountsPayable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.accountsPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={accountsPayableBegin => {this.accountsPayableBegin = accountsPayableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle finance-table-link' onClick = {()=>linkTo('/ipieces/edit/detail/' + code + '/6/3')}>预收账款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.advanceFromCustomers', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.advanceFromCustomers.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={advanceFromCustomersFinal => {this.advanceFromCustomersFinal = advanceFromCustomersFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.advanceFromCustomers', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.advanceFromCustomers.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={advanceFromCustomersBegin => {this.advanceFromCustomersBegin = advanceFromCustomersBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付职工薪酬</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.payrollPayable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.payrollPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={payrollPayableFinal => {this.payrollPayableFinal = payrollPayableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.payrollPayable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.payrollPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={payrollPayableBegin => {this.payrollPayableBegin = payrollPayableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应交税费</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.taxesPayable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.taxesPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={taxesPayableFinal => {this.taxesPayableFinal = taxesPayableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.taxesPayable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.taxesPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={taxesPayableBegin => {this.taxesPayableBegin = taxesPayableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付利息</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.interestPayable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.interestPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={interestPayableFinal => {this.interestPayableFinal = interestPayableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.interestPayable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.interestPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={interestPayableBegin => {this.interestPayableBegin = interestPayableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付利润</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.profitPayable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.profitPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={profitPayableFinal => {this.profitPayableFinal = profitPayableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.profitPayable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.profitPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={profitPayableBegin => {this.profitPayableBegin = profitPayableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他应付款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.otherPayable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.otherPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherPayableFinal => {this.otherPayableFinal = otherPayableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.otherPayable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.otherPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherPayableBegin => {this.otherPayableBegin = otherPayableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他流动负债</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.otherCurrentLiability', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.otherCurrentLiability.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherCurrentLiabilityFinal => {this.otherCurrentLiabilityFinal = otherCurrentLiabilityFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.otherCurrentLiability', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.otherCurrentLiability.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherCurrentLiabilityBegin => {this.otherCurrentLiabilityBegin = otherCurrentLiabilityBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-total'>流动负债合计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.totalCurrentLiability', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.totalCurrentLiability.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalCurrentLiabilityFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.totalCurrentLiability', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.totalCurrentLiability.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalCurrentLiabilityBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>非流动负债</td>
                                <td className='finance-title-content'>
                                </td>
                                <td className='finance-title-content'>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>长期借款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.longLoans', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.longLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={longLoansFinal => {this.longLoansFinal = longLoansFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.longLoans', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.longLoans.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={longLoansBegin => {this.longLoansBegin = longLoansBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>长期应付款</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.longPayable', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.longPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={longPayableFinal => {this.longPayableFinal = longPayableFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.longPayable', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.longPayable.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={longPayableBegin => {this.longPayableBegin = longPayableBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>递延收益</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.deferredRevenue', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.deferredRevenue.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={deferredRevenueFinal => {this.deferredRevenueFinal = deferredRevenueFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.deferredRevenue', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.deferredRevenue.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={deferredRevenueBegin => {this.deferredRevenueBegin = deferredRevenueBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他非流动负债</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.otherNotCurrentLiability', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.otherNotCurrentLiability.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherNotCurrentLiabilityFinal => {this.otherNotCurrentLiabilityFinal = otherNotCurrentLiabilityFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.otherNotCurrentLiability', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.otherNotCurrentLiability.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={otherNotCurrentLiabilityBegin => {this.otherNotCurrentLiabilityBegin = otherNotCurrentLiabilityBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-total'>非流动负债合计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.countNotCurrentLiability', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.countNotCurrentLiability.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.countNotCurrentLiabilityFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.countNotCurrentLiability', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.countNotCurrentLiability.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.countNotCurrentLiabilityBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>负债合计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.totalLiability', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.totalLiability.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalLiabilityFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.totalLiability', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.totalLiability.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalLiabilityBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-content-blank'><p /></td>
                                <td className='finance-content-blank'><p /></td>
                                <td className='finance-content-blank'><p /></td>
                            </tr>
                            <tr>
                                <td className='finance-content-blank'><p /></td>
                                <td className='finance-content-blank'><p /></td>
                                <td className='finance-content-blank'><p /></td>
                            </tr>
                            <tr>
                                <td className='finance-content-blank'><p /></td>
                                <td className='finance-content-blank'><p /></td>
                                <td className='finance-content-blank'><p /></td>
                            </tr>
                            <tr>
                                <td className='finance-content-blank'><p /></td>
                                <td className='finance-content-blank'><p /></td>
                                <td className='finance-content-blank'><p /></td>
                                <td className='finance-content-blank' style={{display:'none'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.type', {
                                            initialValue: 1,
                                            rules: [{ required: false }],
                                        })(
                                            <p />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-content-blank' style={{display:'none'}}>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.type', {
                                            initialValue: 2,
                                            rules: [{ required: false }],
                                        })(
                                            <p />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>所有者权益(或股东权益)</td>
                                <td className='finance-title-content'>
                                </td>
                                <td className='finance-title-content'>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>实收资本(或股本)</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.paidInCapital', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.paidInCapital.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={paidInCapitalFinal => {this.paidInCapitalFinal = paidInCapitalFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.paidInCapital', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.paidInCapital.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={paidInCapitalBegin => {this.paidInCapitalBegin = paidInCapitalBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>资本公积</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.capitalReserves', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.capitalReserves.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={capitalReservesFinal => {this.capitalReservesFinal = capitalReservesFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.capitalReserves', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.capitalReserves.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={capitalReservesBegin => {this.capitalReservesBegin = capitalReservesBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>盈余公积</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.surplusReserves', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.surplusReserves.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={surplusReservesFinal => {this.surplusReservesFinal = surplusReservesFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.surplusReserves', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.surplusReserves.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={surplusReservesBegin => {this.surplusReservesBegin = surplusReservesBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>未分配利润</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.undistributedProfit', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.undistributedProfit.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={undistributedProfitFinal => {this.undistributedProfitFinal = undistributedProfitFinal}} />
                                        )}
                                    </FormItem>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.undistributedProfit', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.undistributedProfit.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" ref={undistributedProfitBegin => {this.undistributedProfitBegin = undistributedProfitBegin}} />
                                        )}
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>所有者权益(或股东权益)合计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.totalEquity', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.totalEquity.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalEquityFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.totalEquity', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.totalEquity.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalEquityBegin}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>负债和所有者权益(或股东权益)总计</td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetFinalInfo.totalLiabilityEquity', {
                                            initialValue: loanAssetFinalInfo && loanAssetFinalInfo.totalLiabilityEquity.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalLiabilityEquityFinal}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <FormItem>
                                        {getFieldDecorator('loanAssetBeginInfo.totalLiabilityEquity', {
                                            initialValue: loanAssetBeginInfo && loanAssetBeginInfo.totalLiabilityEquity.toFixed(2) || '',
                                            rules: [{ required: false }],
                                        })(
                                            <input className='finance-input' style={{display:'none'}} placeholder="0.00" onChange={this.NumberOnly} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <p className='detail-first'>{this.state.totalLiabilityEquityBegin}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Form>
            </div>
        )
    }
}

const pureEditFinanceBalance = pureRender(EditFinanceBalance);

export default pureEditFinanceBalance;
