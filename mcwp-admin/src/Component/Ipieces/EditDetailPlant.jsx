import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/editDetail.less';
import IconDelete from './../../Assets/Images/icon_delete.png';

import { Form, message } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑详细报表种植调查
 * @Author: 钟观发
 * @Date:   2017-10-10
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-10-10
 */
class EditDetailPlant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: [...Array(props.len + 1 || 1)].map((_, i)=> i),
            max: props.len + 1 || 1,
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
        if ( type == 'pname ' ) {
            Config.WordLen15(e, message)
        }
        if ( type == 'pcost ' || type == 'psaleamount ' || type == 'parea ' || type == 'totalharvest ' ) {
            Config.NumberOnly(e);
            this.forceUpdate(()=>this.props.calculationPlant())
        }
    }

    
    ipiecesItemDelete = (itemDelete) => {
        this.setState({ 'arr': [...this.state.arr.filter((item,index)=>item != itemDelete)]})
        this.forceUpdate(()=>this.props.calculationPlant())
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { plantData, plantCost, plantRevenue } = this.props;
        return (
            <div className='editDetail-container' ref={editDetail => {this.editDetail = editDetail}}>
                <Form>
                    <div className='editDetail-top'>
                        <div className='editDetail-top-content editDetail-top-fixed'>
                            <FormItem>
                                {getFieldDecorator('revenue', {
                                    initialValue: plantData.revenue  || '0',
                                    rules: [{ required: false }],
                                })(
                                    <input className='editDetail-top-input' style={{display:'none'}} placeholder='请输入' />
                                )}
                            </FormItem>
                            {
                                plantRevenue ? <p>种植收入：{ plantRevenue || '0'}</p>:
                                <p>种植收入：{plantData.revenue  || '0'}</p>
                            }
                            <p>元</p>
                        </div>
                        <div className='editDetail-top-content editDetail-top-fixed'>
                            <FormItem>
                                {getFieldDecorator('cost', {
                                    initialValue: plantData.cost  || '0',
                                    rules: [{ required: false }],
                                })(
                                    <input className='editDetail-top-input' style={{display:'none'}} placeholder='请输入' />
                                )}
                            </FormItem>
                            {
                                plantCost ? <p>种植成本：{ plantCost || '0'}</p>:
                                <p>种植成本：{plantData.cost  || '0'}</p>
                            }
                            <p>元</p>
                        </div>
                    </div>
                    <div className='finance-table-container'>
                        <table className='finance-table'>
                            <thead>
                                <tr className='finance-head'>
                                    <th className='finance-head-first'>种植物名称</th>
                                    <th className='finance-head-first'>每吨成本(元)</th>
                                    <th className='finance-head-first'>变卖的金额(元)</th>
                                    <th className='finance-head-first'>种植面积(亩)</th>
                                    <th className='finance-head-first'>总收成(吨)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.arr.map((item, index) => (
                                        <tr key = {item}>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('loanAssetPlantList['+ item +'].pname', {
                                                        initialValue: plantData.loanAssetPlantList[item] && plantData.loanAssetPlantList[item].pname  || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, index, 'pname ')} />
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
                                                    {getFieldDecorator('loanAssetPlantList['+ item +'].pcost', {
                                                        initialValue: plantData.loanAssetPlantList[item] && plantData.loanAssetPlantList[item].pcost  || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, index, 'pcost ')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('loanAssetPlantList['+ item +'].psaleamount', {
                                                        initialValue: plantData.loanAssetPlantList[item] && plantData.loanAssetPlantList[item].psaleamount  || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={cname => {this['amount' + item ] = cname}} onChange={(e)=>this.changeTable(e, index, 'psaleamount ')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('loanAssetPlantList['+ item +'].parea', {
                                                        initialValue: plantData.loanAssetPlantList[item] && plantData.loanAssetPlantList[item].parea  || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={cname => {this['tradeContent' + item ] = cname}} onChange={(e)=>this.changeTable(e, index, 'parea ')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('loanAssetPlantList['+ item +'].totalharvest', {
                                                        initialValue: plantData.loanAssetPlantList[item] && plantData.loanAssetPlantList[item].totalharvest  || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={totalharvest  => {this['totalharvest ' + item ] = totalharvest }} onChange={(e)=>this.changeTable(e, index, 'totalharvest ')} />
                                                    )}
                                                </FormItem>
                                            </td>
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

const pureEditDetailPlant = pureRender(EditDetailPlant);

export default pureEditDetailPlant;