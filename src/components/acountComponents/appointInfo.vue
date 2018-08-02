<template>
  <div id="appoint-info">
    <sub-header :headerMark="headerMark"></sub-header>
    <div class="appoit-info-box" ref="appoitInfoBox">
      <div sytle="position: relative;">
        <!--1.0 停车场显示车牌 停车位显示车位编号 坐标和地址 不管是预约还是在停车都要显示-->
        <div class="content">
          <div class="guide-show" v-if="orderData.type === 2">
            <div class="imgstyle">
              <div class="img-car-text">
                <span v-if="orderData.type === 2">
                  <span class="border-text">车位</span>
                  <span>编号</span>
                </span>
                <!-- <span v-if="orderData.type === 1">
                  <span class="border-text">车牌</span><span>编号</span>
               </span> -->
              </div>
              <div class="car-ploate">
                <!-- <div v-if="orderData.type === 1">
                  {{orderData.plateNo}}
                </div> -->
                <div v-if="orderData.type === 2 && orderData.parklocNumber !== null">
                  {{orderData.parklocNumber}}
                </div>
              </div>
            </div>
          </div>

          <div class="plate">
            <div class="plate-info">
              <p>
                <span class="name-text">{{orderData.parklotName}}</span>
                <span class="yellow-s" v-if="orderData.parklotKind === 0">室内</span>
                <span class="yellow-s" v-else-if="orderData.parklotKind === 1">室外</span>
                <span class="yellow-s" v-else-if="orderData.parklotKind === 2">室内+室外</span>
              </p>
              <span v-if="orderData.state == 1301" class="daohang-img" @click="guide"></span>
              <span v-else-if="orderData.state != 1301" class="total-style">￥{{orderData.totalFee}}</span>
              <!-- <span class="daohang-img"></span> -->
            </div>
            <div class="plate-content">
              {{orderData.address}}
            </div>
          </div>
        </div>
        <!-- <div class="order-info">
          订单明细
        </div> -->
        <div class="plate-card">
          <template v-if="orderData.state === 1301">
            <div class="p-message">
              <div class="time-info">
                <span class="name-text">入场时间</span>
                <div class="time-add">
                  <div class="time-style">{{hour}}</div>
                  <div class="time-text">时</div>
                  <div class="time-style">{{minutes}}</div>
                  <div class="time-text">分</div>
                  <div class="time-style">{{seconds}}</div>
                </div>
              </div>
            </div>
          </template>

          <div class="p-message">
            <div class="time-info">
              <span class="name-text">订单状态</span>
              <span class="ta-info">{{orderData.dstateInfo}}</span>
            </div>
          </div>
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">订单编号</span>
              <span class="ta-info">{{orderData.serialNumber}}</span>
            </div>
          </div>
        </div>

        <div class="order-info">
          预约订单明细
        </div>
        <div class="plate-card">
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">预约时间</span>
              <span class="ta-info">{{orderData.dHandler}}</span>
            </div>
          </div>
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">预约费</span>
              <span class="ta-info">￥ {{orderData.reserveFee}}</span>
            </div>
          </div>

        </div>
        <div class="order-info" v-if="orderData.payChannelReserve != 0">
          预约支付明细
        </div>
        <div class="plate-card" v-if="orderData.payChannelReserve != 0">
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">支付方式</span>
              <span class="ta-info">
                <span v-if="orderData.payChannelReserve === 1">
                  支付宝：￥ {{orderData.zpayReserve}}
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{orderData.reserveCouponFee}}
                  </span>
                </span>
                <span v-else-if="orderData.payChannelReserve === 2">
                  微信：￥ {{orderData.zpayReserve}}
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{orderData.reserveCouponFee}}
                  </span>
                </span>
                <span v-else-if="orderData.payChannelReserve === 3">
                  现金：￥ {{orderData.reserveFee}}
                </span>
                <span v-else-if="orderData.payChannelReserve === 4">
                  优惠券：￥ {{orderData.reserveCouponFee}}
                </span>
                <span v-else-if="orderData.payChannelReserve === 5">
                  微信：￥ {{orderData.zpayReserve}}
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{orderData.reserveCouponFee}}
                  </span>
                </span>
                <span v-else-if="orderData.payChannelReserve === 6">
                  微信：￥ {{orderData.zpayReserve}}
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{orderData.reserveCouponFee}}
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div class="p-message" v-if="orderData.reserveTradeNo != null">
            <div class="time-info">
              <span class="name-text">支付流水号</span>
              <span class="ta-info">{{orderData.reserveTradeNo}}</span>
            </div>
          </div>
          <div class="p-message" v-if="orderData.reserveCouponCode !== null">
            <div class="time-info">
              <span class="name-text">优惠券编号</span>
              <span class="ta-info">{{orderData.reserveCouponCode}}</span>
            </div>
          </div>
        </div>

        <template v-if="orderData.state === 1302">
          <div class="order-info">
            停车订单明细
          </div>
          <div class="plate-card">
            <div class="p-message">
              <div class="time-info">
                <span class="name-text">入场时间</span>
                <span class="ta-info">{{orderData.enterTime}}</span>
              </div>
            </div>
            <div class="p-message">
              <div class="time-info">
                <span class="name-text">离场时间</span>
                <span class="ta-info">{{orderData.leaveTime}}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!--1.0 支付预约费 的时候显示约车位和约车场的数据（要有一个取消预约和控制车锁）-->
    <template v-if="orderData.state === 1301">
      <div v-if="orderData.lockId" class="cancel1301 cancel-fixed">
         <div class="cancel1301-lf t-c dis-div" @click="cancelOrder">取消预约</div>
         <div class="cancel1301-rg t-c dis-div" @click="lockModel">控制车锁</div> 
      </div>
      <div v-else class="cancel1301">
        <div class="cancel1301-all t-c" @click="cancelOrder">取消预约</div>
      </div>
    </template>
    <!-- 2.0 已经停车时候的UI显示界面  这个是停车位的数据 -->
    <div v-if="orderData.state === 1302" class="cancel1302 p-a t-c" >
      <div v-if="orderData.lockId" class=" cancel-fixed">
        <div class="cancel1302-lf t-c dis-div" @click="goToPay">离场支付</div>
        <div class="cancel1302-rg t-c dis-div" @click="lockModel">控制车锁</div>
      </div>
      <div v-else class="cancel1301">
        <div class="cancel1301-all t-c" @click="goToPay">离场支付</div>
      </div>
    </div>
    <!-- <div v-else-if="orderData.state === 1302 && orderData.lockId" class="cancel1302 p-a t-c" @click="lockModel">控制车锁</div> -->

    <div class="alert-index" v-show="islockshow" @click="closeModel">
      <div @click="closeCs" class="al-info">
        <div class="al-header">控制车锁</div>
        <div class="al-conter">
          <div class="lock-img">
            <img srcset="../../assets/img/mine_time_more_up@2x.png 2x, ../../assets/img/mine_time_more_up@3x.png 3x" style="display:none">
            <div class="lock-up lock-wh" @click="lockEvnet(1)"></div>
          </div>
          <div class="lock-img">
            <img srcset="../../assets/img/mine_time_more_down@2x.png 2x, ../../assets/img/mine_time_more_down@3x.png 3x" style="display:none">
            <div class="lock-down lock-wh" @click="lockEvnet(2)"></div>
          </div>
        </div>
        <div class="al-header" @click="closeModel">关闭</div>
      </div>
    </div>
    <div style="display:none" id="gdAMp"></div>
  </div>
