$(document).ready(function () {
    // 百度地图
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(120.127401, 30.288469);
    map.centerAndZoom(point, 15);   // 初始化地图,设置中心点坐标和地图级别
    var myGeo = new BMap.Geocoder();
    // // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint("杭州市文二西路808号西溪壹号17号楼", function (point) {
        if (point) {
            map.centerAndZoom(point, 16);
            // map.addOverlay(new BMap.Marker(point));
            map.addOverlay(new BMap.Circle(point,50,{strokeColor:"#b3cffa", strokeWeight:2,fillColor:"#dae3db"}));
            map.addOverlay(new BMap.Circle(point,10,{strokeColor:"##fff", strokeWeight:1,fillColor:"#0e44ff"}))
            var opts = {
                position : point,    // 指定文本标注所在的地理位置
                offset   : new BMap.Size(10, -20)    //设置文本偏移量
              }
              var label = new BMap.Label("杭州钱袋金融信息服务有限公司", opts);  // 创建文本标注对象
                  label.setStyle({
                       color : "#000",
                       borderColor:"#dae3db",
                       fontSize : "12px",
                       height : "20px",
                       lineHeight : "20px",
                       fontFamily:"微软雅黑"
                   });
              map.addOverlay(label);   
        } else {
            console.log("您选择地址没有解析到结果!");
        }
    }, "杭州市");
    // 导航
    var path=location.pathname.split("/")[1];
    if(path=='citizenLoan'||path=='mortgageLoan'||path=='helpLoan'){
        $(".top-nav-li:nth-of-type(2)").addClass("sele")
    }else{
        $(".top-nav-li:nth-of-type(1)").addClass("sele")
    }
    //点击关于钱袋，触发滚动条
    if(window.location.pathname == "/mobile/about"){
        location.href = "#about-qd"
        // window.onload = function (){
            // var scrollAbout = $(".about-qd").offset().top;
            // console.log(scrollAbout)
            // $(window).scrollTop(scrollAbout);
        // }  
    }
    //点击联系我们，触发滚动条
    if(window.location.pathname == "/mobile/call"){
        location.href = "#call-qd"
    }
});