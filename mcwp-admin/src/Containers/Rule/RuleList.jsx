import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Spin, message, Table} from 'antd';
import RuleService from '../../Services/RuleService';//调用数据

import {Link } from 'react-router';

class RuleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            ruleList: [],
            pagination: {
                showSizeChanger: true, // 是否可以改变 pageSize
                showQuickJumper: true, // 是否可以快速跳转至某页
                pageSizeOptions: ['5', '10', '15'], // 指定每页可以显示多少条
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`
            },

            params: {
                page: 1,
                rows: 10
            },
        };
    }
    componentDidMount() {
        let that = this;
        let params = that.state.params;
        // 获取产品列表
        that.getproList(params)
    }
    // 获取产品列表
    getproList(params) {
        this.setState({loading:true})
        RuleService.getPictureConfigures(params, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({loading:false})
                const data = res.data;
                const { pagination } = this.state;
                pagination.total = res.recordsTotal; // 总页数
                pagination.current = params.page; // 当前页数
                this.setState({
                    ruleList: data,
                    pagination
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    // 页数变化时
    changeTable = (pagination) => {
        let params = this.state.params;
        params.page = pagination.current;
        params.rows = pagination.pageSize;
        this.getproList(params)
    }
    render() {
        const that = this;
        const { ruleList,pagination} = that.state;
        const columnsInteDedu = [{
            title: '产品名称',
            dataIndex: 'prdName',
            key: 'prdName',
            width: 100,
        }, {
            title: '操作',
            key: 'status',
            width: 100,
            render: (text, record) => (
                <span>
                    <Link className="J_no_detail customer-handle" to={"rule/logic?code=" + record.code+"&type="+record.prdType}>配置</Link>
                </span>
            )
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="common-console-container marketShare-container" id="area" style={{padding:'30px'}}>
                    <Table
                        rowKey={record => record.code}
                        columns={columnsInteDedu}
                        dataSource={ruleList}
                        pagination={pagination}
                        onChange={this.changeTable}
                        className="photo-tab"
                    />
                </div>
            </Spin>
        );
    }
}

export default RuleList;
