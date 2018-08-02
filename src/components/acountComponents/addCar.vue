<template>
  <div id="add-car">
    <sub-header :headerMark="headerMark"></sub-header>
    <div class="content p-a">
      <div class="warn">请输入真实有效的车牌号码</div>
      <div class="selct-plate flex">
        <input type="text" class="input-style" @focus="isNotsync(1)" v-model="proInfo" ref="input1"> &nbsp;
        <input type="text" class="input-style" @focus="isNotsync(2)" v-model="iniInfo" ref="input2"> &nbsp;&nbsp;
        <input type="text" v-model="plateNum" @focus="isNotsync(3)" placeholder="请输入车牌号" class="plate-input" maxlength="6"></div>
      <div class="plate-b fl-o">
      </div>
      <div class="add-btn">
        <div class="add-btn-style" @click="addPlate">添加车辆</div>
      </div>
    </div>
    <custom-key></custom-key>
    <!-- <choose-plate :plateShowed="plateShowed"></choose-plate> -->
  </div>
</template>
<script>
import subHeader from "../commonComponents/subHeader";
import choosePlate from "../commonComponents/choosePlate";
import { addMyCars } from "../../server/getData";
import { Toast } from "mint-ui";
import customKey from "../commonComponents/custom.vue";
import common from "../../common/js/common";
export default {
  name: "addCar",
  data() {
    return {
      headerMark: "添加车辆",
      plateNum: "", //填入的车牌号
      plateShowed: false, //是否显示了车牌选择组件
      proInfo: "粤", //省份
      iniInfo: "B", //车牌号位
      cletoast: null
    };
  },
  components: {
    subHeader,
    // choosePlate,
    customKey
  },
  methods: {
    // 输入框获取焦点事件，并激活模拟键盘 测试提交信息
    isNotsync(index) {
      // let input1 = this.$refs.input1;
      // input1.style.border = "1px solid #d01d95";
      if (index == 1) {
        let input1 = this.$refs.input1;
        let input2 = this.$refs.input2;
        input2.style.border = "1px solid #a9a9a9";
        input1.style.border = "1px solid #d01d95";
      } else if (index == 2) {
        let input2 = this.$refs.input2;
        let input1 = this.$refs.input1;
        input1.style.border = "1px solid #a9a9a9";
        input2.style.border = "1px solid #d01d95";
      } else {
        let input1 = this.$refs.input1;
        let input2 = this.$refs.input2;
        input1.style.border = "1px solid #a9a9a9";
        input2.style.border = "1px solid #a9a9a9";
      }
      this.$root.eventHub.$emit("showK", index);
      document.activeElement.blur();
    },
    focusEvent() {
      this.cletoast.close();
    },
    async addCar(plate) {
      var userId = common.getStorage("H5_user_id");
      let res = await addMyCars(userId, plate);
      if (res.error_code === 2000) {
        this.$router.push({
          path: "/car"
        });
      } else if (res.error_code === 2500) {
        Toast("车牌号码已存在");
      } else {
        console.log("错误码是：" + res.error_code);
      }
    },
    //点击添加车辆提交（正则判断）
    addPlate() {
      let plateNum = this.plateNum.trim();
      let plate = this.proInfo + this.iniInfo + plateNum;
      let plateNoReg = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/

      console.log(this.plateNum,plate);
      if (this.proInfo === "" || this.iniInfo === "" || this.plateNum === "") {
        this.cletoast = Toast("请输入正确的车牌号码");
        return;
      } else if (!plateNoReg.test(plate)) {
        this.cletoast = Toast("请输入正确的车牌号码");
        return false;
      } else {
        this.addCar(plate);
      }
    },
    // 点击选择牌头
    chooseHPlate() {
      this.plateShowed = true;
      this.$root.eventHub.$emit("show-plate-selection");
    }
  },
  created() {
    //接受选择的省份和牌头
    this.$root.eventHub.$on("confirm-plate-h", e => {
      this.proInfo = e.proInfo;
      this.iniInfo = e.iniInfo;
      this.plateShowed = false;
    });
    //隐藏车牌选择组件
    this.$root.eventHub.$on("hide-plate", () => {
      this.plateShowed = false;
    });
    this.$root.eventHub.$on("getItems", item => {
      this.proInfo = item;
    });
    this.$root.eventHub.$on("getkeyData", item => {
      this.iniInfo = item;
    });
    this.$root.eventHub.$on("getkeyNumber", item => {
      if (item === "del") {
        this.plateNum = this.plateNum.slice(0, this.plateNum.length - 1);
        return;
      }
      if (this.plateNum.length === 6) {
        return;
      } else {
        this.plateNum = this.plateNum + item;
      }
    });
  },
  activated() {
    this.plateNum = "";
    this.proInfo = "粤";
    this.iniInfo = "B";
  }
};
</script>
<style lang="stylus">
@import '../../common/css/base.stylus';
@import '../../common/css/mixin.stylus';

#add-car {
  background-color: #F5F5F5;
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;

  .content {
    width: 100%;
    top: 3.9375rem;

    .warn {
      padding: 1rem 1rem;
      font-size: 0.875rem;
      color: #999;
    }

    .selct-plate {
      background-color: #ffffff;
      padding: 1.125rem 2rem;

      .plate-h {
        width: 5.625rem;
        height: 1.25rem;
        line-height: 1.25rem;
        color: #191919;
        font-size: 0.875rem;
        font-weight: bolder;

        span {
          width: 0.75rem;
          height: 0.5rem;
          left: 2rem;
          top: 55%;
          transform: translateY(-44%);
          bg-img('../../assets/img/parting_car_down');
        }
      }

      .plate-b {
        input {
          display: inline-block;
          height: 1.25rem;
          line-height: 1.25rem;
          max-width: 80%;
          color: #999;
          border: none;
          outline: none;
          font-size: 0.875rem;
        }
      }
    }
  }

  .input-style {
    width: 2.125rem;
    height: 2.125rem;
    padding-left: 0.5rem;
    color: #D01D95;
  }

  .plate-input {
    /* display inline-block */
    height: 2.5rem;

    line-height 2.5rem {
      /* max-width  80% */
    }

    color: #999;
    border: none;
    outline: none;
    font-size: 0.875rem;
    vertical-align: middle;
  }

  .add-btn {
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    color: #ffffff;
    font-size: 1rem;
    margin-top: 1.8125rem;
    display: flex;
    justify-content: center;

    .add-btn-style {
      width: 10rem;
      background-color: #D01D95;
      text-align: center;
      border-radius: 3%;
    }
  }
}
</style>
