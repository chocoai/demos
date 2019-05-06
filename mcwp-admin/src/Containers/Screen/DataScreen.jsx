import React, { Component } from 'react'; // 引入了React
import echarts from 'echarts';
import { is, fromJS } from 'immutable';
import { browserHistory } from 'react-router';
import { Config } from '../../Config/Index';
import { Spin, message } from 'antd';
import './style/dataScreen.less';
import ScreenService from '../../Services/ScreenService';//调用数据
import Line from '../../Component/Screen/Line';
import Situation from '../../Component/Screen/Situation';
import DataInformation from '../../Component/Screen/DataInformation';
import Achievement from '../../Component/Screen/Achievement';
import screenButton from '../../Assets/Images/icon_screen-projection.png';

class Screen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			TotalDataSum: null,
			RankData: null,
			TimeBusinessData: null,
			trendLoanData: null,
			trendLoansData: null,
			trendAddUserData: null,
			topClassName: 'top-info-container',
			businessClassName: 'business-container',
			centerClassName: 'center-info-container',
			trendLoanId: 'trend-loanId',
			trendLoansId: 'trend-loansId',
			trendAddUserId: 'trend-addUserId',
			type: props.params.type,
			screenShow: props.params.type == 'scan' ? true : false,
			screenWord: false
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
	}
	componentWillMount() {
		this.getDataOverview();
		this.getDataBusiFlow();
		this.getDataRank();
		this.getDataLoanTrend();
		this.createBodyStyle();
	}

	componentDidMount() {
		this.changeScreen();
		this.timer = setInterval((function () {
			this.getDataBusiFlow();
		}).bind(this), 120000)
		this.otherTimer = setInterval((function () {
			this.getDataOverview();
			this.getDataLoanTrend();
			this.getDataRank();
		}).bind(this), 1000 * 60 * 60 * 24)
	}
	createBodyStyle() {
		document.body.setAttribute("class", "bodyStyle");
	}
	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
		this.otherTimer && clearInterval(this.otherTimer);
	}
	changeScreen() { // 屏幕改变事件
		if (navigator.userAgent.indexOf('MSIE') !== -1) {
			document.attachEvent('fullscreenchange', this.goExitFullscreen, false);
			document.attachEvent('webkitfullscreenchange', this.goExitFullscreen, false);
			document.attachEvent('mozfullscreenchange', this.goExitFullscreen, false);
			document.attachEvent('MSFullscreenChange', this.goExitFullscreen, false);
		} else {
			document.addEventListener('fullscreenchange', this.goExitFullscreen, false);
			document.addEventListener('webkitfullscreenchange', this.goExitFullscreen, false);
			document.addEventListener('mozfullscreenchange', this.goExitFullscreen, false);
			document.addEventListener('MSFullscreenChange', this.goExitFullscreen, false);
		}
	}
	goExitFullscreen = (act) => { // 退出全屏
		let { type } = this.state;
		const fullscreenEle = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullScreenElement;
		if (act == 'auto') {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozExitFullscreen) {
				document.mozExitFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		}
		if (!fullscreenEle) {
			if (navigator.userAgent.indexOf('MSIE') !== -1) {
				document.detachEvent('fullscreenchange', this.goExitFullscreen, false);
				document.detachEvent('webkitfullscreenchange', this.goExitFullscreen, false);
				document.detachEvent('mozfullscreenchange', this.goExitFullscreen, false);
				document.detachEvent('MSFullscreenChange', this.goExitFullscreen, false);
			} else {
				document.removeEventListener('fullscreenchange', this.goExitFullscreen, false);
				document.removeEventListener('webkitfullscreenchange', this.goExitFullscreen, false);
				document.removeEventListener('mozfullscreenchange', this.goExitFullscreen, false);
				document.removeEventListener('MSFullscreenChange', this.goExitFullscreen, false);
			}
			if (type == 'scan') {
				window.location.href = '/workbench/scan'
			} else {
				browserHistory.goBack();
			}
		}
	}
	// 数据预览
	async getDataOverview() {
		let res = await ScreenService.getDataOverview()
		this.setState({
			TotalDataSum: res.data
		})
	}
	// 业务流水
	async getDataBusiFlow() {
		let res = await ScreenService.getDataBusiFlow()
		this.setState({
			TimeBusinessData: res.data
		})
	}
	// 排行
	async getDataRank() {
		let res = await ScreenService.getDataRankM()
		this.setState({
			RankData: res.data
		})
	}
	// 贷款金额趋势
	async getDataLoanTrend() {
		let { trendLoanData, trendLoansData, trendAddUserData } = this.state;
		let res = await ScreenService.getDataLoanTrend();
		let data = res.data;
		this.setState({
			trendLoanData: {
				legend: {
					data: ['放款金额', '存量金额'], // 顶部展示数据
					left: '80%',
					top: '30%',
					width: '6%',
					textStyle: {
						color: '#fff',
						fontSize: 10,
					}
				},
				xAxisData: data.timeAxis,
				yAxisName: '单位:万元',
				grid: {
					width: '68%',
					left: '13%',
				},
				series: [{
					name: '放款金额',
					smooth: true,//折线变成平滑曲线
					type: 'line',
					data: data.makeLoanMoney,
					lineStyle: {
						normal: {
							color: '#fff',
							width: 1,
							shadowColor: 'rgba(255, 255, 255, 0.5)',
							shadowBlur: 20,
							opacity: 0.5,
						},
					},
					itemStyle: {
						normal: {
							color: '#cbbdff',//折线的颜色
							borderColor: '#cbbdff'//拐点圈的颜色
						}
					},
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [{
								offset: 0,
								color: '#b4b4f8'
							}, {
								offset: 1,
								color: '#02020e'
							}])
						}
					},
				},
				{
					name: '存量金额',
					smooth: true,//折线变成平滑曲线
					type: 'line',
					data: data.stockMoney,
					sampling: 'average',
					lineStyle: {
						normal: {
							color: '#fff',
							width: 1,
							shadowColor: 'rgba(255, 255, 255, 0.5)',
							shadowBlur: 20,
							opacity: 0.5,
						},
					},
					itemStyle: {
						normal: {
							color: '#5afbc8',//折线的颜色
							borderColor: '#5afbc8'//拐点圈的颜色
						}
					},
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [{
								offset: 0,
								color: '#5afbc8'
							}, {
								offset: 1,
								color: '#02020e'
							}])
						}
					},

				}]
			},
			trendLoansData: {
				legend: {
					data: ['放款笔数'], // 顶部展示数据
					left: '80%',
					top: '30%',
					width: '6%',
					textStyle: {
						color: '#fff',
						fontSize: 10,
					}
				},
				xAxisData: data.timeAxis,
				yAxisName: '单位:笔',
				grid: {
                    width: '68%',
					left: '13%',
				},
				series: [{
					name: '放款笔数',
					smooth: true,//折线变成平滑曲线
					type: 'line',
					data: data.makeLoanNum,
					lineStyle: {
						normal: {
							color: '#fff',
							width: 1,
							shadowColor: 'rgba(255, 255, 255, 0.5)',
							shadowBlur: 20,
							opacity: 0.5,
						},
					},
					itemStyle: {
						normal: {
							color: '#cbbdff',//折线的颜色
							borderColor: '#cbbdff'//拐点圈的颜色
						}
					},
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [{
								offset: 0,
								color: '#b4b4f8'
							}, {
								offset: 1,
								color: '#02020e'
							}])
						}
					},
				}]
			},
			trendAddUserData: {
				legend: {
					data: ['新增客户数', '存量客户数'], // 顶部展示数据
					left: '80%',
					top: '30%',
					width: '10%',
					textStyle: {
						color: '#fff',
						fontSize: 10,
					}
				},
				xAxisData: data.timeAxis,
				yAxisName: '单位:人',
				grid: {
					width: '68%',
					left: '13%',
				},
				series: [{
					name: '新增客户数',
					smooth: true,//折线变成平滑曲线
					type: 'line',
					data: data.newCustNum,
					lineStyle: {
						normal: {
							color: '#fff',
							width: 1,
							shadowColor: 'rgba(255, 255, 255, 0.5)',
							shadowBlur: 20,
							opacity: 0.5,
						},
					},
					itemStyle: {
						normal: {
							color: '#cbbdff',//折线的颜色
							borderColor: '#cbbdff'//拐点圈的颜色
						}
					},
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [{
								offset: 0,
								color: '#b4b4f8'
							}, {
								offset: 1,
								color: '#02020e'
							}])
						}
					},
				},
				{
					name: '存量客户数',
					smooth: true,//折线变成平滑曲线
					type: 'line',
					data: data.stockCustNum,
					sampling: 'average',
					lineStyle: {
						normal: {
							color: '#fff',
							width: 1,
							shadowColor: 'rgba(255, 255, 255, 0.5)',
							shadowBlur: 20,
							opacity: 0.5,
						},
					},
					itemStyle: {
						normal: {
							color: '#5afbc8',//折线的颜色
							borderColor: '#5afbc8'//拐点圈的颜色
						}
					},
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [{
								offset: 0,
								color: '#5afbc8'
							}, {
								offset: 1,
								color: '#02020e'
							}])
						}
					},

				}]
			},

		})
		if (trendLoanData) this.refs.trendLoan.update();
		if (trendLoansData) this.refs.trendLoans.update();
		if (trendAddUserData) this.refs.trendAddUser.update();
	}
	showWord = () => {//投屏按钮
		this.setState({
			screenWord: true
		});
	}
	hideWord = () => {
		this.setState({
			screenWord: false
		});
	}
	launchFullScreen = () => {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		}
		else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		}
		else if (document.documentElement.msRequestFullscreen) {
			document.documentElement.msRequestFullscreen();
		}
		else if (document.documentElement) {
			document.documentElement.webkitRequestFullScreen();
		}
		this.setState({
			screenShow: false
		})
	}
	render() {
		const { loading, TotalDataSum, RankData, TimeBusinessData, trendLoanData, topClassName, businessClassName, centerClassName, trendLoanId, trendLoansId, trendLoansData, trendAddUserData, trendAddUserId, screenShow, screenWord } = this.state;
		return (
			<Spin tip={Config.warnInfo.spinText} spinning={loading}>
				<div className="screen-container" >
					{screenShow ? <div className='screen-show' onMouseOver={this.showWord} onMouseLeave={this.hideWord} onClick={this.launchFullScreen}>{screenWord ? <p className='screenWord'>数据投屏</p> : <img className='screenButton' src={screenButton} alt="screenButton" />}</div> : null}
					<div className='exit-fullscreen' onClick={() => this.goExitFullscreen('auto')}><p className='exit-fullscreen-word'>退出投屏</p></div>
					<div className='screen-content'>
						<div className="screen-lefts">
							<div className='data-info-container'>
								{TotalDataSum && <DataInformation className={topClassName} TotalDataTop={TotalDataSum} />}
							</div>
							<div className="business-container">
								<div className="business-container-left">
									{TimeBusinessData && <Situation className={businessClassName} data={TimeBusinessData} />}
								</div>
								<div className="business-container-right">
									{TotalDataSum && <DataInformation className={centerClassName} TotalDataCenter={TotalDataSum} />}
								</div>
							</div>
						</div>
						<div className="screen-rights">
							<Achievement data={RankData} />
						</div>
						<div className="screen-bottom">
							<div className='trend-loan'>
								{
									trendLoanData && <Line ref="trendLoan" id={trendLoanId} data={trendLoanData} />
								}
							</div>
							<div className='trend-loans'>
								{
									trendLoansData && <Line ref="trendLoans" id={trendLoansId} data={trendLoansData} />
								}
							</div>
							<div className='trend-add-user'>
								{
									trendAddUserData && <Line ref="trendAddUser" id={trendAddUserId} data={trendAddUserData} />
								}
							</div>
						</div>
					</div>
				</div>
			</Spin>
		);
	}
}
export default Screen;
