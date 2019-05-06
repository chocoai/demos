import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import moment from 'moment';
import './style/editActivity.less';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';

import { Form, Input, Row, Col, Select, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class ActivityPrize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemArr: [...Array(props.len || 1)].map((_, i) => i),
            max: props.len || 1,
            thatData: props.jigsawPrizes && props.jigsawPrizes.length > 0 && props.jigsawPrizes || [{}],
            prizeType: [
                { ddText: '线下奖品', ddValue: '1' },
            ],
            prizeCondition: [
                { ddText: '低级关卡', ddValue: '1' },
                { ddText: '中级关卡', ddValue: '2' },
                { ddText: '高级关卡', ddValue: '3' },
            ],
            range: props.range?props.len-1 : 0,//状态为进行中和已结束
        }
    }
    componentDidMount() {
    }
    ipiecesItemAdd = () => {
        let max = this.state.max;
        this.setState({
            itemArr: [...this.state.itemArr, max],
            thatData: [...this.state.thatData, {}],
            max: max + 1
        })
    }
    //删除
    ipiecesItemDelete = (itemDelete) => {
        this.setState({
            itemArr: [...this.state.itemArr.filter((item, index) => item != itemDelete)],
            // thatData: [...this.state.thatData.filter((item, index) => index != itemDelete)],
        })
    }
    // prizeConditionChange(value, index) {
    //     let { thatData } = this.state;
    //     thatData[index].prizeCondition = value;
    //     this.setState({
    //         thatData: thatData
    //     })
    // }
    prizeOddsChange(e, index) {
        // let { thatData } = this.state;
        // thatData[index].prizeOdds = e.target.value;
        // this.setState({
        //     thatData: thatData
        // })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        const { itemArr, thatData, prizeType, prizeCondition,range } = this.state;
        const {ispublish}=this.props
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
        // let winningRate = {
        //     lower: 0,
        //     middle: 0,
        //     large: 0
        // }
        // if (thatData && thatData[0] && thatData[0].prizeCondition) {
        //     thatData.map((item, index) => {
        //         if (item.prizeCondition) {
        //             if (item.prizeCondition == 1) {
        //                 winningRate.lower += parseFloat(item.prizeOdds)
        //             }
        //             if (item.prizeCondition == 2) {
        //                 winningRate.middle += parseFloat(item.prizeOdds)
        //             }
        //             if (item.prizeCondition == 3) {
        //                 winningRate.large += parseFloat(item.prizeOdds)
        //             }
        //         } else {

        //         }
        //     })
        // }
        return (
            <div className='editActivity-container'>
                {/* <Row type="flex" justify="start">
                    <Col className='activity-span' span={12}>
                        低级关卡中奖率:{winningRate.lower}%
                    </Col>
                    <Col className='activity-span' span={12}>
                        中级关卡中奖率:{winningRate.middle}%
                    </Col>
                    <Col className='activity-span activity-span2' span={12}>
                        高级关卡中奖率:{winningRate.large}%
                    </Col>
                </Row> */}
                <Form>
                    {
                        itemArr.map((item, index) => (
                            <div key={item}>
                                <Row className='trend-row-border' type="flex" justify="start">
                                    <Col span={12} style={{ display: 'none' }}>
                                        <FormItem label="code"  {...formItemLayout}>
                                            {getFieldDecorator('jigsawPrizes[' + item + '].code', {
                                                initialValue: thatData[item] && thatData[item].code,
                                                rules: [{ required: false }],
                                            })(
                                                <Input autoComplete="off" placeholder="请输入" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="奖品名称"  {...formItemLayout}>
                                            {getFieldDecorator('jigsawPrizes[' + item + '].prizeName', {
                                                initialValue: thatData[item] && thatData[item].prizeName,
                                                rules: [{ required: ispublish, message: '奖品名称不能为空' }, { validator: Validate.checkWordLen25, message: Validate.warnInfo.wordLen25 }],
                                            })(
                                                <Input autoComplete="off" placeholder="请输入奖品名称" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="奖品类型" {...formItemLayout}>
                                            {getFieldDecorator('jigsawPrizes[' + item + '].prizeType', {
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
                                            {getFieldDecorator('jigsawPrizes[' + item + '].prizeNum', {
                                                initialValue: thatData[item] && thatData[item].prizeNum||'',
                                                rules: [{ required: ispublish, message: '奖品数量不能为空' }, { validator: Validate.checkNumRange100000, message: Validate.warnInfo.numRange100000 }],
                                            })(
                                                <Input autoComplete="off" placeholder="请输入" addonAfter='个' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    {/* <Col span={12}>
                                        <FormItem label="奖励条件" {...formItemLayout}>
                                            {getFieldDecorator('jigsawPrizes[' + item + '].prizeCondition', {
                                                initialValue: thatData[item] && thatData[item].prizeCondition && thatData[item].prizeCondition.toString(),
                                                rules: [{ required: ispublish, message: '完成度不能为空' }, { validator: Validate.checkNumRange100, message: Validate.warnInfo.numRange100 }],
                                            })(
                                                <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" placeholder="请选择" onChange={(value) => this.prizeConditionChange(value, item)}>
                                                    {
                                                        prizeCondition.map((item) =>
                                                            <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col> */}
                                    <Col span={12}>
                                        <FormItem label="中奖率" {...formItemLayout}>
                                            {getFieldDecorator('jigsawPrizes[' + item + '].prizeOdds', {
                                                initialValue: thatData[item] && thatData[item].prizeOdds,
                                                rules: [{ required: ispublish, message: '中奖率不能为空' }, { validator: Validate.checkNumDecimalFull100, message: Validate.warnInfo.numDecimalFull100 }],
                                            })(
                                                <Input autoComplete="off" placeholder="请输入" addonAfter='%' onChange={(e) => this.prizeOddsChange(e, item)} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="兑奖期限" {...formItemLayout}>
                                            {getFieldDecorator('jigsawPrizes[' + item + '].prizeTime', {
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
                                    {
                                        index > range ?
                                            <img className='ipieces-delete' src={ipiecesDelete} alt='delete' onClick={() => this.ipiecesItemDelete(item)} />
                                            : null
                                    }
                                </Row>
                            </div>))
                    }
                    <div className='ipieces-add' onClick={this.ipiecesItemAdd}>
                        <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                        <span className='ipieces-add-detail'>添加奖项</span>
                    </div>
                </Form>
            </div>
        )
    }
}

const pureActivityPrize = pureRender(ActivityPrize);

export default pureActivityPrize;