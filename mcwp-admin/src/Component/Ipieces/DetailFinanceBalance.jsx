import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/editFinanceBalance.less';

/**
 * 进件详情财务情况资产负债表
 * @Author: 赵俊
 * @Date:   2017-06-20
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-13
 */
class DetailFinanceBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:''
        }
    }

    render() {
        let  loanAssetFinalInfo,loanAssetBeginInfo;
        this.props.balance.map((item,index)=>{
            if (item.type == 1) {
                loanAssetFinalInfo = item
            }
            if (item.type == 2) {
                loanAssetBeginInfo = item
            }
        })
        return (
            <div className='editFinanceBalance-container'>
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
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.bankCash}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.bankCash}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>短期投资</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.currentInvestment}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.currentInvestment}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应收票据</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.notesReceivable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.notesReceivable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应收账款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.accountReceivable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.accountReceivable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>预付账款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.prepayment}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.prepayment}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付股利</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.dividendPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.dividendPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应收利息</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.interestReceivable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.interestReceivable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他应收款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.otherReceivable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.otherReceivable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>存货</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.inventory}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.inventory}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>原材料</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.rawMaterial}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.rawMaterial}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>在产品</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.onSaleProducts}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.onSaleProducts}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>库存商品</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.stockProducts}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.stockProducts}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>周转材料</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.turnoverMaterial}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.turnoverMaterial}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他流动资产</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.otherCurrentAssets}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.otherCurrentAssets}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-total'>流动资产合计</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalCurrentAssets}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalCurrentAssets}</p>
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
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.longDebtInvestment}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.longDebtInvestment}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>长期股权投资</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.longEquityInvestment}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.longEquityInvestment}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>固定资产原价</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.cost}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.cost}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>减：累计折旧</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.accumulatedDepreciation}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.accumulatedDepreciation}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>固定资产账面价值</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.fixedAssets}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.fixedAssets}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>在建工程</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.constructionInProgress}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.constructionInProgress}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>工程物资</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.engineeringMaterials}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.engineeringMaterials}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>固定资产清理</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.fixedAssetsDisposed}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.fixedAssetsDisposed}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>生产性生物资产</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.biologicalAssets}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.biologicalAssets}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>无形资产</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.intangibleAssets}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.intangibleAssets}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>开发支出</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.developmentExpenditure}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.developmentExpenditure}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>长期待摊费用</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.longDeferredExpense}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.longDeferredExpense}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他非流动资产</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.otherNotCurrentAssets}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.otherNotCurrentAssets}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-total'>非流动资产合计</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.countNotCurrentAssets}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.countNotCurrentAssets}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>资产总计</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalAssets}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalAssets}</p>
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
                                <td className='finance-table-subtitle'>短期借款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.shortLoans}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.shortLoans}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle1'>其中：银行贷款，信用卡</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.creditCardLoans}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.creditCardLoans}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle1'>私人借款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.personalLoans}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.personalLoans}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付票据</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.notesPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.notesPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付账款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.accountsPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.accountsPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>预收账款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.advanceFromCustomers}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.advanceFromCustomers}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付职工薪酬</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.payrollPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.payrollPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应交税费</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.taxesPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.taxesPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付利息</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.interestPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.interestPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付利润</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.profitPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.profitPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他应付款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.otherPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.otherPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他流动负债</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.otherCurrentLiability}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.otherCurrentLiability}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-total'>流动负债合计</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalCurrentLiability}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalCurrentLiability}</p>
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
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.longLoans}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.longLoans}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>长期应付款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.longPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.longPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>递延收益</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.deferredRevenue}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.deferredRevenue}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他非流动负债</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.otherNotCurrentLiability}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.otherNotCurrentLiability}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-title-total'>非流动负债合计</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.countNotCurrentLiability}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.countNotCurrentLiability}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>负债总计</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalLiability}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalLiability}</p>
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
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.paidInCapital}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.paidInCapital}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>资本公积</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.capitalReserves}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.capitalReserves}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>盈余公积</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.surplusReserves}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.surplusReserves}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>未分配利润</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.undistributedProfit}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.undistributedProfit}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>所有者权益(或股东权益)合计</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalEquity}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalEquity}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>负债和所有者权益(或股东权益)总计</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalLiabilityEquity}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalLiabilityEquity}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        )
    }
}

const pureDetailFinanceBalance = pureRender(DetailFinanceBalance);

export default pureDetailFinanceBalance;
