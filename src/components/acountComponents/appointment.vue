<template>
  <div id="appointment">
    <sub-header :headerMark="headerMark"></sub-header>
    <no-data-tips :tipMark ="tipMark"  :parkItems="apointItems"></no-data-tips>
    <div class="appoint-box p-a" ref="apointBox">
      <div class="appoint-content">
        <div class="appoint-list-box" v-for="(item,key) in apointItems" :key="item.name" @click="goAppointInfo(item)">
          <div class="appoint-list">
            <div class="ordr-tm clearfix">
              <span class="tm-info f-l">订单时间：{{item.createFmTime}}</span>
              <span class="state f-r">{{item.stateInfo}}</span>
              <!-- <div>{{item.id}}</div> -->
            </div>
            <div class="pk-position">
              <div class="clearfix p-r">
                <span class="p-ic p-a"></span>
                <span class="p-name f-l">{{item.parklotName}}</span>
                <!--<span class="p-price f-r"  v-show="item.stateInfo=='已预约'||item.stateInfo=='已停车' || item.stateInfo=='未支付' || item.stateInfo=='离开未支付' || item.stateInfo=='超时已取消'">￥<span class="p-num ">{{item.stateInfo=='超时已取消'?item.actualFee:item.payFee}}</span></span>-->
                <template v-if="item.state != 1301 && item.state != 1302">
                    <span class="p-price f-r"><span class="p-num ">￥{{item.totalFee}}</span></span>
                </template>
                
              </div>
            </div>
            <div class="ordr-info"></div>
          </div>
        </div>
        <!-- <div class="reloading-ic-box t-c" v-show="isLoading"><img class="reloading-ic" src="../../assets/img/loading.jpg" alt="加载"></div> -->
        <mt-spinner type="fading-circle" color="#999" :size="20" v-show="isLoading"></mt-spinner>
      </div>
    </div>
  </div>
