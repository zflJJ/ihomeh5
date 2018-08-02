<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive exclude="exclude">
        <router-view class="child-view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import common from "./common/js/common";
import { Indicator, Toast, Button } from "mint-ui";
export default {
  name: "app",
  data() {
    return {
      transitionName: "slide-left"
    };
  },
  methods: {
    // 可以需要看看
    GetUrlParam(paraName) {
      var url = window.location.href;
      var arrObj = url.split("?");
      if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;
        for (var i = 0; i < arrPara.length; i++) {
          arr = arrPara[i].split("=");
          if (arr != null && arr[0] == paraName) {
            return arr[1];
          }
        }
        return "";
      } else {
        return "";
      }
    }
  },
  created() {
    
    let openId = this.GetUrlParam("openId");
    let unionId = this.GetUrlParam("unionId");
    let id = this.GetUrlParam("id");
    let type = this.GetUrlParam("type");
    let code = this.GetUrlParam("code");
    // 手机
    // 备注 判断参数是否存在（路由逻辑存在问题）
    common.setStorage('openId',openId);
    common.setStorage('unionId',unionId);
    sessionStorage.setItem('code',code);
    if (id != "") {
      // 从登陆界面进入的话
      sessionStorage.setItem('homeHeight',document.documentElement.clientHeight);
      common.setStorage("H5_user_id", id);
    }else{
      sessionStorage.setItem('homeHeight',document.documentElement.clientHeight);
    }
    if(type == 2){
      common.removeStorage('H5_user_id');
    }
    common.setStorage('type',type);
    //做浏览器兼容，吃力微信支付问题
    let u = window.navigator.userAgent;
    let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    let phoneNum = "";
    if (isiOS === true) {
      phoneNum = "iPhone";
    } else {
      let uArr = u.split(";");
      let len = null;
      for (let i = 0; i < uArr.length; i++) {
        if (uArr[i].indexOf("Build/") > 0) {
          len = i;
          break;
        }
      }
      phoneNum = uArr[len].substring(0, uArr[len].indexOf("Build/"));
    }
    common.setStorage("phoneNum", phoneNum);
    // 在这里做了重定向（从第三方链接跳转回来做了，跳转到了首页）
    let goToPage = sessionStorage.getItem('H5_goToAMap');
    if(goToPage == 1){
      sessionStorage.removeItem('H5_goToAMap');
      this.$router.push('/home');
    }
  },
  activated(){ 
  },
  computed: {
    exclude() {
      return this.$store.state.exclude;
    }
  },
  watch: {
    $route(to, from) {
      if (to.path == "/home") {
        /*给这个组件添加一个类名*/
        this.transitionName = "slide-left";
      } else {
        this.transitionName = "slide-right";
      }
    }
  }
};
</script>
<style lang="stylus">
#app {
  .child-view {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    transition: all 0.7s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    transform: translate(100%, 0);
  }

  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    transform: translate(-100% 0);
  }
}
</style>


