<template>
<div>
   <div id="home" ref="homeHeight">
    <div class="top header p-r" ref="headerHeight">
      <div class="top-bars flex">
        <div class="my" @click.prevent.stop="showMyAccount"><span></span></div>
        <div class="search-box fl-o"></div>
        <div class="search-btn list p-r"  @click="showSearchMode"><span class="p-a a-c"></span></div>
        <div class="news-btn list p-r"  @click="showMessages"><span class="p-a a-c"></span></div>
      </div>
      <div class="header-info p-a a-c"></div>
    </div>
    <AMap class="mapBox" :style="{height: mapHeight}"></AMap>
  </div>
</div>
</template>
<script>
import { Indicator, Toast } from "mint-ui";
import AMap from "./map";
import common from "../../common/js/common";
export default {
  name: "home",
  data() {
    return {
      searchVal: "", //搜索值
      appointTypeArr: ["共享车位", "约车位"],
      currentIndex: 0,
      priceMark: false, //车位/价格状态
      parkItems: [], //子组件传过来的停车数据
      searchTimer: "",
      mapHeight: null // 这个是设置地图高度的参数
    };
  },
  components: {
    AMap
  },
  
  computed: {},
  methods: {
    showSearchMode() {
       this.$router.push({
          name: "search"
        });
    },
    showMessages() {
      let urserId = common.getStorage("H5_user_id");
      if (!urserId) {
        this.$router.push("/login");
      } else {
        this.$router.push("/news");
      }
    },
    //点击跳转到我的账户(隐藏菜单列表)
    showMyAccount() {
      this.$router.push({
          name: "myAcount"
        });
    },
    //点击切换车位类型
    switchBookBars(index) {
      this.currentIndex = index;
    },
    //点击靶心初始化地图视图
    initView() {
      this.$root.eventHub.$emit("init-view");
    },
    resizeEvent(){
      var h = document.documentElement.clientHeight;
      sessionStorage.setItem('homeHeight', h);
      this.mapHeight = h - this.$refs.headerHeight.offsetHeight + 'px';
      this.$root.eventHub.$emit('send-height-listView',h - this.$refs.headerHeight.offsetHeight);
    }
  },
  created() {
    //地图定位失败后触发
    console.log('home.vue');
   
    this.$root.eventHub.$on("geo-location-err", e => {
      Toast({
        message: "地图定位失败",
        duration: 1000
      });
    });
  },
  mounted(){
  },
  activated() {
    // 监听窗口大小发生改变
    let _self = this;
    let id = common.getStorage('H5_user_id');
    window.addEventListener('resize',_self.resizeEvent,false);
    let homeHeight = sessionStorage.getItem('homeHeight');
    this.mapHeight = document.documentElement.clientHeight - this.$refs.headerHeight.offsetHeight + 'px'
  },
  beforeRouteLeave: (to, from, next) => {
    console.log(to.path,from.path);
    next();
  },
  deactivated(){
    console.log("离开这个页面要处理调这个函数");
    console.log(common.getStorage('phoneNum'));
    if(common.getStorage('phoneNum') != 'iPhone'){
      window.removeEventListener('resize',this.resizeEvent,false);
    }
  }
};
</script>
<style lang="stylus">
@import '../../common/css/base.stylus';
@import '../../common/css/mixin.stylus';

#home {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;

  .mapBox {
    width: 100%;
  }

  .top {
    position: fixed !important;
    top: 0;
    background-color: #fff;
    z-index: 999;

    .top-bars {
      height: 2rem;
      line-height: 2rem;

      .my {
        padding-left: 0.85rem;
        padding-right: 0.95rem;
        height: 100%;
        line-height: 1;
        padding-top: 0.28rem;

        span {
          display: inline-block;
          width: 1.5625rem;
          height: 1.5625rem;
          bg-img('../../assets/img/home_mine');
        }

        .bgImage {
          width: 1.375rem;
          height: 1.25rem;
          bg-img('../../assets/img/btn_back');
          // padding-top .3rem
        }
      }

      .search-box {
        height: 2rem;
        line-height: 2rem;
        padding-right: 0.9375rem;

        .search-comp {
          background-color: #e6e6e6;
          border-radius: 0.3125rem;

          .search-ic {
            width: 1rem;
            height: 1rem;
            top: 50%;
            left: 0.625rem;
            transform: translateY(-46%);
            // bg-img('../../assets/img/parking_seach')
          }

          .clear-sch {
            width: 0.8rem;
            height: 0.8rem;
            top: 50%;
            right: 0.625rem;
            transform: translateY(-50%);
            bg-img('../../assets/img/search_qingchu');
          }

          input {
            display: inline-block;
            padding-left: 2rem;
            height: 60%;
            width: 100%;
            font-size: 0.875rem;
            outline: none;
            border: none;
            color: #80666666;
            background-color: rgba(255 255 255 0);
          }

          input::-webkit-input-placeholder {
            color: #80666666;
          }
        }
      }

      .list {
        display: inline-block;
        text-align: center;
        width: 2rem;
        height: 100%;
      }

      .news-btn {
        width: 2.8rem;

        span {
          width: 1.25rem;
          height: 1rem;
          bg-img('../../assets/img/home_message');
        }
      }

      .search-btn {
        span {
          width: 1.25rem;
          height: 1.25rem;
          bg-img('../../assets/img/home_seach');
        }
      }
    }
  }

  .header-info {
    // width: 6.8rem;
    // height: 1rem;
    // bg-img('../../assets/img/jingtai_logo');
    width:4rem;
    height: 1.3125rem;
    bg-img('../../assets/img/logo');
  }
}

.book-bar {
  height: 3.125rem;
  line-height: 3.125rem;
  margin-top: 3.9375rem;

  div {
    height: 1.875rem;
    line-height: 1.875rem;
    font-weight: bolder;
    margin-top: 0.625rem;
  }

  .border-right {
    border-right: 0.0625rem solid #CCC;
  }

  .book-active {
    color: #D11D9A;
  }

  .bottom-bar {
    width: 50%;
    height: 0.1875rem;
    left: 0;
    bottom: 0;
    background-color: #D11D9A;
    transition: all 0.3s ease-in;
    transform: translateX(0);
  }

  .bottom-active {
    transform: translateX(100%);
  }
}

/* .floater
   width 1.5rem
   height 2.5rem
   bottom: 44%
   left: 11rem
   bg-img('../../assets/img/map_heart')
   z-index 1000 */
.list-show-enter-active, .list-show-leave-active {
  transition: all 0.5s ease;
  transform-origin: top right;
}

.list-show-enter, .list-show-leave-to {
  transform: scale3d(0, 0, 1);
}

.list-show-enter-to, .list-show-leave {
  transform: scale3d(1, 1, 1);
}
</style>
