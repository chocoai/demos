import React, { Component } from 'react';
import { Config } from '../../Config/Index';

import './style/addTask.less';
import { browserHistory } from 'react-router';
import { Button, Select, message, DatePicker } from 'antd';
import UserService from '../../Services/UserService';
import TaskService from '../../Services/TaskService';
const Option = Select.Option;

class AddTask extends Component {
    constructor(props) {
        super(props); //后才能用this获取实例化对象
        this.state = {
            wordCount: 0,
            newTask: {
                taskName: '',
                taskType: 1,
                taskPri: 1,
                taskSource: 1,
                owner: '',
                ownerName: '',
                expiryDate: ''
            },
            roleParams: {
                roleType: 4
            },
            taskPerson: []
        };
    }
    componentDidMount() {
        const that = this;
        that.getTaskPerson();
        // that.context.router.setRouteLeaveHook(
        //   this.props.route,
        //   this.routerWillLeave
        // )
    }
    async getTaskPerson() {
        let that = this;
        const { roleParams } = that.state;
        const res = await UserService.getUserRole(roleParams);
        if (res.code == Config.errorCode.success) {
            that.setState({
                taskPerson: res.data
            });
        } else {
            message.error(res.msg);
        }

    }
    //修改执行人
    handleChange = (value) => {
        this.setState({ newTask: Object.assign(this.state.newTask, { owner: value.key, ownerName: value.label }) })
    }

    //时间改变回调函数
    changeTaskInfo = (value, dateString) => {
        let StrTime = Config.formatStrTime(dateString);
        this.setState({ newTask: Object.assign(this.state.newTask, { dateString: dateString, expiryDate: StrTime }) })
    }
    taskDescribe(e) {
        if (e.target.value.length > 256) {
            e.target.value = e.target.value.substr(0, 256);
            return;
        }
        this.setState({ newTask: Object.assign(this.state.newTask, { taskName: e.target.value }) })
        this.setState({
            wordCount: e.target.value.length
        })
    }
    async confirmTask() {
        const that = this;
        const { newTask } = that.state;
        if (!newTask.taskName) {
            message.error("请输入任务描述");
            return;
        }
        if (!newTask.ownerName) {
            message.error("请选择执行人");
            return;
        }
        const res = await TaskService.addTask(newTask);
        if (res) browserHistory.push('/tasks/all');
    }
    cancelTask() {
        browserHistory.goBack();
    }
    disabledExpiryDate = (current) => { // 禁用任务截止日期
        return current && current.valueOf() < Date.now();
    }
    changeMasketType() {
        if (this.state.newTask.taskType == 1) {
            this.setState({ newTask: Object.assign(this.state.newTask, { taskType: "" }) })
        } else {
            this.setState({ newTask: Object.assign(this.state.newTask, { taskType: 1 }) })
        }
    }
    contentSync() {
        //此步为了让删减的时候高度改变
        this.taskContent.style.height = 100 + 'px';
        this.taskContent.style.height = this.taskContent.scrollHeight + 'px';
    }
    render() {
        return (
            <div className="addtask-container common-console-container">
                <div className="addtask-item">
                    <label htmlFor="taskName" className="addtask-title">任务描述</label>
                    <textarea id="taskName" className="task-name" placeholder="必填项" ref={ref => { this.taskContent = ref }} onChange={(e) => { this.taskDescribe(e); this.contentSync() }}></textarea>
                    <p className="task-count">{this.state.wordCount}/256</p>
                </div>
                <div className="addtask-items">
                    <div className="addtask-min-item">
                        <p className="addtask-title">任务指派</p>
                        <Select
                            className="addtask-user"
                            showSearch
                            labelInValue
                            size="large"
                            placeholder="必选项"
                            optionFilterProp="children"
                            onChange={this.handleChange}
                            getCalendarContainer={trigger => trigger.parentNode}
                            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {
                                this.state.taskPerson.map((item, index) => (
                                    <Option value={item.userId + ""} key={index}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="addtask-min-item">
                        <p className="addtask-title">截止时间</p>
                        <DatePicker
                            className="addtask-time"
                            format="YYYY-MM-DD"
                            placeholder="必选项"
                            size="large"
                            disabledDate={this.disabledExpiryDate}
                            getCalendarContainer={trigger => trigger.parentNode}
                            onChange={this.changeTaskInfo}
                        />
                    </div>
                </div>
                <div className="addtask-btns">
                    <Button className="common-small-btn" type="primary" htmlType="submit" onClick={() => this.confirmTask()}>新增</Button>
                    <Button className="common-small-btn" htmlType="submit" onClick={() => this.cancelTask()}>取消</Button>
                </div>
            </div>
        )
    }
}

AddTask.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default AddTask;
