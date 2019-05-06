import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import ResetSearch from './../../Component/Common/ResetSearch';
import './style/message.less';
import { Link } from 'react-router';
import { Table, Input, Button, Spin, Form, message, Modal, Select } from 'antd';
import MessageService from '../../Services/MessageService'; // services层
const Search = Input.Search;

/* 以类的方式创建一个组件 */
class GroupIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            messageInfo: [],
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
        };
    }
    componentDidMount() {
        let params = this.state.params;
        this.getMessageInfo(params);
    }
    // 加载短信列表信息
    async getMessageInfo(params) {
        this.setState({ loading: true });
        const res = await MessageService.getMessageInfo(params);
        this.setState({ loading: false });
        if (res.code == Config.errorCode.success) {
            const pagination = { ...this.state.pagination };
            pagination.total = res.recordsTotal; // 总页数
            pagination.current = params.page; // 当前页数
            this.setState({
                messageInfo: res.data,
                pagination
            });
        } else {
            message.error(res.msg);
        }
    }

    // 搜索短信信息
    searchData = (value) => {
        let keyWord = value;
        let {params} = this.state;
        if (Config.isNull(keyWord)) {
            delete params.word;
        } else {
            params.word = keyWord;
        }
        params.page = 1; // 查询数据重置页码
        this.setState({
            params: params,
        });
        this.getMessageInfo(params);
    }
    // 导出
    exportList(e,code) {
        e.target.href = Config.target + '/comm/export/phones/?groupSmsCode=' + code
    }
    changeTable = (pagination) => { // 分页、排序、筛选变化时触发		
        let params = this.state.params;
        params.page = pagination.current;
        params.rows = pagination.pageSize;
        this.getMessageInfo(params);
    }
    render() {
        const columns = [{
            title: '发送内容',
            dataIndex: 'sendContent',
            key: 'sendContent',
            width: 300,
            render: (text, record) => (
                <span>
                    {text?text:'——'}
                </span>
            )
        }, {
            title: '接收号码数',
            dataIndex: 'receivedNumber',
            key: 'receivedNumber',
            render: (text, record) => (
                <span>
                    {text?text:'——'}
                </span>
            )
        }, {
            title: '发送状态',
            dataIndex: 'remark',
            key: 'remark',
            render: (text, record) => (
                <span>
                    {text?text:'——'}
                </span>
            )
        }, {
            title: '发送时间',
            dataIndex: 'sendTime',
            key: 'sendTime',
            render: (text, record) => (
                <span>
                    {text?Config.formatDateTime(text):'——'}
                </span>
            )
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <span style={{ 'color': '#1c7bef', cursor: 'pointer' }} ><Link onClick={(e)=>this.exportList(e, record.code)}>导出</Link></span>
                </span>

            )
        }];

        let messageInfo = this.state.messageInfo;  // 短信信息数据 
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="common-console-container user-container">
                    <div className="common-search-section">
                        <div className="date-search-container">
                            <Search className="search-item" placeholder="发送内容" style={{ width: 200 }} onSearch={this.searchData} />
                            <ResetSearch />
                        </div>
                    </div>
                    <div className="common-action-section">
                        <Link to="/market/sendmessage"><Button className="common-btn" type="primary">群发短信</Button></Link>
                    </div>
                    <Table
                        rowKey={record => record.code}
                        pagination={this.state.pagination}
                        columns={columns}
                        dataSource={messageInfo}
                        onChange={this.changeTable}
                        className="common-content-container"
                    />
                </div>
            </Spin>
        );
    }
}

const Main = Form.create()(GroupIndex);

export default Main;

