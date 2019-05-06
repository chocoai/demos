(function(){
    function Tab(option) { //把对象封装到参数里
        this.curIndex = 0;
        this.oDiv = document.getElementById(option.tabNameId)
        this.option = option;
        this.switchTab();
    }
    //点击切换选项卡
    Tab.prototype.switchTab = function() {
        var oLi = this.oDiv.querySelectorAll(this.option.norSelectClass);
        var that = this;
        for (var i = 0; i < oLi.length; i++) {
            oLi[i].index = i;
            oLi[i].onmouseover = function() {
                that.changeSlider(0);
                that.curIndex = this.index;
                that.changeNav();
                that.changeSlider(1);
            }
        }
    }
    //改变原点导航
    Tab.prototype.changeNav = function() {
        this.oDiv.querySelector(this.option.actSelectClass).classList.remove("active");
        this.oDiv.querySelectorAll(this.option.norSelectClass)[this.curIndex].classList.add("active");
    }

    //改变图片
    Tab.prototype.changeSlider = function(p) {
        this.oDiv.querySelectorAll(this.option.curTabName)[this.curIndex].style.opacity = p;
    }
    window.Tab=Tab;
})()