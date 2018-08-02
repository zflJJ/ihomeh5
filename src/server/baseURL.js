//下载APP地址  研发测试
 const downURL = 'http://119.23.25.170:8088/api/version/download?type=1';
//下载APP地址  运营测试
// const downURL = 'http://120.79.56.209:8081/api/version/download?type=1';
// 下载APP地址 运营正式
// const downURL = 'http://120.79.49.196:8082/api/version/download?type=1';

//支付成功后回跳的域名
//研发测试服务器
const URL = 'http://develop.qhiehome.com:8080/ihomeh5/#/appointInfo';
// 生产
 //const URL = 'http://develop.qhiehome.com:8080/ihomeh5/#/appointment';

//数据请求地址
//1. 0研发测试地址
// const requestUrl = 'http://develop.qhiehome.com/';
// 2.0 生产地址
const requestUrl = 'https://www.qhiehome.com/';

// 服务协议地址（研发，生产都是这个地址）
const serverUrl = "http://www.qhiehome.com/protocol/service_protocol.html";




//高德地图异步加载URL
const asyncAMapUrl = 'http://webapi.amap.com/maps?v=1.4.3&key=3910a844be295cd0a8cb336180521f9d&plugin=AMap.Geolocation,AMap.Driving&callback=init';

export default {
    downURL,
    URL,
    requestUrl,
    asyncAMapUrl,
    serverUrl,
}