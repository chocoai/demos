import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import './style/editManageBase.less';

import { Form, Input, Row, Col, Switch } from 'antd';
const FormItem = Form.Item;

/**
 * 征信调查央行信息编辑
 * @Author: 钟观发
 * @Date:   2017-11-08
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-07-25
 */
class EditAssetBank extends Component {
        constructor(props) {
        super(props);
        this.state = {
            value:''
        }
    }

    componentDidMount() {
    }
    switchBtn = (checked, type) => {
        // if (type == 'isBlank') {
        //     this.setState({
        //         isPeople : checked
        //     })
        // }
        if (!checked) {
            if( type == 'isBlank' ) {
                this.props.form.setFieldsValue({
                    'creditCentralBankInfoBO.isBlankCreditRecord': '',
                });
            } else if ( type == 'hasForce' ) {
                this.props.form.setFieldsValue({
                    'creditCentralBankInfoBO.hasForceExecution': '',
                });
            } else if ( type == 'hasSalva' ) {
                this.props.form.setFieldsValue({
                    'creditCentralBankInfoBO.hasSalvationRecord': '',
                });
            } else if ( type == 'hasTax' ) {
                this.props.form.setFieldsValue({
                    'creditCentralBankInfoBO.hasTaxArrear': '',
                });
            } else if ( type == 'hasCompe' ) {
                this.props.form.setFieldsValue({
                    'creditCentralBankInfoBO.hasCompetenceRevoke': '',
                });
            } else if ( type == 'hasBad' ) {
                this.props.form.setFieldsValue({
                    'creditCentralBankInfoBO.hasBadCreditRecord': '',
                });
            } else if ( type == 'hasBadFive' ) {
                this.props.form.setFieldsValue({
                    'creditCentralBankInfoBO.hasBadCreditFiveClass': '',
                });
            }
        }
    }
    changeBankInfo () {
        this.props.changeBankInfo()
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 8 }
        };
        const { creditCentralBankInfo } = this.props;
        return (
            <div className='editManageBase-container'>
                <Form>
                <p className='ipieces-subtitle'>录入央行征信信息</p>
                <Row type='flex' justify='start'>
                        <Col span={12}>
                            <FormItem label="人行信用记录是否为空白" {...formItemLayout}>
                                {getFieldDecorator('creditCentralBankInfoBO.isBlankCreditRecord', {
                                    valuePropName: 'checked',
                                    initialValue: creditCentralBankInfo && creditCentralBankInfo.isBlankCreditRecord || false,
                                    rules: [{ required: false, message: '' }],
                                })(
                                    <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={()=>this.changeBankInfo()} />
                                )}
                            </FormItem>
                        </Col>
                        {   !(creditCentralBankInfo && creditCentralBankInfo.isBlankCreditRecord) ?
                            <Col span={12}>
                                <FormItem label="是否有法院强制执行记录" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.hasForceExecution', {
                                        valuePropName: 'checked',
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.hasForceExecution || false,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, 'hasForce')} />
                                    )}
                                </FormItem>
                            </Col> : null
                        }
                    {   !(creditCentralBankInfo && creditCentralBankInfo.isBlankCreditRecord) ?
                        <Row type='flex' justify='start'>
                            <Col span={12}>
                                <FormItem label="是否出现’低保救助记录‘" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.hasSalvationRecord', {
                                        valuePropName: 'checked',
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.hasSalvationRecord || false,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, 'hasSalva')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="是否有‘欠税记录’" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.hasTaxArrear', {
                                        valuePropName: 'checked',
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.hasTaxArrear || false,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, 'hasTax')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="执业资格记录是否有吊销记录" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.hasCompetenceRevoke', {
                                        valuePropName: 'checked',
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.hasCompetenceRevoke || false,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, 'hasCompe')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="电信缴费记录‘当前欠费金额’" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.telPaymentOverdueAmout', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.telPaymentOverdueAmout || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numDecimalFull1000000, validator: Validate.checkNumbersLen9 }],

                                    })(
                                        <Input autoComplete="off"  placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="行政处罚记录表中‘处罚金额’" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.adminPunishmentAmount', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.adminPunishmentAmount || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numDecimalFull1000000, validator: Validate.checkNumbersLen9 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="是否出现资产处置、保证人代偿、担保人代偿记录、以资抵债、呆账记录" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.hasBadCreditRecord', {
                                        valuePropName: 'checked',
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.hasBadCreditRecord || false,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, 'hasBad')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="未销户贷记卡机构数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.loanCardFinanceOrgCount', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.loanCardFinanceOrgCount || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger100, validator: Validate.checkNumIntegerNotNull100 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="最近1个月内的本人查询次数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.selfQueryCountIn1m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.selfQueryCountIn1m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="次" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷款最近24个月内逾期次数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.loanOverdueCountIn24m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.loanOverdueCountIn24m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="次" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷款最长逾期期数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.loanMaxOverduePeriod', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.loanMaxOverduePeriod || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="期" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷款逾期笔数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.overdueLoanCount', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.overdueLoanCount || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="笔" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷款最近24个月最大逾期期数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.loanMaxOverduePeriodIn24m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.loanMaxOverduePeriodIn24m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="期" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷款最近1次逾期距今月数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.minLoanOverdueMonthDiff', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.minLoanOverdueMonthDiff || '99',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="个月" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="最近3个月贷款审批查询次数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.queryCountForLoanApprovalIn3m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.queryCountForLoanApprovalIn3m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="次" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="最近6个月贷款审批查询次数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.queryCountForLoanApprovalIn6m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.queryCountForLoanApprovalIn6m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="次" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷记卡最近3个月内正常还款月数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.loanCardNomalPaymentMonIn3m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.loanCardNomalPaymentMonIn3m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="个月" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷记卡最近6个月内正常还款月数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.loanCardNomalPaymentMonIn6m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.loanCardNomalPaymentMonIn6m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="个月" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷记卡最近24个月内正常还款月数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.loanCardNomalPaymentMonIn24m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.loanCardNomalPaymentMonIn24m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="个月" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="未销户且共享额度>100的人民币贷记卡账户的平均共享额度" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.loanCardAvgShareAmount', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.loanCardAvgShareAmount || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numDecimalFull1000000, validator: Validate.checkNumbersLen9 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="对外担保贷款五级分类是否为：次级、可疑、损失" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.hasBadCreditFiveClass', {
                                        valuePropName: 'checked',
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.hasBadCreditFiveClass || false,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, 'hasBadFive')} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="最近2个月到期负债总额" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.liabilitiesEndIn2m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.liabilitiesEndIn2m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numDecimalFull1000000, validator: Validate.checkNumbersLen9 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="信用类授信总额" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.allCreditAmount', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.allCreditAmount || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numDecimalFull100000000, validator: Validate.checkNumbers1E }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷款/贷记卡当前逾期金额" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.curtOverdueAmt', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.curtOverdueAmt || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numDecimalFull100000000, validator: Validate.checkNumbers1E }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷记卡最近24个月内逾期次数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.creditcardOverdueCountIn24m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.creditcardOverdueCountIn24m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="次" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷记卡最近24个月内最大逾期期数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.creditcardMaxOverduePeriodIn24m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.creditcardMaxOverduePeriodIn24m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="期" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="最近12个月贷款审批查询次数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.queryCountForLoanApprovalIn12m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.queryCountForLoanApprovalIn12m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="次" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷记卡最近6个月内最大逾期期数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.creditcardMaxOverduePeriodIn6m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.creditcardMaxOverduePeriodIn6m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="期" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="最近6个月贷款审批查询机构数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.querycompForLoanApprovalIn6m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.querycompForLoanApprovalIn6m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger100, validator: Validate.checkNumIntegerNotNull100 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="最近3个月贷款审批查询机构数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.querycompForLoanApprovalIn3m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.querycompForLoanApprovalIn3m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger100, validator: Validate.checkNumIntegerNotNull100 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="贷款最近6个月内逾期次数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.loanOverdueCountIn6m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.loanOverdueCountIn6m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="次" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="首张贷记卡发卡月份距今月份数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.firstCreditCardMonthSeg', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.firstCreditCardMonthSeg || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="个月" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="其他贷款笔数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.lnotherloancount', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.lnotherloancount || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="笔" />
                                    )}
                                </FormItem>
                            </Col>
                            {/* <Col span={12}>
                                <FormItem label="过去6个月贷款逾期1及以上的机构数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.loanOverdueFinanceOrgCountIn6m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.loanOverdueFinanceOrgCountIn6m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                                    )}
                                </FormItem>
                            </Col> */}
                            {/* <Col span={12}>
                                <FormItem label="未结清贷款、未销户贷记卡和准贷记卡的授信机构数总和" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.allFinanceOrgCount', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.allFinanceOrgCount || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                                    )}
                                </FormItem>
                            </Col> */}
                            {/* <Col span={12}>
                                <FormItem label="过去6个月贷记卡逾期1及以上的机构数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.loanCdOverdueFinanceOrgCountIn6m', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.loanCdOverdueFinanceOrgCountIn6m || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numType, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="个" />
                                    )}
                                </FormItem>
                            </Col> */}
                            {/* <Col span={12}>
                                <FormItem label="产生时间最早的一次逾期发生的年月距今月份数" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.maxOverdueMonthDiff', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.maxOverdueMonthDiff || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numTypeInteger, validator: Validate.checkNumIntegerNotNull }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="个月" />
                                    )}
                                </FormItem>
                            </Col> */}
                            <Col span={12}>
                                <FormItem label="未销户贷记卡额度使用率" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.loanCardUseAvgRate', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.loanCardUseAvgRate || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numDecimalFull100, validator: Validate.checkNumDecimal100 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="%" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="央行房贷有效月供" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.effectHouseLoanMonthAmount', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.effectHouseLoanMonthAmount || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numDecimalFull1000000, validator: Validate.checkNumbersLen9 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="央行未销户贷记卡最高授信额度" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.maxLoanCardCreditAmount', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.maxLoanCardCreditAmount || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numDecimalFull100000000, validator: Validate.checkNumbers1E }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>
                            </Col>
                            {/* <Col span={12}>
                                <FormItem label="贷记卡机构授信平均授信额度" {...formItemLayout}>
                                    {getFieldDecorator('creditCentralBankInfoBO.laonCardAvgFinanceCreditAmount', {
                                        initialValue: creditCentralBankInfo && creditCentralBankInfo.laonCardAvgFinanceCreditAmount || '0',
                                        rules: [{ required: false, message: Validate.warnInfo.numDecimalFull1000000, validator: Validate.checkNumbersLen9 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                    )}
                                </FormItem>
                            </Col> */}
                        </Row> : null}
                </Row>
                </Form>
            </div>
        )
    }
}

const pureEditAssetBank = pureRender(EditAssetBank);

export default pureEditAssetBank;
