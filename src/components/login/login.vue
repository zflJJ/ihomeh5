<template>
  <div id="app">
    <!--小叉，点击小叉隐藏其他页面显示主页面-->
    <div class="close-login" @click="closeLoginEvent"></div>
    <div class="login-ic-box t-c">
      <span class="login-ic"></span>
    </div>
    <div class="login">
      <div class="phone test-input p-r">
        <span class="phone-ic input-ic p-a"></span>
        <input class="phone" v-model="phoneNumber" type="number" placeholder="手机号码" @input="getPhoneList">
        <!--这里需要有一个两倍图 和 3倍图  需要对类名做判断-->
        <template v-if="isclosephone">
          <img srcset="../../assets/img/btn_close@2x.png 2x, ../../assets/img/btn_close@3x.png 3x" alt="" class="imgsrc" @click="closephone">
        </template>

        <div class="alert-phone">
          <ul>
            <li v-for="(item,index) in phoneArr" :key="index" @click="getItem(item)">{{item}}</li>
          </ul>
        </div>
      </div>
      <div class="code test-input p-r">
        <span class="code-ic input-ic p-a"></span>
        <input class="code" type="number" v-model="code" placeholder="验证码" @input="inputCodeEvent">

        <!--这里需要一个2倍图 和 3 倍图-->
        <template v-if="isclosecode">
          <img srcset="../../assets/img/btn_close@2x.png 2x, ../../assets/img/btn_close@3x.png 3x" alt="" class="imgsrc" @click="closeCode">
        </template>
        &nbsp;
        <!--图形验证码插件-->
        <div class="code-plugin" @click="refreshCode" v-if="iscodeplugin == true">
          <s-identify :identifyCode="identifyCode" :contentWidth="80" :contentHeight="34"></s-identify>
        </div>
        <template v-else-if="iscodeplugin == false">
          <span class="get-code-btn p-a t-c" @click="getCode">{{getCodeInfo}}</span>
        </template>
        <!--获取验证码的地方-->
      </div>
      <div class="login-btn t-c" @click="loginIn">登录</div>
      <div class="accession t-c" @click="toServer">点击登录默认同意
        <span>《服务协议》</span>
      </div>
    </div>
  </div>
</template>

