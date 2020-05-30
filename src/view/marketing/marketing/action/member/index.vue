<template>
  <el-form v-loading="loading" class="marketing-marketing-member-page" label-position="right" label-width="6em">
    <!-- <el-alert show-icon :closable="false" class="m_b10" title="" type="warning">
    </el-alert> -->
    <Header type="member" :activityData="activityData" @setData="setData"/>
    <el-form-item label="目标会员：">
      <el-radio v-model="targetMember" label="1" >人群筛选</el-radio>
      <el-radio v-model="targetMember" label="2">自定义筛选</el-radio>
      <Crowd v-show="targetMember === '1'" :otherCrowd="otherCrowd" :crowId="crowId" @changeCrowId="changeCrowId" @getOtherCrowd="getOtherCrowd"/>
      <Custom ref="custom" v-show="targetMember === '2'" @changeRule="changeRule" @delRule="delRule"/>
      <CrowdTable v-show="targetMember === '1'"  @setOtherCrowd="setOtherCrowd"/>
      <section>
        <h4>过滤设置</h4>
        <div class="flex">
          <div>过滤设置：</div>
          <el-checkbox class="m_l10 m_r10" v-model="filterBlackList">不发送黑名单</el-checkbox>
          <div class="flex m_l20" style="width:600px;">
            <el-checkbox v-model="filterSms">不发送最近</el-checkbox>
            <el-input class="el-input--filter_day" size="mini" v-model="tired" :disabled="!filterSms"/>
            <div style="width:250px;">天发送过短信的会员（含今天）</div>
          </div>
        </div>
      </section>
      <div>
        <el-button size="small" type="primary" @click="queryMember">查询</el-button>
        <span class="pl5">当前条件共查询出<span style="color:red">{{allCount.toLocaleString()}}</span>位有手机号的会员</span>
      </div>
    </el-form-item>
    <Sms ref="sms" @send="saveActivity" @testSend="testSend" :phoneNum="allCount"/>
  </el-form>
</template>

