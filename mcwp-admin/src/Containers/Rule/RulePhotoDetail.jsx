import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import { browserHistory } from 'react-router';
import RuleService from '../../Services/RuleService';//调用数据

import './style/rulePhotoAdd.less';

import { Spin, message, Select, Checkbox } from 'antd';
const Option = Select.Option;
/**
 * 规则库详情
 * @Author: 赵俊
 * @Date:   2017-09-20
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-09-20
 */
class RulePhotoDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			code: props.routeParams.id,
			prodList: [
				{
					ddItem: "cplb",
					ddText:"经营贷",
					ddValue:"2",
					dictDTOS:[],
					index:0,
					parentValue:"0"
				},
				{
					ddItem: "cplb",
					ddText:"个体经营贷",
					ddValue:"6",
					dictDTOS:[],
					index:1,
					parentValue:"0"
				},
				{
					ddItem: "cplb",
					ddText:"农贷",
					ddValue:"7",
					dictDTOS:[],
					index:2,
					parentValue:"0"
				},
				{
					ddItem: "cplb",
					ddText:"房抵贷",
					ddValue:"8",
					dictDTOS:[],
					index:3,
					parentValue:"0"
				},
			],
			rulePhoto: {},
			defaultValue: {},
			photoDetail: [],
			configureDTOS: [],
			defineConfigure: [[],[],[],[],[],[],[],[],[]]
		};
	}
	componentWillMount() {
		const { code } = this.state
		const enterprCode = Config.localItem('ENTERP_CODE');  // 当前用户企业 
		this.getProdList(enterprCode)
		if (code) {
			let params = {
				prdCode: code
			}
			this.getPictureConfigure(params)
		} else {
			this.getPictureConfigure()
		}
	}
	getProdList (enterprCode) { // 行业规则详情
		const that = this
		let params = {
			enterprCode: enterprCode
		}
        Config.get('/comm/prod/list/' + enterprCode, params, (res) => {
            if(res.code == Config.errorCode.success) {
				let data = res.data
				if (data && data.length > 0) {
					let newArr = [];
					for(let i = 0; i<data.length; i++) {
						newArr.push({
							ddItem: 'cplb',
							ddText: data[i].prdName,
							ddValue: data[i].code,
							dictDTOS: [],
							index: i+10,
							parentValue: '0'
						})
					}
					that.setState({
						prodList: that.state.prodList.concat(newArr)
					})
				}

         	} else {
                message.error(res.msg);
         	}
        });
	}
	getPictureConfigure (params) { // 获取拍照产品配置项
        RuleService.getPictureConfigure(params, (res) => {
            if (res.code == Config.errorCode.success) {
				const data = res.data;
				let newArr = [];
				let configureDTOS = [];
				let defineConfigure = this.state.defineConfigure;
				let defaultValue = {};
				if (data && data.length > 0) {
					for(let i = 0;i < data.length; i++){
						let photoList = {};
						photoList.itemName = data[i].itemName
						photoList.configureDTOS = []
						photoList.defaultValue = []
						photoList.defaultValue = []
						defaultValue.key = data[i].prdCode
						defaultValue.label = data[i].prdName
						if(data && data[i].configureDTOS && data[i].configureDTOS.length > 0){
							let configureLists = []
							for(let j = 0;j < data[i].configureDTOS.length; j++){
								let configureList = {}
								configureList.label = data[i].configureDTOS[j].itemDictName
								configureList.value = data[i].configureDTOS[j].itemDict
								if (data[i].configureDTOS[j].ismust) {
									// defaultValue.push(data[i].configureDTOS[j].itemDict)
									photoList.defaultValue.push(data[i].configureDTOS[j].itemDict)
									defineConfigure[i].push(data[i].configureDTOS[j].itemDict)
								}
								// configureLists.push(defaultValue)
								// photoList.defaultValue = defaultValue
								photoList.configureDTOS.push(configureList)
							}
							configureDTOS.push(configureLists)
						}
						newArr.push(photoList)
					}
				}
                this.setState({
					photoDetail: newArr,
					configureDTOS: configureDTOS,
					defineConfigure: defineConfigure,
					defaultValue: defaultValue
				})   
            } else {
				message.error(res.msg);
            }
        });
	}
	selectProd = (value) => {
		let params = {
			prdCode: value.key
		}
		this.setState({
			code: value.key
		})
		this.getPictureConfigure(params)
	}
	goBack = () => {
		browserHistory.goBack();
	}
	handleOkSen = () => {
		let that = this
		const { defineConfigure, code } = that.state
		let newArr = []
		for(let i = 0;i < defineConfigure.length;i++) {
			for(let j = 0;j < defineConfigure[i].length;j++) {
				if (defineConfigure[i][j]) {
					let arrList = {
						itemDict: defineConfigure[i][j]
					}
					newArr.push(arrList)
				}
			}
		}
		if(code) {
			let params = {
				prdCode: code,
				configureDTOS: newArr
			}
			RuleService.putPictureConfigure(Config.serializeObjects(params), (res) => {
				if (res.code == Config.errorCode.success) {
					message.success('修改成功');
					browserHistory.push('/rule')
				} else {
					message.error(res.msg);
				}
			});
		} else {
			message.error('请选择产品');
		}
	}
	changeValue = (checkedValues,itemsCode) => {
		let defineConfigure = this.state.defineConfigure
		defineConfigure[itemsCode] = checkedValues
		let photoDetail = this.state.photoDetail;
		photoDetail[itemsCode].defaultValue = checkedValues
		console.log(photoDetail)
		this.setState({
			photoDetail: Object.assign(this.state.photoDetail, photoDetail)
		})
	}
	render() {
		const { loading, prodList, photoDetail, defaultValue } = this.state;
		const bcrumb = [{
            'link': '/rule/business',
            'value': '业务规则'
        }, {
            'link': null,
            'value': '查看规则'
		}];
		console.log(defaultValue)
		return(
		<Spin tip={Config.warnInfo.spinText} spinning={loading}>
			<div className="rule-photo-container">
				<BcrumbItem bcrumb={bcrumb} />
				<div className="rule-content">
					<div className="addtask-first-item">
                        <p className="addtask-title">选择产品</p>
						{
							defaultValue && defaultValue.key ?
							<Select
								className="addtask-user"
								showSearch
								labelInValue
								size="large"
								placeholder="必选项"
								optionFilterProp="children"
								disabled
								onChange={this.selectProd}
								defaultValue= {defaultValue}
								getPopupContainer={trigger => trigger.parentNode}
								filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							>
								{
									prodList.map((item,index)=>(
										<Option key={index} value={item.ddValue}>{item.ddText}</Option>
									))
								}                    
							</Select> : null
						}
                    </div>
					<div className="addtask-first-item row-title">
						<p className="row-p">配置照片必拍项</p>
					</div>
					{
						photoDetail && photoDetail.map((item,index)=>(
							<div className="addtask-first-item row-title" key={index}>
								<p className="addtask-title">{item.itemName}</p>
								<Checkbox.Group onChange={(e)=>this.changeValue(e,index)} disabled options={item.configureDTOS} value={item.defaultValue} >
								</Checkbox.Group>
							</div>
						))
					}     
					{/* <div className="addtask-first-item botton-list">
						<Button className="rule-button rule-submit" type="primary" onClick={this.handleOkSen}>提交</Button>
						<Button className="rule-button rule-cancel" type="primary" onClick={this.goBack}>取消</Button>
					</div> */}
				</div>
		    </div>
		</Spin>
		);
	}
}

export default RulePhotoDetail;