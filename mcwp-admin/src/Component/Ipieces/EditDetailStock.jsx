import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/editDetail.less';
import IconDelete from './../../Assets/Images/icon_delete.png';

import { Form, message } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑详细报表存货
 * @Author: 赵俊
 * @Date:   2017-07-12
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-12
 */
class EditDetailStock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: [...Array(props.len + 1 || 1)].map((_, i)=> i),
            max: props.len + 1 || 1,
            assetTotal: props.stockData.assetTotal || '0',
            grossRateCalc: props.stockData.assetStockDTOS.map((item,index)=>(item.grossRate)) || [],
            wghtGrossRateCalc : props.stockData.wghtGrossRate || '0'
        }
    }

    componentWillMount() {
    }
    componentDidMount() {
    }
    changeTable = (e, index, type, item) => {
        const { arr, max } = this.state;
        if ( arr.length - 1 == index ) {
            this.setState({
                arr: [...this.state.arr, max],
                max: max + 1
            })
        }
        if ( type == 'address' || type == 'kinds' || type == 'sname' || type == 'num' ) {
            Config.WordLen15(e, message)
        }
        if ( type == 'ratio' ) {
            Config.changeValue(e)
        }
        if ( type == 'amount' || type == 'cost' || type == 'price' ) {
            Config.NumberOnly(e)
        }
        // if ( type == 'amount' ) {
            // this.calculateTotal()
        // }
        // if ( type == 'cost' || type == 'price' ) {
            // this.calculateGrossRate(item)
        // }
        // if ( type == 'ratio' || type == 'cost' || type == 'price' ) {
            // this.calcWghtGrossRate()
        // }
    }

    // calculateTotal () {
    //     let arr = this.state.arr, total = 0;
    //     for (let i = 0; i < arr.length; i++) {
    //         total += parseFloat(this['amount' + arr[i]].value) || 0;
    //     }
    //     this.props.form.setFieldsValue({
    //         'assetTotal': total,
    //     });
    //     this.setState({
    //         assetTotal : total
    //     })
    // }
    // calculateGrossRate (item) {
    //     let arr = this.state.grossRateCalc;
    //     if( !this['price' + item ].value ) {
    //         arr[item] = 0;
    //     } else {
    //         arr[item] = (( this['price' + item ].value * 100 -  this['cost' + item ].value * 100) / (this['price' + item ].value * 100) * 100).toFixed(2);
    //     }
    //     this.setState({
    //         grossRateCalc: arr
    //     })
        // initialValue: stockData.assetStockDTOS[item] && stockData.assetStockDTOS[item].grossRate || '',

        // this.props.form.setFieldsValue({
        //     ['assetStockDTOS[' + item +'].grossRate']: arr[item]
        // });
    // }
    // calcWghtGrossRate () {
    //     let arr = this.state.arr;
    //     let grossRateCalc = this.state.grossRateCalc;
    //     let calc = 0, total = 0, num =0;
    //     for (let i = 0; i < arr.length; i++) {
    //         num += (parseFloat(this['ratio' + arr[i]].value) || 0) * (parseFloat(grossRateCalc[i].value) || 0)
    //         total += parseFloat(this['ratio' + arr[i]].value) || 0;
    //     }
    //     if ( total != 0 ) {
    //         calc = ((num/total) * 100).toFixed(2);
    //     } else {
    //         calc = 0
    //     }
    //     this.props.form.setFieldsValue({
    //         'wghtGrossRate': calc,
    //     });
    //     this.setState({
    //         wghtGrossRateCalc : calc
    //     })
    // }
    //删除
    ipiecesItemDelete = (itemDelete) => {
        this.setState({ 'arr': [...this.state.arr.filter((item,index)=>item != itemDelete)]})
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { stockData } = this.props;
        return (
            <div className='editDetail-container' ref={editDetail => {this.editDetail = editDetail}}>
                <Form>
                    <div className='editDetail-top'>
                        <div className='editDetail-top-content editDetail-top-fixed'>
                            <FormItem>
                                {getFieldDecorator('assetStockDTOS.assetTotal', {
                                    initialValue: stockData.stockTotal || '0',
                                    rules: [{ required: false }],
                                })(
                                    <input className='editDetail-top-input' style={{display:'none'}} placeholder='请输入' />
                                )}
                            </FormItem>
                            <p>存货总额：{stockData.stockTotal || '0'}</p>
                            <p>元</p>
                        </div>
                        <div className='editDetail-top-content editDetail-top-fixed'>
                            <FormItem>
                                {getFieldDecorator('assetStockDTOS.wghtGrossRate', {
                                    initialValue: stockData.wghtGrossRate || '0',
                                    rules: [{ required: false }],
                                })(
                                    <input className='editDetail-top-input' style={{display:'none'}} placeholder='请输入' />
                                )}
                            </FormItem>
                            <p>加权毛利率：{stockData.wghtGrossRate || '0'}</p>
                            <p>%</p>
                        </div>
                    </div>
                    <div className='finance-table-container'>
                        <table className='finance-table'>
                            <thead>
                                <tr className='finance-head'>
                                    <th className='finance-head-first'>货物地点</th>
                                    <th className='finance-head-first'>类别</th>
                                    <th className='finance-head-first'>名称</th>
                                    <th className='finance-head-first'>数量</th>
                                    <th className='finance-head-first'>比例（%）</th>
                                    <th className='finance-head-first'>金额（元）</th>
                                    <th className='finance-head-first'>进价（元）</th>
                                    <th className='finance-head-first'>售价（元）</th>
                                    <th className='finance-head-first'>毛利率（%）</th>
                                    {/*<th className='finance-head-first'>备注</th>*/}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.arr.map((item, index) => (
                                        <tr key = {item}>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetStockDTOS.assetStockDTOS['+ item +'].address', {
                                                        initialValue: stockData.assetStockDTOS[item] && stockData.assetStockDTOS[item].address || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, index, 'address')} />
                                                    )}
                                                </FormItem>
                                                {
                                                    index != this.state.arr.length-1?
                                                    <img onClick={()=>this.ipiecesItemDelete(item)} className='delete' src={IconDelete} alt='delete' />
                                                    :null
                                                }
                                                </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetStockDTOS.assetStockDTOS['+ item +'].kinds', {
                                                        initialValue: stockData.assetStockDTOS[item] && stockData.assetStockDTOS[item].kinds || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, index, 'kinds')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetStockDTOS.assetStockDTOS['+ item +'].sname', {
                                                        initialValue: stockData.assetStockDTOS[item] && stockData.assetStockDTOS[item].sname || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={cname => {this['amount' + item ] = cname}} onChange={(e)=>this.changeTable(e, index, 'sname')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetStockDTOS.assetStockDTOS['+ item +'].num', {
                                                        initialValue: stockData.assetStockDTOS[item] && stockData.assetStockDTOS[item].num || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={cname => {this['tradeContent' + item ] = cname}} onChange={(e)=>this.changeTable(e, index, 'num')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetStockDTOS.assetStockDTOS['+ item +'].ratio', {
                                                        initialValue: stockData.assetStockDTOS[item] && stockData.assetStockDTOS[item].ratio || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={ratio => {this['ratio' + item ] = ratio}} onChange={(e)=>this.changeTable(e, index, 'ratio')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetStockDTOS.assetStockDTOS['+ item +'].amount', {
                                                        initialValue: stockData.assetStockDTOS[item] && stockData.assetStockDTOS[item].amount || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={amount => {this['amount' + item ] = amount}} onChange={(e)=>this.changeTable(e, index, 'amount')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetStockDTOS.assetStockDTOS['+ item +'].cost', {
                                                        initialValue: stockData.assetStockDTOS[item] && stockData.assetStockDTOS[item].cost || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={cost => {this['cost' + item ] = cost}} onChange={(e)=>this.changeTable(e, index, 'cost', item)} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetStockDTOS.assetStockDTOS['+ item +'].price', {
                                                        initialValue: stockData.assetStockDTOS[item] && stockData.assetStockDTOS[item].price || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={price => {this['price' + item ] = price}} onChange={(e)=>this.changeTable(e, index, 'price', item)} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                {/*<FormItem>
                                                    {getFieldDecorator('assetStockDTOS['+ item +'].grossRate', {
                                                        value:this.state.grossRateCalc[item] || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <Input className='finance-input' style={{display: 'none'}} ref={grossRate => {this['grossRate' + item ] = grossRate}} autoComplete="off" placeholder="请输入" />
                                                    )}
                                                </FormItem>*/}
                                                <p className='finance-input'>{stockData.assetStockDTOS[item] && stockData.assetStockDTOS[item].grossRate || ''}</p>
                                            </td>
                                            {/*<td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('assetStockDTOS['+ item +'].remark', {
                                                        initialValue: stockData.assetStockDTOS[item] && stockData.assetStockDTOS[item].remark || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={cname => {this['settleDate' + item ] = cname}} onChange={()=>this.changeTable(index)} />
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

const pureEditDetailStock = pureRender(EditDetailStock);

export default pureEditDetailStock;
