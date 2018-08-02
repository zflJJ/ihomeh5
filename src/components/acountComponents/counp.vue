<template>
  <div id="counp">
    <sub-header :headerMark="headerMark"></sub-header>
    <no-data-tips  :tipMark ="tipMark"  :parkItems="counpItems"></no-data-tips>
    <mt-field
      label=""
      placeholder="请输入优惠券编号"
      type="text"
      v-model="counpNumber"
      :disableClear="clearX"
      class="in-style">
      <div class="get-btn" @click="getCounpEvent">兑换</div>
    </mt-field>
    
    <div class="coup-box p-a" ref="counpBox">
      <div class="counp-content" ref="counpList">
      <div class="showtext" v-show="loadingFlag == 0">下拉刷新</div>
      <div class="showtext" v-show="loadingFlag == 1">释放刷新</div>
      <div class="showtext" v-show="loadingFlag == 2">刷新中...</div>
        <!-- <div v-show ="sildDom == true" style="text-align:center;height:20px;line-height:20px; fons-size:16px; position:absoulte;" ref="textbox">{{text}}</div> -->
        <!-- <div style="text-align:center;height:20px;line-height:20px; fons-size:16px; " ref="textbox">{{text}}</div> -->
        <div class="counp-list-box" v-for="(item,index) in counpItems"
             :key="index"
             v-show="counpItems.length"
             @click="chooseItems(item,item.userCouponId)">
          <div class="counp-list p-r" :class="{'chosen':item.userCouponId==currentIndex}">
            <div class="top-logo" :class="{'enpire':item.state !==0 }"></div>
            <div class="content clearfix">
              <div class="counp-l f-l clearfix">
                <div class="rmb f-l">￥</div>
                <div class="amount f-l">
                  <div class="num t-c">{{item.couponLimit}}</div>
                </div>
              </div>
              <div class="counp-r f-r">
                <div class="type t-r">
                  {{item.districtName}}
                </div>
                <div class="date">{{item.fmInvalidDate}}</div>
              </div>
            </div>
            <div class="p-a" :class="{'choose-ic':item.userCouponId==currentIndex}"></div>
          </div>
        </div>
        <mt-spinner type="fading-circle" color="#999" :size="20" v-show="isLoading"></mt-spinner>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import { Toast,Spinner,Indicator } from 'mint-ui';
  import {getMyCounpLists,getCounpNumber,bindCounp} from '../../server/getData';
  import { formatTimeStamp } from '../../common/js/H5plugin';
  import { setTimeout, clearTimeout, clearInterval } from 'timers';
  import subHeader from '../commonComponents/subHeader';
  import noDataTips from '../commonComponents/noDataTip';
  import common from '../../common/js/common'
  export default {
    name:'counp',
    data(){
      return{
        headerMark:'我的卡券',
        // headerMark:'我的优惠券',
        counpItems:[],
        pageNum:0,  // 表示获取第几页的优惠券
        pageSize:20,
        chosen:false, //确定是否有优惠券被选中
        canChoose:true, //是否可以激活优惠券
        currentIndex:null, //当前被选中的优惠券
        isLoading: false,  //上拉加载图标
        timer:null,  //上拉刷新定时
        hasNoDatas:false,  //判断优惠券信息是否为空的状态
        tipMark:'暂无优惠券',   //暂无优惠券状态提示
        counpNumber:null, //   优惠券编号
        clearX:true,
        orderId: null,  // 订单ID号
        counpFlag: null, // 表示编号
        sildDom: true,
        text:'释放刷新', // 提示文本
        loadingFlag: 0, // 下拉刷新的状态
      }
    },
    components: {
      subHeader,
      noDataTips
    },
    methods: {
      // getCounpEvent 获取兑换的优惠券
      getCounpEvent(){
        if(this.counpNumber === '' || this.counpNumber === null || this.counpNumber === undefined){
            Toast('请您输入优惠券编码');
        }else{
           this.getCounp();
        }
      },
      // 兑换优惠券接口（这个地方做详细的提示）
      async getCounp(){
        let userId = common.getStorage('H5_user_id');
        let res = await getCounpNumber(userId,this.counpNumber);
        console.log(res);
        if(res.error_code == 2000){
          Toast('兑换成功');
          this.pageNum = 0;
          this.counpNumber = '';
          this.getCounpLists();
        }else if(res.error_code == 2502){
          Toast('优惠券已被兑换过');
        }else if(res.error_code == 2217){
          Toast('优惠券码参数错误');
          console.log(res,'错误码是='+res.error_code);
        }else if(res.error_code == 2304 || res.error_code == 2312){
          Toast('没有这个优惠券');
        }else{
          Toast(res.message_code);
        }
      },

     

      //点击选中优惠券
      chooseItems(item,index){
        // 表示从哪个页面进来的
        if(!this.canChoose){
          return;
        }
        // debugger
        // if(item.userCouponId == this.counpFlag){
        //   Vue.set(item,'isChosen',false);
        // }
        if(item.isChosen){ // 取消优惠券
          Vue.set(item,'isChosen',false);
          // 解绑优惠券
          localStorage.removeItem('H5_counpinfo');
          this.bingCounpId();
          this.currentIndex = null;
          this.$root.eventHub.$emit('cancel-counp-info');
        }else {  //选择优惠券  
          for(let item of this.counpItems){
            Vue.set(item,'isChosen',false);
          }
          Vue.set(item,'isChosen',true);
          this.currentIndex = index;
          let counpObj = {
            couponId:item.userCouponId,  // 优惠券ID
            amount:item.couponLimit  // 优惠券金额
          };

          // 优惠券id面额缓存
          let H5_counpinfo = JSON.stringify(counpObj);
          localStorage.setItem('H5_counpinfo',H5_counpinfo);
          this.$root.eventHub.$emit('send-counp-info',counpObj);
          // 订单和优惠券绑定
          this.bingCounpId();
        }
        // 绑定优惠券
        setTimeout(()=>{
          this.$router.push({
            name:'payMent',
          })
        },300)
        // 跳转之后，让优惠券跳转到第一页
        // setTimeout(() => {
        //   this.scroll.scrollTo(0,0);
        // }, 500);
      },

      // 订单和优惠券绑定
      async bingCounpId(){
        let counpId = localStorage.getItem('H5_counpinfo');
        if(counpId === null){
          counpId = -1;
        }else{
          counpId = JSON.parse(localStorage.getItem('H5_counpinfo')).couponId;
        }
        console.log(counpId);
        let res = await bindCounp(counpId,this.orderId);
        console.log(res);
        if(res.error_code === 2000){
          console.log('优惠券使用信息到后台');
        }else{
          console.log(res,'错误码是='+res.error_code);
        }
      },

      //添加滚动事件
      _initScroll(){
        this.$nextTick(()=>{
          if(!this.scroll){
            this.scroll =new BScroll(this.$refs.counpBox,{
              probeType:1,
              scrollY:true,
              click:true,
              pullDownRefresh: {
                  threshold: 50,
                  stop: 30
              },
            });
            //滚动刷新事件
          }else{
            this.scroll.finishPullDown();
            this.scroll.refresh();
          }
          let _self =this;
          let textBox = this.$refs.textbox;
          if(this.scroll){
            this.scroll.on('scroll',props =>{
              clearTimeout(_self.timer);
              let scrollY = props.y;
              let el = this.scroll.scroller;
              let elParent = el.parentElement;
              let elH = el.offsetHeight;
              let parentH = elParent.offsetHeight;
              console.log(elH,elParent)
              if( scrollY < 0 && Math.abs(scrollY)>parentH-elH){
                console.log('上拉操作');
                _self.timer = setTimeout(()=>{
                  _self.isLoading = true;
                  _self.pageNum++;
                  _self.getCounpLists();
                },30);
              }
            });


            this.scroll.on('pullingDown',(props)=> {
              console.log(props);
              clearTimeout(_self.getTime);
              _self.text = '加载中...';
              this.loadingFlag = 2;
              _self.pageNum = 0;
              _self.getTime = setTimeout(() => {
                _self.getCounpLists();
              }, 1000);
            });
          }
        });
        
      },
       //获取优惠券列表
      async getCounpLists(){
        // this.text = '加载中...';
        if(this.pageNum == 0){
          Indicator.open();
        }
        let userId = common.getStorage('H5_user_id');
        let res = await getMyCounpLists(userId, this.pageNum);
        if(res.error_code == '2000'){
          this.loadingFlag = 0;
          Indicator.close();
          this.sildDom = false;
          this.displayItems(res);
        }else{
          Indicator.close();
          this.loadingFlag = 0
          this.sildDom = false;
          Toast({
            message:'优惠券信息获取失败',
            duration:1000
          });
        }
      },
      //展示列表数据
      displayItems(data){
        let listData = [];
        listData = data.data.coupons;
        //格式化有效期时间
        for(let item of listData){
           let fmInvalidDate = item.endTime;
          if(fmInvalidDate == '4100688000000'){
            fmInvalidDate = '无限期';
          }else{
            fmInvalidDate = formatTimeStamp(fmInvalidDate);
            fmInvalidDate = '有效期至：' + fmInvalidDate.substr(0,10);
          }
          this.$set(item,'fmInvalidDate',fmInvalidDate);
        }
        if(this.pageNum == 0){
          this.counpItems = [].concat(listData);
        }else{
          this.counpItems = this.counpItems.concat(listData);
        }
        // console.log(this.sildDom);
        console.log(this.counpItems);
        this.isLoading = false;
        if(this.scroll){
          this.scroll.refresh();
          this.scroll.finishPullDown();
        }else{
           this._initScroll();
        }
      },
    },
    // 对跳转进来的路由做判断
    beforeRouteEnter (to,from,next){
      if(from.path=='/myAcount'){
        next(vm =>{
          vm.canChoose = false;
          localStorage.setItem('H5_counpFromPay',false);
        })
      }else{
        next(vm=>{
          vm.canChoose = true;
          localStorage.setItem('H5_counpFromPay',true);
        });
      }
    },
    created () {
      this.getCounpLists();
    },
    
    activated () {
      this.orderId = localStorage.getItem('H5_orderId');
      let counpFlag = localStorage.getItem('counpFlag');
      if(counpFlag == -1){
        this.pageNum = 0;
        this.getCounpLists();
        this.currentIndex = null;
      }else{
        for(let item of this.counpItems){
          if(item.userCouponId == counpFlag){
            this.$set(item,'isChosen',true);
          }
        }
      }
      console.log(this.counpItems);
    },
    deactivated(){
      this.counpNumber = null;
      for(let item of this.counpItems){
        this.$set(item,'isChosen',false);
      }
      // 当离开这个页面的时候跳转到顶部
      this.scroll.scrollTo(0,0);
      // this.$destroy(true);
    }
  }
