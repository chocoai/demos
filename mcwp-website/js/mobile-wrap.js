(function(){
    function Slider() { //把对象封装到参数里
        this.curIndex = 0;
        this.auto_timer = null;
        this.isMoved = true;
        this.x;
        this.y;
        this.len = document.querySelectorAll(".nav li").length;
        this.init();
    }
    //原型的方法
    Slider.prototype.init = function() {
        this.oDiv = document.getElementById("banner");
        this.oDiv.onmouseover = this.stopPlay.bind(this);
        this.oDiv.onmouseout = this.autoPlay.bind(this);
        this.autoPlay();
        this.aaa();
        this.startTouch();
    }
    //判断是否滑动
    Slider.prototype.startTouch = function(){
        this.oDiv.addEventListener("touchstart", this.moveStart.bind(this), false);
        this.oDiv.addEventListener("touchmove", this.moveTouch.bind(this), false);
    }
    Slider.prototype.moveStart =function(){
        if (this.isMoved) {
            clearInterval(this.auto_timer); //停止自动滚动图片
            var touches = event.targetTouches;
            if (touches.length == 1) {
                this.x = touches[0].pageX;
                this.y = touches[0].pageY;
            }
            this.isMoved = false;
        }
    }
    //左右滑动
    Slider.prototype.moveTouch = function(event){
        if (event.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!event.defaultPrevented) {
                event.preventDefault();
            }
        }
        if (!this.isMoved) { //只有手指第一次在屏幕上滑动时，并且满足响应条件，才触发左/右/上/下滑事件
            var touches = event.targetTouches;
            if (touches.length == 1) { //一个手指在屏幕上
                var x1 = touches[0].pageX,
                //移动到的坐标
                y1 = touches[0].pageY;
                if (((x1 + 30) < this.x) && (Math.abs(y1 - this.y) < 20)) { //触摸左滑动
                    this.isMoved = true; //设置为true，手指在屏幕上连续滑动时，后面满足条件的移动不再触发该事件
                    //向左切换图片
                    this.prevSlider()
                }
                if (((x1 - 30) > this.x) && (Math.abs(y1 - this.y) < 20)) { //触摸右滑动
                    this.isMoved = true;
                    this.nextSlider();
                    }
                }
            }
    }
    //上一张
    Slider.prototype.prevSlider = function() {
        this.changeSlider(0);

        if (this.curIndex > 0) {
            this.curIndex--;
        } else {
            this.curIndex = this.len - 1;
        }
        this.changeNav();
        this.changeSlider(1);

    }
    //下一张
    Slider.prototype.nextSlider = function() {
        this.changeSlider(0);
        if (this.curIndex < this.len - 1) {
            this.curIndex++
        } else {
            this.curIndex = 0;
        }
        this.changeNav();
        this.changeSlider(1);
    }
    //点击原点改变图片
    Slider.prototype.aaa = function() {
        var oLi = document.querySelectorAll(".nav li");
        var that = this;
        for (var i = 0; i < oLi.length; i++) {
            oLi[i].index = i;
            oLi[i].onmouseover = function() {
                that.changeSlider(0);
                that.curIndex = this.index;
                that.changeSlider(1);
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
        this.oDiv.querySelector(".nav li.active").classList.remove("active");
        this.oDiv.querySelectorAll(".nav li")[this.curIndex].classList.add("active");
    }

    //改变图片
    Slider.prototype.changeSlider = function(p) {
        this.oDiv.querySelectorAll(".slider-ul .slider-li")[this.curIndex].style.opacity = p;
    }
    window.Slider=Slider;
})()
