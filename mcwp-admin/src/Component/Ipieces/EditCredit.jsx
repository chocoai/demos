import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import './style/editCredit.less';
/**
 * 进件编辑信贷历史
 * @Author: 赵俊
 * @Date:   2017-05-31
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-25
 */
class EditCredit extends Component {
        constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentWillMount() {
    }
    showExplainModal = (e,item) => {
        let newObject = item
        newObject.auditStatusText = '征信审核通过'
        this.props.showExplainModal(newObject)
    }
    render() {
        const { showPicture, creditHisData, personCredit, type } = this.props;
        let creditQueryResult = creditHisData.creditQueryResult;   // 征信验证结果
        // let identityResult =  creditHisData.identityResult;   // 核身验证结果
        return (
            <div className='editCredit-container'>
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
                        <p className='ipieces-subtitle personal-info'>征信模型验证结果</p>
                        {
                            creditQueryResult ?
                            <div>
                                {
                                    creditQueryResult.pbocScore ?
                                    <p className="verify-p">央行授信评分：{ creditQueryResult.pbocScore ? <span className="verify-true">{creditQueryResult.pbocScore}<span>({creditQueryResult.pbocScore < 490 ? '征信较差' : 490 <= creditQueryResult.pbocScore && creditQueryResult.pbocScore < 510 ? '征信一般' : 510 <= creditQueryResult.pbocScore && creditQueryResult.pbocScore < 530 ? '征信良好' : '征信优秀'})</span>
                                    </span> : null}<span className="score-explain" onClick={(e)=>this.showExplainModal(e,creditQueryResult)}>评分说明</span></p>
                                    : <p className="verify-p">央行拒绝原因：{ creditQueryResult.message ? <span className="verify-false">{creditQueryResult.message}</span> : null}</p>
                                }
                            </div>
                            : <p className="verify-p">征信模型暂未验证</p>
                        }
                    </div> : null
                }
                <div className='ipieces-subtitle-container'>
                    <p className='ipieces-subtitle ipieces-subtitle-left'>个人央行征信情况</p>
                        {
                            personCredit && personCredit.length?
                            <p className='ipieces-subtitle-attachment' onClick={()=>showPicture('LOAN_PERSON_CREDIT')}>征信报告</p>
                            : null
                        }
                </div>
                    {
                        creditHisData && creditHisData.proValueText ?
                            <p className='loanCreditHis'>{creditHisData && creditHisData.proValueText}</p>:
                            <p className='loanCreditHis'>暂无征信分析情况</p>
                    }
                <ul>
                    {
                        creditHisData && creditHisData.creditHisCustomer && creditHisData.creditHisCustomer.loanCreditTaints?
                        creditHisData.creditHisCustomer.loanCreditTaints.map((item,index)=> (
                            <li key={index} className='credit-detail'>{item.remark}</li>
                        )):null
                    }
                </ul>
                { creditHisData.creditHisCoBorrower && creditHisData.creditHisCoBorrower.length && creditHisData.creditHisCoBorrower.map((item, index) => (
                    item && (item.guproValueText || item.coBorrowerCode) ?
                    <div key={index}>
                        <div className='ipieces-subtitle-container'>
                            <p className='ipieces-subtitle ipieces-subtitle-left'>共同借款人{item.coBorrowerName}央行征信情况</p>
                            {
                                item.coBorrowerCode ?
                                    <p className='ipieces-subtitle-attachment' onClick={()=>showPicture('LOAN_COBORROWER_CREDIT', item.guarantorCode)}>征信报告</p>:
                                    null
                            }
                        </div>
                        {
                            item.guproValueText?
                            <p className='loanCreditHis'>{item.guproValueText}</p>
                            :<p className='loanCreditHis'>暂无征信分析情况</p>
                        }
                        <ul>
                            {
                                item.loanCreditTaints && item.loanCreditTaints.length?
                                item.loanCreditTaints.map((item, index)=>(
                                    <li key={index} className='credit-detail'>{item.remark}</li>
                                )): null
                            }
                        </ul>
                    </div>:null
                    ))
                }
                {/*判断担保人首先是否存在creditHisGuarantee，存在然后判断是否显示guproValueText、guarantorCode*/}
                { creditHisData.creditHisGuarantee && creditHisData.creditHisGuarantee.length && creditHisData.creditHisGuarantee.map((item, index) => (
                    item && (item.guproValueText || item.guarantorCode) ?
                    <div key={index}>
                        <div className='ipieces-subtitle-container'>
                            <p className='ipieces-subtitle ipieces-subtitle-left'>担保人{item.guarantorName}央行征信情况</p>
                            {
                                item.guarantorCode ?
                                    <p className='ipieces-subtitle-attachment' onClick={()=>showPicture('LOAN_GUARANTEE_CREDIT', item.guarantorCode)}>征信报告</p>:
                                    null
                            }
                        </div>
                        {
                            item.guproValueText?
                            <p className='loanCreditHis'>{item.guproValueText}</p>
                            :<p className='loanCreditHis'>暂无征信分析情况</p>
                        }
                        <ul>
                            {
                                item.loanCreditTaints && item.loanCreditTaints.length?
                                item.loanCreditTaints.map((item, index)=>(
                                    <li key={index} className='credit-detail'>{item.remark}</li>
                                )): null
                            }
                        </ul>
                    </div>:null
                    ))
                }
            </div>
        )
    }
}

const pureEditCredit = pureRender(EditCredit);

export default pureEditCredit;
