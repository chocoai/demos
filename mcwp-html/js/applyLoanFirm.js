require(['../js/config.js?v=' + (new Date()).getTime(), '../lib/dot/dot.min'], function(config, doT) {
    require([], function() {
        $.showLoading();
        var loanFirmHtml = '<div class="weui-cells weui-cells_form weui-cells_checkbox">\
            <div class="weui-cell">\
                <div class="weui-cell__hd"><label class="weui-label">企业名称</label></div>\
                <div class="weui-cell__bd">\
                    <input id="orgName" class="weui-input" placeholder="请输入" value="{{=it && it.orgName ? it.orgName : ""}}">\
                </div>\
            </div>\
            <div class="weui-cell weui-cell_vcode">\
                <div class="weui-cell__hd">\
                    <label class="weui-label">申请金额</label>\
                </div>\
                <div class="weui-cell__bd">\
                    <input id="loanAmount" class="weui-input" placeholder="请输入" value="{{=it && it.loanAmount ? it.loanAmount : ""}}">\
                </div>\
                <div class="weui-cell__ft">\
                    <button class="weui-vcode-btn vcode-btn">万元</button>\
                </div>\
            </div>\
            <div class="weui-cell weui-cell_vcode">\
                <div class="weui-cell__hd">\
                    <label class="weui-label">申请期限</label>\
                </div>\
                <div class="weui-cell__bd">\
                    <input id="repaymentPeriod" class="weui-input" placeholder="请输入" value="{{=it && it.repaymentPeriod ? it.repaymentPeriod : ""}}">\
                </div>\
                <div class="weui-cell__ft">\
                    <button class="weui-vcode-btn vcode-btn">月</button>\
                </div>\
            </div>\
            <div class="weui-cell weui-cell_vcode">\
                <div class="weui-cell__hd">\
                    <label class="weui-label">还款方式</label>\
                </div>\
                <div class="weui-cell__bd">\
                    <input id="repaymentKind" class="weui-input" placeholder="请选择" value="{{=it && it.repaymentKindText ? it.repaymentKindText : ""}}">\
                </div>\
            </div>\
            <label class="weui-cell weui-check__label" for="isPartner">\
                <div class="weui-cell__hd">是否有共同借款人</div>\
                <div class="weui-cell__ft">\
                    <input type="checkbox" class="weui-check" name="checkbox1" id="isPartner">\
                    <i class="weui-icon-checked icon-check"></i>\
                </div>\
            </label>\
            <label id="spouseLabel" class="weui-cell weui-check__label hide" for="isSpouse">\
                <div class="weui-cell__hd">共同借款人为配偶</div>\
                <div class="weui-cell__ft">\
                    <input type="checkbox" class="weui-check" name="checkbox1" id="isSpouse">\
                    <i class="weui-icon-checked icon-check"></i>\
                </div>\
            </label>\
            <label class="weui-cell weui-check__label" for="isSponsor">\
                <div class="weui-cell__hd">担保人</div>\
                <div class="weui-cell__ft">\
                    <input type="checkbox" class="weui-check" name="checkbox1" id="isSponsor">\
                    <i class="weui-icon-checked icon-check"></i>\
                </div>\
            </label>\
        </div>\
        <div id="submitFirm" class="weui-btn weui-btn_primary">下一步</div>',
            hkfsData = [],
            reqCode = config.getQueryParams('reqCode') || LS.get(config.constants.reqCode),
            prdType = config.getQueryParams('prdType') || LS.get(config.constants.prdType)
            partner = config.getQueryParams('partner'),
            isPartner = 0,
            isSpouse = 0,
            isSponsor = 0;
        
        loanAdditional('GET', {code: reqCode});

        // 配偶信息查询
        function loanAdditional(type, params) {
            $.ajax({
                url: config.url + '/comm/loan/additional',
                type: type,
                data: params,
                dataType: 'json',
                success: function(result) {
                    $.hideLoading();
                    if (result.code == 0) {
                        if(type == 'GET') {
                            var data = result.data;   
                            $('#loanFirm').html(doT.template(loanFirmHtml)(data)); 
                            if(data.isSpouse) {
                                $('#isPartner').attr('checked', true);
                                $('#isSpouse').attr('checked', true);
                                $('#spouseLabel').removeClass('hide');
                                isPartner = 1;
                                isSpouse = 1;
                            } else {
                                $('#isPartner').removeAttr('checked');
                                $('#isSpouse').removeAttr('checked');
                                $('#spouseLabel').addClass('hide');
                                isSpouse = 0;
                            }
                            // 共同借款人
                            $('#isPartner').on('change', function() {
                                var radios = document.getElementById('isPartner');
                                if(radios.checked) {
                                    isPartner = 1;
                                    if(partner == 1) $('#spouseLabel').removeClass('hide');
                                } else {
                                    isPartner = 0;
                                    isSpouse = 0;
                                    if(partner == 1) $('#spouseLabel').addClass('hide');
                                }
                            });

                            // 共同借款人为配偶
                            $('#isSpouse').on('change', function() {
                                var radios = document.getElementById('isSpouse');
                                var checked = $(this).attr('checked');
                                if(radios.checked) {
                                    isSpouse = 1;
                                } else {
                                    isSpouse = 0;
                                }
                            });

                            // 担保人
                            $('#isSponsor').on('change', function() {
                                var radios = document.getElementById('isSponsor');
                                if(radios.checked) {
                                    isSponsor = 1;
                                } else {
                                    isSponsor = 0;
                                }
                            });
                            commonItems(); 
                            // 下一步
                            $('#submitFirm').on('click', function() {
                                var orgName = $.trim($('#orgName').val())
                                if (!orgName) return $.toast(config.constants.nullOrgName, 'text');
                                var loanAmount = $.trim($('#loanAmount').val())
                                if (!loanAmount) return $.toast(config.constants.nullLoanAmount, 'text');
                                if(loanAmount <= 0 || !config.isNumber(loanAmount)) return $.toast(config.constants.errorLoanAmount, 'text');
                                var repaymentPeriod = $.trim($('#repaymentPeriod').val())
                                if (!repaymentPeriod) return $.toast(config.constants.nullRepaymentPeriod, 'text');
                                if(!config.isInt(repaymentPeriod)) return $.toast(config.constants.errorRepaymentPeriod, 'text');
                                var repaymentKind = $.trim($('#repaymentKind').val())
                                if (!repaymentKind) return $.toast(config.constants.nullRepaymentKind, 'text');
                                for(var i = 0; i < hkfsData.length; i++) {
                                    var item = hkfsData[i];
                                    if(repaymentKind == item.ddText) repaymentKind = item.ddValue;
                                }
                                $.showLoading();
                                var postParams = {
                                    reqCode: reqCode,
                                    orgName: orgName,
                                    loanAmount: loanAmount,
                                    repaymentPeriod: repaymentPeriod,
                                    repaymentKind: repaymentKind,
                                    isSpouse: isSpouse
                                };
                                loanAdditional('POST', postParams);
                            });
                        } else if (type == 'POST') {
                            if(isPartner == 1 && isSpouse == 0) {
                                window.location.href = 'loanPartner.html?reqCode=' + reqCode + '&isSponsor=' + isSponsor;
                            } else if((isSpouse == 1 && isSponsor == 1) || isSponsor == 1) {
                                window.location.href = 'applyLoanSponsor.html?reqCode=' + reqCode + '&isSponsor=' + isSponsor;
                            } else {
                                window.location.href = 'submitApply.html?reqCode=' + reqCode;
                            }
                        }
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

        // 获取婚姻状况
        function commonItems() {
            $.ajax({
                url: config.url + '/comm/sys/dict/items',
                type: 'GET',
                data: {code: 'hkfs'},
                dataType: 'json',
                success: function(result) {
                    if(result.code == 0) {
                        hkfsData = result.data.hkfs;
                        var pickerTexts = [];
                        for(var i = 0; i < hkfsData.length; i++) {
                            var item = hkfsData[i];
                            pickerTexts.push(item.ddText);
                        }
                        $('#repaymentKind').picker({
                            toolbarTemplate: '<div class="toolbar"><div class="toolbar-inner"><h1 class="title"></h1><a href="javascript:;" class="picker-button close-picker">完成</a></div></div>',
                            cols: [{
                                textAlign: 'center',
                                values: pickerTexts
                            }]
                        });
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
