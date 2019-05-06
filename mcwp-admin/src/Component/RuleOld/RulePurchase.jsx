import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/rule.less';

/**
 * 规则库采购额逻辑校验
 * @Author: 赵俊
 * @Date:   2017-07-07 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-07
 */
class RulePurchase extends Component {
    saveValue = (e) => {
        const {changeRule, putRule} = this.props;
        let ruleData = this.props.ruleData;
        ruleData[13].deviationThreshold = this.thirteen.value;
        ruleData[14].deviationThreshold = this.fourteen.value;
        changeRule(ruleData);
        putRule({loanLogicVerifyDts: ruleData},'PURCHASE_STATUS_CANCEL');
    }

    render() {
        return (
            <div className='rule-detail-container'>
                {/* <div className='rule-subtitle-container'> 
                    <p className='rule-subtitle'>偏差率阈值设定</p>
                    {
                        purchaseStatus?
                        <p className='rule-operate' onClick={()=>editRule('PURCHASE_STATUS_EDIT',0)}>
                            <img className='rule-edit-img' src={editImg} />
                            <span className='rule-edit'>编辑</span>
                        </p>:
                        <p className='rule-operating'>
                            <span className='rule-save' onClick={this.saveValue}>保存</span>
                            <span className='rule-cancel' onClick={()=>editRule('PURCHASE_STATUS_CANCEL',1)}>取消</span>
                        </p>
                    }
                </div>
                <div className='rule-setting'>
                    <p>
                        <span className='setting-name'>按汇款金额与汇款频率—偏差率阈值</span>
                        {
                            purchaseStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[13].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[13].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.thirteen=ref}} />
                        }
                        <span>%</span>
                    </p>
                    <p>
                        <span className='setting-name'>按进货频率与进货金额—偏差率阈值</span>
                        {
                            purchaseStatus?
                            <span className='setting-value'>{ ruleData.length && ruleData[14].deviationThreshold }</span>:
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[14].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.fourteen=ref}} />
                        }
                        <span>%</span>
                    </p>
                </div> */}
                <p className='rule-formula'>公式列表</p>
                <p className='formula-alone'>加权可变成本 = 1 - 加权毛利率</p>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>按汇款金额与汇款频率</li>
                    <li className='formula-detail formula-complex'>
                        <p>月均营业额 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>进货汇款金额（一个月内)</span>
                            <span>加权可变成本</span>
                        </p>
                    </li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>按进货频率与进货金额</li>
                    <li className='formula-detail formula-complex'>
                        <p>月均营业额 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>进货单进货金额（一个月）</span>
                            <span>加权可变成本</span>
                        </p>
                    </li>
                </ul>
            </div>
        )
    }
}

const pureRulePurchase = pureRender(RulePurchase);

export default pureRulePurchase;