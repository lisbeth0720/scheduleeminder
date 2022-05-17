<template>
    <div id="reminder-mode">
      <div class="reminder-mode">
        <h2>修改提醒方式</h2>  
          <div>
            <label>铃声播放时长：
              <select v-model="alertdur">
                  <option v-for="(item,index) in alertdurarr" :key="index" :value ="item.index">{{item.value}}</option>
              </select>
            </label><br/>
            <label>提醒次数：
                <select v-model="alerttime">
                    <option v-for="(item,index) in alerttimearr" :key="index" :value ="index">{{item}}次</option>
                </select>
            </label><br/>
            <label>提醒间隔：
                <select v-model="alertinterval">
                    <option v-for="(item,index) in alertintervalarr" :key="index" :value ="item">{{item}}分</option>
                </select>
            </label><br/>
            <label>提醒完设置：
                <select v-model="afteralert">
                    <option value ="1">结束后待命</option>
                    <option value ="0">自动关闭</option>
                </select>
            </label><br/>
            <label>屏幕闪烁：
                <select v-model="shanshuo">
                    <option value ="1">开</option>
                    <option value ="0">关</option>
                </select>
            </label><br/>
            <label>设为缺省铃声：
                <select v-model="sindex">
                    <option v-for="(item,index) in sindexarr" :key="index" :value ="index">{{item}}</option>
                </select>
            </label><br/>
            <label v-if="id == '' "><span style="position:relative;left: -4px;top: -6px;">选择标识颜色：</span>
              <input type="color" v-model="color" style="width: 200px;">
            </label><br/>
          </div>
          <div style="float: right;">
              <label>缺省语音播报：
                <select v-model="spchtxt">
                  <option value ="不启用语音">不启用语音</option>
                  <option v-for="(item,index) in spchtxtarr" :key="index" :value="item">{{item}}</option>
                </select>
                <input type="text" v-model="spchtxt" class="ipt2" maxlength="512" >
              </label><br/>
              <label>设为缺省开指令：
                  <select v-model="opencmd">
                    <option value ="不启用声光电指令">不启用声光电指令</option>
                    <option v-for="(item,index) in cmd" :key="index" :value="item">{{item}}</option>
                  </select>
                  <input type="text" v-model="opencmd" class="ipt2" maxlength="512">
              </label><br/>
              <label>设为缺省关指令：
                  <select v-model="closecmd">
                      <option value ="不启用声光电指令">不启用声光电指令</option>
                      <option v-for="(item,index) in cmd" :key="index" :value="item">{{item}}</option>
                  </select>
                  <input type="text" v-model="closecmd" class="ipt2" maxlength="512">
              </label><br/>
              <label>设为缺省通知：
                  <select v-model="note">
                      <option value ="不启用社区及亲人通知指令">不启用社区及亲人通知指令</option>
                      <option v-for="(item,index) in cmd" :key="index" :value="item">{{item}}</option>
                  </select>
                  <input type="text" v-model="note" class="ipt2" maxlength="512">
              </label><br/>
              <label>设为缺省跳转：
                  <select v-model="jump">
                      <option value ="不启用跳转">不启用跳转</option>
                      <option v-for="(item,index) in jumparr" :key="index" :value="item">{{item}}</option>
                  </select>
                  <input type="text" v-model="jump" class="ipt2" maxlength="128">
              </label><br/>
              <label>设为缺省蜂鸣：
                <select v-model="beep">
                  <option value ="不启用警报提示">不启用警报提示</option>
                  <option v-for="(item,index) in beeparr" :key="index" :value ="item">{{item}}</option>
                </select>
                <input type="text" v-model="beep" class="ipt2" maxlength="128">
              </label><br/>        
          </div>
          <button style="margin-right: 20px;color: #0e73e5;background-color: white;" @click="cancelRe()">取消</button>
          <button @click="subbtn">确认</button>
      </div>
    </div>
</template>

<script>

import {post} from '@/network/request.js'

