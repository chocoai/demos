 require(['../js/config.js?v=' + (new Date()).getTime(), '../lib/dot/dot.min'], function(config, doT) {
    require([], function() {
        $.showLoading();
        var submitApplyHtml = '<div class="apply-title">请确认信息后提交申请</div>\
        <div class="apply-info">\
            <p>{{=it && it.cname ? it.cname : ""}}</p>\
            <p class="apply-contact clearfix"><span>{{=it && it.idCardNo ? it.idCardNo : ""}}</span><span>{{=it && it.telephone ? it.telephone : ""}}</span></p>\
            <p class="apply-pro">申请贷款：{{=it && it.prodName ? it.prodName : ""}}</p>\
        </div>\
        <div id="submitBtn" class="weui-btn weui-btn_primary">提交申请</div>';
        var reqCode = config.getQueryParams('reqCode') || LS.get(config.constants.reqCode),
            prdCode = LS.get(config.constants.prdCode),
            managerCode = LS.get(config.constants.managerCode);
        
        confirmLoan();

        // 进件信息提交确认
        function confirmLoan() {
            $.ajax({
                url: config.url + '/comm/loan/req/confirm',
                type: 'GET',
                data: {code: reqCode},
                dataType: 'json',
                success: function(result) {
                    $.hideLoading();
                    if (result.code == 0) {
                        $('#submitApply').html(doT.template(submitApplyHtml)(result.data)); 
                        $('#submitBtn').on('click', finishLoan);
                    } else {
                        $.toast(result.msg, 'text');
                    }
                },
                error: function() {
                    $.hideLoading();
                    $.toast(config.constants.networkTimeout, 'text');
                }
            });
        }

        // 完成进件
        function finishLoan() {
            $.showLoading();
            $.ajax({
                url: config.url + '/comm/loan/req/finish',
                type: 'PUT',
                data: {code: reqCode},
                dataType: 'json',
                success: function(result) {
                    if(result.code == 0) {
                        $.toast(result.msg, 'text');
                        setTimeout(function() {
                            window.location.href = 'productDesc.html?prdCode=' + prdCode + '&managerCode=' + managerCode;
                        }, 2500)
                    } else {
                        $.toast(result.msg, 'text');
                    }
                },
                error: function() {
                    $.hideLoading();
                    $.toast(config.constants.networkTimeout, 'text');
                }
            });
        }
    });
});
