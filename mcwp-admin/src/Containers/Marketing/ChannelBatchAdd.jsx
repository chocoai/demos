import React, { Component } from 'react';
import { Config } from '../../Config/Index';
import get from 'lodash.get'
import './style/channelBatchAdd.less';
import { browserHistory, Link } from 'react-router'; // 创建route所需
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import { Row, Col, Button, Form, Input, message, Select, Spin, Radio, Modal } from 'antd';
import MarChannelService from '../../Services/MarChannelService'; // services层 营销管理 —— 渠道管理
import ProductService from '../../Services/ProductService'; // services层 产品管理
import CommonService from '../../Services/CommonService'; // services层 
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
class ChannelBatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tzz: [{
                label: '估值工具',
                value: 1
            }, {
                label: '贷款产品',
                value: 2
            }, {
                label: '营销推广页',
                value: 3
            }],
            jumpPrds: null,
            fileName: '',
            file: null,
            jumpType: null,
            dictItems: null
        };
    }
    componentDidMount() {
        this.getDropProd({ prdStatus: 2 });
        this.getDictItems({ code: 'yxqdtj' })
    }
    // 获取字典值
    async getDictItems(params) {
        const res = await CommonService.getDictItems(params);
        if (res.code == Config.errorCode.success) {
            this.setState({
                dictItems: res.data,
            });
        }
    }
    async getDropProd(params) { // 获取产品列表（用于下拉）
        const that = this;
        const res = await ProductService.getDropProd(params);
        if (res.code == Config.errorCode.success) {
            that.setState({
                jumpPrds: res.data,
            });
        }
    }
    radioChange(e) {
        this.setState({
            jumpType: e.target.value
        })
    }
    // 创建
    handleSubmit = () => {
        let { file } = this.state;
        let that=this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                confirm({
                    title: '批量创建',
                    content: '确定批量创建自有员工的渠道短链吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk() {
                        var formdata = new FormData();
                        delete values.multipartFile;
                        for (let key in values) {
                            formdata.append(key, values[key]);
                        }
                        formdata.append('multipartFile', file);
                        that.putChannelBatchCheck(formdata)
                    }
                });
            }
        })
    }
    async putChannelBatchCheck(params) {
        let that=this;
        this.setState({ loading: true })
        const res = await MarChannelService.putChannelBatchCheck(params);
        this.setState({ loading: false })
        if (res.code == Config.errorCode.success) {
            this.putChannelBatch(params)
        }else if(res.code==Config.errorCode.channelImportError){
            confirm({
                title: '批量创建',
                content: res.msg,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    that.putChannelBatch(params)
                }
            });
        }
    }
    async putChannelBatch(params) {
        this.setState({ loading: true })
        const res = await MarChannelService.putChannelBatch(params);
        if (res.code == Config.errorCode.success) {
            this.setState({ loading: false })
            message.success('创建成功!')
            browserHistory.push('/marketing/channel');
        }
    }
    goBack = () => {
        browserHistory.goBack();
    }
    // 下载模板
    download = (e) => {
        e.target.href = Config.target + '/comm/template/channe/down';
    }
    changeFile = (e) => { // 上传文件
        var file = document.getElementById('multipartFile').files[0];
        var fileNames = file.name.split('.');
        var fileFormat = fileNames[fileNames.length - 1];
        if (fileFormat !== 'xlsx') return message.error('请导入Excel格式文件');
        this.setState({
            fileName: file.name,
            file: file
        });
    }
    render() {
        const that = this;
        const { loading, tzz, jumpPrds, dictItems, fileName, jumpType } = that.state;
        const { getFieldDecorator } = that.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        };
        const formItemLayout2 = {
            labelCol: { span: 10 },
            wrapperCol: { span: 10 }
        };
        const bcrumb = [{
            'link': '/marketing/channel',
            'value': '渠道管理'
        }, {
            'link': null,
            'value': '自有员工批量创建'
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="batchAdd-container">
                    <BcrumbItem bcrumb={bcrumb} />
                    <div className="common-console-container batchAdd-console-container">
                        <Form className="add-mes-form" hideRequiredMark={true}>
                            <Row className='batch-row'>
                                <Col span={24}>
                                    <Col span={12}>
                                        <FormItem label="跳转至" {...formItemLayout}>
                                            {getFieldDecorator('jumpType', {
                                                // initialValue: ,
                                                rules: [{ required: true, message: '请选择' }],
                                            })(
                                                <RadioGroup onChange={(e) => this.radioChange(e)}>
                                                    {tzz.map(item => <Radio key={item.value} value={item.value}>{item.label}</Radio>)}
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Col>
                                {jumpType == 2 ? <Col span={24}>
                                    <Col span={6}>
                                        <FormItem label="贷款产品" {...formItemLayout2}>
                                            {getFieldDecorator('jumpPrdCode', {
                                                // initialValue: ,
                                                rules: [{ required: true, message: '请选择' }],
                                            })(
                                                <Select
                                                    placeholder="贷款产品"
                                                    optionFilterProp="children"
                                                    style={{ width: 140, height: 32 }}
                                                    getPopupContainer={trigger => trigger.parentNode}
                                                >
                                                    {
                                                        jumpPrds && jumpPrds.map((item, index) => (
                                                            <Option value={item.code} key={index}>{item.prdName}</Option>
                                                        ))
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem {...formItemLayout}>
                                            {getFieldDecorator('jumpPage', {
                                                // initialValue: ,
                                                rules: [{ required: true, message: '请选择' }],
                                            })(
                                                <Select
                                                    placeholder="链接地址"
                                                    optionFilterProp="children"
                                                    style={{ width: 140, height: 32 }}
                                                    getPopupContainer={trigger => trigger.parentNode}
                                                >
                                                    {
                                                        get(dictItems, 'yxqdtj', []).map((item, index) => (
                                                            <Option value={item.ddValue + ''} key={index}>{item.ddText}</Option>
                                                        ))
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Col> : null}
                                <Col span={18}>
                                    <div className='telephone-lable'>
                                        <div className="chooes-box">
                                            <span className='phone-label'>员工名单:</span>
                                            <Button className="common-btn phone-btn" type="primary">批量导入
                                            <FormItem {...formItemLayout}>
                                                    {getFieldDecorator('multipartFile', {
                                                        // initialValue: ,
                                                        rules: [{ required: true, message: '您还未上传文件' }],
                                                    })(
                                                        <input id="uploader" onChange={this.changeFile} className="input-file" type="file" />
                                                    )}
                                                </FormItem>
                                            </Button>
                                            <span className='phone-label'>单次最多上传一千个自有员工名单，请上传xlsx或xls格式文件，您可以</span><span className='download'><Link onClick={(e) => this.download(e)}>下载模板</Link> </span>
                                        </div>
                                        <div style={{ paddingLeft: '105px' }}>
                                            <Input readOnly={true} placeholder='文件名称' value={fileName} />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="add-btns mes-btns">
                                <Button className="common-btn" type="primary" onClick={this.handleSubmit}>创建</Button>
                                <Button className="common-btn cancel-btn" onClick={this.goBack}>取消</Button>
                            </div>
                        </Form>
                    </div>

                </div>
            </Spin>
        )
    }
}

const Main = Form.create()(ChannelBatch);

export default Main;
