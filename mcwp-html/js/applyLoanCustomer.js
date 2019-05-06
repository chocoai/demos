 require(['../js/config.js?v=' + (new Date()).getTime()], function(config) {
    require([], function() {
        $.showLoading();
        var jkytData = '',
            prdCode = config.getQueryParams('prdCode') || LS.get(config.constants.prdCode),
            prdType = config.getQueryParams('prdType') || LS.get(config.constants.prdType),
            managerCode = config.getQueryParams('managerCode') || LS.get(config.constants.managerCode),
            open = config.getQueryParams('openWith') || LS.get(config.constants.open);

        commonItems();

        var waiter = config.constants.waiter,
            mobileReg = config.constants.mobileReg;
        // 获取手机验证码
        $('#getCode').on('click', function() {
            waiter = config.constants.waiter;
            if (waiter != 60) return;
            var mobile = $.trim($('#telephone').val());
            if (!mobile) {
                $.toast(config.constants.nullMobile, "text");
                return;
            }
            if (!(mobileReg.test(mobile))) {
                $.toast(config.constants.errorMobile, 'text');
                return;
            }
            var verifycodeParams = {
                telephone: mobile
            };
            // 借款人信息录入时验证手机号
            commonVerifycode(verifycodeParams);
        });

        $('#submitInfo').on('click', function() {
            var cname = $.trim($('#cname').val()),
                mobile = $.trim($('#telephone').val()),
                verifyCode = $.trim($('#verifyCode').val()),
                loanUse = $.trim($('#picker').val());
            if (!cname) return $.toast(config.constants.nullCname, "text");
            if (!mobile) return $.toast(config.constants.nullMobile, "text");
            if (!(mobileReg.test(mobile))) return $.toast(config.constants.errorMobile, 'text');
            if (!verifyCode) return $.toast(config.constants.nullVerifyCode, "text");
            if (!loanUse) return $.toast(config.constants.nullLoanUse, "text");
            for(var i = 0; i < jkytData.length; i++) {
                var item = jkytData[i];
                if(loanUse == item.ddText) loanUse = item.ddValue;
            }
            $.showLoading();
            var customerParams = {
                prdCode: prdCode,
                managerCode: managerCode,
                cname: cname,
                telephone: mobile,
                loanUse: loanUse,
                verifyCode: verifyCode
            };
            commonCustomer(customerParams);
        });

        // 借款人信息录入时验证手机号
        function commonVerifycode(verifycodeParams) {
            if (waiter == 60) config.codeTime($('#getCode'));
            $.ajax({
                url: config.url + '/comm/loan/customer/telephone',
                type: 'POST',
                data: verifycodeParams,
                dataType: 'json',
                success: function(result) {
                    if(result.code == 0) {
                        $.toast('验证码发送成功，请注意查收', 'text');
                    } else {
                        $.toast(result.msg, 'text');
                        $('#getCode').html('重新获取');
                        config.constants.waiter = 60;
                    }
                },
                error: function() {
                    $.toast(config.constants.networkTimeout, 'text');
                }
            });
        }

        // 获取借款用途
        function commonItems() {
            $.ajax({
                url: config.url + '/comm/sys/dict/items/all',
                type: 'GET',
                data: {code: 'jkyt'},
                dataType: 'json',
                success: function(result) {
                    $.hideLoading();
                    if(result.code == 0) {
                        jkytData = result.data.jkyt;
                        var pickerValues = [];
                        for(var i = 0; i < jkytData.length; i++) {
                            var item = jkytData[i];
                            pickerValues.push(item.ddText);
                        }
                        $("#picker").picker({
                            toolbarTemplate: '<div class="toolbar"><div class="toolbar-inner"><h1 class="title"></h1><a href="javascript:;" class="picker-button close-picker">完成</a></div></div>',
                            cols: [{
                                textAlign: 'center',
                                values: pickerValues
                            }]
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

        // 借款人信息录入
        function commonCustomer(customerParams) {
            $.ajax({
                url: config.url + '/comm/loan/customer',
                type: 'POST',
                data: customerParams,
                dataType: 'json',
                success: function(result) {
                    if(result.code == 0) {
                        var data = result.data;
                        LS.set(config.constants.reqCode, data.reqCode);
                        LS.set(config.constants.enterpriseCode, data.enterpriseCode);
                        window.location.href = 'idCardVerify.html?reqCode=' + data.reqCode + '&prdType=' + prdType + '&enterpriseCode=' + data.enterpriseCode + '&openWith=' + open;
                    } else {
                        $.toast(result.msg, 'text');
                    }
                },
                error: function() {
                    $.toast(config.constants.networkTimeout, 'text');
                }
            });
        }
    });
});
