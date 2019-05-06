import React, { Component } from 'react'; // 引入了React
import { Row, Col } from 'antd';
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/detailBaseInfo.less';
import Idcard from '../../Assets/Images/idcard-detail.png';
import Namecard from '../../Assets/Images/ipieces-tab-face.png';
import CommonDetail from '../../Component/Ipieces/CommonDetail'

/**
 * 进件详情基本信息
 * @Author: 魏昌华
 * @Date:   2017-06-26
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-03-21
 */
class DetailBaseInfo extends Component {
    render() {
        const { baseInfo, pictureInfo, showPicture, showDetail, type } = this.props;
        const { fieldConfigMerge: fieldConfig, moduleName, loanCustomer, loanSpouse, loanAdvice, basicInfoVerifyDTO, emergencyContract, loanPledgeInfos, moduleConfig } = baseInfo
        let arr = ['verified', 'inconsistent', 'unknown', 'unverified']  //0核实匹配1核实不匹配2未知3未核实
        let tmpImg = {
            loanCustomer: {
                cname: type != 8 ? <img onClick={showDetail} className="idcard" src={Namecard} alt="身份证" /> : null,
                idCardNo: pictureInfo.LOAN_PERSON_IDENTITY_FRONT || pictureInfo.LOAN_PERSON_IDENTITY_BACK ?
                    <img onClick={() => showDetail('idcard')} className="idcard" src={Idcard} alt="身份证" />
                    : null
            },
            relativeInfo: '',
            emergencyContactInfo: ''
        }
        let tmpVerify = {
            loanCustomer: {
                cname: type != 8 ? basicInfoVerifyDTO.cnameVerifyRet == null || basicInfoVerifyDTO.cnameVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : basicInfoVerifyDTO.cnameVerifyRet == 0 ? <span className={"max-width-face-verify " + arr[basicInfoVerifyDTO.faceVerifyRet || basicInfoVerifyDTO.cnameVerifyRet]}>{basicInfoVerifyDTO.faceVerify || basicInfoVerifyDTO.cnameVerify}</span> : <span className={arr[basicInfoVerifyDTO.cnameVerifyRet]}>{basicInfoVerifyDTO.cnameVerify}</span> : null,
                // idCardNo: type != 8 ?basicInfoVerifyDTO.customerIdCardVerifyRet == null || basicInfoVerifyDTO.customerIdCardVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : <span className={arr[basicInfoVerifyDTO.customerIdCardVerifyRet]}>{basicInfoVerifyDTO.customerIdCardVerify}</span>:null,
                idCardNo: basicInfoVerifyDTO.customerIdCardVerifyRet != null ? basicInfoVerifyDTO.customerIdCardVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : <span className={arr[basicInfoVerifyDTO.customerIdCardVerifyRet]}>{basicInfoVerifyDTO.customerIdCardVerify}</span> : null,
                telephone: basicInfoVerifyDTO.customerTelVerifyRet == null || basicInfoVerifyDTO.customerTelVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : <span className={arr[basicInfoVerifyDTO.customerTelVerifyRet]}>{basicInfoVerifyDTO.customerTelVerify}</span>
            },
            relativeInfo: {
                idCardNo: basicInfoVerifyDTO.spouseIdCardVerifyRet == null || basicInfoVerifyDTO.spouseIdCardVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : <span className={arr[basicInfoVerifyDTO.spouseIdCardVerifyRet]}>{basicInfoVerifyDTO.spouseIdCardVerify}</span>,
                telephone: basicInfoVerifyDTO.spouseTelVerifyRet == null || basicInfoVerifyDTO.spouseTelVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : <span className={arr[basicInfoVerifyDTO.spouseTelVerifyRet]}>{basicInfoVerifyDTO.spouseTelVerify}</span>
            },
            emergencyContactInfo: ''
        }
        let content = {
            loanAdvice: moduleName.loanAdvice ?
                <div>
                    <Row className="personal-info">
                        <Col span={4} className='title'>
                            <span id='customer'>{moduleName.loanAdvice}</span>
                        </Col>
                    </Row>
                    {
                        loanAdvice && !Config.isNull(baseInfo.fieldConfig.loanAdvice) ?
                            <CommonDetail moduleType='loanAdvice' fieldConfig={fieldConfig} detailData={loanAdvice} tmpImg={tmpImg} tmpVerify={tmpVerify} />
                            : <p className='detail-noInfo'>暂无相关信息</p>
                    }
                </div> : null,
            loanCustomer: moduleName.loanCustomer ?
                <div>
                    <Row className="personal-info">
                        <Col span={4} className='title'>
                            <span id='customer'>{moduleName.loanCustomer}</span>
                        </Col>
                        <Col span={20}>
                            {pictureInfo && pictureInfo[Config.bizType.loanPerson] && pictureInfo[Config.bizType.loanPerson].length ? <span className="button" onClick={() => showPicture(Config.bizType.loanPerson)}>查看文件</span> : ''}
                        </Col>
                    </Row>
                    {
                        loanCustomer && !Config.isNull(baseInfo.fieldConfig.loanCustomer) ?
                            <CommonDetail moduleType='loanCustomer' fieldConfig={fieldConfig} detailData={loanCustomer} tmpImg={tmpImg} tmpVerify={tmpVerify} />
                            : <p className='detail-noInfo'>暂无相关信息</p>
                    }
                </div> : null,
            relativeInfo: moduleName.relativeInfo ?
                <div>
                    <Row className="personal-info">
                        <Col span={4} className='title'>
                            <span id='customer'>{moduleName.relativeInfo}</span>
                        </Col>
                        <Col span={20}>
                            {pictureInfo && pictureInfo[Config.bizType.loanSpouse] && pictureInfo[Config.bizType.loanSpouse].length ? <span className="button" onClick={() => showPicture(Config.bizType.loanSpouse)}>查看文件</span> : ''}
                        </Col>
                    </Row>
                    {
                        loanSpouse && !Config.isNull(baseInfo.fieldConfig.relativeInfo) ?
                            <CommonDetail moduleType='relativeInfo' fieldConfig={fieldConfig} detailData={loanSpouse} tmpImg={tmpImg} tmpVerify={tmpVerify} />
                            : <p className='detail-noInfo'>暂无相关信息</p>
                    }
                </div> : null,
            emergencyContactInfo: moduleName.emergencyContactInfo ?
                // 模块存在，但是数据不存在或者字段没有
                emergencyContract && emergencyContract.length && !Config.isNull(baseInfo.fieldConfig.emergencyContactInfo) ?
                    <div>
                        {
                            emergencyContract.map((item, index) => (
                                <div key={index}>
                                    <Row className="personal-info">
                                        <Col span={4} className="title">
                                            <span id='spouse'>{moduleName.emergencyContactInfo}{index + 1}</span>
                                        </Col>
                                        <Col span={20}>
                                            {pictureInfo && pictureInfo[Config.bizType.loanEmergency] && pictureInfo[Config.bizType.loanEmergency].length ? <span className="button" onClick={() => showPicture(Config.bizType.loanEmergency)}>查看文件</span> : ''}
                                        </Col>
                                    </Row>
                                    {
                                        item ?
                                            <CommonDetail moduleType='emergencyContactInfo' fieldConfig={fieldConfig} detailData={item} tmpImg={tmpImg} tmpVerify={tmpVerify} />
                                            : <p className='detail-noInfo'>暂无相关信息</p>
                                    }
                                </div>
                            ))
                        }
                    </div> :
                    <div>
                        <Row className="personal-info">
                            <Col span={4} className="title">
                                <span>{moduleName.emergencyContactInfo}</span>
                            </Col>
                        </Row>
                        <p className='detail-noInfo'>暂无相关信息</p>
                    </div>
                : null,
            pledgeInfo: moduleName.pledgeInfo ?
                // 模块存在，但是数据不存在或者字段没有
                loanPledgeInfos && loanPledgeInfos.length && !Config.isNull(baseInfo.fieldConfig.pledgeInfo) ?
                    loanPledgeInfos.map((item, index) => (
                        <div key={index}>
                            <Row className="personal-info">
                                <Col span={4} className="title">
                                    <span id='guarantor'>{moduleName.pledgeInfo}{index + 1}</span>
                                </Col>
                                <Col span={20}>
                                    {pictureInfo && pictureInfo[Config.showType.loanPledgeAll] && pictureInfo[Config.showType.loanPledgeAll].length ? <span className="button" onClick={() => showPicture(Config.showType.loanPledgeAll)}>查看文件</span> : ''}
                                </Col>
                            </Row>
                            {
                                item ?
                                    <CommonDetail moduleType='pledgeInfo' fieldConfig={fieldConfig} detailData={item} tmpImg={tmpImg} tmpVerify={tmpVerify} />
                                    : <p className='detail-noInfo'>暂无相关信息</p>
                            }
                        </div>))
                    :
                    <div>
                        <Row className="personal-info">
                            <Col span={4} className="title">
                                <span>{moduleName.pledgeInfo}</span>
                            </Col>
                        </Row>
                        <p className='detail-noInfo'>暂无相关信息</p>
                    </div>
                : null
        }
        return (
            <div className="detail-baseinfo-container">
                {
                    moduleConfig.sort((i1, i2) => i1.position - i2.position).map(i => <div key={i.formEnName}>{content[i.formEnName]}</div>)
                }
            </div>
        )
    }
}

const pureDetailBaseInfo = pureRender(DetailBaseInfo);

export default pureDetailBaseInfo;
