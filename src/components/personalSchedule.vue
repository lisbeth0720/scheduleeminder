<template>
    <div class="personal-schedule">
      <div style="text-align:center;font-size:20px;font-weight:bold;margin-top:10px;">日程单编排</div>
      <!-- 展示所有日程项 -->
      <div class="show-schedule">
        <div>
            <span style="color: #222222;">今天{{this.today}}</span>
            <span style="float:right;">共{{typeArr.length}}条日程项</span>
            <img :src="imgSrc" @click="changeView()" style="width: 21px;float:right;margin-right:20px;cursor:pointer;" title="视图">
        </div>
        <div class="datalist" v-show="viewStyle == 2">
            <ul>
              <li v-for='(item,index) in typeArr' :key="index" class='itemLi' @click='liClick(item,index)' :class="{'foculi': current == index}">
                <img src="../assets/img/循环.png" style="width: 16px;position:relative;top: -9px;" v-show="item.cctype != '0'">
                <img src="../assets/img/循环2.png" style="width: 16px;position:relative;top: -9px;" v-show="item.cctype == '0'">
                <span style="width:40px;">{{index + 1}}</span>
                <span>{{betime(item)}}</span>
                <span>{{item.etime}}</span>
                <span class="spch">{{item.spchtxt}}</span>
                <span v-show="item.state == '1'">已启用</span>
                <span v-show="item.state == '0'">未启用</span>
              </li>
            </ul>
        </div>
        <div class="datalist" v-show="viewStyle == 1">
          <ul class="timeul">
            <li v-for='(item,index) in timetitle' :key="index" class="timetitle_li">{{item}}</li>
          </ul>
          <div style="clear:both;"></div>
          <div>
            <ul class="dataul">
              <li v-for='(item,index) in typeArr' :key="index" class="datali"  @click='liClick(item,index)' :class="{'foculi': current == index}" :style="[{'grid-column':liwidth(item)},{'grid-row':liheight(item)},{'border-left':bdcolor(item)}]">
                <div style="position:relative;left:5px;width:95%;">
                  <p>{{item.spchtxt}}</p>
                  <p style="color:#999999;font-size:12px;">{{durtime(item)}}</p>
                </div>
              </li>
            </ul>
          </div>
          <canvas id="canvas" width="2400px" height="624px" ></canvas>
          <img src="" alt="" class="cvs">
        </div>
      </div>
      <!-- 详细日程项信息 -->
      <div class="detailed-info">
          <!-- 基础设置 -->
          <div>
            <label style="float: left;color:#fff;background:#0e73e5;position:relative;left:-60px;border-radius:6px;padding:2px 5px;">详细信息</label><br/>
            <label>事件：<input type="text" placeholder="请输入" v-model='spchtxt'></label><br/>
            <label>地址：<input type="text" placeholder="请输入" v-model='addr'></label><br/>
            <label>描述：<input type="text" placeholder="请输入" v-model='desc'></label><br/>
            <transition name="fade"><div v-show="isDate"><label>指定日期：<input type="date" v-model="bctime" style="text-indent:5px;"></label></div></transition>
            <div style="position:relative;left:-18px;" v-show="ispoint">
              <label style="position:relative;top:2px;left:18px;"><input type="checkbox" class="daymode" v-model='isrepeat'>重复</label>
              <label style="position:relative;top:2px;left:18px;"><input type="checkbox" v-model="isDate" class="daymode">指定日期</label>
              <label style="float:left;position:relative;left:21px;">提醒时间：<input type="time"  v-model='expiretime' style="width:96px;text-indent:5px;" :disabled='isCom'></label>
            </div><br/>
            <div v-show="!ispoint">
              <label style="position:relative;top:2px;"><input type="checkbox" class="daymode" v-model='isrepeat' >重复</label>
              <label style="float:left;position:relative;left:3px;">提醒时间：<input type="time" v-model='expiretime' style="width:96px;text-indent:5px;" :disabled='isCom'></label>
            </div><br/>
            <div style="clear:both;"></div>
            <div style="margin: 5px;position:relative;left:3px;"><span>持续时间：</span> 
              <input type="number" v-model="duration2" style="width:55px;text-indent:10px;" min="0" @change="dealtime" :disabled='isCom'>小时
              <input type="number" v-model='duration' style="width:55px;text-indent:10px;" min="0" @change="dealtime" :disabled='isCom'>分钟
              <label style="position:absolute;right:-2px;top:-2px;"><input type="checkbox" class="daymode" v-model="isCom">全天</label>
            </div>
            <label>提醒模板：<input type="text" disabled v-model='modetxt' style="width: 165px;"><img src="../assets/img/选择.png" title="选择模板" class="select-img" @click="onSelect()"><img src="../assets/img/重置.png" @click="reset" title="重置为缺省模板"><img src="../assets/img/修改.png" title="个性化修改" class="replace-img" @click="onReplace()"></label><br/>
            <label style="float:left; position:relative; left:-5px;">
              提前提醒1：<select v-model="pd" style="width: 72px;text-indent:5px;">
                <option value="0">无</option>
                <option v-for="(item,index) in pdarr" :key="index" :value="item">{{item}}天</option>
              </select>
            </label>
            <label>提前提醒2：
              <select v-model="ph" style="width: 72px;text-indent:5px;">
                <option value="0">无</option>
                <option v-for="(item,index) in pharr" :key="index" :value="item">{{item}}小时</option>
              </select>
            </label><br/>
            <label style="float:left; position:relative; left:-5px;">
              提前提醒3：<select v-model="pm" style="width: 72px;text-indent:5px;">
                <option value="0">无</option>
                <option v-for="(item,index) in pmarr" :key="index" :value="item">{{item}}分钟</option>
              </select>
            </label>
            <label>提前提醒4：
              <select v-model="ps" style="width: 72px;text-indent:5px;">
                <option value="0">无</option>
                <option v-for="(item,index) in psarr" :key="index" :value="item">{{item}}秒</option>
              </select>
            </label><br/>
            <label style="position:relative;float:left;left:3px;">是否启用：
              <div class="state_btn" :class="{'active_s': state == '1'}" @click="state_btn">
                <div class="state_btn2" :class="{'active_s2': state == '1'}"></div>
              </div>
            </label>
          </div>
          <!-- 重复设置内容 -->
          <transition name="fade">
            <div v-show='isrepeat' class="repeatbox">
              <label v-for='(item,index) in daytypearr' :key='index'><input type="radio" name="reminder-time" class="daymode" v-model='daytype' :value='index'>{{item}}</label>
              <br/>
              <label>开始时间：<input type="date"  style="width: 210px;text-indent:7px;" v-model='bctime' @change='comparedate0'></label> <br/> 
              <label>结束时间：<input type="date"  style="width: 210px;text-indent:7px;" v-model='ectime' @change='comparedate' @mouseover="mo" @mouseout="mo2">
                              <input type="text" readonly value="从不" class="nevtxt" v-show="ectime == '' ">
              </label><br/> 
              <div @click="ectime = '' " class="neverend" v-show="ne" @mouseover="mo"></div>
              <div>
                <label>重复频率：
                    <select v-model='cctype'>
                        <option value="1">每天</option>
                        <option value="3">每周</option>
                        <option value="4">每月</option>
                        <option value="5">每年</option>
                    </select>
                </label><br/>
                <label v-if='cctype == "1"'>
                  每<input  type="number"  style="width:50px" v-model="everynum" min="1">天
                </label><br v-if='cctype == "1"'>
                <label v-if='cctype == "3"'>
                  每<input  type="number"  style="width:50px" v-model="everynum" min="1">周的
                </label>
                <div v-if='cctype == "3"' class="weekbox">
                  <label v-for="item in weekdays" :key="item.index" style="margin:5px 7px;"><input type="checkbox" name="week" :value="item.index" v-model="inwindex">{{item.name}}</label>
                </div>
                <label v-if='cctype == "4"'>每
                  <select style="width:50px" v-model="everynum">
                      <option v-for="(item,index) in months" :key="index" :value="(index+1)">{{(index+1)}}</option>
                  </select>月
                </label><br v-if='cctype == "4"'>
                <label v-if='cctype == "4"'>
                  <input type="radio" name="sdays" v-model="dw" value="0">在第
                  <select style="width: 60px;" v-model="dindex">
                    <option v-for="(item,index) in days" :key="index" :value="item">{{item}}</option>
                  </select>天
                </label><br v-if='cctype == "4"'>
                <label v-if='cctype == "4"'>
                  <input type="radio" name="sdays" v-model="dw" value="1">
                  <select style="width: 110px;" v-model="windex">
                    <option v-for="(item,index) in num" :key="index" :value="(index+1)">{{item}}</option>
                  </select>
                  <select style="width: 80px;" v-model="inwindex2">
                    <option v-for="item in weekdays" :key="item.index" :value="item.index">{{item.name}}</option>
                  </select>
                </label>
                <label v-if='cctype == "5"'>每
                  <select style="width: 60px;" v-model="everynum">
                    <option v-for="(item,index) in months" :key="index" :value="(index+1)">{{(index+1)}}</option>
                  </select>年的
                  <select style="width: 90px;" v-model="mindex">
                    <option v-for="(item,index) in months" :key="index" :value="(index+1)">{{item}}</option>
                  </select>
                </label><br v-if='cctype == "5"'>
                <label v-if='cctype == "5"'>
                  <input type="radio" name="ssdays" v-model="dw" value="0">在第
                  <select style="width: 60px;" v-model="dindex">
                    <option v-for="(item,index) in days" :key="index" :value="item">{{item}}</option>
                  </select>天
                </label><br v-if='cctype == "5"'>
                <label v-if='cctype == "5"'>
                  <input type="radio" name="ssdays" v-model="dw" value="1">在
                  <select style="width: 110px;" v-model="windex">
                    <option v-for="(item,index) in num" :key="index" :value="(index+1)">{{item}}</option>
                  </select>
                  <select style="width: 80px;" v-model="inwindex2">
                    <option v-for="item in weekdays" :key="item.index" :value="item.index">{{item.name}}</option>
                  </select>
                </label>
                <div style="width:290px;position:relative;left:5px;color:#000">{{helptxt}}</div>
              </div>
              <label style="margin:5px 0;position:relative;left:5px;">例外内容：<input type="text"  style="width: 160px; height: 23px;padding-right:25px;"  readonly  v-model="exception" @mouseover="showx" @mouseout="hidex">
              <div @click="empty2" class="boxstyle1" v-show="empty" @mouseover="showx"></div>
              </label>
              <img @click="selexcept" src="../assets/img/选择例外.png" title="选择例外" style="height: 20px;position:relative;left:5px;cursor:pointer;"><br/>
              <label>反例外日期：<input type="date"  style="width: 196px;text-indent:7px;" v-model='unexcept'></label><br/>
              <label>反例外天数：<input type="number"  style="width: 196px;text-indent:7px;" v-model='unexceptdays' min="0"></label><br/>
              <label>取消日期：<input type="date"  style="width: 210px;text-indent:7px;" v-model='canceldatetime'></label> <br/> 
              <label>取消天数：<input type="number"  style="width: 210px;text-indent:7px;" v-model='canceldays' min="0"></label> <br/> 
            </div>
          </transition>
      </div>
      <!-- 修删改按钮 -->
      <div class="submit-button">  
          <button @click="add()">添加</button>
          <button @click="rep()">修改</button>
          <button @click="del()">删除</button>
      </div> 
      <!-- 选择例外 -->
      <select-except v-if="openexc"  :exception='exception' @exception='exc'/> 
      <!-- 选择模板 -->
      <sele-temp v-if="isSele" :mid='mid' />  
      <confirm v-if="isD" :mid="mid" :id='id' />
    </div>
