<template>
  <section class="login-wrap">
    <!--<system-information></system-information>-->
    <div id="test" class="form">
      <h2>欢迎使用小白打印</h2>

      <div class="screen" v-on:click="fun()">
        <h3 :class="{'isdisplay':this.input}">请输入打印码</h3>
        <h3>{{input}}</h3>
      </div>
      <button type="submit" class="submit" v-on:click="submit()">打印</button>
      <div class="status">{{status}}</div>
    </div>


    <div class="keyboard" :class="{'show':show}">
      <div class="key-area">
        <div class="key" v-for="(item,index) in keyList"
             :class="{
                    'transparent':(!item.value || item.value=='del' || item.value=='done'),
                    'del':item.value=='del',
                    'done':item.value=='done',
                    'b-1px-t':true,
                    'b-1px-r':(index+1)%3!=0
                }"
             @click="inputNumber(item.value)"
             v-html="item.value">
        </div>
      </div>
    </div>

  <canvas id="background"></canvas>
  </section>
</template>

<script>
  import {render} from './Utils/canvas'

  export default {
    name: 'landing-page',
      data(){
          return{
              input:'',
              status:'',
              show:false,
              keyList:[
                  {key:1,value:"1"},
                  {key:2,value:"2"},
                  {key:3,value:"3"},
                  {key:4,value:"4"},
                  {key:5,value:"5"},
                  {key:6,value:"6"},
                  {key:7,value:"7"},
                  {key:8,value:"8"},
                  {key:9,value:"9"},
                  {key:"done",value:"done"},
                  {key:0,value:"0"},
                  {key:"del",value:'del'}
              ]
          }
      },
    methods: {
          fun(){
              this.show=!this.show
          },
        changestatus(data){
              this.status=data
        },
        render:render,
        inputNumber(value){
            if(value!=='del'&&value!=='done'){
//                this.$emit("Input",value)
                this.input+=value;
                console.log(this.input)
            }else if(value==='del'){
                this.input=this.input.substr(0,this.input.length-1);
                console.log(this.input)
            }else if(value==='done'){
                this.show=false
            }
        },
        async submit(){
            this.status='正在处理...';
            try{
                let rst = await this.$http.get('http://api.print.geestack.com/api/fileApi/queryFileByCode?code='+this.input);
                if(rst.status===200){
                    this.status='正在下载...';
                    const {ipcRenderer} = require('electron');
                    ipcRenderer.send('download',rst.data.url);
                    ipcRenderer.once('download_reply', function (event, arg) {
                        console.log(arg);
                        ipcRenderer.send('print_event',arg);
                    });
                }else{
                    this.status='打印码错误，请重试！';
                }
            }
            catch (e){
                console.log(e);
                this.status='打印码错误，请重试！';
            }
            setTimeout(()=>{
                this.status='';
                this.input=''
            },1200);

        }
    },
      mounted(){
        this.render()
          console.log(__dirname)
      }
  }
</script>

<style>

  .isdisplay{display: none}
  .login-wrap {
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  #background {
    width: 100%;
    height:100%;
    position: absolute;
  }

  .form {
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: 16px 20px 0;
    width: 80%;
    height: 80%;
    font-size: 14px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 12px;
    box-shadow: 2px 2px 32px 1px rgba(0, 0, 0, .45);
    opacity: .5;

  }

  h2{
    font-size: 60px;
    text-align: center;
    /*padding: 90px 0;*/
    font-family: "微软雅黑";
  }

  h3 {
    /*margin-top: 0;*/
    /*margin-bottom: 0;*/
    padding: 50px 0;
    /*font-weight: bolder;*/
    font-size: 50px;
    text-align: center;
    font-family: "微软雅黑";
  }

  .screen{
    /*background-color: #4fc08d;*/
    border: dashed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 100px;
    height: 300px;
  }

  .keyboard{
    position: fixed;
    /*top: 0;*/
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    /*-webkit-transform: translateY(100%);*/
    transform: translateY(100%);
    z-index: 5000;
    width: 80%;
    height: 200px;
    background-color: #efeff4;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s,-webkit-transform .3s;
  }
  .keyboard.show{
    /*-webkit-transform: translate(0);*/
    transform: translateY(-90%);
  }
  .key-area{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .key{
    width:33.3333%;
    height:50px;
    line-height: 50px;
    background:#fff;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-size:22px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .key:active{
    background: #F8F8FF;
  }
  .key.transparent{
    background:transparent;
  }
  .key.del{
    background-image: url("../assets/del.png");
    background-size: 30px 30px;
    background-repeat: no-repeat;
    background-position: center center;
    text-indent:-99px;
  }
  .key.done{
    background-image: url("../assets/ok.png");
    background-size: 30px 30px;
    background-repeat: no-repeat;
    background-position: center center;
    text-indent:-110px;
  }
  .b-1px,
  .b-1px-t,
  .b-1px-b,
  .b-1px-tb,
  .b-1px-l,
  .b-1px-r {
    position: relative;
  }
  .b-1px:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 200%;
    height: 1px;
    border: 1px solid #C7C7C7;
    color: #C7C7C7;
    height: 200%;
    transform-origin: left top;
    transform: scale(0.5);
  }
  .b-1px-t:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #C7C7C7;
    color: #C7C7C7;
    transform-origin: 0 0;
    transform: scaleY(0.5);
  }
  .b-1px-b:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #C7C7C7;
    color: #C7C7C7;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }
  .b-1px-tb:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #C7C7C7;
    color: #C7C7C7;
    transform-origin: 0 0;
    transform: scaleY(0.5);
  }
  .b-1px-tb:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #C7C7C7;
    color: #C7C7C7;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }
  .b-1px-l:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    border-left: 1px solid #C7C7C7;
    color: #C7C7C7;
    transform-origin: 0 0;
    transform: scaleX(0.5);
  }
  .b-1px-r:after {
    content: " ";
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    border-right: 1px solid #C7C7C7;
    color: #C7C7C7;
    transform-origin: 100% 0;
    transform: scaleX(0.5);
  }

  .submit{
    background-color: #000;
    border: none;
    color: white;
    /*padding: 40px 100px;*/
    height: 100px;
    width: 200px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 25px;
    font-family: 微软雅黑;
    margin: 100px 44% 20px;
  }
  .submit:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
  }
  .status{
    font-size: 25px;
    font-family: 微软雅黑;
  }
</style>
