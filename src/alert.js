window.alert = alert
//重写alert方法
export function alert(str) {
  var shield = document.createElement("DIV");
  var alertFram = document.createElement("DIV");
  shield.id = "shield";
  shield.style.position = "absolute";
  shield.style.left = "0px";
  shield.style.top = "0px";
  if(window.screen.width > 1300){
    shield.style.width = "100%";
    alertFram.style.left = "50%";
  }else{
    shield.style.width = '1300px'
    alertFram.style.left = '650px'
  }
  shield.style.height = "986px";
  //弹出对话框时的背景颜色
  shield.style.background = "rgba(0,0,0,0)";
  shield.style.textAlign = "center";
  shield.style.zIndex = "25";
  //背景透明 IE有效
  shield.style.filter = "alpha(opacity=0)";
  alertFram.id="alertFram";
  alertFram.style.position = "absolute";
  alertFram.style.top = "393px";
  alertFram.style.marginLeft = "-225px";
  alertFram.style.width = "450px";
  alertFram.style.height = "200px";
  alertFram.style.textAlign = "center";
  alertFram.style.lineHeight = "200px";
  alertFram.style.zIndex = "300";
  alertFram.style.borderRadius = '10px'
  alertFram.style.overflow = 'hidden'
  alertFram.style.backgroundColor = '#fff'
  alertFram.style.boxShadow = '0 0 5px 1px rgba(0,0,0,.2)'
  var strHtml = " <div style=\"background:#0e73e5;text-align:left;padding-left:20px;font-size:16px;font-weight:bold;height:40px;line-height:40px;color:#fff;\">[提示信息]</div>\n";
  strHtml += " <div style=\"background:#fff;text-align:center;font-size:16px;height:120px;line-height:120px;font-weight:bold;\">"+str+"</div>\n";
  strHtml += " <div style=\"background:#0e73e5;text-align:center;font-weight:bold;width:100px;height:30px;line-height:30px;cursor:pointer;color:#fff;margin:0 auto;border:1px solid #0e73e5;border-radius:5px;\"><div id='doOk'>确 定</div></div>\n";
  alertFram.innerHTML = strHtml;
  document.body.appendChild(alertFram);
  document.body.appendChild(shield);
  var doOk = document.getElementById('doOk')
  doOk.onclick = function(){
    document.body.removeChild(shield)
    document.body.removeChild(alertFram)
    clearInterval(st); 
  }
  var st = ''
  fadeOut(alertFram)
  shield.onclick = function(){
    console.log('点击了屏障')
  }
  document.body.onselectstart = function(){return false;};
  //渐隐方法
  function fadeOut(element){
    if(element.style.opacity != '0'){
      var num = 200; 
      st = setInterval(function(){
        num--;
        element.style.opacity = num / 200 ;
        if(num<=0)  {  
          clearInterval(st);  
          document.body.removeChild(shield)
          document.body.removeChild(alertFram)
        }
      },10);
    }
  }
}



