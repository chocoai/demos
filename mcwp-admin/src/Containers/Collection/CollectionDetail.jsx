import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Link } from 'react-router';

import './style/collectionDetail.less';
import CollectionService from '../../Services/CollectionService';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';

import CarouselImg from '../../Component/Ipieces/CarouselImg';

import { message, Col , Icon , Row, Timeline, Spin, Modal  } from 'antd';
// import DetailImg from '../../Component/Ipieces/DetailImg';

/**
 * 催收管理详情
 */
class CollectionDetail extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
			code: props.routeParams.code,
			collection: [],
			collectionDetail:[],
			custName:null,
			width: null,
			pictureInfo: [], //照片信息
			showPicture: '',
			previewPic:false,
			pictureType: '',  // 获取照片类型
			playId: 0,
			visible: false,
			mainModalKey: 0,
			borrowCode: '',
			repaymentPlan:''
		};
	}
	componentDidMount(){
		this.getInfo()
		this.getPictureInfo()
		// this.getRepaymentPlan()
	}
	getInfo (timer) {
		const that = this;
		const { code } = this.state;
		let params = {
            code: code
        }
		CollectionService.getCollectionD( params , (res) => {
            if(res.code == Config.errorCode.success) {
				if(res.data) {
					let voiceTraning = [];
					if(timer) {
						res.data.loanSurveyInfoDTOS.map((itemDto, indexDto) => {
							if (itemDto.status == 2) voiceTraning.push(itemDto.infoId);
						})
                    };
                    if (voiceTraning.length == 0 && timer) clearInterval(timer);
					that.setState({
						collectionD: res.data
					});
					let params1 = {
						borrowCode: res.data.borrowCode
					}
					CollectionService.getRepaymentPlan( params1 , (res) => {
						if(res.code == Config.errorCode.success) {
							if(res.data) {
								this.setState({
									repaymentPlan: res.data
								})
							}
						} else {
							message.error(res.msg);
						}
					});
				}
            } else {
                message.error(res.msg);
			}
		});
	}
	// getRepaymentPlan () {
	// 	const that = this;
	// 	const { borrowCode } = that.state;
	// 	console.log(borrowCode,'111')
	// 	console.log(this.state.borrowCode)
	// 	let params = {
    //         borrowCode: borrowCode
    //     }
	// 	CollectionService.getRepaymentPlan( params , (res) => {
    //         if(res.code == Config.errorCode.success) {
	// 			if(res.data) {
	// 				this.setState({
    //                     repaymentPlan: res.data
    //                 })
	// 			}
    //         } else {
    //             message.error(res.msg);
	// 		}
	// 	});
	// }
	getPictureInfo = () => {  // 照片信息
        // 人脸 LOAN_PERSON_IDENTITY_FACE 身份证正面 LOAN_PERSON_IDENTITY_FRONT 身份证反面 LOAN_PERSON_IDENTITY_BACK
    	let type = '/LOAN_HOUSE_PIC,LOAN_PERSON_MARRICERT,LOAN_BUSIINFO_PURCHASE,LOAN_FAMILY_HOMEVISIT,LOAN_PERSON_IDENTITY_FRONT,LOAN_SPOUSE_IDENTITY,LOAN_OTH,LOAN_HOUSE_HOUSERIGHT,LOAN_GUARANTEE_IDENTITY,LOAN_SPOUSE_INCOME,LOAN_PERSON_EDUCERT,LOAN_HOUSE_HOUSING,LOAN_BUSIBASE_PALACE,LOAN_BUSIBASE_HOUSEFUND,LOAN_BUSIBASE_LEASE,LOAN_BUSIINFO_STOCK,LOAN_PERSON_HOUSEHOLD,LOAN_CAR_DRIVINGLIC,LOAN_SPOUSE_GRADUCERT,LOAN_CAR_CARRIGHT,LOAN_BUSIINFO_ACCBOOK,LOAN_PERSON_IDENTITY_BACK,LOAN_PERSON_IDENTITY_FACE,LOAN_BUSIBASE_BUSILIC,LOAN_CAR_PIC,LOAN_SPOUSE_EDUCERT,LOAN_PERSON_GRADUCERT,LOAN_BUSIBASE_SOCIALSEC,LOAN_COBORROWER_IDENTITY'
    	let code = this.state.code;
    	Config.get('/v1/oss/'+ code + type + '/picture', {}, (res) => {
            if(res.code == Config.errorCode.success) {
            	if(JSON.stringify(res.data) != "{}"){
					let newData = [];
					for(let x in res.data) {
						for(let j in res.data[x]) {
							newData.push(res.data[x][j])
						}
					}
					let newObj = { LOAN_FAMILY_HOMEVISIT : newData}
                    this.setState({
                        pictureInfo: newObj
                    })
				}

            } else {
                message.error(res.msg);
            }
        });
	}
	showPicture = (type) => {
		this.setState({
    		pictureType: type,
    		previewPic: true
    	});
	}
    previewHide = (type) => {
        this.setState({
            [type]: false,
        });
	}
	showModal = () => {
		this.setState({
			visible: true,
		});
	}
	handleCancel = (e) => {
		this.setState({
			visible: false,
			mainModalKey:this.state.mainModalKey+1
		});
	}
	audioPlay = (id) => {
        const that = this;
        const {playId} = that.state;
        const playAudio = document.getElementById(id);
        if (playId) document.getElementById(playId).pause();
        playAudio.load(); // 重新加载音频元素
        playAudio.play();
        that.audioTimer = setInterval(() => {
            if (playAudio.ended) {
                if (that.audioTimer) clearInterval(that.audioTimer);
                that.setState({
                    playId: 0
                });
            }
        }, 500);
        that.setState({
            playId: id
        });
    }
    goTranslate = (id) => { // 转文字
        const that = this;
        const params = {
            infoId: id
        };
        CollectionService.translateVoice(params, (res) => {
            if (res.code == Config.errorCode.success) {
                that.getInfo(undefined);
                let transTimer = setInterval(function() {
                    that.getInfo(transTimer);
                }, 5000);
            } else {
                message.error(res.msg);
            }
        })
    }
	render() {
		const that = this;
		const { pictureInfo , playId, pictureType, repaymentPlan } = that.state;
		let arr = [ 'verified', 'inconsistent', 'unknown', 'unverified' ]  //0核实匹配1核实不匹配2未知3未核实
		let collectionDetails=this.state.collectionD;
		const bcrumb = [{
            'link': '/collection/all',
            'value': '催收管理'
        }, {
            'link': null,
            'value':'催收详情',
		}];
		return (
			<div className="collectionDetail-container">
				<BcrumbItem bcrumb={bcrumb} />
                <div className="collectionDetail">
					<Row className="personal-info">
						<Col span={20} className="title">
							<span>客户信息</span>
						</Col>
						{
							repaymentPlan && repaymentPlan.list.length > 0 ? <Col span={3} className="survey-title">
								<Link onClick={this.showModal}><Icon type="file-text" className='report-icon'  />查看还款计划</Link>
							</Col> : null
						}
					</Row>
					<Row className="personal-info-content">
						<Col span={6} className="title">
							<span>姓名：{collectionDetails ?collectionDetails.custName : '未录入'}</span>
						</Col>
						<Col span={6} className="title">
							<span>借款金额：{collectionDetails ? collectionDetails.borrowMoney +'元' : '未录入'}</span>
						</Col>
						<Col span={12} className="title">
							<span>身份证号：{collectionDetails ? collectionDetails.idCardNo : '未录入'}</span>
							{collectionDetails && collectionDetails.loanBorrowInfoVO ? collectionDetails.loanBorrowInfoVO.bankCardVerifyRet == null || collectionDetails.loanBorrowInfoVO.bankCardVerifyRet == 3?<span className={arr[3]}>未核实</span>: <span className={arr[collectionDetails.loanBorrowInfoVO.nameIdCardVerifyRet]}>{ collectionDetails.loanBorrowInfoVO.nameIdCardVerify}</span> : null}
						</Col>
						<Col span={12} className="title">
							<span>联系方式：{collectionDetails ? collectionDetails.telephone : '未录入' }</span>
							{collectionDetails && collectionDetails.loanBorrowInfoVO ? collectionDetails.loanBorrowInfoVO.nameTelVerifyRet  == null || collectionDetails.loanBorrowInfoVO.nameTelVerifyRet  == 3?<span className={arr[3]}>未核实</span>: <span className={arr[collectionDetails.loanBorrowInfoVO.nameTelVerifyRet ]}>{collectionDetails.loanBorrowInfoVO.nameTelVerify  }</span> :null}
						</Col>
					</Row>
					<Row className="personal-info">
						<Col span={20} className="title">
							<span>催收纪要</span>
						</Col>
						{
							pictureInfo && Object.keys(pictureInfo).length ? <Col span={3} className="survey-title">
								<span style={{cursor: 'pointer'}} onClick={this.showPicture.bind(this,'LOAN_FAMILY_HOMEVISIT')}><Icon type="idcard" className='report-icon' />照片信息</span>
							</Col> : null
						}
					</Row>
					<Row className="personal-info-content">
						{
							collectionDetails && collectionDetails.loanSurveyInfoDTOS && collectionDetails.loanSurveyInfoDTOS.length ?
								<Col span={20} className="title">
									<Timeline>
										{
											collectionDetails.loanSurveyInfoDTOS.map((item, index)=>(
												<Timeline.Item key={index}>
													<span className='time-item'>{Config.formatDateTime(item.createDate)}</span>
													{
														item.voice?
														<div>
															<div>
																<audio id={item.infoId} style={{display:'none'}} src={item.srcUrl} controls='controls'>
																您的浏览器不支持 audio 标签。
																</audio>
																<span className="voice-box">
																	<span className={playId == item.infoId ? 'voice-icon voice-git' : 'voice-icon'} onClick={()=>that.audioPlay(item.infoId)}></span>
																	<span className="voice-duration">{item.speechLength || 0}''</span>
																</span>
																{ item.status == 1 || item.status == 4 ? <span className="voice-translate" onClick={()=>that.goTranslate(item.infoId)}>转文字{item.status == 4 ? <em className='fail'>转化失败</em> : null}</span> : (item.status == 2 ? <Spin className="voice-spin" /> : null)}
															</div>
															{
																item.status == 3?
																<p>
																	<span className="voice-order">译：</span>
																	<span>{item.voiceMsg}</span>
																</p>:null
															}

														</div>
														: <p className="voice-name">{item.msg || item.msgName}</p>
													}
												</Timeline.Item>
											))
										}
									</Timeline>
								</Col>:
								<Col span={20} className="title">
									<span>暂无催收纪要信息</span>
								</Col>
						}
					</Row>
				</div>
				{
                    Object.keys(pictureInfo).length && pictureType?
                    <CarouselImg pictureInfo = {pictureInfo} previewHide={this.previewHide} previewPic={this.state.previewPic} pictureType={this.state.pictureType} />:
                    ''
                }
				{/* {
                    Object.keys(pictureInfo).length && baseInfo && idcard?
                    <DetailImg idcard={idcard} baseInfo = {baseInfo} detailPic = {this.state.detailPic}  previewHide={this.previewHide} pictureInfo={pictureInfo} />:
                    null
                } */}
				<Modal
				title="还款计划"
				className="collectionDetail-modal"
				key={this.state.mainModalKey}
				visible={this.state.visible}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				footer=""
				>
				<Timeline>
					{
						repaymentPlan && repaymentPlan.list.map((item, index)=>(
							<Timeline.Item key={index}>
								<p className="time-p">
									<span className="time-stage">{item.period}期</span><span className='time-item'>{item.repaymentDate}</span>
								</p>
								<p><span className="time-money">{item.monthTotal}<span className="time-span">（本金{item.principal}+利息{item.interest}）</span></span></p>
							</Timeline.Item>
						))
					}
				</Timeline>
				</Modal>
			</div>
		);
	}
}

export default CollectionDetail;
