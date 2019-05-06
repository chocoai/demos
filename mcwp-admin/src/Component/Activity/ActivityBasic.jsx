import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
// import { Config } from '../../Config/Index';
import moment from 'moment';
import { Validate } from '../../Config/Validate';
import './style/editActivity.less';

import { Form, Input, Row, Col, DatePicker, Switch } from 'antd';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

/**
 * 活动管理基础设置编辑
 * @Author: 钟观发
 * @Date:   2017-12-25
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-12-25
 */
class EditBasic extends Component {
        constructor(props) {
        super(props);
        this.state = {
            activityRemark: props.operateActivityInfo && props.operateActivityInfo.drawDesc ? props.operateActivityInfo.drawDesc.length : 0
        }
    }
    componentWillMount() {
    }
    textareaChangeThree(e) {
        if ( e.target.value.length>500 ) {
            e.target.value = e.target.value.substr(0, 500);
        }
        this.setState({
            activityRemark: e.target.value.length
        })
    }
    openNotice = (checked) => {
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        // const { relationship } = this.state;
        const { operateActivityInfo, activeStatus } = this.props;
        let dateGet = [];
        if(operateActivityInfo && operateActivityInfo.activeTime){
            let arr = operateActivityInfo.activeTime.split(',');
                dateGet = [];
                dateGet.push(moment(parseInt(arr[0])));
                dateGet.push(moment(parseInt(arr[1])));
        } 
        return (
            <div className='editActivity-container'>
                <Form>  
                    <Row className='trend-row' type="flex" justify="start">
                        <Col span={12}>
                            <FormItem label="活动名称" {...formItemLayout}>
                                {getFieldDecorator('operateActivityInfo.activeName', {
                                    initialValue: operateActivityInfo && operateActivityInfo.activeName || '抽奖活动',
                                    rules: [{ required: true, message: '活动名称不能为空'}, {validator: Validate.checkWordLen15,message: Validate.warnInfo.wordLen15}],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" disabled={ activeStatus == 2 || activeStatus == 3 || activeStatus == 4 ? true: false } />
                                )}
                            </FormItem>    
                        </Col> 
                        <Col span={12}>
                            <FormItem label="营销描述" {...formItemLayout}>
                                {getFieldDecorator('operateActivityInfo.operateDesc', {
                                    initialValue: operateActivityInfo && operateActivityInfo.operateDesc,
                                    rules: [{ required: activeStatus != 1, message: '营销描述不能为空'}, {validator: Validate.checkWordLen25, message: Validate.warnInfo.wordLen25}],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" disabled={ activeStatus == 2 || activeStatus == 3 || activeStatus == 4 ? true: false }  />
                                )}
                            </FormItem>    
                        </Col>
                        <Col span={12}>
                            <FormItem label="活动时间" {...formItemLayout}>
                                {getFieldDecorator('operateActivityInfo.activeTime', {
                                    initialValue: dateGet,
                                    rules: [{ required: activeStatus != 1, message: Validate.warnInfo.activeTime}],
                                })(
                                    <RangePicker
                                        style={{ width: '100%' }}
                                        format={'YYYY-MM-DD HH:mm:ss'}
                                        disabled={ activeStatus == 2 || activeStatus == 3 || activeStatus == 4 ? true: false }
                                        showTime
                                        getCalendarContainer={trigger => trigger.parentNode}
                                    />
                                )}
                            </FormItem>    
                        </Col>
                        <Col span={12}>
                            <FormItem label="客服电话" {...formItemLayout}>
                                {getFieldDecorator('operateActivityInfo.custmerServicePhone', {
                                    initialValue: operateActivityInfo && operateActivityInfo.custmerServicePhone,
                                    rules: [{ required: activeStatus != 1, message: Validate.warnInfo.custmerServicePhone}, {validator: Validate.checkPhoneAndMobile, message: Validate.warnInfo.custmerPhone}],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" disabled={ activeStatus == 2 || activeStatus == 3 || activeStatus == 4 ? true: false } />
                                )}
                            </FormItem>    
                        </Col>
                        <Col span={12}>
                            <FormItem label="活动及兑奖说明" {...formItemLayout}>
                                {getFieldDecorator('operateActivityInfo.drawDesc', {
                                    initialValue: operateActivityInfo && operateActivityInfo.drawDesc || '',
                                    rules: [{ required: activeStatus != 1, message: '活动及中奖说明不能为空'}, {validator: Validate.checkWordLen500, message: Validate.warnInfo.wordLen500}],
                                })(
                                    <textarea className="des-content" placeholder="请输入" disabled={ activeStatus == 2 || activeStatus == 3 || activeStatus == 4 ? true: false } onChange={(e)=>this.textareaChangeThree(e)}></textarea>
                                )}
                                <p className="des-count">{this.state.activityRemark}/500</p>
                            </FormItem>    
                        </Col>
                        <Col span={12}>
                            <FormItem label="开启中奖公告" {...formItemLayout}>
                                {getFieldDecorator('operateActivityInfo.noticeStatus', {
                                    valuePropName: 'checked',
                                    initialValue: operateActivityInfo && operateActivityInfo.noticeStatus || false,
                                    rules: [{ required: false, message: ''}],
                                })(
                                    <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.openNotice(checked)} disabled={ activeStatus == 2 || activeStatus == 3 || activeStatus == 4 ? true: false } />
                                )}
                            </FormItem>    
                        </Col>
                        <Col span={12}>
                            <FormItem label="开启参与资格限制" {...formItemLayout}>
                                {getFieldDecorator('operateActivityInfo.joinLimit', {
                                    valuePropName: 'checked',
                                    initialValue: operateActivityInfo && operateActivityInfo.joinLimit || false,
                                    rules: [{ required: false, message: ''}],
                                })(
                                    <Switch checkedChildren={'是'} unCheckedChildren={'否'} disabled={ activeStatus == 2 || activeStatus == 3 || activeStatus == 4 ? true: false } />
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