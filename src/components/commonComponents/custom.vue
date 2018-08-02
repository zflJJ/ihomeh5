<template>
  <div>
    <div v-show="showK === 1" class="custom">
      <div class="province-text">
        <div class="row row1 flex">
          <div v-for="(item,index) in provinceData.li1" :key="index" class="fl-o t-c row-item-box" @click="getItems(item)"><div class="row-item" @touchstart="inputStart($event,item)"  @touchend="inputEnd($event)">{{item}}</div></div>
        </div>
      </div>
      <div class="province-text t-c">
        <div class="row row2 flex">
          <div v-for="(item,index) in provinceData.li2" :key="index" class="fl-o t-c row-item-box" @click="getItems(item)"><div class="row-item" @touchstart="inputStart($event,item)"  @touchend="inputEnd($event)">{{item}}</div></div>
        </div>
      </div>
      <div class="province-text">
        <div class="row row3 flex">
          <div v-for="(item,index) in provinceData.li3" :key="index" class="fl-o t-c row-item-box" @click="getItems(item)"><div class="row-item" @touchstart="inputStart($event)" @touchend="inputEnd($event)">{{item}}</div></div>
        </div>
      </div>
      <div class="province-text">
        <div class="row row4 flex">
          <div v-for="(item,index) in provinceData.li4" :key="index" class="fl-o t-c row-item-box" @click="getItems(item)"><div class="row-item" @touchstart="inputStart($event)" @touchend="inputEnd($event)">{{item}}</div></div>
        </div>
      </div>
    </div>
    
    <div class="custom" v-show="showK===2">
      <div class="custom-text">
        <span v-for="(item,i) in keyData.li1" :key="i" class="ct" @click="getkeyData(item)" @touchstart="inputStart($event)" @touchend="inputEnd($event)">{{item}}</span>
      </div>
      <div class="custom-text">
        <span v-for="(item,i) in keyData.li2" :key="i" class="ct" @click="getkeyData(item)" @touchstart="inputStart($event)" @touchend="inputEnd($event)">{{item}}</span>
      </div>
      <div class="custom-text">
        <span v-for="(item,i) in keyData.li3" :key="i" class="ct" @click="getkeyData(item)" @touchstart="inputStart($event)" @touchend="inputEnd($event)">{{item}}</span>
        <!-- <img srcset="../../assets/img/mine_car_add_key_close@2x.png 2x,mine_car_add_key_close@3x.png 3x" alt="" class="del-style" @click="delkeyData"> -->
      </div>
    </div>

    <div class="custom" v-show="showK===3">
      <div class="custom-text">
        <span v-for="(item,i) in keyNumber.li1" :key="i" class="ct" @click="getkeyNumber(item)" @touchstart="inputStart($event)" @touchend="inputEnd($event)">{{item}}</span>
      </div>
      <div class="custom-text">
        <span v-for="(item,i) in keyNumber.li2" :key="i" class="ct" @click="getkeyNumber(item)" @touchstart="inputStart($event)" @touchend="inputEnd($event)">{{item}}</span>
      </div>
      <div class="custom-text">
        <span v-for="(item,i) in keyNumber.li3" :key="i" class="ct" @click="getkeyNumber(item)" @touchstart="inputStart($event)" @touchend="inputEnd($event)">{{item}}</span>
      </div>
      <div class="custom-text">
        <span v-for="(item,i) in keyNumber.li4" :key="i" class="ct" @click="getkeyNumber(item)" @touchstart="inputStart($event)" @touchend="inputEnd($event)">{{item}}</span>
        <!-- <img srcset="../../assets/img/mine_car_add_key_close@2x.png 2x,mine_car_add_key_close@3x.png 3x" alt="" class="del-style" @click="delkeyNumber">         -->
        <img src="../../assets/img/mine_car_add_key_close@3x.png" alt="删除" class="del-style" @click="delkeyNumber">
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        provinceData:{
          li1:['粤','京','沪','津','冀','鲁','云','辽','黑','湘',],
          li2:['皖','新','苏','浙','赣','鄂','桂','甘','晋',],
          li3:['蒙','陕','吉','闽','贵','青','藏',],
          li4:['川','宁','琼','豫','渝'],
          // li1:['粤','京','沪','津','冀','鲁','云','辽'],
          // li2:['黑','湘','皖','新','苏','浙','赣','鄂'],
          // li3:['桂','甘','晋','蒙','陕','吉','闽','贵'],
          // li4:['青','藏','川','宁','琼','豫','渝'],
          // li5:['港','澳'],
        },
        keyData:{
          li1:'QWERTYUIOP',
          li2:'ASDFGHJKL学',
          li3:'ZXCVBNM港澳'
        },
        keyNumber:{
          li1:'1234567890',
          li2:'QWERTYUIOP',
          li3:'ASDFGHJKL学',
          li4:'ZXCVBNM港澳'
        },
        showK: null,
      }
    },
    methods:{
      getItems(item){
        console.log('点击了',item);
        this.$root.eventHub.$emit('getItems',item);
      },
      getkeyData(item){
        this.$root.eventHub.$emit('getkeyData',item);
      },
      delkeyData(){
        var item = '';
        this.$root.eventHub.$emit('getkeyData',item);
      },
      getkeyNumber(item){
        this.$root.eventHub.$emit('getkeyNumber',item);
      },
      delkeyNumber(){
        var item = 'del';
        this.$root.eventHub.$emit('getkeyNumber',item);
      },
      inputStart(e){
        e.currentTarget.style.backgroundColor='#d01d95';
        e.currentTarget.style.color='#fff';
      },
      inputEnd (e){
        e.currentTarget.style.backgroundColor='#fff';
        e.currentTarget.style.color='#1a1a1a';
      }
    },
    created(){
      this.$root.eventHub.$on('showK',(x)=>{
          this.showK = x;
      })
    },
    
  }
</script>

<style lang="stylus">
  @import '../../common/css/base.stylus'
  @import '../../common/css/mixin.stylus'
  .custom
    position absolute
    bottom 0
    z-index 500
    background-color #d5d9df
    width 100%
    padding 0.3125rem 0.9375rem 0.625rem  0.9375rem
    .province-text
      font-size 1rem
      color #1a1a1a
      .row
        margin-bottom .475rem
        margin 0 auto
        .row-item-box
          padding .25rem
          .row-item
            background-color #fff
            height 2.4rem
            line-height 2.4rem
            border-radius 25%
            transition background-color 0.3S 
      .row2
        width 90%
      .row3
        width 70%
      .row4
        width 50%
    .custom-text
      display flex
      justify-content space-between
      flex-wrap wrap
    .ct
      display inline-block
      width 1.8rem
      height 2.4rem
      background-color #fff
      color #1a1a1a
      text-align center
      margin-top 0.475rem
      font-size 1rem
      line-height 2.4rem
      text-align center
      border-radius 25%
    .custom-textT
      display flex
      justify-content center
      flex-wrap wrap
    .del-style
      width 1.8rem
      height 1.8rem
      margin-top 0.8rem
</style>
