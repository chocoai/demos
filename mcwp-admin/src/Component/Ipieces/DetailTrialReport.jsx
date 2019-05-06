import React from 'react'; // 引入了React
import { Config } from '../../Config/Index';

import './style/detailTrialReport.less';

/**
 * 进件详情 —— 头部初审报告
 * @Author: 魏昌华
 * @Date:   2018-03-20
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2018-03-20
 */
const DetailTrialReport = ({trialReport}) => (
    <div className="trial-report-container">
    <h2 className="audit-result">
        <span className="audit-result-label">审批结果：</span>{trialReport.auditResult}，{trialReport.auditResultRet == 1 ? "建议进入后续调查环节！" : "建议停止后续调查流程！"}
    </h2>
    <div className="trial-customer-info">
        <h2 className="trial-report-h2">客户信息</h2>
        <div className="customer-info">
            <span style={{width: '100%'}}>客户姓名：{trialReport.cname}</span>
            <span>联系方式：{trialReport.telephone}</span>
            <span>身份证号：{Config.confusionStr(trialReport.idCardNo, 4, 4)}</span>
            <span>房屋单价：{trialReport.houseUnitPrice ? `${trialReport.houseUnitPrice}元/平` : '暂无信息'}</span>
            <span>房屋估值：{trialReport.houseTotal ? `${trialReport.houseTotal}万` : '暂无信息'}</span>
            <span>最高可贷额度：{trialReport.topLoanAmount ? `${trialReport.topLoanAmount}万` : '暂无信息'}</span>
        </div>
    </div>
    <div className="first-audit-result">
        <h2 className="trial-report-h2">初审结果</h2>
        <div className="rule-select">符合准入规则项</div>
        {
            trialReport.fitRules && Config.objectV(trialReport.fitRules).length > 0 ? Config.objectV(trialReport.fitRules).map((item, index) => (
                <div key={`fitRules${index}`} className="rule-option">{item}</div>
            )) : <div className="rule-option">暂无</div>
        }
        <div className="rule-select">不符合准入规则项</div>
        {
            trialReport.notFitRules && Config.objectV(trialReport.notFitRules).length > 0 ?  Config.objectV(trialReport.notFitRules).map((item, index) => (
                <div key={`notFitRules${index}`} className="rule-option">{item}</div>
            )) : <div className="rule-option">暂无</div>
        }
    </div>
    <div className="case-desp">
        <span>涉诉情况说明：</span>{trialReport.caseDesp || '暂无涉诉情况'}
    </div>
</div>
)

export default DetailTrialReport


