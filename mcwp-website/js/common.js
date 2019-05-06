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
            map.addOverlay(new BMap.Circle(point,200,{strokeColor:"#b3cffa", strokeWeight:2,fillColor:"#dae3db"}));
            map.addOverlay(new BMap.Circle(point,30,{strokeColor:"#fff", strokeWeight:4,fillColor:"#0e88ff"}))
            var opts = {
                position : point,    // 指定文本标注所在的地理位置
                offset   : new BMap.Size(30, -30)    //设置文本偏移量
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
    if(path=='citizenLoan'||path=='microLoan'){
        $(".top-nav-li:nth-of-type(2)").addClass("sele")
    }
    if(path=='join'){
        $(".top-nav-li:nth-of-type(4)").addClass("sele")
    }
    // else if(path=='about'){
    //     $(".top-nav-li:nth-of-type(3)").addClass("sele")
    // }else{
    //     $(".top-nav-li:nth-of-type(1)").addClass("sele")
    // }
// 申请试用
    // $(".tryCon").click(function () {
    //     $(".apply").show();
    //     $(".bg-hover").show();
    //     $("body").css("overflow", "hidden");
    // });
    $(".apply-close").click(function () {
        $(".apply").hide();
        $(".bg-hover").hide();
        $("body").css("overflow", "scroll");
    });
    $(".confirm-btn").click(function () {
        $(".confirm-news").hide();
        $(".bg-hover").hide();
        $("body").css("overflow", "scroll");
    });
    $(".error-news").click(function () {
        $(this).hide();
        $(".bg-hover1").hide();
    });
    // 点击产品介绍
    $(".top-nav-li:nth-child(2)").click(function (e) {
        e.stopPropagation();
        $(this).addClass("active");
        $(".nav-ul").show();
        var tag = $(this).find('.nav-ul');
        var flag = true;
        $(document).bind("click", function (e) {
            var target = $(e.target);
            if (target.closest(tag).length == 0 && flag == true) {
                $(".top-nav-li:nth-child(2)").removeClass("active");
                $(tag).hide();
                flag = false;
            }
        });
    })


    var myregPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var myregEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    var bgHover1 = document.querySelector('.num-btn');
    var countdown = 60;
    var t;
    function timedCount() {
        t = setTimeout(function () {
            timedCount()
        },
            1000);
        if (countdown == 0) {
            bgHover1.removeAttribute("disabled");
            bgHover1.value = "免费获取验证码";
            bgHover1.className = "apply-input num-btn";
            countdown = 60;
            stopCount();
        } else {
            bgHover1.setAttribute("disabled", true);
            bgHover1.value = "重新发送(" + countdown + ")";
            bgHover1.className = "apply-input num-btn normal";
            countdown--;
        }
    }
    function stopCount() {
        clearTimeout(t);
    }
    //发送验证码
    $(".num-btn").click(function () {
        if (countdown == 60) {
            var url = '/backend/node/userEnterpr/verifyCode';
            var telephone = $(".number-input").val();
            if (!myregPhone.test(telephone)) {
                $(".error-news").show();
                $(".bg-hover1").show();
                $(".error-p").html("请输入正确的手机号");
            } else {
                var data = {
                    telephone: telephone,
                };
                function successCallback(res) {
                    if (res.code == 0) {
                        timedCount();
                    }
                }
                function errorCallback(xhr, status) {
                    console.log('出问题了！');
                }

                Config.post(url, data, successCallback, errorCallback)
            }
        }
    });
    //发送申请试用
    $(".apply-btn").click(function () {
        var url = '/backend/node/userEnterpr/audit';
        var orgName = $(".orgName").val();
        var email = $(".email").val();
        var linkMan = $(".linkMan").val();
        var linkManPost = $(".linkManPost").val();
        var telephone = $(".number-input").val();
        var verifyCode = $(".verifyCode").val();
        if (!orgName) {
            $(".error-news").show();
            $(".bg-hover1").show();
            $(".error-p").html("请输入公司名称")
        } else if (!myregEmail.test(email)) {
            $(".error-news").show();
            $(".bg-hover1").show();
            $(".error-p").html("请输入合法邮箱")
        } else if (!linkMan) {
            $(".error-news").show();
            $(".bg-hover1").show();
            $(".error-p").html("请输入联系人")
        } else if (!linkManPost) {
            $(".error-news").show();
            $(".bg-hover1").show();
            $(".error-p").html("请输入联系人岗位")
        } else if (!myregPhone.test(telephone)) {
            $(".error-news").show();
            $(".bg-hover1").show();
            $(".error-p").html("请输入手机号码");
        } else if (!verifyCode) {
            $(".error-news").show();
            $(".bg-hover1").show();
            $(".error-p").html("请输入验证码");
        } else {
            var data = {
                orgName: orgName,
                email: email,
                linkMan: linkMan,
                linkManPost: linkManPost,
                telephone: telephone,
                verifyCode: verifyCode,
            };
            function successCallback(res) {
                console.log(res);
                if (res.code == 0) {
                    $(".confirm-news").show();
                    $(".apply").hide();
                }
            }
            function errorCallback(xhr, status) {
                console.log('出问题了！');
            }
            Config.post(url, data, successCallback, errorCallback)
        }
    });
});