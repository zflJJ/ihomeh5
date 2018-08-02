<template>
  <div id="choose-plate">
    <transition name="mask-in">
      <div class="mask p-f" v-show="plateShowed" @click="hidePlate"></div>
    </transition>
    <transition name="choose-in">
      <div class="choose-box p-a" v-show="plateShowed">
        <div class="content">
          <div class="top t-c">选择车牌地区</div>
          <div class="main p-r">

            <div class="left-box p-a box" ref="leftBox">
              <div class="left show" :style="leftStyle" ref="leftShow">
                <div class="l-list item t-c" v-for="(item,key) in provinces" :key="item.name" :class="{'pre-chosen':key == leftCurrent}">{{item}}</div>
              </div>
            </div>

            <div class="right-box p-a box" ref="rightBox" >
              <div class="right show" :style="rightStyle" ref="rightShow">
                <div class="r-list item t-c" v-for="(item,key) in initials" :key="item.name" :class="{'pre-chosen':key == rightCurrent}">{{item}}</div>
              </div>
            </div>
            <!-- <div class="chose-show p-a"></div> -->
          </div>
          <div class="bottom flex">
            <div class="cancel t-c fl-o" @click="hidePlate">取消</div>
            <div class="confirm t-c fl-o" @click="confirm">确定</div>
          </div>
        </div>
    </div>
    </transition>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
