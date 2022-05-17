<template>
  <div id="select-template">
    <div class="select-template">
      <h2>选择模板</h2>
        <ul>
            <li v-for="(item,index) in modeList" :key="index">
                <h3>{{item.name + '的模板'}}</h3>
                <div class="template-style">
                    <div>
                      <label>铃声播放时长：
                          <select v-model="item.alertdur">
                              <option v-for="(item2,index2) in alertdurarr" :key="index2" :value ="item2.index">{{item2.value}}</option>
                          </select>
                      </label><br/>
                      <label>提醒次数：
                          <select v-model="item.alerttime">
                              <option v-for="(item2,index2) in alerttimearr" :key="index2" :value ="index2">{{item2}}次</option>
                          </select>
                      </label><br/>
                      <label>提醒间隔：
                          <select v-model="item.alertinterval">
                              <option v-for="(item2,index2) in alertintervalarr" :key="index2" :value ="item2">{{item2}}分</option>
                          </select>
                      </label><br/>
                      <label>提醒完设置：
                          <select v-model="item.afteralert">
                              <option value ="1">结束后待命</option>
                              <option value ="0">自动关闭</option>
                          </select>
                      </label><br/>
                    </div>
                    <div>
                      <label>屏幕闪烁：
                          <select>
                              <option value ="1" v-if="item.atype.slice(-1) == '1'">开</option>
                              <option value ="0" v-else>关</option>
                          </select>
                      </label><br/>
                      <label>设为缺省铃声：
                          <select v-model="item.sindex">
                              <option v-for="(item2,index2) in sindexarr" :key="index2"  :value="index2" >{{item2}}</option>
                          </select>
                      </label><br/>
                      <label>缺省语音播报：
                          <select v-model="item.spchtxt">
                            <option value ="">不启用语音</option>
                            <option v-for="(item,index) in spchtxtarr" :key="index" :value="item">{{item}}</option>
                          </select>
                      </label><br/>
                      <label>设为缺省开指令：
                          <select v-model="item.opencmd">
                              <option value ="">不启用声光电指令</option>
                              <option v-for="(item,index) in cmd" :key="index" :value="item">{{item}}</option>
                          </select>
                      </label><br/>
                    </div>
                    <div>
                      <label>设为缺省关指令：
                          <select v-model="item.closecmd">
                              <option value ="">不启用声光电关闭指令</option>
                              <option v-for="(item,index) in cmd" :key="index" :value="item">{{item}}</option>
                          </select>
                      </label><br/>
                      <label>设为缺省通知：
                          <select v-model="item.note">
                              <option value ="">不启用社区及亲人通知指令</option>
                              <option v-for="(item,index) in cmd" :key="index" :value="item">{{item}}</option>
                          </select>
                      </label><br/>
                      <label>设为缺省跳转：
                          <select v-model="item.jump">
                              <option value ="">不启用跳转</option>
                              <option v-for="(item,index) in jumparr" :key="index" :value="item">{{item}}</option>
                          </select>
                      </label><br/>
                      <label>设为缺省蜂鸣：
                          <select v-model="item.beep">
                            <option value ="">不启用警报提示</option>
                            <option v-for="(item,index) in beeparr" :key="index" :value ="item">{{item}}</option>
                          </select>
                      </label><br/>
                    </div>
                </div> 
                <div class="select-button" @click="sele_btn(item.itemid)">+选择</div>   
            </li>
        </ul>
        <div class="close_btn" @click="close_btn"></div>
    </div> 
  </div>
</template>

<script>