</template>

<script>
import {post} from '../network/request'
import selectExcept from './selectException.vue'
import seleTemp from './selectTemplate.vue'
import calendar from '../calendar'
import confirm from '../views/confirm.vue'


var temp = 0
var groups = []
for(let i = 0; i < 25; i++){
  let a ={
    ing: 1,
    ignore: []
  }
  groups.push(a)
}


export default{
  components:{
    selectExcept,
    seleTemp,
    confirm
  },
  props:{
    mid: String,
    uid: String,
  },
  data() {
    return {
      imgSrc: require('../assets/img/252宫格视图.png'),
      viewStyle:1,
      timetitle:['0PM','1AM','2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM','12AM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM','11PM'],
      pd:0,
      pdarr:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
      ph:0,
      pharr:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
      pm:0,
      pmarr:[5,10,15,20,30,40,50,60],
      ps:0,
      psarr:[10,20,30,40,50,60,70,80,90,100,110,120],
      today:'',
      openexc:false,
      isSele:false,
      isDate:false,  //是否指定日期
      ispoint:true,
      ne:false,
      empty:false,
      isD:false,
      bctime2:'',
      ectime2:'',
      exception:'',
      current:-1,
      cur:1,
      id:'0',
      idarr:[],
      disp:'',      //显示人名
      desc:'',      //描述
      addr:'',      //地址
      spchtxt:'',   //事项
      spchtxt2:'',
      expiretime:'',  //提醒时间点
      bctime:'',    //开始时间
      ectime:'',    //结束时间
      everynum:'1', //每几年，月，周，天
      inwindex:[2],  //某周的第几天，当circletype!=3时，个位1-7分别表示周日、周一...周六（就指定一个），当circletype=3按周循环的是星期几的组合
      inwindex2:'2',
      dindex:'1',    //每月的第几天（0表示不用第几天字段，-1表示最后一天，-2表示倒数第二天--为了很好处理二月份）
      windex:'1',     //每月的几个周(0表示不用本第几字段，用dayindex表示)
      dw:'0',   //用dindex或者windex
      mindex:'1',     //每年的第几个月
      opencmd:'',
      closecmd:'',
      jump:'',
      note:'',
      beep:'',
      sindex:'',
      alertdur: '',
      alerttime: '',
      alertinterval: '',
      afteralert: '',
      atype:'',
      duration:'5',   //持续时间
      duration2:'0',
      dur:'300',
      typeArr:[],    //存放日程项数据
      dataarr:[],    //存放日程单数据
      isrepeat: false,
      modetxt:'',
      cctype:'3',
      daytype:0,
      daytypearr:['公历','农历'],
      week:[1,2,3,4,5,6,7],
      weekdays:[
        {index:2,name:'周一'},
        {index:3,name:'周二'},
        {index:4,name:'周三'},
        {index:5,name:'周四'},
        {index:6,name:'周五'},
        {index:7,name:'周六'},
        {index:1,name:'周日'}],
      days:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
      num:['第一个','第二个','第三个','第四个','最后一个'],
      months:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
      isCom:false,
      state:'1',
      token:'',
      unexcept:'',  //反例外时间点
      unexceptdays:'0',  //反例外天数
      canceldatetime:'',   //进行临时取消操作的时间点(阳历长时间)
      canceldays:'0',     //取消几天内的到期提醒
    }
  },
  computed:{
    helptxt(){
      let txt = ''
      let txt2 = ''
      let issun = false
      let issun2 = false
      if(this.inwindex.length > 0){
        this.inwindex.sort()
        for(let i of this.inwindex){
          if(i != 1){
            txt2 += this.weekdays[(i-2)].name + '，'
          }else{
            issun = true
          }
        }
        if(issun){
          txt2 += '周日，'
        }
      }
      if(this.inwindex2.length > 1){
        this.inwindex2 = '2'
      }
      if(this.inwindex2 == '1'){
        issun2 = true
      }
      switch(this.cctype){
        case '1':
          if(this.everynum == '1'){
            txt = '每天，'
          }else{
            txt = '每'+this.everynum+'天，'
          }
          if(this.ectime != ''){
            txt += '生效日期：' + this.bctime + '至' + this.ectime
          }else{
            txt += '生效日期：从' + this.bctime + '开始生效'
          }
          return txt
        case '3':
          if(this.everynum == '1'){
            txt = '每周的' + txt2
          }else{
            txt = '每'+this.everynum+'周的' + txt2
          }
          if(this.inwindex.length == 0){
            txt = '(请选择一周中的至少一天！)'
          }else{
            if(this.ectime != ''){
              txt += '生效日期：' + this.bctime + '至' + this.ectime
            }else{
                txt += '生效日期：从' + this.bctime + '开始生效'
            }
          }
          return txt
        case '4':
          if(this.everynum == '1'){
            txt = '每个月的'
          }else{
            txt = '每'+this.everynum+'个月的'
          }
          if(this.dw == '0'){
            txt += '第'+this.dindex+'天'
          }else if(issun2){
            txt += this.num[parseInt(this.windex) -1] + '周日'
          }
          else{
            txt += this.num[parseInt(this.windex)-1] + this.weekdays[parseInt(this.inwindex2)-2].name
          }
          if(this.ectime != ''){
            txt += '，生效日期：' + this.bctime + '至' + this.ectime
          }else{
            txt += '，生效日期：从' + this.bctime + '开始生效'
          }
          return txt 
        case '5':
          if(this.everynum == '1'){
            txt = '每年的'
          }else{
            txt = '每'+this.everynum+'年的'
          }
          txt += this.months[(this.mindex)-1] + '的'
          if(this.dw == '0'){
            txt += '第'+this.dindex+'天'
          }else if(issun2){
            txt += this.num[parseInt(this.windex) -1] + '周日'
          }
          else{
            txt += this.num[parseInt(this.windex)-1] + this.weekdays[parseInt(this.inwindex2)-2].name
          }
          if(this.ectime != ''){
            txt += '，生效日期：' + this.bctime + '至' + this.ectime
          }else{
            txt += '，生效日期：从' + this.bctime + '开始生效'
          }
          return txt
      }
      return txt
    },
  },
  methods: {
    // 改变视图
    changeView(){
      if(this.viewStyle == 1){
        this.viewStyle++
        this.imgSrc = require('../assets/img/253列表视图、菜单.png')
      }else{
        this.viewStyle--
        this.imgSrc = require('../assets/img/252宫格视图.png')
      }
    },
    // 根据结束日期返回不同颜色值
    bdcolor(i){
      // #ff0000,#0e73e5
      let d1 = new Date()
      let d2 = ''
      if(i.ectime != ''){
        d2 = new Date(i.ectime)
        let res = parseInt(d2 - d1) / 1000 / 60  // 相差分钟数
        if(res < 0){
          return '3px solid #ff0000'
        }
      }
      return '3px solid #0e73e5'
    },
    // 返回日程项中的时间区间
    durtime(i){
      let dur = parseInt(i.dur / 3600)   //小时
      let dur2 = (parseInt(i.dur) - dur * 3600) / 60  //分钟
      let h = parseInt(i.etime.substr(0,2))
      let m = parseInt(i.etime.substr(3,2))
      let h2 = h + dur
      let m2 = m + dur2
      if(m2 >= 60){
        h2++
        m2 %= 60
      }
      let str = this.addZero(h,2) + ':' + this.addZero(m,2) + '-' + this.addZero(h2,2) + ':' + this.addZero(m2,2)
      return str
    },
    // 返回grid-column属性值
    liwidth(i){
      let h = i.etime.substr(0,2)
      if(h.substr(0,1) == '0'){
        h = h.slice(-1)
      }
      h = parseInt(h) + 1
      let t = parseInt(i.dur / 3600) + h
      if(h == t){
        t++
      }
      return h + '/' + t
    },
    // 返回grid-row属性值
    liheight(i){
      // 获取提醒时间的值并计算出所在列的位置，h：当前日程项开始的列数。t：当前日程项尾部的列数。
      let h = parseInt(i.etime.substr(0,2)) + 1
      let t = parseInt(i.dur / 3600) + h
      if(h == t){
        t++
      }
      // temp的作用为计数，若值超过或等于日程单数组的长度，说明需要重新计算groups中的值，否则日程项的行位置会错乱（注：dom每次变化都会触发该函数），groups为全局变量，不能在data中定义，否则vue会报错
      // groups说明：为数组[{ing：number,ignore: array}],该数组包含24个对象，每个对象表示一列，每一列代表一个时间点，关键字ing表示某列中当前的行数，关键字ignore为数组，包含不可用的行数
      if(temp < this.typeArr.length){
        // for循环的是该日程项列的始末位置
        for(let j = h; j < t; j++){
          // 当ignore不为空的时候再做while循环
          if(groups[j].ignore.length > 0){
            // 当前行数是否在不可用行数的数组中，若有则自动增加行数，直到数组中不存在当前行数位置
            while(groups[j].ignore.indexOf(groups[j].ing) != -1){
              groups[j].ing++
            }
          }
          // 当前行数添加进不可用数组中
          groups[j].ignore.push(groups[h].ing)
        }
      }else{
        temp = 0
        groups = []
        for(let i = 0; i < 25; i++){
          let a ={
            ing: 1,
            ignore: []
          }
          groups.push(a)
        }
        for(let j = h; j < t; j++){
          groups[j].ignore.push(groups[h].ing)
        }
      }
      temp++
      let a = groups[h].ing
      let b = a + 1
      return a + '/' + b
    },
    //获取某项日程单的所有日程项数据
    getData(){
      post('Module/WiseAPI/ScheduleAPI.ashx?wpschedulequery=Sel',{
        mid: this.mid,
        uid: this.uid,
        union: '1',
        state: '1'
      }).then(res=>{
        //console.log(res)
        temp = 0
        groups = []
        for(let i = 0; i < 25; i++){
          let a ={
            ing: 1,
            ignore: []
          }
          groups.push(a)
        }
        this.typeArr = res.data.wpschedulequery.wpschedulelist
        if(this.idarr.length > 0){
          for(let i in this.typeArr){
            if(this.idarr.indexOf(this.typeArr[i].id) == -1){
              this.id = this.typeArr[i].id
            }
          }
          this.idarr = []
        }else if(this.typeArr.length == 1){
          this.id = this.typeArr[0].id
        }
        if(this.id != '0'){
          for(let i in this.typeArr){
            if(this.id == this.typeArr[i].id){
              this.liClick(this.typeArr[i],i)
              setTimeout(() => {
                let activeli = document.getElementsByClassName('foculi')
                // let datali = document.getElementsByClassName('datalist')[1]
                // let h1 = activeli[1].offsetTop
                // let h2 = datali.scrollTop
                // let w1 = activeli[1].offsetLeft
                // let w2 = datali.scrollLeft
                // let h3 = h1 - h2
                // let w3 = w1 - w2
                // if(h3 >= 0){
                //   for(let i = 0; i < h3; i++){
                //     setTimeout(() => {
                //       datali.scrollTop++
                //     }, i * 1)
                //   }
                // }else{
                //   for(let i = 0; i > h3; i--){
                //     setTimeout(() => {
                //       datali.scrollTop--
                //     }, -i * 1)
                //   }
                // }
                // if(w3 >= 0){
                //   for(let i = 0; i < w3; i++){
                //     setTimeout(() => {
                //       datali.scrollLeft++
                //     }, i * 1)
                //   }
                // }else{
                //   for(let i = 0; i > w3; i--){
                //     setTimeout(() => {
                //       datali.scrollLeft--
                //     }, -i * 1)
                //   }
                // }
                activeli[0].scrollIntoView({behavior: "smooth", block: "end" })
                activeli[1].scrollIntoView({behavior: "smooth", block: "end" , inline: 'center'})
              }, 10);
            }
          }
        }
      })
    },
    //点击修改图标按钮
    onReplace(){
      this.$store.commit('setId',this.id)
      let a = {}
      a.alertdur = this.alertdur
      a.alertinterval = this.alertinterval
      a.alerttime = this.alerttime
      a.afteralert = this.afteralert
      a.atype = this.atype
      a.opencmd = this.opencmd
      a.closecmd = this.closecmd
      a.note = this.note
      a.jump = this.jump
      a.beep = this.beep
      a.sindex = this.sindex
      if(this.spchtxt != ''){
        a.spchtxt = this.spchtxt
      }else{
        a.spchtxt = this.spchtxt2
      }
      this.$store.commit('setobj',a)
      this.$parent.getIsRem();
    },
    //点击选择模板图标按钮
    onSelect(){
      this.isSele = true
    },
    //获取当前时间并给开始结束时间缺省值
    getNowDate(){
      var date=new Date();
      var YY=date.getFullYear();
      var mm=date.getMonth()+1;
      var DD=date.getDate();
      var HH=date.getHours();
      var MM=date.getMinutes();
      var SS=date.getSeconds();
      this.bctime = YY + '-' + this.addZero(mm,2) + '-' + this.addZero(DD,2)
      this.expiretime = this.addZero(HH,2) + ':' + this.addZero(MM,2)
      date.setDate(DD+1)
      var YY=date.getFullYear();
      var mm=date.getMonth()+1;
      var DD=date.getDate();
      var HH=date.getHours();
      var MM=date.getMinutes();
      this.ectime = YY + '-' + this.addZero(mm,2) + '-' + this.addZero(DD,2)
    },
    //为数字加0，len为长度值，str为数字字符串
    addZero(str,len){
      var l=0; 
      var newStr=str;
      if(str.toString().length<len){
        l=len-str.toString().length;
        for(var i=0;i<l;i++){
          newStr="0"+newStr;
        }
      } 
      return newStr;
    },
    //点击日程项触发的事件
    liClick(item,index){
      console.log(item)
      this.current = index
      this.id = item.id
      this.desc = item.desc
      this.addr = item.addr
      this.disp = item.disp
      this.spchtxt = item.spchtxt
      this.expiretime = item.etime
      this.exception = item.except
      this.dur = item.dur 
      this.duration2 = parseInt(this.dur / 3600) 
      this.duration = (parseInt(this.dur) - this.duration2 *3600) / 60
      this.pd = item.pd
      this.ph = item.ph
      this.pm = item.pm
      this.ps = item.ps
      this.state = item.state
      this.alertdur = item.adur
      this.alertinterval = item.ainterval
      this.alerttime = item.atime
      this.afteralert = item.afteralert
      this.atype = item.atype
      this.opencmd = item.opencmd
      this.closecmd = item.closecmd
      this.note = item.note
      this.jump = item.jump
      this.beep = item.beep
      this.sindex = item.sindex
      this.canceldays = item.cdays
      this.unexceptdays = item.udays
      this.unexcept = item.utime.substr(0,10)
      this.canceldatetime = item.ctime.substr(0,10)
      let bctime = item.bctime
      let ectime = item.ectime
      this.bctime = bctime.substr(0,10)
      this.ectime = ectime.substr(0,10)
      if(bctime.indexOf('l') != -1){
        this.daytype = 1
      }else{
        this.daytype = 0
      }
      if(item.etime == '00:00:00' && item.dur == '86400'){
        this.isCom = true
      }else{
        this.isCom = false
      }
      this.modetxt = ''
      for(let i of this.dataarr){
        if(i.opencmd == item.opencmd && 
          i.closecmd == item.closecmd &&
          i.jump == item.jump &&
          i.note == item.note &&
          i.beep == item.beep &&
          i.sindex == item.sindex &&
          i.alertdur == item.adur &&
          i.alerttime == item.atime &&
          i.alertinterval == item.ainterval &&
          i.afteralert == item.afteralert &&
          i.atype == item.atype
        ){
          this.modetxt = i.name + '的模板'
        }
      }
      if(this.modetxt == ''){
        this.modetxt = '自定义模板'
      }
      this.cctype = item.cctype
      
      //对重复内容的字段进行操作
      this.everynum = item.everynum
      this.inwindex2 = item.inwindex
      this.inwindex = this.inwindex2.split('')
      this.dindex = item.dindex
      this.windex = item.windex
      this.mindex = item.mindex
      switch(this.cctype){
        case '0':
          this.isrepeat = false
          this.isDate = true
          this.everynum='1'
          this.inwindex=[2]  
          this.inwindex2='2'
          this.dindex='1'    
          this.windex='1'     
          this.dw='0'   
          this.mindex='1' 
          break;
        case '1':
          this.isrepeat = true
          this.inwindex = [2]
          this.inwindex2 = '2'
          this.dindex = '1'
          this.windex = '1'
          this.mindex = '1'
          this.dw = '0'
          break;
        case '3':
          this.isrepeat = true
          this.inwindex2 = '2'
          this.dindex = '1'
          this.windex = '1'
          this.mindex = '1'
          this.dw = '0'
          break;
        case '4':
          this.isrepeat = true
          if(this.dindex != '' &&  this.dindex != null && this.dindex != '0'){
            this.dw = '0'
            this.windex = '1'
            this.inwindex2 = '2'
          }else{
            this.dw = '1'
            this.dindex = '1'
          }
          this.inwindex = [2]
          this.mindex = '1'
          break;
        case '5':
          this.isrepeat = true
          if(this.dindex != '' &&  this.dindex != null && this.dindex != '0'){
            this.dw = '0'
            this.windex = '1'
            this.inwindex2 = '2'
          }else{
            this.dw = '1'
            this.dindex = '1'
          }
          this.inwindex = [2]
          break;
      }
    },
    //添加日程项
    add(){
      if(this.spchtxt == ''){
        alert('事件不能为空！')
      }else{
        if(this.isrepeat){
          switch(this.cctype){
            case '1':
              this.inwindex2 = ''
              this.dindex = ''
              this.windex = ''
              this.mindex = ''
              break;
            case '3':
              if(this.inwindex.length == 0){
                this.inwindex2 = '2'
              }else{
                this.inwindex2 = this.inwindex.join('')
              }
              this.dindex = ''
              this.windex = ''
              this.mindex = ''
              break;
            case '4':
              if(this.dw == '0'){
                this.inwindex2 = ''
                this.windex = ''
              }else{
                this.dindex = ''
              }
              this.mindex = ''
              break;
            case '5':
              if(this.dw == '0'){
                this.inwindex2 = ''
                this.windex = ''
              }else{
                this.dindex = ''
              }
              break;
          }
        }else{
          this.cctype = '0'
          this.inwindex2 = ''
          this.dindex = ''
          this.windex = ''
          this.mindex = ''
          this.everynum = '0'
        }
        let bctime = ''
        let ectime = ''
        let expiretime = this.expiretime
        if(this.daytype == 0){
          bctime = this.bctime + ' 00:00:00'
          ectime = this.ectime + ' 23:59:00'
        }else{
          bctime = this.bctime + ' 00:00:00l'
          ectime = this.ectime + ' 23:59:00l'
        }
        if(this.isCom){
          expiretime = '00:00:00'
          this.dur = 3600 * 24
        }
        if(this.ectime == ''){
          ectime = ''
        }
        if(expiretime.length < 6 ){
          expiretime += ':00'
        }
        let exception = this.exception
        if(!this.isDate && !this.isrepeat){
          this.getNowDate()
          bctime = this.bctime + ' ' + this.expiretime + ':00'
          ectime = this.ectime + ' ' + this.expiretime + ':00'
        }else if(this.isDate && !this.isrepeat){
          this.comparedate0()
          bctime = this.bctime + ' 00:00:00'
          ectime = this.ectime + ' 00:00:00'
        }
        let canceldatetime = this.canceldatetime
        let unexcept = this.unexcept
        if(canceldatetime.length > 0){
          canceldatetime += ' 00:00:00'
        }else{
          canceldatetime = ''
        }
        if(unexcept.length > 0){
          unexcept += ' 00:00:00'
        }else{
          unexcept = ''
        }
        post('Module/WiseAPI/ScheduleAPI.ashx?wpschedulequery=add',{
          disp: this.disp,
          nick: this.disp,
          name: this.disp,
          menuid: this.mid,
          desc: this.desc,
          address: this.addr,
          spchtxt: this.spchtxt,
          pre_alert_days: this.pd,
          pre_alert_hours: this.ph,
          pre_alert_minutes: this.pm,
          pre_alert_seconds: this.ps,
          begindatetime: bctime,
          enddatetime: ectime,
          expiretime,
          exception,
          everynum: this.everynum,
          inweekindex: this.inwindex2,
          dayindex: this.dindex,
          weekindex: this.windex,
          monthindex: this.mindex,
          circletype: this.cctype,
          opencmd: this.opencmd,
          closecmd: this.closecmd,
          jump: this.jump,
          note: this.note,
          beep: this.beep,
          sindex: this.sindex,
          alertdur: this.alertdur,
          alerttime: this.alerttime,
          alertinterval: this.alertinterval,
          afteralert: this.afteralert,
          atype: this.atype,
          duration: this.dur,
          state: this.state,
          unexcept,
          unexceptdays: this.unexceptdays,
          canceldatetime,
          canceldays: this.canceldays
        }).then(res => {
          console.log(res.data.message)
          this.getData()
          this.everynum='1'
          this.inwindex=[2]  
          this.inwindex2='2'
          this.dindex='1'    
          this.windex='1'     
          this.dw='0'   
          this.mindex='1'  
          this.current = -1   
          this.idarr = []
          for(let i of this.typeArr){
            this.idarr.push(i.id)
          }
          alert('已添加！')
        }).catch(rej =>{
          console.log(rej)
        })
      }
    },
    //删除日程项
    del(){
      if(this.current != -1){
        this.isD = true
      }else{
        alert('请选择一项日程！')
      }
      
    },
    //修改日程项
    rep(){
      if(this.current != -1){
        if(this.spchtxt == ''){
          alert('事件不能为空！')
        }else{
        if(this.isrepeat){
        switch(this.cctype){
          case '1':
            this.inwindex2 = ''
            this.dindex = ''
            this.windex = ''
            this.mindex = ''
            break;
          case '3':
            if(this.inwindex.length == 0){
              this.inwindex2 = '2'
            }else{
              this.inwindex2 = this.inwindex.join('')
            }
            this.dindex = ''
            this.windex = ''
            this.mindex = ''
            break;
          case '4':
            if(this.dw == '0'){
              this.inwindex2 = ''
              this.windex = ''
            }else{
              this.dindex = ''
            }
            this.mindex = ''
            break;
          case '5':
            if(this.dw == '0'){
              this.inwindex2 = ''
              this.windex = ''
            }else{
              this.dindex = ''
            }
            break;
        }
        }else{
          this.cctype = '0'
          this.inwindex2 = ''
          this.dindex = ''
          this.windex = ''
          this.mindex = ''
          this.everynum = '0'
        }
        let bctime = ''
        let ectime = ''
        let expiretime = this.expiretime
        if(this.daytype == 0){
          bctime = this.bctime + ' 00:00:00'
          ectime = this.ectime + ' 23:59:00'
        }else{
          bctime = this.bctime + ' 00:00:00l'
          ectime = this.ectime + ' 23:59:00l'
        }
        if(this.isCom){
          expiretime = '00:00:00'
          this.dur = 3600 * 24
        }
        if(this.ectime == ''){
          ectime = ''
        }
        if(expiretime.length < 6 ){
          expiretime += ':00'
        }
        let exception = this.exception
        if(!this.isDate && !this.isrepeat){
          this.getNowDate()
          bctime = this.bctime + ' ' + this.expiretime + ':00'
          ectime = this.ectime + ' ' + this.expiretime + ':00'
        }else if(this.isDate && !this.isrepeat){
          this.comparedate0()
          bctime = this.bctime + ' 00:00:00'
          ectime = this.ectime + ' 00:00:00'
        }
        let canceldatetime = this.canceldatetime
        let unexcept = this.unexcept
        if(canceldatetime.length > 0){
          canceldatetime += ' 00:00:00'
        }else{
          canceldatetime = ''
        }
        if(unexcept.length > 0){
          unexcept += ' 00:00:00'
        }else{
          unexcept = ''
        }
        post('company/program/ajax/ScheduleManageAPI.ashx?Type=update',{
          dType: '2',
          iid: this.mid,
          id: this.id,
          disp: this.disp,
          nick: this.disp,
          name: this.disp,
          menuid: this.mid,
          desc: this.desc,
          address: this.addr,
          spchtxt: this.spchtxt,
          pre_alert_days: this.pd,
          pre_alert_hours: this.ph,
          pre_alert_minutes: this.pm,
          pre_alert_seconds: this.ps,
          begindatetime: bctime,
          enddatetime: ectime,
          expiretime,
          exception,
          everynum: this.everynum,
          inweekindex: this.inwindex2,
          dayindex: this.dindex,
          weekindex: this.windex,
          monthindex: this.mindex,
          circletype: this.cctype,
          opencmd: this.opencmd,
          closecmd: this.closecmd,
          jump: this.jump,
          note: this.note,
          beep: this.beep,
          alertdur: this.alertdur,
          alerttime: this.alerttime,
          alertinterval: this.alertinterval,
          afteralert: this.afteralert,
          atype: this.atype,
          sindex: this.sindex,
          duration: this.dur,
          state: this.state,
          unexcept,
          unexceptdays: this.unexceptdays,
          canceldatetime,
          canceldays: this.canceldays
        }).then(res=>{
          console.log(res.data.message)
          this.getData()
          this.everynum='1'
          this.inwindex=[2]  
          this.inwindex2='2'
          this.dindex='1'    
          this.windex='1'     
          this.dw='0'   
          this.mindex='1'  
          alert('已修改！')
        })}
      }else{
        alert('请选择一项日程！')
      }
    },
    //实时更改结束时间的事件
    comparedate0(){
      let d1 = new Date(this.bctime)
      let d = d1.getDate();
      d1.setDate(d+1)
      let y = d1.getFullYear();
      let m = d1.getMonth()+1;
      d = d1.getDate()
      this.ectime = y + '-' + this.addZero(m,2) + '-' + this.addZero(d,2)
    },
    //为用户选择错误日期做提示并更改为正确时间区间
    comparedate(){
      if(this.ectime != ''){
        let d1 = new Date(this.bctime)
        let d2 = new Date(this.ectime)
        let res = parseInt(d2 - d1) / 1000  / 60  //相差分钟数
        let res2 = parseInt(d2 - d1) / 1000 / 60 / 60 / 24   //相差天数
        if(res2 < 1 ){
          alert('生效时间至少大于1天!')
          this.getNowDate()
        }
      }
    },
    //清空例外内容
    empty2(){
      this.exception = ''
    },
    //激活例外组件
    selexcept(){
      this.openexc = true
    },
    //用于接收例外值
    exc(exception){
      this.exception = exception
    },
    //重置提醒模板
    reset(){          
      let arr = this.$store.state.table
      for(let i of arr){
        if(i.itemid == this.mid){
          this.disp = i.name
          this.opencmd = i.opencmd
          this.closecmd = i.closecmd
          this.jump = i.jump
          this.note = i.note
          this.beep = i.beep
          this.sindex = i.sindex
          this.alertdur = i.alertdur
          this.alerttime = i.alerttime
          this.alertinterval = i.alertinterval
          this.afteralert = i.afteralert
          this.atype = i.atype
          this.modetxt = this.disp + '的模板'
        }
      }
    },
    //开始结束时间的拼接内容
    betime(n){
      if(n.ectime == '' || n.ectime == null || n.ectime == undefined){
        return n.bctime.substr(0,10) + '--从不结束' + '\xa0\xa0\xa0\xa0\xa0\xa0'
      }else{
        return n.bctime.substr(0,10) + '--' + n.ectime.substr(0,10)
      }
    },
    //用于判断持续时间的大小
    dealtime(){
      if(this.duration2 == '0' || this.duration2 == ''){
        if(this.duration < 5){
          alert('日程持续时间至少为5分钟！')
          this.duration = '5'
        }
        this.duration2 = '0'
      }else{
        if(this.duration == ''){
          this.duration = '0'
        }
      }
      this.dur = parseInt(this.duration2) *3600 + parseInt(this.duration) *60
    },
    //状态的切换
    state_btn(){
      if(this.state == '1'){
        this.state = '0'
      }else{
        this.state = '1'
      }
    },
    //鼠标在'结束时间'日期控件的移入移出事件
    mo(){
      this.ne = true
    },
    mo2(){
      this.ne = false
    },
    showx(){
      this.empty = true
    },
    hidex(){
      this.empty = false
    },
    //添加节日
    addFes(){
      let date=new Date();
      let y=date.getFullYear();
      let m=date.getMonth()+1;
      let d=date.getDate();
      let a = calendar.calendarFormatter.solar2lunar(y,m,d)
      //是否有节日，有则添加到日程项
      let festival = a.gregorianFestival + a.lunarFestival
      if(festival.length > 0){
        setTimeout(() => {
          let c = 0
          for(let i of this.typeArr){
            if(i.spchtxt == festival){
              c = 1
            }
          }
          if(c == 0){
            this.getNowDate()
            let bctime = this.bctime.substr(0,10) + ' 00:00:00'
            let ectime = this.ectime.substr(0,10) + ' 00:00:00' 
            let duration = (3600 * 24) + ''
            post('Module/WiseAPI/ScheduleAPI.ashx?wpschedulequery=add',{
              disp: this.disp,
              nick: this.disp,
              name: this.disp,
              menuid: this.mid,
              spchtxt: festival,
              begindatetime: bctime,
              enddatetime: ectime,
              expiretime:'00:00:00',
              circletype: '0',
              opencmd: this.opencmd,
              closecmd: this.closecmd,
              jump: this.jump,
              note: this.note,
              beep: this.beep,
              sindex: this.sindex,
              alertdur: this.alertdur,
              alerttime: this.alerttime,
              alertinterval: this.alertinterval,
              afteralert: this.afteralert,
              atype: this.atype,
              duration,
              state: '1'
            }).then(res =>{
              console.log(res.data.message + '新增节日')
              this.getData()
            })
          }
        },100)
      }
    }
  },
  created() {
    this.token = this.$store.state.token
    let date=new Date();
    let y=date.getFullYear();
    let m=date.getMonth()+1;
    let d=date.getDate();
    let a = calendar.calendarFormatter.solar2lunar(y,m,d)
    console.log(a)
    this.today = y + '/' + m + '/' + d + '\xa0\xa0' + a.ncWeek + '\xa0\xa0\xa0' + a.gzYear + '(' + a.Animal + ')' + '年' + a.IMonthCn + a.IDayCn + '\xa0\xa0\xa0' + a.gregorianFestival + a.lunarFestival + a.Term

    this.getNowDate()   //获取当前时间并在页面显示一些字段的默认值
    this.getData()   //获取日程项数据
       //获取日程单的数据并设置默认提醒方式
    this.dataarr = this.$store.state.table
    for(let i of this.dataarr){
      if(i.itemid == this.mid){
        this.disp = i.name
        this.opencmd = i.opencmd
        this.closecmd = i.closecmd
        this.jump = i.jump
        this.note = i.note
        this.beep = i.beep
        this.sindex = i.sindex
        this.alertdur = i.alertdur
        this.alerttime = i.alerttime
        this.alertinterval = i.alertinterval
        this.afteralert = i.afteralert
        this.atype = i.atype
        this.spchtxt2 = i.spchtxt
        this.modetxt = i.name + '的模板'
      }
    }

    this.addFes()
    
  },
  mounted(){
     // 1. 获取标签
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // 2.绘制表格
    // 2.1 常量
    //canvas.height = Math.max(...groups)*50
    
    var rows = canvas.height / 52,
        cols = canvas.width / 100;
    // 2.2 绘制横线
    for (var i=0; i<=rows; i++){
        // 起点
        ctx.moveTo(0, i*52);
        // 终点
        ctx.lineTo(canvas.width, i*52);
    }

    // 2.3 绘制竖线
    for (var i=0; i<=cols; i++){
         // 起点
         ctx.moveTo(i*100, 0);
         // 终点
         ctx.lineTo(i*100, canvas.height);
    }

    // 绘制
    ctx.strokeStyle = '#c0c1c5';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    // 绘画完转为图片并以img标签的形式展现出来(注：之所以用img是因为canvas绘制出的图形层级太高会覆盖部分UI元素且ZIndex属性不可用)
    const base64 = canvas.toDataURL("image/png", 1)
    const img = document.getElementsByClassName('cvs')
    img[0].setAttribute("src", base64);
    img[0].style.zIndex = '1'
  },
  watch:{
    // 监测日程单是否切换
    mid(){
      // 选中的日程项标识号恢复默认值
      this.current = -1
      // 重新获取日程项数据
      this.getData()
      let arr = this.$store.state.table
      // 遍历所有日程单的数据，若mid号相等则把相应值赋给当前要展示的变量
      for(let i of arr){
        if(i.itemid == this.mid){
          this.disp = i.name
          this.opencmd = i.opencmd
          this.closecmd = i.closecmd
          this.jump = i.jump
          this.note = i.note
          this.beep = i.beep
          this.sindex = i.sindex
          this.alertdur = i.alertdur
          this.alerttime = i.alerttime
          this.alertinterval = i.alertinterval
          this.afteralert = i.afteralert
          this.atype = i.atype
          this.spchtxt2 = i.spchtxt
          this.modetxt = this.disp + '的模板'
        }
      }
      // 添加节日
      this.addFes()
    },
    // 监测是否为全天
    isCom(){
      if(this.isCom){
        this.duration2 = '24'
        this.duration = '0'
        this.expiretime = '00:00'
      }
    },
    // 监测是否重复
    isrepeat(){
      if(this.isrepeat){
        this.isDate = false
        this.ispoint = false
        if(this.cctype == '0'){
          this.cctype = '1'
        }
      }else{
        this.ispoint = true
        this.isDate = true
      }
    },
    // 监测提醒方式是否修改
    modetxt(){
      if(Object.keys(this.$store.state.obj).length != 0){
        let i = this.$store.state.obj
        this.opencmd = i.opencmd
        this.closecmd = i.closecmd
        this.jump = i.jump
        this.note = i.note
        this.beep = i.beep
        this.sindex = i.sindex
        this.alertdur = i.alertdur
        this.alerttime = i.alerttime
        this.alertinterval = i.alertinterval
        this.afteralert = i.afteralert
        this.atype = i.atype
        this.spchtxt = i.spchtxt
        this.$store.commit('setobj',{})
        console.log('modetxt发生改变,该组件变量已拿到相应的值')
      }
    }
  }
}
</script>

