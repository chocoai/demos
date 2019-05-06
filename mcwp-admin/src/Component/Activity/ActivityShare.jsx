import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import { Config } from '../../Config/Index';
import CommonService from '../../Services/CommonService';
import imgPicture from '../../Assets/Images/img_picture.png';
import './style/editActivity.less';

import { Form, Input, Row, Col, Select, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class Share extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // activityRemark:props.titleLen||0,
            // activityRemark2:props.summaryLen||0,
            type:props.type?props.type:'share'
        }
    }
    componentWillMount() {
    }
    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         activityRemark: nextProps.titleLen||0,
    //         activityRemark2: nextProps.summaryLen||0,
    //     })
    //   }
    // textareaChangeThree(e,type) {
    //     if(type=='title'){
    //         this.setState({
    //             activityRemark: e.target.value.length
    //         })
    //     }else if(type=='abstract'){
    //         this.setState({
    //             activityRemark2: e.target.value.length
    //         })
    //     }
        
    // }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {type}=this.state;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        };
        const { shareConfs,srcUrl,required } = this.props;
        return (
            <div className='editActivity-container'>
                <Form>
                    <Row className='trend-row' type="flex" justify="start">
                        <Col span={12}>
                            <FormItem label="图标" {...formItemLayout} className='share-item'>
                                {getFieldDecorator('srcUrl', {
                                    initialValue: srcUrl,
                                    rules: [{ required: required, message: '图标不能为空' }],
                                })(
                                    <Row className="modal-row">
                                        <Col span={8} className="upload-container">
                                        {
                                                srcUrl ?
                                                    <img className="idcard-img" src={srcUrl} alt="page" /> :
                                                    <img className="idcard-img" src={imgPicture} alt="page" />
                                            }
                                        </Col>
                                        <Col span={12} className="row-tip">
                                            <p>建议图片为png,jpg,jpeg格式</p>
                                            <p>大小为200*200</p>
                                            <input className="idcard-file" type="file"  multiple onChange={(e) => this.props.getFile(e, type,'')}/>
                                            <p className="action-btn">上传图片</p>
                                        </Col>
                                    </Row>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="大标题" {...formItemLayout}>
                                {getFieldDecorator('title', {
                                    initialValue: shareConfs&&shareConfs.title||'',
                                    rules: [{ required: required, message: '大标题不能为空' }, { validator: Validate.checkWordLen500, message: Validate.warnInfo.wordLen500 }],
                                })(
                                    <textarea className="des-content" placeholder="请输入"  onChange={(e) => this.props.textareaChange(e,'title')}></textarea>
                                )}
                                <p className="des-count">{this.props.titleLen}/500</p>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="摘要" {...formItemLayout}>
                                {getFieldDecorator('summary', {
                                    initialValue: shareConfs&&shareConfs.summary||'',
                                    rules: [{ required: required, message: '摘要不能为空' }, { validator: Validate.checkWordLen500, message: Validate.warnInfo.wordLen500 }],
                                })(
                                    <textarea className="des-content" placeholder="请输入"  onChange={(e) => this.props.textareaChange(e,'abstract')}></textarea>
                                )}
                                <p className="des-count">{this.props.summaryLen}/500</p>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

const pureShare = pureRender(Share);
export default pureShare;