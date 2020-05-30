<template>
  <div class="flex-justify">
    <div class="left_content">
      <el-form-item label="短信内容：">
        <div class="msg-info">
          <section class="edit-wrapper flex-column" :style="{marginLeft: 0}">
            <header class="edit-header flex-justify-between fz14">
              <div>
                插入标签：<el-button type="text" @click.prevent="insertToMsg('#店铺名称#')">#店铺名称#</el-button>
                <el-button type="text" v-for="item in tags" :key="item" @click.prevent="insertToMsg('#'+ item +'#')">#{{item}}#</el-button>
                <jd-shortUrl ref="jdShortUrl" v-if="isJdSign" @getShortUrl="getShortUrl"/>
                <span class="fc--red" v-if="isJdSign">请使用【插入短链】功能插入链接，否则可能导致发送任务提交失败</span>
              </div>
              <div>
                <Template v-if="tempType" :tempType="tempType" class="ml10" @use="handUseTemplate"><el-button type="text">插入内容模板</el-button></Template>
                <!-- <ShortLink class="ml10"><el-button type="text">插入短地址</el-button></ShortLink> -->
              </div>
            </header>
            <main class="edit-main">
              <el-input
                ref="msgTextArea"
                resize="none"
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 8}"
                :maxlength="maxLength"
                placeholder="请输入内容"
                @focus="checkMsgSelection"
                v-model="msg">
              </el-input>
              <!-- 物流短信没有回T退提示 -->
              <div class="footer-sign" v-if="!logistics">
                <el-button type="text">回T退</el-button>
              </div>
            </main>
            <footer class="edit-footer flex-justify-between">
              <el-button size="mini" type="text" @click="addTemplate"></el-button>
              <div class="flex-justify-between">
                <div class="p10 fz12" style="line-height:1">
                  已经输入 <span class="fc--orange">{{totalLetterNum}} / {{maxSmsCount}}</span> 个字，需 <span class="fc--orange">{{totalMessageNum}}</span> 条短信
                </div>
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    <p>1、70个字计1条短信计费，超出70字按照67字每条计费。</p>
                    <p>2、一个汉字、字母或标点都算作一个字。</p>
                    <p>3、带标签短信以实际发送为准，有可能超过默认字数。</p>
                    <!-- <p>4、受短信运营商限制，签名和退订回TD包含在字数中。</p> -->
                    <p>4、受短信运营商限制，签名和回T退包含在字数中。</p>
                  </div>
                  <el-button type="text" class="fz12">计费规则</el-button>
                </el-tooltip>
              </div>
            </footer>
          </section>
           <div v-if="isJdSign" class="jd_rules" :class="showNum ? 'pl_0' : ''">
             <span>温馨提示：</span>
              <ul>
                <li>1、短信内容需提交京东审核，请于每天18:00前提交短信发送任务，否则可能导致审核延期发送，大促另行通知</li>
                <li>2、短信内容不得包含：】{}ヾ▽ノ^√※→●★「」+ 等符号，禁止使用例如：低价、超低价、第一等广告法禁用的敏感词汇；</li>
                <li>3、短信发送时间为早9点至晚8点</li>
              </ul>
            </div>
        </div>
      </el-form-item>
      <el-form-item class="sms_tip">
        <div style="text-indent:80px;">
          <p>
            <label class="fc--red">友情提醒</label>：短信中若输入链接请一定记得链接前后打空格，否则链接可能无效
          </p>
          <!-- 物流短信增加点击输入 回T退 按钮 -->
          <p v-if="logistics">
            短信内容如含促销词，如微信、QQ、好评等，请务必在短信末尾添加<el-button size="small" type="primary" @click="addTD" class="ml_5 mr_5">回T退</el-button>，且退订内容后不支持录入字符。
          </p>

        </div>
      </el-form-item>
      <el-form-item label="短信签名：">
        <div class="flex-align-center">
          <el-radio-group size="small" v-model="sign" v-if="!isJdSign">
            <el-radio-button  v-for="(item,index) in signList" :key="index" :label="item.sign"></el-radio-button>
          </el-radio-group>
          <el-button v-else-if="sign" type="primary">{{sign}}</el-button>
          <FormSign class="m_l10" @updateSign="updateSign" v-if="!isJdSign"><el-button type="text" >其它签名</el-button></FormSign>
          <JdSign class="m_l10" @updateSign="updateSign" v-else><el-button type="text" >{{sign ? '编辑签名' : '新增签名'}}</el-button></JdSign>
          <!-- @updateSign="showSelfMarkName" -->
        </div>
      </el-form-item>
      <el-form-item label="测试短信：">
        <el-input class="test-phone" v-model="testPhone" placeholder="最多可输入10个手机号，以“，”隔开" size="mini"></el-input>
        <el-button class="ml10" type="text" @click="handleTestSend">发送测试短信</el-button>
      </el-form-item>
      <el-form-item label="发送时间：" v-if="showTime">
          <el-radio v-model="immediate" label="1">立即发送</el-radio>
          <el-radio v-model="immediate" label="2">定时发送</el-radio>
          <el-date-picker
            v-show="immediate === '2'"
            class="m_l20"
            size="small"
            v-model="sendTime"
            :editable="false"
            type="datetime"
            :clearable="false"
            :picker-options="pickerOptions"
            placeholder="选择日期时间"/>
          <!-- <div>营销短信发送时间为早8点到晚22点，超出时间会自动顺延至第二天发送</div> -->
          <div>
            共 <span class="fc--orange">{{memberNum}}</span>个会员，消耗短信 <span class="fc--orange">{{memberNum * totalMessageNum}}</span> 条
          </div>
      </el-form-item>
      <template v-if="!customBtn">
        <el-form-item label="">
          <el-tooltip v-if="!sign" content="请新增短信签名！" effect="dark"  placement="top-start">
            <el-button size="small" @click="sendFastSms" type="primary">确定</el-button>
          </el-tooltip>
          <el-button v-else size="small" type="primary" @click="sendFastSms">确定</el-button>
          <el-button  size="small" @click="$router.back()">取消</el-button>
        </el-form-item>
        <el-form-item v-if="phoneNum" label="">
          共 <span class="fc--orange">{{phoneNum}}</span> 个手机号码，消耗短信 <span class="fc--orange">{{phoneNum * totalMessageNum}}</span> 条
        </el-form-item>
      </template>
      <slot name="custom"/>
    </div>
    <div class="send-show">
      <p class="message-con">{{sms}}</p>
      <i class="message-con-arrow"></i>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      custom-class="check-balance"
      center append-to-body top="calc(50vh - 100px)">
      <div slot="title">
        <i class="el-icon-warning" style="color:#e6a23c;font-size:24px;"></i>
        <span>余额不足</span>
      </div>
      <div style="text-align: center">短信余额不足，请及时充值，否则会导致短信发送失败！</div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="currentEnough" size="mini" @click="dialogVisible = false;handleSendSms()">继续发送</el-button>
        <el-button size="mini" type="primary" @click="$router.push({name:'recharge'})">去充值</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  import Label from "components/label"
  import ShortLink from "./ShortLink"
  import FormSign from "./FormSign"
  import JdSign from "./jdSign"
  import Template from "./Template"
  import {formatDate,verifyPhone, getMessage,formatMsg} from "@/common/utils"
  import { mapState } from 'vuex'
  import http from 'src/api'
  import JdShortUrl from './JdShortUrl'
  import {point} from 'src/common/point.js'
  // const prop = err => {
  //   console.error(err)
  // }
  const now = new Date(formatDate("yyyy/MM/dd 00:00:00"));
  const handleForbid = (function(forbids) {
    return function(content) {
      for(const forbid of forbids){
        const words = forbid.split(',')
        if(words.every(word => ~content.indexOf(word))) {
          return forbid
        }
      }
    }
  })(['复制,打开,淘宝','复制,打开,领取','复制,打开,红包'])
  export default {
    props:{
      phoneNum: {
        type: [Number,String],
        default: 1
      },
      showNum: {
        type:Boolean,
        default:false
      },
      memberNum: {
        type: [Number,String],
        default: 1
      },
      proofLength:{
        type:Boolean,
        default:true
      },
      smsCotent:String, // 短信 sms
      customBtn:{
        type:Boolean,
        default:false
      },
      defaultTitle:{ // 有标题
        type:Boolean,
        default:true
      },
      labelType:{// 样式设置
        type:Object,
        default:() => {
          return {
            indented:0,
            size:6,
            type:'right'
          }
        }
      },
      // sendTime:[Number,String],
      isJdSign:Boolean,//是否使用京东签名
      showTime:{
        type:Boolean,
        default:false
      },
      tags:{//签名
        type:Array,
        default:[]
      },
      sendTime:[Number,String],
      logistics:{//是否是物流类型
        type:Boolean,
        default:false
      },
      tempType:{//模板类型
        type:[Number,String],
        default:''
      }
    },
    components:{ShortLink,Template,Label,FormSign,JdSign,JdShortUrl},
    data() {
      return {
        msg: '',
        testPhone: '',
        dialogVisible: false,
        currentEnough: false,
        sign: '',
        // footerSign:'退订回TD',
        footerSign:'回T退',
        immediate:'1',
        sendTime:'',
        signList:[],
        shortUrl:'',
        shortUrlReg:'',
        shortUrlIndex:'',
        pickerOptions:{
          disabledDate(time){
            return time < now
          }
        },
        maxSmsCount:this.isJdSign ? 329 :  210,//短信最大字数
        sending:false
      }
    },
    computed:{
      sms() {// 完整短信
        let td = ' '+ this.footerSign;
        let sms = ('【'+this.sign+'】'+this.msg.trim() + (this.logistics ? '' : td));
        return formatMsg(sms)
      },
      totalLetterNum() {// 字数
        if(this.isJdSign && this.sms.indexOf('#短链地址#') != -1) {
          return this.sms.length + (15 - '#短链地址#'.length);
        } else {
          return this.sms.length
        }
      },
      totalMessageNum() {// 条数
        let totalLetterNum = this.totalLetterNum
        return totalLetterNum <= 70 ? 1 : Math.ceil(totalLetterNum / 67)
      },
      maxLength() {
        let count = this.maxSmsCount - (this.sign.length + 8);
        this.msg = this.msg.slice(0, count);
        return count
      },
      ...mapState({
        user: state => state.user.user,
      })
    },
    created() {
      this.getSign(1);
    },
    // mounted() {
    //   if(this.isJdSign) {
    //     this.$refs.msgTextArea.$el.querySelector("textarea").onkeydown = this.checkMsgSelection;
    //   }
    // },
    watch:{
      msg(newVal,oldVal) {
        if(!this.isJdSign) return;
        if(newVal.search(/#短链地址#/) == -1) {
          this.shortUrl = '';
          this.$refs.jdShortUrl.removeShortUrl();
        }
        // if(newVal.length >= oldVal.length) return;
        // let shortUrlIndex = newVal.search(this.shortUrlReg);
        // if(shortUrlIndex == -1 && this.shortUrl) {//如果删除了当前短链
        //   let {msg,shortUrl,shortUrlIndex} = this;
        //   let $textarea = this.$refs.msgTextArea.$el.querySelector("textarea");
        //   this.shortUrl = '';
        //   this.msg = msg.slice(0,shortUrlIndex) + msg.slice(shortUrlIndex + shortUrl.length + 1);
        //   this.$refs.jdShortUrl.removeShortUrl();
        //   this.$nextTick(() => {
        //     $textarea.setSelectionRange(shortUrlIndex, shortUrlIndex)
        //   })
        // } else {
        //   this.shortUrlIndex = shortUrlIndex;
        // }
      }
    },
    methods: {
      getSign(status){//获取短信签名
        http({
          api_name:this.isJdSign ? 'jdMarketing_getSigns' : 'marketingGetSignList',
          data:{
            status
          }
        },({data:{list,sign}}) => {
          if(this.isJdSign) {
            sign = sign.replace(/[【|】]/g,'');
            sign && (this.sign = sign);
          } else {
            this.signList = list;
            list.length && (this.sign = list[0].sign);
          }
        })
      },
      updateSign(){
        this.getSign(1);
      },
      initMessage(smsContent){
        //物流短信不截取 回T退
        let {sign,msg} = getMessage(smsContent,this.logistics);
        this.msg = msg;
        //自动短信 默认设置的短信内容是没有签名的 默认取签名列表的第一个签名
        this.sign = sign || (this.signList[0] ? this.signList[0].sign : '');
      },
      initSendTime(sendTime) {
        this.immediate = '2';
        this.sendTime = formatDate("yyyy-MM-dd HH:mm:ss",sendTime);
      },
      /**
       * 插入变量名至短信内容
       * */
      insertToMsg(value) {
        let $textarea = this.$refs.msgTextArea.$el.querySelector("textarea");
        let {
          selectionStart = 0,
          selectionEnd = 0
        } = $textarea;
        let text = this.msg;
        this.msg = text.substring(selectionStart, -1) + value + text.substring(selectionEnd);
      },

      /**
       * 发起验证
       * @return {Promise}
       */
      proof(){
        return this.proofMsg()
        // .then(() => {
        //   return this.proofTime()
        // })
        .then(() => {
          return this.proofLink()
        }).catch(message => {
          message && this.$message({type:"warning",message:'短信内容包含违禁词：'+message})
          return Promise.reject(message)
        })
      },

      // 发送按钮
      sendFastSms() {
        if(this.sending) return;
        let {sms:msgContent} = this;
        this.sending = true;
        if(!this.sign) {
          this.$message.error('请新增短信签名！');
          return;
        }
        // *** 验证的信息请添加到 proof 方法
        this.proof().then(() => {
          if(!this.phoneNum > 0){
            this.$message({type:"warning",message:"当前无有效手机手机号！"});
            this.sending = false;
          }else {
            this.handleSendSms()
          }
        }).catch(err => {
          this.sending = false;
          console.error(err)
        })

      },
      getSmsContent() {
        this.$emit("send",{msg:this.sms,sign:this.sign});
      },
      handleSendSms() {
        // let {isNowSend,date,time,sms} = this;
        // let sendTime = isNowSend == 1 ? "" : date + " " + time;
        let {sendTime,sms,immediate,shortUrl,sign} = this;
        sendTime = immediate == 2 ? formatDate("yyyy-MM-dd HH:mm:ss",sendTime) : '';
        const h = this.$createElement;;
        this.$msgbox({
          title:'确认提交',
          message:
            h('div',null,[
              h('p',null,[
                h('span',null,'本次共发送'),
                h('label',{style:'color:red'},`${(!this.showNum && this.isJdSign) ? this.memberNum : this.phoneNum}`),
                h('span',null, (!this.showNum && this.isJdSign)  ? '个会员，预计消耗' : '个号码，预计消耗'),
                h('label',{style:'color:red'},`${((!this.showNum && this.isJdSign) ? this.memberNum : this.phoneNum) * this.totalMessageNum}`),
                h('span',null,'条短信')
              ]),
              h('p',null,'短信将在审核后发送，审核过程需要3~5分钟')
            ]),
        })
        .then(() => {
            //目前仅京东短信支持短链
            this.$emit("send",{msg:sms,sendTime,sign,shortUrl}) // 响应组件自定义 send 事件
            this.sending = false;
        },() => {
            this.sending = false;
        })
      },
      addTD() {
        point('37977.40528.40531.40533');
        this.insertToMsg(' 回T退');
      },
      // 测试发送
      handleTestSend() {
        let {isNowSend,date,time,sms,sign,shortUrl} = this,
          testPhone = this.testPhone.trim(),
          finalPhones = [],
          filterPhones = []

        let phones = testPhone.replace(/，/g,",").split(",")
        filterPhones = phones.filter(item => {
          let phone = item.trim(),valid = verifyPhone(phone)
          if(!valid && phone){
            finalPhones.push(phone)
          }
          return valid
        }).join(",")
        console.log(sign);
        if(!sign) {
          return this.$message({type:"warning",message:"当前没有有效签名！"})
        }
        if(finalPhones.length){
          const h = this.$createElement;
          return this.$msgbox({
              title:'存在错误号码',
              message:
              h('ul',null,
                finalPhones.map(item => {
                  return h('li',null,item);
                })
              ),})
        }else if(!filterPhones || !testPhone){
          return this.$message({type:"warning",message:"请输入有效的手机号码"})
        }
        this.proof().then(() => { // 发起短信验证
          this.$confirm('确认发送测试短信？','温馨提示').then(() => {
            this.$emit("testSend",{msg:sms,phoneNumberStr:filterPhones,sign,shortUrl})
          }).catch(() => {})
          // let sendTime = isNowSend == 1 ? "" : date + " " + time
          // this.$api.sendFastSmsTels({param:{sendTime,msg:sms.replace(/#姓名#/g, "(****(姓名))"),tels:filterPhones}},() => {
          //   this.$message({type:"success",message:"发送成功"})
          //   this.testPhone = ""
          // })
        }).catch(err => {
          this.sending = false;
          console.error(err)
        })
      },
      //展示我的签名
      // showSelfMarkName(){
      //   this.$api.showSelfMarkName({}, res => {
      //     let {passedSelfMarkNameList,recommendMark} = res,signList = []
      //     passedSelfMarkNameList && passedSelfMarkNameList.forEach(item => {
      //       signList.push(item.signature)
      //     })

      //     if(!signList.length) {
      //       for(let key in recommendMark){
      //         if(recommendMark.hasOwnProperty(key)){
      //           recommendMark[key] && signList.push(key)
      //         }
      //       }
      //     }

      //     this.signList = signList
      //     if(!this.sign || !~signList.indexOf(this.sign)){
      //       this.sign = signList[0];
      //     }
      //   }, err => {
      //     console.log("err",err)
      //   },false)
      // },

      // 验证时间提示
      proofTime() {
        let {isNowSend,date,time} = this
        let sendTime = isNowSend == 1 ? "" : date + " " + time
        return new Promise((resolve,reject) => {
          if(!sendTime){
            return resolve()
          }
          if(new Date(sendTime) - 1 < new Date()){
            reject("定时发送时间不能早于当前时间！")
          }else if(new Date(sendTime) > new Date(+new Date() + 30*24*3600000)){
            return this.$confirm("您设置的时间和当前时间相隔超过30天，是否继续发送？",'消息',{
              title: '消息',
              message:"您设置的时间和当前时间相隔超过30天，是否继续发送？",
              confirmButtonText: '继续发送',
              cancelButtonText: '取消',
            }).then(resolve).catch(() => {
              reject()
            })
          }else {
            resolve()
          }
        })
      },

      //验证短信
      proofMsg() {
        let {sms,proofLength,msg} = this
        let len = sms.length
        return new Promise((resolve,reject) => {
          let forbid
          if(!msg.trim()){
            reject("短信内容不能为空！")
          }
          else if(forbid = handleForbid(msg)) {
            reject('短信内容中，不能同时出现'+forbid+'，请在任意一个词中间加空格隔开后再提交，例如“复制”改为“复 制”')
          }
          else {
            http({
              api_name:'marketingValidSms',
              data:{
                msg:formatMsg(msg)
              }
            },({data:{errorMsg}}) => {
              if(!errorMsg) {
                resolve();
              } else {
                reject(errorMsg);
              }
            }, err => {
              this.$message.error(err.message);
            })
          }
          // else if(proofLength && len > 70){
          //   return this.$msgbox({
          //     title:'温馨提示',
          //     message:h('div',null,`您的信息内容目前是<span style="color:red">${len}</span>个字,将扣除<span style="color:red">${Math.ceil(len/67)}</span>条短信,确定继续发送吗？`)
          //   }).then(resolve).catch(() => {

          //   })
          //   return this.$confirm(``,'友情提示',{
          //     dangerouslyUseHTMLString:true,
          //     type: 'warning'
          //   }).then(resolve).catch(() => {
          //     this.$message({
          //       type: 'info',
          //       message: '已取消发送'
          //     });
          //     reject()
          //   })
          // }
        })
      },

      // 验证短链空格
      proofLink() {
        let msg = this.msg
        let link = ['tb1.cn','xlqylove.taobao.com','dwz.cn','c.tb.cn']
        return new Promise((resolve,reject) => {
          let isNotEmpty = link.some(item => {
            let pattern = new RegExp(item,'g'),res
            while (res = pattern.exec(msg))  {
              let index = res.index
              if (index > 0 && msg.charAt(index-1) != " "){
                return true
              }
            }
          })
          if(isNotEmpty) {
            return this.$confirm("短信内容中带链接地址，请在链接地址前后加上空格，否则无法直接点击链接跳转到链接页面。",'消息',{
              confirmButtonText: '继续发送',
              cancelButtonText: '取消',
            }).then(resolve).catch(() => {
              reject()
            })
          }else {
            resolve()
          }
        })

      },

      // 添加自定义模板
      addTemplate() {
        this.proofMsg().then(() => {
          let content = this.msg.trim()
          this.$api.addTemplate({param:{content}},() => {
            this.$message({type:"success",message:"保存成功！"})
          })
        }).catch(message => {
          message && this.$message({type:"warning",message})
        })
      },

      handUseTemplate(template) {
        this.msg = template
      },
      setShortUrl(shortUrl) {//设置京东短链
        this.shortUrl = shortUrl;
        this.$refs.jdShortUrl.insertShortUrl(shortUrl);
      },
      getShortUrl(shortUrl) {//京东短连
        this.shortUrl = shortUrl;
        // this.shortUrlReg = new RegExp('\\s'+ shortUrl.replace(/\//g,'\\/') +'\\s');
        this.insertToMsg('#短链地址#');
        // this.shortUrlIndex = this.msg.search(this.shortUrlReg);
      },
      checkMsgSelection(e) {//不允许修改短链部分
        if(!this.shortUrl) return;
        let target = e.target;
        let {
          selectionStart = 0,
          selectionEnd = 0
        } = target;
        let {shortUrlIndex,shortUrl,msg} = this;
        if((selectionStart >= shortUrlIndex ) && (selectionStart <= shortUrlIndex + shortUrl.length + 1)) {
          target.setSelectionRange(msg.length, msg.length)
        }
      }
    }
  }
</script>
<style lang="less">
  textarea.el-textarea__inner {
    outline: none;
    -webkit-appearance: none;
    /* border:none; */
    border-radius:0;
    padding:5px 9px;
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #fff inset
  }
  .sms_tip {
    .el-form-item__content {
        margin-left: 0px !important;
      }
   }

</style>
<style scoped lang="less" rel="stylesheet/less">
  @border:1px solid #e4e4e4;
  .left_content{
    width:1280px;
  }
  .send-show{
    width:390px;
    height:470px;
    background:url("../../assets/img/phone-tmp.png") top center no-repeat;
    .message-con{
      max-height: 180px;
      padding: 10px;
      color: #333;
      white-space: normal;
      word-wrap: break-word;
      word-break: break-all;
      font-size: 12px;
      line-height:21px;
      font-family: microsoft yahei;
      background: #fff;
      overflow-y: auto;
      width:186px;
      margin:0 auto;
      margin-top:60px;
      border-radius:5px;
    }
    .message-con-arrow{
      position:relative;
      display: block;
      width:186px;
      height:0px;
      margin:0 auto;
      &:after{
        content:'';
        display: block;
        width: 0;
        height: 0;
        border-right: 10px solid transparent;
        border-left: 10px solid transparent;
        border-top: 15px solid #fff;
        transform: skew(-43deg,0deg);
      }
    }
  }
  .jd_rules {
    padding-left:80px;
    font-size:12px;
    overflow: hidden;
    margin-top:10px;
    line-height:16px;
    span {
      float:left;
    }
    ul {
      float:left;
      color:#999;
    }
  }
  .pl_0{
    padding-left: 0;
  }
  .sms-title{
    padding-top:10px;
    color: #666;
    letter-spacing: 0;
    line-height: 16px;
    font-size:14px;
    display: inline-block;
    min-width:6em;
    text-align: right;
  }
  .msg-info{
    padding-right:14px;
    flex-grow:1;
  }

  .edit-wrapper{
    min-height:260px;
    border: @border;
  }

  .edit-main{
    flex-grow:1;
    position:relative;
  }
  .edit-header{
    height: 44px;
    padding:0 10px;
    background: #fafafa;
    border-bottom: @border;
  }
  .edit-footer{
    height: 44px;
    padding:0 10px;
    border-top: @border;
    background: #fafafa;
  }


  .test-phone{
    width:320px;
  }

  .footer-sign{
    position:absolute;
    right: 10px;
    bottom: 0;
  }

  .el-form-item { margin-bottom: 12px; }
</style>
