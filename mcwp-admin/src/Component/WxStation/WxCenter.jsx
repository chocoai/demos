import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import pureRender from 'pure-render-decorator';
import { Form, Row, Col ,Checkbox} from 'antd';
const FormItem = Form.Item;
class WxCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        let {centerData,wxmk}=this.props
        const formItemLayout = {
            labelCol: { span: 2},
            wrapperCol: { span: 14 }
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Row className='wx-center-row'>
                    <Col>
                        <FormItem label="模块" {...formItemLayout}>
                            {getFieldDecorator('wxmk', {
                                initialValue: wxmk,
                                rules: [{ required: true, message: '请选择' }],
                            })(
                                <Checkbox.Group
                                    options={centerData} >
                                </Checkbox.Group>
                            )}
                        </FormItem>
                    </Col>
                </Row>

            </Form>
        )
    }
}

const pureWxCenter = pureRender(WxCenter);
export default pureWxCenter;