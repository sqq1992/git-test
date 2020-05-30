import store from 'src/store.js';
/**
* [对象数据继承、覆盖]
* @param  {[object]} target [需要被继承的对象]
* @param  {[object]} obj    [需要继承的对象]
* @return {[object]}        [继承后的对象]
*/
export const extend = (target, obj) => {
    let a = target;
    if( Object.prototype.toString.call(obj) == "[object Object]" || Object.prototype.toString.call(obj) == "[object Array]" ){
        for( let key in obj ){
            a[key] = extend(a[key], obj[key]);
        }
    } else {
        a = obj;
    }
    return a;
};


/**
* [克隆对象]
* @param  {[object || array]} obj [需要被克隆的对象]
* @return {[object || array]}     [克隆后的对象]
*/
export const clone = (obj) => {
    let result = obj;
    if( Object.prototype.toString.call(obj) == "[object Array]" ){
        result = [];
        for( let i = 0, l = obj.length; i < l; i++ ){
            result[i] = clone(obj[i]);
        }
    }
    if( Object.prototype.toString.call(obj) == "[object Object]" ){
        result = {};
        for( let key in obj ){
            result[key] = clone(obj[key]);
        }
    }
    return result;
}

export const deepClone = (parent) => {
    let parents = [];
    let children = [];


    const _type = function (v) {
        if(!v || typeof v !== 'object'){
            return 0;
        }
        if(Object.prototype.toString.call(v) === '[object Object]'){
            return 1;
        }
        if(Object.prototype.toString.call(v) === '[object Array]') {
            return 2;
        }
        if(Object.prototype.toString.call(v) === '[object Date]'){
            return 3;
        }
        if(Object.prototype.toString.call(v) === '[object Promise]'){
            return 4;
        }
        if(Object.prototype.toString.call(v) === '[object RegExp]') {
            return 5;
        }
        if(Object.prototype.toString.call(v) === '[object Map]'
            || Object.prototype.toString.call(v) === '[object Set]') {
            return 6;
        }
        if(typeof v === 'function'){
            return 7;
        }
    };
    const _clone = function (parent) {
        let type = _type(parent);


        let child;
        let proto;


        switch (type) {
            case 0:
                return parent;
            case 1:
                child = new parent.__proto__.constructor();//隐式原型链
                break;
            case 2:
                child = [];
                break;
            case 3:
                child = new Date(parent.getTime());
                break;
            case 4:
                child = parent;
                break;
            case 5:
                child = RegExp(parent.source, parent.multiline? 'm' : parent.ignoreCase ? 'i' : parent.global ? 'g' : '');
                break;
            case 6:
                child = new Set(parent);
                break;
            case 7:
                child = eval(parent,toString());// 
                break;
            default:// 处理循环引用 
                // 获得对象parent的prototype
                proto = Object.getPrototypeOf(parent);
                // 利用Object.create切断原型链
                // 创建一个新对象，新创建的对象的__proto__用proto的。
                child = Object.create(proto);
        }

        const index = parents.indexOf(parent)
        if(index !== -1){// 存在
            return children[index];
        }
                // 不存在, push进数组
        parents.push(parent);
        children.push(child);


        for(let i in parent){//遍历对象所有属性
            child[i] = _clone(parent[i]);//根据属性性质，一一对应拷贝
        }
        return child;
    }
    return _clone(parent);
}
//
export const downloadImage = (src, name) => {
    let a = document.createElement('a');
    let event = new MouseEvent('click');

    a.download = name || '下载图片名称';
    a.setAttribute('target', '_blank');
    a.href = src;
    a.dispatchEvent(event);
}

const whiteList = ['快麦旗舰店', '测试店铺']
export const isWhiteList = () => {
    return whiteList.indexOf(store.state.user.shopName) != -1;
}
