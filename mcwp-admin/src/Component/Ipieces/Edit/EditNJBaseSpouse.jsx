import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { message, Button, Modal } from 'antd';
import { Config } from '../../../Config/Index';
import CarouselImg from './../CarouselImg'
import { Validate } from '../../../Config/Validate';
import { initOSS, upload, getFileList } from '../../../Config/Oss'
import './../style/editNJBaseSpouse.less';
import './../style/slick.less';
import addImg from '../../../Assets/Images/icon_add--pictures.png';
import { Form, Input, Row, Col, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 南郊房抵贷编辑配偶基本信息
 * @Author: 赵俊
 * @Date:   2018-05-16
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-05-16
 */
class EditNJBaseSpouse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictureInfo: '',
            picturePerson: '',
            pictureSpouse: '',
            pictureFamily: '',
            preview: false,
            homeInfoRemark: props.baseData && props.baseData.loanHomeInfo && props.baseData.loanHomeInfo.remark ? props.baseData.loanHomeInfo.remark.length : 0,
            fileList: null,
            addFileModal: false,
            mRole: [
                {
                    className: 'list listSelected',
                    roleId: 1,
                    select: true,
                    roleNickName: '正常客户'
                },
                {
                    className: 'list',
                    roleId: 2,
                    select: false,
                    roleNickName: '征信白户'
                }
            ],
            selectId: 1,
            finalSelectId: null,
            buttonLoading: false
        }
    }
    componentWillMount() {
        // 暂时放在这，避免所有进件都初始化
        initOSS(this)
        // 拉取，传入code，type，this
        getFileList({ bizCode: this.props.code, bizType: Config.bizType.loanSpouseCredit + ',' + Config.bizType.loanSpouseCreditWhiteIdentity, fileTypes: '*' }, this)
    }
    getFile = (e, type) => {
        if (type == 'pdf') {
            if (e.target.files[0].type.includes('pdf')) {
                upload(e.target.files[0], this.props.code, Config.bizType.loanSpouseCredit, this)
            } else {
                message.error('请上传pdf')
                this.input.value = ''
            }
        }
        if (type == 'img') {
            if (/BMP|JPG|JPEG|PNG|GIF/i.test(e.target.files[0].type)) {
                upload(e.target.files[0], this.props.code, Config.bizType.loanSpouseCreditWhiteIdentity, this)
            } else {
                message.error('请上传图片')
            }
        }
    }
    // /LOAN_PERSON_IDENTITY_FRONT,LOAN_PERSON_IDENTITY_BACK,LOAN_PERSON_IDENTITY_FACE,LOAN_PERSON_HOUSEHOLD,LOAN_PERSON_MARRICERT,LOAN_PERSON_EDUCERT,LOAN_PERSON_GRADUCERT
    getPictureInfo = (type) => {  // 照片信息
        let code = this.props.code;
        let fileType = '/' + Object.values(Config.bizType).join(',')
        Config.get('/v1/oss/' + code + fileType + '/*', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                if (!(res.data[type] && res.data[type].length)) return message.error(Config.warnInfo.uploadImg);
                this.setState({
                    pictureInfo: res.data[type],
                    preview: true
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    // 客户类型修改
    selectRole(selectedRule) {
        const roleId = selectedRule.roleId;
        let mRole = this.state.mRole;              // 现有角色对象
        mRole.map((result) => {
            if (result.roleId != roleId) {
                result.className = 'list';
                result.select = false;
                return
            }
            let select = result.select;   // 选中标记
            if (select) {
                result.className = 'list';
                result.select = false;
            } else {
                result.className = 'list listSelected';
                result.select = true;
            }
        });
        this.setState({
            mRole: [...mRole],
            selectId: roleId
        });
    }
    // 确认征信报告
    creditReport = () => {
        const { code } = this.props
        const { selectId } = this.state
        this.setState({
            buttonLoading: true
        })
        Config.post('/v1/loan/citizen/nj/creditReport/spouse', { code, customerType: selectId }, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    finalSelectId: selectId,
                    buttonLoading: false,
                    addFileModal: false
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    // 打开征信报告上传
    showModal = () => {
        const { baseData } = this.props
        let { mRole, finalSelectId } = this.state
        getFileList({ bizCode: this.props.code, bizType: Config.bizType.loanSpouseCredit + ',' + Config.bizType.loanSpouseCreditWhiteIdentity, fileTypes: '*' }, this)
        if (baseData.loanCustomer.customerType && !finalSelectId) {
            mRole.map(i => {
                if (i.roleId == baseData.loanCustomer.customerType) {
                    i.select = true
                    i.className = 'list listSelected'
                } else {
                    i.select = false
                    i.className = 'list'
                }
            })
            this.setState({
                mRole: [...mRole],
                selectId: baseData.loanCustomer.customerType,
                finalSelectId: baseData.loanCustomer.customerType
            })
        }
        this.setState({
            addFileModal: true
        })
    }
    // 关闭征信报告
    onCancel = () => {
        getFileList({ bizCode: this.props.code, bizType: Config.bizType.loanSpouseCredit + ',' + Config.bizType.loanSpouseCreditWhiteIdentity, fileTypes: '*' }, this)
        this.setState({
            addFileModal: false
        })
    }
    previewHide = () => {
        this.setState({
            preview: false,
            pictureInfo: ''
        })
    }
    personCreditOpen = (personCredit) => {
        personCredit.map((item, index) => {
            window.open(item['srcUrl'])
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { baseData, eduDict, openUploadImg, smdsshy } = this.props;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        };
        let educationObj = {};
        if (baseData.loanSpouse && baseData.loanSpouse.education) {
            educationObj = {
                initialValue: baseData.loanSpouse.education.toString()
            }
        }
        let belongIndustryObj = {};
        if (baseData.loanSpouse && baseData.loanSpouse.belongIndustry) {
            belongIndustryObj = {
                initialValue: baseData.loanSpouse.belongIndustry.toString()
            }
        }
        // let loanSpouse = baseData.loanSpouse
        const { pictureInfo, fileList, addFileModal, mRole, selectId, finalSelectId, buttonLoading } = this.state
        return (
            <div className='editNJBaseSpouse-container'>
                <Form>
                    <div className='ipieces-subtitle-container'>
                        <p className='ipieces-subtitle ipieces-subtitle-left' id='customer'>配偶信息</p>
                        <div>
                            <span className="ipieces-subtitle-attachment" onClick={this.showModal}>添加征信报告</span>
                            <span className='ipieces-subtitle-attachment' onClick={() => openUploadImg(Config.bizType.loanSpouse)}>添加文件</span>
                            <span className='ipieces-subtitle-attachment' onClick={() => this.getPictureInfo(Config.bizType.loanSpouse)}>查看文件</span>
                        </div>
                    </div>
                    <Row className="personal-info-content" type="flex" justify="start">
                        <Col span={12} className="subtitle">
                            <FormItem label="姓名" {...formItemLayout}>
                                {getFieldDecorator('loanSpouse.name', {
                                    initialValue: baseData.loanSpouse && baseData.loanSpouse.name,
                                    rules: [{ required: true, message: Validate.warnInfo.wordLen15AndNotNull, validator: Validate.checkWordLen15AndNotNull }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12} className="subtitle">
                            <FormItem label="学历" {...formItemLayout}>
                                {getFieldDecorator('loanSpouse.education', {
                                    ...educationObj,
                                    rules: [{ required: true, message: '请选择' }],
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
                        <Col span={12} className="subtitle">
                            <FormItem label="身份证号" {...formItemLayout}>
                                {getFieldDecorator('loanSpouse.idCardNo', {
                                    initialValue: baseData.loanSpouse && baseData.loanSpouse.idCardNo,
                                    rules: [{ required: true, message: Validate.warnInfo.idCard, validator: Validate.checkIdCardAndNotNull}],

                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12} className="subtitle">
                            <FormItem label="联系方式" {...formItemLayout}>
                                {getFieldDecorator('loanSpouse.telephone', {
                                    initialValue: baseData.loanSpouse && baseData.loanSpouse.telephone,
                                    rules: [{ required: true, message: Validate.warnInfo.phoneNum, validator: Validate.checkPhoneNumAndNotNull}],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12} className="subtitle">
                            <FormItem label="所属行业" {...formItemLayout}>
                                {getFieldDecorator('loanSpouse.belongIndustry', {
                                    ...belongIndustryObj,
                                    rules: [{ required: true, message: '请选择'}],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        style={{ width: '100%' }}
                                        getPopupContainer={trigger => trigger.parentNode}
                                    >
                                        {
                                            smdsshy && smdsshy.map((item, index) => (
                                                <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                            ))
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12} className="subtitle">
                            <FormItem label="月收入" {...formItemLayout}>
                                {getFieldDecorator('loanSpouse.monthIncome', {
                                    initialValue: baseData.loanSpouse && baseData.loanSpouse.monthIncome,
                                    rules: [{ required: false,  message: Validate.warnInfo.monthIncome, validator: Validate.checkMonthIncome }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12} className="subtitle">
                            <FormItem label="当前月还贷金额" {...formItemLayout}>
                                {getFieldDecorator('loanSpouse.monthDebt', {
                                    initialValue: baseData.loanSpouse && baseData.loanSpouse.monthDebt,
                                    rules: [{ required: false, message: Validate.warnInfo.monthDebt, validator: Validate.checkMonthDebt}],

                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12} className="subtitle">
                            <FormItem label="信用卡汇总额度" {...formItemLayout}>
                                {getFieldDecorator('loanSpouse.creditcardSumamt', {
                                    initialValue: baseData.loanSpouse && baseData.loanSpouse.creditcardSumamt,
                                    rules: [{ required: false, message: Validate.warnInfo.creditcardSumamt, validator: Validate.checkcreditcardSumamt }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={24} className="title">
                            {
                                fileList && fileList[Config.bizType.loanSpouseCredit] && (finalSelectId == 1 || (!finalSelectId && baseData.loanCustomer.customerType == 1)) ?
                                    <Row className="upload-file-box">
                                        {
                                            fileList[Config.bizType.loanSpouseCredit].map((info, index) => (
                                                <Col key={index} span={6} className="title">
                                                    <a target="_blank" className="file-url" href={info.srcUrl}>{info.fileName}</a>
                                                </Col>
                                            ))
                                        }
                                    </Row> : null
                            }
                            {
                                fileList && fileList[Config.bizType.loanSpouseCreditWhiteIdentity] && (finalSelectId == 2 || (!finalSelectId && baseData.loanCustomer.customerType == 2)) ?
                                    <Row className="upload-file-box">
                                        {
                                            fileList[Config.bizType.loanSpouseCreditWhiteIdentity].map((info, index) => (
                                                <Col key={index} span={6} className="title">
                                                    <a target="_blank" className="file-url" href={info.srcUrl}>{info.fileName}</a>
                                                </Col>
                                            ))
                                        }
                                    </Row> : null
                            }
                        </Col>
                    </Row>
                </Form>
                <Modal
                    visible={addFileModal}
                    title={`添加征信报告`}
                    onCancel={this.onCancel}
                    footer={null}
                    width={450}
                    wrapClassName="addFileModal-pass-wrapper"
                    key={this.state.passModalKey}
                >
                    <div>
                        <div className='pass-item'>
                            <label htmlFor="authMoney">客户类型</label>
                            <div className="input-wrapper">
                                <div className="select-role">
                                    {
                                        mRole.map(item =>
                                            <div className={item.className} key={item.roleId} onClick={() => this.selectRole(item)}>{item.roleNickName}</div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='pass-item' style={{ display: selectId == 1 ? 'flex' : 'none' }}>
                            <label htmlFor="dailyRate">征信报告</label>
                            <div className="input-wrapper">
                                <input className="pass-input" type="file" ref={input => { this.input = input }} onChange={(e) => this.getFile(e, 'pdf')} placeholder="文件名称" />
                            </div>
                        </div>
                        <div className='pass-item pass-item-img' style={{ display: selectId == 2 ? 'flex' : 'none' }}>
                            <label className="img-result">报告结果</label>
                            <div className="input-wrapper input-wrapper-img">
                                <div className="img">
                                    <input type="file" className="file" onChange={this.putImgButton} ref="img" onChange={(e) => this.getFile(e, 'img')} />
                                    <div className="addImg"><img className='addImgPic' src={fileList && fileList[Config.bizType.loanSpouseCreditWhiteIdentity] ? fileList[Config.bizType.loanSpouseCreditWhiteIdentity][0].srcUrl : addImg} alt="addImgPic" /> </div>
                                </div>
                                <p className='img-info'>上传信用报告查询结果，只能上传一张照片</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button key="ok" type="primary" size="large" loading={buttonLoading} onClick={this.creditReport}>确定</Button>
                        <Button key="cancel" size="large" style={{ marginLeft: '20px' }} onClick={this.onCancel}>取消</Button>,
                    </div>
                </Modal>
                <CarouselImg pictureInfo={pictureInfo} previewPic={this.state.preview} previewHide={this.previewHide} />
            </div>
        )
    }
}

export default pureRender(EditNJBaseSpouse);
