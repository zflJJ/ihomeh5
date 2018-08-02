<template>
  <div id="no-data-tip" v-show="!parkItems.length">
    <!-- <div class="img-box p-a" :class="[tipClass]" v-show="!parkItems.length"> -->
    <div class="img-box p-a" :class="[tipClass]">
    </div>
  </div>
</template>
<script>
export default {
  name:'noDataTip',
  data () {
    return {
      tipsArr:['no-data','no-car','no-counp','no-activities','no-appointment','no-search']
    }
  },
  props:["tipMark","parkItems"],
  computed: {
    tipClass(){
      let index = 0;
      switch(this.tipMark){
        case '暂无数据':
          index = 0;
          break;
        case '暂无车辆':
          index = 1;
          break;
        case '暂无优惠券':
          index = 2;
          break;
        case '暂无活动':
          index = 3;
          break;
        case '暂无订单':
          index = 4;
          break;
        case '暂无搜索结果':
          index = 5;
          break;
      }
      return this.tipsArr[index];
    }
  }
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#no-data-tip
  position absolute
  width 100%
  top 0
  bottom 0
  .img-box
    height: 6.9375rem
    width: 6.5625rem
    left: 50%
    top: 50%
    margin-top: -3.6rem
    transform translateX(-50%)
  .no-data
    bg-img('../../assets/img/nodata/empty_man')
  .no-car
    bg-img('../../assets/img/nodata/empty_cheliang')
  .no-counp
    bg-img('../../assets/img/nodata/empty_youhuiquan')
  .no-activities
    bg-img('../../assets/img/nodata/empty_wu')
  .no-appointment
    bg-img('../../assets/img/nodata/empty_dingdan')
  .no-search
    bg-img('../../assets/img/nodata/empty_sousuo')
</style>


