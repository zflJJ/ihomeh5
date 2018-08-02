<template>
  <div id="point-detail" ref="pointDetails">
    <div class="swiper-container" ref="detailSwiper">
      <div class="swiper-wrapper">
        <template v-if="displayParks.length != 0">
          <div class="swiper-slide" v-for="(item,index) in displayParks" :key="index">
          <div class="item-box">
            <div class="list-items">
              <div class="item-info p-r">
                <div class="hide-show-btn p-a t-c" style="width:5.5rem;left:50%;transform:translate(-50%,0)">
                  <div class="ic">0</div>
                </div>
                <div class="carinfo">
                  <!-- <div class="car-infotext clearfix" @click="goParkDetail(item)"> -->
                  <div class="car-infotext clearfix">
                    <span class="car-name">{{item.name}}</span>
                    <span class="car-text" :class="{'yard-bg':item.type == 2}" v-show="!(item.type == 0)">{{(item.type == 1)?'约车场':'约车位'}}</span>
                    <span class="car-distance f-r">{{item.distance}}</span>
                  </div>
                  <div class="left-local p-r">
                    <span class="local-img p-a"></span>
                    <span class="local-text">{{item.address}}</span>
                  </div>
                </div>
                <div class="rightinfo p-a">
                  <div class="right-number t-c">
                    <span>{{(item.type == 0)?'':'￥'}}</span>
                    {{(item.type == 0)?((item.show == 1)?(item.left_amount):item.total_amount):item.parking_fee}}
                  </div>
                  <div class="right-text t-c">{{(item.type == 0)?((item.show == 1)?('空泊位'):'总车位'):' 首小时'}}</div>
                </div>
              </div>
              <div class="bord-tips flex t-c">
                <!-- <div class="map fl-o t-c p-r" @click="guide(item)"><span class="map-ic p-a" :class="{'ic-point':item.type == 0}"></span>到这里去</div> -->
                <div class="map fl-o t-c p-r">
                  <span class="map-ic p-a" :class="{'ic-point':item.type == 0}"></span>到这里去</div>
                <!-- <div class="bord fl-o t-c" v-show="item.type !== 0" @click="apoint(item)">立即预约</div> -->
                <div class="bord fl-o t-c" v-show="item.type !== 0">立即预约</div>
              </div>
            </div>
          </div>
        </div>
        </template>
        <template v-if="displayParks.length == 0 && isDisplayparks == true">
          <div class="swiper-slide">
          <div class="item-box">
            <div class="list-items">
              <div class="p-r">
                <div class="hide-show-btn p-a t-c">
                  <div class="ic">0</div>
                </div>
                <div class="swiper-null">
                  附近暂无停车场信息
                </div>
              </div>
            </div>
          </div>
        </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  import Swiper from "swiper";
  import {Indicator, Toast,Button} from "mint-ui";
  import {setTimeout} from "timers";
  import { debug} from "util";
  export default {
    name: "pointDetail",
    data() {
      return {
        currentPageIndex: 0, //当前的滑动索引
        windowWidth: 0, //可视觉区宽度
        elWidth: 0, //单个item宽度
        displayParks: [], //传输过来的车场|车位列表
        canSwipe: true, //是否允许滑动
        currentSwiperIndex: 0, //当前滑到的索引
        getDataLen: null, // 表示传递过来数据的长度
        //左右滑动轮播配置
        mySwiper: null,
        sendLngLatFlag: false,
        isDisplayparks: false,
      };
    },
    props: ["locationToIndex", "AMguide"],
    components: {
      // swiper,
      // swiperSlide
    },
    computed: {},
    activated() {
      this.$root.eventHub.$on("send-lnglat", item => {
        this.mySwiper.slideTo(item.len, 300, true);
        this.sendLngLatFlag = true;
      });
    },
    mounted() {},
    created() {
      // console.log(AMap);
    },
    methods: {
      //AMap往swiper组件中传递处理数据并且加载轮播组件的方法
      loadSwiper(e) {
        // debugger
        // console.log(this.locationToIndex);
        // console.log("初始化swiper");
        this.getDataLen = e.length;
        // this.displayParks = [].concat(e);
        let temarr = [].concat(e);
        this.displayParks = [].concat([]);
        this.isDisplayparks = true;
        // console.log("轮播图的长度是", this.displayParks);
        this.displayParks = this.displayParks.concat(temarr);
        // console.log(this.displayParks);
        this.currentSwiperIndex = 0;
        if (this.displayParks.length == 0 && this.mySwiper) {
          Indicator.close();
          this.mySwiper.destroy();
          this.mySwiper = null;
          return;
        }
        this._initSwiper();
      },
      //加载swiper的方法
      _initSwiper() {
        let _self = this;
        if (this.mySwiper) {
          this.mySwiper.destroy();
        }
        // console.log(_self.displayParks.length);
        // debugger
        // console.log(this.displayParks.length);
        // console.log(this.displayParks.length / 2);
        // this.$nextTick(()=>{
        Indicator.close();
        this.mySwiper = new Swiper(".swiper-container", {
          click: true,
          // loop: true,

          // followFinger : false,
          // touchRatio : 0.5,
          // longSwipesRatio : 0.1,

          // mode: 'horizontal',
          // freeMode:false,
          // touchRatio:0.5,
          // longSwipesRatio:0.1,
          // threshold:50,
          // followFinger:false,
          // autoHeight: true,
          // swiper的各种回调函数也可以出现在这个对象中，参考swiper官方
          observer: true, //修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, //修改swiper的父元素时，自动初始化swiper
          //网格分布
          centeredSlides: true,
          slidesPerView: 1.01,
          // slidesPerView: "auto",
          loopedSlides: _self.displayParks.length,
          // initialSlide: parseInt(_self.displayParks.length / 2) ,
          initialSlide: 0,
          // initialSlide: 1,
          //动画效果
          effect: "coverflow",
          fade: {
            crossFade: true
          },
          coverflow: {
            rotate: 30,
            stretch: 10,
            depth: 60,
            modifier: 1,
            slideShadows: false
          },
          onSlideChangeEnd: function (swiper) {
            swiper.update();
            // swiper.startAutoplay();
            // swiper.reLoop();
          },
          onTransitionEnd: function (swiper) {
            if (_self.sendLngLatFlag) {
              _self.sendLngLatFlag = false;
              return;
            }
            // console.info("页面跳转到第:", swiper.realIndex, " 页");
            let swiperNum = swiper.realIndex;
            // console.info("当前跳转页面的下标", swiperNum, "下标");
            let index = null;
            // debugger

            // console.log(_self.getDataLen);
            if (swiperNum >= _self.getDataLen) {
              index = swiperNum - _self.getDataLen;
            } else {
              index = swiperNum;
            }
            let params = {
              swiperNum: swiperNum,
              index: index
            };
            // console.log(params);
            // debugger;
            if (params != undefined) {
              _self.$root.eventHub.$emit("send-swiper-num", params);
            }
          },
          onClick: function (swiper, e) {
            let num = swiper.realIndex;
            let text = e.target.innerHTML;
            let item = _self.displayParks[num];
            if (
              text == '<span class="map-ic p-a ic-point"></span>到这里去' ||
              text == '<span class="map-ic p-a"></span>到这里去'
            ) {
              _self.guide(item);
            } else if (text == "立即预约") {
              _self.apoint(item);
            } else if(text == 0||text=='<div class="ic">0</div>'){
              return;
            }else{
               _self.goParkDetail(item);
            }
          }
        });
      },
      //跳转到预约页面
      apoint(item) {
        // debugger
        let userId = localStorage.getItem("H5_user_id");
        // debugger

        if (!userId) {
          //未登录跳转登录页
          this.$router.push("login");
        } else {
          localStorage.setItem("H5_park_lot_id", JSON.stringify(item.id));
          this.$router.push("appoint");
        }
      },
      //跳转到车场详情
      goParkDetail(item) {
        localStorage.setItem("H5_park_lot_id", JSON.stringify(item.id));
        this.$router.push("parkDetail");
      },
      //高德地图导航
      guide(item) {
        // debugger
        let geoLocation = JSON.parse(localStorage.getItem("H5_geoLocation"));
        let orgX = geoLocation.lng;
        let orgY = geoLocation.lat;
        let desX = item.lng;
        let desY = item.lat;
        this.AMguide.searchOnAMAP({
          origin: [orgX, orgY],
          destination: [desX, desY]
        });
      }
    }
  };

