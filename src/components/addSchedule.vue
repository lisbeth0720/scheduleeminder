<template>
  <div>
    <div style="text-align:center;font-size:20px;font-weight:bold;margin-top:10px;">添加日程单</div>
    <div class="add-schedule">
      <div class="form-group">
          <label style="text-align: left;background:#0e73e5;color:white;font-size:16px;">信息填写</label><br/>
          <label>日程单名称：<input type="text" placeholder="请输入" v-model="name" maxlength="32" ref="name" @blur="nameblur" :class="{'hightlight': isblur}"></label><br/>
          <p class="tip_p">（*必填）</p>
          <label><span style="vertical-align:top">描述：</span><textarea  placeholder="请输入" v-model="desc" maxlength="256"></textarea></label><br/>
          <label>授权可访问序列号：<input type="text" placeholder="请输入" v-model="serial" maxlength="64"></label><br/>
          <p style="position:relative;left:180px;">(多个序列号之间用逗号分隔，空或*号为不限制)</p>
      </div>
      <div class="form-group">
          <label style="text-align: left; background:#0e73e5;color:white;font-size:16px;">提醒模板</label><br/>
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
          <label>缺省语音播报：
              <select v-model="spchtxt">
                  <option value ="不启用语音">不启用语音</option>
                  <option v-for="(item,index) in spchtxtarr" :key="index" :value="item">{{item}}</option>
              </select>
              <input type="text" v-model="spchtxt" class="ipt" maxlength="512" >
          </label><br/>
          <label>设为缺省开指令：
              <select v-model="opencmd">
                  <option value ="不启用声光电指令">不启用声光电指令</option>
                  <option v-for="(item,index) in cmd" :key="index" :value="item">{{item}}</option>
              </select>
              <input type="text" v-model="opencmd" class="ipt" maxlength="512">
          </label><br/>
          <label>设为缺省关指令：
              <select v-model="closecmd">
                  <option value ="不启用声光电指令">不启用声光电指令</option>
                  <option v-for="(item,index) in cmd" :key="index" :value="item">{{item}}</option>
              </select>
              <input type="text" v-model="closecmd" class="ipt" maxlength="512">
          </label><br/>
          <label>设为缺省通知：
              <select v-model="note">
                  <option value ="不启用社区及亲人通知指令">不启用社区及亲人通知指令</option>
                  <option v-for="(item,index) in cmd" :key="index" :value="item">{{item}}</option>
              </select>
              <input type="text" v-model="note" class="ipt" maxlength="512">
          </label><br/>
          <label>设为缺省跳转：
              <select v-model="jump">
                  <option value ="不启用跳转">不启用跳转</option>
                  <option v-for="(item,index) in jumparr" :key="index" :value="item">{{item}}</option>
              </select>
              <input type="text" v-model="jump" class="ipt" maxlength="128">
          </label><br/>
          <label>设为缺省蜂鸣：
              <select v-model="beep">
                  <option value ="不启用警报提示">不启用警报提示</option>
                  <option v-for="(item,index) in beeparr" :key="index" :value ="item">{{item}}</option>
              </select>
              <input type="text" v-model="beep" class="ipt" maxlength="128">
          </label><br/>
          <label style="position:relative;top: -7px;">选择标识颜色：
              <input type="color" v-model="color" class="setcolor">
          </label><br/>
      </div>  
      <div class="form-group">
          <button @click="reset">重置</button>
          <button @click="submit()">确认</button>
      </div>                   
    </div>
  </div>
</template>

<script>

import {get,post} from '../network/request'
import {alert} from '../alert'

