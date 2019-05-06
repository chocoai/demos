import React, { Component } from 'react'; // 引入了React
import { Row, Col, Card } from 'antd';
import pureRender from 'pure-render-decorator';
// import moment from 'moment';

/**
 * 进件详情资产信息
 * @Author: 赵俊
 * @Date:   2017-06-29
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-03
 */
class DetailNetAsset extends Component {
    render() {
        const { baseAssetInfo, pictureInfo, showPicture } = this.props;
        let loanAssetHouse =  baseAssetInfo.loanAssetHouses; // 房产信息
        let loanAssetCar  = baseAssetInfo.loanAssetCars; // 车辆信息 
        // let loanAssetMachines  = baseAssetInfo.loanAssetMachines; // 其他设备        
        return (
            <div>
                <Row className="personal-info">
                    <Col span={4} className="title">
                        <span>房产信息</span>
                    </Col>
                    <Col span={20}>	
                        {
                            pictureInfo&&pictureInfo['LOAN_HOUSE'] ? <span className="button" onClick={()=>showPicture('LOAN_HOUSE')}>照片信息</span> : ''
                        }		                    				                 
                    </Col> 	            	
                </Row>
				{
					loanAssetHouse&&loanAssetHouse.length ? <div>
                    {loanAssetHouse.map((result,key) => {
                        if(!result){
                            return;
                        }
                        return (
                            <div key={key}>
                                <Row className="personal-info-content">
                                    <Col span={6} className="title">
                                        <span>房屋面积：{result.houseSize && result.houseSize + '平' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="title">
                                        <span>房屋地址：{result.address || '未录入'}</span>
                                    </Col>
                                </Row>
                                <Row className="personal-info-content">
                                    <Col span={6} className="title">
                                        <span>房屋估值：{result.houseTotal  && result.houseTotal + '万元 ' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="title">
                                        <span>最高可贷额度：{result.topLoanAmount && result.topLoanAmount + '万元' || '未录入'}</span>
                                    </Col>	      	
                                </Row>						            		
                            </div>
                        );							            	
                    })}							            
                </div> : <p className='detail-noInfo'>暂无相关信息</p>
				}
                <Row className="personal-info">
                    <Col span={4} className="title">
                        <span>车辆信息</span>
                    </Col>
                    <Col span={20}>
                        {
                            pictureInfo&&pictureInfo['LOAN_CAR'] ? <span className="button" onClick={()=>showPicture('LOAN_CAR')}>照片信息</span> : ''
                        }						                    				               
                    </Col> 	  						              	            	
                </Row>
				{
					loanAssetCar&&loanAssetCar.length ? <div>
                    {loanAssetCar.map((result,key) => {
                        if(!result){
                            return;
                        }
                        return (
                            <Card key={key} style={{marginBottom: '10px'}}>
                                <Row className="personal-info-content">
                                    <Col span={6} className="title">
                                        <span>车辆品牌：{result.brand || '未录入'}</span>
                                    </Col>	            	
                                    <Col span={6} className="title">
                                        <span>车辆款型：{result.carModel || '未录入'}</span>
                                    </Col>
                                </Row>						            			
                            </Card>							            		
                        );
                    })}							            
                </div> : <p className='detail-noInfo'>暂无相关信息</p>
                }
			</div>	
        )
    }
}

const pureDetailNetAsset = pureRender(DetailNetAsset);

export default pureDetailNetAsset;