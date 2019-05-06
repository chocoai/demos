import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import { Config } from '../../Config/Index';
import CommonService from '../../Services/CommonService';
import get from 'lodash.get';
import imgPicture from '../../Assets/Images/img_picture.png';
import './style/editActivity.less';

import { Form, Input, Row, Col, Select, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class EditGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemArr: [...Array(3)].map((_, i) => i),
            thatData: props.confs && props.confs.length > 0 && props.confs || [{}, {}, {}],
            code: props.code,
        }
    }
    componentDidMount() {
        let { confs } = this.props;
        let { thatData } = this.state;
        if (confs&&confs.length == 1) {
            thatData.push({}, {})
        } else if (confs&&confs.length == 2) {
            thatData.push({})
        }
        this.setState({
            thatData: thatData
        })
    }
    // 获取全局唯一code
    async getCommId(index) {
        let that = this;
        let { thatData } = this.state;
        const res = await CommonService.getCommId();
        if (res.code == Config.errorCode.success) {
            thatData[index].code = res.data;
            this.setState({
                thatData: thatData
            })
        }

    }
    fileclick(confs, index) {
        if ((!confs) || (!confs.code)) {
            this.getCommId(index)
        }
    }
    async changeFile(e, confs, index) {
        let code;
        let that = this;
        if (!confs.code) {
        } else {
            code = confs.code;
            this.getFile(e, index, code)
        }

    }
    getFile = (e, index, code) => {
        const that = this
        let { thatData } = this.state;
        for (let file of e.target.files) {
            if (file.type == 'image/jpeg' || file.type == 'image/png') {
                that.props.upload(file, 'gameImg', code)
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
            this.refs['img' + index].src = reader.result;
            that.setState({
                thatData: thatData
            });
        }
        reader.readAsDataURL(files[0]);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { itemArr, thatData } = this.state
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        };
        const { confs, yyybhList, ispublish } = this.props;
        // console.log(get(thatData[item], 'code'))
        return (
            <div className='editActivity-container'>
                <Form>
                    {itemArr.map((item, index) => <Row className='trend-row-border' type="flex" justify="start" key={item}>
                    {
                         get(thatData[item], 'code') ?
                         <Col span={12} style={{ display: 'none' }}>
                         <FormItem label="code" {...formItemLayout}>
                             {getFieldDecorator('confs[' + item + '].code', {
                                 initialValue: thatData[item].code,
                                 rules: [{ required: false, message: '不能为空' }],
                             })(
                                 <Input autoComplete="off" placeholder="请输入" />
                             )}
                             )}
                         </FormItem>
                     </Col>:null
                    }

                        <Col span={12}>
                            <FormItem label="图片编号" {...formItemLayout}>
                                {getFieldDecorator('confs[' + item + '].difficulty', {
                                    initialValue: thatData && thatData[item] && thatData[item].difficulty && thatData[item].difficulty.toString() || undefined,
                                    rules: [{ required: ispublish, message: '请选择' }],
                                })(
                                    <Select getPopupContainer={trigger => trigger.parentNode} className="friend-input" onChange={this.changePartnerStatus} placeholder="请选择">
                                        {
                                            yyybhList.map((item) =>
                                                <Option key={item.ddValue} value={item.ddValue}>{item.ddText}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="游戏图片" {...formItemLayout}>
                                {getFieldDecorator('confs[' + item + '].gameImgUrl', {
                                    initialValue: thatData && thatData[item] && thatData[item].coverUrl,
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
                                            <p>大小为200*200</p>
                                            <input className="idcard-file" type="file" onChange={(e) => this.changeFile(e, thatData[item], item)} multiple onClick={() => this.fileclick(thatData[item], item)} />
                                            <p className="action-btn">上传图片</p>
                                        </Col>
                                    </Row>
                                )}
                            </FormItem>
                        </Col>
                    </Row>)}
                </Form>
            </div>
        )
    }
}

const pureEditGame = pureRender(EditGame);
export default pureEditGame;