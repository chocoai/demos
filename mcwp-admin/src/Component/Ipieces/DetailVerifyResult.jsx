import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index'
import './style/detailVerifyResult.less';

/**
 * 进件详情审批状态
 * @Author: 赵俊
 * @Date:   2017-07-27
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-27
 */
class DetailVerifyResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bizInfo: 'busInfo',  //id和所在区域key
            coborrower: 'comLoan',
            creditHis: 'creditHis',
            customer: 'basicInfo',
            guarantor: 'comLoan',
            logicDr: 'logic',
            spouse: 'basicInfo'
        }
    }
    showComment = () => {
        this.props.showComment()
    }
    viewExplain(e, item) {
        this.props.showExplainModal(item)
    }
    render() {
        const { autoNav, mismatch, topInfo, type } = this.props;
        let arr = [];
        if (mismatch) {
            for (let key in mismatch) {
                if (key == 'guarantorMismatch' && mismatch[key]) {
                    mismatch[key].map((item, index) => arr.push({ title: 'coborrower', content: `${item} >>>` }))
                    continue
                }
                if (mismatch[key]) arr.push({ title: key.slice(0, -8), content: `${mismatch[key]} >>>` })
            }
        }
        // 14为NJ，初审不显示“授信额度”、“评分”和“评级”
        // 其他依旧正常显示
        // 部分内容已废除，重构时确认
        return (
            <div className="detail-verifyResult-container">
                {
                    (topInfo && topInfo.auditStatusText) || (arr && arr.length > 0) ?
                        <div>
                            {
                                type == '6' || Config.ipiecesShow.detailVerifyResult.includes(+type) ?
                                    <div className='result-container'>
                                        {
                                            topInfo.auditStatusText == '核身审核拒绝' || topInfo.auditStatusText == '初审审核拒绝' || topInfo.auditStatusText == '征信审核拒绝' || topInfo.auditStatusText == '综合授信审核拒绝' || topInfo.auditStatusText == '人工审批拒绝' || topInfo.auditStatusText == '人工初审拒绝' ?
                                                <div className='result-show'>
                                                    <p className='result-type'>审批状态: <span className='result-final-reject'>{topInfo.auditStatusText}</span></p>
                                                    <p className='result-reason'>拒绝原因: {topInfo.rejectReasonOther || topInfo.rejectReason}</p>
                                                </div> : null
                                        }
                                        {topInfo.auditStatusText == '已驳回'?<div className='result-show'>
                                                    <p className='result-type'>审批状态: <span className='result-final-reject'>{topInfo.auditStatusText}</span></p>
                                                    <p className='result-reason'>打回原因: {topInfo.rejectReasonOther || topInfo.rejectReason}</p>
                                                </div> : null
                                        }
                                        {
                                            topInfo.auditStatusText == '初审审核通过' ?
                                                <div className='result-show'>
                                                    <p className='result-type'>审核结果: <span className='result-final-pass'>{topInfo.auditStatusText}</span></p>
                                                    {
                                                        Config.ipiecesShow.detailVerifyResultAuthMoney.includes(+type) ? <p className='result-reason'>授信金额: {topInfo.authMoney || 0}元</p> : null
                                                    }
                                                    {
                                                        topInfo.orgCreditScore && Config.ipiecesShow.detailVerifyResultOrgScore.includes(+type) &&
                                                        <p className='result-reason'>
                                                            <span>评分: {topInfo.orgCreditScore}</span>
                                                            <span>({topInfo.orgCreditScore < 450 ? '极高风险' : 450 <= topInfo.orgCreditScore && topInfo.orgCreditScore < 550 ? '较高风险' : 550 <= topInfo.orgCreditScore && topInfo.orgCreditScore < 650 ? '一般风险' : 650 <= topInfo.orgCreditScore && topInfo.orgCreditScore < 750 ? '较低风险' : '极低风险'})</span>
                                                            <span className="score-explain" onClick={(e) => this.viewExplain(e, topInfo)}>评分说明</span>
                                                        </p>
                                                    }
                                                    {
                                                        Config.ipiecesShow.detailVerifyResultOrgRank.includes(+type) && topInfo.rank &&
                                                        <p className='result-reason'>
                                                            <span>评级: {topInfo.rank}</span>
                                                        </p>
                                                    }
                                                </div> : null
                                        }
                                        {
                                            topInfo.auditStatusText == '征信审核通过' ?
                                                <div className='result-show'>
                                                    <p className='result-type'>审核结果: <span className='result-final-pass'>{topInfo.auditStatusText}</span></p>
                                                    {
                                                        topInfo.pbocScore &&
                                                        <p className='result-reason'>
                                                            <span>评分: {topInfo.pbocScore}</span>
                                                            {/* 具体分数暂时无人使用 */}
                                                            {/* {
                                                                Config..includes(+type) ? null :
                                                                    <span>({topInfo.pbocScore < 490 ? '征信较差' : 490 <= topInfo.pbocScore && topInfo.pbocScore < 510 ? '征信一般' : 510 <= topInfo.pbocScore && topInfo.pbocScore < 530 ? '征信良好' : '征信优秀'})</span>
                                                            }
                                                            {
                                                                Config..includes(+type) ? null :
                                                                    <span className="score-explain" onClick={(e) => this.viewExplain(e, topInfo)}>评分说明</span>
                                                            } */}
                                                        </p>
                                                    }
                                                </div> : null
                                        }
                                        {
                                            topInfo.auditStatusText == '综合授信审核通过' || topInfo.auditStatusText == '人工审批通过' ?
                                                <div className='result-show'>
                                                    <p className='result-type'>审批状态: <span className='result-final-pass'>{topInfo.auditStatusText}</span></p>
                                                    <p className='result-reason'>授信金额: {topInfo.authMoney || 0}元
                                                    </p>
                                                    {
                                                        topInfo.dailyRate ?
                                                            <p className='result-reason'>
                                                                <span>借款日利率: {topInfo.dailyRate + '%' || 0 + '%'}</span>
                                                            </p> : null
                                                    }
                                                    {
                                                        topInfo.repaymentPeriodText ?
                                                            <p className='result-reason'>
                                                                <span>还款期数: {topInfo.repaymentPeriodText + '期'}</span>
                                                            </p> : null
                                                    }
                                                    {
                                                        topInfo.repaymentKindText ?
                                                            <p className='result-reason'>
                                                                <span>还款方式: {topInfo.repaymentKindText + ''}</span>
                                                            </p> : null
                                                    }
                                                    {
                                                        topInfo.auditStatusText == '综合授信审核通过' && topInfo.fnlStore && Config.ipiecesShow.detailVerifyResultFnlScore.includes(+type) ?
                                                            <p className='result-reason'>
                                                                <span>评分: {topInfo.fnlStore}</span>
                                                                {/* 具体分数暂时无人使用 */}
                                                                {/* {
                                                                    Config..includes(+type) ? null :
                                                                        <span>({topInfo.fnlStore < 350 ? '风险极高' : 350 <= topInfo.fnlStore && topInfo.fnlStore < 500 ? '风险较高' : 500 <= topInfo.fnlStore && topInfo.fnlStore < 650 ? '风险一般' : 650 <= topInfo.fnlStore && topInfo.fnlStore < 800 ? '风险较低' : '风险极低'})</span>
                                                                } */}
                                                                {/* <span className="score-explain" onClick={(e) => this.viewExplain(e, topInfo)}>评分说明</span> */}
                                                            </p> : null
                                                    }
                                                    {
                                                        topInfo.auditStatusText == '综合授信审核通过' && Config.ipiecesShow.detailVerifyResultFnlRank.includes(+type) && topInfo.rank &&
                                                        <p className='result-reason'>
                                                            <span>评级: {topInfo.rank}</span>
                                                        </p>
                                                    }
                                                    {
                                                        topInfo.comment ?
                                                            <span className="view-comment" onClick={this.showComment}>查看备注</span> : null
                                                    }
                                                </div> : null
                                        }
                                        {
                                            arr && arr.length > 0 ?
                                                <div className='result-content-wrapper'>
                                                    {
                                                        arr.map((item, index) => (
                                                            <p key={index}><span className='result-content' onClick={() => autoNav(this.state[item.title], item.title)}>{item.content}</span></p>
                                                        ))
                                                    }
                                                </div>
                                                : null
                                        }
                                    </div> :
                                    <div className='result-container'>
                                        {
                                            topInfo.auditStatusText == '人工审批拒绝' || topInfo.auditStatusText == '人工初审拒绝' ?
                                                <div className='result-show'>
                                                    <p className='result-type'>审批状态: <span className='result-final-reject'>{topInfo.auditStatusText}</span></p>
                                                    <p className='result-reason'>拒绝原因: {topInfo.rejectReasonOther || topInfo.rejectReason}</p>
                                                </div> : null
                                        }
                                        {
                                            topInfo.auditStatusText == '人工审批通过' ?
                                                <div className='result-show'>
                                                    <p className='result-type'>审批状态: <span className='result-final-pass'>{topInfo.auditStatusText}</span></p>
                                                    <p className='result-reason'>授信金额: {topInfo.authMoney || 0}元
                                                        {
                                                            topInfo.comment ?
                                                                <span className="view-comment" onClick={this.showComment}>查看备注</span> : null
                                                        }
                                                    </p>
                                                    {
                                                        topInfo.dailyRate ?
                                                            <p className='result-reason'>
                                                                <span>借款日利率: {topInfo.dailyRate + '%' || 0 + '%'}</span>
                                                            </p> : null
                                                    }
                                                    {
                                                        topInfo.repaymentPeriodText ?
                                                            <p className='result-reason'>
                                                                <span>还款期数: {topInfo.repaymentPeriodText + '期'}</span>
                                                            </p> : null
                                                    }
                                                    {
                                                        topInfo.repaymentKindText ?
                                                            <p className='result-reason'>
                                                                <span>还款方式: {topInfo.repaymentKindText + ''}</span>
                                                            </p> : null
                                                    }
                                                </div> : null
                                        }
                                        {
                                            arr && arr.length > 0 ?
                                                <div className='result-content-wrapper'>
                                                    {
                                                        arr.map((item, index) => (
                                                            <p key={index}><span className='result-content' onClick={() => autoNav(this.state[item.title], item.title)}>{item.content}</span></p>
                                                        ))
                                                    }
                                                </div>
                                                : null
                                        }
                                    </div>
                            }
                            {topInfo.gjjData ?
                                <div className='result-container' style={{ marginTop: '10px' }}>
                                    <div className='result-show'>
                                        <p>{topInfo.gjjData}</p>
                                    </div>
                                </div>
                                : null}
                        </div> : null
                }
            </div>
        )
    }
}

const pureDetailVerifyResult = pureRender(DetailVerifyResult);

export default pureDetailVerifyResult;
