<template>
  <div id="news">
    <sub-header :headerMark="headerMark"></sub-header>
    <no-data-tips tipMark ="暂无活动"  :parkItems="newsItems"></no-data-tips>
    <div class="news-content p-a" ref="newsBox">
      <div class="news-lists">
        <div class="news-item-box" v-for="(item,index) in newsItems" :key="index" @click="goBack(item)">
          <div class="news-item">
            <div class="item-top p-r">
              {{item.title}}
              <span class="go-ic p-a"></span>
            </div>
            <div class="item-bottom">
              <div class="bottom-info">{{item.content}}</div>
              <div class="bottom-time clearfix"><div class="f-r"><span>{{item.date}}</span>&nbsp;&nbsp;<span>{{item.time}}</span></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import noDataTips from '../commonComponents/noDataTip';
import { getMyNews } from '../../server/getData';
import subHeader from '../commonComponents/subHeader';
import {addMyCars} from '../../server/getData';
import { Toast } from 'mint-ui';
import BScroll from 'better-scroll';
import { formatTimeStamp } from '../../common/js/H5plugin';
export default {
  name:'news',
  data () {
    return {
      headerMark: '我的消息',
      newsItems:[],  //消息列表
      newsType: 0,  //消息类型 0 个人消息 1活动消息
      pageNum: 0,   //页数
    }
  },
  components: {
    subHeader,
    noDataTips
  },
  methods:{
    //添加页面滚动
    _initScroll(){
      this.$nextTick(()=>{
        if(!this.scroll){
          this.scroll = new BScroll(this.$refs.newsBox,{
            probeType: 3,
            scrollY: true,
            click: true
          });
        //滚动刷新事件
        }else{
          this.scroll.refresh();
        }
      });
    },
    //获取我的消息，默人只显示个人消息
    async getNews(){
      let userId = JSON.parse(localStorage.getItem('H5_user_id'));
      if(!userId){
        return;
      }
      let res = await getMyNews(userId,this.newsType, this.pageNum);
      if(res.error_code == 2000){
        this.newsItems = [].concat(res.data);
        this.formatNewsItems();
      }else{
        Toast({
            message:'获取个人消息信息失败',
            duration:1500
          })
      }
    },
    //处理消息列表的时间
    formatNewsItems(){
      for(let item of this.newsItems){
        let createTimeStr = formatTimeStamp(item.createTime);
        // "2018-02-02 09:16:21:00"
        
        let date = createTimeStr.substr(5,5);
        let time = createTimeStr.substr(11,5);
        this.$set(item,'date',date);
        this.$set(item,'time',time);
        console.log(item)
      }
    },
    //点击消息事件
    goBack(item){
      console.log(item);
      if(item.title === '预约消息'){
        this.$router.push('/appointment');
      }else{
        this.$router.go(-1);
      }
    }
  },
  created () {
    this._initScroll();
  },
  activated () {
    this.getNews();
  }
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#news
  background-color #F5F5F5
  width 100%
  position fixed
  top 0
  bottom 0
  .news-content
    width 100%
    top 3rem
    bottom 0
    overflow hidden
    .news-lists
      padding .4375rem .875rem
      .news-item-box
        padding .4rem 0
        .news-item
          border .0625rem solid #e6e6e6
          border-radius .5rem
          background-color #fff
          .item-top
            font-size 1rem
            color #1a1a1a
            font-weight bold
            padding .9375rem 1.25rem
            .go-ic
              width .6rem
              height 1rem
              bg-img('../../assets/img/arrow_r')
              right 1.25rem
              top 50%
              transform translateY(-50%)
          .item-bottom
            padding .875rem 1.25rem
            border-top .0625rem solid #e6e6e6
            .bottom-info
              font-size .9rem
              color #666
              margin-bottom .6rem
            .bottom-time
              font-size .8rem
              color #999
</style>


