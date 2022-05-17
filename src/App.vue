<template>
  <div id="app">
        <!-- 顶部区域 -->
        <div class="top-bar">
            <img src="./assets/img/logo.png" alt="Logo" height="56px" style="margin-left: 28px;">
            <img src="./assets/img/title.png" alt="title">
            <div class="admin">
                <img src="./assets/img/admin.png" alt="">
                <div class="admin-name">
                    <p>{{name}}</p>
                    <p>超级管理员</p>
                </div>
            </div>
        </div>
        <!-- 侧边栏 -->
        <div class="name-list">
            <ul class="accordion">
                <li v-for="(item ,index) in sche_list" :key="index" @click="sche_list_click(index)" :class="{'active': sche_num == index }" :title="item.mid">
                    <div class="sign" :style="{background : item.color}" v-show="sche_num != index && index != 0"></div>
                    <div class="link">
                        <img :src="h_img(index)" alt="">
                        <span>{{item.disp}}</span>
                        <img v-if="index != 0 " :src='drop_img(index)' alt="" >
                    </div>
                    <transition name="slide">
                      <ul class="submenu" v-show="isShow(index)">
                          <li @click.stop='del'>删除日程单</li>
                          <li @click.stop="getIsRem">修改日程单</li>
                      </ul>
                    </transition>
                </li>
            </ul>
        </div>
        <!-- 内容区域 -->
        <div class="content-wrap">
            <div class="main-content">

              <!-- ‘添加日程’页面组件 -->
              <transition name = 'fade'>
                <add-sche v-if="isAdd" />  
              </transition>
                    
              <!-- “个人日程”页面组件 -->
              <transition name = 'fade'>
                <pers-sche v-if="!isAdd" :mid='mid' :uid='uid' ref="ps"/>
              </transition>
              
            </div>
        </div>
        <!-- 提醒方式 -->
        <rem-mode v-if="isRem" :mid='mid' />
        <!-- 确认删除组件 -->
        <confirm v-if="isD" :mid='mid' />

        <jump v-if="isJ" />
  </div>
</template>

<script>
// @ is an alias to /src

import addSche from './components/addSchedule.vue'
import persSche from './components/personalSchedule.vue'
import remMode from './components/reminderMode.vue'
import confirm from './views/confirm.vue'
import jump from './components/jump.vue'

import {post} from '@/network/request.js'


