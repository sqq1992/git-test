export const trim = string => (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
export const objDeepCopy = function(source){
  var sourceCopy = {};
  for (var item in source) sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
  return sourceCopy;
}

export const deepCopy = function(source) {
  var sourceCopy = source instanceof Array ? [] : {};
  for (var item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
  }
  return sourceCopy;
}

/**
 * 过滤空值的属性
 * @param obj
 * @constructor
 */
export const filterData = function (obj) {
  for (var key in obj) {
    if (obj[key] == null || obj[key] === '') {
      delete obj[key]
    }
  }
}


export const formatDate = function (format,date = new Date()) {
  if(!date) return ''
  date = new Date(date);
  if(typeof date === 'string') {
    date = new Date(date);
  }
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o){
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return format;
}

export const on = (() => {
  if (document.addEventListener) {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    }
  } else {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()
export const off = (() => {
  if (document.removeEventListener) {
    return (element, event, handler) => {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return (element, event, handler) => {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

export const msgEncode = msg => {
  return msg.replace(/\%/g,"%25").replace(/\+/g, '%2B').replace(/\"/g,'%22').replace(/\'/g, '%27').replace(/\//g,'%2F').replace(/\&/g,"%26").replace(/\#/g,"%23");
}
/**
 * 获取短信签名 内容 （后续可能改成是否有退订回TD）
 * 自动短信 默认参数是没有回T退和签名的 要做特殊处理
 *
 * */
export const getMessage = (sms,logistics) =>{
  let len = sms.length,
    signIndex = sms.indexOf('】'),
    sign = ~signIndex ? sms.slice(1,signIndex) : '',
    total = (len <= 70 ? 1 : Math.ceil(len / 67)),
    subscribeIndex = sms.lastIndexOf(' 退订回TD'),
    // subscribeIndex = sms.lastIndexOf(' 回T退'),
    // msg = sms.slice(signIndex + 1,len - 6)
    //物流短信不截取 回T退
    msg = signIndex > -1 ? !logistics ?  sms.slice(signIndex + 1, subscribeIndex == -1 ? len - 4 : len - 6) : sms.slice(signIndex + 1) : sms;
  return {
    msg,
    sign,
    len,
    total
  }
}


export function verifyPhone(phone) {
  phone = trim(phone)
  return phone.length === 11 && /^[1][3,4,5,6,8,7,9][0-9]{9}$/.test(phone)
}
export function splitPhone(content) {
  let phones = trim(content).replace(/[\r\n，]/g,","),
    finalPhones = [],
    filterPhones = [],
    json = {}
  phones = phones ? phones.split(",") : []
  phones.forEach(item => {
    const phone = trim(item)
    if(!verifyPhone(item)){
      phone && finalPhones.push(phone)
    }else if(!json[phone]){
      json[phone] = true
      filterPhones.push(phone)
    }
  })
  return {
    finalPhones,
    filterPhones
  }
}
export function splitNick(content) {
  return trim(content).replace(/[\r\n，]/g,",").split(',').filter(i => !!i)

}
export function handlerStr(str) {
  str = str.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g,'');
  return str;
}
export function formatMsg(msg) {
  const tagsRegMap ={
    // "#店铺名称#":"(****(店铺名))",
  }
  const regExpArr = [];
  for(var key in tagsRegMap) {
      if(tagsRegMap.hasOwnProperty(key)){
          regExpArr.push(key)
      }
  }
  let regExp = new RegExp(regExpArr.join("|"),"g")
  return  msg ? msg.replace(regExp,function($0) { return tagsRegMap[$0] || $0}) : msg
}
export function getCookie (key) {
  let cookieArr=document.cookie.split("; ");
  for(let i = 0; i < cookieArr.length ; i++){
      let cookieItem = cookieArr[i].split("=");
      if(cookieItem [0] == key){
          return cookieItem[1];
      }
  }
  return "";
}

export function getProperValue(value, defaultValue = '') {
  return value !== undefined && value !== null ? value : defaultValue;
}

/**
 * 获取指定日期
 * @param date 原始日期
 * @param {Number} diff 日期天数间隔，-1代表往前推1天(昨天)，1代表往后推一天(明天)
 * @return {Date}
 */
export function getDiffDate(date = '', diff = -1) {
  const _date = date ? new Date(date) : new Date();
  const _time = +_date;
  _date.setTime(_time + 3600 * 1000 * 24 * diff);
  return _date;
}
