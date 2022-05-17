import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id:'',
    spchtxtarr:'',
    cmd:'',
    jumparr:'',
    beeparr:'',
    obj:{},
    token:'',
    table:[],
  },
  mutations: {
    setId(state,val){
      state.id = val
    },
    setspchtxtarr(state,val){
      state.spchtxtarr = val
    },
    setcmd(state,val){
      state.cmd = val
    },
    setjumparr(state,val){
      state.jumparr = val
    },
    setbeeparr(state,val){
      state.beeparr = val
    },
    setobj(state,val){
      state.obj = val
    },
    settoken(state,val){
      state.token = val
    },
    settable(state,val){
      state.table = val
    },
  },
  actions: {
  },
  modules: {
  }
})
