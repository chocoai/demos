import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import moment from 'moment';
import './style/editActivity.less';
import { Form, Input, Row, Col, Select, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class ActivityPrize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemArr: [...Array(3)].map((_, i) => i),
            thatData: props.prizes && props.prizes.length > 0 && props.prizes || [{},{},{}],
            prizeType: [
                { ddText: '线下奖品', ddValue: '1' },
            ],
        }
    }
    componentDidMount() {
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        const { itemArr, thatData, prizeType } = this.state;
        const {yyyjpList, ispublish}=this.props;
        let dateGet = [];
        if (thatData && thatData.length > 0) {
            thatData.map((item, index) => {
                if (item.prizeTime) {
                    let arr = item.prizeTime.split(',');
                    dateGet[index] = [];
                    dateGet[index].push(moment(parseInt(arr[0])));
                    dateGet[index].push(moment(parseInt(arr[1])));
                } else {
                    dateGet[index] = [null, null];
                }
            })
        }
        return (
            <div className='editActivity-container'>
                <Form>
                    {
                        itemArr.map((item, index) => (
                            <div key={item}>
                                <Row className='trend-row-border' type="flex" justify="start">
                                    <Col span={12} style={{ display: 'none' }}>
                                        <FormItem label="code"  {...formItemLayout}>
                                            {getFieldDecorator('prizes[' + item + '].code', {
                                                initialValue: thatData[item] && thatData[item].code,
                                                rules: [{ required: false }],
                                            })(
                                                <Input autoComplete="off" placeholder="请输入" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="奖品名称"  {...formItemLayout}>
                                            {getFieldDecorator('prizes[' + item + '].prizeName', {
                                                initialValue: thatData[item] && thatData[item].prizeName,
                                                rules: [{ required: ispublish, message: '奖品名称不能为空' }, { validator: Validate.checkWordLen25, message: Validate.warnInfo.wordLen25 }],
                                            })(
                                                <Input autoComplete="off" placeholder="请输入奖品名称" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="奖品类型" {...formItemLayout}>
                                            {getFieldDecorator('prizes[' + item + '].prizeType', {
                                                initialValue: thatData[item] && thatData[item].prizeType||undefined,
                                                rules: [{ required: ispublish, message: Validate.warnInfo.prizeType }],
                                            })(
                                                <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" placeholder="请选择">
                                                    {
                                                        prizeType.map((item) =>
                                                            <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="奖品数量" {...formItemLayout}>
                                            {getFieldDecorator('prizes[' + item + '].prizeNum', {
                                                initialValue: thatData[item] && thatData[item].prizeNum||'',
                                                rules: [{ required: ispublish, message: '奖品数量不能为空' }, { validator: Validate.checkNumRange100000, message: Validate.warnInfo.numRange100000 }],
                                            })(
                                                <Input autoComplete="off" placeholder="请输入" addonAfter='个' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="奖励条件" {...formItemLayout}>
                                            {getFieldDecorator('prizes[' + item + '].prizeCondition', {
                                                initialValue: thatData[item] && thatData[item].prizeCondition && thatData[item].prizeCondition.toString()||undefined,
                                                rules: [{ required: ispublish, message: '奖励条件不能为空' }, { validator: Validate.checkNumRange100, message: Validate.warnInfo.numRange100 }],
                                            })(
                                                <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" placeholder="请选择">
                                                    {
                                                        yyyjpList.map((item) =>
                                                            <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="中奖率" {...formItemLayout}>
                                            {getFieldDecorator('prizes[' + item + '].prizeOdds', {
                                                initialValue: thatData[item] && thatData[item].prizeOdds,
                                                rules: [{ required: ispublish, message: '中奖率不能为空' }, { validator: Validate.checkNumDecimalFull100, message: Validate.warnInfo.numDecimalFull100 }],
                                            })(
                                                <Input autoComplete="off" placeholder="请输入" addonAfter='%'/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="兑奖期限" {...formItemLayout}>
                                            {getFieldDecorator('prizes[' + item + '].prizeTime', {
                                                initialValue: dateGet[item],
                                                rules: [{ required: ispublish, message: Validate.warnInfo.prizeTime }],
                                            })(
                                                <RangePicker
                                                    style={{ width: '100%' }}

                                                    getCalendarContainer={trigger => trigger.parentNode}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>))
                    }
                    
                </Form>
            </div>
        )
    }
}

const pureActivityPrize = pureRender(ActivityPrize);

export default pureActivityPrize;