</script>

<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#counp
  background-color #F5F5F5
  width 100%
  position absolute
  top 0
  bottom 0
  .in-style
    margin-top 4.75rem
    height 3.125rem
    padding-left 1.1875rem
    padding-right 0.9375rem
  .get-btn
    width  4.25rem
    height 1.5625rem
    background-color #c51a95
    text-align center
    line-height 1.5625rem
    border-radius 1.133333rem
    color #fff
  .coup-box
    width 100%
    top 8rem
    // top 3.975rem
    bottom 0
    overflow hidden
    .showtext
      position absolute
      width 100%;
      text-align center
      line-height 2rem
      top: -2rem
      left:0
    .counp-content
      padding 0 .9375rem
      .counp-list
        // margin .9375rem 0
        border-radius .625rem
        background-color #fff
        // height 6.25rem
        overflow hidden
        .top-logo
          height .625rem
          bg-img('../../assets/img/parting_coupon_grain')
        .enpireenpire
          bg-img('../../assets/img/parting_coupon_grain_expire')
        .content
          padding 0 .75rem 1.2rem .75rem
          .counp-l
            color #CE1C94
            .rmb
              display inline-block
              font-size 1.125rem
              padding-top 1.05rem
            .amount
              display inline-block
              // margin-left .4375rem
              .num
                font-size 3.75rem
              // min-width 1.875rem
              .district
                padding 0 .375rem
                font-size 0
                margin-top -.15rem
                span
                  display inline-block
                  background-color #D01D95
                  color #FFF
                  font-size .875rem
                  padding .1875rem .3125rem
                  border-radius .1875rem
          .counp-r
            .type
              margin-top 1.8rem
              font-size 1.125rem
              color #D01D95
            .date
              margin-top .75rem
              color #9A9A9A
              font-size .875rem
        .choose-ic
          width 1.5625rem
          height 1.4375rem
          right 0
          bottom 0
          bg-img('../../assets/img/xuanzhong')
      .chosen
        border .0625rem solid #F63272
  .counp-list-box
    padding .6rem 0 !important
//兑换插件样式
.mint-cell-value
  input
    font-size .8rem
.mint-field-other
  .get-btn
    font-size .8rem
</style>
