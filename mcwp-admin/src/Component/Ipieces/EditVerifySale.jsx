import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import './style/editVerify.less';
import IconDelete from './../../Assets/Images/icon_delete.png';

import { Form, message } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑逻辑校验录入检验项销售
 * @Author: 赵俊
 * @Date:   2017-07-17
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-18
 */
class EditVerifySale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            monthArr: [...Array(props.monthTurnover? props.monthTurnover.length + 1 : 1)].map((_, i)=> i),
            monthMax: props.monthTurnover? props.monthTurnover.length + 1 : 1,
            dayArr: [...Array(props.dayTurnover? props.dayTurnover.length + 1 : 1)].map((_, i)=> i),
            dayMax: props.dayTurnover? props.dayTurnover.length + 1 : 1,
            wageArr: [...Array(props.deductionWageSale? props.deductionWageSale.length + 1 : 1)].map((_, i)=> i),
            wageMax: props.deductionWageSale? props.deductionWageSale.length + 1 : 1,
            computerArr: [...Array(props.computerTurnover? props.computerTurnover.length + 1 : 1)].map((_, i)=> i),
            computerMax: props.computerTurnover? props.computerTurnover.length + 1 : 1,
        }

    }

    componentWillMount() {
    }
    componentDidMount() {
        //回到顶部
        document.getElementById('verify-title-top').scrollIntoView();
    }
    changeTable = (e, type, index, arrType) => {
        if ( arrType && this.state[arrType + 'Arr'].length - 1 == index) {
            this.setState({ 
                [arrType + 'Arr']: [...this.state[arrType + 'Arr'], this.state[arrType + 'Max']],
                [arrType + 'Max']: this.state[arrType + 'Max'] + 1                
            })
        }
        if ( type == 'date'  ) {
            Config.changeMonth12(e, message);
            return;
        }
        if ( type == 'day'  ) {
            Config.changeDay31(e, message);
            return;
        }
        Config.NumberOnly(e)
    }

    //删除
    ipiecesItemDelete = (itemDelete, arrType) => {
        let arr = this.state[arrType + 'Arr'];
        this.setState({ [arrType + 'Arr']: [...arr.filter((item,index)=>item != itemDelete)]})
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { loanLogicVerifySingle, monthTurnover, dayTurnover, deductionWageSale, computerTurnover, averData, topInfo } = this.props;
        return (
            <div className='editVerify-container'>
                <Form>
                    <div className='verify-table-container'>
                        <h3 className='verify-title' id='verify-title-top'>按计件工资计算</h3>
                        <table className='verify-table'>
                            <thead>
                                <tr className='verify-head'>
                                    <th className='verify-head-first verify-head-half'>每月计件提成工资总额（元）</th>
                                    <th className='verify-head-first verify-head-half'>单件计件工资（元）</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.monthlyCommission', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.monthlyCommission || '' ,
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'cusOralMargin')} />
                                            )}
                                        </FormItem>
                                    </td>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.singlePieceWage', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.singlePieceWage || '' ,
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'averageGrossMargin')} />
                                            )}
                                        </FormItem>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='verify-table-container'>
                        <h3 className='verify-title'>按月均营业额计算</h3>
                        <p className='verify-alone'>月均营业额：{averData.monthCountMAT || ''}元</p>
                        <table className='verify-table'>
                            <thead>
                                <tr className='verify-head'>
                                    <th className='verify-head-first verify-head-second'>月份</th>
                                    <th className='verify-head-first verify-head-third'>营业额（元）</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.monthArr.map((item, index, currentArr) => (
                                        <tr key = {item}>
                                            <td className='verify-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('monthTurnover['+ item +'].date', {
                                                        initialValue: monthTurnover && monthTurnover[item] && monthTurnover[item].date || '' , 
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'date', index, 'month')} />
                                                    )}
                                                </FormItem>
                                                {
                                                    index != currentArr.length-1?
                                                    <img onClick={()=>this.ipiecesItemDelete(item, 'month')} className='delete' src={IconDelete} alt='delete' />
                                                    :null
                                                }              
                                            </td>
                                            <td className='verify-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('monthTurnover['+ item +'].salesAmount', {
                                                        initialValue: monthTurnover && monthTurnover[item] && monthTurnover[item].salesAmount || '' , 
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'salesAmount', index, 'month')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='verify-table-container'>
                        <h3 className='verify-title'>按日均营业额计算</h3>
                        <p className='verify-alone'>日均营业额：{averData.dayTurnover || ''}元</p>
                        <p className='verify-alone'>月均营业额：{averData.dayCountMAT || ''}元</p>
                        <table className='verify-table'>
                            <thead>
                                <tr className='verify-head'>
                                    <th className='verify-head-first verify-head-second'>日期</th>
                                    <th className='verify-head-first verify-head-third'>营业额（元）</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.dayArr.map((item, index, currentArr) => (
                                        <tr key = {item}>
                                            <td className='verify-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('dayTurnover['+ item +'].date', {
                                                        initialValue: dayTurnover && dayTurnover[item] && dayTurnover[item].date || '' , 
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'day', index, 'day')} />
                                                    )}
                                                </FormItem>
                                                {
                                                    index != currentArr.length-1?
                                                    <img onClick={()=>this.ipiecesItemDelete(item, 'day')} className='delete' src={IconDelete} alt='delete' />
                                                    :null
                                                }     
                                            </td>
                                            <td className='verify-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('dayTurnover['+ item +'].salesAmount', {
                                                        initialValue: dayTurnover && dayTurnover[item] && dayTurnover[item].salesAmount || '' , 
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'salesAmount', index, 'day')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='verify-table-container'>
                        <h3 className='verify-title'>按客户账本记载计算</h3>
                        <table className='verify-table'>
                            <thead>
                                <tr className='verify-head'>
                                    <th className='verify-head-first verify-head-one'>日期</th>
                                    <th className='verify-head-first verify-head-one'>营业额（元）</th>
                                    <th className='verify-head-first verify-head-one'>在实际营业额中占比（%）</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='verify-table-content'>
                                        <p className='verify-content'>一个月内</p>
                                    </td>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.cusReportAmount', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.cusReportAmount || '' , 
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'cusReportAmount')} />
                                            )}
                                        </FormItem>
                                    </td>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.cusReportAtRatio', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.cusReportAtRatio || '' , 
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'cusReportAtRatio')} />
                                            )}
                                        </FormItem>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='verify-table-container'>
                        <h3 className='verify-title'>按存折（银行流水账）计算</h3>
                        {
                            topInfo && topInfo.hasCarrierRecode ?
                            <p className='result-content'>已通过查询密码获取主营借记卡流水信息</p>
                            : null
                        }
                        <table className='verify-table'>
                            <thead>
                                <tr className='verify-head'>
                                    <th className='verify-head-first verify-head-one'>日期</th>
                                    <th className='verify-head-first verify-head-one'>存入金额（元）</th>
                                    <th className='verify-head-first verify-head-one'>在实际营业额中占比（%）</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='verify-table-content'>
                                        <p className='verify-content'>一个月内</p>
                                    </td>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.depositAmount', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.depositAmount || '' , 
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'depositAmount')} />
                                            )}
                                        </FormItem>
                                    </td>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.depositAtRatio', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.depositAtRatio || '' , 
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'depositAtRatio')} />
                                            )}
                                        </FormItem>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='verify-table-container'>
                        <h3 className='verify-title'>按提成工资计算</h3>
                        <p className='verify-alone'>月均营业额：{averData.bonusMAT || ''}元</p>
                        <table className='verify-table'>
                            <thead>
                                <tr className='verify-head'>
                                    <th className='verify-head-first verify-head-four'>人员</th>
                                    <th className='verify-head-first verify-head-four'>提成金额（元）</th>
                                    <th className='verify-head-first verify-head-four'>提成比例（%）</th>
                                    <th className='verify-head-first verify-head-four'>营业额（元）</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.wageArr.map((item, index, currentArr) => (
                                        <tr key = {item}>
                                            <td className='verify-table-content'>
                                                <FormItem>
                                                    {/*{getFieldDecorator('deductionWageSale.cusOralMargin', {
                                                        rules: [{ required: false }],
                                                    })(*/}
                                                        <p className='verify-content'>{'营业员' + (index + 1)}</p>
                                                    {/*)}*/}
                                                </FormItem>
                                                {
                                                    index != currentArr.length-1?
                                                    <img onClick={()=>this.ipiecesItemDelete(item, 'wage')} className='delete' src={IconDelete} alt='delete' />
                                                    :null
                                                }    
                                            </td>
                                            <td className='verify-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('deductionWageSale['+ item +'].royalty', {
                                                        initialValue: deductionWageSale && deductionWageSale[item] && deductionWageSale[item].royalty || '' , 
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'royalty', index, 'wage')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='verify-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('deductionWageSale['+ item +'].royaltyRadio', {
                                                        initialValue: deductionWageSale && deductionWageSale[item] && deductionWageSale[item].royaltyRadio || '' , 
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'royaltyRadio', index, 'wage')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                            <td className='verify-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('deductionWageSale['+ item +'].salesAmount', {
                                                        initialValue: deductionWageSale && deductionWageSale[item] && deductionWageSale[item].salesAmount || '' , 
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'salesAmount', index, 'wage')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='verify-table-container'>
                        <h3 className='verify-title'>按客户手头现金计算</h3>
                        <p className='verify-alone'>单位时间营业额：{averData.perHourAmount || ''}元</p>
                        <p className='verify-alone'>每天营业额：{averData.dayAmount || ''}元</p>
                        <table className='verify-table'>
                            <thead>
                                <tr className='verify-head'>
                                    <th className='verify-head-first verify-head-one'>现金金额（元）</th>
                                    <th className='verify-head-first verify-head-one'>营业时间（小时）</th>
                                    <th className='verify-head-first verify-head-one'>每天营业时间（小时）</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.currentCash', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.currentCash || '' , 
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'cusOralMargin')} />
                                            )}
                                        </FormItem>
                                    </td>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.shopHours', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.shopHours || '' , 
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'averageGrossMargin')} />
                                            )}
                                        </FormItem>
                                    </td>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.dailyHours', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.dailyHours || '' , 
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'cusOralMargin')} />
                                            )}
                                        </FormItem>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='verify-table-container'>
                        <h3 className='verify-title'>按电脑销售记录计算</h3>
                        <p className='verify-alone'>月均营业额：{averData.computerMAT || ''}元</p>
                        <table className='verify-table'>
                            <thead>
                                <tr className='verify-head'>
                                    <th className='verify-head-first verify-head-second'>月份</th>
                                    <th className='verify-head-first verify-head-third'>营业额（元）</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.computerArr.map((item, index, currentArr) => (
                                        <tr key = {item}>
                                            <td className='verify-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('computerTurnover['+ item +'].date', {
                                                        initialValue: computerTurnover && computerTurnover[item] && computerTurnover[item].date || '' , 
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'date', index, 'computer')} />
                                                    )}
                                                </FormItem>
                                                {
                                                    index != currentArr.length-1?
                                                    <img onClick={()=>this.ipiecesItemDelete(item, 'computer')} className='delete' src={IconDelete} alt='delete' />
                                                    :null
                                                }      
                                            </td>
                                            <td className='verify-table-content'>
                                                <FormItem>
                                                    {getFieldDecorator('computerTurnover['+ item +'].salesAmount', {
                                                        initialValue: computerTurnover && computerTurnover[item] && computerTurnover[item].salesAmount || '' , 
                                                        rules: [{ required: false }],
                                                    })(
                                                        <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'salesAmount', index, 'computer')} />
                                                    )}
                                                </FormItem>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='verify-table-container'>
                        <h3 className='verify-title'>按进货周期、进货量计算</h3>
                        <p className='verify-alone'>月采购额：{averData.monthlyPurchase || ''}元</p>
                        <p className='verify-alone'>月均营业额：{averData.stockTurnoverMAT || ''}元</p>
                        <table className='verify-table'>
                            <thead>
                                <tr className='verify-head'>
                                    <th className='verify-head-first verify-head-half'>进货周期（天）</th>
                                    <th className='verify-head-first verify-head-half'>每次进货量</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.receiptPeriod', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.receiptPeriod || '' , 
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'receiptPeriod')} />
                                            )}
                                        </FormItem>
                                    </td>
                                    <td className='verify-table-content'>
                                        <FormItem>
                                            {getFieldDecorator('loanLogicVerifySingle.quantityPerPurchase', {
                                                initialValue: loanLogicVerifySingle && loanLogicVerifySingle.quantityPerPurchase || '' , 
                                                rules: [{ required: false }],
                                            })(
                                                <input className='verify-input' autoComplete="off" placeholder="请输入" onChange={(e)=>this.changeTable(e, 'quantityPerPurchase')} />
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