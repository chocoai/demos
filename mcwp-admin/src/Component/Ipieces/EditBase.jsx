import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { message } from 'antd';
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';
import CommonForm from './CommonForm'
import CarouselImg from './CarouselImg'
import './style/editBase.less';
import './style/slick.less';

import { Form, Input, Row, Col, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


/**
 * 进件编辑基本信息
 * @Author: 赵俊
 * @Date:   2017-05-31
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-06
 */
class EditBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictureInfo: '',
            picturePerson: '',
            pictureSpouse: '',
            pictureFamily: '',
            preview: false,
            riskArr: [...Array(props.len || 1)].map((_, i) => i),
            max: props.len || 1,
            homeInfoRemark: props.baseData.loanHomeInfo && props.baseData.loanHomeInfo.remark ? props.baseData.loanHomeInfo.remark.length : 0,
            BaseInfoConfig: props.baseData.fieldConfigMerge
        }
    }

    // componentWillMount() {
    // this.getPictureInfo();
    // this.getPictureSpouse();
    // this.getPictureFamily();
    // }

    // /LOAN_PERSON_IDENTITY_FRONT,LOAN_PERSON_IDENTITY_BACK,LOAN_PERSON_IDENTITY_FACE,LOAN_PERSON_HOUSEHOLD,LOAN_PERSON_MARRICERT,LOAN_PERSON_EDUCERT,LOAN_PERSON_GRADUCERT
    getPictureInfo = (type) => {  // 照片信息
        let code = this.props.code;
        Config.get('/v1/oss/' + code + '/LOAN_PERSON,LOAN_SPOUSE,LOAN_EMERGENCY_CONTRACT,LOAN_FAMILY/*', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                if (!(res.data[type] && res.data[type].length)) return message.error(Config.warnInfo.uploadImg);
                this.setState({
                    pictureInfo: res.data[type],
                    preview: true
                    // picturePerson: res.data.LOAN_PERSON,
                    // pictureSpouse: res.data.LOAN_SPOUSE,
                    // pictureFamily: res.data.LOAN_FAMILY
                });
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

    //增加风险点
    ipiecesItemAdd = () => {
        let max = this.state.max;
        this.setState({
            riskArr: [...this.state.riskArr, max],
            max: max + 1
        })
    }
    //删除
    ipiecesItemDelete = (itemDelete) => {
        this.setState({ 'riskArr': [...this.state.riskArr.filter((item, index) => item != itemDelete)] })
    }
    personCreditOpen = (personCredit) => {
        personCredit.map((item, index) => {
            window.open(item['srcUrl'])
        })
    }
    textareaChangeThree(e) {
        if (e.target.value.length > 256) {
            e.target.value = e.target.value.substr(0, 256);
        }
        this.setState({
            homeInfoRemark: e.target.value.length
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formMinItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        };
        const formMidItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
        };
        const formItemLayoutRemark = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };
        const formTextareaLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const formMaxItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 }
        }
        // userAction
        const { baseData, topInfo, education, personCredit, repaymentPeriod, relationship , repaymentKind, znqkKind, showPicture, hyzkKind, openUploadImg } = this.props;
        let childrenInfoObj = {};
        if (baseData.loanHomeInfo && baseData.loanHomeInfo.childrenInfo) {
            childrenInfoObj = {
                initialValue: baseData.loanHomeInfo && baseData.loanHomeInfo.childrenInfo
            }
        }
        const { pictureInfo, BaseInfoConfig } = this.state
        let dict={
            education,
            relationship,
            hyzkKind,
            repaymentPeriod,
            repaymentKind
        }
        let loanRiskPoints = [];
        if(topInfo.loanRiskPoints && topInfo.loanRiskPoints.length > 0) {
            loanRiskPoints = topInfo.loanRiskPoints.filter(function(item) {
                    return item.inputType == 0;
                }
            )
        }
        return (
            <div className='editBase-container'>
                <Form>
                {
                    this.state.riskArr.map((item,index)=>(
                        item == 0 ?
                        <FormItem key={item}  label="风险点" {...formMaxItemLayout}>
                            <div className="ipieces-base-risk">
                                {getFieldDecorator('loanRiskPoints['+ item +'].riskInfo', {
                                    initialValue: loanRiskPoints && loanRiskPoints[item] && loanRiskPoints[item].riskInfo,
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen256, validator: Validate.checkWordLen256 }],
                                })(
                                    <Input className="ipieces-risk-content" autoComplete="off" placeholder="请输入"></Input>
                                )}
                            </div>
                        </FormItem>
                        :
                        <FormItem key={item} className='label-clear' label=" " {...formMaxItemLayout}>
                            <div className='ipieces-base-risk'>
                            {getFieldDecorator('loanRiskPoints['+ item +'].riskInfo', {
                                initialValue: loanRiskPoints && loanRiskPoints[item] && loanRiskPoints[item].riskInfo,
                                rules: [{ required: false, message: Validate.warnInfo.wordLen256, validator: Validate.checkWordLen256 }],
                            })(
                                <Input className="ipieces-risk-content" autoComplete="off" placeholder="请输入"></Input>
                            )}
                                <img className='ipieces-delete' src={ipiecesDelete} alt='delete' onClick={()=>this.ipiecesItemDelete(item)} />
                            </div>
                        </FormItem>
                    ))
                }
                    <div className='ipieces-add' onClick={this.ipiecesItemAdd}>
                        <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                        <span className='ipieces-add-detail'>添加</span>
                    </div>
                    <div className='ipieces-subtitle-container'>
                        <p className='ipieces-subtitle ipieces-subtitle-left' id='customer'>个人信息</p>
                        <div>
                            {
                                personCredit && personCredit.length ?
                                    <span className='ipieces-subtitle-attachment' onClick={() => showPicture('LOAN_PERSON_CREDIT')}>征信报告</span>
                                    : null
                            }
                            <span className='ipieces-subtitle-attachment' onClick={() => openUploadImg(Config.bizType.loanPerson)}>添加文件</span>
                            <span className='ipieces-subtitle-attachment' onClick={() => this.getPictureInfo(Config.bizType.loanPerson)}>查看文件</span>
                        </div>
                    </div>
                    <Row type="flex" justify="start">
                        {
                            Object.values(BaseInfoConfig.loanCustomer).sort((i1, i2) => i1.position - i2.position).map((i, index) =>
                                i.fieldChName?
                                <CommonForm key={index} fieldConfig={i} getFieldDecorator={getFieldDecorator} dict={dict} detailData={baseData.loanCustomer} />
                                :null
                            )
                        }
                    </Row>

                    <div className='ipieces-subtitle-container'>
                        <p className='ipieces-subtitle' id='spouse'>直系亲属信息</p>
                        <div>
                            <span className='ipieces-subtitle-attachment' onClick={() => openUploadImg(Config.bizType.loanSpouse)}>添加文件</span>
                            <span className='ipieces-subtitle-attachment' onClick={() => this.getPictureInfo(Config.bizType.loanSpouse)}>查看文件</span>
                        </div>
                    </div>
                    <Row>
                        {
                            Object.values(BaseInfoConfig.relativeInfo).map((i, index) =>
                                <CommonForm key={index} fieldConfig={i} getFieldDecorator={getFieldDecorator} formData={baseData.loanSpouse && baseData.loanSpouse[i.detailName] || ''} dict={dict} detailData={baseData.loanSpouse} />
                            )
                        }
                    </Row>
                    <div className='ipieces-subtitle-container'>
                        <p className='ipieces-subtitle'>紧急联系人信息</p>
                        <div>
                            <span className='ipieces-subtitle-attachment' onClick={() => openUploadImg(Config.bizType.loanEmergency)}>添加文件</span>
                            <span className='ipieces-subtitle-attachment' onClick={() => this.getPictureInfo(Config.bizType.loanEmergency)}>查看文件</span>
                        </div>
                    </div>
                    <Row>
                        {
                            Object.values(BaseInfoConfig.emergencyContactInfo).map((i, index) =>
                                <CommonForm key={index} fieldConfig={i} getFieldDecorator={getFieldDecorator} formData={baseData.loanSpouse && baseData.loanSpouse[i.detailName] || ''} dict={dict} detailData={baseData.loanSpouse} />
                            )
                        }
                    </Row>
                    <div className='ipieces-subtitle-container'>
                        <p className='ipieces-subtitle'>家庭情况信息</p>
                        <div>
                            <span className='ipieces-subtitle-attachment' onClick={() => openUploadImg(Config.bizType.loanFamily)}>添加文件</span>
                            <span className='ipieces-subtitle-attachment' onClick={() => this.getPictureInfo(Config.bizType.loanFamily)}>查看文件</span>
                        </div>
                    </div>
                    <Row>
                        <Col span={6}>
                            <FormItem label="家庭成员数" {...formMidItemLayout}>
                                {getFieldDecorator('loanHomeInfo.memberNum', {
                                    initialValue: baseData.loanHomeInfo && baseData.loanHomeInfo.memberNum,
                                    rules: [{ required: false, message: Validate.warnInfo.numRange100, validator: Validate.checkNumRange100 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem label="供养人数" {...formMidItemLayout}>
                                {getFieldDecorator('loanHomeInfo.supportNum', {
                                    initialValue: baseData.loanHomeInfo && baseData.loanHomeInfo.supportNum,
                                    rules: [{ required: false, message: Validate.warnInfo.numRange100, validator: Validate.checkNumRange100 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="家庭每月总收入" {...formMinItemLayout}>
                                {getFieldDecorator('loanHomeInfo.income', {
                                    initialValue: baseData.loanHomeInfo && baseData.loanHomeInfo.income,
                                    rules: [{ required: false, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="家庭每月总花销" {...formMinItemLayout}>
                                {getFieldDecorator('loanHomeInfo.totalcost', {
                                    initialValue: baseData.loanHomeInfo && baseData.loanHomeInfo.totalcost,
                                    rules: [{ required: false, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="子女情况" {...formMidItemLayout}>
                                {getFieldDecorator('loanHomeInfo.childrenInfo', {
                                    ...childrenInfoObj,
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen100, validator: Validate.checkWordLen100 }],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        style={{ width: '100%' }}
                                        getPopupContainer={trigger => trigger.parentNode}
                                    >
                                        {
                                            znqkKind && znqkKind.map((item, index) => (
                                                <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                            ))
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="父母情况" {...formTextareaLayout}>
                                {getFieldDecorator('loanHomeInfo.parentInfo', {
                                    initialValue: baseData.loanHomeInfo && baseData.loanHomeInfo.parentInfo,
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen100, validator: Validate.checkWordLen100 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="备注说明" {...formItemLayoutRemark}>
                                <div className="descript-item">
                                    {getFieldDecorator('loanHomeInfo.remark', {
                                        initialValue: baseData.loanHomeInfo && baseData.loanHomeInfo.remark || '',
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen256, validator: Validate.checkWordLen256 }],
                                    })(
                                        <textarea className="des-content" placeholder="请输入" onChange={(e) => this.textareaChangeThree(e)}></textarea>
                                        )}
                                    <p className="des-count">{this.state.homeInfoRemark}/256</p>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <CarouselImg pictureInfo={pictureInfo} previewPic={this.state.preview} previewHide={this.previewHide} />
            </div>
        )
    }
}

const pureEditBase = pureRender(EditBase);

export default pureEditBase;