</template>
<script>
import { formatTimeStamp } from "../../common/js/H5plugin";
import BScroll from "better-scroll";
import subHeader from "../commonComponents/subHeader";
import { Indicator, Toast } from "mint-ui";
import {  canCelMyAppoint,getOrderInfo,lockChange} from "../../server/getData";
import { MessageBox } from "mint-ui";
import { asyncAMap } from "../../common/js/H5plugin";
// import { clearInterval } from 'timers';
export default {
  name: "appointInfo",
  data() {
    return {
      headerMark: "预约详情",
      orderId: "", //根据后台返回的订单号
      estateName: "", //车场名
      startTime: "", //开始时间
      plateNo: "", //车牌号
      createTime: "", //预约订单创建时间
      createFmTime: "", //处理后的订单创建时间
      endTime: "", //最晚入场时间
      address: "", //停车场地址
      hour: "00", //倒计时小时
      minutes: "00", //倒计时分钟数
      seconds: "00", //倒计时秒数
      miliSeconds: "00", //倒计时毫秒数
      interval: "", //定时计时器
      //导航
      orgX: "", // 定位的坐标
      orgY: "", // 定位的坐标
      desX: "", // 车场的坐标
      desY: "", // 车场的坐标
      // 新增数据
      orderData: {},
      countdown: null, // 倒计时时间戳
      islockshow: false, // 模态框是否 显示
      seconds1302: "00", // 停车秒数
      minutes1302: "00", // 停车分数
      hours1302: "00", // 停车小时
      AMAP: null, // 高德地图的实例
      lockId: null, // 车锁ID
      payFlag: false, // 表示是否点击了支付按钮（）
      network:true,  // 这个表示网络是否连接的状态，默认是连接
    };
  },
  components: {
    subHeader
  },
  /*这里没有必要再做处理，直接在上一级页面做处理即可*/
  computed: {
    plateInfo() {
      let plateNo = this.plateNo;
      return plateNo.substr(0, 2) + " • " + plateNo.substr(2, plateNo.length);
    }
  },
  methods: {
    //添加页面滚动
    _initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.appoitInfoBox, {
            probeType: 3,
            scrollY: true,
            click: true
          });
          //滚动刷新事件
        } else {
          this.scroll.refresh();
        }
      });
    },
    // 获取预约订单详情的
    async getOrder() {
      let res = await getOrderInfo(this.orderId);
      console.log(res);
      if (res.error_code === 2000) {
        console.log(this.payFlag);
        if(this.payFlag){
          if(res.data.state == 1303){
            // 存储必要的值，然后做跳转
            let money = (res.data.totalFee - res.data.reserveFee).toFixed(2);
            localStorage.setItem('H5_fees',money);   // 支付金额
            localStorage.setItem('H5_order_state',res.data.state); // 支付的订单状态
            this.$router.push('/payMent');
          }else if(res.data.state == 1304){
            // 提示用户， 并跳转到首页
            Toast('已经完成支付了');
            this.$router.push('/home');
          }else{
            Toast('请先离场再支付。');
            this.payFlag = false;
          }
        }
        this.lockId = null;
        this.desX = res.data.lng;
        this.desY = res.data.lat;
        this.lockId = res.data.lockId;
        this.dispoceOrderDat(res.data);
        this.orderData = res.data;
      } else {
        console.log(res, "错误码是" + res.error_code);
      }
    },
    // 预处理 订单详情的数据
    dispoceOrderDat(objDatas) {
      // 计算预约支付的费用
      let zpayReserve = 0;
      if (objDatas.reserveCouponFee === null) {
        zpayReserve = objDatas.reserveFee;
      } else {
        let payFee = null;
        payFee = (objDatas.reserveFee - objDatas.reserveCouponFee).toFixed(2);
        zpayReserve = payFee <= 0 ? 0 : payFee;
      }
      this.$set(objDatas, "zpayReserve", zpayReserve);
      // 预约时间
      let dstartTime = formatTimeStamp(objDatas.startTime);
      let dendTime = formatTimeStamp(objDatas.endTime);
      objDatas.dHandler = dstartTime.substr(5, 11) + " - " + dendTime.substr(5, 11);

      // 实际 入场时间 和 离场时间
      if (objDatas.enterTime === null) {
        objDatas.enterTime = "——";
      } else {
        // 2018-10-04 12:20:30
        let enterTime = formatTimeStamp(objDatas.enterTime);
        objDatas.enterTime = enterTime.substr(5, 11);
      }
      if (objDatas.leaveTime === null) {
        objDatas.leaveTime = "——";
      } else {
        let leaveTime = formatTimeStamp(objDatas.leaveTime);
        objDatas.leaveTime = leaveTime.substr(0, 15);
      }
      // 预约超时时间计算
      if (objDatas.overTime !== null) {
        let hours = parseInt(
          (objDatas.overTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        let minutes = parseInt(
          (objDatas.overTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        let seconds = (objDatas.overTime % (1000 * 60)) / 1000;
        objDatas.overTime = hours + ":" + minutes + ":" + seconds;
      }
      // 订单状态(这个页面的订单状态只有这两种)
      if (objDatas.state === 1301) {
        objDatas.dstateInfo = "已预约";
      } else if (objDatas.state === 1302) {
        objDatas.dstateInfo = "停车中";
      } 
      // 如果是1302 状态 对停车时间进行累加操作
      if (objDatas.state === 1302) {
        // Test 测试数据 stopTime = 1200000 20分钟
        var stopTime = objDatas.stopTime;
        this.addTime(stopTime);
      }
      // 如果是1301 状态  对倒计时进行处理
      if(objDatas.state == 1301){
        this.countdown = objDatas.enterCountdownTime;
        this.downCounts();
      }
    },

    // 停车时间累加操作  这个是对数据的处理
    addTime(stopTime) {
      console.log(stopTime);
      let hours1302 = parseInt(stopTime / (60 * 60 * 1000));
      let minutes1302 = parseInt((stopTime % (1000 * 60 * 60)) / (1000 * 60));
      let seconds1302 = parseInt((stopTime % (1000 * 60)) / 1000);
      console.log(hours1302, minutes1302, seconds1302);
      clearInterval(timer1302);
      var timer1302 = setInterval(() => {
        seconds1302++;
        if (seconds1302 === 59) {
          seconds1302 = 0;
          minutes1302++;
        }
        if (minutes1302 === 59) {
          hours1302++;
          minutes1302 = 0;
        }
        seconds1302 += "";
        minutes1302 += "";
        hours1302 += "";
        if (seconds1302.length === 1) {
          seconds1302 = "0" + seconds1302;
        }
        if (minutes1302.length === 1) {
          minutes1302 = "0" + minutes1302;
        }
        if (hours1302.length === 1) {
          hours1302 = "0" + hours1302;
        }
        this.seconds1302 = seconds1302;
        this.minutes1302 = minutes1302;
        this.hours1302 = hours1302;
        if (
          this.seconds1302 == "00" &&
          this.minutes1302 == "00" &&
          this.hours1302 == "00"
        ) {
          clearInterval(timer1302);
        }
      }, 1000);
    },
    //控制车锁的事件
    lockModel() {
      // 弹框提示
      this.islockshow = true;
    },
    closeModel() {
      this.islockshow = false;
    },
    closeCs(event) {
      // 阻断事件冒泡
      event.cancelBubble = true;
    },
    lockEvnet(item) {
      if(!this.network || !window.navigator.onLine){
        Toast({
          message:'当前网络无连接',
          position: 'bottom',
          duration:2000
        });        
        return false;        
      }else {
        this.lockDown(item);
        if(item == 1){
          Toast({
            message:'车锁正在升起',
            position: 'bottom',
            duration:2000
          });
        }else if(item ==2){
          Toast({
            message:'车锁正在下降',
            position: 'bottom',
            duration:2000
          });
        }
      } 
    },
    // 对车锁进行处理
    async lockDown(item) {
      let res = await lockChange(this.lockId, item);
      console.log(res);
    },

    //点击调出高德导航
    guide() {
      sessionStorage.setItem('H5_goToAMap','1');
      this.parkGuide = this.$store.state.AMguide;
      this.parkGuide.searchOnAMAP({
        origin: [this.orgX, this.orgY],
        destination: [this.desX, this.desY]
      });
    },

    //入场时间倒计时
    downCounts() {
      let hour = 0;
      let minutes = 0;
      let seconds = 0;
      let miliSeconds = 0;
      console.log(this.countdown);
      hour = parseInt((this.countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = parseInt((this.countdown % (1000 * 60 * 60)) / (1000 * 60));
      seconds = parseInt((this.countdown % (1000 * 60)) / 1000);
      console.log(hour, minutes, seconds);
      if (hour <= 0 && minutes <= 0 && seconds <= 0) {
        return;
      }
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (seconds < 0) {
          minutes = 59;
          hour--;
        }
        if (hour < 0) {
          hour = 0;
        }
        if (hour == 0 && minutes == 0 && seconds == 0) {
          clearInterval(this.interval);
          if(this.$route.path == '/appointInfo'){
            this.$router.push("appointment");
          }
        }
        hour += "";
        minutes += "";
        seconds += "";
        if (minutes.length === 1) {
          minutes = "0" + minutes;
        }
        if (seconds.length === 1) {
          seconds = "0" + seconds;
        }
        if (hour.length === 1) {
          hour = "0" + hour;
        }
        this.hour = hour;
        this.minutes = minutes;
        this.seconds = seconds;
      }, 1000);
    },

    // 取消预约按钮
    cancelOrder() {
      // 这个时间 是动态的
      let freeCancellationTime = this.orderData.freeCancellationTime;
      let htmls =
        `
              <div class="ordermessage-info">
                <div class="is-text">
                  车位已经为您保留，` +
        freeCancellationTime +
        `分钟内可免费取消，超过` +
        freeCancellationTime +
        `分钟不退还预约费。是否确认取消预约
                </div>
              </div>`;
      MessageBox.confirm("", {
        title: "提示",
        message: htmls,
        confirmButtonText: "取消预约",
        cancelButtonText: "保留预约",
        closeOnClickModal: false
      })
        .then(action => {
          this.cancelAppoint();
        })
        .catch(err => {
          if (err == "cancel") {
          }
        });
    },

    //取消预约请求(成功的话，表示还没有入场；不成功的话，表示已经入场，那么跳转到预约列表，重新得到订单);
    async cancelAppoint() {
      let res = await canCelMyAppoint(this.orderId);
      if (res.error_code === 2000) {
        this.$router.push("home");
      } else {
        Toast("页面超时。。。。");
        this.$router.push("appointment");
      }
    },

    //加载地图SDK
    async loadAMap() {
      let res = await asyncAMap();
      if (res == "success") {
        this.initAMap();
      } else {
        Toast({
          message: "导航失败，请刷新重试",
          duration: 1500
        });
      }
    },

    //初始化地图
    initAMap() {
      //实例化AMap对象
      this.AMap = new AMap.Map("gdAMp", {
        resizeEnable: true,
        zoom: 16
      });
      this.planDrivingsRoute();
    },
    // 调起高德导航
    planDrivingsRoute() {
      let _self = this;
      this.AMap.plugin(["AMap.Driving"], function() {
        let DrivingOption = {
          map: _self.AMap,
          policy: AMap.DrivingPolicy.LEAST_DISTANCE, //路线规划策略
          // hideMarkers:true,  //起始点图标
          autoFitView: false //路线规划完毕后自动缩放地图视口
        };
        _self.MDrive = new AMap.Driving(DrivingOption); //构造驾车导航类
      });
    },
    // 离场支付（先请求数据，看状态是否发生改变；如果改变那么跳到立即支付页面，否则提示用户）
    goToPay(){
      // 加上一个状态（）
      this.payFlag = true;
      this.getOrder();
    },
    documentEvent(){
      if (document.visibilityState == "visible") {
        this.getOrder();
      }
    }
  },
  created() {
    let vm = this;
    window.addEventListener("online", function() {  
    vm.network = true;      
      return true;
    }, true);  
    window.addEventListener("offline", function() {  
      vm.network = false;
      Toast({
        message:'当前网络无连接',
        position: 'bottom',        
        duration:2000
      })
      Indicator.close();            
      return false;
    }, true); 
   
    this._initScroll();
    var lastTime = +new Date();
    
    let org = JSON.parse(localStorage.getItem("H5_geoLocation"));
    this.orgX = org.lng;
    this.orgY = org.lat;
  },
  activated() {
    let _self = this;
    document.addEventListener("visibilitychange", _self.documentEvent,false);
    this.orderId = JSON.parse(localStorage.getItem("H5_orderId"));
    this.getOrder();
  },
  // 开始加载地图
  mounted() {
  },
  beforeRouteLeave(to, from, next) {
    MessageBox.close(false);
    next();
  },
  watch: {
    $route(to, from) {
      MessageBox.close(false);
    }
  },
  deactivated(){
    this.payFlag = false;
    document.removeEventListener('visibilitychange',this.documentEvent,false);
  }
};
</script>
<style lang="stylus">
@import '../../common/css/base.stylus';
@import '../../common/css/mixin.stylus';
.toaselock{
  z-index: 3000;
}
.ordermessage-info {
  padding: 0 0.5rem;
}

.total-style {
  ont-size: 0.8125rem;
  color: #d01d95;
  font-weight: 600;
}

#appoint-info {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background-color: #F4F4F4;
  overflow: hidden;

  .name-text {
    font-size: 0.9375rem;
    color: #000;
    font-weight: 600;
  }

  .content {
    z-index: 1;

    .guide-show {
      padding: 0rem 1.625rem;
      background-color: #ffffff;
      box-sizing: border-box;
      border-bottom: 0.0625rem solid #E6E6E6;
      height: 7.5rem;

      .imgstyle {
        height: 100%;
        position: relative;
        bg-img('../../assets/img/mine_order_bg');
      }

      .img-car-text {
        position: absolute;
        top: 15%;
        left: 5%;
        color: #fff;
        font-size: 0.8125rem;
      }

      .border-text {
        padding-bottom: 0.375rem;
        border-bottom: 2px solid #fff;
      }

      .car-ploate {
        position: absolute;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2.375rem;
        color: #fff;
      }
    }

    .plate {
      padding: 0.9375rem 1rem 1.125rem 0.875rem;
      background-color: #fff;
      color: #1A1A1A;
      border-bottom: 0.0625rem solid #E6E6E6;

      .plate-info {
        display: flex;
        justify-content: space-between;
        font-size: 0.9375rem;
      }

      .yellow-s {
        font-size: 0.6rem;
        color: #fff;
        line-height: .7rem;
        padding-top: .05rem;
        padding-bottom:.05rem;
        padding-right: 0.2125rem;
        padding-left: 0.2125rem;
        background-color: #f7bd3d;
        border-radius: 10px;
      }

      .daohang-img {
        width: 1.125rem;
        height: 1.125rem;
        bg-img('../../assets/img/parking_go');
      }

      .plate-content {
        margin-top: 0.525rem;
        font-size: 0.8125rem;
        color: #656565;
      }
    }
  }

  .order-info {
    padding: 1rem 0 0.4375rem 0.875rem;
    font-size: 0.8125rem;
    color: #656565;
  }

  .plate-card {
    border-top: 2px solid #E6E6E6;
    background-color: #fff;
    padding-left: 0.875rem;
    color: #1A1A1A;
    margin-top: 0.625rem;

    .p-message {
      padding-right: 1rem;
      // border-bottom  0.0625rem solid #E6E6E6
    }

    .time-info {
      height: 3.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .time-add {
      display: flex;
    }

    .time-style {
      height: 1.75rem;
      width: 1.75rem;
      background-color: #3f3f3f;
      color: #FFF;
      text-align: center;
      line-height: 1.75rem;
      border-radius: 0.266667rem;
    }

    .time-text {
      font-size: 0.9375rem;
      line-height: 1.75rem;
      padding-right: 0.3125rem;
      padding-left: 0.3125rem;
    }

    .ta-info {
      font-size: 0.8125rem;
      color: #656565;
    }
  }

  // .cancel-order {
  //   position: fixed;
  //   width: 50%;
  //   height: 3.375rem;
  //   line-height: 3.375rem;
  //   // background-color: #D01D95;
  //   background-color: #FFF;
  //   font-size: 1rem;
  //   bottom: 0;
  //   margin-bottom: 0;
  //   z-index: 1000;
  //   color: #000;
  // }
 .cancel1301{
   position: fixed;
   bottom: 0;
   height: 3.375rem;
   line-height: 3.375rem;
   width:100%;
   font-size: 1rem;
 }
 .cancel-fixed{
   display:flex;
 }


 .dis-div{
   display:inline-block;
 }

 .cancel1301-lf{
   flex:1;
   background-color: #fff;
   color: #D01D95;
 }
 .cancel1301-rg{
   flex:1;
   background-color: #D01D95; 
   color: #fff;
 }

 .cancel1301-all{
   background-color: #D01D95; 
   bottom: 0;
   color: #fff;
   font-size: 1rem;
   text-align:center;
 }


 .cancel1302{
   position:fixed;
   width: 100%;
   height: 3.375rem;
   line-height: 3.375rem;
  //  background-color: #D01D95; 
   bottom: 0;
  //  color: #fff;
   font-size: 1rem;
 }
 .cancel1302-lf{
   flex:1;
   background-color: #fff;
   color: #D01D95;
 }
 .cancel1302-rg{
   flex:1;
   background-color: #D01D95; 
   color: #fff;
 }

 .cancel-color{
    position: fixed;
    width: 50%;
    height: 3.375rem;
    line-height: 3.375rem;
    background-color: #D01D95;
    // background-color: #FFF;
    font-size: 1rem;
    bottom: 0;
    margin-bottom: 0;
    z-index: 1000;
    color: #fff;
 }

  .appoit-info-box {
    position: absolute;
    width: 100%;
    top: 3.9375rem;
    bottom: 3.375rem;
    overflow: hidden;
  }




  .alert-index {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2005;
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .al-info {
    width: 18rem;
    z-index: 2006;
    background-color: #fff;
    border-radius: 0.633333rem;
  }

  .al-header {
    height: 2.5rem;
    text-align: center;
    line-height: 2.5rem;
  }

  .al-conter {
    height: 8.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 0.0625rem solid #E6E6E6;
    border-top: 0.0625rem solid #E6E6E6;
  }

  .lock-img {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lock-up {
    bg-img('../../assets/img/mine_time_more_up');
  }

  .lock-down {
    bg-img('../../assets/img/mine_time_more_down');
  }

  .lock-wh {
    width: 5.6875rem;
    height: 5.6875rem;
  }
}
</style>


