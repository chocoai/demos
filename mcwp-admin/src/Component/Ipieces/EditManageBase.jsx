import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { message } from 'antd';
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import CarouselImg from './CarouselImg';
import './style/editManageBase.less';

import { Form, Input, Row, Col, Switch, Select,Cascader } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 进件编辑进件基本信息主体基本信息
 * @Author: 赵俊
 * @Date:   2017-05-31 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-25
 */
class EditManageBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
    }

    componentWillMount() {
    }
    getPictureBusBase = () => {  // 主营信息查看文件
        let code = this.props.code;
        Config.get('/v1/oss/' + code + '/LOAN_BUSIBASE/*', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                if (res.data && res.data.LOAN_BUSIBASE && res.data.LOAN_BUSIBASE.length) {
                    this.setState({
                        pictureInfo: res.data.LOAN_BUSIBASE,
                        preview: true
                    });
                } else {
                    message.error(Config.warnInfo.uploadImg);
                }
            } else {
                message.error(res.msg);
            }
        });
    }
    previewHide = () => {
        this.setState({
            preview: false,
            pictureInfo: ''
        })
    }
    changeInd=(value)=>{
        console.log(value)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        };
        const { loanBusinessEntity, loanBusinessBase, openUploadImg, type, nsr, jylb, flxs } = this.props;
        let treeData = [];
        let industryArr;
		if (jylb && jylb.length > 0) {
			jylb.map((item, index) => {
				let tree = {
					value: item.ddValue,
					label: item.ddText
				};
				let cTreeData = [];
				item.dictDTOS.map((cItem, cIndex) => {
					if (loanBusinessEntity && loanBusinessEntity.scope && cItem.ddValue == loanBusinessEntity.scope) {
						industryArr = [cItem.parentValue, loanBusinessEntity.scope];
					}
					let cTree = {
						value: cItem.ddValue,
						label: cItem.ddText
					};
					cTreeData.push(cTree);
				});
				tree.children = cTreeData;
				treeData.push(tree);
			})
        }
        // console.log(treeData)
        let arr = [];
        // let dataTime = null, arr =[];
        // if ( loanBusinessEntity && loanBusinessEntity.openingTime ) {
        //     dataTime = moment(parseInt(loanBusinessEntity.openingTime))
        // }
        if (loanBusinessEntity && loanBusinessEntity.field) {
            arr = loanBusinessEntity.field.split(',')
        }
        const { pictureInfo } = this.state
        return (
            <div className='editManageBase-container'>
                <Form>
                    <p className='ipieces-subtitle'>经营主体基本信息
                    <span className='ipieces-subtitle-attachment' onClick={this.getPictureBusBase}>查看文件</span>
                        <span className='ipieces-subtitle-attachment' onClick={() => openUploadImg(Config.bizType.loanBusiBase)}>添加文件</span>
                    </p>
                    <Row>
                        <Col span={12}>
                            {type == 6 ? <FormItem label="企业名称" {...formItemLayout}>
                                {getFieldDecorator('loanBusinessEntityDto.name', {
                                    initialValue: loanBusinessEntity && loanBusinessEntity.name,
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem> : <FormItem label="企业名称" {...formItemLayout}>
                                    {/*{getFieldDecorator('loanBusinessEntityDto.name', {
                            rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                        })(*/}
                                    <p>{loanBusinessEntity && loanBusinessEntity.name || '未录入'}</p>
                                    {/*)}*/}
                                </FormItem>}
                        </Col>
                        {
                            loanBusinessEntity && arr.indexOf('employeeNumber') != -1 ?
                                type == 6 ? <Col span={12}>
                                    <FormItem label="雇佣人数" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessEntityDto.employeeNumber', {
                                            initialValue: loanBusinessEntity && loanBusinessEntity.employeeNumber || '',
                                            rules: [{ required: true, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="人" />
                                        )}
                                    </FormItem>
                                </Col> :
                                    <Col span={12}>
                                        <FormItem label="雇佣人数" {...formItemLayout}>
                                            {/*{getFieldDecorator('loanBusinessEntityDto.employeeNumber', {
                                rules: [{ required: false, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                            })(*/}
                                            <p>{loanBusinessEntity && loanBusinessEntity.employeeNumber}人</p>
                                            {/*)}*/}
                                        </FormItem>
                                    </Col> :
                                <Col span={12}>
                                    <FormItem label="雇佣人数" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessEntityDto.employeeNumber', {
                                            initialValue: loanBusinessEntity && loanBusinessEntity.employeeNumber || '',
                                            rules: [{ required: true, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="人" />
                                        )}
                                    </FormItem>
                                </Col>
                        }
                        <Col span={12}>
                            <FormItem label="联系方式" {...formItemLayout}>
                                {getFieldDecorator('loanBusinessEntityDto.telephone', {
                                    initialValue: loanBusinessEntity && loanBusinessEntity.telephone,
                                    rules: [{ required: true, message: Validate.warnInfo.phoneNum, validator: Validate.checkPhoneNum }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        {
                            loanBusinessEntity && arr.indexOf('license') != -1 ?
                                type == 6 ? <Col span={12}>
                                    <FormItem label="营业执照号" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessEntityDto.license', {
                                            initialValue: loanBusinessEntity && loanBusinessEntity.license || '',
                                            rules: [{ required: true, message: Validate.warnInfo.numberLen15, validator: Validate.checkNumberLen15 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col> :
                                    <Col span={12}>
                                        <FormItem label="营业执照号" {...formItemLayout}>
                                            {/*{getFieldDecorator('loanBusinessEntityDto.license', {
                                rules: [{ required: false,  message: Validate.warnInfo.wordLen15, validator: Validate.checkWordLen15 }],
                            })(*/}
                                            <p>{loanBusinessEntity && loanBusinessEntity.license || '未录入'}</p>
                                            {/*)}*/}
                                        </FormItem>
                                    </Col> :
                                <Col span={12}>
                                    <FormItem label="营业执照号" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessEntityDto.license', {
                                            initialValue: loanBusinessEntity && loanBusinessEntity.license || '',
                                            rules: [{ required: true, message: Validate.warnInfo.numberLen15, validator: Validate.checkNumberLen15 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                        }
                        {
                            loanBusinessEntity && arr.indexOf('legalPerson') != -1 ?
                                type == 6 ? <Col span={12}>
                                    <FormItem label="法人代表" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessEntityDto.legalPerson', {
                                            initialValue: loanBusinessEntity && loanBusinessEntity.legalPerson || '',
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col> :
                                    <Col span={12}>
                                        <FormItem label="法人代表" {...formItemLayout}>
                                            {/*{getFieldDecorator('loanBusinessEntityDto.legalPerson', {
                                rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                            })(*/}
                                            <p>{loanBusinessEntity && loanBusinessEntity.legalPerson}</p>
                                            {/*)}*/}
                                        </FormItem>
                                    </Col> :
                                <Col span={12}>
                                    <FormItem label="法人代表" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessEntityDto.legalPerson', {
                                            initialValue: loanBusinessEntity && loanBusinessEntity.legalPerson || '',
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                                </Col>
                        }
                        <Col span={12}>
                            {type == 6 ? <FormItem label="年收入" {...formItemLayout}>
                                {getFieldDecorator('loanBusinessEntityDto.annualIncome', {
                                    initialValue: loanBusinessEntity && loanBusinessEntity.annualIncome||undefined,
                                    rules: [{ required: false, message: '' }],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        style={{ width: '100%' }}
                                        getPopupContainer={trigger => trigger.parentNode}
                                    >
                                        {
                                            nsr && nsr.map((item, index) => (
                                                <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem> : <FormItem label="年收入" {...formItemLayout}>
                                    {/*{getFieldDecorator('loanBusinessEntityDto.name', {
                            rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                        })(*/}
                                    <p>{loanBusinessBase && loanBusinessBase.annualIncomeText || '未录入'}</p>
                                    {/*)}*/}
                                </FormItem>}
                        </Col>
                        {
                            loanBusinessEntity && arr.indexOf('legalForm') != -1 ?
                                type == 6 ? <Col span={12}>
                                    <FormItem label="法律形式" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessEntityDto.legalForm', {
                                            initialValue: loanBusinessEntity && loanBusinessEntity.legalForm || undefined,
                                            rules: [{ required: false }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                style={{ width: '100%' }}
                                                getPopupContainer={trigger => trigger.parentNode}
                                            >
                                                {
                                                    flxs && flxs.map((item, index) => (
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col> :
                                    <Col span={12}>
                                        <FormItem label="法律形式" {...formItemLayout}>
                                            {/*{getFieldDecorator('loanBusinessEntityDto.legalForm', {
                                rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                            })(*/}
                                            <p>{loanBusinessEntity && loanBusinessEntity.legalForm}</p>
                                            {/*)}*/}
                                        </FormItem>
                                    </Col> :
                                <Col span={12}>
                                    <FormItem label="法律形式" {...formItemLayout}>
                                        {getFieldDecorator('loanBusinessEntityDto.legalForm', {
                                            initialValue: loanBusinessEntity && loanBusinessEntity.legalForm || undefined,
                                            rules: [{ required: false }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                style={{ width: '100%' }}
                                                getPopupContainer={trigger => trigger.parentNode}
                                            >
                                                {
                                                    flxs && flxs.map((item, index) => (
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                        }
                        <Col span={12}>
                            <FormItem label="经营时间" {...formItemLayout}>
                                {getFieldDecorator('loanBusinessEntityDto.operationTime', {
                                    initialValue: loanBusinessEntity && loanBusinessEntity.operationTime,
                                    rules: [{ required: false, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter='个月' />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            {type == 6 ? <FormItem label="是否工商注册" {...formItemLayout} style={{ marginBottom: '22px' }}>
                                {getFieldDecorator('loanBusinessEntityDto.isbusiregis', {
                                    valuePropName: 'checked',
                                    initialValue: loanBusinessEntity && loanBusinessEntity.isbusiregis||false,
                                    rules: [{ required: false, message: '' }],
                                })(
                                    <Switch checkedChildren={'是'} unCheckedChildren={'否'} />
                                )}
                            </FormItem> :
                                <FormItem label="是否工商注册" {...formItemLayout}>
                                    {/*{getFieldDecorator('loanBusinessEntityDto.name', {
                            rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                        })(*/}
                                    <p>{loanBusinessEntity && loanBusinessEntity.isbusiregis && loanBusinessEntity.isbusiregis == 0 ? '否' : '是'}</p>
                                    {/*)}*/}
                                </FormItem>}
                        </Col>
                        <Col span={12}>
                            {type == 6 ? <FormItem label="所属行业" {...formItemLayout}>
                                {getFieldDecorator('loanBusinessEntityDto.scope', {
                                    initialValue: industryArr||undefined,
                                    rules: [{ required: false, message: '' }],
                                })(
                                    // <Select
                                    //     placeholder="请选择"
                                    //     style={{ width: '100%' }}
                                    //     getPopupContainer={trigger => trigger.parentNode}
                                    // >
                                    //     {
                                    //         smdsshy && smdsshy.map((item, index) => (
                                    //             <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                    //         ))
                                    //     }
                                    // </Select>
                                    <Cascader
									// style={{ width: 300 }}
									key="Cascader_1"
									// expandTrigger="hover"
									size={'large'}
									options={treeData}
									onChange={this.changeInd}
									allowClear
                                    placeholder="请选择"
									getPopupContainer={trigger => trigger.parentNode}/>
                                )}
                            </FormItem> : <FormItem label="所属行业" {...formItemLayout}>
                                    {/*{getFieldDecorator('loanBusinessEntityDto.scope', {
                            rules: [{ required: false, message: '' }],
                        })(*/}
                                    <p>{loanBusinessEntity && loanBusinessEntity.scope || '未录入'}</p>
                                    {/*)}*/}
                                </FormItem>}

                        </Col>
                        <Col span={12}>
                            <FormItem label="经营场所所有权" {...formItemLayout}>
                                {getFieldDecorator('loanBusinessEntityDto.businessPlace', {
                                    initialValue: loanBusinessEntity && loanBusinessEntity.businessPlace,
                                    rules: [{ required: true, message: Validate.warnInfo.wordLen10, validator: Validate.checkWordLen10 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="经营场所面积" {...formItemLayout}>
                                {getFieldDecorator('loanBusinessEntityDto.operationArea', {
                                    initialValue: loanBusinessEntity && loanBusinessEntity.operationArea,
                                    rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="平" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            {type == 6 ? <FormItem label="工作地址" {...formItemLayout}>
                                {getFieldDecorator('loanBusinessEntityDto.address', {
                                    initialValue: loanBusinessEntity && loanBusinessEntity.address,
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem> : <FormItem label="工作地址" {...formItemLayout}>
                                    {/*{getFieldDecorator('loanBusinessEntityDto.name', {
                            rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                        })(*/}
                                    <p>{loanBusinessEntity && loanBusinessEntity.address || '未录入'}</p>
                                    {/*)}*/}
                                </FormItem>}
                        </Col>
                    </Row>
                </Form>
                <CarouselImg pictureInfo={pictureInfo} previewPic={this.state.preview} previewHide={this.previewHide} />
            </div>
        )
    }
}

const pureEditManageBase = pureRender(EditManageBase);

export default pureEditManageBase;