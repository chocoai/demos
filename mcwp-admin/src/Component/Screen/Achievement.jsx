import React, { Component } from 'react'; // 引入了React
import './style/manager.less';
import { Config } from '../../Config/Index';
import Slider from 'react-slick';
import top1 from '../../Assets/Images/img_TOP1.png';
import top2 from '../../Assets/Images/img_TOP2.png';
import top3 from '../../Assets/Images/img_TOP3.png';
import iconDecline from '../../Assets/Images/icon_decline.png';
import iconRise from '../../Assets/Images/icon_rise.png';
//月度业绩排行
class Achievement extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
    }
    render() {
        const that = this;
        const { data } = that.props;
        let slidesToShow;
        if (data && data.length > 0) {
            if (data.length > 10) {
                slidesToShow = 10
            } else {
                slidesToShow = data.length
            }
        }
        const settings = {
            autoplay: data && data.length > 10,
            infinite: true,
            vertical: true,
            arrows: false,//隐藏箭头
            swipeToSlide: true,//允许用户直接拖拽
            pauseOnHover: true,//鼠标悬停 不再自动播放
            autoplaySpeed: 10000,//两次滚动之间的停顿
            speed: 500,
            slidesToShow: slidesToShow,
            dots: false
        };
        return (
            <div className="achievement-container">
                <div className='manager-content list'>
                    <p className='manager-p manager-p-title'>
                        <span className='change'>&nbsp;</span>
                        <span className='ranking'>排名</span>
                        <span className='name'>姓名</span>
                        <span className='name'>放款业绩(万)</span>
                        <span className='name'>存量业绩(万)</span>
                        <span className='name'>工作效率(h)</span>
                        <span className='business'>服务客户数(人)</span>
                        <span className='business'>存量客户数(人)</span>
                    </p>
                    <div className="achievement-content">
                        {data && data.length ?
                            <Slider {...settings}>
                                {
                                    data.map((result, key) => {
                                        return (
                                            <p className={result.rank==1||result.rank==2||result.rank==3?'manager-p manager-p-color':'manager-p'} key={key}>
                                                {Math.sign(result.rankChange) == 1 ?
                                                    <span className='change rise'><img src={iconRise} alt="iconRise" /><span className='changeNumber'>{result.rankChange}</span></span> : (Math.sign(result.rankChange) == -1 ?
                                                        <span className='change decline'><img src={iconDecline} alt="iconDecline" /><span className='changeNumber'>{Math.abs(result.rankChange)}</span></span> : <span className='change'>-</span>)
                                                }
                                                <span className='ranking'>{result.rank == 1 ? <img className='top1' src={top1} alt="top1" /> : (result.rank == 2 ? <img className='top2' src={top2} alt="top2" /> : (result.rank == 3 ? <img className='top3' src={top3} alt="top3" /> : <span className='rankingNum'>{result.rank}</span>))}
                                                </span>
                                                <span className='name'>{result.custName}</span>
                                                <span className='business'>{Config.numberWithCommas(result.makeLoanAmount)}</span>
                                                <span className='business'>{Config.numberWithCommas(result.stockAmount)}</span>
                                                <span className='person'>{result.workEfficiency}</span>
                                                <span className='person'>{result.serviceCustNum}</span>
                                                <span className='person'>{result.stockCustNum}</span>
                                            </p>
                                        );
                                    })
                                }
                            </Slider> : <div className='data-none'>暂无数据</div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default Achievement;
