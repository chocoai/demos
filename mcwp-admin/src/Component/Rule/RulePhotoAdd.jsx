import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import './style/rulePhotoAdd.less';

import { Checkbox, Form } from 'antd';
const FormItem = Form.Item
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
			photoList: [],
		};
	}
	componentWillMount() {
		let photoDetail = this.props.photoDetail;
		let newArr = [];
		if (photoDetail && photoDetail.length > 0) {
			for (let i = 0; i < photoDetail.length; i++) {
				let photoList = {};
				photoList.itemsName = photoDetail[i].itemsName
				photoList.configureDTOS = []
				photoList.defaultValue = []
				if (photoDetail && photoDetail[i].configureDTOS && photoDetail[i].configureDTOS.length > 0) {
					for (let j = 0; j < photoDetail[i].configureDTOS.length; j++) {
						let configureList = {}
						configureList.label = photoDetail[i].configureDTOS[j].itemDictName
						configureList.value = photoDetail[i].configureDTOS[j].itemDict
						if (photoDetail[i].configureDTOS[j].ismust) {
							photoList.defaultValue.push(photoDetail[i].configureDTOS[j].itemDict)
						}
						photoList.configureDTOS.push(configureList)
					}
				}
				newArr.push(photoList)
			}
			this.setState({
				photoList: newArr,
			})
		}
	}	
	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 3 },
			wrapperCol: { span: 21 }
		};
		const { photoList } = this.state;
		return (
			<div className="rule-photo-container">
				<div className="rule-content">
					<div className="addtask-first-item row-title">
						<p className="row-p">配置照片必拍项</p>
					</div>
					<Form>
						{
							photoList && photoList.map((item, index) =>
								<FormItem {...formItemLayout} key={index} label={item.itemsName}>
									{getFieldDecorator('configureDTOS[' + index + ']', {
										initialValue: item.defaultValue,
										rules: [{ required: false, message: '' }],
									})(
										<Checkbox.Group
											options={item.configureDTOS}>
										</Checkbox.Group>
									)}
								</FormItem>

							)
						}
					</Form>
				</div>
			</div>
		);
	}
}
const pureRulePhotoAdd = pureRender(RulePhotoAdd);
export default pureRulePhotoAdd;
