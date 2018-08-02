<template>
  <div id="my-acount" ref="myacount">
    <!-- <sub-header :headerMark="headerMark"></sub-header> -->
    <div class="center-head p-r">
      <div class="bc-ic p-a"></div>
      <div class="text-info">个人中心</div>
      <div class="setting-ic p-a"></div>

      <div class="info-box name clearfix p-r">
        <div class="touxiang f-l p-r">
          <div class="tx-img p-a" :class="{'default-img':showDefaultImg}" ref="txImg"></div>
        </div>
        <div class="phone f-l">{{loginInfo}}</div>
        <div class="tuxiang-box p-a" @click.stop.prevent="portraitAct"></div>
      </div>

      <div class="bc-ic-box p-a" @click="goBack"></div>
      <div class="setting-ic-box p-a" @click="goSettings"></div>
    </div>
    <div class="content-box" ref="acountBox">
      <div>
        <div>
          <div class="acount-involve-box">
            <div class="acount-involve flex">
              <div class="wallet invol-item fl-o t-c" @click="goWallet">
                <div class="ic-box t-c">
                  <span class="ic"></span>
                </div>
                <div class="info">我的钱包</div>
              </div>
              <div class="coups invol-item fl-o t-c p-r" @click="goCounp">
                <div class="ic-box t-c">
                  <span class="ic"></span>
                </div>
                <div class="info">我的卡券</div>
                <span class="counp-num p-a t-c" v-show="showCounpsActive">{{myCounps}}</span>
              </div>
              <div class="activity fl-o t-c" @click="goActivity">
                <div class="ic-box t-c">
                  <span class="ic"></span>
                </div>
                <div class="info">我的活动</div>
              </div>
            </div>
          </div>
          <div class="board content-tp">
            <div class="appoint list-tp clearfix bb-1px" @click="goAppoint">
              <span class="ic f-l"></span>
              <span class="info f-l p-r">我的预约
                <span class="info-tip p-a" v-show="appointTime"></span>
              </span>
              <span class="counts f-r" v-show="appointTime">{{appointTime}}</span>
            </div>
            <div class="car list-tp clearfix bb-1px" @click="goCar">
              <span class="ic f-l"></span>
              <span class="info f-l">我的车辆</span>
            </div>
            <div class="pub-park list-tp clearfix bb-1px" @click="goPubParks">
              <span class="ic f-l"></span>
              <span class="info f-l">发布车位</span>
            </div>
            <div class="my-orders list-tp clearfix bb-1px" v-if="false">
              <span class="ic f-l"></span>
              <span class="info f-l">订单管理</span>
              <span class="counts f-r">{{myAcounts}}</span>
            </div>
          </div>
          <!-- <div class="quit-login" ><span @click="loginAction">{{loginInfo}}</span></div> -->
          <div class="customer-service-box">
            <div class="customer-service flex">
              <div class="on-line fl-o p-r" @click="goKefu">
                <div class="ic-box t-c">
                  <div class="ic"></div>
                </div>
                <div class="info t-c">在线客服</div>
                <!-- <a class="p-a" v-if="isLogined == true" href="http://a1.7x24cc.com/phone_webChat.html?accountId=N000000011788&chatId=qhay-288cd7e0-c36d-11e7-bf97-17037689c9d5"></a> -->
              </div>
              <div class="suggesstions fl-o" @click="goSuggestions">
                <div class="ic-box t-c">
                  <div class="ic"></div>
                </div>
                <div class="info t-c">意见反馈</div>
              </div>
              <div class="call fl-o p-r">
                <div class="ic-box t-c">
                  <div class="ic"></div>
                </div>
                <div class="info t-c">呼叫客服</div>
                <a class="p-a" href="tel:400-815 5588"></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <portraitAction :sheetVisible="sheetVisible" :portraitMark="portraitMark">
    </portraitAction>
  </div>
</template>
<script>
import Vue from "vue";
// import axios from 'axios'
import subHeader from "../commonComponents/subHeader";
import portraitAction from "../commonComponents/portraitAction";
import BScroll from "better-scroll";
// import {getMyAcounts,getMyCounps} from '../../server/getData';
import { getMyPersonnalInfo, uploadMyImg } from "../../server/getData";
import baseUrl from "../../server/baseURL";
import { Toast, Indicator } from "mint-ui";
// import saveConfirm from '../savetyConfirms/savetyConfirm';
import { setTimeout } from "timers";
import { escape } from "querystring";
import common from "../../common/js/common";
/*使用了axios配置*/
// axios.defaults.timeout = 2000
// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
// axios.defaults.withCredentials = true

