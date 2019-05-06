import React, { Component } from 'react'; // 引入了React
import { Row, Col } from 'antd';
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/detailBaseInfo.less';

import Idcard from '../../Assets/Images/idcard-detail.png';
import Namecard from '../../Assets/Images/ipieces-tab-face.png';
/**
 * 进件详情基本信息
 * @Author: 魏昌华
 * @Date:   2017-06-26
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-05
 */
class DetailBaseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictureInfo:'',
            preview:false,
        }
    }
    personCreditOpen = (personCredit) => {
        personCredit.map((item, index) => {
            window.open(item['srcUrl'])
        })
    }
    previewHide = () => {
        this.setState({
            preview: false
        })
    }
    render() {
        const { baseInfo, personCredit, pictureInfo, showPicture, eduDict, showDetail, hkqs , hkfs , relationship, type } = this.props;
        let loanCustomer = baseInfo.loanCustomer;      // 个人信息
        // let loanPledgeInfoDTO = baseInfo.loanPledgeInfoDTO ; // 抵质押信息
        let basicInfoVerifyDTO = baseInfo.basicInfoVerifyDTO  //验证结果
        let loanSpouse = baseInfo.loanSpouse ;          // 配偶信息
		let loanHomeInfo = baseInfo.loanHomeInfo;      // 家庭信息
        // let maritalStatusText = baseInfo.maritalStatusText;     // 结婚信息
        let loanPledgeInfos = baseInfo.loanPledgeInfos;         //抵质押信息
        let arr = [ 'verified', 'inconsistent', 'unknown', 'unverified' ]  //0核实匹配1核实不匹配2未知3未核实
        return (
            <div className="detail-baseinfo-container">
                <Row className="personal-info">
                    <Col span={4} className='title'>
                        <span id='customer'>个人信息</span>
                    </Col>
                    <Col span={20}>
                        { pictureInfo&&pictureInfo[Config.bizType.loanPerson]&&pictureInfo[Config.bizType.loanPerson].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanPerson)}>查看文件</span> : '' }
                        {
                            personCredit && personCredit.length?
                            <span className='button' onClick={()=>showPicture('LOAN_PERSON_CREDIT')}>征信报告</span>
                            : null
                        }
                    </Col>
                </Row>
                {/* {
                    loanCustomer ? */}
                        <Row className="personal-info-content" type="flex" justify="start">
                            <Col span={8} className="subtitle">
                                <span>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</span>{ type != 5 && type != 8 &&type!=6? <img onClick={showDetail} className="idcard" src={Namecard} alt="身份证" /> : null} 
                                {type!=6?(basicInfoVerifyDTO.cnameVerifyRet == null || basicInfoVerifyDTO.cnameVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : basicInfoVerifyDTO.cnameVerifyRet == 0 ?<span className={"max-width-face-verify " +  arr[basicInfoVerifyDTO.faceVerifyRet || basicInfoVerifyDTO.cnameVerifyRet]}>{basicInfoVerifyDTO.faceVerify || basicInfoVerifyDTO.cnameVerify}</span>:<span className={arr[basicInfoVerifyDTO.cnameVerifyRet ]}>{basicInfoVerifyDTO.cnameVerify}</span>):null}
                            </Col>
                            <Col span={4} className="subtitle">
                                <span>性别：{loanCustomer&&loanCustomer.sex || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>婚姻状况：{loanCustomer && loanCustomer.maritalStatusText || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>户籍：{loanCustomer&&loanCustomer.censusRegister || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>学历：{ loanCustomer&&loanCustomer.education && eduDict && eduDict.filter((item,index)=>(item.ddValue==loanCustomer.education))[0] && eduDict.filter((item,index)=>(item.ddValue==loanCustomer.education))[0]['ddText'] || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>身份证号：{loanCustomer&&loanCustomer.idCardNo || '未录入'}</span><img onClick={()=>showDetail('idcard')} className="idcard" src={Idcard} alt="身份证" />
                                {type!=6?(basicInfoVerifyDTO.customerIdCardVerifyRet ==null || basicInfoVerifyDTO.customerIdCardVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[basicInfoVerifyDTO.customerIdCardVerifyRet ]}>{basicInfoVerifyDTO.customerIdCardVerify}</span>):null}
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>申请金额：{loanCustomer&&loanCustomer.applyBalance && loanCustomer.applyBalance + '元' || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>客户经理预估金额：{loanCustomer&&loanCustomer.estimateAmount && loanCustomer.estimateAmount + '万元' || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>还款期数：{loanCustomer&&loanCustomer.repaymentPeriod  && hkqs && hkqs.filter((item,index)=>(item.ddValue==loanCustomer.repaymentPeriod))[0] && hkqs.filter((item,index)=>(item.ddValue==loanCustomer.repaymentPeriod))[0]['ddText'] + '期' || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>还款方式：{loanCustomer&&loanCustomer.repaymentKind && loanCustomer.repaymentKind !=0 ? hkfs && hkfs.filter((item,index)=>(item.ddValue==loanCustomer.repaymentKind))[0] && hkfs.filter((item,index)=>(item.ddValue==loanCustomer.repaymentKind))[0]['ddText']  : '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>总项目资金：{loanCustomer&&loanCustomer.allBalance && loanCustomer.allBalance + '万元' || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>联系方式：{loanCustomer&&loanCustomer.telephone || '未录入'}</span>
                                {type!=6?(basicInfoVerifyDTO.customerTelVerifyRet ==null || basicInfoVerifyDTO.customerTelVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[basicInfoVerifyDTO.customerTelVerifyRet ]}>{basicInfoVerifyDTO.customerTelVerify}</span>):null}
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>户籍住址：{loanCustomer&&loanCustomer.idCardAddr || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>家庭地址：{loanCustomer&&loanCustomer.homeAddr || '未录入'}</span>
                                {/* <span>家庭地址：{loanCustomer.homeAddr || '未录入'}</span>{basicInfoVerifyDTO.addrVerifyRet ==null || basicInfoVerifyDTO.addrVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[basicInfoVerifyDTO.addrVerifyRet ]}>{basicInfoVerifyDTO.addrVerify}</span>} */}
                            </Col>
                        </Row> 
                        {/* :<p className='detail-noInfo'>暂无相关信息</p> */}
                {/* } */}
                <Row className="personal-info">
                    <Col span={4} className="title">
                        <span id='spouse'>直系亲属信息</span>
                    </Col>
                    <Col span={20}>
                        { pictureInfo&&pictureInfo[Config.bizType.loanSpouse]&&pictureInfo[Config.bizType.loanSpouse].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanSpouse)}>查看文件</span> : '' }
                    </Col>
                </Row>
                {/* {
                    loanSpouse ? */}
                        <Row className="personal-info-content" type="flex" justify="start">
                            <Col span={6} className="subtitle">
                                <span>姓名：{loanSpouse&&loanSpouse.name || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>性别：{loanSpouse&&loanSpouse.sex || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>年龄：{loanSpouse&&loanSpouse.age && loanSpouse.age +'岁' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>月收入：{loanSpouse&&loanSpouse.income && loanSpouse.income +'元' || '未录入'}</span>
                            </Col>
                            {/* <Col span={12} className="subtitle">
                                <span>单位名称：{loanSpouse.orgName || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>单位地址：{loanSpouse.orgAddr || '未录入'}</span>
                            </Col>	 */}
                            <Col span={12} className="subtitle">
                                <span>身份证号：{loanSpouse&&loanSpouse.idCardNo || '未录入'}</span>
                                {type!=6?(basicInfoVerifyDTO.spouseIdCardVerifyRet ==null || basicInfoVerifyDTO.spouseIdCardVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[basicInfoVerifyDTO.spouseIdCardVerifyRet  ]}>{basicInfoVerifyDTO.spouseIdCardVerify}</span>):null}
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>联系方式：{loanSpouse&&loanSpouse.telephone || '未录入'}</span>
                                {type!=6?(basicInfoVerifyDTO.spouseTelVerifyRet ==null || basicInfoVerifyDTO.spouseTelVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[basicInfoVerifyDTO.spouseTelVerifyRet ]}>{basicInfoVerifyDTO.spouseTelVerify}</span>):null}
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>与申请人关系：{loanSpouse&&loanSpouse.relationship  && relationship && relationship.filter((item,index)=>(item.ddValue==loanSpouse.relationship))[0] && relationship.filter((item,index)=>(item.ddValue==loanSpouse.relationship))[0] && relationship.filter((item,index)=>(item.ddValue==loanSpouse.relationship))[0]['ddText'] || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>学历：{ loanSpouse&&loanSpouse.education && eduDict && eduDict.filter((item,index)=>(item.ddValue==loanSpouse.education))[0] && eduDict.filter((item,index)=>(item.ddValue==loanSpouse.education))[0] && eduDict.filter((item,index)=>(item.ddValue==loanSpouse.education))[0] && eduDict.filter((item,index)=>(item.ddValue==loanSpouse.education))[0]['ddText'] || '未录入'}</span>
                            </Col>
                        </Row> 
                        {/* :<p className='detail-noInfo'>暂无相关信息</p>
                } */}
                <Row className="personal-info">
                    <Col span={4} className="title">
                        <span id='spouse'>紧急联系人信息</span>
                    </Col>
                    <Col span={20}>
                        { pictureInfo&&pictureInfo[Config.bizType.loanEmergency]&&pictureInfo[Config.bizType.loanEmergency].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanEmergency)}>查看文件</span> : '' }
                    </Col>
                </Row>
                {/* {
                    loanSpouse ? */}
                        <Row className="personal-info-content" type="flex" justify="start">
                            <Col span={6} className="subtitle">
                                <span>姓名：{loanSpouse&&loanSpouse.emergencyContactName  || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>联系方式：{loanSpouse&&loanSpouse.emergencyContactTelephone  || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>与申请人关系：{loanSpouse&&loanSpouse.emergencyContactFriendship   && relationship && relationship.filter((item,index)=>(item.ddValue==loanSpouse.emergencyContactFriendship ))[0] && relationship.filter((item,index)=>(item.ddValue==loanSpouse.emergencyContactFriendship ))[0]['ddText'] || '未录入'}</span>
                            </Col>
                        </Row> 
                        {/* :
                        <p className='detail-noInfo'>暂无相关信息</p>
                } */}
                <Row className="personal-info">
                    <Col span={4} className="title">
                        <span>家庭情况信息</span>
                    </Col>
                    <Col span={20}>
                        { pictureInfo&&pictureInfo[Config.bizType.loanFamily]&&pictureInfo[Config.bizType.loanFamily].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanFamily)}>查看文件</span> : '' }
                    </Col>
                </Row>
                {/* {
                    loanHomeInfo ? */}
                    <Row className="personal-info-content" type="flex" justify="start">
                        <Col span={6} className="subtitle">
                            <span>家庭成员：{loanHomeInfo&&loanHomeInfo.memberNum && loanHomeInfo.memberNum + '个' || '未录入'}</span>
                        </Col>
                        <Col span={6} className="subtitle">
                            <span>供养人数：{loanHomeInfo&&loanHomeInfo.supportNum && loanHomeInfo.supportNum + '个' || '未录入'}</span>
                        </Col>
                        <Col span={6} className="subtitle">
                            <span>家庭每月总收入：{loanHomeInfo&&loanHomeInfo.income && loanHomeInfo.income + '元' || '未录入'}</span>
                        </Col>
                        <Col span={6} className="subtitle">
                            <span>家庭每月总开销：{loanHomeInfo&&loanHomeInfo.totalcost && loanHomeInfo.totalcost + '元' || '未录入'}</span>
                        </Col>
                        <Col span={6} className="subtitle">
                            <span>子女情况：{baseInfo && baseInfo.childrenInfoText || '未录入'}</span>
                        </Col>
                        <Col span={6} className="subtitle">
                            <span>父母情况：{loanHomeInfo&&loanHomeInfo.parentInfo && loanHomeInfo.parentInfo || '未录入'}</span>
                        </Col>
                        <Col span={12} className="subtitle">
                            <Col span={2}>备注：</Col>
                            <Col span={22}>{loanHomeInfo&&loanHomeInfo.remark && loanHomeInfo.remark || '未录入'}</Col>
                        </Col>
                    </Row> 
                    {/* :
                    <p className='detail-noInfo'>暂无相关信息</p>
                } */}
                { loanPledgeInfos ?
                    loanPledgeInfos.map((item, index) => (
                        <div key={index}>
                            <Row className="personal-info">
                                <Col span={4} className="title">
                                    <span id='guarantor'>抵质押{index+1}信息</span>
                                </Col>
                            </Row>
                            <Row className="personal-info-content" type="flex" justify="start">
                                <Col span={6} className="subtitle">
                                    <span>抵质押物名称：{item.pledgeName || '未录入'}</span>
                                </Col>
                                <Col span={6} className="subtitle">
                                    <span>类型：{item.pledgeType ? item.pledgeType == 1 ? '抵押物' : '质押物' : '未录入'}</span>
                                </Col>
                                <Col span={6} className="subtitle">
                                    <span>抵押人姓名：{item.name  || '未录入'}</span>
                                </Col>
                                <Col span={6} className="subtitle">
                                    <span>与申请人关系：{item.relationshipText || '未录入'}</span>
                                </Col>
                                <Col span={6} className="subtitle">
                                    <span>面积：{item.houseSize && item.houseSize + '㎡' || '未录入'}</span>
                                </Col>
                                <Col span={6} className="subtitle">
                                    <span>房龄：{item.houseAge && item.houseAge + '年'  || '未录入'}</span>
                                </Col>
                                <Col span={6} className="subtitle">
                                    <span>评估价值：{item.houseTotal && item.houseTotal + '万元' || '未录入'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <Col span={12} className="subtitle">
                                        <span>房屋位置：{item.address || '未录入'}</span>
                                    </Col>
                                    <Col span={12} className="subtitle">
                                        <span>权证号：{item.warrentNumber || '未录入'}</span>
                                    </Col>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <span>房屋是否已抵押给其他银行或个人：{item.pledgeStatus ? '是' : '否'}</span>
                                </Col>
                                <Col span={12} className="subtitle">
                                    <Col span={2}>备注：</Col>
                                    <Col span={22}>{item.remark || '未录入'}</Col>
                                </Col>
                            </Row>
                            {/* <Row className="personal-info-content" type="flex" justify="start">

                            </Row>
                            <Row className="personal-info-content" type="flex" justify="start">

                            </Row>
                            <Row className="personal-info-content" type="flex" justify="start">

                            </Row> */}
                        </div>))  : null }
            </div>
        )
    }
}

// 将 store 中的数据作为 props 绑定到 DetailBaseInfo 上
// const mapStateToProps = (state, ownProps) => {
//     let { Common, Ipieces } = state;
//     return {
//         loading: Common.loading
//     }
// }

// // 将 action 作为 props 绑定到 DetailBaseInfo 上。
// const mapDispatchToProps = (dispatch, ownProps) => ({
//     actions: bindActionCreators({ }, dispatch)
// });

// const reduxDetailBaseInfo = connect(mapStateToProps, mapDispatchToProps)(DetailBaseInfo); // 连接redux

const pureDetailBaseInfo = pureRender(DetailBaseInfo);

export default pureDetailBaseInfo;
