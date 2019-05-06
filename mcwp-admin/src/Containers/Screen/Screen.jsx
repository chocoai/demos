import React, { Component } from 'react'; // 引入了React
import echarts from 'echarts';
import { is, fromJS } from 'immutable';
import { browserHistory } from 'react-router';
import { Config } from '../../Config/Index';
import { Spin , message } from 'antd';
import './style/screen.less';
import ScreenService from '../../Services/ScreenService';//调用数据
import  Line  from '../../Component/Screen/Line';
import  Situation  from '../../Component/Screen/Situation';
import  DataInformation  from '../../Component/Screen/DataInformation';
import  Manager  from '../../Component/Screen/Manager';

/**
 * 投屏显示
 * @Author: 赵俊
 * @Date:   2017-09-28
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-09-28
 */
class Screen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			LoanInfoData:null,
			BusiTrendData:null,
			TotalDataSum:null,
			TotalDataLoan:null,
			RankData:null,
			TimeBusinessData:null,
			TimeTaskData:null,
			topClassName:'dataInformation-container',
			bottomClassName:'dataInformation-container situation-container-bottom',
			opClassName:'situation-contain ',
			taskClassName:'situation-contain',
			proBusiness:'product-line',		// 折线
			proAccountId:'product-Account',
			rows:50,//业务情况参数
			cnt:50,//任务情况参数
			timer:null,
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
	}
	componentWillMount() {
		this.getDataDevTrend();
		this.getDataBusiTrend();
		this.getDataLoanInfo();
		this.getDataTotalSum();
		this.getDataRank();
		this.createBodyStyle();
		this.getDataTimeBusiness({rows:this.state.rows});
		this.getDataTimeTask({cnt:this.state.cnt});
	}
	
	componentDidMount() {
		this.changeScreen(); // 监听屏幕改变
		this.timer = setInterval((function() {//每2分钟更新一次滚屏数据
			this.getDataTimeBusiness({rows:this.state.rows});
			this.getDataTimeTask({cnt:this.state.cnt});
			this.setState({
				rows:50,
				cnt:50,
			})
			console.log('业务情况和任务情况数据已更新')
		  }).bind(this), 120000)
		this.otherTimer=setInterval((function() {//每2小时更新一次展示数据
			this.getDataDevTrend();
			this.getDataBusiTrend();
			this.getDataLoanInfo();
			this.getDataTotalSum();
			this.getDataRank();
			console.log('原定间隔2小时数据已更新')
		}).bind(this), 7200000)
	}
	createBodyStyle(){
		document.body.setAttribute("class","bodyStyle");
	}
	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
		this.otherTimer && clearInterval(this.otherTimer);
    }
    changeScreen() { // 屏幕改变事件
        if(navigator.userAgent.indexOf('MSIE') !== -1) {
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
	goExitFullscreen(act) { // 退出全屏
		const fullscreenEle = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullScreenElement;
        if (act == 'auto') {
            if(document.exitFullscreen) { 
                document.exitFullscreen(); 
            }else if(document.mozExitFullscreen) { 
                document.mozExitFullScreen(); 
            }else if(document.webkitCancelFullScreen){ 
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
            browserHistory.push('/data/analysis/marketing'); 
        }
	} 
	getDataDevTrend (params) { // 图表客户发展趋势
        const { LoanInfoData } = this.state;
        ScreenService.getDataDevTrend(params, (res) => {
            if (res.code == Config.errorCode.success) {
				const data = res.data;
                this.setState({
                    LoanInfoData: {
                        // title: '发展趋势',
                        legend: {
							data: ['客户增长量'], // 顶部展示数据
							left:'84%',
							top:'30%',
							width:'10%',
							textStyle:{
								color:'#fff',
							}
						},
						xAxisData: data.monthAxis,
						yAxisName:'单位(人)',
						grid:{
							width:'75%', 
							left:'8%',
						},
                        series: [{
							name: '客户增长量', 
							smooth: true,//折线变成平滑曲线   
                            type: 'line',     
							data: data.custIncr,
							lineStyle:{
								normal:{
									color:'#fff',
									width:1,
									shadowColor: 'rgba(255, 255, 255, 0.5)',
									shadowBlur: 20,
									opacity:0.5,
								},
							},
							itemStyle:{
								normal:{
									color:'#cbbdff',//折线的颜色
									borderColor:'#cbbdff'//拐点圈的颜色
								}
							},
							areaStyle:{
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [{
										offset: 0,
										color: '#b4b4f8'
									}, {
										offset: 0.8,
										color: '#02020e'
									}])
								}
							},
                        }]
                    }
                })
                if( LoanInfoData ) this.refs.proBusiTrend.update();
            } else {
                message.error(res.msg);
            }
        });
	}
	getDataBusiTrend (params) { // 图表客户发展趋势
        const { BusiTrendData } = this.state;
        ScreenService.getDataBusiTrend(params, (res) => {
            if (res.code == Config.errorCode.success) {
				const data = res.data;
                this.setState({
					BusiTrendData: {
                        // title: '发展趋势',
						legend: {
							data: ['授信金额','放款金额'], // 顶部展示数据
							left:'86.5%',
							top:'30%',
							width:'10%',
							textStyle:{
								color:'#fff',
							}
						},
						xAxisData: data.timeAxis,
						yAxisName:'单位(万元)',
						grid:{
							width:'75%',  
							left:'12%',
						},
                        series: [{
							name: '授信金额', 
							smooth: true,//折线变成平滑曲线   
                            type: 'line',     
							data: data.creditMoneys,
							lineStyle:{
								normal:{
									color:'#fff',
									width:1,
									shadowColor: 'rgba(255, 255, 255, 0.5)',
									shadowBlur: 20,
									opacity:0.5,
								},
							},
							itemStyle:{
								normal:{
									color:'#cbbdff',//折线的颜色
									borderColor:'#cbbdff'//拐点圈的颜色
								}
							},
							areaStyle:{
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
							name: '放款金额', 
							smooth: true,//折线变成平滑曲线   
                            type: 'line',     
							data: data.loanMoneys,
							sampling: 'average',
							lineStyle:{
								normal:{
									color:'#fff',
									width:1,
									shadowColor: 'rgba(255, 255, 255, 0.5)',
									shadowBlur: 20,
									opacity:0.5,
								},
							},
							itemStyle:{
								normal:{
									color:'#5afbc8',//折线的颜色
									borderColor:'#5afbc8'//拐点圈的颜色
								}
							},
							areaStyle:{
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
                    }
                })
                if( BusiTrendData ) this.refs.proBusiTrend.update();
            } else {
                message.error(res.msg);
            }
        });
	}
	getDataLoanInfo(params) {//数据进件量、授信率、管户数
        ScreenService.getDataLoanInfo(params, (res) => {
            if (res.code == Config.errorCode.success) {
				const data = res.data;
                this.setState({
                    TotalDataLoan: data
                })   
            } else {
                message.error(res.msg);
            }
        });
    }
	getDataTotalSum (params) {//数据授信、客户、放款概要
        ScreenService.getDataSummary(params, (res) => {
            if (res.code == Config.errorCode.success) {
				const data = res.data;
                this.setState({
                    TotalDataSum: data
                })   
            } else {
                message.error(res.msg);
            }
        });
	}
	getDataTimeBusiness(rows) {//实时业务情况
        ScreenService.getDataTimeBusiness(rows, (res) => {
            if (res.code == Config.errorCode.success) {
				const data = res.data;
                this.setState({
                    TimeBusinessData: data
                })   
            } else {
                message.error(res.msg);
            }
        });
	}
	getDataTimeTask(cnt) {//实时任务情况
        ScreenService.getDataTimeTask(cnt, (res) => {
            if (res.code == Config.errorCode.success) {
				const data = res.data;
                this.setState({
                    TimeTaskData: data
                })   
            } else {
                message.error(res.msg);
            }
        });
    }
	getDataRank(params) {//客户经理排行
        ScreenService.getDataRank(params, (res) => {
            if (res.code == Config.errorCode.success) {
				const data = res.data;
                this.setState({
                    RankData: data
                })   
            } else {
                message.error(res.msg);
            }
        });
    }
	render() {
		const {loading ,LoanInfoData , BusiTrendData , TotalDataSum ,TotalDataLoan , RankData ,TimeBusinessData , TimeTaskData , proBusiness ,proAccountId , topClassName , bottomClassName , opClassName , taskClassName} = this.state;
		return(
		<Spin tip={Config.warnInfo.spinText} spinning={loading}>
			<div className="screen-container" >
				<div className='exit-fullscreen'  onClick={()=>this.goExitFullscreen('auto')}><p className='exit-fullscreen-word'>退出投屏</p></div>
				<div className='screen-content'>
                	<div className="screen-left">
						<div className='situation-container'>
							{ TimeBusinessData   ? 
								<Situation  className={opClassName} data={TimeBusinessData}/>:null
							}
						</div>
						<div className='situation-container situation-container-task'>
							{ TimeTaskData  ? 
								<Situation  className={taskClassName} data={TimeTaskData} delay = {1000}/>:null
							}
						</div>
					</div>
					<div className="screen-center">
								<DataInformation  className={topClassName} TotalDataSum={TotalDataSum}/>
								<DataInformation  className={bottomClassName} TotalDataLoan={TotalDataLoan}/>	
					</div>
					<div className="screen-right">
						<Manager data={RankData}/>
					</div>
					<div className='proBusiness'>
				    	{ 
                        	BusiTrendData ? <Line  ref="proBusiTrend" id={proBusiness} data={BusiTrendData} /> : null
                    	}
					</div>
					<div className='proAccount'>
						{ 
                        	LoanInfoData ? <Line  ref="proLoanInfo" id={proAccountId} data={LoanInfoData} /> : null
                    	}
					</div>
				</div>
		    </div>
		</Spin>
		);
	}
}
export default Screen;