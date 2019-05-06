import React, { Component } from 'react';
import echarts from 'echarts';
class Line extends Component {
    constructor(props) {
    	super(props);
        this.state = {
            lineChart: null
        }
    }
    componentDidMount() {
        const that = this;
        const { id , data } = this.props;

        let lineChart = echarts.init(document.getElementById(id));
        that.setState({
            lineChart: lineChart
        })
        let optionLine = {
            // title: {
            //     text: data.title,
            //     x: '10px',
            //     y: '10px' ,
            //     textStyle:{
            //         color:'#ccc',
            //         fontSize:14,
            //     },
            // },
            tooltip: {
                trigger: "axis"         //触发方式
            },
            legend:data.legend,
            calculable: true,
            xAxis: [                    // 坐标刻度
                {
                    type: "category",
                    boundaryGap: false,
                    splitLine:{//背景网格
                        show:true,
                        lineStyle:{
                            opacity:0.2,
                        },
                      },
                    axisLabel:{
                        interval: 0 ,
                        color:'#4affff',
                        // rotate:50,
                        fontSize:10
                    },
                    data: data.xAxisData
                }
            ],
            yAxis: [                    // 坐标刻度
                {
                    name:data.yAxisName,
                    nameTextStyle:{
                        color:'#4affff',
                        fontSize:10
                    },
                    type: "value",
                    splitLine:{//背景网格
                        show:true,
                        lineStyle:{
                            opacity:0.2,
                        },
                      },
                      axisLabel:{
                        interval: 0 ,
                        color:'#4affff',
                        fontSize:10
                        // rotate:-40 , //坐标值角度
                    },
                }
            ],
            grid:data.grid,             //对图表本身的设置
            series: data.series         // 图标中数据
        };
            lineChart.setOption(optionLine);
    }
    update () {                         //对比刷新，此处非Echarts原有内容
        const { data } = this.props;
        const { lineChart } = this.state;
        lineChart.setOption({
            xAxis: [{
                show: true,
                type: 'category',
                data: data.xAxisData
            }],
            series: data.series
        });
    }
	render() {
        const { id } = this.props;
		return (
            <div id={id} style={{width: id=='trend-loanId'||id=='trend-loansId' || id == 'trend-addUserId'?'5rem':'7.3rem', height:'2.68rem',display:'inline-block',marginLeft:id=='trend-addUserId'?'0':'.15rem'}}></div>
		);
	}
}
export default Line;
