<template>
  <div id="appoint">
    <sub-header :headerMark="headerMark"></sub-header>
    <div class="content p-a" ref="apponitBox">
      <div>
        <!--1.0 车场信息-->
        <div class="info car-info">
          <div class="car-style">
            <div>
              <div class="ic ic-font1"></div>
              <span class="text">{{pointedItem.parklotName}}</span>
              <span v-if="pointedItem.parklotKind === 0" class="cars-color">室内</span>
              <span v-else-if="pointedItem.parklotKind === 1" class="cars-color">室外</span>
              <span v-else-if="pointedItem.parklotKind === 2" class="cars-color">室内+室外</span>
            </div>
            <div class="dis-2" @click="goParkDetail">
              <div class="message">详情</div>
              <div class="ic ic-style"></div>
            </div>
          </div>
          <div class="car-distance">
            <span class="text-distance">{{pointedItem.address}}</span>
          </div>
        </div>

        <!--2.0 收费规则-->
        <div class="info toll-rules">
          <div>
            <div class="ic ic-toll" style="vertical-align: middle"></div>
            <span class="text">收费规则</span>
          </div>
          <br>
          <div class="car-distance">
            <span class="text-distance" v-if="pointedItem.feeIntro == ''">暂无信息</span>
            <template v-else>
              <p class="text-distance">{{pointedItem.appointText}}</p>
              <p class="text-distance">{{pointedItem.stopText}}</p>
            </template>
            <!-- <span class="text-distance" v-else>{{pointedItem.feeIntro.substring(0,41)}}<br>{{pointedItem.feeIntro.substring(43)}}</span> -->
            <!-- <span class="text-distance" v-if="pointedItem.feeIntro == ''">{{pointedItem.feeIntro == '' ? '暂无信息' :pointedItem.feeIntro}}</span> -->
          </div>
        </div>
        <div class="info plate-number" @click="chooseCar">
          <div class="text-3">车牌号</div>
          <div class="dis-2">
            <input type="text" class="plate-info" placeholder="去添加" :value="plateNo" readonly>
            <!-- <div v-if=" carPlate === undefined " class="text-2color">{{pointedItem.plateNo}}</div>
              <div v-if=" carPlate !== undefined " class="text-2color">{{carPlate}}</div>             -->
            &nbsp;&nbsp;
            <div class="ic ic-style"></div>
          </div>
        </div>
        <!--4.0 入场时间-->
        <div class="info einlass plate-number">
          <div class="text-3">入场时间</div>
          <div class="dis-2" @click="openPicker">
            <div>{{defaultTime}}</div>
            &nbsp;&nbsp;
            <div class="ic ic-style"></div>
          </div>
        </div>

        <!--5.0 停靠时间-->
        <div class="info stop-time">
          <div class="text-3">可停至</div>
          <div class="exprie">{{leaveTime}}</div>
        </div>
        <div class="tips">
          <div class="tips-text">温馨提示</div>
          <div class="tips-text">1.请按时到预约车位停车。</div>
          <div class="tips-text">2.预约成功后{{pointedItem.freeCancellationTime}}分钟内可以免费取消订单。</div>
          <div class="tips-text">3.超时{{pointedItem.maxDelayTime}}分钟未进场订单自动取消。</div>
          <div class="tips-text">4.超过预约时间未离开，超时部分将收取超时费用。</div>
        </div>
      </div>
    </div>
    <div class="to-appoint t-c">
      <div class="div-flex">
        <div class="div-style ds-1">
          预约费&nbsp;
          <span style="color: #f63372">￥
            <span class="price-style">{{price}}</span>
          </span>
        </div>
        <div @click="goApoint" class="div-style ds-2">立即预约</div>
      </div>

    </div>
    <div :class="{alert: isshow}" @click="closeZinde"></div>
    <vue-pickers :show="show1" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn">
    </vue-pickers>
  </div>
