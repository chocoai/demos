import React, { Component } from 'react';
import { Pagination } from 'antd';

import { Config } from '../../Config/Index';

import './style/page.less';

/**
 * Page(公共分页组件)
 *
 * @export
 * @class Page
 * @extends {Component}
 */
class Page extends Component {
	constructor(props) {
		super(props); //后才能用this获取实例化对象
		this.state = {
    		showSizeChanger: true,
    		showQuickJumper: true
		};
	}
	onShowSizeChange = (current, pageSize) => { // pageSize 变化的回调
		let params = this.props.params;
		params.page = current;
		params.rows = pageSize;
		this.props.getMore(params);
	}
	changePage = (pageNumber) => { // 页码改变的回调，参数是改变后的页码及每页条数
		let params = this.props.params;
		params.page = pageNumber;
		this.props.getMore(params);
	}
	render() {	
		const { pagination } = this.props;
		return (
			<Pagination showQuickJumper showSizeChanger
				className="page-frame"  
				onShowSizeChange={this.onShowSizeChange}
				current={pagination.current} 
				pageSize={pagination.rows}
				total={pagination.total} 
				pageSizeOptions={pagination.pageSizeOptions}
				onChange={this.changePage}
			/>
		)
	}
}

export default Page;