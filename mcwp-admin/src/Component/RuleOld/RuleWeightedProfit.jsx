import React, { Component, PropTypes } from 'react'; // 引入了React和PropTypes
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import editImg from './../../Assets/Images/icon_edit.png';

import './style/rule.less';

/**
 * 规则库加权利润率
 * @Author: 赵俊
 * @Date:   2017-07-07 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-08
 */
class RuleWeightedProfit extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }


    render() {
        return (
            <div className='rule-detail-container'>
                <p className='rule-formula'>公式列表</p>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>生产型（区分来料加工和采购加工对生产成本的影响）</li>
                    <li className='formula-detail formula-complex'>
                        <p>产品毛利率 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>（产品售价 - 生产成本）</span>
                            <span>产品售价</span>
                        </p>
                        <p>× 100</p>
                    </li>
                </ul>
                <ul className='rule-formula-list'>
                    <li className='formula-detail'>通用公式</li>
                    <li className='formula-detail formula-complex'>
                        <p>产品销售占比 =</p>
                        <p className='formula-divide'>
                            <span className='divide-item'>产品n销售收入</span>
                            <span>产品n1销售收入 + ... + 产品n销售收入</span>
                        </p>
                        <p>× 100</p>
                    </li>
                    <li className='formula-detail formula-complex'>
                        <p>加权毛利率 =</p>
                        <p className='formula-divide formula-weighted'>
                            <span className='divide-item'>（产品n1销售占比 × 产品n1毛利率）+ ... + (产品n销售占比 × 产品n毛利率）</span>
                            <span>（产品n1销售占比 + ... + 产品n销售占比）</span>
                        </p>
                        <p>× 100</p>
                    </li>
                </ul>
            </div>
        )
    }
}

const pureRuleWeightedProfit = pureRender(RuleWeightedProfit);

export default pureRuleWeightedProfit;