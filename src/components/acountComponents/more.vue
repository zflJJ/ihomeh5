<template>
  <div id="setting-more">
    <sub-header :headerMark="headerMark"></sub-header>
    <div class="content-box" ref="moreContent">
      <div class="more-content">
        <!-- <div class="update list-tp clearfix" @click="goCar">
          <div class="info f-l">检查更新</div>
          <div class="ct f-r clearfix p-r">
            <span class="name">{{versionInfo}}</span>
            <span class="icon p-a"></span>
          </div>
        </div> -->
        <div class="weixin-gzh list-tp clearfix p-r">
          <div class="info f-l">微信公众号</div>
          <div class="ct f-r clearfix p-r">
            <span class="name">享你了APP</span>
            <span class="icon p-a"></span>
          </div>
          <button class="cip-btn p-a" data-clipboard-text="享你了APP" @click="clipTip"></button>
        </div>
         <!-- 这个地方还要改一下 -->
        <div class="service-xy list-tp clearfix p-r" @click="goToServer">
          <div class="info f-l">服务协议</div>
          <div class="ct f-r clearfix p-r">
            <span class="name"></span>
            <span class="icon p-a"></span>
          </div>
          <!-- <a class="p-a" :href="serveUrl"></a> -->
        </div>
        <div class="quit-login"  style="display:none;"><span @click="quitLogin" ref="quitBtn">退出账号</span></div>
      </div>
    </div>
    <div class="copy-right p-a t-c">
      <div class="link">Copyright©2018</div>
      <div class="info">前海爱翼科技(深圳)有限公司</div>
    </div>
  </div>
</template>
<script>
import subHeader from '../commonComponents/subHeader';
import { Toast,MessageBox } from 'mint-ui';
import {canCelMyAppoint} from '../../server/getData';
import Clipboard from 'clipboard';
import baseUrl from '../../server/baseURL';
import common from '../../common/js/common';
import baseURL from '../../server/baseURL';
export default {
  name:'settingMore',
  data () {
    return {
      headerMark:'设置',
      versionInfo:'版本V1.02', //版本信息
      isLogined:false,  //判断是否登录的状态
      serveUrl: baseUrl.requestUrl+'apiwrite/AppMobile/service_protocol.html',
    }
  },
  components: {
    subHeader
  },
  activated () {
    let isLogined = this.$route.params.isLogined;
    if(!isLogined){
      this.$refs.quitBtn.style = 'display:none';
    }
    else{
      this.$refs.quitBtn.style = 'display:block';
    }

  },
  mounted () {
    const clipboard = new Clipboard('.cip-btn');
  },
  created () {

  },
  methods: {
    //退出登录
    quitLogin(){
      let _self = this;
      let htmls = `
                      <div class="quitloginmessage-info">
                        <div class="is-text">确定退出账户？</div>
                      </div>`;
        MessageBox({
          title: '温馨提示',
          message: htmls,
          showConfirmButton:true,	
          confirmButtonText:'退出',
          showCancelButton:true,
          cancelButtonText:'取消'
        }).then(action=>{
          if (action == 'confirm') {
             common.removeStorage('userPhone');
             common.removeStorage('H5_user_id');
            //  localStorage.removeItem('H5_user_id');
             // 表示退出登录
             common.setStorage('H5_setting',0);
            _self.$router.push('/home');
          }
        }).catch(err=>{
        })
    },
    //剪切成功提示
    clipTip(){
      Toast(
        {
          message:'已复制到剪贴板',
          duration: 1000
        }
      )
    },
    // 跳转到服务协议界面
    goToServer(){
      window.location.href = baseURL.serverUrl;
    }
  },
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
.quitloginmessage-info
  line-height 2.5rem
#setting-more
  position absolute
  width 100%
  top 0
  bottom 0
  background-color #F4F4F4
  .content-box
    position absolute
    width 100%
    top 3.8rem
    bottom 4.5rem
    // bottom 3rem
    overflow hidden
    .more-content
      .weixin-gzh
        button
          width 100%
          height 100%
          top 0
          left 0
          opacity 0
      .service-xy
        border-top none !important
        a
          width 100%
          height 100%
          top 0
          left 0
      .list-tp
        padding 1.25rem .9375rem
        background-color #fff
        font-size 1rem
        color #1a1a1a
        font-weight normal
        border-top .0625rem solid #E5E5E5
        border-bottom .0625rem solid #E5E5E5
        min-width 30%
        .ct
          color #999
          .name
            margin-right 1.875rem
          .icon
            width .5625rem
            height 1.125rem
            bg-img('../../assets/img/wuye_up')
            right 0
            top 50%
            transform translateY(-50%)
      .quit-login
        margin-top 2rem
        margin-bottom 2rem
        height 2.8rem
        line-height 2.8rem
        text-align  center
        span
          display inline-block
          width 50%
          margin 0 auto
          bg-img('../../assets/img/Background')
          color #ffffff
          font-size 1rem
          font-weight normal
          text-align center
          border-radius 1.4rem
  .copy-right
    width 100%
    font-size .875rem
    color #9B9B9B
    // margin-top 1rem
    bottom 0
    a
      font-size .875rem
      color #95D6F6
    .info
      margin .6rem auto
</style>


