<template>
  <div id="mapBox" ref="AMapBox">
    <div id="AMap" :style="{height:mapHeight}">
      <div class="floater p-a"></div>
    </div>
    <div class="view-init p-a ft-ic" @click="initView"></div>
    <div class="price-park p-a ft-ic" :class="{'price':isPriceMode,'park':!isPriceMode}" @click="switchPricPark()"></div>
    <div class="fresh-ic p-a ft-ic" :style="rotateStyle" @click="doRefresh"></div>
    <newsPreview></newsPreview>
    <list-view :AMguide="AMguide" ref="listView"></list-view>
  </div>

</template>
<script>
  const path = require("path");
  import {
    Indicator,
    Toast,
    Button
  } from "mint-ui";
  import BScroll from "better-scroll";
  import {
    asyncAMap
  } from "../../common/js/H5plugin";
  import {
    getParks,
    getMyUsualParks,
    getMySearchLists,
    setMyUsualParks
  } from "../../server/getData";
  import pointDetail from "./pointDetail";
  import listView from "./listView";
  import newsPreview from "../commonComponents/newsPreview";
  import {
    setTimeout,
    clearTimeout,
    clearInterval
  } from "timers";
  import common from "../../common/js/common";
  import store from '../../store/store';
  import baseUrl from '../../server/baseURL.js';

  export default {
    name: "mapBox",
    data() {
      return {
        // 加的数据
        priceMark: null,
        //地图
        AMap: null, //高德地图实例对象
        currentIndexY: 0, //默认初始化的选项
        geolocation: null, //全局地图定位实例化对象
        currentLng: "", //当前位置经度
        currentLat: "", //当前位置纬度
        freshCounts: 0, //刷新转动圈数
        conTainerLng: "", //屏幕中心点经度
        conTainerLat: "", //屏幕中心点纬度
        //驾车导航的目的经纬度
        locationLng: "",
        locationLat: "",

        //数据展示
        parkItems: [], //附近停车场数据
        parkYardItems: [], //车场列表
        parkLotItems: [], //车位列表
        parkTypeIndex: 0, //车场列表类型
        locationToIndex: 0, //默认导向的目的地

        //搜索
        showUsualAdrr: true, //是否显示常用地址栏
        searcVal: "", //搜索输入值
        empmtySearchVal: true, //搜索输入值为空时显示
        // historyInfo:'搜索历史',   //搜索历史与结果的显示
        usualParks: {}, //常用地址
        showSetting: false, //搜索设置模式模式
        edditeMode: true, //搜索编辑模式
        editActionsShow: false, //编辑删除按钮显示

        isSettingMode: true, //设置模式
        showClickMask: true, //辅助点击盒子

        cityCode: "0755", // 默认城市编码
        searchItems: [], // 搜索结果
        displayParks: [], // 需要展示在地图上的车场列表
        currentItem: {}, // 当前展示导向车位 | 点
        //驾车路线类
        AMguide: null, //路线导航实例化对象
        AMdriving: null, //驾车路线规划实例对象
        AMwalking: null, //步行路线规划实例对象

        //其他
        isLogined: false, //用户是登录
        isPriceMode: false, //是否价格模式
        mapBoxHeight: 0, //传进去地图外层盒子的高度
        dragTimer: null, //地图拖拽截流

        //同方信息港测试经纬度
        lat: 22.554837,
        lng: 113.949039,
        // loadedAMapJS:false,

        // 搜索时需要处理的数据
        isSetting: true, // 表示常用的地址栏是否显示
        num: 1,
        len: 0, // 表示点击的marker点
        mapMoveFlag: false, // 监听地图是否做了滑动操作
        markFlag: true, // marker点默认是可以点击的
      };
    },
    components: {
      // pointDetail,
      listView,
      newsPreview,
    },
    computed: {
      mapHeight() {
        //地图动态高度变化
        let mapHeight = "100%";
        // var mapHeight;
        switch (this.currentIndexY) {
          case 0:
            mapHeight = "100%";
            break;
          case 1:
            mapHeight = "40%";
            break;
          case 2:
            mapHeight = "0";
            break;
          default:
            break;
        }
        return mapHeight;
      },
      rotateStyle() {
        //控制刷新按钮动画
        return "transform:rotate(" + 360 * this.freshCounts + "deg)";
      }
    },
    created() {
      Indicator.close();
      this.loadAMap();
      // listView 传递过来的事件（修改轮播图 和 marker点）
      this.$root.eventHub.$on("send-list-view", item => {
        this.parkTypeIndex = item;
        this.getDisplayParks();
        this.setMarker();
      });
      // pointDetail 传递过来的参数（修改驾车路线）
      this.$root.eventHub.$on("send-swiper-num", item => {
        // debugger
        // console.log(item);
        // alert('这个地方接受了事件');
        // console.log(this.displayParks);
        if (this.displayParks.length == 0) {
          return;
        }
        this.len = item.index;
        this.currentItem = this.displayParks[item.index];
        // console.log(this.currentItem);
        this.setMarker();
        this.AMdrivingMap(item.index, 2);
      });
      //获取地图外盒子的高度
      this.$nextTick(() => {
        this.mapBoxHeight = this.$refs.AMapBox.offsetHeight;
      });

      //切换轮播时获取index值得  (动态切换驾车路线)
      this.$root.eventHub.$on("switch-locationIndex", e => {
        this.locationToIndex = e;
        this.setMarker();
      });

      //搜索事件接收（节流意思就是 不可能用户每次点击都要去查询数据）
      setTimeout(() => {
        this.$root.eventHub.$on("search-park", e => {
          this.searcVal = e;
          if (e.trim() == "") {
            this.getSearchHistory();
            return;
          }
          let _self = this;
          this.getSearchLists();
        });
      }, 500);
      // 当上拉菜单发生变化的时候（地图高度也要发生改变）
      this.$root.eventHub.$on("mapHeight", item => {
        // case 0:
        //     mapHeight = "100%";
        //     break;
        //   case 1:
        //     mapHeight = "40%";
        //     break;
        //   case 2:
        //     mapHeight = "0";
        //     break;
        //   default:
        //     break;
        // console.log(item);
        if (item == 0) { // 0 表示上拉列表为 全部展示
          this.currentIndexY = 2;
        } else if (item == 0.4) { // 0.4 表示上拉列表 展示 60%
          this.currentIndexY = 1;
        } else if (item == 1) { // 1 表示上拉列表 不展示
          this.currentIndexY = 0
        }
        // this.currentIndexY
      });

      // setTimeout(() => {
      //   this.loadAMap();
      // }, 500);
    },
    activated() {

    },
    mounted() {},
    methods: {
      toGolistView() {
        // console.log(1234444);
        this.$refs.listView.displayShowLists();
      },
      //加载地图SDK
      async loadAMap() {
        let _self = this;
        Indicator.open({
          text: "正在重新定位中..."
        });
        let res = asyncAMap();
        res.then(function (data) {
          window.init = function () {
            _self.initAMap();
          }
        }).catch(function (err) {
          Toast({
            message: "地图加载失败",
            duration: 1500
          });
        });
        // console.log(res);
        // if (res == "success") {
        //   // 设置一个动画
        //   // setTimeout(() => {
        //   // Indicator.close();
        //   // }, 700);
        //   // 给定时器，为了script标签的内容加载出来，
        //   // let setTimeId = setTimeout(() => {
        //   //   this.initAMap();
        //   //   clearTimeout(setTimeId);
        //   // }, 1000);

        //   window.init = function(){
        //     _self.loadAMap();
        //   }
        // } else {
        //   Toast({
        //     message: "地图加载失败",
        //     duration: 1500
        //   });
        // }
      },
      //初始化地图
      initAMap() {
        //实例化AMap对象
        // alert('导入地图成功1');
        this.AMap = new AMap.Map("AMap", {
          // resizeEnable: true,
          resizeEnable: true,
          zoom: 16
        });
        // console.log(this.$store);
        this.$store.state.AMap = this.AMap;
        // window.AMap = this.AMap;
        this.initGeoLocation();
        // 地图拖拽事件
        this.AMapDrag();
        // 对地图的手势去做处理
        this.AMapGeste();
      },
      //地图初始化定位
      initGeoLocation() {
        let _self = this;
        // alert('开始做定位了2');
        // alert('123344444');
        this.AMap.plugin("AMap.Geolocation", function () {
          _self.geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            maximumAge: 0, //定位结果缓存0毫秒，默认：0
            convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
            panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            // useNative: true,
            //非必要参数配置
            // showButton: true,        //显示定位按钮，默认：true
            // buttonOffset: new AMap.Pixel(10, 20),  //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            // buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            // showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
          });
          _self.geolocation.getCurrentPosition((status, res) => {
            // console.log("获取当前位置结果", res.position);
            let resCode = res.position;
            if (res.info == "SUCCESS") {
              _self.planGuiding();
              _self.planDriving();

              // _self.planWalking();
              // alert('成功定位了4');
              _self.currentLng = res.position.lng;
              _self.currentLat = res.position.lat;
              // alert(JSON.stringify(_self.currentLng,_self.currentLat));

              // 测试------
              // _self.currentLng = _self.lng;
              // _self.currentLat = _self.lat;

              //当前的位置
              let geoLocation = {
                lng: _self.currentLng,
                lat: _self.currentLat
              };
              localStorage.setItem("H5_geoLocation", JSON.stringify(geoLocation));
              _self.AMap.setZoomAndCenter(16, [
                _self.currentLng,
                _self.currentLat
              ]);
              _self.conTainerLng = _self.AMap.getCenter().lng;
              _self.conTainerLat = _self.AMap.getCenter().lat;
              Indicator.close();
              // console.log('定位成功了');
              _self.getParksItems();
            }
          });
          //返回定位出错信息
          AMap.event.addListener(_self.geolocation, "error", err => {
            // console.log("地图获取当前位置的报错信息", err);
            // alert(JSON.stringify(err));
            // _self.$root.eventHub.$emit('geo-location-err');
            Indicator.close();
            Toast("定位失败，请检查是否开了位置信息");

          });
        });
      },

      //点击地图定位按钮(初始化定位按钮)
      initView() {
        this.initGeoLocation();
        Indicator.open({
          text: "正在更新定位中..."
        });
      },
      //刷新按钮(刷附近的停车信息)
      doRefresh() {
        console.log('获取预约订单的数据');
        this.freshCounts++;
        this.conTainerLng = this.AMap.getCenter().lng;
        this.conTainerLat = this.AMap.getCenter().lat;
        this.getParksItems();
        this.$root.eventHub.$emit('getnews');
        // 从新请求一次 信息接口
      },

      //切换价格 | 车位模式  (切换marker点)
      switchPricPark() {
        this.isPriceMode = !this.isPriceMode;
        this.setMarker();
      },
      //获取附近车位
      getParksItems() {
        let map = {
          lng: this.conTainerLng,
          lat: this.conTainerLat
        };
        let locate = {
          lng: this.currentLng,
          lat: this.currentLat
        };
        let data = {
          map: map,
          locate: locate,
          radius: 500,
          timestamp: String(new Date().getTime()),
        }
        this.$http.post(baseUrl.requestUrl + 'apiread/parklot/nearby', data)
          .then(res => {
            if (res.body.error_code == 2000) {
              if (res.body.data.parklots.length == 0) {
                Indicator.close();
                return;
              }
              this.displayParks = res.body.data.parklots;
              let dataItems = res.body.data.parklots;
              this.displayItems(dataItems);
            } else {
              Toast({
                message: "数据请求失败",
                duration: 1000
              });
            }
          })
          .catch(err => {
            Indicator.close();
          })
      },
      //获取地图上的展示数据（轮播展示数据的切换）
      getDisplayParks() {
        switch (this.parkTypeIndex) {
          case 0:
            this.displayParks = [].concat(this.parkItems);
            break;
          case 1:
            this.displayParks = [].concat(this.parkYardItems);
            break;
          case 2:
            this.displayParks = [].concat(this.parkLotItems);
            break;
        }
        if (this.displayParks.length) {
          this.currentItem = this.displayParks[0];
        }
        //向swiper子组件中派发事件
        // this.num = num + 1;
        this.locationToIndex = this.locationToIndex + 1;
        // console.log(this.locationToIndex);
        // alert('向轮播图传递数据之前');
        // console.log(this.displayParks);
        // 暂时使用的方法
        this.$root.eventHub.$emit('send-data', this.displayParks);
        // this.$refs.pointDetailBox.loadSwiper(this.displayParks);
      },
      displayItems(dataItems) {
        // // debugger
        // let num = parseInt(dataItems.lenghth);
        // let array5 = dataItems.slice(0,num);

        this.parkItems = [].concat(dataItems);
        let is = this.parkItems.lenghth;
        let parkYardItems = [];
        let parkLotItems = [];
        //type0 静态车场(未合作)  type1 约车场 type2 约车位
        for (let item of dataItems) {
          if (item.name.length > 6) {
            item.name = item.name.substr(0, 6) + "...";
          }
          switch (item.type) {
            case 1:
              parkYardItems.push(item);
              break;
            case 2:
              parkLotItems.push(item);
              break;
          }
        }
        this.parkYardItems = [].concat(parkYardItems);
        this.parkLotItems = [].concat(parkLotItems);
        let parkObj = {
          parkItems: this.parkItems,
          parkYardItems: this.parkYardItems,
          parkLotItems: this.parkLotItems
        };
        // alert('向下拉加载更多传递数据');
        this.$root.eventHub.$emit("send-park-datas", parkObj);
        this.getDisplayParks();
        this.setMarker();
      },
      //设置标记点信息
      setMarker() {
        // debugger
        this.markFlag = true;
        let _this = this;
        let content = "";
        let backUrl = "";
        let zIndex = 400; //车场图标的索引 500是指被选中或者最优的车场 *该值设为唯一*
        this.AMap.clearMap();
        // console.log('marker点标记');
        if (!this.displayParks.length) {
          return false;
        }
        // debugger
        // console.log(this.displayParks);
        for (let i = 0; i < this.displayParks.length; i++) {
          let item = this.displayParks[i];
          if (i == this.len) {
            if (item.type == 0) {
              content = "0";
              zIndex = 400;
              if (item.show == 0) {
                content = item.total_amount;
              } else if (item.show == 1) {
                content = item.left_amount;
              }
            } else if (this.isPriceMode) {
              content = item.parking_fee;
            } else {
              content = item.reservable_amount;
            }
            backUrl = require("../../assets/img/map_check@3x");
            zIndex = 500;
          } else {
            if (item.type == 0) {
              backUrl = require("../../assets/img/map_gray@3x");
              content = "0";
              zIndex = 400;
              if (item.show == 0) {
                content = item.total_amount;
              } else if (item.show == 1) {
                content = item.left_amount;
              }
            } else {
              if (this.isPriceMode) {
                backUrl = require("../../assets/img/map_money@3x");
                content = item.parking_fee;
              } else {
                backUrl = require("../../assets/img/map_car@3x");
                content = item.reservable_amount;
              }
              zIndex = 450;
            }
          }

          //添加标记物
          if (item.lng && item.lat) {
            // debugger
            let _self = this;
            let num = i;
            let marker = new AMap.Marker({
              map: this.AMap,
              position: [item.lng, item.lat],
              extData: num,
              clickable: true,
              topWhenClick: true,
              icon: new AMap.Icon({
                size: new AMap.Size(40, 40), //图标大小
                image: backUrl,
                imageOffset: new AMap.Pixel(0, 0),
                imageSize: new AMap.Size(40, 40)
              }),
              zIndex: zIndex
            });
            //添加标签
            marker.setLabel({
              offset: new AMap.Pixel(0, 0),
              content: '<span style="color:#fff;">' + content + "</span>"
            });
            marker.on("touchstart", event => {
              if (_self.markFlag) {
                let len = marker.getExtData();
                this.len = len;
                backUrl = require("../../assets/img/map_check@3x");
                _this.currentItem = _this.displayParks[len];
                marker.setIcon(backUrl);
                this.setMarker();
                _this.AMdrivingMap(len, 1);
              }
            });
            this.AMap.add(marker);
          }
        }
        this.locationLng = Number(this.currentItem.lng);
        this.locationLat = Number(this.currentItem.lat);

        //路线规划
        this.AMdriving.search(
          [this.currentLng, this.currentLat], [this.locationLng, this.locationLat]
        );
      },

      //移除掉车场的最优化图标或者选中状态图标
      switchMarkerIcon(index) {},

      // 构建驾车导航路径
      AMdrivingMap(len, flag) {
        // debugger
        // console.log(this.currentItem);
        // console.log('点击maker点的坐标是',this.currentItem.lng,this.currentItem.lat);
        // alert(JSON.stringify('点击了做了循环'));
        this.AMdriving.search(
          [this.currentLng, this.currentLat], [Number(this.currentItem.lng), Number(this.currentItem.lat)]
        );
        // console.log(this.displayParks);
        let parmas = {
          lenAll: this.displayParks.length,
          len: len
        };
        if (flag === 1) {
          this.$root.eventHub.$emit("send-lnglat", parmas);
        }
      },
      //获取当前地址成功后初始化导航对象
      //三种规划方案LEAST_TIME，LEAST_FEE, LEAST_DISTANCE,REAL_TRAFFIC 暂时选用路线最短
      planGuiding() {
        let _self = this;
        this.AMap.plugin(["AMap.Driving"], function () {
          let DrivingOption = {
            map: _self.AMap,
            policy: AMap.DrivingPolicy.LEAST_DISTANCE, //路线规划策略
            hideMarkers: true, //隐藏起始图标
            autoFitView: false //路线规划完毕后自动缩放地图视口
          };
          _self.AMguide = new AMap.Driving(DrivingOption); //构造驾车导航类
          _self.$store.state.AMguide = _self.AMguide;
          // AMap.event.addListener(AMguide, "complete", ()=>{
          // }); //返回导航查询结果
        });
      },

      //驾车路线规划
      planDriving() {
        let _self = this;
        // console.log("这里执行了吗");
        // 实例化这个插件，在回调中实例化插件
        AMap.service("AMap.Driving", () => {
          // 这里是异步加载插件
          _self.AMdriving = new AMap.Driving({
            map: _self.AMap,
            // panel: "panel"
            autoFitView: false, //路线规划完毕后自动缩放地图视口
            hideMarkers: true
          });
        });
      },

      //地图拖拽事件
      AMapDrag() {
        let _self = this;
        if (_self.dragTimer) {
          clearTimeout(_self.dragTimer);
        }
        this.AMap.on('movestart', e => {
          _self.markFlag = false;
        });
        this.AMap.on("moveend", e => {
          Indicator.open({
            text: "正在重新加载数据..."
          });
          this.mapMoveFlag = false;
          this.conTainerLng = this.AMap.getCenter().lng;
          this.conTainerLat = this.AMap.getCenter().lat;
          _self.dragTimer = setTimeout(() => {
            this.getParksItems();
          }, 500);
        });
      },

      // 地图手势判断
      AMapGeste() {
        this.AMap.on('touchmove', () => {
          this.mapMoveFlag = true;
        });
        this.AMap.on('touchend', () => {
          if (!this.mapMoveFlag) {
            this.currentIndexY = 0;
            this.$root.eventHub.$emit('hidelistView', 1);
          }
        })
      }
    }
  };

