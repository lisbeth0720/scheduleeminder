import axios from 'axios'

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://192.168.1.145:8090/',
    //baseURL: 'http://www.satall.cn/',
    timeout: 5000
  })

  // 2.1.请求拦截
  instance.interceptors.request.use(config => {
    return config
  }, err => {
     console.log(err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    //console.log('执行了响应拦截')
    return res
  }, err => {
    console.log(err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}


//设置post请求方法
export function post(url,params){
  return request({
    method:'post',
    url,
    params,
    transformRequest:[   //转化要传入的为字符串
      function(data){
          let str = '';
          for(let key in data){
              str +='&'+encodeURIComponent(key)+
              '='
              + encodeURIComponent(data[key])
          }
          return str
      }
    ],
    headers:{
        "Content-Type":"application/x-www-form-urlencoded"
    }
  })
}

//导出一个方法自定义名称get
export function get(url,params){ 
  const instance = axios.create({
    baseURL:'',
    timeout:5000 //几秒
  })//创建实例
  return instance .get(url,   //返回 axios的get方法
      params
  )
}  



