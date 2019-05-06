import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/editVerify.less';

import { Form } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑逻辑校验录入检验项采购
 * @Author: 赵俊
 * @Date:   2017-07-17
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-18
 */
class EditVerifySale extends Component {
    componentWillMount() {
    }
    componentDidMount() {
        document.getElementById('remittanceFrequency').scrollIntoView();
    }
    changeTable (e, type) {
        Config.NumberOnly(e)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { loanLogicVerifySingle, averData } = this.props;
        return (
            <div className='editVerify-container'>
                <Form>
                    <div className='verify-table-container'>
                        <h3 className='verify-title' id='remittanceFrequency'>按汇款金额与汇款频率</h3>
                        <p className='verify-alone'>月均营业额：{averData.remittanceFrequencyMAT || ''}元</p>
                        <table className='verify-table'>
                            <thead>
                                <tr className='verify-head'>
                                    <th className='verify-head-first verify-head-second'>日期</th>
                                    <th className='verify-head-first verify-head-third'>汇款金额（元）</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='verify-table-content'>
                                        <p className='verify-content'>一个月内</p>
                                    </td>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.paymentAmount', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.paymentAmount || '' ,
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'paymentAmount')} />
                                            )}
                                        </FormItem>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='verify-table-container'>
                        <h3 className='verify-title'>按进货金额与进货频率</h3>
                        <p className='verify-alone'>月均营业额：{averData.purchaseAmountFrequencyMAT || ''}元</p>
                        <table className='verify-table'>
                            <thead>
                                <tr className='verify-head'>
                                    <th className='verify-head-first verify-head-second'>日期</th>
                                    <th className='verify-head-first verify-head-third'>进货金额（元）</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='verify-table-content'>
                                        <p className='verify-content'>一个月内</p>
                                    </td>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.purchaseAmount', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.purchaseAmount || '' ,
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'purchaseAmount')} />
                                            )}
                                        </FormItem>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Form>
            </div>
        )
    }
}

const pureEditVerifySale = pureRender(EditVerifySale);

export default pureEditVerifySale;