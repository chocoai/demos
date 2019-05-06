import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
// import { Config } from '../../Config/Index';
import moment from 'moment';
import { Validate } from '../../Config/Validate';
import imgPicture from '../../Assets/Images/img_picture.png';
import './style/editActivity.less';

import { Form, Input, Row, Col, DatePicker, Select } from 'antd';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
class EditBasic extends Component {//拼图游戏和摇一摇公用了基础设置
    constructor(props) {
        super(props);
        this.state = {
            continueType: [
                { ddText: '无续命', ddValue: '1' },
                // { ddText: '分享得加时', ddValue: '2' },
                { ddText: '助力得次数', ddValue: '3' },
            ],
            activityRemark: props.operateActivity && props.operateActivity.drawDesc ? props.operateActivity.drawDesc.length : 0,
            showState: props.operateActivity && props.operateActivity.numType,
            ContinueTypeState: props.operateActivity && props.operateActivity.continueType || '1',
        }
    }
    componentWillMount() {
    }
    textareaChangeThree(e) {
        this.setState({
            activityRemark: e.target.value.length
        })
    }
    changeNumber(value) {
        this.setState({
            showState: value
        })
    }
    changeContinueType(value) {
        this.setState({
            ContinueTypeState: value
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        };
        const formItemLayout2 = {
            wrapperCol: { span: 19 }
        };
        const formItemLayout3 = {
            labelCol: { span: 12 },
            wrapperCol: { span: 10 }
        };
        const formItemLayout4 = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        };

        const { operateActivity, brankLogoUrl, brankQrcodeUrl, name, ispublish } = this.props;
        const { showState, continueType, ContinueTypeState, } = this.state;
        let dateGet = [];
        if (operateActivity && operateActivity.activeTime) {
            let arr = operateActivity.activeTime.split(',');
            dateGet = [];
            dateGet.push(moment(parseInt(arr[0])));
            dateGet.push(moment(parseInt(arr[1])));
        }
        let rules = ContinueTypeState == 3 ? [{ required: ispublish, message: '获得机会不能为空' }, { validator: Validate.checkNumRange10, message: Validate.warnInfo.numRange10 }] : ContinueTypeState == 2 ? [{ required: ispublish, message: '单次加时不能为空' }, { validator: Validate.checkNumRange60, message: Validate.warnInfo.numRange60 }] : null;
        let formItem = ContinueTypeState == 3 ? <Input autoComplete="off" placeholder="请输入" addonBefore='获得' addonAfter='次机会' /> : ContinueTypeState == 2 ? <Input autoComplete="off" placeholder="请输入" addonBefore='单次加时' addonAfter='秒' /> : null

        let rules2 = ContinueTypeState == 3 ? [{ required: ispublish, message: '分享得次数上限不能为空' }, { validator: Validate.checkNumRange100, message: Validate.warnInfo.numRange100 }] : ContinueTypeState == 2 ? [{ required: ispublish, message: '加时上限不能为空' }, { validator: Validate.checkNumRange600, message: Validate.warnInfo.numRange600 }] : null;
        let formItem2 = ContinueTypeState == 3 ? <Input autoComplete="off" placeholder="请输入" addonAfter='次' /> : ContinueTypeState == 2 ? <Input autoComplete="off" placeholder="请输入" addonAfter='秒' /> : null
        return (
            <div className='editActivity-container'>
                <Form>
                    <Row className='trend-row' type="flex" justify="start">
                        <Col span={12}>
                            <FormItem label="活动名称" {...formItemLayout}>
                                {getFieldDecorator(name + '.activeName', {
                                    initialValue: operateActivity && operateActivity.activeName || '',
                                    rules: [{ required: ispublish, message: '活动名称不能为空' }, { validator: Validate.checkWordLen100, message: Validate.warnInfo.wordLen100 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="活动时间" {...formItemLayout}>
                                {getFieldDecorator(name + '.activeTime', {
                                    initialValue: dateGet,
                                    rules: [{ required: ispublish, message: Validate.warnInfo.activeTime }],
                                })(
                                    <RangePicker
                                        style={{ width: '100%' }}
                                        format={'YYYY-MM-DD HH:mm:ss'}
                                        disabled={operateActivity && operateActivity.activeStatus == 2 ? true : false}
                                        showTime
                                        getCalendarContainer={trigger => trigger.parentNode}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <Col span={10}>
                                <FormItem label="参与人数" {...formItemLayout3}>
                                    {getFieldDecorator(name + '.numType', {
                                        initialValue: operateActivity && operateActivity.numType || '0',
                                        rules: [{ required: ispublish, message: '请选择' }],
                                    })(
                                        <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={(value) => this.changeNumber(value)} placeholder="请选择">
                                            <Option value="0">隐藏</Option>
                                            <Option value="1">展示</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {showState == 1 ? <Col span={14}>
                                <FormItem {...formItemLayout2}>
                                    {getFieldDecorator(name + '.virtualNum', {
                                        initialValue: operateActivity && operateActivity.virtualNum || null,
                                        rules: [{ required: ispublish, message: '参与人数不能为空' }, { validator: Validate.checkNumRange10000, message: Validate.warnInfo.numRange10000 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonBefore='在实际参与人数基础上增加' addonAfter='人' />
                                    )}
                                </FormItem>
                            </Col> : null}

                        </Col>
                        <Col span={12}>
                            <FormItem label="参与次数" {...formItemLayout}>
                                {getFieldDecorator(name + '.playNum', {
                                    initialValue: operateActivity && operateActivity.playNum || null,
                                    rules: [{ required: ispublish, message: '参与次数不能为空' }, { validator: Validate.checkNumRange200, message: Validate.warnInfo.numRange200 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter='次' />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <Col span={10}>
                                <FormItem label="续命方式" {...formItemLayout4}>
                                    {getFieldDecorator(name + '.continueType', {
                                        initialValue: operateActivity && operateActivity.continueType && operateActivity.continueType.toString() || undefined,
                                        rules: [{ required: ispublish, message: '请选择' }],
                                    })(
                                        <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={(value) => this.changeContinueType(value)} placeholder="请选择">
                                            {
                                                continueType.map((item) =>
                                                    <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {ContinueTypeState == 2 || ContinueTypeState == 3 ? <Col span={14}>
                                <FormItem {...formItemLayout2}>
                                    {getFieldDecorator(name + '.continueNum', {
                                        initialValue: operateActivity && operateActivity.continueNum || null,
                                        rules: rules,
                                    })(
                                        formItem
                                    )}
                                </FormItem>
                            </Col> : null}

                        </Col>
                        {ContinueTypeState == 2 || ContinueTypeState == 3 ? <Col span={12}>
                            <FormItem label={ContinueTypeState == 2 ? "加时上限" : "助力得次数上限"} {...formItemLayout}>
                                {getFieldDecorator(name + '.continueMaxNum', {
                                    initialValue: operateActivity && operateActivity.continueMaxNum || null,
                                    rules: rules2
                                })(
                                    formItem2
                                )}
                            </FormItem>
                        </Col> : null}
                        <Col span={12}>
                            <FormItem label="活动说明" {...formItemLayout}>
                                {getFieldDecorator(name + '.drawDesc', {
                                    initialValue: operateActivity && operateActivity.drawDesc,
                                    rules: [{ required: ispublish, message: '活动说明不能为空' }, { validator: Validate.checkWordLen300, message: Validate.warnInfo.wordLen300 }],
                                })(
                                    <textarea className="des-content" placeholder="请输入" onChange={(e) => this.textareaChangeThree(e)}></textarea>
                                )}
                                <p className="des-count">{this.state.activityRemark}/300</p>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="银行logo" {...formItemLayout}>
                                {getFieldDecorator(name + '.brankLogoUrl', {
                                    initialValue: brankLogoUrl,
                                    rules: [{ required: ispublish, message: '银行logo不能为空' }],
                                })(
                                    <Row className="modal-row">
                                        <Col span={8} className="upload-container">
                                            {
                                                brankLogoUrl ?
                                                    <img className="idcard-img" src={brankLogoUrl} alt="page" /> :
                                                    <img className="idcard-img" src={imgPicture} alt="page" />
                                            }
                                        </Col>
                                        <Col span={12} className="row-tip">
                                            <p>建议图片为png,jpg,jpeg格式</p>
                                            <p>大小为150*150</p>
                                            <input className="idcard-file" type="file" onChange={(e) => this.props.getFile(e, 'brankLogo', '')} multiple />
                                            <p className="action-btn">上传图片</p>
                                        </Col>
                                    </Row>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="二维码" {...formItemLayout}>
                                {getFieldDecorator(name + '.brankQrcodeUrl', {
                                    initialValue: brankQrcodeUrl,
                                    rules: [{ required: ispublish, message: '二维码不能为空' }],
                                })(
                                    <Row className="modal-row">
                                        <Col span={8} className="upload-container">
                                            {
                                                brankQrcodeUrl ?
                                                    <img className="idcard-img" src={brankQrcodeUrl} alt="page" /> :
                                                    <img className="idcard-img" src={imgPicture} alt="page" />
                                            }
                                        </Col>
                                        <Col span={12} className="row-tip">
                                            <p>建议图片为png,jpg,jpeg格式</p>
                                            <p>大小为160*160</p>
                                            <input className="idcard-file" type="file" onChange={(e) => this.props.getFile(e, 'brankQrcode', '')} multiple />
                                            <p className="action-btn">上传图片</p>
                                        </Col>
                                    </Row>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

const pureEditBasic = pureRender(EditBasic);
export default pureEditBasic;