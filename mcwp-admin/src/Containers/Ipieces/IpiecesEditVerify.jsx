import React, { Component } from 'react'; // 引入了React
import { browserHistory, Link } from 'react-router';
import { Config } from '../../Config/Index';

import EditVerifyProfit from '../../Component/Ipieces/EditVerifyProfit';
import EditVerifySale from '../../Component/Ipieces/EditVerifySale';
import EditVerifyPurchase from '../../Component/Ipieces/EditVerifyPurchase';

import './style/ipiecesEditVerify.less'

import { message, Breadcrumb, Button, Form } from 'antd';

const EditVerifyProfitForm = Form.create()(EditVerifyProfit)
const EditVerifySaleForm = Form.create()(EditVerifySale)
const EditVerifyPurchaseForm = Form.create()(EditVerifyPurchase)

const flatten = arr => {
  return arr.reduce((acc, value) => {
    const newFields = Object.assign({}, acc.fields, value.fields)
    const newErrs = Object.assign({}, acc.errs, value.errs)
    return Object.assign(acc, {fields: newFields}, {errs: newErrs})
  })
}

/**
 * 进件编辑录入检验项
 * @Author: 赵俊
 * @Date:   2017-07-12
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-12
 */
class IpiecesEditVerify extends Component {
    constructor(props) {
    	super(props);
        this.state = {
            code: props.routeParams.id,
            type: props.routeParams.type,
            ipiecesType: props.routeParams.ipiecesType,
            verifyData:'',
            averData: '',
            topInfo: ''
        }
    }

    componentWillMount() {
        this.getInfo('/v1/loan/logicVerify/data', 'verifyData');
        this.getInfo('/v1/loan/logicVerify/averTurnover', 'averData')
        this.getTopInfo(this.state.code)
    }
    //获取信息
    getInfo(url,type){
        let params = {
            code: this.state.code
        }
        Config.get(url, params, (res) => {
            if(res.code == Config.errorCode.success) {
                this.setState({
                    [type]: res.data
                })
         	} else {
                message.error(res.msg);
         	}
        });
    }
    getTopInfo = (code) => {   // 获取进件头部信息
		Config.get('/v1/loan/top', {code: code}, (res) => {
            if(res.code == Config.errorCode.success) {
                this.setState({
                    topInfo: res.data
                });
            } else {
                message.error(res.msg);
            }
        });
	}
    /**
     * 上传表单
     * @param {url} 地址
     * @param {fields} 表单内容
     */
    putForm(url,fields){
        return new Promise(resolve => {
        if( !fields ) return resolve({});
        if( JSON.stringify(fields) == "{}" ) return resolve({});
        fields.reqCode = this.state.code;
        let params = Config.serializeObjectsTwo(fields);
        for(let key in params) {
            if(params[key] === undefined || params[key] === null || params[key] === ''){
                // if(/\[/.test(key) && /]/.test(key)) {
                //     delete params[key]
                // } else {
                //     params[key] = ''
                // }
                delete params[key]
            }
        }
        Config.post(url, params, (res) => {
            if(res.code == Config.errorCode.success) {
                resolve('成功');
                message.success('保存成功');
         	} else {
                // message.error(res.msg);
                resolve(res);
         	}
        });
        })
    }
    getAllFieldsValue = (type) => {
        Promise.all([
            this.getSubFormValue('editVerifyProfitForm'),
            this.getSubFormValue('editVerifySaleForm'),
            this.getSubFormValue('editVerifyPurchaseForm')
        ]).then(result => {
            let arr = [];
            arr[0] = flatten([result[0], result[1], result[2]]);
            this.putFormData(arr,type);
        });
    }
    putFormData (arr,type) {
        Promise.all([
            this.putForm(/verify\/sale/.test(window.location.href) ?'/v1/loan/logicVerify/many':'/v1/loan/logicVerify/single',arr[0].fields)
        ]).then(result => {
            //此处用于以后添加返回结果的处理
            // if(result[0] == "loanLogicVerifySingle.shopHours数字的值超出了允许范围(只允许在2位整数和1位小数范围内)"){
            //     message.error('营业时间数字的值超出了允许范围(只允许在2位整数和1位小数范围内');
            //     return;
            // }else if(result[0] == 'loanLogicVerifySingle.averageGrossMargin必须大于或等于0.01'){
            //     message.error('行业平均毛利率大于等于0.01');
            //     return;
            // }
            // if(result[0] == 'loanLogicVerifySingle.averageGrossMargin必须大于或等于0.01') {
            //     message.error('行业平均毛利率大于等于0.01');
            //     return;
            // }
            if(result[0].code=='SYSTEM_ERROR'){
                message.error(result[0].msg);
                return;
            }
            if ( type == 'submit') {
                browserHistory.push({pathname:`/ipieces/edit/${this.state.code}/${this.state.ipiecesType}`, state: {key: 'logic'}})
            }
            if ( type == 'save') {
                this.getInfo('/v1/loan/logicVerify/data', 'verifyData');
                this.getInfo('/v1/loan/logicVerify/averTurnover', 'averData')
            }
        });
    }
    getSubFormValue(formName, param) {
        return new Promise(resolve => {
            if(this[formName]){
                this[formName].validateFields((errs, fields) => {
                    if (errs) {
                        if (param == 'link') {
                            message.error('存在不符合要求项，请先修改')
                            return;
                        }
                        message.error('存在不符合要求项，请及时修改')
                    } else {
                        resolve({errs, fields})
                    }
                })
            } else {
                resolve({})
            }
        })
    }
    saveInfo = () => {
        this.getAllFieldsValue('save');
    }

    submitInfo = () => {
        this.getAllFieldsValue('submit');
    }
    goBack = () => {
        browserHistory.goBack();
    }
	render() {
        const { type, verifyData, averData, topInfo } = this.state;
		return (
			<div className="ipiecesEditVerify-container">
                <Breadcrumb className='breadcrumb'>
                    <Breadcrumb.Item className='breadcrumb-item'><Link to="/ipieces/operate">进件管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item className='breadcrumb-item'><Link onClick={this.goBack}>编辑调查报告</Link></Breadcrumb.Item>
                    <Breadcrumb.Item className='breadcrumb-item'>录入检验项</Breadcrumb.Item>
                </Breadcrumb>
                <div className='verify-detail'>
                    {type == 'profit' && verifyData ? <EditVerifyProfitForm ref={form => {this.editVerifyProfitForm = form}} loanLogicVerifySingle = {verifyData.loanLogicVerifySingle} /> : null}
                    {type == 'sale' && verifyData ? <EditVerifySaleForm ref={form => {this.editVerifySaleForm = form}} averData = {averData} topInfo={topInfo} loanLogicVerifySingle = {verifyData.loanLogicVerifySingle} monthTurnover = {verifyData.monthTurnover} dayTurnover = {verifyData.dayTurnover} deductionWageSale = {verifyData.deductionWageSale} computerTurnover={verifyData.computerTurnover} /> : null}
                    {type == 'purchase' && verifyData ? <EditVerifyPurchaseForm ref={form => {this.editVerifyPurchaseForm = form}} averData = {averData} loanLogicVerifySingle = {verifyData.loanLogicVerifySingle} /> : null}
                    <Button className='submit' type="primary" onClick={this.submitInfo}>保存</Button>
                    {/*<Button className='save' type="primary" onClick={this.saveInfo}>保存</Button>*/}
                </div>
		    </div>
		);
	}
}

export default IpiecesEditVerify;

