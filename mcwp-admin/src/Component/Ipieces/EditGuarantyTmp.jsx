import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import './style/editComGuaranLoan.less';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';

import { message, Form, Input, Row, Col, Select, Switch } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
/**
 * 进件编辑抵质押信息
 * @Author: 钟观发
 * @Date:   2017-12-08
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-12-08
 */
class EditGuaranty extends Component {
        constructor(props) {
        super(props);
        this.state = {
            value:'',
            loanPledgeInfos: [],
            wordCount: 0,
            relationship: '',
            fzRelationship: '',
            itemArr:[...Array(props.len || 1)].map((_, i)=> i),
            max: props.len || 1,
        }
    }
    componentDidMount() {
        this.getRelationship({code: 'fzysqrgx'});
    }
    //增加
    ipiecesItemAdd = () => {
        let max = this.state.max;
        this.setState({
            'itemArr': [...this.state.itemArr, max],
            max: max + 1
        })
    }
    //删除
    ipiecesItemDelete = (itemDelete) => {
        this.setState({
            'itemArr': [...this.state.itemArr.filter((item,index)=>item != itemDelete)],
        })
    }
    getRelationship (params) {
        Config.get('/v1/sys/dict/items', params, (res) => {
            if(res.code == Config.errorCode.success) {
                this.setState({
                    relationship: res.data && res.data.fzysqrgx
                })
         	} else {
                message.error(res.msg);
         	}
        });
    }
    switchBtn = (checked, item, type) => {
        if (!checked) {
            if( type == 'hasLoan' ) {
                this.props.form.setFieldsValue({
                    ['loanPledgeInfos['+ item +'].pledgeStatus']: '',
                });
            }
        }
    }
    textareaChange(e) {
        if ( e.target.value.length>256 ) {
            e.target.value = e.target.value.substr(0, 256);
            return;
        }
        this.setState({
            wordCount: e.target.value.length
        })
    }

    textareaChangeThree(e) {
        if ( e.target.value.length > 100 ) {
            e.target.value = e.target.value.substr(0, 100);
            return;
        }
        // this.setState({
        //     wordCountThree: e.target.value.length
        // })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        };
        const formItemLayoutMore = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        };
        const { relationship } = this.state;
        const { loanPledgeInfos } = this.props;

