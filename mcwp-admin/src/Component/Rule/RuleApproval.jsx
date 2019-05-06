import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import { Form, Input, Row, Col, Switch, Select, Checkbox } from 'antd';
import './style/rule.less'
const FormItem = Form.Item;
const Option = Select.Option;
class RuleApproval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            creditDetail: Object.assign({}, props.approvalDetail.filter(i => i.auditType == 1)[0]),
            useDetail: Object.assign({}, props.approvalDetail.filter(i => i.auditType == 2)[0]),
            ruleInfo: [
                { id: 1, info: '【规则说明：系统按照贷审员人数随机分配给对应的贷审员】' },
                { id: 2, info: '【规则说明：会优先分配给处理中的业务量少的贷审员，达到平均分配的目的】' },
                { id: 3, info: '【规则说明：每个贷审员都可以审批进件】' },
            ]
        }
    }
    componentWillMount() {
        let { creditDetail, useDetail } = this.state;
        if (creditDetail.greaterEqualRule) {
            creditDetail.greaterEqualRule1 = creditDetail.greaterEqualRule.split(":")[0];
            creditDetail.greaterEqualRule2 = creditDetail.greaterEqualRule.split(":")[1];
        }
        if (creditDetail.lessRule) {
            creditDetail.lessRule1 = creditDetail.lessRule.split(":")[0];
            creditDetail.lessRule2 = creditDetail.lessRule.split(":")[1];
        }
        if (creditDetail.greaterAndLessRule) {
            creditDetail.greaterAndLessRule = creditDetail.greaterAndLessRule.split(":")[2];
        }
        if (useDetail.greaterEqualRule) {
            useDetail.greaterEqualRule1 = useDetail.greaterEqualRule.split(":")[0];
            useDetail.greaterEqualRule2 = useDetail.greaterEqualRule.split(":")[1];
        }
        if (useDetail.lessRule) {
            useDetail.lessRule1 = useDetail.lessRule.split(":")[0];
            useDetail.lessRule2 = useDetail.lessRule.split(":")[1];
        }
        if (useDetail.greaterAndLessRule) {
            useDetail.greaterAndLessRule = useDetail.greaterAndLessRule.split(":")[2];
        }
        this.setState({
            creditDetail: creditDetail,
            useDetail: useDetail
        })
    }
    checkedFn(checked, type) {
        let { creditDetail, useDetail } = this.state;
        if (type == 'credit') {
            creditDetail.isAudit = checked
            this.setState({
                creditDetail: creditDetail
            })
        } else if (type == 'use') {
            useDetail.isAudit = checked
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
    auditModeChange(value, type) {
        let { creditDetail, useDetail } = this.state;
        if (type == 'credit') {
            creditDetail.auditMode = value
            this.setState({
                creditDetail: creditDetail
            })
        } else if (type == 'use') {
            useDetail.auditMode = value
            this.setState({
                useDetail: useDetail
            })
        }
    }
    inputChange(e, type) {
        let { creditDetail, useDetail } = this.state;
        if (type == 'creditGreater') {
            this.setState({
                creditDetail: Object.assign(creditDetail, { greaterEqualRule1: e.target.value })
            })
        } else if (type == 'creditLess') {
            this.setState({
                creditDetail: Object.assign(creditDetail, { lessRule1: e.target.value })
            })
        } else if (type == 'useGreater') {
            this.setState({
                useDetail: Object.assign(useDetail, { greaterEqualRule1: e.target.value })
            })
        } else if (type == 'useLess') {
            this.setState({
                useDetail: Object.assign(useDetail, { lessRule1: e.target.value })
            })
        }
    }
    checkNumbersLen = (rule, value, callback) => {
        let { creditDetail, useDetail } = this.state;
        if (rule.field == 'auditRules[0].greaterEqualRule1') {
            if (parseInt(value) < parseInt(creditDetail.lessRule1)) {
                callback({});
                return;
            }
        }
        if (rule.field == 'auditRules[0].lessRule1') {
            if (parseInt(value) > parseInt(creditDetail.greaterEqualRule1)) {
                callback({});
                return;
            }
        }
        if (rule.field == 'auditRules[1].greaterEqualRule1') {
            if (parseInt(value) < parseInt(useDetail.lessRule1)) {
                callback({});
                return;
            }
        }
        if (rule.field == 'auditRules[1].lessRule1') {
            if (parseInt(value) > parseInt(useDetail.greaterEqualRule1)) {
                callback({});
                return;
            }
        }
        if (!value) {
            callback();
            return;
        }
        if (value >= 0 && value <= 10000000.00 && /^(\d+)(\.?)(\d{0,2})$/.test(value)) {
            callback();
            return;
        }

        callback({});
        return;
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { auditorMember, auditMode, assignRule, type } = this.props;
        const { creditDetail, useDetail, ruleInfo } = this.state;

        console.log(creditDetail, useDetail)
        let auditorMemberList = [];
        auditorMember.map(i => {
            auditorMemberList.push({
                label: i.name,
                value: i.userId + ''
            })
            return auditorMemberList
        })
        const formItemLayoutFour = {
            labelCol: { span: 5 },
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
        const formItemLayoutthree = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 }
        };
        let credit = null;
        let use = null;
        if (creditDetail.auditMode == 1) {
            credit = <Col span={18}>
                <FormItem label="贷审员" {...formItemLayouttow}>
                    {getFieldDecorator('auditRules[0].auditUserId', {
                        initialValue: creditDetail.auditUserId || [],
                        rules: [{ required: true, message: '请选择' }],
                    })(
                        <Checkbox.Group
                            options={auditorMemberList} >
                        </Checkbox.Group>
                    )}
                </FormItem>
            </Col>
        } else if (creditDetail.auditMode == 3) {
            credit =
                <Col span={18}>
                    <FormItem label="审批人数" {...formItemLayout}>
                        {getFieldDecorator('auditRules[0].auditNum', {
                            initialValue: creditDetail.auditNum,
                            rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumTypeNum1, message: "请输入正整数" }],
                        })(
                            <Input autoComplete="off" placeholder="请输入" />
                        )}
                    </FormItem>
                </Col>
        } else if (creditDetail.auditMode == 4) {
            credit = <div>
                <Col span={18} style={{ display: 'flex', paddingLeft: '30px' }}>
                    <p className='less-p'>大于等于</p>
                    <FormItem {...formItemLayoutthree}>
                        {getFieldDecorator('auditRules[0].greaterEqualRule1', {
                            initialValue: creditDetail.greaterEqualRule1,
                            rules: [{ required: true, message: '请输入' }, { validator: this.checkNumbersLen, message: "您输入的金额错误，请重新输入" }],
                        })(
                            <Input onChange={(e) => { this.inputChange(e, 'creditGreater') }} autoComplete="off" placeholder="请输入" />
                        )}
                    </FormItem>
                    <p className='less-sp'>元，需要</p>
                    <FormItem {...formItemLayoutthree}>
                        {getFieldDecorator('auditRules[0].greaterEqualRule2', {
                            initialValue: creditDetail.greaterEqualRule2,
                            // rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumRange100, message: Validate.warnInfo.numRange100 }],
                            rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumTypeNum1, message: "请输入正整数" }],
                        })(
                            <Input autoComplete="off" placeholder="请输入" addonAfter='人审批' />
                        )}
                    </FormItem>
                </Col>
                <Col span={18} style={{ display: 'flex', paddingLeft: '30px' }}>
                    <p className='less-p'>小于</p>
                    <FormItem {...formItemLayoutthree}>
                        {getFieldDecorator('auditRules[0].lessRule1', {
                            initialValue: creditDetail.lessRule1,
                            rules: [{ required: true, message: '请输入' }, { validator: this.checkNumbersLen, message: "您输入的金额错误，请重新输入" }],
                        })(
                            <Input onChange={(e) => { this.inputChange(e, 'creditLess') }} autoComplete="off" placeholder="请输入" />
                        )}
                    </FormItem>
                    <p className='less-sp'>元，需要</p>
                    <FormItem {...formItemLayoutthree}>
                        {getFieldDecorator('auditRules[0].lessRule2', {
                            initialValue: creditDetail.lessRule2,
                            // rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumRange100, message: Validate.warnInfo.numRange100 }],
                            rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumTypeNum1, message: "请输入正整数" }],
                        })(
                            <Input autoComplete="off" placeholder="请输入" addonAfter='人审批' />
                        )}
                    </FormItem>
                </Col>
                {creditDetail.lessRule1 != creditDetail.greaterEqualRule1 ? <Col span={18} style={{ display: 'flex', paddingLeft: '30px' }}>
                    <p className='less-p'>大于等于{creditDetail.lessRule1}元且小于{creditDetail.greaterEqualRule1}元,</p>
                    <FormItem {...formItemLayoutthree}>
                        {getFieldDecorator('auditRules[0].greaterAndLessRule', {
                            initialValue: creditDetail.greaterAndLessRule,
                            // rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumRange100, message: Validate.warnInfo.numRange100 }],
                            rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumTypeNum1, message: "请输入正整数" }],
                        })(
                            <Input autoComplete="off" placeholder="请输入" addonBefore='需要' addonAfter='人审批' />
                        )}
                    </FormItem>
                </Col> : null}
            </div>
        } else {
            credit = null
        }
        if (useDetail.auditMode == 1) {
            use = <Col span={18}>
                <FormItem label="贷审员" {...formItemLayouttow}>
                    {getFieldDecorator('auditRules[1].auditUserId', {
                        initialValue: useDetail.auditUserId,
                        rules: [{ required: true, message: '请选择' }],
                    })(
                        <Checkbox.Group
                            // onChange={(e) => this.changeValue(e, index)} 
                            options={auditorMemberList} >
                        </Checkbox.Group>
                    )}
                </FormItem>
            </Col>
        } else if (useDetail.auditMode == 3) {
            use = <Col span={18}>
                <FormItem label="审批人数" {...formItemLayout}>
                    {getFieldDecorator('auditRules[1].auditNum', {
                        initialValue: useDetail.auditNum,
                        rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumTypeNum1, message: "请输入正整数" }],
                    })(
                        <Input autoComplete="off" placeholder="请输入" />
                    )}
                </FormItem>
            </Col>
        } else if (useDetail.auditMode == 4) {
            use = <div>
                <Col span={18} style={{ display: 'flex', paddingLeft: '30px' }}>
                    <p className='less-p'>大于等于</p>
                    <FormItem {...formItemLayoutthree}>
                        {getFieldDecorator('auditRules[1].greaterEqualRule1', {
                            initialValue: useDetail.greaterEqualRule1,
                            rules: [{ required: true, message: '请输入' }, { validator: this.checkNumbersLen, message: "您输入的金额错误，请重新输入" }],
                        })(
                            <Input onChange={(e) => { this.inputChange(e, 'useGreater') }} autoComplete="off" placeholder="请输入" />
                        )}
                    </FormItem>
                    <p className='less-sp'>元，需要</p>
                    <FormItem {...formItemLayoutthree}>
                        {getFieldDecorator('auditRules[1].greaterEqualRule2', {
                            initialValue: useDetail.greaterEqualRule2,
                            // rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumRange100, message: Validate.warnInfo.numRange100 }],
                            rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumTypeNum1, message: "请输入正整数" }],
                        })(
                            <Input autoComplete="off" placeholder="请输入" addonAfter='人审批' />
                        )}
                    </FormItem>
                </Col>
                <Col span={18} style={{ display: 'flex', paddingLeft: '30px' }}>
                    <p className='less-p'>小于</p>
                    <FormItem {...formItemLayoutthree}>
                        {getFieldDecorator('auditRules[1].lessRule1', {
                            initialValue: useDetail.lessRule1,
                            rules: [{ required: true, message: '请输入' }, { validator: this.checkNumbersLen, message: "您输入的金额错误，请重新输入" }],
                        })(
                            <Input onChange={(e) => { this.inputChange(e, 'useLess') }} autoComplete="off" placeholder="请输入" />
                        )}
                    </FormItem>
                    <p className='less-sp'>元，需要</p>
                    <FormItem {...formItemLayoutthree}>
                        {getFieldDecorator('auditRules[1].lessRule2', {
                            initialValue: useDetail.lessRule2,
                            // rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumRange100, message: Validate.warnInfo.numRange100 }],
                            rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumTypeNum1, message: "请输入正整数" }],
                        })(
                            <Input autoComplete="off" placeholder="请输入" addonAfter='人审批' />
                        )}
                    </FormItem>
                </Col>
                {useDetail.lessRule1 != useDetail.greaterEqualRule1 ? <Col span={18} style={{ display: 'flex', paddingLeft: '30px' }}>
                    <p className='less-p'>大于等于{useDetail.lessRule1}元且小于{useDetail.greaterEqualRule1}元,</p>
                    <FormItem {...formItemLayoutthree}>
                        {getFieldDecorator('auditRules[1].greaterAndLessRule', {
                            initialValue: useDetail.greaterAndLessRule,
                            // rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumRange100, message: Validate.warnInfo.numRange100 }],
                            rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumTypeNum1, message: "请输入正整数" }],
                        })(
                            <Input autoComplete="off" placeholder="请输入" addonBefore='需要' addonAfter='人审批' />
                        )}
                    </FormItem>
                </Col> : null}
            </div>
        } else {
            use = null
        }
        return (
            <div className="rule-detail-container">
                <Form>
                    <p className='rule-formula'>授信审批</p>
                    <Row className='trend-row max-row' type="flex" justify="start">
                        <Col span={18}>
                            <FormItem label="是否需要人工审批" {...formItemLayoutFour}>
                                {getFieldDecorator('auditRules[0].isAudit', {
                                    valuePropName: 'checked',
                                    initialValue: creditDetail.isAudit,
                                    rules: [{ required: false, message: '' }],
                                })(
                                    <Switch onChange={(checked) => this.checkedFn(checked, 'credit')} 
                                    // disabled={type != 6 && type != 12&&type != 13} 
                                    disabled={true} 
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={0}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('auditRules[0].prdCode', {
                                    initialValue: creditDetail.prdCode,
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={0}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('auditRules[0].auditType', {
                                    initialValue: creditDetail.auditType,
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    {creditDetail.isAudit ?
                        <Row className='max-row'>
                            <Col span={18}>
                                <FormItem label="审批方式" {...formItemLayout}>
                                    {getFieldDecorator('auditRules[0].auditMode', {
                                        initialValue: creditDetail.auditMode,
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            onChange={(value) => this.auditModeChange(value, 'credit')}
                                            getPopupContainer={trigger => trigger.parentNode}
                                            className="friend-input">
                                            {
                                                auditMode && auditMode.filter(i => i.ddValue != 2).map((item, index) =>
                                                    <Option value={item.ddValue} key={item.ddValue}>{item.ddText}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {credit}
                            {creditDetail.auditMode == 3 || creditDetail.auditMode == 4 ? <Col span={18}>
                                <FormItem label="分配规则" {...formItemLayout}>
                                    {getFieldDecorator('auditRules[0].assignRule', {
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
                            </Col> : null}

                        </Row> : null}
                    {useDetail.auditType? <div>
                        <p className='rule-formula'>用信审批</p>
                        <Row className='trend-row max-row' type="flex" justify="start">
                            <Col span={0}>
                                <FormItem label="是否需要审批" {...formItemLayoutFour}>
                                    {getFieldDecorator('auditRules[1].isAudit', {
                                        valuePropName: 'checked',
                                        initialValue: useDetail.isAudit,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Switch onChange={(checked) => this.checkedFn(checked, 'use')} disabled={true}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={0}>
                                <FormItem {...formItemLayout}>
                                    {getFieldDecorator('auditRules[1].prdCode', {
                                        initialValue: useDetail.prdCode,
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={0}>
                                <FormItem {...formItemLayout}>
                                    {getFieldDecorator('auditRules[1].auditType', {
                                        initialValue: useDetail.auditType,
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        {useDetail.isAudit ? <Row className='max-row'>
                            <Col span={18}>
                                <FormItem label="审批方式" {...formItemLayout}>
                                    {getFieldDecorator('auditRules[1].auditMode', {
                                        initialValue: useDetail.auditMode,
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            onChange={(value) => this.auditModeChange(value, 'use')}
                                            getPopupContainer={trigger => trigger.parentNode}
                                            className="friend-input">
                                            {
                                                auditMode && auditMode.map((item, index) =>
                                                    <Option value={item.ddValue} key={item.ddValue}>{item.ddText}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {use}
                            {useDetail.auditMode == 3 || useDetail.auditMode == 4 ? <Col span={18}>
                                <FormItem label="分配规则" {...formItemLayout}>
                                    {getFieldDecorator('auditRules[1].assignRule', {
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
                            </Col> : null}
                        </Row> : null}
                    </div> : null}
                </Form>
            </div>
        )
    }
}

const pureRuleApproval = pureRender(RuleApproval);
export default pureRuleApproval;