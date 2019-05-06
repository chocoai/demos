import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/editFinanceCash.less';

/**
 * 进件详情财务情况现金流量表
 * @Author: 赵俊
 * @Date:   2017-06-20
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-06-20
 */
class DetailFinanceCash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:''
        }
    }
    render() {
        let  loanAssetYearCashFlow,loanAssetMouthCashflow;
        this.props.cash.map((item,index)=>{
            if (item.type == 1) {
                loanAssetYearCashFlow = item
            }
            if (item.type == 2) {
                loanAssetMouthCashflow = item
            }
        })
        return (
            <div className='editFinanceCash-container'>
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
                            <td className='finance-title-first'>经营活动产生的现金流量</td>
                            <td className='finance-title-content'>
                            </td>
                            <td className='finance-title-content'>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>销售产成品、商品、提供劳务收到的现金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.saleActivitiesCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.saleActivitiesCash}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>收到其他与经营活动有关的现金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.otherCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.otherCash}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>购买原材料、商品、接受劳务支付的现金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.commoditiesLaborCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.commoditiesLaborCash}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>支付的职工薪酬</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.employeesCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.employeesCash}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>支付的税费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.cashpaidTaxes}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.cashpaidTaxes}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>支付其他与经营活动相关的现金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.otherOperatingActivitiesCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.otherOperatingActivitiesCash}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>经营活动产生的现金流量净额</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearCashFlow && loanAssetYearCashFlow.operatingActivitiesCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMouthCashflow && loanAssetMouthCashflow.operatingActivitiesCash}</p>
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
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.recoveryCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.recoveryCash}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>取得投资收益收到的现金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.profitCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.profitCash}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>处置固定资产、无形资产和其他非流动资产收回的现金净额</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.fixedAssetsCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.fixedAssetsCash}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>短期投资、长期债券投资和长期股权投资支付的现金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.investmentCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.investmentCash}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>购建固定资产、无形资产和非流动资产支付的现金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.structureCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.structureCash}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>投资活动产生的现金流量净额</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearCashFlow && loanAssetYearCashFlow.investmentActivitiesCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMouthCashflow && loanAssetMouthCashflow.investmentActivitiesCash}</p>
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
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.borrowings}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.borrowings}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>吸收投资者投资收到的现金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.investorCash}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.investorCash}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>偿还借款本金支付的现金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.debtPaid}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.debtPaid}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>偿还借款利息支付的现金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.borrowingInterestPaid}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.borrowingInterestPaid}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>分配利润支付的现金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.distributionProfitPaid}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.distributionProfitPaid}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-third'>筹资活动产生的现金流量净额</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearCashFlow && loanAssetYearCashFlow.financingActivitiesPaid}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMouthCashflow && loanAssetMouthCashflow.financingActivitiesPaid}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>现金净增加额</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearCashFlow && loanAssetYearCashFlow.netCashIncrease}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMouthCashflow && loanAssetMouthCashflow.netCashIncrease}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>加：期初现金余额</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.beginningCashBalance}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetMouthCashflow && loanAssetMouthCashflow.beginningCashBalance}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>期末现金余额</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearCashFlow && loanAssetYearCashFlow.finalCashBalance}</p>
                            </td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetMouthCashflow && loanAssetMouthCashflow.finalCashBalance}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

const pureDetailFinanceCash = pureRender(DetailFinanceCash);

export default pureDetailFinanceCash;
