import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import UploadImg from '../../Component/Common/uploadImg'
import get from 'lodash.get'
import { Col, Row, Input, Form, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class interestReliefRule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tzz: [
                { ddText: '贷款产品', ddValue: '1' },
                { ddText: '产品列表', ddValue: '2' },
            ],
        };
    }
    render() {
        const that = this;
        const { tzz } = this.state;
        const { interestReliefRuleConfs, code, type,jumpPrds ,yxqdtj,prodShow} = that.props;
        const { getFieldDecorator } = that.props.form;
        const formItemLayout = {
            labelCol: { span: 6},
            wrapperCol: { span: 15 },
        };
        const formItemLayout1 = {
            labelCol: { span: 11 },
            wrapperCol: { span: 12 }
        };
        const formItemLayout2 = {
            wrapperCol: { span: 19 }
        };
        const formItemLayout3 = {
            labelCol: { span: 9},
            wrapperCol: { span: 15 },
        };
        return (
            <Form>
                <p className='rule-formula'>活动规则</p>
                <Row>
                    <Col span={12}>
                        <Col span={15}>
                            <FormItem label="抵息红包" {...formItemLayout3} >
                                {getFieldDecorator('sillMoney', {
                                    initialValue: get(interestReliefRuleConfs,'sillMoney',''),
                                    rules: [{ required: true, message: '抵息红包不能为空' }, { validator: Validate.checkNumDecimal1000, message: Validate.warnInfo.NumDecimal1000 }]
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="万元抵扣利息" addonBefore='满' />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem {...formItemLayout} >
                                {getFieldDecorator('deductionMoney', {
                                    initialValue: get(interestReliefRuleConfs,'deductionMoney',''),
                                    rules: [{ required: true, message: '利息不能为空' }, { validator: Validate.checkNumRange1000, message: Validate.warnInfo.numRange1000 }]
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                )}
                            </FormItem>
                        </Col>

                    </Col>
                    <Col span={12}>
                        <FormItem label="每人有效获取上限" {...formItemLayout} >
                            {getFieldDecorator('useLimit', {
                                initialValue: get(interestReliefRuleConfs,'useLimit',''),
                                rules: [{ required: true, message: '上限不能为空' }, { validator: Validate.checkNumRange20, message: Validate.warnInfo.numRange20 }]
                            })(
                                <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="有效期限" {...formItemLayout} >
                            {getFieldDecorator('effectiveTime', {
                                initialValue: get(interestReliefRuleConfs,'effectiveTime',''),
                                rules: [{ required: true, message: '有效期限不能为空' }, { validator: Validate.checkNumRange365, message: Validate.warnInfo.numRange365 }]
                            })(
                                <Input autoComplete="off" placeholder="请输入" addonAfter="天" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="好友助力" {...formItemLayout} >
                            {getFieldDecorator('helpNum', {
                                initialValue: get(interestReliefRuleConfs,'helpNum',''),
                                rules: [{ required: true, message: '好友助力不能为空' }, { validator: Validate.checkNumRange20, message: Validate.warnInfo.numRange20 }]
                            })(
                                <Input autoComplete="off" placeholder="请输入" addonAfter="个好友帮助助力后，获得红包1个" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="跳转至" {...formItemLayout}>
                            {getFieldDecorator('proType', {
                                initialValue: get(interestReliefRuleConfs,'proType')||undefined,
                                rules: [{ required: true, message: '请选择' }],
                            })(
                                <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={(value) => this.props.changeTzz(value)} placeholder="请选择">
                                    {
                                        tzz.map((item) =>
                                            <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    {prodShow?<Col span={12}>
                        <Col span={13}>
                            <FormItem label="贷款产品" {...formItemLayout1}>
                                {getFieldDecorator('proCode', {
                                    initialValue: Config.setValueInNot2(get(interestReliefRuleConfs,'proCode'),jumpPrds)>0?get(interestReliefRuleConfs,'proCode'):undefined||undefined,
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" placeholder="请选择">
                                        {
                                            jumpPrds&&jumpPrds.map((item) =>
                                                <Option key={item.code} value={item.code}>{item.prdName}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem {...formItemLayout2}>
                                {getFieldDecorator('proUrlType', {
                                    initialValue: get(interestReliefRuleConfs,'proUrlType')||undefined,
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" placeholder="请选择">
                                        {
                                            yxqdtj && yxqdtj.map((item) =>
                                                <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Col>:null}
                    
                </Row>
                <p className='rule-formula'>活动图文配置</p>
                <Row className="knife-set" type="flex" justify="start">
                    <Col span={24} className='title-col'>活动页面</Col>
                    <Col span={12}>
                        <UploadImg label={'背景图片'} rules={[{ required: true, message: '图片不能为空' }]} size={'1080*2600'} getFieldDecorator={getFieldDecorator} name={'activityBonusGraphic'} code={code} type={type[0]} />
                    </Col>
                    <Col span={12}>
                        <FormItem label="活动简介" {...formItemLayout}>
                            {getFieldDecorator('description', {
                                initialValue: get(interestReliefRuleConfs,'description',''),
                                rules: [{ required: true, message: '活动简介不能为空' }, { validator: Validate.checkWordLen300, message: Validate.warnInfo.wordLen300 }],
                            })(
                                <textarea className="des-content" placeholder="请输入" onChange={(e) => this.props.textareaChangeThree(e,'description')}></textarea>
                            )}
                            <p className="des-count">{this.props.description}/300</p>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="使用规则" {...formItemLayout}>
                            {getFieldDecorator('useDescription', {
                                initialValue: get(interestReliefRuleConfs,'useDescription',''),
                                rules: [{ required: true, message: '使用规则不能为空' }, { validator: Validate.checkWordLen300, message: Validate.warnInfo.wordLen300 }],
                            })(
                                <textarea className="des-content" placeholder="请输入" onChange={(e) => this.props.textareaChangeThree(e,'useDescription')}></textarea>
                            )}
                            <p className="des-count">{this.props.useDescription}/300</p>
                        </FormItem>
                    </Col>
                </Row>
                <Row className="knife-set" type="flex" justify="start">
                    <Col span={24} className='title-col'>好友助力页面</Col>
                    <Col span={12}>
                        <UploadImg label={'背景图片'} rules={[{ required: true, message: '图片不能为空' }]} size={'1080*2400'} getFieldDecorator={getFieldDecorator} name={'activityBonusHelp'} code={code} type={type[1]} />
                    </Col>
                    <Col span={12}>
                        <UploadImg label={'产品图片'} rules={[{ required: true, message: '图片不能为空' }]} size={'968*824'} getFieldDecorator={getFieldDecorator} name={'activityBonusHelpProd'} code={code} type={type[2]} />
                    </Col>
                    <Col span={12}>
                        <UploadImg label={'二维码'} rules={[{ required: true, message: '图片不能为空' }]} size={'376*376'} getFieldDecorator={getFieldDecorator} name={'activityBonusHelpQrcode'} code={code} type={type[3]} />
                    </Col>
                </Row>
            </Form>
        );
    }
}
const pureForminterestReliefRule = pureRender(interestReliefRule);

export default pureForminterestReliefRule;