</script>

<style lang="stylus">
  @import '../../common/css/base.stylus';
  @import '../../common/css/mixin.stylus';

  .mint-indicator-text {
    font-size: 1rem;
  }

  .mt-container {
    overflow: hidden;
  }

  .mint-tab-container-item {
    margin-bottom: 3.125rem;
  }

  #mapBox {
    position: fixed !important;
    width: 100%;
    top: 3rem;
    bottom: 0;

    .mint-tab-container {
      height: 100%;
      background-color: #fff;
    }

    .floater {
      width: 1.0625rem;
      height: 1.6875rem;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      bg-img('../../assets/img/map_heart');
      z-index: 1000;
    }

    #AMap {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: -100%;
    }

    .select0 {
      height: 100%;
      transtion: all 1s;
      transform: translateY(0%);
      transition-duration: 0.5s;
    }

    .select1 {
      transform: translateY(-60%);
      transition-duration: 0.5s;
      height: 100%;
    }

    .select2 {
      transform: translateY(-100%);
      transition-duration: 0.5s;
      height: 100%;
    }

    .up-style {
      z-index: 10001;
      position: absolute;
      bottom: -100%;
      width: 100%;
      height: 100%;
    }

    .img-style {
      position: fixed;
      top: -1.4375rem;
      width: 100%;
      height: 1.4375rem;

      .up-img {
        width: 4rem;
        height: 1.4375rem;
        position: absolute;
        left: 50%;
        margin-left: -2rem;
        bottom: 0;
        bg-img('../../assets/img/home_up');
      }
    }

    .search-list-box {
      width: 100%;
      top: 0;
      bottom: 0;
      background-color: #FFF;
      overflow: hidden;
      background-color: #F5F5F5;
      font-size: 1rem;
      z-index: 10000;
      font-size: 1rem;
      border-top: 0.0625rem solid #e6e6e6;

      .but-style {
        text-align: center;
        margin-top: 0.5rem;
      }

      .mint-button--normal {
        height: 2.5rem;
        padding: 0 2rem;
        font-size: 1rem;
        border: 0.05rem solid #201a1a;
      }

      .common-adr {
        margin-top: 0.6875rem;
        padding: 0.9375rem;
        padding-right: 1.125rem;
        padding-left: 2.0625rem;
        background-color: #ffffff;
        border-top: 0.0625rem solid #e6e6e6;
        border-bottom: 0.0625rem solid #e6e6e6;

        .ic {
          width: 0.75rem;
          height: 0.9rem;
          left: 1.125rem !important;
          top: 52%;
          transform: translateY(-50%);
          bg-img('../../assets/img/home_vip');
        } // .click-mask
        // width 80%
        // height 100%
        // left 0
        // top 0
        .info-box {
          font-size: 1rem;
          color: #1a1a1a;

          div {
            display: inline-block;
          }

          .info {
            display: inline-block;
            height: 100%; // min-width 40%
            min-width: 50%;
            outline: none;
            border: none;
            color: #999;
            font-size: 1rem;
            margin-left: 1.5rem;
          }
        }

        .action-btn {
          color: #999;

          .setting {
            padding-right: 0.9rem;

            .go-ic {
              width: 0.4rem;
              height: 0.9rem;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              bg-img('../../assets/img/wuye_up');
              background-position: center left;
            }
          }

          .edit-act {
            width: 1.125rem;
            height: 1.125rem;
            bg-img('../../assets/img/home_search_edit');
          }
        }

        .edit-btn {
          right: 1.125rem;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          padding: 0.4rem 0.6rem;
          border-radius: 0.3rem;
          font-size: 0.8rem;
          transform: translateY(80%);

          .edit {
            color: #ffffff;
            padding-right: 0.625rem;
            border-right: 0.0625rem solid #fff;
          }

          .delete {
            color: #d01c95;
            padding-left: 0.625rem;
          }
        }
      }

      .history-result {
        margin-top: 0.5rem;
        padding: 0.6875rem 1.125rem;
        color: #666;
      }

      .list-view-box {
        border-top: 0.0625rem solid #e6e6e6;
        border-bottom: 0.0625rem solid #e6e6e6;

        .search-list {
          padding: 0.5rem 0 0 1.125rem;
          background-color: #fff;

          div {
            color: #1B1B1B;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .title {
            font-weight: bolder;
            font-size: 1rem;
          }

          .address {
            font-size: 0.5rem;
            color: #666;
            border-bottom: 0.0625rem solid #e6e6e6;
            margin-top: 0.4rem;
            padding-bottom: 0.8rem;
          }

          .bb-none {
            border-bottom: none;
          }
        }
      }
    }

    .view-init {
      left: 0.875rem;
      top: 50%;
      position: absolute;
      width: 3.8rem !important;
      height: 3.8rem !important;
      bg-img('../../assets/img/parking_point');
    }

    .price-park {
      right: 0.875rem;
      top: 40%;
      background-color: #FFF;
      position: absolute;
    }

    .park {
      bg-img('../../assets/img/home_car');
    }

    .price {
      bg-img('../../assets/img/home_money');
    }

    .fresh-ic {
      right: 0.875rem;
      top: 50%;
      position: absolute;
      background-color: #FFF;
      transition: all 0.5s ease;
      transform-origin: center;
      bg-img('../../assets/img/parking_refresh');
    }

    .ft-ic {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .amap-marker {
      .amap-icon {
        width: 2.2rem !important;
        height: 2.65rem !important;

        img {
          width: 2.2rem !important;
          height: 2.65rem !important;
        }
      }
    }

    .amap-marker-label {
      border: none;
      background-color: rgba(0, 0, 0, 0); // color #915bf1
    }

    .amap-logo {
      right: 0 !important;
      left: auto !important;
      display: none !important;
    }
  }

  .amap-copyright {
    right: 70px !important;
    left: auto !important;
    display: none !important;
  }

  .amap-marker-label {
    font-size: 0.75rem !important;
    width: 2.2rem !important;
    height: 2.65rem !important;
    padding: 0 !important;
    top: -0.2rem !important;

    span {
      display: inline-block;
      width: 2.2rem;
      height: 2.65rem;
      line-height: 2.65rem;
      text-align: center;
      font-size: 0.625rem;
    }

    .mint-navbar {
      height: 3.125rem;
      border-top: 0.0625rem solid #e6e6e6;
      border-bottom: 0.0625rem solid #e6e6e6;

      .mint-tab-item {
        padding: 0;
        font-size: 0.9375rem;
        font-weight: 700;
        color: #000;
        margin-top: 0.6875rem;
        height: 1.875rem;
        line-height: 1.875rem;
      }

      .mint-tab-item.is-selected {
        border-bottom: 0.04rem solid #d01c94;
        color: #d01c94;
        margin-bottom: 0;
      }
    }

    .mint-tab-item-label {
      height: 1.875rem;
      line-height: 1.875rem;
    }
  }

</style>
