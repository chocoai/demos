$(document).ready(function() {
    // var slider = new Slider();
    $(window).scroll(function() {
       var attachHeight1 = (- $("body").scrollTop()/20)+"px"
       var attachHeight2 = (- $("body").scrollTop()/20)+"px"
       $(".bg-attachment1").css("background-position", "50%"+ attachHeight1 );
       $(".bg-attachment2").css("background-position", "50%"+ attachHeight2 );
    });
    var path=location.pathname.split("/")[1];
    if(path=='about'){
        $('html,body').animate({scrollTop:$('.aboutCon').offset().top}, 500);
    }
    var advantage = $(".advantage-li");
    $(".advantage-li:eq(0)").click(function(){
        $(".advantage-content").animate({left:'0'});
        removeActive();
        $(this).addClass("li1-active")
    }); 
    $(".advantage-li:eq(1)").click(function(){
        $(".advantage-content").animate({left:'-100%'});
        removeActive();
        $(this).addClass("li2-active")
    });
    function removeActive(){
        $(".advantage-li:eq(0)").removeClass("li1-active")
        $(".advantage-li:eq(1)").removeClass("li2-active")
        $(".advantage-li:eq(2)").removeClass("li3-active")
        $(".advantage-li:eq(3)").removeClass("li4-active")
        $(".advantage-li:eq(4)").removeClass("li5-active")
    } 
    $(".advantage-li:eq(2)").click(function(){
        $(".advantage-content").animate({left:'-200%'});
        removeActive();
        $(this).addClass("li3-active")
    });
    $(".advantage-li:eq(3)").click(function(){
        $(".advantage-content").animate({left:'-300%'});
        removeActive();
        $(this).addClass("li4-active");
    });
    $(".advantage-li:eq(4)").click(function(){
        $(".advantage-content").animate({left:'-400%'});
        removeActive();
        $(this).addClass("li5-active");
    });
    $("#slider-btn1").click(function(){
        $(".apply").show();
        $(".bg-hover").show();
        $("body").css("overflow","hidden");
    });

    
 });