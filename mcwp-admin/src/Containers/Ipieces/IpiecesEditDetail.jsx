import React, { Component } from 'react'; // 引入了React
import { browserHistory } from 'react-router';
import { Config } from '../../Config/Index';
// 应收账款
import EditDetailReceivable from '../../Component/Ipieces/EditDetaiReceivable';
// 应付账款
import EditDetailPayable from '../../Component/Ipieces/EditDetailPayable';
// 预收账款
import EditDetailPreIncome from '../../Component/Ipieces/EditDetailPreIncome';
// 预付账款
import EditDetailPrePay from '../../Component/Ipieces/EditDetailPrePay';
// 存货
import EditDetailStock from '../../Component/Ipieces/EditDetailStock';
// 种植调查
import EditDetailPlant from '../../Component/Ipieces/EditDetailPlant';
// 养殖调查
import EditDetailBreed from '../../Component/Ipieces/EditDetailBreed';

import './style/ipiecesEditDetail.less';
import { Link } from 'react-router';
import { message, Breadcrumb, Tabs, Form, Button } from 'antd';
const TabPane = Tabs.TabPane;

//基本信息
const EditDetailReceivableForm = Form.create()(EditDetailReceivable)
const EditDetailPayableForm = Form.create()(EditDetailPayable)
const EditDetailPreIncomeForm = Form.create()(EditDetailPreIncome)
const EditDetailPrePayForm = Form.create()(EditDetailPrePay)
const EditDetailStockForm = Form.create()(EditDetailStock)
//农贷基本信息
const EditDetailPlantForm = Form.create()(EditDetailPlant)
const EditDetailBreedForm = Form.create()(EditDetailBreed)

const flatten = arr => {
  return arr.reduce((acc, value) => {
    const newFields = Object.assign({}, acc.fields, value.fields)
    const newErrs = Object.assign({}, acc.errs, value.errs)
    return Object.assign(acc, {fields: newFields}, {errs: newErrs})
  })
}

/**
 * 进件录入详细报表
 * @Author: 赵俊
 * @Date:   2017-07-12
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-12 
 */
class IpiecesEditDetail extends Component {
        constructor(props) {
        super(props);
        this.state = {
            fields: {}, // 存放所有fieldsValue
            errs: {},   // 存放所有error
            type: props.routeParams.type,
            defaultTab: props.routeParams.tab || '1',
            code: props.routeParams.id,
            businessInfoData:'', //进件基本信息
            receivableData: '', //应收账款
            payableData: '',    //应付账款
            preIncomeData: '',  //预付账款
            prePayData: '',     //预收账款
            stockData: '',      //存货
        }
    }
    componentWillMount() {
        this.getInfo('/v1/loan/receivable','receivableData');  //应收账款
        this.getInfo('/v1/loan/payable','payableData');  //应付账款
        this.getInfo('/v1/loan/preIncome','preIncomeData');  //预付账款
        this.getInfo('/v1/loan/prePay','prePayData');  //预收账款
        this.getInfo('/v1/loan/stock','stockData');  //存货
        this.getInfo('/v1/loan/assets/plant/info','plantData');  //种植调查
        this.getInfo('/v1/loan/assets/farm/info','breedData');  //养殖调查
    }

