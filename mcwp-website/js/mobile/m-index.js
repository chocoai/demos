window.onload = function () { init(); }
function init(){
    //swiper轮播配置
    var mySwiper = new Swiper('.swiper-container',{
        autoplay : 5000,//可选选项，自动滑动
        loop : true,//可选选项，开启循环
        pagination : '.pagination',
        })
    // //触发轮播图事件
    // var slider = new Slider();
    // //产品优势列表展示闭合
    // var oFun = document.querySelectorAll(".adv-h3");
    // var oMark = document.querySelectorAll(".mark");
    // var oIcon = document.querySelectorAll(".left-icon");
    // var curFun = -1;
    // for (var i = 0; i < oFun.length; i++) {
    //     oFun[i].index = i;
    //     oFun[i].addEventListener("click", function(){
    //         if(curFun == this.index){
    //             oMark[this.index].className = "mark";
    //             oIcon[this.index].className = "left-icon";
    //             curFun = -1;
    //         }else{
    //             for (var i = 0; i < oFun.length; i++) {
    //                 oMark[i].className = "mark";
    //                 oIcon[i].className = "left-icon";
    //             }
    //             oMark[this.index].className = "mark mark-active";
    //             oIcon[this.index].className = "left-icon active-icon";
    //             curFun = this.index;
    //         }
    //     })
    // }
    //助贷宝亮点样式切换
    // var oLi = document.querySelectorAll(".fun-li");
    // var oFh3 = document.querySelectorAll(".fun-h3");
    // var curLi = -1;
    // for (var i = 0; i < oLi.length; i++) {
    //     oLi[i].index = i;
    //     oLi[i].addEventListener("click", function(){
    //         if(curLi == this.index){
    //             oLi[this.index].className = "fun-li";
    //             oFh3[this.index].className = "fun-h3";
    //             curLi = -1;
    //         }else{
    //             for (var i = 0; i < oLi.length; i++) {
    //                 oLi[i].className = "fun-li";
    //                 oFh3[i].className = "fun-h3";
    //             }
    //             oLi[this.index].className = "fun-li li-active";
    //             oFh3[this.index].className = "fun-h3 h3-active";
    //             curLi = this.index;
    //         }
    //     })
    // }
    //底部标签展开闭合
    // var oFooter = document.querySelectorAll(".footer-h2");
    // var oFooterUl = document.querySelectorAll(".footer-ul");
    // var curFooter = -1;
    // for (var i = 0; i < oFooter.length; i++) {
    //     oFooter[i].index = i;
    //     oFooter[i].addEventListener("click", function(){
    //         if(curFooter == this.index){
    //             oFooter[this.index].className = "footer-h2";
    //             oFooterUl[this.index].className = "footer-ul";
    //             curFooter = -1;
    //         }else{
    //             for (var i = 0; i < oFooter.length; i++) {
    //                 oFooter[i].className = "footer-h2";
    //                 oFooterUl[i].className = "footer-ul";
    //             }
    //             oFooter[this.index].className = "footer-h2 h2-active";
    //             oFooterUl[this.index].className = "footer-ul active";
    //             curFooter = this.index;
    //         }
    //     })
    // }
}