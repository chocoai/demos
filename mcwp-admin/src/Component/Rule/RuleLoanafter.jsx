import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
// import { Validate } from '../../Config/Validate';
import { Form, Input, Row, Col, Select, Radio } from 'antd';
import ProductService from '../../Services/ProductService'
import './style/rule.less'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class RuleLoanafter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loanafterDetail: Object.assign({},props.loanafterDetail),
            ruleList: props.loanafterList,
            loanday: [],
            loanday1: props.loanafterDetail.remindersType == '1' ? props.loanafterDetail.remindersDays : '',
            loanday2: props.loanafterDetail.remindersType == '2' ? props.loanafterDetail.remindersDays : '',
            loanday4: props.loanafterDetail.remindersType == '4' ? props.loanafterDetail.remindersDays : '',
            loanday3:null,
            productList:[]
        }
    }
    componentDidMount() {
        this.getProList({prdStatus:2})
    }
    async getProList(params){
        let res=await ProductService.getDropProd(params);
        this.setState({
            productList:res.data
        })
    }
    // 单选框改变
    onChange = (e) => {
        let { loanafterDetail } = this.state;
        loanafterDetail.remindersType = e.target.value + '';
        loanafterDetail.remindersDays = this.state['loanday' + e.target.value];
        this.setState({
            loanafterDetail: loanafterDetail
        })
    }
    // 下拉框改变
    selectChange = (value,type) => {
        let { loanafterDetail } = this.state;
        loanafterDetail[type] = value;
        if(type=='onWayLimit'){
            this.props.form.setFieldsValue({
                ['prdCodes']: undefined
            });
        }
        this.setState({
            loanafterDetail: loanafterDetail
        })
    }
    // 输入框改变
    inputChange(e, type) {
        let { loanafterDetail } = this.state;
        this.setState({
            ['loanday' + type]: e.target.value,
        })
        loanafterDetail.remindersDays = e.target.value;
        this.setState({
            loanafterDetail: loanafterDetail
        })
    }
    render() {
        const { ruleList, loanafterDetail, loanday1, loanday2, loanday4,productList} = this.state;
        const { getFieldDecorator } = this.props.form;
        const {onWayList}=this.props;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 6 }
        };
        const radioStyle = {
            display: 'block',
            height: '50px',
            lineHeight: '50px',
        };
        return (
            <div className="rule-detail-container">
                <Form>
                    <p className='rule-formula'>还款提醒</p>
                    <Row className='trend-row' type="flex" justify="start" className='notice-row'>
                        <Col span={12}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('remindersType', {
                                    initialValue: parseInt(loanafterDetail.remindersType),
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <RadioGroup onChange={this.onChange}>
                                        <Radio style={radioStyle} value={4}>
                                            <Input placeholder='请输入' onChange={(e) => this.inputChange(e, '4')} style={{ width: 100, marginLeft: 10 }} disabled={loanafterDetail.remindersType != '4'} value={loanday4} addonBefore='还款日前' addonAfter='天，当天提醒，还款日当天提醒' />
                                        </Radio>
                                        <Radio style={radioStyle} value={2}>
                                            <Input placeholder='请输入' onChange={(e) => this.inputChange(e, '2')} style={{ width: 100, marginLeft: 10 }} disabled={loanafterDetail.remindersType != '2'} value={loanday2} addonBefore='还款日前' addonAfter='天，当天提醒' />
                                        </Radio>
                                        <Radio style={radioStyle} value={1}>
                                            <Input placeholder='请输入' onChange={(e) => this.inputChange(e, '1')} style={{ width: 100, marginLeft: 10 }} disabled={loanafterDetail.remindersType != '1'} value={loanday1} addonBefore='还款日前' addonAfter='天，之后每天短信提醒' />
                                        </Radio>
                                        <Radio style={radioStyle} value={3}>
                                            还款日当天提醒
                                        </Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={0}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('remindersDays', {
                                    initialValue: loanafterDetail.remindersDays,
                                })(
                                    <Input autoComplete="off" placeholder="请输入" value={loanafterDetail.remindersDays} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <p className='rule-formula'>在途申请限制</p>
                    <Row className='max-row'>
                        <Col span={24}>
                            <FormItem label="限制" {...formItemLayout}>
                                {getFieldDecorator('onWayLimit', {
                                    initialValue: loanafterDetail.onWayLimit,
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        onChange={(value)=>this.selectChange(value,'onWayLimit')}
                                        getPopupContainer={trigger => trigger.parentNode}
                                        className="friend-input">
                                        {
                                            onWayList && onWayList.map((item, index) =>
                                            <Option value={item.type} key={item.type}>{item.name}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {/* {loanafterDetail.onWayLimit==1? */}
                        <Col span={24}>
                            <FormItem label="受限于" {...formItemLayout}>
                                {getFieldDecorator('prdCodes', {
                                    initialValue: loanafterDetail.prdCodes,
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <Select
                                        placeholder="产品名称"
                                        multiple
                                        getPopupContainer={trigger => trigger.parentNode}
                                        className="friend-input">
                                        {
                                            productList&& productList.map((item, index) =>
                                            <Option value={item.code} key={item.code}>{item.prdName}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {/* :null} */}
                        <p className='rule-tip'>{onWayList.filter(i => i.type == loanafterDetail.onWayLimit)[0].desc}</p>
                    </Row>
                    <p className='rule-formula'>还款未结清限制</p>
                    <Row className='max-row'>
                        <Col span={24}>
                            <FormItem label="限制" {...formItemLayout}>
                                {getFieldDecorator('unclearedLimit', {
                                    initialValue: loanafterDetail.unclearedLimit,
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        onChange={(value)=>this.selectChange(value,'unclearedLimit')}
                                        getPopupContainer={trigger => trigger.parentNode}
                                        className="friend-input">
                                        {
                                            ruleList && ruleList.map((item, index) =>
                                                <Option value={item.type} key={item.type}>{item.name}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <p className='rule-tip'>{ruleList.filter(i => i.type == loanafterDetail.unclearedLimit)[0].desc}</p>
                        </Col>
                    </Row>

                </Form>
            </div>
        )
    }
}

const pureRuleLoanafter = pureRender(RuleLoanafter);
export default pureRuleLoanafter;