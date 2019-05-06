import React, { Component } from 'react'; // 引入了React
import { Row, Col, Card } from 'antd';
import pureRender from 'pure-render-decorator';

import './style/detailOthBusInfo.less';

/**
 * 农贷进件详情经营信息
 * @Author: 钟观发
 * @Date:   2017-10-11
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-10-11
 */
class DetailManageFarm extends Component {
    render() {
        const { farmBase, cultiLand } = this.props;
        let businessLandList = farmBase.businessLandList;            // 耕地信息
        let businessPlantList = farmBase.businessPlantList;            // 种植结构
        let businessBreedList = farmBase.businessBreedList;            // 养殖结构
        return (
            <div className='detailOthBusInfo-container'>
                <Row className="personal-info">
                    <Col span={24} className="title">
                        <span>耕地信息</span>
                    </Col>							                                	
                </Row>
                { businessLandList && businessLandList.length ? <div>
                    { businessLandList.map((result, key) => {
                        if(!result) return;
                        return (
                            <Card key={key} style={{marginBottom: '10px'}}>
                                <Row className="personal-info-content">								            	
                                    <Col span={6} className="subtitle">
                                        <span>耕地类型：{result.ltype && cultiLand && cultiLand.filter((item,index)=>(item.ddValue==result.ltype))[0]['ddText'] || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>上一周期租赁耕地：{result.previousLland && result.previousLland +'亩' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>上一周期自有耕地：{result.previousHaveland && result.previousHaveland +'亩' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>下一周期租赁耕地：{result.nextLland && result.nextLland +'亩' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>下一周期自有耕地：{result.nextHaveland && result.nextHaveland +'亩' || '未录入'}</span>
                                    </Col>						                       	
                                </Row>										           
                            </Card>
                        );								            	
                    })}							            					            						
                </div> : 
                <p className='detail-noInfo'>暂无相关信息</p>
                }
                <Row className="personal-info">
                    <Col span={24} className="title">
                        <span className="p-span">种植结构</span>
                    </Col>							                                	
                </Row>
                { businessPlantList && businessPlantList.length ? <div>
                    { businessPlantList.map((result, key) => {
                        if(!result) return;
                        return (
                            <Card key={key} style={{marginBottom: '10px'}}>
                                <Row className="personal-info-content">								            	
                                    <Col span={6} className="subtitle">
                                        <span>农作物名称：{result.pname || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>上一周期种植面积：{result.previousPlant && result.previousPlant +'亩' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>上一周期平均产值：{result.previousAvgyield && result.previousAvgyield +'吨/亩' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>下一周期种植面积：{result.nextPlant && result.nextPlant +'亩' || '未录入'}</span>
                                    </Col>					                       	
                                </Row>										           
                            </Card>
                        );								            	
                    })}							            					            						
                </div> : 
                <p className='detail-noInfo'>暂无相关信息</p>
                }
                <Row className="personal-info">
                    <Col span={24} className="title">
                        <span>养殖结构</span>
                    </Col>							                                	
                </Row>
                { businessBreedList && businessBreedList.length ? <div>
                    { businessBreedList.map((result, key) => {
                        if(!result) return;
                        return (
                            <Card key={key} style={{marginBottom: '10px'}}>
                                <Row className="personal-info-content">								            	
                                    <Col span={6} className="subtitle">
                                        <span>牲畜名称：{result.bname || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>数量：{result.btotal && result.btotal +'头' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>年龄：{result.age && result.age +'岁' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>市场价值：{result.marketvalue && result.marketvalue +'元' || '未录入'}</span>
                                    </Col>					                       	
                                </Row>										           
                            </Card>
                        );								            	
                    })}							            					            						
                </div> : 
                <p className='detail-noInfo'>暂无相关信息</p>
                }
            </div>
        )
    }
}

const pureDetailManageFarm = pureRender(DetailManageFarm);

export default pureDetailManageFarm;