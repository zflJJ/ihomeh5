<template>
  <div id='search' @click='hideEdit'>
    <div class="search-header" ref="search-header">
      <div class="search-wrap flex">
        <!-- 返回按钮开始-->
        <div class="back-btn" @click="backPage">
          <span></span>
        </div>
        <!-- 搜索框开始 -->
        <div class="search-box fl-o">
          <div class="search-comp p-r">
            <span class="search-ic p-a"></span>
            <input class="search-val" type="text" autofocus="true" placeholder="请输入停车地址" ref="inputSearch" v-model="searchVal" @input="_getInfo">
            <span class="clear-sch p-a" v-show="searchVal!=''" @click="delSeachVal"></span>
          </div>
        </div>

      </div>
    </div>
    <div class="result-wrap" ref="resultWrap">
      <div class="result-scroll">
        <!-- 设置常用地址开始-->
        <div class="common-adr flex p-r" v-show="isLogin&&!isSettingpage&&!searchFlag">
          <div class="ic p-a"></div>
          <div class="info-box fl-o clearfix" @click="goTopage(usualParks)">
            <div class="title f-l">常用地址</div>
            <span class="info f-l">{{usualParks.name?(usualParks.name.length>15?usualParks.name.substr(0,15)+"...":usualParks.name):""}}</span>
          </div>
          <div class="action-btn" v-show="isLogin">
            <div class="setting p-r" v-show='isSettingflg' @click="changePage">
              <div class="go-info">去设置</div>
              <div class="go-ic p-a"></div>
            </div>
            <div class="edit-act" v-show='!isSettingflg' @click.stop="showEdit"></div>
          </div>
          <div class="edit-btn flex p-a" v-show='isEditFlg'>
            <div class="edit fl-o" @click="changePage">编辑</div>
            <div class="delete fl-o" @click="delUsnalparks">删除</div>
          </div>
        </div>
        <!--搜索结果显示 -->
        <!-- 搜索结果头的显示-->
        <div class="result-header" v-show='searchLists.length'>{{isHistory?"搜索历史":"搜索结果"}}</div>
        <!--搜索结果的列表显示 -->
        <div class="result-list">
          <div class="result-item" v-for="(item,inde) in searchLists" :key='inde' @click="gotoDetail(item)">
            <div class="item-name">{{item.name}}</div>
            <div class="item-address">{{item.address}}</div>
          </div>
        </div>
        <!--删除历史纪录按钮开始-->
        <div class="delHistory" v-show='isHistory&&searchLists.length' @click="clearHistory">清空历史</div>
      </div>
      <no-data-tips :tipMark ="tipMark"  :parkItems="searchLists" v-if="searchFlag"></no-data-tips>
    </div>
  </div>
