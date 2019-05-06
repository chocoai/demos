import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import moment from 'moment';
import { Validate } from '../../Config/Validate';
import './style/editManageOther.less';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';

import { DatePicker, Form, Input, Row, Col } from 'antd';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;

/**
 * 进件编辑其他经营信息主要客户
 * @Author: 赵俊
 * @Date:   2017-05-31 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-05-31
 */
class EditManageOthCus extends Component {
        constructor(props) {
        super(props);
        this.state = {
            itemArr:[...Array(props.len || 1)].map((_, i)=> i),
            max: props.len || 1
        }
    }

    componentWillMount() {
    }

    //增加
    ipiecesItemAdd = () => {
        let max = this.state.max;
        this.setState({ 
            'itemArr': [...this.state.itemArr, max],
            max: max + 1                
        })
    }
    //删除
    ipiecesItemDelete = (itemDelete) => {
        this.setState({ 'itemArr': [...this.state.itemArr.filter((item,index)=>item != itemDelete)]})
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 16 }
        };
        const { loanBusinessCustomers } = this.props;
        let dateGet = [];
        if(loanBusinessCustomers && loanBusinessCustomers[0] && loanBusinessCustomers[0].payDate){
            loanBusinessCustomers.map((item,index)=>{
                if (item.payDate) {
                    let arr = item.payDate.split(',');
                    dateGet[index] = [];
                    dateGet[index].push(moment(parseInt(arr[0])));
                    dateGet[index].push(moment(parseInt(arr[1])));
                } else {
                    dateGet[index] = [null,null];
                }
            })
        }
        return (
            <div className='editManageOther-container'>
                <Form>
                {
                    this.state.itemArr.map((item,index)=>(
                        item == 0?
                        <Row className='main-business' key={item}>    
                            <Col span={12}>
                                <FormItem label="主要客户" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessCustomers[' + item + '].cname', {
                                        initialValue: loanBusinessCustomers && loanBusinessCustomers[item] && loanBusinessCustomers[item].cname,
                                        rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>    
                            </Col>      
                            <Col span={12}>
                                <FormItem label="销售比例" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessCustomers[' + item + '].weigthRate', {
                                        initialValue: loanBusinessCustomers && loanBusinessCustomers[item] && loanBusinessCustomers[item].weigthRate,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimal100, validator: Validate.checkNumDecimal100 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="%" />
                                    )}
                                </FormItem>    
                            </Col>    
                            <Col span={12}>
                                <FormItem label="付款条件" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessCustomers[' + item + '].payTerm', {
                                        initialValue: loanBusinessCustomers && loanBusinessCustomers[item] && loanBusinessCustomers[item].payTerm,
                                        rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>    
                            </Col>  
                            <Col span={12}>
                                <FormItem label="往来时间" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessCustomers[' + item + '].payDate', {
                                        initialValue: dateGet[item],
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <RangePicker
                                            style={{ width: '100%' }}
                                            getCalendarContainer={trigger => trigger.parentNode}
                                        />
                                    )}
                                </FormItem>    
                            </Col>    
                        </Row>  
                        :
                        <Row className='main-business' key={item}>    
                            <Col span={12}>
                                <FormItem label="主要客户" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessCustomers[' + item + '].cname', {
                                        initialValue: loanBusinessCustomers && loanBusinessCustomers[item] && loanBusinessCustomers[item].cname,
                                        rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>    
                            </Col>      
                            <Col span={12}>
                                <FormItem label="销售比例" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessCustomers[' + item + '].weigthRate', {
                                        initialValue: loanBusinessCustomers && loanBusinessCustomers[item] && loanBusinessCustomers[item].weigthRate,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimal100, validator: Validate.checkNumDecimal100 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="%" />
                                    )}
                                </FormItem>    
                            </Col>    
                            <Col span={12}>
                                <FormItem label="付款条件" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessCustomers[' + item + '].payTerm', {
                                        initialValue: loanBusinessCustomers && loanBusinessCustomers[item] && loanBusinessCustomers[item].payTerm,
                                        rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>    
                            </Col>  
                            <Col span={12}>
                                <FormItem label="往来时间" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessCustomers[' + item + '].payDate', {
                                        initialValue: dateGet[item],
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <RangePicker
                                            style={{ width: '100%' }}
                                            getCalendarContainer={trigger => trigger.parentNode}
                                        />
                                    )}
                                </FormItem>    
                            </Col>    
                            <img className='ipieces-delete' src={ipiecesDelete} alt='delete' onClick={()=>this.ipiecesItemDelete(item)} />
                        </Row>  
                    ))
                }
                    <div className='ipieces-add' onClick={this.ipiecesItemAdd}>
                        <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                        <span className='ipieces-add-detail'>添加客户</span>
                    </div>
                </Form>
            </div>
        )
    }
}

const pureEditManageOthCus = pureRender(EditManageOthCus);

export default pureEditManageOthCus;