<script>
//代码更新11111
/*这里有一个状态码保存的东西*/
import saveConfirm from "../savetyConfirms/savetyConfirm";
import { sendCodes, signInUsers, getPhoneCode } from "../../server/getData";
import { Indicator,Toast } from "mint-ui";
import common from "../../common/js/common";
import Qs from "qs";
import baseUrl from "../../server/baseURL";
// 导入图形验证码插件
import SIdentify from "../commonComponents/identify.vue";
export default {
  name: "App",
  data() {
    return {
      phoneNumber: null, //用户输入的手机号
      code: "", //用户输入的验证码
      codeBack: false, //是否已经成功推送短信验证码
      randerCodes: "", //系统随机生成的六位验证码
      codeCounts: 0, //点击获取验证码的次数统计,
      // savetyConfirmShowed:false,  //安全验证展示
      isGettingCodes: false, //是否正在获取验证码状态
      counts: "", //验证码读秒
      // serveUrl: baseUrl.requestUrl + "apiwrite/AppMobile/service_protocol.html",
      // serveUrl: null,
      timer: null,
      phoneList: null, // 是存储在localStorage中的数据
      phoneArr: null, // 在input框中显示的数据
      isclosecode: false, // 验证码的关闭小叉
      isclosephone: false, // 用户名的小叉
      iscodeplugin: false, // 表示图形验证码是否显示
      error_code: null, //用来验证是否要启用防刷验证
      anti: 0, // 更改变量的值
      /*———图形验证码插件的数据—————*/
      identifyCodes: "1234567890",
      identifyCode: "",
      pagechange: false, // 表示页面是否后台运行过
      getSecond: null, //表示页面在后台运行的时间
      isGetCode: true, // 表示能否获取验证码（默认进来是可以获取验证码的）
      winHeight: null, // 屏幕高度
      toPath: null,
    };
  },

  components: {
    saveConfirm
  },

  /*—————图形验证码的的方法start——————*/
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  /*—————图形验证码的的方法end——————*/

  methods: {
    // 通过点击跳转到第三方页面上去，要保存一下输入的手机号码, 不管是否录入完成
    toServer() {
      if (this.phoneNumber) {
        common.setStorage("userPhone", this.phoneNumber);
      }
      window.location.href = baseUrl.serverUrl;
    },
    /*——————图形验证码方法start——————*/
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
      console.log(this.identifyCode);
    },
    /*——————图形验证码方法end——————*/
    // 点击右上角删除按钮的时候********************这里还是要做更改
    closeLoginEvent() {
      // 这里要将这个这个页面的数据给清空掉  (手机上面需要)
      // let typeStr = common.getStorage('type');
      // let num = typeStr.indexOf('2');
      // // let type = typeStr.substring(0,num);
      // // alert(JSON.stringify(type));
      // if(typeStr == 2){
      //   Toast('管理员没有权限');
      //   return;
      // }
      clearInterval(this.timer);
      this.code = "";
      this.isGettingCodes = false; // 显示获取验证码按钮
      this.iscodeplugin = false; // 隐藏图形验证码
      this.isclosecode = false; // 验证码的关闭小叉
      this.isclosephone = false; // 用户名的小叉
      console.log(this.toPath);
      let type = common.getStorage('type');
      this.$router.push(this.toPath);
    },
    // 当输入验证码的时候
    inputCodeEvent() {
      let code = this.code.trim();
      if (code.length > 4) {
        this.code = code.substr(0, 4);
      }
      if (this.code === null || this.code === "") {
        this.isclosecode = false;
      } else {
        this.isclosecode = true;
      }
    },
    // 清空验证码
    closeCode() {
      this.code = null; // 输入框的内容为空
      this.isclosecode = false;
    },
    // 关闭账户框
    closephone() {
      this.phoneNumber = null;
      this.phoneArr = null;
      this.isclosephone = false;
    },
    // @click事件getItem（item）  这个是用来获取li标签中的数据放置到phone框中
    getItem(item) {
      this.phoneNumber = item;
      this.phoneArr = null;
    },
    // 动态遍历 phoneList
    getPhoneList() {
      // console.log(this.phoneNumber);
      let phoneNumber = this.phoneNumber.trim();
      if (phoneNumber.length > 11) {
        this.phoneNumber = phoneNumber.substr(0, 11);
      }
      if (this.phoneNumber !== null && this.phoneNumber !== "") {
        this.isclosephone = true;
      } else {
        this.isclosephone = false;
      }
      var arr = [];
      /*动态生成一个表达式*/
      var reg = new RegExp("^" + this.phoneNumber);
      // console.log(this.phoneList);
      if (this.phoneList === null) {
        return;
      } else {
        for (var i = 0; i < this.phoneList.length; i++) {
          //如果字符串中不包含目标字符会返回-1
          // console.log(this.phoneList[i].match(reg));
          if (
            this.phoneList[i].match(reg) !== null &&
            this.phoneList[i].match(reg)[0] !== ""
          ) {
            arr.push(this.phoneList[i]);
          }
        }
        this.phoneArr = arr;
      }
    },

    /*数组去重这是海中这边传递的*/
    unique5(array) {
      var r = [];
      for (var i = 0, l = array.length; i < l; i++) {
        for (var j = i + 1; j < l; j++) if (array[i] === array[j]) j = ++i;
        r.push(array[i]);
      }
      return r;
    },

    async loginPhone() {
      /*更改了发送请求的方式*/
      let phoneModel = common.getStorage("phoneNum");
      let ip = common.getStorage("mobileId");
      let openId = common.getStorage("openId");
      let unionId = common.getStorage("unionId");
      if (phoneModel == null || "") {
        phoneModel = null;
      } else if (ip == "") {
        ip = null;
      } else if (openId == "") {
        openId = null;
      } else if (unionId == "") {
        unionId = null;
      }
      let params = {
        phone: this.phoneNumber,
        jpush_id: "H5",
        identification: "H5",
        ip: ip,
        phoneModel: phoneModel,
        openId: openId,
        unionId: unionId,
        timestamp: new Date().getTime()
      };
      // alert(JSON.stringify(params));
      var res = await signInUsers(params);
      // console.log(res);
      // alert(JSON.stringify(res));
      if (res.error_code == 2000) {
        if (res.data.user.type == 2) {
          Toast("暂不支持管理员用户登录。");
          return;
        } else {
          // alert(JSON.stringify(res.data.user.id));
          common.setStorage("userPhone", this.phoneNumber);
          common.setStorage("H5_user_id", res.data.user.id);
          // alert(JSON.stringify(common.getStorage('H5_user_id')));
          //对登陆的账号做一个缓存操作
          if (localStorage.getItem("Phone_List") !== null) {
            var arr = localStorage.getItem("Phone_List").split(",");
            if (arr.length > 4) {
              arr.shift();
            }
            arr.push(this.phoneNumber);
            var array = this.unique5(arr);
            localStorage.setItem("Phone_List", array);
          } else {
            var arr = new Array();
            arr.push(this.phoneNumber);
            localStorage.setItem("Phone_List", arr);
          }
          // 对用户的ID进行存储
          common.setStorage("H5_setting", 1);
          setTimeout(() => {
            this.$router.push(this.toPath);
          }, 20);
          
        }
      } else if (res.error_code === 2101) {
        Toast("电话号码错误");
        return;
      } else {
        Toast(res.error_message);
        return;
      }
    },

    //  用户获取验证码 做的两件事 判断电话号码是否正取，然后短信60s倒计时
    //  javascript 中所有的事件都是 异步事件操作机制  
    //  这里对发送请求做了限制，只有倒计时结束，或者是在在防刷验证成功的时候，才能够重新请求数据
    getCode(e) {
      console.log(this.isGettingCodes);
      console.log(this.iscodeplugin);
      if (this.isGetCode == true) {
        this.isGetCode = false;
        if (this.phoneNumber === "" || this.phoneNumber === null) {
          Toast("请输入正确的手机号码");
          return;
        } else if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phoneNumber.trim())) {
          Toast("请输入正确的手机号码");
          return;
        } else if (this.isGettingCodes) {
          return;
        }
        // 对账户信息验证完成开始倒计时，并且请求验证码
        this.sendRanderCodes();
      }
    },
    //短信读秒
    timeCount() {
      let seconds = 60;
      // 这里定义一个事件
      // clearInterval(this.timer);
      document.addEventListener("visibilitychange", this.documentEvent);
      this.timer = setInterval(() => {
        this.isGettingCodes = true;
        seconds--;
        console.log(seconds);
        if (this.pagechange) {
          this.pagechange = false;
          seconds = seconds - this.getSecond;
        }
        this.counts = seconds + "s";
        if (seconds <= 0) {
          seconds = 0;
          clearInterval(this.timer);
          this.isGettingCodes = false;
          this.isGetCode = true;
        }
      }, 1000);
    },
    // 向用户账户（phoneNumber） 发送验证码
    async sendRanderCodes() {
      var res = await getPhoneCode(this.phoneNumber, this.anti);
      if (res.error_code === 2004) {
        this.error_code = 2004;
        this.iscodeplugin = true;
        this.randerCodes = "";
      } else if (res.error_code === 2000) {
        this.timeCount();
        this.randerCodes = res.data.code;
        this.iscodeplugin = false;
      } else {
        Toast(res.error_message);
      }
    },
    //用户登录
    loginIn() {
      // 如果启用了防刷模式，开启验证图形验证码
      if (this.iscodeplugin === true) {
        if (this.code === "" || this.code !== this.identifyCode) {
          Toast("请输入正确的验证码");
          return;
        } else {
          this.isGettingCodes = false; // 显示获取验证码按钮
          this.iscodeplugin = false; // 隐藏图形验证码
          this.anti = 1; // 启用防刷验证
          this.code = ""; // 清空验证码
          this.isGetCode = true;
        }
      } else if (this.iscodeplugin === false) {
        if (this.phoneNumber === "" || !this.phoneNumber) {
          Toast("请验证您的手机号码");
          return;
        } else if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phoneNumber.trim())) {
          Toast("请输入正确的手机号码");
          return;
        } else if (
          this.code.trim() !== this.randerCodes ||
          this.randerCodes == ""
        ) {
          Toast("请输入正确的验证码");
          this.codeCounts++;
          return;
        } else {
          this.loginPhone();
        }
        this.loginPhone();
      }
    },
    // 添加一个浏览器页面打开的 事件
    documentEvent() {
      let vm = this;
      if (document.visibilityState == "visible") {
        let newlogin = Date.parse(new Date());
        let H5_lslogin_time = common.getStorage("H5_lslogin_time");
        console.log(newlogin - H5_lslogin_time);
        let second = newlogin - H5_lslogin_time + "";
        let getSecond = second.substring(0, second.length - 3);
        this.getSecond = getSecond;
        this.pagechange = true;
      } else {
        let second = Date.parse(new Date());
        common.setStorage("H5_lslogin_time", second);
      }
    }
  },
  computed: {
    getCodeInfo() {
      return this.isGettingCodes ? this.counts : "获取验证码";
    },
    //是否跳转到安全验证页面
    savetyConfirmShowed() {
      return false;
    }
  },
  // beforeMount () {
  //   Indicator.close();
  // },
  //登陆界面使用图形验证码
  components: {
    SIdentify
  },
  created() {
    //安全验证隐藏
    // Indicator.close();
    this.$root.eventHub.$on("hide-savety-confirm", () => {
      this.savetyConfirmShowed = false;
    });
  },
  activated() {
    //默认手机号获取
    let phone = common.getStorage("userPhone");
    if (phone) {
      this.phoneNumber = phone;
    }
    this.code = "";
    this.isGettingCodes = false;
    // 这里只有登录界面在后台运行 或者 跳转到其他页面 在跳转回来再回运行
    if (this.timer) {
      clearInterval(this.timer);
      this.isGettingCodes = false;
    }
    this.phoneList = localStorage.getItem("Phone_List");
    if (localStorage.getItem("Phone_List") !== null) {
      this.phoneList = localStorage.getItem("Phone_List").split(",");
    }
    // 如果用户到了这个界面表示用户没有登陆
    common.removeStorage('H5_user_id');
  },
  beforeRouteEnter: (to, from, next) => {
    if(from.path == '/home'){
      next(vm=>{
        //  alert('home');
         vm.toPath = 'home';
      })
    }else if(from.path == '/myAcount'){
      next(vm=>{
        // alert('myAcount');
        vm.toPath = 'myAcount';
      })
      // alert('home');
    }else if(from.path == '/search'){
       next(vm=>{
        // alert('myAcount');
        vm.toPath = 'home';
      })
    }else{
      next(vm=>{
        let code = sessionStorage.getItem('code');
        if(code == 1000){
          vm.toPath = 'home';
        }else if(code == 1001){
          vm.toPath = 'myAcount';
        }
      })  
    }
    // next();
  },
  deactivated() {
    // 清空定时器， 后台运行的状态 后台运行的秒数 缓存的秒数时间 页面监听的事件
    // clearInterval(this.timer);
    this.pagechange = false;
    this.getSecond = null;
    common.setStorage("H5_lslogin_time");
    this.isGetCode = true;
    document.removeEventListener("visibilitychange", this.documentEvent);
  }
};
</script>

