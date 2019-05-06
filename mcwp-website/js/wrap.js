(function(){
    function Slider() { //把对象封装到参数里
        this.curIndex = 0;
        this.auto_timer = null;
        this.len = document.querySelectorAll(".nav li").length;
        this.init();
    }
    //原型的方法
    Slider.prototype.init = function() {
        this.oDiv = document.getElementById("banner");
        if (!Function.prototype.bind) {
            Function.prototype.bind = function (obj) {
            var self = this;
            return function () {
            self.call(obj);
            }
            }
        }
        this.oDiv.onmouseover = this.stopPlay.bind(this);
        this.oDiv.onmouseout = this.autoPlay.bind(this);
        this.autoPlay();
        this.aaa();
    }
    //上一张
    Slider.prototype.prevSlider = function() {
        if (this.curIndex > 0) {
            this.curIndex--;
        } else {
            this.curIndex = this.len - 1;
        }
        this.changeNav();
        this.changeSlider();

    }
    //下一张
    Slider.prototype.nextSlider = function() {
        if (this.curIndex < this.len - 1) {
            this.curIndex++
        } else {
            this.curIndex = 0;
        }
        this.changeNav();
        this.changeSlider();
    }
    //点击原点改变图片
    Slider.prototype.aaa = function() {
        var oLi = document.querySelectorAll(".nav li");
        var that = this;
        for (var i = 0; i < oLi.length; i++) {
            oLi[i].index = i;
            oLi[i].onmouseover = function() {
                that.curIndex = this.index;
                that.changeSlider();
                that.changeNav();
            }
        }
    }

    //自动轮播
    Slider.prototype.autoPlay = function() {
        this.auto_timer = setInterval(this.nextSlider.bind(this), 3000);
    }
    //鼠标放上去自动轮播停止
    Slider.prototype.stopPlay = function() {
        clearInterval(this.auto_timer);
    }

    //改变原点导航
    Slider.prototype.changeNav = function() {
        var oLi = document.querySelectorAll(".nav li");
        for (var i = 0; i < oLi.length; i++) {
            this.oDiv.querySelectorAll(".nav-li")[i].className = "nav-li";
        }
        this.oDiv.querySelectorAll(".nav-li")[this.curIndex].className = "nav-li active";
    }

    //轮播
    var mySwiper = new Swiper('.swiper-container',{
        autoplay : 5000,//可选选项，自动滑动
        loop : true,//可选选项，开启循环
        pagination : '.pagination',
        paginationClickable :true,
        })
    // Slider.prototype.changeSlider = function() {
    //     var oLi = document.querySelectorAll(".nav li");
    //     for (var i = 0; i < oLi.length; i++) {
    //         this.oDiv.querySelectorAll(".slider-ul .slider-li")[i].className = "slider-li";
    //     }
    //     this.oDiv.querySelectorAll(".slider-ul .slider-li")[this.curIndex].className = 'slider-li active-li';
    // }
    // window.Slider=Slider;
})()