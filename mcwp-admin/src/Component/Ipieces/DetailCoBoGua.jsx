import React, { Component } from 'react'; // 引入了React
import { Row, Col } from 'antd';
import { browserHistory } from 'react-router';
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/detailCoBoGua.less';
import CommonDetail from './CommonDetail';

/**
 * 进件详情共同借款人及担保人信息
 * @Author: 魏昌华
 * @Date:   2017-06-26
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-05
 */
class DetailCoBoGua extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // preview: false,
        }
    }
    // 查看征信信息
    viewVerify = (code, type) => {
        if (type == 'loan') {
            browserHistory.push('/ipieces/view/detail/loans/' + code);
        } else {
            browserHistory.push('/ipieces/view/detail/guarans/' + code);
        }
    }
    showExplainModal = (e,item) => {
        let newObject = item.creditQueryResult
        newObject.auditStatusText = '征信审核通过'
        this.props.showExplainModal(newObject)
    }
    render() {
        const { loanGuaranteeData, showPicture, pictureInfo, type } = this.props;
        const { moduleName, fieldConfigMerge: fieldConfig, loanCoBorrower, loanGuarantee, moduleConfig} = loanGuaranteeData
        // let arr = [ 'verified', 'inconsistent', 'unknown', 'unverified' ]  //0核实匹配1核实不匹配2未知3未核实
        let tmpImg = {}
        let tmpVerify = {}
        let content = {
            coBorrowerInfo: moduleName.coBorrowerInfo ?
                loanCoBorrower && loanCoBorrower.length && !Config.isNull(loanGuaranteeData.fieldConfig.coBorrowerInfo) ?
                    loanCoBorrower.map((item, index) => (
                        <div key={index}>
                            <Row className="personal-info">
                                <Col span={4} className="title">
                                    <span id='guarantor'>{moduleName.coBorrowerInfo}{index + 1}</span>
                                </Col>
                                <Col span={20}>
                                    {pictureInfo && pictureInfo[Config.bizType.loanCoborrower] && pictureInfo[Config.bizType.loanCoborrower].length ? <span className="button" onClick={() => showPicture(Config.bizType.loanCoborrower)}>查看文件</span> : ''}
                                    {
                                        type == '6' ?
                                            <span className='button' onClick={() => this.viewVerify(item.code, 'loan')}>查看征信详情</span> : null
                                    }
                                    {
                                        item.coBorrowerCode ?
                                            <span className='button' onClick={() => showPicture('LOAN_COBORROWER_CREDIT', item.coBorrowerCode)}>征信报告</span> :
                                            null
                                    }
                                </Col>
                            </Row>
                            {
                                type == '6' ?
                                    <div className='mode-list'>
                                        <p className='ipieces-subtitle personal-info'>核身模型验证结果</p>
                                        {
                                            item.identityResult ?
                                                item.identityResult.idNameCheckResult && item.identityResult.idPhoneCheckResult ?
                                                    <div>
                                                        <p className="verify-p">身份证与姓名是否一致：{item.identityResult.idNameCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                                        <p className="verify-p">手机号是否实名认证：{item.identityResult.idNameCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                                    </div>
                                                    : <p className="verify-p">拒绝原因：{item.identityResult.message ? <span className="verify-false">{item.identityResult.message}</span> : null}</p>
                                                : <p className="verify-p">核身模型暂未验证</p>
                                        }
                                    </div> : null
                            }
                            {
                                type == '6' ?
                                    <div className='mode-list'>
                                        <p className='ipieces-subtitle personal-info'>征信模型验证结果</p>
                                        {
                                            item.creditQueryResult ?
                                                <div>
                                                    {
                                                        item.creditQueryResult.pbocScore ?
                                                            <p className="verify-p">央行授信评分：{item.creditQueryResult.pbocScore ? <span className="verify-true">{item.creditQueryResult.pbocScore}<span>({item.creditQueryResult.pbocScore < 490 ? '征信较差' : 490 < item.creditQueryResult.pbocScore && item.creditQueryResult.pbocScore < 510 ? '征信一般' : 510 < item.creditQueryResult.pbocScore && item.creditQueryResult.pbocScore < 530 ? '征信良好' : '征信优秀'})</span>
                                                            </span> : null}<span className="score-explain" onClick={(e)=>this.showExplainModal(e,item)}>评分说明</span></p>
                                                            : <p className="verify-p">拒绝原因：{item.creditQueryResult.message ? <span className="verify-false">{item.creditQueryResult.message}</span> : null}</p>
                                                    }
                                                </div>
                                                : <p className="verify-p">征信模型暂未验证</p>
                                        }
                                    </div> : null
                            }

                            {
                                item ?
                                    <CommonDetail moduleType='coBorrowerInfo' fieldConfig={fieldConfig} detailData={item} tmpImg={tmpImg} tmpVerify={tmpVerify} />
                                    : <p className='detail-noInfo'>暂无相关信息</p>
                            }
                        </div>)) :
                    <div>
                        <Row className="personal-info">
                            <Col span={4} className="title">
                                <span>{moduleName.coBorrowerInfo}</span>
                            </Col>
                            <Col span={20}>
                                {pictureInfo && pictureInfo[Config.bizType.loanCoborrower] && pictureInfo[Config.bizType.loanCoborrower].length ? <span className="button" onClick={() => showPicture(Config.bizType.loanCoborrower)}>查看文件</span> : ''}
                            </Col>
                        </Row>
                        <p className='detail-noInfo'>暂无相关信息</p>
                    </div> :
                null,
            guarantorInfo: moduleName.guarantorInfo ?
                loanGuarantee && loanGuarantee.length && !Config.isNull(loanGuaranteeData.fieldConfig.guarantorInfo) ?
                    loanGuarantee.map((item, index) => (
                        <div key={index}>
                            <Row className="personal-info">
                                <Col span={4} className="title">
                                    <span id='guarantor'>{moduleName.guarantorInfo}{index + 1}</span>
                                </Col>
                                <Col span={20}>
                                    {pictureInfo && pictureInfo[Config.bizType.loanGuarantee] && pictureInfo[Config.bizType.loanGuarantee].length ? <span className="button" onClick={() => showPicture(Config.bizType.loanGuarantee)}>查看文件</span> : ''}
                                    {
                                        type == '6' ?
                                            <span className='button' onClick={() => this.viewVerify(item.code, 'guaran')}>查看征信详情</span> : null
                                    }
                                    {
                                        item.guarantorCode ?
                                            <span className='button' onClick={() => showPicture('LOAN_GUARANTEE_CREDIT', item.guarantorCode)}>征信报告</span> :
                                            null
                                    }
                                </Col>
                            </Row>
                            {
                                type == '6' ?
                                    <div className='mode-list'>
                                        <p className='ipieces-subtitle personal-info'>核身模型验证结果</p>
                                        {
                                            item.identityResult ?
                                                item.identityResult.idNameCheckResult && item.identityResult.idPhoneCheckResult ?
                                                    <div>
                                                        <p className="verify-p">身份证与姓名是否一致：{item.identityResult.idNameCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                                        <p className="verify-p">手机号是否实名认证：{item.identityResult.idPhoneCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                                    </div>
                                                    : <p className="verify-p">拒绝原因：{item.identityResult.message ? <span className="verify-false">{item.identityResult.message}</span> : null}</p>
                                                : <p className="verify-p">核身模型暂未验证</p>
                                        }
                                    </div> : null
                            }
                            {
                                type == '6' ?
                                    <div className='mode-list'>
                                        <p className='ipieces-subtitle personal-info'>征信模型验证结果</p>
                                        {
                                            item.creditQueryResult ?
                                                <div>
                                                    {
                                                        item.creditQueryResult.pbocScore ?
                                                            <p className="verify-p">央行授信评分：{item.creditQueryResult.pbocScore ? <span className="verify-true">{item.creditQueryResult.pbocScore}<span>({item.creditQueryResult.pbocScore < 490 ? '征信较差' : 490 <= item.creditQueryResult.pbocScore && item.creditQueryResult.pbocScore < 510 ? '征信一般' : 510 <= item.creditQueryResult.pbocScore && item.creditQueryResult.pbocScore < 530 ? '征信良好' : '征信优秀'})</span>
                                                            </span> : null} <span className="score-explain" onClick={(e)=>this.showExplainModal(e,item)}>评分说明</span></p>
                                                            : <p className="verify-p">拒绝原因：{item.creditQueryResult.message ? <span className="verify-false">{item.creditQueryResult.message}</span> : null}</p>
                                                    }
                                                </div>
                                                : <p className="verify-p">征信模型暂未验证</p>
                                        }
                                    </div> : null
                            }
                            {
                                item ?
                                    <CommonDetail moduleType='guarantorInfo' fieldConfig={fieldConfig} detailData={item} tmpImg={tmpImg} tmpVerify={tmpVerify} />
                                    : <p className='detail-noInfo'>暂无相关信息</p>
                            }
                        </div>)) :
                    <div>
                        <Row className="personal-info">
                            <Col span={4} className="title">
                                <span>{moduleName.guarantorInfo}</span>
                            </Col>
                            <Col span={20}>
                                {pictureInfo && pictureInfo[Config.bizType.loanGuarantee] && pictureInfo[Config.bizType.loanGuarantee].length ? <span className="button" onClick={() => showPicture(Config.bizType.loanGuarantee)}>查看文件</span> : ''}
                            </Col>
                        </Row>
                        <p className='detail-noInfo'>暂无相关信息</p>
                    </div> :
                null
        }
        return (
            <div id='coborrower' className="coborrower-detail">
                {
                    moduleConfig.sort((i1, i2) => i1.position - i2.position).map(i => <div key={i.formEnName}>{content[i.formEnName]}</div>)
                }
            </div>
        )
    }
}

const pureDetailCoBoGua = pureRender(DetailCoBoGua);

export default pureDetailCoBoGua;
