import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import DetailOrAppro from '../../Component/Loan/DetailOrAppro';
import UploadImg from '../../Component/Ipieces/UploadImg';
import CarouselImg from '../../Component/Ipieces/CarouselImg'
import LoanService from '../../Services/LoanService';
import LoanBcrumbItem from '../../Component/Loan/LoanBcrumb';
import { message, Spin, Modal, Timeline } from 'antd';

import './style/loanOperate.less';

/**
 * 借款管理
 * @Author: 赵俊
 * @Date:   2017-08-08
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-08-08
 */

class LoanOperate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			loanDetail: {},
			pictureInfo: [],
			uploadImg: {
				visible: false,
				type: null
			},
			RepaymentPlan: [],//还款计划
			paymentPlanState: false
		}
	}
	componentWillMount() {
		let params = this.props.params.code;
		this.getLoanDetail(params);
	}
	// 获取详情需要去Serviece 新建一个专门的文件来封装借款管理 ajax
	getLoanDetail = (params) => {
		this.setState({ loading: true });
		Config.get('/v1/loan/borrowInfo', { code: params }, (res) => {
			this.setState({ loading: false });
			if (res.code == Config.errorCode.success) {
				this.setState({
					loanDetail: res.data
				});
			} else {
				message.error(res.msg)
			}

		})
	}
	openUploadImg = (type) => {
		this.setState({
			uploadImg: Object.assign(this.state.uploadImg, { visible: true, type })
		})
	}
	closeUploadImg = () => {
		this.setState({
			uploadImg: Object.assign(this.state.uploadImg, { visible: false })
		})
	}
	previewHide = () => {
		this.setState({
			preview: false,
			pictureInfo: ''
		})
	}
	getPictureInfo = (type) => {  // 照片信息
		let code = this.props.params.code;
		Config.get('/v1/oss/' + code + '/LOAN_PERSON,LOAN_SPOUSE,LOAN_EMERGENCY_CONTRACT,LOAN_FAMILY,BORROW,BORROW_AFTER_DATA/*', {}, (res) => {
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
	getRepaymentPlan = async () => {
		this.setState({ loading: true });
		let that = this;
		let code = that.props.params.code;
		let res = await LoanService.getRepaymentPlan({ code: code })
		if (res.code == Config.errorCode.success) {
			if (res.data && res.data.list.length > 0) {
				this.setState({
					RepaymentPlan: res.data.list,
					paymentPlanState: true,
					loading: false
				});
			} else {
				this.setState({
					loading: false
				})
				message.warning('没有还款计划！')
			}

		}
	}
	cancelPaymentPlan = () => {
		this.setState({
			paymentPlanState: false
		})
	}
	render() {
		let type = this.props.params.type;
		let { loanDetail, uploadImg, pictureInfo, RepaymentPlan } = this.state;
		let code = this.props.params.code;
		const bcrumb = [{
            'link': '/loans/all',
            'value': '借款管理'
        }, {
            'link': null,
            'value': type == 'detail' ? '借款详情' : '借款审批'
        }];
		return (
			<Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
				<div className='loanDetail-container' >
					<LoanBcrumbItem bcrumb={bcrumb} type={type} loanDetail={loanDetail} code={code} getLoanDetail={this.getLoanDetail}/>
					<DetailOrAppro type={type} loanDetail={loanDetail} openUploadImg={this.openUploadImg} params={{ code }} getPictureInfo={this.getPictureInfo} getRepaymentPlan={this.getRepaymentPlan} />
				</div>
				{uploadImg.visible &&<UploadImg code={code} type={uploadImg.type} visible={uploadImg.visible} openUploadImg={this.openUploadImg} closeUploadImg={this.closeUploadImg} />}
				<CarouselImg pictureInfo={pictureInfo} previewPic={this.state.preview} previewHide={this.previewHide} />
				<Modal
					title="还款计划"
					visible={this.state.paymentPlanState}
					onCancel={this.cancelPaymentPlan}
					className='payment'
				>
					<Timeline>
						{RepaymentPlan && RepaymentPlan.map(item => <Timeline.Item>
							<div className='payment-title'>
								<span className='payment-title-span'>{item.period}期</span><span>{item.repaymentDate}</span>
							</div>
							<div><span>{item.monthTotal + '元'}</span><span>{`(本金${item.principal}+利息${item.interest})`}</span></div>
						</Timeline.Item>)}
					</Timeline>
				</Modal>
			</Spin>
		);
	}
}

export default LoanOperate;

