import React, { Component } from 'react'; // 引入了React
import { Row, Col } from 'antd';
import pureRender from 'pure-render-decorator';
import moment from 'moment';
import { Config } from '../../Config/Index';

/**
 * 进件详情资产信息
 * @Author: 魏昌华
 * @Date:   2017-06-26
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-31
 */
class DetailAssetHouse extends Component {
    render() {
        const { assetsData, pictureInfo, showPicture, type } = this.props;
        let loanAssetHouse = assetsData.loanAssetHouses; // 房产信息
        let loanAssetCar  = assetsData.loanAssetCars; // 车辆信息 
        let loanAssetMachines  = assetsData.loanAssetMachines; // 其他设备
        return (
            <div>
                <Row className="personal-info">
                    <Col span={4} className="title">
                        <span>房产信息</span>
                    </Col>
                    <Col span={20}>	
                        {
                            pictureInfo && pictureInfo[Config.bizType.loanHouse] && pictureInfo[Config.bizType.loanHouse].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanHouse)}>查看文件</span> : ''
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
                                    <Col span={6} className="subtitle">
                                        <span>购买时间：{result.buyDate ?  moment(parseInt(result.buyDate)).format('YYYY-MM-DD') : '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>价格：{result.houseTotal && result.houseTotal + '万元' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>面积：{result.houseSize && result.houseSize + '平' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>是否按揭：{result.isMortgage ? '是' : '否'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>按揭金额：{result.mortgageTotal && result.mortgageTotal + '万元' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>家庭住址是否自有房产：{result.isowner && result.isowner ?  result.isowner == 0 ? '否' : '是' : '未录入'}</span>
                                    </Col>
                                    {
                                        type == '6' ?
                                        <Col span={12} className="subtitle">
                                            <span>省市区：{result.provinceRegionText || '未录入'}</span>
                                        </Col> : null
                                    }	
                                    <Col span={12} className="subtitle">
                                        <span>房屋地址：{result.address || '未录入'}</span>
                                    </Col>	  
                                    <Col span={12} className="subtitle">
                                        <span>备注信息：{result.remark || '未录入'}</span>
                                    </Col>           	
                                </Row>							            		
                            </div>
                        );							            	
                    })}							            
                </div> : <p className='detail-noInfo'>暂无相关信息</p>
                }
                {
                    type != '8' ?
                    <div>
                        <Row className="personal-info">
                            <Col span={4} className="title">
                                <span>车辆信息</span>
                            </Col>
                            <Col span={20}>
                                {
                                    pictureInfo && pictureInfo[Config.bizType.loanCar] && pictureInfo[Config.bizType.loanCar].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanCar)}>查看文件</span> : ''
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
                                    <div key={key}>
                                        <Row className="personal-info-content">
                                            <Col span={6} className="subtitle">
                                                <span>购买时间：{result.buyDate ? moment(parseInt(result.buyDate)).format('YYYY-MM-DD') : '未录入'}</span>
                                            </Col>
                                            <Col span={6} className="subtitle">
                                                <span>价格：{result.carTotal && result.carTotal + '万元' || '未录入'}</span>
                                            </Col>
                                            <Col span={6} className="subtitle">
                                                <span>车辆状况：{result.vehicleCondition || '未录入'}</span>
                                            </Col>
                                            <Col span={6} className="subtitle">
                                                <span>品牌：{result.brand || '未录入'}</span>
                                            </Col>
                                            <Col span={6} className="subtitle">
                                                <span>车牌：{result.plateNumber || '未录入'}</span>
                                            </Col>
                                            <Col span={6} className="subtitle">
                                                <span>车架号：{result.vinNo || '未录入'}</span>
                                            </Col>
                                            <Col span={6} className="subtitle">
                                                <span>是否按揭：{result.isMortgage ? '是' : '否'}</span>
                                            </Col>
                                            <Col span={6} className="subtitle">
                                                <span>按揭金额：{result.mortgageTotal && result.mortgageTotal + '万元' || '未录入'}</span>
                                            </Col>
                                            <Col span={6} className="subtitle">
                                                <span>是否属于公司：{result.isCompany ? '是' : '否'}</span>
                                            </Col>  
                                            <Col span={18} className="subtitle">
                                                <span>备注信息：{result.remark && result.remark + '万元' || '未录入'}</span>
                                            </Col>	            	
                                        </Row>						            			
                                    </div>							            		
                                );
                            })}							            
                        </div> : <p className='detail-noInfo'>暂无相关信息</p>
                        }
                            <Row className="personal-info">
                                <Col span={4} className="title">
                                    <span>机器设备</span>
                                </Col>
                                <Col span={20}>
                                    {
                                        pictureInfo && pictureInfo[Config.bizType.loanMachine] && pictureInfo[Config.bizType.loanMachine].length ? <span className="button" onClick={()=>showPicture(Config.bizType.loanMachine)}>查看文件</span> : ''
                                    }							                    				               
                                </Col> 	  						              	            	
                            </Row>
                            {
                                loanAssetMachines&&loanAssetMachines.length ? <div>
                                {loanAssetMachines.map((result,key) => {
                                    if(!result){
                                        return;
                                    }
                                    return (
                                        <div key={key}>
                                            <Row className="personal-info-content">
                                                <Col span={6} className="subtitle">
                                                    <span>名称：{result.name || '未录入'}</span>
                                                </Col>
                                                <Col span={6} className="subtitle">
                                                    <span>购买时间：{result.buyDate ? moment(parseInt(result.buyDate)).format('YYYY-MM-DD') : '未录入'}</span>
                                                </Col>
                                                <Col span={6} className="subtitle">
                                                    <span>金额：{result.balance && result.balance + '万元' || '未录入'}</span>
                                                </Col>	            	
                                            </Row>						            			
                                        </div>							            		
                                    );
                                })}							            
                            </div> : <p className='detail-noInfo'>暂无相关信息</p>
                            } 
                    </div> : null
                }
			</div>	
        )
    }
}

const pureDetailAssetHouse = pureRender(DetailAssetHouse);

export default pureDetailAssetHouse;