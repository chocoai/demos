import React, { Component } from 'react'; // 引入了React
import { Link, browserHistory } from 'react-router';
import { Config } from '../../Config/Index';
import pureRender from 'pure-render-decorator';
import LoanService from '../../Services/LoanService';
import MultUploadImg from '../Common/MultUploadImg'
import CommonService from '../../Services/CommonService';
import './style/loanBcrumb.less';

import { Breadcrumb, Popover, message, DatePicker, Modal, Button, Input, Icon, Tooltip, Row, Col, Spin } from 'antd';
import { relativeTimeRounding } from 'moment';

class BcrumbItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loading2: false,
            settledVisible: false,           // 结清确认
            morigageVisible: false,           // 抵押完成
            confirmVisible: false,          //放款确认模态框
            bankNo: null,                 // 银行卡号
            borrowMoney: null,             //借款金额
            dailyRate: null,             //借款日利率
            startBankNo: null,
            mainModalKey: 1,
            confirmLoading: false,         // 放款确认
            confirmRepaymentDate: 0,       // 确认每月的还款日期
            startDate: 0,                 // 确认借款合同开始日期
            endDate: 0,                  // 确认借款合同结束日期
            startContract: null,         // 合同开始日期
            endContract: null,            // 合同结束日期
            popShow: true,
            bonusShow: false,//红包显示状态
            bonusNum: 0,
            contentState: true,
            titleState: true,
        };
    }
    // 结清确认  出现模态框
    settledLoan = () => {
        this.setState({
            settledVisible: true
        })
    }
    // 抵押完成 出现模态框
    morigage = () => {
        this.setState({
            morigageVisible: true
        })
    }
    // 结清确认  出现模态框  确定操作
    handleOkay = () => {
        let params = { code: this.props.code };
        // 点击操作后 重新请求后台数据 渲染页面 params被占用 使用pagerows作为参数
        // let pagerows = this.state.params;
        Config.put('/v1/loan/borrowInfo/closeAccount', params, (res) => {
            // 这里不能用三等 res.code是字符串0   Config.errorCode.success是数字0
            if (res.code == Config.errorCode.success) {
                message.success('结清确认成功');
                this.setState({
                    settledVisible: false
                });
                // // 点击操作后 重新请求后台数据 渲染页面
                this.props.getLoanDetail(this.props.code)
            } else {
                message.error(res.msg);
            }
        });
    }
    // 结清确认  出现模态框  取消操作
    handleCallof = () => {
        this.setState({
            settledVisible: false
        })
    }
    // 抵押完成  出现模态框  取消操作
    handleCancleMorigage = () => {
        this.setState({
            morigageVisible: false
        })
    }
    // 下载合同
    downloadContract = (e) => {
        let { loanDetail } = this.props;
        e.target.href = Config.target + '/comm/contract/down/' + loanDetail.fileCode
    }
    // 放款确认 出现模态框
    confirmLoan = (record) => {
        let { loanDetail } = this.props;
        this.getbonusMoney(loanDetail.borrowMoney);
        this.setState({
            confirmVisible: true,
            bankNo: loanDetail.bankNo,
            borrowMoney: loanDetail.borrowMoney,
            startBankNo: loanDetail.bankNo,
            dailyRate: loanDetail.dailyRate,
            // contentState:true,
            // titleState:true
        })
    }
    // 放款确认 出现模态框  选择每月还款日期
    confirmRepaymentDate = (date) => {
        let time = date._d;
        this.setState({
            confirmRepaymentDate: time.getTime()
        })
    }
    // 根据开始和禁用时间来设置this.state.startValue  OR  endValue
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }
    //  选择 借款合同开始日期
    onStartContract = (date) => {
        this.onChange('startContract', date)
        let time = date._d;
        this.setState({
            startDate: time.getTime()
        })
    }
    //  选择 借款合同结束日期
    onEndContract = (date) => {
        this.onChange('endContract', date)
        let time = date._d;
        this.setState({
            endDate: time.getTime()
        })
    }
    // 禁用合同开始时间
    disabledStartContract = (startContract) => {
        const endContract = this.state.endContract;
        if (!startContract || !endContract) {
            return false;
        }
        return startContract.valueOf() > endContract.valueOf();
    }
    //  禁用合同结束时间
    disabledEndContract = (endContract) => {
        const startContract = this.state.startContract;
        if (!endContract || !startContract) {
            return false;
        }
        return endContract.valueOf() <= startContract.valueOf();
    }
    // 放款确认 出现模态框  确认操作
    handleOk = async() => {
        let { loanDetail, code } = this.props;
        let params = { code: this.props.code };
        const { confirmRepaymentDate, startDate, endDate, bankNo, borrowMoney, bonusShow } = this.state;
        params.repaymentDate = confirmRepaymentDate;
        params.startDate = startDate;
        params.endDate = endDate;
        params.bankNo = bankNo;
        params.lendMoney = borrowMoney;
        if (bonusShow) {
            params.useRedPacket = 1;// 0不使用红包，1使用红包
        } else {
            params.useRedPacket = 0;
        }
        // console.log(params)
        if (!params.repaymentDate) {
            message.error('请输入每月还款日');
            return;
        }
        if (!params.startDate || !params.endDate) {
            message.error('请输入借款合同开始日期和结束日期');
            return;
        }
        if (!params.bankNo) return message.error('请输入银行卡号');
        if (!/^\d{16}$|^\d{19}$/.test(params.bankNo)) return message.error('请输入正确的银行卡号');
        if (!params.lendMoney) {
            message.error('请输入实际放款金额！');
            return;
        }
        if (!(/^(\d+)(\.?)(\d{0,2})$/.test(params.lendMoney))) {
            message.error('请输入正确的放款金额！');
            return
        }
        if (!(params.lendMoney >= 0 && params.lendMoney <= loanDetail.borrowMoney)) return message.error('实际放款金额大于授信金额，请修改后重新提交！');
        // 点击操作后 重新请求后台数据 渲染页面 params被占用 使用pagerows作为参数
        // let pagerows = this.state.params;
        if (loanDetail.hasOtherOperate == 'guarantee') {
            let type = Config.bizType.borrowGuaranteeAndOtherData;
            let fileType = '/' + Object.values(Config.bizType).join(',')
            let res = await CommonService.getPictureInfo(code, fileType)
            if (res.code == Config.errorCode.success) {
                if (res.data && res.data[type]) {
                    this.setState({
                        confirmLoading: true
                    })
                    Config.put('/v1/loan/borrowInfo/makeLoan', params, (res) => {
                        if (res.code == Config.errorCode.success) {
                            message.success('放款确认成功');
                            this.setState({
                                confirmVisible: false,
                                repaymentDate: 0,
                                startDate: 0,
                                endDate: 0,
                                bankNo: null,
                                borrowMoney: null,
                                mainModalKey: this.state.mainModalKey + 1,
                                confirmLoading: false
                            });
                            // 点击操作后 重新请求后台数据 渲染页面
                            this.props.getLoanDetail(this.props.code)
                            // Config.localItem('DEFAULT_TAB','all')
                            // browserHistory.push('/loans/all');
                        } else {
                            this.setState({
                                confirmLoading: false
                            })
                            message.error(res.msg);
                        }
                    })
                } else {
                    message.warning('至少要添加一张图片');
                }
            }
        }else{
            this.setState({
                confirmLoading: true
            })
            Config.put('/v1/loan/borrowInfo/makeLoan', params, (res) => {
                if (res.code == Config.errorCode.success) {
                    message.success('放款确认成功');
                    this.setState({
                        confirmVisible: false,
                        repaymentDate: 0,
                        startDate: 0,
                        endDate: 0,
                        bankNo: null,
                        borrowMoney: null,
                        mainModalKey: this.state.mainModalKey + 1,
                        confirmLoading: false
                    });
                    // 点击操作后 重新请求后台数据 渲染页面
                    this.props.getLoanDetail(this.props.code)
                    // Config.localItem('DEFAULT_TAB','all')
                    // browserHistory.push('/loans/all');
                } else {
                    this.setState({
                        confirmLoading: false
                    })
                    message.error(res.msg);
                }
            })
        }
    }

    // 修改卡号
    changeBankNo = (e) => {
        this.setState({
            bankNo: e.target.value
        })
    }
    //修改借款金额
    changeBorrowMoney = (e) => {
        let that = this;
        let money = e.target.value;
        clearTimeout(this.timer)
        let { bonusShow, bonusNum } = this.state;
        let { loanDetail } = this.props;
        if (!(e.target.value >= 0 && e.target.value < 100000000.00 && /^(\d+)(\.?)(\d{0,2})$/.test(e.target.value))) {
            message.error('请输入正确的放款金额！');
        } else {
            this.timer = setTimeout(() => {
                if (bonusShow) {
                    this.setState({
                        contentState: false,
                        titleState: false
                    })
                    that.getbonusMoney(money)
                } else {
                    that.setState({
                        dailyRate: loanDetail.dailyRate,
                    })
                }
            }, 2000)
        }
        this.setState({
            borrowMoney: e.target.value
        })

    }
    // //修改借款日利率
    // changeDailyRate = (e) => {
    //     this.setState({
    //         dailyRate: e.target.value
    //     })
    // }
    // 放款确认 出现模态框  取消操作
    handleCancel = () => {
        this.setState({
            confirmVisible: false,
            mainModalKey: this.state.mainModalKey + 1
        });
    }
    // 发送催收短信
    sendOverdueMsg() {
        let that = this;
        const { code } = this.props;
        Config.post('/v1/loan/borrowInfo/overdue', { code: code }, (res) => {
            if (res.code == Config.errorCode.success) {
                message.success('催收短信发送成功');
                that.props.getLoanDetail(code)
            } else {
                message.error(res.msg);
            }
        });
    }
    // 创建催收任务
    sendOverdueTask() {
        let that = this;
        const { code } = this.props;
        Config.post('/v1/loan/collection/task', { borrowCode: code }, (res) => {
            if (res.code == Config.errorCode.success) {
                message.success('催收任务创建成功');
                that.props.getLoanDetail(code)
            } else {
                message.error(res.msg);
            }
        });
    }
    // 点击选中或者取消抵息红包
    bonusClick = () => {
        let { bonusShow, borrowMoney } = this.state;
        let { loanDetail } = this.props;
        if (bonusShow == true) {
            this.setState({
                dailyRate: loanDetail.dailyRate
            })
        } else {
            this.getbonusRate(borrowMoney)
        }
        this.setState({
            bonusShow: !bonusShow
        })
    }
    async getbonusMoney(borrowMoney) {
        let { loanDetail } = this.props;
        let borrowMoneys = borrowMoney || this.state.borrowMoney;
        let { code } = this.props;
        let params = {
            money: borrowMoneys,
            code: code
        }
        let res = await LoanService.getbonusMoney(params);
        if (res.code == Config.errorCode.success) {
            if (res.data) {
                this.setState({
                    bonusShow: true,
                    titleState: true
                })
                this.getbonusRate(borrowMoneys);
            } else {
                this.setState({
                    contentState: true,
                    dailyRate: loanDetail.dailyRate
                })
            }
            this.setState({
                bonusNum: res.data || 0,
            })
        }
    }
    async getbonusRate(borrowMoney) {
        let borrowMoneys = borrowMoney || this.state.borrowMoney;
        let { code } = this.props;
        let params = {
            money: borrowMoneys,
            code: code
        }
        let res = await LoanService.getbonusRate(params);
        if (res.code == Config.errorCode.success) {
            this.setState({
                dailyRate: res.data || 0,
                contentState: true
            })
        }
    }
    loadingShow = () => {
        this.setState({ loading: true })
    }
    loadingHide = () => {
        this.setState({ loading: false })
    }
    loadingShow2 = () => {
        this.setState({ loading2: true })
    }
    loadingHide2 = () => {
        this.setState({ loading2: false })
    }
    // 抵押完成确认
    handleOkMorigage = async () => {
        let { code } = this.props;
        let res = await LoanService.putFinishMortgage({code:code})
        if (res.code == Config.errorCode.success) {
            this.setState({ morigageVisible: false })
            browserHistory.push('/loans/all');
        }
    }
    render() {
        const { bcrumb, loanDetail, type, code } = this.props;
        const { bankNo, startBankNo, confirmLoading, borrowMoney, dailyRate, popShow, bonusShow, bonusNum, contentState, titleState, loading, loading2 } = this.state
        let operateButton = loanDetail.operateButton;
        const buttonArr = [
            {
                name: 'collection_sms',//催收短信按钮
                content: <span className="button-loan" key="collection_sms" onClick={() => this.sendOverdueMsg()}>催收短信</span>
            }, {
                name: 'collection',//催收按钮
                content: <span className="button-loan" key="collection" onClick={() => this.sendOverdueTask()}>催收</span>
            }, {
                name: 'audit',//审批
                content: <span className="button-loan" key="audit"><Link to={'/loan/appro/' + code} style={{ color: '#000', width: '100%', display: 'inline-block' }} >审批</Link></span>
            }, {
                name: 'examine',//审查
                content: <span className="button-loan" key="examine"><Link to={'/loan/examine/' + code} style={{ color: '#000', width: '100%', display: 'inline-block' }} >审查</Link></span>
            }, {
                name: 'make_loan',//放款确认
                content: <span className="button-loan" key="make_loan" onClick={this.confirmLoan.bind(this)}>放款确认</span>
            }, {
                name: 'close_account',//结清确认
                content: <span className="button-loan" key="close_account" onClick={this.settledLoan.bind(this)}>结清确认</span>
            }, {
                name: 'morigage',//抵押完成
                content: <span className="button-loan" key="morigage" onClick={this.morigage.bind(this)}>抵押完成</span>
            }, {
                name: 'download_contract',//下载合同
                content: <span className="button-loan" key="download_contract"><Link style={{ color: '#000', width: '100%', display: 'inline-block' }} onClick={this.downloadContract.bind(this)}>下载合同</Link></span>
            },
        ]
        return (
            <div className="breadcrumb-container">
                <Breadcrumb className='breadcrumb'>
                    {
                        bcrumb.map((info, index) => (
                            <Breadcrumb.Item key={index} className='breadcrumb-item'>{info.link || info.goBack ? info.goBack ? <Link onClick={() => browserHistory.goBack()}>{info.value}</Link> : <Link to={info.link}>{info.value}</Link> : info.value}</Breadcrumb.Item>
                        ))
                    }
                </Breadcrumb>
                <div className="button-wrapper">
                    {
                        operateButton && type != 'approve' ?
                            buttonArr.filter((item, index) => (operateButton.includes(item.name))).map(item => item.content) : null
                    }
                </div>
                {/*抵押完成模态框  */}
                <Modal
                    visible={this.state.morigageVisible}
                    title="抵押完成"
                    onOk={this.handleOkMorigage}
                    onCancel={this.handleCancleMorigage}
                    className='replenish-modal'
                    footer={[
                        <Button key="submit" type="primary" size="large" style={{ marginRight: 8 }} onClick={this.handleOkMorigage}>确定</Button>,
                        <Button key="back" size="large" onClick={this.handleCancleMorigage}>取消</Button>
                    ]}
                >
                    <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                        <Row>
                            <Col span={5}>已设抵押登记证</Col>
                            <Col span={18}><MultUploadImg code={this.props.code} type={Config.bizType.borrowMortgageAndOtherData} loadingShow={this.loadingShow} loadingHide={this.loadingHide} /></Col>
                        </Row>
                    </Spin>
                </Modal>
                {/*结清确认模态框  */}
                <Modal
                    visible={this.state.settledVisible}
                    title="结清确认"
                    onOk={this.handleOkay}
                    onCancel={this.handleCallof}
                    className='settled-modal'
                    footer={[
                        <Button key="submit" type="primary" size="large" style={{ marginRight: 8 }} onClick={this.handleOkay}>确定</Button>,
                        <Button key="back" size="large" onClick={this.handleCallof}>取消</Button>
                    ]}
                >
                    <p className='closed-title'>确认客户已经结清所有借款了吗？</p>
                </Modal>
                {/*放款确认模态框  */}
                <Modal
                    visible={this.state.confirmVisible}
                    key={this.state.mainModalKey}
                    className='confirm-modal confirm-modal-loan'
                    title="放款确认"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="submit" type="primary" loading={confirmLoading} size="large" style={{ marginRight: 8 }} onClick={this.handleOk}>确定</Button>,
                        <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>
                    ]}
                    wrapClassName='loan-confirm-modal'
                >
                    <Spin tip={Config.warnInfo.spinText} spinning={loading2}>
                        <p className='secure-title'>确认已经放款给客户了吗？</p>
                        <p className='repament-date'><Icon type="pay-circle" className='icon-credit' />若已放款，请选择客户开始还款日、客户借款合同有效期，输入收款银行卡、实际放款金额和实际借款日利率</p>
                        <div className='loan-confirm-item'>
                            <span className='loan-confirm-span'>还款日</span>
                            <DatePicker
                                onChange={this.confirmRepaymentDate}
                                placeholder="请选择"
                                style={{ width: '250px' }}
                                format='MM-DD'
                            />
                        </div>
                        <div className='loan-confirm-item'>
                            <span className='loan-confirm-span'>有效期</span>
                            <DatePicker
                                disabledDate={this.disabledStartContract}
                                format="YYYY-MM-DD "
                                placeholder="开始时间"
                                style={{ width: '110px' }}
                                onChange={this.onStartContract}
                            />
                            <span style={{ padding: '0 10px' }}>—</span>
                            <DatePicker
                                disabledDate={this.disabledEndContract}
                                format="YYYY-MM-DD "
                                placeholder="结束时间"
                                style={{ width: '110px' }}
                                onChange={this.onEndContract}
                            />
                        </div>
                        <div className='loan-confirm-item'>
                            <span className='loan-confirm-span'>收款银行卡</span>
                            {
                                startBankNo ?
                                    <span>{bankNo}</span>
                                    :
                                    <Input className='bank-card' placeholder='请输入' onChange={this.changeBankNo} />
                            }
                        </div>
                        <div className='loan-confirm-item loan-confirm-item4'>
                            <span className='loan-confirm-span'>实际放款金额</span> <Input placeholder='请输入' onChange={this.changeBorrowMoney} addonAfter='元' value={borrowMoney} />
                        </div>
                        {loanDetail.hasOtherOperate == 'guarantee' ? <div className='loan-confirm-item loan-confirm-item4'>
                            <span className='loan-confirm-span'>担保函</span>
                            <MultUploadImg code={this.props.code} type={Config.bizType.borrowGuaranteeAndOtherData} loadingShow={this.loadingShow2} loadingHide={this.loadingHide2} />
                        </div> :null}
                        <div className='loan-confirm-item loan-confirm-item4'>
                            {/* <div style={{minWidth:'100px'}}>
                            <Popover placement="bottom" content={contentState ? (
                                <div>
                                    <p>月利率：{(dailyRate * 300).toFixed(4)}‰</p>
                                    <p>年利率：{(dailyRate * 360).toFixed(4)}%</p>
                                </div>
                            ) : (<div>
                                计算中......
                        </div>)} visible={popShow} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                <span className='loan-confirm-span'>实际借款日利率</span>
                            </Popover>
                        </div> */}
                            <div className='loan-popover'>
                                <span className='loan-confirm-span'>实际借款日利率</span>
                                <div className="loan-popover-rate">
                                    <div className="loan-popover-arrow"></div>
                                    {contentState ? (
                                        <div className="loan-popover-warp">
                                            <p>月利率：{(dailyRate * 300).toFixed(4)}‰</p>
                                            <p>年利率：{(dailyRate * 360).toFixed(4)}%</p>
                                        </div>
                                    ) : (<div className='loan-popover-warp'>
                                        计算中......
                        </div>)}
                                </div>
                            </div>
                            <Input placeholder='请输入' addonAfter='%' value={dailyRate} disabled={true} />
                            <div>
                                {bonusNum ? <Tooltip placement="top" title={titleState ? `可使用抵息红包总额${bonusNum}元` : '计算中......'} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                    <div className={`loan-confirm-bonus ${bonusShow ? 'loan-confirm-bonus-selected' : ''}`}>使用 <span>抵息红包</span></div>
                                </Tooltip> : null}
                            </div>

                        </div>
                    </Spin>
                </Modal>
            </div>
        )
    }
}

const pureBcrumbItem = pureRender(BcrumbItem);

export default pureBcrumbItem;
