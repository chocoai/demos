import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { message } from 'antd';
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';
import CarouselImg from './CarouselImg'
import './style/editBaseTmp.less';
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
            homeInfoRemark: props.baseData && props.baseData.loanHomeInfo && props.baseData.loanHomeInfo.remark ? props.baseData.loanHomeInfo.remark.length : 0
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
            labelCol: { span: 13 },
            wrapperCol: { span: 11 }
        };
        const formMidItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
        };
        const formItemLayoutRemark = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 13 }
        };
        const formItemLayoutMore = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const formTextareaLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        const formMaxItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 }
        }
        // userAction
        const { baseData, topInfo, eduDict, personCredit, repaymentPeriod, relationship, repaymentKind, znqkKind, type, showPicture, hyzkKind, openUploadImg } = this.props;
        let maritalStatusObj = {};
        if (baseData.loanCustomer && baseData.loanCustomer.maritalStatus) {
            maritalStatusObj = {
                initialValue: baseData.loanCustomer && baseData.loanCustomer.maritalStatus
            }
        }
        let educationPersonObj = {};
        if (baseData.loanCustomer && baseData.loanCustomer.education) {
            educationPersonObj = {
                initialValue: baseData.loanCustomer && baseData.loanCustomer.education
            }
        }
        let repaymentPeriodObj = {};
        if (baseData.loanCustomer && baseData.loanCustomer.repaymentPeriod) {
            repaymentPeriodObj = {
                initialValue: baseData.loanCustomer.repaymentPeriod
            }
        }
        let repaymentKindObj = {};
        if (baseData.loanCustomer && baseData.loanCustomer.repaymentKind) {
            repaymentKindObj = {
                initialValue: baseData.loanCustomer.repaymentKind.toString()
            }
        }
        let childrenInfoObj = {};
        if (baseData.loanHomeInfo && baseData.loanHomeInfo.childrenInfo) {
            childrenInfoObj = {
                initialValue: baseData.loanHomeInfo && baseData.loanHomeInfo.childrenInfo
            }
        }
        let educationObj = {};
        if (baseData.loanSpouse && baseData.loanSpouse.education) {
            educationObj = {
                initialValue: baseData.loanSpouse.education.toString()
            }
        }
        let normalRelationshipObj = {};
        if (baseData.loanSpouse && baseData.loanSpouse.relationship) {
            normalRelationshipObj = {
                initialValue: baseData.loanSpouse.relationship.toString()
            }
        }
        let emergencyContactFriendshipObj = {};
        if (baseData.loanSpouse && baseData.loanSpouse.emergencyContactFriendship) {
            emergencyContactFriendshipObj = {
                initialValue: baseData.loanSpouse.emergencyContactFriendship.toString()
            }
        }

        const { pictureInfo } = this.state
        let loanRiskPoints = [];
        if (topInfo.loanRiskPoints && topInfo.loanRiskPoints.length > 0) {
            loanRiskPoints = topInfo.loanRiskPoints.filter(function (item) {
                return item.inputType == 0;
            }
            )
        }
        return (
            <div className='editBaseTmp-container'>
                <Form>
                    {
                        this.state.riskArr.map((item, index) => (
                            item == 0 ?
                                <FormItem key={item} label="风险点" {...formMaxItemLayout}>
                                    <div className="ipieces-base-risk">
                                        {getFieldDecorator('loanRiskPoints[' + item + '].riskInfo', {
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
                                        {getFieldDecorator('loanRiskPoints[' + item + '].riskInfo', {
                                            initialValue: loanRiskPoints && loanRiskPoints[item] && loanRiskPoints[item].riskInfo,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen256, validator: Validate.checkWordLen256 }],
                                        })(
                                            <Input className="ipieces-risk-content" autoComplete="off" placeholder="请输入"></Input>
                                        )}
                                        <img className='ipieces-delete' src={ipiecesDelete} alt='delete' onClick={() => this.ipiecesItemDelete(item)} />
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
                        <Col span={6}>
                            <FormItem label="姓名" {...formItemLayout}>
                                <p>{baseData.loanCustomer && baseData.loanCustomer.handInputName}</p>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="性别" {...formItemLayout}>
                                <p>{baseData.loanCustomer && baseData.loanCustomer.sex}</p>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="年龄" {...formItemLayout}>
                                <p>{baseData.loanCustomer && baseData.loanCustomer.age + '岁'}</p>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="联系方式" {...formItemLayoutMore}>
                                <p>{baseData.loanCustomer && baseData.loanCustomer.telephone || '未录入'}</p>
                            </FormItem>
                        </Col>
                        {
                            type == '6' ?
                                <Col span={12}>
                                    <FormItem label="婚姻状况" {...formItemLayout}>
                                        <p>{baseData.loanCustomer && baseData.loanCustomer.maritalStatusText||'未录入'}</p>
                                    </FormItem>
                                </Col>
                                :
                            <Col span={12}>
                                <FormItem label="婚姻状况" {...formItemLayout}>
                                    {getFieldDecorator('loanCustomer.maritalStatus', {
                                        ...maritalStatusObj,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            style={{ width: '100%' }}
                                            getPopupContainer={trigger => trigger.parentNode}
                                        >
                                            {
                                                hyzkKind && hyzkKind.map((item, index) => (
                                                    <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                ))
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>

                        }
                        {type == 6 ? <Col span={12}>
                            <FormItem label="身份证号" {...formItemLayout}>
                                {getFieldDecorator('loanCustomer.idCardNo', {
                                    initialValue: baseData.loanCustomer && baseData.loanCustomer.idCardNo,
                                    rules: [{ required: false, message: Validate.warnInfo.idCard, validator: Validate.checkIdCard }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col> : <Col span={6}><FormItem label="身份证号" {...formItemLayout}>
                            <p>{baseData.loanCustomer && baseData.loanCustomer.idCardNo || '未录入'}</p>
                        </FormItem></Col>}
                        <Col span={12}>
                            {type == 6 ? <FormItem label="户籍地址" {...formItemLayout}>
                                {getFieldDecorator('loanCustomer.idCardAddr', {
                                    initialValue: baseData.loanCustomer && baseData.loanCustomer.idCardAddr,
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem> : <FormItem label="户籍地址" {...formTextareaLayout}>
                                    <p>{baseData.loanCustomer && baseData.loanCustomer.idCardAddr || '未录入'}</p>
                                </FormItem>}
                        </Col>
                        <Col span={12}>
                            <FormItem label="户籍" {...formItemLayout}>
                                {getFieldDecorator('loanCustomer.censusRegister', {
                                    initialValue: baseData.loanCustomer && baseData.loanCustomer.censusRegister || '',
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="学历" {...formItemLayout}>
                                {getFieldDecorator('loanCustomer.education', {
                                    ...educationPersonObj,
                                    rules: [{ required: false, message: '' }],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        style={{ width: '100%' }}
                                        getPopupContainer={trigger => trigger.parentNode}
                                    >
                                        {
                                            eduDict.map((item, index) => (
                                                <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="申请金额" {...formItemLayout}>
                                {getFieldDecorator('loanCustomer.applyBalance', {
                                    initialValue: baseData.loanCustomer && baseData.loanCustomer.applyBalance,
                                    rules: [{ required: false, message: Validate.warnInfo.numberLenEtwo, validator: Validate.checkNumLenEtwo }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="客户经理预估金额" {...formItemLayout} className='estimate-amount-item'>
                                {getFieldDecorator('loanCustomer.estimateAmount', {
                                    initialValue: baseData.loanCustomer && baseData.loanCustomer.estimateAmount,
                                    rules: [{ required: true, message: '客户经理预估金额不能为空' }, { message: Validate.warnInfo.numberLenEtwo01, validator: Validate.checkNumLenEtwo01 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="万元" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="总项目资金" {...formItemLayout}>
                                {getFieldDecorator('loanCustomer.allBalance', {
                                    initialValue: baseData.loanCustomer && baseData.loanCustomer.allBalance,
                                    rules: [{ required: false, message: Validate.warnInfo.numberLenEtwo, validator: Validate.checkNumLenEtwo }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="万元" />
                                )}
                            </FormItem>
                        </Col>
                        {
                            type==6?<Col span={12}>
                            <FormItem label="还款期数" {...formItemLayout} className='estimate-amount-item'>
                                {getFieldDecorator('loanCustomer.repaymentPeriod', {
                                    ...repaymentPeriodObj,
                                    rules: [{ required: true, message: Validate.warnInfo.nullPeriod }],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        style={{ width: '100%' }}
                                        getPopupContainer={trigger => trigger.parentNode}
                                    >
                                        {
                                            repaymentPeriod && repaymentPeriod.map((item, index) => (
                                                <Option key={index} value={item.ddValue}>{item.ddText && item.ddText + '期'}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>:baseData && baseData.creditOn ?
                                <Col span={12}>
                                    <FormItem label="还款期数" {...formItemLayout}>
                                        {getFieldDecorator('loanCustomer.repaymentPeriod', {
                                            ...repaymentPeriodObj,
                                            rules: [{ required: false, message: '', }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                style={{ width: '100%' }}
                                                getPopupContainer={trigger => trigger.parentNode}
                                            >
                                                {
                                                    repaymentPeriod && repaymentPeriod.map((item, index) => (
                                                        <Option key={index} value={item.ddValue}>{item.ddText && item.ddText + '期'}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col> :
                                <Col span={12}>
                                    <FormItem label="还款期数" {...formItemLayout}>
                                        {getFieldDecorator('loanCustomer.repaymentPeriod', {
                                            ...repaymentPeriodObj,
                                            rules: [{ required: true, message: Validate.warnInfo.nullPeriod }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                style={{ width: '100%' }}
                                                getPopupContainer={trigger => trigger.parentNode}
                                            >
                                                {
                                                    repaymentPeriod && repaymentPeriod.map((item, index) => (
                                                        <Option key={index} value={item.ddValue}>{item.ddText && item.ddText + '期'}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                        }
                        {
                            type==6?<Col span={12}>
                            <FormItem label="还款方式" {...formItemLayout} className='estimate-amount-item'>
                                {getFieldDecorator('loanCustomer.repaymentKind', {
                                    ...repaymentKindObj,
                                    rules: [{ required: true, message: Validate.warnInfo.nullKind }],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        style={{ width: '100%' }}
                                        getPopupContainer={trigger => trigger.parentNode}
                                    >
                                        {
                                            repaymentKind && repaymentKind.map((item, index) => (
                                                <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col> :baseData && baseData.creditOn ?
                                <Col span={12}>
                                    <FormItem label="还款方式" {...formItemLayout}>
                                        {getFieldDecorator('loanCustomer.repaymentKind', {
                                            ...repaymentKindObj,
                                            rules: [{ required: false, message: '', }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                style={{ width: '100%' }}
                                                getPopupContainer={trigger => trigger.parentNode}
                                            >
                                                {
                                                    repaymentKind && repaymentKind.map((item, index) => (
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col> :
                                <Col span={12}>
                                    <FormItem label="还款方式" {...formItemLayout}>
                                        {getFieldDecorator('loanCustomer.repaymentKind', {
                                            ...repaymentKindObj,
                                            rules: [{ required: true, message: Validate.warnInfo.nullKind, }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                style={{ width: '100%' }}
                                                getPopupContainer={trigger => trigger.parentNode}
                                            >
                                                {
                                                    repaymentKind && repaymentKind.map((item, index) => (
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                        }
                        <Col span={12}>
                            <FormItem label="家庭地址" {...formItemLayout}>
                                {getFieldDecorator('loanCustomer.homeAddr', {
                                    initialValue: baseData.loanCustomer && baseData.loanCustomer.homeAddr,
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>


                    <div className='ipieces-subtitle-container'>
                        <p className='ipieces-subtitle' id='spouse'>直系亲属信息</p>
                        <div>
                            <span className='ipieces-subtitle-attachment' onClick={() => openUploadImg(Config.bizType.loanSpouse)}>添加文件</span>
                            <span className='ipieces-subtitle-attachment' onClick={() => this.getPictureInfo(Config.bizType.loanSpouse)}>查看文件</span>
                        </div>
                    </div>
                    <Row>
                        <Col span={12}>
                            {
                                // type == 6 ?
                                // <FormItem label="姓名" {...formItemLayoutMore}>
                                //     <p>{baseData.loanSpouse && baseData.loanSpouse.name || '未录入'}</p>
                                // </FormItem> :
                                    <FormItem label="姓名" {...formItemLayout}>
                                        {getFieldDecorator('loanSpouse.name', {
                                            initialValue: baseData.loanSpouse && baseData.loanSpouse.name,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen15AndNotNull, validator: Validate.checkWordLen15 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                            }
                        </Col>
                        <Col span={12}>
                            {type == 6 ? <FormItem label="年龄" {...formItemLayout}>
                                {getFieldDecorator('loanSpouse.age', {
                                    initialValue: baseData.loanSpouse && baseData.loanSpouse.age,
                                    rules: [{ required: false, message: Validate.warnInfo.numRange100, validator: Validate.checkNumRange100 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="岁" />
                                )}
                            </FormItem> : <FormItem label="年龄" {...formItemLayout}>
                                    <p>{baseData.loanSpouse && baseData.loanSpouse.age && baseData.loanSpouse.age + '岁' || '未录入'}</p>
                                </FormItem>}
                        </Col>
                        <Col span={12}>
                            {type==6?<FormItem label="性别" {...formItemLayout}>
                                {getFieldDecorator('loanSpouse.sex', {
                                    initialValue: baseData.loanSpouse && baseData.loanSpouse.sex||undefined,
                                    rules: [{ required: false, message: '' }],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        allowClear = {true}
                                        getPopupContainer={trigger => trigger.parentNode}
                                    >
                                        <Option value="男">男</Option>
                                        <Option value="女">女</Option>
                                    </Select>
                                )}
                            </FormItem>:<FormItem label="性别" {...formItemLayout}>
                                <p>{baseData.loanSpouse && baseData.loanSpouse.sex || '未录入'}</p>
                            </FormItem>}
                        </Col>
                        <Col span={12}>
                            {
                                // type == 6 ?
                                // <FormItem label="与申请人关系" {...formMidItemLayout}>
                                //     <p>{baseData.loanSpouse && baseData.loanSpouse.relationship && relationship && relationship.filter((item, index) => (item.ddValue == baseData.loanSpouse.relationship))[0]['ddText'] || '未录入'}</p>
                                // </FormItem> :
                                <FormItem label="与申请人关系" {...formItemLayout}>
                                    {getFieldDecorator('loanSpouse.relationship', {
                                        ...normalRelationshipObj,
                                        rules: [{ required: false, message: Validate.warnInfo.selectNotNull }],
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            style={{ width: '100%' }}
                                            getPopupContainer={trigger => trigger.parentNode}
                                        >
                                            {
                                                relationship && relationship.map((item, index) => (
                                                    <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                ))
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            }
                        </Col>
                        <Col span={12}>
                            {
                                type == '6' ?
                                    <FormItem label="身份证号" {...formItemLayout}>
                                        {getFieldDecorator('loanSpouse.idCardNo', {
                                            initialValue: baseData.loanSpouse && baseData.loanSpouse.idCardNo,
                                            rules: [{ required: false, message: Validate.warnInfo.idCard, validator: Validate.checkIdCard }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem> :
                                    <FormItem label="身份证号" {...formItemLayout}>
                                        <p>{baseData.loanSpouse && baseData.loanSpouse.idCardNo || '未录入'}</p>
                                    </FormItem>
                            }
                        </Col>
                        <Col span={12}>
                            {
                                // type == 6 ?
                                // <FormItem label="联系方式" {...formItemLayout}>
                                //     <p>{baseData.loanSpouse && baseData.loanSpouse.telephone || '未录入'}</p>
                                // </FormItem> :
                                    <FormItem label="联系方式" {...formItemLayout}>
                                        {getFieldDecorator('loanSpouse.telephone', {
                                            initialValue: baseData.loanSpouse && baseData.loanSpouse.telephone,
                                            rules: [{ required: false, message: Validate.warnInfo.phoneNum, validator: Validate.checkPhoneNum }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>
                            }
                        </Col>
                        <Col span={12}>
                            <FormItem label="学历" {...formItemLayout}>
                                {getFieldDecorator('loanSpouse.education', {
                                    ...educationObj,
                                    rules: [{ required: false, message: '' }],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        style={{ width: '100%' }}
                                        getPopupContainer={trigger => trigger.parentNode}
                                    >
                                        {
                                            eduDict && eduDict.map((item, index) => (
                                                <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="月收入" {...formItemLayout}>
                                {getFieldDecorator('loanSpouse.income', {
                                    initialValue: baseData.loanSpouse && baseData.loanSpouse.income,
                                    rules: [{ required: false, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <div className='ipieces-subtitle-container'>
                        <p className='ipieces-subtitle'>紧急联系人信息</p>
                        <div>
                            <span className='ipieces-subtitle-attachment' onClick={() => openUploadImg(Config.bizType.loanEmergency)}>添加文件</span>
                            <span className='ipieces-subtitle-attachment' onClick={() => this.getPictureInfo(Config.bizType.loanEmergency)}>查看文件</span>
                        </div>
                    </div>
                    <Row>
                        <Col span={12}>
                            {
                                // type == 6 ?
                                // <FormItem label="姓名" {...formItemLayout}>
                                //     <p>{baseData.loanSpouse && baseData.loanSpouse.emergencyContactName || '未录入'}</p>
                                // </FormItem> : 
                                <FormItem label="姓名" {...formItemLayout}>
                                    {getFieldDecorator('loanSpouse.emergencyContactName', {
                                        initialValue: baseData.loanSpouse && baseData.loanSpouse.emergencyContactName,
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen15AndNotNull, validator: Validate.checkWordLen15 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            }
                        </Col>
                        <Col span={12}>
                            {
                                // type == 6 ?
                                // <FormItem label="联系方式" {...formItemLayout}>
                                //     <p>{baseData.loanSpouse && baseData.loanSpouse.emergencyContactTelephone || '未录入'}</p>
                                // </FormItem> : 
                                <FormItem label="联系方式" {...formItemLayout}>
                                    {getFieldDecorator('loanSpouse.emergencyContactTelephone', {
                                        initialValue: baseData.loanSpouse && baseData.loanSpouse.emergencyContactTelephone,
                                        rules: [{ required: false, message: Validate.warnInfo.phoneNum, validator: Validate.checkPhoneNum }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            }
                        </Col>
                        <Col span={12}>
                            {
                                // type == 6 ?
                                // <FormItem label="与申请人关系" {...formMinItemLayout}>
                                //     <p>{baseData.loanSpouse && baseData.loanSpouse.emergencyContactFriendship && relationship && relationship.filter((item, index) => (item.ddValue == baseData.loanSpouse.emergencyContactFriendship))[0]['ddText'] || '未录入'}</p>
                                // </FormItem> : 
                                <FormItem label="与申请人关系" {...formItemLayout}>
                                    {getFieldDecorator('loanSpouse.emergencyContactFriendship', {
                                        ...emergencyContactFriendshipObj,
                                        rules: [{ required: false, message: Validate.warnInfo.selectNotNull}],
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            style={{ width: '100%' }}
                                            getPopupContainer={trigger => trigger.parentNode}
                                        >
                                            {
                                                relationship && relationship.map((item, index) => (
                                                    <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                ))
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            }
                        </Col>
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
