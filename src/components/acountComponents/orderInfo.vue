<template>
  <div id="order-info">
    <sub-header :headerMark="headerMark"></sub-header>
    <div class="appoit-info-box" ref="appoitInfoBox">
      <div>
        <div class="content">
          <!--1.0 显示停车场信息-->
          <div class="guide-show">
            <div class="qcarnumber" v-if="orderData.type === 2">
              <div class="imgstyle">
                <div class="img-car-text">
                  <span v-if="orderData.type === 2">
                    <span class="border-text">车位</span>
                    <span>编号</span>
                  </span>
                </div>
                <div class="car-ploate">
                  <div v-if="orderData.type === 2 && orderData.parklocNumber !== null">
                    {{orderData.parklocNumber}}
                  </div>
                </div>
              </div>
            </div>
            <div class="guide-info">
              <span class="name-text">
                <!-- 0:室内，1:室外，2:室内+室外 -->
                <span>{{orderData.parklotName}}</span>&nbsp;
                <span v-if="orderData.parklotKind == 0" class="parklotKind-style">室内</span>
                <span v-if="orderData.parklotKind == 1" class="parklotKind-style">室外</span>
                <span v-if="orderData.parklotKind == 2" class="parklotKind-style">室内+室外</span>
                <!--<span v-show="orderData.parklocNumber !== null">{{orderData.parklocNumber}}</span>-->
              </span>
              <!-- 这个订单有两种可能 如果是1300 那么就显示导航图标，其他显示价格 -->
              <span v-if="orderData.state == 1300" class="daohang-img" @click="guide"></span>
              <span class="price-text" v-else-if="orderData.state != 1300">
                <span>￥</span>&nbsp;{{orderData.totalFee}}
              </span>

            </div>
            <div class="address-info">{{orderData.address}}</div>
          </div>

          <!--订单状态 和 订单编号-->
          <div class="dingdan-info" style="margin-top:.625rem">
            <div class="gm-flex gm-height">
              <div class="name-text">订单状态</div>
              <div class="gm-ct">{{orderData.dstateInfo}}</div>
            </div>
            <div class="gm-flex gm-height">
              <div class="name-text">订单编号</div>
              <div class="gm-ta-info">{{orderData.serialNumber}}</div>
            </div>
          </div>
          <!-- 预约订单明细 -->

          <div class="item-list">预约订单明细</div>
          <div class="dingdan-info">
            <div class="gm-flex gm-height">
              <div class="name-text">预约时间</div>
              <div class="gm-ta-info">{{orderData.dHandler}}</div>
            </div>
            <div class="gm-flex gm-height" v-if="orderData.reserveFee !== null">
              <div class="name-text">预约费</div>
              <div class="gm-ta-info">￥ {{orderData.reserveFee}}</div>
            </div>
          </div>

          <!-- 预约支付明细 -->
          <template v-if="orderData.payChannelReserve">
            <div class="item-list">预约支付明细</div>
            <div class="dingdan-info">
              <div class="gm-flex gm-height" v-if="orderData.payChannelReserve !== null">
                <div class="name-text">支付方式</div>
                <div class="gm-ta-info">
                  <span v-if="orderData.payChannelReserve === 1">
                    支付宝：￥{{orderData.zpayReserve}}
                    <span v-if="orderData.reserveCouponCode !== null">优惠券：￥{{orderData.reserveCouponFee}}</span>
                  </span>
                  <span v-if="orderData.payChannelReserve === 2">
                    微信：￥{{orderData.zpayReserve}}
                    <span v-if="orderData.reserveCouponCode !== null">优惠券：￥{{orderData.reserveCouponFee}}</span>
                  </span>
                  <span v-if="orderData.payChannelReserve === 3">
                    现金：￥{{orderData.reserveFee}}
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
                </div>
              </div>
              <div class="gm-flex gm-height" v-if="orderData.reserveTradeNo !== null">
                <div class="name-text">支付流水号</div>
                <div class="gm-ta-info">{{orderData.reserveTradeNo}}</div>
              </div>

              <div class="gm-flex gm-height" v-if="orderData.reserveCouponCode !== null">
                <div class="name-text">优惠券编号</div>
                <div class="gm-ta-info">{{orderData.reserveCouponCode}}</div>
              </div>
            </div>
          </template>

          <!-- 停车订单明细 -->
          <template v-if="orderData.state === 1303 || orderData.state === 1304">
            <div class="item-list">停车订单明细</div>
            <div class="dingdan-info">
              <div class="gm-flex gm-height">
                <div class="name-text">入场时间</div>
                <div class="gm-ta-info">{{orderData.enterTime}}</div>
              </div>
              <div class="gm-flex gm-height">
                <div class="name-text">离场时间</div>
                <div class="gm-ta-info">{{orderData.leaveTime}}</div>
              </div>
              <div class="gm-flex gm-height" v-if="orderData.overTime !== null">
                <div class="name-text">超时时长</div>
                <div class="gm-ta-info">{{orderData.overTime}}</div>
              </div>
              <div class="gm-flex gm-height">
                <div class="name-text">停车费</div>
                <div class="gm-ta-info">￥ {{orderData.parkingFee}}</div>
              </div>
              <div class="gm-flex gm-height" v-if="orderData.overTime !== null">
                <div class="name-text">超时金额</div>
                <div class="gm-ta-info">￥ {{orderData.overTimeFee}}</div>
              </div>
            </div>
          </template>

          <!-- 停车支付明细 -->
          <template v-if="orderData.state === 1304">
            <div class="item-list">停车支付明细</div>
            <div class="dingdan-info">
              <div class="gm-flex gm-height">
                <div class="name-text">支付方式</div>
                <div class="gm-ta-info">
                  <span v-if="orderData.payChannelParking === 1">
                    支付宝：￥{{orderData.zpayParking}}
                    <span v-if="orderData.parkingCouponFee !== null">优惠券：￥{{orderData.parkingCouponFee}}</span>
                  </span>
                  <span v-if="orderData.payChannelParking === 2">
                    微信：￥{{orderData.zpayParking}}
                    <span v-if="orderData.parkingCouponFee !== null">优惠券：￥{{orderData.parkingCouponFee}}</span>
                  </span>
                  <span v-if="orderData.payChannelParking === 3">
                    现金：￥{{orderData.zpayParking}}
                  </span>
                  <span v-if="orderData.payChannelParking === 4">
                    优惠券：￥{{orderData.parkingCouponFee}}
                  </span>
                  <span v-if="orderData.payChannelParking === 5">
                    微信：￥{{orderData.zpayParking}}
                    <span v-if="orderData.parkingCouponFee !== null">优惠券：￥{{orderData.parkingCouponFee}}</span>
                  </span>
                  <span v-if="orderData.payChannelParking === 6">
                    微信：￥{{orderData.zpayParking}}
                    <span v-if="orderData.parkingCouponFee !== null">优惠券：￥{{orderData.parkingCouponFee}}</span>
                  </span>
                </div>
              </div>
              <div class="gm-flex gm-height" v-if="orderData.parkingTradeNo !== null">
                <div class="name-text">支付流水号</div>
                <div class="gm-ta-info">{{orderData.parkingTradeNo}}</div>
              </div>

              <div class="gm-flex gm-height" v-if="orderData.parkingCouponCode !== null">
                <div class="name-text">优惠券编号</div>
                <div class="gm-ta-info">{{orderData.parkingCouponCode}}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="cancel-order p-a t-c flex" v-if="orderData.state === 1300">
      <div class="cancel fl-o" @click="cancelApoint">取消预约</div>
      <div class="pay fl-o" @click="goPay">立即支付</div>
    </div>
    <div class="cancel-order p-a t-c flex" v-if="orderData.state === 1303">
      <div class="pay fl-o" @click="goPay">立即支付</div>
    </div>
  </div>