<style>
#canvas{
  display: none;
  border:1px solid #c0c1c57c;
}
.cvs{
  position:absolute;
  left: 24px;
  top: 20px;
}
.personal-schedule{
    overflow: hidden;
}
.submit-button{
  display:flex;
  justify-content: center;
}
.personal-schedule button,#reminder-mode button{
    float: right;
    padding: 6px 15px;
    border: 1px solid #0e73e5;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    background-color: #0e73e5;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    color: white;
}
.personal-schedule button,#reminder-mode button:last-child{
    margin-right: 21px;
}
#reminder-mode button:last-child:hover{
  background-color: #1080ff;
}
.personal-schedule button{
  float:none;
  position: relative;
  left: 3.5px
}
.personal-schedule button:hover{
  background-color: #1080ff;
}
.show-schedule,.detailed-info{
    width: calc(100% - 60px);
    margin: 10px 20px;
    background-color: #f6f7fb;
    padding: 10px;
    font-weight: bold;
}
.show-schedule{
    height: 252px;
}
.show-schedule>div>span{
    font-size: 16px;
}
.datalist{
    position: relative;
    width: 100%;
    height: calc(100% - 35px);
    border: 1px solid #c0c1c5;
    margin-top: 5px;
    border-radius: 10px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    -ms-border-radius: 10px;
    -o-border-radius: 10px;
    overflow: auto;
}
.timeul{
  width:2414px;
  height: 19px;
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  margin-left: 10px;
  z-index: 5;
  background-color: #f6f7fb;
}
.timeul>li:last-child{
  width: 114px;
}
.dataul{
  position: relative;
  left: 24px;
  top: 1px;
  display: grid;
  grid-template-columns: repeat(24,100px);
  grid-template-rows: auto;
  z-index: 3;
}
.datali{
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  height: 50px;
  cursor: pointer;
  box-shadow: 2px 0 5px 1px #e0e0e0;
  background-color: #fff;
  margin-bottom: 2px;
  transition: all 0.3s;
}
.datali:hover{
  transform: translate(3px , -3px);
}
.datali p:first-child{
  width:100%;
  font-weight:600;
  font-family:'华文楷体','楷体','宋体';
  text-overflow:ellipsis;
  white-space:nowrap;
  overflow: hidden;
}
.timetitle_li{
  float: left;
  width: 100px;
  font-weight: initial;
  color: #818181;
}
.itemLi{
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  padding-left:80px;
  border: 2px solid transparent;
  cursor: pointer;
}
.itemLi span{
  display: inline-block;
  margin-left:30px;
  overflow: hidden;
}
.itemLi:hover{
  border: 2px solid #949494;
}
.foculi{
    background-color: #e2e2e2;
    box-shadow: none !important;
}
.detailed-info{
    position: relative;
    display: flex;
    overflow: hidden;
    color: #666666;
    justify-content: space-evenly;
}

