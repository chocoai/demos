import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
// import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import './style/editActivity.less';
import ExplainImg from './../../Assets/Images/icon_explain.png';

import { Form, Input, Row, Col, Popover, Select  } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
// const RangePicker = DatePicker.RangePicker;

/**
 * 活动管理基础设置编辑
 * @Author: 钟观发
 * @Date:   2017-12-25
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-12-25
 */
class EditWinner extends Component {
        constructor(props) {
        super(props);
        this.state = {
            activityRemark: 0,
            partnerStatus: props.operateDrawConf && props.operateDrawConf.partnerStatus || '0',
            islimit: props.operateDrawConf && (props.operateDrawConf.islimit || props.operateDrawConf.islimit == 0) ? props.operateDrawConf.islimit : '1'
        }
    }
    componentWillMount() {
    }
    textareaChangeThree(e) {
        if ( e.target.value.length>256 ) {
            e.target.value = e.target.value.substr(0, 256);
        }
        this.setState({
            activityRemark: e.target.value.length
        })
    }
    changePartnerStatus = (value) => {
        this.setState({
            partnerStatus: value
        })
    }
    changeIslimit = (value) => {
        this.setState({
            islimit: value
        })
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
        const creContent = (
            <div className="creContent-container">
              <p>分享奖励：分享给好友或朋友圈。</p>
              <p>邀请奖励：每成功邀请一位好友，当天将额外获得一次抽奖机会。</p>
              <p>注：可设置当天最高额外抽奖机会，分享提示语仅在抽奖次数为零时提示，次数不为零时分享也会额外增加抽奖机会。</p>
            </div>
          );
        const { operateDrawConf, activeStatus, totalProb } = this.props;
        const { partnerStatus, islimit } = this.state;
        return (
            <div className='editActivity-container'>
                <Form>  
                    <Row className='trend-row' type="flex" justify="start">
                        <Col span={12}>
                            <Col span={14}>
                                <FormItem label="抽奖总次数" {...formItemLayoutMore}>
                                    {getFieldDecorator('operateDrawConf.islimit', {
                                        initialValue: operateDrawConf && (operateDrawConf.islimit || operateDrawConf.islimit == 0) && operateDrawConf.islimit.toString() || '1',
                                        rules: [{ required: false, message: ''}],
                                    })(
                                        <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={this.changeIslimit} disabled={ activeStatus == 3 ? true : false }>
                                            <Option value="1">限制</Option>
                                            <Option value="0">不限制</Option>
                                        </Select>
                                    )}
                                </FormItem>    
                            </Col> 
                            {
                                islimit == 1 ? 
                                <Col span={6}>
                                    <FormItem {...formItemLayoutAll}>
                                        {getFieldDecorator('operateDrawConf.drawTimes', {
                                            initialValue: operateDrawConf && operateDrawConf.drawTimes,
                                            rules: [{ required: activeStatus != 1, message: '抽奖总次数不能为空'}, {validator: Validate.checkNumDecimalFull100, message: Validate.warnInfo.moreDrawTimes}],
                                        })(
                                            <Input disabled={ activeStatus == 3 ? true : false } autoComplete="off" placeholder="请输入" addonAfter="次"/>
                                        )}
                                    </FormItem>    
                                </Col> : null 
                            }
                        </Col> 
                        <Col span={12}>
                            <FormItem label="每日抽奖次数" {...formItemLayout}>
                                {getFieldDecorator('operateDrawConf.drawTimeDate', {
                                    initialValue: operateDrawConf && operateDrawConf.drawTimeDate,
                                    rules: [{ required: activeStatus != 1, message: '每日抽奖次数不能为空'}, {validator: Validate.checkNumDecimalFull100, message: Validate.warnInfo.moreDrawTimes}],
                                })(
                                    <Input disabled={ activeStatus == 3 ? true : false } autoComplete="off" placeholder="请输入" addonAfter="次" />
                                )}
                            </FormItem>    
                        </Col> 
                        <Col span={12}>
                            <FormItem label="每人中奖次数" {...formItemLayout}>
                                {getFieldDecorator('operateDrawConf.winningTimes', {
                                    initialValue: operateDrawConf && operateDrawConf.winningTimes,
                                    rules: [{ required: activeStatus != 1, message: '每日抽奖次数不能为空'}, {validator: Validate.checkNumDecimalFull100, message: Validate.warnInfo.moreDrawTimes}],
                                })(
                                    <Input disabled={ activeStatus == 3 ? true : false } autoComplete="off" placeholder="请输入" addonBefore="每人最多可中奖" addonAfter="次" />
                                )}
                            </FormItem>    
                        </Col> 
                        {
                            partnerStatus != 0 ?
                            <Col span={12}>
                                <Col span={14}>
                                    <FormItem label="好友助力" {...formItemLayout}>
                                        {getFieldDecorator('operateDrawConf.partnerStatus', {
                                            initialValue: operateDrawConf && operateDrawConf.partnerStatus || '0',
                                            rules: [{ required: false, message: ''}],
                                        })(
                                            <Select getPopupContainer={trigger => trigger.parentNode} disabled={ activeStatus == 3 ? true : false } className="friend-input" onChange={this.changePartnerStatus}>
                                                <Option value="0">关闭</Option>
                                                <Option value="1">分享奖励</Option>
                                                <Option value="2">邀请奖励</Option>
                                            </Select>
                                        )}
                                    </FormItem>  
                                </Col> 
                                <Col span={6}>
                                    <FormItem {...formItemLayoutAll}>
                                        {getFieldDecorator('operateDrawConf.partnerTimes', {
                                            initialValue: operateDrawConf && operateDrawConf.partnerTimes,
                                            rules: [{ required: activeStatus != 1, message: '好友助力次数不能为空'}, {validator: Validate.checkNumDecimalFull100, message: Validate.warnInfo.moreDrawTimes}],
                                        })(
                                            <Input disabled={ activeStatus == 3 ? true : false } autoComplete="off" placeholder="请输入" addonAfter="次"/>
                                        )}
                                    </FormItem>    
                                </Col>  
                                <Popover  placement="rightTop" overlayClassName="activity-popover" content={creContent} trigger="hover">
                                    <img className='friend-on-img' src={ExplainImg} alt='creditOnImg' />
                                </Popover>
                            </Col> :  
                            <Col span={12}>
                                <Col span={14}>
                                    <FormItem label="好友助力" {...formItemLayout}>
                                        {getFieldDecorator('operateDrawConf.partnerStatus', {
                                            initialValue: operateDrawConf && operateDrawConf.partnerStatus || '0',
                                            rules: [{ required: false, message: ''}],
                                        })(
                                            <Select getPopupContainer={trigger => trigger.parentNode} disabled={ activeStatus == 3 ? true : false } className="friend-input" onChange={this.changePartnerStatus}>
                                                <Option value="0">关闭</Option>
                                                <Option value="1">分享奖励</Option>
                                                <Option value="2">邀请奖励</Option>
                                            </Select>
                                        )}
                                    </FormItem>  
                                </Col>
                                <Popover  placement="rightTop" overlayClassName="activity-popover" content={creContent} trigger="hover">
                                    <img className='friend-no-img' src={ExplainImg} alt='creditOnImg' />
                                </Popover>
                            </Col>
                        }
                        <Col span={12}>
                            <FormItem label="参与人数" {...formItemLayout}>
                                {getFieldDecorator('operateDrawConf.activeNum', {
                                    initialValue: operateDrawConf && operateDrawConf.activeNum,
                                    rules: [{ required: false, message: ''},{validator: Validate.checkNumberLen6, message: Validate.warnInfo.numLen6}],
                                })(
                                    <Input disabled={ activeStatus == 3 ? true : false } autoComplete="off" placeholder="请输入" addonAfter="人" />
                                )}
                            </FormItem>    
                        </Col> 
                        <Col span={12}>
                            <FormItem label="中奖总概率" {...formItemLayout}>
                                {getFieldDecorator('operateDrawConf.prizeChanceCount', {
                                    initialValue: operateDrawConf && operateDrawConf.prizeChanceCount,
                                    rules: [{ required: false, message: ''}, {validator: Validate.checkNumDecimalFull100,message: Validate.warnInfo.prizeChanceCount}],
                                })(
                                    <p>{totalProb.toFixed(2) + '%' || 0 + '%'}</p>
                                )}
                            </FormItem>    
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

const pureEditWinner = pureRender(EditWinner);

export default pureEditWinner;