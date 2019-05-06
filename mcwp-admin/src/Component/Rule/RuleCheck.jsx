import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import { Form, Input, Row, Col, Switch, Select, Checkbox } from 'antd';
import './style/rule.less'
const FormItem = Form.Item;
const Option = Select.Option;
class RuleCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            creditDetail: Object.assign({}, props.checkDetail.filter(i => i.examineType == 1)[0]),
            useDetail: Object.assign({}, props.checkDetail.filter(i => i.examineType == 2)[0]),
            ruleInfo: [
                { id: 1, info: '【规则说明：系统按照审查人数随机分配给对应的审查人员】' },
                { id: 2, info: '【规则说明：会优先分配给处理中的业务量少的审查员，达到平均分配的目的】' },
                { id: 3, info: '【规则说明：每个审查员都可以审查进件】' },
            ]
        }
    }
    componentWillMount() {
    }
    checkedFn(checked, type) {
        let { creditDetail, useDetail } = this.state;
        if (type == 'credit') {
            creditDetail.isExamine = checked
            this.setState({
                creditDetail: creditDetail
            })
        } else if (type == 'use') {
            useDetail.isExamine = checked
            this.setState({
                useDetail: useDetail
            })
        }
    }
    ruleSelect(value, type) {
        let { creditDetail, useDetail } = this.state;
        if (type == 'credit') {
            creditDetail.assignRule = value
            this.setState({
                creditDetail: creditDetail
            })
        } else if (type == 'use') {
            useDetail.assignRule = value
            this.setState({
                useDetail: useDetail
            })
        }
    }
    examineModeChange(value, type) {
        let { creditDetail, useDetail } = this.state;
        if (type == 'credit') {
            creditDetail.examineMode = value
            this.setState({
                creditDetail: creditDetail
            })
        } else if (type == 'use') {
            useDetail.examineMode = value
            this.setState({
                useDetail: useDetail
            })
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { examinerMember, examineMode, assignRule } = this.props;
        const { creditDetail, useDetail, ruleInfo } = this.state;
        let examinerMemberList = [];
        examinerMember.map(i => {
            examinerMemberList.push({
                label: i.name,
                value: i.userId + ''
            })
            return examinerMemberList
        })
        const formItemLayoutFour = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 }
        };
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 8 }
        };
        const formItemLayouttow = {
            labelCol: { span: 3 },
            wrapperCol: { span: 20 }
        };
        return (
            <div className="rule-detail-container">
                <Form>
                    <p className='rule-formula'>授信审查</p>
                    <Row className='trend-row max-row' type="flex" justify="start">
                        <Col span={18}>
                            <FormItem label="是否需要审查" {...formItemLayoutFour}>
                                {getFieldDecorator('examineRules[0].isExamine', {
                                    valuePropName: 'checked',
                                    initialValue: creditDetail.isExamine,
                                    rules: [{ required: false, message: '' }],
                                })(
                                    <Switch onChange={(checked) => this.checkedFn(checked, 'credit')} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={0}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('examineRules[0].prdCode', {
                                    initialValue: creditDetail.prdCode,
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={0}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('examineRules[0].examineType', {
                                    initialValue: creditDetail.examineType,
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    {creditDetail.isExamine ?
                        <Row className='max-row'>
                            <Col span={18}>
                                <FormItem label="审查方式" {...formItemLayout}>
                                    {getFieldDecorator('examineRules[0].examineMode', {
                                        initialValue: creditDetail.examineMode,
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            onChange={(value) => this.examineModeChange(value, 'credit')}
                                            getPopupContainer={trigger => trigger.parentNode}
                                            className="friend-input">
                                            {
                                                examineMode && examineMode.filter(i => i.ddValue != 2).map((item, index) =>
                                                    <Option value={item.ddValue} key={item.ddValue}>{item.ddText}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {creditDetail.examineMode == 1 ? <Col span={18}>
                                <FormItem label="审查员" {...formItemLayouttow}>
                                    {getFieldDecorator('examineRules[0].examineUserId', {
                                        initialValue: creditDetail.examineUserId || [],
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Checkbox.Group
                                            // onChange={(e) => this.changeValue(e, index)} 
                                            options={examinerMemberList} >
                                        </Checkbox.Group>
                                    )}
                                </FormItem>
                            </Col> : null}
                            {creditDetail.examineMode == 3 ? <div>
                                <Col span={18}>
                                    <FormItem label="审查人数" {...formItemLayout}>
                                        {getFieldDecorator('examineRules[0].examineNum', {
                                            initialValue: creditDetail.examineNum,
                                            rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumTypeNum1, message: "请输入正整数" }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={18}>
                                    <FormItem label="分配规则" {...formItemLayout}>
                                        {getFieldDecorator('examineRules[0].assignRule', {
                                            initialValue: creditDetail.assignRule || undefined,
                                            rules: [{ required: true, message: '请选择' }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                getPopupContainer={trigger => trigger.parentNode}
                                                onChange={(value) => this.ruleSelect(value, 'credit')}
                                                className="friend-input">
                                                {
                                                    assignRule && assignRule.map((item, index) =>
                                                        <Option value={item.ddValue} key={item.ddValue}>{item.ddText}</Option>
                                                    )
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                    <p className='rule-tip' style={{ paddingBottom: '30px' }}>{creditDetail && creditDetail.assignRule && ruleInfo.filter(i => i.id == creditDetail.assignRule)[0].info}</p>
                                </Col>
                            </div> : null}
                        </Row> : null}
                    {useDetail.examineType ?
                        <div>
                            <p className='rule-formula'>用信审查</p>
                            <Row className='trend-row max-row' type="flex" justify="start">
                                <Col span={18}>
                                    <FormItem label="是否需要审查" {...formItemLayoutFour}>
                                        {getFieldDecorator('examineRules[1].isExamine', {
                                            valuePropName: 'checked',
                                            initialValue: useDetail.isExamine,
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <Switch onChange={(checked) => this.checkedFn(checked, 'use')} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={0}>
                                    <FormItem {...formItemLayout}>
                                        {getFieldDecorator('examineRules[1].prdCode', {
                                            initialValue: useDetail.prdCode,
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={0}>
                                    <FormItem {...formItemLayout}>
                                        {getFieldDecorator('examineRules[1].examineType', {
                                            initialValue: useDetail.examineType,
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            {useDetail.isExamine ? <Row className='max-row'>
                                <Col span={18}>
                                    <FormItem label="审查方式" {...formItemLayout}>
                                        {getFieldDecorator('examineRules[1].examineMode', {
                                            initialValue: useDetail.examineMode,
                                            rules: [{ required: true, message: '请选择' }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                onChange={(value) => this.examineModeChange(value, 'use')}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                className="friend-input">
                                                {
                                                    examineMode && examineMode.map((item, index) =>
                                                        <Option value={item.ddValue} key={item.ddValue}>{item.ddText}</Option>
                                                    )
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                {useDetail.examineMode == 1 ? <Col span={18}>
                                    <FormItem label="审查员" {...formItemLayouttow}>
                                        {getFieldDecorator('examineRules[1].examineUserId', {
                                            initialValue: useDetail.examineUserId,
                                            rules: [{ required: true, message: '请选择' }],
                                        })(
                                            <Checkbox.Group
                                                options={examinerMemberList} >
                                            </Checkbox.Group>
                                        )}
                                    </FormItem>
                                </Col> : null}
                                {useDetail.examineMode == 3 ? <div>
                                    <Col span={18}>
                                        <FormItem label="审查人数" {...formItemLayout}>
                                            {getFieldDecorator('examineRules[1].examineNum', {
                                                initialValue: useDetail.examineNum,
                                                rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumTypeNum1, message: "请输入正整数" }],
                                            })(
                                                <Input autoComplete="off" placeholder="请输入" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={18}>
                                        <FormItem label="分配规则" {...formItemLayout}>
                                            {getFieldDecorator('examineRules[1].assignRule', {
                                                initialValue: useDetail.assignRule || undefined,
                                                rules: [{ required: true, message: '请选择' }],
                                            })(
                                                <Select
                                                    placeholder="请选择"
                                                    getPopupContainer={trigger => trigger.parentNode}
                                                    onChange={(value) => this.ruleSelect(value, 'use')}
                                                    className="friend-input">
                                                    {
                                                        assignRule && assignRule.map((item, index) =>
                                                            <Option value={item.ddValue} key={item.ddValue}>{item.ddText}</Option>
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                        <p className='rule-tip'>{useDetail && useDetail.assignRule && ruleInfo.filter(i => i.id == useDetail.assignRule)[0].info}</p>
                                    </Col>
                                </div> : null}
                            </Row> : null}
                        </div> : null
                    }


                </Form>
            </div>
        )
    }
}

const pureRuleCheck = pureRender(RuleCheck);
export default pureRuleCheck;