export default{
  props:{
    mid: String,
  },
  data() {
    return {
      disp:'',
      modeList:[],
      alertdur: '30', //播放时长(表)
      alertdurarr:[{index:15,value:'15秒'},{index:30,value:'30秒'},{index:60,value:'1分'},{index:120,value:'2分'},{index:300,value:'5分'},{index:600,value:'10分'},{index:900,value:'15分'},{index:1200,value:'20分'},{index:1800,value:'30分'}],
      alertinterval:'5', //提醒间隔(表)
      alertintervalarr:[5,10,15,20,25,30,60],
      alerttime:'1',   //提醒次数（表）
      alerttimearr:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100],
      afteralert:'1', //提醒完后的操作,0表示自动关闭，1表示原地待命等待用户操作(表)
      shanshuo:'1', //闪烁
      sindex:'1',  //铃声
      sindexarr:["0-不启用铃声","1-催促铃声","2-悦耳铃声","3-跳跃铃声","4-滴滴铃声","5-急促铃声","6-鸟声铃声","7-轻快铃声","8-舒适铃声","9-自然铃声","10-来电铃声","11-嗒嘀嗒铃声","12-叮铃铃铃声","13-快节奏铃声","14-搞怪的铃声","15-滴滴渐强铃声","16-滴滴减弱铃声","17-哒哒减弱铃声","18-老式电话铃声","19-电话渐强铃声","20-金鸡报晓铃声","21-海浪海鸥铃声","22-野外虫鸣铃声","23-电子警报铃声","24-防盗器铃声","25-雷达警报铃声","26-音阶舒缓铃声"],
      spchtxt:'0', //语音
      atype:'', //提醒方式 ，个位1屏幕闪烁，十位1铃声，百位1语音，千位1指令--声光电指令，万位1控制节目单指令/跳转，十万位通知社区及亲人，百万为蜂鸣(表)
      opencmd:'0',  //声光电指令下的打开指令。可组合多条指令(表)
      closecmd:'0',  //声光电指令下的关闭指令。可组合多条指令(表)
      note:'',  //通知
      jump:'',  //跳转
      beep:'',  //蜂鸣
      beeparr:[],
      id:'',
      spchtxtarr:[],
      cmd:[],
      jumparr:[],
      token:'',
    }
  },
  methods: {
    sele_btn(mid){
      for(let i of this.modeList){
        if(i.itemid == mid){
          let a = {}
          this.disp = i.name
          a.alertdur = i.alertdur
          a.alertinterval = i.alertinterval
          a.alerttime = i.alerttime
          a.afteralert = i.afteralert
          a.atype = i.atype
          a.opencmd = i.opencmd
          a.closecmd = i.closecmd
          a.note = i.note
          a.jump = i.jump
          a.beep = i.beep
          a.sindex = i.sindex
          this.$store.commit('setobj',a)
        }
      }
      this.$parent.isSele = false
      this.$parent.getData()
      this.$parent.modetxt = this.disp + '的模板'
    },
    close_btn(){
      this.$parent.isSele = false
    }
  },
  created(){
    this.token = this.$store.state.token
    this.id = this.$store.state.id
    this.spchtxtarr = this.$store.state.spchtxtarr
    this.cmd = this.$store.state.cmd
    this.jumparr = this.$store.state.jumparr
    this.beeparr = this.$store.state.beeparr
    this.$store.commit('setId', '')
    this.modeList = this.$store.state.table
  }
}
</script>

<style>
#select-template{
    width: 100%;
    height: 986px;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
    z-index: 10;
}
@media screen and (max-width:1300px) {
  #select-template{
    width: 1300px;
  }
}
.select-template{
    position: absolute;
    width: 1160px;
    height: 560px;
    top: calc(50% - 280px);
    left: calc(50% - 580px);
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

.select-template select{
    width: 220px;
}
.select-template ul{
    height: 515px;
    overflow: auto;
    margin: 15px 0;
}
.select-template li{
    position: relative;
    width: 1100px;
    height: 230px;
    border: 1px solid #999999;
    padding: 10px;
    margin-bottom: 10px;
}
.template-style{
    display: flex;
    flex: 1;
    text-align: right;
    justify-content: space-around;
    pointer-events: none;
}
.template-style label{
    display: inline-block;
    margin-top: 10px;
}
.select-button{
    position: absolute;
    left: 1030px;
    top: 205px;
    width: 55px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #0e73e5;
    color: #0e73e5;
    font-weight: bold;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
}
.select-button:hover{
    cursor: pointer;
    background-color: #0e73e5;
    color: white;
}
.close_btn{
  position: absolute;
  width: 32px;
  height: 32px;
  left: 1130px;
  top: 15px;
  background-image: url('../assets/img/close.png');
  cursor: pointer;
}
.close_btn:hover{
  background-image: url('../assets/img/close0.png');
}
</style>