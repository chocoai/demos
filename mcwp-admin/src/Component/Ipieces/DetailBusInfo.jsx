import React, { Component } from 'react'; // 引入了React
import { Row, Col, Tooltip } from 'antd';
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/detailBusInfo.less';

/**
 * 进件详情经营基本信息
 * @Author: 魏昌华
 * @Date:   2017-06-26
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-03
 */
class DetailBusInfo extends Component {
    render() {
        const { loanBusinessBase, pictureInfo, showPicture,type } = this.props;
        let loanBusinessEntity = loanBusinessBase.loanBusinessEntity;  // 经营主体信息
		let loanBusinessInfo = loanBusinessBase.loanBusinessInfo;      // 经营状况
        let loanBusinessEntityBO = loanBusinessBase.loanBusinessEntityBO;  // 验证结果
        let arr = [ 'verified', 'inconsistent', 'unknown', 'unverified' ]  //0核实匹配1核实不匹配2未知3未核实
        return (
            <div className="detail-businfo-container">
                <Row className="personal-info">
                    <Col span={8} className="title">
                        <span id='bizInfo'>经营主体基本信息</span>
                    </Col>
                    <Col span={16}>
                        { pictureInfo && pictureInfo[Config.bizType.loanBusiBase] && pictureInfo[Config.bizType.loanBusiBase].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanBusiBase)}>查看文件</span> : '' }
                    </Col>
                </Row>
                {/* {
                    loanBusinessEntity ?  */}
                        <Row className="personal-info-content">
                            <Col span={8} className="subtitle">
                                <Tooltip placement="rightTop" title={loanBusinessEntity&&loanBusinessEntity.name}>
                                <span className="max-width-name">企业名称：{loanBusinessEntity&&loanBusinessEntity.name || '未录入'}
                                </span>
                                {type!=6?(loanBusinessEntityBO.nameRes ==null || loanBusinessEntityBO.nameRes == 3?<span className={arr[3]}>未核实</span>: <span className={arr[loanBusinessEntityBO.nameRes ]}>{loanBusinessEntityBO.nameResMsg}</span>):null}
                                </Tooltip>
                            </Col>
                            <Col span={8} className="subtitle">
                                <span>雇佣人数：{loanBusinessEntity&&loanBusinessEntity.employeeNumber && loanBusinessEntity.employeeNumber + '人' || '未录入'}</span>
                            </Col>
                            <Col span={8} className="subtitle">
                                <span>联系方式：{loanBusinessEntity&&loanBusinessEntity.telephone || '未录入'}</span>
                            </Col>
                            <Col span={8} className="subtitle">
                                <span>营业执照号：{loanBusinessEntity&&loanBusinessEntity.license || '未录入'}</span>
                            </Col>
                            <Col span={8} className="subtitle">
                                <span>法人代表：{loanBusinessEntity&&loanBusinessEntity.legalPerson || '未录入'}</span>
                                {type!=6?(loanBusinessEntityBO.legalPersonRes ==null || loanBusinessEntityBO.legalPersonRes == 3?<span className={arr[3]}>未核实</span>: <span className={arr[loanBusinessEntityBO.legalPersonRes ]}>{loanBusinessEntityBO.legalPersonResMsg}</span>):null}
                            </Col>
                            <Col span={8} className="subtitle">
                                <span>年收入：{loanBusinessEntity&&loanBusinessBase.annualIncomeText && loanBusinessBase.annualIncomeText  || '未录入'}</span>
                            </Col>
                            <Col span={8} className="subtitle">
                                <span className="max-width-legal">法律形式：{loanBusinessEntity&&loanBusinessEntity.legalFormText || '未录入'}</span>
                            </Col>
                            <Col span={8} className="subtitle">
                                <span>经营时间：{loanBusinessEntity&&loanBusinessEntity.operationTime && loanBusinessEntity.operationTime + '个月' || '未录入'}</span>
                            </Col>
                            <Col span={8} className="subtitle">
                                <span>是否工商注册：{loanBusinessEntity&&(loanBusinessEntity.isbusiregis === true? '是' : '否')||'未录入'}</span>
                            </Col>
                            <Col span={8} className="subtitle">
                                <span>所属行业：{loanBusinessEntity&&loanBusinessEntity.scopeText || '未录入'}</span>
                            </Col>
                            <Col span={8} className="subtitle">
                                <span>工作地址：{loanBusinessEntity&&loanBusinessEntity.address || '未录入'}</span>
                            </Col>
                            <Col span={8} className="subtitle">
                                <span>经营场所所有权：{loanBusinessEntity&&loanBusinessEntity.businessPlace || '未录入'}</span>
                            </Col>
                            <Col span={8} className="subtitle">
                                <span>经营场所面积：{loanBusinessEntity&&loanBusinessEntity.operationArea + '平' || '未录入'}</span>
                            </Col>
                        </Row>
                        {/* :
                        <p className='detail-noInfo'>暂无相关信息</p>
                } */}
			    <Row className="personal-info">
                    <Col span={4} className="title">
                        <span>经营状况</span>
                    </Col>
                    <Col span={20}>
                        { pictureInfo && pictureInfo[Config.bizType.loanBusiInfo] && pictureInfo[Config.bizType.loanBusiInfo].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanBusiInfo)}>查看文件</span> : '' }
                    </Col>
                </Row>
                {/* {
                    loanBusinessInfo ?  */}
                        <Row className="personal-info-content">
                            <Col span={6} className="subtitle">
                                <span>月销售额：{loanBusinessInfo&&loanBusinessInfo.monthlySale && loanBusinessInfo.monthlySale + '元' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>旺季：{loanBusinessInfo&&loanBusinessInfo.busySeason && loanBusinessInfo.busySeason + '月份' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>淡季：{loanBusinessInfo&&loanBusinessInfo.slackSeason && loanBusinessInfo.slackSeason + '月份' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>应收账款：{loanBusinessInfo&&loanBusinessInfo.accountsReceivable && loanBusinessInfo.accountsReceivable + '元' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>月毛利润：{loanBusinessInfo&&loanBusinessInfo.grossMargin && loanBusinessInfo.grossMargin + '元' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>月净利润：{loanBusinessInfo&&loanBusinessInfo.netProfit && loanBusinessInfo.netProfit + '元' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>存货：{loanBusinessInfo&&loanBusinessInfo.stock && loanBusinessInfo.stock + '元' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>负债：{loanBusinessInfo&&loanBusinessInfo.liabilities && loanBusinessInfo.liabilities + '元' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>总资产：{loanBusinessInfo&&loanBusinessInfo.totalAssets && loanBusinessInfo.totalAssets + '元' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>经营月数：{loanBusinessInfo&&loanBusinessInfo.operateMonth && loanBusinessInfo.operateMonth + '月' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>期间内资本注入：{loanBusinessInfo&&loanBusinessInfo.capitalInjection && loanBusinessInfo.capitalInjection + '元' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>期间内提取的资金：{loanBusinessInfo&&loanBusinessInfo.fundsExtracted && loanBusinessInfo.fundsExtracted + '元' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>月可支配金额：{loanBusinessInfo&&loanBusinessInfo.disposable && loanBusinessInfo.disposable + '元' || '未录入'}</span>
                            </Col>
                            <Col span={6} className="no-subtitle">
                                <span>成本结构及其他：{loanBusinessInfo&&loanBusinessInfo.costStructureOther && loanBusinessInfo.costStructureOther  || '未录入'}</span>
                            </Col>
                            <Col span={6} className="no-subtitle">
                                <span>其他收入：{loanBusinessInfo&&loanBusinessInfo.otherIncome || '未录入'}</span>
                            </Col>
                        </Row>
                        {/* :
                        <p className='detail-noInfo'>暂无相关信息</p>
                } */}
		    </div>
        )
    }
}

const pureDetailBusInfo = pureRender(DetailBusInfo);

export default pureDetailBusInfo;
