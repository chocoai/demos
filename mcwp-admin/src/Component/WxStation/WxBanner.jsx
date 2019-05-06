import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import pureRender from 'pure-render-decorator';
import get from 'lodash.get'
import { Form, Select, Row, Col, Input } from 'antd';
import UploadImg from '../Common/uploadImg'
import CommonService from '../../Services/CommonService';
import IconRemove from './../../Assets/Images/icon_remove_default.png';
import IconAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import './style/wxbanner.less';
const Option = Select.Option;
const FormItem = Form.Item;

class WxBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemArr: [...Array(props.len || 1)].map((_, i) => i),
            max: props.len || 1,
            thatData: props.bannerList && props.bannerList.length > 0 && props.bannerList || [{}],
            tzz: [
                { ddText: '贷款产品', ddValue: 'prod' },
                // { ddText: '营销活动', ddValue: 'yxhd' },
            ],
        }
    }
    componentDidMount() {
        let { bannerList } = this.props;
        if (bannerList.length < 1) {
            this.getCommId()
        }
    }
    getCommId = async () => {
        const res = await CommonService.getCommId();
        this.setState({
            thatData: [{ code: res.data }],
        })
    }
    changeTzz(value, index) {
        let { thatData } = this.state;
        this.props.form.setFieldsValue({
            ['bannerList[' + index + '].activityType']: ''
        });
        thatData[index].activityType = '';
        this.props.form.setFieldsValue({
            ['bannerList[' + index + '].businessCode']: undefined
        });
        this.props.form.setFieldsValue({
            ['bannerList[' + index + '].proType']: undefined
        });
        thatData[index].tzz = value;
        thatData[index].businessCode = '';
        thatData[index].proType = '';
        this.setState({
            thatData: thatData
        })
    }
    changeYxhd(value, index) {
        let { thatData } = this.state;
        thatData[index].activityType = value;
        this.props.form.setFieldsValue({
            ['bannerList[' + index + '].businessCode']: undefined
        });
        thatData[index].businessCode=''
        this.setState({
            thatData: thatData
        })
    }
    itemAdd = async () => {
        let that = this;
        let max = that.state.max;
        const res = await CommonService.getCommId();
        that.setState({
            itemArr: [...this.state.itemArr, max],
            thatData: [...this.state.thatData, { code: res.data }],
            max: max + 1
        })
    }
    //删除
    itemDelete = (itemDelete) => {
        this.setState({
            itemArr: [...this.state.itemArr.filter((item, index) => item != itemDelete)],
        })
    }
    render() {
        let { itemArr, thatData, tzz } = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 }
        };
        const formItemLayout1 = {
            labelCol: { span: 9 },
            wrapperCol: { span: 14 }
        };
        const formItemLayout2 = {
            wrapperCol: { span: 22 }
        };
        const { getFieldDecorator } = this.props.form;
        let { selectList, yxqdtj, bannerList } = this.props
        return (
            <Form>
                {itemArr.map((item, index) => (
                    <Row className='wx-station-row' type="flex" justify="start" key={item}>
                        <Col span={12} style={{ display: 'none' }}>
                            <FormItem label="code" {...formItemLayout}>
                                {getFieldDecorator('bannerList[' + item + '].code', {
                                    initialValue: get(thatData[item], 'code'),
                                    rules: [{ required: true, message: '请输入' }],
                                })(
                                    <Input autoComplete="off" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            {get(thatData[item], 'code') ? <UploadImg label={'图片'} rules={[{ required: true, message: '图片不能为空' }]} size={'1080*464'} getFieldDecorator={getFieldDecorator} name={'bannerList[' + item + '].img'} code={thatData && get(thatData[item], 'code')} type={Config.bizType.microstationIndexBanner} /> : null}
                        </Col>
                        <Col span={12}>
                            <FormItem label="跳转至" {...formItemLayout}>
                                {getFieldDecorator('bannerList[' + item + '].tzz', {
                                    initialValue: get(thatData[item], 'tzz') || undefined,
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={(value) => this.changeTzz(value, item)} placeholder="请选择">
                                        {
                                            tzz.map((item) =>
                                                <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {get(thatData[item], 'tzz') == 'prod' ? <Col span={12}>
                            <Col span={13}>
                                <FormItem label="贷款产品" {...formItemLayout1}>
                                    {getFieldDecorator('bannerList[' + item + '].businessCode', {
                                        initialValue: Config.setValueInNot(get(thatData[item], 'businessCode'),selectList && selectList.filter(v => v.ddValue == 'dkcp')[0].dictDTOS)?get(thatData[item], 'businessCode'):undefined || undefined,
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" placeholder="请选择">
                                            {
                                                selectList && selectList.filter(v => v.ddValue == 'dkcp')[0].dictDTOS.map((item) =>
                                                    <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...formItemLayout2}>
                                    {getFieldDecorator('bannerList[' + item + '].proType', {
                                        initialValue: get(thatData[item], 'proType') && thatData[item].proType + '' || undefined,
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" placeholder="请选择">
                                            {
                                                yxqdtj && yxqdtj.map((item) =>
                                                    <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Col> : null}
                        {/* {get(thatData[item], 'tzz') == 'yxhd' ? <Col span={24}>
                            <Col span={6}>
                                <FormItem label="营销活动" {...formItemLayout1}>
                                    {getFieldDecorator('bannerList[' + item + '].activityType', {
                                        initialValue: get(thatData[item], 'activityType') || undefined,
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Select getPopupContainer={trigger => trigger.parentNode} onChange={(value) => this.changeYxhd(value, item)} className="friend-input" placeholder="请选择">
                                            {
                                                selectList && selectList.filter(v => v.ddValue == 'yxhd')[0].dictDTOS.map((item) =>
                                                    <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {get(thatData[item], 'activityType') && selectList && selectList.filter(v => v.ddValue == 'yxhd')[0].dictDTOS.filter(value => value.ddValue == thatData[item].activityType)[0].dictDTOS && selectList.filter(v => v.ddValue == 'yxhd')[0].dictDTOS.filter(value => value.ddValue == thatData[item].activityType)[0].dictDTOS.length > 0 ? <Col span={4}>
                                <FormItem {...formItemLayout2}>
                                    {getFieldDecorator('bannerList[' + item + '].businessCode', {
                                        initialValue: get(thatData[item], 'businessCode') || undefined,
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" placeholder="请选择">
                                            {get(thatData[item], 'activityType') ?
                                                selectList && selectList.filter(v => v.ddValue == 'yxhd')[0].dictDTOS.filter(value => value.ddValue == thatData[item].activityType)[0].dictDTOS.map((item) =>
                                                    <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                                ) : null
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col> : null}
                            {get(thatData[item], 'activityType') == 'rate' ? <Col span={4}>
                                <FormItem {...formItemLayout2}>
                                    {getFieldDecorator('bannerList[' + item + '].proType', {
                                        initialValue: get(thatData[item], 'proType') && thatData[item].proType + '' || undefined,
                                        rules: [{ required: true, message: '请选择' }],
                                    })(
                                        <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" placeholder="请选择">
                                            {
                                                yxqdtj && yxqdtj.map((item) =>
                                                    <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col> : null}
                        </Col> : null} */}
                        {
                            index > 0 ?
                                <img className='wxstation-delete' src={IconRemove} alt='delete' onClick={() => this.itemDelete(item)} />
                                : null
                        }
                    </Row>
                ))}
                <div className='wxstation-add' onClick={this.itemAdd}>
                    <img className='wxstation-add-img' src={IconAdd} alt='add' />
                    <span className='wxstation-add-detail'>添加图片</span>
                </div>
            </Form>
        )
    }
}

const pureWxBanner = pureRender(WxBanner);
export default pureWxBanner;