<template>
  <div class="memberZY" v-loading="loading">
    <!-- <el-steps space="45%" :active="step" :center="true" :align-center="true" >
      <el-step title="会员筛选" description=""></el-step>
      <el-step title="编辑短信内容" description=""></el-step>
      <el-step title="批量发送" description=""></el-step>
    </el-steps> -->
    <ul class="step_ul">
      <li :class="{active: step == 1}">会员筛选</li>
      <li :class="{active: step == 2}">编辑短信内容</li>
      <li>批量发送</li>
    </ul>
    <div class="content">
      <filter-member
        v-if="initMap.filterMember"
        v-show="step == 1"
        :campaign-data="campaignData"
        :conditions="jsonConditions"
        :other-campaign-data="otherCampaignData"
        ref="filter"
        @next="getNext"
        @close="goBack">
      </filter-member>
      <el-form v-show="step == 2">
      <!-- <el-form> -->
        <Sms ref="sms"
          @send="saveActivity"
          @testSend="testSend"
          :memberNum="allCount"
          :isJdSign="true"
          :customBtn="true"
          :showTime="true"
        />
        <div class="btn_box">
          <el-button type="normal" @click="() => {this.step = 1}">返回会员筛选发送</el-button>
          <el-button type="primary" @click="createAct">确认批量发送</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import http from 'src/api';
