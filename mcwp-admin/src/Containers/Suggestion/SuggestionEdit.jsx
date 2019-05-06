import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { Config } from '../../Config/Index';
import { browserHistory } from 'react-router';
import './style/suggestionEdit.less';
import SuggestionService from '../../Services/SuggestionService';//调用数据
import addImg from '../../Assets/Images/icon_add--pictures.png';
import iconColse from '../../Assets/Images/icon_close.png';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';

import { Button , Spin, message , Col , Row ,Modal} from 'antd';

/**
 * 意见反馈
 * @Author: 赵俊
 * @Date:   2017-09-20
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-09-20
 */
class SuggestionEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,				//提交文本框
			loading: false,
			suggestion:'',
			fcontent:'',				//反馈内容
			fchannel:'',				//反馈途径：web
			fimg:'',
			code: props.routeParams.id,
			textareaLength: 0,
			mainModalKey: 0,
			visibleFail: false,
			fileId: []			// 文件列表
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
	}
	componentWillMount() {
	}
	contentChange(e){
		let value = e.target.value
		let valueLength = e.target.value.length;
		if ( e.target.value.length > 500 ) {
			e.target.value = e.target.value.substr(0, 500);
			this.setState({
				fcontent: e.target.value,
				textareaLength: e.target.value.length
			})
            return;
        }
		this.setState({
			fcontent: value,
			textareaLength: valueLength
		})
	}
	putImgButton = (e) => {
		const {fileId} = this.state;
		if (fileId.length == 5) {
			e.target.value = ''
			return message.error('图片最多上传5张')
		}
        var formdata = new FormData();
        formdata.append('multipartFile', e.target.files[0])
		e.target.value = ''
		this.putImg(formdata);
	}
	putImg = (param) =>{ 					 //上传反馈图片
		const {fileId} = this.state;
		this.setState({ loading: true });
        SuggestionService.putImg(param, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
					fileId: fileId.concat(res.data),
					loading: false
                })
            } else {
				message.error(res.msg);
				this.setState({
					loading: false,
                })
            }
        });
	}
	submit = () =>{							//点击提交内容
		const {fcontent, fileId} = this.state;
		if(fcontent.length >= 10) {
			let params = {
				fcontent: fcontent ,	  				    //意见反馈内容
				fimg: fileId.join(','),         //图片反馈内容
				fchannel:1,			  	 	    //途径1.web 2.安卓 3.苹果
			}
			this.submitSuggestion(params)
		}else {
			message.error('意见反馈内容请不要少于10字')
		}
	}
	confirm = () => {
		browserHistory.push('/');
	}
	submitSuggestion (params) { 			// 提交意见反馈
		this.setState({ loading: true });
        SuggestionService.postSuggestion(params, (res) => {
            if (res.code == Config.errorCode.success) {
				this.setState({loading: false})
				message.success(res.msg);
				browserHistory.push('/');
            } else {
				message.error(res.msg);
				this.setState({
					visibleFail: true,
				});
            }
        });
	}
	deleteImg=(i)=>{						//点击删除图片=>调用此方法
		const {fileId} = this.state;
		this.setState({ loading: true });
        SuggestionService.deleteImg({fileId: fileId[i]}, (res) => {
            if (res.code == Config.errorCode.success) {
				this.setState({
					fileId: fileId.filter((item=>item != fileId[i])),
					loading: false
				})
				message.success('图片删除成功');
            } else {
				message.error(res.msg);
            }
        });
	}
	// showModal = () => {						//显示提交确定对话框
	// 	this.setState({
	// 	  visible: true,
	// 	});
	//   }
	// hideModal = () => {						//隐藏提交对话框
	// 	this.setState({
	// 	  visible: false,
	// 	  fileId:[],
	// 	  mainModalKey:this.state.mainModalKey+1
	// 	});
	//   }
	confirmFail = () => {						//显示提交确定对话框
		this.setState({
			visibleFail: false,
		});
	}
	hideModalFail = () => {						//隐藏提交对话框
		browserHistory.push('/');
	}
	render() {
		const {loading,  fileId, textareaLength} = this.state;
		const bcrumb = [{
            'link': null,
            'value':'意见反馈',
        }];
		return(
		<Spin tip={Config.warnInfo.spinText} spinning={loading}>
			<div className="suggestion-edit-container">
			<BcrumbItem bcrumb={bcrumb} />
				<div className='suggestion-content' key={this.state.mainModalKey}>
					<p className="description">问题描述</p>
					<div className="textarea-container">
						<textarea placeholder="对于我们的产品有什么建议吗？请告诉我们..." className="textarea" rows="16" cols="150" ref="suggestion"  onChange={this.contentChange.bind(this)} ></textarea>
						<p className="des-count">{textareaLength}/500</p>
					</div>
				 	<p className="prompt">反馈内容不少于10个字！</p>
					<p className="uploadImg">上传图片</p>
					<Row className="img-info">
						<Col span={4} className="img">
							<input type="file" className="file" onChange={this.putImgButton.bind(this)} ref="img"/>
					        <div className="addImg"><img className='addImgPic' src={addImg} alt="addImgPic"  /> </div>
						</Col>
						{
							fileId.length && fileId.map((item, index)=> (
								<Col key={index} span={4} className="img preview">
										<img className='iconColse' src={iconColse}  onClick={()=>this.deleteImg(index)} alt="iconColse" />
										<img className='previewImg' src={`${Config.target}/comm/feedback/img/${item}`} alt="previewImg" />
								</Col>
							))
						}
					</Row>
       				<Button type="primary" className="submit" onClick={this.submit}>提交</Button>
       				{/* <Modal title="您的意见已提交" visible={this.state.visible}
         				 onOk={this.confirm}
						 className="suggestion-modal"
         				 onCancel={this.hideModal}
          				 okText="返回首页"
         				 cancelText="继续反馈">
         				 <p className="confirm-p">提交成功 是否返回首页？</p>
      				</Modal> */}
					<Modal title="提交失败" visible={this.state.visibleFail}
         				 onOk={this.confirmFail}
						 className="suggestion-modal"
         				 onCancel={this.hideModalFail}
          				 okText="重新提交"
         				 cancelText="取消反馈">
         				 <p className="confirm-p">提交失败 是否重新提交？</p>
      				</Modal>
					<Button  className="reset" onClick={this.confirm}>取消</Button>
				</div>
		    </div>
		</Spin>
		);
	}
}

export default SuggestionEdit;
