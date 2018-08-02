<template>
    <div id='payfeedback'>
        <sub-header :headerMark="headerMark"></sub-header>
        <div class="status-icon">
            <img src="../../assets/img/empty_chenggong@2x.png" v-if='flag' />
            <img src="../../assets/img/empty_shibai@2x.png" v-else/>
        </div>
        <div class="btn-wrap">
            <div class="left_btn" @click="leftDO">{{flag?"返回首页":"返回上级"}}</div>
            <div class="right_btn" @click="rightDo">{{flag?"查看订单":"再次支付"}}</div>
        </div>
    </div>
</template>

<script>
import subHeader from "./subHeader";
export default {
  name: "payfeedback",
  data() {
    return {
      headerMark: "支付状态",
      flag: true
    };
  },
  components: {
    subHeader
  },
  computed: {},
  created() {
    if (this.$route.params.flag == 1) {
      this.flag = true;
    } else {
      this.flag = false;
    }
  },
  mounted() {},
  methods: {
    leftDO() {
      if (this.flag) {
        this.$router.push("/home");
      } else {
        this.$router.push("/payMent");
      }
    },
    rightDo() {
      if (this.flag) {
        this.$router.push("/orderInfo");
      } else {
        this.$router.push("/payMent");
      }
    }
  },
  activated() {}
};
</script>

<style lang='stylus'>
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'

#payfeedback
    position absolute
    width 100%
    top 0
    bottom 0
    background-color #F4F4F4
    color #1a1a1a
.status-icon
    margin-top 35%
    margin-left 50%
    width 10rem
    height 10rem
    transform translate(-50%, 0)
    img
        display block
        width 10rem
.btn-wrap
    margin-top 4rem
    width 100%
    height 3rem
    padding 0 3rem
    font-size 1rem
    .left_btn
        float left
        width 8rem
        height 3rem
        text-align center
        line-height 2.8rem
        border 0.1rem solid #d01d95
        border-radius 0.3rem
        color #d01d95
    .right_btn
        float right
        width 8rem
        height 3rem
        text-align center
        line-height 3rem
        background-color #d01d95
        border-radius 0.3rem
        color #ffffff
</style>
