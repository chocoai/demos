import React, { Component } from 'react'; // 引入了React
import { Row, Col, Card } from 'antd';
import pureRender from 'pure-render-decorator';

import './style/detailTopInfo.less';

/**
 * 进件详情头部信息
 * @Author: 魏昌华
 * @Date:   2017-06-26
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-04
 */
class DetailTopInfo extends Component {
    render() {
        const { topInfo, showModal,type } = this.props;
        return (
            <div className="detail-topinfo-container">
                {/*{
                    auditInfo && auditInfo.length != 0 ?
                    <div className='audit-container'>
                        <h3 className='audit-title'>审批状态</h3>
                        {
                            auditInfo.map((item,index)=>(
                                <ul key={index} className='audit-content'>
                                    <li className='audit-list'>
                                        <span>贷审员：</span>
                                        <span>{item.approverUserName}</span>
                                    </li>
                                    <li className='audit-list'>
                                        <span>审批意见：</span>
                                        <span>{item.auditStatus ? '审批通过' : '审批拒绝'}</span>
                                    </li>
                                    <li className='audit-list'>
                                        <span>审批时间：</span>
                                        <span>{Config.formatDateTime(item.auditDate)}</span>
                                    </li>
                                </ul>
                            ))
                        }
                    </div> :
                    null
                }*/}
                {/*{ topInfo.auditStatus == '审批拒绝' ? <Row className="topinfo-row">
                        <Col span={6} className="topinfo-col">
                            <span>审批状态：{topInfo.auditStatus}</span>
                        </Col>
                        <Col span={18} className="topinfo-col">
                            <span>拒绝原因：{topInfo.rejectReasonOther || topInfo.rejectReason}</span>
                        </Col>
                    </Row> : null }
                { topInfo.auditStatus == '审批通过' ? <Row className="topinfo-row">
                        <Col span={6} className="topinfo-col">
                            <span>审批状态：{topInfo.auditStatus}</span>
                        </Col>
                        <Col span={18} className="topinfo-col">
                            <span>授信金额：{topInfo.authMoney || 0}</span><span style={{marginLeft: '5px'}}>元</span>
                        </Col>
                    </Row> : null }*/}
                {
                    (topInfo && (topInfo.custType == 2 || topInfo.hasCarrierRecode)) || (topInfo.duplicateBusiCheck && topInfo.duplicateBusiCheck.length) ?
                    <Row className="result-container">
                        {
                            topInfo && topInfo.custType == 2?
                            <p className='ipieces-cust-type'>该客户已被标识为黑名单用户</p>
                            : null
                        }
                        {
                            topInfo && topInfo.hasCarrierRecode ?
                            <p className='result-content'>已通过查询密码获取主营借记卡流水信息</p>
                            : null
                        }
                        {
                            topInfo.duplicateBusiCheck && topInfo.duplicateBusiCheck.length > 0?
                            <div>
                                {
                                    topInfo.duplicateBusiCheck.map((item, index) => (
                                        <p key={index} className='result-content'><span style={{cursor: 'pointer'}} onClick={showModal}>{item + '>>>'}</span></p>
                                    ))
                                }
                            </div>
                            : null
                        }
                    </Row> : null
                }
                <Row className="topinfo-row">
                    <Col span={12} className="topinfo-col">
                        <span className="apply-loan-title">申请贷款：<font className="label">{topInfo.prdName}</font></span>
                    </Col>
                    <Col span={12} className="topinfo-col">
                        <span>借款用途：{topInfo.loanUseText}</span>
                    </Col>
                    {/*<Col span={6} className="topinfo-col">
                        <span>还款方式：{topInfo.repaymentKindText}</span>
                    </Col> */}
                    {/*<Col span={6} className="topinfo-col">
                        <span>申请金额：{topInfo.loanAmount? topInfo.loanAmount + '万元' : null}</span>
                    </Col>*/}
                    {/*<Col span={6} className="topinfo-col">
                        <span>申请期限：{topInfo.repaymentPeriod ? topInfo.repaymentPeriod + '月' : null}</span>
                    </Col>	            	*/}
                </Row>
                <div className="detail-risk-container">
                    <Card className="card card-risk" title="风险点" bordered={false} style={type==6?{width:'100%'}:{width:'46%'}}>
                        {
                            topInfo && topInfo.loanRiskPoints && topInfo.loanRiskPoints.length?
                                <ul>
                                    {
                                        topInfo.loanRiskPoints.map((item,index)=>(
                                            <li className='card-item' key={index}>{item.riskInfo}</li>
                                        ))
                                    }
                                </ul>
                                :<p className='detail-noInfo'>暂无相关信息</p>
                        }
                    </Card>
                    {type==6?null:<Card className="card card-black" title="黑名单" bordered={false}>
                        {
                            topInfo && topInfo.blackLists && topInfo.blackLists.length ?
                                <ul>
                                    {
                                        topInfo.blackLists.map((item,index)=>(
                                            <li className='card-item' key={index}>{item.riskInfo}</li>
                                        ))
                                    }
                                </ul>
                                :<p className='detail-noInfo'>暂无相关信息</p>
                        }
                    </Card>}
                </div>
            </div>
        )
    }
}

const pureDetailTopInfo = pureRender(DetailTopInfo);

export default pureDetailTopInfo;
