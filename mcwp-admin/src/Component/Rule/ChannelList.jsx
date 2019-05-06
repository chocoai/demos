import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import './style/rule.less'
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';
import get from 'lodash.get';
import { Form, Row, Col, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class ChannelList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemArr: [...Array(props.len || 0)].map((_, i) => i),
            max: props.len || 0,
            thatData: props.channelList && props.channelList.length > 0 && props.channelList || [],
            disMode: [
                { ddText: '小组', ddValue: '1' },
                { ddText: '客户经理', ddValue: '2' },
            ],
            channelItemList: props.channelItemList
        }
    }
    componentWillMount() {
        let { channelItemList, thatData } = this.state;
        if (get(thatData[0], 'channel')) {
            thatData.forEach((data, index) => {
                channelItemList = channelItemList.map(i => {
                    if (data.channel.includes(i.ddValue)) i.disabled = index + ''
                    return i
                })
            })
        }

        // this.setState({
        //     channelItemList
        // })
    }
    ItemAdd = () => {
        let max = this.state.max;
        this.setState({
            itemArr: [...this.state.itemArr, max],
            thatData: [...this.state.thatData, {}],
            max: max + 1
        })
    }
    //删除
    ItemDelete = (itemDelete) => {
        let {thatData,channelItemList}=this.state;
        if(get(thatData[itemDelete],'channel')){
            channelItemList = channelItemList.map(i => {
                if (thatData[itemDelete].channel.includes(i.ddValue)) i.disabled = null
                return i
            })
        }
        this.setState({
            itemArr: [...this.state.itemArr.filter((item, index) => item != itemDelete)],
            thatData,
            channelItemList
        })
    }
    selectChange(value, index) {
        let { thatData } = this.state;
        thatData[index].value = [];
        this.props.form.setFieldsValue({
            ['loanChannelAllotConfigureBOS[' + index + '].value']: []
        });
        thatData[index].configType = value;
        this.setState({
            thatData: [...thatData]
        })
    }
    channelSelect(value, index) {
        let { channelItemList } = this.state;
        channelItemList = channelItemList.map(i => {
            if (value==i.ddValue) i.disabled = index + ''
            return i
        })
        this.setState({
            channelItemList,
        })

    }
    channelDeselect(value) {
        let { channelItemList } = this.state;
        channelItemList = channelItemList.map(i => {
            if (value==i.ddValue) i.disabled = null
            return i
        })
        this.setState({
            channelItemList,
        })
    }
    channelChange(value,index){
        let {thatData}=this.state;
        thatData[index].channel=value;
        this.setState({
            thatData,
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 14 }
        };
        const formItemLayout3 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        };
        const formItemLayout2 = {
            wrapperCol: { span: 18 }
        };
        const { itemArr, thatData, disMode, channelItemList } = this.state;
        const { disTeamList, taskPerson } = this.props
        return (
            <div className='rule-detail-container'>
                <Form>
                    <p className='rule-formula'>渠道分配配置</p>
                        <div style={{marginBottom:'10px',paddingLeft:'20px'}}>【规则说明：客户扫渠道生成的二维码进件，会将这笔进件按照客户经理（小组内所有客户经理）业务量平均分配给配置的客户经理（小组）】</div>
                    {
                        itemArr.map((item, index) => (
                            <div key={item} style={{ padding: '0 10px' }}>
                                <Row className='trend-row-border channel-row' type="flex" justify="start">
                                    <Col span={12}>
                                        <FormItem label="渠道" {...formItemLayout}>
                                            {getFieldDecorator('loanChannelAllotConfigureBOS[' + item + '].channel', {
                                                initialValue: get(thatData[item], 'channel') || undefined,
                                                rules: [{ required: true, message: '请选择' }],
                                            })(
                                                <Select getPopupContainer={trigger => trigger.parentNode}
                                                    mode={'multiple'} optionFilterProp={'label'}
                                                    onSelect={(value) => { this.channelSelect(value, item) }}
                                                    onDeselect={(value) => { this.channelDeselect(value) }}
                                                    onChange={(value)=>{this.channelChange(value,item)}}
                                                    className="friend-input" placeholder="请选择">
                                                    {
                                                        channelItemList.map((items) =>
                                                            <Option key={items.ddValue} value={items.ddValue} disabled={items.disabled && items.disabled != item} label={items.ddText}>{items.ddText}</Option>
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    {<Col span={12}>
                                        <Col span={12}>
                                            <FormItem label="配置人员" {...formItemLayout3}>
                                                {getFieldDecorator('loanChannelAllotConfigureBOS[' + item + '].configType', {
                                                    initialValue: get(thatData[item], 'configType') || undefined,
                                                    rules: [{ required: true, message: '请选择' }],
                                                })(
                                                    <Select getPopupContainer={trigger => trigger.parentNode}
                                                        className="friend-input" onChange={(value) => this.selectChange(value, item)} placeholder="请选择">
                                                        {
                                                            disMode.map((item) =>
                                                                <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                                            )
                                                        }
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...formItemLayout2}>
                                                {getFieldDecorator('loanChannelAllotConfigureBOS[' + item + '].value', {
                                                    initialValue: get(thatData[item], 'value') || undefined,
                                                    rules: [{ required: true, message: '请选择' }],
                                                })(
                                                    <Select getPopupContainer={trigger => trigger.parentNode}
                                                        mode={'multiple'} optionFilterProp={'label'} className="friend-input" placeholder="请选择">
                                                        {
                                                            get(thatData[item], 'configType') == 1 ?
                                                                disTeamList.map((item) =>
                                                                    <Option key={item.code} value={item.code} label={item.teamName}>{item.teamName}</Option>
                                                                ) : get(thatData[item], 'configType') == 2 ? taskPerson.map((item) =>
                                                                    <Option key={item.code} value={item.code} label={item.name}>{item.name}</Option>) : null
                                                        }
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Col>}
                                    <img className='ipieces-delete' src={ipiecesDelete} alt='delete' onClick={() => this.ItemDelete(item)} />
                                </Row>
                            </div>))
                    }
                    <div className='ipieces-add' onClick={this.ItemAdd}>
                        <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                        <span className='ipieces-add-detail'>添加规则</span>
                    </div>
                </Form>
            </div>
        )
    }
}

const pureChannelList = pureRender(ChannelList);

export default pureChannelList;
