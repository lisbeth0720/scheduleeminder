<template>
  <div class="selwrap">
    <div class="seleliwai">
      <h1>选择例外</h1>
      <div class="borderexc">
        <div class="weekexc">
          <h2>选择星期例外</h2>
          <ul>
            <li v-for="(item,index) in weeklist" :key="index" style="float:left;">
              <label><input type="checkbox" name="week" :value="index" v-model="windex" @change="aa" class="checkstyle">{{item}}</label>
            </li>
          </ul>
        </div>
        <div style="clear: both;"></div>
        <div class="dateexc">
          <h2>选择日期例外</h2>
          <div style="position:relative;left: 110px;margin-top:10px;">
            <label><input type="radio" name="datetype" class="checkstyle" v-model="datetype" value="0">阳历</label>
            <label><input type="radio" name="datetype" class="checkstyle" v-model="datetype" value="1">农历</label>
          </div>
          <label>请选择日期：<input type="date" class="checkstyle" style="width: 150px;" v-model="datetime"></label>
          <label><input type="checkbox" v-model="haveyear" class="checkstyle">含年</label>
          <div class="add" @click="add">添加</div>
          <div class="add" @click="del">移除</div>
          <div class="showdate">
            <ul>
              <li v-for="(item,index) in datearr" :key="index" :class="{activeli: current == index}" @click="activeli(index)">{{item}}</li>
            </ul>
          </div>
        </div><br>
        <label style="display:inline-block;"><span style="vertical-align:top;">已选择：</span><textarea  readonly v-model="exception2" style="width:390px;"></textarea></label>
      </div>
      <div style="text-align:center;">
        <div class="cancle" @click="ok" >确定</div>
        <div class="cancle" @click="cancle">取消</div>
      </div>
      
    </div>
  </div>
</template>

<script>
  export default{
    props:{
      exception: String,
    },
    data() {
      return {
        weeklist:['周一','周二','周三','周四','周五','周六','周日'],
        windex:[],
        windex2:[],
        datearr:[],
        total:[],
        haveyear:false,
        datetime:'',
        current: -1,
        exception2:'',
        datetype:'0'
      }
    },
    methods:{
      aa(){
        this.windex2 = []
        if(this.windex.length > 0){
          this.windex.sort()
          for(let i of this.windex){
            this.windex2.push(this.weeklist[i])
          }
        }
        this.total = this.windex2.concat(this.datearr)
        this.exception2 = this.total.join(';')
      },
      cancle(){
        this.$parent.openexc = false
      },
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
      add(){
        let d = this.datetime.replace(/-/g,'.')
        if(this.haveyear){
          if(this.datetype == '0'){
            this.datearr.push(d)
          }else{
            this.datearr.push(d+'l')
          }
        }else{
          if(this.datetype == '0'){
            this.datearr.push(d.substr(5,d.length))
          }else{
            this.datearr.push(d.substr(5,d.length)+'l')
          }
        }
        this.datearr = [...new Set(this.datearr)]
        this.datearr.sort()
        this.total = this.windex2.concat(this.datearr)
        this.exception2 = this.total.join(';')
        
      },
      del(){
        //this.datearr = this.datearr.filter(item => item != this.datearr[this.current])
        this.datearr.splice(this.current,1)
        this.total = this.windex2.concat(this.datearr)
        if(this.total.length > 0){
          this.exception2 = this.total.join(';')
        }else{
          this.exception2 = ''
        }
        this.current = -1
      },
      activeli(index){
        this.current = index
      },
      ok(){
        this.$emit('exception',this.exception2)
        this.$parent.openexc = false
      }
    },
    created(){
      this.exception2 = this.exception
      let date = new Date()
      this.datetime = date.getFullYear() + '-' + this.addZero((date.getMonth()+1),2) + '-' + this.addZero(date.getDate(),2)
      if(this.exception2 != ''){
        this.total = this.exception2.split(';')
        for(let i of this.total){
          if(i.indexOf('周') != -1){
            this.windex2.push(i)
          }else{
            this.datearr.push(i)
          }
        }
        if(this.windex2.length > 0){
          for(let i of this.windex2){
            for(let j in this.weeklist){
              if(i == this.weeklist[j]){
                this.windex.push(j)
              }
            }
          }
        }
      }
    }
  }
</script>

<style>
.selwrap{
    width: 100%;
    height: 986px;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
    z-index: 10;
}
@media screen and (max-width:1300px) {
  .selwrap{
    width: 1300px;
  }
}
.seleliwai{
    position: absolute;
    width: 500px;
    height: 520px;
    top: calc(50% - 260px);
    left: calc(50% - 250px);
    background-color: #eeeeee;
    border-radius: 20px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    -ms-border-radius: 20px;
    -o-border-radius: 20px;
    padding: 10px 15px;
    color: #666666;
    font-weight: bold;
    z-index: 9;
}
.borderexc{
  border: 2px dashed #999999;
  padding: 10px;
  margin: 10px;
}
.borderexc h2{
  font-size: 18px;
}
.checkstyle{
  width: auto;
  height: auto;
  vertical-align:middle;
  margin-left: 8px;
  margin-right: 3px;
}
.add,.cancle{
  display: inline-block;
  border: 1px solid #0e73e5;
  color: #0e73e5;
  background: #fff;
  border-radius: 5px;
  padding: 3px 10px;
  margin: 0 10px;
  cursor: pointer;
}
.cancle,.add:hover{
  color: #fff;
  background: #0e73e5;
}
.cancle:hover{
  background-color: #1080ff;
}
.activeli{
  background: skyblue;
}
.weekexc ul{
  margin: 10px ;
}
.weekexc li{
  margin-right: 10px;
}
.dateexc{
  position: relative;
  margin-top: 20px;
}
.showdate{
  display: inline-block;
  position: relative;
  width: 150px;
  height: 150px;
  left: 95px;
  top: 10px;
  border: 1px solid #999999;
  overflow: auto;
}
</style>