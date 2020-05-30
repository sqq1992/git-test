<template>
  <el-form v-loading="loading" class="marketing-marketing-member-page" label-position="right" label-width="6em">
    <Header type="mobile" :activityData="activityData" @setData="setData"/>
    <el-form-item label="目标号码：">
      <div>
        <el-upload
          ref="upload"
          action="/marketing/getMobileByTemplate"
          accept=".xlsx,.xls"
          :show-file-list="false"
          :before-upload="onBefore"
          :on-success="onSuccess"
         >
          <el-button size="small" type="text" slot="trigger">批量导入</el-button>
          <span slot="tip" class="el-upload__tip">（支持xls、xlsx格式文件）
            <el-button type="text" size="small" @click="downloadTemp">下载导入模板</el-button>
          </span>
        </el-upload>
        <div class="mobile-num-wrapper">
          <el-input
            type="textarea"
            :disabled="(mobileCount > 10000 || disabled)"
            placeholder="一次性可最多输入10000个会员账号，每行一个，系统会自动过滤重复会员账号"
            v-model="mobiles"
            :autosize="{ minRows: 8, maxRows: 8}"
            resize="none"
          ></el-input>
          <div class="mobile-num">
            当前已输入<span class="fc--orange p5">{{mobileCount.toLocaleString()}}</span>个手机号
          </div>
        </div>
      </div>
    </el-form-item>
    <Sms @send="saveActivity" @testSend="testSend"  :phoneNum="mobileCount" :isJdSign="true" :showNum="true" ref="sms"/>
  </el-form>
</template>

