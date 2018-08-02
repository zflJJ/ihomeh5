// // import Vm from 'vue'
// import baseUrl from '../../server/baseURL.js'

// //时间戳转化成YYYY-MM-DD HH:mm:ss模式
// export const formatTimeStamp = function(timeStamp) {
//     // "2018-02-02 09:16:21:00"
//     let newTime = '';
//     let date = new Date(timeStamp);
//     let year = date.getFullYear() + '';
//     let month = date.getMonth() + 1 + '';
//     let d = date.getDate() + '';
//     let hours = date.getHours() + '';
//     let minutes = date.getMinutes() + '';
//     let seconds = date.getSeconds() + '';
//     let milliSeconds = date.getMilliseconds() + '';
//     month = ('00' + month).substr(month.length);
//     d = ('00' + d).substr(d.length);
//     hours = ('00' + hours).substr(hours.length);
//     seconds = ('00' + seconds).substr(seconds.length);
//     minutes = ('00' + minutes).substr(minutes.length);
//     milliSeconds = ('00' + milliSeconds).substr(milliSeconds.length);
//     newTime = year + '-' + month + '-' + d + ' ' + hours + ':' + minutes + ':' + seconds + ':' + milliSeconds;
//     return newTime;
// };

// //异步加载高德地图
// export const asyncAMap = function(callback) {
//     let url = baseUrl.asyncAMapUrl;
//     return createScript(url);
//     createScript(url, callback);
//     function createScript(url, callback) {
//         let scriptElement = document.createElement('script')
//         document.body.appendChild(scriptElement)
//         let promise = new Promise((resolve, reject) => {
//             scriptElement.addEventListener('load', e => {
//                 // removeScript(scriptElement)
//                 if (!callback) {
//                     // console.log(new AMap.map());
//                     resolve('success');
//                 }
//             }, false)
//             scriptElement.addEventListener('error', e => {
//                 removeScript(scriptElement)
//                 reject('error')
//             }, false)
//             if (callback) {
//                 window.____callback____ = function() {
//                     window.____callback____ = null
//                 }
//             }
//         })
//         if (callback) {
//             url += ('&callback =' + callback);
//         }
//         scriptElement.src = url;
//         return promise;
//     }
//     //移除script标签
//     function removeScript(scriptElement) {
//         document.body.removeChild(scriptElement)
//     }
// }

// import Vm from 'vue'
import baseUrl from '../../server/baseURL.js'

//时间戳转化成YYYY-MM-DD HH:mm:ss模式
export const formatTimeStamp = function (timeStamp) {
    // "2018-02-02 09:16:21:00"
    let newTime = '';
    let date = new Date(timeStamp);
    let year = date.getFullYear() + '';
    let month = date.getMonth() + 1 + '';
    let d = date.getDate() + '';
    let hours = date.getHours() + '';
    let minutes = date.getMinutes() + '';
    let seconds = date.getSeconds() + '';
    let milliSeconds = date.getMilliseconds() + '';
    month = ('00' + month).substr(month.length);
    d = ('00' + d).substr(d.length);
    hours = ('00' + hours).substr(hours.length);
    seconds = ('00' + seconds).substr(seconds.length);
    minutes = ('00' + minutes).substr(minutes.length);
    milliSeconds = ('00' + milliSeconds).substr(milliSeconds.length);
    newTime = year + '-' + month + '-' + d + ' ' + hours + ':' + minutes + ':' + seconds + ':' + milliSeconds;
    return newTime;
};

//异步加载高德地图
export const asyncAMap = function (callback) {
    let url = baseUrl.asyncAMapUrl;
    return createScript(url);
    createScript(url, callback);
    function createScript(url, callback) {
        let scriptElement = document.createElement('script')
        document.body.appendChild(scriptElement)
        let promise = new Promise((resolve, reject) => {
            //保证资源加载完成之后才进行代码的执行
            scriptElement.addEventListener('load', e => {
                // removeScript(scriptElement)
                if (!callback) {
                    // console.log(new AMap.map());
                    resolve('success');
                }
            }, false)
            scriptElement.addEventListener('error', e => {
                removeScript(scriptElement)
                reject('error')
            }, false)
            if (callback) {
                window.____callback____ = function () {
                    window.____callback____ = null
                }
            }
        })
        if (callback) {
            url += ('&callback =' + callback);
        }
        scriptElement.src = url;
        return promise;
    }
    //移除script标签
    function removeScript(scriptElement) {
        document.body.removeChild(scriptElement)
    }
}
