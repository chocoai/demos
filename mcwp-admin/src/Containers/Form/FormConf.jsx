import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import CommonService from '../../Services/CommonService'
import FormService from '../../Services/FormService';
import { Link } from 'react-router';
import {Config} from '../../Config/Index';

import { Table, message, Spin } from 'antd';

import './style/formConf.less'
/**
 * 系统配置 —— 表单配置
 * @Author: 魏昌华
 * @Date:   2018-03-05
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2018-03-05
 */
class FormConf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prdType: [],
            loading: false
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    async componentDidMount() {
        let prdTypeRes = await CommonService.getDict({ code: 'cplx' })
        this.setState({
            prdType: prdTypeRes.data.cplx
        })
    }
    uploadModel = async (e, prodType) => {
        var formdata = new FormData();
        formdata.append('multipartFile', e.target.files[0])
        formdata.append('prodType', prodType)
        e.target.value = ''
        this.setState({
            loading: true
        })
        let res = await FormService.uploadModel(formdata);
        this.setState({
            loading: false
        })
        if (res) message.success('上传成功')
    }
    render() {
        const {prdType, loading} = this.state
        const columns = [{
            title: '产品类型',
            dataIndex: 'ddText',
            key: 'ddText',
            width: '20%'
        }, {
            title: '操作',
            key: 'action',
            render: (text, record, index) => (
                <span>
                    <Link className="form-link" to={`/form/apply/${record.ddValue}`}>申请表配置</Link>
                    <Link className="form-link" to={`/form/investigate/${record.ddValue}`}>调查表配置</Link>
                    {
                        record.ddValue == 5 ?
                        <Link className="form-link form-disable-link">现场调查表配置</Link>:
                        <Link className="form-link" to={`/form/site/${record.ddValue}`}>现场调查表配置</Link>
                    }
                    {
                        record.ddValue == 5 ?
                        <div className='form-upload'>
                            <span className="form-link form-disable-link">上传报告模板</span>
                        </div>:
                        <div className='form-upload'>
                            <input type="file" className="form-upload-target" onChange={(e) => this.uploadModel(e, record.ddValue)} ref="img" />
                            <span className="form-link">上传报告模板</span>
                        </div>
                    }
                </span>
            )
        }];
        return (
            <div className="common-console-container form-container">
		        <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                    <Table
                        rowKey={record => record.ddValue}
                        pagination={false}
                        columns={columns}
                        dataSource={prdType}
                        className="common-content-container"
                        onChange={this.changeTable}
                    />
                </Spin>
            </div>
        );
    }
}

export default FormConf;
