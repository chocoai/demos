 require(['../js/config.js?v=' + (new Date()).getTime(), '../lib/dot/dot.min'], function(config, doT) {
    require([], function() {
        $.showLoading();
        var hyzkData = '',
            partner = 1, // 1 配偶 2 亲属 
            reqCode = config.getQueryParams('reqCode') || LS.get(config.constants.reqCode),
            prdType = config.getQueryParams('prdType') || LS.get(config.constants.prdType);
        var loanMateHtml = '<div class="weui-cells weui-cells_form weui-cells_checkbox">\
            <div class="weui-cell weui-cell_vcode">\
                <div class="weui-cell__hd">\
                    <label class="weui-label">婚姻状况</label>\
                </div>\
                <div class="weui-cell__bd">\
                    <input id="maritalStatus" class="weui-input" placeholder="请选择" value="{{=it && it.maritalStatusText? it.maritalStatusText : ""}}">\
                </div>\
            </div>\
            <div class="weui-cell">\
                <div class="weui-cell__hd"><label class="weui-label"><span class="J_utitle">配偶</span>姓名</label></div>\
                <div class="weui-cell__bd">\
                    <input id="name" class="weui-input" type="text" placeholder="请输入" value="{{=it && it.name ? it.name : ""}}">\
                </div>\
            </div>\
            <div class="weui-cell">\
                <div class="weui-cell__hd"><label class="weui-label"><span class="J_utitle">配偶</span>联系方式</label></div>\
                <div class="weui-cell__bd">\
                    <input id="telephone" class="weui-input" maxlength="11" type="text" placeholder="请输入" value="{{=it && it.telephone? it.telephone : ""}}">\
                </div>\
            </div>\
            <div class="weui-cell">\
                <div class="weui-cell__hd"><label class="weui-label"><span class="J_utitle">配偶</span>单位名称</label></div>\
                <div class="weui-cell__bd">\
                    <input id="orgName" class="weui-input" type="text" placeholder="请输入" value="{{=it && it.orgName? it.orgName : ""}}">\
                </div>\
            </div>\
            <div class="weui-cell">\
                <div class="weui-cell__hd"><label class="weui-label"><span class="J_utitle">配偶</span>单位地址</label></div>\
                <div class="weui-cell__bd">\
                    <input id="orgAddr" class="weui-input" type="text" placeholder="请输入" value="{{=it && it.orgAddr ? it.orgAddr : ""}}">\
                </div>\
            </div>\
        </div>\
        <div id="sublimeMate" class="weui-btn weui-btn_primary">下一步</div>';
        
        loanSpouse('GET', {code: reqCode});

        // 配偶信息查询
        function loanSpouse(type, params) {
            $.ajax({
                url: config.url + '/comm/loan/spouse',
                type: type,
                data: params,
                dataType: 'json',
                success: function(result) {
                    $.hideLoading();
                    if (result.code == 0) {
                        if(type == 'GET') {
                            var data = result.data;
                            $('#loanMate').html(doT.template(loanMateHtml)(data));
                            if((data && data.maritalStatusText == '未婚') || (data && data.maritalStatusText == '离异')) {
                                $('.J_utitle').text('亲属');
                                partner = 2;
                            } else {
                                $('.J_utitle').text('配偶');
                                partner = 1;
                            }
                            commonItems();
                            $('#sublimeMate').on('click', function() {
                                var mobileReg = config.constants.mobileReg;
                                var maritalStatus = $.trim($('#maritalStatus').val())
                                if (!maritalStatus) return $.toast(config.constants.nullMaritalStatus, 'text');
                                for(var i = 0; i < hyzkData.length; i++) {
                                    var item = hyzkData[i];
                                    if(maritalStatus == item.ddText) maritalStatus = item.ddValue;
                                }
                                var name = $.trim($('#name').val())
                                if (!name) return $.toast(config.constants.nullName, 'text');
                                var telephone = $.trim($('#telephone').val())
                                if (!telephone) return $.toast(config.constants.nullTelephone, 'text');
                                if (!(mobileReg.test(telephone))) return $.toast(config.constants.errorMobile, 'text');
                                var orgName = $.trim($('#orgName').val())
                                if (!orgName) return $.toast(config.constants.nullOrgName, 'text');
                                var orgAddr = $.trim($('#orgAddr').val())
                                if (!orgAddr) return $.toast(config.constants.nullOrgAddr, 'text');
                                $.showLoading();
                                var loanSpouseParams = {
                                    reqCode: reqCode,
                                    maritalStatus: maritalStatus,
                                    name: name, 
                                    telephone: telephone,
                                    orgName: orgName,
                                    orgAddr: orgAddr
                                };
                                loanSpouse('POST', loanSpouseParams);
                            });
                        } else if (type == 'POST') {
                            // prdType: 产品类型:1.网贷, 2.经营贷
                            if(prdType == 2) {
                                window.location.href = 'applyLoanFirm.html?reqCode=' + reqCode + '&prdType=' + prdType + '&partner=' + partner;
                            } else {
                                window.location.href = 'submitApply.html?reqCode=' + reqCode + '&prdType=' + prdType;
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
                url: config.url + '/comm/sys/dict/items/all',
                type: 'GET',
                data: {code: 'hyzk'},
                dataType: 'json',
                success: function(result) {
                    if(result.code == 0) {
                        hyzkData = result.data.hyzk;
                        var pickerTexts = [];
                        for(var i = 0; i < hyzkData.length; i++) {
                            var item = hyzkData[i];
                            pickerTexts.push(item.ddText);
                        }
                        $('#maritalStatus').picker({
                            toolbarTemplate: '<div class="toolbar"><div class="toolbar-inner"><h1 class="title"></h1><a href="javascript:;" class="picker-button close-picker">完成</a></div></div>',
                            cols: [{
                                textAlign: 'center',
                                values: pickerTexts
                            }]
                        });
                        $('#maritalStatus').on('change', function() {
                            var status = $(this).val();
                            if(status == '未婚' || status == '离异') {
                                $('.J_utitle').text('亲属');
                                partner = 2;
                            } else {
                                $('.J_utitle').text('配偶');
                                partner = 1;
                            }
                        });
                        maritalStatus
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
