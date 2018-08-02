<template>
  <div id="suggestions">
    <sub-header :headerMark="headerMark"></sub-header>
    <div class="content-box" ref="suggestionBox">
      <div class="content">
        <div class="problems">
          <div class="title">问题类型</div>
          <div class="choices clearfix">
            <div class="column-one f-l">
              <div class="choice-item p-r" v-for="(item,index) in colOneItems" :key="item.age" @click="switchChoose(item)">
                <span class="choose-ic p-a" :class="{'chosen':item.isChosen}"></span>
                <div style="margin-left:35px">
                  {{item.proIntro}}
                </div>
              </div>
            </div>
            <div class="column-two f-l">
              <div class="choice-item p-r" v-for="(item,index) in colTwoItems" :key="item.age" @click="switchChoose(item)">
                <span class="choose-ic p-a" :class="{'chosen':item.isChosen}"></span>
                <div style="margin-left:35px;">
                  {{item.proIntro}}
                </div>
              </div>
            </div>
            <!-- <div class="column-three f-l">
              <div class="choice-item p-r" v-for="(item,index) in colThreeItems" :key="item.age" @click="switchChoose(item)">
                <span class="choose-ic p-a" :class="{'chosen':item.isChosen}"></span>
                {{item.name}}
              </div>
            </div> -->
          </div>
        </div>
        <div class="feed-back">
          <div class="title">备注(最多120个字)</div>
          <div class="text-box p-r">
            <div class="text">
              <textarea name="feedBack" id="feedBack" cols="30" rows="5"  v-model="textVal" @input="limitSubs" maxlength="120"></textarea>
            </div>
            <span class="cls-text p-a" @click="clearText" v-show="textVal.trim().length"></span>
            <div class="words-show p-a">
              <span>{{wordsNum}}</span>
              <span>/120</span>
            </div>
          </div>
          <div class="picture-pick clearfix">
            <!-- <div class="pic-item-box f-l p-r" v-for="styleItem in pictureItems" :key = "styleItem.name" :style="styleItem"> -->
            <div class="pic-item-box f-l p-r" v-for="(urlItem,index) in pictureItems" :key="urlItem.name">
              <img class="pic-item p-a" :src="urlItem" alt="xt">
              <span class="min-ic p-a t-c" @click="minusPicture(index)"> - </span>
            </div>
            <div class="add-tip f-l" v-show="!(pictureItems.length==4)" @click="addPicture"></div>
          </div>
        </div>
        <div class="comfirm t-c">
          <span class="t-c" @click="submitSuggestions">提交</span>
        </div>
      </div>
    </div>
    <portraitAction :sheetVisible="sheetVisible" :portraitMark="portraitMark"></portraitAction>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import { Toast, Spinner, Indicator } from "mint-ui";
// import {getMyCounpLists} from '../../server/getData';

