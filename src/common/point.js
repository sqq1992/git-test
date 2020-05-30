import {getCookiedecode} from "./getCookiedecode.js"
import store from 'src/store.js';
function stringify(json) {
    var str = "";
    for (var i in json) {
        str += i + "=" + json[i] + "&";
    }
    return str.slice(0, -1);
}
function point(point) {
  const user = store.state.user;
	let ajaxparams = {
        app_type: 'url_tj',
        log_type: 'click',
        point,
        _fm: '',
        taobaoId: user.venderId,
        taobaoNick: user.shopName
    };
    let param = stringify(ajaxparams);
    let img = document.createElement("img");
    img.src = "http://ftj.superboss.cc/tj.jpg?" + param;
    img.id = "addIMg";
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(img);
    setTimeout(() => {
        let addIMg = document.getElementById("addIMg");
        body.removeChild(addIMg);
    },1000)
}
export {point};
