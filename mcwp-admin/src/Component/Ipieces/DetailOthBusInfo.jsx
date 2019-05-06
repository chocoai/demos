import React, { Component } from 'react'; // 引入了React
import { Row, Col, Card } from 'antd';
import pureRender from 'pure-render-decorator';
import moment from 'moment';

import './style/detailOthBusInfo.less';

/**
 * 进件详情其他经营信息
 * @Author: 魏昌华
 * @Date:   2017-06-26
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-05
 */
class DetailOthBusInfo extends Component {
    render() {
        const { businessOtherData } = this.props;
        let loanBusinessOth = businessOtherData.loanBusinessOth;            // 其他经营信息
        // let loanBusinessContacts = businessOtherData.loanBusinessContacts;  // 主要供应商和客户
        let loanBusinessSuppliers = businessOtherData.loanBusinessSuppliers;  // 主要供应商
        let loanBusinessCustomers = businessOtherData.loanBusinessCustomers;  // 主要客户
        let loanBusinessYearFins = businessOtherData.loanBusinessYearFins;  // 投资与开支情况
        return (
            <div className='detailOthBusInfo-container'>
                <Row className="personal-info">
                    <Col span={24} className="title">
                        <span>其他经营信息</span>
                    </Col>
                </Row>
                {/* {
                    loanBusinessOth ?  */}
                <div className="personal-info-content">
                    <p className="subtitle">经营历史与资本积累：</p>
                    <p className="other-text">{loanBusinessOth && loanBusinessOth.busiMarket || '未录入'}</p>
                    <p className="subtitle">对经营者组织和市场情况现状的评价：</p>
                    <p className="other-text">{loanBusinessOth && loanBusinessOth.hisAccrue || '未录入'}</p>
                    <p className="subtitle">对财务信息现状的评价：</p>
                    <p className="other-text">{loanBusinessOth && loanBusinessOth.financialInformation || '未录入'}</p>
                </div>
                {/* :
                        <p className='detail-noInfo'>暂无相关信息</p>
                } */}
                <Row className="personal-info">
                    <Col span={24} className="title">
                        <span>主要供应商和客户</span>
                    </Col>
                </Row>
                {loanBusinessSuppliers && loanBusinessSuppliers.length ? <div>
                    {loanBusinessSuppliers.map((result, key) => {
                        if (!result) return;
                        let ctype = result.ctype;  // 联系类型:1.供应商,2.往来客户
                        return (
                            <Card key={key} style={{ marginBottom: '10px' }}>
                                <Row className="personal-info-content">
                                    <Col span={6} className="subtitle">
                                        <span>{ctype == 1 ? '主要供应商：' : '主要客户：'}{result.cname || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>{ctype == 1 ? '采购比例：' : '销售比例：'}{result.weigthRate && result.weigthRate + '%' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>付款条件：{result.payTerm || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>往来时间：{result.payDate ? moment(parseInt(result.payDate.split(',')[0])).format('YYYY-MM-DD') + '到' + moment(parseInt(result.payDate.split(',')[1])).format('YYYY-MM-DD') : '未录入'}</span>
                                    </Col>
                                </Row>
                            </Card>
                        );
                    })}
                </div> :
                    <p className='detail-noInfo'>暂无相关信息</p>
                }
                {loanBusinessCustomers && loanBusinessCustomers.length ? <div>
                    {loanBusinessCustomers.map((result, key) => {
                        if (!result) return;
                        let ctype = result.ctype;  // 联系类型:1.供应商,2.往来客户
                        return (
                            <Card key={key} style={{ marginBottom: '10px' }} key={key}>
                                <Row className="personal-info-content">
                                    <Col span={6} className="subtitle">
                                        <span>{ctype == 1 ? '主要供应商：' : '主要客户：'}{result.cname || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>{ctype == 1 ? '采购比例：' : '销售比例：'}{result.weigthRate && result.weigthRate + '%' || '未录入'}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>付款条件：{result.payTerm}</span>
                                    </Col>
                                    <Col span={6} className="subtitle">
                                        <span>往来时间：{result.payDate ? moment(parseInt(result.payDate.split(',')[0])).format('YYYY-MM-DD') + '到' + moment(parseInt(result.payDate.split(',')[1])).format('YYYY-MM-DD') : '未录入'}</span>
                                    </Col>
                                </Row>
                            </Card>
                        );
                    })}
                </div> : ''}
                <Row className="personal-info">
                    <Col span={24} className="title">
                        <span>投资与开支情况</span>
                    </Col>
                </Row>
                {loanBusinessYearFins && loanBusinessYearFins.length ? <div>
                    {loanBusinessYearFins.map((result, key) => {
                        if (!result) return;
                        let title = '';
                        let ftype = result.ftype; // ftype. 1.投资,2.支出,3.计划投资,4.计划支出
                        if (ftype == 1) {
                            title = '过去12个月的投资';
                        } else if (ftype == 2) {
                            title = '过去12个月的支出';
                        } else if (ftype == 3) {
                            title = '未来12个月计划的投资';
                        } else if (ftype == 4) {
                            title = '未来12个月计划的支出';
                        }
                        return (
                            <Card key={key} style={{ marginBottom: '10px' }}>
                                <Row className="personal-info-content">
                                    <Col span={24} className="title">
                                        <span>{title}</span>
                                    </Col>
                                </Row>
                                <Row className="personal-info-content">
                                    <Col span={12} className="title">
                                        <span>业务方面：{result.business || '未录入'}</span>
                                    </Col>
                                    <Col span={12} className="title">
                                        <span>私人方面：{result.person || '未录入'}</span>
                                    </Col>
                                </Row>
                            </Card>
                        );
                    })}
                </div> :
                    <div>
                        {['过去12个月的投资','过去12个月的支出','未来12个月计划的投资','未来12个月计划的支出'].map((result, key) => {
                            return (
                                <Card key={key} style={{ marginBottom: '10px' }}>
                                    <Row className="personal-info-content">
                                        <Col span={24} className="title">
                                            <span>{result}</span>
                                        </Col>
                                    </Row>
                                    <Row className="personal-info-content">
                                        <Col span={12} className="title">
                                            <span>业务方面：未录入</span>
                                        </Col>
                                        <Col span={12} className="title">
                                            <span>私人方面：未录入</span>
                                        </Col>
                                    </Row>
                                </Card>
                            );
                        })}
                    </div>
                    // <p className='detail-noInfo'>暂无相关信息</p>
                }
            </div>
        )
    }
}

const pureDetailOthBusInfo = pureRender(DetailOthBusInfo);

export default pureDetailOthBusInfo;
