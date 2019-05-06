import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/detailRightsDTO.less';
import './style/editLogic.less';

/**
 * 进件详情进件详情逻辑校验
 * @Author: 魏昌华
 * @Date:   2017-06-26
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-20
 */
class DetailRightsDTO extends Component {
    render() {
        const { logicData } = this.props;
        return (
            <div className='editLogic-container' id='logicDr'>
                <div className='ipieces-subtitle-container ipieces-subtitle-top'>
                    <p className='ipieces-subtitle title'>权益逻辑校验</p>
                    {/*<p className='ipieces-subtitle-check'>录入检验项</p>*/}
                </div>
                <div className='ipieces-detail'>
                {logicData[0] && (logicData[0].deviationRate || logicData[0].deviationRate == 0 || logicData[0].result)?
                    <p className='ipieces-detail-item'>权益逻辑校验偏差率：{logicData[0].deviationRate || logicData[0].deviationRate == 0 ?logicData[0].deviationRate + '%':null}{(logicData[0].deviationRate||logicData[0].deviationRate==0) && logicData[0].result? <span className='beyond-value'>{logicData[0].result}</span> : <span className='beyond-computation'>{logicData[0].result}</span>}</p>
                    :  <p className='ipieces-detail-item'>权益逻辑校验偏差率：<span className='no-info'>未录入</span></p>
                }
                    </div>
                <div className='ipieces-subtitle-container'>
                    <p className='ipieces-subtitle title' id='logicTesT'>毛利率逻辑校验</p>
                </div>
                    <div className='ipieces-detail'>
                        {logicData[1] && (logicData[1].deviationRate || logicData[1].deviationRate == 0 || logicData[1].result)?
                            <p className='ipieces-detail-item'>主要产品加权毛利率偏差率：{logicData[1].deviationRate || logicData[1].deviationRate == 0?logicData[1].deviationRate + '%':null}{(logicData[1].deviationRate||logicData[1].deviationRate==0) && logicData[1].result? <span className='beyond-value'>{logicData[1].result}</span> : <span className='beyond-computation'>{logicData[1].result}</span>}</p>
                            :  <p className='ipieces-detail-item'>主要产品加权毛利率偏差率：<span className='no-info'>未录入</span></p>
                        }
                        {logicData[2] && (logicData[2].deviationRate || logicData[2].deviationRate == 0 || logicData[2].result)?
                            <p className='ipieces-detail-item'>营业额与采购额计算毛利偏差率：{logicData[2].deviationRate || logicData[2].deviationRate == 0?logicData[2].deviationRate + '%':null}{(logicData[2].deviationRate||logicData[2].deviationRate==0) && logicData[2].result? <span className='beyond-value'>{logicData[2].result}</span> : <span className='beyond-computation'>{logicData[2].result}</span>}</p>
                            :  <p className='ipieces-detail-item'>营业额与采购额计算毛利偏差率：<span className='no-info'>未录入</span></p>
                        }
                        {logicData[3] && (logicData[3].deviationRate || logicData[3].deviationRate == 0 || logicData[3].result)?
                            <p className='ipieces-detail-item'>行业平均毛利率偏差率：{logicData[3].deviationRate || logicData[3].deviationRate == 0?logicData[3].deviationRate + '%':null}{(logicData[3].deviationRate||logicData[3].deviationRate==0) && logicData[3].result? <span className='beyond-value'>{logicData[3].result}</span> : <span className='beyond-computation'>{logicData[3].result}</span>}</p>
                            :  <p className='ipieces-detail-item'>行业平均毛利率偏差率：<span className='no-info'>未录入</span></p>
                        }
                    </div>

                <div className='ipieces-subtitle-container'>
                    <p className='ipieces-subtitle title'>销售额逻辑校验</p>
                </div>
                <div className='ipieces-detail'>
                    {logicData[4] && (logicData[4].deviationRate || logicData[4].deviationRate == 0 || logicData[4].result)?
                        <p className='ipieces-detail-item'>按计件工资计算的销售额偏差率：{logicData[4].deviationRate || logicData[4].deviationRate == 0?logicData[4].deviationRate + '%':null}{(logicData[4].deviationRate||logicData[4].deviationRate==0) && logicData[4].result? <span className='beyond-value'>{logicData[4].result}</span> : <span className='beyond-computation'>{logicData[4].result}</span>}</p>
                        :  <p className='ipieces-detail-item'>按计件工资计算的销售额偏差率：<span className='no-info'>未录入</span></p>
                    }
                    {logicData[5] && (logicData[5].deviationRate || logicData[5].deviationRate == 0 || logicData[5].result)?
                        <p className='ipieces-detail-item'>按天计算的销售额偏差率：{logicData[5].deviationRate || logicData[5].deviationRate == 0?logicData[5].deviationRate + '%':null}{(logicData[5].deviationRate||logicData[5].deviationRate==0) && logicData[5].result? <span className='beyond-value'>{logicData[5].result}</span> : <span className='beyond-computation'>{logicData[5].result}</span>}</p>
                        :  <p className='ipieces-detail-item'>按天计算的销售额偏差率：<span className='no-info'>未录入</span></p>
                    }
                    {logicData[6] && (logicData[6].deviationRate || logicData[6].deviationRate == 0 || logicData[6].result)?
                        <p className='ipieces-detail-item'>按月计算的销售额偏差率：{logicData[6].deviationRate || logicData[6].deviationRate == 0?logicData[6].deviationRate + '%':null}{(logicData[6].deviationRate||logicData[6].deviationRate==0) && logicData[6].result? <span className='beyond-value'>{logicData[6].result}</span> : <span className='beyond-computation'>{logicData[6].result}</span>}</p>
                        :  <p className='ipieces-detail-item'>按月计算的销售额偏差率：<span className='no-info'>未录入</span></p>
                    }
                    {logicData[7] && (logicData[7].deviationRate || logicData[7].deviationRate == 0 || logicData[7].result)?
                        <p className='ipieces-detail-item'>按客户账本计算的销售额偏差率：{logicData[7].deviationRate || logicData[7].deviationRate == 0?logicData[7].deviationRate + '%':null}{(logicData[7].deviationRate||logicData[7].deviationRate==0) && logicData[7].result? <span className='beyond-value'>{logicData[7].result}</span> : <span className='beyond-computation'>{logicData[7].result}</span>}</p>
                        :  <p className='ipieces-detail-item'>按客户账本计算的销售额偏差率：<span className='no-info'>未录入</span></p>
                    }
                    {logicData[9] && (logicData[9].deviationRate || logicData[9].deviationRate == 0 || logicData[9].result)?
                        <p className='ipieces-detail-item'>按提成工资计算的销售额偏差率：{logicData[9].deviationRate ||　logicData[9].deviationRate == 0?logicData[9].deviationRate + '%':null}{(logicData[9].deviationRate||logicData[9].deviationRate==0) && logicData[9].result? <span className='beyond-value'>{logicData[9].result}</span> : <span className='beyond-computation'>{logicData[9].result}</span>}</p>
                        :  <p className='ipieces-detail-item'>按提成工资计算的销售额偏差率：<span className='no-info'>未录入</span></p>
                    }
                    {logicData[10] && (logicData[10].deviationRate || logicData[10].deviationRate == 0 || logicData[10].result)?
                        <p className='ipieces-detail-item'>按客户手头现金计算的营业额偏差率：{logicData[10].deviationRate || logicData[10].deviationRate==0?logicData[10].deviationRate + '%':null}{(logicData[10].deviationRate||logicData[10].deviationRate==0) && logicData[10].result? <span className='beyond-value'>{logicData[10].result}</span> : <span className='beyond-computation'>{logicData[10].result}</span>}</p>
                        :  <p className='ipieces-detail-item'>按客户手头现金计算的营业额偏差率：<span className='no-info'>未录入</span></p>
                    }
                    {logicData[8] && (logicData[8].deviationRate || logicData[8].deviationRate == 0 || logicData[8].result)?
                        <p className='ipieces-detail-item'>按存折(银行流水)计算的销售额偏差率：{logicData[8].deviationRate || logicData[8].deviationRate==0?logicData[8].deviationRate + '%':null}{(logicData[8].deviationRate||logicData[8].deviationRate==0) && logicData[8].result? <span className='beyond-value'>{logicData[8].result}</span> : <span className='beyond-computation'>{logicData[8].result}</span>}</p>
                        :  <p className='ipieces-detail-item'>按存折(银行流水)计算的销售额偏差率：<span className='no-info'>未录入</span></p>
                    }
                    {logicData[11] && (logicData[11].deviationRate || logicData[11].deviationRate == 0 || logicData[11].result)?
                        <p className='ipieces-detail-item'>按电脑销售记录的营业额偏差率：{logicData[11].deviationRate || logicData[11].deviationRate == 0?logicData[11].deviationRate + '%':null}{(logicData[11].deviationRate||logicData[11].deviationRate==0) && logicData[11].result? <span className='beyond-value'>{logicData[11].result}</span> : <span className='beyond-computation'>{logicData[11].result}</span>}</p>
                        :  <p className='ipieces-detail-item'>按电脑销售记录的营业额偏差率：<span className='no-info'>未录入</span></p>
                    }
                    {logicData[12] && (logicData[12].deviationRate || logicData[12].deviationRate == 0 || logicData[12].result)?
                        <p className='ipieces-detail-item'>按进货周期、进货量、毛利率推算的营业额偏差率：{logicData[12].deviationRate || logicData[12].deviationRate == 0?logicData[12].deviationRate + '%':null}{(logicData[12].deviationRate||logicData[12].deviationRate==0) && logicData[12].result? <span className='beyond-value'>{logicData[12].result}</span> : <span className='beyond-computation'>{logicData[12].result}</span>}</p>
                        :  <p className='ipieces-detail-item'>按进货周期、进货量、毛利率推算的营业额偏差率：<span className='no-info'>未录入</span></p>
                    }
                </div>
                <div className='ipieces-subtitle-container'>
                    <p className='ipieces-subtitle title'>采购额逻辑校验</p>
                </div>
                <div className='ipieces-detail'>
                    {logicData[13] && (logicData[13].deviationRate || logicData[13].deviationRate == 0 || logicData[13].result)?
                        <p className='ipieces-detail-item'>按汇款金额与汇款频率偏差率：{logicData[13].deviationRate || logicData[13].deviationRate == 0?logicData[13].deviationRate + '%':null}{(logicData[13].deviationRate||logicData[13].deviationRate==0) && logicData[13].result? <span className='beyond-value'>{logicData[13].result}</span> : <span className='beyond-computation'>{logicData[13].result}</span>}</p>
                        :  <p className='ipieces-detail-item'>按汇款金额与汇款频率偏差率：<span className='no-info'>未录入</span></p>
                    }
                    {logicData[14] && (logicData[14].deviationRate || logicData[14].deviationRate == 0 || logicData[14].result)?
                        <p className='ipieces-detail-item'>按进货金额和进款频率偏差率：{logicData[14].deviationRate || logicData[14].deviationRate == 0?logicData[14].deviationRate + '%':null}{(logicData[14].deviationRate||logicData[14].deviationRate==0)&& logicData[14].result? <span className='beyond-value'>{logicData[14].result}</span> : <span className='beyond-computation'>{logicData[14].result}</span>}</p>
                        :  <p className='ipieces-detail-item'>按进货金额和进款频率偏差率：<span className='no-info'>未录入</span></p>
                    }
                </div>
            </div>
        )
    }
}

const pureDetailRightsDTO = pureRender(DetailRightsDTO);

export default pureDetailRightsDTO;