export default {
  name:'choosePlate',
  data () {
    return {
      timer:false, //事件延迟执行与否
      scrollTop:0,
      leftCurrent:6,
      rightCurrent:1,
      leftEl:'', //左滚动盒子
      rightEl:'', //右滚动盒子
      offPadding:0,  //滚动盒子padding值
      leftH:0,   //左边滚动元素高度
      rightH:0,  //右边滚动元素高度
      childrenH:0, //子元素高度
      proInfo: '', //默认省份
      initInfo: '',  //默认牌头
      provinces:['京','沪','鄂','湘','川','渝','粤','贵','青','琼','宁','吉','蒙','冀','苏','皖','云','陕','甘','藏','新','辽','鲁'],   //省份
      initials:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],  //牌照首字母
    }
  },
  props:['plateShowed'],
  methods: {
    // 取消隐藏选车牌组件
    hidePlate(){
      this.$root.eventHub.$emit('hide-plate');
    },
    //添加左右滑动事件
    _initScroll(){
      this.$nextTick(()=>{
        //左边滑动选择
        if(!this.leftScroll){
          this.leftScroll = new BScroll(this.$refs.leftBox,{
            probeType:3,
            scrollY:true,
            // click:true
            // momentumLimitTime:40,
            // deceleration:0.0008,
            // momentumLimitDistance:40,
          });
        }else{
          this.leftScroll.refresh();
        }

        // 左边滚动事件
        this.leftScroll.on('scroll',(props)=>{
          this.scrollTop = props.y;
          // console.log(scrollTop)
          this.getCurrent('left');

          // this.timer = true;
          // let _self = this;
          // setTimeout(()=>{
          //   _self.timer = false;
          // },300)
          // this.scrollTop = scrollTop;
        });
        //左边滚动结束
        this.leftScroll.on('touchEnd',()=>{
          setTimeout(()=>{
            this.$refs.leftShow.style = 'transform:translate(0px, -' + this.leftCurrent*this.childrenH +'px) translateZ(0px) !important';
          },300)

          // if(!this.timer){
          //   this.getCurrent('left');
          //   // console.log(this.scrollTop);
          // }else{
          //   let _self = this;
          //   setTimeout(()=>{
          //     _self.getCurrent('left');
          //   },1200)
          // }
        });
        // 右边滑动选择
        if(!this.rightScroll){
          this.rightScroll =new BScroll(this.$refs.rightBox,{
            probeType:3,
            scrollY:true,
            click:true
          });
        }else{
          this.rightScroll.refresh();
        }
        // 左边滚动事件
        this.rightScroll.on('scroll',(props)=>{
          this.scrollTop = props.y;
          // console.log(scrollTop)
          this.getCurrent('right');

          // let scrollTop = props.y;
          // this.timer = true;
          // let _self = this;
          // setTimeout(()=>{
          //   _self.timer = false;
          // },300)
          // this.scrollTop = scrollTop;
        });
        //右边滚动结束
        this.rightScroll.on('touchEnd',()=>{
          setTimeout(()=>{
            // this.leftStyle = 'transform:translate(0px, -' + this.leftCurrent*this.childrenH +'px) translateZ(0px)';
            // console.log(this.leftStyle)
            // this.rightStyle =  'transform:translate(0px, -' + this.rightCurrent*this.childrenH +'px) translateZ(0px)';
            // this.$refs.leftShow.style = 'transform:translate(0px, -' + this.leftCurrent*this.childrenH +'px) translateZ(0px) !important';
            this.$refs.rightShow.style =  'transform:translate(0px, -' + this.rightCurrent*this.childrenH +'px) translateZ(0px) !important';
          },300)

          // if(!this.timer){
          //   this.getCurrent('right');
          // }else{
          //   let _self = this;
          //   setTimeout(()=>{
          //     _self.getCurrent('right');
          //   },1200)
          // }
        });

        this.initPlateHead();
      })
    },
    //初始化车牌号头部
    initPlateHead(){
      this.leftCurrent = 6;
      this.rightCurrent = 1;
      this.proInfo = this.provinces[this.leftCurrent];
      this.iniInfo = this.initials[this.rightCurrent];
      // this.leftStyle = 'transform:translate(0px, -80px) translateZ(0px)';
      // this.rightStyle =  'transform:translate(0px, -40px) translateZ(0px)';
      this.$refs.leftShow.style = 'transform:translate(0px, -240px) translateZ(0px) !important;';
      this.$refs.rightShow.style =  'transform:translate(0px, -40px) translateZ(0px) !important';

    },
    //获取当前被预选中的索引号
    getCurrent(mark){
      if(this.scrollTop>=0){    //下拉超过顶部
        if(mark == 'left'){
          this.leftCurrent = 0;
        }else{
          this.rightCurrent = 0;
        }
      }else{
        if(mark=='left'){
          if(this.scrollTop<(-this.leftH -this.childrenH*2)){ //上拉超过底部
            this.leftCurrent = this.provinces.length-1;
          }else{
            this.leftCurrent = Math.floor(Math.abs(this.scrollTop)/this.childrenH);
          }
        }else{
          if(this.scrollTop<(-this.rightH - this.childrenH*2)){
            this.rightCurrent = this.initials.length - 1;
            console.log(this.rightCurrent)
          }else{
            this.rightCurrent = Math.floor(Math.abs(this.scrollTop)/this.childrenH);
          }
        }
      }
    },
    //获取实例化后元素基本数据
    getElVal(){
      this.$nextTick(()=>{
        let leftBox = this.$refs.leftBox;
        let rightBox  = this.$refs.rightBox;
        let leftEl = leftBox.children[0];
        let rightEl = rightBox.children[0];
        let child = leftEl.children[0];
        this.leftEl = leftEl;
        this.rightEl = rightEl;
        // this.offPadding = Number(leftEl.style.paddingTop.replace('px',''));
        this.leftH = leftEl.offsetHeight;
        this.rightH = rightEl.offsetHeight;
        this.childrenH = child.offsetHeight;
        this.offPadding = this.rightH - this.childrenH*(this.provinces.length);
      });
    },
    //点击确定选择
    confirm(){
      console.log(this.proInfo+this.iniInfo)
      this.proInfo = this.provinces[this.leftCurrent];
      this.iniInfo = this.initials[this.rightCurrent];
      let plateObj = {
        proInfo : this.proInfo,
        iniInfo: this.iniInfo
      }
      this.$root.eventHub.$emit('confirm-plate-h',plateObj);
    }
  },
  created () {

    //加载滚动事件
    this.$root.eventHub.$on('show-plate-selection',()=>{
      this._initScroll();
      this.getElVal();
    });
  },
  computed: {
    // //省
    // proInfo(){
    //   return this.provinces[this.leftCurrent];
    // },
    // //牌头
    // iniInfo(){
    //   return this.initials[this.rightCurrent];
    // },
    // leftStyle(){
    //   let style = 'transform:translate(0px, -' + this.leftCurrent*this.childrenH +'px) translateZ(0px)';
    //   return style;
    // },
    // rightStyle(){
    //   return 'transform:translate(0px, -' + this.rightCurrent*this.childrenH +'px) translateZ(0px)';
    // }
  },
  activated () {
    // this.proInfo =
    // this.initPlateHead();
    console.log(this.leftStyle,this.rightStyle)
    this._initScroll();
    this.getElVal();
  }
}
</script>
<style lang="stylus">
#choose-plate
  .mask-in-enter-active,.mask-in-leave-active
    transition opacity .5s ease
  .mask-in-enter,.mask-in-leave-to
    opacity 0
  .mask
    width 100%
    top:0
    bottom 0
    background-color rgba(45,45,45,.6)
  .choose-in-enter-active,.choose-in-leave-active
    transition all .5s ease
  .choose-in-enter,.choose-in-leave-to
    transform:scale3d(0,0,0) rotateZ(-180deg)
  .choose-box
    width 100%
    min-height 21.25rem
    bottom 1.3125rem
    overflow hidden
    .content
      width 80%
      margin 0 auto
      background-color #fff
      border-radius .5rem
      min-height: 21.25rem;
      overflow hidden
      .top
        height 3.25rem
        line-height 3.25rem
        font-size .875rem
        font-weight bolder
        color #323232
        border-bottom 1px solid #E6E6E6
      .main
        // margin .9375rem 0
        height:14.5rem
        .box
          width 50%
          top 1.0625rem
          bottom 1.0625rem
          overflow hidden
          .show
            padding-top 5rem
            padding-bottom 5rem
          .item
            height 2.5rem
            line-height 2.5rem
            font-size .75rem
            font-weight bold
            color #CCCCCC
        .left-box
          left 0
        .right-box
          right 0
        // .chose-show
        //   height 2.5rem
        //   line-height 2.5rem
        //   border-top .0625rem solid #CF1D95
        //   border-bottom .0625rem solid #CF1D95
        //   background-color rgba(0,0,0,0)
        //   width: 100%;
        //   top: 50%;
        //   transform: translateY(-50%);
      .bottom
        height 3.625rem
        line-height 3.625rem
        border-top .0625rem solid #E6E6E6
        div
          color #323232
          font-size .875rem
        .confirm
          color #D01D93
          border-left .0625rem solid #E6E6E6
      .pre-chosen
        font-size 1.125rem !important
        color #CF1D95 !important
</style>