</template>
<script>
import subHeader from '../commonComponents/subHeader';
import { formatTimeStamp } from '../../common/js/H5plugin';
import { getMyAppointments } from '../../server/getData';
import { Toast,Spinner,Indicator  } from 'mint-ui';
import BScroll from 'better-scroll';
import noDataTips from '../commonComponents/noDataTip';
import {} from '../../common/js/H5plugin';
import common from '../../common/js/common';
export default {
  name:'appointment',
  data(){
    return{
      apointItems:[], //预约列表数据
      pageNum:0,   //页码数
      pageSize:20, //每页展示的数据
      isLoading: false,  //上拉加载图标
      headerMark:'我的预约',
      hasNodatas: false,  //无数据状态
      tipMark:'暂无订单',   //暂无预约状态提示

    }
  },
  components: {
    subHeader,
    noDataTips
  },
  methods: {
    //返回
    // goBack(){
    //   this.$router.push('/myAcount');
    // },
    //添加滚动
    _initScroll(){
      this.$nextTick(()=>{
        if(!this.scroll){
          this.scroll = new BScroll(this.$refs.apointBox,{
            probeType:3,
            scrollY:true,
            click:true
          });
          //滚动刷新事件
        }else{
          this.scroll.refresh();
        }
        let _self =this;
        // 如果有scroll 那么添加滚动事件
        if(this.scroll){
          this.scroll.on('scroll',props =>{
            clearTimeout(_self.timer);
            // 获取滚动的高度
            let scrollY = props.y;
            let el = this.scroll.scroller;
            let elParent = el.parentElement;
            let elH = el.offsetHeight;
            let parentH = elParent.offsetHeight;
            console.log('scrollY'+scrollY,'elH'+elH,'parentH'+parentH);
            if(scrollY < parentH-elH){
              _self.timer = setTimeout(()=>{
                _self.isLoading = true;
                _self.pageNum++;
                _self.getAppointments();
              },30);
            }
          })
        }
      })
    },
    //跳转到订单详情页面|支付页面
    goAppointInfo(item){ // 已预约  已停车
      localStorage.setItem('H5_orderId',item.orderId)
      if(item.state === 1301 || item.state === 1302){
        /*这里需要把车牌号传递过去*/
        this.$router.push({path:'/appointInfo',query:{plateNo:item.plateNo}});
      }else{
        this.$router.push('orderInfo');
      }
    },
    //获取预约列表数据
    async getAppointments(){
      if(this.pageNum == 0){
        Indicator.open();
      }
      let userId = common.getStorage('H5_user_id');
      let res = await getMyAppointments(Number(userId), this.pageNum);
      console.log(res);
      if(res.error_code == '2000'){
        Indicator.close();
        this.displayItems(res);
      }else{
        Indicator.close();
        Toast({
          message:'预约数据请求失败',
          duration:1000
        });
      }
    },
    //展示列表数据
    displayItems(data){
      let listData = data.data;
      listData = this.formateData(listData);
      if(this.pageNum == 0){
        this.apointItems = [].concat(listData);
      }else{
        this.apointItems = this.apointItems.concat(listData);
      }
      this.isLoading = false;
      this._initScroll();
      console.log(this.apointItems)
    },
    //处理返回的数据
    formateData(data){
      for(let item of data){
        let createFmTime = formatTimeStamp(item.createTime);
        createFmTime = createFmTime.substr(0,19);
        this.$set(item,'createFmTime',createFmTime);
        this.setState(item);
      }
      return data;
    },
    //根据预约状态码获取预约状态与支付信息
    setState(item){
      if(item.state === 1300){
        item.stateInfo = '未支付'
      }else if(item.state === 1301){
        item.stateInfo = '已预约'
      }else if(item.state === 1302){
        item.stateInfo = '停车中'
      }else if(item.state === 1303){
        item.stateInfo = '离场未支付'
      }else if(item.state === 1304){
        item.stateInfo = '已完成'
      }else if(item.state === 1309){
        item.stateInfo = '已取消'
      }else if(item.state === 1308 || item.state === 1307 || item.state === 1310){
        item.stateInfo = '超时取消'
      }
    }
  },
  activated () {
    //获取预约列表
    this.pageNum = 0;
    this.getAppointments();
  },
  created () {

  }
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#appointment
  background-color #F5F5F5
  width 100%
  position absolute
  top 0
  bottom 0
  .top
    color #FFF
    font-size 1rem
    bg-img('../../assets/img/Background')
    .top-cont
      width 100%
      height 2rem
      line-height 2rem
      .back
        top 50%
        transform translateY(-50%)
        width .75rem
        height 1.25rem
        left .9375rem
        bg-img('../../assets/img/parting_back')
  .appoint-box
    width 100%
    top 4.75rem
    bottom 0
    overflow hidden
    .appoint-content
      padding 0 .9375rem
      .appoint-list
        // border 1px solid #E6E6E6
        // border-radius 2rem
        // margin .9375rem 0
        .ordr-tm
          padding .6875rem .625rem
          background-color #fff
          border .0625rem solid #E6E6E6
          border-radius .5rem .5rem 0 0
          .tm-info
            color #999999
            font-size .8rem
          .state
            color #F53370
            font-size .875rem
        .pk-position
          padding 1.25rem .625rem
          background-color #fff
          border .0625rem solid #E6E6E6
          border-top none
          border-radius 0 0 .5rem .5rem
          .p-ic
            width .8125rem
            height .8125rem
            bg-img('../../assets/img/parting_mine_order_go_gray')
            top 50%
            transform translateY(-38%)
          .p-name
            margin-left 1.25rem
            font-size 1rem
            color #1B1B1B
            margin-top: .5rem
          .p-price
            color #F53370
            font-size 1rem
            font-weight normal
            .p-num
              font-size 1.875rem
  .appoint-list-box
    padding .8rem 0 !important
</style>


