import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { browserHistory, Link } from 'react-router';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import ReactPDF from 'react-pdf/build/entry.webpack';

import './style/contractDetail.less';

import { Button } from 'antd';

/**
 * 合同详情
 * @Author: 赵俊
 * @Date:   2017-08-08
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-08-08
 */
class ContractDetail extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
			code: props.routeParams.code,
        	file: Config.target + '/comm/tpl/view/' + props.routeParams.code,
			pageIndex: null,
			pageNumber: null,
			total: null,
			width: null
		};
	}
	componentDidMount(){
		Config.calculateSize(this);
	}
	downFile = (e) => {
		// window.open(this.file.target)
	}
	edit = () => {
		const { code } = this.state;
		browserHistory.push('/contract/edit/' + code)
	}
	back = (e) => {
		browserHistory.push('/contract')
	}
	render() {
		const { file, pageIndex, width } = this.state;
		const bcrumb = [{
            'link': '/contract/user',
            'value': '合同管理'
        }, {
            'link': null,
            'value': '合同详情'
		}];
		return (
			<div className="contractDetail-container">
                <BcrumbItem bcrumb={bcrumb} />
				<div className="contract-detail-content">
					<ReactPDF
					file={{url: file}}
					onDocumentLoad={this.onDocumentLoad}
					onPageLoad={this.onPageLoad}
					pageIndex={pageIndex}
					width={width}
					/>
					<div className="contract-detail-botton">
						<Button type="primary"><Link href={Config.target + '/comm/contract/down/' + this.state.code + '.pdf'} download>下载</Link></Button>
						{/*<Button className='edit' type="primary" onClick={this.edit}>编辑</Button>*/}
						<Button className='back' type="primary" onClick={this.back}>返回</Button>
					</div>
				</div>
		    </div>
		);
	}
}

export default ContractDetail;