export default{
  data() {
    return {
      name:'',  //名称(表)
      desc:'',  //描述(表)
      serial:'',  //序列号(表)
      alertdur: '30', //播放时长(表)
      alertdurarr:[{index:15,value:'15秒'},{index:30,value:'30秒'},{index:60,value:'1分'},{index:120,value:'2分'},{index:300,value:'5分'},{index:600,value:'10分'},{index:900,value:'15分'},{index:1200,value:'20分'},{index:1800,value:'30分'}],
      alertinterval:'5', //提醒间隔(表)
      alertintervalarr:[5,10,15,20,25,30,60],
      alerttime:'1',   //提醒次数（表）
      alerttimearr:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100],
      afteralert:'1', //提醒完后的操作,0表示自动关闭，1表示原地待命等待用户操作(表)
      shanshuo:'1', //闪烁
      sindex:'1',  //铃声索引
      sindexarr:["0-不启用铃声","1-催促铃声","2-悦耳铃声","3-跳跃铃声","4-滴滴铃声","5-急促铃声","6-鸟声铃声","7-轻快铃声","8-舒适铃声","9-自然铃声","10-来电铃声","11-嗒嘀嗒铃声","12-叮铃铃铃声","13-快节奏铃声","14-搞怪的铃声","15-滴滴渐强铃声","16-滴滴减弱铃声","17-哒哒减弱铃声","18-老式电话铃声","19-电话渐强铃声","20-金鸡报晓铃声","21-海浪海鸥铃声","22-野外虫鸣铃声","23-电子警报铃声","24-防盗器铃声","25-雷达警报铃声","26-音阶舒缓铃声","27-自定义铃声1","28-自定义铃声2","29-自定义铃声3"],
      spchtxt:'不启用语音', //语音
      spchtxtarr:[],
      atype:'', //提醒方式 ，个位1屏幕闪烁，十位1铃声，百位1语音，千位1指令--声光电指令，万位1控制节目单指令/跳转，十万位通知社区及亲人，百万为蜂鸣(表)
      opencmd:'不启用声光电指令',  //声光电指令下的打开指令。可组合多条指令(表)
      closecmd:'不启用声光电指令',  //声光电指令下的关闭指令。可组合多条指令(表)
      cmd:[],
      note:'不启用社区及亲人通知指令',  //通知
      jump:'不启用跳转',  //跳转
      jumparr:[],
      beep:'不启用警报提示',  //蜂鸣
      beeparr:[],
      color:'#0e73e5',
      colorarr:[{id:'#1E90FF',name:'湖蓝'},{id:'#228B22',name:'森林绿'},{id:'#4169E1',name:'品蓝'},{id:'#BA55D3',name:'中洋兰紫'},{id:'#BC8F8F',name:'玫瑰褐'},{id:'#FF4500',name:'橘红'},{id:'#FF8C00',name:'深橙'}],
      token:'',
      isblur:false,
    }
  },
  methods: {
    submit(){
      if(this.name == '' ){
        alert('请填写日程单名称!')
        this.$refs.name.focus()
        this.isblur = true
      }else{
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
        post('company/program/ajax/ScheduleManageAPI.ashx?Type=add',{
          name: this.name,
          desc: this.desc,
          serial: this.serial,
          alertdur: this.alertdur,
          alerttime: this.alerttime,
          alertinterval: this.alertinterval,
          afteralert: this.afteralert,
          spchtxt: this.spchtxt,
          jump: this.jump,
          note: this.note,
          atype: this.atype,
          opencmd: this.opencmd,
          closecmd: this.closecmd,
          sindex: this.sindex,
          beep: this.beep,
          color: this.color,
          token: this.token
        }).then(res=>{
          let msg = res.data.message
          console.log(msg)
          if(msg == '日程单已存在'){
            alert('日程单已存在!')
            this.$refs.name.focus()
          }else{
            this.$parent.getData()
            alert('添加成功！')
            this.$refs.name.focus()
          }
        })
        this.name = ''
        if(this.spchtxt == '0'){
          this.spchtxt = '不启用语音' 
        }
        if(this.opencmd == '0'){
          this.opencmd = '不启用声光电指令' 
        }
        if(this.closecmd == '0'){
          this.closecmd = '不启用声光电指令' 
        }
        if(this.note == '0'){
          this.note = '不启用社区及亲人通知指令' 
        }
        if(this.jump == '0'){
          this.jump = '不启用跳转' 
        }
        if(this.beep == '0'){
          this.beep = '不启用警报提示' 
        }
      }
    },
    reset(){
      this.name = ''
      this.desc = ''
      this.serial = ''
      this.alertdur = '30'
      this.alertinterval = '5'
      this.alerttime = '1'
      this.afteralert = '1'
      this.shanshuo = '1'
      this.sindex = '1'  
      this.spchtxt = '不启用语音'
      this.opencmd = '不启用声光电指令'
      this.closecmd = '不启用声光电指令'
      this.note = '不启用社区及亲人通知指令'
      this.jump = '不启用跳转'
      this.beep = '不启用警报提示'
      this.color = '#1E90FF'
    },
    nameblur(){
      if(this.name == ''){
        this.isblur = true
      }else{
        this.isblur = false
      }
    }
  },
  created(){
    get('./config.json').then(res =>{
      console.log(res.data)
      let item = res.data
      this.$store.commit('setspchtxtarr',item.spchtxt)
      this.$store.commit('setcmd',item.cmd)
      this.$store.commit('setjumparr',item.jump)
      this.$store.commit('setbeeparr',item.beep)
      this.spchtxtarr = this.$store.state.spchtxtarr
      this.cmd = this.$store.state.cmd
      this.jumparr = this.$store.state.jumparr
      this.beeparr = this.$store.state.beeparr
      this.token = this.$store.state.token
    }).catch(rej =>{
      console.log('读取配置文件失效')
    })
  }
}
</script>

<style>
.add-schedule{
    position: relative;
    width: calc(100% - 40px);
    height: calc(100% - 70px);
    background-color: #f6f7fb;
    top: 10px;
    left: 20px;
    font-weight: bold;
    color: #666666;
    padding-top: 10px;
}
.form-group{
    margin-left: calc((100% - 480px)/2);
    position: relative;
}
.add-schedule label{
    display: inline-block;
    width: 480px;
    text-align: right;
    margin: 5px auto;
    position: relative;
}
.form-group button{
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
}
.form-group button:first-child{
    margin-right: calc(100% - 480px);
    color: #0e73e5;
    background-color: white;
}
.form-group button:last-child{
    margin-right: 21px;
    color: white;
}
.form-group button:last-child:hover{
  background-color: #1080ff;
}
.setcolor{
  position: relative;
  top: 7px;
  cursor: pointer;
  height: 35px;
}
.tip_p{
  position: absolute;
  color: red;
  left: 490px;
  top: 40px;
}
.ipt{
  position: absolute;
  width: 280px;
  height: 28px;
  text-align: right;
  right: 19px;
  top: 1px;
  border-radius: 15px 0 0 15px;
  border: 0;
}
.hightlight{
  border-color: red;
  box-shadow:0 0 2px red;
}
</style>