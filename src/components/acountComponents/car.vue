<template>
  <div id="car">
    <sub-header :headerMark="headerMark"></sub-header>
    <no-data-tips :tipMark ="tipMark"  :parkItems="carItems"></no-data-tips>
    <div class="content-box p-a" ref="carListsBox">
      <div class="content">
        <div class="car-lists p-r" v-for="(item,key) in carItems" :key="item.name"
                                  :class="{'bd-top':key==0,'edited':editMode}"
                                  @click="chooseItem(item)">
          {{item.number}}
          <transition name="fade-in">
            <span v-show="editMode" class="edit-ic p-a" :class="{'chosen':item.isChosen}"></span>
          </transition>
        </div>
      </div>
    </div>
    <div class="bottom-bars flex p-a">
      <!--apoint 是从预约界面进入的-->
      <template v-if="fromName === 'apoint' || hasNoCars">
        <div class="bar-lists fl-o t-c" v-for="(item,index) in barItems"
             :class="{'active':index==currentIndex}"
             :key="item.name"
             @click="switchBars(1)">
          {{item}}
        </div>
      </template>
      <!--myAcount 这个是从个人中心那里进入-->
      <template v-else-if="fromName === 'myAcount'">
        <div class="bar-lists fl-o t-c" v-for="(item,index) in barItems"
             :class="{'active':index==1}"
             :key="item.name"
             @click="switchBars(index)">
          {{item}}
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import subHeader from '../commonComponents/subHeader';
import BScroll from 'better-scroll';
import {getMyCars} from '../../server/getData';
import {removeMyCars} from '../../server/getData';
import { Toast,Indicator } from 'mint-ui'
import noDataTips from '../commonComponents/noDataTip';
import common from '../../common/js/common';
export default {
  name:'car',
  data(){
    return{
      headerMark:'我的车辆',
      carItems:[],  //车牌号列表数据
      editMode:false, //是否为编辑模式
      fromName:'',    //从哪个页面跳转过来的
      msg :'',
      hasNoCars:false, //判断车辆数是否为0
      currentIndex:1,  //判断只有添加的样式
      tipMark:'暂无车辆', //暂无车辆标志
      pageNum: 0, // 获取数据
    }
  },
  components: {
    subHeader,
    noDataTips
  },
  methods: {
    //添加滚动事件  测试使用vscode 工具来提交代码
    _initScroll(){
      this.$nextTick(()=>{
        if(!this.scroll){
          this.scroll =new BScroll(this.$refs.carListsBox,{
            probeType:3,
            scrollY:true,
            click:true
          });
        }else{
          this.scroll.refresh();
        }
        let _self = this;
        if(this.scroll){
           this.scroll.on('scroll',props=>{
               clearTimeout(_self.timer);
               console.log(props)
               let yheight = props.y;
               let el = this.scroll.scroller;
               // 获取父盒子 的高度
               let elParent = el.parentElement;
               let elH = el.offsetHeight;
               let parentH = elParent.offsetHeight;
               console.log(yheight,parentH-elH,Math.abs(yheight))
               if( yheight < 0 && Math.abs(yheight) > Math.abs(parentH-elH)){
                  _self.timer=setTimeout(()=>{
                    _self.pageNum++;
                    _self.getCars();
                  },30);
               }
           })
        }
      })
    },
    //选中/取消选中状态
    chooseItem(item){
      // debugger
      this.fromName = localStorage.getItem('fromName');
        if(this.fromName == 'apoint'){
          // debugger
          let plateObj = {
            plateNo:item.number,
            plateNoId:item.plateId,
          };
          localStorage.setItem('H5_chosen_plate',JSON.stringify(plateObj));
          this.$router.push('appoint');
        }else{
          if(!this.editMode) return;
          console.log(this.$router.from)
          this.$set(item,'isChosen',!item.isChosen);
        }
    },

    //底部tab栏目点击事件
    switchBars(index){
      if(!this.editMode){
        if(index==0){ //启动车牌编辑模式
          this.editMode = true;
        }else{ //添加车辆
          this.$router.push({
            path:'/addCar'
          })
        }
      }else{
        if(index==0){ //取消/保存
          this.editMode = false;
        }else{  //删除车辆
          this.removePlate();
        }
      }
    },
    // 删除选中车牌号
    async removePlate(){
      //接口需要优化 删除不仅仅要删除当前的数据，还要删除后台的数据
//      let res = await
      console.log(this.carItems);
      let carId = [];
      for(let item of this.carItems){
        if(item.isChosen === true){
          let id = item.plateId;
          carId.push(id);
        }
      }
      console.log(carId);
      if(carId.length === 0){
          return;
      }else{
          var plateIds = carId.toString();
          this.removeCar(plateIds);
      }
    },
    //获取车牌号列表
    async getCars(){
      Indicator.open();
      let userId = common.getStorage('H5_user_id');
      console.log(this.pageNum)
      let res = await getMyCars(userId,this.pageNum);
      console.log(res);
      if(res.error_code == 2000){
        Indicator.close();
        if(res.data.plates.length === 0 && this.pageNum === 0){
          this.carItems = [];
          this.editMode = false;
        }else{
          this.displayItems(res);
        }
      }else{
        Indicator.close();
        Toast({
          message:'车牌号数据请求失败',
          duration:1000
        });
      }
    },
    //删除车牌号
    async removeCar(ids){
      let userId = common.getStorage('H5_user_id');
      let res =await removeMyCars(userId,ids);
      console.log(res);
      if(res.error_code === 2000){
          this.pageNum = 0
          this.getCars();
          for(let i=this.carItems.length-1; i>=0;i-- ){
            if(this.carItems[i].isChosen === true){
              this.carItems.splice(i,1)
            }
          }
      }else{
        console.log(res,'错误码'+res.error_code);
      }
    },
    //展示列表数据
    displayItems(data){
      let listData = data.data.plates;
      if(this.pageNum === 0){
        this.carItems = [].concat(listData);
      }else{
        this.carItems = this.carItems.concat(listData);
      }
      this._initScroll();
    },
  },
  created () {
    this.getCars();
    this.fromName = this.$route.params.from;
    if(this.fromName != undefined){
      localStorage.setItem('fromName',this.fromName);
    }else{
      this.fromName = localStorage.getItem('fromName');
    }
    this.$root.eventHub.$on('refresh-cars',()=>{
      this.pageNum=0;
      this.getCars();
    });
    if(this.fromName == 'apoint' || this.hasNoCars){
      this.currentIndex = 0;
    }else{
      this.currentIndex = 0;
    }
  },
  activated(){
    this.pageNum = 0
    this.getCars();
    this.editMode = false;
    this.fromName = this.$route.params.from;
    
    console.log(this.fromName);
    if(this.fromName != undefined){
      localStorage.setItem('fromName',this.fromName);
    }else{
       this.fromName = localStorage.getItem('fromName');
    }
    console.log(this.fromName);

    if(this.fromName == 'apoint' || this.hasNoCars){
      // this.barItems = [].concat(['添加车辆']);
      this.currentIndex = 0;
    }else{
      this.currentIndex = 0;
    }
  },
  computed:{
    //底部tab栏选项
    barItems(){
      return (this.fromName == 'apoint' || this.hasNoCars)?['添加车辆']:(this.editMode?['保存','删除']:['编辑车辆','添加车辆']);
    },
  },
  beforeRouteEnter(to, from, next) {
    if(from.path =='/myAcount'){
      localStorage.setItem('carFromAcount',true);
    }
    else if(from.path == '/appoint'){
      localStorage.setItem('carFromAcount',false);
    }
    next();
  }
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#car
  background-color #F5F5F5
  width 100%
  position absolute
  top 0
  bottom 0
  .content-box
    width 100%
    top 3.9375rem
    bottom 3.5rem
    overflow hidden
    .content
      padding-top .8125rem
      .car-lists
        padding 1.125rem .9375rem
        background-color #FFF
        border-bottom 1px solid #E6E6E6
        color #1A1A1A
        transition all .5s
        font-size 1rem
        font-weight bolder
        .fade-in-enter-active,.fade-in-leave-active
          transition all .5s ease
        .fade-in-enter,.fade-in-leave-to
          opacity 0
        .edit-ic
          width 1.25rem
          height 1.25rem
          left 0.9375rem
          top 50%
          transform translateY(-50%)
          bg-img('../../assets/img/bootpage_point')
        .chosen
          bg-img('../../assets/img/parting_car_Selected')
      .edited
        padding-left 3.125rem
      .bd-top
        border-top 1px solid #E6E6E6
  .bottom-bars
    width 100%
    height 3.5rem
    bottom 0
    .bar-lists
      line-height 3.5rem
      font-size 1rem
      background-color #FFF
      font-weight bolder
      color #D21C95
    .active
      background-color #D21C95
      color #FFF
</style>
