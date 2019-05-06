import React, { Component } from 'react'; // 引入了React
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Config } from '../../Config/Index';

import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';

import { getSysDict } from '../../Redux/Action/Index';

import './style/pointOperate.less';

import { Row, Col, Button, Form, Input, message, Spin, Cascader, Modal } from 'antd';
const FormItem = Form.Item;
const confirm = Modal.confirm;

/**
 * 微信公众号
 * @Author: 魏昌华
 * @Date:   2017-08-16
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2017-08-16
 */
class PointOperate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false ,
            pointInfo: {},
            button: '',
            bcrumbValue: '',
            defaultAddress: ''
        }

    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    // 获取数据和字典值
    componentDidMount() {
        const { routeParams, actions } = this.props;
        if(routeParams.code) {
            this.getPoint(routeParams.code);
            this.setState({
                button: '保存',
                bcrumbValue: '编辑网点'

            })
        } else {
            this.setState({
                button: '新增',
                bcrumbValue: '新增网点'
            })
        }
        actions.getSysDict({code: 'ssq'});

    }
    // 获得网点详情信息
    getPoint = (code) => {
        let params = {code: code}
        this.setState({ loading: true });
        Config.get('/v1/sys/wx/bankout/info/' + code , params, (res) => {
            this.setState({ loading: false });
            if(res.code == Config.errorCode.success) {
                this.setState({
                    pointInfo: res.data,
                    defaultAddress: res.data.bltAddress,
                    defaultBltEndtime: res.data.bltEndtime
                })
            } else {
                message.error(res.msg)
            }
        })
    }
    // 取消按钮
    goBack = () => {
        confirm({
            title: '确认取消',
            content: '是否取消此次编辑',
            onOk() {
                browserHistory.goBack();
            },
            onCancel() {
            },
		});
    }
    onChange(value) {
    }
	// 新增网点、编辑网点
    handleSubmit = (e) => {
		e.preventDefault();
        const { form, routeParams } = this.props;
		form.validateFieldsAndScroll((err, values) => {
            if(!err) {
                if(!this.state.defaultAddress){
                    return message.error('请输入地址');
                }
                let checkoutPhone = /^1\d{10}$/;
                if(!checkoutPhone.test(values.telephone)){
                    return message.error('手机号格式不正确');
                }
                let recreditAmount = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;
                if(!recreditAmount.test(values.bltStarttime) || !recreditAmount.test(this.state.defaultBltEndtime)){
                    return message.error('营业时间输入格式不正确');
                }
                let params = {
                    bltName: values.bltName,
                    citiesId: values.citiesId.join(","),
                    bltAddress: this.state.defaultAddress,
                    bltStarttime: values.bltStarttime,
                    bltEndtime: this.state.defaultBltEndtime,
                    telephone: values.telephone
                };
                // for(let key in params) {
                //     if(params[key] === undefined || params[key] === null || params[key] === ''){
                //         delete params[key]
                //     }
                // }
                if(routeParams.code) { // 编辑客户
                    params.code = routeParams.code;
                    Config.post('/v1/sys/wx/bankout/add', params, (res) => {
                        this.setState({ loading: false });
                        if(res.code == Config.errorCode.success) {
                            browserHistory.goBack();
                        } else {
                            message.error(res.msg)
                        }
                    })
                } else { // 新增客户
                    Config.post('/v1/sys/wx/bankout/add', params, (res) => {
                        this.setState({ loading: false });
                        if(res.code == Config.errorCode.success) {
                            browserHistory.goBack();
                        } else {
                            message.error(res.msg)
                        }
                    })
                }
            }
		});
    }
    // 获取input值
    changeInput = (inp, e) => {
        let { pointInfo } = this.state;
        let point = { };
        if(pointInfo) {
            point = {
                bltName: pointInfo.bltName || '',
                citiesId : pointInfo.citiesId || '',
                bltAddress: pointInfo.bltAddress || '',
                bltStarttime: pointInfo.bltStarttime || '',
                bltEndtime: pointInfo.bltEndtime || '',
                telephone: pointInfo.telephone || '',

            };
        }
        if(!pointInfo) pointInfo = {};
        if(inp == 'bltName') point.bltName = e.target.value;
        if(inp == 'citiesId') point.citiesId = e.join(",");
        if(inp == 'bltAddress') {
            this.setState({
                defaultAddress: e.target.value
            })
        };
        if(inp == 'bltStarttime') point.bltStarttime = e.target.value;
        if(inp == 'bltEndtime') {
            this.setState({
                defaultBltEndtime: e.target.value
            })
        };
        if(inp == 'telephone') point.telephone = e.target.value;

    }
    // 获取input值
    changePut = (e, id) => {
        if(id == 'bltAddress'){
            this.setState({
                defaultAddress: e.target.value
            })
        }
        if(id == 'bltEndtime'){
            this.setState({
                defaultBltEndtime: e.target.value
            })
        }
    }
	render() {
        const {  sysDictItems } = this.props;
        if( sysDictItems.ssq && sysDictItems.ssq.length > 0 ) {
            var newArray = [];
            for (var i = 0; i < sysDictItems.ssq.length ; i++){
                newArray.push({label:sysDictItems.ssq[i].ddText,value:sysDictItems.ssq[i].ddValue,children:[]})
                if( sysDictItems.ssq[i].dictDTOS && sysDictItems.ssq[i].dictDTOS.length > 0){
                    for (var j = 0; j < sysDictItems.ssq[i].dictDTOS.length ; j++){
                        newArray[i].children.push({label:sysDictItems.ssq[i].dictDTOS[j].ddText,value:sysDictItems.ssq[i].dictDTOS[j].ddValue,children:[]})
                        // newArray[i].children[j].children.push({value:sysDictItems.ssq[i].dictDTOS[j].ddText,label:sysDictItems.ssq[i].dictDTOS[j].ddValue,children:[]})
                        if( sysDictItems.ssq[i].dictDTOS[j].dictDTOS && sysDictItems.ssq[i].dictDTOS[j].dictDTOS.length > 0){
                            for (var k = 0; k < sysDictItems.ssq[i].dictDTOS[j].dictDTOS.length ; k++){
                                if(newArray[i].children.length > 0){
                                    newArray[i].children[j].children.push({label:sysDictItems.ssq[i].dictDTOS[j].dictDTOS[k].ddText,value:sysDictItems.ssq[i].dictDTOS[j].dictDTOS[k].ddValue})
                                }
                                // newArray[i].children[j].children.push({value:sysDictItems.ssq[i].dictDTOS[j].ddText,label:sysDictItems.ssq[i].dictDTOS[j].ddValue,children:[]})
                            }
                        }
                    }
                }
            }
        }
        let {bcrumbValue,button,pointInfo} = this.state;
        let code = this.props.params;

        if(!code) pointInfo = '';
        const bcrumb = [{
            'link': '/wechat/set/menu',
            'value': '微信公众号配置'
        }, {
            'link': null,
            'value': bcrumbValue
        }];
        const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
		    labelCol: {
		        xs: { span: 6 },
		        sm: { span: 6 }
		    },
		    wrapperCol: {
		    	xs: { span: 18 },
		        sm: { span: 18 }
		    }
        };
	    const tailFormItemLayout = {
		    wrapperCol: {
		        xs: {
		        	span: 24,
		        	offset: 0
		    	},
		        sm: {
		        	span: 14,
		        	offset: 6
		        }
		    }
        };
		return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="pointoperate-container">
                    <BcrumbItem bcrumb={bcrumb} />
                    <Form onSubmit={this.handleSubmit} className="handle-form" hideRequiredMark={true}>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="网点名称" hasFeedback>
                                    {getFieldDecorator('bltName', {initialValue: pointInfo && pointInfo.bltName, rules: [{required: true, message: Config.warnInfo.pointNull}]})(
                                        <Input placeholder="必填项" maxLength="25" onChange={this.changeInput.bind(this, 'bltName')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="联系方式" hasFeedback>
                                    {getFieldDecorator('telephone', {initialValue: pointInfo && pointInfo.telephone, rules: [{required: true, message: Config.warnInfo.telephoneNull}]})(
                                        <Input placeholder="必填项" maxLength="11" onChange={this.changeInput.bind(this, 'telephone')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="网点地址" hasFeedback>
                                <Col span={24}>
                                {
                                    pointInfo && pointInfo.citiesId ? getFieldDecorator('citiesId', {initialValue: pointInfo && pointInfo.citiesId.split(","), rules: [{required: true, message: Config.warnInfo.dotAddressNull}]})(
                                        <Cascader options={newArray} onChange={this.changeInput.bind(this, 'citiesId')}  placeholder="请选择" />
                                    ) : getFieldDecorator('citiesId', {rules: [{required: true, message: Config.warnInfo.dotAddressNull}]}) (
                                        <Cascader options={newArray} onChange={this.changeInput.bind(this, 'citiesId')}  placeholder="请选择" />
                                    )
                                }
                                </Col>
                                <Col span={24} className='point-adress'>
                                {
                                    pointInfo && pointInfo.bltAddress ? <Input placeholder="请输入" defaultValue={pointInfo.bltAddress}  onChange={this.changeInput.bind(this, 'bltAddress')} /> : <input className="input-bltAddress" placeholder="请输入" onChange={(e)=>this.changePut(e, 'bltAddress')}  />
                                }
                                </Col>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="营业时间" hasFeedback {...formItemLayout} >

                                        <Col span={11}>
                                            {getFieldDecorator('bltStarttime', {initialValue: pointInfo && pointInfo.bltStarttime, rules: [{required: true, message: Config.warnInfo.startTimeNull}]})(
                                                <Input  placeholder="必填项" maxLength="11" onChange={this.changeInput.bind(this, 'bltStarttime')} />
                                            )}
                                        </Col>
                                        <Col span={2}>
                                            <span className="middle-line"></span>
                                        </Col>
                                        <Col span={11}>
                                        {
                                            pointInfo && pointInfo.bltEndtime ? <Input  placeholder="必填项" defaultValue={pointInfo.bltEndtime} maxLength="11" onChange={this.changeInput.bind(this, 'bltEndtime')} /> :<input className="input-bltAddress" placeholder="请输入" onChange={(e)=>this.changePut(e, 'bltEndtime')}  />
                                        }
                                        </Col>

                                </FormItem>
                            </Col>

                        </Row>
                        <FormItem {...tailFormItemLayout}>
                            <Button className="handle-btn" type="primary" htmlType="submit"  size="large">{button}</Button>
                            <Button className="handle-btn cancel-btn" size="large" onClick={this.goBack}>取消</Button>
                        </FormItem>
                    </Form>
                </div>
            </Spin >
		);
	}
}

// 将 store 中的数据作为 props 绑定到 CustomerList 上
const mapStateToProps = (state, ownProps) => {
    let { Common } = state;
    return {
        loading: Common.loading,
        sysDictItems: Common.sysDictItems,

    }
}

// 将 action 作为 props 绑定到 CustomerList 上。
const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators({  getSysDict }, dispatch)
});

const PointOperateRedux = connect(mapStateToProps, mapDispatchToProps)(PointOperate); // 连接redux

const PointOperateForm = Form.create()(PointOperateRedux);

export default PointOperateForm;

