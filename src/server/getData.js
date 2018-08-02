import axios from 'axios'
// import { getAxios } from './fetch.js';
import { getAxios } from './axios.js';
import baseUrl from './baseURL';
import common from '../common/js/common'

const URL = baseUrl.requestUrl;

//获取附近停车位 apiread/parklot/nearby
export const getParks = (map, locate) => {
    let data = getAxios('post',
        URL + 'apiread/parklot/nearby', {
            map: map,
            locate: locate,
            radius: 500,
            timestamp: String(new Date().getTime()),
        }
    )
};

//获取车场详情
export const getMyParkDetail = (parklotId, lng, lat) => {
    let data = getAxios('post',
        URL + 'apiread/parklot/detail', {
            parklot_id: parklotId,
            lat: lat,
            lng: lng,
            timestamp: String(new Date().getTime()),
        }
    );
    return data;
};

//获取个人常用车场信息
export const getMyUsualParks = (userId) => {
    let data = getAxios('post',
        URL + 'apiread/parklot/usual/get', {
            user_id: userId,
            timestamp: String(new Date().getTime()),
        }
    );
    return data;
};

//设置个人常用停车场
export const setMyUsualParks = (userId, parklotId) => {
    // alert(JSON.stringify(userId));
    // alert(JSON.stringify(parklotId));
    let data = getAxios('post',
        URL + 'apiwrite/parklot/usual/set', {
            user_id: userId,
            parklot_id: parklotId,
            timestamp: String(new Date().getTime()),
        }
    );
    // alerrt(JSON.stringify(data));
    return data;
};

export const getMySearchLists = (x, y, keywords) => {
    let data = getAxios('post',
        URL + 'apiread/parklot/query', {
            x: x,
            y: y,
            keywords: keywords,
            page_size: 0,
            timestamp: String(new Date().getTime()),
        }
    );
    return data;
};

// 获取预约停车场 的数据 apiread/parklot/reserve/enter
export const postParklot = (userId, pointedId) => {
    let data = getAxios('post',
        URL + 'apiread/parklot/reserve/enter', {
            user_id: userId,
            parklot_id: pointedId,
            timestamp: new Date().getTime(),
            // timestamp:1526349900000
        }
    );
    return data;
}

//获取个人中心信息
export const getMyPersonnalInfo = (userId) => {
    let data = getAxios('post',
        URL + 'apiread/user/info/get', {
            user_id: userId,
            timestamp: String(+new Date())
        }
    );
    return data;
};

//获取个人消息信息
export const getMyNews = (userId, newsType, pageNum) => {
    let data = getAxios('post',
        URL + 'apiread/message/list', {
            user_id: userId,
            type: newsType,
            page_num: pageNum,
            timestamp: String(+new Date())
        }
    );
    return data;
};

//获取个人消息预览
export const getMyPreNews = (userId) => {
    let data = getAxios('post',
        URL + 'apiread/order/using', {
            user_id: userId,
            timestamp: String(+new Date())
        }
    );
    return data;
};

//上传图片
export const uploadMyImg = (dataURI, userId) => {
    let formData = new FormData();
    formData.append("file", dataURI);
    let datas = formData.getAll('file');
    console.log(datas)
    let data = uploadFile('post',
        URL + 'apiwrite/user/avatar/upload', {
            file: formData,
            user_id: Number(userId),
            timestamp: String(+new Date())
        }
    );
    return data;
};

//获取优惠券列表
export const getMyCounpLists = (userId, pageNum) => {
    let data = getAxios('post',
        URL + 'apiread/coupon/get', {
            user_id: userId,
            page_num: pageNum,
            timestamp: String(+new Date())
        }
    );
    return data;
};

//获取车牌号 apiread/plate/get
export const getMyCars = (userId, pageNum) => {
    let data = getAxios('post',
        URL + 'apiread/plate/get', {
            user_id: userId,
            page_num: pageNum,
            timestamp: new Date().getTime(),
        }
    );
    return data;
};
//获取预约列表
export const getMyAppointments = (userId, pageNum) => {
    let data = getAxios('post',
        URL + 'apiread/order/reserve/list', {
            user_id: userId,
            page_num: pageNum,
            timestamp: String(+new Date())
        }
    );
    return data;
};
//取消预约 apiwrite/reserve/cancel
export const canCelMyAppoint = (orderId) => {
    let data = getAxios('post',
        URL + 'apiwrite/reserve/cancel', {
            order_id: orderId,
            timestamp: new Date().getTime(),
        }
    );
    return data;
};
//查询异常订单并且激活优惠券
export const queryMyactive = (orderId) => {
    let data = getAxios('post',
        URL + 'query/active', {
            orderId: orderId
        }
    );
    return data;
};
//添加车牌号 apiwrite/plate/add
export const addMyCars = (userId, plateNum) => {
    let data = getAxios('post',
        URL + 'apiwrite/plate/add', {
            user_id: userId,
            plate_num: plateNum,
            timestamp: new Date().getTime(),
        }
    );
    return data;
};
//删除车牌号 apiwrite/plate/del
export const removeMyCars = (userId, plateNo) => {
    let data = getAxios('post',
        URL + 'apiwrite/plate/del', {
            user_id: userId,
            plate_id: plateNo,
            timestamp: new Date().getTime(),
        }
    );
    return data;
};
//用户注册
export const signInPhone = (phone) => {
    let data = getAxios('post',
        URL + 'signin', {
            phone: phone
        }
    );
    return data;
};
//预约车位 apiwrite/reserve/confirm
export const appointCarport = (params) => {
    params.timestamp = new Date().getTime();
    // console.log(params);
    let data = getAxios('post',
        URL + 'apiwrite/reserve/confirm', params
    );
    return data;
};

