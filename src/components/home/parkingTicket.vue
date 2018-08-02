<template>
  <div id="get-ticket">
    <sub-header :headerMark="headerMark"></sub-header>
    <div class="money contents-tp">
      下载APP客户端，即可获得停车券、加油卡等更多奖励。
    </div>
    <button class="mint-button mint-button--primary mint-button--large ticket-get" @click="download">下载领券</button>
  </div>
</template>
<script>
  import subHeader from '../commonComponents/subHeader';
  import {Toast} from 'mint-ui';
  import {getAndroid} from '../../server/getData';
  import baseURL from '../../server/baseURL';

  export default {
    data(){
      return{

      }
    },
    computed: {

    },
    components: {
      subHeader
    },
    methods:{
      download(){
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if(isAndroid){
          window.location.href = baseURL.downURL;
        }else if(isiOS){
          window.location.href = 'https://itunes.apple.com/cn/app/id1299056230?mt=8';
        }else {
          Toast('无法判断手机型号');
        }
      }
    },
    activated () {

    },
    created () {

    }
  }
</script>
<style lang="stylus" scoped>
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#get-ticket
  background-color #F5F5F5
  width 100%
  position absolute
  top 0
  bottom 0
  font-size 1rem
  .contents-tp
    padding 6rem 2.6rem
    background-color #FFF
    border-top 1px solid #F5F5F5
    border-bottom 1px solid #F5F5F5
  button
    height 2.6rem
  .ticket-get
    font-size .875rem
</style>








