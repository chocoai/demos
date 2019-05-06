import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import './style/editManageOther.less';

import { Form, Row, Col } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑其他经营信息其他经营
 * @Author: 赵俊
 * @Date:   2017-05-31 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-05-31
 */
class EditManageOther extends Component {
        constructor(props) {
        super(props);
        this.state = {
            wordCountOne: props.loanBusinessOth && props.loanBusinessOth.hisAccrue?props.loanBusinessOth.hisAccrue.length:0,
            wordCountTwo: props.loanBusinessOth && props.loanBusinessOth.busiMarket?props.loanBusinessOth.busiMarket.length:0,
            wordCountThree: props.loanBusinessOth && props.loanBusinessOth.financialInformation?props.loanBusinessOth.financialInformation.length:0
        }
    }

    componentWillMount() {
    }

    textareaChangeOne(e) {
        if ( e.target.value.length>256 ) {
            e.target.value = e.target.value.substr(0, 256);
            return;
        }
        this.setState({
            wordCountOne: e.target.value.length
        })
    }
    textareaChangeTwo(e) {
        if ( e.target.value.length>256 ) {
            e.target.value = e.target.value.substr(0, 256);
            return;
        }
        this.setState({
            wordCountTwo: e.target.value.length
        })
    }
    textareaChangeThree(e) {
        if ( e.target.value.length>256 ) {
            e.target.value = e.target.value.substr(0, 256);
            return;
        }
        this.setState({
            wordCountThree: e.target.value.length
        })
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 16 }
        };
        const { loanBusinessOth } = this.props;
        return (
            <div className='editManageOther-container'>
                <Form>
                <p className='ipieces-subtitle'>其他经营情况</p>
                <Row>
                <Col span={12}>
                    <FormItem label="经营历史与资本积累" {...formItemLayout}>
                        <div className="descript-item">                                       
                        {getFieldDecorator('loanBusinessOthBasicDto.hisAccrue', {
                            initialValue: loanBusinessOth && loanBusinessOth.hisAccrue || '',
                            rules: [{ required: false, message: Validate.warnInfo.wordLen256, validator: Validate.checkWordLen256 }],
                        })(
                                <textarea className="des-content" placeholder="请输入" onChange={(e)=>this.textareaChangeOne(e)}></textarea>
                        )}
                            <p className="des-count">{this.state.wordCountOne}/256</p>
                        </div>
                    </FormItem>  
                </Col> 
                <Col span={12}>
                    <FormItem label={<span className='label-lines'>对经营者组织和市场情况现状的评价</span>} {...formItemLayout}>
                        <div className="descript-item">                                       
                            {getFieldDecorator('loanBusinessOthBasicDto.busiMarket', {
                                initialValue: loanBusinessOth && loanBusinessOth.busiMarket || '',
                                rules: [{ required: false, message: Validate.warnInfo.wordLen256, validator: Validate.checkWordLen256 }],
                            })(
                                <textarea className="des-content" placeholder="请输入" onChange={(e)=>this.textareaChangeTwo(e)}></textarea>
                            )}
                            <p className="des-count">{this.state.wordCountTwo}/256</p>
                        </div>
                    </FormItem>  
                </Col> 
                <Col span={12}>
                    <FormItem label="对财务信息现状的评价" {...formItemLayout}>
                        <div className="descript-item">                                       
                            {getFieldDecorator('loanBusinessOthBasicDto.financialInformation', {
                                initialValue: loanBusinessOth && loanBusinessOth.financialInformation || '',
                                rules: [{ required: false,  message: Validate.warnInfo.wordLen256, validator: Validate.checkWordLen256 }],
                            })(
                                <textarea className="des-content" placeholder="请输入" onChange={(e)=>this.textareaChangeThree(e)}></textarea>
                            )}
                            <p className="des-count">{this.state.wordCountThree}/256</p>
                        </div>
                    </FormItem>  
                </Col> 
                </Row>     
                </Form>
            </div>
        )
    }
}

const pureEditManageOther = pureRender(EditManageOther);

export default pureEditManageOther;