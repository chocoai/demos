import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/editFinanceBalance.less';

/**
 * 农贷进件详情财务情况资产负债表
 * @Author: 钟观发
 * @Date:   2017-10-11
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-10-11
 */
class DetailFarmBalance extends Component {
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
                                <td className='finance-table-title'>高流动性资产</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalCash}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalCash}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>柜面现金</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.accountCash}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.accountCash}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他手头现金</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.otherCash}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.otherCash}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>银行活期账户</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.currentAccount}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.currentAccount}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>银行定期存款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.depositAmount}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.depositAmount}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>应收账款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalAccountRec}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalAccountRec}</p>
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
                                <td className='finance-table-subtitle'>预付款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.prepayment}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.prepayment}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他应收款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.amountReceivableOth}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.amountReceivableOth}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>运输中的货品</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.transitGoods}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.transitGoods}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>其他应收账户</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.accountReceivableOth}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.accountReceivableOth}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>存货</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalStock}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalStock}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>货物材料库存</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.mateialStock}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.mateialStock}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-detail'>种植已花费</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.usedPlant}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.usedPlant}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他存货</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.othStock}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.othStock}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>流动资产合计</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalLiquidAsset}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalLiquidAsset}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>固定资产</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.fixedAssets}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.fixedAssets}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>资产总计</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalAsset}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalAsset}</p>
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
                                <td className='finance-table-title'>总计</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalPay}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalPay}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付工资</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.wagesPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.wagesPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付税金和罚款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.taxesPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.taxesPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他应付款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.othPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.othPayable}</p>
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
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalAccountPay}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalAccountPay}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付款(设备租赁/服务)</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.accountPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.accountPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>预收款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.preReceivable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.preReceivable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>应付货款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.goodsPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.goodsPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他应付账款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.othBillPayable}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.othBillPayable}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>货款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalLoan}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalLoan}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>个人债务</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.personDebt}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.personDebt}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>短期贷款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.shortLoans}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.shortLoans}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>长期贷款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.longLoans}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.longLoans}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-subtitle'>其他借款</td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetFinalInfo && loanAssetFinalInfo.othLoans}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-second'>{loanAssetBeginInfo && loanAssetBeginInfo.othLoans}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>总负债</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalDebt}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalDebt}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>权益</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalRights}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalRights}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='finance-table-title'>权益+负债</td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetFinalInfo && loanAssetFinalInfo.totalRightsDebt}</p>
                                </td>
                                <td className='finance-title-content'>
                                    <p className='detail-first'>{loanAssetBeginInfo && loanAssetBeginInfo.totalRightsDebt}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        )
    }
}

const pureDetailFarmBalance = pureRender(DetailFarmBalance);

export default pureDetailFarmBalance;