</template>
<script>
import { Indicator, Toast } from "mint-ui";
import common from "../../common/js/common";
import {
  getMySearchLists,
  getMyUsualParks,
  setMyUsualParks
} from "../../server/getData"; //当前位置停车场的模糊查询接口
import BScroll from "better-scroll";
import noDataTips from '../commonComponents/noDataTip';
export default {
  name: "search",
  data() {
    return {
      isLogin: false,
      ishasDefaultAddress: false,
      currentLng: 0,
      currentLat: 0,
      searchLists: [],
      searchVal: "",
      scroll: null,
      isHistory: true,
      isSettingflg: true,
      isSettingpage: false,
      usualParks: {},
      isEditFlg: false,
      timer: null,
      tipMark: '暂无搜索结果',
      searchFlag: false,
    };
  },
  computed: {},
  watch: {
    searchLists(val, oldVal) {
      if (!this.scroll) {
        this._initScroll();
      } else {
        console.log('这里进行刷新服务')
        this.scroll && this.scroll.refresh();
      }
    }
  },
  created() {

  },
  mounted() {
    let _this = this;
  },
  activated() {
    console.log(this.searchFlag);
    console.log("激活执行");
    this.searchFlag = false;
    this._initInfo(); //每次进入都需要查看常用地址是否进行了更新操作
    this.$refs.inputSearch.focus(); //获取焦点
    this.isSettingpage = false;
    this.isEditFlg=false;
    this.searchFlag = false;
  },
  components: {
    noDataTips
  },
  methods: {
    _initInfo() {
      let loactionPosition=JSON.parse(localStorage.getItem('H5_geoLocation'));
      this.currentLng=loactionPosition.lng;
      this.currentLat=loactionPosition.lat;
      this.searchVal='';
      this.isLogin = common.getStorage("H5_user_id");
      this._getSearhHistory();
      if (this.isLogin) {
        this.getUsualParks(this.isLogin);
      }
      //还需要从路由中取出当前位置的经纬度
    },
    async _getSearchInfo() {
      let res = await getMySearchLists(
        this.currentLng,
        this.currentLat,
        this.searchVal
      );
      if (res.error_code == 2000) {
        this.isHistory = false;
        this.searchLists = [...res.data.parklots];
      } else {
        this.searchLists = [];
      }
      if(this.searchLists.length == 0){
        this.searchFlag = true;
      }else{
        this.searchFlag = false;
      }
      console.log(this.searchLists,this.searchFlag);
    },
    _getSearhHistory() {
      let historySearchLists = JSON.parse(
        localStorage.getItem("H5_history_lists")
      );
      console.log("历史搜索:" + historySearchLists);
      if (historySearchLists) {
        this.isHistory = true;
        this.searchLists = [...historySearchLists];
      } else {
        this.searchLists = [];
      }
    },
    _getInfo() {
      let _this = this;
      if (_this.searchVal) {
        _this._getSearchInfo();
      } else {
        _this._getSearhHistory();
      }
    },
    _initScroll() {
      // this.scroll && this.scroll.destory();
      console.log("初始化better");
      this.scroll = new BScroll(this.$refs.resultWrap, {
        probeType: 1,
        scrollY: true,
        click: true
      });
    },
    async getUsualParks(userId) {
      let res = await getMyUsualParks(userId);
      if (res.error_code == "2000") {
        let data = res.data;
        if (!data) {
          this.usualParks = {};
          this.isSettingflg = true;
        } else {
          this.isSettingflg = false;
          this.usualParks = data;
        }
      } else {
        Toast({
          message: "个人常用车场信息获取失败",
          duration: 1500
        });
      }
    },
    async setUsualParks(item) {
      let parkid = item == -1 ? -1 : item.id;
      let res = await setMyUsualParks(this.isLogin, parkid);
      if (res.error_code == 2000) {
        if (parkid == -1) {
          this._initInfo();
        } else {
          this.isSettingpage = false;
          this.searchVal = "";
          this.setSearchHistory(item);
          this._initInfo();
        }
      } else {
        if (parkid == -1) {
          Toast({
            message: "删除个人常用地址设置失败",
            duration: 1500
          });
        } else {
          Toast({
            message: "个人常用地址设置失败",
            duration: 1500
          });
        }
      }
    },
    delUsnalparks() {
      this.setUsualParks(-1);
      this.isEditFlg = false;
    },
    gotoDetail(item) {
      if (this.isLogin) {
        if (this.isSettingpage) {
          this.setUsualParks(item);
        } else {
          this.setSearchHistory(item);
          this.searchVal='';
          localStorage.setItem("H5_park_lot_id", JSON.stringify(item.id));
          if (item.type == 0) {
            //静态车场跳转车场详情
            this.$router.push("parkDetail");
          } else {
            this.$router.push("appoint");
          }
        }
      } else {
        if (item.type == 0) {
          localStorage.setItem("H5_park_lot_id", JSON.stringify(item.id));
          this.$router.push("parkDetail");
        } else {
          this.$router.push("/login");
        }
      }
    },
    goTopage(item) {
      common.setStorage("H5_park_lot_id", item.parklotId);
      if (item.type == 0) {
        this.$router.push("/parkDetail");
      } else if (item.type == 1 || item.type == 2) {
        this.$router.push("/appoint");
      }
    },
    setSearchHistory(params) {
      let historySearchLists = JSON.parse(
        localStorage.getItem("H5_history_lists")
      );
      if (!historySearchLists) {
        historySearchLists = [];
        historySearchLists.unshift(params);
      } else {
        let isReapeted = false;
        for (let item of historySearchLists) {
          isReapeted = false;
          if (params.id == item.id) {
            isReapeted = true;
            return;
          }
        }
        if (!isReapeted) {
          historySearchLists.unshift(params);
        }
      }
      if (historySearchLists.lenghth > 10) {
        historySearchLists.slice(0, 10);
      }
      localStorage.setItem(
        "H5_history_lists",
        JSON.stringify(historySearchLists)
      );
    },
    showEdit() {
      this.isEditFlg = !this.isEditFlg;
    },
    changePage() {
      this.isEditFlg = false;
      this.searchVal = "";
      this.isSettingpage = true;
      this.$refs.inputSearch.focus();
      this._getSearhHistory();
    },
    backPage() {
      if (this.isSettingpage) {
        this.isSettingpage = false;
        this.searchVal = "";
        this.$refs.inputSearch.focus();
        this._getSearhHistory();
      } else {
        //this.$router.push("home");
        history.back();
      }
    },
    delSeachVal() {
      this.searchVal = "";
      this._getSearhHistory();
    },
    clearHistory(){
      localStorage.removeItem('H5_history_lists');
      this._getSearhHistory();
    },
    hideEdit (){
      this.isEditFlg=false;
    }
  }
};
</script>

