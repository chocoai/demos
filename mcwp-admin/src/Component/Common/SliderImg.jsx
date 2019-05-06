import React, { Component } from 'react'; // 引入了React
import Slider from 'react-slick';
import './style/sliderImg.less';
import './style/slick.less';
import { Button } from 'antd';
import templateImg from './../../Assets/Images/img_template.png';

// 此组件目前不具备共用性，待以后抽象
class SliderImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
          name: 'slider-container-hide',
          current: 0
        }
    }
    previewShow = () => {
      this.setState({
          name: 'slider-container'
      })
    }
    previewHide = () => {
      this.setState({
          name: 'slider-container-hide'
      })
    }
    confirm = () => {
      const {onChange, coverTpls} = this.props
      const {current} = this.state
      this.previewHide()
      onChange(coverTpls[current].tplType, coverTpls[current].tplViewUrl)
    }
    render() {
      let that = this
      const {name} = this.state
      const { coverTpls , preTplurl} = this.props;
      const settings = {
        dots: false,
        infinite: true,
        arrows:true,//箭头
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: function (currentSlide) {
          that.setState({
            current: currentSlide
          })
        }
      };
      return (
          <div className ={name}>
            <div className='preview-slider'>
              { coverTpls ?
                <Slider {...settings}>
                  {
                    coverTpls.map((item, index) => (
                      <div className='preview-img-wrapper' key={index}>
                        <img className='template-wrap-img'src={templateImg} alt='templateImg' />
                        <div className="template-content-bg"></div>
                        <img className='template-content-img' src={item.tplViewUrl} alt='template' />
                      </div>
                    ))
                  }
                </Slider>:
                <div className='preview-img-wrapper'>
                  <img className='template-wrap-img'src={templateImg} alt='templateImg' />
                  <img className='template-content-img' src={preTplurl} alt='template' />
                </div>
              }
              <span className='preivew-close' onClick={this.previewHide} alt="preivew-close"></span>
              { coverTpls ?
                <Button className='preview-confirm' onClick={this.confirm}>选择</Button>:null
              }
            </div>
          </div>
      );
    }
  }
  export default SliderImg;
