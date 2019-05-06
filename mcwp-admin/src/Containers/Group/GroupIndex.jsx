import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import ResetSearch from './../../Component/Common/ResetSearch';
import './style/group.less';
import { Link } from 'react-router';
import { Table, Input, Button, Spin, message, Modal } from 'antd';
import GroupService from '../../Services/GroupService'; // services层
const Search = Input.Search;

/* 以类的方式创建一个组件 */
class GroupIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            groupInfo: [],
            pagination: {
                showSizeChanger: true, // 是否可以改变 pageSize
                showQuickJumper: true, // 是否可以快速跳转至某页
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`,
                pageSizeOptions: ['5', '10', '15'] // 指定每页可以显示多少条
            },
            params: {
                page: 1,
                rows: 10
            },
            CurRole: Config.localItem('CUR_ROLE')
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentDidMount() {
        let params = this.state.params;
        this.getGroupInfo(params);
    }
    // 加载小组列表信息
    async getGroupInfo(params) {
        this.setState({ loading: true });
        const res = await GroupService.getGroupInfo(params);
        this.setState({ loading: false });
        const pagination = { ...this.state.pagination };
        pagination.total = res.recordsTotal; // 总页数
        pagination.current = params.page; // 当前页数
        this.setState({
            groupInfo: res.data,
            pagination
        });
    }
    // 删除小组调接口
    async delGroupEnter(code) {
        let { params } = this.state;
        // 请求参数
        let delParams = {
            teamCode: code
        };
        const res = await GroupService.delGroup(delParams);
        if (res.code == Config.errorCode.success) {
            message.success('删除成功！');
            this.getGroupInfo(params)
        } else if (res.code == Config.errorCode.cannotDelTeam) {
            Modal.warning({
                title: '删除小组',
                content: res.msg,
                okText: '确定'
            });
        } else {
            message.error(res.msg);
        }
    }
    // 删除小组
    async delGroup(code) {
        const that = this;
        const confirm = Modal.confirm;
        confirm({
            title: '删除小组',
            content: '确认要删除该小组信息吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                that.delGroupEnter(code)
            }
        });
    }
    // 搜索小组信息
    searchData = (value) => {
        let keyWord = value;
        let params = this.state.params;
        if (Config.isNull(keyWord)) {
            delete params.keyWord;
        } else {
            params.keyWord = keyWord;
        }
        params.page = 1; // 查询数据重置页码
        this.setState({
            params: params
        });
        this.getGroupInfo(params);
    }
    changeTable = (pagination) => { // 分页、排序、筛选变化时触发
        let params = this.state.params;
        params.page = pagination.current;
        params.rows = pagination.pageSize;
        this.getGroupInfo(params);
    }
    render() {
        const columns = [{
            title: '小组名称',
            dataIndex: 'teamName',
            key: 'teamName'
        }, {
            title: '小组主管',
            dataIndex: 'zgName',
            key: 'zgName'
        }, {
            title: '小组成员',
            dataIndex: 'cyName',
            key: 'cyName'
        }, {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (text, record) => (
                <span>
                    {Config.formatDateTime(text)}
                </span>
            )
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <div>
                    {
                        record.canOperate ?
                            <span>
                                <Link to={"/addgroup?code=" + record.code}>编辑</Link>
                                <span style={{ 'color': '#f00', cursor: 'pointer', marginLeft: '10px' }} onClick={this.delGroup.bind(this, record.code)}>删除</span>
                            </span> : null
                    }
                </div>
            )
        }];
        const { CurRole, groupInfo } = this.state
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="common-console-container user-container">
                    <div className="common-search-section">
                        <div className="date-search-container">
                            <Search className="search-item" placeholder="小组名称/主管姓名/组员姓名" style={{ width: 200 }} onSearch={this.searchData} />
                            <div className="search-item">
                                <ResetSearch />
                            </div>
                        </div>
                    </div>
                    <div className="common-action-section">
                        {
                            /ROLE_SUPER_ADMIN|ROLE_TOP_MANAGER|ROLE_RISK_MANAGER|ROLE_MID_MANAGER/.test(CurRole) ?
                            <Link to="/addgroup"><Button className="common-btn" icon="plus" type="primary">新小组</Button></Link>
                            :null
                        }
                    </div>
                    <Table
                        rowKey={record => record.code}
                        pagination={this.state.pagination}
                        columns={columns}
                        dataSource={groupInfo}
                        onChange={this.changeTable}
                        className="common-content-container"
                    />
                </div>
            </Spin>
        );
    }
}
export default GroupIndex;

