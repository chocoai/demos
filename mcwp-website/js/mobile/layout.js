
//当点击code-tip时，top-apply显示出来 再次点击时隐藏
var onCodeTip = document.querySelector('.code-tip')
var topApply = document.querySelector('.top-apply');
var bgHover = document.querySelector('.bg-hover');
var bgHover1 = document.querySelector('.bg-hover1');
var errorNews = document.querySelector('.error-news');
var body = document.querySelector('body');
var onOff = false;
// onCodeTip.onclick = function(){
//     if(!onOff){
//         topApply.className = 'apply-active';
//         bgHover.className = 'bg-hover bg-active';
//         body.style.overflow = "hidden";
//         onOff = true;
//     }else{
//         topApply.className = 'top-apply';
//         bgHover.className = 'bg-hover';
//         body.style.overflow = "scroll";
//         errorNews.className = "error-news";
//         bgHover1.className = 'bg-hover1';
//         onOff = false;
//     } 
// }
bgHover.onclick = function() {
    if(!onOff){
        topApply.className = 'apply-active';
        bgHover.className = 'bg-hover bg-active';
        body.style.overflow = "hidden";
        onOff = true;
    }else{
        topApply.className = 'top-apply';
        bgHover.className = 'bg-hover';
        body.style.overflow = "scroll";
        errorNews.className = "error-news";
        bgHover1.className = 'bg-hover1';
        onOff = false;
    }
}

//当点击top-nav时，two-nav显示出来 再次点击时隐藏
var topNav = document.querySelector('.top-nav');
var twoNav = document.querySelector('.two-nav');
var topBar = document.querySelector('.top-bar');
var topCont = document.querySelector('.top-content') 
var onOffTop = false;
topNav.onclick = function(){
    topCont.style.transition = 'all 0.5s';
    if(onOff) {
        topApply.className = 'top-apply';
        bgHover.className = 'bg-hover';
        body.style.overflow = "scroll";
        errorNews.className = "error-news";
        bgHover1.className = 'bg-hover1';
        onOff = false;
        onOffTop = true;
        if(!onOffTop){
            twoNav.style.right = '0';
            topBar.style.marginLeft = '-5.4rem';
            topCont.style.right = '5.4rem';
            onOffTop = true;
        }else{
            twoNav.style.right = '-5.4rem';
            topBar.style.marginLeft = '0';
            topCont.style.right = '0'
            onOffTop = false;
        }
    }else{
        if(!onOffTop){
            twoNav.style.right = '0';
            topBar.style.marginLeft = '-5.4rem';
            topCont.style.right = '5.4rem';
            onOffTop = true;
        }else{
            twoNav.style.right = '-5.4rem';
            topBar.style.marginLeft = '0';
            topCont.style.right = '0'
            onOffTop = false;
        }
    }
}
var verifyCode = document.querySelector('.verify-code');
var errorNews = document.querySelector('.error-news');
var bgHover1 = document.querySelector('.bg-hover1');
var myregPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
var myregEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
// 验证码发送控制
var countdown=60;
var t;
function timedCount() {
    t = setTimeout(function() {
        timedCount()
    },
    1000);
    if (countdown == 0) {
        verifyCode.removeAttribute("disabled");
        verifyCode.value = "免费获取验证码";
        verifyCode.className = "apply-input verify-code";
        countdown = 60;
        stopCount();
    } else {
        verifyCode.setAttribute("disabled", true);
        verifyCode.value = "重新发送(" + countdown + ")";
        verifyCode.className = "apply-input verify-code normal";
        countdown--;
    }
}
function stopCount() {
    clearTimeout(t)
}
verifyCode.onclick = function(){
    if (countdown == 60) {
        var telephone = document.querySelector(".tel-number").value;
        if (myregPhone.test(telephone)) {
            var url = '/backend/node/userEnterpr/verifyCode';
            var data = {
                telephone: document.querySelector(".tel-number").value,
            };
            function successCallback(res) {
                if (res.code == 0) {
                    timedCount()
                }
            }
            function errorCallback(xhr, status) {
                console.log('出问题了！');
            }
            Config.post(url, data, successCallback, errorCallback)
        } else {
            bgHover1.className = 'bg-hover1 bg-active';
            errorNews.className = "error-news error-active";
            errorP.innerHTML = "请输入正确的手机号码";
        }
    }
}
// 点击提交按钮发送申请试用信息
var submitApply = document.querySelector('.submit-apply');
var errorP = document.querySelector('.error-p');
var confirmNews = document.querySelector('.confirm-news');
submitApply.onclick = function(){
    var url = '/backend/node/userEnterpr/audit';
    var orgName = document.querySelector(".orgName").value;
    var email = document.querySelector(".email").value;
    var linkMan = document.querySelector(".linkMan").value;
    var linkManPost = document.querySelector(".linkManPost").value;
    var telephone = document.querySelector(".tel-number").value;
    var verifyCode = document.querySelector(".verifyCode").value;
    if(!orgName){
        bgHover1.className = 'bg-hover1 bg-active';
        errorNews.className = "error-news error-active";
        errorP.innerHTML = "请输入公司名称";
    }else if(!myregEmail.test(email)){
        bgHover1.className = 'bg-hover1 bg-active';
        errorNews.className = "error-news error-active";
        errorP.innerHTML = "请输入合法邮箱";
    }else if(!linkMan){
        bgHover1.className = 'bg-hover1 bg-active';
        errorNews.className = "error-news error-active";
        errorP.innerHTML = "请输入联系人";
    }else if(!linkManPost){
        bgHover1.className = 'bg-hover1 bg-active';
        errorNews.className = "error-news error-active";
        errorP.innerHTML = "请输入联系人岗位";
    }else if(!myregPhone.test(telephone)){
        bgHover1.className = 'bg-hover1 bg-active';
        errorNews.className = "error-news error-active";
        errorP.innerHTML = "请输入手机号码";
    }else if(!verifyCode){
        bgHover1.className = 'bg-hover1 bg-active';
        errorNews.className = "error-news error-active";
        errorP.innerHTML = "请输入验证码";
    }else{
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
            if(res.code == 0){
                topApply.className = 'top-apply';
                confirmNews.className = 'confirm-news error-active'
            }
        }
        function errorCallback(xhr, status){
            console.log('出问题了！');
        }
        Config.post(url,data,successCallback,errorCallback)
    }
}
// 点击错误窗口关闭窗口
errorNews.onclick = function(){
    errorNews.className = "error-news";
    bgHover1.className = 'bg-hover1';
}
// 点击确认恢复正常
confirmNews.onclick = function(){
    confirmNews.className = "confirm-news";
    bgHover.className = 'bg-hover';
    body.style.overflow = "scroll";
    bgHover.className = 'bg-hover';
}