<script>
  import Sms from 'components/sms'
  import Crowd from './crowd'
  import Custom from './custom'
  import Header from '../common/header.vue'
  import http from 'src/api'
  import BaseDialog from 'src/components/baseDialog'
  import CrowdTable from './crowd/crowdTable.vue'
  import {point} from 'src/common/point.js'
  export default {
    components: {
      Sms,Crowd,Custom,Header,BaseDialog,CrowdTable
    },
    data() {
      return {
        targetMember: '1',
        setTime: '',
        filterBlackList: true,
        filterSms: false,
        allCount: 0,
        crowId:'',
        tired:'',
        rules:{},
        canSendSms:false,
        activityName:'',
        sendTime:'',
        activityData:{},
        smsContent:'',
        loading:false,
        otherCrowd:""
      }
    },
    created() {
      point('37977.39401.39425');
      if(this.$route.query.id) {
        this.getDetailById(this.$route.query.id);
      } else if(this.$route.query.crowId) {
        this.crowId = this.$route.query.crowId;
        this.queryMember();
      }
    },
    watch: {
      targetMember(val,oldVal) {
        this.canSendSms = false;
      }
    },
    methods: {
      setOtherCrowd(data) {//选择其他智能人群
        this.targetMember = '1';
        this.otherCrowd = data;
        this.changeCrowId(data.id);
      },
      getOtherCrowd(id) {
        http({
          api_name:'queryCrowdById',
          data:{id:this.crowId}
        },res => {
          let crowd = res.data.crowd
          if(crowd){
            this.queryGroupNumber(crowd,(crowd) => {
               this.setOtherCrowd(crowd)
            })
          }
        })
      },
      queryGroupNumber(item, cb){
            http({
              api_name: 'queryCrowdCount',
              data: {
                dealSet: item.dealSet
              },
              vm: this,
            }, result => {
              item.customerCount = result.data.count;
              cb && cb(item);
            });
        },
      queryMember() {//查询会员人数
        if(this.filterSms && !this.tired) {
          this.$message.warning('请输入过滤天数');
          return;
        }
        let data = {
            filterSettings:JSON.stringify({
              filterBlackList:this.filterBlackList ? 1 : 0,
              tired:this.filterSms ? this.tired : ''
            })
        }
        this.targetMember == 1 ? (data.crowId = this.crowId) : (data.crowRules =  JSON.stringify(Object.assign(this.rules,{firstOrderDateType:1})));//后端大佬要求加的，用于匹配查询时间类型格式YYYY-MM-DD
        this.loading = true;
        http({
          api_name: 'marketingGetMobileNum',
          data
        }, ({data:{num}}) => {
          this.allCount = num;
          this.canSendSms = true;
          this.loading = false;
        }, (error) => {
          this.loading = false;
          this.$message.error(error.message);
        })
      },
      changeCrowId(crowId,isInit) {//切换人群
        this.crowId = crowId;
        this.canSendSms = false;
        if(isInit) {
          this.queryMember();
        }
      },
      setData({activityName,sendTime}) {
        this.activityName = activityName;
        this.sendTime = sendTime
      },
      changeRule(rule) {//修改自定义筛选规则
        let rules = Object.assign(this.rules,rule);
        for(let key in rules) {
          if(!rules[key]) {
            delete rules[key];
          }
        }
        this.rules = rules;
        this.canSendSms = false;
      },
      delRule(...arg) {//用于切换筛选规则条件时删除未设置的规则
        arg.forEach(item => {
          delete this.rules[item];
        });
      },
      getDetailById(id) {
        this.loading = true;
        http({
          api_name:'marketingGetDetail',
          data:{activityId:id}
        },({data}) => {
          const { activityName, sendTime, crowId , filterSettings, messageContent, crowRules } = data;
          crowId && (this.crowId = crowId);
          crowRules && (this.$refs.custom.initPage(crowRules));
          crowRules && (this.rules = JSON.parse(crowRules));
          this.targetMember = crowId ? '1' : '2';
          this.activityData = {activityName,sendTime};
          this.$refs.sms.initMessage(messageContent);
          this.queryMember();
        },(error) => {
          this.loading = false;
          this.$message.error(error.message);
        })
      },
      saveActivity({msg}) {//保存会员营销
        if(this.canSendSms == false) {
          this.$message({type:"warning",message:"筛选条件已变更，请重新查询！"})
          return;
        }
        if(!this.activityName){
          this.$message({type:"warning",message:"请输入活动名称！"})
          return;
        }
        let data = {
          activityName:this.activityName,
          sendTime:this.sendTime,
          filterSettings:JSON.stringify({
            filterBlackList:this.filterBlackList ? 1 : 0,
            tired:this.tired
          }),
          activityType:53,
          messageContent:msg,
        }
        this.targetMember == 1 ? (data.crowId = this.crowId) : (data.crowRules =  JSON.stringify(this.rules));
        this.sendSms(data);
      },
      testSend({msg, phoneNumberStr}) {
        let data = {
          messageContent:msg,
          phoneNumberStr,
          activityType:54,
          sendTest:true
        }
        this.sendSms(data,true);
      },
      sendSms(data,isTest) {
        this.loading = true;
        http({
          api_name: 'marketingCreate',
          data
        }, (res) => {
          if(!isTest) {
            this.$router.push({name:'marketing'});
          } else {
            this.$message.success('发送成功！')
          }
          this.loading = false;
        }, (error) => {
          this.$message.error(error.message);
          this.loading = false;;
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">

  .el-input--filter_day{
    width:80px;

    margin: 0 10px;
  }

  .marketing-marketing-member-page {
    padding:16px 20px;
  }

  .el-form-item { margin-bottom: 12px; }




  .member-count{
    text-align: center;
    font-size: 30px;
    &:after {
      content:'人';
      font-size: 50%;
    }
  }

</style>

<style>
  .el-input--filter_day .el-input__inner {
    min-width: 80px;
  }
  .el-alert__content{
    vertical-align: middle;
  }
</style>
