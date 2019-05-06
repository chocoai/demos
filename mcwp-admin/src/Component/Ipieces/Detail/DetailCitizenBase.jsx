import React, { Component } from 'react'; // 引入了React
import { Row, Col } from 'antd';
import pureRender from 'pure-render-decorator';
import { Config } from '../../../Config/Index';
import './../style/detailBaseInfo.less';

import Idcard from '../../../Assets/Images/idcard-detail.png';
import Namecard from '../../../Assets/Images/ipieces-tab-face.png';
/**
 * 市民贷基本信息
 * @Author: 赵俊
 * @Date:   2018-05-16
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-05-16
 */
class DetailCitizenBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictureInfo: ''
        }
    }

    render() {
        const { baseInfo, personCredit, pictureInfo, showPicture, eduDict, showDetail, type, topInfo } = this.props;
        let loanCustomer = baseInfo.loanCustomer;      // 个人信息
        let basicInfoVerifyDTO = baseInfo.basicInfoVerifyDTO  //验证结果
        let arr = ['verified', 'inconsistent', 'unknown', 'unverified']  //0核实匹配1核实不匹配2未知3未核实
        return (
            <div className="detail-baseinfo-container">
                <Row className="personal-info">
                    <Col span={4} className='title'>
                        <span id='customer'>个人信息</span>
                    </Col>
                    <Col span={20}>
                        {pictureInfo && pictureInfo[Config.bizType.loanPerson] && pictureInfo[Config.bizType.loanPerson].length ? <span className="button" onClick={() => showPicture(type=='15'?`${Config.bizType.loanPerson},${Config.bizType.loanCreditFamily}`:Config.bizType.loanPerson)}>查看文件</span> : ''}
                        {
                            personCredit && personCredit.length ?
                                <span className='button' onClick={() => showPicture('LOAN_PERSON_CREDIT')}>征信报告</span>
                                : null
                        }
                    </Col>
                </Row>
                {
                    loanCustomer ?
                        <Row className="personal-info-content" type="flex" justify="start">
                            <Col span={12} className="subtitle">
                                <span>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</span>{pictureInfo && (pictureInfo[Config.bizType.loanPersonFront] || pictureInfo[Config.bizType.loanPersonFace]) ? <img onClick={showDetail} className="idcard" src={Namecard} alt="身份证" /> : null} {basicInfoVerifyDTO.cnameVerifyRet != null ? (basicInfoVerifyDTO.cnameVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : (basicInfoVerifyDTO.cnameVerifyRet == 0 ? <span className={"max-width-face-verify " + arr[basicInfoVerifyDTO.faceVerifyRet || basicInfoVerifyDTO.cnameVerifyRet]}>{basicInfoVerifyDTO.faceVerify || basicInfoVerifyDTO.cnameVerify}</span> : <span className={arr[basicInfoVerifyDTO.cnameVerifyRet]}>{basicInfoVerifyDTO.cnameVerify}</span>)) : null}
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>婚姻状况：{loanCustomer && loanCustomer.maritalStatusText || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>学历：{loanCustomer.education && eduDict && eduDict.filter((item, index) => (item.ddValue == loanCustomer.education))[0] && eduDict.filter((item, index) => (item.ddValue == loanCustomer.education))[0]['ddText'] || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>身份证号：{loanCustomer.idCardNo || '未录入'}</span>{pictureInfo && (pictureInfo[Config.bizType.loanPersonFront] || pictureInfo[Config.bizType.loanPersonBack]) ? <img onClick={() => showDetail('idcard')} className="idcard" src={Idcard} alt="身份证" /> : null}
                                {/* {[6, 10, 11, 2, 3, 12].includes(+topInfo.auditStatus)? <span className='verified'>已核实</span>: null} */}
                                {basicInfoVerifyDTO.customerIdCardVerifyRet == null || basicInfoVerifyDTO.customerIdCardVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : <span className={arr[basicInfoVerifyDTO.customerIdCardVerifyRet]}>{basicInfoVerifyDTO.customerIdCardVerify}</span>}
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>申请金额：{Config.field(loanCustomer, 'applyBalance', '元', 'numberWithCommas')}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>联系方式：{loanCustomer.telephone || '未录入'}</span>
                                {/* {[6, 10, 11, 2, 3, 12].includes(+topInfo.auditStatus)? <span className='verified'>已核实</span>: null} */}
                                {basicInfoVerifyDTO.customerTelVerifyRet == null || basicInfoVerifyDTO.customerTelVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : <span className={arr[basicInfoVerifyDTO.customerTelVerifyRet]}>{basicInfoVerifyDTO.customerTelVerify}</span>}
                            </Col>
                            {/* {
                                type == 12 ?
                                    <Col span={12} className="subtitle">
                                        <span>单位性质：{loanCustomer.orgTypeText || '未录入'}</span>
                                    </Col> : null
                            } */}
                            <Col span={12} className="subtitle">
                                <span>所属行业：{loanCustomer.belongIndustryText || '未录入'}</span>
                            </Col>
                            {/* {
                                type == 12 ?
                                    <Col span={12} className="subtitle">
                                        <span>职务：{loanCustomer.jobTitleText || '未录入'}</span>
                                    </Col> : null
                            } */}
                            <Col span={12} className="subtitle">
                                <span>月收入：{Config.field(loanCustomer, 'monthIncome', '元')}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>当前月还贷金额：{Config.field(loanCustomer, 'monthDebt', '元')}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>信用卡汇总额度：{Config.field(loanCustomer, 'creditcardSumamt', '元')}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>居住地址：{loanCustomer.homeAddr || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>选择网点：{loanCustomer.branchWebsite || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>客户类型：{loanCustomer.customerTypeText || '未录入'}</span>
                            </Col>
                        </Row> :
                        <p className='detail-noInfo'>暂无相关信息</p>
                }
            </div>
        )
    }
}

const pureDetailCitizenBase = pureRender(DetailCitizenBase);

export default pureDetailCitizenBase;