</script>
<style lang="stylus">
  @import '../../common/css/base.stylus';
  @import '../../common/css/mixin.stylus';

  #point-detail {
    position: absolute;
    width: 100%;
    left: 0; // transform  translateX(-50%)
    min-height: 10.8rem; // bottom: 1.875rem;
    top: -10.8rem; // overflow hidden
    z-index: 500;

    .swiper-container {
      width: 100%;
      height: 100%;
      overflow: visible;

      .swiper-wrapper {
        .swiper-slide {
          .item-box {
            margin: 0 2.5rem;

            .list-items {
              display: inline-block;
              width: 100%; // height 100%
              background-color: #fff;
              border-radius: 0.625rem;

              .item-info {
                padding: 1.0625rem 0.875rem;
                border-bottom: 1px solid #E5E5E5;

                .carinfo {
                  width: 12.8125rem;
                  border-right: 0.0625rem solid #e6e6e6;

                  .car-name {
                    font-size: 1rem;
                    color: #111111;
                    font-weight: 700;
                  }

                  .car-text {
                    padding: 0.025rem 0.125rem;
                    background-color: #59c8f9;
                    font-size: 0.6rem; // margin-top 0.5rem
                    color: #fff;
                    text-align: center;
                    border-radius: 0.155rem;


                  }

                  .yard-bg {
                    background-color: #f7bc41;
                  }

                  .car-distance {
                    // margin-left: 0.3rem;
                    font-size: 0.8rem; // margin-top 0.6rem
                    margin-top: 0.35rem;
                    margin-right: 0.05rem;
                    color: #666666;
                    vertical-align: middle;
                  }

                  .left-local {
                    margin-top: 0.6rem;
                    margin-bottom: 0.2rem;
                    padding-left: 1rem;
                  }

                  .local-img {
                    width: 0.75rem;
                    height: 0.85rem;
                    left: 0;
                    top: 50%;
                    transform: translateY(-34%);
                    bg-img('../../assets/img/home_vip');
                  }

                  .local-text {
                    font-size: 0.875rem;
                    color: #666;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: inline-block;
                    width: 100%;
                    vertical-align: middle;
                    padding-right: 0.4rem;
                  }
                }

                .rightinfo {
                  width: 3.125rem;
                  height: 2.8125rem;
                  top: 50%;
                  right: 4%;
                  transform: translateY(-65%);
                }

                .right-number {
                  color: #d01d95;
                  font-size: 1rem;
                  font-weifht: 700;

                  span {
                    font-size: 1rem;
                  }
                }

                .right-text {
                  color: #999999;
                  font-size: 0.8rem;
                }
              }
            }

            .bord-tips {
              height: 2.8rem;
              line-height: 2.8rem;
              font-size: 1rem;

              .map {
                color: #d01c95;

                .map-ic {
                  width: 1.5rem;
                  height: 1.5rem;
                  top: 47%;
                  transform: translateY(-50%);
                  left: 10%;
                  bg-img('../../assets/img/parking_go');
                }

                .ic-point {
                  left: 30%;
                }
              }

              .bord {
                background-color: #d01c95;
                color: #fff;
                border-bottom-right-radius: 0.9375rem;
              }
            }
          }
        }
      }
    }
  }

  .hide-show-btn {
    width: 100%;
    height: 2.2rem; // top: -2.2rem;
    top: -2.2rem;
    z-index: 10002;
    left: 0;

    .ic {
      display: inline-block;
      width: 5.5rem;
      height: 100%;
      bg-img('../../assets/img/home_up');
      color: #fff;
    }
  }

  .swiper-null{
    height: 7.9375rem;
    line-height: 7.9375rem;
    text-align : center;
    color: #666;
    font-size:1rem;
  }

</style>
