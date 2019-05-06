import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { browserHistory, Link } from 'react-router';
import ContractPDF from '../Contract/ContractPDF';
import DetailLoanApproval from './DetailLoanApproval';
import './style/detailOrAppro.less';

import { Icon, Button, Row, Col, Modal, message} from 'antd';

/**
 * 借款管理
 * @Author: 赵俊
 * @Date:   2017-08-08
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-08-08
 */

/**
 * 根据路由path="/loan/:type"获取type来进行判断转入借款详情页或是借款审批页
 * 参考CustomerDetail
 * loading 来源this.props
 * 如果需要从store拿数据 注意connect
 * 面包屑是个组件，已经封装，可用
 *
 * 身份证号 联系方式 收款账号 需要进行判断是否与客户信息匹配 consistent unconsistent
 * 查看调查报告 查看合同 是不是预览模式？
 * 审批结果需要进行判断 如果成功 给出信息 如果拒绝 给出原因 76行
 * 如果是审批页，需要对提交审批和审批拒绝按钮定义函数
 */
class DetailOrAppro extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
            loading: false,
            visible: false,
            examineVisible: false,
            permitedVisible: false,
            examineReVisible: false,
            rejectReason:'',
            previewShow: false,
            width: null,
            mainModalKey: 0,
            examineModalKey: 1
        }
    }
    componentDidMount() {
        Config.calculateSize(this);
	}
    // 审批通过
    permitLoan = () => {
        this.setState({
            permitedVisible:true
        })
    }
    // 审查通过
    permitExamine = () => {
        this.setState({
            examineVisible:true
        })
    }
    // 审批通过模态框 确认操作
    handleOkay = () => {
        // 这个params是从LoanOperate传来的，是借款编码，已经是object了
        let params = this.props.params;
        Config.put('/v1/loan/borrowInfo/audit/pass',params,(res) =>{
            if(res.code == Config.errorCode.success) {
                message.success('提交成功');
                this.setState({
                    visible:false
                })
                browserHistory.push('/loans/all');
            } else {
                message.error(res.msg)
            }
        });
    }
    // 审查通过模态框 确认操作
    handleOkExamine = () => {
        // 这个params是从LoanOperate传来的，是借款编码，已经是object了
        let params = this.props.params;
        Config.put('/v1/loan/borrowInfo/examine/pass',params,(res) =>{
            if(res.code == Config.errorCode.success) {
                message.success('提交成功');
                this.setState({
                    examineVisible:false
                })
                browserHistory.push('/loans/all');
            } else {
                message.error(res.msg)
            }
        });
    }
    // 审批通过模态框 取消操作
    handleCallof = () => {
         this.setState({
            permitedVisible:false,
            examineVisible:false
        })
    }
    // 审批拒绝
    rejectLoan = () => {
        this.setState({
            visible:true
        })
    }
    // 审查拒绝
    rejectExamine = () => {
        this.setState({
            examineReVisible:true
        })
    }
    // 审批拒绝模态框 确定
    handleOk = () => {
        // 这个params是从LoanOperate传来的，是借款编码，已经是object了
        let params = this.props.params;
        params.rejectReason = this.state.rejectReason;
        if(Config.isNull( params.rejectReason)) {
            message.error('拒绝原因不能为空')
            return;
        }
        Config.put('/v1/loan/borrowInfo/audit/reject',params,(res) =>{
            if(res.code == Config.errorCode.success) {
                message.success('提交成功');
                this.setState({
                    visible:false
                })
                browserHistory.push('/loans/all');
            } else {
                message.error(res.msg)
            }
        })
    }
    // 审查拒绝模态框 确定
    handleReExamine = () => {
        // 这个params是从LoanOperate传来的，是借款编码，已经是object了
        let params = this.props.params;
        params.rejectReason = this.state.rejectReason;
        if(Config.isNull( params.rejectReason)) {
            message.error('拒绝原因不能为空')
            return;
        }
        Config.put('/v1/loan/borrowInfo/examine/reject',params,(res) =>{
            if(res.code == Config.errorCode.success) {
                message.success('提交成功');
                this.setState({
                    examineReVisible:false
                })
                browserHistory.push('/loans/all');
            } else {
                message.error(res.msg)
            }
        })
    }
    // 审批拒绝模态框 取消
    handleCancel = () => {
        this.setState({
            visible:false,
            examineReVisible:false,
            mainModalKey:this.state.mainModalKey+1,
            examineModalKey:this.state.examineModalKey+1,
            rejectReason:''
        })
    }
    // 获取模态框拒绝原因内容
    entryReason = (e) => {
        let value = e.target.value;
        if(value.length>64) return;
        this.setState({
            rejectReason: e.target.value
        });
    }
	previewClose = () => {
		this.setState({
			previewShow: false
		})
	}
    preview = () => {
        this.setState({
			previewShow: true,
            file: `/comm/contract/view/${this.props.params.code}`
        })
    }
	render() {
        const { previewShow, width, file } = this.state;
        let { type, openUploadImg, getPictureInfo,getRepaymentPlan } = this.props;
        let loanDetail = this.props.loanDetail;
        let loanStatus =  loanDetail? loanDetail.loanStatus : 3;
        // let arr = [ 'verified', 'inconsistent', 'unknown', 'unverified' ]  //0核实匹配1核实不匹配2未知3未核实
		return (
            <div>
                <div className="loan-detail">
                <div className="botton-list">
                {
                    (loanDetail && loanDetail.loanBorrowAudits && loanDetail.loanBorrowAudits.length != 0) ?
                    <DetailLoanApproval loanAuditVOList={loanDetail.loanBorrowAudits}/>:null
                }
                </div>
                {
                    type == 'detail' ?
                        loanStatus == 3?
                            <Row className="survey-report-content">
                                <Col span={8} className="report-item">
                                    <span>审批结果：</span>
                                    <span className='reject-appro'>{loanDetail ? loanDetail.loanStatusText : ''}</span>
                                </Col>
                                <Col span={16} className="report-item">
                                    <span>拒绝原因：</span>
                                    <span className='reject-appro'>{loanDetail ? loanDetail.rejectReason : ''}</span>
                                </Col>
                                {/* <Col span={16} className="report-item">
                                    <span className='inconsistent'>银行卡号与手机号码不匹配</span>
                                </Col>   */}
                            </Row>
                            :
                            <Row className="survey-report-content">
                                <Col span={8} className="report-item">
                                    <span>审批结果：</span>
                                    <span className='pass-appro'>{loanDetail ? loanDetail.loanStatusText : ''}</span>
                                </Col>
                            </Row>
                    : null
                    // <Row className="survey-report-content">
                    //     <Col span={16} className="report-item">
                    //         <span className='unknown'>银行卡与本人关系未知</span>
                    //     </Col>
                    // </Row>
                }
                <Row className="client-info">
                    <Col span={20} className="client-title">
                        <span>客户信息</span>
                    </Col>
                    <Col span={4} className="survey-title">
                        {
                            type == 'appro' || type == 'examine' ?
                            <span className='loan-subtitle-attachment' onClick={()=>openUploadImg(Config.bizType.borrow)}>添加文件</span> : null
                        }
                        {
                            type == 'detail'&&loanDetail&&loanDetail.operateButton&&loanDetail.operateButton.includes('borrow_after_data')?
                            <span className='loan-subtitle-attachment' onClick={()=>openUploadImg(Config.bizType.borrowAfterData)}>贷后资料</span> : null
                        }
                        <span className='loan-subtitle-attachment' onClick={()=>getPictureInfo(Config.bizType.borrow)}>查看文件</span>
                        {/* 暂时隐藏 */}
                        {/* {loanDetail && loanDetail.loanStatus==4?<span className='loan-subtitle-attachment' onClick={()=>getRepaymentPlan()}>查看还款计划</span>:null} */}
                    </Col>
                </Row>
                <Row className="client-info-content">
                    <Col span={8} className="content-item">
                        <span>姓名：{loanDetail ? loanDetail.custName : '未录入' }</span>
                    </Col>
                    <Col span={8} className="content-item">
                        <span>授信额度：{loanDetail && loanDetail.creditAmount ? loanDetail.creditAmount +'元' : '未录入' }</span>
                    </Col>
                    <Col span={8} className="content-item">
                        <span>身份证号：{loanDetail ? loanDetail.idCardNo : '未录入' }</span>
                        {/*<img onClick={()=>showDetail('idcard')} className="idcard" src={Idcard} alt="身份证" />*/}
                        {/* {loanDetail.bankCardVerifyRet == null || loanDetail.bankCardVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[loanDetail.nameIdCardVerifyRet]}>{loanDetail.nameIdCardVerify }</span>} */}
                    </Col>
                     <Col className="content-item">
                        <span>联系方式：{loanDetail ? loanDetail.telephone : '未录入' }</span>
                        {/* {loanDetail.nameTelVerifyRet  == null || loanDetail.nameTelVerifyRet  == 3?<span className={arr[3]}>未核实</span>: <span className={arr[loanDetail.nameTelVerifyRet ]}>{loanDetail.nameTelVerify  }</span>} */}
                    </Col>
                </Row>
                <Row className="loan-apply">
                    <Col span={20} className="loan-title">
                        <span>借款申请</span>
                    </Col>
                    {/* 当借款状态大于3时，即已放款和已结清状态才有下载合同 */}
                    {/*{
                        loanStatus > 3?
                        <Col span={3} className="survey-title">
                            <Link onClick={this.preview}><Icon type="idcard" className='report-icon'/>查看合同</Link>
                        </Col>
                        :null
                    }*/}
                    {
                        loanDetail && loanDetail.loanStatus !=3 && loanDetail.auth ?
                        <Col span={4} className="survey-title">
                            <Link onClick={this.preview}><Icon type="idcard" className='report-icon'/>查看合同</Link>
                        </Col> :null
                    }
                    {/* <Col span={3} className="survey-title">
                        <Link onClick={this.preview}><Icon type="idcard" className='report-icon'/>查看合同</Link>
                    </Col> */}
                </Row>
                <Row className="loan-apply-content">
                    <Col span={6} className="content-item">
                        <span>借款金额：{loanDetail ? loanDetail.borrowMoney +'元' : '未录入' }</span>
                    </Col>
                    <Col span={6} className="content-item">
                        <span>日利率：{loanDetail ? loanDetail.dailyRate +'%' : '未录入' }</span>
                    </Col>
                    <Col span={6} className="content-item">
                        <span>还款期限：{loanDetail ? loanDetail.repaymentPeriod +'期' : '未录入' }</span>
                    </Col>
                    <Col span={6} className="content-item">
                        <span>还款方式：{loanDetail ? loanDetail.repaymentKindText : '' }</span>
                    </Col>
                    <Col span={12} className="content-item">
                        <span>收款账户：{loanDetail && loanDetail.bankNo ? loanDetail.bankNo : '未录入' }  </span>
                        {/* {loanDetail && loanDetail.bankNo ? loanDetail.bankCardVerifyRet  == null || loanDetail.bankCardVerifyRet  == 3?<span className={arr[3]}>未核实</span>: <span className={arr[loanDetail.bankCardVerifyRet ]}>{loanDetail.bankCardVerify  }</span> : null} */}
                             {/* <span className={loanDetail ? loanDetail.bankCardVerifyRet <= 1 ? loanDetail.bankCardVerifyRet = 0 ? 'consistent' : 'unconsistent': 'unknown' : null }>
                                 <Icon type={loanDetail ? loanDetail.bankCardVerifyRet == 'unconsistent' ?  "close-circle": loanDetail.bankCardVerifyRet == 'consistent' ? 'consistent' : 'unknown'  : null }/> {loanDetail ? loanDetail.bankCardVerify : ''}
                             </span> */}
                    </Col>
                    <Col span={6} className="content-item">
                        <span>实际放款金额：{loanDetail&&loanDetail.lendMoney ? loanDetail.lendMoney+'元' : '未录入' }</span>
                    </Col>
                </Row>
                {
                    type == 'appro' ?
                    <Row className='submit-appro'>
                        <Button className='permit-btn' type="primary" size='large' onClick={this.permitLoan}>审批通过</Button>
                        <Button className='refuse-btn' size='large' onClick={this.rejectLoan}>审批拒绝</Button>
                    </Row>
                    :null
                }
                {
                    type == 'examine' ?
                    <Row className='submit-appro'>
                        <Button className='permit-btn' type="primary" size='large' onClick={this.permitExamine}>审查通过</Button>
                        <Button className='refuse-btn' size='large' onClick={this.rejectExamine}>审查拒绝</Button>
                    </Row>
                    :null
                }
                {/* 审批拒绝模态框 */}
                <Modal
                    className='reject-modal'
					visible={this.state.visible}
					title="借款拒绝原因"
					onOk={this.handleOk}
					onCancel={this.handleCancel}
                    key={this.state.mainModalKey}
					footer={[
						<Button key="submit" type="primary" size="large" style={{marginRight: 20}} onClick={this.handleOk}>确定</Button>,
						<Button key="back" size="large"  onClick={this.handleCancel}>取消</Button>

					]}
					>
                    <span className='reject-reason'>拒绝原因</span>
					<textarea className="reason-content" placeholder="请输入"  onChange={this.entryReason}></textarea>
                    <span className='reason-content-foot'>{this.state.rejectReason.length}/64</span>
				</Modal>
                {/* 审批通过模态框 */}
                <Modal
					visible={this.state.permitedVisible}
                    className='reject-modal'
					title="审批通过确认"
					onOk={this.handleOkay}
					onCancel={this.handleCallof}
					footer={[
						<Button key="submit" type="primary" size="large" style={{marginRight: 8}} onClick={this.handleOkay}>确定</Button>,
						<Button key="back" size="large"  onClick={this.handleCallof}>取消</Button>
					]}
					>
					<p className='pass-content'>审批通过后将进入放款流程，确认要提交吗？</p>
				</Modal>
                {/* 审查拒绝模态框 */}
                <Modal
                    className='reject-modal'
					visible={this.state.examineReVisible}
					title="借款审查拒绝原因"
					onOk={this.handleReExamine}
                    onCancel={this.handleCancel}
                    key={this.state.examineModalKey}
					footer={[
						<Button key="submit" type="primary" size="large" style={{marginRight: 20}} onClick={this.handleReExamine}>确定</Button>,
						<Button key="back" size="large"  onClick={this.handleCancel}>取消</Button>

					]}
					>
                    <span className='reject-reason'>拒绝原因</span>
					<textarea className="reason-content" placeholder="请输入"  onChange={this.entryReason}></textarea>
                    <span className='reason-content-foot'>{this.state.rejectReason.length}/64</span>
				</Modal>
                {/* 审查通过模态框 */}
                <Modal
					visible={this.state.examineVisible}
                    className='reject-modal'
					title="审查通过确认"
					onOk={this.handleOkExamine}
					onCancel={this.handleCallof}
					footer={[
						<Button key="submit" type="primary" size="large" style={{marginRight: 8}} onClick={this.handleOkExamine}>确定</Button>,
						<Button key="back" size="large"  onClick={this.handleCallof}>取消</Button>
					]}
					>
					<p className='pass-content'>审查通过后将进入审批流程，确认要提交吗？</p>
				</Modal>
            </div>
            {
                previewShow?
                <ContractPDF width = {width} file = {file} previewClose = {this.previewClose} />:
                null
            }
            </div>
		);
	}
}

export default DetailOrAppro;
