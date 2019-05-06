import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import { Config } from '../../Config/Index';
import CommonService from '../../Services/CommonService';
import imgPicture from '../../Assets/Images/img_picture.png';
import './style/editActivity.less';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';
import get from 'lodash.get';

import { Form, Input, Row, Col, Select, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class EditGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prizeCondition: [
                { ddText: '低级关卡', ddValue: '1' },
                { ddText: '中级关卡', ddValue: '2' },
                { ddText: '高级关卡', ddValue: '3' },
            ],
            itemArr: [...Array(props.len || 1)].map((_, i) => i),
            max: props.len || 1,
            thatData: props.operateJigsawConf && props.operateJigsawConf.length > 0 && props.operateJigsawConf || [{}],
            code: null,
        }
    }
    componentWillMount() {
        // this.getCommId()
    }
    // 获取全局唯一code
    async getCommId(index) {
        let {thatData}=this.state;
        const res = await CommonService.getCommId();
        if(!thatData[index].code){
            thatData[index].code=res.data;
            this.setState({
                thatData:thatData
            })
        }
    }
    async getCode(){
        let that = this;
        let max = that.state.max;
        const res = await CommonService.getCommId();
        that.setState({
            code: res.data,
            itemArr: [...this.state.itemArr, max],
            thatData: [...this.state.thatData, {code:res.data}],
            max: max + 1
        })
    }
    ipiecesItemAdd=()=> {
        let that = this;
        let max = that.state.max;
        that.setState({
            itemArr: [...this.state.itemArr, max],
            thatData: [...this.state.thatData, {code:''}],
            max: max + 1
        })
        
    }
    //删除
    ipiecesItemDelete = (itemDelete) => {
        this.setState({
            itemArr: [...this.state.itemArr.filter((item, index) => item != itemDelete)],
        })
    }
    fileclick(confs, index) {
        if ((!confs) || (!confs.code)) {
            this.getCommId(index)
        }
    }
    changeFile(e, operateJigsawConf, index) {
        let code = '';
        if (!operateJigsawConf.code) {
            // this.getCommId(index)
        }
        this.getFile(e,index)
    }
    getFile = (e, index) => {
        const that = this
        let { thatData } = this.state;
        for (let file of e.target.files) {
            if (file.type == 'image/jpeg' || file.type == 'image/png') {
                that.props.upload(file, 'gameImg', thatData[index].code)
            } else {
                message.error('上传文件格式不对')
                return
            }
        }
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            thatData[index].coverUrl = reader.result
            this.refs['img'+index].src=reader.result;
            that.setState({
                thatData: thatData
            });
        }
        reader.readAsDataURL(files[0]);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { prizeCondition, itemArr, thatData } = this.state
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        };
        const { operateJigsawConf, fgfsList, ispublish } = this.props;
        return (
            <div className='editActivity-container'>
                <Form>
                    {itemArr.map((item, index) => <Row className='trend-row-border' type="flex" justify="start" key={item}>
                    { get(thatData[item], 'code') ? <Col span={12} style={{display:'none'}}>
                            <FormItem label="code" {...formItemLayout}>
                                {getFieldDecorator('operateJigsawConf[' + item + '].code', {
                                    initialValue: thatData && thatData[item] && thatData[item].code,
                                    rules: [{ required: false, message: '不能为空' }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                                )}
                            </FormItem>
                        </Col>:null}
                       
                        <Col span={12}>
                            <FormItem label="关卡难度" {...formItemLayout}>
                                {getFieldDecorator('operateJigsawConf[' + item + '].difficulty', {
                                    initialValue: operateJigsawConf && operateJigsawConf[item] && operateJigsawConf[item].difficulty && operateJigsawConf[item].difficulty.toString() || undefined,
                                    rules: [{ required: ispublish, message: '请选择' }],
                                })(
                                    <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={this.changePartnerStatus} placeholder="请选择">
                                        {
                                            prizeCondition.map((item) =>
                                                <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="切割方式" {...formItemLayout}>
                                {getFieldDecorator('operateJigsawConf[' + item + '].cuttingWays', {
                                    initialValue: operateJigsawConf && operateJigsawConf[item] && operateJigsawConf[item].cuttingWays && operateJigsawConf[item].cuttingWays.toString() || undefined,
                                    rules: [{ required: ispublish, message: '请选择' }],
                                })(
                                    <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={this.changePartnerStatus} placeholder="请选择">
                                        {
                                            fgfsList.map((item) =>
                                                <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="停留时间" {...formItemLayout}>
                                {getFieldDecorator('operateJigsawConf[' + item + '].stayTime', {
                                    initialValue: operateJigsawConf && operateJigsawConf[item] && operateJigsawConf[item].stayTime||'',
                                    rules: [{ required: ispublish, message: '停留时间不能为空' }, { validator: Validate.checkNumDecimal60, message: Validate.warnInfo.NumDecimal60}],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter='秒' />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="结束时长" {...formItemLayout}>
                                {getFieldDecorator('operateJigsawConf[' + item + '].endTime', {
                                    initialValue: operateJigsawConf && operateJigsawConf[item] && operateJigsawConf[item].endTime||'',
                                    rules: [{ required: ispublish, message: '结束时长不能为空' }, { validator: Validate.checkNumRange300, message: Validate.warnInfo.numRange300 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter='秒' />
                                )}
                            </FormItem>
                        </Col>

                        <Col span={12}>
                            <FormItem label="游戏图片" {...formItemLayout}>
                                {getFieldDecorator('operateJigsawConf[' + item + '].gameImgUrl', {
                                    initialValue: operateJigsawConf && operateJigsawConf[item] && operateJigsawConf[item].coverUrl,
                                    rules: [{ required: ispublish, message: '游戏图片不能为空' }],
                                })(
                                    <Row className="modal-row">
                                        <Col span={8} className="upload-container">
                                            {
                                                thatData && thatData[item] && thatData[item].coverUrl ? <img className="idcard-img" ref={`img${item}`} src={thatData[item].coverUrl} alt="page" /> :
                                                    <img className="idcard-img" ref={`img${item}`} src={imgPicture} alt="page" />
                                            }
                                        </Col>
                                        <Col span={12} className="row-tip">
                                            <p>建议图片为png,jpg,jpeg格式</p>
                                            <p>大小为640*640</p>
                                            <input className="idcard-file" type="file" onChange={(e) => this.changeFile(e, thatData[item], item)} multiple onClick={() => this.fileclick(thatData[item], item)}/>
                                            <p className="action-btn">上传图片</p>
                                        </Col>
                                    </Row>
                                )}
                            </FormItem>
                        </Col>
                        {
                            item > 0 ?
                                <img className='ipieces-delete' src={ipiecesDelete} alt='delete' onClick={() => this.ipiecesItemDelete(item)} />
                                : null
                        }
                    </Row>)}
                    {itemArr && itemArr.length < 3 ? <div className='ipieces-add' onClick={this.ipiecesItemAdd}>
                        <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                        <span className='ipieces-add-detail'>添加关卡</span>
                    </div> : null}

                </Form>
            </div>
        )
    }
}

const pureEditGame = pureRender(EditGame);
export default pureEditGame;