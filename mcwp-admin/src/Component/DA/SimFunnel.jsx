import React, { Component } from 'react'; // 引入了React
import './style/simFunnel.less';

class SimFunnel extends Component {
    render () {
        const { data } = this.props; 
		return (
            <div className="simfunnel-container">
                <div className="simfunnel-title">营销转化率</div>
                <ul data-flex="main:center cross:center dir:top">
                    <li className="trapezoidal browse"><span className="trapezoidal-count browse-count">浏&nbsp;&nbsp;&nbsp;览&nbsp;&nbsp;&nbsp;量<br/>{data && data.views}</span></li>
                    <li className="trapezoidal pieces"><span className="trapezoidal-count pieces-count">进&nbsp;&nbsp;&nbsp;件&nbsp;&nbsp;&nbsp;量<br/>{data && data.pieces}</span><span className="trapezoidal-rate pieces-rate">进件转化率<br/>{data && data.pieceRate}</span></li>
                    <li className="trapezoidal credit"><span className="trapezoidal-count credit-count">审核通过人数<br/>{data && data.verifys}</span><span className="trapezoidal-rate credit-rate">审核通过率<br/>{data && data.authRate}</span></li>
                    <li className="trapezoidal letter"><span className="trapezoidal-count letter-count">借&nbsp;款&nbsp;人&nbsp;数<br/>{data && data.loans}</span><span className="trapezoidal-rate letter-rate">借款转化率<br/>{data && data.loanRate}</span></li>
                </ul>
            </div>
		)
	}
}

export default SimFunnel;