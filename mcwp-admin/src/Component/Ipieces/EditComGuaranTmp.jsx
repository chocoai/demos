import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
// import { browserHistory } from 'react-router';
import './style/editComGuaranLoan.less';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import CarouselImg from './CarouselImg';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';

import { message, Form, Input, Row, Col, Select, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
/**
 * 进件编辑共同担保人
 * @Author: 赵俊
 * @Date:   2017-05-31
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-05-31
 */
class EditComGuaran extends Component {
        constructor(props) {
        super(props);
        this.state = {
            value:'',
            wordCount: 0,
            relationship: '',
            itemArr:[...Array(props.len || 1)].map((_, i)=> i),
            itemVerify: [...Array(props.len || 1)].map((_, i) => ({'index': i, 'identity': true, 'credit': true})),
            max: props.len || 1,
        }
    }
    componentWillMount() {
        this.getRelationship();
        // this.getPictureGuarans()
    }
    // componentWillReceiveProps(nextProps){
    //     if (nextProps && nextProps.loanGuarantee) {
    //         for(let i=0; i<nextProps.loanGuarantee.length;i++) {
    //             for(let key in nextProps.loanGuarantee[i]) {
    //                 if( key == 'loanGuaranteeInfoId') {
    //                     this.props.form.setFieldsValue({
    //                         ['loanGuarantor[' + i + '].loanGuaranteeInfoId']: nextProps.loanGuarantee[i]['loanGuaranteeInfoId'],
    //                     });
    //                 }
    //             }
    //         }
    //     }

    // }
    //增加
    ipiecesItemAdd = () => {
        let max = this.state.max;
        this.setState({
            'itemArr': [...this.state.itemArr, max],
            'itemVerify': [...this.state.itemVerify, {'index': max, 'identity': false, 'credit': false}],
            max: max + 1
        })
    }
    //删除
    ipiecesItemDelete = (itemDelete) => {
        this.setState({
            'itemArr': [...this.state.itemArr.filter((item,index)=>item != itemDelete)],
            'itemVerify': [...this.state.itemVerify.map(item => {
                if (item.index == itemDelete) {
                    return {'index': itemDelete, 'identity': false, 'credit': false}
                } else {
                    return item
                }
            })]
        })
    }
    getRelationship () {
        let params = {
            code: 'bcgx'
        };
        Config.get('/v1/sys/dict/items', params, (res) => {
            if(res.code == Config.errorCode.success) {
                let data = res.data.bcgx.filter(function(ele,index,array){
                    return ele.ddValue  > 2
                })  ;
                this.setState({
                    relationship: data
                })
         	} else {
                message.error(res.msg);
         	}
        });
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
    getPictureGuarans = () => {  // 担保人查看文件
        let code = this.props.code;
    	Config.get('/v1/oss/'+ code + '/LOAN_GUARANTEE/*', {}, (res) => {
            if(res.code == Config.errorCode.success) {
            	if(res.data && res.data.LOAN_GUARANTEE && res.data.LOAN_GUARANTEE.length){
            		this.setState({
                        pictureInfo: res.data.LOAN_GUARANTEE,
                        preview: true
                    });
            	} else {
            		message.error(Config.warnInfo.uploadImg);
                }
            } else {
                message.error(res.msg);
            }
        });
    }
    previewHide = () => {
        this.setState({
            preview: false,
            pictureInfo: ''
        });
    }
    // showPic = () => {
    //     this.setState({
    //         preview: true
    //     });
    // }
    // 征信模型验证
    checkVerify = (indexCode, i, itemArr) => {
        this.props.postCreditVerify(indexCode, 'loanGuarantee', itemArr)
    }
    // 查看征信信息
    viewVerify = (code) => {
        this.props.linkTo('/ipieces/view/detail/guaran/'+ code)
    }
    // 修改后验证状态改变
    changeVerify (i) {
        this.setState({
            'itemVerify': [...this.state.itemVerify.map(item => {
                if (item.index == i) {
                    return {'index': i, 'identity': false, 'credit': false}
                } else {
                    return item
                }
            })]
        })
    }
    changePostVerify (indexCode, i, itemArr) {
        const that = this
        that.props.postIdentityVerify(indexCode, 'loanGuarantee', itemArr, () => {
            that.setState({
                'itemVerify': [...that.state.itemVerify.map(item => {
                    if (item.index == i) {
                        return {'index': i, 'identity': true, 'credit': true}
                    } else {
                        return item
                    }
                })]
            })
        })
    }
    showExplainModal = (e,item) => {
        let newObject = item.creditQueryResult
        newObject.auditStatusText = '征信审核通过'
        this.props.showExplainModal(newObject)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        };
        // const { relationship } = this.state;
        const { itemVerify, itemArr } = this.state;
        const { loanGuarantee, showPicture, type, openUploadImg } = this.props;
        const {pictureInfo} = this.state
        return (
            <div className='editComGuaranLoan-container'>
                <Form>
                {
                    this.state.itemArr.map((item,index)=>(
                    <div key={item}>
                        <div className='ipieces-subtitle-container'>
                            <p className='ipieces-subtitle'>担保人{index+1}信息
                            {
                                loanGuarantee[item] && loanGuarantee[item].guarantorCode ?
                                    <span className='ipieces-subtitle-attachment' onClick={()=>showPicture('LOAN_GUARANTEE_CREDIT', loanGuarantee[item].guarantorCode)}>征信报告</span>:
                                    null
                            }
                            {/* {
                               pictureInfo && pictureInfo.length > 0 ?   */}
                            <span className='ipieces-subtitle-attachment' onClick={()=>this.getPictureGuarans()}>查看文件</span>
                               {/* : null
                            } */}
                            <span className='ipieces-subtitle-attachment' onClick={()=>openUploadImg(Config.bizType.loanGuarantee)}>添加文件</span>
                            {/* {
                                type == '6' ?
                                <span className='ipieces-subtitle-attachment' onClick={()=>this.viewVerify(loanGuarantee[item].code)}>查看征信详情</span> : null
                            } */}
                            </p>
                        </div>
                        {/* {
                            type == '6' ?
                            <div className='mode-list'>
                                <Button className='verify-mode' type="primary" onClick={() => this.changePostVerify(index, item, itemArr)}>核身模型验证</Button>
                                <Button className='verify-mode' type="primary" onClick={() => this.checkVerify(index, item, itemArr)}>征信模型验证</Button>
                            </div> : null
                        } */}
                        {/* {
                            type == '6' ?
                            <div className='mode-list'>
                                <p className='ipieces-subtitle'>核身模型验证结果</p>
                                {
                                    loanGuarantee && loanGuarantee[index] && loanGuarantee[index].identityResult && itemVerify[item].identity ?
                                    loanGuarantee[item].identityResult.idNameCheckResult &&  loanGuarantee[item].identityResult.idNameCheckResult &&  loanGuarantee[item].identityResult.idPhoneCheckResult ?
                                    <div>
                                        <p className="verify-p">身份证与姓名是否一致：{ loanGuarantee[index].identityResult.idNameCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                        <p className="verify-p">手机号是否实名认证：{ loanGuarantee[index].identityResult.idPhoneCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                    </div>
                                    : <p className="verify-p">拒绝原因：{ loanGuarantee[item].identityResult.message ? <span className="verify-false">{loanGuarantee[item].identityResult.message}</span> : null}</p>
                                    : <p className="verify-p">核身模型暂未验证</p>
                                }
                            </div> : null
                        }
                        {
                            type == '6' ?
                            <div className='mode-list'>
                                <p className='ipieces-subtitle'>征信模型验证结果</p>
                                {
                                    loanGuarantee && loanGuarantee[index] && loanGuarantee[index].creditQueryResult && itemVerify[item].credit ?
                                    <div>
                                        {
                                            loanGuarantee[item].creditQueryResult.pbocScore ?
                                            <p className="verify-p">央行授信评分：{ loanGuarantee[index].creditQueryResult.pbocScore ? <span className="verify-true">{loanGuarantee[index].creditQueryResult.pbocScore}<span>({loanGuarantee[index].creditQueryResult.pbocScore < 490 ? '征信较差' : 490 < loanGuarantee[index].creditQueryResult.pbocScore && loanGuarantee[index].creditQueryResult.pbocScore < 510 ? '征信一般' : 510 < loanGuarantee[index].creditQueryResult.pbocScore && loanGuarantee[index].creditQueryResult.pbocScore < 530 ? '征信良好' : '征信优秀'})</span>
                                            </span> : null} <span className="score-explain" onClick={(e)=>this.showExplainModal(e,loanGuarantee[item])}>评分说明</span></p>
                                            : <p className="verify-p">央行拒绝原因：{ loanGuarantee[index].creditQueryResult.message ? <span className="verify-false">{loanGuarantee[index].creditQueryResult.message}</span> : null}</p>
                                        }
                                    </div>
                                    : <p className="verify-p">征信模型暂未验证</p>
                                }
                            </div> : null
                        } */}
                        <FormItem>
                            {getFieldDecorator('loanGuarantor[' + item + '].guaranteeType', {
                                initialValue: 1,
                            })(
                                <p />
                            )}
                        </FormItem>

                        <Row className='trend-row'>
                            <Col span={12}>
                                <FormItem label="姓名" {...formItemLayout}>
                                    {getFieldDecorator('loanGuarantor[' + item + '].name', {
                                        initialValue: loanGuarantee[item] && loanGuarantee[item].name,
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25}],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" onChange={() => this.changeVerify(item)} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="年龄" {...formItemLayout}>
                                    {getFieldDecorator('loanGuarantor[' + item + '].age', {
                                        initialValue: loanGuarantee[item] && loanGuarantee[item].age,
                                        rules: [{ required: false, message: Validate.warnInfo.numRange100, validator: Validate.checkNumRange100 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter='岁'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="性别" {...formItemLayout}>
                                    {getFieldDecorator('loanGuarantor[' + item + '].sex', {
                                        initialValue: loanGuarantee[item] && loanGuarantee[item].sex||undefined,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Select
                                            allowClear = {true}
                                            placeholder="请选择"
                                            getPopupContainer={trigger => trigger.parentNode}
                                        >
                                            <Option value="男">男</Option>
                                            <Option value="女">女</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {/* <Col span={12}>
                                <FormItem label="与申请人关系" {...formItemLayout}>
                                    {getFieldDecorator('loanGuarantor[' + item + '].relationship', {
                                        initialValue: loanGuarantee[item] && loanGuarantee[item].relationship,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            style={{ width: '100%' }}
                                            allowClear = {true}
                                            getPopupContainer={trigger => trigger.parentNode}
                                            >
                                            {
                                                relationship?
                                                relationship.map((item,index)=>(
                                                    <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                )):
                                                null
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>   */}
                            <Col span={12}>
                                <FormItem label="身份证号" {...formItemLayout}>
                                    {getFieldDecorator('loanGuarantor[' + item + '].idCardNo', {
                                        initialValue: loanGuarantee[item] && loanGuarantee[item].idCardNo,
                                        rules: [{ required: true, message: Validate.warnInfo.idCard, validator: Validate.checkIdCard }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" onChange={() => this.changeVerify(item)} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="联系方式" {...formItemLayout}>
                                    {getFieldDecorator('loanGuarantor[' + item + '].telephone', {
                                        initialValue: loanGuarantee[item] && loanGuarantee[item].telephone,
                                        rules: [{ required: false, message: Validate.warnInfo.phoneNum, validator: Validate.checkPhoneNum }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" onChange={() => this.changeVerify(item)} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="主营业务或职务" {...formItemLayout}>
                                    {getFieldDecorator('loanGuarantor[' + item + '].mainBusiness', {
                                        initialValue: loanGuarantee[item] && loanGuarantee[item].mainBusiness,
                                        rules: [{ required: false,  message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25  }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="月收入" {...formItemLayout} style={{marginBottom:'22px'}}>
                                    {getFieldDecorator('loanGuarantor[' + item + '].income', {
                                        initialValue: loanGuarantee[item] && loanGuarantee[item].income,
                                        rules: [{ required: false, message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="单位名称" {...formItemLayout}>
                                    {getFieldDecorator('loanGuarantor[' + item + '].orgName', {
                                        initialValue: loanGuarantee[item] && loanGuarantee[item].orgName,
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="单位地址" {...formItemLayout}>
                                    {getFieldDecorator('loanGuarantor[' + item + '].orgAddr', {
                                        initialValue: loanGuarantee[item] && loanGuarantee[item].orgAddr,
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="其他信息" {...formItemLayout}>
                                    <div className="descript-item">
                                    {getFieldDecorator('loanGuarantor[' + item + '].otherMessage', {
                                        initialValue: loanGuarantee[item] && loanGuarantee[item].otherMessage || '',
                                        rules: [{ required: false, message: Validate.warnInfo.wordLen100, validator: Validate.checkWordLen100  }],
                                    })(
                                        <textarea className="des-content" placeholder="请输入" onChange={(e)=>this.textareaChangeThree(e)}></textarea>
                                    )}

                                    </div>
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('loanGuarantor[' + item + '].loanGuaranteeInfoId', {
                                        initialValue: loanGuarantee[item] && loanGuarantee[item].loanGuaranteeInfoId,
                                        rules: [{ required: false }],
                                    })(
                                        <Input style={{display:'none'}} placeholder='请输入' />
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
                        <span className='ipieces-add-detail'>添加担保人</span>
                    </div>
                </Form>
                <CarouselImg pictureInfo={pictureInfo} previewPic={this.state.preview} previewHide={this.previewHide} />
            </div>
        )
    }
}

const pureEditComGuaran = pureRender(EditComGuaran);

export default pureEditComGuaran;
