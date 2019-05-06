import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import moment from 'moment';
import './style/editActivity.less';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';

import { Form, Input, Row, Col, Select, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

/**
 * 活动管理编辑奖项
 * @Author: 钟观发
 * @Date:   2017-12-26
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-12-26
 */
class ActivityPrize extends Component {
    constructor(props) {
      super(props);
      this.state = {
          itemArr:[...Array(props.len || 1)].map((_, i)=> i),
          max: props.len || 1,
          thatData: props.prizeList && props.prizeList.length > 0 && props.prizeList|| [[]]
      }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this.forceUpdate(()=>this.props.calculateTotalProb())
    }
    ipiecesItemAdd = () => {
        let max = this.state.max;
        this.setState({ 
            'itemArr': [...this.state.itemArr, max],
            'thatData': [...this.state.thatData, []],
            max: max + 1                
        })
    }
    //删除
    ipiecesItemDelete = (itemDelete) => {
        this.setState({ 
            'itemArr': [...this.state.itemArr.filter((item,index)=>item != itemDelete)],
            'thatData': [...this.state.thatData.filter((item,index)=>item != itemDelete)]
        })
        this.forceUpdate(()=>this.props.calculateTotalProb())
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
    changePrizeType = (value,item) => {
        let thatData = this.state.thatData
        thatData[item].prizeType = value
        this.setState({
            thatData: thatData
        })
    }
    changeprizeChance = (e) => {
      const value = e.target.value;
      if (parseFloat(value) != value || value > 100 || value < 0) return;
      this.forceUpdate(()=>this.props.calculateTotalProb())
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        const formItemLayoutMore = {
            labelCol: { span: 10 },
            wrapperCol: { span: 12 }
        };
        const formItemLayoutAll = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 }
        };
        const { itemArr, thatData } = this.state;
        const { prizeList, activeStatus } = this.props;
        let dateGet = [];
        if(prizeList && prizeList.length>0){
            prizeList.map((item,index)=>{
                if (item.prizeTime) {
                    let arr = item.prizeTime.split(',');
                    dateGet[index] = [];
                    dateGet[index].push(moment(parseInt(arr[0])));
                    dateGet[index].push(moment(parseInt(arr[1])));
                } else {
                    dateGet[index] = [null,null];
                }
            })
        }
        console.log(dateGet)
        return (
            <div className='editActivity-container'>
                <Form>  
                {
                    itemArr.map((item,index)=>(
                    <div key={index}>
                        <Row className='trend-row-border' type="flex" justify="start">
                          <FormItem label="奖品code" {...formItemLayout} style={{display: 'none'}}>
                            {getFieldDecorator('prizeList[' + index + '].code', {
                                initialValue: prizeList[item] && prizeList[item].code,
                                rules: [],
                            })(
                                <Input disabled={ activeStatus == 2 || activeStatus == 3  || activeStatus == 4 ? true : false } autoComplete="off" addonAfter="%" placeholder="请输入"/>
                            )}
                          </FormItem>   
                            <Col span={12} className="reset-addonAfter">
                                <FormItem label="奖项名称" {...formItemLayout}>
                                    {getFieldDecorator('prizeList[' + index + '].awardName', {
                                        initialValue: prizeList[item] && prizeList[item].awardName,
                                        rules: [{ required: activeStatus != 1, message: '奖项名称不能为空'}, {validator: Validate.checkWordLen8, message: Validate.warnInfo.wordLen8}],
                                    })(
                                        <Input disabled={ activeStatus == 2 || activeStatus == 3  || activeStatus == 4 ? true : false } autoComplete="off" addonAfter="%" placeholder="请输入"/>
                                    )}
                                </FormItem>    
                            </Col>
                            <Col span={12}>
                                <Col span={14} style={{marginTop:'2px'}}>
                                    <FormItem label="奖品类型" {...formItemLayoutMore}>
                                        {getFieldDecorator('prizeList[' + index + '].prizeType', {
                                            initialValue: prizeList[item] && prizeList[item].prizeType,
                                            rules: [{ required: activeStatus != 1, message: Validate.warnInfo.prizeType}],
                                        })(
                                            <Select getPopupContainer={trigger => trigger.parentNode} disabled={ activeStatus == 2 || activeStatus == 3 || activeStatus == 4 ? true : false } className="friend-input" onChange={(e)=>this.changePrizeType(e,item)} placeholder="请选择">
                                                <Option value="3">积分</Option>
                                                <Option value="2">礼品</Option>
                                            </Select>
                                        )}
                                    </FormItem>    
                                </Col>
                                {
                                    thatData && thatData[item] && thatData[item].prizeType == 3 ?
                                        <Col span={8}>
                                        <FormItem  {...formItemLayoutAll}>
                                            {getFieldDecorator('prizeList[' + index + '].prizeAmount', {
                                                initialValue: prizeList[item] && prizeList[item].prizeAmount,
                                                rules: [{ required: false, message: ''}, {validator: Validate.checkNumType, message: Validate.warnInfo.numType}],
                                            })(
                                                <Input disabled={ activeStatus == 2 || activeStatus == 3 || activeStatus == 4 ? true : false } autoComplete="off" addonAfter='个' placeholder="请输入积分个数"/>
                                            )}
                                        </FormItem>    
                                    </Col> : null
                                }
                            </Col>
                            <Col span={12} className="reset-addonAfter">
                                <FormItem label="奖品名称" {...formItemLayout}>
                                    {getFieldDecorator('prizeList[' + index + '].prizeName', {
                                        initialValue: prizeList[item] && prizeList[item].prizeName,
                                        rules: [{ required: activeStatus != 1, message: '奖品名称不能为空'}, {validator: Validate.checkWordLen15, message: Validate.warnInfo.wordLen15}],
                                    })(
                                        <Input disabled={ activeStatus == 2 || activeStatus == 3 || activeStatus == 4 ? true : false } autoComplete="off" addonAfter="%" placeholder="请输入" />
                                    )}
                                </FormItem>    
                            </Col>  
                            <Col span={12}>
                                <FormItem label="奖品数量" {...formItemLayout}>
                                    {getFieldDecorator('prizeList[' + index + '].prizeNum', {
                                        initialValue: prizeList[item] && prizeList[item].prizeNum,
                                        rules: [{ required: activeStatus != 1, message: '奖品数量不能为空'}, {validator: Validate.checkNumberLen6, message: Validate.warnInfo.numLen6}],
                                    })(
                                        <Input disabled={ activeStatus == 3 ? true : false } autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>    
                            </Col> 
                            <Col span={12}>
                                <FormItem label="奖品中奖率" {...formItemLayout}>
                                    {getFieldDecorator('prizeList[' + index + '].prizeChance', {
                                        initialValue: prizeList[item] && prizeList[item].prizeChance,
                                        rules: [{ required: activeStatus != 1,message: '奖品中奖率不能为空'}, {validator: Validate.checkNumDecimalFull100, message: Validate.warnInfo.prizeChanceCounts}],
                                    })(
                                        <Input disabled={ activeStatus == 3 ? true : false } autoComplete="off" placeholder="请输入" addonAfter="%" onChange={(e)=>this.changeprizeChance(e)} />
                                    )}
                                </FormItem>    
                            </Col> 
                            <Col span={12}>
                                <FormItem label="兑奖期限" {...formItemLayout}>
                                    {getFieldDecorator('prizeList[' + index + '].prizeTime', {
                                        initialValue: dateGet[item],
                                        rules: [{ required: activeStatus != 1, message: Validate.warnInfo.prizeTime}],
                                    })(
                                        <RangePicker
                                            style={{ width: '100%' }}
                                            disabled={ activeStatus == 2 || activeStatus == 3  || activeStatus == 4 ? true : false }
                                            getCalendarContainer={trigger => trigger.parentNode}
                                        />
                                    )}
                                </FormItem>    
                            </Col>  
                            <Col span={12} className="reset-addonAfter">
                                <FormItem label="兑奖须知" {...formItemLayout}>
                                    {getFieldDecorator('prizeList[' + index + '].cashDesc', {
                                        initialValue: prizeList[item] && prizeList[item].cashDesc || '',
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen100, validator: Validate.checkWordLen100}],
                                    })(
                                        <textarea disabled={ activeStatus == 2 || activeStatus == 3 || activeStatus == 4 ? true : false } className="des-content" placeholder="请输入" ></textarea>
                                    )}
                                </FormItem>    
                            </Col>   
                            {
                                item > 1 && !(activeStatus == 2 || activeStatus == 3 || activeStatus == 4) ?
                                <img className='ipieces-delete' src={ipiecesDelete} alt='delete' onClick={()=>this.ipiecesItemDelete(item)} />
                                : null
                            }
                        </Row>
                    </div>))
                }
                    { activeStatus == 2 || activeStatus == 3 || activeStatus == 4 || (itemArr && itemArr.length > 4) ? null : <div className='ipieces-add' onClick={this.ipiecesItemAdd}>
                    <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                    <span className='ipieces-add-detail'>添加奖项</span>
                </div> }
                </Form>
            </div>
        )
    }
}

const pureActivityPrize = pureRender(ActivityPrize);

export default pureActivityPrize;