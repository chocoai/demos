import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import './style/rateRule.less';
import IconRemove from './../../Assets/Images/icon_remove_default.png';
import IconAdd from './../../Assets/Images/icon_add_default.png';
import imgPicture from '../../Assets/Images/img_picture.png';

import { Col, Row, Input, Form, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class RateRule extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const that = this;
        const {rateConf, helpConfig, isHelp, productItem, imgobj} = that.props;
        const { getFieldDecorator } = that.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        const formItemLayoutPro = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 }
        };
        return (
            <Form>
                <p className='rule-formula'>活动规则</p>
                <Row>
                    <Col span={12}>
                        <FormItem label="初始日利率" {...formItemLayout} >
                            {getFieldDecorator('startRate', {
                                initialValue: (rateConf && rateConf.startRate) || '',
                                rules: [{ validator: this.props.validatorForm }]
                            })(
                                <Input autoComplete="off" placeholder="请输入" addonAfter="‱" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="日利率最低砍至" {...formItemLayout} >
                            {getFieldDecorator('minimumRate', {
                                initialValue: (rateConf && rateConf.minimumRate) || '',
                                rules: [{ validator: this.props.validatorForm }]
                            })(
                                <Input autoComplete="off" placeholder="请输入" addonAfter="‱" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="好友助力" {...formItemLayout} >
                            {getFieldDecorator('helpNum', {
                                initialValue: (rateConf && rateConf.helpNum) || '',
                                rules: [{ validator: this.props.validatorForm }]
                            })(
                                <Input autoComplete="off" placeholder="请输入" addonAfter="个好友帮助助力后，可获得1刀" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="砍获利率总和" {...formItemLayout}>
                            <span className="ant-form-text">{helpConfig.length > 0 ? `${that.props.reduceHelp(helpConfig)}‱` : 0}</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row className='size'>
                    <Col span={12} className='pro-col'>
                        <FormItem label="贷款产品" {...formItemLayoutPro}>
                            {getFieldDecorator('prodCode', {
                                initialValue: rateConf && rateConf.prodCode || undefined,
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
                <Row className="knife">
                    <Col span={12}>
                        {!isHelp && <div className="knife-error">砍获利率总和需等于初始日利率和最低利率差额，请修改数值</div>}
                    </Col>
                    {
                        helpConfig.length > 0 && helpConfig.map((item, index) => (
                            <Col span={12} key={index}>
                                {
                                    helpConfig.length == index + 1 ? <FormItem label={`第${index + 1}刀`} {...formItemLayout} >
                                        {getFieldDecorator(`helpConfig${index}`, {
                                            initialValue: item || '',
                                            rules: [{ validator: this.props.validatorForm }]
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="‱" />
                                        )}
                                        <div className="help-icon">
                                            <img src={IconAdd} onClick={() => that.props.helpConfigFn('add')} alt="icon-add" />
                                            {helpConfig.length > 1 && <img src={IconRemove} onClick={() => that.props.helpConfigFn('remove')} alt="icon-remove" />}
                                        </div>
                                    </FormItem> : <FormItem label={`第${index + 1}刀`} {...formItemLayout} >
                                            {getFieldDecorator(`helpConfig${index}`, {
                                                initialValue: item || '',
                                                rules: [{ validator: this.props.validatorForm }]
                                            })(
                                                <Input autoComplete="off" placeholder="请输入" addonAfter="‱" />
                                            )}
                                        </FormItem>
                                }
                            </Col>
                        ))
                    }
                </Row>
                <p className='rule-formula'>活动图文配置</p>
                <Row className="knife-set" type="flex" justify="start">
                    <Col span={24} className='title-col'>砍刀页面</Col>
                    <Col span={12}>
                        <FormItem label="背景图片" {...formItemLayout}>
                            {getFieldDecorator('rateKnifeBg', {
                                initialValue: imgobj && imgobj.rateKnifeBg,
                                rules: [{ required: true, message: '图片不能为空' }],
                            })(
                                <Row className="modal-row">
                                    <Col span={8} className="upload-container">
                                        {
                                            imgobj && imgobj.rateKnifeBg ? <img className="idcard-img" src={imgobj.rateKnifeBg} alt="page" /> :
                                                <img className="idcard-img" src={imgPicture} alt="page" />
                                        }
                                    </Col>
                                    <Col span={12} className="row-tip">
                                        <p>建议图片为png,jpg,jpeg格式</p>
                                        <p>大小为1080*2528</p>
                                        <input className="idcard-file" type="file" multiple onChange={(e) => this.props.getFile(e, 'rateKnifeBg', '')} />
                                        <p className="action-btn">上传图片</p>
                                    </Col>
                                </Row>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="活动简介" {...formItemLayout}>
                            {getFieldDecorator('description', {
                                initialValue: rateConf && rateConf.description || '',
                                rules: [{ required: true, message: '活动简介不能为空' }, { validator: Validate.checkWordLen500, message: Validate.warnInfo.wordLen500 }],
                            })(
                                <textarea className="des-content" placeholder="请输入" onChange={(e) => this.props.textareaChangeThree(e)}></textarea>
                            )}
                            <p className="des-count">{this.props.activityRemark}/500</p>
                        </FormItem>
                    </Col>
                </Row>
                <Row className="knife-set" type="flex" justify="start">
                    <Col span={24} className='title-col'>好友助力页面</Col>
                    <Col span={12}>
                        <FormItem label="背景图片" {...formItemLayout}>
                            {getFieldDecorator('rateHelpBg', {
                                initialValue: imgobj && imgobj.rateHelpBg,
                                rules: [{ required: true, message: '图片不能为空' }],
                            })(
                                <Row className="modal-row">
                                    <Col span={8} className="upload-container">
                                        {
                                            imgobj && imgobj.rateHelpBg ? <img className="idcard-img" src={imgobj.rateHelpBg} alt="page" /> :
                                                <img className="idcard-img" src={imgPicture} alt="page" />
                                        }
                                    </Col>
                                    <Col span={12} className="row-tip">
                                        <p>建议图片为png,jpg,jpeg格式</p>
                                        <p>大小为1080*2092</p>
                                        <input className="idcard-file" type="file" multiple onChange={(e) => this.props.getFile(e, 'rateHelpBg', '')} />
                                        <p className="action-btn">上传图片</p>
                                    </Col>
                                </Row>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="产品图片" {...formItemLayout}>
                            {getFieldDecorator('rateProdImg', {
                                initialValue: imgobj && imgobj.rateProdImg,
                                rules: [{ required: true, message: '图片不能为空' }],
                            })(
                                <Row className="modal-row">
                                    <Col span={8} className="upload-container">
                                        {
                                            imgobj && imgobj.rateProdImg ? <img className="idcard-img" src={imgobj.rateProdImg} alt="page" /> :
                                                <img className="idcard-img" src={imgPicture} alt="page" />
                                        }
                                    </Col>
                                    <Col span={12} className="row-tip">
                                        <p>建议图片为png,jpg,jpeg格式</p>
                                        <p>大小为1016*464</p>
                                        <input className="idcard-file" type="file" multiple onChange={(e) => this.props.getFile(e, 'rateProdImg', '')} />
                                        <p className="action-btn">上传图片</p>
                                    </Col>
                                </Row>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="二维码" {...formItemLayout}>
                            {getFieldDecorator('rateQrcode', {
                                initialValue: imgobj && imgobj.rateQrcode,
                                rules: [{ required: true, message: '图片不能为空' }],
                            })(
                                <Row className="modal-row">
                                    <Col span={8} className="upload-container">
                                        {
                                            imgobj && imgobj.rateQrcode ? <img className="idcard-img" src={imgobj.rateQrcode} alt="page" /> :
                                                <img className="idcard-img" src={imgPicture} alt="page" />
                                        }
                                    </Col>
                                    <Col span={12} className="row-tip">
                                        <p>建议图片为png,jpg,jpeg格式</p>
                                        <p>大小为400*400</p>
                                        <input className="idcard-file" type="file" multiple onChange={(e) => this.props.getFile(e, 'rateQrcode', '')} />
                                        <p className="action-btn">上传图片</p>
                                    </Col>
                                </Row>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}
const pureFormRateRule = pureRender(RateRule);

export default pureFormRateRule;
