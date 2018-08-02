export default {
    //本地缓存与清除
    setStorage(name, item) {
        localStorage.setItem(name, JSON.stringify(item));
        setTimeout(() => {
            localStorage.removeItem(name);
        }, 604800000);
    },
    getStorage(name) {
        return JSON.parse(localStorage.getItem(name));
    },
    removeStorage(name) {
        localStorage.removeItem(name);
    },
    getObjectUrl(file) {
        let url=null;
        if(window.createObjectURL!=undefined){
            url=window.createObjectURL(file);
        }else if(window.URL!=undefined){
            url=window.URL.createObjectURL(file);
        }else if(window.webKitURL!=undefined){
            url=window.webkitURL.createObjectURL(file);
        }
        return url;
    },
}