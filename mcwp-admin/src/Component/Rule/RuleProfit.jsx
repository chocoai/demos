import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/rule.less';

/**
 * 规则库毛利逻辑校验
 * @Author: 赵俊
 * @Date:   2017-07-07 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-08
 */
class RuleProfit extends Component {
    saveValue = (e) => {
        const {changeRule, putRule} = this.props;
        let ruleData = this.props.ruleData;
        ruleData[1].deviationThreshold = this.one.value;
        ruleData[2].deviationThreshold = this.two.value;
        ruleData[3].deviationThreshold = this.three.value;
        changeRule(ruleData);
        putRule({loanLogicVerifyDts: ruleData},'PROFIT_STATUS_CANCEL');
    }


    render() {
        return (
            <div className='rule-detail-container'>
                {/* <div className='rule-subtitle-container'> 
                    <p className='rule-subtitle'>偏差率阈值设定</p>
                    {
                        profitStatus?
                        <p className='rule-operate' onClick={()=>editRule('PROFIT_STATUS_EDIT',0)}>
                            <img className='rule-edit-img' src={editImg} />
                            <span className='rule-edit'>编辑</span>
                        </p>:
                        <p className='rule-operating'>
                            <span className='rule-save' onClick={this.saveValue}>保存</span>
                            <span className='rule-cancel' onClick={()=>editRule('PROFIT_STATUS_CANCEL',1)}>取消</span>
                        </p>
                    }
                </div>
                <div className='rule-setting'>

                    <p>
                        <span className='setting-name'>主要产品加权毛利率—偏差率阈值</span>
                        {
                            profitStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[1].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[1].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.one=ref}} />
                        }
                        <span>%</span>
                    </p>
                    <p>
                        <span className='setting-name'>营业额与采购额计算毛利率—偏差率阈值</span>
                        {
                            profitStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[2].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[2].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.two=ref}} />
                        }
                        <span>%</span>
                    </p>
                    <p>
                        <span className='setting-name'>行业平均毛利率—偏差率阈值</span>
                        {
                            profitStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[3].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[3].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.three=ref}} />
                        }
                        <span>%</span>
                    </p>
                </div> */}
                <p className='rule-formula'>公式列表</p>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>主要产品加权毛利率</li>
                    <li className='formula-detail formula-complex'>
                        <p>偏差率 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>主要产品加权毛利率 - 客户口述毛利率</span>
                            <span>客户口述毛利率</span>
                        </p>
                        <p>× 100</p>
                    </li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>营业额与采购额计算毛利率</li>
                    <li className='formula-detail formula-complex'>
                        <p>营业额与采购额计算毛利率 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>月均营业额 - 可变成本</span>
                            <span>月均营业额</span>
                        </p>
                        <p>× 100</p>
                    </li>
                    <li className='formula-detail formula-complex'>
                        <p>偏差率 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'> 营业额与采购额计算毛利率 - 客户口述毛利率</span>
                            <span>客户口述毛利率</span>
                        </p>
                        <p>× 100</p>
                    </li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>行业平均毛利率</li>
                    <li className='formula-detail formula-complex'>
                        <p>偏差率 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>行业平均毛利率 - 客户口述毛利率</span>
                            <span>客户口述毛利率</span>
                        </p>
                        <p>× 100</p>
                    </li>
                </ul>
            </div>
        )
    }
}

const pureRuleProfit = pureRender(RuleProfit);

export default pureRuleProfit;