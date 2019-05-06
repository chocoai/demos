//产品优势列表展示闭合
var oDetail = document.querySelectorAll(".prod-detail");
var oIntro = document.querySelectorAll(".detail-intro");
var oIconLeft = document.querySelectorAll(".detail-left");
var oIconRight = document.querySelectorAll(".detail-right");
var curFun = -1;
var vDetLen = oDetail.length;
for (var i = 0; i < vDetLen; i++) {
    oDetail[i].index = i;
    oDetail[i].addEventListener("click", function(){
        if(curFun == this.index) {
            oDetail[this.index].style.background = '#efefef';
            oDetail[this.index].style.color = '#666464';
            oIntro[this.index].className = "detail-intro";
            oIconRight[this.index].className = "detail-right";
            oIconLeft[this.index].className = 'detail-left detail-b-0' + (this.index + 1);
            curFun = -1;
        }else {
            for(var j = 0; j < vDetLen; j++) {
                oDetail[j].style.background = '#efefef';
                oDetail[j].style.color = '#666464';
                oIntro[j].className = "detail-intro";
                oIconRight[j].className = "detail-right";
                oIconLeft[j].className = 'detail-left detail-b-0' + (j + 1);
            }
            this.style.background = '#54c3f1'
            this.style.color = '#fff'
            oIntro[this.index].className = "detail-intro-active"
            oIconRight[this.index].className = "detail-right-active"
            oIconLeft[this.index].className = 'detail-left detail-list-0' + (this.index + 1);
            curFun = this.index;
        }
    })
}