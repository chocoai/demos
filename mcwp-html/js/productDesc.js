 require(['../js/config.js?v=' + (new Date()).getTime(), '../lib/dot/dot.min'], function(config, doT) {
    require([], function() {
        $.showLoading();
        var productDescHtml = '<div flex="main:center cross:center" class="product-banner" style="background: url({{=it.coverUrl}}) no-repeat top center;background-size: cover;">\
        <div class="product-ad">{{=it.prdAd}}</div>\
        </div>\
        <h2 class="product-title">{{=it.prdName}}</h2>\
        <div class="product-loan">\
            <div class="loan-limit">\
                <p class="limit-title">贷款额度</p>\
                <p class="limit-max">最高<span>{{=it.loanLimit}}</span>万</p>\
            </div>\
            <div class="day-rate">\
                <p class="rate-title">日利率</p>\
                <p class="rate-count"><span>{{=it.loanRate}}</span>‰</p>\
            </div>\
            <div class="loan-cycle">\
                <p class="cycle-title">贷款周期</p>\
                <p class="cycle-max">最长<span>{{=it.loanMonths}}</span>个月</p>\
            </div>\
        </div>\
        <div class="loan-introduce">\
            <div class="repay-mode clearfix">\
                <p class="repay-icon icon"></p>\
                <p class="introduce-title">还款方式：</p>\
                <p class="introduce-content">{{=it.repaymentText || ""}}</p>\
            </div>\
            <div class="interest-mode clearfix">\
                <p class="interest-icon icon"></p>\
                <p class="introduce-title">计息方式：</p>\
                <p class="introduce-content">{{=it.interestText || ""}}</p>\
            </div>\
            <div class="credit-type clearfix">\
                <p class="credit-icon icon"></p>\
                <p class="introduce-title">授信类型：</p>\
                <p class="introduce-content">{{=it.authText || ""}}</p>\
            </div>\
        </div>\
        <div class="load-lending" data-title="放款方式">\
            <div class="lending-content">{{=it.loanType || ""}}</div>\
        </div>\
        <div class="load-qual" data-title="申请资质">\
            <div class="qual-content">{{=it.reqCondition}}</div>\
        </div>\
        <div class="load-people" data-title="使用人群">\
            <div class="people-content">{{=it.audience}}</div>\
        </div>\
        <div class="load-reminder" data-title="温馨提示">\
            <div class="people-content">主要面向私营企业主、个体经营户、个体经营者种养殖户和家庭作坊户等</div>\
        </div>\
        <div id="goApply" class="apply-btn">立即申请</div>';
        var code = config.getQueryParams('prdCode'),
            managerCode = config.getQueryParams('managerCode'),
            open = config.getQueryParams('openWith');
        if(code) {
            var params = {
                code: code,
                style: 'image/resize,m_fixed,w_1080,h_712'
            };
            getProdDesc(params);
        } else {
            $.hideLoading();
            $.toast('请获取正确链接', 'text');
        }

        // 获取产品详情
        function getProdDesc(params) {
            $.ajax({
                url: config.url + '/comm/prod/info',
                type: 'GET',
                data: params,
                dataType: 'json',
                success: function(result) {
                    $.hideLoading();
                    if (result.code == 0) {
                        var data = result.data;
                        $('#productDesc').html(doT.template(productDescHtml)(data)); 
                        document.title = data.prdName;
                        var iframe = document.createElement('iframe');
                        iframe.src = '../images/application-process_icon_selected.png';
                        iframe.style.display = 'none';
                        (document.body||document.documentElement).appendChild(iframe);
                        iframe.onload = function() {
                            setTimeout(function() {
                                iframe.remove()
                            }, 0);
                        }
                        // 立即申请
                        $('#goApply').on('click', function() {
                            LS.set(config.constants.prdCode, code);
                            LS.set(config.constants.managerCode, managerCode);
                            LS.set(config.constants.prdType, data.prdType);
                            LS.set(config.constants.open, open);
                            window.location.href = '../html/applyLoanCustomer.html?prdCode=' + code + '&managerCode=' + managerCode + '&openWith=' + open + '&prdType=' + data.prdType; // prdType: 产品类型:1.网贷, 2.经营贷
                        });
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
