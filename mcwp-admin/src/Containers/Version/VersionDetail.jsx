import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import { Spin , message} from 'antd';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import './style/versionDetail.less';

/**
 * 版本管理详情
 * @Author: 赵俊
 * @Date:   2017-09-20
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-09-20
 */
class RuleIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			code: props.routeParams.code,
			versionDesc:'',
			versionDetail: {},
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
	}
	componentDidMount() {
		let that = this;
		let { code } = that.state;
		let params = {
			code: code
		}
		that.getVersionList(params);
	}
	getVersionList = (params) => {//获取数据
        this.setState({ loading: true });
        Config.get('/comm/version/code', params, (res) => {
            this.setState({ loading: false });
            if(res.code == Config.errorCode.success) {
                this.setState({
					versionDetail: res.data,
					versionDesc: res.data.versionDesc.split("\r\n")
				});
            } else {
                message.error(res.msg)
            }
        })
	}
	render() {
		const {loading, versionDetail, versionDesc} = this.state;
		const bcrumb = [{
            'link': '/version',
            'value': '版本管理'
        }, {
            'link': null,
            'value':'版本详情',
		}];
		return(
		<Spin tip={Config.warnInfo.spinText} spinning={loading}>
			<div className="version-detail-container">
				<BcrumbItem bcrumb={bcrumb} />
				<div className="version-detail-content">
                {
					versionDesc  ? versionDesc.map((result, key) => {
						return (
							<p className="versionDesc-p" key={key}>{ result }</p>
						)
					})
					: '未录入'
				}
				</div>
		    </div>
		</Spin>
		);
	}
}

export default RuleIndex;