<script>
  import Sms from 'components/sms'
  import Header from '../common/header.vue'
  import {splitPhone} from 'src/common/utils'
  import http from 'src/api'
  import {point} from 'src/common/point.js'
  export default {
    components: {
      Sms,Header
    },
    data() {
      return {
        mobiles: '',
        fileList:[],
        activityData:{},
        activityName:'',
        sendTime:'',
        loading:false,
        disabled: false
      }
    },
    created() {
      point('37977.39401.39426');
      if(this.$route.query.id) {
        this.getDetailById(this.$route.query.id);
      }
    },
    computed: {
      mobileCount:function() {
        return splitPhone(this.mobiles).filterPhones.length
      }
    },
    watch: {
      targetMember:function(val,oldVal) {
        console.log(val)
      }
    },
    methods: {
      getDetailById(id) {
        this.loading = true;
        http({
          api_name:'mobileGetDetail',
          data:{activityId:id}
        },({data}) => {
          // const {activityName, sendTime, phoneNumberStr} = data;
          // let { extra } = data.activity;
          // this.activityData = {activityName,sendTime};
          // this.mobiles = phoneNumberStr;
          // if(extra) {
          //   extra = JSON.parse(extra);
          //   this.$refs.sms.setShortUrl(extra.originShortUrl)
          // }

          const {mobiles} = data
          this.mobiles = mobiles;
          let extra = this.$route.query.extra;
          let sendTime = this.$route.query.sendTime;
          let activityName = this.$route.query.name;
          this.activityData = {activityName,sendTime};
          if(extra) {
            extra = JSON.parse(extra);
            this.$refs.sms.setShortUrl(extra.originShortUrl)
            this.$refs.sms.initMessage(extra.originSmsContent);
          }
          this.loading = false;
        },(error) => {
          this.loading = false;
          // this.$message.error(error.message);
        })
      },

      validationMsg(msg,sign) {
        msg = msg.replace('【'+ sign +'】','')
        return new Promise((resolve) => {
          if(/https?/.test(msg)) {
            throw '短信中不允许存在http或https，请修改短信内容后再提交！';
          }else if(msg.match(/#短链地址#/g) && msg.match(/#短链地址#/g).length > 1) {
            throw '短信中只能插入一条短链地址！';
          }else if(/[+【】{}<>ヾ▽ノ^√※→●★「」~]|(低价)|(超低价)|(第一)/.test(msg)) {
            throw('短信内容不得包含：】{}ヾ▽ノ^√※→●★「」~ + <>等符号，禁止使用例如：低价、超低价、第一等广告法禁用的敏感词汇！')
          } else {
            resolve();
          }
        })
      },
      // 删除添加的文件
      handleRemove() {
        this.fileList = []
      },

      // 浏览文件按钮
      handleChange(file,fileList) {
        if(file.status == "ready"){
          if(this.beforeAvatarUpload(file)) {
            this.fileList = [file]
          }else {
            this.fileList = []
          }
        }
      },
      // 文件验证
      beforeAvatarUpload(file) {
        let type = file.name.substr(file.name.lastIndexOf(".")+1).toLowerCase()
        const size = file.size / 1024 / 1024
        const isLt2M = size < LIMIT
        if (!TYPE.includes(type)) {
          this.$message.error(`只支持${TYPE.join('、')}格式文件！`)
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 ' + LIMIT + 'MB!')
        }
        return isLt2M
      },
      onBefore(){
        this.loading = true;
      },
      onSuccess(response, file, fileList) {
        this.loading = false;
        if(response.result != 100){
          this.$message.error(response.message);
        }else {
          let {phoneNumberStr} = response.data,
              phoneNumberCount = phoneNumberStr.split(',').length;
          this.mobiles = phoneNumberStr;
          this.$alert("已成功导入"+ phoneNumberCount +"条记录")
          if (parseInt(phoneNumberCount) > parseInt(500)) {
            this.disabled = true
          } else {
            this.disabled = false
          }
        }
      },

      downloadTemp() {
        window.open('/marketing/downloadMobileTemplate');
      },
      setData({activityName,sendTime}) {
        this.activityName = activityName;
        this.sendTime = sendTime
      },
      saveActivity({msg,sendTime,sign,shortUrl}) {//保存会员营销
        if(!this.activityName){
          this.$message({type:"warning",message:"请输入活动名称！"})
          return;
        }
        if(this.sendTime && (new Date() > new Date(this.sendTime))) {
          this.$message({type:"warning",message:"发送时间小于当前时间！"})
          return;
        }

        let mobilesArr = this.mobiles.includes(',') ? this.mobiles.split(',') : this.mobiles.split('\n');
        if (mobilesArr.length < 10) {
          this.$message.error('目标号码至少10个!')
          return
        }
        this.validationMsg(msg,sign).then(() => {
          if (msg.search(/#短链地址#/) != -1 && !shortUrl) {
            throw('检测到短信内容中使用了短链地址，但是未插入短链地址，请重新检查！')
          }
          let data = {
            name:this.activityName,
            type:2,
            sendTime: this.sendTime,
            smsContent:msg,
            shortUrl: shortUrl,
            mobiles:this.mobiles.replace(/\n/g,',')
          }
          this.sendSms(data);
        }).catch(err => {
          this.$message({type:"warning",message:err})
        })
      },
    testSend({msg,phoneNumberStr,sign,shortUrl}) {
      this.validationMsg(msg,sign).then(() => {
        if(this.lastTestMsg == msg) {
          throw('测试短信不能每次发相同内容！')
        } else if (this.lastTestTime && ((new Date().getTime() - new Date(this.lastTestTime).getTime()) <= 30000)) {
          throw('测试短信两次发送间隔至少30秒')
        } else if (msg.search(/#短链地址#/) != -1 && !shortUrl) {
          throw('检测到短信内容中使用了短链地址，但是未插入短链地址，请重新检查！')
        }
        this.loading = true;
        http({
          api_name:'jdMarketing_test',
          data: {
            receivePhone:phoneNumberStr,
            smsContent:msg,
            shortUrl
          }
        },res => {
          this.lastTestTime = new Date();
          this.lastTestMsg = msg;
          this.loading = false;
          this.$message({
            type:'success',
            message:'测试发送成功！',
          })
        },error => {
          this.loading = false;
          this.$message({
            type:'error',
            message:error.message
          })
        })
        // let data = {
        //   smsContent:msg,
        //   sendTime: this.sendTime,
        //   type: 2,
        //   shortUrl: shortUrl,
        //   mobiles: phoneNumberStr,
        // }
        // this.sendSms(data,true);
      }).catch(err => {
        this.$message({type:"warning",message:err})
      })
    },
    sendSms(data,isTest) {
      this.loading = true;
      // 接口更换
      http({
        api_name: 'mobileCreate',
        data
      }, (res) => {
        this.loading = false;
        if(!isTest) {
          this.$router.push({name:'marketing'});
        } else {
          this.$message.success('发送成功！')
        }
      }, (error) => {
        this.loading = false;
        this.$message.error(error.message)
      })
    }
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
  .marketing-marketing-member-page {
    padding:16px 20px;

    .mobile-num-wrapper {
      width: 500px;
      position: relative;
    }
    .mobile-num {
      position: absolute;

      width: 100%;
      left: calc(~'100% + 16px');
      bottom: 0;
    }
  }

  .el-form-item { margin-bottom: 12px; }

</style>

