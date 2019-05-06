import React, { Component } from 'react'; // 引入了React
import { Validate } from '../../Config/Validate';
import './style/editBase.less';
import './style/slick.less';

import { Form, Input, Col, Select, Switch } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 表单基本单元
 * @Author: 赵俊
 * @Date:   2018-03-09
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-03-09
 */
class CommonForm extends Component {
        constructor(props) {
        super(props);
        this.state = {
        }
    }

    // fieldConfig配置，detailData获取内容，dict字典值，type进件类型,item多个遍历下标
    render() {
        let { getFieldDecorator, fieldConfig, detailData, dict, type, item } = this.props;
        // 增加通用性，如果多选，则取出相应内容
        if (/multi/.test(fieldConfig.type)) detailData = detailData[item]
        // 布局，常见两种
        const formItemLayout = {
            6: {
                labelCol: { span: 12 },
                wrapperCol: { span: 12 }
            },
            12: {
                labelCol: { span: 6 },
                wrapperCol: { span: 18 }
            }
        };
        // 配置存在才渲染
        if (fieldConfig) {
            // 初始值
            let initialValueObj = {}
            // 选择框加单位
            if( detailData && detailData[fieldConfig.detailName] && /select|multiSelect/.test(fieldConfig.type) ) {
                initialValueObj = {
                    initialValue : detailData[fieldConfig.detailName].toString()
                }
            }
            // input,switch,textarea添加初始值
            if( detailData &&　detailData[fieldConfig.detailName] && /input|switch|textarea/i.test(fieldConfig.type) ) {
                initialValueObj = {
                    initialValue : detailData[fieldConfig.detailName]
                }
            }
            // 表单类型,有些是根据type来确定，有些是根据creditOn来确定
            let edit
            if (fieldConfig.switch == 'type') {
                edit = fieldConfig.edit[type]
            } else {
                edit = fieldConfig.edit
            }
            return (
                <Col span={fieldConfig.width}>
                {
                    edit &&  fieldConfig.type == 'input'?
                    <FormItem label={`${fieldConfig.fieldChName}`} {...formItemLayout[fieldConfig.width]}>
                        {getFieldDecorator(`${fieldConfig.formEnName}.${fieldConfig.fieldEnName}`, {
                            ...initialValueObj,
                            rules: [{ required: fieldConfig.isrequire, message: Validate.warnInfo[fieldConfig.message]}],
                            validator: Validate[fieldConfig.validator]
                        })(
                            <Input autoComplete="off" placeholder="请输入" addonAfter={`${fieldConfig.unit}`} />
                        )}
                    </FormItem>:null
                }
                {
                    edit &&  fieldConfig.type == 'multiInput'?
                    <FormItem label={`${fieldConfig.fieldChName}`} {...formItemLayout[fieldConfig.width]}>
                        {getFieldDecorator(`${fieldConfig.formEnName}[${item}].${fieldConfig.fieldEnName}`, {
                            ...initialValueObj,
                            rules: [{ required: fieldConfig.isrequire, message: Validate.warnInfo[fieldConfig.message]}],
                            validator: Validate[fieldConfig.validator]
                        })(
                            <Input autoComplete="off" placeholder="请输入" addonAfter={`${fieldConfig.unit}`} />
                        )}
                    </FormItem>:null
                }
                {
                    // 为选择框同时存在字典值
                    edit && fieldConfig.type == 'select' && dict[fieldConfig.selectDict] ?
                    <FormItem label={`${fieldConfig.fieldChName}`} {...formItemLayout[fieldConfig.width]}>
                        {getFieldDecorator(`${fieldConfig.formEnName}.${fieldConfig.fieldEnName}`, {
                            ...initialValueObj,
                            rules: [{ required: fieldConfig.isrequire, message: Validate.warnInfo[fieldConfig.message]}],
                            validator: Validate[fieldConfig.validator]
                        })(
                            <Select
                                placeholder="请选择"
                                allowClear = {true}
                                style={{ width: '100%' }}
                                getPopupContainer={trigger => trigger.parentNode}
                                >
                                {
                                     dict[fieldConfig.selectDict].map((item,index)=>(
                                        <Option key={index} value={item.ddValue}>{`${item.ddText}${fieldConfig.unit}`}</Option>
                                    ))
                                }
                            </Select>
                        )}
                    </FormItem>:null
                }
                {
                    // 为选择框同时存在字典值
                    edit && fieldConfig.type == 'multiSelect' && dict[fieldConfig.selectDict] ?
                    <FormItem label={`${fieldConfig.fieldChName}`} {...formItemLayout[fieldConfig.width]}>
                        {getFieldDecorator(`${fieldConfig.formEnName}[${item}].${fieldConfig.fieldEnName}`, {
                            ...initialValueObj,
                            rules: [{ required: fieldConfig.isrequire, message: Validate.warnInfo[fieldConfig.message]}],
                            validator: Validate[fieldConfig.validator]
                        })(
                            <Select
                                placeholder="请选择"
                                allowClear = {true}
                                style={{ width: '100%' }}
                                getPopupContainer={trigger => trigger.parentNode}
                                >
                                {
                                     dict[fieldConfig.selectDict].map((item,index)=>(
                                        <Option key={index} value={item.ddValue}>{`${item.ddText}${fieldConfig.unit}`}</Option>
                                    ))
                                }
                            </Select>
                        )}
                    </FormItem>:null
                }
                {
                    edit &&  fieldConfig.type == 'multiSwitch'?
                    <FormItem label={`${fieldConfig.fieldChName}`} {...formItemLayout[fieldConfig.width]}>
                        {getFieldDecorator(`${fieldConfig.formEnName}[${item}].${fieldConfig.fieldEnName}`, {
                            ...initialValueObj,
                            valuePropName: 'checked',
                            rules: [{ required: fieldConfig.isrequire}]
                        })(
                            <Switch checkedChildren={'是'} unCheckedChildren={'否'} />
                        )}
                    </FormItem>:null
                }
                {
                    edit &&  fieldConfig.type == 'multiTextarea'?
                    <FormItem label={`${fieldConfig.fieldChName}`} {...formItemLayout[fieldConfig.width]}>
                        {getFieldDecorator(`${fieldConfig.formEnName}[${item}].${fieldConfig.fieldEnName}`, {
                            ...initialValueObj,
                            rules: [{ required: fieldConfig.isrequire, message: Validate.warnInfo[fieldConfig.message]}],
                            validator: Validate[fieldConfig.validator]
                        })(
                            <textarea className="des-content" placeholder="请输入"></textarea>
                        )}
                    </FormItem>:null
                }
                {
                    !edit && fieldConfig.showType != 'whether'?
                    <FormItem label={`${fieldConfig.fieldChName}`} {...formItemLayout[fieldConfig.width]}>
                        <p>{ detailData[fieldConfig.detailName] && `${detailData[fieldConfig.detailName]}${fieldConfig.unit}` || '未录入' }</p>
                    </FormItem>:null
                }
                {
                    !edit && fieldConfig.showType == 'whether'?
                    <FormItem label={`${fieldConfig.fieldChName}`} {...formItemLayout[fieldConfig.width]}>
                        <p>{ detailData[fieldConfig.detailName] ? '是' : '否' }</p>
                    </FormItem>:null
                }
                </Col>
            )
        } else {
            return <Col span={0}></Col>
        }

    }
}

export default CommonForm;
