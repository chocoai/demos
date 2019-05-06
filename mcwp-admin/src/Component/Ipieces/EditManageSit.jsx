import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { message } from 'antd';
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import CarouselImg from './CarouselImg';
import './style/editManageSit.less';

import { Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑经营基本情况经营情况
 * @Author: 赵俊
 * @Date:   2017-05-31 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-05-31
 */
class EditManageSit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            costWordCount: props.loanBusinessInfo && props.loanBusinessInfo.costStructureOther ? props.loanBusinessInfo.costStructureOther.length : 0,
            otherWordCount: props.loanBusinessInfo && props.loanBusinessInfo.otherIncome ? props.loanBusinessInfo.otherIncome.length : 0
        }
    }

    componentWillMount() {
    }

    textareaChange(e, type) {
        if (e.target.value.length > 100) {
            e.target.value = e.target.value.substr(0, 100);
            return;
        }
        this.setState({
            [type]: e.target.value.length
        })
    }

    getPictureBusBaseInfo = () => {  // 经营情况查看文件
        let code = this.props.code;
        Config.get('/v1/oss/' + code + '/LOAN_BUSIINFO/*', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                if (res.data && res.data.LOAN_BUSIINFO && res.data.LOAN_BUSIINFO.length) {
                    this.setState({
                        pictureInfo: res.data.LOAN_BUSIINFO,
                        preview: true
                    });
                } else {
                    message.error(Config.warnInfo.uploadImg);
                }
            } else {
                message.error(res.msg);
            }
        });
    }
    previewHide = () => {
        this.setState({
            preview: false,
            pictureInfo: ''
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 16 }
        };
        const formLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        };
        const { loanBusinessInfo, openUploadImg, type } = this.props;
        const { pictureInfo } = this.state
        return (
            <div className='editManageSit-container'>
                <Form>
                    <p className='ipieces-subtitle'>经营情况
                    <span className='ipieces-subtitle-attachment' onClick={this.getPictureBusBaseInfo}>查看文件</span>
                        <span className='ipieces-subtitle-attachment' onClick={() => openUploadImg(Config.bizType.loanBusiInfo)}>添加文件</span>
                    </p>
                    <Row>
                        <Col span={6}>
                            <FormItem label="月销售额" {...formItemLayout}>
                                {/*{getFieldDecorator('loanBusinessEntityInfoDto.monthlySale', {
                            rules: [{ required: false, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                        })(*/}
                                <p>{loanBusinessInfo && loanBusinessInfo.monthlySale && loanBusinessInfo.monthlySale + '元' || '未录入'}</p>
                                {/*)}*/}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="负债" {...formItemLayout}>
                                {/*{getFieldDecorator('loanBusinessEntityInfoDto.liabilities', {
                        rules: [{ required: false, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                    })(*/}
                                <p>{loanBusinessInfo && loanBusinessInfo.liabilities && loanBusinessInfo.liabilities + '元' || '未录入'}</p>
                                {/*)}*/}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="存货" {...formItemLayout}>
                                {/*{getFieldDecorator('loanBusinessEntityInfoDto.stock', {
                            rules: [{ required: false, message: '' }],
                        })(*/}
                                <p>{loanBusinessInfo && loanBusinessInfo.stock && loanBusinessInfo.stock + '元' || '未录入'}</p>
                                {/*)}*/}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="应收账款" {...formItemLayout}>
                                {/*{getFieldDecorator('loanBusinessEntityInfoDto.accountsReceivable', {
                            rules: [{ required: false, message: '' }],
                        })(*/}
                                <p>{loanBusinessInfo && loanBusinessInfo.accountsReceivable && loanBusinessInfo.accountsReceivable + '元' || '未录入'}</p>
                                {/*)}*/}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="月毛利润" {...formItemLayout}>
                                {/*{getFieldDecorator('loanBusinessEntityInfoDto.grossMargin', {
                            rules: [{ required: false, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                        })(*/}
                                <p>{loanBusinessInfo && loanBusinessInfo.grossMargin && loanBusinessInfo.grossMargin + '元' || '未录入'}</p>
                                {/*)}*/}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                           <FormItem label="月净利润" {...formItemLayout}>
                                    {/*{getFieldDecorator('loanBusinessEntityInfoDto.netProfit', {
                            rules: [{ required: false, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                        })(*/}
                                    <p>{loanBusinessInfo && loanBusinessInfo.netProfit && loanBusinessInfo.netProfit + '元' || '未录入'}</p>
                                    {/*)}*/}
                                </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="总资产" {...formItemLayout}>
                                    {/*{getFieldDecorator('loanBusinessEntityInfoDto.totalAssets', {
                            rules: [{ required: false,  message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                        })(*/}
                                    <p>{loanBusinessInfo && loanBusinessInfo.totalAssets && loanBusinessInfo.totalAssets + '元' || '未录入'}</p>
                                    {/*)}*/}
                                </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="旺季" {...formLayout}>
                                {getFieldDecorator('loanBusinessEntityInfoDto.busySeason', {
                                    initialValue: loanBusinessInfo && loanBusinessInfo.busySeason,
                                    rules: [{ required: true, message: Validate.warnInfo.wordLen10, validator: Validate.checkWordLen10 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="月" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="淡季" {...formLayout}>
                                {getFieldDecorator('loanBusinessEntityInfoDto.slackSeason', {
                                    initialValue: loanBusinessInfo && loanBusinessInfo.slackSeason,
                                    rules: [{ required: true, message: Validate.warnInfo.wordLen10, validator: Validate.checkWordLen10 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="月" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="经营月数" {...formLayout}>
                                {getFieldDecorator('loanBusinessEntityInfoDto.operateMonth', {
                                    initialValue: loanBusinessInfo && loanBusinessInfo.operateMonth,
                                    rules: [{ required: true, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="月" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="期间内资本注入" {...formLayout}>
                                {getFieldDecorator('loanBusinessEntityInfoDto.capitalInjection', {
                                    initialValue: loanBusinessInfo && loanBusinessInfo.capitalInjection,
                                    rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="期间内提取的资金" {...formLayout}>
                                {getFieldDecorator('loanBusinessEntityInfoDto.fundsExtracted', {
                                    initialValue: loanBusinessInfo && loanBusinessInfo.fundsExtracted,
                                    rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="月可支配金额" {...formLayout}>
                                {getFieldDecorator('loanBusinessEntityInfoDto.disposable', {
                                    initialValue: loanBusinessInfo && loanBusinessInfo.disposable,
                                    rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="成本结构及其他" {...formLayout}>
                                <div className="descript-item">
                                    {getFieldDecorator('loanBusinessEntityInfoDto.costStructureOther', {
                                        initialValue: loanBusinessInfo && loanBusinessInfo.costStructureOther || '',
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <textarea className="des-content" autoComplete="off" placeholder="请输入" onChange={(e) => this.textareaChange(e, 'costWordCount')}></textarea>
                                    )}
                                    <p className="des-count">{this.state.costWordCount}/100</p>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="其他收入" {...formLayout}>
                                <div className="descript-item">
                                    {getFieldDecorator('loanBusinessEntityInfoDto.otherIncome', {
                                        initialValue: loanBusinessInfo && loanBusinessInfo.otherIncome || '',
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <textarea className="des-content" autoComplete="off" placeholder="请输入" onChange={(e) => this.textareaChange(e, 'otherWordCount')}></textarea>
                                    )}
                                    <p className="des-count">{this.state.otherWordCount}/100</p>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <CarouselImg pictureInfo={pictureInfo} previewPic={this.state.preview} previewHide={this.previewHide} />
            </div>
        )
    }
}

const pureEditManageSit = pureRender(EditManageSit);

export default pureEditManageSit;