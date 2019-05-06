import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import { browserHistory } from 'react-router';
import RuleService from '../../Services/RuleService';//调用数据

import './style/rulePhotoAdd.less';

import { Spin, message, Checkbox, Button, Cascader } from 'antd';
/**
 * 规则库详情
 * @Author: 赵俊
 * @Date:   2017-09-20
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-09-20
 */
class RulePhotoAdd extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
            code: props.routeParams.id,
            isEdit: props.routeParams.id,
			rulePhoto: {},
			photoDetail: [],
			configureDTOS: [],
            defineConfigure: [[],[],[],[],[],[],[],[],[]],
            confProds: [],
            cascaderItem: {
                placeholder: '必选项'
            },
            prodValue: null,
            prodArr: []
		};
	}
	componentDidMount() {
		const { code } = this.state
		this.getConfprods({});
		if (code) {
			let params = {
				prdCode: code
			}
			this.getPictureConfigure(params)
		} else {
			this.getPictureConfigure()
		}
    }
    async getConfprods (params) { // 获取必拍项配置产品列表
        const res = await RuleService.getValuationDetail(params);
        if (res.code == Config.errorCode.success) {
            this.setState({
                confProds: res.data
            })
        } else {
            message.error(res.msg);
        }
    }
	getPictureConfigure (params, type) { // 获取拍照产品配置项
        RuleService.getPictureConfigure(params, (res) => {
            if (res.code == Config.errorCode.success) {
				const data = res.data;
				let newArr = [];
				let configureDTOS = [];
				let defaultValue = {}
				let defineConfigure = this.state.defineConfigure;
				if (data && data.length > 0) {
					for(let i = 0;i < data.length; i++){
						let photoList = {};
						photoList.itemName = data[i].itemName
						photoList.configureDTOS = []
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
				if (type != 'change') {
					this.setState({
						prodValue: data[0].prdCode,
                    	prodArr: data[0].prdCode ? [data[0].prdCode] : []
					})
				}
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
    changeInd = (value) => {
        const that = this;
        let params = {};
        if (value && value.length > 0) {
            params.prdCode = value[value.length-1];
            that.setState({
                cascaderItem: {
                    value: value
                },
                code: params.prdCode
            });
        } else {
            delete params.prdCode;
            that.setState({
                cascaderItem: {
                    placeholder: '必选项'
                },
                code: ''
            })
        }
        that.getPictureConfigure(params, 'change');
        that.setState({
            prodArr: value,
            prodValue: null
        });
    }
	goBack = () => {
		browserHistory.goBack();
	}
	handleOkSen = () => {
        let that = this
		const { defineConfigure, code, isEdit } = that.state
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
					if(isEdit) {
						message.success('修改成功');
					} else {
						message.success('新增成功');
					}
					browserHistory.push('/rule/business')
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
		this.setState({
			photoDetail: Object.assign(this.state.photoDetail, photoDetail)
		})
	}
	render() {
		const { loading, confProds, photoDetail, isEdit, cascaderItem, prodValue } = this.state;
        let { prodArr } = this.state;
        const bcrumb = [{
            'link': '/rule/business',
            'value': '业务规则'
        }, {
            'link': null,
            'value': isEdit ? '编辑规则' : '新增规则'
        }];
        let treeData = [];
        if (confProds && confProds.length > 0) {
            confProds.map((item, index) => {
                let tree = {
                    value: item.prdType,
                    label: item.prdTypeName
                };
                let cTreeData = [];
                item.list.map((cItem, cIndex) => {
                    if (prodValue && cItem.prdType === prodValue) {
                        prodArr = [cItem.prdType];
                    }
                    if (prodValue && cItem.code === prodValue) {
                        prodArr = [cItem.prdType, prodArr[0]];
                    }
                    let cTree = {
                        value:  cItem.code,
                        label: cItem.prdName
                    };
                    cTreeData.push(cTree);
                });
                tree.children = cTreeData;
                treeData.push(tree);
            })
        }
		return(
		<Spin tip={Config.warnInfo.spinText} spinning={loading}>
			<div className="rule-photo-container">
				<BcrumbItem bcrumb={bcrumb} />
                <div className="rule-content">
                    <div className="addtask-first-item"><span className="addtask-title">选择产品</span>
                        {prodArr.length > 0 ? <Cascader
							key="Cascader_2"
                            size={'large'}
							options={treeData}
							expandTrigger="hover"
                            className="addtask-user"
                            onChange={this.changeInd}
                            value={prodArr}
                            style={{ width: 300 }}
                            allowClear
                            disabled={ isEdit ? true : false }
                            changeOnSelect
                            getPopupContainer={trigger => trigger.parentNode} /> : <Cascader
							key="Cascader_1"
							size={'large'}
							expandTrigger="hover"
                            options={treeData}
                            style={{ width: 300 }}
                            onChange={this.changeInd}
                            allowClear
                            changeOnSelect
                            getPopupContainer={trigger => trigger.parentNode}
                            {...cascaderItem} />
                        }
                    </div>
					<div className="addtask-first-item row-title">
						<p className="row-p">配置照片必拍项</p>
					</div>
					{
						photoDetail && photoDetail.map((item,index)=>(
							<div className="addtask-first-item row-title" key={index}>
								<p className="addtask-title">{item.itemName}</p>
								<Checkbox.Group onChange={(e)=>this.changeValue(e,index)} options={item.configureDTOS} value={item.defaultValue} >
								</Checkbox.Group>
							</div>
						))
					}
					<div className="addtask-first-item botton-list">
						<Button className="rule-button rule-submit" type="primary" onClick={this.handleOkSen}>提交</Button>
						<Button className="rule-button rule-cancel" type="primary" onClick={this.goBack}>取消</Button>
					</div>
				</div>
		    </div>
		</Spin>
		);
	}
}

export default RulePhotoAdd;
