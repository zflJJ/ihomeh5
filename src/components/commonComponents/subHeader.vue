<template>
  <div id="sub-header" class="header p-a">
    <div class="top-cont t-c p-r">
          {{headerMark}}
        <div class="back p-a"></div>
        <div class="more p-a" v-show="false">更多</div>
        <div class="back-mask p-a" @click="goBack"></div>
      </div>
  </div>
</template>
<script>
import common from '../../common/js/common';
export default {
  name:'subHeader',
  data(){
    return{

    }
  },
  computed: {
    //是否显示更多按钮
    showMore(){
      return this.headerMark =='我的账户'?true: false;
    }
  },
  props:['headerMark'],
  methods: {
    goBack(){
      //添加车辆
      //  common.setStorage("H5_ls_flag", true);
        // this.$router.push("appointInfo");
      let parkName = localStorage.getItem('H5_parkName');
      if( this.headerMark == '领取车辆' ){
        this.$router.push('/myAcount');
      } else if(this.headerMark == '我的账户'){
        this.$router.push('/home');
      }
      else if(this.headerMark == '我的预约'){
        this.$router.push('/myAcount');
      }
      else if(this.headerMark == '支付订单'){
        let counpFromPay = JSON.parse(localStorage.getItem('H5_counpFromPay'));
        if(counpFromPay){
          this.$router.push('appointment')
        }else{
          this.$router.go(-1);
        }
      }
      else if(this.headerMark =='预约详情'){
        // 做一些处理
        console.log('这个是做了处理');
        let routerflag = common.getStorage('H5_ls_flag');
        if(routerflag){
          localStorage.removeItem('H5_ls_flag');
          this.$router.push('/home');
        }else{
            this.$router.push('/appointment');
        }
      }
      else if(this.headerMark =='更多'){
        this.$router.push('/myAcount');
      }
      else if(this.headerMark == parkName){
        let carFromAcount = JSON.parse(localStorage.getItem('carFromAcount'));
        if(carFromAcount){
          this.$router.go(-1);
        }else{
          this.$router.push('home');
        }
      }
      else if(this.headerMark =='我的车辆'){
        let carFromAcount = JSON.parse(localStorage.getItem('carFromAcount'));
        if(carFromAcount){
          console.log(carFromAcount);
          this.$router.push('myAcount');
        }else{
          this.$router.push('appoint');
        }
      }
      else if(this.headerMark =='预约'){
        this.$router.push('home');
      }else if(this.headerMark =='支付状态'){
          this.$router.push("/payMent");
      }
      else{
        console.log(1234);
        this.$router.go(-1);
      }
    },
  },
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#sub-header
  position fixed
  z-index 10000
  color #1a1a1a
  font-size 1rem
  font-weight bold
  // bg-img('../../assets/img/Background')
  background-color #fff
  padding-top 0.5rem
  padding-bottom 0.5rem
  .top-cont
    width 100%
    height 2rem
    line-height 2rem
    .back
      top 50%
      transform translateY(-50%)
      width 1.375rem
      height 1.25rem
      left .9375rem
      // bg-img('../../assets/img/parting_back')
      bg-img('../../assets/img/btn_back')
    .more
      top 50%
      transform translateY(-50%)
      font-size 14px
      right .875rem
    .back-mask
      width 3rem
      height 100%
      top 0
      left 0
</style>



