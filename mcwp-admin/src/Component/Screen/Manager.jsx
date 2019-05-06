import React, { Component } from 'react'; // 引入了React
import './style/manager.less';
import { Config } from '../../Config/Index';
// import iconRise from '../../Assets/Images/icon_rise.png';
// import iconDecline from '../../Assets/Images/icon_decline.png';
import top1 from '../../Assets/Images/img_TOP1.png';
import top2 from '../../Assets/Images/img_TOP2.png';
import top3 from '../../Assets/Images/img_TOP3.png';
//客户经理排行
class Manager extends Component {
    constructor(props) {
    	super(props);
		this.state = {
		}
    }
    componentDidMount() {
        // const { data } = this.props;
    }
    render() {
        const that = this;
        const { data } = that.props;
		return (	
            <div className="manager-container">
                <div className='manager-content list'>
                    <p className='manager-p '>
                        <span className='change'>&nbsp;</span>
                        <span className='ranking'>排名</span>
                        <span className='name'>姓名</span>
                        <span className='business'>放款业绩(万)</span>
                        <span className='person'>管户数(人)</span>
                    </p>
                    {  data && data.length ? data.map((result, key) => {
                            return(
                                <p className='manager-p' key={key}>
                                    {Math.sign(result.rankingSub) == 1 ?
                                    <span className='change rise'>+<span className='changeNumber'>{result.rankingSub}</span></span>: (Math.sign(result.rankingSub) == -1 ?
                                    <span className='change decline'>-<span className='changeNumber'>{Math.abs(result.rankingSub)}</span></span>:<span className='change'>-</span>)}
                                    <span className='ranking'>{result.ranking == 1?<img className='top1' src={top1} alt="top1"  />:(result.ranking == 2?<img className='top2' src={top2} alt="top2"  />:(result.ranking == 3?<img className='top3' src={top3} alt="top3"  />:<span className='rankingNum'>{result.ranking}</span>))}</span>
                                    <span className='name'>{result.userName}</span><span className='business'>{Config.numberWithCommas(result.borrowAmount) }</span><span className='person'>{result.custsum }</span>
                                </p>
                                );
                            }) :<div className='data-none'>暂无数据</div>
                        }
                </div>
            </div>
	    )
	}
}
export default Manager;
