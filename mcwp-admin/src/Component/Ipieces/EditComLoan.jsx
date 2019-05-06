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
 * 进件编辑共同借款人
 * @Author: 赵俊
 * @Date:   2017-05-31
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-7-06
 */
class EditComLoan extends Component {
        constructor(props) {
        super(props);
        this.state = {
            value:'',
            wordCount:0,
            relationship: '',
            itemArr:[...Array(props.len || 1)].map((_, i)=> i),
            itemVerify: [...Array(props.len || 1)].map((_, i) => ({'index': i, 'identity': true, 'credit': true})),
            max: props.len || 1,
            wordCountThree: 0,
            pictureInfo: ''
        }
    }

    componentDidMount() {
        this.getRelationship();
        // this.getPictureLoans();
    }
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
                this.setState({
                    relationship: res.data.bcgx
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
    borrowerCreditOpen = (borrowerCredit) => {
        borrowerCredit.map((item, index) => {
            window.open(item['srcUrl'])
        })
    }
    textareaChangeThree(e) {
        if ( e.target.value.length > 100 ) {
            e.target.value = e.target.value.substr(0, 100);
            return;
        }
        this.setState({
            wordCountThree: e.target.value.length
        })
    }

    // showPic = () => {
    //     this.setState({
    //         preview: true
    //     });
    // }
    previewHide = () => {
        this.setState({
            preview: false,
            pictureInfo: ''
        });
    }
    getPictureLoans = () => {  // 借款人照片信息
        let code = this.props.code;
    	Config.get('/v1/oss/'+ code + '/LOAN_COBORROWER/*', {}, (res) => {
            if(res.code == Config.errorCode.success) {
            	if(res.data && res.data.LOAN_COBORROWER && res.data.LOAN_COBORROWER.length){
            		this.setState({
                        pictureInfo: res.data.LOAN_COBORROWER,
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
    // 征信模型验证
    checkVerify = (indexCode, i, itemArr) => {
        this.props.postCreditVerify(indexCode, 'loanCoBorrower', itemArr)
    }
    // 查看征信信息
    viewVerify = (code) => {
        this.props.linkTo('/ipieces/view/detail/loan/'+ code)
        // browserHistory.push('/ipieces/view/detail/loan/'+ code);
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
        that.props.postIdentityVerify(indexCode, 'loanCoBorrower', itemArr, () => {
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
        const { relationship, itemVerify, itemArr } = this.state;
        const { loanCoBorrower, showPicture, type, openUploadImg } = this.props;
        const {pictureInfo} = this.state
        return (
            <div className='editComGuaranLoan-container'>
                <Form>
                {
                    this.state.itemArr.map((item,index)=>(
                    <div key={item}>
                        <div className='ipieces-subtitle-container'>
                            <p className='ipieces-subtitle'>共同借款人{index+1}信息
                            {
                                loanCoBorrower[item] && loanCoBorrower[item].coBorrowerCode ?
                                    <span className='ipieces-subtitle-attachment' onClick={()=>showPicture('LOAN_COBORROWER_CREDIT', loanCoBorrower[item].coBorrowerCode)}>征信报告</span>:
                                    null
                            }
                            {/* {
                               pictureInfo && pictureInfo.length > 0 ?   */}
                            <span className='ipieces-subtitle-attachment' onClick={()=>this.getPictureLoans()}>查看文件</span>
                               {/* : null
                            } */}
                            <span className='ipieces-subtitle-attachment' onClick={()=>openUploadImg(Config.bizType.loanCoborrower)}>添加文件</span>
                            {
                                type == '6' ?
                                <span className='ipieces-subtitle-attachment' onClick={()=>this.viewVerify(loanCoBorrower[item].code)}>查看征信详情</span> : null
                            }
                            </p>
                        </div>
                        {
                            type == '6' ?
                            <div className='mode-list'>
                                <Button className='verify-mode' type="primary" onClick={() => this.changePostVerify(index, item, itemArr)}>核身模型验证</Button>
                                <Button className='verify-mode' type="primary" onClick={() => this.checkVerify(index, item, itemArr)}>征信模型验证</Button>
                            </div> : null
                        }
                        {
                            type == '6' ?
                            <div className='mode-list'>
                                <p className='ipieces-subtitle'>核身模型验证结果</p>
                                {
                                    loanCoBorrower && loanCoBorrower[index] && loanCoBorrower[index].identityResult && itemVerify[item].identity ?
                                    loanCoBorrower[item].identityResult.idNameCheckResult && loanCoBorrower[item].identityResult.idPhoneCheckResult ?
                                    <div>
                                        <p className="verify-p">身份证与姓名是否一致：{ loanCoBorrower[index].identityResult.idNameCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                        <p className="verify-p">手机号是否实名认证：{ loanCoBorrower[index].identityResult.idPhoneCheckResult ? <span className="verify-true">是</span> : <span className="verify-false">否</span>}</p>
                                    </div>
                                    :<p className="verify-p">拒绝原因：{ loanCoBorrower[item].identityResult.message ? <span className="verify-false">{loanCoBorrower[item].identityResult.message}</span> : null}</p>
                                    : <p className="verify-p">核身模型暂未验证</p>
                                }
                            </div> : null
                        }
                        {
                            type == '6' ?
                            <div className='mode-list'>
                                <p className='ipieces-subtitle'>征信模型验证结果</p>
                                {
                                    loanCoBorrower && loanCoBorrower[index] && loanCoBorrower[index].creditQueryResult && itemVerify[item].credit ?
                                    <div>
                                        {
                                            loanCoBorrower[index].creditQueryResult.pbocScore ?
                                            <p className="verify-p">央行授信评分：{ loanCoBorrower[index].creditQueryResult.pbocScore ? <span className="verify-true">{loanCoBorrower[index].creditQueryResult.pbocScore}<span>({loanCoBorrower[index].creditQueryResult.pbocScore < 490 ? '征信较差' : 490 <= loanCoBorrower[index].creditQueryResult.pbocScore && loanCoBorrower[index].creditQueryResult.pbocScore < 510 ? '征信一般' : 510 <= loanCoBorrower[index].creditQueryResult.pbocScore && loanCoBorrower[index].creditQueryResult.pbocScore < 530 ? '征信良好' : '征信优秀'})</span>
                                            </span> : null}<span className="score-explain" onClick={(e)=>this.showExplainModal(e,loanCoBorrower[index])}>评分说明</span></p>
                                            : <p className="verify-p">央行拒绝原因：{ loanCoBorrower[index].creditQueryResult.message ? <span className="verify-false">{loanCoBorrower[index].creditQueryResult.message}</span> : null}</p>
                                        }
                                    </div>
                                    : <p className="verify-p">征信模型暂未验证</p>
                                }
                            </div> : null
                        }
                        <FormItem>
                            {getFieldDecorator('loanCoBorrower[' + item + '].guaranteeType', {
                                initialValue: 0,
                            })(
                                <p />
                            )}
                        </FormItem>
                        <Row className='trend-row'>
                        <Col span={12}>
                            <FormItem label="姓名" {...formItemLayout}>
                                {getFieldDecorator('loanCoBorrower[' + item + '].name', {
                                    initialValue: loanCoBorrower[item] && loanCoBorrower[item].name,
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25}],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" onChange={() => this.changeVerify(item)} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="年龄" {...formItemLayout}>
                                {getFieldDecorator('loanCoBorrower[' + item + '].age', {
                                    initialValue: loanCoBorrower[item] && loanCoBorrower[item].age,
                                    rules: [{ required: false, message: Validate.warnInfo.numRange100, validator: Validate.checkNumRange100 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="性别" {...formItemLayout}>
                                {getFieldDecorator('loanCoBorrower[' + item + '].sex', {
                                    initialValue: loanCoBorrower[item] && loanCoBorrower[item].sex,
                                    rules: [{ required: false, message: '' }],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        allowClear = {true}
                                        getPopupContainer={trigger => trigger.parentNode}
                                    >
                                        <Option value="男">男</Option>
                                        <Option value="女">女</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="与申请人关系" {...formItemLayout}>
                                {getFieldDecorator('loanCoBorrower[' + item + '].relationship', {
                                    initialValue: loanCoBorrower[item] && loanCoBorrower[item].relationship,
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
                        </Col>
                        <Col span={12}>
                            <FormItem label="身份证号" {...formItemLayout}>
                                {getFieldDecorator('loanCoBorrower[' + item + '].idCardNo', {
                                    initialValue: loanCoBorrower[item] && loanCoBorrower[item].idCardNo,
                                    rules: [{ required: false, message: Validate.warnInfo.idCard, validator: Validate.checkIdCard }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" onChange={() => this.changeVerify(item)} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="联系方式" {...formItemLayout}>
                                {getFieldDecorator('loanCoBorrower[' + item + '].telephone', {
                                    initialValue: loanCoBorrower[item] && loanCoBorrower[item].telephone,
                                    rules: [{ required: false, message: Validate.warnInfo.phoneNum, validator: Validate.checkPhoneNum }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" onChange={() => this.changeVerify(item)} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="主营业务或职务" {...formItemLayout}>
                                {getFieldDecorator('loanCoBorrower[' + item + '].mainBusiness', {
                                    initialValue: loanCoBorrower[item] && loanCoBorrower[item].mainBusiness,
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="月收入" {...formItemLayout}>
                                {getFieldDecorator('loanCoBorrower[' + item + '].income', {
                                    initialValue: loanCoBorrower[item] && loanCoBorrower[item].income,
                                    rules: [{ required: false,  message: Validate.warnInfo.numType, validator: Validate.checkNumType }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="单位名称" {...formItemLayout}>
                                {getFieldDecorator('loanCoBorrower[' + item + '].orgName', {
                                    initialValue: loanCoBorrower[item] && loanCoBorrower[item].orgName,
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="单位地址" {...formItemLayout}>
                                {getFieldDecorator('loanCoBorrower[' + item + '].orgAddr', {
                                    initialValue: loanCoBorrower[item] && loanCoBorrower[item].orgAddr,
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64  }],
                                })(
                                    <Input autoComplete="off" placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="其他信息" {...formItemLayout}>
                                <div className="descript-item">
                                {getFieldDecorator('loanCoBorrower[' + item + '].otherMessage', {
                                    initialValue: loanCoBorrower[item] && loanCoBorrower[item].otherMessage || '',
                                    rules: [{ required: false, message: Validate.warnInfo.wordLen100, validator: Validate.checkWordLen100  }],
                                })(
                                    <textarea className="des-content" placeholder="请输入" onChange={(e)=>this.textareaChangeThree(e)}></textarea>
                                )}
                                </div>
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('loanCoBorrower[' + item + '].loanGuaranteeInfoId', {
                                    initialValue: loanCoBorrower[item] && loanCoBorrower[item].loanGuaranteeInfoId,
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
                        <span className='ipieces-add-detail'>添加借款人</span>
                    </div>
                </Form>
                <CarouselImg pictureInfo={pictureInfo} previewPic={this.state.preview} previewHide={this.previewHide} />
            </div>
        )
    }
}

const pureEditComLoan = pureRender(EditComLoan);

export default pureEditComLoan;
