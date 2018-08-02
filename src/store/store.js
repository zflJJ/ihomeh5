export default {
    state: {
        currentLocation: {}, //获取的当前位置
        parkItems: [], //停车位数据
        phone: '', //登录的电话号码
        isphone: null,
        exclude: [], //需要清除缓存的组件
        appId: 'wxe44228e45ce071dc', //微信公众服务号appID|测试
        // appId:'wx42a91e33c4b3a97b',   //微信公众服务号appID|正式
        map: null, //高德地图
        //当前系列
        orderId: '', //当前订单号
        estateName: '', //当前小区名
        startTime: '', //停车开始时间
        plateNo: '', // 车牌号
        createTime: '', //订单|预约创建时间
        createFmTime: '', //格式化后的订单|预约创建时间
        endTime: '', // 最晚入场时间
        address: '', //当前地址
        orgX: '', //出发点的经度
        orgY: '', //出发点的维度
        desX: '', //目的地的经度
        desY: '', //目的地的维度
        lngcenter: '', // 定位坐标经度
        latcenter: '', // 定位坐标纬度
        AMap: null,  // 地图
        AMguide: null, // 驾车路径规划
    }
}
