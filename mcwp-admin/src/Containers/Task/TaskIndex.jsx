import React, { Component } from 'react'; // 引入了React
import moment from 'moment';
import { Link } from 'react-router';
import { Config } from '../../Config/Index';
import TaskService from '../../Services/TaskService';
import './style/task.less';
import SituationItem from '../../Component/Task/SituationItem';
import ResetSearch from './../../Component/Common/ResetSearch';
import { Button, Popover, Select, Menu, Input, Row, Col, message, Spin, DatePicker, Checkbox, Pagination } from 'antd';
const Search = Input.Search;
const Option = Select.Option;
/* 以类的方式创建一个组件 */
class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            defaultTab: ['all'],
            taskSituation: '', // 任务执行情况
            marketTask: [], // 营销任务
            investTask: [], // 调查任务
            startValue: null,
            endValue: null,
            loading: true,
            checked: true,
            dateKey: 0,
            taskList: [], // 全部任务
            recordsTotal: '', // 任务总数
            params: {
                page: 1,
                rows: 10
            },
            marketParams: {
                sort: 'taskStatus',
                page: 1,
                rows: 5,
                taskType: 1 // 任务类型:1.营销任务,2.调查任务,3.全部任务
            },
            investParams: {
                sort: 'taskStatus',
                page: 1,
                rows: 5,
                taskType: 2 // 任务类型:1.营销任务,2.调查任务,3.全部任务
            },
            newTask: {
                type: null,
                taskId: '', //任务code
                code: '',
                taskName: '',
                taskType: '',
                taskPri: 1,
                taskSource: 1,
                owner: '',
                ownerName: '',
                dateString: '',
                expiryDate: '',
            },
            taskPerson: [{ name: Config.localItem('LOGIN_USER_NAME'), userId: Config.localItem('LOGIN_USER_ID') }],
            addMarketTask: false,
            addInvestTask: false,
            selectIndex: 0,
            originValue: {
                selectValue: '',
                dateValue: ''
            },
            goTop: '',
            dom: '',
            choseTab: 'all'
        };
    }
    componentDidMount() {
    }
    componentWillMount() {
        const that = this;
        const { routeParams } = that.props;
        that.setState({
            defaultTab: routeParams.tab ? routeParams.tab.split() : ['all'],
        });
        let params = this.state.params;
        if (routeParams.tab == 'all') {
            if (params.taskType) delete params.taskType;
        } else if (routeParams.tab == 'market') {
            params.taskType = 1;
        } else if (routeParams.tab == 'invest') {
            params.taskType = 2;
        } else if (routeParams.tab == 'collection') {
            params.taskType = 3;
        }
        params.page = 1; // 重置页数
        this.setState({
            params: params,
        });

        that.getTaskPerson()
        that.getTasksSit();
    }
    //获取任务执行情况
    getTasksSit() {
        TaskService.getTaskSituation({}, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    taskSituation: res.data
                });
                let params = this.state.params;
                this.getTasks(params); // 获取任务
            } else {
                message.error(res.msg);
            }
        });
    }

    getTasks = (params = {}) => { // 获取任务
        TaskService.getTasks(params, (res) => {
            if (res.code == Config.errorCode.success) {
                let tasks = res.data;
                this.setState({
                    taskList: tasks,
                    recordsTotal: res.recordsTotal,
                    loading: false
                });
            } else {
                message.error(res.msg);
                this.setState({
                    loading: false
                });
            }
        });
    }
    // 延迟刷新任务状态
    getDelayTasks = (params = {}) => {
        TaskService.getTasks(params, (res) => {
            if (res.code == Config.errorCode.success) {
                let tasks = res.data;
                if (params.taskType == 1) {
                    setTimeout(() => {
                        this.setState({
                            marketTask: tasks,
                            loading: false
                        });
                        this.getTasksSit();
                    }, 800)
                } else if (params.taskType == 2) {
                    setTimeout(() => {
                        this.setState({
                            investTask: tasks,
                            loading: false
                        });
                        this.getTasksSit();
                    }, 800)
                }
            } else {
                message.error(res.msg);
                setTimeout(() => {
                    this.setState({
                        loading: false
                    });
                    this.getTasksSit();
                }, 800)
            }
        });
    }
    getMoreTask(params) {
        Config.get('/v1/tasks', params, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    marketTask: res.data,
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    getTaskPerson() {
        Config.get('/v1/user/role/select', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    taskPerson: res.data,
                    tmpTaskPerson: res.data
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    updateTaskStatus = (params = {}, type) => { // 任务状态编辑
        this.setState({
            loading: true
        });
        TaskService.updateTaskStatus(params, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    loading: false
                });
                this.getTasksSit();
            } else {
                message.error(res.msg);
                this.setState({
                    loading: false
                });
            }
        });
    }
    triggerMenu = (e) => { // 切换完成情况
        let params = this.state.params;
        if (e.key == 'all') {
            if (params.taskType) delete params.taskType;
        } else if (e.key == 'market') {
            params.taskType = 1;
        } else if (e.key == 'invest') {
            params.taskType = 2;
        } else if (e.key == 'collection') {
            params.taskType = 3;
        }
        params.page = 1; // 重置页数
        this.setState({
            params: params,
            choseTab: e.key
        });
        this.getTaskPerson()
        this.getTasksSit();
    }

    disabledStartDate = (startValue) => { // 禁用开始日期(搜索)
        const endValue = this.state.endValue;
        if (!startValue || !endValue) return false;
        return startValue.valueOf() > endValue.valueOf();
    }
    disabledEndDate = (endValue) => { // 禁用结束日期(搜索)
        const startValue = this.state.startValue;
        if (!endValue || !startValue) return false;
        return endValue.valueOf() <= startValue.valueOf();
    }
    disabledExpiryDate = (current) => { // 禁用任务截止日期
        return current && current.valueOf() < Date.now();
    }
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }
    changTab = (page, pageSize) => {
        let curPage = page, params = this.state.params;
        params.page = curPage;
        this.setState({
            params: params,
        });
        this.getTasks(params);

    }
    onShowSizeChange = (current, size) => {
        let curRows = size, params = this.state.params;
        params.rows = curRows;
        this.setState({
            params: params,
        });
        this.getTasks(params);

    }
    searchStatus = (value) => { // 任务状态搜索
        let params = this.state.params;
        params.taskStatus = value;
        params.page = 1; // 查询数据重置页码
        this.setState({
            params: params,
        });
        this.getTasks(params);
    }
    searchOwner = (value) => { // 任务归属人搜索
        let params = this.state.params;
        params.owners = value;
        params.page = 1; // 查询数据重置页码
        this.setState({
            params: params,
        });
        this.getTasks(params);
    }
    searchDateKey = (dateKey) => { // 本周、本月、近三个月
        let params = this.state.params;
        params.startTime = moment().subtract(dateKey, 'days').format('YYYY-MM-DD');
        params.endTime = moment().format('YYYY-MM-DD');
        this.setState({
            dateKey: dateKey,
            params: params,
            endValue: null,
            startValue: null
        });
        params.page = 1; //重置页码
        this.getTasks(params);
    }
    onStartChange = (value, dateString) => { // 按开始时间查询
        let params = this.state.params;
        if (value) {
            params.startTime = dateString;
        } else {
            delete params.startTime;
        }
        params.page = 1; // 重置页数
        this.setState({
            params: params,
            dateKey: 0
        });
        this.getTasks(params); // 获取任务
        this.onChange('startValue', value);
    }
    onEndChange = (value, dateString) => { // 按结束时间查询
        let params = this.state.params;
        if (value) {
            params.endTime = dateString;
        } else {
            delete params.endTime;
        }
        params.page = 1; // 重置页数
        this.setState({
            params: params,
            dateKey: 0
        });
        this.getTasks(params); // 获取任务
        this.onChange('endValue', value);
    }
    searchData = (value) => { // 查询数据
        let keyWord = value, params = this.state.params;
        if (Config.isNull(keyWord)) {
            delete params.keyWord;
        } else {
            params.keyWord = keyWord;
        }
        params.page = 1; // 重置页数
        this.setState({
            params: params,
        });
        this.getTasks(params); // 获取任务
    }
    addTask = (type) => { // 增加任务
    }
    //修改执行人
    handleChange = (value) => {
        this.setState({ newTask: Object.assign(this.state.newTask, { owner: value.key, ownerName: value.label }) })
        //code不为0，直接修改
        if (this.state.newTask.code) {
            let params = {
                code: this.state.newTask.code,
                owner: value.key,
                ownerName: value.label
            }
            Config.put('/v1/task', params, (res) => {
                if (res.code == Config.errorCode.success) {
                    this.getTasks(this.state.params); // 获取任务
                } else {
                    message.error(res.msg);
                }
            })
        }
    }
    changeTaskStatus = (code, status, type) => {
        let taskStatus = 1;
        if (status == 1 || status == 3) taskStatus = 2;
        let params = {
            code: code,
            taskStatus: taskStatus
        };
        this.updateTaskStatus(params, type);
    }
    //添加营销任务
    addMarketTask() {
        this.setState({
            addMarketTask: true,
            addInvestTask: false,
        })
        //每次打开重置状态
        this.setState({
            newTask: {
                type: null,
                taskId: '',
                taskName: '',
                taskType: 1,
                taskPri: 1,
                taskSource: 1,
                owner: '',
                ownerName: '',
                dateString: '',
                expiryDate: '',
            }
        })
    }
    //确认营销任务
    confirmMarketTask() {
        if (!this.state.newTask.taskName) {
            message.error("请输入任务名称");
            return;
        }
        if (this.state.newTask.taskName.length > 256) {
            message.error("任务描述长度不能超过256");
            return;
        }
        if (!this.state.newTask.ownerName) {
            message.error("请选择执行人");
            return;
        }
        if (!this.state.newTask.expiryDate) {
            message.error("请选择任务截至时间");
            return;
        }


        let params = this.state.newTask;
        Config.post('/v1/task', params, (res) => {
            if (res.code == Config.errorCode.success) {
                this.getTasks(this.state.marketParams); // 获取任务
                this.setState({
                    addMarketTask: false
                })
                this.getTasksSit();
            } else {
                message.error(res.msg);
            }
        })

    }
    //取消营销任务
    cancelMarketTask() {
        this.setState({
            addMarketTask: false
        })
    }
    //选择时间后关闭，目前仅仅在添加新任务时候生效
    changeTask(field, value) {
        this.setState({
            [field]: false
        });
    }
    //时间改变回调函数
    changeTaskInfo = (value, dateString) => {
        let StrTime = dateString ? Config.formatStrTime(dateString) : '';
        this.setState({ newTask: Object.assign(this.state.newTask, { dateString: dateString, expiryDate: StrTime }) })
        this.changeTask('visible', value);
        if (this.state.newTask.code) {
            let params = {
                code: this.state.newTask.code,
                dateString: dateString,
                expiryDate: StrTime
            }
            Config.put('/v1/task', params, (res) => {
                if (res.code == Config.errorCode.success) {
                    this.getTasksSit();
                } else {
                    message.error(res.msg);
                }
            })
        }
    }
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }
    //传递taskID，code，通过id来修改任务或者是code
    dispatchID(taskStatus, code, id, date) {
        //清空newTask
        if (date) {
            date = moment(date).format("YYYY-MM-DD")
        }
        this.setState({
            newTask: {
                code: code
            },
            addMarketTask: false,
            addInvestTask: false,
            originValue: {
                selectValue: id,
                dateValue: date
            },
            taskPerson: this.state.tmpTaskPerson
        })
    }
    dispatchValue(id, date) {
        this.setState({
            originValue: {
                selectValue: id || '',
                dateValue: date || ''
            }
        });
        const curRole = Config.localItem('CUR_ROLE');
        if (!(curRole.indexOf('ROLE_SUPER_ADMIN') > -1 || curRole.indexOf('ROLE_TOP_MANAGER') > -1 || curRole.indexOf('ROLE_MID_MANAGER') > -1)) {
            this.setState({
                taskPerson: [{ name: Config.localItem('LOGIN_USER_NAME'), userId: Config.localItem('LOGIN_USER_ID') }]
            })
        }
    }
    taskDescribe(e) {
        this.setState({ newTask: Object.assign(this.state.newTask, { taskName: e.target.value }) })
    }
    render() {
        const curRole = Config.localItem('CUR_ROLE');
        const { newTask, originValue, choseTab } = this.state;
        // curRole.indexOf('ROLE_SUPER_ADMIN') > -1 || curRole.indexOf('ROLE_TOP_MANAGER') > -1 || curRole.indexOf('ROLE_MID_MANAGER') > -1) ?
        const content = (
            <div>
                <p>将任务分配给</p>
                {
                    originValue.selectValue ?
                        <Select
                            showSearch
                            labelInValue
                            style={{ width: 200 }}
                            placeholder="选择成员"
                            optionFilterProp="children"
                            onChange={this.handleChange}
                            defaultValue={{ key: originValue.selectValue + '' }}
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
                    originValue.dateValue ?
                        <DatePicker
                            format="YYYY-MM-DD"
                            disabledDate={this.disabledExpiryDate}
                            onChange={this.changeTaskInfo}
                            defaultValue={moment(originValue.dateValue, "YYYY-MM-DD")}
                            getCalendarContainer={trigger => trigger.parentNode}
                        /> :
                        <DatePicker
                            format="YYYY-MM-DD"
                            disabledDate={this.disabledExpiryDate}
                            onChange={this.changeTaskInfo}
                            getCalendarContainer={trigger => trigger.parentNode}
                        />
                }

            </div>
        );
        const { defaultTab, taskList, recordsTotal } = this.state;
        const ownerList = [
            { name: '待完成', userId: 1 },
            { name: '已完成', userId: 2 },
            { name: '延期 ', userId: 3 },
        ];
        const addManager = {
            userId: 0,
            name: "无归属关系",
            code: 0
        };
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="task-container" id="area" ref={taskData => { this.taskData = taskData }}>
                    <SituationItem taskSituation={this.state.taskSituation} />
                    <div className="common-tab-container task-data">
                        <div className="task-tabs">
                            <Menu className="task-search-menu" defaultSelectedKeys={defaultTab} mode="horizontal" onClick={this.triggerMenu}>
                                <Menu.Item key="all">全部任务</Menu.Item>
                                <Menu.Item key="market">营销任务</Menu.Item>
                                <Menu.Item key="invest">调查任务</Menu.Item>
                                <Menu.Item key="collection">催收任务</Menu.Item>
                            </Menu>
                        </div>
                        <div className="common-tab-content">
                            <div className="common-search-section">
                                <div className="date-search-container">
                                    <div className='search-item' data-flex="dir:left">
                                        <DatePicker
                                            disabledDate={this.disabledStartDate}
                                            format="YYYY-MM-DD"
                                            placeholder="开始时间"
                                            style={{ width: 130 }}
                                            className="task-date-picker"
                                            onChange={this.onStartChange}
                                            getCalendarContainer={() => document.getElementById('area')}
                                        />
                                        <DatePicker
                                            disabledDate={this.disabledEndDate}
                                            format="YYYY-MM-DD"
                                            placeholder="结束时间"
                                            style={{ width: 130 }}
                                            className="task-date-picker"
                                            onChange={this.onEndChange}
                                            getCalendarContainer={() => document.getElementById('area')}
                                        />
                                    </div>
                                    <Select
                                        className='search-item'
                                        showSearch
                                        style={{ width: 130 }}
                                        placeholder="任务状态"
                                        optionFilterProp="children"
                                        onChange={this.searchStatus}
                                        getPopupContainer={trigger => trigger.parentNode}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            ownerList.map((item, index) => (
                                                <Option value={item.userId + ''} key={index}>{item.name}</Option>
                                            ))
                                        }
                                    </Select>
                                    {
                                        curRole != "ROLE_CUSTOMER_MANAGER" ?
                                            <Select
                                                className='search-item'
                                                showSearch
                                                style={{ width: 130 }}
                                                placeholder="指派人"
                                                optionFilterProp="children"
                                                onChange={this.searchOwner}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                <Option key={addManager.code} value={addManager.userId.toString()}>{addManager.name}</Option>
                                                {
                                                    this.state.taskPerson.map((item, index) => (
                                                        <Option value={item.userId + ''} key={index}>{item.name}</Option>
                                                    ))
                                                }
                                            </Select> : null
                                    }
                                    <Search className='search-item' placeholder="搜索" style={{ width: 130 }} onSearch={this.searchData} />
                                    <div className='search-item'>
                                        <span className={`time-item ${this.state.dateKey == 6 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 6)}>近一周</span>
                                        <span className={`time-item ${this.state.dateKey == 29 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 29)}>近一月</span>
                                        <span className={`time-item ${this.state.dateKey == 89 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 89)}>近三个月</span>
                                    </div>
                                    <ResetSearch />
                                </div>
                            </div>
                            {choseTab == 'market' ?
                                <div className="common-action-section">
                                    <Button className="common-btn" type="primary" icon="plus" onClick={() => this.addMarketTask()}>新任务</Button>
                                </div>
                                : null}
                            <Row className="task-list" type="flex" justify="space-between" align="top">
                                <Col span={24}>
                                    <ul className="task-ul">
                                        {
                                            this.state.addMarketTask ?
                                                <li className="task-item">
                                                    <Row className="row-item" type="flex" justify="space-between" align="top">
                                                        <Checkbox className="task-checkbox checkbox-disabled" disabled></Checkbox>
                                                        <Col className="task-describe-underline" span={16}>
                                                            <input className="task-describe" placeholder="任务描述" onChange={(e) => this.taskDescribe(e)} />
                                                        </Col>
                                                        <Col className="owner-col" span={8}>
                                                            <Popover placement="right" content={content} trigger="click" visible={this.state.visible} onVisibleChange={curRole ? this.handleVisibleChange : ''} onClick={() => this.dispatchValue(newTask.ownerName, newTask.dateString)} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                                                <span className="owner"><font className="owner-name">{newTask.ownerName || "未指派"}</font>{newTask.dateString || '没有截至时间'}</span>
                                                            </Popover>
                                                        </Col>
                                                    </Row>
                                                    <Row className="row-item" type="flex" align="top">
                                                        <span className="task-confirm" onClick={() => this.confirmMarketTask()}>确认</span>
                                                        <span className="task-cancel" onClick={() => this.cancelMarketTask()}>取消</span>
                                                    </Row>
                                                </li> :
                                                null
                                        }
                                        {
                                            taskList.map((item, index) => (
                                                <li key={item.taskId} className="task-item">
                                                    <Row className="row-item" type="flex" justify="space-between" align="top">
                                                        <Checkbox onClick={this.changeTaskStatus.bind(this, item.code, item.taskStatus, item.taskType)} checked={item.taskStatus == 2 ? true : false} className="task-checkbox"></Checkbox>
                                                        <Col span={18}>
                                                            <Link className="task-wrapper" className="link" to={"/tasks/details/" + item.code} data-flex="dir:left ">
                                                                {
                                                                    item.taskType == 1 ? <span className="task-status" >{'营销任务'}</span> : item.taskType == 2 ? <span className="task-status">{'调查任务'}</span> : <span className="task-status">{'催收任务'}</span>
                                                                }
                                                                {
                                                                    item.taskType == 2 ? (item.surveyStatus == 1 ? <span className="task-status" style={{ width: 70 }}>{'待调查'}</span> : item.surveyStatus == 2 ? <span className="task-status">{'正在调查'}</span> : <span className="task-status">{'调查完成'}</span>) : null
                                                                }
                                                                {
                                                                    item.taskType == 3 ? (item.collectionStatus == 1 ? <span className="task-status">{'待催收'}</span> : item.collectionStatus == 2 ? <span className="task-status">{'正在催收'}</span> : <span className="task-status">{'催收完成'}</span>) : null
                                                                }
                                                                <span className="task-name">{item.taskName}</span>
                                                                <span className="delay">{item.taskStatus == 3 ? '#延期' : ''}</span>
                                                            </Link>
                                                        </Col>
                                                        <Col span={6} className="owner-col">
                                                            {
                                                                item.taskStatus == 2 ?
                                                                    <span className="owner"><font className="owner-name">{item.ownerName || "未指派"}</font>{item.displayDay}</span>
                                                                    :
                                                                    <Popover placement="right" content={content} trigger="click" getPopupContainer={triggerNode => triggerNode.parentNode} onClick={() => this.dispatchID(item.taskStatus, item.code, item.owner, item.expiryDate)}>
                                                                        <span className="owner"><font className="owner-name">{item.ownerName || "未指派"}</font>{item.displayDay}</span>
                                                                    </Popover>
                                                            }
                                                        </Col>
                                                    </Row>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    {
                                        taskList && taskList.length > 0 ? <Pagination total={recordsTotal} showTotal={(total, range) => `共  ${total}  条`}
                                            style={{ float: 'none', display: 'table', margin: '16px auto' }} onChange={this.changTab} onShowSizeChange={this.onShowSizeChange} showSizeChanger showQuickJumper /> :
                                            <p className="nodata"><span className="anticon anticon-frown-o"></span>暂无数据</p>
                                    }
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}

export default Task;
