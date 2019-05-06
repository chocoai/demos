import React, { Component } from 'react'; // 引入了React
import { Row, Col } from 'antd';
import pureRender from 'pure-render-decorator';
import './style/detailAssetBank.less';
/**
 * 征信调查央行信息详情
 * @Author: 钟观发
 * @Date:   2017-11-08
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-11-08
 */
class DetailAssetBank extends Component {
    render() {
        const { creditCentralBankInfo } = this.props;
        return (
            <div className="detail-bank">
                <Row className="personal-info">
                    <Col span={4} className="title">
                        <span>央行征信信息详情</span>
                    </Col>
                </Row>
				{
					creditCentralBankInfo ?
                    <Row className="personal-info-content">
                        <Col span={12} className="subtitle">
                            <span>人行信用记录是否为空白：{ creditCentralBankInfo.isBlankCreditRecord ? '是' : '否'}</span>
                        </Col>
                        {
                            !creditCentralBankInfo.isBlankCreditRecord ?
                            <div>
                                <Col span={12} className="subtitle">
                                    <span>是否有法院强制执行记录：{ creditCentralBankInfo.hasForceExecution ? '是' : '否'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>是否出现‘低保救助记录’：{ creditCentralBankInfo.hasSalvationRecord ? '是' : '否'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>是否有‘欠税记录’：{ creditCentralBankInfo.hasTaxArrear ? '是' : '否'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>执业资格记录是否有吊销记录：{ creditCentralBankInfo.hasCompetenceRevoke ? '是' : '否'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>电信缴费记录‘当前欠费金额’：{ (creditCentralBankInfo.telPaymentOverdueAmout || creditCentralBankInfo.telPaymentOverdueAmout == 0) && creditCentralBankInfo.telPaymentOverdueAmout + '元' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>行政处罚记录表中‘处罚金额’：{(creditCentralBankInfo.adminPunishmentAmount || creditCentralBankInfo.adminPunishmentAmount == 0) && creditCentralBankInfo.adminPunishmentAmount + '元' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>是否出现资产处置、保证人代偿、担保人代偿记录、以资抵债、呆账记录：{ creditCentralBankInfo.hasBadCreditRecord ? '是' : '否'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>未销户贷记卡机构数：{(creditCentralBankInfo.loanCardFinanceOrgCount || creditCentralBankInfo.loanCardFinanceOrgCount == 0) && creditCentralBankInfo.loanCardFinanceOrgCount + '个' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>最近1个月内的本人查询次数：{(creditCentralBankInfo.selfQueryCountIn1m || creditCentralBankInfo.selfQueryCountIn1m == 0) && creditCentralBankInfo.selfQueryCountIn1m + '次' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷款最近24个月内逾期次数：{(creditCentralBankInfo.loanOverdueCountIn24m || creditCentralBankInfo.loanOverdueCountIn24m == 0) && creditCentralBankInfo.loanOverdueCountIn24m + '次' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷款最长逾期期数：{(creditCentralBankInfo.loanMaxOverduePeriod || creditCentralBankInfo.loanMaxOverduePeriod == 0) && creditCentralBankInfo.loanMaxOverduePeriod + '期' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷款逾期笔数：{(creditCentralBankInfo.overdueLoanCount || creditCentralBankInfo.overdueLoanCount == 0) && creditCentralBankInfo.overdueLoanCount + '笔' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷款最近24个月最大逾期期数：{(creditCentralBankInfo.loanMaxOverduePeriodIn24m || creditCentralBankInfo.loanMaxOverduePeriodIn24m == 0) && creditCentralBankInfo.loanMaxOverduePeriodIn24m + '期' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷款最近1次逾期距今月数：{(creditCentralBankInfo.minLoanOverdueMonthDiff || creditCentralBankInfo.minLoanOverdueMonthDiff == 0) && creditCentralBankInfo.minLoanOverdueMonthDiff + '个月' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>最近3个月贷款审批查询次数：{(creditCentralBankInfo.queryCountForLoanApprovalIn3m || creditCentralBankInfo.queryCountForLoanApprovalIn3m == 0) && creditCentralBankInfo.queryCountForLoanApprovalIn3m + '次' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>最近6个月贷款审批查询次数：{(creditCentralBankInfo.queryCountForLoanApprovalIn6m || creditCentralBankInfo.queryCountForLoanApprovalIn6m == 0) && creditCentralBankInfo.queryCountForLoanApprovalIn6m + '次' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷记卡最近3个月内正常还款月数：{(creditCentralBankInfo.loanCardNomalPaymentMonIn3m || creditCentralBankInfo.loanCardNomalPaymentMonIn3m == 0) && creditCentralBankInfo.loanCardNomalPaymentMonIn3m + '个月' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷记卡最近6个月内正常还款月数：{(creditCentralBankInfo.loanCardNomalPaymentMonIn6m || creditCentralBankInfo.loanCardNomalPaymentMonIn6m == 0) && creditCentralBankInfo.loanCardNomalPaymentMonIn6m + '个月' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷记卡最近24个月内正常还款月数：{(creditCentralBankInfo.loanCardNomalPaymentMonIn24m || creditCentralBankInfo.loanCardNomalPaymentMonIn24m == 0) && creditCentralBankInfo.loanCardNomalPaymentMonIn24m + '个月' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>未销户且共享额度>100的人民币贷记卡账户的平均共享额度：{(creditCentralBankInfo.loanCardAvgShareAmount || creditCentralBankInfo.loanCardAvgShareAmount == 0) && creditCentralBankInfo.loanCardAvgShareAmount + '元' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>申请人对外担保贷款五级分类为：次级、可疑、损失：{ creditCentralBankInfo.hasBadCreditFiveClass ? '是' : '否'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>最近2个月到期负债总额：{(creditCentralBankInfo.liabilitiesEndIn2m || creditCentralBankInfo.liabilitiesEndIn2m == 0) && creditCentralBankInfo.liabilitiesEndIn2m + '元' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>信用类授信总额：{(creditCentralBankInfo.allCreditAmount || creditCentralBankInfo.allCreditAmount == 0) && creditCentralBankInfo.allCreditAmount + '元' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷款/贷记卡当前逾期金额：{(creditCentralBankInfo.curtOverdueAmt || creditCentralBankInfo.curtOverdueAmt == 0) && creditCentralBankInfo.curtOverdueAmt + '元' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷记卡最近24个月内逾期次数：{(creditCentralBankInfo.creditcardOverdueCountIn24m || creditCentralBankInfo.creditcardOverdueCountIn24m == 0) && creditCentralBankInfo.creditcardOverdueCountIn24m + '次' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷记卡最近24个月内最大逾期期数：{(creditCentralBankInfo.creditcardMaxOverduePeriodIn24m || creditCentralBankInfo.creditcardMaxOverduePeriodIn24m == 0) && creditCentralBankInfo.creditcardMaxOverduePeriodIn24m + '期' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>最近12个月贷款审批查询次数：{(creditCentralBankInfo.queryCountForLoanApprovalIn12m || creditCentralBankInfo.queryCountForLoanApprovalIn12m == 0) && creditCentralBankInfo.queryCountForLoanApprovalIn12m + '次' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷记卡最近6个月内最大逾期期数：{(creditCentralBankInfo.creditcardMaxOverduePeriodIn6m || creditCentralBankInfo.creditcardMaxOverduePeriodIn6m == 0) && creditCentralBankInfo.creditcardMaxOverduePeriodIn6m + '期' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>最近6个月贷款审批查询机构数：{(creditCentralBankInfo.querycompForLoanApprovalIn6m || creditCentralBankInfo.querycompForLoanApprovalIn6m == 0) && creditCentralBankInfo.querycompForLoanApprovalIn6m + '个' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>最近3个月贷款审批查询机构数：{(creditCentralBankInfo.querycompForLoanApprovalIn3m || creditCentralBankInfo.querycompForLoanApprovalIn3m == 0) && creditCentralBankInfo.querycompForLoanApprovalIn3m + '个' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>贷款最近6个月内逾期次数：{(creditCentralBankInfo.loanOverdueCountIn6m || creditCentralBankInfo.loanOverdueCountIn6m == 0) && creditCentralBankInfo.loanOverdueCountIn6m + '次' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>首张贷记卡发卡月份距今月份数：{(creditCentralBankInfo.firstCreditCardMonthSeg || creditCentralBankInfo.firstCreditCardMonthSeg == 0) && creditCentralBankInfo.firstCreditCardMonthSeg + '个月' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>其他贷款笔数：{(creditCentralBankInfo.lnotherloancount || creditCentralBankInfo.lnotherloancount == 0) && creditCentralBankInfo.lnotherloancount + '笔' || '未录入'}</span>
                                </Col>
                                {/* <Col span={12} className="subtitle">
                                    <span>过去6个月贷款逾期1及以上的机构数：{creditCentralBankInfo.loanOverdueFinanceOrgCountIn6m && creditCentralBankInfo.loanOverdueFinanceOrgCountIn6m + '个' || '未录入'}</span>
                                </Col> */}
                                {/* <Col span={12} className="subtitle">
                                    <span>未结清贷款、未销户贷记卡和准贷记卡的授信机构数总和：{creditCentralBankInfo.allFinanceOrgCount && creditCentralBankInfo.allFinanceOrgCount + '个' || '未录入'}</span>
                                </Col> */}
                                {/* <Col span={12} className="subtitle">
                                    <span>过去6个月贷记卡逾期1及以上的机构数：{creditCentralBankInfo.loanCdOverdueFinanceOrgCountIn6m && creditCentralBankInfo.loanCdOverdueFinanceOrgCountIn6m + '个' || '未录入'}</span>
                                </Col> */}
                                {/* <Col span={12} className="subtitle">
                                    <span>产生时间最早的一次逾期发生的年月距今月份数：{creditCentralBankInfo.maxOverdueMonthDiff && creditCentralBankInfo.maxOverdueMonthDiff + '个月' || '未录入'}</span>
                                </Col> */}
                                <Col span={12} className="subtitle">
                                    <span>未销户贷记卡额度使用率：{(creditCentralBankInfo.loanCardUseAvgRate || creditCentralBankInfo.loanCardUseAvgRate == 0) && creditCentralBankInfo.loanCardUseAvgRate + '%' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>央行房贷有效月供：{(creditCentralBankInfo.effectHouseLoanMonthAmount || creditCentralBankInfo.effectHouseLoanMonthAmount == 0) && creditCentralBankInfo.effectHouseLoanMonthAmount + '元' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>央行未销户贷记卡最高授信额度：{(creditCentralBankInfo.maxLoanCardCreditAmount || creditCentralBankInfo.maxLoanCardCreditAmount == 0) && creditCentralBankInfo.maxLoanCardCreditAmount + '元' || '未录入'}</span>
                                </Col>
                                {/* <Col span={12} className="subtitle">
                                    <span>贷记卡机构授信平均授信额度：{creditCentralBankInfo.laonCardAvgFinanceCreditAmount && creditCentralBankInfo.laonCardAvgFinanceCreditAmount + '元' || '未录入'}</span>
                                </Col> */}
                            </div> : null
                        }

                    </Row>
                    : <p className='detail-noInfo'>暂无相关信息</p>
				}

			</div>
        )
    }
}

const pureDetailAssetBank = pureRender(DetailAssetBank);

export default pureDetailAssetBank;