<style lang='stylus' scoped>
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'

#search
  position absolute
  top 0
  left 0
  bottom 0
  right 0
  background-color #f5f5f5
.search-header
  width 100%
  padding 0.5rem 0
  background-color #ffffff
  .search-wrap
    width 100%
    height 2rem
    line-height 2rem
    .back-btn
      padding-left 0.85rem
      padding-right 0.95rem
      height 100%
      line-height 1
      padding-top 0.28rem
      span
        display inline-block
        width 1.375rem
        height 1.25rem
        bg-img('../../assets/img/btn_back')
    .search-box
      width 100%
      height 2rem
      line-height 2rem
      padding-right 0.9375rem
      .search-comp
        width 100%
        background-color #e6e6e6
        border-radius 0.3125rem
        .search-ic
          width 1rem
          height 1rem
          top 50%
          left 0.625rem
          transform translateY(-46%)
          bg-img('../../assets/img/parking_seach')
        .clear-sch
          width 0.8rem
          height 0.8rem
          top 50%
          right 0.625rem
          transform translateY(-50%)
          bg-img('../../assets/img/search_qingchu')
        input
          display inline-block
          padding-left 2rem
          height 60%
          width 100%
          font-size 0.875rem
          outline none
          border none
          color #80666666
          background-color rgba(255 255 255 0)
        input::-webkit-input-placeholder
          color #80666666
.result-wrap
  position absolute
  top 3rem
  left 0
  bottom 0.6875rem
  right 0
  padding-top 0.6875rem
  overflow hidden
.result-header
  padding 0.6875rem 1.125rem
  color #666
  font-size 0.8rem
.result-list
  border-top 1px solid #e6e6e6
  .result-item
    margin-top 0.625rem
    border-top 0.0625rem solid #e6e6e6
    border-bottom 0.0625rem solid #e6e6e6
    padding 0.5rem 0 0.5rem 1.125rem
    background-color #fff
    .item-name
      font-weight bolder
      font-size 1rem
    .item-address
      color #666
      margin-top 0.4rem
.common-adr
  padding 0.9375rem
  padding-right 1.125rem
  padding-left 2.0625rem
  background-color #ffffff
  border-top 0.0625rem solid #e6e6e6
  border-bottom 0.0625rem solid #e6e6e6
  .ic
    width 0.75rem
    height 0.9rem
    left 1.125rem !important
    top 52%
    transform translateY(-50%)
    bg-img('../../assets/img/home_vip')
  .info-box
    font-size 1rem
    color #1a1a1a
    div
      display inline-block
    .info
      display inline-block
      height 100%
      // min-width 40%
      min-width 50%
      outline none
      border none
      color #999
      font-size 1rem
      margin-left 1rem
  .action-btn
    color #999
    .setting
      padding-right 0.9rem
      .go-ic
        width 0.4rem
        height 0.9rem
        right 0
        top 50%
        transform translateY(-50%)
        bg-img('../../assets/img/wuye_up')
        background-position center left
    .edit-act
      position absolute
      right 0.5rem
      top 0.6rem
      width 2rem
      height 2rem
      bg-img('../../assets/img/home_search_edit')
      background-size 1.125rem 1.125rem
      background-position center center
  .edit-btn
    right 1.125rem
    bottom 0
    background-color rgba(0, 0, 0, 0.85)
    padding 0.4rem 0.6rem
    border-radius 0.3rem
    font-size 0.8rem
    transform translateY(80%)
    .edit
      color #ffffff
      padding-right 0.625rem
      border-right 0.0625rem solid #fff
    .delete
      color #d01c95
      padding-left 0.625rem
.delHistory
  margin 0.6rem auto 0
  width 6.4rem
  height 2.5rem
  line-height 2.4rem
  font-size 0.8rem
  border 0.05rem solid #201a1a
  text-align center
  color #999999
</style>

