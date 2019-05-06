import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { message, Button, Modal } from 'antd';
import { Config } from '../../../Config/Index';
import CarouselImg from './../CarouselImg'
import { initOSS, upload, getFileList, deleteFile } from '../../../Config/Oss'
import './../style/editBaseTmp.less';
import './../style/slick.less';
import Idcard from '../../../Assets/Images/idcard-detail.png';
import Namecard from '../../../Assets/Images/ipieces-tab-face.png';
import addImg from '../../../Assets/Images/icon_add--pictures.png';
import { Form, Row, Col } from 'antd';
const FormItem = Form.Item;

class EditCarBase extends Component {
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
        getFileList({ bizCode: this.props.code, bizType: Config.bizType.loanPersonCredit + ',' + Config.bizType.loanPersonCreditWhiteIdentity, fileTypes: '*' }, this)
    }
    getFile = (e, type) => {
        // const { fileList } = this.state
        // if (fileList && fileList[Config.bizType.loanPersonCredit]) return message.error('最多上传一份征信报告')
        if (type == 'pdf') {
            if (e.target.files[0].type.includes('pdf')) {
                upload(e.target.files[0], this.props.code, Config.bizType.loanPersonCredit, this)
            } else {
                message.error('请上传pdf')
                this.input.value = ''
            }
        }
        if (type == 'img') {
            if (/BMP|JPG|JPEG|PNG|GIF/i.test(e.target.files[0].type)) {
                upload(e.target.files[0], this.props.code, Config.bizType.loanPersonCreditWhiteIdentity, this)
            } else {
                message.error('请上传图片')
            }
        }
        // this.input.value = ''
    }
    // /LOAN_PERSON_IDENTITY_FRONT,LOAN_PERSON_IDENTITY_BACK,LOAN_PERSON_IDENTITY_FACE,LOAN_PERSON_HOUSEHOLD,LOAN_PERSON_MARRICERT,LOAN_PERSON_EDUCERT,LOAN_PERSON_GRADUCERT
    getPictureInfo = (type) => {  // 照片信息
        let code = this.props.code;
        let pictures=[];
        let fileType = '/' + Object.values(Config.bizType).join(',')
        Config.get('/v1/oss/' + code + fileType + '/*', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                if (!(res.data)) return message.error(Config.warnInfo.uploadImg);
                type.forEach((item,index)=>{
                    pictures.push(...res.data[item]||[])
                })
                this.setState({
                    pictureInfo: pictures,
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
        Config.post('/v1/loan/citizen/creditReport', { code, customerType: selectId }, (res) => {
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
        getFileList({ bizCode: this.props.code, bizType: Config.bizType.loanPersonCredit + ',' + Config.bizType.loanPersonCreditWhiteIdentity, fileTypes: '*' }, this)
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
        getFileList({ bizCode: this.props.code, bizType: Config.bizType.loanPersonCredit + ',' + Config.bizType.loanPersonCreditWhiteIdentity, fileTypes: '*' }, this)
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
        // const { getFieldDecorator } = this.props.form;
        // userAction
        const { baseData, showDetail, eduDict, type, openUploadImg, code, topInfo } = this.props;
        let loanCustomer = baseData.loanCustomer;      // 个人信息
        let basicInfoVerifyDTO = baseData.basicInfoVerifyDTO  //验证结果
        // let additionalInfo = baseData.additionalInfo
        // let loanSpouse = baseData.loanSpouse
        const { pictureInfo, fileList, addFileModal, mRole, selectId, finalSelectId, buttonLoading } = this.state
        let arr = ['verified', 'inconsistent', 'unknown', 'unverified']  //0核实匹配1核实不匹配2未知3未核实
        return (
            <div className='editBaseTmp-container'>
                <Form>
                    <div className='ipieces-subtitle-container'>
                        <p className='ipieces-subtitle ipieces-subtitle-left' id='customer'>个人信息</p>
                        <div>
                            {/* {
                                personCredit && personCredit.length ?
                                    <span className='ipieces-subtitle-attachment' onClick={() => showPicture('LOAN_PERSON_CREDIT')}>征信报告</span>
                                    : null
                            } */}
                            {/* <input type="file" className="file-chose" onChange={this.showModal} /> */}
                            {type == 15 ? null : <span className="ipieces-subtitle-attachment" onClick={this.showModal}>添加征信报告</span>}
                            {/* <span className='ipieces-subtitle-attachment' onClick={() => openUploadImg(Config.bizType.loanPerson)}>添加征信报告</span> */}
                            <span className='ipieces-subtitle-attachment' onClick={() => openUploadImg(Config.bizType.loanPerson)}>添加文件</span>
                            <span className='ipieces-subtitle-attachment' onClick={() => this.getPictureInfo([Config.bizType.loanPerson,Config.bizType.loanCar,Config.bizType.loanGuarantee,Config.bizType.loanFamily,Config.bizType.loanSpouse,Config.bizType.loanCoborrower,Config.bizType.loanCarinfo])}>查看文件</span>
                        </div>
                    </div>
                    <Row className="personal-info-content" type="flex" justify="start">
                        <Col span={12} className="subtitle">
                            <span>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</span>{this.props.pictureInfo && (this.props.pictureInfo[Config.bizType.loanPersonFront] || this.props.pictureInfo[Config.bizType.loanPersonFace]) ? <img onClick={showDetail} className="idcard" src={Namecard} alt="身份证" /> : null} {basicInfoVerifyDTO.cnameVerifyRet != null ? basicInfoVerifyDTO.cnameVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : basicInfoVerifyDTO.cnameVerifyRet == 0 ? <span className={"max-width-face-verify " + arr[basicInfoVerifyDTO.faceVerifyRet || basicInfoVerifyDTO.cnameVerifyRet]}>{basicInfoVerifyDTO.faceVerify || basicInfoVerifyDTO.cnameVerify}</span> : <span className={arr[basicInfoVerifyDTO.cnameVerifyRet]}>{basicInfoVerifyDTO.cnameVerify}</span> : null}
                        </Col>
                        <Col span={12} className="subtitle">
                            <span>婚姻状况：{loanCustomer && loanCustomer.maritalStatusText || '未录入'}</span>
                        </Col>
                        <Col span={12} className="subtitle">
                            <span>学历：{loanCustomer.education && eduDict && eduDict.filter((item, index) => (item.ddValue == loanCustomer.education))[0] && eduDict.filter((item, index) => (item.ddValue == loanCustomer.education))[0]['ddText'] || '未录入'}</span>
                        </Col>
                        <Col span={12} className="subtitle">
                            <span>身份证号：{loanCustomer.idCardNo || '未录入'}</span>
                            {this.props.pictureInfo && (this.props.pictureInfo[Config.bizType.loanPersonFront] || this.props.pictureInfo[Config.bizType.loanPersonBack]) ? <img onClick={() => showDetail('idcard')} className="idcard" src={Idcard} alt="身份证" /> : null}
                            {/* {[6, 10, 11, 2, 3, 12].includes(+topInfo.auditStatus)? <span className='verified'>已核实</span>: null} */}
                            {basicInfoVerifyDTO.customerIdCardVerifyRet == null || basicInfoVerifyDTO.customerIdCardVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : <span className={arr[basicInfoVerifyDTO.customerIdCardVerifyRet]}>{basicInfoVerifyDTO.customerIdCardVerify}</span>}
                        </Col>
                        <Col span={12} className="subtitle">
                            <span>申请金额：{loanCustomer.applyBalance && loanCustomer.applyBalance + '元' || '未录入'}</span>
                        </Col>
                        <Col span={12} className="subtitle">
                            <span>联系方式：{loanCustomer.telephone || '未录入'}</span>
                            {/* {[6, 10, 11, 2, 3, 12].includes(+topInfo.auditStatus)? <span className='verified'>已核实</span>: null} */}
                            {basicInfoVerifyDTO.customerTelVerifyRet == null || basicInfoVerifyDTO.customerTelVerifyRet == 3 ? <span className={arr[3]}>未核实</span> : <span className={arr[basicInfoVerifyDTO.customerTelVerifyRet]}>{basicInfoVerifyDTO.customerTelVerify}</span>}
                        </Col>
                        <Col span={12} className="subtitle">
                            <span>还款期数：{loanCustomer.repaymentPeriodText && loanCustomer.repaymentPeriodText + '期' || '未录入'}</span>
                        </Col>
                        <Col span={12} className="subtitle">
                            <span>所购车型：{loanCustomer.carModel || '未录入'}</span>
                        </Col>
                        <Col span={12} className="subtitle">
                            <span>车辆指导价：{Config.field(loanCustomer, 'carGuidePrice', '万元')}</span>
                        </Col>
                        <Col span={12} className="subtitle">
                            <span>居住地址：{loanCustomer.homeAddr || '未录入'}</span>
                        </Col>
                        <Col span={24} className="title">
                            {
                                fileList && fileList[Config.bizType.loanPersonCredit] && (finalSelectId == 1 || (!finalSelectId && baseData.loanCustomer.customerType == 1)) ?
                                    <Row className="upload-file-box">
                                        {
                                            fileList[Config.bizType.loanPersonCredit].map((info, index) => (
                                                <Col key={index} span={6} className="title">
                                                    <a target="_blank" className="file-url" href={info.srcUrl}>{info.fileName}</a>
                                                </Col>
                                            ))
                                        }
                                    </Row> : null
                            }
                            {
                                fileList && fileList[Config.bizType.loanPersonCreditWhiteIdentity] && (finalSelectId == 2 || (!finalSelectId && baseData.loanCustomer.customerType == 2)) ?
                                    <Row className="upload-file-box">
                                        {
                                            fileList[Config.bizType.loanPersonCreditWhiteIdentity].map((info, index) => (
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
                                {/* <div className="upload">选择文件
                                    <input className="change" type="file" multiple="multiple" />
                                </div> */}
                            </div>
                        </div>
                        <div className='pass-item pass-item-img' style={{ display: selectId == 2 ? 'flex' : 'none' }}>
                            <label className="img-result">报告结果</label>
                            <div className="input-wrapper input-wrapper-img">
                                <div className="img">
                                    <input type="file" className="file" onChange={this.putImgButton} ref="img" onChange={(e) => this.getFile(e, 'img')} />
                                    <div className="addImg"><img className='addImgPic' src={fileList && fileList[Config.bizType.loanPersonCreditWhiteIdentity] ? fileList[Config.bizType.loanPersonCreditWhiteIdentity][0].srcUrl : addImg} alt="addImgPic" /> </div>
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

const pureEditCarBase = pureRender(EditCarBase);

export default pureEditCarBase;
