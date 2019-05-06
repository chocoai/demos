import React, { Component } from 'react'; // 引入了React
import { Row, Col } from 'antd';
import { Config } from '../../Config/Index';
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
        const { loanCreditHisData, showPicture, type, pictureInfo } = this.props;
        const {creditPledge, creditSpouse, creditHisCustomer, creditHisCoBorrower, creditHisGuarantee, creditQueryResult, proValueText} = loanCreditHisData
        return (
            <div id='creditHis' className='detailCreditHis-container'>
                {
                    type == '6' ?
                    <div className='mode-list'>
                        <p className='ipieces-subtitle personal-info title'>征信模型验证结果</p>
                        {
                            creditQueryResult ?
                            <div className="popover-container">
                                {
                                    creditQueryResult.pbocScore ?
                                    <p className="verify-p">央行授信评分：{ creditQueryResult.pbocScore ? <span className="verify-true">{creditQueryResult.pbocScore}<span>({creditQueryResult.pbocScore < 490 ? '征信较差' : 490 <= creditQueryResult.pbocScore && creditQueryResult.pbocScore < 510 ? '征信一般' : 510 <= creditQueryResult.pbocScore && creditQueryResult.pbocScore < 530 ? '征信良好' : '征信优秀'})</span>
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
                            { pictureInfo&&pictureInfo[Config.bizType.loanCreditPerson]&&pictureInfo[Config.bizType.loanCreditPerson].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanCreditPerson)}>查看文件</span> : '' }
                        </Col>
                    </Row>
                    <div className="creditList">
                        {
                            creditHisCustomer && creditHisCustomer.proValueText?
                            <div className="subtitle">{proValueText}</div>
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
                    creditSpouse?
                    <div>
                        <Row className="personal-info">
                            <Col span={6} className="title">
                                <span>配偶征信情况</span>
                            </Col>
                            <Col span={18}>
                                { pictureInfo&&pictureInfo[Config.bizType.loanCreditSpouse]&&pictureInfo[Config.bizType.loanCreditSpouse].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanCreditSpouse)}>查看文件</span> : '' }
                            </Col>
                        </Row>
                        <div className="creditList">
                            {
                                creditSpouse.proValueText?
                                <div className="subtitle">{creditSpouse.proValueText}</div>
                                :<p className='detail-noInfo'>暂无征信分析情况</p>
                            }
                            <ul>
                                {
                                    creditSpouse&&creditSpouse.loanCreditTaints?
                                    creditSpouse.loanCreditTaints.map((item, index) => (
                                        <li className='credit-list-item' key={index}>{item.remark}</li>
                                    )):null
                                }
                            </ul>
                        </div>
                    </div>:null
                }



            {
                creditHisCoBorrower && creditHisCoBorrower.length && creditHisCoBorrower.map((item, index) => (
                item && (item.proValueText || item.coBorrowerCode) ?
                <div key={index}>
                    <Row className="personal-info">
                        <Col span={6} className="title">
                            <span>共同借款人{item.coBorrowerName}央行征信情况</span>
                        </Col>
                        <Col span={18}>
                            { pictureInfo&&pictureInfo[Config.bizType.loanCreditCoborrower]&&pictureInfo[Config.bizType.loanCreditCoborrower].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanCreditCoborrower)}>查看文件</span> : '' }
                        </Col>
                    </Row>
                    <div className="creditList">
                        {
                            item.proValueText?
                            <div className="subtitle">{item.proValueText}</div>
                            : <p className='detail-noInfo'>暂无征信分析情况</p>
                        }
                        <ul>
                            {
                                item.loanCreditTaints && item.loanCreditTaints.length?
                                item.loanCreditTaints.map((item, index) => (
                                    <li className='credit-list-item' key={index}>{item.remark}</li>
                                )):null
                            }
                        </ul>
                    </div>
                </div>:
                <div key={index}>
                    <Row className="personal-info">
                        <Col span={6} className="title">
                            <span>共同借款人{item && item.coBorrowerName || ''}央行征信情况</span>
                        </Col>
                        <Col span={18}>
                            { pictureInfo&&pictureInfo[Config.bizType.loanCreditCoborrower]&&pictureInfo[Config.bizType.loanCreditCoborrower].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanCreditCoborrower)}>查看文件</span> : '' }
                        </Col>
                    </Row>
                    <div className="creditList">
                    <p className='detail-noInfo'>暂无征信分析情况</p>
                    </div>
                </div>
                ))
            }
            {
                creditHisGuarantee && creditHisGuarantee.length && creditHisGuarantee.map((item, index) => (
                item && (item.proValueText || item.guarantorCode) ?
                <div key={index}>
                    <Row className="personal-info">
                        <Col span={6} className="title">
                            <span>担保人{item.guarantorName}央行征信情况</span>
                        </Col>
                        <Col span={18}>
                            { pictureInfo&&pictureInfo[Config.bizType.loanCreditGuarantee]&&pictureInfo[Config.bizType.loanCreditGuarantee].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanCreditGuarantee)}>查看文件</span> : '' }
                        </Col>
                    </Row>
                    <div className="creditList">
                        {
                            item.proValueText?
                            <div className="subtitle">{item.proValueText}</div>
                            : <p className='detail-noInfo'>暂无征信分析情况</p>
                        }
                        <ul>
                            {
                                item.loanCreditTaints && item.loanCreditTaints.length?
                                item.loanCreditTaints.map((item, index) => (
                                    <li className='credit-list-item' key={index}>{item.remark}</li>
                                )):null
                            }
                        </ul>
                    </div>
                </div>:
                <div key={index}>
                    <Row className="personal-info">
                        <Col span={6} className="title">
                            <span>担保人{item && item.guarantorName || ''}央行征信情况</span>
                        </Col>
                        <Col span={18}>
                            { pictureInfo&&pictureInfo[Config.bizType.loanCreditGuarantee]&&pictureInfo[Config.bizType.loanCreditGuarantee].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanCreditGuarantee)}>查看文件</span> : '' }
                        </Col>
                    </Row>
                    <div className="creditList">
                        <p className='detail-noInfo'>暂无征信分析情况</p>
                    </div>
                </div>
                ))
            }
            {
                creditPledge?
                    <div>
                        <Row className="personal-info">
                            <Col span={6} className="title">
                                <span>抵押人征信情况</span>
                            </Col>
                            <Col span={18}>
                                { pictureInfo&&pictureInfo[Config.bizType.loanCreditPledge]&&pictureInfo[Config.bizType.loanCreditPledge].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanCreditPledge)}>查看文件</span> : '' }
                            </Col>
                        </Row>
                        <div className="creditList">
                            {
                                creditPledge.proValueText?
                                <div className="subtitle">{creditPledge.proValueText}</div>
                                :<p className='detail-noInfo'>暂无征信分析情况</p>
                            }
                            <ul>
                                {
                                    creditPledge&&creditPledge.loanCreditTaints?
                                    creditPledge.loanCreditTaints.map((item, index) => (
                                        <li className='credit-list-item' key={index}>{item.remark}</li>
                                    )):null
                                }
                            </ul>
                        </div>
                    </div>:null
                }
        </div>
        )
    }
}

const pureDetailCreditHis = pureRender(DetailCreditHis);

export default pureDetailCreditHis;
