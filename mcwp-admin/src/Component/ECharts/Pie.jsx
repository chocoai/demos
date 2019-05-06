import React, { Component } from 'react'; // 引入了React
import echarts from 'echarts';

/* 以类的方式创建一个组件 */
class Pie extends Component {
    constructor(props) {
    	super(props);
		this.state = {
            pieChart: null,
            nData:[]
		}
    }
    componentDidMount() {
        const { id , data, getTaskByType } = this.props;
        let pieChart = echarts.init(document.getElementById(id))
        // let pieData=data.series[0].data;
        // var nData=[]
        // for(var i=0,length=pieData.length;i<length;i++){//只显示值不为0的数据
        //     if(pieData[i].value != 0 ){
        //         nData.push(pieData[i]);
        //     }
        // }
        // data.series[0].data = nData;
         this.setState({
            pieChart: pieChart,
        })
        let optionAge = {
            title : {
                text: data.title,
                textStyle:{
                    // fontWeight:200,
                    fontSize:14,
                },
                x:'center'
            },
            tooltip : {                                //提示框组件
                trigger: 'item',                       //触发类型：item图形触发，axis坐标轴触发
                formatter: "{a} <br/>{b} : {c} ({d}%)" //数据的格式化
            },
            // legend:data.legendData,
            series:data.series
        };
        pieChart.setOption(optionAge);
        if (getTaskByType) {
            pieChart.on('click', function (params) {
                if (params.data.selected) {
                    getTaskByType(params.data.taskType);
                } else {
                    getTaskByType();
                }
            });
        }
    }
    update () {
        const { data } = this.props;
        const { pieChart } = this.state;
        pieChart.setOption({
            series:data.series,
        });
    }
	render() {
        const that = this;
        const { id, echartStyle } = that.props;
		return (
            <div id={id} style={echartStyle}></div>
		)
	}
}
export default Pie;

