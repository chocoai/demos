import React, { Component } from 'react';
import { Config } from '../../Config/Index';
import './style/message.less';
import { browserHistory, Link } from 'react-router'; // 创建route所需
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import { Row, Col, Button, Form, Input, message, Select, Spin, } from 'antd';
import MessageService from '../../Services/MessageService'; // services层
const FormItem = Form.Item;
const Option = Select.Option;
class SendMessage extends Component {
    constructor(props) {
        super(props); //后才能用this获取实例化对象
        this.state = {
            loading: false,
            file: '',
            textable: false,
            messItem: [],//消息模板列表
            fileName: '',
            // timeStatus:false,//发送时间显示状态
        };
    }
    componentDidMount() {
        this.getTemplateItem()
    }
    async getTemplateItem() {
        let res = await MessageService.getTemplateItem();
        if (res.code == Config.errorCode.success) {
            this.setState({
                messItem: res.data
            })
        }
    }
    goBack = () => {
        browserHistory.goBack();
    }
    changeFile = (e) => { // 上传文件
        var file = document.getElementById('multipartFile').files[0];
        var fileNames = file.name.split('.');
        var fileFormat = fileNames[fileNames.length - 1];
        if (fileFormat !== 'xlsx') return message.error('请导入Excel格式文件');
        this.setState({
            file: file,
            fileName: file.name
        });
    }
    // 下载模板
    download = (e) => {
        e.target.href = Config.target + '/comm/phoneTemplate/down';
    }
    // 验证手机号
    checkPhone = () => {
        let { file } = this.state;
        if (!file) {
            message.warning('请导入Excel格式文件！')
        } else {
            var formdata = new FormData();
            formdata.append('multipartFile', file);
            this.checkPhoneNum(formdata)
        }

    }
    // 验证手机号
    async checkPhoneNum(params) {
        this.setState({loading:true})
        const res = await MessageService.checkPhoneNum(params);
        if (res.code == Config.errorCode.success) {
            this.setState({loading:false})
            message.success(res.data)
        }
    }
    // 群发短信
    async sendMessage(params) {
        this.setState({loading:true})
        const res = await MessageService.sendMessage(params);
        if (res.code == Config.errorCode.success) {
            this.setState({loading:false})
            message.success('发送成功!')
            browserHistory.push('/market/message');
        }
    }
    // 提交
    handleSubmit = () => {
        let { file } = this.state;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var formdata = new FormData();
                formdata.append('templateId', values.templateId);
                formdata.append('multipartFile', file);
                this.sendMessage(formdata)
            }
        })
    }
    render() {
        const that = this;
        const { loading, messItem, fileName } = that.state;
        const { getFieldDecorator } = that.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 3 },
                sm: { span: 3 }
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 }
            }
        };
        const bcrumb = [{
            'link': '/market/message',
            'value': '群发记录'
        }, {
            'link': null,
            'value': '群发短信'
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="messageContainer">
                    <BcrumbItem bcrumb={bcrumb} />
                    <div className="common-console-container message-console-container">
                        <Form className="add-mes-form" hideRequiredMark={true}>
                            <Row>
                                <Col span={18}>
                                    <FormItem label="选择消息模板" {...formItemLayout}>
                                        {getFieldDecorator('templateId', {
                                            // initialValue: ,
                                            rules: [{ required: true, message: '请选择' }],
                                        })(

                                            <Select
                                                placeholder="必选项"
                                                getPopupContainer={trigger => trigger.parentNode}
                                                className="friend-input">
                                                {
                                                    messItem && messItem.map((item, index) =>
                                                        <Option value={item.id + ''} key={index}>{item.content}</Option>
                                                    )
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={18}>
                                    <div className='telephone-lable'>
                                        <div className="chooes-box">
                                            <span className='phone-label'>接收手机号:</span>
                                            <Button className="common-btn phone-btn" type="primary">批量导入
                                            <FormItem {...formItemLayout}>
                                                    {getFieldDecorator('multipartFile', {
                                                        // initialValue: ,
                                                        rules: [{ required: true, message: '您还未选择接收手机号！' }],
                                                    })(
                                                        <input id="uploader" onChange={this.changeFile} className="input-file" type="file" />
                                                    )}
                                                </FormItem>
                                            </Button>
                                            <span className='phone-label'>单次最多可发送短信10万条，请上传.xlsx或.xls格式文件，您可以</span><span className='download'><Link onClick={(e) => this.download(e)}>下载模板</Link> </span>
                                        </div>
                                        {/* <FormItem {...formItemLayout}>
                                            {getFieldDecorator('multipartFile', {
                                                // initialValue: ,
                                                rules: [{ required: true, message: '请选择' }],
                                            })( */}
                                        <div style={{ paddingLeft: '96px' }}>
                                            <Input readOnly={true} placeholder='文件名称' value={fileName} />
                                            <div className='check-phone' onClick={this.checkPhone}>验证手机号</div>
                                        </div>
                                        {/* )}
                                        </FormItem> */}
                                    </div>
                                </Col>
                            </Row>
                            <div className="add-btns mes-btns">
                                <Button className="common-btn" type="primary" onClick={this.handleSubmit}>发送短信</Button>
                                <Button className="common-btn cancel-btn" onClick={this.goBack}>取消</Button>
                            </div>
                        </Form>
                    </div>

                </div>
            </Spin>
        )
    }
}

const Main = Form.create()(SendMessage);

export default Main;
