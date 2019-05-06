import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import {  Input, Form, Select, Row, Col } from 'antd';
import imgPicture from '../../Assets/Images/img_picture.png';
import './style/marketShareRule.less';
const Option = Select.Option;
const FormItem = Form.Item;

class MarketShareR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            itemArr: [0],
            selfRewardConfigDTO: {},//个人奖励设置
            merchantRewardConfigDTO: {},//商家奖励设置
            productItem: [],//产品列表
        }
    }
    componentDidMount() {
        
    }
    render() {
        const that = this;
        const { productItem, selfRewardConfigDTO, merchantRewardConfigDTO,activityImg,description } = this.props;
        const { getFieldDecorator } = that.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 17 }
        };
        const formItemLayoutBo = {
            labelCol: { span: 9 },
            wrapperCol: { span: 14 }
        };
        const formItemLayoutPrce = {
            labelCol: { span: 8 },
            wrapperCol: { span: 9 }
        };
        const formItemLayoutPro = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 }
        };
        let loanSelf = null;
        let checkSelf = null;
        let checkMerchant = null;
        let loanMerchant = null;
        if (selfRewardConfigDTO) {
            if (selfRewardConfigDTO.rewardLoanType == '1') {
                loanSelf = <FormItem label='借款金额的' {...formItemLayoutPrce}>
                    {getFieldDecorator('activityShareRewardConfigDTOS[0].loanConfig', {
                        initialValue: selfRewardConfigDTO && selfRewardConfigDTO.loanConfig,
                        rules: [{ required: true, message: '输入项不能为空' }, { validator: Validate.checkNumRangeOne, message: '请输入0.1到100的数' }],
                    })(
                        <Input autoComplete="off" placeholder="请输入" addonAfter="%" />
                    )}
                </FormItem>
            } else if (selfRewardConfigDTO.rewardLoanType == '2') {
                loanSelf = <FormItem {...formItemLayout}>
                    {getFieldDecorator('activityShareRewardConfigDTOS[0].loanFixed', {
                        initialValue: selfRewardConfigDTO && selfRewardConfigDTO.loanFixed,
                        rules: [{ required: true, message: '输入项不能为空' }, { validator: Validate.checkNumTypeNum1, message: '请输入正整数' }],
                    })(
                        <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                    )}
                </FormItem>
            } else {
                loanSelf = null
            }

            if (selfRewardConfigDTO.rewardAuditType == '2') {
                checkSelf = <FormItem {...formItemLayout}>
                    {getFieldDecorator('activityShareRewardConfigDTOS[0].auditFixed', {
                        initialValue: selfRewardConfigDTO && selfRewardConfigDTO.auditFixed,
                        rules: [{ required: true, message: '输入项不能为空' }, { validator: Validate.checkNumTypeNum1, message: '请输入正整数' }],
                    })(
                        <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                    )}
                </FormItem>
            } else {
                checkSelf = null;
            }
        }
        if (merchantRewardConfigDTO) {
            if (merchantRewardConfigDTO.rewardLoanType == '1') {
                loanMerchant = <FormItem label='借款金额的' {...formItemLayoutPrce}>
                    {getFieldDecorator('activityShareRewardConfigDTOS[1].loanConfig', {
                        initialValue: merchantRewardConfigDTO && merchantRewardConfigDTO.loanConfig,
                        rules: [{ required: true, message: '输入项不能为空' }, { validator: Validate.checkNumRangeOne, message: '请输入0.1到100的数' }],
                    })(
                        <Input autoComplete="off" placeholder="请输入" addonAfter="%" />
                    )}
                </FormItem>
            } else if (merchantRewardConfigDTO.rewardLoanType == '2') {
                loanMerchant = <FormItem {...formItemLayout}>
                    {getFieldDecorator('activityShareRewardConfigDTOS[1].loanFixed', {
                        initialValue: merchantRewardConfigDTO && merchantRewardConfigDTO.loanFixed,
                        rules: [{ required: true, message: '输入项不能为空' }, { validator: Validate.checkNumTypeNum1, message: '请输入正整数' }],
                    })(
                        <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                    )}
                </FormItem>
            } else {
                loanMerchant = null
            }

            if (merchantRewardConfigDTO.rewardAuditType == '2') {
                checkMerchant = <FormItem {...formItemLayout}>
                    {getFieldDecorator('activityShareRewardConfigDTOS[1].auditFixed', {
                        initialValue: merchantRewardConfigDTO && merchantRewardConfigDTO.auditFixed,
                        rules: [{ required: true, message: '输入项不能为空' }, { validator: Validate.checkNumTypeNum1, message: '请输入正整数' }],
                    })(
                        <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                    )}
                </FormItem>
            } else {
                checkMerchant = null;
            }
        }
        return (
                            <Form>
                                <div className="shareBox">
                                    <div className="shareBox-title">
                                        <p className="shareBox-p">个人奖励设置</p>
                                    </div>
                                    <Row className='size'>
                                        <Col span={12}>
                                            <Col span={13}>
                                                <FormItem label="注册" {...formItemLayoutBo}>
                                                    {getFieldDecorator('activityShareRewardConfigDTOS[0].registerSwitch', {
                                                        initialValue: selfRewardConfigDTO && selfRewardConfigDTO.registerSwitch || '0',
                                                        rules: [{ required: true, message: '请选择' }],
                                                    })(
                                                        <Select
                                                            placeholder="请选择"
                                                            getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={(value) => this.props.awarChange(value, 'regist')}>
                                                            <Option value="0">关闭</Option>
                                                            <Option value="1">固定积分</Option>
                                                        </Select>
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={11}>
                                                {selfRewardConfigDTO.registerSwitch == 1 ?
                                                    <FormItem {...formItemLayout}>
                                                        {getFieldDecorator('activityShareRewardConfigDTOS[0].registerConfig', {
                                                            initialValue: selfRewardConfigDTO && selfRewardConfigDTO.registerConfig,
                                                            rules: [{ required: true, message: '输入项不能为空' }, { validator: Validate.checkNumTypeNum1, message: '请输入正整数' }],
                                                        })(
                                                            <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                                                        )}
                                                    </FormItem>
                                                    : null}
                                            </Col>
                                        </Col>

                                        <Col span={12}>
                                            <Col span={13}>
                                                <FormItem label="借款已放款" {...formItemLayoutBo}>
                                                    {getFieldDecorator('activityShareRewardConfigDTOS[0].rewardLoanType', {
                                                        initialValue: selfRewardConfigDTO && selfRewardConfigDTO.rewardLoanType && selfRewardConfigDTO.rewardLoanType.toString() || '0',
                                                        rules: [{ required: true, message: '请选择' }],
                                                    })(
                                                        <Select
                                                            placeholder="请选择"
                                                            getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={(value) => this.props.awarChange(value, 'selfloan')}>
                                                            <Option value="0">关闭</Option>
                                                            <Option value="1">奖励积分</Option>
                                                            <Option value="2">固定积分</Option>
                                                        </Select>
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={11}>
                                                {loanSelf}
                                            </Col>
                                        </Col>
                                    </Row>
                                    <Row className='size'>
                                        <Col span={12}>
                                            <Col span={13}>
                                                <FormItem label="进件完成" {...formItemLayoutBo}>
                                                    {getFieldDecorator('activityShareRewardConfigDTOS[0].rewardAuditType', {
                                                        initialValue: selfRewardConfigDTO && selfRewardConfigDTO.rewardAuditType && selfRewardConfigDTO.rewardAuditType.toString() || '0',
                                                        rules: [{ required: true, message: '请选择' }],
                                                    })(
                                                        <Select
                                                            placeholder="请选择"
                                                            getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={(value) => this.props.awarChange(value, 'selfaudit')}>
                                                            <Option value="0">关闭</Option>
                                                            <Option value="2">固定积分</Option>
                                                        </Select>
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={11}>
                                                {checkSelf}
                                            </Col>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label="贷款产品" {...formItemLayoutPro}>
                                                {getFieldDecorator('activityShareRewardConfigDTOS[0].proCode', {
                                                    initialValue: selfRewardConfigDTO && selfRewardConfigDTO.proCode || undefined,
                                                    rules: [{ required: true, message: '请选择' }],
                                                })(
                                                    <Select
                                                        placeholder="请选择"
                                                        getPopupContainer={trigger => trigger.parentNode}
                                                        className="friend-input">
                                                        {
                                                            productItem && productItem.map((item, index) =>
                                                                <Option value={item.code} key={index}>{item.prdName}</Option>
                                                            )
                                                        }
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="shareBox">
                                    <div className="shareBox-title">
                                        <p className="shareBox-p">商家奖励设置</p>
                                    </div>
                                    <Row className='size'>
                                        <Col span={12}>
                                            <Col span={13}>
                                                <FormItem label="进件完成" {...formItemLayoutBo}>
                                                    {getFieldDecorator('activityShareRewardConfigDTOS[1].rewardAuditType', {
                                                        initialValue: merchantRewardConfigDTO && merchantRewardConfigDTO.rewardAuditType && merchantRewardConfigDTO.rewardAuditType.toString() || '0',
                                                        rules: [{ required: true, message: '请选择' }],
                                                    })(
                                                        <Select
                                                            placeholder="请选择"
                                                            getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={(value) => this.props.awarChange(value, 'meraudit')}>
                                                            <Option value="0">关闭</Option>
                                                            <Option value="2">固定积分</Option>
                                                        </Select>
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={11}>
                                                {checkMerchant}
                                            </Col>
                                        </Col>
                                        <Col span={12}>
                                            <Col span={13}>
                                                <FormItem label="借款已放款" {...formItemLayoutBo}>
                                                    {getFieldDecorator('activityShareRewardConfigDTOS[1].rewardLoanType', {
                                                        initialValue: merchantRewardConfigDTO && merchantRewardConfigDTO.rewardLoanType && merchantRewardConfigDTO.rewardLoanType.toString() || '0',
                                                        rules: [{ required: true, message: '请选择' }],
                                                    })(
                                                        <Select
                                                            placeholder="请选择"
                                                            getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={(value) => this.props.awarChange(value, 'merloan')}>
                                                            <Option value="0">关闭</Option>
                                                            <Option value="1">奖励积分</Option>
                                                            <Option value="2">固定积分</Option>
                                                        </Select>
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={11}>
                                                {loanMerchant}
                                            </Col>
                                        </Col>
                                    </Row>
                                    <Row className='size'>
                                        <Col span={12} className='pro-col'>
                                            <FormItem label="贷款产品" {...formItemLayoutPro}>
                                                {getFieldDecorator('activityShareRewardConfigDTOS[1].proCode', {
                                                    initialValue: merchantRewardConfigDTO && merchantRewardConfigDTO.proCode || undefined,
                                                    rules: [{ required: true, message: '请选择' }],
                                                })(
                                                    <Select
                                                        placeholder="请选择"
                                                        mode="multiple"
                                                        getPopupContainer={trigger => trigger.parentNode}
                                                        className="friend-input">
                                                        {
                                                            productItem && productItem.map((item, index) =>
                                                                <Option value={item.code} key={index}>{item.prdName}</Option>
                                                            )
                                                        }
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="shareBox">
                                    <div className="shareBox-title">
                                        <p className="shareBox-p">活动图文配置</p>
                                    </div>
                                    <Row className='size'>
                                        <Col span={12}>
                                            <FormItem label="活动图片" {...formItemLayout}>
                                                {getFieldDecorator('rateKnifeBg', {
                                                    initialValue: activityImg,
                                                    rules: [{ required: true, message: '图片不能为空' }],
                                                })(
                                                    <Row className="modal-row">
                                                        <Col span={8} className="upload-container">
                                                            {
                                                                activityImg ? <img className="idcard-img" src={activityImg} alt="page" /> :
                                                                    <img className="idcard-img" src={imgPicture} alt="page" />
                                                            }
                                                        </Col>
                                                        <Col span={12} className="row-tip">
                                                            <p>建议图片为png,jpg,jpeg格式</p>
                                                            <p>大小为1080*600</p>
                                                            <input className="idcard-file" type="file" multiple onChange={(e) => this.props.getFile(e, 'shareActivity', '')} />
                                                            <p className="action-btn">上传图片</p>
                                                        </Col>
                                                    </Row>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label="活动规则" {...formItemLayout}>
                                                {getFieldDecorator('description', {
                                                    initialValue: description || '',
                                                    rules: [{ required: true, message: '活动规则不能为空' }, { validator: Validate.checkWordLen500, message: Validate.warnInfo.wordLen500 }],
                                                })(
                                                    <textarea className="des-content" placeholder="请输入" onChange={(e) => this.props.textareaChangeThree(e)}></textarea>
                                                )}
                                                <p className="des-count">{this.props.activityRemark}/500</p>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
        )
    }
}
const pureMarketShareRule=pureRender(MarketShareR)
export default pureMarketShareRule;
