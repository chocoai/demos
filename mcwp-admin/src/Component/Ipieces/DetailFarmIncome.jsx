import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import './style/editFinanceCash.less';

/**
 * 农贷进件详情财务情况损益表
 * @Author: 钟观发
 * @Date:   2017-10-11
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-10-11
 */
class DetailFinanceIncome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:''
        }
    }

    render() {
        const { income} = this.props;
        let  loanAssetYearIncstat = income.loanAssetAgroIncstat;
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
                            <td className='finance-title-first'>销售收入</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.sellIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>种植收入</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.plantIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>养殖收入</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.farmIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>其他生意收入</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.othBusiIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>机械设备出租收入</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.machineLeaseIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>加工服务收入</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.machiningIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>经营直接成本</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.operateCost}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>种植成本</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.plantCost}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>喂养成本</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.farmCost}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>其他生意成本</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.othBusiCost}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>其他成本</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.othCost}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>农业周期杂费</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.agricultureCost}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>购买的用于育肥的幼畜</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.neonate}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>防疫及受精成本</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.epidemicCost}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>包装的成本</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.packageCost}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>收割的装卸和饲料的装卸</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.bargeCost}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>秋收和饲料的运输成本</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.trasportCost}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>经营的毛利润</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.grossProfit}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>经营的杂费</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.incidentalExpenses}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>土地租金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.landLease}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>农用设备的维修费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.farmingRepair}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>税款</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.taxs}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>工人工资</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.workerSalary}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>雇工伙食费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.employeeMeals}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>杂费，管理费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.overhead}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>房屋租金</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.houseLease}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>房屋修理费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.houseRepair}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>招待费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.invitationFee}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>仓储费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.storageFee}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>安保费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.securityFee}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>其他生意的费用</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.othBillFee}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>私人交通费</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.traffic}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>经营净利润</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.netProfit}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>其他收入</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.othIncome}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-second'>家庭支出</td>
                            <td className='finance-title-content'>
                                <p className='detail-second'>{loanAssetYearIncstat && loanAssetYearIncstat.familyPay}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='finance-title-first'>年可支</td>
                            <td className='finance-title-content'>
                                <p className='detail-first'>{loanAssetYearIncstat && loanAssetYearIncstat.disposable}</p>
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
