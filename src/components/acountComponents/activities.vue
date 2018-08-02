<template>
  <div id="activities">
    <sub-header :headerMark="headerMark"></sub-header>
    <no-data-tips :tipMark ="tipMark"  :parkItems="activtyItems"></no-data-tips>
    <div class="activities-box" ref="activeBox">
      <div class="activities-content">
        <div v-for="(item,index) in activtyItems" :key="index" @click="goTohref(item.href)">
          <div class="act-content" :class="{'isNo1':index != '0'}">
            <div class="act-text">{{item.name}}</div>
            <div class="act-img-content">
              <img :src="item.filePath" alt="" class="act-img">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import BScroll from 'better-scroll';
import { Toast, Spinner, Indicator } from "mint-ui";
import { getActives } from "../../server/getData";
import { setTimeout, clearTimeout } from 'timers';
import subHeader from "../commonComponents/subHeader";
import noDataTips from "../commonComponents/noDataTip";
export default {
  name: "activities",
  data() {
    return {
      tipMark: "暂无活动",
      headerMark: "活动中心",
      pageNum: 0, // 活动的页码
      activtyItems: [],
      timer:null,  //上拉刷新定时
    };
  },
  components: {
    subHeader,
    noDataTips
  },
  methods: {
    // 初始化滚动事件
    //添加滚动事件  测试使用vscode 工具来提交代码
    _initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.activeBox, {
            probeType: 3,
            scrollY: true,
            click: true
          });
        } else {
          this.scroll.refresh();
        }
        console.log(1234);
        let _self = this;
        if (this.scroll) {
          this.scroll.on("scroll", props => {
            clearTimeout(_self.timerup);
            clearTimeout(_self.timer);
            let scrollY = props.y;
            console.log(scrollY);
            if (scrollY > 30) {
              _self.timerup = setTimeout(() => {
                _self.pageNum = 0;
                _self.getActivity();
              }, 30);
            }
            let el = this.scroll.scroller;
            let elParent = el.parentElement;
            let elH = el.offsetHeight;
            let parentH = elParent.offsetHeight;
            if (scrollY < parentH - elH && (scrollY != 0)) {
              _self.timer = setTimeout(() => {
                _self.isLoading = true;
                _self.pageNum++;
                _self.getActivity();
              }, 30);
            }
          });
        }
      });
    },
    // 请求活动信息的数据
    async getActivity() {
      // 1. 先确定参数
      let params = {
        state: 2,
        page_num: this.pageNum,
        timestamp: new Date().getTime()
      };
      //2. 发送请求
      let res = await getActives(params);
      //  error_code : 2000 error_message : "请求成功"

      // 3. 对请求是否成功,是否存在数据； 存在 处理数据（有多个数据）  不存在就清空  请求失败提示用户错误信息
      if (res.error_code == 2000) {
        if (res.data.length == 0) {
          this.activtyItems = [];
        } else {
          this.displayItems(res);
        }
      } else {
        Toast({
          message: res.error_message,
          duration: 1500
        });
      }
    },

    // 对请求回来的活动信息做处理
    displayItems(res) {
      let listData = res.data;
      if (this.pageNum === 0) {
        this.activtyItems = [].concat(listData);
      } else {
        this.activtyItems = this.activtyItems.concat(listData);
      }
      this._initScroll();
      if (this.scroll) {
        this.scroll.refresh();
      }
    },

    // 跳转到活动页面
    goTohref(href) {
      sessionStorage.setItem('H5_goToAMap','1');
      if(href == null){
        return;
      }else{
        window.location.href = href;
      }
    }
  },
  created() {},
  activated() {
    // 1. 获取到数据
    this.getActivity();
    // 2. 渲染数据
  },
  deactivated() {}
};
</script>


<style lang="stylus">
@import '../../common/css/base.stylus';
@import '../../common/css/mixin.stylus';

#activities {
  background-color: #F5F5F5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
}

.activities-box {
  position: absolute;
  overflow: hidden;
  top: 3.9375rem;
  bottom: 0;
  width: 100%;
}

.activities-content {
  padding: 0 0.9375rem;
  width: 100%;
}

.act-content {
  width: 100%;
  padding: 0.625rem 0.9375rem 0.625rem 0.625rem;
  border-radius: 0.3rem;
  background-color: #fff;
  border: 0.0625rem solid #e6e6e6;
}

.act-text {
  font-size: 1rem;
}

.act-img-content {
  margin-top: 0.425rem;
  width: 100%;
}

.act-img {
  width: 100%;
  height: 7.4375rem;
}

.isNo1 {
  margin-top: 0.75rem;
}
</style>