</template>
<script>
  import {
    formatTimeStamp
  } from "../../common/js/H5plugin";
  import subHeader from "./subHeader";
  import {
    appointCarport,
    pay
  } from "../../server/getData";
  import {
    getMyCars
  } from "../../server/getData";
  import {
    postParklot
  } from "../../server/getData";
  import {
    Toast,
    Indicator
  } from "mint-ui";
  import {
    setTimeout,
    clearTimeout
  } from "timers";
  import {
    MessageBox
  } from "mint-ui"; // 这个是一个消息提示框
  import BScroll from "better-scroll";
  import VuePickers from "vue-pickers";
  import common from "../../common/js/common";
  export default {
    data() {
      return {
        plateNo: "", //车牌号
        plateNoId: "", //车牌号ID
        show1: false,
        isshow: false,
        headerMark: "预约",
        pointedItem: {}, //停车场接口获取信息返回 | enter
        carPlate: null,
        startTime: "", //选择开始时间
        endTime: "", //选择结束时间
        fmEndTime: "", //最晚规整的结束时间
        estateId: "", //预约场地的id
        mytime: "", // 按照当前的系统时间做做最晚时间处理
        /*--新的东西*/
        parkLotId: null, // 表示传递过来的车场的ID
        allTime: [],
        pickerVisible: null,
        reserveTimeList: [],
        feeList: [],
        pickData2: {
          columns: 2, // 两列
          link: true, // 联级必须需要link 参数
          default: [
            // 默认显示那个字段
            //  {
            //    text: '00',
            //    value: 1999
            //  },
            //  {
            //    text: '00',
            //    value: 101
            //  },
          ],
          // 第一列数据结构
          pData1: [
            // {
            //   text: '00',
            //   value: 1999
            // },
            // {
            //   text: '00',
            //   value: 2001
            // },
            // {
            //   text: '00',
            //   value: 2002
            // }
          ],
          // 第二列数据结构
          pData2: {
            // '1999': [
            //   {
            //     text: '00',
            //     value: 101,
            //     texts:'123'
            //   }
            // ],
            // '2001': [
            //   {
            //     text: '00',
            //     value: 104,
            //     texts:'123'
            //   },
            // ],
            // '2002': [
            //   {
            //     text: '00',
            //     value: 107
            //   },
            // ]
          }
        },
        nowTime: null,
        timeList: [], // 筛选出来的数据点集合
        arr: [],
        array: [],
        arrayflag: false,
        defaultTime: "00:00", // 默认时间
        leaveTime: null,
        priceTime: null, // 预约时间 -  当前系统时间 = 时间戳差值
        price: null, //价格信息

        parkItemObj: {}, //停车车场参数
        // params:{
        //   user_id: null, // 用户ID
        //   share_id:null,  // 共享时段ID
        //   parklot_id:null, //停车场ID
        //   plate_id:null,  // 车牌ID
        //   start_time:null, // 开始时间戳
        //   end_time:null,  // 结束时间戳
        // }
        params: {
          user_id: null, // 用户ID
          parklot_id: null, // 车场ID
          plate_id: null, // 车牌ID
          share_startTime: null, // 共享开始时间戳
          share_endTime: null, // 共享结束时间戳
          start_time: null, // 用户选择的时间戳
          end_time: null // 用户选择的结束时间戳
        },
        clickFlag: false
        // 1526180400000
        //  1526266800000
        // 1526266800000
        // 1526353200000
        // reserveTimeListCS: [{
        //     id: 1,
        //     startTime: 1526277600000,
        //     endTime: 1526364000000

        //   },
        //   {
        //     id: 2,
        //     startTime: 1526364000000,
        //     endTime: 1526450400000
        //   },
        // ]



      };
    },
    components: {
      subHeader,
      VuePickers
    },
    methods: {
      // 阻止事件的行为
      closeZinde() {
        this.isshow = false;
        this.show1 = false;
      },
      //添加屏幕滚动事件
      _initScroll() {
        this.$nextTick(() => {
          //左边滑动选择
          if (!this.leftScroll) {
            this.leftScroll = new BScroll(this.$refs.apponitBox, {
              probeType: 3,
              scrollY: true,
              click: true
            });
          } else {
            this.leftScroll.refresh();
          }
        });
      },
      //获取预约接口信息
      async getparklot() {
        // debugger
        let userId = common.getStorage("H5_user_id");
        this.parkLotId = JSON.parse(localStorage.getItem("H5_park_lot_id"));

        this.reserveTimeList = [];
        let res = await postParklot(userId, this.parkLotId);
        if (res.error_code === 2000) {
          console.log(res);
          res.data.feeIntro=res.data.feeIntro.replace(/\r\n/g, "@" );
          console.log(res.data.feeIntro.indexOf('@'))
          let num = res.data.feeIntro.indexOf('@')
          res.data.appointText = res.data.feeIntro.substring(0,num)
          res.data.stopText = res.data.feeIntro.substring(num+1)
          // console.log(res.data.feeIntro.substring(0,num))
          // console.log(res.data.feeIntro.substring(num+1))
          // res.data.feeIntro = res.data.feeIntro.substring(0,num) +res.data.feeIntro.substring(num+1)
          this.pointedItem = res.data;
          // alert(JSON.stringify(res.data.reserveTimeList));
          this.params.plate_id = this.pointedItem.plateId;
          this.params.parklot_id = this.pointedItem.parklotId;

          let plateObj = JSON.parse(localStorage.getItem("H5_chosen_plate"));
          // debugger;
          if (!plateObj) {
            if (res.data.plateNo == "") {
              this.getCars();
            } else {
              this.plateNo = res.data.plateNo;
              this.plateNoId = res.data.plateId;
            }
          } else {
            this.plateNo = plateObj.plateNo;
            this.plateNoId = plateObj.plateNoId;
            localStorage.removeItem("H5_chosen_plate");
          }
          //车场详情参数获取
          this.parkItemObj.id = res.data.parklotId;
          // 筛选时间
          this.feeList = this.pointedItem.feeList;
          // debugger
          console.log(this.defaultTime);
          this.reserveTimeList = this.pointedItem.reserveTimeList;
          // this.reserveTimeList = this.reserveTimeListCS;
          // console.log(this.reserveTimeList);

          if (!this.reserveTimeList.length) {
            // 这里有个提示框  并且确认键（跳转到首页）
            this.messInfo();
          } else {
            // debugger
            for (let i = 0; i < this.reserveTimeList.length; i++) {
              console.log(this.reserveTimeList[i].startTime);
              console.log(
                formatTimeStamp(this.reserveTimeList[i].startTime),
                formatTimeStamp(this.reserveTimeList[i].endTime)
              );
            }
            // this.filterTime(this.pointedItem.reserveTimeList);
            // 测试数据
            this.filterTime(this.reserveTimeList);
            console.log(this.timeList);
            this.disposeTime(this.timeList);
            console.log(this.timeList);
            // console.log(this.timeList);
            // 对时间段进行拆分
            this.dataChange();
          }

          this._initScroll();
        } else {
          Toast({
            message: "获取预约信息失败",
            duration: 1500
          });
        }
      },
      // 获取车牌号
      async getCars() {
        let userId = common.getStorage("H5_user_id");
        let res = await getMyCars(userId, 0);
        if (res.error_code == 2000) {
          if (res.data.plates.length === 0) {
            return;
          } else {
            this.plateNo = res.data.plates[0].number;
            this.plateNoId = res.data.plates[0].plateId;
          }
        } else {
          Indicator.close();
          Toast({
            message: "车牌号数据请求失败",
            duration: 1000
          });
        }
      },

      // 提示用户，支付超时，跳转 到预约界面
      messInfo() {
        let htmls =
          `
                      <div class="appointmessage-info">
                        <div class="is-text">车位已经被预约满了。</div>
                      </div>`;
        MessageBox({
            title: "温馨提示",
            message: htmls,
            showConfirmButton: true,
            confirmButtonText: "确认",
            showCancelButton: false
          })
          .then(action => {
            if (action == "confirm") {
              this.$router.push("/home");
            }
          })
          .catch(err => {});
      },
      // 筛出无效的时间段
      filterTime(timeList) {
        console.log(timeList, this.nowTime);
        // debugger
        for (var i = 0; i < timeList.length; i++) {
          // 间隔15分钟的时间都没有的话，就排除掉
          if (timeList[i].startTime >= this.nowTime) {
            if (timeList[i].startTime > timeList[i].endTime - 900000) {
              continue;
            } else {
              this.timeList.push({
                startTime: timeList[i].startTime,
                endTime: timeList[i].endTime,
                id: timeList[i].id
              });
            }
          } else if (timeList[i].startTime < this.nowTime &&timeList[i].endTime < this.nowTime) {
            console.log(123444);
            continue;
          } else if (timeList[i].startTime < this.nowTime &&this.nowTime < timeList[i].endTime - 900000) {
            this.timeList.push({
              startTime: timeList[i].startTime,
              endTime: timeList[i].endTime,
              id: timeList[i].id
            });
          }
        }
        console.log(this.timeList);
        // alert(JSON.stringify(this.timeList));
      },
      //跳转到车场详情页面
      goParkDetail() {
        localStorage.setItem("H5_park_item", JSON.stringify(this.parkItemObj));
        this.$router.push("parkDetail");
      },
      //对时间段进行去重处理
      disposeTime(timeList) {
        let tempTimelist = [];
        let tmObjective = timeList[0];
        let isUnited = false;
        if (timeList.length <= 1) {
          this.timeList = [].concat(timeList);
          timeList[0].endTime -= 900000;
          return;
        }
        for (let i = 1; i < timeList.length; i++) {
          let newItem = {};
          let item = timeList[i];
          if (tmObjective.endTime >= item.startTime &&item.endTime >= tmObjective.endTime ) {
            newItem.startTime = tmObjective.startTime;
            newItem.endTime = item.endTime;
            if (i > 0) {
              tempTimelist.pop(tempTimelist[length - 1]);
            }
            tempTimelist.push(newItem);
            tmObjective.startTime = newItem.startTime;
            tmObjective.endTime = newItem.endTime;
            isUnited = true;
          } else if (tmObjective.endTime >= item.startTime &&item.endTime < tmObjective.endTime ) {
            newItem.startTime = tmObjective.startTime;
            newItem.endTime = tmObjective.endTime;
            if (i > 0) {
              tempTimelist.pop(tempTimelist[length - 1]);
            }
            tempTimelist.push(newItem);
            tmObjective.startTime = newItem.startTime;
            newItem.endTime = tmObjective.endTime;
            isUnited = true;
          } else {
            tempTimelist.push(item);
            tmObjective.startTime = item.startTime;
            tmObjective.endTime = item.endTime;
          }
        }
        this.timeList = [].concat(tempTimelist);
        for (let i = 0; i < this.timeList.length; i++) {
          this.timeList[i].endTime -= 900000;
        }
        //结束时间减去15分钟预留离场时间
        console.log(this.timeList);
      },

      dataChange() {
        // alert(JSON.stringify(this.timeList),'4');
        console.log(this.timeList);
        for (var i = 0; i < this.timeList.length; i++) {
          let item = this.timeList[i];
          // debugger
          this.array = [];
          var n = (item.endTime - item.startTime) / 900000;
          if (this.nowTime > item.endTime) {
            continue; // 比结束时间都还大，直接结束本次循环
          } else if (
            item.startTime < this.nowTime &&
            this.nowTime < item.endTime
          ) {
            var x = null;
            var start = item.startTime;
            var arr = [];
            var temp = [];
            this.arrayflag = true;
            for (var j = 0; j <= n; j++) {
              arr.push(start);
              start += 900000;
            }
            for (var y = 0; y < arr.length; y++) {
              if (this.nowTime < arr[y]) {
                x = y;
                break;
              }
            }
            var arrtrue = [];
            if (x !== null) {
              arrtrue = arr.slice(x);
              this.array.push(arrtrue);
            }
          } else {
            // 先转换成数组
            var arr = [];
            // var start = this.allTime[i].startTime;
            var start = this.timeList[i].startTime;
            for (var j = 0; j <= n; j++) {
              arr.push(start);
              start += 900000;
            }
            this.array.push(arr);
          }
        }
        // console.log(this.array);
        this.convertTime();
      },

      // 赋值 和 拆分 小时数
      convertTime() {
        // alert(JSON.stringify(this.array),'3');
        var pData1 = [],
          pData2 = {},
          pData2arr = [];
        console.log(this.array);
        for (var i = 0; i < this.array.length; i++) {
          var arrayone = this.array[i];
          var oldhours = null;
          let oldDay = formatTimeStamp(arrayone[0]).substr(8, 2);
          for (var j = 0; j < arrayone.length; j++) {
            let time = formatTimeStamp(arrayone[j]);
            let miunte = time.substr(14, 2);
            let hours = time.substr(11, 2);
            let day = time.substr(8, 2);
            if (oldDay < day) {
              hours = " 次日 " + hours + " 时 ";
              miunte = miunte + " 分 ";
            } else {
              hours = hours + " 时 ";
              miunte = miunte + " 分 ";
            }
            // debugger
            // console.log(pData1);
            if (pData1.length >= 1) {
              if (pData1[pData1.length - 1].texts != hours) {
                pData1.push({
                  text: hours,
                  value: i + j + hours,
                  texts: hours,
                  time: arrayone[j]
                });
              }
            } else {
              pData1.push({
                text: hours,
                value: i + j + hours,
                texts: hours,
                time: arrayone[j]
              });
            }

            pData2arr.push({
              text: miunte,
              value: i + j,
              texts: hours,
              time: arrayone[j]
            });
            oldhours = time.substr(11, 2);
          }
        }
        // debugger
        // alert(JSON.stringify(pData1),'2');
        console.log(pData1);
        var hoursarray = pData1;
        // console.log(pData2arr);
        var miuntearray = this.pData2chang(pData2arr);
        console.log(hoursarray, miuntearray);
        for (var i = 0; i < hoursarray.length; i++) {
          pData2[hoursarray[i].value] = miuntearray[hoursarray[i].text];
        }

        // this.pickData2.pData1 = hoursarray;
        // alert(JSON.stringify(hoursarray),'1');
        // debugger
        this.$set(this.pickData2, "pData1", hoursarray);
        // this.pickData2.pData2 = pData2;
        this.$set(this.pickData2, "pData2", pData2);

        this.pickData2.default.push(hoursarray[0]);
        this.pickData2.default.push(pData2[hoursarray[0].value][0]);

        // 取得默认入场时间-----这里有问题
        let hoursNum = hoursarray[0].text.indexOf("时");
        let miunteNum = pData2[hoursarray[0].value][0].text.indexOf("分");

        console.log(hoursNum);
        hoursNum = hoursarray[0].text.substring(0, hoursNum);
        miunteNum = pData2[hoursarray[0].value][0].text.substring(0, miunteNum);
        console.log(hoursNum);
        this.defaultTime = hoursNum + " : " + miunteNum;
        // 通过时间戳差值，获取价格信息
        console.log(new Date().getTime());
        // debugger
        this.priceTime = hoursarray[0].time - new Date().getTime();
        // debugger
        this.getPrice(this.priceTime);
        console.log(this.priceTime);
        console.log(this.defaultTime);
        console.log(hoursarray[0]);
        this.getDefaultTime(hoursarray[0].time);
      },
      // 对分钟数
      pData2chang(arr) {
        var data = [];
        for (var i = 0; i < arr.length; i++) {
          if (!data[arr[i].texts]) {
            var arrs = [];
            arrs.push(arr[i]);
            data[arr[i].texts] = arrs;
          } else {
            data[arr[i].texts].push(arr[i]);
          }
        }
        return data;
      },

      // 默认的离场时间
      getDefaultTime(time) {
        // debugger
        var timetap = time;
        var x = null;
        let numLeaveTime = [];
        // 筛出离场时间
        for (var i = 0; i < this.reserveTimeList.length; i++) {
          if (
            this.reserveTimeList[i].startTime <= timetap &&
            timetap <= this.reserveTimeList[i].endTime - 900000
          ) {
            numLeaveTime.push({
              learve: this.reserveTimeList[i],
              times: this.reserveTimeList[i].endTime - timetap
            });
          }
        }
        if (numLeaveTime.length === 1) {
          // debugger
          this.params.share_startTime = numLeaveTime[0].learve.startTime;
          this.params.share_endTime = this.params.end_time =
            numLeaveTime[0].learve.endTime;
          this.params.start_time = timetap;
          var leaveTime = formatTimeStamp(numLeaveTime[0].learve.endTime);
          var leaveMonth =
            leaveTime.substr(5, 1) != 0 ?
            leaveTime.substr(5, 2) :
            leaveTime.substr(6, 1);
          var leaveDay =
            leaveTime.substr(8, 1) != 0 ?
            leaveTime.substr(8, 2) :
            leaveTime.substr(9, 1);
          var leaveMiunte = leaveTime.substr(14, 2);
          var leaveHours = leaveTime.substr(11, 2);
          this.leaveTime =
            leaveMonth +
            "月" +
            leaveDay +
            "号" +
            leaveHours +
            "时" +
            leaveMiunte +
            "分";
        } else {
          var max = numLeaveTime[0].times;
          var len = numLeaveTime.length;
          let obj = numLeaveTime[0];
          for (var i = 1; i < len; i++) {
            if (numLeaveTime[i].times > max) {
              max = numLeaveTime[i].times;
              obj = numLeaveTime[i];
            }
          }
          var leaveTime = formatTimeStamp(obj.learve.endTime);
          var leaveMonth =
            leaveTime.substr(5, 1) != 0 ?
            leaveTime.substr(5, 2) :
            leaveTime.substr(6, 1);
          var leaveDay =
            leaveTime.substr(8, 1) != 0 ?
            leaveTime.substr(8, 2) :
            leaveTime.substr(9, 1);
          var leaveMiunte = leaveTime.substr(14, 2);
          var leaveHours = leaveTime.substr(11, 2);
          this.leaveTime =
            leaveMonth +
            "月" +
            leaveDay +
            "号" +
            leaveHours +
            "时" +
            leaveMiunte +
            "分";
          this.params.share_startTime = obj.learve.startTime;
          this.params.share_endTime = this.params.end_time = obj.learve.endTime;
          this.params.start_time = timetap;
        }
        // share_startTime:null, // 共享开始时间戳
        //   share_endTime:null,  // 共享结束时间戳
        //   start_time:null,    // 用户选择的时间戳
      },
      // this.params.start_time = this.reserveTimeList[x].startTime;
      //   this.params.start_time = time;
      //   this.params.end_time = this.reserveTimeList[x].endTime;
      //   var leaveTime = formatTimeStamp(this.reserveTimeList[x].endTime);
      //   var leaveMonth = leaveTime.substr(5,1) != 0 ?  leaveTime.substr(5,2) : leaveTime.substr(6,1);
      //   var leaveDay = leaveTime.substr(8,1) != 0 ?  leaveTime.substr(8,2) : leaveTime.substr(9,1);
      //   var leaveMiunte = leaveTime.substr(14,2);
      //   var leaveHours =  leaveTime.substr(11,2);
      //   this.leaveTime = leaveMonth+'月'+leaveDay+'号'+leaveHours+'时'+leaveMiunte+'分';
      // },

      // 获取价格信息
      getPrice(priceTime) {
        // debugger
        var x = null;
        let miunte = parseInt(priceTime / 60000);
        console.log(miunte);
        // this.feeList[0].finishTime = this.feeList[0].finishTime * 60000;
        for (var i = 0; i < this.feeList.length; i++) {
          if (miunte <= this.feeList[i].finishTime) {
            x = i;
            break;
          } else {
            continue;
          }
        }
        if (i === this.feeList.length) {
          x = i - 1;
        }
        if (this.feeList[x]) {
          // 增加了费用系数
          console.log(this.pointedItem.integralPermissionsCoefficient)
          this.price = (this.feeList[x].fee*this.pointedItem.integralPermissionsCoefficient).toFixed(2);
        }
        console.log(this.price);
      },
      // 选择入场时间段
      openPicker() {
        // debugger
        console.log(this.pickData2);
        this.$root.eventHub.$emit("init");
        if (this.reserveTimeList.length === 0) {
          Toast({
            message: "没有预约的时间段",
            duration: 1500
          });
          return;
        } else {
          this.show1 = true;
          this.isshow = true;
        }
      },
      // 选择时间后的确定按钮
      confirmFn(e) {
        console.log(e);
        this.priceTime = e.select2.time - new Date().getTime();
        // debugger
        this.getPrice(this.priceTime);
        let hoursNum = e.select1.text.indexOf("时");
        let miunteNum = e.select2.text.indexOf("分");
        hoursNum = e.select1.text.substring(0, hoursNum);
        miunteNum = e.select2.text.substring(0, miunteNum);
        this.defaultTime = hoursNum + " : " + miunteNum;
        this.getDefaultTime(e.select2.time);
        this.show1 = false;
        this.isshow = false;
      },
      close(e) {
        this.show1 = false;
        this.isshow = false;
      },
      async doPay(orderId) {
        // debugger
        let url = "apiwrite/reserve/pay";
        let couponId = null;
        let baseURL = null;
        let spbillCreateIp = null;
        let channel = 1;
        // debugger
        // url, orderId, channel, couponId, wapUrl, spbillCreateIp
        let res = await pay(
          url,
          orderId,
          channel,
          couponId,
          baseURL,
          spbillCreateIp
        );
        if (res.error_code == 2000) {
          common.setStorage("H5_orderId", orderId);
          Toast({
            message: "预约成功",
            duration: 1500
          });
          let timerId = setTimeout(() => {
            clearTimeout(timerId);
            this.clickFlag = false
            this.$router.push("/appointInfo");
          }, 1500);
          // this.$router.push("/appointInfo");
        } else {
          this.clickFlag = false
          Toast({
            message: "预约失败,请您重新预约",
            duration: 1500
          });
        }
      },
      //立即预约
      async goApoint() {
        // this.params.parklot_id
        console.log(this.params);
        if(this.clickFlag){
          return false
        }
        this.clickFlag = true
        this.params.user_id = common.getStorage("H5_user_id");
        this.params.plate_id = this.plateNoId;
        if (!this.plateNo || this.plateNo == "") {
          Toast({
            message: "请选择您的车牌号",
            duration: 1500
          });
          this.clickFlag = false
          return;
        }
        //无车位的情况
        if (!this.timeList.length) {
          Toast({
            message: "暂无可预约车位",
            duration: 1500
          });
          this.clickFlag = false
          return;
        }
        // debugger
        let res = await appointCarport(this.params);
        if (res.error_code == 2000) {
          Indicator.close();
          let orderId = res.data.orderId; //订单号
          let totalFee = res.data.totalFee; //预约费用
          localStorage.setItem("H5_orderId", orderId);
          localStorage.setItem("H5_fees", totalFee); //保存的支付金额
          if (totalFee == 0) {
            this.doPay(orderId);
          } else {
            this.clickFlag = false
            this.$router.push({
              name: "payMent",
              params: {
                fees: totalFee,
                orderId: orderId
              }
            });
          }
        } else if (res.error_code === 2901) {
          //如果金额存在 跳转到支付界面去， 不存在 或者为0 先调起预约支付接口
          Indicator.close();
          Toast({
            message: "车位已被约满，请更换车位重试",
            duration: 1500
          });
          return;
        }else if(res.error_code===2906){
          //新增接口，禁止非白名单用户进行预约
           Indicator.close();
          Toast({
            message: '该停车场目前仅供指定车牌预约。如需预约，请咨询停车场物业方。',
            duration: 1500
          });

        } else if (res.error_code === 2904) {
          //车牌号被重复预约
          Indicator.close();
          Toast({
            message: "该车辆已存在预约订单",
            duration: 1500
          });
          return;
        } else if (res.error_code === 2900) {
          Indicator.close();
          Toast({
            message: "你还有订单未完成",
            duration: 1500
          });
          // setTimeout(() => {
          //   this.$router.push("appointment");
          // }, 1500);
        } else {
          Toast({
            message: res.error_message,
            duration: 1500
          });
        }
      },
      //选择车牌号
      chooseCar() {
        this.$router.push({
          name: "car",
          params: {
            from: "apoint"
          }
        });
      },
      // 对拿到的当前系统时间做处理
      timeToget() {
        var time = Number(new Date().getTime()) + 900000;
        // alert(JSON.stringify(time));
        // var miunte = time.substr(14,2);
        // var year = time.substr(0,10);
        // var hours = time.substr(11,2);
        // var strtime = year+' '+hours+':'+miunte+':'+'00'+':'+'0000';
        // alert(JSON.stringify(strtime));
        // // 这个存在兼容性的问题，导致在IOS上面失败
        // // var date = new Date(strtime);
        // // alert(JSON.stringify(date));
        // var timetap = Date.parse(strtime);
        // alert(JSON.stringify(timetap));
        this.nowTime = time;
        // alert(JSON.stringify(this.nowTime));
      }
    },
    created() {
      // debugger
    },
    activated() {
      this.parkLotId = Number(JSON.parse(localStorage.getItem("H5_park_lot_id")));
      this.timeToget();
      this.getparklot();
    },
    // 退出组件时， 清空缓存
    deactivated() {
      // debugger
      this.$destroy(true);
    },
    // watch: {
    //   '$route'(to,from){
    //     /*这里对弹框做了处理*/
    //     Messathis.$destroy(true);geBox.close(false);
    //     if((from.path == '/home' && to.path == '/appoint')){
    //       this.pointedItem = this.$route.params.pointedItem;
    //       console.log(this.pointedItem)
    //       this.headerMark = localStorage.getItem('H5_parkName');
    //       this.startTime = this.pointedItem.parkingList[0].shares[0].startTime;
    //        this.endTime = this.$store.state.endTime;
    //       //  console.log(this.startTime)
    //       this.estateId = this.pointedItem.id;
    //     }
    //   }
    // },
    beforeRouteLeave(to, from, next) {
      // 这里将MessageBox进行关闭的操作
      this.plateNo = "";
      MessageBox.close(false);
      next();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.path === "/car") {
          vm.carPlate = JSON.parse(localStorage.getItem("H5_carplate"));
        }
      });
    }
  };

