import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import './style/detailLoanInfo.less';
import { Config } from '../../Config/Index';
import { Table, Tabs } from 'antd';
const TabPane = Tabs.TabPane;

/**
 * 进件详情查看老客户
 * @Author: 钟观发
 * @Date:   2017-10-24
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-10-24
 */
class DetailLoanInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            loading: true,
        }
    }
    render() {
        const { customerLoanList, customerBorrowList} = this.props;
        const columns = [{
			title: '申请时间',
			dataIndex: 'reqDate',
			key: 'reqDate',
			render: (text, record) => (
    			<span>
     				{Config.formatDateTime(text)}
    			</span>
  			)
		}, {
			title: '产品名称',
			dataIndex: 'prodName',
			key: 'prodName'
		}, {
			title: '产品类型',
			dataIndex: 'prdTypeText',
			key: 'prdTypeText'
		}, {
			title: '审批状态',
			dataIndex: 'auditStatus',
			key: 'auditStatus'
		}];
        const columnsLoan = [{
			title: '申请时间',
			dataIndex: 'createDate',
            key: 'createDate',
            width:300,
			render: (text, record) => (
    			<span>
     				{Config.formatDateTime(text)}
    			</span>
  			)
		}, {
			title: '借款金额(元)',
			dataIndex: 'borrowMoney',
            key: 'borrowMoney',
            width:100,
		}, {
			title: '借款状态',
			dataIndex: 'loanStatusText',
            key: 'loanStatusText',
            width:200,
		}];
        return (
            <div className="detail-loanInfo-container">
                <Tabs className='customer-detail-tabs' defaultActiveKey="1">
                    <TabPane tab="申请记录" key="1">
                        <Table 
                            rowKey={record => record.code} 
                            columns={columns}  
                            dataSource={customerLoanList} 
                        />
                    </TabPane>
                    <TabPane tab="借款记录" key="2">
                        <Table 
                            rowKey={record => record.code} 
                            columns={columnsLoan}  
                            dataSource={customerBorrowList} 
                        />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

const pureDetailLoanInfo = pureRender(DetailLoanInfo);

export default pureDetailLoanInfo;