.fade-enter-active,.fade-leave-active{
    transition: all .5s ease;
}

.fade-enter,.fade-leave{
    opacity: 0;
}

.detailed-info input{
    width: 240px;
    height: 25px;
    font-size: 14px;
}
#reminder-mode select{
    width: 200px;
    height: 25px;
    font-size: 14px;
}
.detailed-info div:last-child input,#repeat{
    width: auto;
    margin-right: 3px;
    vertical-align:middle
}
.detailed-info label,#reminder-mode label{
    display: inline-block;
    margin: 5px;
}
.detailed-info span{
    position: relative;
    display: inline-block;
    margin: 5px 0;

}
.detailed-info div:first-child label{
    float: right;
}
.detailed-info div:first-child img{
    height: 20px;
    margin-left: 5px;
    cursor: pointer;
}
.detailed-info div:first-child select{
  text-align: left;
  height: 25px;
}
.detailed-info div:nth-child(2){
    margin-top: 30px;
}
.daymode{
    position:relative;
    top:-1px;
    width: auto !important;
    margin-right: 3px !important;
    vertical-align:middle !important;
}
.detailed-info div:nth-child(2) label{
    margin-top: 5px;
}

.boxstyle1{  
    display: inline-block;
    width: 12px;
    height: 12px;
    position: absolute;
    right: 10px;
    top: -23px;
    cursor: pointer;
    background-image: url('../assets/img/close.png');
    background-size: 12px;
}
.boxstyle1:hover{
    background-image: url('../assets/img/close0.png');
}

