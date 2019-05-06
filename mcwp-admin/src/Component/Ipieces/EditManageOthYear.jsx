import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import './style/editManageOther.less';

import { Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑其他经营信息投资与开支情况
 * @Author: 赵俊
 * @Date:   2017-05-31 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-25
 */
class EditManageOthYear extends Component {
        constructor(props) {
        super(props);
        this.state = {
            num:[1,2,3,4],
            title:[
                '过去12个月内的投资',
                '过去12个月内的开支',
                '未来12个月内的投资',
                '未来12个月内的开支',
            ]
        }
    }

    componentWillMount() {
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 16 }
        };
        const { loanBusinessYearFins } = this.props;
        return (
            <div className='editManageOther-container'>
                <Form>
                <p className='ipieces-subtitle'>投资与开支情况</p>
                {
                    this.state.title.map((item,index)=>(
                        <Row className='main-business' key={index}>  
                            {getFieldDecorator('loanBusinessYearFinDtos[' + index + '].ftype', {
                                initialValue: index + 1 ,
                                rules: [{ required: false, message: '' }],
                            })(
                                <p>{item}</p>
                            )}
                            <Col span={12}>
                                <FormItem label="业务方面" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessYearFinDtos[' + index + '].business', {
                                        initialValue: loanBusinessYearFins && loanBusinessYearFins[index] &&  loanBusinessYearFins[index].business ,
                                        rules: [{ required: true, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>    
                            </Col>      
                            <Col span={12}>
                                <FormItem label="私人方面" {...formItemLayout}>
                                    {getFieldDecorator('loanBusinessYearFinDtos[' + index + '].person', {
                                        initialValue: loanBusinessYearFins && loanBusinessYearFins[index] && loanBusinessYearFins[index].person ,
                                        rules: [{ required: true, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>    
                            </Col>      
                        </Row>  
                    ))
                }
                </Form>
            </div>
        )
    }
}

const pureEditManageOthYear = pureRender(EditManageOthYear);

export default pureEditManageOthYear;