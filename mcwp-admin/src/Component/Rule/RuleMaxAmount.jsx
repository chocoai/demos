import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import { browserHistory } from 'react-router';
import { Form, Input, Row, Col} from 'antd';
import './style/rule.less'
const FormItem = Form.Item;
class RuleMaxAmount extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentWillMount() {
    }
    goBack = () => {
        browserHistory.goBack();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 6 }
        };
        const { maxAmountList } = this.props
        return (
            <div className="rule-detail-container">
                <Form>
                    <p className='rule-formula'>房抵贷最高可贷额度配置</p>
                    {maxAmountList && maxAmountList.map((item, index) =>
                        <Row className='trend-row max-row' type="flex" justify="start" key={index}>
                            <Col span={9}>
                                <FormItem label={item.processName} {...formItemLayout}>
                                    {getFieldDecorator('list[' + index + '].value', {
                                        initialValue: item.value,
                                        rules: [{ required: true, message: '请输入' }, { validator: Validate.checkNumRangeOne, message: "请输入0.1到100的数" }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="%" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={0}>
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator('list[' + index + '].itemId', {
                                        initialValue: item.itemId,
                                    })(
                                        <Input autoComplete="off" placeholder="请输入"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    )}

                </Form>
            </div>
        )
    }
}

const pureRuleMaxAmount = pureRender(RuleMaxAmount);
export default pureRuleMaxAmount;