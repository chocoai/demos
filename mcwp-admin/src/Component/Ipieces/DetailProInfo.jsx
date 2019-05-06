import React, { Component } from 'react'; // 引入了React
import { Row, Col, Tooltip } from 'antd';
import pureRender from 'pure-render-decorator';

import './style/detailBusInfo.less';

/**
 * 进件详情职业信息
 * @Author: 钟观发
 * @Date:   2017-12-07
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-12-07
 */
class DetailProInfo extends Component {
    render() {
        const { proInfoData } = this.props;
        // let arr = [ 'verified', 'inconsistent', 'unknown', 'unverified' ]  //0核实匹配1核实不匹配2未知3未核实
        return (
            <div className="detail-businfo-container">
                <Row className="personal-info">
                    <Col span={8} className="title">
                        <span id='bizInfo'>职业信息</span>
                    </Col>
                </Row>
                {
                    proInfoData ?
                        <Row className="personal-info-content" type="flex" justify="start">
                            <Col span={6} className="subtitle">
                                <Tooltip placement="rightTop" title={proInfoData.corpName}>
                                <span className="max-width-name">企业名称：{proInfoData.corpName || '未录入'}</span>
                                </Tooltip>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>联系电话：{proInfoData.telephone || '未录入'}</span>
                            </Col>
                            <Col span={6} className="subtitle">
                                <span>月收入：{proInfoData.salaryMonth && proInfoData.salaryMonth + '元' || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>所属行业：{proInfoData.industryText || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>经营地址：{proInfoData.address || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>主营业务或职务：{proInfoData.mainBusiness || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>收入所得结构：{proInfoData.structOfSalary || '未录入'}</span>
                            </Col>
                            <Col span={12} className="subtitle">
                                <span>备注：{proInfoData.remark || '未录入'}</span>
                            </Col>
                        </Row> :
                        <p className='detail-noInfo'>暂无相关信息</p>
                }
		    </div>
        )
    }
}

const pureDetailProInfo = pureRender(DetailProInfo);

export default pureDetailProInfo;