</script>
<style lang="stylus">
  @import '../../common/css/base.stylus';
  @import '../../common/css/mixin.stylus';

  .appointmessage-info {
    line-height: 2.5rem;
  }

  #appoint {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    background-color: #F4F4F4;
    overflow: hidden;

    .alert {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .mt-calss-style {
      z-index: 20000 !important;
    }

    .content {
      width: 100%;
      top: 3.975rem;
      bottom: 3.5rem;
      overflow: hidden;

      .info {
        padding-left: 0.9375rem;
        padding-right: 0.9375rem;
        border-bottom: 0.0625rem solid #E6E6E6;
        border-top: 0.0625rem solid #E6E6E6;
        background-color: #FFF;
      }

      .car-info {
        padding-top: 0.9375rem;
        padding-bottom: 1.375rem;

        .car-style {
          display: flex;
          justify-content: space-between;
        }

        .message {
          font-size: 0.9375rem;
          color: #9a9a9a;
          font-weight: 700;
          margin-right: 0.5625rem;
        }

        .cars-color {
          // line-height: 1.875rem;
          font-size: 0.6rem;
          color: #fff;
          background-color: #f7bc41;
          padding: 0 0.1125rem;
          padding: 0.05rem 0.2125rem;
          text-align: center;
          line-height: .7rem;
        }
      }

      /* .car-distance
       margin-top 0.55rem */
      .text-distance {
        font-size: 0.875rem;
        color: #9a9a9a;
      }

      .ic {
        display: inline-block;
        width: 0.75rem;
        height: 1rem;
      }

      .ic-font1 {
        bg-img('../../assets/img/btn_map');
      }

      .ic-style {
        bg-img('../../assets/img/wuye_up');
      }

      .ic-toll {
        bg-img('../../assets/img/home_order_rule');
      }

      .text {
        font-size: 0.9375rem;
        font-weight: 700;
        color: #000;
      }

      .toll-rules {
        margin-top: 0.5625rem;
        padding-top: 0.9275rem;
        padding-bottom: 1.3125rem;

        .text-distance {
          font-size: 0.75rem;
        }
      }

      .plate-number {
        box-sizing: border-box;
        margin-top: 0.5625rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 3.5rem;
        flex-wrap: nowrap;
        /* .plate */
      }

      .einlass {
        border-top: none;
        margin-top: 0;
      }

      .stop-time {
        margin-top: 0.5625rem;
        height: 3.625rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .tips {
        margin-top: 0.25rem;
        font-size: 0.75rem;
        color: #999;
        padding-left: 0.9375rem;
        padding-right: 0.9375rem;
        padding-bottom: 3.5rem;

        .tips-text {
          line-height: 1.3125rem;
        }
      }

      .text-3 {
        font-size: 1rem;
        font-weight: 700;
      }

      .dis-2 {
        display: flex;
        align-items: center;
        color: #9a9a9a;

        .plate-info {
          font-size: 0.75rem;
          color: #9a9a9a;
          border: none;
          out-line: none;
          text-align: right;
        }

        /* .address
         font-size .75rem
         color #666666
         margin-top .5rem
         overflow hidden
         text-overflow ellipsis
         white-space wrap
         .price
         border-bottom 1px solid #E6E6E6
         .price-num
         color #ff5c5a
         font-size .875rem
         .charge-standard
         a
         font-size .875rem
         color #999
         .car
         .info
         margin-right .875rem
         color #999
         border-bottom none
         .ic
         width .5625rem
         height .9375rem
         bg-img('../../assets/img/arrow_r')
         margin-right .9375rem
         margin-top: .15rem
         
         !*.ic*!
         !*width .75rem*!
         !*height 1rem*!
         !*left .9rem*!
         !*top .95rem*!
         !*bg-img('../../assets/img/btn_map')*!
         .item
         padding .75rem .9375rem
         font-size 1rem
         color #1A1A1A
         background-color #FFF */
      }
    }

    .to-appoint {
      position: fixed;
      width: 100%;
      bottom: 0;
      height: 3.5rem;
      line-height: 3.5rem;
      font-size: 1rem;
      font-weight: bolder;
      background-color: #d21c95;
      color: #FFF;

      .div-flex {
        display: flex;
      }

      .ds-1 {
        width: 62.66666%;
        background-color: #fff;
        color: #646464;
        font-size: 0.75rem;
      }

      .ds-2 {
        width: 37.33333%;
      }

      .price-style {
        font-size: 1rem;
      }
    }
  }

</style>
