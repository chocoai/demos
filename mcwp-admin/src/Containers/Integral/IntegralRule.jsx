import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import { Spin, message, Input, Button, Form, Select, Row, Col } from 'antd';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import IconRemove from './../../Assets/Images/icon_remove_default.png';
import IntegralService from '../../Services/IntegralService'; // services层
import CommonService from '../../Services/CommonService'; // services层
import './style/integralRule.less';
import { browserHistory } from 'react-router';
const Option = Select.Option;
const FormItem = Form.Item;
// const RadioGroup = Radio.Group;

class Integral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            itemArr: [0],
            max:1,
            giftItem: [],//礼品列表
            // giftPrice: [],//礼品面值列表
            giftConfig: [],//礼品列表以及所需要的积分
        }
    }
    componentDidMount() {
        // 获取礼品字典值
        this.getDictItems({ code: 'czlx' })
        // 获取分享的设置信息
        this.getMarShareInfo()
    }
    // 获取礼品字典值
    async getDictItems(params) {
        const res = await CommonService.getDictItems(params);
        this.setState({
            giftItem: res.data.czlx || [],
            // giftPrice: res.data.czlx[0].dictDTOS || []
        })
    }
    //获取当前设置状态
    async getMarShareInfo() {
        const that = this;
        const res = await IntegralService.getShareConf();
        const giftLen = res.data.length;
        that.setState({
            giftConfig: res.data || [],
            itemArr: [...Array(giftLen || 1)].map((_, i) => i),
            max:giftLen||1
        })
    }
    async putMarShareInfo(params) {//修改分享规则
        const res = await IntegralService.putShareConf(params);
        if (res.code == Config.errorCode.success) {
            message.success('设置成功！');
            browserHistory.push('/integral');
        }

    }
    onSave = () => {//保存
        const that = this;
        const { giftItem } = this.state
        that.props.form.validateFieldsAndScroll(async (err, values) => {
            values.shareConsumerConfigDTOS=values.shareConsumerConfigDTOS.filter(item=>item!='')
            let params = Config.serializeObjects(values);
            if (!err) {
                // 是否奖品重复设置
                let tmpValue = values
                let giftConfig = tmpValue.shareConsumerConfigDTOS.map(i => { delete i.consumerScore; return JSON.stringify(i) })
                // 如果存在重复
                if (giftConfig.length !== [...new Set(giftConfig)].length) {
                    let result = JSON.parse(giftConfig.filter(i => giftConfig.indexOf(i) != giftConfig.lastIndexOf(i))[0])
                    let gift = giftItem.filter(i => i.ddValue == result.consumerType)[0]
                    let score = gift.dictDTOS.filter(i => i.ddValue == result.consumerMoney)[0]
                    return message.error(`${gift.ddText}${score.ddText}重复设置`)
                }
                this.putMarShareInfo(params)
            }
        })
    }
    onExit() {
        browserHistory.push('/integral');
    }
    // 改变礼品类型
    giftChange(value, index) {
        let { giftItem, giftConfig } = this.state;
        if (giftConfig.length) {
            giftConfig[index].consumerType = value;
        } else {
            giftConfig.push({ consumerType: value })
        }
        let data = giftItem.filter((item, index) => item.ddValue == value)
        this.setState({
            // giftPrice: data[0].dictDTOS,
            giftConfig: giftConfig
        })
    }
    // 加减礼品
    giftConfigCal(key,itemDelete) {
        let max = this.state.max;
        if (key === 'add') {
            this.setState({
                itemArr: [...this.state.itemArr, max],
                giftConfig: [...this.state.giftConfig, {}],
                max: max + 1
            })
        }
        if (key === 'remove') {
            this.setState({
                itemArr: [...this.state.itemArr.filter((item, index) => item != itemDelete)],
                // giftConfig: [...this.state.giftConfig.filter((item, index) => index != indexs)],
            })
        }
    }
    render() {
        const that = this;
        const { loading, giftItem, giftConfig, itemArr } = this.state;
        const { getFieldDecorator } = that.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 17 }
        };
        const formItemLayoutWa = {
            wrapperCol: { span: 14 }
        };
        const formItemLayoutIn = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };

        const bcrumb = [{
            'link': '/integral',
            'value': '积分管理'
        }, {
            'link': null,
            'value': '积分设置',
        }];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="integralRule-container">
                    <BcrumbItem bcrumb={bcrumb} />
                    <div className='common-console-container integralRule-content'>
                        <div className='integralRule-box'>
                            <Form>
                                <div className="shareBox">
                                    <div className="shareBox-title" style={{ marginBottom: '10px' }}>
                                        <p className="shareBox-p">礼品设置</p>
                                    </div>
                                    {
                                        itemArr && itemArr.map((item, index) => (
                                            <div className="rowWarp" key={item}>
                                                <Row className='knife integral-row'>
                                                    <Col span={12}>
                                                        <Col span={12}>
                                                            <FormItem label="礼品" {...formItemLayout}>
                                                                {getFieldDecorator('shareConsumerConfigDTOS[' + item + '].consumerType', {
                                                                    initialValue: giftConfig && giftConfig[item] && giftConfig[item].consumerType && giftConfig[item].consumerType.toString(),
                                                                    rules: [{ required: true, message: '请选择' }],
                                                                })(

                                                                    <Select
                                                                        placeholder="请选择"
                                                                        onChange={(value) => this.giftChange(value, item)}
                                                                        getPopupContainer={trigger => trigger.parentNode}
                                                                        className="friend-input">
                                                                        {
                                                                            giftItem && giftItem.map((item, index) =>
                                                                                <Option value={item.ddValue} key={index}>{item.ddText}</Option>
                                                                            )
                                                                        }
                                                                    </Select>
                                                                )}
                                                            </FormItem>
                                                        </Col>
                                                        {giftConfig && giftConfig[item] && giftConfig[item].consumerType != 6 ? <Col span={12}>
                                                            <FormItem {...formItemLayoutWa}>
                                                                {getFieldDecorator('shareConsumerConfigDTOS[' + item + '].consumerMoney', {
                                                                    initialValue: giftConfig && giftConfig[item] && giftConfig[item].consumerMoney && giftConfig[item].consumerMoney.toString(),
                                                                    rules: [{ required: true, message: '请选择' }],
                                                                })(
                                                                    <Select
                                                                        placeholder="请选择"
                                                                        getPopupContainer={trigger => trigger.parentNode}
                                                                        className="friend-input">
                                                                        {
                                                                            giftItem && giftItem.filter(i => i.ddValue == giftConfig[item].consumerType)[0] && giftItem.filter(i => i.ddValue == giftConfig[item].consumerType)[0].dictDTOS.map((item, index) =>
                                                                                <Option value={item.ddValue} key={index}>{item.ddText}</Option>
                                                                            )
                                                                        }
                                                                    </Select>
                                                                )}
                                                            </FormItem>
                                                        </Col> : null}
                                                    </Col>
                                                    {giftConfig && giftConfig[item] && giftConfig[item].consumerType != 6 ?
                                                        <Col span={12}>
                                                            <FormItem label='兑换积分' {...formItemLayoutIn}>
                                                                {getFieldDecorator('shareConsumerConfigDTOS[' + item + '].consumerScore', {
                                                                    initialValue: giftConfig && giftConfig[item] && giftConfig[item].consumerScore,
                                                                    rules: [{ required: true, message: '输入项不能为空' }, { validator: Validate.checkNumTypeNum1, message: '请输入正整数' }],
                                                                })(
                                                                    <Input autoComplete="off" style={{ width: '100%' }} placeholder="请输入" addonAfter="个" />
                                                                )}
                                                            </FormItem>
                                                        </Col> : <Col span={12}>
                                                            <FormItem label='兑换积分' {...formItemLayoutIn}>
                                                                {getFieldDecorator('shareConsumerConfigDTOS[' + item + '].consumerConfig', {
                                                                    initialValue: giftConfig && giftConfig[item] && giftConfig[item].consumerConfig,
                                                                    rules: [{ required: true, message: '输入项不能为空' }, { validator: Validate.checkNumRangeOne, message: '请输入0.1到100的数' }],
                                                                })(
                                                                    <Input autoComplete="off" style={{ width: '100%' }} placeholder="请输入" addonAfter="%" />
                                                                )}
                                                            </FormItem>
                                                        </Col>}
                                                    {index > 0 ? <div className="reduce-icon">
                                                        <img src={IconRemove} onClick={() => that.giftConfigCal('remove',item)} alt="icon-remove" />
                                                    </div> : null}
                                                </Row>
                                            </div>
                                        ))
                                    }

                                    <div className="addAward-icon" onClick={() => that.giftConfigCal('add',0)}>+添加礼品</div>
                                </div>
                            </Form>

                            <Button className='button' type="primary" onClick={this.onSave}>保存设置</Button>
                            <Button className='button button-exit' onClick={() => this.onExit()} >取消</Button>
                        </div>
                    </div>
                </div>
            </Spin>
        )
    }
}
const IntegralRule = Form.create()(Integral);
export default IntegralRule;