</template>
<script>
import { formatTimeStamp } from "../../common/js/H5plugin";
import subHeader from "../commonComponents/subHeader";
import { Toast, MessageBox } from "mint-ui";
import {
  canCelMyAppoint,
  queryMyactive,
  getOrderInfo
} from "../../server/getData";
import BScroll from "better-scroll";
import { asyncAMap } from "../../common/js/H5plugin";

export default {
  name: "orderInfo",
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
      payFees: "", //支付金额
      orderState: "", //订单状态
      showCancel: true, //是否显示底部取消/支付按钮
      payWays: ["余额支付", "支付宝支付", "微信支付"], //所有支付方式
      payType: 0, //支付类型
      actualFee: 0, //实际支付的金额
      disacountFees: 0, //优惠的金额
      // 新增数据
      orderData: {}, // 订单的数据信息
      state: null, // 订单状态
       //导航
      orgX: "", // 定位的坐标
      orgY: "", // 定位的坐标
      desX: "", // 车场的坐标
      desY: "", // 车场的坐标
    };
  },
  components: {
    subHeader
  },
  computed: {
    payWay() {
      return this.payWays[this.payType - 1];
    }
    // disacountFees(){
    //   return this.payFees - this.actualFee;
    // }
    // showCancel(){

    //   console.log(this.orderState === '未支付')
    //
    //   return (this.orderState === '未支付')?true:true;
    // }
  },
  methods: {
    // 添加页面滚动
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
    //查询激活异常订单并返回优惠券
    async queryActive() {
      let res = await queryMyactive(this.orderId);
      if (res.errmsg == "success") {
      } else {
      }
    },

    async getOrder() {
      let res = await getOrderInfo(this.orderId);
      console.log(res);
      if (res.error_code === 2000) {
        this.desX = res.data.lng;
        this.desY = res.data.lat;
        console.log(res.data);
         if(res.data.state == 1300){
          localStorage.setItem('H5_fees',res.data.reserveFee);   // 支付金额
          localStorage.setItem('H5_order_state',res.data.state); // 支付的订单状态
        }
        if(res.data.state == 1303){
          let money = (res.data.totalFee - res.data.reserveFee).toFixed(2);
          localStorage.setItem('H5_fees',money);   // 支付金额
          localStorage.setItem('H5_order_state',res.data.state); // 支付的订单状态
        }
        this.dispoceOrderDat(res.data);

        this._initScroll();
      } else {
        console.log(res, "错误码是" + res.error_code);
      }
    },
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
      if (!objDatas.payChannelReserve) {
        objDatas.payChannelReserve = false;
      }
      this.$set(objDatas, "zpayReserve", zpayReserve);
      console.log(zpayReserve)
      // 计算 停车支付费用
      let zpayParking = 0;
      if (objDatas.parkingCouponFee === null) {
        zpayParking = objDatas.parkingFee;
      } else {
        let payFee = null;
        payFee = (objDatas.totalFee - objDatas.reserveFee - objDatas.parkingCouponFee).toFixed(2);
        console.log('停车费支付',payFee)
        zpayParking = payFee <= 0 ? 0 : payFee;
      }
      this.$set(objDatas, "zpayParking", zpayParking);

      // 预约时间
      let dstartTime = formatTimeStamp(objDatas.startTime);
      let dendTime = formatTimeStamp(objDatas.endTime);
      console.log(dstartTime.substr(5, 12));
      objDatas.dHandler =
        dstartTime.substr(5, 11) + " - " + dendTime.substr(5, 11);
      //  停车订单的入场时间和离场时间
      if (objDatas.enterTime === null) {
        objDatas.enterTime = "-";
      } else {
        // 2018-12-23 12:20:10
        let enterTime = formatTimeStamp(objDatas.enterTime);
        objDatas.enterTime = enterTime.substr(5, 11);
      }
      //离场时间
      if (objDatas.leaveTime === null) {
        objDatas.leaveTime = "-";
      } else {
        let leaveTime = formatTimeStamp(objDatas.leaveTime);
        objDatas.leaveTime = leaveTime.substr(5, 11);
      }
      // 超时时间
      if (objDatas.overTime !== null) {
        let hours = parseInt(objDatas.overTime  / (60 * 60 * 1000));
        let minutes = parseInt((objDatas.overTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = parseInt((objDatas.overTime % (1000 * 60)) / 1000);
        objDatas.overTime = hours + ":" + minutes + ":" + seconds;
      }
      this.state = objDatas.state;
      // 订单状态
      if (objDatas.state === 1300) {
        objDatas.dstateInfo = "未支付";
      } else if (objDatas.state === 1301) {
        objDatas.dstateInfo = "已预约";
      } else if (objDatas.state === 1302) {
        objDatas.dstateInfo = "停车中";
      } else if (objDatas.state === 1303) {
        objDatas.dstateInfo = "离场未支付";
      } else if (objDatas.state === 1304) {
        objDatas.dstateInfo = "已完成";
      } else if (objDatas.state === 1309) {
        objDatas.dstateInfo = "已取消";
      } else if (
        objDatas.state === 1308 ||
        item.state === 1307 ||
        item.state === 1310
      ) {
        objDatas.dstateInfo = "超时已取消";
      }
      this.orderData = objDatas;
      console.log(this.orderData)
    },
    //取消预约
    async cancelAppoint() {
      // 弹框提示用户
      let res = await canCelMyAppoint(this.orderId);
      console.log(res);
      if (res.error_code === 2000) {
        this.$router.push("home");
      } else {
        Toast(res.error_message);
        let timeOutId = setTimeout(() => {
          clearTimeout(timeOutId);
          this.$router.push("home");
        }, 300);
        console.log(res, "错误码是" + res.error_code);
      }
    },
    // 取消预约按钮
    cancelApoint() {
      MessageBox.confirm("", {
        message: "是否取消预约？",
        title: "提示",
        confirmButtonText: "保留预约",
        cancelButtonText: "取消预约"
      })
        .then(action => {
          if (action == "confirm") {
            console.log("abc");
          }
        })
        .catch(err => {
          if (err == "cancel") {
            console.log("跳转到首页去");
            this.cancelAppoint();
          }
        });
    },
    goPay() {
      this.$router.push("/payMent");
    },
    //点击调出高德导航
    guide() {
      // console.log(this.orgX, this.orgY, this.desX, this.desX);
      // let drivingOption = {
      //   map: this.AMap,
      //   hideMarkers: true
      // };
      // let driving = new AMap.Driving(drivingOption); //构造驾车导航类
      // this.
      // //传入终点和起始点进行导航
      // driving.searchOnAMAP({
      //   origin: [this.orgX, this.orgY],
      //   destination: [this.desX, this.desY]
      // });
      sessionStorage.setItem('H5_goToAMap','1');
      this.parkGuide = this.$store.state.AMguide;
      this.parkGuide.searchOnAMAP({
        origin: [this.orgX, this.orgY],
        destination: [this.desX, this.desY]
      });
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
    }
  },
  created() {
  },
  activated() {
    // 获取订单信息
    this.orderId = JSON.parse(localStorage.getItem("H5_orderId"));
    this.getOrder();
    
    //从预约列表页面带获取传入的参数值
    //    this.orderId = JSON.parse(localStorage.getItem('H5_appoint_detail_orderId'));
    //    this.payFees =Number(localStorage.getItem('H5_appoint_detail_payFees'));
    //    this.actualFee = Number(localStorage.getItem('H5_appoint_detail_actualFee'));
    //    this.estateName = localStorage.getItem('H5_appoint_detail_estateName');
    //    this.payType = Number(localStorage.getItem('H5_appoint_detail_payType'));
    //    // console.log(this.estateName)
    //    this.startTime = JSON.parse(localStorage.getItem('H5_appoint_detail_startTime'));
    //    /*这个地方不需要显示车牌号*/
    //    /*this.plateNo = localStorage.getItem('H5_appoint_detail_plateNo');*/
    //    this.createTime = localStorage.getItem('H5_appoint_detail_createTime');
    //    this.endTime = localStorage.getItem('H5_appoint_detail_endTime');
    //    this.address =localStorage.getItem('H5_appoint_detail_address');
    //    this.orderState =localStorage.getItem('H5_appoint_detail_stateInfo');
    //    console.log(this.orderState)
    //    this.showCancel = (this.orderState === '未支付')?true:false;
    //    this.createFmTime = H5plugin.formatTimeStamp(Number(this.createTime));
    //    console.log(this.createFmTime)
    //    this.createFmTime = this.createFmTime.substr(0,16);
    //    this.disacountFees = this.payFees - this.actualFee;
    let org = JSON.parse(localStorage.getItem("H5_geoLocation"));
    this.orgX = org.lng;
    this.orgY = org.lat;
    if (this.orderState == "未支付") {
      this.queryActive();
    }
  },
  // 开始加载地图
  mounted() {
    // this.loadAMap();
  },
};
</script>
<style lang="stylus">
@import '../../common/css/base.stylus';
@import '../../common/css/mixin.stylus';