import FilterMember from 'components/jdMarketing/FilterMember';
import Sms from 'components/sms';
import {formatDate} from "@/common/utils"
import { formatConditions } from "components/jdMarketing/filterMemberUtil"
import {point} from 'src/common/point.js'
export default {
  name:'memberZY',
  components:{
    'filter-member': FilterMember,
    Sms
  },
  data() {
    return {
      loading: false,
      name: '',
      step: 1,
      allCount: 0,
      conditions: {},
      jsonConditions: '',
      immediate: '1',
      campaignData: {},
      lastTestTime: '',//测试短信两次发送间隔至少30秒
      lastTestMsg: '',//上一次测试短信内容  京东限制 两次测试短信内容不能相同
      // 会员筛选-基本信息表单、人群过滤表单
      otherCampaignData: {},
      // 是否初始化
      initMap: {
        filterMember: false
      }
    };
  },
  created() {
    point('37977.39401.39425');
    if(this.$route.query.id) {
      this.getDetailById(this.$route.query.id);
    } else {
      this.initMap.filterMember = true;
    }
  },
  methods:{
    getDetailById(id) {
       this.loading = true;
        http({
          api_name:'jdMarketing_detail',
          data:{id}
        },({data}) => {
          this.loading = false;
          let { name , sendTime, content, conditions, extra } = data.activity;
          this.otherCampaignData = this.formatOtherCampaignData(data.activity);
          this.campaignData = formatConditions(conditions);
          this.jsonConditions = conditions;
          if(extra) {
            extra = JSON.parse(extra);
            console.log(extra);
            content = extra.originSmsContent;
            this.$refs.sms.setShortUrl(extra.originShortUrl)
          }
          this.$refs.sms.initMessage(content);
          if(sendTime)  this.$refs.sms.initSendTime(sendTime);
          this.initMap.filterMember = true;
        },(error) => {
          this.loading = false;
          error && this.$message.error(error.message || '请求失败!');
          this.initMap.filterMember = true;
        })
    },
    // 更新会员筛选基本信息表单和人群过滤表单的初始值
    formatOtherCampaignData(data = {}) {
      const {
        // 不发送黑名单(过滤黑名单)
        filterBlacklist = 1,
        // 不发送最近x天发送过短信的会员(input)
        filterSendDays = '',
        // 活动名称
        name = ''
      } = data;
      return {
        filterBlacklist,
        filterSendDays,
        name
      };
    },
    getNext() {
      let campaignData =  this.$refs.filter.getData();
      let {conditions,filterBlacklist,filterSendDays,name,sendNum} = campaignData;
      this.name = name;
      this.conditions = conditions;
      this.otherCampaignData = {
        filterBlacklist,
        filterSendDays
      }
      this.allCount = sendNum;
      this.step = 2;
    },
    goBack() {
      this.$router.push({path:'marketing'})
    },
    createAct() {
      this.$refs.sms.sendFastSms();
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
    saveActivity({msg,sendTime,sign,shortUrl}) {//保存会员营销
      const {conditions, allCount, name} = this;
      const {filterBlacklist, filterSendDays} = this.otherCampaignData;

      this.validationMsg(msg,sign).then(() => {
        let {conditions:_conditions} = this.$refs.filter.getData();
        if(JSON.stringify(_conditions) !== JSON.stringify(conditions)) {
          throw '筛选条件已变更，请重新查询！';
        } else if (msg.search(/#短链地址#/) != -1 && !shortUrl) {
          throw('检测到短信内容中使用了短链地址，但是未插入短链地址，请重新检查！')
        }
        this.loading = true;
        http({
          api_name:'jdMarketing_create',
          data: {
            name,
            conditions:JSON.stringify(conditions),
            filterBlacklist,
            filterSendDays,
            smsContent:msg,
            sendNum:allCount,
            sendTime,
            shortUrl
          }
        },res => {
          this.loading = false;
          this.$message({
            type:'success',
            message:'营销方案创建成功！'
          })
          this.$router.push({name:'marketing'});
        },error => {
          this.loading = false;
          this.$message({
            type:'error',
            message:error.message
          })
        })
      }).catch(err => {
          this.$message({type:"warning",message:err})
      })
      // let {conditions:_conditions} = this.$refs.filter.getData();
      // if(JSON.stringify(_conditions) !== JSON.stringify(conditions)) {
      //   this.$message({type:"warning",message:"筛选条件已变更，请重新查询！"})
      //   return;
      // }
      // if(/https?/.test(msg)) {
      //   this.$message({type:"warning",message:"短信中不允许存在http或https，请修改短信内容后再提交！"})
      //   return;
      // }
      // if(msg.match(/#短链地址#/g) && msg.match(/#短链地址#/g).length > 1) {
      //   this.$message({type:"warning",message:"短信中只能插入一条短链地址！"})
      //   return;
      // }
      // if(msg.search(/#短链地址#/) != -1 && !shortUrl) {
      //   this.$message({type:"warning",message:"检测到短信内容中使用了短链地址，但是未插入短链地址，请重新检查！"})
      //   return;
      // }
      // if(/[【】{}ヾ▽ノ^√※→●★「」(低价)(超低价)(第一)]/.test(msg)) {
      //   this.$message({type:"warning",message:"  短信内容不得包含：】{}ヾ▽ノ^√※→●★「」等符号，禁止使用例如：低价、超低价、第一等广告法禁用的敏感词汇！"})
      //   return;
      // }
    },
    testSend({msg, phoneNumberStr,sign,shortUrl}) {
      this.validationMsg(msg,sign).then(() => {
        if(this.lastTestMsg == msg) {
          throw('测试短信不能每次发相同内容！')
        } else if (this.lastTestTime && ((new Date().getTime() - new Date(this.lastTestTime).getTime()) <= 30000)) {
          throw('测试短信两次发送间隔至少30秒')
        } else if (msg.search(/#短链地址#/) != -1 && !shortUrl) {
          throw('检测到短信内容中使用了短链地址，但是未插入短链地址，请重新检查！')
        }
        this.loading = true;
        // msg = msg.replace('【'+ sign +'】','');
        // msg = msg.replace
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
      }).catch(err => {
        this.$message({type:"warning",message:err})
      })
    },
  }
}
</script>
<style lang="less" scoped>
  @active:#20a0ff;
  .step_ul {
    overflow: hidden;
    li {
      padding:10px 0;
      margin-right:3%;
      text-align: center;
      font-size:14px;
      width:30%;
      border:1px solid #ddd;
      float:left;
      position: relative;
      &.active {
        background:@active;
        border-color:@active;
        color:#fff;
        &::after {
           background:@active;
           border-color:@active;
        }
      }
      &::after {
        content: '';
        display: block;
        width: 29px;
        height: 29px;
        position: absolute;
        transform: rotate(45deg);
        right: -15px;
        top: 5px;
        border: 1px solid #ddd;
        border-left: none;
        border-bottom: none;
        background: #fff;
      }
    }
  }
  .memberZY {
    padding:20px;
    .content {
      margin-top:20px;
    }
    .btn_box {
      text-align: center;
    }
  }
  .el-step__main {
    margin-left:-20px;
  }
</style>
