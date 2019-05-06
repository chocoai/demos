import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
// import { Validate } from '../../Config/Validate';
import './style/editVerify.less';

import { Form } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑逻辑校验录入检验项毛利率
 * @Author: 赵俊
 * @Date:   2017-07-17
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-17
 */
class EditVerifyProfit extends Component {
    componentDidMount() {
    }
    changeTable (e, type) {
        if(type == 'cusOralMargin') {
            Config.changeValue9999(e)
        }
        if(type == 'averageGrossMargin') {
            Config.changeValue9999(e)
        }
        Config.NumberOnly(e)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { loanLogicVerifySingle } = this.props;
        return (
            <div className='editVerify-container'>
                <Form>
                    <div className='verify-table-container'>
                        <h3 className='verify-title'>毛利率逻辑检验表</h3>
                        <table className='verify-table'>
                            <thead>
                                <tr className='verify-head'>
                                    <th className='verify-head-first verify-head-one'>客户口述毛利率（%）</th>
                                    <th className='verify-head-first verify-head-one'>行业平均毛利率（%）</th>
                                    <th className='verify-head-first verify-head-one'>客户口述月均营业额（元）</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.cusOralMargin', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.cusOralMargin || '' ,
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'cusOralMargin')} />
                                            )}
                                        </FormItem>
                                    </td>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.averageGrossMargin', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.averageGrossMargin || '' ,
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'averageGrossMargin')} />
                                            )}
                                        </FormItem>
                                    </td>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.cusSpeakMonthTurnover', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.cusSpeakMonthTurnover || '' ,
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'cusSpeakMonthTurnover')} />
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

const pureEditVerifyProfit = pureRender(EditVerifyProfit);

export default pureEditVerifyProfit;