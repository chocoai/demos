import React, { Component } from 'react'; // 引入了React
import { Row, Col } from 'antd';
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';

import './style/detailBaseInfo.less';
import Idcard from '../../Assets/Images/idcard-detail.png';
import Namecard from '../../Assets/Images/ipieces-tab-face.png';

/**
 * 进件详情基本信息
 * @Author: 赵俊
 * @Date:   2017-06-29
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-06
 */
class DetailNetBaseInfo extends Component {
    render() {
        const { baseInfo, type, personCredit, pictureInfo, showPicture, eduDict, showDetail, relationship } = this.props;
        let loanCustomer = baseInfo.loanCustomer;      // 个人信息
        let basicInfoVerifyDTO = baseInfo.basicInfoVerifyDTO  //验证结果
        let loanSpouse = baseInfo.loanSpouse ;          // 配偶信息
        let maritalStatusText = baseInfo.maritalStatusText;     // 结婚信息
        console.log(baseInfo, maritalStatusText)
        let arr = [ 'verified', 'inconsistent', 'unknown', 'unverified' ]  //0核实匹配1核实不匹配2未知3未核实
        return (
            <div className="detail-baseinfo-container">
                <Row className="personal-info">
                    <Col span={4} className="title">
                        <span id='customer'>个人信息</span>
                    </Col>
                    <Col span={20}>
                        {/* { pictureInfo && pictureInfo['LOAN_PERSON'] ? <span className="button" onClick={()=>showPicture('LOAN_PERSON')}>照片信息</span> : '' } */}
                        { pictureInfo&&pictureInfo[Config.bizType.loanPerson]&&pictureInfo[Config.bizType.loanPerson].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanPerson)}>查看文件</span> : '' }
                        {
                            personCredit && personCredit.length?
                            <span className='button' onClick={()=>showPicture('LOAN_PERSON_CREDIT')}>征信报告</span>
                            : null
                        }
                    </Col>
                </Row>
                {
                    loanCustomer ?
                        <Row className="personal-info-content" type="flex" justify="start">
                            <Col span={8} className="subtitle">
                                <span>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</span>{ type != 5 && type != 8 ? <img onClick={showDetail} className="idcard" src={Namecard} alt="身份证" /> : null} {basicInfoVerifyDTO.cnameVerifyRet == null || basicInfoVerifyDTO.cnameVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : basicInfoVerifyDTO.cnameVerifyRet == 0 ?<span className={"max-width-face-verify " +  arr[basicInfoVerifyDTO.faceVerifyRet || basicInfoVerifyDTO.cnameVerifyRet]}>{basicInfoVerifyDTO.faceVerify || basicInfoVerifyDTO.cnameVerify}</span>:<span className={arr[basicInfoVerifyDTO.cnameVerifyRet ]}>{basicInfoVerifyDTO.cnameVerify}</span>}
                            </Col>
                            <Col span={4} className="subtitle">
                                <span>性别：{loanCustomer.sex || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>年龄：{loanCustomer.age && loanCustomer.age + '岁' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>婚姻状况：{loanCustomer.maritalStatusText || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>户籍：{loanCustomer.censusRegister || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>最高学历：{loanCustomer.topEducation && eduDict && eduDict.filter((item,index)=>(item.ddValue==loanCustomer.topEducation))[0]['ddText'] || '未录入'}</span>
                            </Col>
                            {/* 类型5身份证可以跳过 */}
                            <Col span={12} className="subtitle">
                                <span>身份证号：{loanCustomer.idCardNo || '未录入'}</span>{pictureInfo&&pictureInfo[Config.bizType.loanPerson]&&pictureInfo[Config.bizType.loanPerson].length ?<img onClick={()=>showDetail('idcard')} className="idcard" src={Idcard} alt="身份证" /> : null}{basicInfoVerifyDTO.customerIdCardVerifyRet ==null || basicInfoVerifyDTO.customerIdCardVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[basicInfoVerifyDTO.customerIdCardVerifyRet ]}>{basicInfoVerifyDTO.customerIdCardVerify}</span>}
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>联系方式：{loanCustomer.telephone || '未录入'}</span>{basicInfoVerifyDTO.customerTelVerifyRet ==null || basicInfoVerifyDTO.customerTelVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[basicInfoVerifyDTO.customerTelVerifyRet ]}>{basicInfoVerifyDTO.customerTelVerify}</span>}
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>家庭住址：{loanCustomer.homeAddr || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>户籍住址：{loanCustomer.idCardAddr || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>子女情况：{baseInfo.childrenInfoText || '未录入'}</span>
                            </Col>
                            {/* <Col span={12} className="subtitle">
                                <span>居住地址：{loanCustomer.homeAddr || '未录入'}</span>{basicInfoVerifyDTO.addrVerifyRet ==null || basicInfoVerifyDTO.addrVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[basicInfoVerifyDTO.addrVerifyRet ]}>{basicInfoVerifyDTO.addrVerify}</span>}
                            </Col>		 */}
                        </Row> :
                        <p className='detail-noInfo'>暂无相关信息</p>
                }
                <Row className="personal-info">
                    <Col span={4} className="title">
                        <span id='spouse'>直系亲属信息</span>
                    </Col>
                    <Col span={20}>
                        {/* { pictureInfo && pictureInfo['LOAN_SPOUSE'] ? <span className="button" onClick={()=>showPicture('LOAN_SPOUSE')}>照片信息</span> : '' } */}
                        { pictureInfo&&pictureInfo[Config.bizType.loanSpouse]&&pictureInfo[Config.bizType.loanSpouse].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanSpouse)}>查看文件</span> : '' }
                    </Col>
                </Row>
                {
                    loanSpouse ?
                        <Row className="personal-info-content">
                            <Col span={6} className="subtitle">
                                <span>姓名：{loanSpouse.name || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>与申请人关系：{loanSpouse.relationship && relationship && relationship.filter((item,index)=>(item.ddValue==loanSpouse.relationship))[0]['ddText'] || '未录入'}</span>
                            </Col>
                            {/* <Col span={6} className="subtitle">
                                <span>性别：{loanSpouse.sex || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>年龄：{loanSpouse.age || '未录入'}</span>
                            </Col> */}
                            {/* <Col span={6} className="subtitle">
                                <span>收入：{loanSpouse.income || '未录入'}</span>
                            </Col>	 */}
                            <Col span={12} className="subtitle">
                                <span>身份证号：{loanSpouse.idCardNo || '未录入'}</span>{basicInfoVerifyDTO.spouseIdCardVerifyRet ==null || basicInfoVerifyDTO.spouseIdCardVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[basicInfoVerifyDTO.spouseIdCardVerifyRet  ]}>{basicInfoVerifyDTO.spouseIdCardVerify}</span>}
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>联系方式：{loanSpouse.telephone || '未录入'}</span>{basicInfoVerifyDTO.spouseTelVerifyRet ==null || basicInfoVerifyDTO.spouseTelVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[basicInfoVerifyDTO.spouseTelVerifyRet ]}>{basicInfoVerifyDTO.spouseTelVerify}</span>}
                            </Col>
                            {/*<Col span={24} className="subtitle">
                                <span>学历：{loanSpouse.education && eduDict && eduDict.filter((item,index)=>(item.ddValue==loanSpouse.education))[0]['ddText'] || '未录入'}</span>
                            </Col>					                    	            	*/}
                        </Row> :
                        <p className='detail-noInfo'>暂无相关信息</p>
                    }
                <Row className="personal-info">
                    <Col span={4} className="title">
                        <span id='spouse'>紧急联系人信息</span>
                    </Col>
                    <Col span={20}>
                        { pictureInfo&&pictureInfo[Config.bizType.loanEmergency]&&pictureInfo[Config.bizType.loanEmergency].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanEmergency)}>查看文件</span> : '' }
                    </Col>
                </Row>
                {
                    loanSpouse &&(loanSpouse.emergencyContactName || loanSpouse.emergencyContactFriendship || loanSpouse.emergencyContactTelephone) ?
                        <Row className="personal-info-content">
                            <Col span={6} className="subtitle">
                                <span>姓名：{loanSpouse.emergencyContactName || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>与申请人关系：{loanSpouse.emergencyContactFriendship && relationship && relationship.filter((item,index)=>(item.ddValue==loanSpouse.emergencyContactFriendship))[0]['ddText'] || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>联系方式：{loanSpouse.emergencyContactTelephone || '未录入'}</span>
                            </Col>
                        </Row> :
                        <p className='detail-noInfo'>暂无相关信息</p>
                }
            </div>
        )
    }
}

const pureDetailNetBaseInfo = pureRender(DetailNetBaseInfo);

export default pureDetailNetBaseInfo;
