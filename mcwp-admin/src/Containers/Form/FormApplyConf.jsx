import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import FormService from '../../Services/FormService';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import {Config} from '../../Config/Index';
import { Link } from 'react-router';

import { Table } from 'antd';

import './style/formConf.less'
/**
 * 系统配置 —— 申请表配置
 * @Author: 赵俊
 * @Date:   2018-03-07
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-03-07
 */
class FormApplyConf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formType: 1,      // 1申请表2后台调查表3现场调查表
            formConf: [],
            prdType: props.routeParams.prdType
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    async componentDidMount() {
        const {formType, prdType} = this.state
        let formConfRes = await FormService.getFormConf({ formType, prdType })
        this.setState({
            formConf: formConfRes.data
        })
        Config.localItem(Config.formConfLocal.formApplyConf, JSON.stringify(formConfRes.data))
    }
    render() {
        const {formConf, prdType} = this.state
        const columns = [{
            title: '模块名称',
            dataIndex: 'formChName',
            key: 'formEnName',
            width: '20%'
        }, {
            title: '操作',
            key: 'action',
            render: (text, record, index) => (
                <span>
                    <Link className="form-link" to={`/form/apply/${record.formEnName}/${prdType}`}>配置</Link>
                </span>
            )
        }];
        const bcrumb = [{
            'link': '/form',
            'value': '表单配置'
        }, {
            'link': null,
            'value': '申请表配置'
		}];
        return (
            <div className="form-apply-container">
                <BcrumbItem bcrumb={bcrumb} />
                <div className="form-conf-wrapper">
                    <Table
                        rowKey={record => record.formEnName}
                        pagination={false}
                        columns={columns}
                        dataSource={formConf}
                        className="common-content-container"
                        onChange={this.changeTable}
                    />
                </div>
            </div>
        );
    }
}

export default FormApplyConf;