export default {
  name: 'schedule',
  components: {
    addSche,
    persSche,
    remMode,
    confirm,
    jump
  },
  data() {
      return {
          name:'子女昵称',
          isAdd: true,
          isRem: false,
          isD: false,
          isJ: false,
          sche_num: 0,
          sche_list: [{disp:'添加日程单',h_img: '添加0'}],
          renderList:[],
          mid:'',
          uid:'',
          color:'',
          token:''
      }
  },
  methods: {
    //获取日程单数据
    getData(){
      post('company/program/ajax/ScheduleManageAPI.ashx?Type=Sel',{
        token:this.token
      }).then(res=>{
          console.log(res)
          let data = res.data
          if(!data.hasOwnProperty('message')){
            this.renderList=[];
            this.sche_list = [{disp:'添加日程单',h_img: '添加0'}]
            this.renderList=res.data.Table;
            this.$store.commit('settable',this.renderList)
            for(let i of this.renderList){
              let arr = {}
              arr.disp = i.name
              arr.drop_img = '下拉0'
              arr.h_img = '男人'
              arr.mid = i.itemid
              arr.color = i.color
              arr.uid = i.createuser
              this.sche_list.push(arr)
            }
            if(this.sche_num != 0){
              this.sche_list[0].h_img = '添加'
              this.sche_list[this.sche_num].h_img = '男人0'
            }
          }else{
            let msg = data.message
            if(msg.indexOf('请登录') != -1){
              this.isJ = true
            }
            console.log(msg)
          }
      })
    },
    //日程单列表点击事件
    sche_list_click(index){
        //点击不同li元素时，切换头像图标和下拉图标
          if(index == 0){
              this.sche_list[index].h_img = '添加0'
              this.sche_list[this.sche_num].drop_img = '下拉0'
              if(this.sche_num != index){
                this.sche_list[this.sche_num].h_img = this.sche_list[this.sche_num].h_img.substr(0,this.sche_list[this.sche_num].h_img.length-1)
              }
              this.isAdd = true
        }else{
              this.isAdd = false
              if(this.sche_list[index].h_img.indexOf('0') == -1){
                this.sche_list[index].h_img += '0'
              }
              if(this.sche_num != index){
                this.sche_list[this.sche_num].h_img = this.sche_list[this.sche_num].h_img.substr(0,this.sche_list[this.sche_num].h_img.length-1)
                this.sche_list[this.sche_num].drop_img = '下拉0'
              }
              this.mid = this.sche_list[index].mid
              this.uid = this.sche_list[index].uid
        }
        //重复点击li元素时，只切换下拉图标
        if(this.sche_list[index].drop_img == '下拉'){
          this.sche_list[index].drop_img = '下拉0'
        }else{
          this.sche_list[index].drop_img = '下拉'
        }
          this.sche_num = index;

    },
    //激活修改模板组件
    getIsRem(){
        this.isRem = !this.isRem
    },
    //激活确认删除组件
    del(){
      this.isD = true
      // if(confirm('确定删除吗？')){
      //   this.isAdd = true
      //   this.sche_num = 0
      //   this.sche_list[0].h_img = '添加0'
      //   post('company/program/ajax/ScheduleManageAPI.ashx?Type=del',{
      //     dType: '1',
      //     iid: this.mid,
      //     id: ''
      //   }).then(res =>{
      //     console.log(res.data.message)
      //     this.getData()
      //   })  
      // }
    },
    //通过当前组件方法触发子组件persSche的方法
    updata(){
      console.log('执行了updata')
      this.$refs.ps.getData()
    },
    changetxt(){
      if(this.$refs.ps.modetxt == '自定义模板'){
        this.$refs.ps.modetxt = '自定义模板 '
      }else{
        this.$refs.ps.modetxt = '自定义模板'
      }
      
    }
  },
  computed:{
    drop_img(){
      return (index) =>{
        return require('./assets/img/'+this.sche_list[index].drop_img+'.png')
      }
    },
    h_img(){
      return (index) =>{
        return require('./assets/img/'+this.sche_list[index].h_img+'.png')
      }
    },
    isShow(){
      return (index)=>{
        return this.sche_num==index && index != 0 && this.sche_list[index].drop_img == '下拉'
      }
    }
  },
  created(){
    let url = window.location.search
    if(url.indexOf('=') != -1){
      this.token = url.split('=')[1]
    }else{
      //此token值为测试用
      this.token = 'eyJleHAiOjE2NDU2MTA5OTksImlhdCI6IjIwMjIvMi8yMyAxNjowOTo1OSIsImRhdGEiOnsidXNlcm5hbWUiOiJxbW0xMjMiLCJjb21wYW55aWQiOiJ3aXNlcGVhayIsInBhc3N3b3JkIjoiWTZlN3pLalZHeXZQZnFJN1kvL3Eydz09IiwidXNlcmlkIjoiMTY3In19.NTJGRTM1QjhFRjYwODdBQzk5NzczN0U3N0E1NUMxRjQ%3D'
    }
    console.log('未解密'+this.token)
    this.token = unescape(this.token)
    this.$store.commit('settoken',this.token)
    console.log('这是已解密token值：' + this.token)
    this.getData()
  }
}


</script>

