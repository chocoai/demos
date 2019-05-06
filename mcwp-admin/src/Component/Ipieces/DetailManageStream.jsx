import React, { Component } from 'react'; // 引入了React
import { Row, Col, Card } from 'antd';
import pureRender from 'pure-render-decorator';
import moment from 'moment';
import './style/detailOthBusInfo.less';

/**
 * 农贷进件详情上下游信息
 * @Author: 钟观发
 * @Date:   2017-10-11
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-10-11
 */
class DetailManageStream extends Component {
    render() {
        const { loanDownStream, setMethod } = this.props;
        let supplyBusinessList = loanDownStream.supplyBusinessList;            // 主要供货商和服务商
        let salesBusinessList = loanDownStream.salesBusinessList;          // 主要销货商和服务商
        return (
            <div className='detailOthBusInfo-container'>
                <Row className="personal-info">
                    <Col span={24} className="title">
                        <span>主要供货商和服务商</span>
                    </Col>							                                	
                </Row>
                { supplyBusinessList && supplyBusinessList.length ? <div>
                    { supplyBusinessList.map((result, key) => {
                        if(!result) return;
                        return (
                            <Card key={key} style={{marginBottom: '10px'}}>
                                <Row className="personal-info-content">	
                                    <Col span={6} className="subtitle">
                                        <span>主要客户：{result.bname || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>合作年限：{result.startyear ? moment(parseInt(result.startyear.split(',')[0])).format('YYYY-MM-DD') + '到' +  moment(parseInt(result.startyear.split(',')[1])).format('YYYY-MM-DD') : '未录入'}</span>
                                    </Col>	
                                    <Col span={6} className="subtitle">
                                        <span>地点：{result.address || '未录入'}</span>
                                    </Col>		
                                    <Col span={6} className="subtitle">
                                        <span>货物：{result.goods || '未录入'}</span>
                                    </Col>				            	
                                    <Col span={6} className="subtitle">
                                        <span>结算方式：{result.settlementMethod && setMethod && setMethod.filter((item,index)=>(item.ddValue==result.settlementMethod))[0]['ddText'] || '未录入'}</span>
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
                        <span>主要销货商和服务商</span>
                    </Col>							                                	
                </Row>
                { salesBusinessList && salesBusinessList.length ? <div>
                    { salesBusinessList.map((result, key) => {
                        if(!result) return;
                        return (
                            <Card key={key} style={{marginBottom: '10px'}}>
                                <Row className="personal-info-content">	
                                    <Col span={6} className="subtitle">
                                        <span>主要客户：{result.bname || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>合作年限：{result.startyear ? moment(parseInt(result.startyear.split(',')[0])).format('YYYY-MM-DD') + '到' +  moment(parseInt(result.startyear.split(',')[1])).format('YYYY-MM-DD') : '未录入'}</span>
                                    </Col>	
                                    <Col span={6} className="subtitle">
                                        <span>地点：{result.address || '未录入'}</span>
                                    </Col>		
                                    <Col span={6} className="subtitle">
                                        <span>货物：{result.goods || '未录入'}</span>
                                    </Col>				            	
                                    <Col span={6} className="subtitle">
                                        <span>结算方式：{result.settlementMethod && setMethod && setMethod.filter((item,index)=>(item.ddValue==result.settlementMethod))[0]['ddText'] || '未录入'}</span>
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

const pureDetailManageStream = pureRender(DetailManageStream);

export default pureDetailManageStream;