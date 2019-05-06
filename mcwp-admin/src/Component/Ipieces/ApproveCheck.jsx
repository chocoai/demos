import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Modal, Button, Select, Radio, Row, Col, message } from 'antd';
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';
import modifyImg from '../../Assets/Images/icon_modify.png';
import VoiceShortIcon from '../../Component/Ipieces/voiceShortIcon'; // 进件管理 》语音速记图标
import VoiceShorts from '../../Component/Ipieces/VoiceShorts'; // 进件管理 》  语音速记列表
import IpiecesService from '../../Services/IpiecesService';
const Option = Select.Option;
const RadioGroup = Radio.Group;


class ApproveCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: props.code,
            passModal: false,            // 审批通过模态对话框
            rejectModal: false,           // 审批拒绝模态对话框
            rebackModal: false,           // 审批打回模态对话框
            riskModal: false,               // 风控提示
            riskMes: '',
            modifyStatus: true,          // 审批通过的是否修改
            reBackReason: '',          // 打回原因
            authMoney: '', // 授信金额
            rejectReason: '', // 拒绝原因
            rejectReasonOther: '', // 选择其他时输入的拒绝原因
            spjjyy: '', // 审批拒绝原因
            comment: '',               // 备注信息
            creditConfirm: {},
            passModalKey: 100,
            rejectModalKey: 200,
            rebackModalKey: 300,
            riskModalKey: 400,
            voiceLength: 0,
            voiceList: '',
            voiceTran: [],
            vShortVisible: false,
        };
    }
    componentWillMount() {
        if (/\/approve/g.test(window.location.pathname)) {
            this.getInfo('/v1/loan/audit/credit', 'creditConfirm');                 //进价提交审批通过展示授信信息
        }
        if (/\/check/g.test(window.location.pathname)) {
            this.getInfo('/v1/loan/examine/credit', 'creditConfirm');               //进价提交审查通过展示授信信息
        }
        this.getVoice();                            //获取音频
    }
    //获取音频
    getVoice() {
        const that = this;
        const { code } = that.state;
        IpiecesService.getSurveyList({ busiCode: code, busiType: 1 }, (res) => {
            if (res.code == Config.errorCode.success) {
                if (res.data && res.data.length) {
                    that.setState({
                        voiceLength: res.data.length
                    });
                }
            } else {
                message.error(res.msg);
            }
        })
    }
    getVoiceShort = () => { // 显示语音速记
        const that = this;
        that.setState({
            vShortVisible: true
        });
    }
    // id存在即为转化，避免全部更新导致音频播放重置
    getSurveyList = (timer, id) => {
        const that = this;
        const { code } = that.state;
        IpiecesService.getSurveyList({ busiCode: code, busiType: 1 }, (res) => {
            if (res.code == Config.errorCode.success) {
                let voiceTraning = [];
                if (res.data) {
                    res.data.map((item, index) => {
                        if (item && item.loanSurveyInfoDTOS && item.loanSurveyInfoDTOS.length > 0) {
                            item.loanSurveyInfoDTOS.map((itemDto, indexDto) => {
                                if (itemDto.status == 2) voiceTraning.push(itemDto.infoId);
                            })
                        }
                    });
                    if (voiceTraning.length == 0 && timer) clearInterval(timer);
                }

                that.setState({
                    voiceList: res.data
                });
            } else {
                message.error(res.msg);
            }
        })
    }
    goTranslate = (id) => { // 转文字
        const that = this;
        const params = {
            infoId: id
        };
        IpiecesService.translateVoice(params, (res) => {
            if (res.code == Config.errorCode.success) {
                that.getSurveyList(undefined, id);
                let transTimer = setInterval(function () {
                    that.getSurveyList(transTimer, id);
                }, 5000);
            } else {
                message.error(res.msg);
            }
        })
    }
    closeModal = () => { // 关闭弹窗
        const that = this;
        clearInterval(that.state.transTimer);
        that.setState({
            vShortVisible: false,
            transTimer: undefined
        });
    }
    //获取信息
    getInfo(url, type) {
        let params = {
            code: this.state.code
        }
        Config.get(url, params, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    [type]: res.data || {}
                })
                if (type == 'creditConfirm') {
                    this.setState({
                        authMoney: res.data && res.data.creditAmount,
                        dailyRate: res.data && res.data.dailyRate,
                        repaymentPeriod: res.data && res.data.repaymentPeriod
                    })
                }
            } else {
                message.error(res.msg);
            }
        });
    }
    getSysDictItems() { // 获取审批拒绝原因字典值
        Config.get('/v1/sys/dict/items', { code: 'spjjyy' }, (res) => {
            if (res.code == Config.errorCode.success) {
                if (res.data) {
                    this.setState({
                        spjjyy: res.data.spjjyy
                    });
                }
            } else {
                message.error(res.msg);
            }
        });
    }
    changeInput = (inp, e, value) => { // input值变化
        if (inp == 'repaymentPeriod' || inp == 'period' || inp == 'kind') {
            this.setState({
                [inp]: value
            });
        } else if (inp == 'comment') {
            let value = e.target.value;
            if (value.length > 256) {
                e.target.value = e.target.value.substr(0, 256);
            }
            this.setState({
                [inp]: e.target.value
            });
        } else {
            this.setState({
                [inp]: e.target.value
            });
        }
    }
    setModal(modal, type) { // 设置模态对话框
        const that = this
        const { code } = this.state
        const { action } = this.props
        if (type == 'risk' && action == 'approve') {
            Config.post('/v1/loan/audit/check', { code }, (res) => {
                if (res.code == Config.errorCode.success) {
                    if (res.data) {
                        this.setState({
                            riskModal: !this.state.riskModal,
                            riskMes: res.data,
                            riskModalKey: this.state.riskModalKey + 1
                        });
                    } else {
                        that.setState({
                            passModal: !that.state.passModal,
                            passModalKey: that.state.passModalKey + 1,
                            modifyStatus: !that.state.passModal
                        });
                    }
                } else {
                    message.error(res.msg);
                }
            })
            return
        }
        if (modal == 'pass') {
            that.setState({
                passModal: !that.state.passModal,
                passModalKey: that.state.passModalKey + 1,
                modifyStatus: !that.state.passModal
            });
        } else if (modal == 'reject') {
            this.getSysDictItems();
            this.setState({
                rejectModal: !this.state.rejectModal,
                rejectModalKey: this.state.rejectModalKey + 1,
            });
        } else if (modal == 'reback') {
            this.setState({
                rebackModal: !this.state.rebackModal,
                reBackReason: '',
                rebackModalKey: this.state.rebackModalKey + 1
            });
        } else if (modal == 'risk') {
            this.setState({
                riskModal: !this.state.riskModal,
                riskModalKey: this.state.riskModalKey + 1
            });
        }
    }
    riskPass = () => {
        this.setState({
            passModal: !this.state.passModal,
            passModalKey: this.state.passModalKey + 1,
            modifyStatus: !this.state.passModal,
            riskModal: !this.state.riskModal,
            riskMes: '',
            riskModalKey: this.state.riskModalKey + 1
        });
    }
    // 目前采取类型判断处理，等区分度更大的时候拆分组件
    // todo
    approvalPass = () => {
        const { code, authMoney, dailyRate, repaymentPeriod, creditConfirm, kind, period, comment } = this.state;
        const { action } = this.props;
        if (!authMoney) return message.error("授信金额不能为空");
        if (!dailyRate) return message.error("借款日利率不能为空");
        if (action == 'approve') {
            if (creditConfirm && creditConfirm.creditOn) {
                if (!repaymentPeriod) return message.error("最长还款期数不能为空");
            } else {
                if (!(period || (creditConfirm && creditConfirm.period))) return message.error("还款期数不能为空");
                if (!(kind || (creditConfirm && creditConfirm.kind))) return message.error("还款方式不能为空");
            }
        }
        let reg = /^[0-9]{1}\d*(\.\d{1,2})?$/
        let rateReg = /^0.\d{1,4}$/
        if (!reg.test(authMoney)) return message.error('授信金额为数字小数点后且最多两位');
        if (!rateReg.test(dailyRate)) return message.error('借款日利率小于1，且小数点后最多四位');
        // 审查
        if (action == 'check') {
            let params = {
                reqCode: code,
                authMoney: authMoney,
                dailyRate: dailyRate,
            };
            Config.put('/v1/loan/examine/pass', params, (res) => {
                if (res.code == Config.errorCode.success) {
                    message.success('审查成功');
                    browserHistory.push('/ipieces/operate');
                } else {
                    message.error(res.msg);
                    //此处以后要添加判断，目前只做跳转
                    browserHistory.push('/ipieces/operate');
                }
            });
            return;
        }
        // 审批
        if (creditConfirm && creditConfirm.creditOn) {
            let params = {
                reqCode: code,
                authMoney: authMoney,
                dailyRate: dailyRate,
                repaymentPeriod: repaymentPeriod,
                comment: comment
            };
            Config.put('/v1/loan/audit/pass', params, (res) => {
                if (res.code == Config.errorCode.success) {
                    message.success('审批成功');
                    browserHistory.push('/ipieces/operate');
                } else {
                    message.error(res.msg);
                    //此处以后要添加判断，目前只做跳转
                    browserHistory.push('/ipieces/operate');
                }
            });
        } else {
            let params = {
                reqCode: code,
                authMoney: authMoney,
                dailyRate: dailyRate,
                period: period || creditConfirm.period,
                kind: kind || creditConfirm.kind,
                comment: comment
            };
            Config.put('/v1/loan/audit/pass', params, (res) => {
                if (res.code == Config.errorCode.success) {
                    message.success('审批成功');
                    browserHistory.push('/ipieces/operate');
                } else {
                    message.error(res.msg);
                    //此处以后要添加判断，目前只做跳转
                    browserHistory.push('/ipieces/operate');
                }
            });
        }
    }
    approvalReject = () => { // 审批拒绝
        const { code, rejectReason, rejectReasonOther } = this.state;
        const { action } = this.props;
        if (!rejectReason) return message.error('请选择审批拒绝原因');
        if (rejectReason == 15 && !rejectReasonOther) return message.error('请输入其他原因')
        if (rejectReason == 15 && rejectReasonOther.length > 64) return message.error('其他原因不能超过64个字')
        const params = {
            code: code,
            rejectReason: rejectReason,
            rejectReasonOther: rejectReason == 15 ? rejectReasonOther : ''
        };
        Config.put(`${action == 'approve' ? '/v1/loan/audit/reject' : '/v1/loan/examine/reject'}`, params, (res) => {
            if (res.code == Config.errorCode.success) {
                message.success('审批成功');
                browserHistory.push('/ipieces/operate');
            } else {
                message.error(res.msg);
                // browserHistory.push('/ipieces/operate');
            }
        });
    }
    // 重新打回模态款 确定
    approvalReBack = () => {
        // 这个params是从LoanOperate传来的，是借款编码，已经是object了
        let reBackReason = this.state.reBackReason;
        if (Config.isNull(reBackReason)) {
            message.error('请输入打回原因')
            return
        }
        let params = {
            code: this.state.code,
            repulseReason: reBackReason
        }
        Config.put('/v1/loan/audit/repulse', params, (res) => {
            if (res.code == Config.errorCode.success) {
                message.success('贷款打回成功！');
                this.setState({
                    reBackReason: false
                })
                browserHistory.push('/ipieces/operate');
            } else {
                message.error(res.msg)
            }
        })
    }
    entryReason = (e) => {
        let value = e.target.value;
        if (value.length > 120) {
            e.target.value = e.target.value.substr(0, 120);
        }
        this.setState({
            reBackReason: e.target.value
        });
    }
    changeRadio(e) {
        const value = e.target.value,
            ddtext = e.target.ddtext,
            reasonOtherContent = this.reasonOtherContent;
        if (ddtext == '其他') {
            reasonOtherContent.style.display = 'inline-block';
        } else {
            reasonOtherContent.style.display = 'none';
        }
        this.setState({
            rejectReason: value
        });
    }
    changeModify = () => {
        this.setState({
            modifyStatus: false
        })
    }
    render() {
        const { passModal, rejectModal, rebackModal, modifyStatus, spjjyy, comment, creditConfirm, riskModalKey, riskMes,voiceLength,voiceList,vShortVisible} = this.state
        const { action, baseInfo, hkqs, hkfs, type } = this.props
        return (
            <div>
                {action == 'approve' || action == 'check' ? <div className="detail-btns">
                    <Button className="detail-submit" type="primary" onClick={this.setModal.bind(this, 'pass', 'risk')}>{`${action == 'approve' ? '审批通过' : '审查通过'}`}</Button>
                    <Modal
                        visible={passModal}
                        title={`${action == 'approve' ? '审批通过' : '审查通过'}`}
                        onCancel={this.setModal.bind(this, 'pass')}
                        footer={null}
                        width={450}
                        wrapClassName="ipiece-pass-wrapper"
                        key={this.state.passModalKey}
                    >
                        {
                            action == 'approve' ?
                                creditConfirm.creditAmount && (modifyStatus && !Config.ipiecesShow.approveCheckApproveStatus.includes(+type)) ?
                                    <div className='pass-already'>
                                        <p>客户{baseInfo.loanCustomer && baseInfo.loanCustomer.cname}在我行已授信<span onClick={this.changeModify} style={{ paddingLeft: '20px', color: '#108ee9', cursor: 'pointer' }}><img src={modifyImg} alt='modify' style={{ verticalAlign: 'middle' }} />修改</span></p>
                                        <p>授信金额:{creditConfirm.creditAmount}元，借款日利率:{creditConfirm.dailyRate ? `${creditConfirm.dailyRate}%` : '无'}，最长还款期数:{creditConfirm.repaymentPeriodName ? `${creditConfirm.repaymentPeriodName}期` : '无'}</p>
                                    </div>
                                    :
                                    <div>
                                        {
                                            Config.ipiecesShow.approveCheckApproveTip.includes(+type) && <div className='pass-item' style={{ justifyContent: 'flex-start' }}>
                                                <p className="ipieces-cust-type">确定已经查验过客户的征信报告吗？</p>
                                            </div>
                                        }

                                        <div className='pass-item'>
                                            <label htmlFor="authMoney">授信金额</label>
                                            <div className="input-wrapper">
                                                <input className="pass-input" defaultValue={creditConfirm.creditAmount} type="text" placeholder="请输入" id="authMoney" onChange={(e) => this.changeInput('authMoney', e)} />
                                            </div>
                                            <span className="measure">元</span>
                                        </div>
                                        <div className='pass-item'>
                                            <label htmlFor="dailyRate">借款日利率</label>
                                            <div className="input-wrapper">
                                                {Config.ipiecesShow.approveCheckApproveDailyRate.includes(+type) && creditConfirm.dailyRate ? <span>{creditConfirm.dailyRate}%</span> : <input className="pass-input" type="text" defaultValue={creditConfirm.dailyRate} placeholder="请输入" id="dailyRate" onChange={(e) => this.changeInput('dailyRate', e)} autoComplete="off" />}
                                            </div>
                                            <span className="measure">{!(Config.ipiecesShow.approveCheckApproveDailyRate.includes(+type) && creditConfirm.dailyRate) && '%'}</span>
                                        </div>
                                        {
                                            creditConfirm && creditConfirm.creditOn ?
                                                <div className='pass-item'>
                                                    <label htmlFor="repaymentPeriod">最长还款期数</label>
                                                    <div className="input-wrapper">
                                                        {
                                                            creditConfirm.repaymentPeriod ?
                                                                <Select
                                                                    placeholder="请选择"
                                                                    style={{ width: '100%' }}
                                                                    getPopupContainer={trigger => trigger.parentNode}
                                                                    onChange={(value) => this.changeInput('repaymentPeriod', null, value)}
                                                                    defaultValue={creditConfirm.repaymentPeriod}
                                                                >
                                                                    {
                                                                        hkqs.map((item, index) => (
                                                                            <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                                        ))
                                                                    }
                                                                </Select> :
                                                                <Select
                                                                    placeholder="请选择"
                                                                    style={{ width: '100%' }}
                                                                    getPopupContainer={trigger => trigger.parentNode}
                                                                    onChange={(value) => this.changeInput('repaymentPeriod', null, value)}
                                                                >
                                                                    {
                                                                        hkqs.map((item, index) => (
                                                                            <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                                        ))
                                                                    }
                                                                </Select>
                                                        }
                                                    </div>
                                                    <span className="measure">期</span>
                                                </div> :
                                                <div>
                                                    <div className='pass-item'>
                                                        <label htmlFor="period">还款期数</label>
                                                        <div className="input-wrapper">
                                                            {
                                                                creditConfirm.period && !Config.ipiecesShow.approveCheckApprovePeriod.includes(+type) ?
                                                                    <Select
                                                                        placeholder="请选择"
                                                                        style={{ width: '100%' }}
                                                                        disabled={!!creditConfirm.kind}
                                                                        getPopupContainer={trigger => trigger.parentNode}
                                                                        onChange={(value) => this.changeInput('period', null, value)}
                                                                        defaultValue={creditConfirm.period}
                                                                    >
                                                                        {
                                                                            hkqs.map((item, index) => (
                                                                                <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                                            ))
                                                                        }
                                                                    </Select> :
                                                                    <Select
                                                                        placeholder="请选择"
                                                                        style={{ width: '100%' }}
                                                                        getPopupContainer={trigger => trigger.parentNode}
                                                                        defaultValue={creditConfirm.period}
                                                                        onChange={(value) => this.changeInput('period', null, value)}
                                                                    >
                                                                        {
                                                                            hkqs.map((item, index) => (
                                                                                <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                                            ))
                                                                        }
                                                                    </Select>
                                                            }
                                                        </div>
                                                        <span className="measure">期</span>
                                                    </div>
                                                    <div className='pass-item'>
                                                        <label htmlFor="kind">还款方式</label>
                                                        <div className="input-wrapper">
                                                            {
                                                                creditConfirm.kind && !Config.ipiecesShow.approveCheckApproveKind.includes(+type) ?
                                                                    <Select
                                                                        placeholder="请选择"
                                                                        style={{ width: '100%' }}
                                                                        disabled={!!creditConfirm.kind}
                                                                        getPopupContainer={trigger => trigger.parentNode}
                                                                        onChange={(value) => this.changeInput('kind', null, value)}
                                                                        defaultValue={creditConfirm.kind && creditConfirm.kind.toString()}
                                                                    >
                                                                        {
                                                                            hkfs && hkfs.map((item, index) => (
                                                                                <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                                            ))
                                                                        }
                                                                    </Select> :
                                                                    <Select
                                                                        placeholder="请选择"
                                                                        style={{ width: '100%' }}
                                                                        getPopupContainer={trigger => trigger.parentNode}
                                                                        onChange={(value) => this.changeInput('kind', null, value)}
                                                                        defaultValue={creditConfirm.kind && creditConfirm.kind.toString()}
                                                                    >
                                                                        {
                                                                            hkfs && hkfs.map((item, index) => (
                                                                                <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                                            ))
                                                                        }
                                                                    </Select>
                                                            }
                                                        </div>
                                                        <span className="measure"></span>
                                                    </div>
                                                </div>
                                        }
                                        <div className='pass-item'>
                                            <label htmlFor="dailyRate">备注</label>
                                            <div className="textarea-wrapper">
                                                <textarea className="reason-content" placeholder="请输入" defaultValue={creditConfirm.comment} onChange={(e) => this.changeInput('comment', e)}></textarea>
                                                <span className='reason-content-foot'>{comment.length}/256</span>
                                            </div>
                                            <span className="measure"></span>
                                        </div>
                                    </div>
                                :
                                creditConfirm.creditAmount && (modifyStatus && !Config.ipiecesShow.approveCheckCheckStatus.includes(+type)) ?
                                    <div className='pass-already'>
                                        <p>客户{baseInfo.loanCustomer && baseInfo.loanCustomer.cname}在我行已授信<span onClick={this.changeModify} style={{ paddingLeft: '20px', color: '#108ee9', cursor: 'pointer' }}><img src={modifyImg} alt='modify' style={{ verticalAlign: 'middle' }} />修改</span></p>
                                        <p>授信金额:{creditConfirm.creditAmount}元，借款日利率:{creditConfirm.dailyRate ? `${creditConfirm.dailyRate}%` : '无'}</p>
                                    </div>
                                    :
                                    <div>
                                        <div className='pass-item'>
                                            <label htmlFor="authMoney">授信金额</label>
                                            <div className="input-wrapper">
                                                <input className="pass-input" defaultValue={creditConfirm.creditAmount} type="text" placeholder="请输入" id="authMoney" onChange={(e) => this.changeInput('authMoney', e)} />
                                            </div>
                                            <span className="measure">元</span>
                                        </div>
                                        <div className='pass-item'>
                                            <label htmlFor="dailyRate">借款日利率</label>
                                            <div className="input-wrapper">
                                                {Config.ipiecesShow.approveCheckCheckDailyRate.includes(+type) && creditConfirm.dailyRate ? <span>{creditConfirm.dailyRate}%</span> : <input className="pass-input" type="text" defaultValue={creditConfirm.dailyRate} placeholder="请输入" id="dailyRate" onChange={(e) => this.changeInput('dailyRate', e)} />}
                                            </div>
                                            <span className="measure">{!(Config.ipiecesShow.approveCheckCheckDailyRate.includes(+type) && creditConfirm.dailyRate) && '%'}</span>
                                        </div>
                                    </div>
                        }
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Button key="ok" type="primary" size="large" onClick={this.approvalPass}>确定</Button>
                            <Button key="cancel" size="large" style={{ marginLeft: '20px' }} onClick={this.setModal.bind(this, 'pass')}>取消</Button>,
                        </div>
                    </Modal>
                    <Button className="detail-cancle" type="primary" onClick={this.setModal.bind(this, 'reject')}>{`${action == 'approve' ? '审批拒绝' : '审查拒绝'}`}</Button>
                    <Modal
                        visible={this.state.riskModal}
                        onCancel={this.setModal.bind(this, 'risk')}
                        title={`风险提示`}
                        footer={null}
                        key={riskModalKey}
                        wrapClassName="ipiece-pass-wrapper"
                    >
                        <div style={{ textAlign: 'center' }}>{riskMes}</div>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Button key="ok" type="primary" size="large" onClick={this.riskPass}>确定</Button>
                            <Button key="cancel" size="large" style={{ marginLeft: '20px' }} onClick={this.setModal.bind(this, 'risk')}>取消</Button>,
                        </div>
                    </Modal>
                    <Modal
                        visible={rejectModal}
                        onCancel={this.setModal.bind(this, 'reject')}
                        title={`${action == 'approve' ? '审批拒绝' : '审查拒绝'}`}
                        key={this.state.rejectModalKey}
                        footer={[
                            <Button key="cancel" size="large" onClick={this.setModal.bind(this, 'reject')}>取消</Button>,
                            <Button key="ok" type="primary" size="large" onClick={this.approvalReject}>确定</Button>
                        ]}
                    >
                        <RadioGroup onChange={(e) => { this.changeRadio(e) }}>
                            <Row>
                                {
                                    spjjyy ? spjjyy.map((info, index) => (
                                        info.ddText == '其他' ?
                                            <Col key={index} span={24} style={{ padding: '15px 0' }}>
                                                <Radio ddtext={info.ddText} value={info.ddValue}>{info.ddText}</Radio><input ref={ref => { this.reasonOtherContent = ref }} className="ant-input" onChange={this.changeInput.bind(this, 'rejectReasonOther')} style={{ width: '80%', marginLeft: '20px', display: 'none' }} placeholder="请输入授信拒绝原因" />
                                            </Col> :
                                            <Col key={index} span={12} style={{ padding: '15px 0' }}>
                                                <Radio value={info.ddValue}>{info.ddText}</Radio>
                                            </Col>
                                    )) : null
                                }
                            </Row>
                        </RadioGroup>
                    </Modal>
                    {
                        action == 'approve'?(type == 'netLoan' || type == 5 || Config.ipiecesShow.approveCheckReBackApprove.includes(+type)) ? null :
                            <Button className="detail-cancle detail-cancle-right" type="primary" onClick={this.setModal.bind(this, 'reback')}>重新打回</Button>:action == 'check'?(type == 'netLoan' || type == 5 || Config.ipiecesShow.approveCheckReBackCheck.includes(+type))?null:<Button className="detail-cancle detail-cancle-right" type="primary" onClick={this.setModal.bind(this, 'reback')}>重新打回</Button>:null
                    }
                    {
                        type == 'netLoan' ? null :
                            <Modal
                                visible={rebackModal}
                                className='reback-modal'
                                onCancel={this.setModal.bind(this, 'reback')}
                                key={this.state.rebackModalKey}
                                title="打回原因"
                                footer={[
                                    <Button key="cancel" className='reback-button' size="large" onClick={this.setModal.bind(this, 'reback')}>取消</Button>,
                                    <Button key="ok" className='reback-button' type="primary" size="large" onClick={this.approvalReBack}>确定</Button>
                                ]}
                            >
                                <textarea className="reason-content" placeholder="请输入打回原因" onChange={this.entryReason}></textarea>
                                <span className='reason-content-foot'>{this.state.reBackReason.length}/120</span>
                                {!Config.ipiecesShow.approveCheckReBackTip.includes(+type)?<p className='reback-explain'>提示：打回贷款后，将重新进入现场调查流程</p>:null}
                                {
                                    baseInfo && baseInfo.repulseTimes ?
                                        <p className='repulse-times'>该笔贷款已被打回{baseInfo.repulseTimes}次</p> : null
                                }
                            </Modal>
                    }
                </div> : null
                }
                {action == 'approve'&&Config.ipiecesShow.approveCheckVoiceShorts.includes(+type)&&voiceLength > 0 ? <VoiceShortIcon onClick={this.getVoiceShort} visible={vShortVisible} /> : null}
                <VoiceShorts translateVoice={this.goTranslate} getSurveyList={this.getSurveyList} voiceList={voiceList} visible={vShortVisible} onCancel={() => this.closeModal()} />
            </div>
        )
    }
}

const pureApproveCheck = pureRender(ApproveCheck);

export default pureApproveCheck;
