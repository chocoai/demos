require(['../js/config.js?v=' + (new Date()).getTime(), '../lib/dot/dot.min'], function(config, doT) {
    require([], function() {
        $.showLoading();
        var loanPartnerHtml = '<div class="weui-cells weui-cells_form weui-cells_checkbox">\
            <div class="weui-cell">\
                <div class="weui-cell__hd"><label class="weui-label width300">共同借款人姓名</label></div>\
                <div class="weui-cell__bd">\
                    <input id="name" class="weui-input" placeholder="请输入" value="{{=it && it.name ? it.name : ""}}">\
                </div>\
            </div>\
            <div class="weui-cell weui-cell_vcode">\
                <div class="weui-cell__hd">\
                    <label class="weui-label width300">与您的关系</label>\
                </div>\
                <div class="weui-cell__bd">\
                    <input id="relationship" class="weui-input" placeholder="请选择" value="{{=it && it.relationship ? it.relationship : ""}}">\
                </div>\
            </div>\
            <div class="weui-cell">\
                <div class="weui-cell__hd"><label class="weui-label width300">联系方式</label></div>\
                <div class="weui-cell__bd">\
                    <input id="telephone" class="weui-input" placeholder="请输入" maxlength="11" value="{{=it && it.telephone ? it.telephone : ""}}">\
                </div>\
            </div>\
            <div class="weui-cell">\
                <div class="weui-cell__hd"><label class="weui-label width300">单位名称</label></div>\
                <div class="weui-cell__bd">\
                    <input id="orgName" class="weui-input" placeholder="请输入" value="{{=it && it.orgName ? it.orgName : ""}}">\
                </div>\
            </div>\
            <div class="weui-cell">\
                <div class="weui-cell__hd"><label class="weui-label width300">单位地址</label></div>\
                <div class="weui-cell__bd">\
                    <input id="orgAddr" class="weui-input" placeholder="请输入" value="{{=it && it.orgAddr ? it.orgAddr : ""}}">\
                </div>\
            </div>\
        </div>\
        <div id="submitPartner" class="weui-btn weui-btn_primary">下一步</div>',
            bcgxData = [],
            reqCode = config.getQueryParams('reqCode') || LS.get(config.constants.reqCode),
            isSponsor = config.getQueryParams('isSponsor');
        
        loanGuarantee('GET', {code: reqCode, type: 0});

        // 共同借款人及担保人查询
        function loanGuarantee(type, params) {
            $.ajax({
                url: config.url + '/comm/loan/guarantee',
                type: type,
                data: params,
                dataType: 'json',
                success: function(result) {
                    $.hideLoading();
                    if (result.code == 0) {
                        if(type == 'GET') {
                            var data = result.data;   
                            $('#loanPartner').html(doT.template(loanPartnerHtml)(data)); 
                            commonItems(); 

                            // 下一步
                            $('#submitPartner').on('click', function() {
                                var mobileReg = config.constants.mobileReg;
                                var name = $.trim($('#name').val())
                                if (!name) return $.toast(config.constants.nullName, 'text');
                                var relationship = $.trim($('#relationship').val())
                                if (!relationship) return $.toast(config.constants.nullRelationship, 'text');
                                for(var i = 0; i < bcgxData.length; i++) {
                                    var item = bcgxData[i];
                                    if(relationship == item.ddText) relationship = item.ddValue;
                                }
                                var telephone = $.trim($('#telephone').val())
                                if (!telephone) return $.toast(config.constants.nullTelephone, 'text');
                                if (!(mobileReg.test(telephone))) return $.toast(config.constants.errorMobile, 'text');
                                var orgName = $.trim($('#orgName').val())
                                if (!orgName) return $.toast(config.constants.nullOrgName, 'text');
                                var orgAddr = $.trim($('#orgAddr').val())
                                if (!orgAddr) return $.toast(config.constants.nullOrgAddr, 'text');
                                $.showLoading();
                                var postParams = {
                                    reqCode: reqCode,
                                    guaranteeType: 0,
                                    name: name,
                                    relationship: relationship,
                                    telephone: telephone,
                                    orgName: orgName,
                                    orgAddr: orgAddr
                                };
                                loanGuarantee('POST', postParams);
                            });
                        } else if (type == 'POST') {
                            if(isSponsor == 1) {
                                window.location.href = 'applyLoanSponsor.html?reqCode=' + reqCode;
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
                data: {code: 'bcgx'},
                dataType: 'json',
                success: function(result) {
                    if(result.code == 0) {
                        bcgxData = result.data.bcgx;
                        var pickerTexts = [];
                        for(var i = 0; i < bcgxData.length; i++) {
                            var item = bcgxData[i];
                            if(item.ddText != '配偶') pickerTexts.push(item.ddText);
                        }
                        $('#relationship').picker({
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
