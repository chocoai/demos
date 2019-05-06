import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import Slider from 'react-slick';
import './style/carouselImg.less';
import './style/slick.less';
import imgFile from './../../Assets/Images/img_file.png';
// import deleteImg from './../../Assets/Images/product_icon_close_pressed.png';

/**
 * 征信报告，照片信息轮播
 * @Author: 赵俊
 * @Date:   2018-03-29
 */
// pictureInfo 照片信息 pictureType 照片类型 previewHide 隐藏时间 previewPic 显示隐藏
class CarouselImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            showCenter: true       // 宽高不够居中显示，默认居中（文件）
        }
    }

    componentWillUnmount () {
        window.onresize = null
    }
    bindResize = () => {
        const that = this
        const {pictureInfo, pictureType} = this.props
        let pictures=[]
        let arr=[]
        if (pictureType) {
            if(pictureType.indexOf(',')>-1){
                let types=pictureType.split(',');
                types.forEach((item,index)=>{
                    pictures.push(...pictureInfo[item]||[])
                })
            } else{
                pictures=pictureInfo[pictureType];
            }  
        } else {
            pictures = pictureInfo
        }
        window.onresize = () => {
            pictures && pictures.map((i, index)=> {
                that.resize(index)
            })
        }
    }
    // 上一张
    previous = () => {
        this.slider.slickPrev()
    }
    // 下一张
    next = () => {
        this.slider.slickNext()
    }
    // 旋转
    rotate = () => {
        const {currentIndex} = this.state
        this.setState({
            [`rotate${currentIndex}`]: -90 + (this.state[`rotate${currentIndex}`] || 0)
        }, ()=>this.resize(currentIndex))
    }
    // 初始加载大小
    changeSize (key) {
        const that = this
        let initWidth = that.preivewWrap.clientWidth - 120,
            initHeight = that.preivewWrap.clientHeight,
            initRatio = initWidth/initHeight,
            imgRatio = that[`preivewImg${key}`].width/that[`preivewImg${key}`].height,
            imgWidth = that[`preivewImg${key}`].width,
            imgHeight = that[`preivewImg${key}`].height
        // 宽相对较宽
        // if (imgRatio >= initRatio) {
        //     if (imgWidth > initWidth) {
        //         this.setState({
        //             [`width${key}`]: `${initWidth}px`,
        //             [`height${key}`]: 'auto',
        //         })
        //     } else {
        //         this.setState({
        //             [`width${key}`]: `${imgWidth}px`,
        //             [`height${key}`]: 'auto',
        //         })
        //     }
        // } else{ // 高相对较高
        //     if (imgHeight > initHeight) {
        //         this.setState({
        //             [`width${key}`]: 'auto',
        //             [`height${key}`]: `${initHeight}px`,
        //         })
        //     } else {
        //         this.setState({
        //             [`width${key}`]: 'auto',
        //             [`height${key}`]: `${imgHeight}px`,
        //         })
        //     }
        // }
        if (!this.state[`initWidth${key}`]) {
            this.setState({
                [`opacity${key}`]: 1,
                [`initWidth${key}`]: imgWidth,
                [`initHeight${key}`]: imgHeight,
            },() => this.resize(key))
        }

    }
    // 改变窗口大小
    // resize = () => {
    //     const {currentIndex} = this.state
    //     if(this.timer) clearTimeout(this.timer)
    //     this.timer = setTimeout(() => {
    //         this.setState({
    //             [`opacity${currentIndex}`]: 0
    //         })
    //         setTimeout(() => {
    //             this.setState({
    //                 area: '' + document.body.clientWidth + document.body.clientHeight,
    //                 [`width${currentIndex}`]: `auto`,
    //                 [`height${currentIndex}`]: 'auto'
    //             })
    //         }, 1000)
    //     }, 1000);
    // }
    // 临时解决方案，未来直接重写轮播
    resize = (nextSlide) => {
        const that = this
        let {currentIndex, showCenter} = that.state
        let key = currentIndex
        let dir = this.state[`rotate${key}`] % 180
        if (/^[0-9]*$/.test(nextSlide)) key = nextSlide
        let initWidth = that.preivewWrap.clientWidth - 120,
            initHeight = that.preivewWrap.clientHeight,
            initRatio = initWidth/initHeight,
            imgWidth = that.state[`initWidth${key}`],
            imgHeight = that.state[`initHeight${key}`]
            // imgWidth = that[`preivewImg${key}`].width,
            // imgHeight = that[`preivewImg${key}`].height,
        // 非图片情况
        if (!imgWidth) {
            imgWidth = that[`preivewImg${key}`].width
            imgHeight = that[`preivewImg${key}`].height
        }
        if (dir) {
            imgWidth = that.state[`initHeight${key}`]
            imgHeight = that.state[`initWidth${key}`]
        }
        let imgRatio = imgWidth/imgHeight
        // 宽相对较宽
        if (imgRatio >= initRatio) {
            if (imgWidth > initWidth) {
                this.setState({
                    [`width${key}`]: `${initWidth}px`,
                    [`height${key}`]: 'auto',
                    // showCenter: key == currentIndex ? false : showCenter
                })
                if (dir) {
                    this.setState({
                        [`width${key}`]: `auto`,
                        [`height${key}`]: `${initWidth}px`,
                        // showCenter: key == currentIndex ? true : showCenter
                    })
                }
            } else {
                this.setState({
                    [`width${key}`]: `${imgWidth}px`,
                    [`height${key}`]: 'auto',
                    // showCenter: key == currentIndex ? true : showCenter
                })
            }
        } else{ // 高相对较高
            if (imgHeight > initHeight) {
                this.setState({
                    [`width${key}`]: 'auto',
                    [`height${key}`]: `${initHeight}px`,
                    // showCenter: key == currentIndex ? false : showCenter
                })
                if (dir) {
                    this.setState({
                        [`width${key}`]: `${initHeight}px`,
                        [`height${key}`]: `auto`,
                        // showCenter: key == currentIndex ? true : showCenter
                    })
                }
            } else {
                this.setState({
                    [`width${key}`]: 'auto',
                    [`height${key}`]: `${imgHeight}px`,
                    // showCenter: key == currentIndex ? true : showCenter
                })
            }
        }
    }
    beforeChange = (currentSlide, nextSlide) => {
        const that = this
        that.setState({
            currentIndex: nextSlide
        })
        // that.resize(nextSlide)
    }
    previewHide = () => {
        const {previewHide} = this.props
        this.setState({
            currentIndex: 0
        })
        previewHide('previewPic')
    }
    render() {
        const { pictureInfo, previewPic, pictureType } = this.props;
        const {currentIndex, showCenter} = this.state
        let that = this
        const settings = {
            arrows: false,
            draggable: false,
            beforeChange: that.beforeChange,
            autoplay: false
        };
        if (previewPic) {
            that.bindResize()
        } else {
            window.onresize = null
        }
        let pictures=[]
        if (pictureType) {
            if(pictureType.indexOf(',')>-1){
                let types=pictureType.split(',');
                types.forEach((item,index)=>{
                    pictures.push(...pictureInfo[item]||[])
                })
            } else{
                pictures=pictureInfo[pictureType];
            }  
        } else {
            pictures = pictureInfo
        }
        return (
            <div className={previewPic?'preview carousel-img-container':'preview-hidden carousel-img-container'}>
                <div className='preview-carousel' ref={ref => this.preivewWrap = ref }>
                    <div className='preivew-title'>{pictures && pictures[currentIndex] && pictures[currentIndex].fileName || ''}</div>
                    {
                        pictures && Array.isArray(pictures)?
                        <Slider className={`${showCenter?'preview-center' : ''}`} ref={ref => this.slider = ref } {...settings}>
                            {
                                pictures.map((result, key) => (
                                    result.picFlag ?
                                    <div key={key}><img className='preivew-img' style={{width: `${this.state["width" + key]}`, height: `${this.state["height" + key]}`, transform: `rotate(${this.state["rotate" + key] || 0}deg)`, opacity: `${this.state["opacity" + key] || 0}`}} ref={ref => this[`preivewImg${key}`] = ref } src={result.srcUrl} alt="preivew-img" onLoad={() => this.changeSize(key)} /></div>
                                    :
                                    <div key={key}>
                                        <div className="img-file-container">
                                            <img className='img-file' src={imgFile} alt="img-file" ref={ref => this[`preivewImg${key}`] = ref} />
                                            <p className="file-name">{result.fileName}</p>
                                            <span className="file-download" onClick={()=>window.open(result.srcUrl)}>下载</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </Slider>:null
                    }
                    <div className='preivew-close' onClick={this.previewHide} />
                </div>
                <div className='preview-footer'>
                    <div className='preview-previous' onClick={this.previous} />
                    <div className='preview-page'>{currentIndex + 1}/{pictures && pictures.length}</div>
                    <div className='preview-next' onClick={this.next} />
                    {
                        pictures && pictures[currentIndex] && pictures[currentIndex].picFlag ?
                        <div className='preview-enlarge' onClick={()=>window.open(pictures[currentIndex].srcUrl)} />
                        : <div className='preview-enlarge preview-disable' />
                    }
                    {
                        pictures && pictures[currentIndex] && pictures[currentIndex].picFlag ?
                        <div className='preview-rotate' onClick={this.rotate} />
                        : <div className='preview-rotate preview-disable' />
                    }
                    {/* <div className='preview-down' onClick={this.downloadImage} /> */}
                </div>
            </div>
        )
    }
}


const pureCarouselImg = pureRender(CarouselImg);

export default pureCarouselImg;
