import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory, withRouter } from 'react-router';
import { Config } from '../../Config/Index';

import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';

import { importCustomer, getCustTask, emptyCustTask } from '../../Redux/Action/Customer/CustomerAction';

import './style/customerExport.less';

import { Button, Spin, Input, message, Progress } from 'antd';

/**
 * 客户管理 -- 导入文件
 * @Author: 魏昌华
 * @Date:   2017-07-04
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-07-04
 */

class CustomerExport extends Component {
    constructor(props) {
    	super(props);
        this.state = {
            file: '',
            fileName: ''
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    componentDidMount() {     
        this.props.router.setRouteLeaveHook(
            this.props.route, 
            (nextLocation) => {
                const { customerTask } = this.props;
                if(customerTask && customerTask.taskStatus == 1) return '客户数据导入正在进行，您确定要离开?';
            }
        )
    }
    componentWillUnmount() {
        const { actions } = this.props;
        if(this.timer) clearInterval(this.timer);
        actions.emptyCustTask();
    }
    goBack = () => { // 取消按钮
        browserHistory.goBack();
    }
    changeFile = (e) => { // 上传文件
        var file = document.getElementById('uploader').files[0];
        var fileNames= file.name.split('.');
        var fileFormat = fileNames[fileNames.length-1];
        if(fileFormat !== 'xlsx') return message.error('请导入Excel格式文件');
        this.setState({
            file: file,
            fileName: file.name
        });
    }
    exportData = () => {
        const { actions } = this.props;
        const { file, fileName } = this.state;
        if(!fileName) return message.error('请选择Excel格式文件');
        var formdata = new FormData();
        formdata.append('multipartFile', file);
        actions.importCustomer(formdata); 
    }
	render() {
        const { loading, customerTask, actions } = this.props; 
        const bcrumb = [{
            'link': '/customer/list',
            'value': '客户管理'
        }, {
            'link': null,
            'value': '导入文件'
        }];
        let customerEle = '';
        if(!customerTask) {
            customerEle = <div className="customer-export">
                <div className="export-title">选择导入文件</div>
                <div className="export-main">
                    <div className="customer-upload"><Input value={this.state.fileName} className="input-path" placeholder="文件路径" /><span style={{cursor: 'pointer'}}className="file">选择<input id="uploader" onChange={this.changeFile} className="input-file" type="file" /></span></div>
                    <div className="export-warn">目前支持导入Excel格式文件</div>
                    <div className="export-tmp-warn">为了能更好的上传你的客户资料，请使用我们提供的模板，以下为Excel模板：</div>
                    <a href={Config.baseText.custTemplate} className="export-tmp">Excel模板下载</a>
                    <div className="export-btn">
                        <Button className="handle-btn" type="primary" size="large" onClick={this.exportData}>导入</Button>
                        <Button className="handle-btn cancel-btn" size="large" onClick={this.goBack}>取消</Button>
                    </div>
                </div>
            </div>;
        } 
        if (customerTask.taskStatus == 1) {
            customerEle = <div className="customer-export">
                <div className="exporting-title">正在导入，共{customerTask.taskCount}条数据</div>
                <Progress className="exporting-progess" percent={customerTask.taskPercent} showInfo={false} />
                <div className="export-btn">
                    <Button className="handle-btn cancel-btn" size="large" onClick={this.goBack}>取消</Button>
                </div>
            </div>;
            if(!this.timer) {
                this.timer = setInterval(function() {
                    actions.getCustTask({code: customerTask.code});
                }, 1000);
            }
        } 
        if(customerTask.taskStatus == 2) {
            if(this.timer) clearInterval(this.timer);
            customerEle = <div className="customer-export">
                <img className="complete-img" src={require('../../Assets/Images/img_complete.png')} alt="complete-img" />
                <div className="complete-text">
                    <p className="t-title">客户数据导入完成</p>
                    <p className="t-count">共成功导入{customerTask.taskSucCount}条数据，失败<span>{customerTask.taskFailCount}</span>条</p>
                </div>
                { customerTask.taskFailCount > 0 ? <a href={Config.target + '/comm/v1/customer/down/fail?code=' + customerTask.code} className="resave-data">另存导入失败客户数据</a> : null }
            </div>;
        }
		return (	
		<Spin tip={Config.warnInfo.spinText} spinning={loading}>
            <BcrumbItem bcrumb={bcrumb} />
            { customerEle }
		</Spin>
		);
	}
}

// 将 store 中的数据作为 props 绑定到 CustomerExport 上
const mapStateToProps = (state, ownProps) => {
    let { Common, Customer } = state;
    return {
        loading: Common.loading,
        customerTask: Customer.customerTask
    }
}

// 将 action 作为 props 绑定到 CustomerExport 上。
const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators({ importCustomer, getCustTask, emptyCustTask }, dispatch)
});

const Main = connect(mapStateToProps, mapDispatchToProps)(CustomerExport); // 连接redux

export default withRouter(Main);

