import React, { Component } from 'react'; // 引入了React
import { Row, Col, Card } from 'antd';
import pureRender from 'pure-render-decorator';

import './style/detailBusAnalyse.less';

/**
 * 进件详情  (主营业务分析/生产情况分析)
 * @Author: 魏昌华
 * @Date:   2017-06-26
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-05
 */
class DetailBusAnalyse extends Component {
    render() {
        const { businessAnalysisData, analysisClass } = this.props;
        let loanBusinessDevpTrends = businessAnalysisData ? businessAnalysisData.loanBusinessDevpTrends : ''; // 生产经营发展趋势
        let loanBusinessProductDto = businessAnalysisData ? businessAnalysisData.loanBusinessProductDto : ''; // 生产型
        let loanBusinessProfitDto = businessAnalysisData ? businessAnalysisData.loanBusinessProfitDto : '';   // 标准型
        return (
            <div>
			{ loanBusinessDevpTrends && loanBusinessDevpTrends.length != 0 ?
            <Row className="personal-info">
                <Col span={24} className="title">
                    <span>生产经营发展趋势</span>
                </Col>
            </Row>	: null }
	        { loanBusinessDevpTrends ? loanBusinessDevpTrends.map((result, key) => {
                return (
                    <Card style={{marginBottom: '10px'}} key={key}>
                        <Row className="personal-info-content">
                            <Col span={4} className="title">
                                <span>{result.tyear}年</span>
                            </Col>
                            <Col span={20} className="subtitle">
                                <Row>
                                    <Col span={8} className="subtitle">
                                        <span>机器数量：{result.machineQuantity && result.machineQuantity + '台' || '未录入'}</span>
                                    </Col>
                                    <Col span={8} className="subtitle">
                                        <span>工人人数：{result.workerQuantity && result.workerQuantity + '人' || '未录入'}</span>
                                    </Col>
                                    <Col span={8} className="subtitle">
                                        <span>开工天数：{result.days && result.days + '天' || '未录入'}</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} className="subtitle">
                                        <span>工资总额：{result.wagesTotal && result.wagesTotal + '元' || '未录入'}</span>
                                    </Col>
                                    <Col span={8} className="subtitle">
                                        <span>营业额：{result.turnover && result.turnover + '元' || '未录入'}</span>
                                    </Col>
                                    <Col span={8} className="subtitle">
                                        <span>利润：{result.profit && result.profit + '元' || '未录入'}</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} className="subtitle">
                                        <span>存货：{result.stock && result.stock + '元' || '未录入'}</span>
                                    </Col>
                                    <Col span={8} className="subtitle">
                                        <span>应收账款：{result.accountsReceivable && result.accountsReceivable + '元' || '未录入'}</span>
                                    </Col>
                                    <Col span={8} className="subtitle">
                                        <span>应付账款：{result.accountsPayable && result.accountsPayable + '元' || '未录入'}</span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                )
            }) :
            loanBusinessDevpTrends && loanBusinessDevpTrends.length != 0 ?
            <p className='detail-noInfo'>暂无相关信息</p> : null
            }
            <Row className="personal-info">
                <Col span={24} className="title">
                    <span>{analysisClass==1 ? '主营业务平均毛利率分析' : '主营产品成本结构分析'}</span>
                </Col>
            </Row>
	        { analysisClass == 1 ? ( loanBusinessProfitDto ? <div>
                <Row className="personal-info-content">
                    <Col span={8} className="subtitle">
                        <span>加权利润率：{loanBusinessProfitDto.weighingGrossRate && loanBusinessProfitDto.weighingGrossRate + '%' || '未录入'}</span>
                    </Col>
                    {/*<Col span={8} className="title">
                        <span>月份期还款额/月销售额：{loanBusinessProfitDto.salesVolume && loanBusinessProfitDto.salesVolume + '元' || '未录入' }</span>
                    </Col>
                    <Col span={8} className="title">
                        <span>月份期还款额/月可支配资金：{loanBusinessProfitDto.disposable && loanBusinessProfitDto.disposable + '元' || '未录入'}</span>
                    </Col>           	*/}
                </Row>
			    { loanBusinessProfitDto.loanBusinessMajorDtos ? loanBusinessProfitDto.loanBusinessMajorDtos.map((result, key) => {
                    return (
                        <Card style={{marginBottom: '10px'}} key={key}>
                            <Row className="personal-info-content">
                                <Col span={8} className="subtitle">
                                    <span>产品种类：{result.prdKind || '未录入'}</span>
                                </Col>
                                <Col span={8} className="subtitle">
                                    <span>进价：{result.cost && result.cost + '元' || '未录入'}</span>
                                </Col>
                                <Col span={8} className="subtitle">
                                    <span>售价：{result.price && result.price + '元' || '未录入'}</span>
                                </Col>
                            </Row>
                            <Row className="personal-info-content">
                                <Col span={8} className="subtitle">
                                    <span>利润：{result.profit && result.profit + '元' || '未录入'}</span>
                                </Col>
                                <Col span={8} className="subtitle">
                                    <span>销售比例：{result.mrate && result.mrate + '%' || '未录入'}</span>
                                </Col>
                                <Col span={8} className="subtitle">
                                    <span>毛利率：{result.grossRate && result.grossRate + '%' || '未录入'}</span>
                                </Col>
                            </Row>
                        </Card>
                    )
                }) : '' }
            </div> : <p className='detail-noInfo'>暂无相关信息</p>) : (
            loanBusinessProductDto ? <div>
                <Row className="personal-info-content">
                    <Col span={8} className="subtitle">
                        <span>加权利润率：{loanBusinessProductDto.weighingGrossRate && loanBusinessProductDto.weighingGrossRate + '%' || '未录入'}</span>
                    </Col>
                    <Col span={16} className="subtitle">
                        <span>备注：{loanBusinessProductDto.remarks || '未录入'}</span>
                    </Col>
                </Row>
                { loanBusinessProductDto.loanBusinessMajorDtos ? loanBusinessProductDto.loanBusinessMajorDtos.map((result, key) => {
                        return ( <Card style={{marginBottom: '10px'}} key={key}>
                                <Row className="personal-info-content">
                                    <Col span={8} className="subtitle">
                                        <span>产品种类：{result.prdKind || '未录入'}</span>
                                    </Col>
                                    <Col span={8} className="subtitle">
                                        <span>售价：{result.price || '未录入'}</span>
                                    </Col>
                                    <Col span={8} className="subtitle">
                                        <span>占比：{result.mrate && result.mrate + '%' || '未录入'}</span>
                                    </Col>
                                </Row>
                                <Row className="personal-info-content">
                                    <Col span={24} className="subtitle">
                                        <span>根据成本结构（或工艺流程）计算的成本:{result.cost || '未录入'}</span>
                                    </Col>
                                </Row>
                            </Card>)
                        }) : ''
                    }
                </div> : <p className='detail-noInfo'>暂无相关信息</p>
	        )}
	        </div>
        )
    }
}

const pureDetailBusAnalyse = pureRender(DetailBusAnalyse);

export default pureDetailBusAnalyse;
