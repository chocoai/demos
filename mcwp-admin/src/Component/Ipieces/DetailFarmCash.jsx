import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/editFinanceCash.less';

/**
 * 农贷进件详情财务情况现金流量表
 * @Author: 钟观发
 * @Date:   2017-10-11
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-10-11
 */
class DetailFarmCash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:''
        }
    }

    render() {
        const { cash } = this.props;
        let  loanAssetYearCashFlow = cash.loanAssetAgroCashFlow;
        return (
            <div className='editFinanceCash-container'>
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
                                <p className='detail-first'>{loanAssetYearCashFlow && loanAssetYearCashFlow.initialCash}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>现金流入合计</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearCashFlow && loanAssetYearCashFlow.totalCashInflow}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>变卖库存</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.sellStock}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>回收应收账款</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.recAccount}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>获得贷款</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.acquireLoan}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>其他生意收入</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.othBusiIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>机械设备出租收入</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.machineLeaseIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>加工服务的收入</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.machiningIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>经营活动现金流出合计</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearCashFlow && loanAssetYearCashFlow.operateCashOutflow}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>土地租金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.landLease}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>农用设备的维修费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.farmingRepair}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>税款</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.taxs}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>工人的工资</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.workerSalary}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>雇工伙食费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.employeeMeals}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>杂费，管理费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.overhead}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>房屋租金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.houseLease}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>房屋修理费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.houseRepair}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>招待费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.invitationFee}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>仓储费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.storageFee}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>安保费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.securityFee}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>其他生意的费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.othBillFee}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>私人交通费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.traffic}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>其他的现金流出合计</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearCashFlow && loanAssetYearCashFlow.otherCashOutflow}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>办理贷款的费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.loanFee}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>其他贷款的还款</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.payOthLoan}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>贷款的还款</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.payLoan}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>退款支付，私人债务</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.payRefund}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>投资</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.investment}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>家庭和其他的个人支出</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.familyPersonPay}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>有针对性使用要求的贷款</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearCashFlow && loanAssetYearCashFlow.specificLoan}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>期末现金余额</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearCashFlow && loanAssetYearCashFlow.finalCashBalance}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

const pureDetailFarmCash = pureRender(DetailFarmCash);

export default pureDetailFarmCash;
