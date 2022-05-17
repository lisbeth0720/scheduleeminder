<template>
  <div class="shield">
    <div class="alertFram">
      <div style="background:#0e73e5;text-align:left;padding-left:20px;font-size:16px;font-weight:bold;height:40px;line-height:40px;color:#fff;">[提示信息]</div>
      <div style="background:#fff;font-size:16px;height:120px;line-height:120px;color:#666666;font-weight:bold;">确定删除吗？</div>
      <div style="display:flex;justify-content: space-evenly;"><div @click="doOk" class="doOk">确 定</div><div class="doOk doCancle" @click="doCancle">取 消</div></div>
    </div>
  </div>
</template>

<script>
  import {post} from '../network/request'

  export default{
    props:{
      mid: String,
      id:{
        type: String,
        default: '0'
      }
    },
    methods:{
      doOk(){
        if(this.id != '0'){
          post('company/program/ajax/ScheduleManageAPI.ashx?Type=del',{
            dType: '2',
            iid: this.mid,
            id: this.id
          }).then(res=>{
            console.log(res.data.message)
            this.$parent.getData()
            this.$parent.current--
            if(this.$parent.current != -1){
              this.$parent.id = this.$parent.typeArr[this.$parent.current].id
            }
          })
          this.$parent.isD = false
        }else{
          this.$parent.isAdd = true
          this.$parent.sche_num = 0
          this.$parent.sche_list[0].h_img = '添加0'
          post('company/program/ajax/ScheduleManageAPI.ashx?Type=del',{
            dType: '1',
            iid: this.mid,
            id: ''
          }).then(res =>{
            console.log(res.data.message)
            this.$parent.getData()
            this.$parent.isD = false
          }) 
        }
      },
      doCancle(){
        this.$parent.isD = false
      }
    }
  }
</script>

<style scope>
  .shield{
  position:absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 986px;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  z-index: 9;
  }
  @media screen and (max-width:1300px) {
    .shield{
      width: 1300px;
    }
  }
  .alertFram{
  position:absolute;
  left: calc(50% - 225px);
  top: calc(50% - 100px);
  width: 450px;
  height: 200px;
  text-align: center;
  line-height: 200px;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, .2);
  }
  .doOk{
    background:#0e73e5;
    text-align:center;
    font-weight:bold;
    width:100px;
    height:30px;
    line-height:30px;
    cursor:pointer;
    color:#fff;
    border:1px solid #0e73e5;
    border-radius:5px;
  }
  .doCancle{
    background-color: white !important;
    color: #0e73e5 !important;
  }

</style>
