import React, { Component } from 'react'; // 引入了React
import Slider from 'react-slick';
import './style/situation.less';
import moment from 'moment';
//业务、任务情况
class Situation extends Component {
    constructor(props) {
    	super(props);
		// this.state = {
        //     autoScroll:false,
        //     fullContent:null,
		// }
    }
    componentDidMount() {
        // const { data } = this.props;
        // if(data&&data.length > 6){//数据条数多于6条时滚动
        //     this.setState({
        //         autoScroll:true,
        //         fullContent:data.length,
        //     })
        // }
        this.delay()
    }
    delay () {
        const {delay} = this.props;
        if(!delay) return
        setTimeout(
            ()=>this.forceUpdate(),delay
        )
    }
    render() {
        const that = this;
        const { className , data } = that.props;
        let slidesToShow;
        if(data&&data.length>0){
            if(data.length>6){
                slidesToShow=6
            }else{
                slidesToShow=data.length
            }  
        }
        const settings = {
            autoplay:data&&data.length > 6,
            infinite:true,
            vertical:true,
            arrows:false,//隐藏箭头
            swipeToSlide:true,//允许用户直接拖拽
            pauseOnHover:true,//鼠标悬停 不再自动播放
            autoplaySpeed:10000,//两次滚动之间的停顿
            speed: 500,
            slidesToShow: slidesToShow,
            dots:false
        };
		return ( 
            <div className={className}>
                <div className='situation-content' >
                    {
                        data && data.length ? 
                        <Slider {...settings}>
                        {  data && data.length && 
                            data.map((result, key) => {
                                return(
                                    <p className='situation-p' key={key} >{result.createDate ?  moment(parseInt(result.createDate)).format('YY/MM/DD HH:mm:ss') : null} {result.descript ? result.descript:result.message?result.message:null}</p>
                                    );
                                }) 
                        }
                        </Slider> : <div className = 'data-none'>暂无数据</div>
                    } 
                    
                </div>
        </div>
	     );
	}
}
export default Situation;