export default{
  props:{
    mid: String,
  },
  data() {
    return {
      alertdur: '30', //播放时长(表)
      alertdurarr:[{index:15,value:'15秒'},{index:30,value:'30秒'},{index:60,value:'1分'},{index:120,value:'2分'},{index:300,value:'5分'},{index:600,value:'10分'},{index:900,value:'15分'},{index:1200,value:'20分'},{index:1800,value:'30分'}],
      alertinterval:'5', //提醒间隔(表)
      alertintervalarr:[5,10,15,20,25,30,60],
      alerttime:'1',   //提醒次数（表）
      alerttimearr:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100],
      afteralert:'1', //提醒完后的操作,0表示自动关闭，1表示原地待命等待用户操作(表)
      shanshuo:'1', //闪烁
      sindex:'1',  //铃声(表)
      sindexarr:["0-不启用铃声","1-催促铃声","2-悦耳铃声","3-跳跃铃声","4-滴滴铃声","5-急促铃声","6-鸟声铃声","7-轻快铃声","8-舒适铃声","9-自然铃声","10-来电铃声","11-嗒嘀嗒铃声","12-叮铃铃铃声","13-快节奏铃声","14-搞怪的铃声","15-滴滴渐强铃声","16-滴滴减弱铃声","17-哒哒减弱铃声","18-老式电话铃声","19-电话渐强铃声","20-金鸡报晓铃声","21-海浪海鸥铃声","22-野外虫鸣铃声","23-电子警报铃声","24-防盗器铃声","25-雷达警报铃声","26-音阶舒缓铃声"],
      spchtxt:'', //语音
      spchtxtarr:[],
      atype:'', //提醒方式 ，个位1屏幕闪烁，十位1铃声，百位1语音，千位1指令--声光电指令，万位1控制节目单指令/跳转，十万位通知社区及亲人，百万为蜂鸣(表)
      opencmd:'0',  //声光电指令下的打开指令。可组合多条指令(表)
      closecmd:'0',  //声光电指令下的关闭指令。可组合多条指令(表)
      note:'0',  //通知
      cmd:[],
      jump:'0',  //跳转
      jumparr:[],
      beep:'0',  //蜂鸣
      beeparr:[],
      typeArr:[],
      id:'',
      color:'',
      token:'',
    }
  },
  methods: {
    cancelRe(){
      this.$parent.getIsRem()
    },
    subbtn(){
      let sindex = '0'
      let beep = '0'
      let spchtxt = '0'
      let opencmd = '0'
      let note = '0'
      let jump = '0'
      if(this.sindex != '0'){
        sindex = '1'
      }
      if(this.beep != '不启用警报提示'){
        beep = '1'
      }else{
        this.beep = ''
      }

      if(this.spchtxt != '不启用语音'){
        spchtxt = '1'
      }else{
        this.spchtxt = ''
      }

      if(this.opencmd != '不启用声光电指令'){
        opencmd = '1'
      }else{
        this.opencmd = ''
      }

      if(this.closecmd != '不启用声光电指令'){
        opencmd = '1'
      }else{
        this.closecmd = ''
      }

      if(this.note != '不启用社区及亲人通知指令'){
        note = '1'
      }else{
        this.note = ''
      }

      if(this.jump != '不启用跳转'){
        jump = '1'
      }else{
        this.jump = ''
      }
      this.atype = beep + note + jump + opencmd + spchtxt + sindex + this.shanshuo
      if(this.id != ''){
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
        a.spchtxt = this.spchtxt
        this.$store.commit('setobj',a)
        this.$parent.changetxt()
      }else{
        post('company/program/ajax/ScheduleManageAPI.ashx?Type=update',{
          dType: '1',
          iid: this.mid,
          alertdur: this.alertdur,
          alerttime: this.alerttime,
          alertinterval: this.alertinterval,
          afteralert: this.afteralert,
          atype: this.atype,
          opencmd: this.opencmd,
          closecmd: this.closecmd,
          jump: this.jump,
          note: this.note,
          beep: this.beep,
          sindex: this.sindex,
          spchtxt: this.spchtxt,
          color: this.color
        }).then(res =>{
          console.log(res.data.message)
          this.$parent.getData()
          alert('已修改！')
        })
      }
      this.$parent.getIsRem()
    }
  },
  created(){
    this.token = this.$store.state.token
    this.id = this.$store.state.id
    this.spchtxtarr = this.$store.state.spchtxtarr
    this.cmd = this.$store.state.cmd
    this.jumparr = this.$store.state.jumparr
    this.beeparr = this.$store.state.beeparr
    if(this.id != ''){
      let i = this.$store.state.obj
      this.alertdur = i.alertdur
      this.alertinterval = i.alertinterval
      this.alerttime = i.alerttime
      this.afteralert = i.afteralert
      this.atype = i.atype
      this.opencmd = i.opencmd
      this.closecmd = i.closecmd
      this.note = i.note
      this.jump = i.jump
      this.beep = i.beep
      this.sindex = i.sindex
      this.spchtxt = i.spchtxt
      this.shanshuo = this.atype.slice(-1)
      this.$store.commit('setId','')
      this.$store.commit('setobj',{})
    }else{
      let j = this.$store.state.table
      for(let i of j){
         if(i.itemid == this.mid){
          this.alertdur = i.alertdur
          this.alertinterval = i.alertinterval
          this.alerttime = i.alerttime
          this.afteralert = i.afteralert
          this.atype = i.atype
          this.opencmd = i.opencmd
          this.closecmd = i.closecmd
          this.note = i.note
          this.jump = i.jump
          this.beep = i.beep
          this.sindex = i.sindex
          this.spchtxt = i.spchtxt
          this.shanshuo = this.atype.slice(-1)
          this.color = i.color
        }
      }
    }
    if(this.spchtxt == '0' || this.spchtxt == ''){
      this.spchtxt = '不启用语音' 
    }
    if(this.opencmd == '0' || this.opencmd == ''){
      this.opencmd = '不启用声光电指令' 
    }
    if(this.closecmd == '0' || this.closecmd == ''){
      this.closecmd = '不启用声光电指令' 
    }
    if(this.note == '0' || this.note == ''){
      this.note = '不启用社区及亲人通知指令' 
    }
    if(this.jump == '0' || this.jump == ''){
      this.jump = '不启用跳转' 
    }
    if(this.beep == '0' || this.beep == ''){
      this.beep = '不启用警报提示' 
    }
  }
}
</script>

<style>
#reminder-mode{
    width: 100%;
    height: 986px;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
    z-index: 10;
}
@media screen and (max-width:1300px) {
  #reminder-mode{
    width: 1300px;
  }
}
.reminder-mode{
    position: absolute;
    width: 700px;
    height: 320px;
    top: calc(50% - 160px);
    left: calc(50% - 350px);
    background-color: #eeeeee;
    border-radius: 20px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    -ms-border-radius: 20px;
    -o-border-radius: 20px;
    padding: 20px 15px;
    color: #666666;
    font-weight: bold;
    z-index: 9;
}

.reminder-mode select{
    width: 220px;
}
.reminder-mode h2{
    margin-bottom: 10px;
}
.reminder-mode div{
    float: left;
    text-align: right;
}
.reminder-mode label{
    margin: 10px 0;
    position: relative;
}
.reminder-mode button{
    position: relative;
    float: right;
    top: 20px;
}
.ipt2{
  width: 181px;
  height: 25px;
  position: absolute;
  text-align: right;
  right: 19px;
  border-radius: 15px 0 0 15px;
  border: 0;
  font-size: 14px;
}
</style>