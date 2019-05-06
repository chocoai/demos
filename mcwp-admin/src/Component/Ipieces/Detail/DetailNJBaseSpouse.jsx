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
class DetailNJBaseSpouse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictureInfo: ''
        }
    }

    render() {
        const { spouseCredit, pictureInfo, showPicture, loanSpouse, showDetail, type, topInfo } = this.props;
        return (
            <div className="detail-baseinfo-container">
                <Row className="personal-info">
                    <Col span={4} className='title'>
                        <span id='customer'>配偶信息</span>
                    </Col>
                    <Col span={20}>
                        {pictureInfo && pictureInfo[Config.bizType.loanSpouse] && pictureInfo[Config.bizType.loanSpouse].length ? <span className="button" onClick={() => showPicture(Config.bizType.loanSpouse)}>查看文件</span> : ''}
                        {
                            spouseCredit && spouseCredit.length ?
                                <span className='button' onClick={() => showPicture('LOAN_SPOUSE_CREDIT')}>征信报告</span>
                                : null
                        }
                    </Col>
                </Row>
                <Row className="personal-info-content" type="flex" justify="start">
                    <Col span={12} className="subtitle">
                        <span>姓名：{loanSpouse.name || '未录入'}</span>
                    </Col>
                    <Col span={12} className="subtitle">
                        <span>学历：{loanSpouse.educationText || '未录入'}</span>
                    </Col>
                    <Col span={12} className="subtitle">
                        <span>身份证号：{loanSpouse.idCardNo || '未录入'}</span>
                        {/* {basicInfoVerifyDTO.customerIdCardVerifyRet == null || basicInfoVerifyDTO.customerIdCardVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : <span className={arr[basicInfoVerifyDTO.customerIdCardVerifyRet]}>{basicInfoVerifyDTO.customerIdCardVerify}</span>} */}
                    </Col>
                    <Col span={12} className="subtitle">
                        <span>联系方式：{loanSpouse.telephone || '未录入'}</span>
                        {/* {basicInfoVerifyDTO.customerTelVerifyRet == null || basicInfoVerifyDTO.customerTelVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : <span className={arr[basicInfoVerifyDTO.customerTelVerifyRet]}>{basicInfoVerifyDTO.customerTelVerify}</span>} */}
                    </Col>
                    <Col span={12} className="subtitle">
                        <span>所属行业：{loanSpouse.belongIndustryText || '未录入'}</span>
                    </Col>
                    <Col span={12} className="subtitle">
                        <span>月收入：{loanSpouse.monthIncome && loanSpouse.monthIncome + '元' || '未录入'}</span>
                    </Col>
                    <Col span={12} className="subtitle">
                        <span>当前月还贷金额：{loanSpouse.monthDebt && loanSpouse.monthDebt + '元' || '未录入'}</span>
                    </Col>
                    <Col span={12} className="subtitle">
                        <span>信用卡汇总额度：{loanSpouse.creditcardSumamt && loanSpouse.creditcardSumamt + '元' || '未录入'}</span>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default pureRender(DetailNJBaseSpouse);