// #D01D95
#order-info {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background-color: #F4F4F4;

  .name-text {
    font-size: 0.9375rem;
    color: #000;
    font-weight: 600;
  }

  .gm-flex {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .gm-height {
    height: 3.5rem;
  }

  .gm-ct {
    font-size: 0.8125rem;
    color: #d01d95;
    font-weight: 600;
  }

  .gm-ta-info {
    font-size: 0.8125rem;
    color: #656565;
  }

  .content {
    z-index: 1;

    .guide-show {
      padding: 0.9375rem 1rem 1.125rem 0.875rem;
      background-color: #ffffff;
      border-top: 0.0625rem solid #E6E6E6;
      border-bottom: 0.0625rem solid #E6E6E6;
    }

    .qcarnumber {
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

    .guide-info {
      display: flex;
      justify-content: space-between;

      .parklotKind-style {
        padding: 0.05rem 0.25rem;
        background-color: #f7bc41;
        font-size: 0.6rem;
        color: #fff;
        text-align: center;
        line-height : .7rem;
        border-radius: 0.155rem;
      }

      .daohang-img {
        width: 1.125rem;
        height: 1.125rem;
        bg-img('../../assets/img/parking_go');
      }

      .price-text {
        font-size: 0.8125rem;
        color: #d01d95;
        font-weight: 600;
      }
    }

    .address-info {
      margin-top: 0.525rem;
      font-size: 0.8125rem;
      color: #656565;
    }

    .dingdan-info {
      padding: 0 1rem 0 0.875rem;
      background-color: #fff;
      width: 100%;
      border-top: 0.0625rem solid #E6E6E6;
      border-bottom: 0.0625rem solid #E6E6E6;
    }

    .order-condition {
      .order {
        color: #d01c95;
      }
    }

    .order-info {
      .order {
        color: rgb(26, 26, 26);
        font-weight: normal;
      }
    }

    .created-tm {
      .order {
        color: rgb(26, 26, 26);
        font-weight: normal;
      }
    }

    .pay-fees {
      .order {
        color: rgb(208, 107, 12);
      }
    }

    .item-list {
      padding: 1rem 0 0.4375rem 0.875rem;
      font-size: 0.8125rem;
      color: #656565;
    }

    .bg-w {
      background-color: #fff;
    }
  }

  .cancel-order {
    position: fixed;
    width: 100%;
    height: 3.375rem;
    line-height: 3.375rem;
    font-size: 1rem;
    bottom: 0;
    margin-bottom: 0;
    z-index: 1000;

    .cancel {
      background-color: #ffffff;
      color: #D01D95;
    }

    .pay {
      background-color: #D01D95;
      color: #fff;
    }
  }

  .appoit-info-box {
    position: absolute;
    width: 100%;
    top: 3.9375rem;
    bottom: 3.375rem;
    overflow: hidden;
  }
}
</style>


