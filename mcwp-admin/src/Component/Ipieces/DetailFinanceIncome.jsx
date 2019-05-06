import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/editFinanceIncome.less';

/**
 * 进件详情财务情况损益表
 * @Author: 赵俊
 * @Date:   2017-06-20
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-06-20
 */
class DetailFinanceIncome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:''
        }
    }

    render() {
        let  loanAssetYearIncstat,loanAssetMonthIncstat;
        this.props.income.map((item,index)=>{
            if (item.type == 1) {
                loanAssetYearIncstat = item
            }
            if (item.type == 2) {
                loanAssetMonthIncstat = item
            }
        })
        return (
            <div className='editFinanceIncome-container'>
                <table className='finance-table'>
                    <thead className='finance-head'>
                        <tr>
                            <th className='finance-head-first'>项目</th>
                            <th className='finance-head-second'>本年累计金额</th>
                            <th className='finance-head-second'>上年金额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='finance-title-first'>营业收入</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.revenue}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMonthIncstat && loanAssetMonthIncstat.revenue}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>减：营业成本</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.costOfSales}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMonthIncstat && loanAssetMonthIncstat.costOfSales}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>营业税金及附加</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.countSalesTax}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.countSalesTax}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-fourth'>消费税</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.exciseTax}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.exciseTax}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-fourth'>营业税</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.salesTax}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.salesTax}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-fourth'>城市维护建设税</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.constructionTax}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.constructionTax}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-fourth'>资源税</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.resourceTax}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.resourceTax}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-fourth'>土地增值税</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.landValueIncrementTax}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.landValueIncrementTax}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-fourth'>城镇土地使用税、房产税、车船税、印花税</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.uhvsTax}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.uhvsTax}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-fourth'>教育费附加、矿产资源补偿费、排污费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.emsTax}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.emsTax}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>销售费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.saleExpense}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMonthIncstat && loanAssetMonthIncstat.saleExpense}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>商品维修费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.repairExpense}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.repairExpense}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>广告费和业务宣传费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.publicityExpense}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.publicityExpense}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>管理费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.manageExpense}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMonthIncstat && loanAssetMonthIncstat.manageExpense}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>开办费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.startExpense}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.startExpense}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>业务招待费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.entertainExpense}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.entertainExpense}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>研究费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.researchExpense}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.researchExpense}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>财务费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.financeExpense}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMonthIncstat && loanAssetMonthIncstat.financeExpense}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>利息费用（收入以"-"号填列）</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.interestExpense}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.interestExpense}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>加：投资收益（亏损以"-"号填列）</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.investmentIncome}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMonthIncstat && loanAssetMonthIncstat.investmentIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>营业利润：投资收益（亏损以"-"号填列）</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.profitFromOperation}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMonthIncstat && loanAssetMonthIncstat.profitFromOperation}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>加：营业收入</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.nonOperatingIncome}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMonthIncstat && loanAssetMonthIncstat.nonOperatingIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>政府补助</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.subsidyIncome}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.subsidyIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>减：营业外支出</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.nonOperatingExpense}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMonthIncstat && loanAssetMonthIncstat.nonOperatingExpense}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>坏账损失</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.badDebtLoss}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.badDebtLoss}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-fourth'>无法收回的长期债券投资损失</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.bondInvestmentLoss}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.bondInvestmentLoss}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-fourth'>无法回收的长期股权投资损失</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.equityInvestmentLoss}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.equityInvestmentLoss}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-fourth'>自然灾害等不可抗力因素造成的投资损失</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.naturalDisasterLoss}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.naturalDisasterLoss}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-fourth'>税收滞纳金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.taxLatePayment}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.taxLatePayment}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>利润总额（亏损总额以"-"号填列）</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.profitBeforeTax}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMonthIncstat && loanAssetMonthIncstat.profitBeforeTax}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>减：所得税费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.incomeTax}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMonthIncstat && loanAssetMonthIncstat.incomeTax}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>净利润（净亏损以"-"号填列）</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.netProfit}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMonthIncstat && loanAssetMonthIncstat.netProfit}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

const pureDetailFinanceIncome = pureRender(DetailFinanceIncome);

export default pureDetailFinanceIncome;
