import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/editDetail.less';
import IconDelete from './../../Assets/Images/icon_delete.png';

import { Form, message } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑详细报表养殖调查
 * @Author: 钟观发
 * @Date:   2017-10-10
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-10-10
 */
class EditDetailBreed extends Component {
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
        if ( type == 'fname' ) {
            Config.WordLen15(e, message)
        }
        if ( type == 'ftotal' ) {
            Config.NumberOnly(e)
        }
        if ( type == 'fsaleamount' || type == 'feedcosts' ) {
            Config.NumberOnly(e)
            this.forceUpdate(()=>this.props.calculationBreed())
        }
    }


    ipiecesItemDelete = (itemDelete) => {
        this.setState({ 'arr': [...this.state.arr.filter((item,index)=>item != itemDelete)]})
        this.forceUpdate(()=>this.props.calculationBreed())
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { breedData, breedCost, breedRevenue } = this.props;
        return (
            <div className='editDetail-container' ref={editDetail => {this.editDetail = editDetail}}>
                <Form>
                    <div className='editDetail-top'>
                        <div className='editDetail-top-content editDetail-top-fixed'>
                            <FormItem>
                                {getFieldDecorator('revenue', {
                                    initialValue: breedData.revenue || '0',
                                    rules: [{ required: false }],
                                })(
                                    <input className='editDetail-top-input' style={{display:'none'}} placeholder='请输入' />
                                )}
                            </FormItem>
                            {
                                breedRevenue ? <p>养殖收入：{breedRevenue || '0'}</p>:
                                <p>养殖收入：{breedData.revenue || '0'}</p>
                            }
                            <p>元</p>
                        </div>
                        <div className='editDetail-top-content editDetail-top-fixed'>
                            <FormItem>
                                {getFieldDecorator('cost', {
                                    initialValue: breedData.cost || '0',
                                    rules: [{ required: false }],
                                })(
                                    <input className='editDetail-top-input' style={{display:'none'}} placeholder='请输入' />
                                )}
                            </FormItem>
                            {
                                breedCost ? <p>养殖成本：{breedCost || '0'}</p>:
                                <p>养殖成本：{breedData.cost || '0'}</p>
                            }
                            <p>元</p>
                        </div>
                    </div>
                    <div className='finance-table-container'>
                        <table className='finance-table'>
                            <thead>
                                <tr className='finance-head'>
                                    <th className='finance-head-first'>牲畜名称</th>
                                    <th className='finance-head-first'>当前剩余数(头)</th>
                                    <th className='finance-head-first'>变卖的金额(元)</th>
                                    <th className='finance-head-first'>每年饲料费(元)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.arr.map((item, index) => (
                                        <tr key = {item}>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('loanAssetFarmList['+ item +'].fname', {
                                                        initialValue: breedData.loanAssetFarmList[item] && breedData.loanAssetFarmList[item].fname || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, index, 'fname')} />
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
                                                    {getFieldDecorator('loanAssetFarmList['+ item +'].ftotal', {
                                                        initialValue: breedData.loanAssetFarmList[item] && breedData.loanAssetFarmList[item].ftotal || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, index, 'ftotal')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('loanAssetFarmList['+ item +'].fsaleamount', {
                                                        initialValue: breedData.loanAssetFarmList[item] && breedData.loanAssetFarmList[item].fsaleamount || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={cname => {this['amount' + item ] = cname}} onChange={(e)=>this.changeTable(e, index, 'fsaleamount')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='finance-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('loanAssetFarmList['+ item +'].feedcosts', {
                                                        initialValue: breedData.loanAssetFarmList[item] && breedData.loanAssetFarmList[item].feedcosts || '',
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='finance-input' autoComplete="off" placeholder="请输入" ref={cname => {this['tradeContent' + item ] = cname}} onChange={(e)=>this.changeTable(e, index, 'feedcosts')} />
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

const pureEditDetailBreed = pureRender(EditDetailBreed);

export default pureEditDetailBreed;
