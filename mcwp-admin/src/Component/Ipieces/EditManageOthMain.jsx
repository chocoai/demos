import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import moment from 'moment';
import { Validate } from '../../Config/Validate';
import './style/editManageOther.less';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';

import { DatePicker, Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

/**
 * 进件编辑其他经营信息主要供应商
 * @Author: 赵俊
 * @Date:   2017-05-31
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-25
 */
class EditManageOthMain extends Component {
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
        const { loanBusinessSuppliers } = this.props;
        let dateGet = [];
        if(loanBusinessSuppliers && loanBusinessSuppliers[0] && loanBusinessSuppliers[0].payDate){
            loanBusinessSuppliers.map((item,index)=>{
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
                <p className='ipieces-subtitle'>主要供应商和客户</p>
                {
                    this.state.itemArr.map((item,index)=>(
                        item == 0 ?
                        <Row className='main-business' key={item}>
                            <Col span={12}>
                                <FormItem label="主要供应商" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessSuppliers[' + item + '].cname', {
                                        initialValue: loanBusinessSuppliers && loanBusinessSuppliers[item] && loanBusinessSuppliers[item].cname,
                                        rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="采购比例" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessSuppliers[' + item + '].weigthRate', {
                                        initialValue: loanBusinessSuppliers && loanBusinessSuppliers[item] && loanBusinessSuppliers[item].weigthRate,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimal100, validator: Validate.checkNumDecimal100 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="%" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="付款条件" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessSuppliers[' + item + '].payTerm', {
                                        initialValue: loanBusinessSuppliers && loanBusinessSuppliers[item] && loanBusinessSuppliers[item].payTerm,
                                        rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="往来时间" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessSuppliers[' + item + '].payDate', {
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
                                <FormItem label="主要供应商" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessSuppliers[' + item + '].cname', {
                                        initialValue: loanBusinessSuppliers && loanBusinessSuppliers[item] && loanBusinessSuppliers[item].cname,
                                        rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="采购比例" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessSuppliers[' + item + '].weigthRate', {
                                        initialValue: loanBusinessSuppliers && loanBusinessSuppliers[item] && loanBusinessSuppliers[item].weigthRate,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimal100, validator: Validate.checkNumDecimal100 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="%" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="付款条件" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessSuppliers[' + item + '].payTerm', {
                                        initialValue: loanBusinessSuppliers && loanBusinessSuppliers[item] && loanBusinessSuppliers[item].payTerm,
                                        rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="往来时间" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessSuppliers[' + item + '].payDate', {
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
                    <span className='ipieces-add-detail'>添加供应商</span>
                </div>
                </Form>
            </div>
        )
    }
}

const pureEditManageOthMain = pureRender(EditManageOthMain);

export default pureEditManageOthMain;
