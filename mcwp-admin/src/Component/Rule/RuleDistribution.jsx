import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
// import { Validate } from '../../Config/Validate';
import { Form, Row, Col, Select, Modal } from 'antd';
import addIcon from './../../Assets/Images/icon_add_default.png';
import deleteIcon from './../../Assets/Images/icon_remove.png';
import './style/rule.less'
const FormItem = Form.Item;
const Option = Select.Option;
class RuleDistribution extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemArr: [...Array(props.len || 1)].map((_, i) => i),
            max: props.len || 1,
            newData: props.distributionList.length > 0 && JSON.parse(JSON.stringify(props.distributionList)) || [],
        }
    }
    // 
    selectChange(value, index) {
        let newData = this.state.newData
        newData[index].configType = value
        this.setState({
            newData: newData
        })
    }
    addRule = () => {
        // const { itemArr } = this.state;
        let max = this.state.max;
        // if (itemArr.length == 4) {
        //     message.warning("最多添加四条规则！")
        // } else {
            this.setState({
                itemArr: [...this.state.itemArr, max],
                newData: [...this.state.newData, { configType: undefined, value: null }],
                max: max + 1
            })
        // }
    }
    delRule(delindex) {
        const that = this;
        let confirm = Modal.confirm;
        confirm({
            title: '提示',
            content: '删除后将改变进件的分配规则，确认要删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {

                that.setState({
                    itemArr: [...that.state.itemArr.filter((item, index) => index != delindex)],
                    newData: [...that.state.newData.filter((item, index) => index != delindex)],
                })
            }
        });

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { itemArr, newData } = this.state;
        const { disRuleList, disTeamList } = this.props
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 8 }
        };
        const arr = ['一', '二', '三', '四'];
        return (
            <div className="rule-detail-container">
                <Form>
                    <p className='rule-formula'>分配规则配置</p>
                    <Row className='trend-row max-row' type="flex" justify="start">
                        {itemArr && itemArr.map((item, index) =>
                            <Col span={19} style={{ marginBottom: 30 }} key={index}>
                                {index < 1 ? <FormItem label={'第' + arr[index] + '规则'} {...formItemLayout}>
                                    {getFieldDecorator('loanAllotConfigureBOList[' + index + '].configType', {
                                        initialValue: newData && newData[index] && newData[index].configType,
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            onChange={(value) => this.selectChange(value, index)}
                                            getPopupContainer={trigger => trigger.parentNode}
                                            className="friend-input">
                                            {
                                                disRuleList && disRuleList.map((item, index) =>
                                                    <Option value={item.type} key={item.type}>{item.name}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                    <div className="oper-box">
                                        {(itemArr && itemArr.length == index + 1) ? <div className="add-icon" onClick={this.addRule}>
                                            <img src={addIcon} alt="" />
                                        </div> : null}
                                    </div>
                                </FormItem> : <FormItem label={'第' + arr[index] + '规则'} {...formItemLayout}>
                                        {getFieldDecorator('loanAllotConfigureBOList[' + index + '].configType', {
                                            initialValue: newData && newData[index] && newData[index].configType,
                                            rules: [{ required: true, message: '请选择' }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                onChange={(value) => this.selectChange(value, index)}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                className="friend-input">
                                                {
                                                    disRuleList && disRuleList.map((item, index) =>
                                                        <Option value={item.type} key={item.type}>{item.name}</Option>
                                                    )
                                                }
                                            </Select>
                                        )}
                                        {index==3?<div className="oper-box">
                                            <div className="del-icon" onClick={() => this.delRule(index)}>
                                                <img src={deleteIcon} alt="" />
                                            </div>

                                        </div>:<div className="oper-box">
                                            {(itemArr && itemArr.length == index + 1) ? <div className="add-icon" onClick={this.addRule}>
                                                <img src={addIcon} alt="" />
                                            </div> : null}
                                            <div className="del-icon" onClick={() => this.delRule(index)}>
                                                <img src={deleteIcon} alt="" />
                                            </div>

                                        </div>}
                                        

                                    </FormItem>}

                                {(newData && newData[index] && newData[index].configType == '2') || (newData && newData[index] && newData[index].configType == '4') ? <FormItem label="配置小组" {...formItemLayout}>
                                    {getFieldDecorator('loanAllotConfigureBOList[' + index + '].value', {
                                        initialValue: newData && newData[index] && newData[index].value||undefined,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            mode="multiple"
                                            allowClear
                                            getPopupContainer={trigger => trigger.parentNode} className="friend-input">
                                            {
                                                disTeamList && disTeamList.map((item, index) =>
                                                    <Option value={item.code} key={item.code}>{item.teamName}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem> : null}

                                <p className='rule-tip'>{disRuleList && newData && disRuleList[index] && newData[index] && newData[index].configType && disRuleList[index].type ? disRuleList.filter((i) => i.type == newData[index].configType)[0].desc : ''}</p>
                            </Col>
                        )}
                    </Row>
                </Form>
            </div>

        )
    }
}

const pureRuleDistribution = pureRender(RuleDistribution);
export default pureRuleDistribution;