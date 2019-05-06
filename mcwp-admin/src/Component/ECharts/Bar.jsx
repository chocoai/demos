import React, { Component } from 'react'; // 引入了React
import echarts from 'echarts';
class Bar extends Component {
    constructor(props) {
    	super(props);
		this.state = {
            barChart:null
		}
    }
    componentDidMount() {
        const { id , data } = this.props;
        let barChart = echarts.init(document.getElementById(id))
        this.setState({
            barChart: barChart
        })
        let option = {    
            title: {      
                text: data.title,          
                x: 'left',        
                y: 'top' ,   
                textStyle:{
                    fontSize:14,
                },
            }, 
            tooltip: {      
                trigger: 'axis'         //item是只显示一个数组的,axis是指根据x轴显示
            },    
            legend: {                   //顶部展示按钮，点击可隐藏对应数据图形
                show: true,     
                x: 'center',       
                y: 'buttom',       
                data: data.legendData   //顶部展示数据
            },  
            calculable: true,    
            barWidth:'45%',
            barGap:0,
            xAxis: [                    //X轴的数据
                {      
                    show: true,       
                    type: 'category',
                    axisLabel:{         //防止坐标轴省略
                        interval: 0 ,
                        rotate:-40,
                        formatter: function(value) {
                            return  value? `${value.substr(0,6)}...` : value
                        } 
                    },                
                    data: data.xAxisData
                }    
            ],     
            yAxis: [    
                {    
                    show: true,       
                    type: 'value',      
                    // splitArea: {show: true}  //Y轴颜色相间设置  
                }    
            ],
            grid:data.grid,
            dataZoom: [{                    //图形缩放拖动条设置
            type: 'slider',
            top:270,
            left:50, 
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '90%',              //控制手柄尺寸，相对dataZoom宽度
            throttle:50,                    //拖动时视图的刷新频率
            // start: 40,                      //拖动条起始位置（对应百分比）
            // end: 60,                        //拖动条结束位置（对应百分比）
            startValue:3,
            endValue:11,
            minValueSpan:8,
            maxValueSpan:8,
            // minSpan:20,
            // maxSpan:20,
            handleStyle: {                  //手柄样式设置
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
                 }
            }],       
            series: data.series//信贷分析和任务统计的数据
        };    
        barChart.setOption(option);
    }
    update () {
        const { data } = this.props;
        const { barChart } = this.state;
        barChart.setOption({
            xAxis: [{      
                show: true,       
                type: 'category',       
                data: data.xAxisData
            }],
            series: data.series
        });
    }
    render() {
        const that = this;
        const { id, echartStyle} = that.props;
      
		return (	
            <div id={id} style={echartStyle}></div>
	    )
	}
}
export default Bar;