export default {
  name: "myAcount",
  data() {
    return {
      cellPhone: "400-815 5588",
      myAcounts: "", //账户余额
      myCounps: "", //优惠券
      headerMark: "我的账户",
      isLogined: true, //判断是否登录的状态
      phoneNum: "", //登录的手机号码
      sheetVisible: false, //点击头像底部弹框显示/隐藏
      appointTime: "", //已预约时间状态
      showCounpsActive: false, //显示有卡券的状态
      showDefaultImg: true, //默认图像图片
      portraitMark: "个人中心",
      userId: null, // 用户Id\
      href: null // 在线客服
    };
  },
  computed: {
    loginInfo() {
      //直接是跳转到登陆界面
      let info = "";
      if (!this.isLogined) {
        info = "登录注册";
      } else {
        info = this.phoneNum + "";
        info = info.substr(0, 3) + "****" + info.substr(7);
      }
      return info;
    }
  },
  components: {
    portraitAction
  },
  methods: {
    //添加滚动事件
    _initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.acountBox, {
            probeType: 3,
            scrollY: true,
            click: true
            // scrollbar:true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    //返回
    goBack() {
      this.$router.push("home");
    },
    //点击头像
    portraitAct() {
      if (!this.isLogined) {
        this.$router.push("/login");
        // this.$router.push('settingMore');
      } else {
        this.sheetVisible = true;
      }
    },
    //跳转到setting页面
    goSettings() {
      // this.$root.eventHub.$emit('judge-login-state');
      this.$router.push({
        name: "settingMore",
        params: {
          isLogined: this.isLogined
        }
      });
    },
    //跳转到我的钱包页面
    goWallet() {
      if (!this.isLogined) {
        this.$router.push("/login");
      } else {
        Toast({
          message: "钱包功能暂未开放，敬请期待！",
          duration: 1000
        });
      }
    },
    //跳转到活动页面
    goActivity() {
      if (!this.isLogined) {
        this.$router.push("/login");
      } else {
        this.$router.push("/activities");
      }
    },
    //跳转到意见反馈页面
    goSuggestions() {
      if (!this.isLogined) {
        this.$router.push("/login");
      } else {
        this.$router.push("/suggestions");
      }
    },
    //发布车位
    goPubParks() {
      if (!this.isLogined) {
        this.$router.push("/login");
      } else {
        Toast({
          message: "车位发布功能暂未开放，敬请期待！",
          duration: 1000
        });
      }
    },
    //跳转到预约列表页面
    goAppoint() {
      if (!this.isLogined) {
        this.$router.push("/login");
      } else {
        this.$router.push("/appointment");
      }
    },
    //跳转到优惠券列表页面
    goCounp() {
      if (!this.isLogined) {
        Toast({
          message: "请先登录",
          duration: 1000
        });
        setTimeout(() => {
          this.$router.push({
            path: "/login"
          });
        }, 1200);
        return false;
      }
      // localStorage.setItem('counpFlag',-1);
      common.setStorage("counpFlag", -1);
      this.$router.push({
        path: "/counp"
      });
    },
    //跳转到我的车辆页面
    goCar() {
      if (!this.isLogined) {
        this.$router.push("/login");
      } else {
        this.$router.push({
          name: "car",
          params: {
            from: "myAcount"
          }
        });
      }
    },
    // 跳转到在线客服
    goKefu() {
      if (!this.isLogined) {
        this.$router.push("/login");
      }else{
        sessionStorage.setItem('H5_goToAMap','1');
        window.location.href = 
 "http://a1.7x24cc.com/phone_webChat.html?accountId=N000000011788&chatId=qhay-288cd7e0-c36d-11e7-bf97-17037689c9d5&chatType=weChat&customerId="+this.phoneNum
+'&nickName='+this.phoneNum;

      }
    },
    //设置默认头像
    setDefaultImg(imgUrl) {
      // debugger
      if (!imgUrl || imgUrl == "") {
        this.showDefaultImg = true;
      } else {
        this.showDefaultImg = false;
        this.$refs.txImg.style.backgroundImage = 'url("' + imgUrl + '")';
      }
    },
    //获取个人中心信息
    async getPersonalInfo() {
      let userId = JSON.parse(localStorage.getItem("H5_user_id"));
      // alert(userId);
      // alert(JSON.stringify(userId));
      this.userId = userId;
      console.log(this.showDefaultImg);
      if (!userId) {
        (this.myAcounts = ""), (this.myCounps = "");
        this.showCounpsActive = false;
        console.log(this.showDefaultImg);
        this.$refs.txImg.style.backgroundImage = null;
      } else {
        let res = await getMyPersonnalInfo(userId);
        if (res && res.error_code == 2000) {
          Indicator.close();
          this.phoneNum = res.data.phone;
          this.myCounps = res.data.couponCount;
          this.appointTime = res.data.reservePeriod;
          if (!this.myCounps || this.myCounps == "") {
            this.showCounpsActive = false;
          } else {
            this.showCounpsActive = true;
          }
          //设置默认头像
          this.setDefaultImg(res.data.avatarPath);
        } else {
          Indicator.close();
          Toast({
            message: "获取个人信息失败",
            duration: 1000
          });
        }
      }
    },
    //图片上传
    upLoadImg(fileObj) {
      let URL = baseUrl.requestUrl;
      let userId = JSON.parse(localStorage.getItem("H5_user_id"));
      let formData = new FormData();
      formData.append("file", fileObj.file,fileObj.name);
      formData.append("user_id", userId);
      formData.append("timestamp", String(+new Date()));
      let config = {
        headers: {
          "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递
        }
      };
      this.$root.eventHub.$http
        .post(URL + "apiwrite/user/avatar/upload", formData, config)
        .then(res => {
          this.$refs.txImg.style.backgroundImage =
            'url("' + fileObj.imgURL + '")';
          Toast({
            message: "图像上传成功",
            duration: 1000,
            iconClass: "icon icon-success"
          });
          // console.log(res)
        })
        .catch(() => {
          // Toast({
          //   message:'图像上传失败',
          //   duration: 1000
          // })
        });
    }
  },
  activated() {
    let userId = JSON.parse(localStorage.getItem("H5_user_id"));
    this.phoneNum = JSON.parse(localStorage.getItem("userPhone"));
    // debugger
    // console.log(isLogined);
    if (!userId) {
      this.isLogined = false;
      this.showDefaultImg = true;
    } else {
      this.isLogined = true;
    }
    this.getPersonalInfo();
    this._initScroll();
  },
  created() {
    //取消图像拍照等组件
    this.$root.eventHub.$on("cancel-portrait", () => {
      this.sheetVisible = false;
    });
    //选择上传图片
    this.$root.eventHub.$on("upload-img", e => {
      // debugger
      this.sheetVisible = false;
      // this.$refs.txImg.style.backgroundImage = 'url("'+ e +'")';
      this.upLoadImg(e);
    });
  },
  //
  deactivated() {
    this.showDefaultImg = true;
    this.$destroy(true);
  }
};
</script>
<style lang="stylus">
@import '../../common/css/base.stylus';
@import '../../common/css/mixin.stylus';

#my-acount {
  background-color: #F5F5F5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;

  .acount-involve-box {
    padding: 0.75rem 0;

    .acount-involve {
      background-color: #fff;
      padding: 1.25rem 0;

      .wallet {
        .ic {
          bg-img('../../assets/img/mine_wallet');
        }
      }

      .coups {
        .ic {
          bg-img('../../assets/img/mine_coupon');
          height: 1.3rem !important;
          margin-top: 0.2rem;
        }

        .counp-num {
          width: 0.85rem;
          height: 0.85rem;
          line-height: 0.85rem;
          // right: 28%;
          // top: -13%;
          background-color: #d01c95;
          color: #fff;
          font-size: 0.625rem;
          border-radius: 50%;
        }

        @media screen and (min-width: 300px) and (max-width: 350px) {
          .counp-num {
            right: 25%;
            top: -12%;
          }
        }

        @media screen and (min-width: 350px) and (max-width: 800px) {
          .counp-num {
            right: 30%;
            top: -12%;
          }
        }
      }

      .activity {
        .ic {
          bg-img('../../assets/img/mine_activity');
        }
      }

      .ic-box {
        margin-bottom: 0.6rem;

        .ic {
          display: inline-block;
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
  }

  .content-tp {
    padding-left: 0.6rem;
    background-color: #FFF;
    border-top: 1px solid #F5F5F5;
    border-bottom: 1px solid #F5F5F5;
  }

  // .money
  // // margin-top 4.75rem
  // /*height: 3.5rem*/
  // .boarding
  // .ic
  // bg-img('../../assets/img/parting_mine_order')
  .board {
    // margin-top .8125rem
    .appoint {
      .ic {
        bg-img('../../assets/img/mine_time');
      }

      .counts {
        // color #CF1C94
        color: #999;
      }

      .info-tip {
        width: 0.5rem;
        height: 0.5rem;
        right: -0.8rem;
        top: 1.3rem;
        background-color: #CF1C94;
        border-radius: 50%;
      }
    }

    .car {
      .ic {
        bg-img('../../assets/img/mine_car');
      }
    }

    .pub-park {
      .ic {
        bg-img('../../assets/img/mine_lot');
      }
    }

    .my-orders {
      .ic {
        bg-img('../../assets/img/mine_wallet_bill');
        margin-top: 1.3rem;
      }
    }
  }

  .customer-service-box {
    padding: 0.9375rem 3.125rem;

    .customer-service {
      .on-line {
        .ic {
          bg-img('../../assets/img/mine_im');
        }

        a {
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
        }
      }

      .suggesstions {
        .ic {
          bg-img('../../assets/img/mine_objection');
        }
      }

      .call {
        .ic {
          bg-img('../../assets/img/mine_call');
        }

        a {
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      }

      .ic {
        display: inline-block;
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  }

  .quit-login {
    margin-top: 2rem;
    margin-bottom: 2rem;
    height: 2.8rem;
    line-height: 2.8rem;
    text-align: center;

    span {
      display: inline-block;
      width: 50%;
      margin: 0 auto;
      bg-img('../../assets/img/Background');
      color: #ffffff;
      font-size: 1rem;
      font-weight: normal;
      text-align: center;
      border-radius: 1.4rem;
    }
  }

  .list-tp {
    height: 4rem;
    /* background-color red */
    line-height: 4rem;

    .ic {
      width: 1.25rem;
      height: 1.25rem;
      margin-left: 0.7rem;
      margin-top: 1.4rem;
    }

    .info {
      margin-left: 0.8125rem;
      font-size: 1rem;
    }

    .counts {
      color: #999;
      margin-right: 1rem;
    }
  }

  .bb-1px {
    border-bottom: 0.0625rem solid #F5F5F5;
  }

  .copy-right {
    width: 100%;
    font-size: 0.75rem;
    color: #9B9B9B;
    // margin-top 1rem
    bottom: 0;

    a {
      font-size: 0.875rem;
      color: #95D6F6;
    }

    .info {
      margin: 0.6rem auto;
    }
  }

  .content-box {
    position: absolute;
    width: 100%;
    top: 6.25rem;
    // bottom 4.5rem
    bottom: 0;
    overflow: hidden;
  }

  .center-head {
    height: 8rem;

    .text-info {
      position: absolute;
      left: 40%;
      top: 1rem;
      color: #fff;
      font-size: 1rem;
    }

    bg-img('../../assets/img/mine_bg');

    .bc-ic {
      top: 0.8rem;
      left: 1rem;
      width: 0.72rem;
      height: 1.35rem;
      bg-img('../../assets/img/parting_back');
    }

    .setting-ic {
      width: 1.5rem;
      height: 1.5rem;
      top: 0.8rem;
      right: 1rem;
      bg-img('../../assets/img/mine_setting');
    }

    .bc-ic-box {
      width: 2.1rem;
      height: 2.1rem;
      top: 0;
      left: 0;
      // background-color yellow
    }

    .setting-ic-box {
      width: 2.5rem;
      height: 2.5rem;
      top: 0;
      right: 0;
    }

    .info-box {
      padding: 2.7rem 0.9375rem 0.75rem 0.9375rem;
      height: 3.4375rem;
      line-height: 3.4375rem;

      .touxiang {
        display: inline-block;
        width: 3.4375rem;
        height: 3.4375rem;
        // padding .1rem
        // line-height 3.4375rem
        border-radius: 50%;
        text-align: center;
        background-color: #fff;

        .tx-img {
          // display inline-block
          width: 3.2375rem;
          height: 3.2375rem;
          border-radius: 50%;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 100% 100%;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
          vertical-align: middle;
        }

        .default-img {
          background-image: url('../../assets/img/mine_touxiang@2x.png');

          @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
            background-image: url('../../assets/img/mine_touxiang@3x.png');
          }
        }
      }

      .phone {
        margin-left: 0.625rem;
        font-size: 1rem;
        color: #ffffff;
        font-weight: normal;
      }

      .tuxiang-box {
        width: 35%;
        height: 3.2375rem;
        top: 65%;
        left: 0;
      }
    }
  }
}
</style>








