import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import './style/editManageTrend.less';

import { Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑生产情况分析发展趋势
 * @Author: 赵俊
 * @Date:   2017-05-31 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-25
 */
class EditManageTrend extends Component {
        constructor(props) {
        super(props);
        this.state = {
            year:[2015,2016,2017]
        }
    }

    componentWillMount() {
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 16 }
        };
        const { loanBusinessDevpTrends } = this.props;
        return (
            <div className='editManageTrend-container'>
                <Form>
                    <p className='ipieces-subtitle'>生产经营发展趋势</p>
                    {
                        this.state.year.map((item,index)=>(
                            <Row className='trend-row' key={index}>
                            <FormItem className='trend-year' label={item + "年"}>
                                {getFieldDecorator('loanBusinessDevpTrends[' + index + '].tyear', {
                                    initialValue: item,
                                    rules: [{ required: false, message: '' }],
                                })(
                                <p></p>
                                )}
                            </FormItem>  
                            <Col span={8}>
                                <FormItem label="机器数量" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessDevpTrends[' + index + '].machineQuantity', {
                                        initialValue: loanBusinessDevpTrends && loanBusinessDevpTrends[index] && loanBusinessDevpTrends[index].machineQuantity,
                                        rules: [{ required: true, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="台" />
                                    )}
                                </FormItem>  
                            </Col> 
                            <Col span={8}>
                                <FormItem label="工人人数" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessDevpTrends[' + index + '].workerQuantity', {
                                        initialValue: loanBusinessDevpTrends && loanBusinessDevpTrends[index] && loanBusinessDevpTrends[index].workerQuantity,
                                        rules: [{ required: true, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="人" />
                                    )}
                                </FormItem>  
                            </Col> 
                            <Col span={8}>
                                <FormItem label="开工天数" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessDevpTrends[' + index + '].days', {
                                        initialValue: loanBusinessDevpTrends && loanBusinessDevpTrends[index] && loanBusinessDevpTrends[index].days,
                                        rules: [{ required: true, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="天" />
                                    )}
                                </FormItem>  
                            </Col> 
                            <Col span={8}>
                                <FormItem label="工资总额" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessDevpTrends[' + index + '].wagesTotal', {
                                        initialValue: loanBusinessDevpTrends && loanBusinessDevpTrends[index] && loanBusinessDevpTrends[index].wagesTotal ,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>  
                            </Col> 
                            <Col span={8}>
                                <FormItem label="营业额" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessDevpTrends[' + index + '].turnover', {
                                        initialValue: loanBusinessDevpTrends && loanBusinessDevpTrends[index] && loanBusinessDevpTrends[index].turnover ,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>  
                            </Col> 
                            <Col span={8}>
                                <FormItem label="利润" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessDevpTrends[' + index + '].profit', {
                                        initialValue: loanBusinessDevpTrends && loanBusinessDevpTrends[index] && loanBusinessDevpTrends[index].profit ,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>  
                            </Col> 
                            <Col span={8}>
                                <FormItem label="存货" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessDevpTrends[' + index + '].stock', {
                                        initialValue: loanBusinessDevpTrends && loanBusinessDevpTrends[index] && loanBusinessDevpTrends[index].stock ,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>  
                            </Col> 
                            <Col span={8}>
                                <FormItem label="应收账款" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessDevpTrends[' + index + '].accountsReceivable', {
                                        initialValue: loanBusinessDevpTrends && loanBusinessDevpTrends[index] && loanBusinessDevpTrends[index].accountsReceivable ,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>  
                            </Col> 
                            <Col span={8}>
                                <FormItem label="应付账款" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessDevpTrends[' + index + '].accountsPayable', {
                                        initialValue: loanBusinessDevpTrends && loanBusinessDevpTrends[index] && loanBusinessDevpTrends[index].accountsPayable ,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>  
                            </Col> 
                            </Row>  
                        ))
                    }
                </Form>
            </div>
        )
    }
}

const pureEditManageTrend = pureRender(EditManageTrend);

export default pureEditManageTrend;