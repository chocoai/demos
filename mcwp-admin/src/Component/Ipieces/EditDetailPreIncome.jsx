import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/editDetail.less';
import IconDelete from './../../Assets/Images/icon_delete.png';

import { Form, Select, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 进件编辑详细报表预收账款
 * @Author: 赵俊
 * @Date:   2017-07-12
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-12
 */
class EditDetailPreIncome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: [...Array(props.len + 1 || 1)].map((_, i)=> i),
            max: props.len + 1 || 1,
            assetTotal: props.preIncomeData.assetTotal || '0'
        }
    }

    componentWillMount() {
    }
    componentDidMount() {
    }
    // 监听输入，是否增加新的一行
    changeTable (e, index, type) {
        const { arr, max } = this.state;
        if ( index != undefined ) {
            if ( arr.length - 1 == index ) {
                this.setState({
                    arr: [...this.state.arr, max],
                    max: max + 1
                })
            }
        }
        if ( type == 'ratio' || type == 'exRatio' ) {
            Config.changeValue(e)
        }
        if ( type == 'amount' || type == 'averageAmount' || type == 'turnoverPreMonth' ) {
            Config.NumberOnly(e)
        }
        if ( type == 'cname' ) {
            Config.WordLen15(e, message)
        }
        if ( type == 'amount' ) {
            // this.calculate()
        }
    }
    calculate () {
        let arr = this.state.arr, total = 0;
        for (let i = 0; i < arr.length; i++) {
            total += parseFloat(this['amount' + arr[i]].value) || 0;
        }
        this.props.form.setFieldsValue({
            'assetTotal': total,
        });
        this.setState({
            assetTotal : total
        })
    }
    //删除
    ipiecesItemDelete = (itemDelete) => {
        this.setState({ 'arr': [...this.state.arr.filter((item,index)=>item != itemDelete)]})
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { preIncomeData } = this.props;
        return (
            <div className='editDetail-container' ref={editDetail => {this.editDetail = editDetail}}>
                <Form>
                    <div className='editDetail-top'>
                        <div className='editDetail-top-content editDetail-top-fixed'>
                            <FormItem>
                                {getFieldDecorator('assetPreIncome.assetTotal', {
                                    initialValue: preIncomeData.assetTotal || '0',
                                    rules: [{ required: false }],
                                })(
                                    <input className='editDetail-top-input' style={{display:'none'}} placeholder='请输入' />
                                )}
                            </FormItem>
                            <p>预收账总额：{this.state.assetTotal || '0'}</p>
                            <p>元</p>
                        </div>
                        <div className='editDetail-top-content'>
                            <p>预收款与月营业额占比：</p>
                            <FormItem>
                                {getFieldDecorator('assetPreIncome.exRatio', {
                                    initialValue: preIncomeData.exRatio || '',
                                    rules: [{ required: false }],
                                })(
                                    <input className='editDetail-top-input' placeholder='请输入' onChange={(e)=>this.changeTable(e, undefined, 'exRatio')} />
                                )}
                            </FormItem>
                            <p>%</p>
                        </div>
                    </div>
                    <div className='finance-table-container'>
                        <table className='finance-table'>
                            <thead>
                                <tr className='finance-head'>
                                    <th className='finance-head-first'>客户姓名</th>
                                    <th className='finance-head-first'>预收款占比（%）</th>
                                    <th className='finance-head-first'>预收款金额（元）</th>
                                    {/*<th className='finance-head-first'>交易内容</th>*/}
                                    {/*<th className='finance-head-first'>预收账款发生日期</th>*/}
                                    {/*<th className='finance-head-first'>生意往来时间（月）</th>*/}
                                    <th className='finance-head-first'>是否还有生意往来</th>
                                    <th className='finance-head-first'>一般生意往来月营业额（元）</th>
                                    <th className='finance-head-first'>上个月营业额（元）</th>
                                    {/*<th className='finance-head-first'>应何时结清</th>*/}
                                    {/*<th className='finance-head-first'>预计何时结清</th>*/}
                                    {/*<th className='finance-head-first'>备注</th>*/}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.arr.map((item, index) => (
                                        <tr key = {item}>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetPreIncome.assetInfoDTOS['+ item +'].cname', {
                                                        initialValue: preIncomeData.assetInfoDTOS[item] && preIncomeData.assetInfoDTOS[item].cname || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, index, 'cname')} />
                                                    )}
                                                </FormItem>
                                                {
                                                    index != this.state.arr.length-1?
                                                    <img onClick={()=>this.ipiecesItemDelete(item)} className='delete' src={IconDelete} alt='delete' />
                                                    :null
                                                }                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetPreIncome.assetInfoDTOS['+ item +'].ratio', {
                                                        initialValue: preIncomeData.assetInfoDTOS[item] && preIncomeData.assetInfoDTOS[item].ratio || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, index, 'ratio')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetPreIncome.assetInfoDTOS['+ item +'].amount', {
                                                        initialValue: preIncomeData.assetInfoDTOS[item] && preIncomeData.assetInfoDTOS[item].amount || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={amount => {this['amount' + item ] = amount}} onChange={(e)=>this.changeTable(e, index, 'amount')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            {/*<td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetInfoDTOS['+ item +'].tradeContent', {
                                                        initialValue: '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={()=>this.changeTable(index)} />
                                                    )}
                                                </FormItem>
                                            </td>*/}
                                            {/*<td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetInfoDTOS['+ item +'].happenDate', {
                                                        initialValue: '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={()=>this.changeTable(index)} />
                                                    )}
                                                </FormItem>
                                            </td>*/}
                                            {/*<td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetInfoDTOS['+ item +'].businessMonths', {
                                                        initialValue: '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={()=>this.changeTable(index)} />
                                                    )}
                                                </FormItem>
                                            </td>*/}
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetPreIncome.assetInfoDTOS['+ item +'].inBusiness', {
                                                        initialValue: preIncomeData.assetInfoDTOS[item] && (preIncomeData.assetInfoDTOS[item].inBusiness == 0 || preIncomeData.assetInfoDTOS[item].inBusines == 1) && preIncomeData.assetInfoDTOS[item].inBusiness.toString() || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <Select
                                                            placeholder="请选择"
                                                            style={{ width: '100%',height:'100%' }}
                                                            getPopupContainer={() => this.editDetail}
                                                            onChange={()=>this.changeTable(index)}
                                                            >
                                                                <Option value="1">是</Option>
                                                                <Option value="0">否</Option>
                                                        </Select>
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetPreIncome.assetInfoDTOS['+ item +'].averageAmount', {
                                                        initialValue: preIncomeData.assetInfoDTOS[item] && preIncomeData.assetInfoDTOS[item].averageAmount || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, index, 'averageAmount')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetPreIncome.assetInfoDTOS['+ item +'].turnoverPreMonth', {
                                                        initialValue: preIncomeData.assetInfoDTOS[item] && preIncomeData.assetInfoDTOS[item].turnoverPreMonth || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, index, 'turnoverPreMonth')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            {/*<td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetInfoDTOS['+ item +'].settleDate', {
                                                        initialValue: '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={()=>this.changeTable(index)} />
                                                    )}
                                                </FormItem>
                                            </td>*/}
                                            {/*<td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetInfoDTOS['+ item +'].expectSettleDate', {
                                                        initialValue: '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={()=>this.changeTable(index)} />
                                                    )}
                                                </FormItem>
                                            </td>*/}
                                            {/*<td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetInfoDTOS['+ item +'].remark', {
                                                        initialValue: preIncomeData.assetInfoDTOS[item] && preIncomeData.assetInfoDTOS[item].remark || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={()=>this.changeTable(index)} />
                                                    )}
                                                </FormItem>
                                            </td>*/}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </Form>
            </div>
        )
    }
}

const pureEditDetailPreIncome = pureRender(EditDetailPreIncome);

export default pureEditDetailPreIncome;
