import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import moment from 'moment';
import { Validate } from '../../Config/Validate';
import './style/editManageStream.less';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';

import { DatePicker, Form, Input, Row, Col, Select } from 'antd';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
/**
 * 进件编辑上下游信息
 * @Author: 钟观发
 * @Date:   2017-09-27 
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-09-27 
 */
class EditManageDownstream extends Component {
        constructor(props) {
        super(props);
        this.state = {
            supplyArr:[...Array(props.supplyLen || 1)].map((_, i)=> i),
            supplyMax: props.supplyLen || 1,
            saleArr:[...Array(props.saleLen || 1)].map((_, i)=> i),
            saleMax: props.saleLen || 1
        }
    }

    componentWillMount() {
    }
    //增加
    ipiecesItemAdd = (type) => {
        if ( type == 'supply') {
            let supplyMax = this.state.supplyMax;
            this.setState({ 
                'supplyArr': [...this.state.supplyArr, supplyMax],
                supplyMax: supplyMax + 1                
            })
        }else {
            let saleMax = this.state.saleMax;
            this.setState({ 
                'saleArr': [...this.state.saleArr, saleMax],
                saleMax: saleMax + 1                
            })
        }
    }
    //删除
    ipiecesItemDelete = (itemDelete,type) => {
        if (type == 'supply') {
            this.setState({ 'supplyArr': [...this.state.supplyArr.filter((item,index)=>item != itemDelete)]})
        }else {
            this.setState({ 'saleArr': [...this.state.saleArr.filter((item,index)=>item != itemDelete)]})
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 16 }
        };
        const { loanDownStream, setMethod} = this.props;
        const supplyBusinessList = loanDownStream.supplyBusinessList;
        const salesBusinessList = loanDownStream.salesBusinessList;
        let supplyData = [];
        if(loanDownStream && supplyBusinessList && loanDownStream.supplyBusinessList[0] && loanDownStream.supplyBusinessList[0].startyear){
            loanDownStream.supplyBusinessList.map((item,index)=>{
                if (item.startyear) {
                    let arr = item.startyear.split(',');
                    supplyData[index] = [];
                    supplyData[index].push(moment(parseInt(arr[0])));
                    supplyData[index].push(moment(parseInt(arr[1])));
                } else {
                    supplyData[index] = [null,null];
                }
            })
        }
        let saleData = [];
        if(loanDownStream && salesBusinessList && loanDownStream.salesBusinessList[0] && loanDownStream.salesBusinessList[0].startyear){
            loanDownStream.salesBusinessList.map((item,index)=>{
                if (item.startyear) {
                    let arr = item.startyear.split(',');
                    saleData[index] = [];
                    saleData[index].push(moment(parseInt(arr[0])));
                    saleData[index].push(moment(parseInt(arr[1])));
                } else {
                    saleData[index] = [null,null];
                }
            })
        }
        return (
            <div className='editManageStream-container'>
                <div className="supply-container">
                    <p className="editManageStream-title">主要供货商和服务商</p>
                    <Form>
                    {
                        this.state.supplyArr.map((item,index)=>(
                            item == 0?
                            <Row className='main-stream' key={item}>    
                                <Col span={12}>
                                    <FormItem label="主要客户" {...formItemLayout}>
                                        {getFieldDecorator('supplyBusinessList[' + item + '].bname', {
                                            initialValue: loanDownStream.supplyBusinessList && loanDownStream.supplyBusinessList[item] && loanDownStream.supplyBusinessList[item].bname,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="合作年限" {...formItemLayout}>
                                        {getFieldDecorator('supplyBusinessList[' + item + '].startyear', {
                                            initialValue: supplyData[item],
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <RangePicker
                                                style={{ width: '100%' }}
                                                getCalendarContainer={trigger => trigger.parentNode}
                                            />
                                        )}
                                    </FormItem>
                                </Col> 
                                <Col span={12}>
                                    <FormItem label="地点" {...formItemLayout}>
                                        {getFieldDecorator('supplyBusinessList[' + item + '].address', {
                                            initialValue: loanDownStream.supplyBusinessList && loanDownStream.supplyBusinessList[item] && loanDownStream.supplyBusinessList[item].address,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="货物" {...formItemLayout}>
                                        {getFieldDecorator('supplyBusinessList[' + item + '].goods', {
                                            initialValue: loanDownStream.supplyBusinessList && loanDownStream.supplyBusinessList[item] && loanDownStream.supplyBusinessList[item].goods,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>  
                                <Col span={12}>
                                    <FormItem label="结算方式" {...formItemLayout}>
                                        {getFieldDecorator('supplyBusinessList[' + item + '].settlementMethod', {
                                            initialValue: loanDownStream.supplyBusinessList && loanDownStream.supplyBusinessList[item] && loanDownStream.supplyBusinessList[item].settlementMethod && loanDownStream.supplyBusinessList[item].settlementMethod.toString(),
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                style={{ width: '100%' }}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                >
                                                {
                                                    setMethod.map((item,index)=>(
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>   
                            </Row>
                            :
                            <Row className='main-stream' key={item}>    
                                <Col span={12}>
                                    <FormItem label="主要客户" {...formItemLayout}>
                                        {getFieldDecorator('supplyBusinessList[' + item + '].bname', {
                                            initialValue: loanDownStream.supplyBusinessList && loanDownStream.supplyBusinessList[item] && loanDownStream.supplyBusinessList[item].bname,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="合作年限" {...formItemLayout}>
                                        {getFieldDecorator('supplyBusinessList[' + item + '].startyear', {
                                            initialValue: supplyData[item],
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <RangePicker
                                                style={{ width: '100%' }}
                                                getCalendarContainer={trigger => trigger.parentNode}
                                            />
                                        )}
                                    </FormItem>
                                </Col> 
                                <Col span={12}>
                                    <FormItem label="地点" {...formItemLayout}>
                                        {getFieldDecorator('supplyBusinessList[' + item + '].address', {
                                            initialValue: loanDownStream.supplyBusinessList && loanDownStream.supplyBusinessList[item] && loanDownStream.supplyBusinessList[item].address,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="货物" {...formItemLayout}>
                                        {getFieldDecorator('supplyBusinessList[' + item + '].goods', {
                                            initialValue: loanDownStream.supplyBusinessList && loanDownStream.supplyBusinessList[item] && loanDownStream.supplyBusinessList[item].goods,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>  
                                <Col span={12}>
                                    <FormItem label="结算方式" {...formItemLayout}>
                                        {getFieldDecorator('supplyBusinessList[' + item + '].settlementMethod', {
                                            initialValue: loanDownStream.supplyBusinessList && loanDownStream.supplyBusinessList[item] && loanDownStream.supplyBusinessList[item].settlementMethod && loanDownStream.supplyBusinessList[item].settlementMethod.toString(),
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                style={{ width: '100%' }}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                >
                                                {
                                                    setMethod.map((item,index)=>(
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>   
                                <img className='stream-delete' src={ipiecesDelete} alt='delete' onClick={()=>this.ipiecesItemDelete(item,'supply')} />     
                            </Row>
                        ))
                    }
                        <div className='ipieces-add' onClick={()=>this.ipiecesItemAdd('supply')}>
                            <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                            <span className='ipieces-add-detail'>添加供货商</span>
                        </div>
                    </Form>
                </div>
                <div className="sale-container">
                    <p className="editManageStream-title">主要销货商和服务商</p>
                    <Form>
                    {
                        this.state.saleArr.map((item,index)=>(
                            item == 0?
                            <Row className='main-stream' key={item}>    
                                <Col span={12}>
                                    <FormItem label="销货商名称" {...formItemLayout}>
                                        {getFieldDecorator('salesBusinessList[' + item + '].bname', {
                                            initialValue: loanDownStream.salesBusinessList && loanDownStream.salesBusinessList[item] && loanDownStream.salesBusinessList[item].bname,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="合作年限" {...formItemLayout}>
                                        {getFieldDecorator('salesBusinessList[' + item + '].startyear', {
                                            initialValue: saleData[item],
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <RangePicker
                                                style={{ width: '100%' }}
                                                getCalendarContainer={trigger => trigger.parentNode}
                                            />
                                        )}
                                    </FormItem>
                                </Col> 
                                <Col span={12}>
                                    <FormItem label="地点" {...formItemLayout}>
                                        {getFieldDecorator('salesBusinessList[' + item + '].address', {
                                            initialValue: loanDownStream.salesBusinessList && loanDownStream.salesBusinessList[item] && loanDownStream.salesBusinessList[item].address,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="货物" {...formItemLayout}>
                                        {getFieldDecorator('salesBusinessList[' + item + '].goods', {
                                            initialValue: loanDownStream.salesBusinessList && loanDownStream.salesBusinessList[item] && loanDownStream.salesBusinessList[item].goods,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>  
                                <Col span={12}>
                                    <FormItem label="结算方式" {...formItemLayout}>
                                        {getFieldDecorator('salesBusinessList[' + item + '].settlementMethod', {
                                            initialValue: loanDownStream.salesBusinessList && loanDownStream.salesBusinessList[item] && loanDownStream.salesBusinessList[item].settlementMethod && loanDownStream.salesBusinessList[item].settlementMethod.toString(),
                                            rules: [{ required: false, message: ''}],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                style={{ width: '100%' }}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                >
                                                {
                                                    setMethod.map((item,index)=>(
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>   
                            </Row>
                            :
                            <Row className='main-stream' key={item}>    
                                <Col span={12}>
                                    <FormItem label="主要客户" {...formItemLayout}>
                                        {getFieldDecorator('salesBusinessList[' + item + '].bname', {
                                            initialValue: loanDownStream.salesBusinessList && loanDownStream.salesBusinessList[item] && loanDownStream.salesBusinessList[item].bname,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="合作年限" {...formItemLayout}>
                                        {getFieldDecorator('salesBusinessList[' + item + '].startyear', {
                                            initialValue: saleData[item],
                                            rules: [{ required: false, message: ''}],
                                        })(
                                            <RangePicker
                                                style={{ width: '100%' }}
                                                getCalendarContainer={trigger => trigger.parentNode}
                                            />
                                        )}
                                    </FormItem>
                                </Col> 
                                <Col span={12}>
                                    <FormItem label="地点" {...formItemLayout}>
                                        {getFieldDecorator('salesBusinessList[' + item + '].address', {
                                            initialValue: loanDownStream.salesBusinessList && loanDownStream.salesBusinessList[item] && loanDownStream.salesBusinessList[item].address,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="货物" {...formItemLayout}>
                                        {getFieldDecorator('salesBusinessList[' + item + '].goods', {
                                            initialValue: loanDownStream.salesBusinessList && loanDownStream.salesBusinessList[item] && loanDownStream.salesBusinessList[item].goods,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>  
                                <Col span={12}>
                                    <FormItem label="结算方式" {...formItemLayout}>
                                        {getFieldDecorator('salesBusinessList[' + item + '].settlementMethod', {
                                            initialValue: loanDownStream.salesBusinessList && loanDownStream.salesBusinessList[item] && loanDownStream.salesBusinessList[item].settlementMethod && loanDownStream.salesBusinessList[item].settlementMethod.toString(),
                                            rules: [{ required: false, message: ''}],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                style={{ width: '100%' }}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                >
                                                {
                                                    setMethod.map((item,index)=>(
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>   
                                <img className='stream-delete' src={ipiecesDelete} alt='delete' onClick={()=>this.ipiecesItemDelete(item,'sale')} />     
                            </Row>
                        ))
                    }
                        <div className='ipieces-add' onClick={()=>this.ipiecesItemAdd('sale')}>
                            <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                            <span className='ipieces-add-detail'>添加销货商</span>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

const pureEditManageDownstream = pureRender(EditManageDownstream);

export default pureEditManageDownstream;