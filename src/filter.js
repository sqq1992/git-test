export default function(Vue){
	let isNum = function(v) {
		var reg = /^[0-9]+.?[0-9]*$/;
        if (!reg.test(v)) {
            return false;
        }
        return true;
	}

	Vue.filter('numFormat', (num, digit = 0) => {
		try{
			let oNum = num;
			if(!oNum || oNum < 0){
				return 0;
      }
			if(!isNum(oNum)){
				return oNum.replace(/\d+(\.?\d+)?/,function($0) {
					return $0.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
				});
			}
			switch(digit){
				case 91: //不保留小数
					if(oNum){
						return parseFloat(oNum.match(/\d+/g).join(''));
					}else{
						return 0;
					}
					break;
				case 92: //保留两位小数
					return parseFloat(oNum.match(/\d+/g).join('')) / 100;
					break;
				default:
					if(!oNum || oNum == NaN || oNum == 'NaN' || oNum == Infinity || oNum == 'Infinity'){
						oNum = 0;
          }
					return (parseFloat(oNum).toFixed(digit) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
					break;
			}
		} catch(e){
			console.error(`错误信息：${e},        提交参数：${arguments}`);
		}
	});

	Vue.filter('nullFormat', function(str, str1 = '--'){
		if(!str){
			return str1;
		}
		return str;
	});

	Vue.filter('reverse', value => {
	  return value.split('').reverse().join('')
	});

	Vue.filter('formatDate', timestamp => {
	  	if (timestamp==''||timestamp==null) {
			return '';
		} else {
			const date = new Date(timestamp-0);

			let year = date.getFullYear(),
				month = ((date.getMonth()+1) > 9) ? (date.getMonth()+1) : ('0' + (date.getMonth()+1).toString()),
				day = (date.getDate() > 9) ? date.getDate() : ('0' + date.getDate().toString()),
				hour = (date.getHours() > 9) ? date.getHours() : ('0' + date.getHours().toString()),
				minute = (date.getMinutes() > 9) ? date.getMinutes() : ('0' + date.getMinutes().toString());
				// second = (date.getSeconds() > 9) ? date.getSeconds() : ('0' + date.getSeconds().toString());

			return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute);
		}
	});
}
