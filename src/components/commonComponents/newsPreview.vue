<template>
  <div id="news-preview" class="clearfix" v-show="!preNewsObj.isHiden">
    <div class="prenew-swiper-container" ref="preNewsSwipper">
      <div class="swiper-wrapper" @click.stop.prevent="goOrderInfo()">
        <div class="swiper-slide">
          <div class="list-item t-c">
            <div class="item-content p-r">
              <!-- {{preNewsObj.info}} -->
              <span v-if="preNewsObj.state == 1300">已为您保留车位，请在5分钟内完成支付。</span>
              <span v-if="preNewsObj.state == 1301">车位预约成功，入场时间{{preNewsObj.hours}}点{{preNewsObj.miunte}}分。</span>
              <span v-if="preNewsObj.state == 1302">您已停车 {{hours1302}} 时 {{miunte1302}} 分。</span>
              <span v-if="preNewsObj.state == 1303">您有待支付订单，记得支付哦！</span>
              <!-- <span class="ms-detail">，点击查看详情</span> -->
              <!-- <span class="hide-ic p-a" @click.stop.prevent="closeNews()"></span> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getMyPreNews } from "../../server/getData";
import { Toast } from "mint-ui";
import Swiper from "swiper";
import { formatTimeStamp } from "../../common/js/H5plugin";
import common from "../../common/js/common";
export default {
  name: "newsPreview",
  data() {
    return {
      preNewsObj: null, //返回的消息对象
      mySwiper: null, //轮播实例化对象
      preNewsObj: {
        isHiden: true
      },
      timeId1302: null, // 定时器的Id
      hours1302: '00',
      miunte1302:'00'
    };
  },
  // 通过计算属性计算时间
  computed:{
    // hours1302(){
    //   // let timeSecode = Math.floor(this.seconde1302/1000)
    //   let hour = Math.floor(this.seconde1302 / 3600)
    //   return hour < 10 ? '0' + hour : hour
    // },
    // miunte1302(){
    //   console.log(this.seconde1302)
    //   // let timeSecode = Math.floor(this.seconde1302/1000)
    //   let miute = Math.floor((this.seconde1302 % 3600) / 60)
    //   console.log(miute)
    //   return miute < 10 ? '0' + miute : miute
    // },
  },
  methods: {
    //跳转到订单详情页面
    goOrderInfo() {
      // 这个地方需要看看
      localStorage.setItem("H5_orderId",JSON.stringify(this.preNewsObj.orderId));
      if (this.preNewsObj.state === 1301 || this.preNewsObj.state === 1302) {
        common.setStorage("H5_ls_flag", true);
        this.$router.push("appointInfo");
      } else {
        common.setStorage("H5_ls_flag", true);
        this.$router.push("orderInfo");
      }
    },
    //关闭该条消息
    closeNews(key) {
      this.$set(this.preNewsObj, "isHiden", true);
    },
    //获取我的消息预览
    async getNews() {
      let userId = common.getStorage("H5_user_id");
      if (!userId) {
        this.$set(this.preNewsObj, "isHiden", true);
        return;
      }
      let res = await getMyPreNews(userId);
      if (res.error_code == 2000) {
        if (!res.data) {
          this.$set(this.preNewsObj, "isHiden", true);
          this.$set(this.preNewsObj, "info", "");
          return;
        } else {
          this.preNewsObj = Object.assign({}, res.data);
          this.$set(this.preNewsObj, "isHiden", false);
          console.log(this.preNewsObj);
          // 处理时间
          this.getPreNewsInfo();
        }
      } else {
        Toast({
          message: "获取个人消息信息失败",
          duration: 1500
        });
      }
    },
    //获取消息内容
    getPreNewsInfo() {
      let _self = this;
      // 1300表示已预留（未支付预约费），1301表示已预约，1302表示已停车，1303表示已离开未支付
      console.log(formatTimeStamp(_self.preNewsObj.startTime));
      switch (_self.preNewsObj.state) {
        case 1300: // 预约未支付
          break;
        case 1301: // 已预约  11 .45
          let hours = formatTimeStamp(_self.preNewsObj.startTime).substr(11, 2);
          let miunte = formatTimeStamp(_self.preNewsObj.startTime).substr(14,2);
          _self.$set(this.preNewsObj, "hours", hours);
          _self.$set(this.preNewsObj, "miunte", miunte);
          break;
        case 1302:
         // 1. 页面后台运行时，打开之后，从新计算值； 2. 跳转到首页之后从新请求数据 3. 在当前页面的时候，开启一个定时器去计算 4. 离开这个页面的时候，关闭这个定时器
           if(this.timeId1302){
            clearInterval(this.timeId1302);
          }
          document.addEventListener("visibilitychange", _self.documentEvent,false);
          common.setStorage("H5_home_stoptime", _self.preNewsObj.stopTime);
          _self.seconde1302 = Math.round(_self.preNewsObj.stopTime/1000);
          _self.addTime();
          break;
        case 1303: // 停车未支付  （把这个改好）
          _self.$set(_self.preNewsObj, "info", "您有待支付订单，记得支付哦！");
          break;
      }
    },

    // 停车时间累加操作
    addTime() {
      if(this.timeId1302){
        clearInterval(this.timeId1302);
      }
      this.timeId1302 = setInterval(() => {
        this.seconde1302++
        let hour = Math.floor(this.seconde1302 / 3600)
        let miute = Math.floor((this.seconde1302 % 3600) / 60)
        this.hours1302 = hour < 10 ? '0'+hour : hour
        this.miunte1302 =  miute < 10 ? '0' + miute : miute
      }, 1000);
    },
    // 添加一个浏览器页面打开的 事件
    documentEvent() {
      let vm = this;
      if (document.visibilityState == "visible") {
        vm.getNews();
      } else {
        console.log("关闭了");
      }
    }
  },
  activated() {
    this.getNews();
  },
  created() {
    this.$root.eventHub.$on('getnews',()=>{
      this.getNews();
    });
  },
  deactivated() {
    if(this.timeId1302){
      clearInterval(this.timeId1302);
    }
    document.removeEventListener("visibilitychange", this.documentEvent,false);
  },
  beforeRouteEnter: (to, from, next) => {
    next();
  }
};
</script>
<style lang="stylus">
@import '../../common/css/base.stylus';
@import '../../common/css/mixin.stylus';

#news-preview {
  position: absolute !important;
  top: 0.5625rem;
  width: 100%;
  overflow: hidden;
  color: #1a1a1a;

  .list-item {
    .item-content {
      display: inline-block;
      width: 80%;
      background-color: rgba(0, 0, 0, 0.7);
      height: 2.2rem;
      line-height: 2.2rem;
      padding: 0 1.25rem;
      color: #fff;
      font-weight: bold;
      font-size: 0.8rem;
      border-radius: 1.1rem;

      .ms-detail {
        color: #d01c95;
      }

      .hide-ic {
        width: 0.8rem;
        height: 0.8rem;
        right: 1.1rem;
        top: 50%;
        transform: translateY(-50%);
        bg-img('../../assets/img/home_close');
      }
    }
  }
}
</style>


