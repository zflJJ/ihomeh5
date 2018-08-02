<template>
  <div id="list-view" ref="listView">
      <!-- <point-detail ref="pointDetailBox" :AMguide="AMguide" :class="{isShowSwiper:heightFlag}"></point-detail> -->
    <point-detail ref="pointDetailBox" :AMguide="AMguide" :style="{opacity: swiperOpacity}" :class="{isShowSwiper:heightFlag}"></point-detail>
    <div class="type-bar flex">
      <div class="bar-items fl-o t-c" v-for="(item,key) in barItems" :key="item.env" :class="{'active':key == currentBarIndex,'bd-no':key == (barItems.length-1)}" @click.prevent.stop="switchBar(key)">
        <span class="p-r">
          {{item}}
          <span class="bt-line p-a" :class="{'ln-show':key == currentBarIndex,'ln-hide':key !== currentBarIndex}"></span>
        </span>
      </div>
    </div>
    <div class="vew-box p-a" ref="parkTypeBox">
      <div class="park-type-wraper flex">
        <div class="park-item-box fl-o p-r" v-for="(item, key) in handledParksItems" :key="item.name">
          <no-data-tips :tipMark="tipMark" :parkItems="item.subLists"></no-data-tips>
          <div class="each-type-box p-a" :ref="item.name">
            <div class="each-type-wraper">
              <div class="each-type-item p-r" v-for="(subItem,subIndex) in item.subLists" :key="subItem.id" :class="{'bb-no':subIndex == (item.subLists.length-1)}" @click.prevent.stop="goParkDetail(subItem)">
                <!-- <no-data-tips :tipMark ="tipMark"  :parkItems="item.subLists"></no-data-tips> -->
                <div class="car-infotext">
                  <span class="car-name">{{subItem.name}}</span>
                  <span class="car-text" :class="{'yard-bg':subItem.type == 1}" v-show="!(subItem.type == 0)">{{(subItem.type == 1)?'约车场':'约车位'}}</span>
                </div>

                <div class="parks-fees">
                  <span class="parks" v-if="subItem.type == 0">
                    <span class="info">{{(subItem.show == 1) ?'空泊位':'总车位'}}</span>
                    <span class="num">{{(subItem.show == 1)? subItem.left_amount : subItem.total_amount}}</span>
                  </span>
                  <span class="parks" v-else>
                    <span class="info">空泊位</span>
                    <span class="num">{{ subItem.reservable_amount}}</span>
                  </span>
                  <span class="link" v-show="!(subItem.type == 0)">∣</span>
                  <span class="fees" v-show="!(subItem.type == 0)">
                    <span class="info">停车费：</span>
                    <span class="num">￥{{subItem.parking_fee}} 首小时</span>
                  </span>
                </div>

                <div class="left-local p-r">
                  <span class="local-img p-a"></span>
                  <span class="local-text">{{subItem.address}}</span>
                </div>
                <div class="right-local p-a" @click.stop="goApoint(subItem)">
                  <div class="locate-ic" :class="{'guide-ic':subItem.type == 0}"></div>
                  <div class="locate-info t-c">{{subItem.distance}}</div>
                </div>
              </div>
              <br>
              <br>
              <br>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import BScroll from "better-scroll";
