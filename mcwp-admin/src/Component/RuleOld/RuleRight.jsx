import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/rule.less';

/**
 * 规则库权益逻辑校验
 * @Author: 赵俊
 * @Date:   2017-07-07 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-08
 */
class RuleRight extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    saveValue = (e) => {
        let ruleData = this.props.ruleData;
        console.log(ruleData)
        ruleData[0].deviationThreshold = parseFloat(this.right.value);
        console.log(ruleData)
        this.props.changeRule(ruleData);
        this.props.putRule({loanLogicVerifyDts: ruleData},'RIGHT_STATUS_CANCEL');
    }

    render() {
        return (
            <div className='rule-detail-container'>
                {/* <div className='rule-subtitle-container'> 
                    <p className='rule-subtitle'>偏差率阈值设定</p>
                    {
                        rightStatus?
                        <p className='rule-operate' onClick={()=>editRule('RIGHT_STATUS_EDIT',0)}>
                            <img className='rule-edit-img' src={editImg} />
                            <span className='rule-edit'>编辑</span>
                        </p>:
                        <p className='rule-operating'>
                            <span className='rule-save' onClick={this.saveValue}>保存</span>
                            <span className='rule-cancel' onClick={()=>editRule('RIGHT_STATUS_CANCEL',1)}>取消</span>
                        </p>
                    }
                </div>
                <div className='rule-setting'>
                    {
                        rightStatus?
                        <p>
                            <span className='setting-name'>权益逻辑校验-偏差率阈值</span>
                            <span className='setting-value'>{ ruleData.length && ruleData[0].deviationThreshold }</span>
                            <span>%</span>
                        </p>:
                        <p>
                            <span className='setting-name'>权益逻辑校验-偏差率阈值</span>
                            <input className='setting-edit' defaultValue={ ruleData.length && ruleData[0].deviationThreshold } onChange={(e)=>Config.changeValue(e)} ref={ref=>{this.right=ref}} />
                            <span>%</span>
                        </p>
                    }
                </div> */}
                <p className='rule-formula'>公式列表</p>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>权益区间一般为12个月</li>
                    <li className='formula-detail'>期间内的利润 — 期间内的资本注入 — 期内提取的资金 — 折旧或贬值 —> 资产负债表</li>
                    <li className='formula-detail'>权益 = 总资产 - 负债</li>
                    <li className='formula-detail'>初始权益 = 期初资产负债表内资产 - 期初负债</li>
                    <li className='formula-detail'> 应有权益 = 初始权益 + 期间利润 + （期间内的资本注入－期间内提取的资金）－折旧或贬值</li>
                    <li className='formula-detail formula-complex'>
                        <p>偏差率 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>应有权益 - 实际权益</span>
                            <span>月可支 × 经营月数</span>
                        </p>
                        <p>× 100</p>
                    </li>
                </ul>
            </div>
        )
    }
}

const pureRuleRight = pureRender(RuleRight);

export default pureRuleRight;