// import { setTimeout, clearTimeout } from 'timers';
import subHeader from "../commonComponents/subHeader";
import portraitAction from "../commonComponents/portraitAction";
import { getProblems, subProblems } from "../../server/getData";
import common from "../../common/js/common";
import { debug } from "util";
import baseUrl from "../../server/baseURL";
import { MessageBox } from "mint-ui";
export default {
  name: "suggestions",
  data() {
    return {
      headerMark: "意见反馈",
      activtyItems: [], //意见选择选项
      colOneItems: [], //第一列数据
      colTwoItems: [], //第二列数据
      textVal: "", //意见内容
      // imgItems:[], //选择的图片源数组
      pictureItems: [], //选择的文件
      sheetVisible: false, //添加图片组件显示
      portraitMark: "意见反馈",
      problemIds: [],
      files: [],
      flag: true
    };
  },
  components: {
    subHeader,
    portraitAction
  },
  computed: {
    wordsNum() {
      //字数
      return this.textVal.trim().length;
    }
  },
  methods: {
    //添加滚动事件
    _initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.suggestionBox, {
            probeType: 3,
            scrollY: true,
            click: true
            // scrollbar:true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    //意见提交
    async submitSuggestions() {
      // alert(this.flag);
      if (this.flag == true) {
        console.log("提交意见");
        // alert('开始上次图片了');
        // user_id	是	int	用户id
        // parklot_id	否	int	车场Id(没有)
        // remark	否	string	反馈信息
        // problem_ids	是	int[]	问题Id列表
        // file	否	List	反馈文件列表
        // timestamp	是	String	时间戳
        if (this.problemIds.length === 0) {
          Toast("请选择意见反馈类型。");
          return;
        }
        let user = common.getStorage("H5_user_id");
        let formData = new FormData();
        formData.append("user_id", user);
        formData.append("parklot_id", 0);
        formData.append("remark", this.textVal);
        formData.append("problem_ids", this.problemIds);
        console.log(this.files);
        if (this.files.length !== 0) {
          for (let i = 0; i < this.files.length; i++) {
            formData.append("file", this.files[i].file,this.files[i].name);
          }
        }
        
        formData.append("timestamp", String(+new Date()));
        let config = {
          headers: {
            "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递
          }
        };
        let URL = baseUrl.requestUrl;
        this.flag = false;
        // alert(formData);
        this.$root.eventHub.$http
          .post(URL + "apiwrite/feedback/add", formData, config)
          .then(res => {
            // console.log(res);
            // alert(JSON.stringify(res));
            if (res.body.error_code === 2000) {
              let htmls = `
                    <div class="message-info">
                      <div class="is-text">感谢您的反馈，我们将尽快为您处理。</div>
                    </div>`;
              MessageBox({
                title: "温馨提示",
                message: htmls,
                showConfirmButton: true,
                confirmButtonText: "我知道了",
                showCancelButton: false,
                closeOnClickModal: false
              }).then(action => {
                  if (action == "confirm") {
                    this.flag = true;
                    this.$router.go(-1);
                  }
                })
                .catch(err => {});
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    //意见选择分类处理
    async classFyItems() {
      let res = await getProblems();
      this.colOneItems = [].concat([]);
      this.colTwoItems = [].concat([]);
      if (res.error_code === 2000) {
        let params = res.data.problems;
        params.forEach((item, key) => {
          if (key % 2 == 0) {
            this.$set(item, "isChosen", false);
            this.colOneItems.push(item);
          } else {
            this.$set(item, "isChosen", false);
            this.colTwoItems.push(item);
          }
        });
      } else {
        Toast("错误码是" + res.error_code);
      }
    },
    //点击选择/取消意见选项
    switchChoose(item) {
      this.$set(item, "isChosen", !item.isChosen);
      console.log(item.isChosen);
      if (item.isChosen === true) {
        this.problemIds.push(item.id);
      } else {
        let num = this.problemIds.indexOf(item.id);
        if (num > -1) {
          this.problemIds.splice(num, 1);
        }
      }
      console.log(this.problemIds);
    },
    //清空文本
    clearText() {
      this.textVal = "";
    },
    //限制意见字数
    limitSubs() {
      let text = this.textVal.trim();
      if (text.length > 120) {
        this.textVal = text.substr(0, 120);
      }
    },
    //添加展示图片
    addPicture() {
      this.sheetVisible = true;
    },
    //点击删除展示图片
    minusPicture(index) {
      this.pictureItems.splice(index, 1);
      this.files.splice(index, 1);
      console.log(this.pictureItems);
    }
  },
  created() {
    this._initScroll();
    //隐藏图像上传组件
    this.$root.eventHub.$on("cancel-portrait", () => {
      this.sheetVisible = false;
    });
    //选择或拍照图片后
    this.$root.eventHub.$on("deliver-img", e => {
      //获取拍照或者选取的图片 这里加提交上传传接口
      this.files.push(e);
      this.pictureItems.push(e.imgURL);
      this.sheetVisible = false;
    });
  },
  activated() {
    // this.getProblemsTab();
    this.classFyItems();
  },
  beforeRouteLeave(to, from, next) {
    this.pictureItems = [].concat([]);
    this.textVal = "";
    next();
  },
  // 退出的时候，销毁组件即可
  deactivated() {
    // debugger
    this.$destroy(true);
  }
};
</script>
<style lang="stylus">
@import '../../common/css/base.stylus';
@import '../../common/css/mixin.stylus';

.message-info {
  height: 2.5rem;

  .is-text {
    line-height: 2.5rem;
  }
}

#suggestions {
  background-color: #F5F5F5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;

  .content-box {
    position: absolute;
    width: 100%;
    top: 3rem;
    bottom: 0;
    overflow: hidden;

    .content {
      .problems {
        font-size: 1rem;

        .title {
          padding: 1.125rem 1rem;
          color: #666;
        }

        .choices {
          background-color: #fff;
          padding: 0.5rem 1rem;
          border-top: 0.0625rem solid #e5e5e5;
          border-bottom: 0.0625rem solid #e5e5e5;

          .column-one {
            width: 50%;
          }

          .column-two {
            width: 50%;
          }
        }
      }

      .feed-back {
        margin-top: 0.5rem;

        .title {
          padding: 1.125rem 1rem;
          padding-bottom: 0.625rem;
          color: #666;
          border-bottom: 1px solid #e5e5e5;
        }

        .text-box {
          padding: 1rem 1rem;
          background-color: #fff;

          .text {
            textarea {
              display: inline-block;
              width: 100%;
              outline: none;
              border: none;
              max-height: 6.875rem;
              font-size: 0.8rem;
              color: #666;
            }

            textarea::-webkit-input-placeholder {
              color: #ccc;
            }
          }

          .cls-text {
            width: 0.6rem;
            height: 0.6rem;
            top: 0.3rem;
            right: 1rem;
            bg-img('../../assets/img/btn_close');
          }

          .words-show {
            font-size: 0.8rem;
            color: #666;
            right: 1rem;
            bottom: 0rem;
          }
        }

        .picture-pick {
          // background-color: #fff;
          // border-bottom: 1px solid #e5e5e5;

          .pic-item-box, .add-tip {
            width: 25%;
            background-size: 70% 70% !important;

            .min-ic {
              width: 1rem;
              height: 1rem;
              line-height: 0.7rem;
              background-color: #d01d95;
              border-radius: 50%;
              top: 0%;
              right: 0%;
              color: #fff;
              transform: translate3d(-60%, 60%, 0);
              font-size: 1.5rem;
              font-weight: normal;
            }

            .pic-item {
              width: 70%;
              height: 70%;
              top: 50%;
              left: 50%;
              transform: translate3d(-50%, -50%, 0);
            }
          }

          .pic-item-box:before, .add-tip:before {
            content: '';
            display: inline-block;
            padding-bottom: 100%;
            width: 1px;
            vertical-align: middle;
          }

          .add-tip {
            bg-img('../../assets/img/mine_more_add');
          }
        }
      }

      .comfirm {
        padding: 3rem 0;
        font-size: 1rem;
        height: 2.2rem;
        line-height: 2.2rem;
        background-color: #F5F5F5;

        span {
          display: inline-block;
          width: 45%;
          color: #FFF;
          bg-img('../../assets/img/Background');
          border-radius: 1.25rem;
        }
      }
    }
  }

  .choice-item {
    padding: 0.75rem 0 0.75rem 1.5625rem;
    color: #1a1a1a;
    font-size: 1rem;
    font-weight: normal;

    // text-align center
    .choose-ic {
      width: 1rem;
      height: 1rem;
      left: 20%;
      top: 50%;
      transform: translateY(-50%);
      bg-img('../../assets/img/mine_more_add_choice');
    }

    .chosen {
      bg-img('../../assets/img/mine_more_add_choice_on');
    }

    .ic-chose {
      width: 1rem;
      height: 1rem;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      bg-img('../../assets/img/mine_more_add_choice_on');
    }
  }
}
</style>


