import React, { Component } from 'react'; // 引入了React
import { Row, Col } from 'antd';
import { browserHistory } from 'react-router';
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/detailCoBoGua.less';
/**
 * 进件详情共同借款人及担保人信息
 * @Author: 魏昌华
 * @Date:   2017-06-26
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-05
 */
class DetailCoBoGua extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // preview: false
        }
    }
    // 查看征信信息
    viewVerify = (code,type) => {
        if (type == 'loan') {
            browserHistory.push('/ipieces/view/detail/loans/'+ code);
        } else {
            browserHistory.push('/ipieces/view/detail/guarans/'+ code);
        }
    }
    showExplainModal = (e,item) => {
        let newObject = item.creditQueryResult
        newObject.auditStatusText = '征信审核通过'
        this.props.showExplainModal(newObject)
    }
    render() {
        const { loanGuaranteeData, showPicture, pictureInfo, type } = this.props;
        let loanCoBorrower =  loanGuaranteeData.loanCoBorrower;  // 共同借款人
        let loanGuarantee  =  loanGuaranteeData.loanGuarantee;   // 担保人信息
        // let cRelationshipText = loanGuaranteeData.cRelationshipText;  // 共同借款人关系
        // let gRelationshipText = loanGuaranteeData.gRelationshipText;  // 担保人关系
        let arr = [ 'verified', 'inconsistent', 'unknown', 'unverified' ]  //0核实匹配1核实不匹配2未知3未核实
        return (
            <div id='coborrower' className="coborrower-detail">
                { loanCoBorrower ?
                    loanCoBorrower.map((item, index) => (
                        <div key={index}>
                            <Row className="personal-info">
                                <Col span={4} className="title">
                                    <span id='guarantor'>共同借款人{index+1}信息</span>
                                </Col>
                                <Col span={20}>
                                { pictureInfo && pictureInfo[Config.bizType.loanCoborrower] && pictureInfo[Config.bizType.loanCoborrower].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanCoborrower)}>查看文件</span> : '' }
                                {/* {
                                    type == '6' ?
                                    <span className='button' onClick={()=>this.viewVerify(item.code,'loan')}>查看征信详情</span> : null
                                } */}
                                {
                                    item.coBorrowerCode ?
                                        <span className='button' onClick={()=>showPicture('LOAN_COBORROWER_CREDIT', item.coBorrowerCode)}>征信报告</span>:
                                        null
                                }
                                </Col>
                            </Row>
                            {/* {
                                type == '6' ?
                                <div className='mode-list'>
                                    <p className='ipieces-subtitle personal-info'>核身模型验证结果</p>
                                    {
                                        item.identityResult ?
                                        item.identityResult.idNameCheckResult && item.identityResult.idPhoneCheckResult ?
                                        <div>
                                            <p className="verify-p">身份证与姓名是否一致：{ item.identityResult.idNameCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                            <p className="verify-p">手机号是否实名认证：{ item.identityResult.idNameCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                        </div>
                                        :<p className="verify-p">拒绝原因：{ item.identityResult.message ? <span className="verify-false">{item.identityResult.message}</span> : null}</p>
                                        : <p className="verify-p">核身模型暂未验证</p>
                                    }
                                </div> : null
                            }
                            {
                                type == '6' ?
                                <div className='mode-list'>
                                    <p className='ipieces-subtitle personal-info'>征信模型验证结果</p>
                                    {
                                        item.creditQueryResult ?
                                        <div>
                                            {
                                                item.creditQueryResult.pbocScore ?
                                                <p className="verify-p">央行授信评分：{ item.creditQueryResult.pbocScore ? <span className="verify-true">{item.creditQueryResult.pbocScore}<span>({item.creditQueryResult.pbocScore < 490 ? '征信较差' : 490 < item.creditQueryResult.pbocScore && item.creditQueryResult.pbocScore < 510 ? '征信一般' : 510 < item.creditQueryResult.pbocScore && item.creditQueryResult.pbocScore < 530 ? '征信良好' : '征信优秀'})</span>
                                                </span> : null}<span className="score-explain" onClick={(e)=>this.showExplainModal(e,item)}>评分说明</span></p>
                                                : <p className="verify-p">拒绝原因：{ item.creditQueryResult.message ? <span className="verify-false">{item.creditQueryResult.message}</span> : null}</p>
                                            }
                                        </div>
                                        : <p className="verify-p">征信模型暂未验证</p>
                                    }
                                </div> : null
                            } */}
                            <Row className="personal-info-content">
                                <Col span={6} className="subtitle">
                                    <span>姓名：{item.name || '未录入'}</span>
                                </Col>
                                <Col span={6} className="subtitle">
                                    <span>性别：{item.sex || '未录入'}</span>
                                </Col>
                                <Col span={6} className="subtitle">
                                    <span>年龄：{item.age && item.age + '岁' || '未录入'}</span>
                                </Col>
                                <Col span={6} className="subtitle">
                                    <span>与申请人关系：{item.cRelationshipText || '未录入'}</span>
                                </Col>
                            </Row>
                            <Row className="personal-info-content">
                                <Col span={12} className="subtitle">
                                    <span>身份证号：{item.idCardNo || '未录入'}</span>
                                    {type!=6?(item.cIdCardVerifyRet ==null || item.cIdCardVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[item.cIdCardVerifyRet ]}>{item.cIdCardVerify}</span>):null}
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>联系方式：{item.telephone || '未录入'}</span>
                                    {type!=6?(item.cTelVerifyRet ==null || item.cTelVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[item.cTelVerifyRet ]}>{item.cTelVerify}</span>):null}
                                </Col>
                            </Row>
                            <Row className="personal-info-content">
                                <Col span={12} className="subtitle">
                                    <span>主营业务或职务：{item.mainBusiness || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>月收入：{item.income && item.income + '元' || '未录入'}</span>
                                </Col>
                            </Row>
                            <Row className="personal-info-content">
                                <Col span={12} className="subtitle">
                                    <span>单位名称：{item.orgName || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>单位住址：{item.orgAddr || '未录入'}</span>
                                </Col>
                            </Row>
                            <Row className="personal-info-content">
                                <Col span={2} className="subtitle"><span>其他信息：</span></Col>
                                <Col span={22} className="subtitle">{item.otherMessage || '未录入'}</Col>
                            </Row>
                        </div>))  : null }
                { loanGuarantee ?
                    loanGuarantee.map((item, index) => (
                        <div key={index}>
                            <Row className="personal-info">
                                <Col span={4} className="title">
                                    <span id='guarantor'>担保人{index+1}信息</span>
                                </Col>
                                <Col span={20}>
                                { pictureInfo && pictureInfo[Config.bizType.loanGuarantee] && pictureInfo[Config.bizType.loanGuarantee].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanGuarantee)}>查看文件</span> : '' }
                                {/* {
                                        type == '6' ?
                                        <span className='button' onClick={()=>this.viewVerify(item.code,'guaran')}>查看征信详情</span> : null
                                    } */}
                                    {
                                        item.guarantorCode ?
                                            <span className='button' onClick={()=>showPicture('LOAN_GUARANTEE_CREDIT', item.guarantorCode)}>征信报告</span>:
                                            null
                                    }
                                </Col>
                            </Row>
                            {/* {
                                type == '6' ?
                                <div className='mode-list'>
                                    <p className='ipieces-subtitle personal-info'>核身模型验证结果</p>
                                    {
                                        item.identityResult ?
                                        item.identityResult.idNameCheckResult && item.identityResult.idPhoneCheckResult ?
                                        <div>
                                            <p className="verify-p">身份证与姓名是否一致：{ item.identityResult.idNameCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                            <p className="verify-p">手机号是否实名认证：{ item.identityResult.idPhoneCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                        </div>
                                        :<p className="verify-p">拒绝原因：{ item.identityResult.message ? <span className="verify-false">{item.identityResult.message}</span> : null}</p>
                                        : <p className="verify-p">核身模型暂未验证</p>
                                    }
                                </div> : null
                            }
                            {
                                type == '6' ?
                                <div className='mode-list'>
                                    <p className='ipieces-subtitle personal-info'>征信模型验证结果</p>
                                    {
                                        item.creditQueryResult ?
                                        <div>
                                            {
                                                item.creditQueryResult.pbocScore ?
                                                <p className="verify-p">央行授信评分：{ item.creditQueryResult.pbocScore ? <span className="verify-true">{item.creditQueryResult.pbocScore}<span>({item.creditQueryResult.pbocScore < 490 ? '征信较差' : 490 < item.creditQueryResult.pbocScore && item.creditQueryResult.pbocScore < 510 ? '征信一般' : 510 < item.creditQueryResult.pbocScore && item.creditQueryResult.pbocScore < 530 ? '征信良好' : '征信优秀'})</span>
                                                </span> : null} <span className="score-explain" onClick={(e)=>this.showExplainModal(e,item)}>评分说明</span></p>
                                                : <p className="verify-p">拒绝原因：{ item.creditQueryResult.message ? <span className="verify-false">{item.creditQueryResult.message}</span> : null}</p>
                                            }
                                        </div>
                                        : <p className="verify-p">征信模型暂未验证</p>
                                    }
                                </div> : null
                            } */}
                            <Row className="personal-info-content">
                                <Col span={6} className="subtitle">
                                    <span>姓名：{item.name || '未录入'}</span>
                                </Col>
                                <Col span={6} className="subtitle">
                                    <span>性别：{item.sex || '未录入'}</span>
                                </Col>
                                <Col span={6} className="subtitle">
                                    <span>年龄：{item.age && item.age + '岁' || '未录入'}</span>
                                </Col>
                                {/* <Col span={6} className="subtitle">
                                    <span>与申请人关系：{item.gRelationshipText || '未录入'}</span>
                                </Col>	            	 */}
                            </Row>
                            <Row className="personal-info-content">
                                <Col span={12} className="subtitle">
                                    <span>身份证号：{item.idCardNo || '未录入'}</span>
                                    {type!=6?(item.gIdCardVerifyRet ==null || item.gIdCardVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[item.gIdCardVerifyRet ]}>{item.gIdCardVerify}</span>):null}
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>联系方式：{item.telephone || '未录入'}</span>
                                    {type!=6?(item.gTelVerifyRet ==null || item.gTelVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[item.gTelVerifyRet ]}>{item.gTelVerify}</span>):null}
                                </Col>
                            </Row>
                            <Row className="personal-info-content">
                                <Col span={12} className="subtitle">
                                    <span>主营业务或职务：{item.mainBusiness || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>月收入：{item.income && item.income + '元' || '未录入'}</span>
                                </Col>
                            </Row>
                            <Row className="personal-info-content">
                                <Col span={12} className="subtitle">
                                    <span>单位名称：{item.orgName || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>单位住址：{item.orgAddr || '未录入'}</span>
                                </Col>
                            </Row>
                            <Row className="personal-info-content">
                                <Col span={2} className="subtitle">其他信息：</Col>
                                <Col span={22} className="subtitle">{item.otherMessage || '未录入'}</Col>
                            </Row>
                        </div>))  : null }
			</div>
        )
    }
}

const pureDetailCoBoGua = pureRender(DetailCoBoGua);

export default pureDetailCoBoGua;