<style>
*{
    padding: 0;
    margin: 0;
}
li{
    list-style: none;
}
body{
    font-size: 14px;
    background-image: url('./assets/img/bg.jpg');
}
img{
    border: 0;  
    vertical-align: middle;
}
#app{
    width: 1300px;
    margin: 0 auto;
}
.top-bar{
    width: 100%;
    height: 56px;
    box-shadow: 0px 1px 1px  rgb(180, 180, 180);
    background-color: #fff;
}
.admin{
    float: right;
    width: 173px;
    height: 100%;
}
.admin img{
    float: left;
    height: 44px;
    margin-top: 6px;
}
.admin-name{
    float: left;
    text-align: center; 
    margin-top: 12px;
    margin-left: 10px;
    font-size: 12px;
}
.admin-name p:first-child{
    font-size: 13px;
    font-weight: bold;
}

.name-list{
    position: relative;
    float: left;
    width: 250px;
    height: 930px;
    background-color: #fbfbfb;
    overflow: auto;
}
.name-list::-webkit-scrollbar{
  display: none;
}
/* .accordion{
    margin-top: 33px;
} */
.accordion>li{
  position: relative;
}
.sign{
  position: absolute;
  width: 5px;
  height: 30px;
  top: 16px;
}
.link {
    position: relative;
    cursor: pointer;
    padding: 15px 15px 15px 50px;
    color: #4D4D4D;
    font-size: 16px;
    font-weight: 700;
    border-bottom: 1px solid #CCC;
    -webkit-transition: all 0.4s ease;
    -o-transition: all 0.4s ease;
    transition: all 0.4s ease;
    -moz-transition: all 0.4s ease;
    -ms-transition: all 0.4s ease;
}
.accordion li:last-child .link {
    border-bottom: 0;
}
.link span{
  position: relative;
  display: inline-block;
  width: 120px;
  margin-left: 10px;
  letter-spacing: 2px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  top: 5px;
}
.link img:last-child{
    position: absolute;
    right: 40px;
    top: 25px;
}

.slide-enter-active,
.slide-leave-active {
    transition: all .4s ease;
    height: 61px; /* 这里61px为menu-one子菜单的高度 */
    opacity: 1;
}
.slide-enter,
.slide-leave-to
{
  opacity: 0;
  height: 0px;
}
.submenu li {
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-bottom: 1px solid #d2d2d2;
    font-size: 16px;
    color: #0e73e5;
    cursor: pointer;
    background-color: #e5e5e5;
}
.submenu li:hover{
    background-color: #c2c2c2;
}
.submenu li:last-child{
    border: 0;
}
.active{
    background-color: #0e73e5 !important;
}
.active span{    
    color: white;
}
.content-wrap{
    float: left;
    width: 1050px;
    height: 930px;
    background-color: #f2f7fa;
}
.main-content{
    width: calc(100% - 28px);
    height: calc(100% - 28px);
    background-color: white;
    margin: 14px;
    border-radius: 10px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    -ms-border-radius: 10px;
    -o-border-radius: 10px;
    overflow: hidden;
}
input,textarea,select{
    width: 300px;
    height: 30px;
    text-indent: 10px;
    border-radius: 15px;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    -ms-border-radius: 15px;
    -o-border-radius: 15px;
    outline: none;
    border: 1px solid #f4f4f4;
    color: #999999;
    font-weight: bold;
    background-color: white;
}
textarea{
    height: 70px;
    resize: none;
    letter-spacing:-1px;
}
select{
    text-align: right;
    /* direction: ltr;
    appearance:none;
   -moz-appearance:none;
   -webkit-appearance:none;
   background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJCAYAAAAGuM1UAAAAH0lEQVR42mNgoDnQ13f7TwiTpIkkm0hyHkl+YhhQAABcfyjsqSyTLgAAAABJRU5ErkJggg==") no-repeat scroll right center transparent;
   background-color: white;
   padding-right: 14px; */
}
/* select::-ms-expand { 
   display: none;
} */
input::-webkit-input-placeholder,textarea::-webkit-input-placeholder{
    color: #c0c0c0;
}
.fade-enter-active{
    transition: all .5s ease;
}
.fade-leave-active{
  transition: all 0s ;
}

.fade-enter,.fade-leave-to{
    opacity: 0;
}
</style>
