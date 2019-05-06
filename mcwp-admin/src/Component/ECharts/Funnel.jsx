import React, { Component, PropTypes } from 'react'; // 引入了React和PropTypes
import echarts from 'echarts';

/* 以类的方式创建一个组件 */
class Funnel extends Component {
    constructor(props) {
    	super(props);
		this.state = {
            funnelChart: null
		}
    }
    componentDidMount() {
        const that = this;
        const { id, data } = this.props;
        let funnelChart = echarts.init(document.getElementById(id));
        that.setState({
            funnelChart: funnelChart
        });
        let optionFunnel = {
            title: {
                text: data.title,               // 标题
                textStyle:{
                    fontSize:14,
                },
            },
            tooltip: {                           //提示框组件
                trigger: 'item',                 //触发类型为数据类型触发
                formatter: "{a} <br/>{b} : {c}"  //数据类型格式化
            },
            legend: {
                data: data.legendData
            },
            series: [{
                name: '',
                type: 'funnel',
                left: '0%',
                width: '90%',
                maxSize: '90%',
                label: {
                    normal: {                      
                        position: 'outside',
                        formatter: '{b}:{c}',      //Echarts自带的格式化
                        textStyle: {
                            color: '#000'
                        }
                    },
                    emphasis: {                     
                        position:'outside',
                        formatter: '{b}: {c}',
                        textStyle: {
                            color: '#000'
                        }
                    }
                },
                itemStyle: {                        //图形样式normal为图形在默认情况下样式，emphasis图形在高亮情况下样式
                    normal: {
                        opacity: 0.5,
                        borderColor: '#fff',
                        borderWidth: 2
                    }
                },
                data: data.series[0].data           // 数据
            }]
        };
        funnelChart.setOption(optionFunnel); 
    }
    update () {
        const that = this;
        const { id, data } = that.props;
        const { funnelChart } = that.state;
        funnelChart.setOption({
            series: [{
                data: data.series[0].data 
            }]
        });
    }
	render() {
        const that = this;
        const{ id, echartStyle }=that.props;
		return (	
            <div id={id} style={echartStyle}></div>
		)
	}
}

export default Funnel;

