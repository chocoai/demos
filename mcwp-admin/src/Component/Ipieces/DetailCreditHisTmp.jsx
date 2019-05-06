import React, { Component } from 'react'; // 引入了React
import { Row, Col } from 'antd';
import pureRender from 'pure-render-decorator';
import './style/detailCreditHis.less';

/**
 * 进件详情信贷历史
 * @Author: 魏昌华
 * @Date:   2017-06-26
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-05
 */
class DetailCreditHis extends Component {
    showExplainModal = (e,item) => {
        let newObject = item
        newObject.auditStatusText = '征信审核通过'
        this.props.showExplainModal(newObject)
    }
    render() {
        const { loanCreditHisData, personCredit, showPicture, type } = this.props;
        let creditHisCustomer = loanCreditHisData.creditHisCustomer;  // 本人
        let creditHisCoBorrower = loanCreditHisData.creditHisCoBorrower;   // 共同借款人
        let creditHisGuarantee =  loanCreditHisData.creditHisGuarantee;   // 共同担保人
        let creditQueryResult = loanCreditHisData.creditQueryResult;   // 征信验证结果
        // let identityResult =  loanCreditHisData.identityResult;   // 核身验证结果
        let proValueText =  loanCreditHisData.proValueText;
        // let guproValueText =  loanCreditHisData.guproValueText;
        // let coproValueText =  loanCreditHisData.coproValueText;
        return (
            <div id='creditHis' className='detailCreditHis-container'>
                {/* {
                    type == '6' ?
                    <div className='mode-list'>
                        <p className='ipieces-subtitle personal-info'>核身模型验证结果</p>
                        {
                            identityResult ?
                            <div>
                                <p className="verify-p">身份证与姓名是否一致：{ identityResult.idNameCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                <p className="verify-p">手机号是否实名认证：{ identityResult.idNameCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                            </div>
                            : <p className="verify-p">核身模型暂未验证</p>
                        }
                    </div> : null
                } */}
                {
                    type == '6' ?
                    <div className='mode-list'>
                        <p className='ipieces-subtitle personal-info title'>征信模型验证结果</p>
                        {
                            creditQueryResult ?
                            <div className="popover-container">
                                {
                                    creditQueryResult.pbocScore ?
                                    <p className="verify-p">央行授信评分：{ creditQueryResult.pbocScore ? <span className="verify-true">{creditQueryResult.pbocScore}<span>({creditQueryResult.pbocScore < 490 ? '征信较差' : 490 < creditQueryResult.pbocScore && creditQueryResult.pbocScore < 510 ? '征信一般' : 510 < creditQueryResult.pbocScore && creditQueryResult.pbocScore < 530 ? '征信良好' : '征信优秀'})</span>
                                    </span> : null} <span className="score-explain" onClick={(e)=>this.showExplainModal(e,creditQueryResult)}>评分说明</span></p>
                                    : <p className="verify-p">央行拒绝原因：{ creditQueryResult.message ? <span className="verify-false">{creditQueryResult.message}</span> : null}</p>
                                }
                            </div>
                            : <p className="verify-p">征信模型暂未验证</p>
                        }
                    </div> : null
                }
                <div>
                    <Row className="personal-info">
                        <Col span={6} className="title">
                            <span>个人央行征信情况</span>
                        </Col>
                        <Col span={18}>
                            {
                                personCredit && personCredit.length?
                                <span className='button' onClick={()=>showPicture('LOAN_PERSON_CREDIT')}>征信报告</span>
                                : null
                            }
                        </Col>
                    </Row>
                    <div className="creditList">
                        <div className="subtitle">{proValueText}</div>
                        {
                            creditHisCustomer?
                                <div>{creditHisCustomer.remark}</div>
                                :<p className='detail-noInfo'>暂无征信分析情况</p>
                        }
                        <ul>
                            {
                                creditHisCustomer&&creditHisCustomer.loanCreditTaints?
                                creditHisCustomer.loanCreditTaints.map((item, index) => (
                                    <li className='credit-list-item' key={index}>{item.remark}</li>
                                )):null
                            }
                        </ul>
                    </div>
                </div>
            {
                creditHisCoBorrower && creditHisCoBorrower.length && creditHisCoBorrower.map((item, index) => (
                item && (item.guproValueText || item.coBorrowerCode) ?
                <div key={index}>
                    <Row className="personal-info">
                        <Col span={6} className="title">
                            <span>共同借款人{item.coBorrowerName}央行征信情况</span>
                        </Col>
                        <Col span={18}>
                        {
                            item.coBorrowerCode ?
                                <span className='button' onClick={()=>showPicture('LOAN_COBORROWER_CREDIT', item.coBorrowerCode)}>征信报告</span>:
                                null
                        }
                        </Col>
                    </Row>
                    <div className="creditList">
                        {
                            item.guproValueText?
                            <div className="subtitle">{item.guproValueText}</div>
                            : <p className='detail-noInfo'>暂无征信分析情况</p>
                        }
                        {/*{
                            creditHisGuarantee?
                            <div>{creditHisGuarantee.remark}</div>
                            :<p className='detail-noInfo'>暂无征信分析情况</p>
                        }*/}
                        <ul>
                            {
                                item.loanCreditTaints && item.loanCreditTaints.length?
                                item.loanCreditTaints.map((item, index) => (
                                    <li className='credit-list-item' key={index}>{item.remark}</li>
                                )):null
                            }
                        </ul>
                    </div>
                </div>: null
                ))
            }
            {/*{
                creditHisGuarantee || (guaranteeCredit && guaranteeCredit.length) ?
                <div>
                    <Row className="personal-info">
                        <Col span={6} className="title">
                            <span>共同担保人央行征信情况</span>
                        </Col>
                        <Col span={18}>
                            {
                                guaranteeCredit && guaranteeCredit.length?
                                <span className='button' onClick={()=>Config.creditOpen(guaranteeCredit)}>征信报告</span>
                                : null
                            }
                        </Col>
                    </Row>
                    <div className="creditList">
                        <div className="title">{guproValueText}</div>
                        {
                            creditHisGuarantee?
                            <div>{creditHisGuarantee.remark}</div>
                            :<p className='detail-noInfo'>暂无征信分析情况</p>
                        }
                        <ul>
                            {
                                creditHisGuarantee&&creditHisGuarantee.loanCreditTaints?
                                creditHisGuarantee.loanCreditTaints.map((item, index) => (
                                    <li className='credit-list-item' key={index}>{item.remark}</li>
                                )):null
                            }
                        </ul>
                    </div>
                </div> : ''
            }			*/}
            {
                creditHisGuarantee && creditHisGuarantee.length && creditHisGuarantee.map((item, index) => (
                item && (item.guproValueText || item.guarantorCode) ?
                <div key={index}>
                    <Row className="personal-info">
                        <Col span={6} className="title">
                            <span>担保人{item.guarantorName}央行征信情况</span>
                        </Col>
                        <Col span={18}>
                        {
                            item.guarantorCode ?
                                <span className='button' onClick={()=>showPicture('LOAN_GUARANTEE_CREDIT', item.guarantorCode)}>征信报告</span>:
                                null
                        }
                        </Col>
                    </Row>
                    <div className="creditList">
                        {
                            item.guproValueText?
                            <div className="subtitle">{item.guproValueText}</div>
                            : <p className='detail-noInfo'>暂无征信分析情况</p>
                        }
                        {/*{
                            creditHisGuarantee?
                            <div>{creditHisGuarantee.remark}</div>
                            :<p className='detail-noInfo'>暂无征信分析情况</p>
                        }*/}
                        <ul>
                            {
                                item.loanCreditTaints && item.loanCreditTaints.length?
                                item.loanCreditTaints.map((item, index) => (
                                    <li className='credit-list-item' key={index}>{item.remark}</li>
                                )):null
                            }
                        </ul>
                    </div>
                </div>: null
                ))
            }
        </div>
        )
    }
}

const pureDetailCreditHis = pureRender(DetailCreditHis);

export default pureDetailCreditHis;
