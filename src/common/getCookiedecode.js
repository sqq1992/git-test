function getCookiedecode(key){
    let cookiearr = decodeURIComponent(document.cookie).split('; ');
    for (var i = 0; i < cookiearr.length; i++) {
        let needcookie = cookiearr[i].split('=');
        if (needcookie[0] == key) {
            return needcookie[1];
        };
    };
    return false;
}
export {getCookiedecode};