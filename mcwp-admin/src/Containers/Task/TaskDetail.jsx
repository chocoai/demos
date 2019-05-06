import React, { Component } from 'react'; // 引入了React
import { Spin, message, Modal, Popover, Select, DatePicker } from 'antd';
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import './style/taskDetail.less';
import taskdetailIcon from './../../Assets/Images/taskdetails_icon_record.png';
import taskdetailsMap from './../../Assets/Images/taskdetails_bg_map.png';
import moment from 'moment';
const Option = Select.Option;


/* 以类的方式创建一个组件 */
class TaskDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: props.routeParams.id,
            loading: false,
            labelAddress: "",
            task: {
                taskDto: {},
                sysTracks: [],
                taskOpeventLogs: []
            },
            zone: "",
            modalVisible: false,
            editStatus: false,
            originValue: {
                selectValue: '',
                dateValue: ''
            },
            taskPerson: [],
            visible: false,
            textInfo: '',
            owner: '',
            ownerName: '',
            dateString: '',
            expiryDate: ''
        }
    }
    componentDidMount() {
        let code = this.state.code;
        this.getTaskInfo(code);
        this.getTaskPerson();
    }
    updateTask(code, type) {
        this.setState({ loading: true });
        Config.get('/v1/task', { code: code }, (res) => {
            this.setState({ loading: false });
            if (res.code == Config.errorCode.success) {
                this.setState({
                    task: res.data
                });
                if (type == 'close') {
                    this.setState({
                        editStatus: false,
                    });
                    return;
                }
            }
        })
    }
    getTaskInfo = (code, type) => {  // 加载任务详情信息
        this.setState({ loading: true });
        Config.get('/v1/task', { code: code }, (res) => {
            this.setState({ loading: false });
            if (res.code == Config.errorCode.success) {
                this.setState({
                    task: res.data,
                    owner: res.data.taskDto.owner,
                    ownerName: res.data.taskDto.ownerName
                });
                if (type == 'close') {
                    this.setState({
                        editStatus: false,
                    });
                    return;
                }
                // //加载百度地图
                let that = this;
                const { sysTracks } = this.state.task;
                window.HOST_TYPE = "2";
                window.BMap_loadScriptTime = (new Date()).getTime();
                const oScript = document.createElement("script");
                oScript.src = "https://api.map.baidu.com/getscript?v=2.0&ak=PNhhMFEMvIgiZ8LO09zFNeBd3pHtnM7r&services=&t=20170728132058";
                oScript.type = "text/javascript";
                document.head.appendChild(oScript);
                oScript.onload = function () {
                    that.createMap(sysTracks)
                }


            } else {
                message.error(res.msg);
            }
        });
    }
    createMap(data) {
        let BMap = window.BMap;
        let map = new BMap.Map("allmap");
        if (!data[0]) {
            let point = new BMap.Point(120.127401, 30.288469);
            map.centerAndZoom(point, 15);   // 初始化地图,设置中心点坐标和地图级别
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint("杭州市西湖区文二路391号", function (point) {
                if (point) {
                    map.centerAndZoom(point, 15);
                } else {
                    console.log("您选择地址没有解析到结果!");
                }
            }, "杭州市");
            return;
        }
        let point = new BMap.Point(data[0].lng, data[0].lat);
        map.centerAndZoom(point, 15);   // 初始化地图,设置中心点坐标和地图级别

        let top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
        map.addControl(top_left_navigation);


        let BMapArr = [], i, len = data.length;
        for (i = 0; i < len; i++) {
            BMapArr.push(new BMap.Point(data[i].lng, data[i].lat));
            this.createLabel(map, data[i], i);
        }

        // let polyline = new BMap.Polyline(BMapArr, {strokeColor:"#5292fc", strokeWeight:3});

        // map.addOverlay(polyline); //添加直线

        // map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    }
    createLabel(map, dataItem, index) {
        let BMap = window.BMap;
        let pointOne = new BMap.Point(dataItem.lng, dataItem.lat);

        let that = this;

        //地址转换
        let geoc = new BMap.Geocoder(), labelAddress = "", label, label2, opts, myIcon, vectorMarker, labelDate;
        geoc.getLocation(pointOne, function (rs) {
            let addComp = rs.addressComponents;
            //详细地址
            labelAddress = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;

            //设置区域
            let zone = rs.business.split(",").slice(-1).join("");
            if (!that.state.zone) {
                that.setState({
                    zone: zone
                })
            }

            //时间转换
            labelDate = Config.formatDateTime(dataItem.createDate);

            label = new BMap.Label(labelDate + "<br>" + labelAddress);
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
            vectorMarker = new BMap.Marker(new BMap.Point(dataItem.lng, dataItem.lat + 0.0008), { icon: myIcon });

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
    getTaskPerson() {
        Config.get('/v1/user/role/select', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    taskPerson: res.data,
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    //修改执行人
    handleChange = (value) => {
        // const { code } = this.state;
        this.setState({
            owner: value.key,
            ownerName: value.label
        })
        //code不为0，直接修改
        // if(code) {
        //     let params = {
        //         code: this.state.code,
        //         owner: value.key,
        //         ownerName: value.label
        //     }
        //     Config.put('/v1/task',params,(res) => {
        //         if(res.code == Config.errorCode.success) {
        //             this.getTaskInfo(code);
        //         } else {
        //             message.error(res.msg);
        //         }
        //     })
        // }
    }
    //时间改变回调函数
    changeTaskInfo = (value, dateString) => {
        // const { code } = this.state;
        let StrTime = Config.formatStrTime(dateString);
        this.setState({
            dateString: dateString,
            expiryDate: StrTime
        })
        this.changeTask('visible', value);
        // if(code) {
        //     let params = {
        //         code: code,
        //         dateString: dateString,
        //         expiryDate: StrTime
        //     }
        //     Config.put('/v1/task',params,(res) => {
        //         if(res.code == Config.errorCode.success) {
        //             this.getTaskInfo(code);
        //         } else {
        //             message.error(res.msg);
        //         }
        //     })
        // }
    }
    //选择时间后关闭，目前仅仅在添加新任务时候生效
    changeTask(field, value) {
        this.setState({
            [field]: false
        });
    }
    taskDelete = () => {
        let params = {
            code: this.state.code
        }
        Config.delete('/v1/task', params, (res) => {
            if (res.code == Config.errorCode.success) {
                // browserHistory.push('/task');
                browserHistory.goBack();
            } else {
                message.error(res.msg);
            }
        })
    }
    changeEditStatus = () => {
        const { taskDto } = this.state.task
        this.setState({
            editStatus: true,
            textInfo: taskDto.taskName,
            ownerName: taskDto.ownerName,
            dateString: taskDto.displayDay
        }, () => {
            this.titleText.style.height = 30 + 'px';
            this.titleText.style.height = this.titleText.scrollHeight + 'px';
        })
    }
    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    }
    changeTitle = (e) => {
        this.setState({
            textInfo: e.target.value
        })
        //此步为了让删减的时候高度改变
        this.titleText.style.height = 30 + 'px';
        this.titleText.style.height = this.titleText.scrollHeight + 'px';
    }
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }
    disabledExpiryDate = (current) => { // 禁用任务截止日期
        return current && current.valueOf() < Date.now();
    }
    dispatchValue(id, date) {
        this.setState({
            originValue: {
                selectValue: id || '',
                dateValue: date || ''
            }
        })
    }
    handleOk = (e) => {
        this.taskDelete();
    }
    handleCancel = (e) => {
        this.setState({
            modalVisible: false,
        });
    }
    putInfo = (url, params) => {
        return new Promise(resolve => {
            Config.put(url, params, (res) => {
                if (res.code == Config.errorCode.success) {
                    resolve('成功');
                } else {
                    message.error(res.msg);
                    resolve(res.msg);
                }
            })
        })
    }
    saveValue = () => {
        const { code, dateString, expiryDate, owner, ownerName, textInfo } = this.state;
        if (textInfo.length == 0) return message.error('任务描述不能为空！');
        this.setState({ loading: true });
        let params = {
            code: code,
            owner: owner,
            ownerName: ownerName,
            dateString: dateString,
            expiryDate: expiryDate,
            taskName: textInfo
        }
        // let paramsName = {
        //     code: code,
        //     taskName: textInfo
        // }
        Promise.all([
            this.putInfo('/v1/task', params),
            // this.putInfo('/v1/task', paramsName)
        ]).then(result => {
            this.updateTask(code, 'close');
        });
    }
    cancelValue = () => {
        this.setState({ editStatus: false });
    }


    render() {
        const { taskDto, taskOpeventLogs } = this.state.task;
        const { editStatus, textInfo, ownerName, dateString } = this.state;
        const content = (
            <div>
                <p>将任务分配给</p>
                {
                    taskDto.owner ?
                        <Select
                            showSearch
                            labelInValue
                            style={{ width: 200 }}
                            placeholder="选择成员"
                            optionFilterProp="children"
                            onChange={this.handleChange}
                            defaultValue={{ key: taskDto.owner + '' }}
                            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            getPopupContainer={trigger => trigger.parentNode}
                        >
                            {
                                this.state.taskPerson.map((item, index) => (
                                    <Option value={item.userId + ''} key={index}>{item.name}</Option>
                                ))
                            }
                        </Select>
                        :
                        <Select
                            showSearch
                            labelInValue
                            style={{ width: 200 }}
                            placeholder="选择成员"
                            optionFilterProp="children"
                            onChange={this.handleChange}
                            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            getPopupContainer={trigger => trigger.parentNode}
                        >
                            {
                                this.state.taskPerson.map((item, index) => (
                                    <Option value={item.userId + ''} key={index}>{item.name}</Option>
                                ))
                            }
                        </Select>
                }

                <p>任务截止日期至</p>
                {
                    taskDto.expiryDate ?
                        <DatePicker
                            format="YYYY-MM-DD"
                            disabledDate={this.disabledExpiryDate}
                            onChange={this.changeTaskInfo}
                            allowClear={false}
                            defaultValue={moment(taskDto.expiryDate)}
                            getCalendarContainer={trigger => trigger.parentNode}
                        /> :
                        <DatePicker
                            format="YYYY-MM-DD"
                            disabledDate={this.disabledExpiryDate}
                            allowClear={false}
                            onChange={this.changeTaskInfo}
                            getCalendarContainer={trigger => trigger.parentNode}
                        />
                }

            </div>
        );
        const bcrumb = [{
            'link': '/tasks/all',
            'value': '任务管理'
        }, {
            'link': null,
            'value': '任务详情'
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="task-detail-container">
                    <BcrumbItem bcrumb={bcrumb} />
                    <div className="task-detail-content common-console-container">
                        {/*<span className='task-area'>对{ this.state.zone }区域进行扫街营销</span>*/}
                        {
                            editStatus ?
                                <div>
                                    <div className='task-wrapper'>
                                        <p className='task-detail-wrapper'>
                                            <span className='task-type'>{taskDto.taskType === 1 ? "营销任务" : taskDto.taskType === 2 ? "调查任务" : "催收任务"}</span>
                                            <textarea className='title-text' value={textInfo} ref={ref => { this.titleText = ref }} onChange={this.changeTitle}></textarea>
                                            <Popover placement="right" content={content} trigger="click" visible={this.state.visible} onVisibleChange={this.handleVisibleChange} onClick={() => this.dispatchValue(taskDto.ownerName, taskDto.expiryDate)} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                                <span className='task-owner task-owner-edit'>{ownerName || '未指派'} {dateString}</span>
                                            </Popover>
                                        </p>
                                        {
                                            taskDto.createOwnerName == Config.localItem('LOGIN_USER_NAME') ?
                                                <span className='task-detail-btn task-delete' onClick={this.showModal}>删除</span> : null
                                        }
                                    </div>
                                    <Modal
                                        visible={this.state.modalVisible}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                    >
                                        <p>确定要删除该任务吗？</p>
                                    </Modal>
                                    <p className='rule-button'>
                                        <span className='rule-save' onClick={this.saveValue}>保存</span>
                                        <span className='rule-cancel' onClick={this.cancelValue}>取消</span>
                                    </p>
                                </div> :
                                <div className='task-wrapper'>
                                    <p className='task-detail-wrapper'>
                                        <span className='task-type'>{taskDto.taskType === 1 ? "营销任务" : taskDto.taskType === 2 ? "调查任务" : "催收任务"}</span>
                                        <span className='task-area'>{taskDto.taskName}</span>
                                        {taskDto.ownerName || taskDto.displayDay ?
                                            <span className='task-owner'>{taskDto.ownerName} {taskDto.displayDay}</span> : null
                                        }
                                    </p>
                                    <p>
                                        {
                                            taskDto.createOwnerName == Config.localItem('LOGIN_USER_NAME') ?
                                                <span className='task-detail-btn task-delete' onClick={this.showModal}>删除</span> : null
                                        }
                                        {
                                            taskDto.createOwnerName === Config.localItem('LOGIN_USER_NAME') && taskDto.taskType != 3 ?
                                                <span className='task-detail-btn task-edit' onClick={this.changeEditStatus}>编辑</span> : null
                                        }
                                    </p>
                                    <Modal
                                        visible={this.state.modalVisible}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                    >
                                        <p>确定要删除该任务吗？</p>
                                    </Modal>
                                </div>
                        }
                        <ul className='task-schedule'>
                            {
                                taskOpeventLogs.map((item, index) => (
                                    <li className='task-schedule-item' key={index}><img className="taskdetails-icon-record" src={taskdetailIcon} alt='time' /><span className="taskdetails-record">{Config.formatDateTime(item.opeventDate)} <strong>{item.opeventAction}</strong></span></li>
                                ))
                            }
                            {/*{
                                taskDto.taskStatus === 2?
                                <li className='task-schedule-item'><img className="taskdetails-icon-record" src={taskdetailIcon} alt='time' /><span className="taskdetails-record">{ Config.formatDateTime(taskDto.updateDate)} <strong>{ taskDto.ownerName }完成了任务</strong></span></li>
                                : null
                            }*/}
                        </ul>
                        <div id="allmap"></div>
                    </div>
                </div>
            </Spin>
        );
    }
}

TaskDetail.contextTypes = {

};

export default TaskDetail;