import { Toast } from "mint-ui";
import noDataTips from "../commonComponents/noDataTip";
import { setTimeout, clearTimeout } from "timers";
import common from "../../common/js/common";
import pointDetail from "./pointDetail";
export default {
  name: "listView",
  data() {
    return {
      tipMark: "暂无数据",
      parkItems: [], //全部车场
      handledParksItems: [], //处理好的全部车场数据
      parkYardItems: [], //停车位
      parkLotItems: [], //停车位
      barItems: ["全部", "约车场", "约车位"], //tab栏数据
      currentBarIndex: 0, //当前切换到的tab索引
      pullTimer: null, //上拉下拉的延时控制
      pullPage: 2, //默认下拉状态的页数
      canPull: false, //阻止子控件滚动时
      oldTop: null,
      oldMoveTo: null, // 判断是否做了滑动
      oldEltop: null, // 判断是否做了滑动
      boxTop: null, // 要滑动元素的top值
      touchMoveFlag: false, // 表示这个到底是点击还是移动事件（默认是点击）
      oldTop6: null, // 表示移动到滑块移动到 0.4 的时候
      elTop: 1, // 表示外层盒子的top值显示好多
      mapData: [], // 表示空数组
      swiperOpacity: 1,
      listViewHeight: null, // 上拉加载跟多的高度
      isallTypesBox: true,     // 表示全部类型+约车位+约车场 的是否可以下拉
      isyardBox:true,     // 表示全部类型+约车位+约车场 的是否可以下拉
      islotBox:true,     // 表示全部类型+约车位+约车场 的是否可以下拉
      allTypesBoxScroll: 0, 
      yardBoxScroll: 0,
      lotBoxScroll: 0,
      
    };
  },
  components: {
    noDataTips,
    pointDetail,
  },
  props: ["AMguide"],
  computed:{
    heightFlag:function(){
      return this.swiperOpacity > 0 ? false : true;
    }
  },
  methods: {
    //添加滚动事件
    _scrollInit() {
      this.$nextTick(() => {
        let _self = this;
        let elBox = this.$refs.listView;
        let elBoxHeight = this.getCurrentTop(elBox);
        //横向滑动时间
        if (!this.parkTypeScroll) {
          this.parkTypeScroll = new BScroll(this.$refs.parkTypeBox, {
            scrollX: true,
            scrollY: false,
            momentum: false, //关闭或者打开惯性运动的执行
            snap: true, //隔断（翻页）
            snapLoop: this.loop, //无限滚动
            snapThreshold: 0,
            snapSpeed: 400, //滑动的时间
            click: true
          });

          this.parkTypeScroll.on("scrollEnd", () => {
            // console.log(1234);
            console.log("横向滚动了");
            this.currentBarIndex = this.parkTypeScroll.getCurrentPage().pageX;
            this.$root.eventHub.$emit("send-list-view", this.currentBarIndex);
            // console.log(this.currentBarIndex);
          });
        } else {
          this.parkTypeScroll.refresh();
        }

        //全部类型上下滚动

        if (!this.allTypesBox) {
          console.log(this.oldTop6, elBoxHeight);
          this.allTypesBox = new BScroll(this.$refs.allTypesBox[0], {
            scrollX: false,
            scrollY: true,
            click: true,
            probeType: 3,
            bounce: false
          });
          // console.log("全部类型上下滚动");
          // let wraperEl = _self.allTypesBox.scroller;
          // let boxEl = wraperEl.parentElement;
          // console.log(boxEl, wraperEl);
          // console.log(boxEl.offsetHeight, wraperEl.offsetHeight);
          this.allTypesBox.on("scroll", props => {
            let Y = props.y;
            this.allTypesBoxScroll = props.y;
            if(Y == 0){
              this.isallTypesBox = true;
            }else{
              this.isallTypesBox = false;
            }
            console.log("移动的Y值", Y);
            let wraperEl = _self.allTypesBox.scroller;
            let boxEl = wraperEl.parentElement;
            // console.log(boxEl, wraperEl);
            // console.log(boxEl.offsetHeight, wraperEl.offsetHeight);
            // 子元素的高低 - 父元素的高度
            let disH = wraperEl.offsetHeight - boxEl.offsetHeight;
            console.log("计算出来的最大高度值", disH);
            // if (disH <= 0) {
            //   _self.canPull = true;
            // } else {
            //   if (Y >= 0 || Y <= -disH) {
            //     _self.canPull = true;
            //   } else {
            //     _self.canPull = false;
            //   }
            // }
            if (Y == 0) {
              _self.canPull = true;
            } else {
              _self.canPull = false;
            }
          });
        } else {
          this.allTypesBox.refresh();
        }

        //约车场类型滚动事件
        if (!this.yardBox) {
          this.yardBox = new BScroll(this.$refs.yardBox[0], {
            scrollX: false,
            scrollY: true,
            click: true,
            probeType: 3,
            bounce: false
          });
          console.log("约车场滚动");
          this.yardBox.on("scroll", props => {
            this.yardBoxScroll = props.y;
            let Y = props.y;
            if(Y == 0){
              this.isyardBox = true;
            }else{
              this.isyardBox = false;
            }
            let wraperEl = _self.yardBox.scroller;
            let boxEl = wraperEl.parentElement;
            let disH = wraperEl.offsetHeight - boxEl.offsetHeight;
          });
        } else {
          this.yardBox.refresh();
        }

        // //约车位类型滚动事件
        if (!this.lotBox) {
          this.lotBox = new BScroll(this.$refs.lotBox[0], {
            scrollX: false,
            scrollY: true,
            click: true,
            probeType: 3,
            bounce: false
          });
          this.lotBox.on("scroll", props => {
            let Y = props.y;
            this.lotBoxScroll = props.y;
            if(Y == 0){
              this.islotBox = true;
            }else{
              this.islotBox = false;
            }
            // console.log('约车位类型切换');
            let wraperEl = _self.lotBox.scroller;
            let boxEl = wraperEl.parentElement;
            let disH = wraperEl.offsetHeight - boxEl.offsetHeight;
            if (disH <= 0) {
              _self.canPull = true;
            } else {
              if (Y >= 0 || Y <= -disH) {
                _self.canPull = true;
              } else {
                _self.canPull = false;
              }
            }
          });
        } else {
          this.lotBox.refresh();
        }
        this.displayShowLists();
      });
    },
    //滑动显示隐藏数据列表
    displayShowLists() {
      let elBox = this.$refs.listView;
      let elH = elBox.clientHeight;
      let _self = this;
      let currentY = 0;
      let startY = 0;
      let moveY = 0;
      let dis = 0;
      let swipeUp = true;
      elBox.addEventListener("touchstart", e => {
        elBox.style.transition = null;
        currentY = this.getCurrentTop(elBox);
        console.log(currentY);
        startY = e.changedTouches[0].pageY;
        console.log(startY);
        e.preventDefault;
      });

      elBox.addEventListener("touchmove", e => {
        let isBarItems = e.target.parentNode.classList.contains("bar-items");
        let isTypeBar = e.target.parentNode.classList.contains("type-bar");
        this.touchMoveFlag = true;
        let elBoxHeight = this.getCurrentTop(elBox);
        moveY = e.touches[0].pageY - startY;
        // 这里要确定一个界定值
        console.log(_self.elTop,moveY);
        _self.listViewHeight = Math.abs(_self.boxTop - elBoxHeight );

        //  从1 开始发生变化  到 0.4  到 0 的标准
        let percentHeight = Math.round(_self.listViewHeight / _self.boxTop * 100) + '%';
        console.log(_self.listViewHeight, percentHeight, _self.listViewHeight / _self.boxTop);
        let opacity = 1 - _self.listViewHeight / _self.boxTop *10;
        console.log(opacity,_self.boxTop);
        _self.swiperOpacity = opacity ;
        console.log(elBoxHeight,_self.boxTop, Math.abs(moveY)/_self.oldTop6, moveY);
        console.log(moveY);
        if(_self.elTop == 1){
          if(moveY > 0){
            return;
          }
          console.log(_self.boxTop + moveY);
          elBox.style.top = (_self.boxTop +  moveY) + "px"
        }else if(_self.elTop == 0.4 && Math.abs(moveY) > 40){
          elBox.style.top = (_self.oldTop6 + moveY) + 'px';
          if(moveY >= 40){
            _self.$root.eventHub.$emit('mapHeight',1);
          }
        }else if(_self.elTop == 0 && isTypeBar == false && isBarItems == false){ // 表示下拉
          if(_self.currentBarIndex == 0 && _self.isallTypesBox == true){
            if(moveY > 40 && _self.allTypesBoxScroll == 0){
              elBox.style.top = 0 + moveY + 'px';
            }
          }else if(_self.currentBarIndex == 1 && _self.isyardBox == true){
            if(moveY > 40 && _self.yardBoxScroll == 0){
              elBox.style.top = 0 + moveY + 'px';
            }
          }else if(_self.currentBarIndex == 2 && _self.islotBox == true){
            if(moveY > 40 && _self.lotBoxScroll == 0){
              elBox.style.top = 0 + moveY + 'px';
            }
          }else{
            elBox.style.top = 0 +'px';
          }
        }else if(_self.elTop == 0 && (isTypeBar == true || isBarItems == true) && moveY > 0){ // 表示下拉三个tab栏选项
          elBox.style.top = 0 + moveY + 'px';
        }
        console.log(_self.elTop);
      });

      elBox.addEventListener("touchend", e => {
        console.log(1234);
        elBox.style.transition = "all .4s ease";
        currentY = this.getCurrentTop(elBox);
        let box = Math.abs(_self.boxTop - currentY);
        let percentHeight = Math.round(box / _self.boxTop * 100);
        console.log(currentY,_self.boxTop,box)
        console.log(percentHeight , percentHeight);
        if(_self.touchMoveFlag == true){
          if(percentHeight < 35){
            _self.elTop = 1;
            let opacity = 1;
            _self.swiperOpacity = opacity;
          }else if(percentHeight > 85){
            _self.elTop = 0;
          }else{
            _self.elTop = 0.4;
          }
        }else{
          if(e.target.textContent === '0'){
            let opacity = 0;
            _self.swiperOpacity = opacity;
            _self.elTop  = 0.4;
          }
        }
        
        console.log(_self.elTop,elH,_self.boxTop);
        // 出现问题的原因是（因为本身高度是这样的）
        elBox.style.top = _self.elTop * _self.boxTop + "px";

        console.log(elBox.style.top);
        this.touchMoveFlag = false;
        if (_self.elTop == 0) {
          _self.allTypesBox.enable();
          _self.yardBox.enable();
          _self.yardBox.enable();
        } else if (_self.elTop == 0.4) {
          _self.allTypesBox.disable();
          _self.yardBox.disable();
          _self.yardBox.disable();
        } else if (_self.elTop == 1) {
          _self.allTypesBox.disable();
          _self.yardBox.disable();
          _self.yardBox.disable();
        }
        this.$root.eventHub.$emit('mapHeight',_self.elTop);
      });
    },
    //获取元素top计算的值
    getCurrentTop(el) {
      let top = 0;
      let topStyle = window.getComputedStyle(el).top;
      // console.log(el.offsetTop,topStyle);
      if (!topStyle || topStyle == "") {
        top = 0;
      } else if (topStyle == "100%") {
        top = el.offsetTop;
      } else {
        top = Number(topStyle.replace("px", ""));
      }
      // alert(JSON.stringify(top));
      return top;
    },
    //获取list列表盒子向上移动的比例值
    getMovePercent() {},

    //切换头部tab栏
    switchBar(index) {
      // console.log(this.handledParksItems[]);
      this.currentBarIndex = index;
      this.$root.eventHub.$emit("send-list-view", this.currentBarIndex);
      // 切换tab内容页面的方法
      this.parkTypeScroll.goToPage(this.currentBarIndex, 0, 400);
    },

    //处理接收的停车场 动态数据
    handleParks(e) {
      this.parkItems = e.parkItems;
      let tempArr = [];
      let parkYardItems = [];
      let parkLotItems = [];
      //type0 静态车场(未合作)  type1 约车场 type2 约车位
      for (let item of this.parkItems) {
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
      let parkItemsObj = {
        name: "allTypesBox",
        subLists: this.parkItems
      };
      let parkYardItemsObj = {
        name: "yardBox",
        subLists: this.parkYardItems
      };
      let parkLotItemsObj = {
        name: "lotBox",
        subLists: this.parkLotItems
      };
      tempArr.push(parkItemsObj);
      tempArr.push(parkYardItemsObj);
      tempArr.push(parkLotItemsObj);
      this.handledParksItems = [].concat(tempArr);
      console.log(this.handledParksItems);
      //处理翻页与滑动功能
      this._scrollInit();
    },
    
    //跳转到预约页面
    goApoint(item) {
      let userId = JSON.parse(localStorage.getItem("H5_user_id"));
      if (!userId) {
        //未登录跳转登录页
        this.$router.push("login");
      } else {
        localStorage.setItem("H5_park_lot_id", JSON.stringify(item.id));
        if (item.type == 0) {
          //跳转到导航
          this.guide(item);
          // this.$router.push('parkDetail');
        } else {
          this.$router.push("appoint");
        }
      }
    },

    // 不管登陆与否 都可以跳转到车场详情
    goParkDetail(item) {
      common.setStorage("H5_park_lot_id", item.id);
      this.$router.push("/parkDetail");
    },

    // 调起高德导航
    //高德地图导航
    guide(item) {
      // debugger;
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
  },
  created() {
    // map发送数据到这里的事件
    this.$root.eventHub.$on("send-park-datas", e => {
      this.handleParks(e);
    });
    // 手势点击事件
    this.$root.eventHub.$on('hidelistView',e=>{
      this.boxTop = common.getStorage('H5_listviewHeight');
      this.elTop = 1;
      this.swiperOpacity = 1;
      this.$refs.listView.style.top = this.boxTop * e + "px";
    });
    this.$root.eventHub.$on('send-data',item=>{
      this.$refs.pointDetailBox.loadSwiper(item);
      this.mapData = item;
    });
    // 派发过来的事件
    this.$root.eventHub.$on('send-height-listView',height=>{
      this.$refs.listView.style.top = height * this.elTop + 'px';
      this.boxTop = height;
      console.log(this.boxTop);
      // alert(this.boxTop);
      common.setStorage('H5_listviewHeight',this.boxTop);
    });
  },
  mounted(){
  },
  watch:{
    // boxTop(val,oldval){
    //   console.log('高度更新了');
    //   if(!this.parkTypeScroll && !this.allTypesBox && !this.yardBox && !this.lotBox){
    //      this._scrollInit()
    //   }else{
    //     console.log(this.allTypesBox.enabled);
    //     // if(this.elTop == 0.4){
    //     //   alert('这里对better进行了更新操作');
    //     //   this.parkTypeScroll && this.parkTypeScroll.refresh() && this.allTypesBox && this.allTypesBox.refresh() && this.yardBox &&
    //     //   this.yardBox.refresh() && this.lotBox && this.lotBox.refresh();
    //     // }
    //   }
    // },
  },

  activated() {
    let elBox = this.$refs.listView;
    this.boxTop = this.$refs.listView.offsetHeight;
    // 方法1：
    // this.elTop = 1;
    // elBox.style.top = this.boxTop + 'px';
    // this.$root.eventHub.$emit('mapHeight',this.elTop);
    // this.swiperOpacity = 1;
    // console.log(this.elTop);
    // console.log(this.boxTop);

    if(this.elTop == 1){
      common.setStorage('H5_listviewHeight',this.boxTop);  
    }else{
      this.boxTop = common.getStorage('H5_listviewHeight');
    }
    console.log(this.boxTop);
    // alert(this.boxTop);
    elBox.style.top = this.boxTop * this.elTop + 'px';
    // 表示 上拉加载 .4 的高度
    this.oldTop6 = Math.round(this.boxTop * 0.4);
  }
};
</script>
<style lang="stylus">
@import '../../common/css/base.stylus';
@import '../../common/css/mixin.stylus';

#list-view {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 100%;
  z-index: 1001;
  background-color: #F5F5F5;
  .type-bar {
    font-size: 1rem;
    color: #1a1a1a;
    font-weight: bold;
    padding: 0.45rem 0;
    border-top: 0.0625rem solid #e5e5e5;
    box-shadow: 0 1px 5px #3b4d9ced;

    .bar-items {
      border-right: 0.0625rem solid #ccc;

      span {
        display: inline-block;
        height: 2.1rem;
        line-height: 2.1rem;

        .bt-line {
          // width 0%
          height: 0.1875rem;
          border-radius: 0.09375rem;
          left: 0;
          bottom: 0;
          transform: translateY(50%);
          background-color: #d01c95;
          transition: all 0.3s;
          transform-origin: center right;
        }

        .ln-show {
          width: 100%;
        }

        .ln-hide {
          width: 0%;
        }
      }
    }
  }
  .vew-box {
    width: 100%;
    top: 3.125rem;
    bottom: 0;
    overflow: hidden;

    .park-type-wraper {
      width: 300%;
      height: 100%;

      .park-item-box {
        .each-type-box {
          width: 100%;
          top: 0;
          bottom: 0;
          overflow: hidden;

          .each-type-wraper {
            .each-type-item {
              padding: 0.875rem 0.9375rem;
              border-bottom: 0.0625rem solid #e6e6e6;
              background-color: #fff;

              .car-infotext {
                .car-name {
                  // font-size  1.1rem
                  color: #111111;
                  font-weight: 700;
                }

                .car-text {
                  padding: 0.125rem 0.25rem;
                  background-color: #f7bc41;
                  font-size: 0.625rem;
                  // margin-top 0.5rem
                  color: #fff;
                  text-align: center;
                  border-radius: 0.155rem;
                }

                .yard-bg {
                  background-color: #59c8f9;
                }

                .car-distance {
                  margin-left: 2.2rem;
                  font-size: 0.75rem;
                  // margin-top 0.6rem
                  color: #666666;
                }
              }

              .parks-fees {
                font-size: 0.625rem;
                color: #666666;
                margin-top: 0.5rem;

                .num {
                  color: #1a1a1a;
                }

                .link {
                  padding: 0 0.75rem;
                }
              }

              .left-local {
                margin-top: 0.5rem;
                margin-bottom: 0.2rem;
                padding-left: 1rem;
                font-size: 0.875rem;

                .local-img {
                  width: 0.75rem;
                  height: 0.85rem;
                  left: 0;
                  top: 50%;
                  transform: translateY(-50%);
                  bg-img('../../assets/img/home_vip');
                }

                .local-text {
                  // font-size: 0.875rem;
                  // color: #666666;
                  // one-wrap(100%);
                  font-size: 0.875rem;
                  color: #666;
                  max-width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  display: inline-block;
                  width: 100%;
                  vertical-align: middle;
                  padding-right: 3rem;
                }
              }

              .right-local {
                width: 2.0625rem;
                height: 2.8125rem;
                top: 50%;
                right: 0.875rem;
                transform: translateY(-50%);

                .locate-ic {
                  height: 2.0625rem;
                  bg-img('../../assets/img/icon_yue');
                }

                .guide-ic {
                  height: 2.0625rem;
                  bg-img('../../assets/img/icon_go');
                }

                .locate-info {
                  padding-top: 0.375rem;
                  font-size: 0.75rem;
                  color: #1a1a1a;
                }
              }
            }
          }
        }
      }
    }
  }

  .active {
    color: #d01c95;
  }

  .bd-no {
    border-right: none !important;
  }

  .bb-no {
    border-bottom: none !important;
  }
}

.mint-toast {
  position: fixed !important;
  z-index: 99999;
}

.divBox {
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
  z-index: 100;
}

.zIndexpa{
  position: absolute;
  height: 3rem;
  background-color: red;
  bottom: -3rem;
  left: 0;
  width:100%;
}

.isShowSwiper{
  display:none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0.5;
}
</style>


