import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import { Spin } from 'antd';
import { Link } from 'react-router';
import DateSearch from '../../Component/Common/DateSearch';
import Header from '../../Component/DA/DataHeader';//数据概况
import DAService from '../../Services/DataAnService';//调用数据
import Histogram from '../../Component/ECharts/Histogram';//柱状图
import Line from '../../Component/ECharts/Line';//折线图
import SimFunnel from '../../Component/DA/SimFunnel'; // 模拟漏斗图
import Pie from '../../Component/ECharts/Pie';//饼图
import Bar from '../../Component/ECharts/Bar'; // 条形图
import './style/daIndex.less';
import nodataBg from '../../Assets/Images/nodata-bg.png';
import screenButton from '../../Assets/Images/icon_screen-projection.png';

import { message, Tabs } from 'antd';
const TabPane = Tabs.TabPane;
/**
 * 数据分析服务
 * @Author: 赵俊
 * @Date:   2017-09-08
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-09-27
 */
class DAIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataMarketing: null, // 营销数据
            proConvert: null, // 漏斗进件转化率
            ipieceViews: null, // 浏览量、进件量
            ipieceTrans: null, // 进件率
            dataProduct: [],//产品分析数据
            userSex: [],//用户性别
            userUsage: [],//借款用途
            userAge: [],//用户年龄统计
            dataTaskPie: [],//暂定任务饼图数据接口
            dataTask: [],//任务柱状图数据接口
            TotalData: [],//数据概况
            DataStaffs: [],//员工列表
            defaultTab: 'marketing',
            dateKey: 0,
            showCode: false,//投屏按钮
            loading: false,
            MarketData: null,
            convertData: null,
            productData: null,
            sexData: null,
            useData: null,
            ageData: null,
            taskPieData: null,
            taskData: null,
            proHistogramId: 'product-histogram',//柱状
            proLineId: 'product-line',// 折线
            proSexId: 'product-sex',
            proUseId: 'product-use',
            proAgeId: 'product-age',
            proTaskPieId: 'product-taskPie',
            proTaskId: 'product-task',
            showDatePicker: false,
            showMultiple: false,
            searchParams: null,
            right: true,
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentDidMount() {
        const that = this;
        // 用户权限
        const curRole = Config.localItem('CUR_ROLE');
        // that.setState({
        //     defaultTab:  routeParams.tab  ?  routeParams.tab  : 'marketing'
        // });
        if (!Config.isRoleCr(curRole)) {
            that.getDataTrend(); // 营销数据
            that.getDataConvert(); // 营销转化率
            that.getMarketProduct(); // 数据概况 => 浏览量、进件量、进件率
            that.setState({
                showDatePicker: false,
                showMultiple: false
            })
        }
        if (Config.isRoleCr(curRole)) {
            this.getDataProduct()
            this.setState({
                showDatePicker: true,
                showMultiple: false,
                defaultTab: 'product'
            })
        }
        if (curRole == 'ROLE_CR_MANAGER' || curRole == 'ROLE_CUSTOMER_MANAGER') {
            this.setState({
                right: false
            })
        } else {
            this.setState({
                right: true
            })
        }
        if (!Config.isRoleCr(curRole)) {
            // 获取员工列表
            DAService.getDataStaffs({}, (res) => {
                if (res.code == Config.errorCode.success) {
                    const data = res.data;
                    this.setState({
                        DataStaffs: data
                    })

                } else {
                    message.error(res.msg);
                }
            });
        }
        this.getDataTotal();     // 数据概况
    }
    goSearchData = (params) => { // 公共搜索数据方法
        const that = this;
        // const { routeParams } = that.props;
        const { searchParams, defaultTab } = that.state;
        if (searchParams && searchParams.taskType) params.taskType = searchParams.taskType;
        if (defaultTab == 'marketing') {
            that.getDataTrend(params); // 营销数据
            that.getDataConvert(params); // 营销转化率
            that.getMarketProduct(params); // 数据概况 => 浏览量、进件量、进件率
        } else if (defaultTab == 'product') {
            that.getDataProduct(params);
        } else if (defaultTab == 'user') {
            that.getDataSex(params);
            that.getDataUse(params);
            that.getDataAge(params);
        } else if (defaultTab == 'task') {
            params = Config.serializeObjects(params);
            that.getDataTaskPie(params);
            that.getDataTask(params);
        }
        that.setState({
            searchParams: params
        });
    }
    getTaskByType = (taskType) => { // 按照任务类型进行搜索数据
        const that = this;
        let { searchParams } = that.state;
        searchParams = searchParams || {};
        if (taskType) {
            searchParams.taskType = taskType;
        } else {
            if (searchParams && searchParams.taskType) delete searchParams.taskType;
        }
        that.getDataTask(searchParams || '');
        that.setState({
            searchParams: searchParams
        });
    }
    changeTabs = (key) => { // 切换选项卡
        // Config.localItem('DEFAULT_TAB', key)
        // browserHistory.push('/data/analysis/' + key);
        const curRole = Config.localItem('CUR_ROLE');
        if (key == 'marketing' && !Config.isRoleCr(curRole)) {
            this.getDataTrend(); // 营销数据
            this.getDataConvert(); // 营销转化率
            this.getMarketProduct(); // 数据概况 => 浏览量、进件量、进件率
            this.setState({
                showDatePicker: false,
                showMultiple: false
            })
        } else if (key == 'product') {
            this.getDataProduct()
            this.setState({
                showDatePicker: true,
                showMultiple: false
            })
        } else if (key == 'user') {
            this.getDataSex()
            this.getDataUse()
            this.getDataAge()
            this.setState({
                showDatePicker: true,
                showMultiple: false
            })
        } else if (key == 'task' && !Config.isRoleCr(curRole)) {
            this.getDataTaskPie();
            this.getDataTask();
            this.setState({
                showDatePicker: true,
                showMultiple: true
            })
        }
        this.setState({
            defaultTab: key
        })
    }
    getDataTotal(params) {//数据概况
        DAService.getDataProfile(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                this.setState({
                    TotalData: data
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    getDataTrend(params) { // 营销数据
        const { MarketData } = this.state;
        DAService.getDataTrend(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                let dataTimeAxis = [];
                let year = null;
                let month = null;
                let date = null;
                for (let i of data.timeAxis) {//将原横坐标数据'2017'过滤掉
                    year = i.substr(0, 4);
                    month = i.substr(5, 2);
                    date = i.substr(8, 2)
                    if (i.length > 8) {
                        dataTimeAxis.push(month + '月' + date + '日');
                    } else {
                        dataTimeAxis.push(year + '年' + month + '月');
                    }
                }
                this.setState({
                    MarketData: {
                        title: '营销趋势',
                        legendData: ['浏览量', '进件量', '借款数'],
                        xAxisData: dataTimeAxis,
                        hasData: data,
                        grid: {
                            width: '90%',
                            height: 350,
                            left: 50,
                        },
                        series: [{
                            name: '浏览量',
                            smooth: true,//折线变成平滑曲线
                            type: 'line',
                            data: data.views
                        }, {
                            name: '进件量',
                            smooth: true,
                            type: 'line',
                            data: data.pieces
                        }, {
                            name: '借款数',
                            smooth: true,
                            type: 'line',
                            data: data.loans
                        }]
                    }
                })
                if (MarketData) this.refs.proMarket.update();
            } else {
                message.error(res.msg);
            }
        });
    }
    getDataConvert(params) { // 营销转化率
        DAService.getDataConvert(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                this.setState({
                    proConvert: data
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    getMarketProduct(params) { // 数据概况 => 浏览量、进件量、进件率
        const that = this;
        let { ipieceViews, ipieceTrans } = that.state;
        DAService.getMarketProd(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                let Axis = [];
                for (let m of data.prodAxis) {//超过6个字省略号
                    Axis.push(m)
                }
                that.setState({
                    ipieceViews: {
                        title: '浏览量、进件量',
                        legendData: ['浏览量', '进件量'],
                        xAxisData: Axis,
                        grid: {
                            width: '90%',
                            height: 160,
                            left: 50
                        },
                        series: [{
                            name: '浏览量',
                            type: 'bar',
                            barWidth: 30,
                            data: data.views
                        }, {
                            name: '进件量',
                            type: 'bar',
                            barWidth: 30,
                            data: data.pieces
                        }]
                    },
                    ipieceTrans: {
                        title: '进件率',
                        legendData: ['进件率'],
                        xAxisData: Axis,
                        grid: {
                            width: '90%',
                            height: 160,
                            left: 50
                        },
                        series: [{
                            name: '进件率',
                            type: 'bar',
                            barWidth: 30,
                            data: data.pieceRate
                        }]
                    }
                });
                if (ipieceViews) that.refs.iViews.update();
                if (ipieceTrans) that.refs.iTrans.update();
            } else {
                message.error(res.msg);
            }
        })
    }
    getDataProduct(params) { // 产品分析
        const { productData } = this.state;
        DAService.getDataProduct(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                let Axis = [];
                for (let m of data.prodAxis) {//超过6个字省略号
                    Axis.push(m)
                }
                this.setState({
                    productData: {
                        title: '信贷分析(万元)',
                        legendData: ['授信金额'],
                        hasData: data,
                        xAxisData: Axis,
                        grid: { //设置图表本身的样式
                            width: '90%',
                            height: 300,
                            left: 80,
                        },
                        series: [{
                            name: '授信金额',
                            type: 'bar',
                            barWidth: 30,
                            data: data.loanTotal
                        }]
                    }
                })
                if (productData) this.refs.proHistogram.update();
            } else {
                message.error(res.msg);
            }
        });
    }
    getDataSex(params) { // 性别
        DAService.getDataSex(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                let userNum = Number(data[0].value) + Number(data[1].value);//计算总人数
                this.setState({
                    sexData: {
                        title: '性别分析',
                        legendData: ['男', '女'],
                        hasData: data,
                        userNum: userNum,
                        series: [{
                            name: '性别',
                            type: 'pie',
                            data: data,
                            radius: ['20%', '45%'],
                            center: ['50%', '50%'],
                            labelLine: {
                                normal: {
                                    show: true,
                                    length: 10,
                                    length2: 10,
                                }
                            },
                            itemStyle: {
                                emphasis: {//选中之后饼图的样式
                                    shadowBlur: 5,
                                    shadowOffsetX: 2,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    }
                })
                if (this.refs.proSex && userNum != 0) this.refs.proSex.update();
            } else {
                message.error(res.msg);
            }
        });
    }
    getDataUse(params) { // 用途分析
        DAService.getDataUse(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                this.setState({
                    useData: {
                        title: '用途分析',
                        legendData: [''],
                        hasData: data,
                        series: [{
                            name: '用途分析',
                            type: 'pie',
                            data: data,
                            labelLine: {
                                normal: {
                                    show: true,
                                    length: 10,
                                    length2: 10,
                                }
                            },
                            radius: ['20%', '45%'],
                            center: ['50%', '50%'],
                            itemStyle: {
                                emphasis: {//选中之后饼图的样式
                                    shadowBlur: 5,
                                    shadowOffsetX: 2,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    }
                })
                let usageNum = null
                for (let s of data) {
                    usageNum += Number(s.value);
                }
                if (this.refs.proUse && usageNum != 0) this.refs.proUse.update();
            } else {
                message.error(res.msg);
            }
        });
    }
    getDataAge(params) { // 年龄分析
        DAService.getDataAge(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                this.setState({
                    ageData: {
                        title: '年龄分析',
                        legendData: [''],
                        hasData: data,
                        series: [{
                            name: '年龄分析',
                            type: 'pie',
                            data: data,
                            labelLine: {
                                normal: {
                                    show: true,
                                    length: 10,
                                    length2: 10,
                                }
                            },
                            radius: ['20%', '45%'],
                            center: ['50%', '50%'],
                            itemStyle: {
                                emphasis: {//选中之后饼图的样式
                                    shadowBlur: 5,
                                    shadowOffsetX: 2,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    }
                })
                let ageNum = null
                for (let i of data) {
                    ageNum += Number(i.value);
                }
                if (this.refs.proAge && ageNum != 0) this.refs.proAge.update();
            } else {
                message.error(res.msg);
            }
        });
    }
    getDataTaskPie(params) { // 任务分布 饼图
        DAService.getDataTaskPie(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                this.setState({
                    taskPieData: {
                        title: '任务分布图',
                        legendData: [''],
                        taskAllTotal: data.taskAllTotal,
                        series: [{
                            name: '任务分布图',
                            type: 'pie',
                            selectedMode: 'single',
                            data: data.taskType,
                            radius: ['20%', '45%'],
                            center: ['50%', '50%'],
                            itemStyle: {
                                emphasis: {//选中之后饼图的样式
                                    shadowBlur: 5,
                                    shadowOffsetX: 2,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    }
                })
                if (this.refs.taskPieData && data && data.taskAllTotal != 0) this.refs.taskPieData.update();
            } else {
                message.error(res.msg);
            }
        });
    }
    getDataTask(params) { // 任务分析
        DAService.getDataTask(params, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data;
                let pAxis = [];
                for (let p of data.proAxis) {
                    pAxis.push(p)
                }
                this.setState({
                    taskData: {
                        title: '任务数据分析',
                        legendData: ['任务总数', '已完成任务', '延期任务'],
                        barGap: "10%",
                        xAxisData: pAxis,
                        grid: {
                            width: '90%',
                            height: 300,
                            left: 50,
                        },
                        series: [
                            {
                                name: '任务总数',
                                type: 'bar',
                                barGap: 0,
                                data: data.taskTotal,
                            },
                            {
                                name: '已完成任务',
                                type: 'bar',
                                barGap: 0,
                                data: data.taskComplete,
                            },
                            {
                                name: '延期任务',
                                type: 'bar',
                                barGap: 0,
                                data: data.taskDelay,
                            }
                        ]
                    }
                })
                if (this.refs.taskData && data && data.taskTotal.length != 0) this.refs.taskData.update();
            } else {
                message.error(res.msg);
            }
        });
    }
    launchFullScreen(document) {//全屏显示
        if (document.requestFullscreen) {
            document.requestFullscreen();
        }
        else if (document.mozRequestFullScreen) {
            document.mozRequestFullScreen();
        }
        else if (document.msRequestFullscreen) {
            document.msRequestFullscreen();
        }
        else if (document) {
            document.webkitRequestFullScreen();
        }
    }
    showCode = () => {//投屏按钮
        this.setState({
            showCode: true
        });
    }
    hideCode = () => {
        this.setState({
            showCode: false
        });
    }
    render() {
        const that = this;
        const curRole = Config.localItem('CUR_ROLE');  // 当前用户角色
        const { ipieceViews, ipieceTrans, proConvert } = that.state;
        const { defaultTab, productData, proHistogramId, MarketData, proLineId, proSexId, sexData, useData, proUseId, ageData, proAgeId, taskPieData, proTaskPieId, taskData, proTaskId, TotalData, showDatePicker, DataStaffs, right } = that.state;
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={false}>
                <Header data={TotalData} />
                <div className="common-tab-container DAtab-container">
                    {curRole.indexOf('ROLE_TOP_MANAGER') > -1 || curRole.indexOf('ROLE_SUPER_ADMIN') > -1 || curRole.indexOf('ROLE_MID_MANAGER') > -1 ?
                        <div className='screen' onMouseOver={this.showCode} onMouseLeave={this.hideCode}>
                            <Link to="/screen" activeStyle={{ color: 'white' }} className='screen-link' onClick={() => this.launchFullScreen(document.documentElement)}>{this.state.showCode ? <p className='screenWord'>数据投屏</p> : <img className='screenButton' src={screenButton} alt="screenButton" />}</Link>
                        </div> : null
                    }
                    <Tabs className='common-tabs-section DAtab-tabs' defaultActiveKey={defaultTab} activeKey={defaultTab} va onChange={this.changeTabs} animated={false}>
                        {!Config.isRoleCr(curRole) ? <TabPane tab="营销分析" key="marketing" className="TabPane">
                            <div className='common-tab-content'>
                                <div className='common-search-section'>
                                    <DateSearch searchData={this.goSearchData} showDatePicker={showDatePicker} showInput={right} staffs={DataStaffs} isMultiple={defaultTab == 'task' ? true : false} selectNum={1} />
                                </div>
                                <div className='marketing'>
                                    {
                                        MarketData ? <Line ref="proMarket" id={proLineId} data={MarketData} /> : null
                                    }
                                    <div className="proTransform" data-flex="main:left">
                                        {
                                            proConvert ? <SimFunnel data={proConvert} /> : null
                                        }
                                        <div style={{ width: '60%' }}>
                                            {
                                                ipieceViews ? <Bar ref="iViews" id="ipieceViews" echartStyle={{ width: '562px', height: '300px', display: 'inline-block' }} data={ipieceViews} /> : null
                                            }
                                            {
                                                ipieceTrans ? <Bar ref="iTrans" id='ipieceTrans' echartStyle={{ width: '562px', height: '300px', display: 'inline-block' }} data={ipieceTrans} /> : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPane> : null}

                        <TabPane tab="产品分析" key="product" className="TabPane">
                            <div className='common-tab-content'>
                                <div className='common-search-section'>
                                    <DateSearch searchData={this.goSearchData} showDatePicker={showDatePicker} showInput={right} staffs={DataStaffs} isMultiple={defaultTab == 'task' ? true : false} selectNum={1} />
                                </div>
                                <div className="product-analysis">
                                    {
                                        productData ? <Histogram ref="proHistogram" id={proHistogramId} data={productData} /> : null
                                    }
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="用户分析" key="user" className="TabPane">
                            <div className='common-tab-content'>
                                <div className='common-search-section'>
                                    <DateSearch searchData={this.goSearchData} showDatePicker={showDatePicker} showInput={right} staffs={DataStaffs} isMultiple={defaultTab == 'task' ? true : false} selectNum={1} />
                                </div>
                                {sexData && sexData.userNum != 0 ? <div className="user-analysis">
                                    {//用户总人数
                                        sexData && sexData.hasData ? <div className="userNum"><p className="numAlign">总人数<br />{sexData.userNum}</p></div> : null
                                    }
                                    {
                                        sexData ? <Pie ref="proSex" pieType={'sex'} id={proSexId} data={sexData} echartStyle={{ width: '30%', height: '300px', display: 'inline-block' }} /> : null
                                    }
                                    {
                                        useData ? <Pie ref="proUse" pieType={'usage'} id={proUseId} data={useData} echartStyle={{ width: '40%', height: '300px', display: 'inline-block' }} /> : null
                                    }
                                    {
                                        ageData ? <Pie ref="proAge" pieType={'age'} id={proAgeId} data={ageData} echartStyle={{ width: '30%', height: '300px', display: 'inline-block' }} /> : null
                                    }
                                </div>
                                    : <div className="none-data"><img className='nodataBg' src={nodataBg} alt="nodataBg" /><p className="none-data-word">暂无数据</p></div>}
                            </div>
                        </TabPane>
                        {!Config.isRoleCr(curRole) ? <TabPane tab="任务统计" key="task" className="TabPane">
                            <div className='common-tab-content'>
                                <div className='common-search-section'>
                                    <DateSearch searchData={this.goSearchData} showDatePicker={showDatePicker} showInput={right} staffs={DataStaffs} isMultiple={defaultTab == 'task' ? true : false} selectNum={1} />
                                </div>
                                {taskPieData && taskPieData.taskAllTotal != 0 ?
                                    <div className="task-analysis">
                                        {//任务总数
                                            taskPieData ? <div className="taskNum"><p className="taskAlign">总任务<br />{taskPieData.taskAllTotal}</p></div> : null
                                        }
                                        {
                                            taskPieData ? <Pie ref="taskPieData" id={proTaskPieId} getTaskByType={that.getTaskByType} data={taskPieData} echartStyle={{ width: '100%', height: '300px', display: 'inline-block', margin: '0 auto' }} /> : null
                                        }
                                        {
                                            taskData ? <Histogram ref="taskData" className="proHistogram" id={proTaskId} data={taskData} /> : null
                                        }
                                    </div> : <div className="none-data"><img className='nodataBg' src={nodataBg} alt="nodataBg" /><p className="none-data-word">暂无数据</p></div>}
                            </div>
                        </TabPane> : null}
                    </Tabs>
                </div>
            </Spin>
        );
    }
}
DAIndex.contextTypes = {
    router: React.PropTypes.object.isRequired
}
export default DAIndex;