.detailed-info div:last-child select{
    position: relative;
    left: -3px;
    width: 211px;
    height: 25px;
    font-size: 14px;
    text-align: left;
}
.weekbox{
  width: 295px;
}
.state_btn{
  width: 50px;
  height: 24px;
  position: relative;
  left: 3px;
  border-radius: 12px;
  float: right;
  background-color: rgb(202, 202, 202);
  cursor: pointer;
}
.active_s{
  background-color: #0e73e5;
}
.state_btn2{
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: white;
  position: relative;
  top: 1px;
  left: 1px;
  transition: all .2s ;
}
.active_s2{
  left: 27px;
}
.spch{
  width: 150px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.neverend{
  width: 12px;
  height: 12px;
  position: absolute;
  right: 38px;
  top: 85px;
  cursor: pointer;
  background-image: url('../assets/img/close.png') ;
  background-size: 12px;  
}
.neverend:hover{
  background-image: url('../assets/img/close0.png') ;
}
.repeatbox{
  position: relative;
}
input[type="date"]::-webkit-calendar-picker-indicator,input[type="datetime-local"]::-webkit-calendar-picker-indicator{
  background:url('../assets/img/日历0.png') no-repeat;
  background-size: 16px;
  position: relative;
  top: 2px;
  cursor: pointer;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover,input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover{
  background:url('../assets/img/日历.png') no-repeat;
  background-size: 16px;
}
.nevtxt{
  width: 160px !important;
  position: absolute;
  left: 81px;
  top: 78px;
  border: 0;
}
/* 滚动条样式 */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
::-webkit-scrollbar-track-piece {
  background-color: transparent;  
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:vertical {
  height: 12px;
  background-color: #BDBDBD;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:horizontal {
  width: 12px;
  background-color: #BDBDBD;
  border-radius: 6px;
}
/* 滚动条鼠标移上去的样式 */
::-webkit-scrollbar-thumb:vertical:hover,::-webkit-scrollbar-thumb:horizontal:hover
{
  background-color: #808080;
}
::-webkit-scrollbar-corner{
  background-color: transparent; 
}
</style>