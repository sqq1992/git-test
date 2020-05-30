const validation = {
    // 是否是邮箱
    isEmail : function(v) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(v)) {
            return false;
        } else {
            return true;
        }
    },
    // 是否是数字
    isNum : function(v) {
        var reg = new RegExp("^[0-9]+.?[0-9]*$");
        if (!reg.test(v)) {
            return false;
        }
        return true;
    },
    // 手机号码验证
    isMobileNum : function(v) {
        var reg = /^(0|86|17951)?[0-9]{11}$/;
        if (reg.test(v)) {
            return true;
        } else {
            return false;
        }
    },
    // 固定电话验证
    isTelPhone : function(v) {
        var filter = /^((\d{3,4}\-)|)\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/;
        if (filter.test(v)) {
            return true;
        }
        return false;
    },
    // 验证正整数
    isIntNum : function(v) {
        var filter = /^[1-9][0-9]*$/;
        if (filter.test(v)) {
            return true;
        }
        return false;
    },
    // 判断是否为空
    isNull : function (value) {
        if (typeof value === "undefined" || typeof value === "" || typeof value === "null" || value == "null" || value == null || value == "" || value == "undefined") {
            return true;
        } else {
            return false;
        }
    },
    /* 数值对比 */
    contrast: function(valueTime, outTime) {
        if (valueTime > outTime) {
            return false;
        } else {
            return true;
        }
    },
    /* 判断中文 */
    checkzn: function(name) {
        if (!name) {
            return false;
        }
        var reg = /^[\u4E00-\u9FA5]{2,}$/;
        if (reg.test(name.trim())) {
            return true;
        } else {
            return false;
        }
    },
    /* 判断是否为一个方法 */
    isFn : function(fn){
        return Object.prototype.toString.call(fn) === "[object Function]"
    },
    /* 判断是否为一个对象 */
    isObject : function(fn){
        return Object.prototype.toString.call(fn) === "[object Object]"
    },
    /* 判断字符串是否为字母 */
    isString : function(value){
        var str = /^[A-Za-z]*$/;
        if( str.test(value) ){
            return true;
        } else {
            return false;
        }
    },
    /* 验证是否含有特殊字符 */
    isSpecialText: function(str) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~@#&*|{}【】']");
        if(str.match(pattern)){
            return true;
        } else {
            return false;
        }
    },
    /* 获取文本长度，中英文区别 */
    getBt : function(str){
        var char = str.replace(/[^\x00-\xff]/g, '**');
        return char.length;
    },
    /* 数字转文字 */
    conversionNumber: function(number) {
        var textArray = [
            '十',
            '一',
            '二',
            '三',
            '四',
            '五',
            '六',
            '七',
            '八',
            '九'
        ];
        var str = '';
        if(typeof(number) == 'object'){ console.error('类型错误');return false; }
        /* 10 就显示 十就好了，不需要显示 一十 */
        if(number == 10){ number = 0; }
        if(typeof(number) == 'number'){ number = number.toString(); }
        if(number.length > 1){
            number = (function(){
                var array = [],len = number.length;
                for(var i = 0; i < len; i++){
                    var text = number.substr(i,1);
                    array.push(text);
                }
                return array;
            })();
            number.forEach(function(value, index){
                if(number.length > 1 && index == 1){
                    str += '十';
                }
                str += textArray[value];
            });
        } else {
            str = textArray[number];
        }
        return str;
    },
    /* 判断是否为数组 */
    isArray: function(obj){
        return Object.prototype.toString.call(obj) === "[object Array]";
    },
    isIe: function() {
        var i = navigator.userAgent.toLowerCase().indexOf("msie");
        var j = navigator.userAgent.toLowerCase().indexOf("gecko");
        return i >= 0 || (j >= 0 && !this.isFireFox() && !this.isChrome());
    },
    isChrome: function(){
        var i = navigator.userAgent.toLowerCase().indexOf("chrome");
        var j = navigator.userAgent.toLowerCase().indexOf("safari");
        return i >= 0 && j >= 0;
    },
    isSafari: function(){
        var i = navigator.userAgent.toLowerCase().indexOf("chrome");
        var j = navigator.userAgent.toLowerCase().indexOf("safari");
        return i == -1 && j >= 0;
    },
    isOpera: function(){
        var i = navigator.userAgent.toLowerCase().indexOf("opera");
        return i >= 0;
    },
    //判断是否firefox
    isFireFox: function() {
        var i = navigator.userAgent.toLowerCase().indexOf("firefox");
        return i >= 0;
    },
    isEdge: function(){
        var i = navigator.userAgent.toLowerCase().indexOf("edge");
        return i >= 0;
    },
    isMobile: function(){
        var i = navigator.userAgent.toLowerCase().indexOf("mobile");
        return i >= 0;
    },
    /* 身份证id判断 */
    idCardNoUtil : {
        /* 省,直辖市代码表 */
        provinceAndCitys : {
            11 : "北京",
            12 : "天津",
            13 : "河北",
            14 : "山西",
            15 : "内蒙古",
            21 : "辽宁",
            22 : "吉林",
            23 : "黑龙江",
            31 : "上海",
            32 : "江苏",
            33 : "浙江",
            34 : "安徽",
            35 : "福建",
            36 : "江西",
            37 : "山东",
            41 : "河南",
            42 : "湖北",
            43 : "湖南",
            44 : "广东",
            45 : "广西",
            46 : "海南",
            50 : "重庆",
            51 : "四川",
            52 : "贵州",
            53 : "云南",
            54 : "西藏",
            61 : "陕西",
            62 : "甘肃",
            63 : "青海",
            64 : "宁夏",
            65 : "新疆",
            71 : "台湾",
            81 : "香港",
            82 : "澳门",
            91 : "国外"
        },

        /* 每位加权因子 */
        powers : [ "7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9",
            "10", "5", "8", "4", "2" ],

        /* 第18位校检码 */
        parityBit : [ "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2" ],

        /* 性别 */
        genders : {
            male : "男",
            female : "女"
        },

        /* 校验地址码 */
        checkAddressCode : function(addressCode) {
            var that = this;
            var check = /^[1-9]\d{5}$/.test(addressCode);
            if (!check)
                return false;
            if (that.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
                return true;
            } else {
                return false;
            }
        },

        /* 校验日期码 */
        checkBirthDayCode : function(birDayCode) {
            var that = this;
            var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/
                .test(birDayCode);
            if (!check)
                return false;
            var yyyy = parseInt(birDayCode.substring(0, 4), 10);
            var mm = parseInt(birDayCode.substring(4, 6), 10);
            var dd = parseInt(birDayCode.substring(6), 10);
            var xdata = new Date(yyyy, mm - 1, dd);
            if (xdata > new Date()) {
                return false;// 生日不能大于当前日期
            } else if ((xdata.getFullYear() == yyyy)
                && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd)) {
                return true;
            } else {
                return false;
            }
        },

        /* 计算校检码 */
        getParityBit : function(idCardNo) {
            var that = this;
            var id17 = idCardNo.substring(0, 17);
            /* 加权 */
            var power = 0;
            for (var i = 0; i < 17; i++) {
                power += parseInt(id17.charAt(i), 10) * parseInt(that.powers[i]);
            }
            /* 取模 */
            var mod = power % 11;
            return that.parityBit[mod];
        },

        /* 验证校检码 */
        checkParityBit : function(idCardNo) {
            var that = this;
            var parityBit = idCardNo.charAt(17).toUpperCase();
            if (that.getParityBit(idCardNo) == parityBit) {
                return true;
            } else {
                return false;
            }
        },

        /* 校验15位或18位的身份证号码 */
        checkIdCardNo : function(idCardNo) {
            var that = this;
            // 15位和18位身份证号码的基本校验
            var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
            if (!check)
                return false;
            // 判断长度为15位或18位
            if (idCardNo.length == 15) {
                return that.check15IdCardNo(idCardNo);
            } else if (idCardNo.length == 18) {
                return that.check18IdCardNo(idCardNo);
            } else {
                return false;
            }
        },

        // 校验15位的身份证号码
        check15IdCardNo : function(idCardNo) {
            var that = this;
            // 15位身份证号码的基本校验
            var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/
                .test(idCardNo);
            if (!check)
                return false;
            // 校验地址码
            var addressCode = idCardNo.substring(0, 6);
            check = that.checkAddressCode(addressCode);
            if (!check)
                return false;
            var birDayCode = '19' + idCardNo.substring(6, 12);
            // 校验日期码
            return that.checkBirthDayCode(birDayCode);
        },

        // 校验18位的身份证号码
        check18IdCardNo : function(idCardNo) {
            var that = this;
            // 18位身份证号码的基本格式校验
            var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/
                .test(idCardNo);
            if (!check)
                return false;
            // 校验地址码
            var addressCode = idCardNo.substring(0, 6);
            check = that.checkAddressCode(addressCode);
            if (!check)
                return false;
            // 校验日期码
            var birDayCode = idCardNo.substring(6, 14);
            check = that.checkBirthDayCode(birDayCode);
            if (!check)
                return false;
            // 验证校检码
            return that.checkParityBit(idCardNo);
        },

        formateDateCN : function(day) {
            var that = this;
            var yyyy = day.substring(0, 4);
            var mm = day.substring(4, 6);
            var dd = day.substring(6);
            return yyyy + '-' + mm + '-' + dd;
        },

        // 获取信息
        getIdCardInfo : function(idCardNo) {
            var that = this;
            var idCardInfo = {
                gender : "", // 性别
                birthday : "" // 出生日期(yyyy-mm-dd)
            };
            if (idCardNo.length == 15) {
                var aday = '19' + idCardNo.substring(6, 12);
                idCardInfo.birthday = that.formateDateCN(aday);
                if (parseInt(idCardNo.charAt(14)) % 2 == 0) {
                    idCardInfo.gender = that.genders.female;
                } else {
                    idCardInfo.gender = that.genders.male;
                }
            } else if (idCardNo.length == 18) {
                var aday = idCardNo.substring(6, 14);
                idCardInfo.birthday = that.formateDateCN(aday);
                if (parseInt(idCardNo.charAt(16)) % 2 == 0) {
                    idCardInfo.gender = that.genders.female;
                } else {
                    idCardInfo.gender = that.genders.male;
                }

            }
            return idCardInfo;
        },

        /* 18位转15位 */
        getId15 : function(idCardNo) {
            var that = this;
            if (idCardNo.length == 15) {
                return idCardNo;
            } else if (idCardNo.length == 18) {
                return idCardNo.substring(0, 6) + idCardNo.substring(8, 17);
            } else {
                return null;
            }
        },

        /* 15位转18位 */
        getId18 : function(idCardNo) {
            var that = this;
            if (idCardNo.length == 15) {
                var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);
                var parityBit = that.getParityBit(id17);
                return id17 + parityBit;
            } else if (idCardNo.length == 18) {
                return idCardNo;
            } else {
                return null;
            }
        }
    }
};

module.exports = validation;