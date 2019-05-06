import React, { Component } from 'react'; // 引入了React
import echarts from 'echarts';

/* 以类的方式创建一个组件 */
class EchartPA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            histogramChart: null
        }
    }
    componentDidMount() {
        const { id, data } =this.props;
        let histogramChart = echarts.init(document.getElementById(id))
        this.setState({
            histogramChart: histogramChart
        })
        var option = {    
            title: {      
                text: data.title,               //标题
                // subtext: '助贷宝信贷分析',    //副标题（说明性文字）
                x: '10px',        
                y: '10px' ,   
                textStyle:{
                    fontSize:14,
                }, 
            }, 
            tooltip: {      
                trigger: 'axis'                 //触发方式：item是图形触发,axis是指根据x轴显示
            },    
            legend: {    
                show: true,     
                x: 'center',       
                y: 'buttom',       
                data: data.legendData            //顶部展示的数据
            },  
            calculable: true,
            barWidth:data.barWidth, 
            barGap:data.barGap, 
            xAxis: [                              //坐标刻度
                {      
                    show: true,       
                    type: 'category',
                    axisLabel:{                    //防止坐标轴省略
                        interval: 0, 
                        rotate:-40,
                        formatter: function(value) {
                            return value? `${value.substr(0,6)}...` : value
                        } 
                    }, 
                    nameTextStyle:{
                        width:'100%',
                        fontSize:10,
                    }, 
                    minInterval:1,     
                    data: data.xAxisData
                }    
            ],     
            yAxis: [                              //坐标刻度
                {    
                    show: true,       
                    type: 'value',      
                    // splitArea: {show: true}    //Y轴颜色相间设置
                }    
            ],
            grid:data.grid,                      //对图表本身的设置
            dataZoom: [{                         //图形缩放             
            type: 'slider',
            throttle:50,                         //拖动时视图的刷新频率
            top:410,
            left:50,                       
            // start: 30,                           //拖动起始起点位置
            // end: 70,                             //拖动起始终点位置
            // minSpan:40,
            // maxSpan:40,
            startValue:3,
            endValue:11,
            minValueSpan:8,
            maxValueSpan:8,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '90%',           //控制手柄尺寸，相对dataZoom宽度
            handleStyle: {                    //手柄样式设置
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
            }],
         
            series: data.series  , //信贷分析和任务统计的数据                     
        };    
        histogramChart.setOption(option);
	}
    update () {
        const { data } =this.props;
        const {histogramChart} = this.state;
        histogramChart.setOption({
            xAxis: [{      
                show: true,       
                type: 'category',       
                data: data.xAxisData
            }]
            ,
            series: data.series
        });
    }
	render() {
        const { id } =this.props;
		return (	
            <div id={id} style={{width: '1024px', height:'480px'}}></div>
		)
	}
}

export default EchartPA;

