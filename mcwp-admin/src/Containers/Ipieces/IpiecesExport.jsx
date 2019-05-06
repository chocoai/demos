import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Link } from 'react-router';
import './style/ipiecesExport.less';
import { message, Breadcrumb, Spin, Table, Button  } from 'antd';

/* 以类的方式创建一个组件 */
class IpiecesExport extends Component {
    constructor(props) {
    	super(props);
        this.state = {
            loading: false,
            exportInfo: '',
            exportList: '',
            downloadList:[],
            selectedRowKeys: []
        }
    }
    componentWillMount() {
        this.getExportInfo();
    }
    getExportInfo () {    // 获取导出列表
        Config.get('/v1/sys/export/list', {}, (res) => {
            if(res.code == Config.errorCode.success) {
                this.setState({
                    exportInfo: res.data,
                });
                let exportList = res.data;
                if (exportList && exportList.length != 0) {
                    exportList.map((item,index) => {
                        if(item.taskStatus == 2) {
                            item.key = index;
                            item.download = item.code;
                            item.createDate = Config.formatDateTime(item.createDate);
                        }
                        if(item.taskStatus == 3) {
                            item.taskName = item.taskName + '-导出失败'
                            item.key = index;
                            item.download = false;
                            item.createDate = Config.formatDateTime(item.createDate);
                        }
                    })
                }
                this.setState({
                    exportList : exportList
                })
            } else {
                message.error(res.msg);
            }
        });
    }

    getExportDownload (e, code) {    // 获取导出列表
        // window.open(Config.target + '/comm/export/down?code=' + code)
        e.target.href = Config.target + '/comm/export/down?code=' + code
    }
    downloadExport(e, code){
        this.getExportDownload(e, code);
    }
    downloadBatchExport = () => {
        let downloadList = this.state.downloadList;
        if ( downloadList ) {
            downloadList.map((item,index) => (
                window.open(Config.target + '/comm/export/down?code=' + item.code)
            ))
        }
    }
    changePage = (pagination) => {
        this.setState({
            selectedRowKeys: [],
        });
    }

	render() {
        const { exportList, selectedRowKeys } = this.state;
        const columns = [{
            title: '文件名称',
            dataIndex: 'taskName',
            }, {
            title: '大小',
            dataIndex: 'exportFileSize',
            render: text => <span>{text? text + 'KB' : '0KB'}</span>
            }, {
            title: '导出时间',
            dataIndex: 'createDate',
            }, {
            title: '操作',
            dataIndex: 'download',
            render: code =>
            (
                code?
                <Link className='download-btn' onClick={(e)=>this.downloadExport(e, code)}>下载</Link>
                :
                <span className='download-false'>下载</span>
            )
        }];
        const data = exportList || [];
        const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                downloadList: selectedRows,
                selectedRowKeys
            })
        }
        };

		return (
		<Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
			<div className="ipieces-export-container">
                <Breadcrumb className='breadcrumb'>
                    <Breadcrumb.Item className='breadcrumb-item'><Link to="/ipieces/operate">进件管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item className='breadcrumb-item'>下载导出文件</Breadcrumb.Item>
                </Breadcrumb>
                <div className="ipieces-export-content">
                    <Button className='common-btn' type="primary" onClick={this.downloadBatchExport}>批量下载</Button>
                    <Table
                        onChange = {this.changePage}
                        rowSelection={rowSelection}
                        columns={columns}
                        className="common-content-container"
                        dataSource={data} />
                </div>
		    </div>
        </Spin>
		);
	}
}

export default IpiecesExport;

