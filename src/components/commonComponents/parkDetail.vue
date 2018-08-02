<template>
  <div id="park-detail">
    <sub-header :headerMark="headerMark"></sub-header>
    <div class="content-box p-a" ref="parkDetailBox">
      <div>
        <div class="park-info">
          <div class="swiper-container" ref="parkDetailSwipper">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(item,key) in bannerList" :key="key">
                <img :src="item" alt="车场现场图">
              </div>
            </div>
            <div class="swiper-pagination p-a"></div>
          </div>
          <!-- 从新修改样式 -->
          <div class="park-info-show">
            <!-- 左边样式 -->
            <div class="left-content">
              <div class="car-infotext">
                <span class="car-name">{{parklotName}}</span>
                <!-- 0:室内，1:室外，2:室内+室外 -->
                <span v-if="parklotKind === 0" class="parklotKind-style">室内</span>
                <span v-if="parklotKind === 1" class="parklotKind-style">室外</span>
                <span v-if="parklotKind === 2" class="parklotKind-style">室内+室外</span>
              </div>

              <div class="left-local">
                <span class="local-text">{{parklotAddress}}</span>
              </div>

              <div class="parks-fees">
                <span class="parks">
                  <span class="info ">总车位数</span>
                  <span class="num">{{totalAmount}}</span>
                </span>
                <span class="link">∣</span>
                <span class="fees">
                  <span class="info">空泊位数</span>
                  <span class="num">{{reservableAmount}}</span>
                </span>
              </div>
            </div>
            <!-- 右边样式 -->
            <div class="right-local right-content">
              <div class="guide-ic" @click="goGuide"></div>
              <div class="locate-info">{{distance}}</div>
            </div>
          </div>

        </div>
        <div class="lot-info" v-show="(lotsLists[0]) && (lotsLists.length)">
          <div class="title">车位信息</div>
          <div class="content">
            <div class="top-head flex">
              <div class="left fl-o t-c item-style">车位编号</div>
              <div class="right fl-o t-c item-style">可约时段</div>
            </div>
            <div class="lots-items flex" v-for="(item,key) in lotsLists" :key="item.name">
              <div class="left fl-o t-c item-style">{{item.parklocNumber}}</div>
              <!-- <div class="right fl-o t-c item-style">{{item.shares[0].startTime + '－' + item.shares[0].endTime}}</div> -->
              <div class="right fl-o t-c item-style">
                <div class="tm-lists" v-for="(subItem,key) in item.shares" :key="subItem.name">
                  {{subItem.startTime + '－' + subItem.endTime}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="guideBox" style="display:none;"></div>
      </div>
    </div>
  </div>
</template>
<script>
// import Vue from 'vue'
import subHeader from "./subHeader";
import BScroll from "better-scroll";
import { asyncAMap } from "../../common/js/H5plugin";
// import {Toast,Indicator} from 'mint-ui';
import Swiper from "swiper";
import { getMyParkDetail } from "../../server/getData";
import { formatTimeStamp } from "../../common/js/H5plugin";
import baseURL from "../../server/baseURL";

export default {
  name: "parkDetail",
  data() {
    return {
      headerMark: "车场详情",
      parkItem: {}, //车场详情数据
      parklotName: "",
      parklotAddress: "",
      totalAmount: "",
      idleAmount: "",
      distance: "",
      parklotType: "",
      parklotKind: "", // 表示车场的类型
      reservableAmount: "", // 空泊位数
      parklotId: "", //停车场（位）id参数
      lotsLists: [], //共享停车位信息
      mySwiper: null, //轮播实例化对象
      parkDetailAMap: null, //暂用的地图实例化对象
      parkGuide: null, //驾车导航实例对象
      //测试数据
      bannerList: []
    };
  },
  components: {
    subHeader
  },
  computed: {},
  created() {},
  activated() {
    if(this.swiper){
      this.swiper.init();
    }
    this.parklotId = JSON.parse(localStorage.getItem("H5_park_lot_id"));
    this.getParkDetail();
  },
  mounted() {},
  methods: {
    //添加屏幕滚动事件
    _initScroll() {
      this.$nextTick(() => {
        //左边滑动选择
        if (!this.parkDetailScroll) {
          this.parkDetailScroll = new BScroll(this.$refs.parkDetailBox, {
            probeType: 3,
            scrollY: true,
            click: true
          });
        } else {
          this.parkDetailScroll.refresh();
        }
      });
    },

    //加载swiper的方法
    _initSwiper() {
      this.$nextTick(()=> {
        if(!this.swiper){
          let _self = this;
           _self.mySwiper = new Swiper(_self.$refs.parkDetailSwipper, {
        //自动轮播参数
        autoplay: 4000,
        autoplayDisableOnInteraction: false,
        //小圆点
        pagination: ".swiper-pagination",
        loop:true,
        initialSlide: 0,
        // observer:true,
        // observeParents:true,
        // swiper的各种回调函数也可以出现在这个对象中，参考swiper官方
        // observer: true, //修改swiper自己或子元素时，自动初始化swiper
        // observeParents: true, //修改swiper的父元素时，自动初始化swiper
        //动画效果
        effect: "slide",
        loop:true,
      });  
        }
      })
      // let _self = this;
     
    },
    
    // 获取停车场数据
    async getParkDetail() {
      let geoLocation = JSON.parse(localStorage.getItem("H5_geoLocation"));
      let res = await getMyParkDetail(
        this.parklotId,
        geoLocation.lng,
        geoLocation.lat
      );
      if (res.error_code == 2000) {
        this.parkItem = res.data;
        this.parklotName = res.data.parklotName;
        this.parklotAddress = res.data.parklotAddress;
        this.totalAmount = res.data.totalAmount;
        this.idleAmount = res.data.idleAmount;
        if(res.data.parklotType == 0){
          if(res.data.leftAmountType == 0){
            this.reservableAmount = "暂无信息";
          }else if(res.data.leftAmountType == 1){
            this.reservableAmount = res.data.leftAmount
          }
        }else if(res.data.parklotType == 1 || res.data.parklotType == 2){
           this.reservableAmount = res.data.reservableAmount;
        }
        this.distance = res.data.distance;
        this.parklotType = res.data.parklotType;
        this.parklotKind = res.data.parklotKind;

        this.desX = res.data.parklotLng;
        this.desY = res.data.parklotLat;
        // 对轮播数据的处理
        this.handleBannerList();
        this.handleLotsData();
        this._initScroll();
      }
    },
    // 轮播数据处理
    handleBannerList(res) {
      let imgFiles = this.parkItem.files;
      console.log(imgFiles);
      if (!imgFiles.length) {
        this.bannerList = [].concat([ require("../../assets/img/home_parking_bg@3x.png")]);
      } else {
        this.bannerList = [];
        // this.bannerList = this.bannerList.concat(imgFiles);
        for (let item of imgFiles) {
          let itemUrl = item.path;
          this.bannerList.push(itemUrl);
        }
        this._initSwiper();
      }
    },

    //停车位信息数据处理
    handleLotsData() {
      if (this.parkItem.parklocShareRepData) {
        this.lotsLists = [].concat(this.parkItem.parklocShareRepData);
      } else {
        this.lotsLists = [].concat([]);
      }
      if (this.lotsLists[0]) {
        for (let item of this.lotsLists) {
          let shares = item.shares;
          if (shares[0]) {
            for (let subItem of shares) {
              let startTime = subItem.startTime;
              let endTime = subItem.endTime;
              let startHour = null;
              let endHour = null;
              startTime = formatTimeStamp(startTime);
              endTime = formatTimeStamp(endTime);
              startHour = startTime.substr(8, 2) + "日";
              endHour = endTime.substr(8, 2) + "日";
              startTime = startHour + " " + startTime.substr(11, 5);
              endTime = endHour + " " + endTime.substr(11, 5);

              this.$set(subItem, "startTime", startTime);
              this.$set(subItem, "endTime", endTime);
            }
          }
        }
        console.log("处理后的时间列表");
        console.log(this.lotsLists);
      }
    },
    //所有车场均做导航功能
    goGuide() {
      sessionStorage.setItem('H5_goToAMap','1');
      let geoLocation = JSON.parse(localStorage.getItem("H5_geoLocation"));
      let orgX = geoLocation.lng;
      let orgY = geoLocation.lat;
      this.parkGuide = this.$store.state.AMguide;
      this.parkGuide.searchOnAMAP({
        origin: [orgX, orgY],
        destination: [this.desX, this.desY]
      });
    }
  },
};
</script>
<style lang="stylus">
@import '../../common/css/base.stylus';
@import '../../common/css/mixin.stylus';

#park-detail {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background-color: #F4F4F4;
  color: #333;

  .content-box {
    width: 100%;
    top: 3rem;
    bottom: 0;
    overflow: hidden;

    .park-info {
      background-color: #fff;

      .swiper-container {
        .swiper-slide {
          img {
            width: 100%;
            height: 15rem;
          }
        }
      }

      .swiper-pagination {
        bottom: 5%;
        left: 50%;
        transform: translateX(-50%);

        .swiper-pagination-bullet {
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 50%;
          margin: 0 0.2rem;
          background-color: rgba(0, 0, 0, 0.8);
        }

        .swiper-pagination-bullet-active {
          background-color: #d01c95;
        }
      }

      .park-info-show {
        padding: 0.875rem 0.9375rem;
        border-bottom: 0.0625rem solid #e6e6e6;
        background-color: #fff;
        display: flex;
        // 禁止换行
        flex-wrap: nowrap;
        justify-content: space-between;

        .left-content {
          width: 80%;

          /* 第一块区域 */
          .car-infotext {
            .parklotKind-style {
              padding: 0.125rem 0.25rem;
              background-color: #f7bc41;
              font-size: 0.625rem;
              color: #fff;
              text-align: center;
              border-radius: 0.155rem;
            }

            .car-name {
              font-size: 1.1rem;
              color: #111111;
              font-weight: 700;
            }
          }

          /* 第二块区域 */
          .left-local {
            margin-top: 0.5rem;
            margin-bottom: 0.2rem;
            // padding-left 1rem
            font-size: 0.875rem;

            .local-text {
              font-size: 0.875rem;
              color: #666666;
              one-wrap(100%);
            }
          }

          /* 第三块区域 */
          .parks-fees {
            font-size: 0.625rem;
            color: #666666;
            margin-top: 0.5rem;

            .num {
              color: #333;
            }

            .link {
              padding: 0 0.75rem;
            }
          }
        }

        .right-content {
          width: 15%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .guide-ic {
            height: 2.25rem;
            width: 2.25rem;
            bg-img('../../assets/img/icon_go');
          }
          .locate-info {
            margin-top: .5rem;
            font-size: 0.75rem;
            color: #333;
          }
        }
      }
    }

    .lot-info {
      margin-top: 0.5rem;
      padding: 0.875rem 0.9375rem;
      font-size: 1rem;
      background-color: #fff;

      .title {
        font-weight: bolder;
        margin-bottom: 1.2rem;
      }

      .content {
        .top-head {
          background-color: #fff3e3;
          margin-bottom: 0.2rem;
        }

        .lots-items {
          background-color: #f1f6f8;
          margin-bottom: 0.2rem;
        }
      }

      .item-style {
        font-size: 0.9rem;
        padding: 0.5rem 0;
      }
    }
  }
}
</style>
