import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import UploadImg from './uploadImg'
import './style/share.less';

import { Form, Row, Col, Select, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class Share extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentWillMount() {
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        };
        const { shareConfs,required,code,type } = this.props;
        return (
            <div className='editActivity-container'>
                <Form>
                    <Row className='trend-row' type="flex" justify="start">
                        <Col span={12}>
                            <UploadImg label={'图标'} rules={[{ required: required, message: '图标不能为空' }]} size={'200*200'} getFieldDecorator={getFieldDecorator} name={'srcUrl'} code={code} type={type}/>
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