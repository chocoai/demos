import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/rule.less';

/**
 * 规则库销售逻辑校验
 * @Author: 赵俊
 * @Date:   2017-07-07 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-08
 */
class RuleSale extends Component {
    saveValue = (e) => {
        const {changeRule, putRule} = this.props;
        let ruleData = this.props.ruleData;
        ruleData[4].deviationThreshold = this.four.value;
        ruleData[5].deviationThreshold = this.five.value;
        ruleData[6].deviationThreshold = this.six.value;
        ruleData[7].deviationThreshold = this.seven.value;
        ruleData[8].deviationThreshold = this.eight.value;
        ruleData[9].deviationThreshold = this.nine.value;
        ruleData[10].deviationThreshold = this.ten.value;
        ruleData[11].deviationThreshold = this.eleven.value;
        ruleData[12].deviationThreshold = this.twelve.value;
        changeRule(ruleData);
        putRule({loanLogicVerifyDts: ruleData},'SALE_STATUS_CANCEL');
    }

    render() {
        return (
            <div className='rule-detail-container'>
                {/* <div className='rule-subtitle-container'> 
                    <p className='rule-subtitle'>偏差率阈值设定</p>
                    {
                        saleStatus?
                        <p className='rule-operate' onClick={()=>editRule('SALE_STATUS_EDIT',0)}>
                            <img className='rule-edit-img' src={editImg} />
                            <span className='rule-edit'>编辑</span>
                        </p>:
                        <p className='rule-operating'>
                            <span className='rule-save' onClick={this.saveValue}>保存</span>
                            <span className='rule-cancel' onClick={()=>editRule('SALE_STATUS_CANCEL',1)}>取消</span>
                        </p>
                    }
                </div>
                <ul className='rule-setting'>
                    <li>
                        <span className='setting-name'>按计件工资计算的销售额—偏差率阈值</span>
                        {
                            saleStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[4].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[4].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.four=ref}} />
                        }
                        <span>%</span>
                    </li>
                    <li>
                        <span className='setting-name'>按天计算的销售额—偏差率阈值</span>
                        {
                            saleStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[5].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[5].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.five=ref}} />
                        }
                        <span>%</span>
                    </li>
                    <li>
                        <span className='setting-name'>按月计算的销售额—偏差率阈值</span>
                        {
                            saleStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[6].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[6].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.six=ref}} />
                        }
                        <span>%</span>
                    </li>
                    <li>
                        <span className='setting-name'>按客户账本计算的销售额—偏差率阈值</span>
                        {
                            saleStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[7].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[7].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.seven=ref}} />
                        }
                        <span>%</span>
                    </li>
                    <li>
                        <span className='setting-name'>按提成工资计算的销售额—偏差率阈值</span>
                        {
                            saleStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[9].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[9].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.nine=ref}} />
                        }
                        <span>%</span>
                    </li>
                    <li>
                        <span className='setting-name'>按客户手头现金计算的销售额—偏差率阈值</span>
                        {
                            saleStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[10].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[10].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.ten=ref}} />
                        }
                        <span>%</span>
                    </li>
                    <li>
                        <span className='setting-name'>按存折（银行流水）计算的销售额—偏差率阈值</span>
                        {
                            saleStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[8].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[8].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.eight=ref}} />
                        }
                        <span>%</span>
                    </li>
                    <li>
                        <span className='setting-name'>按电脑销售记录计算的销售额—偏差率阈值</span>
                        {
                            saleStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[11].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[11].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.eleven=ref}} />
                        }
                        <span>%</span>
                    </li>
                    <li>
                        <span className='setting-name'>按进货周期、进货量、毛利率计算的销售额—偏差率阈值</span>
                        {
                            saleStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[12].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[12].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.twelve=ref}} />
                        }
                        <span>%</span>
                    </li>
                </ul> */}
                <p className='rule-formula'>公式列表</p>
                <ul className='rule-formula-list'>
                    <li className='formula-detail formula-complex'>
                        <p>偏差率 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>月均营业额 - 客户口述月均营业额</span>
                            <span>客户口述月均营业额</span>
                        </p>
                        <p>× 100</p>
                    </li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>按计件工资计算的营业额（生产）</li>
                    <li className='formula-detail formula-complex'>
                        <p>产成品数量 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>工资金额</span>
                            <span>单品计件工资</span>
                        </p>
                    </li>
                    <li className='formula-detail'>单品n1销售数量 &lt;= 产成品数量</li>
                    <li className='formula-detail formula-complex'>
                        <p>月均营业额 =</p>
                        <p className='formula-divide formula-sale'>
                            <span >（单品n1销售金额 × 产成品数量 × 单品n1销售占比） + ... +（单品n销售金额 × 产成品数量 × 单品n销售占比）</span>
                            
                        </p>
                    </li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>按月计算的营业额</li>
                    <li className='formula-detail formula-complex'>
                        <p>月均营业额 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>营业额m1 + .. + 营业额m12</span>
                            <span>12</span>
                        </p>
                    </li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>按天计算的营业额</li>
                    <li className='formula-detail formula-complex'>
                        <p>日均营业额 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>营业额d1 + .. + 营业额dn</span>
                            <span>n</span>
                        </p>
                    </li>
                    <li className='formula-detail'>月均营业额 = 日均营业额 × 30</li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>按客户帐本记载的营业额</li>
                    <li className='formula-detail'>月均营业额 = 销售帐本(一月内)营业额</li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>按提成工资计算的营业额</li>
                    <li className='formula-detail formula-complex'>
                        <p>销售人员月销售额 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>提成金额</span>
                            <span>提成比例</span>
                        </p>
                    </li>
                    <li className='formula-detail'>月均营业额 = 销售人员1 + .. + 销售人员n (月销售额)</li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>按客户手头现金计算的营业额</li>
                    <li className='formula-detail formula-complex'>
                        <p>单位时间营业额 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>当前现金</span>
                            <span>营业时间（小时）</span>
                        </p>
                    </li>
                    <li className='formula-detail'>每天营业额 = 每日营业时间(小时) × 单位时间营业额</li>
                    <li className='formula-detail'>月均营业额 = 每天营业额 × 30</li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>按存折（银行流水账）计算的营业额</li>
                    <li className='formula-detail'>月均营业额 = 银行存入金额(一月内)</li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>按电脑销售记录的营业额</li>
                    <li className='formula-detail formula-complex'>
                        <p>月均营业额 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>电脑记录营业额m1 + .. + 电脑记录营业额m12</span>
                            <span>12</span>
                        </p>
                    </li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>按进货周期、进货量、毛利率推算的营业额</li>
                    <li className='formula-detail formula-complex'>
                        <p>月采购额 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>每次进货量 × 30</span>
                            <span>进货周期</span>
                        </p>
                    </li>
                    <li className='formula-detail formula-complex'>
                        <p>月均营业额 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>月采购额</span>
                            <span>1 - 加权毛利率</span>
                        </p>
                    </li>
                </ul>
            </div>
        )
    }
}

const pureRuleSale = pureRender(RuleSale);

export default pureRuleSale;