        return (
            <div className='editComGuaranLoan-container'>
                <Form>
                {
                    this.state.itemArr.map((item,index)=>(
                    <div key={item}>
                        <div className='ipieces-subtitle-container'>
                            <p className='ipieces-subtitle'>抵质押{index+1}信息 </p>
                        </div>
                        {/* <FormItem>
                            {getFieldDecorator('loanPledgeInfos[' + item + '].pledgeType', {
                                initialValue: 1,
                            })(
                                <p />
                            )}
                        </FormItem>   */}

                        <Row className='trend-row' type="flex" justify="start">
                            <Col span={12}>
                                <FormItem label="抵质押物名称" {...formItemLayout}>
                                    {getFieldDecorator('loanPledgeInfos[' + item + '].pledgeName', {
                                        initialValue: loanPledgeInfos && loanPledgeInfos[item] && loanPledgeInfos[item].pledgeName,
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25}],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入"  />
                                    )}
                                </FormItem>
                            </Col>
                            {
                                loanPledgeInfos && loanPledgeInfos[item] && loanPledgeInfos[item].pledgeType ?
                                <Col span={12}>
                                    <FormItem label="类型" {...formItemLayout}>
                                        {getFieldDecorator('loanPledgeInfos[' + item + '].pledgeType', {
                                            initialValue: loanPledgeInfos && loanPledgeInfos[item] && loanPledgeInfos[item].pledgeType,
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <Select
                                                allowClear = {true}
                                                placeholder="请选择"
                                                getPopupContainer={trigger => trigger.parentNode}
                                            >
                                                <Option value="1">抵押物</Option>
                                                <Option value="2">质押物</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col> :
                                <Col span={12}>
                                <FormItem label="类型" {...formItemLayout}>
                                    {getFieldDecorator('loanPledgeInfos[' + item + '].pledgeType', {
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Select
                                            allowClear = {true}
                                            placeholder="请选择"
                                            getPopupContainer={trigger => trigger.parentNode}
                                        >
                                            <Option value="1">抵押物</Option>
                                            <Option value="2">质押物</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            }
                            <Col span={12}>
                                <FormItem label="抵押人姓名" {...formItemLayout}>
                                    {getFieldDecorator('loanPledgeInfos[' + item + '].name', {
                                        initialValue: loanPledgeInfos && loanPledgeInfos[item] && loanPledgeInfos[item].name,
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25}],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="与申请人关系" {...formItemLayout}>
                                    {getFieldDecorator('loanPledgeInfos[' + item + '].relationship', {
                                        initialValue:loanPledgeInfos && loanPledgeInfos[item] && loanPledgeInfos[item].relationship||undefined,
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen10, validator: Validate.checkWordLen10}],
                                    })(
                                        <Select
                                            allowClear = {true}
                                            placeholder="请选择"
                                            getPopupContainer={trigger => trigger.parentNode}
                                        >
                                            {
                                                relationship && relationship.map((item, index) => (
                                                    <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                                ))
                                            }
                                        </Select>
                                        // <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="面积" {...formItemLayout}>
                                    {getFieldDecorator('loanPledgeInfos[' + item + '].houseSize', {
                                        initialValue: loanPledgeInfos && loanPledgeInfos[item] && loanPledgeInfos[item].houseSize,
                                        rules: [{ required: false, message: Validate.warnInfo.numberLenTtwo, validator: Validate.checkNumLenTtwo}],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入"  addonAfter="㎡"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="房龄" {...formItemLayout}>
                                    {getFieldDecorator('loanPledgeInfos[' + item + '].houseAge', {
                                        initialValue: loanPledgeInfos && loanPledgeInfos[item] && loanPledgeInfos[item].houseAge,
                                        rules: [{ required: false, message: Validate.warnInfo.numDecimalOne, validator: Validate.checkNumDecimalOne}],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="年" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="房屋位置" {...formItemLayout}>
                                    {getFieldDecorator('loanPledgeInfos[' + item + '].address', {
                                        initialValue: loanPledgeInfos && loanPledgeInfos[item] && loanPledgeInfos[item].address,
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25}],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入"  />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="权证号" {...formItemLayout}>
                                    {getFieldDecorator('loanPledgeInfos[' + item + '].warrentNumber', {
                                        initialValue: loanPledgeInfos && loanPledgeInfos[item] && loanPledgeInfos[item].warrentNumber,
                                        rules: [{ required: false, message: ''}, {message: Validate.warnInfo.wordLen20, validator: Validate.checkWordLen20}],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入"  />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="评估价值" {...formItemLayout}>
                                    {getFieldDecorator('loanPledgeInfos[' + item + '].houseTotal', {
                                        initialValue: loanPledgeInfos && loanPledgeInfos[item] && loanPledgeInfos[item].houseTotal,
                                        rules: [{ required: true, message: Validate.warnInfo.numberLenEtwo, validator: Validate.checkNumLenEtwo }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="万元" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="房屋是否已抵押给其他银行或个人" {...formItemLayoutMore}>
                                    {getFieldDecorator('loanPledgeInfos.[' + item + '].pledgeStatus', {
                                        valuePropName: 'checked',
                                        initialValue: loanPledgeInfos && loanPledgeInfos[item] && loanPledgeInfos[item].pledgeStatus,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, item, 'hasLoan')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="备注" {...formItemLayout}>
                                    {getFieldDecorator('loanPledgeInfos[' + item + '].remark', {
                                        initialValue: loanPledgeInfos && loanPledgeInfos[item] && loanPledgeInfos[item].remark || '',
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen256, validator: Validate.checkWordLen256}],
                                    })(
                                        <textarea className="des-content" placeholder="请输入"></textarea>
                                    )}
                                </FormItem>
                            </Col>
                            {
                                item != 0?
                                <img className='ipieces-delete' src={ipiecesDelete} alt='delete' onClick={()=>this.ipiecesItemDelete(item)} />
                                : null
                            }
                        </Row>
                    </div>))
                }
                    <div className='ipieces-add' onClick={this.ipiecesItemAdd}>
                        <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                        <span className='ipieces-add-detail'>添加抵质押</span>
                    </div>
                </Form>
            </div>
        )
    }
}

const pureEditGuaranty = pureRender(EditGuaranty);

export default pureEditGuaranty;
