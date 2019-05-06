import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import './style/authority.less';

import { Table, Spin, message, Switch } from 'antd';


/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
			loading: false,
			funcs: ''
		};
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    /**
	 * json数据格式处理
	 * 
	 * @param {any} data
	 * @returns
	 */
	jsonDataFormat(resData) {
		let data = [];
		if(resData && resData.length > 0) {
			for(let i = 0; i < resData.length; i++) {
				let singleData = resData[i];
				if(singleData.roleLevel > 0) { 
					let menus = singleData.menus;
					for(let j = 0; j < menus.length; j++) {
						let resultObj = {};
						resultObj.key = menus[j].menuId;
						if(j == 0) {
							resultObj.role = {
								v: singleData.roleName,
								r: singleData.roleLevel
							};
						} else {
							resultObj.role = {
								v: singleData.roleName,
								r: 0
							};
						}
						if( j == 0 ) resultObj.len = menus.length; //合并单元格数量
						resultObj.key = i * 100 + j;
						resultObj.roleNickName = singleData.roleNickName;
						resultObj.menuName = menus[j].menuName;
						resultObj.status = menus[j].status ? true : false;
						data.push(resultObj);
					}
				}
			}
		}
		return data;
	}
	componentDidMount() {
		this.getData(); // 页面初始化获取数据  
	}
    getData = (params={}) => { // 获取数据
		this.setState({ loading: true });
		Config.get('/v1/roles/funcs', params, (res) => {
            if(res.code == Config.errorCode.success) {
			    this.setState({
			        funcs: res.data,
					loading: false,
			    });	
         	} else {
                message.error(res.msg);
         		this.setState({ loading: false });
         	}
        });
	}
	render() {
		let funcs = this.state.funcs; // 所有权限
		let data = this.jsonDataFormat(funcs).length > 0 ? this.jsonDataFormat(funcs): [];
		const columns = [{
		  	title: '角色',
		  	dataIndex: 'roleNickName',
			key: 'roleNickName',
            className:'roleNickName',
		  	render: (value, row, index) => {	 		
				const obj = {
					children: value,
					props: {},
				};
				if ( row.len ) {
					obj.props.rowSpan = row.len;
				} else {
					obj.props.rowSpan = 0;
				}
				return obj;
		  	}
		}, {
		  	title: '功能',
		  	dataIndex: 'menuName',
			key: 'menuName'
		  	// render: renderContent
		}, {
		  	title: '开关',
		  	dataIndex: 'status',
			key: 'status',
			render: (text, row, index) => {
				return <Switch defaultChecked={false} checked={text} />;
			}
		}];

		return (
        <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
            <div className="common-console-container authority-container">
                <Table className="common-content-container" columns={columns} dataSource={data} pagination = {false} />
            </div>
        </Spin>
		);
	}
}

Main.contextTypes = {
};

export default Main;

