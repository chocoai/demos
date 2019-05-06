import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { browserHistory } from 'react-router';
import { Config } from '../../Config/Index';
import CommonService from '../../Services/CommonService';
import SubbranchService from '../../Services/SubbranchService';
import taskdetailsMap from './../../Assets/Images/taskdetails_bg_map.png';

import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import "./style/subbranchOpt.less";
import { Row, Col, Button, Form, Input, TimePicker, Cascader, message } from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

const format = 'HH:mm';

/**
 * 系统配置 —— 支行网点配置 —— 编辑/新增
 * @Author: 魏昌华
 * @Date:   2018-05-23
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2018-05-23
 */

class SubbranchOpt extends Component {
    constructor(props) {
    	super(props);
        this.state = {
            branchInfo: '',
            cOptions: [],
            bMap: ''
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    async componentDidMount() {
        const that = this;
        const { routeParams } = that.props;
        //加载百度地图
        window.HOST_TYPE = "2";
        window.BMap_loadScriptTime = (new Date()).getTime();
        const oScript = document.createElement("script");
        oScript.src = "https://api.map.baidu.com/getscript?v=2.0&ak=PNhhMFEMvIgiZ8LO09zFNeBd3pHtnM7r&services=&t=20170728132058";
        oScript.type = "text/javascript";
        if(routeParams.code) {
            const res = await SubbranchService.getBranch({code: routeParams.code});
            if (res.code == Config.errorCode.success) {
                that.setState({
                    branchInfo: res.data
                });
                document.head.appendChild(oScript);
                oScript.onload = function () {
                    that.initMap(res.data);
                }
            } else {
                message.error(res.msg);
            }
        } else {
            document.head.appendChild(oScript);
            oScript.onload = function () {
                that.initMap();
            }
        }
        const res = await CommonService.getDictItems({code: 'ssq'});
        if (res.code == Config.errorCode.success) {
            const ssq = res.data && res.data.ssq;
            let cOptions = [];
            ssq.forEach((item) => {
                let option = {
                    value: item.ddValue,
                    label: item.ddText,
                    children: []
                };
                item.dictDTOS && item.dictDTOS.length > 0 && item.dictDTOS.forEach((cItem) => {
                    let cOption = {
                        value: cItem.ddValue,
                        label: cItem.ddText,
                        children: []
                    };
                    cItem.dictDTOS && cItem.dictDTOS.length > 0 && cItem.dictDTOS.forEach((sItem) => {
                        cOption.children.push({
                            value: sItem.ddValue,
                            label: sItem.ddText
                        });
                    });
                    option.children.push(cOption);
                });
                cOptions.push(option);
            });
            that.setState({
                cOptions: cOptions
            });
        } else {
            message.error(res.msg);
        }
    }
    goBack = () => { // 取消按钮
        browserHistory.goBack();
    }
    handleSubmit = async (e) => { // 新增、编辑支行网点
        e.preventDefault();
        const that = this;
        const { routeParams } = that.props;
        const { branchInfo } = that.state;
        let params = {
            bankName: branchInfo.bankName,
            bankPhone: branchInfo.bankPhone,
            provinceRegion: branchInfo.provinceRegion,
            address: branchInfo.address,
            startTime: branchInfo.startTime,
            endTime: branchInfo.endTime
        };
        if (!params.bankName) return message.error('请输入支行名称');
        if (params.bankName.length < 2 || params.bankName.length > 25) return message.error('支行名称只能输入2-25个汉字');
        if (!params.bankPhone) return message.error('请输入支行电话');
        if (params.bankPhone.length < 8 || params.bankPhone.length > 12)  return message.error('支行电话为8-12位');
        if (!params.provinceRegion) return message.error('请选择支行地址');
        if (!params.address) return message.error('请输入详细地址');
        if (!params.startTime) return message.error('请选择上班时间');
        if (!params.endTime) return message.error('请选择下班时间');
        if (params.startTime.replace(':', '') >= params.endTime.replace(':', '')) return message.error('上班时间不能大于下班时间');
        if (routeParams.code) {
            params.code = routeParams.code;
            const res = await SubbranchService.editBranch(params);
            if (res.code == Config.errorCode.success) {
                message.success('编辑支行网点成功！');
                browserHistory.push('/subbranch');
            }
        } else {
            const res = await SubbranchService.addBranch(params);
            if (res.code == Config.errorCode.success) {
                message.success('新增支行网点成功！');
                browserHistory.push('/subbranch');
            }
        }
	}
    changeInput = (inp, e, option) => { // input值变化
        const that = this;
        let { branchInfo, bMap } = that.state;
        let branch = { };
        if(branchInfo) {
            branch = Object.assign({}, branchInfo);
        } else {
            branchInfo = {};
        }
        if(inp == 'bankName') branch.bankName = e.target.value;
        if(inp == 'bankPhone') branch.bankPhone = e.target.value;
        if (inp == 'provinceRegion') {
            branch.provinceRegion = e.join('/');
            let city = '';
            if (branch.provinceRegion) {
                city = branch.provinceRegionText = `${option[0].label}${option[1].label}${option[2].label}`;
            }
            let address = branch.address || '';
            that.bmapGeocoder(`${city}${address}`, bMap);
        }
        if (inp == 'address') {
            branch.address = e.target.value;
            let address = branch.address || '';
            let city = branch.provinceRegionText || '';
            that.bmapGeocoder(`${city}${address}`, bMap);
        }
        if (inp == 'startTime') branch.startTime = e;
        if (inp == 'endTime') branch.endTime = e;
        that.setState({
            branchInfo: branch
        });
    }
    // 初始化地图
    initMap(data) {
        const that = this;
        let BMap = window.BMap;
        var map = new BMap.Map("allmap");
        var point = new BMap.Point(120.21937542, 30.25924446); // 初始化地图,设置中心点坐标和地图级别
        map.centerAndZoom(point, 15);
        const top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
        map.addControl(top_left_navigation);
        let address = '浙江省杭州市文二西路808号西溪壹号17幢';
        if (data) address = `${data.provinceRegionText}${data.address}`;
        that.bmapGeocoder(address, map);
        that.setState({
            bMap: map
        });
    }
    bmapGeocoder(address, map) {
        const that = this;
        const BMap = window.BMap;
        map.clearOverlays();
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(address, function(point) {
            if (point) {
                map.centerAndZoom(point, 15);
                that.createLabel(address, map, point, 0)
            } else {
                // 您选择地址没有解析到结果
                var local = new BMap.LocalSearch(map, {
                    renderOptions:{map: map}
                });
                local.search(address);
            }
        }, address);
    }
    createLabel(address, map, dataItem, index) {
        let BMap = window.BMap;
        let pointOne = new BMap.Point(dataItem.lng, dataItem.lat);

        let that = this;

        //地址转换
        let geoc = new BMap.Geocoder(), label, label2, opts, myIcon, vectorMarker;
        geoc.getLocation(pointOne, function (rs) {
            //设置区域
            let zone = rs.business.split(",").slice(-1).join("");
            if (!that.state.zone) {
                that.setState({
                    zone: zone
                })
            }
            label = new BMap.Label(address);
            label.setStyle({
                color: "#fff",
                fontSize: "13px",
                width: "160px",
                border: "none",
                lineHeight: "26px",
                backgroundColor: "#484745",
                fontFamily: "微软雅黑",
                padding: "10px",
                whiteSpace: "normal",
                display: "none"
            });

            opts = {
                position: pointOne,    // 指定文本标注所在的地理位置
                offset: new BMap.Size(0, -7)    //设置文本偏移量
            }
            label2 = new BMap.Label(index + 1, opts);
            label2.setStyle({
                color: "#009688",
                fontSize: "10px",
                border: "none",
                backgroundColor: "transparent",
                fontFamily: "微软雅黑",
            });
            // map.addOverlay(label2);    //取消数字

            myIcon = new BMap.Icon(taskdetailsMap, new BMap.Size(32, 32));
            //设置图案不完全居中，位置微调
            vectorMarker = new BMap.Marker(new BMap.Point(dataItem.lng, dataItem.lat), { icon: myIcon });

            map.addOverlay(vectorMarker);
            vectorMarker.setLabel(label);

            //信息显示隐藏
            vectorMarker.addEventListener("mouseover", labelShow);
            vectorMarker.addEventListener("mouseout", labelHide);

        });

        function labelShow() {
            label.setStyle({
                display: "block"
            });
            vectorMarker.setLabel(label);
        }
        function labelHide() {
            label.setStyle({
                display: "none"
            });
            vectorMarker.setLabel(label);
        }
    }
	render() {
        const that = this;
        const { branchInfo, cOptions } = that.state;
        const { routeParams } = that.props;
        const code = routeParams.code;
        const bcrumb = [{
            'link': '/subbranch',
            'value': '支行网点设置'
        }, {
            'link': null,
            'value': code ? '编辑支行' : '新增支行'
        }];
		const formItemLayout = {
		    labelCol: {
		        xs: { span: 6 },
		        sm: { span: 6 }
		    },
		    wrapperCol: {
		    	xs: { span: 18 },
		        sm: { span: 18 }
		    }
	    };
	    const tailFormItemLayout = {
		    wrapperCol: {
		        xs: {
		        	span: 24,
		        	offset: 0
		    	},
		        sm: {
		        	span: 14,
		        	offset: 6
		        }
		    }
        };
		return (
            <div className="common-opt subbranch-opt">
		  		<BcrumbItem bcrumb={bcrumb} />
	        	<Form onSubmit={this.handleSubmit} className="common-form">
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="支行名称" hasFeedback>
                                <Input value={branchInfo && branchInfo.bankName} placeholder="必填项" maxLength="25" onChange={this.changeInput.bind(this, 'bankName')} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="支行电话" hasFeedback>
                                <Input value={branchInfo && branchInfo.bankPhone} placeholder="必填项，格式为057182858828" maxLength="12" onChange={this.changeInput.bind(this, 'bankPhone')} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="支行地址" hasFeedback>
                                <Cascader size="large" style={{width: "100%"}} value={(branchInfo && branchInfo.provinceRegion && branchInfo.provinceRegion.split('/'))} options={cOptions} onChange={(value, selectedOptions) => that.changeInput('provinceRegion', value, selectedOptions)} placeholder="必选项" />
                                <Input className="bank-address-desc" size="large" maxLength="64" value={branchInfo && branchInfo.address} placeholder="详细地址" onChange={that.changeInput.bind(this, 'address')} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="营业时间" hasFeedback>
                                { branchInfo && branchInfo.startTime ? <TimePicker placeholder="上班时间" size="large" className="start-time-picker" value={moment(branchInfo.startTime, format)} format={format} onChange={(time, timeString) => that.changeInput('startTime', timeString)} /> : <TimePicker placeholder="上班时间" size="large" className="start-time-picker" format={format} onChange={(time, timeString) => that.changeInput('startTime', timeString)} /> }
                                { branchInfo && branchInfo.endTime ? <TimePicker placeholder="下班时间" size="large" className="end-time-picker" value={moment(branchInfo.endTime, format)} format={format} onChange={(time, timeString) => that.changeInput('endTime', timeString)} /> : <TimePicker placeholder="下班时间" size="large" className="end-time-picker" format={format} onChange={(time, timeString) => that.changeInput('endTime', timeString)} /> }
                            </FormItem>
                        </Col>
                    </Row>
                    <div id="allmap"></div>
                    <FormItem {...tailFormItemLayout}>
                        <Button className="common-btn" type="primary" htmlType="submit" size="large">{code ? "保存" : "新增"}</Button>
                        <Button className="common-btn cancel-btn" size="large" onClick={this.goBack}>取消</Button>
                    </FormItem>
                </Form>
			</div>
		);
	}
}



const SubbranchForm = Form.create()(SubbranchOpt);
export default SubbranchForm;









