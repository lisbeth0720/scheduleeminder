<template>
  <div id="back">
    <div class="main">
      <div>
        <h1><span style="color:red;">{{count}}</span>秒后跳转到登录页面</h1>
        <div @click="jump()" class="j_btn">立即跳转</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data() {
      return {
        count:30,
      }
    },
    methods:{
      jump(){
        let url = window.location.href
        if(url.indexOf('192.168') != -1 || url.indexOf('localhost') != -1){
          window.location.href = 'http://' + url.split('://')[1].split('/')[0] + '/Login.aspx'
        }else{
          window.location.href="http://www.satall.cn"
        }
      }
    },
    mounted(){
      let timer = setInterval(() => {
        this.count--
        if(this.count == 0){
          clearInterval(timer)
          let url = window.location.href
          if(url.indexOf('192.168') != -1 || url.indexOf('localhost') != -1){
            window.location.href = 'http://' + url.split('://')[1].split('/')[0] + '/Login.aspx'
          }else{
            window.location.href="http://www.satall.cn"
          }
        }
      }, 1000);
    }
  }
</script>

<style scoped>
  #back{
    width: 100%;
    height: 986px;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
    z-index: 10;
  }
  .main{
    position: absolute;
    display: flex;
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
    text-align: center;
    justify-content: center;
    align-items: center;
    font-size: 25px;
  }
  .j_btn{
    width: 120px;
    height: 30px;
    border: 2px solid #0e73e5;
    line-height: 30px;
    margin: 100px auto 0;
    color: #0e73e5;
    border-radius: 10px;
    background-color: #fff;
    font-size: 24px;
    cursor: pointer;
  }
</style>

