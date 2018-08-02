<template>
  <div id="savety-confirms">
    <transition name="fade">
      <div class="mask p-f wd" @click="hideConfirm" v-show="savetyConfirmShowed"></div>
    </transition>

    <div class="confirm-containner t-c" :class="{'unshow':savetyConfirmShowed}">
      <div class="confirm-box" :class="{'rotate':savetyConfirmShowed}">
        <div class="title t-c">安全验证</div>
        <div class="content">
          <div class="input-view t-l p-r">
            <input class="dp-font30" type="text" v-model="codeVal" placeholder="请输入图片验证码">
            <span class="sign-view p-a"></span>
          </div>
          <div class="tips p-r dp-font30 t-l"><span class="tip-ic p-a"></span>请输入正确的验证码</div>
        </div>
        <div class="switch-bars flex">
          <div class="cancel tc fl-o" @click="cancel">取消</div>
          <div class="confirm tc fl-o" @click="confirm">确定</div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name:'savetyConfirms',
  data(){
    return{
      codeVal:''
    }
  },
  props:['savetyConfirmShowed'],
  methods:{
    hideConfirm(){
      this.$root.eventHub.$emit('hide-savety-confirm');
    },
    cancel(){
      this.$root.eventHub.$emit('hide-savety-confirm');
    },
    confirm(){
      console.log(this.codeVal)
      this.$root.eventHub.$emit('hide-savety-confirm');
    }
  }
}
</script>
<style lang="stylus">
@import '../../common/css/mixin.stylus'
#savety-confirms
  postion:fixed
  width :100%
  top:0
  bottom:0
  .fade-enter-active,.fade-leave-active
    transition:all .5s
    opacity :1
    &.fade-enter,& .fade-leave
      opacity :0
  .mask
    top:0
    bottom:0
    background-color :#333
    opacity :.6
    z-index:0
  .confirm-containner
    position: absolute
    width: 100%
    top: 12.5rem
    text-align: center
    transition:all .5s ease-in
    transform-origin :center center
    transform:scale(0)
    .confirm-box
      display :inline-block
      width :20rem
      background-color :#fff
      border-radius:.5rem
      transition:all .5s ease-in
      transform-origin :center center
      transform:scale(0) rotateZ(0)
      .title
        height:3.125rem
        line-height :3.125rem
        font-size :1rem
        font-weight :bold
      .content
        padding :1rem .875rem
        padding-bottom :0
        border-top :1px solid #E6E6E6
        .input-view
          height :3.125rem
          line-height :3.125rem
          padding :0 1.25rem
          border-radius:1.5625rem
          border:3px solid #E6E6E6
          input
            display :inline-block
            max-width :65%
            height :50%
            outline :none
            border:none
            color:#999
          .sign-view
            width :5rem
            height :1.875rem
            border:.0625rem solid #92CFEB
            top:50%
            right:1.25rem
            transform:translateY(-50%)
        .tips
          height :1.625rem
          line-height :1.625rem
          color:#F73F7B
          padding-left :2rem
          .tip-ic
            width :.875rem
            height:.875rem
            bg-img('../../assets/img/login_tshi')
            left:.9375rem
            top:50%
            transform:translateY(-50%)
      .switch-bars
        border-top: 1px solid #E6E6E6
        height :3.625rem
        line-height 3.625rem
        div
          height: 100%
          line-height: 3.625rem
          font-size :1.25rem
        .confirm
          color:#D01D93
          border-left 1px solid #E6E6E6
    .rotate
      transform:scale(1) rotateZ(360deg)
  .unshow
    transform:scale(1)
</style>

