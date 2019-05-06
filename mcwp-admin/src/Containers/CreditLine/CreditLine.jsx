import React, { Component } from 'react'; // 引入了React
import { connect } from 'react-redux';
import { getSysDict } from '../../Redux/Action/Index';
import { bindActionCreators } from 'redux';
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import ResetSearch from './../../Component/Common/ResetSearch';
import moment from 'moment';

import './style/creditLine.less';

import { Select, Row, Col, Table, Input, Button, Spin, message, Modal,DatePicker} from 'antd';
const Search = Input.Search;
const Option = Select.Option;

/**
 * 授信额度
 * @Author: 赵俊
 * @Date:   2017-08-07
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-08-07
 */

//bug 未获取数据前 分页功能会跳动 2017/08/07
class CreditLine extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
			visible: false,
			confirmVisible:false,
			loading: false,
			userInfo: [],
			dateKey:0,
			startValue:null,
			endValue:null,
			modifyValue:{},
			mainModalKey: 0,
    		pagination: {
				showSizeChanger: true, // 是否可以改变 pageSize
				showQuickJumper: true, // 是否可以快速跳转至某页
				total: 0,//总页数
                showTotal: (total, range) => `共  ${total}  条`,
				pageSizeOptions: ['5', '10','15'] // 指定每页可以显示多少条
			},
			params: {
				page: 1,
				rows: 10
			}
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    componentWillMount() {
		const {  actions } = this.props;
        let params = this.state.params;
		this.getCreditList(params);  // 获取借款列表
		actions.getSysDict({code: 'hkqs'});
    }
	// 获取授信额度列表
    getCreditList = (params) => {
        this.setState({ loading: true });
        Config.get('/v1/customer/credits', params, (res) => {
            this.setState({ loading: false });
            if(res.code == Config.errorCode.success) {
                const pagination = { ...this.state.pagination };
                pagination.total = res.recordsTotal; // 总页数
                pagination.current = params.page; // 当前页数
                this.setState({
                    userInfo: res.data,
                    pagination
                });

            } else {
                message.error(res.msg)
            }
        })
    }
	// 点击编辑授信额度时，弹出模态框
	editCredit = (record) => {
		let modifyValue = this.state.modifyValue;
		modifyValue.code = record.code;
		modifyValue.name = record.name;
		modifyValue.oldDailyRate = record.dailyRate;
		modifyValue.oldCreditAmount = record.creditAmount;
		modifyValue.oldRepaymentPeriod= record.repaymentPeriod;
		modifyValue.oldRepaymentPeriodName= record.repaymentPeriodName;
		this.setState({
			visible: true,
			modifyValue
		 });
	}
	// 分页、排序、筛选变化时触发
	changeTable = (pagination) => {
		let params = this.state.params;
		params.page = pagination.current;
		params.rows = pagination.pageSize;
		this.getCreditList(params);
	}
	// 本周 本月 近三个月
    searchDateKey = (dateKey) => {
        let params = this.state.params;
        params.startTime = moment().subtract(dateKey, 'days').format('YYYY-MM-DD');
        params.endTime = moment().format('YYYY-MM-DD');
        this.setState({
            dateKey: dateKey
        })
        params.page = 1;
       this.getCreditList(params);
	 }
	// 根据时间来搜索借款 重置页码
    onStartTimeChange = (value) => {
        this.onChange('startValue',value)

        let params = this.state.params;
        if(value) {
            params.startTime = value.format('YYYY-MM-DD');
        } else {
            delete params.startTime;
        }
        params.page = 1;
       this.getCreditList(params);


    }
    onEndTimeChange = (value) => {
        this.onChange('endValue',value)

        let params = this.state.params;
        if(value) {
            params.endTime = value.format('YYYY-MM-DD');
        } else {
            delete params.endTime;
        }
        params.page = 1;
        this.getCreditList(params);
    }
    // 禁用开始时间
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    //  禁用结束时间
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
          return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    // 根据开始和禁用时间来设置this.state.startValue  OR  endValue
    onChange = (field, value) => {
        this.setState({
          [field]: value,
        });
	}
	// 根据客户姓名搜索借款(模糊搜索) 重置页码
	searchData = (value) => {
        let word = value;
        let params = this.state.params;
        if(Config.isNull(word)){
            delete params.word;
        } else {
            params.word = word;
        }
        params.page = 1;
        this.getCreditList(params);

	}


	// 模态框出现后，点击确认后，对授信金额进行编辑 并且将编辑金额存入this.state.modifyValue
	handleOk = () => {
		let { modifyValue } = this.state;
		let recreditAmount = /^\d+(?:\.\d{1,2})?$/;
        let numberMatch = /^0.\d{1,4}$/;
		if(!modifyValue.creditAmount && !modifyValue.dailyRate && !modifyValue.term){
			this.setState({
				visible: false
             });
		}else{
			if(modifyValue.creditAmount ? !recreditAmount.test(modifyValue.creditAmount) : false){
				message.error('授信金额只能输入数字和小数点，最多小数点后面两位');
				return
			}else if(modifyValue.dailyRate ? !numberMatch.test(modifyValue.dailyRate) : false){
				message.error('借款日利率只能0至0.9999且最多保留四位小数');
				return
			}else{
				this.setState({
					visible: false,
					mainModalKey:this.state.mainModalKey+1,
					confirmVisible:true
				});

				modifyValue.repaymentPeriod = modifyValue.repaymentPeriod ? modifyValue.repaymentPeriod : modifyValue.oldRepaymentPeriod ;
				modifyValue.term = modifyValue.term ? modifyValue.term  : modifyValue.oldRepaymentPeriodName ;
				modifyValue.creditAmount = modifyValue.creditAmount ? modifyValue.creditAmount : modifyValue.oldCreditAmount ;
				modifyValue.dailyRate = modifyValue.dailyRate ? modifyValue.dailyRate : modifyValue.oldDailyRate ;
            }
		}
	}

	changeDailyRate = (e) => {
		let value = e.target.value;
		let modifyValue = this.state.modifyValue;
		modifyValue.dailyRate = value
		this.setState({ modifyValue });
	}
	changeCreditAmount = (e) => {
		let value = e.target.value;
		let modifyValue = this.state.modifyValue;
		modifyValue.creditAmount = value;
		this.setState({ modifyValue });
	}
	changeTerm = (value) => {
        const {  sysDictItems } = this.props;
        let modifyValue = this.state.modifyValue;
        modifyValue.term = sysDictItems.hkqs.filter(i => i.ddValue == value)[0]['ddText']
		modifyValue.repaymentPeriod = value;
		this.setState({ modifyValue },()=>{
		});
    }

	// 模态框出现后，点击取消后，取消对授信金额的编辑 并且清空modifyValue
	handleCancel = () => {
		this.setState({
			visible: false ,
			mainModalKey:this.state.mainModalKey+1,
			modifyValue:{}
		});
	}
	// 模态框出现后，确认修改授信额度 日利率 最长还款期限
	handleOkay = () => {
		let {params,modifyValue} = this.state;
		let pagerows = this.state.params;
		params.page = 1;
		params.code = modifyValue.code;
		params.repaymentPeriod = parseFloat(modifyValue.repaymentPeriod);
		params.creditAmount = parseFloat(modifyValue.creditAmount);
		params.dailyRate = parseFloat(modifyValue.dailyRate);
		Config.put('/v1/customer/credit', params, (res) => {
			if(res.code == Config.errorCode.success) {
                message.success('修改成功');
                this.setState({
					confirmVisible:false,
					modifyValue:{}
                });
                // 点击操作后 重新请求后台数据 渲染页面
                this.getCreditList(pagerows);
            } else {
                message.error(res.msg);
            }
		})
	}
	// 确认模态框出现后 取消操作
	handleCallof = () => {
		this.setState({
			confirmVisible: false ,
			modifyValue:{}
		});
	}

	render() {
		let modifyValue = this.state.modifyValue;
		const {  sysDictItems } = this.props;
		const columns = [{
			title: '客户姓名',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '身份证号',
			dataIndex: 'idCardNo',
			key: 'idCardNo'
		}, {
			title: '联系方式',
			dataIndex: 'telephone',
			key: 'telephone'
		},  {
			title: '授信额度(元)',
			dataIndex: 'creditAmount',
			key: 'creditAmount'
		}, {
			title: '借款日利率(%)',
		  	dataIndex: 'dailyRate',
		  	key: 'dailyRate'
		}, {
			title: '最长还款期数(期)',
		  	dataIndex: 'repaymentPeriodName',
		  	key: 'repaymentPeriodName'
		},{
		  	title: '授信时间',
		  	dataIndex: 'creditDate',
			key: 'creditDate',
			render: (text, record) => (
    			<span>
					{text?Config.formatDateTime(text) :''}

    			</span>
  			)
		}, {
			title: '操作',
			dataIndex: 'operate',
			key: 'operate',
			render: (text, record) => (
    			<span>
			    	<span style={{'color': '#108ee9', cursor: 'pointer'}} onClick={this.editCredit.bind(this,record)}>修改</span>

				</span>
  			)
		}];

		return (
		<Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
			<div className="common-console-container creditLine-container">
                <div className="common-search-section">
                    <div className="date-search-container">
                        <div className='search-item' data-flex="dir:left">
                            <DatePicker
                                ref='startTime'
                                placeholder="开始时间"
                                onChange={this.onStartTimeChange}
                                format='YYYY-MM-DD'
                                disabledDate={this.disabledStartDate}
                                getCalendarContainer={trigger => trigger.parentNode}
                            />
                            <DatePicker
                                placeholder="结束时间"
                                onChange={this.onEndTimeChange}
                                format='YYYY-MM-DD'
                                disabledDate={this.disabledEndDate}
                                getCalendarContainer={trigger => trigger.parentNode}
                            />
                        </div>
                        <Search placeholder="客户姓名" onSearch={this.searchData} className='search-item' ref='searchData' style={{ width: 200 }} />
                        <div className="search-item">
                            <span className={`time-item ${this.state.dateKey == 6 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 6)}>近一周</span>
                            <span className={`time-item ${this.state.dateKey == 29 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 29)}>近一月</span>
                            <span className={`time-item ${this.state.dateKey == 89 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 89)}>近三个月</span>
                        </div>
                        <ResetSearch />
                    </div>
		        </div>
		        <Table
		        	pagination={this.state.pagination}
		        	columns={columns}
		        	dataSource={this.state.userInfo}
					rowKey={record => record.code}
                    onChange={this.changeTable}
                    className="common-content-container"
		        />
				{/* 修改  模态框  */}
				<Modal
					className='creditLine-modal'
					visible={this.state.visible}
					title="修改"
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					key={this.state.mainModalKey}
					footer={[
						<Button key="submit" type="primary" size="large" style={{marginRight: 8}} onClick={this.handleOk}>确定</Button>,
						<Button key="back" size="large"  onClick={this.handleCancel}>取消</Button>

					]}
					>
					<Row className='input-credit-line'>
				    	<Col  className="">
				    		<span className="modify-title">授信金额</span>
							<Input defaultValue={modifyValue.oldCreditAmount} placeholder='请输入'  size="large" onChange={this.changeCreditAmount} style={{width: 200}} />
							<span className="modify-unit">  元</span>
				    	</Col>
					</Row>
					<Row className='input-credit-line'>
				    	<Col  className="">
				    		<span className="modify-title">借款日利率</span>
							<Input defaultValue={modifyValue.oldDailyRate} placeholder='请输入'  size="large"  onChange={this.changeDailyRate} style={{width: 200}} />
							<span className="modify-unit">%</span>
				    	</Col>
					</Row>
					<Row className='input-credit-line'>
				    	<Col >
				    		<span className="modify-title">最长还款期数</span>
							<Select
								defaultValue={modifyValue.oldRepaymentPeriod}
								showSearch
								placeholder="请选择最长借款期数"
								style={{ width: 200 }}
								optionFilterProp="children"
								//getPopupContainer={trigger => trigger.parentNode} 解决选项随滚轮滚动问题
								filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								onChange={this.changeTerm}
							>
								 {
									sysDictItems.hkqs && sysDictItems.hkqs.length > 0 && sysDictItems.hkqs.map((item, index)=>(
										<Option key={index} value={item.ddValue}>{item.ddText}</Option>
									))
                                }

							</Select>
							<span className="modify-unit">  期</span>
				    	</Col>
					</Row>
				</Modal>
				{/* 确认要修改吗  模态框  */}
                <Modal
					visible={this.state.confirmVisible}
					onOk={this.handleOkay}
					onCancel={this.handleCallof}
					className='confirm-modify-modal'
					footer={[
						<Button key="submit" type="primary" size="large" style={{marginRight: 8}} onClick={this.handleOkay}>确定</Button>,
						<Button key="back" size="large"  onClick={this.handleCallof}>取消</Button>
					]}
					>
					<p className='modify-content modify-content-head'>您将客户{modifyValue.name}的</p>
					{ modifyValue.oldCreditAmount == modifyValue.creditAmount ? null : <p className='modify-content modify-content-inside'>授信金额：{modifyValue.oldCreditAmount}元 修改为 <span className='modify-content-weight'>{modifyValue.creditAmount}元</span></p>}
					{ modifyValue.oldDailyRate == modifyValue.dailyRate ? null : <p className='modify-content modify-content-inside'>借款日利率：{modifyValue.oldDailyRate}% 修改为 <span className='modify-content-weight'>{modifyValue.dailyRate}%</span></p>}
					{ modifyValue.oldRepaymentPeriodName == modifyValue.term ? null : <p className='modify-content modify-content-inside'>最长还款期数：{modifyValue.oldRepaymentPeriodName}期 修改为 <span className='modify-content-weight'>{modifyValue.term}期</span></p>}

					<p className='modify-content '>确认要修改吗？</p>

				</Modal>
		    </div>

		</Spin>
		);
	}
}
// 将 store 中的数据作为 props 绑定到 CustomerList 上
const mapStateToProps = (state, ownProps) => {
    let { Common } = state;
    return {
        sysDictItems: Common.sysDictItems
    }
}

// 将 action 作为 props 绑定到 CustomerList 上。
const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators({  getSysDict }, dispatch)
});

const CreditLineRedux = connect(mapStateToProps, mapDispatchToProps)(CreditLine); // 连接redux

export default CreditLineRedux;