    componentDidMount() {

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
        let params = Config.serializeObjects(fields);
        params = Config.serializeObjects(params);
        for(let key in params) {
            if(params[key] === undefined || params[key] === null || params[key] === ''){
                if(/\[/.test(key) && /]/.test(key)) {
                    delete params[key]
                } else {
                    params[key] = ''
                }
            } 
            if(typeof params[key] == 'object') {
                params[key] = params[key].unix()*1000;
            }
        }
        Config.post(url, params, (res) => {
            if(res.code == Config.errorCode.success) {
                resolve('成功');
         	} else {
                message.error(res.msg);
                resolve(res.msg);
         	}
        });
        })
    }
    getAllFieldsValue = (type) => {
        Promise.all([
            this.getSubFormValue('editDetailReceivableForm'),
            this.getSubFormValue('editDetailPayableForm'),
            this.getSubFormValue('editDetailPreIncomeForm'),
            this.getSubFormValue('editDetailPrePayForm'),
            this.getSubFormValue('editDetailStockForm'),
        ]).then(result => {
            let arr = [];
            arr[0] = flatten([result[0], result[1], result[2], result[3], result[4]]);
            this.putFormData(arr,type);
        });
    }
    getFarmFieldsValue = (type) => {
        Promise.all([
            this.getSubFormValue('editDetailPlantForm'),
            this.getSubFormValue('editDetailBreedForm'),
        ]).then(result => {
            let arr = [];
            arr[0] = flatten([result[0]]);
            arr[1] = flatten([result[1]]);
            this.putFarmData(arr,type);
        });
    }
    putFormData (arr,type) {
        let ltype = this.state.type;
        Promise.all([
            this.putForm('/v1/loan/repor',arr[0].fields),
        ]).then(result => {
            //此处用于以后添加返回结果的处理
            message.success('保存成功');    
            if ( type == 'submit') {
                browserHistory.push({pathname:"/ipieces/edit/" + this.state.code + "/" + ltype, state: {key: 'finance',tab: '1'}})
            }
        });
    }
    putFarmData (arr,type) {
        let ltype = this.state.type;
        Promise.all([
            this.putForm('/v1/loan/assets/plant/add',arr[0].fields),
            this.putForm('/v1/loan/assets/farm/add',arr[1].fields),
        ]).then(result => {
            //此处用于以后添加返回结果的处理
            message.success('保存成功');    
            if ( type == 'submit') {
                browserHistory.push({pathname:"/ipieces/edit/" + this.state.code + "/" + ltype, state: {key: 'finance',tab: '2'}})
            }
        });
    }
    getSubFormValue(formName) {
        return new Promise(resolve => {
            if(this[formName]){
                this[formName].validateFields((errs, fields) => {
                    resolve({errs, fields})
                })
            } else {
                resolve({})
            }
        })
    }
    changeTabs = (key) => { // 切换选项卡
        this.setState({
            defaultTab: key
        })
    }
    submitInfo = () => {
        const { type } = this.state;
        if( type == 6) {
            this.getAllFieldsValue('submit');
        }else {
            this.getFarmFieldsValue('submit');
        }
    }
    /**
     * 上传表单计算结果
     * @param {url} 地址
     * @param {fields} 表单内容
     */
    putCalculationForm(url,fields){
        return new Promise(resolve => {
        if( !fields ) return resolve({});
        if( JSON.stringify(fields) == "{}" ) return resolve({});
        fields.reqCode = this.state.code;
        let params = Config.serializeObjects(fields);
        params = Config.serializeObjects(params);
        for(let key in params) {
            if(params[key] === undefined || params[key] === null || params[key] === ''){
                if(/\[/.test(key) && /]/.test(key)) {
                    delete params[key]
                } else {
                    params[key] = ''
                }
            } 
            if(typeof params[key] == 'object') {
                params[key] = params[key].unix()*1000;
            }
        }
        Config.post(url, params, (res) => {
            if(res.code == Config.errorCode.success) {
                resolve(res.data);
         	} else {
                message.error(res.msg);
                resolve(res.msg);
         	}
        });
        })
    }
    calculationBreed = () => {
        this.getFarmFieldsBreedValue('submit');
    }
    getFarmFieldsBreedValue = (type) => {
        Promise.all([
            this.getSubFormValue('editDetailBreedForm'),
        ]).then(result => {
            let arr = [];
            arr[0] = flatten([result[0]]);
            this.putFarmBreedData(arr,type);
        });
    }
    putFarmBreedData (arr,type) {
        Promise.all([
            this.putCalculationForm('/v1/loan/assets/farm/calculation',arr[0].fields),
        ]).then(result => {
            this.setState({
                breedCost: result[0].cost,
                breedRevenue: result[0].revenue,
            })
        });
    }
    calculationPlant = () => {
        this.getFarmFieldsPlantValue('submit');
    }
    getFarmFieldsPlantValue = (type) => {
        Promise.all([
            this.getSubFormValue('editDetailPlantForm'),
        ]).then(result => {
            let arr = [];
            arr[0] = flatten([result[0]]);
            this.putFarmPlantData(arr,type);
        });
    }
    putFarmPlantData (arr,type) {
        Promise.all([
            this.putCalculationForm('/v1/loan/assets/plant/calculation',arr[0].fields),
        ]).then(result => {
            this.setState({
                plantCost: result[0].cost,
                plantRevenue: result[0].revenue,
            })
        });
    }
    goBack = () => {
        let ltype = this.state.type;
        if(ltype == 6){
            browserHistory.push({pathname:"/ipieces/edit/" + this.state.code + "/" + ltype, state: {key: 'finance',tab: '1'}})
        }else{
            browserHistory.push({pathname:"/ipieces/edit/" + this.state.code + "/" + ltype, state: {key: 'finance',tab: '2'}})        
        }
    }
        render() {
        const { receivableData, payableData, preIncomeData, prePayData, stockData, defaultTab, type, plantData, breedData } = this.state;
        return (
            <div className='ipiecesEditDetail-container'>
                <Breadcrumb className='breadcrumb'>
                    <Breadcrumb.Item className='breadcrumb-item'><Link to="/ipieces/operate">进件管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item className='breadcrumb-item'><Link onClick={this.goBack}>编辑调查报告</Link></Breadcrumb.Item>
                    <Breadcrumb.Item className='breadcrumb-item'>录入详细报表</Breadcrumb.Item>
                </Breadcrumb>
                {
                    (receivableData && payableData && preIncomeData && prePayData && stockData) &&  ( type == 6 || type == 8)?
                    <div className="ipieces-edit-content">
                            <Tabs defaultActiveKey={defaultTab} activeKey={defaultTab} onChange={this.changeTabs} animated={false} className='edit-detail-tabs'>
                                <TabPane tab="应收账款统计表" key="1">
                                    <EditDetailReceivableForm ref={form => {this.editDetailReceivableForm = form}} receivableData = { receivableData } len = {receivableData.assetInfoDTOS.length} />
                                </TabPane>
                                <TabPane tab="应付账款统计表" key="2">
                                    <EditDetailPayableForm ref={form => {this.editDetailPayableForm = form}} payableData = { payableData } len = {payableData.assetInfoDTOS.length} />
                                </TabPane>
                                <TabPane tab="预收账款统计表" key="3">
                                    <EditDetailPreIncomeForm ref={form => {this.editDetailPreIncomeForm = form}} preIncomeData = { preIncomeData } len = {preIncomeData.assetInfoDTOS.length} />
                                </TabPane>
                                <TabPane tab="预付账款统计表" key="4">
                                    <EditDetailPrePayForm ref={form => {this.editDetailPrePayForm = form}} prePayData = { prePayData } len = {prePayData.assetInfoDTOS.length} />
                                </TabPane>
                                <TabPane tab="存货" key="5">
                                    <EditDetailStockForm ref={form => {this.editDetailStockForm = form}} stockData = { stockData } len = {stockData.assetStockDTOS.length} />
                                </TabPane>
                            </Tabs> 
                        <Button className='submit' type="primary" onClick={this.submitInfo}>保存</Button> 
                        {/*<Button className='save' type="primary" onClick={this.getAllFieldsValue}>保存</Button>*/}
                    </div>: null
                }
                {
                    plantData && breedData && type == 7?
                    <div className="ipieces-edit-content">
                            <Tabs defaultActiveKey={defaultTab} activeKey={defaultTab} onChange={this.changeTabs} animated={false} className='edit-detail-tabs'>
                                <TabPane tab="种植调查" key="1">
                                    <EditDetailPlantForm ref={form => {this.editDetailPlantForm = form}} plantData = { plantData } plantCost = { this.state.plantCost } plantRevenue = { this.state.plantRevenue } calculationPlant={ this.calculationPlant } len = {plantData.loanAssetPlantList.length} />
                                </TabPane>
                                <TabPane tab="养殖调查" key="2">
                                    <EditDetailBreedForm ref={form => {this.editDetailBreedForm = form}} breedData = { breedData } breedCost = { this.state.breedCost } breedRevenue = { this.state.breedRevenue } calculationBreed={ this.calculationBreed } len = {breedData.loanAssetFarmList.length} />
                                </TabPane>
                            </Tabs> 
                        <Button className='submit' type="primary" onClick={this.submitInfo}>保存</Button> 
                        {/*<Button className='save' type="primary" onClick={this.getAllFieldsValue}>保存</Button>*/}
                    </div>: null
                }
            </div>
        )
    }
}

export default IpiecesEditDetail;