<style lang="stylus">
@import '../../common/css/base.stylus';
@import '../../common/css/mixin.stylus';

#app {
  background-color: #FFF;

  .close-login {
    position: absolute;
    right: 60px;
    top: 60px;
    width: 1.533333rem;
    height: 1.533333rem;
    bg-img('../../assets/img/btn_close');
  }

  .login-ic-box {
    .login-ic {
      display: inline-block;
      width: 5rem;
      height: 5rem;
      // bg-img('../../assets/img/blogin_icon');
      bg-img('../../assets/img/login_icon');
      margin-top: 5rem;
      margin-bottom: 2.5rem;
    }
  }

  .login {
    padding: 0 2.4rem;

    .test-input {
      border: 4px solid #E6E6E6;
      border-radius: 1.5rem;
      height: 3rem;
      // line-height :3rem
      padding-left: 3rem;
      margin-bottom: 1rem;

      .phone {
        min-width: 85%;
      }

      .imgsrc {
        width: 0.866667rem;
        height: 0.866667rem;
        vertical-align: middle;
      }

      .alert-phone {
        background-color: #fff;
        z-index: 10;
        position: absolute;
        border: 0.053333rem solid #e6e6e6;
        box-shadow: 5px 2px 6px #e6e6e6;
        color: #333;

        li {
          margin: 10px 80px 10px 10px;
        }
      }

      input {
        display: inline-block;
        height: 50%;
        max-width: 40%;
        font-size: 1rem;
        line-height: 50%;
        border: none;
        outline: none;
        color: #333;
      }

      input::-webkit-input-placeholder {
        font-size: 1rem;
        padding-top: 0.6rem;
      }

      .input-ic {
        width: 1.1rem;
        height: 1.2rem;
        left: 1.4rem;
        top: 50%;
        transform: translateY(-50%);
      }

      .phone-ic {
        bg-img('../../assets/img/login_user');
      }

      .code-ic {
        bg-img('../../assets/img/login_phone');
        width: 0.8rem;
        left: 1.5rem;
      }

      .code-plugin {
        position: absolute;
        display: inline-block;
        top: 55%;
        transform: translateY(-50%);
        right: 0.8rem;
      }

      .get-code-btn {
        border: 1px solid #D01D95;
        height: 1.56rem;
        line-height: 1.56rem;
        font-size: 0.875rem;
        // font-size .75rem
        color: #D01D95;
        border-radius: 0.78rem;
        top: 50%;
        transform: translateY(-50%);
        min-width: 30%;
        right: 0.5rem;
      }
    }

    .code {
      input {
        color: #D01D95;
      }
    }

    input {
      margin-top: 0.6rem;
    }

    .login-btn {
      width: 12.5rem;
      height: 2.5rem;
      line-height: 2.5rem;
      font-size: 1rem;
      border-radius: 1.25rem;
      bg-img('../../assets/img/Background');
      color: #fff;
      margin: 0 auto;
      margin-top: 1rem;
      margin-bottom: 0.875rem;
    }

    .accession {
      font-size: 0.875rem;
      color: #999;

      span {
        color: #D01D95;
      }
    }
  }
}
</style>
