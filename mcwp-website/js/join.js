$(document).ready(function() {
    $('.join-title-lists li').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
        $('.join-content-lists li').eq($(this).index()).css('display','block')
        $('.join-content-lists li').eq($(this).index()).siblings().css('display','none')
    })
    
 });