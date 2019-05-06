 require(['../js/config.js?v=' + (new Date()).getTime(), '../lib/dot/dot.min', 'http://api.map.baidu.com/getscript?v=2.0&ak=PNhhMFEMvIgiZ8LO09zFNeBd3pHtnM7r&services=&t=20170511202040'], function(config, doT) {
    require([], function() {
         var myValue, map, hourseParams = {};

        createMap();
        
        commonItems();
        // 创建Map实例
        function createMap() {
            // 百度地图API功能
            map = new BMap.Map('allmap');
    
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r) {
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    var mk = new BMap.Marker(r.point);
                    var city = r.address.city;
                    if(city.indexOf('市') > -1) {
                        city = city.substring(0, city.length - 1);
                    }
                    if(city.indexOf('自治区') > -1) {
                        city = city.substring(0, city.length - 3);
                    }
                    $('#currentCity').text(city);
                    var point = new BMap.Point(r.point.lng, r.point.lat);
                    map.centerAndZoom(point, 20);
                    map.addOverlay(mk);
                    map.panTo(r.point); // 移动
                    map.disableDragging();     //禁止拖拽
  
                    // 建立一个自动完成的对象
                    var ac = new BMap.Autocomplete({ 
                        'input': 'suggestId',
                        'location' : map
                    });
                    ac.addEventListener('onhighlight', function(e) {  //鼠标放在下拉列表上的事件
                        var str = '';
                        var _value = e.fromitem.value;
                        var value = '';
                        if (e.fromitem.index > -1) {
                            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                        }    
                        str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value;
                        
                        value = '<br />value = ';
                        if (e.toitem.index > -1) {
                            _value = e.toitem.value;
                            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                        }    
                        str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value;
                        G('searchResultPanel').innerHTML = str;
                    });
                    ac.addEventListener('onconfirm', function(e) {    //鼠标点击下拉列表后的事件
                    
                    var _value = e.item.value;
                        if(_value.city.indexOf('市') > -1) {
                            hourseParams.city = _value.city.substring(0, _value.city.length - 1);
                        }
                        hourseParams.district = _value.district;
                        hourseParams.haname = _value.business;
                        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                        hourseParams.location = myValue;
                        if($('#houseModal')) $('#houseModal').remove();
                        var html = '<div id="houseModal" class="house-modal">\
                            <div class="house-title">'+ _value.business +'</div>\
                            <div class="house-addr">'+ myValue +'</div>\
                            <div class="house-addr-desc"><input id="floor" type="number" pattern="[0-9]*" placeholder="所在楼层" maxlength="3" /><input id="height" type="number" placeholder="楼座的楼层" maxlength="4" /></div>\
                        </div>';
                        $('body').append(html);
                        G('searchResultPanel').innerHTML ='onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue;
                        
                        setPlace();
                    });
                } else {
                    alert('failed' + this.getStatus());
                }        
            }, {enableHighAccuracy: true});
        }

        // 百度地图API功能
        function G(id) {
            return document.getElementById(id);
        }

        function setPlace() {
            map.clearOverlays();    // 清除地图上所有覆盖物
            function myFun(){
                var pp = local.getResults().getPoi(0).point;    // 获取第一个智能搜索的结果
                map.centerAndZoom(pp, 20);
                map.addOverlay(new BMap.Marker(pp));    // 添加标注
            }
            var local = new BMap.LocalSearch(map, { // 智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }
        

        // 我要贷款
        $('#goAssess').on('click', function() {
            var prdCode = LS.get(config.constants.prdCode);
            var proptype = $.trim($('#fwyt').val());
            if(!proptype) return $.toast('请选择房屋用途', 'text');
            hourseParams.prdCode = prdCode || 'fa57bd5413774ff8b4b179468232c675'; // todo
            hourseParams.proptype = proptype;
            var bldgarea = $.trim($('#bldgarea').val());
            if(!bldgarea || !config.isNumber(bldgarea)) return $.toast('请输入本人名下房产所在小区', 'text');
            hourseParams.bldgarea = bldgarea;
            var floor = $.trim($('#floor').val());
            if(!floor || !config.isInt(floor)) return $.toast('请输入本人名下房产所在小区', 'text');
            hourseParams.floor = floor;
            var height = $.trim($('#height').val());
            if(!height || !config.isInt(height)) return $.toast('请输入本人名下房产所在小区', 'text');
            hourseParams.height = height;
            var telephone = $.trim($('#telephone').val());
            if(!telephone) return $.toast('请输入正确联系方式', 'text');
            hourseParams.telephone = telephone;
            if(!hourseParams.city) return $.toast('城市名参数不存在', 'text');
            if(!hourseParams.district) return $.toast('地区名参数不存在', 'text');
            if(!hourseParams.haname) return $.toast('小区名称参数不存在', 'text');
            if(!hourseParams.location) return $.toast('房源所在地址参数不存在', 'text');
            $.ajax({
                url: config.url + '/comm/v1/hourseEstimate',
                type: 'POST',
                data: hourseParams,
                dataType: 'json',
                success: function(result) {
                    if(result.code == 0) {
                        LS.set(config.constants.houseLoanCode, result.data);
                        window.location.href = './houseToLoan.html';
                    } else {
                        $.toast(result.msg, 'text');
                    }
                },
                error: function() {
                    $.toast(config.constants.networkTimeout, 'text');
                }
            });
        })

        // 获取房屋用途
        function commonItems() {
            $.ajax({
                url: config.url + '/comm/sys/dict/items',
                type: 'GET',
                data: {code: 'fwyt'},
                dataType: 'json',
                success: function(result) {
                    if(result.code == 0) {
                        var fwytData = result.data && result.data.fwyt;
                        var pickerTexts = [];
                        for(var i = 0; i < fwytData.length; i++) {
                            var item = fwytData[i];
                            pickerTexts.push(item.ddText);
                        }
                        $('#fwyt').picker({
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
