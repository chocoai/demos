import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Link } from 'react-router';
import { Config } from '../../Config/Index';
import { Spin , Table , message } from 'antd';
import './style/version.less';

/**
 * 版本管理
 * @Author: 赵俊
 * @Date:   2017-09-20
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-09-20
 */
class RuleIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			versionInfo: [],
			pagination: {
				showSizeChanger: true, // 是否可以改变 pageSize
				showQuickJumper: true, // 是否可以快速跳转至某页
                pageSizeOptions: ['5', '10','15'], // 指定每页可以显示多少条
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`
			},
			params: {
				device:'web',
				page: 1,
				rows: 10
            },

		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
	}
	componentWillMount() {
		let that = this;
		let params = that.state.params;
		that.getVersionList(params);
	}
	getVersionList = (params) => {//获取版本列表
        this.setState({ loading: true });
        Config.get('/comm/versions', params, (res) => {
            this.setState({ loading: false });
            if(res.code == Config.errorCode.success) {
                let pagination = { ...this.state.pagination };
                pagination.total = res.recordsTotal; // 总页数
                pagination.current = params.page; // 当前页数
                this.setState({
                    versionInfo: res.data,
                    pagination
				});
            } else {
                message.error(res.msg)
            }
        })
    }
	 // 页码改变 或者 页面表格条数改变
	 changeTable = (pagination) => {
        let params = this.state.params;
        params.page = pagination.current;
		params.rows = pagination.pageSize;
        this.getVersionList(params);
    }
	render() {
		const {loading} = this.state;
		const columns = [{
			title: '版本名称',
			dataIndex: 'version',
			key: 'version',
			width: 200,
		}, {
            title: '更新时间',
            dataIndex: 'releaseDate',
         	key: 'releaseDate',
         	width: 150,
          	render: (text, record) => (
              <span>
                   {Config.formatDateTime(text)}
              </span>
            )
        }, {
          title: '操作',
        key: 'action',
        width: 100,
          render: (text, record) => (
            <Link to={"/version/detail/"+ record.code} activeClassName="active" >
            查看
            </Link>
          )
    }];
		return(
		<Spin tip={Config.warnInfo.spinText} spinning={loading}>
			<div className="version-container">
				<p className="Version-title">版本更新内容</p>
			<Table
                    rowKey={record => record.code}
		        	pagination={this.state.pagination}
		        	columns={columns}
		        	dataSource={this.state.versionInfo}
                    onChange={this.changeTable}
		        />
		    </div>
		</Spin>
		);
	}
}
export default RuleIndex;
