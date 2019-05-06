import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { message } from 'antd';
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import BaseService from '../../Services/BaseService';
import './style/editManageBase.less';

import { Form, Input, Row, Col, Cascader } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑进件职业信息
 * @Author: 钟观发
 * @Date:   2017-12-07
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-12-07
 */
class EditProInfo extends Component {
        constructor(props) {
        super(props);
        this.state = {
            value:'',
            industryArr: [],
            indValue: null,
            cascaderItem: {
                placeholder: '必选项'
            },
            wordCountOne: 0
        }
    }

    componentWillMount() {
        BaseService.getSysDictItems({code: 'jylb'}, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    jylbItems: res.data.jylb
                })
            } else {
                message.error(res.msg);
            }
        })
        let proInfoData = this.props.proInfoData
        if (proInfoData) {
            this.setState({
                indValue: proInfoData.industry,
                wordCountOne: proInfoData.remark && proInfoData.remark.length || 0
            })
        }
    }
    changeInd = (value) => {
        const that = this;
        if (value && value.length > 0) {
            that.setState({
                cascaderItem: {
                    value: value
                }
            });
        } else {
            that.setState({
                cascaderItem: {
                    placeholder: '必选项'
                }
            })
        }
        that.setState({
            industryArr: value,
            indValue: null
        });
        that.props.form.setFieldsValue({
            'industry': value[value.length - 1]
        });
    }
    textareaChangeOne(e) {
        if ( e.target.value.length>256 ) {
            e.target.value = e.target.value.substr(0, 256);
            return;
        }
        this.setState({
            wordCountOne: e.target.value.length
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        };
        // const settings = {
        // };
        const { proInfoData } = this.props;
        let { industryArr, jylbItems, indValue, cascaderItem } = this.state;
        let treeData = [];
        if (jylbItems && jylbItems.length > 0) {
            jylbItems.map((item, index) => {
                let tree = {
                    value: item.ddValue,
                    label: item.ddText
                };
                let cTreeData = [];
                item.dictDTOS.map((cItem, cIndex) => {
                    if (indValue && cItem.ddValue === indValue) {
                        industryArr = [cItem.parentValue, cItem.ddValue];
                    }
                    let cTree = {
                        value:  cItem.ddValue,
                        label: cItem.ddText
                    };
                    cTreeData.push(cTree);
                });
                tree.children = cTreeData;
                treeData.push(tree);
            })
        }
        // let treeData = [];
        return (
            <div className='editManageBase-container'>
                <Form>
                    <p className='ipieces-subtitle'>职业信息</p>
                    <Row>
                        <Col span={12}>
                            <FormItem label="企业名称" {...formItemLayout}>
                                {getFieldDecorator('corpName', {
                                    initialValue: proInfoData && proInfoData.corpName || '',
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="联系电话" {...formItemLayout}>
                                {getFieldDecorator('telephone', {
                                    initialValue: proInfoData && proInfoData.telephone || '',
                                    rules: [{ required: true, message: Validate.warnInfo.phoneNum, validator: Validate.checkPhoneNumAndNotNull }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} style={{display: 'none'}}>
                            <FormItem label="所属行业" {...formItemLayout}>
                                {getFieldDecorator('industry', {
                                    initialValue: proInfoData && proInfoData.industry || '',
                                    rules: [{ required: false, }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="所属行业" {...formItemLayout}>
                            <div className="tree-select">
                                {industryArr.length > 0 ? <Cascader
                                    size={'large'}
                                    options={treeData}
                                    onChange={this.changeInd}
                                    value={industryArr}
                                    allowClear
                                    // disabled={ code ? true : false }
                                    changeOnSelect
                                    getPopupContainer={trigger => trigger.parentNode} /> : <Cascader
                                    size={'large'}
                                    options={treeData}
                                    onChange={this.changeInd}
                                    allowClear
                                    changeOnSelect
                                    getPopupContainer={trigger => trigger.parentNode}
                                    {...cascaderItem} />
                                }
                                {/* {industryArr.length > 0 ? <Cascader
                                    size={'large'}
                                    options={treeData}
                                    onChange={this.changeInd}
                                    value={industryArr}
                                    allowClear
                                    disabled={ code ? true : false }
                                    changeOnSelect
                                    getPopupContainer={trigger => trigger.parentNode} /> : <Cascader
                                    size={'large'}
                                    options={treeData}
                                    onChange={this.changeInd}
                                    allowClear
                                    changeOnSelect
                                    getPopupContainer={trigger => trigger.parentNode}
                                    {...cascaderItem} />
                                }  */}
                            </div>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="月收入" {...formItemLayout}>
                                {getFieldDecorator('salaryMonth', {
                                    initialValue: proInfoData && proInfoData.salaryMonth || '',
                                    rules: [{ required: false, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="经营地址" {...formItemLayout}>
                                {getFieldDecorator('address', {
                                    initialValue: proInfoData && proInfoData.address || '',
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="主营业务或职务" {...formItemLayout}>
                                {getFieldDecorator('mainBusiness', {
                                    initialValue: proInfoData && proInfoData.mainBusiness || '',
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="收入所得结构" {...formItemLayout}>
                                {getFieldDecorator('structOfSalary', {
                                    initialValue: proInfoData && proInfoData.structOfSalary || '',
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="备注" {...formItemLayout}>
                                {getFieldDecorator('remark', {
                                    initialValue: proInfoData && proInfoData.remark || '',
                                    rules: [{ required: false, message: '' }],
                                })(
                                    <textarea className="des-content" placeholder="请输入" onChange={(e)=>this.textareaChangeOne(e)}></textarea>
                                )}
                                    <p className="des-count">{this.state.wordCountOne}/256</p>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

const pureEditProInfo = pureRender(EditProInfo);

export default pureEditProInfo;
