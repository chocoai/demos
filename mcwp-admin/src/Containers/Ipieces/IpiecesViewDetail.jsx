import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Link } from 'react-router';
import { Config } from '../../Config/Index';
import {Breadcrumb, message, Row, Col,} from 'antd';
import './style/ipiecesDetail.less';
import IpiecesService from '../../Services/IpiecesService';
import DetailAssetBank from '../../Component/Ipieces/DetailAssetBank'; // 进件详情央行征信信息详情

/**
 * 进件详情查看共同借款人，担保人
 * @Author: 钟观发
 * @Date:   2017-12-11
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-12-11
 */
class IpiecesViewDetail extends Component {
    constructor(props) {
    	super(props);
        this.state = {
            identity: props.routeParams.type,
            reqCode: '',
            creditCentralBankInfo: ''
        };
    }
    componentDidMount() {
        const that = this;
        const { routeParams} = that.props;
        let identity = routeParams.type;
        const params = {
            code: routeParams.code
        };
        // 获取信贷历史信息
        if( identity == 'loan' || identity == 'loans') {
            IpiecesService.getLoanCreditLoan(params, (res) => {
                if (res.code == Config.errorCode.success) {
                    const data = res.data;
                    if (data) {
                        that.setState({
                            creditCentralBankInfo:  data.creditCentralBankInfo,
                            proValueText:  data.proValueText,
                            creditHisCustomer:  data.creditHisCoBorrower,
                            reqCode: data.reqCode
                        });
                    }
                } else {
                    message.error(res.msg);
                }
            })
        }else {
            IpiecesService.getLoanCreditGua(params, (res) => {
                if (res.code == Config.errorCode.success) {
                    const data = res.data;
                    if (data) {
                        that.setState({
                            creditCentralBankInfo:  data.creditCentralBankInfo,
                            proValueText:  data.proValueText,
                            creditHisCustomer:  data.creditHisGuarantor,
                            reqCode: data.reqCode
                        });
                    }
                } else {
                    message.error(res.msg);
                }
            })
        }
    }
    render() {
        const { identity, reqCode, creditCentralBankInfo, proValueText, creditHisCustomer  } = this.state;
        return (
            <div className="ipieces-detail-container">
                <Breadcrumb className='breadcrumb'>
                    <Breadcrumb.Item className='breadcrumb-item'><Link to="/ipieces/operate">进件管理</Link></Breadcrumb.Item>
                    {
                        identity == 'loan' ||  identity == 'guaran' ?
                        <Breadcrumb.Item className='breadcrumb-item'><Link to={"/ipieces/edit/" + reqCode + '/6'}>编辑调查报告</Link></Breadcrumb.Item>
                        : <Breadcrumb.Item className='breadcrumb-item'><Link to={"/ipieces/operate/" + reqCode + '/6'}>查看调查报告</Link></Breadcrumb.Item>
                    }
                    {
                        identity == 'loan' || identity == 'loans' ?
                        <Breadcrumb.Item className='breadcrumb-item'>共同借款人征信信息</Breadcrumb.Item>
                        : null
                    }
                    {
                        identity == 'guaran' || identity == 'guarans' ?
                        <Breadcrumb.Item className='breadcrumb-item'>担保人征信信息</Breadcrumb.Item>
                        : null
                    }
                </Breadcrumb>
                <div className="idetail-content">
                    <div>
                        <Row className="personal-info">
                            <Col span={6} className="title">
                                <span>个人央行征信情况</span>
                            </Col>
                        </Row>
                        <div className="creditList">
                            <div className="title">{proValueText}</div>
                            {
                                creditHisCustomer?
                                    <div>{creditHisCustomer.remark}</div>
                                    :<p className='detail-noInfo'>暂无征信分析情况</p>
                            }
                            <ul>
                                {
                                    creditHisCustomer&&creditHisCustomer.loanCreditTaints?
                                    creditHisCustomer.loanCreditTaints.map((item, index) => (
                                        <li className='credit-list-item' key={index}>{item.remark}</li>
                                    )):null
                                }
                            </ul>
                        </div>
                    </div>
                    <DetailAssetBank creditCentralBankInfo = { creditCentralBankInfo } />
                </div>
            </div>
        )
    }
}

const pureIpiecesViewDetail = pureRender(IpiecesViewDetail);

export default pureIpiecesViewDetail;