// let res = await pay(this.orderId,1,this.couponId,5,baseURL.URL,spbillCreateIp);
// pay(url, orderId, 1, couponId, 5, baseURL, spbillCreateIp);
export const pay = (url, orderId, channel, couponId, wapUrl, spbillCreateIp) => {
    let data = getAxios('post',
        URL + url, {
            order_id: orderId, // 订单ID
            channel: channel, // 支付方式
            coupon_id: couponId, // 优惠券ID
            type: 5, // H5 传5
            wapUrl: wapUrl, //支付回调
            spbillCreateIp: spbillCreateIp, // 微信回调地址
            timestamp: new Date().getTime(),
        }
    );
    return data;
};
//获取预约详情
export const getMyAppointInfo = (phone) => {
    let data = getAxios('post',
        URL + 'usingorder', {
            phone: phone
        }
    );
    return data;
};
//向用户端推送手机短信验证码
export const sendCodes = async(phone, code) => {
    // let url = 'http://v.juhe.cn/sms/send?mobile=13600412745&tpl_id=41356&tpl_value=%23code%23%3D654654&key=c718da9eb368b06d145a81f5661e093d';
    let url = 'http://v.juhe.cn/sms/send?tpl_id=41356&key=c718da9eb368b06d145a81f5661e093d' +
        '&mobile=' + phone +
        '&tpl_value=%23code%23%3D' + code;
    let opts = {
        method: "GET",
        mode: 'no-cors'
    }
    let res = await fetch(url, opts);
    let result = await res.text();
};
//18770055726

//获取下载链接
export const getAndroid = (type) => {

};

//登陆界面的接口
export const signInUsers = (params) => {
    // let ip = common.getStorage('mobileId');
    // let openId = common.getStorage('openId');
    // let unionId = common.getStorage('unionId');
    // alert(JSON.stringify(openId));
    // alert(JSON.stringify(ip));
    // alert(JSON.stringify(unionId));
    // alert(JSON.stringify(URL));
    let data = getAxios('post',
        URL + 'apiwrite/user/login', params
    );
    return data;
};

// 获取验证码
export const getPhoneCode = (phone, anti) => {
    let data = getAxios('post',
        URL + 'apiwrite/system/verification/code/get', {
            phone: phone,
            anti: anti,
            timestamp: new Date().getTime(),
        }
    );
    return data;
};

// 获取订单数据 apiread/order/reserve/detail/query
export const getOrderInfo = (orderId) => {
    let data = getAxios('post',
        URL + 'apiread/order/reserve/detail/query', {
            order_id: orderId,
            timestamp: new Date().getTime(),
        }
    );
    return data;
};

// 网络控制车锁 lockChange
export const lockChange = (lockId, item) => {
    let data = getAxios('post',
        URL + 'lock/control', {
            lock_id: lockId,
            command: item,
            timestamp: new Date().getTime(),
        }
    );
    return data;
};

// 兑换优惠券 apiwrite/coupon/exchange
export const getCounpNumber = (userId, counpCode) => {
    let data = getAxios('post',
        URL + 'apiwrite/coupon/exchange', {
            user_id: userId,
            coupon_code: counpCode,
            timestamp: new Date().getTime(),
        }
    );
    return data;
};

// 兑换优惠券 apiwrite/coupon/bindOrderParking
export const bindCounp = (type, orderId) => {
    let data = getAxios('post',
        URL + 'apiwrite/coupon/bindOrderParking', {
            coupon_id: type,
            order_parking_id: orderId,
            timestamp: new Date().getTime(),
        }
    );
    return data;
};

// 意见反馈接口 apiread/problem/all
export const getProblems = (type, orderId) => {
    let data = getAxios('post',
        URL + 'apiread/problem/all',{
            timestamp: new Date().getTime(),
        }
    );
    return data;
};

// 提交意见反馈接口
export const subProblems = (params) => {
    // debugger
    console.log(params.userId);
    let data = getAxios('post',
        URL + 'apiwrite/feedback/add', {
            // user_id	是	int	用户id
            // parklot_id	否	int	车场Id
            // remark	否	string	反馈信息
            // problem_ids	是	int[]	问题Id列表
            // file	否	List	反馈文件列表
            // timestamp	是	String	时间戳
            user_id:30,
            // parklot_id: 0,
            remark:params.remark,
            problem_ids:[5,7],
            // file:params.file,
            timestamp: new Date().getTime(),
        }
    );
    return data;
};


//活动中心（列表的数据）  apiread/activity/list
export const getActives = (params) => {
    let data = getAxios('post',
        URL + 'apiread/activity/list',params
    );
    return data;
};