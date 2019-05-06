import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import ResetSearch from './ResetSearch';
import './style/dateSearch.less';

import { DatePicker, TreeSelect } from 'antd';

class DateSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staffValue: null,
            staffIds: [],
            staffNames: [],
            startTime: null,
            endTime: null,
            userId: null,
            selectNum: '',
            treeSelectItem: {
                placeholder: '员工'
            },
            showDatePicker: props.showDatePicker == undefined ? true : props.showDatePicker
        }
    }
    componentDidMount() {
        const { selectNum } = this.props;
        if(selectNum) {
            this.setState({
                selectNum: selectNum,
            });
        }
    }
    disabledStartDate = (startTime) => {
        const endTime = this.state.endTime;
        if (!startTime || !endTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }
    disabledEndDate = (endTime) => {
        const startTime = this.state.startTime;
        if (!endTime || !startTime) {
            return false;
        }
        return endTime.valueOf() <= startTime.valueOf();
    }
    onStartChange = (value) => { // 开始时间发生改变
        this.onChange('startTime', value);
    }
    onEndChange = (value) => { // 结束时间发生改变
        this.onChange('endTime', value);
    }
    onChange = (field, value) => {
        const that = this;
        const { searchData } = that.props; // 搜索数据
        const { startTime, endTime, userId, staffIds } = that.state;
        let params = {};
        params.startTime = startTime ? startTime.format('YYYY-MM-DD') : startTime;
        params.endTime = endTime ? endTime.format('YYYY-MM-DD') : endTime;
        params[field] = value ? value.format('YYYY-MM-DD') : value;
        if (userId) params.userId = userId;
        if (staffIds && staffIds.length > 0) params.staffIds = staffIds;
        searchData(params);
        this.setState({
            selectNum: '',
            [field]: value,
        });
    }
    changeTimePeriod (num) { // 按近一周、进一个月、近一年
        const that = this;
        const { searchData } = that.props;
        const { userId, staffIds } = that.state;
        let params = {'period': num}
        if (userId) params.userId = userId;
        if (staffIds && staffIds.length > 0) params.staffIds = staffIds;
        searchData(params);
        that.setState({
            startTime: null,
            endTime: null,
            selectNum: num
        })
    }
    changeTreeSelect = (value, label, extra) => { // 树型选择控件数据改变时
        const that = this;
        if (!value || (value && value.length == 0)) {
            that.setState({
                staffIds: [],
                staffNames: [],
                userId: null
            });
            that.searchByStaff({});
        } else {
            let params = {};
            let { staffNames, staffIds } = that.state;
            if (extra.clear) {
                let clearIndex = Config.indexofArr(staffNames, extra.triggerValue);
                staffNames.splice(clearIndex, 1);
                staffIds.splice(clearIndex, 1);
                params.staffIds = staffIds;
                that.setState({
                    staffIds: staffIds,
                    staffNames: staffNames
                });
                that.searchByStaff(params);
            }
        }
        that.setState({
            staffValue: value
        });
    }
    searchByStaff (params) { // 按员工进行搜索
        const that = this;
        const { searchData } = that.props;
        const { startTime, endTime, selectNum } = that.state;
        if (startTime) params.startTime = startTime.format('YYYY-MM-DD');
        if (endTime) params.endTime = endTime.format('YYYY-MM-DD');
        if (selectNum) params.period = selectNum;
        searchData(params);
    }
    selectTreeSelect = (value, node, extra) => { // 树型选择控件被选中时
        const that = this;
        let { isMultiple } = that.props;
        let params = {};
        let selectedNodes = extra.selectedNodes;
        let staffIds = [];
        let staffNames = [];
        if (!isMultiple) {
            params.userId = selectedNodes[0].key;
            that.searchByStaff(params);
            that.setState({
                userId: selectedNodes[0].key,
                staffIds: null,
                staffNames: null
            });
        } else {
            selectedNodes.map((selectedNode, index) => {
                staffIds.push(selectedNode.key);
                staffNames.push(selectedNode.props.value);
            });
            params.staffIds = staffIds;
            that.searchByStaff(params);
            that.setState({
                userId: null,
                staffIds: staffIds,
                staffNames: staffNames
            });
        }
    }
    render() {
        const that = this;
        const curRole = Config.localItem('CUR_ROLE');  // 当前用户角色
        const { startTime, endTime, selectNum, treeSelectItem } = that.state;
        let { staffs, isMultiple, showInput } = that.props;
        let treeData = [];
        if (staffs && staffs.length > 0) {
            staffs.map((staff, index) => {
                let tree = {
                    key: staff.userId,
                    value: staff.name + Config.repeatStr('§', index),
                    label: staff.name
                };
                treeData.push(tree);
            })
        }
        return (
            <div className='date-search-container'>
                {
                    this.props.showDatePicker ?
                    <div className='search-item' data-flex="dir:left">
                        <DatePicker
                            placeholder="开始时间"
                            value={startTime}
                            onChange={this.onStartChange}
                            format='YYYY-MM-DD'
                            disabledDate={this.disabledStartDate}
                            getCalendarContainer={trigger => trigger.parentNode}
                        />
                        <DatePicker
                            placeholder="结束时间"
                            value={endTime}
                            onChange={this.onEndChange}
                            format='YYYY-MM-DD'
                            disabledDate={this.disabledEndDate}
                            getCalendarContainer={trigger => trigger.parentNode}
                        />
                    </div>: null
                }

                { isMultiple && showInput && !Config.isRoleCustomer(curRole) && !Config.isRoleCr(curRole) ?
                <TreeSelect
                    showSearch
                    style={{ width: 200 }}
                    size={'large'}
                    treeData={treeData}
                    dropdownStyle={{ width: '200px', maxHeight: 400, overflow: 'auto' }}
                    multiple
                    treeDefaultExpandAll
                    getPopupContainer={trigger => trigger.parentNode}
                    onChange={that.changeTreeSelect}
                    onSelect={that.selectTreeSelect}
                    className="search-task-account-manager"
                    {...treeSelectItem}
                  ></TreeSelect> : showInput && treeData && treeData.length > 0 && !Config.isRoleCustomer(curRole) && !Config.isRoleCr(curRole) ?
                  <TreeSelect
                        showSearch
                        style={{ width: 200 }}
                        size={'large'}
                        treeData={treeData}
                        dropdownStyle={{ width: '200px', maxHeight: 400, overflow: 'auto' }}
                        searchPlaceholder="支持关键字匹配"
                        treeDefaultExpandAll
                        getPopupContainer={trigger => trigger.parentNode}
                        onChange={that.changeTreeSelect}
                        onSelect={that.selectTreeSelect}
                        className="search-item"
                        {...treeSelectItem}
                    >
                </TreeSelect> : null }
                <div className="search-item" data-flex="dir:left">
                    <span className={`time-item ${selectNum == 1 ? 'time-selected' : ''}`} onClick={() => that.changeTimePeriod(1)}>近一周</span>
                    <span className={`time-item ${selectNum == 2 ? 'time-selected' : ''}`} onClick={() => that.changeTimePeriod(2)}>近一月</span>
                    <span className={`time-item ${selectNum == 3 ? 'time-selected' : ''}`} onClick={() => that.changeTimePeriod(3)}>近一年</span>
                </div>
                <ResetSearch />
            </div>
        )
    }
}

const pureDateSearch = pureRender(DateSearch);

export default pureDateSearch;
