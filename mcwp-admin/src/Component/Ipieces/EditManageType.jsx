import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import './style/editManageType.less';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';

import { Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑生产情况分析结构分析
 * @Author: 赵俊
 * @Date:   2017-05-31 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-25
 */
class EditManageType extends Component {
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
        const { loanBusinessProductDto } = this.props;
        return (
            <div className='editManageType-container'>
                <Form>
                    <p className='ipieces-subtitle'>主营产品成本结构分析</p>
                    <Row>
                        <Col className='label-profit' span={12}>
                            <FormItem className='profit-item' label='加权利润率' {...formItemLayout}>
                                {/*{getFieldDecorator('loanBusinessOtherDto.productWeighingGrossRate', {
                                    initialValue: loanBusinessProductDto && loanBusinessProductDto.weighingGrossRate ,
                                    rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="%" />
                                )}*/}
                                <p>{ loanBusinessProductDto && loanBusinessProductDto.weighingGrossRate || 0 }%</p>
                            </FormItem>  
                        </Col> 
                    </Row>
                    {
                        this.state.itemArr.map((item,index)=>(
                            item == 0 ?
                            <Row className='trend-row' key={item}>
                                <Col span={12}>
                                    <FormItem label="产品种类" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessMajorDtoList[' + item + '].prdKind', {
                                            initialValue: loanBusinessProductDto && loanBusinessProductDto.loanBusinessMajorDtos && loanBusinessProductDto.loanBusinessMajorDtos[item] && loanBusinessProductDto.loanBusinessMajorDtos[item].prdKind ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>  
                                </Col> 
                                <Col span={6}>
                                    <FormItem label="售价" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessMajorDtoList[' + item + '].price', {
                                            initialValue: loanBusinessProductDto && loanBusinessProductDto.loanBusinessMajorDtos && loanBusinessProductDto.loanBusinessMajorDtos[item] && loanBusinessProductDto.loanBusinessMajorDtos[item].price ,
                                            rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                        )}
                                    </FormItem>  
                                </Col> 
                                <Col span={6}>
                                    <FormItem label="占比" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessMajorDtoList[' + item + '].mrate', {
                                            initialValue: loanBusinessProductDto && loanBusinessProductDto.loanBusinessMajorDtos && loanBusinessProductDto.loanBusinessMajorDtos[item] && loanBusinessProductDto.loanBusinessMajorDtos[item].mrate ,
                                            rules: [{ required: true, message: Validate.warnInfo.numDecimal100, validator: Validate.checkNumDecimal100 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="%" />
                                        )}
                                    </FormItem>  
                                </Col> 
                                <Col span={12}>
                                    <FormItem label={<span className='label-lines'>根据成本结构(或工艺流程)计算的成本</span>} {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessMajorDtoList[' + item + '].cost', {
                                            initialValue: loanBusinessProductDto && loanBusinessProductDto.loanBusinessMajorDtos && loanBusinessProductDto.loanBusinessMajorDtos[item] && loanBusinessProductDto.loanBusinessMajorDtos[item].cost ,
                                            rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>  
                                </Col> 
                            </Row> :
                            <Row className='trend-row' key={item}>
                                <Col span={12}>
                                    <FormItem label="产品种类" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessMajorDtoList[' + item + '].prdKind', {
                                            initialValue: loanBusinessProductDto && loanBusinessProductDto.loanBusinessMajorDtos && loanBusinessProductDto.loanBusinessMajorDtos[item] && loanBusinessProductDto.loanBusinessMajorDtos[item].prdKind ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>  
                                </Col> 
                                <Col span={6}>
                                    <FormItem label="售价" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessMajorDtoList[' + item + '].price', {
                                            initialValue: loanBusinessProductDto && loanBusinessProductDto.loanBusinessMajorDtos && loanBusinessProductDto.loanBusinessMajorDtos[item] && loanBusinessProductDto.loanBusinessMajorDtos[item].price ,
                                            rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                        )}
                                    </FormItem>  
                                </Col> 
                                <Col span={6}>
                                    <FormItem label="占比" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessMajorDtoList[' + item + '].mrate', {
                                            initialValue: loanBusinessProductDto && loanBusinessProductDto.loanBusinessMajorDtos && loanBusinessProductDto.loanBusinessMajorDtos[item] && loanBusinessProductDto.loanBusinessMajorDtos[item].mrate ,
                                            rules: [{ required: true, message: Validate.warnInfo.numDecimal100, validator: Validate.checkNumDecimal100 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="%" />
                                        )}
                                    </FormItem>  
                                </Col> 
                                <Col span={12}>
                                    <FormItem label={<span className='label-lines'>根据成本结构(或工艺流程)计算的成本</span>} {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessMajorDtoList[' + item + '].cost', {
                                            initialValue: loanBusinessProductDto && loanBusinessProductDto.loanBusinessMajorDtos && loanBusinessProductDto.loanBusinessMajorDtos[item] && loanBusinessProductDto.loanBusinessMajorDtos[item].cost ,
                                            rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>  
                                </Col> 
                                <img className='ipieces-delete' src={ipiecesDelete} alt='delete' onClick={()=>this.ipiecesItemDelete(item)} />
                            </Row>
                        ))
                    }
                    <div className='ipieces-add' onClick={this.ipiecesItemAdd}>
                        <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                        <span className='ipieces-add-detail'>添加产品</span>
                    </div>
                </Form>
            </div>
        )
    }
}

const pureEditManageType = pureRender(EditManageType);

export default pureEditManageType;