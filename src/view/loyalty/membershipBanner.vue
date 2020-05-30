<template>
  <div class="membership-banner">
    <div class="membership-box">
      <div class="left_box">
        <div style="line-height:30px;">
          <span style="font-size:14px;color:#333;">开卡即会员</span>
          <el-switch
            class="el-switch"
            v-model="isOpenCard"
            style="line-height:43px;"
            on-text=""
            off-text=""
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
          <span class="open-card-show" :class="{active:isOpenCard}">{{isOpenCard ? '已开启' : '未开启'}}</span>
        </div>
        <p style="color: rgba(102,102,102,0.65);font-size:12px;">
          开启后，即可0元领卡入会
        </p>
      </div>
      <div class="right_box">
        <span>短信余额：{{user.restMsgCount}}</span>
        <a href="#/marketingSmsRecharge" class="recharge_btn" target="_blank" @click="toRecharge">充值</a>
        <BaseDialog
          title="历史发送日志查询"
          size="large"
          @onConfirm="close"
        >
          <el-button slot="button" type="text" @click="smsDetail">查看短信发送明细</el-button>
          <Table type="history" />
        </BaseDialog>
      </div>
    </div>
    <el-dialog
      	title=""
				:visible.sync="topUpDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        size="tiny"
    >
      <div class="topup-dialog">
        <div class="header">
          短信余额：<span class="sms-count">{{user.restMsgCount}}</span> 您的短信余额不足
        </div>
        <div class="content">
          因平台限制，0元入会需发送验证短信，验证用户手机号码。短信余额不足时无法使用0元入会功能
        </div>
        <div class="footer">
          <el-button type="primary" @click="toRecharge">立即充值</el-button>
          <el-button @click="topUpDialog = false">取消</el-button>
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">

      </span> -->
    </el-dialog>
    <el-dialog
      :visible.sync="phoneDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      size="tiny"
    >
      <div class="phone-dialog">
        <div class="header">
          <img :src="openSuccess" alt="">
          0元入会开启成功
        </div>
        <ul class="content">
          <li>
            短信余额为0时将导致该功能失效，建议您填写手机号码，方便我们及时通知您余额情况
          </li>
          <li class="ipt-li">
            <el-input v-model="mobile" placeholder="请输入您的常用手机号" :maxlength="11"></el-input>
          </li>
          <li class="ipt-li">
            <el-input v-model="code" placeholder="请输入验证码"></el-input>
            <el-button v-if="codeBtnVal == '获取验证码'" type="primary" @click="getCode" size="mini" class="get-code-btn" :disabled="!canGet">{{this.codeBtnVal}}</el-button>
            <span v-else style="margin-left:10px;">{{this.codeBtnVal}}</span>
          </li>
        </ul>
        <div class="footer">
          <el-button type="primary" @click="bindPhone" :disabled="!canSend">确定</el-button>
          <el-button @click="phoneDialog = false">暂不填写</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import store from 'src/store'
import ajax from 'src/api/index.js';
import openSuccess from 'src/assets/svg/openSuccess.svg'
import Table from './table.vue'
import BaseDialog from 'src/components/baseDialog'
import {point} from 'src/common/point.js'
export default {
  data() {
    return {
      openSuccess,
      isOpenCard:this.$store.state.user.collarCardMode == 1,
      user:'',
      topUpDialog:false,
      phoneDialog:false,
      code:'',
      mobile:'',
      codeBtnVal:'获取验证码',
      timeout:null,
      prevent:false
    }
  },
  components: {BaseDialog,Table},
  watch: {
    isOpenCard(val, lastVal) {
      if(!this.user.restMsgCount > 0 && val) {//短信余额不足不能开启
        this.isOpenCard = false;
        this.topUpDialog = true;
        return;
      }
      if(this.prevent)  return this.prevent = false;
      ajax({
        api_name: 'switchCollarCardMode',
        data:{
          collarCardMode:val ? 1 : 0
        },
        vm: this
      },
      result => {
        point('37977.39406.39457')
        this.$message({
            message: val ? '0元入会开启成功！' : '0元入会关闭成功！',
              type: 'success'
        });
        if(!this.user.mobile && val) {
          this.phoneDialog = true;
        }
      },
      error => {
        this.$message({
            message: error || '未知错误！',
            type: 'error'
        });
        this.prevent = true;
        this.isOpenCard = lastVal;
      })
    },
  },
  computed:{
    canSend() {
      return this.mobile && this.code
    },
    canGet() {
      return /\d{11}/.test(this.mobile)
    }
  },
  created() {
    this.user = store.state.user;//restMsgCount
  },
  methods:{
    bindPhone() {
      ajax({
          api_name: 'switchCollarCardMode',
          data:{
            collarCardMode:1,
            mobile:this.mobile,
            verifyCode:this.code
          },
          vm: this
        },
        result => {
          this.phoneDialog = false;
          this.$message({
            message:'绑定成功！',
            type:'success'
          })
        },
        error => {
          this.$message({
            message:error || '未知错误！',
            type:'error'
          })
      })
    },
    getCode() {
      if(this.codeBtnVal != '获取验证码') return;
      if(!this.mobile) {
        this.$message({
          message:'请输入手机号！',
          type:'error'
        })
        return;
      }
      ajax({
        api_name:'sendVerifySms',
        data:{
          venderId:this.user.venderId,
          mobile:this.mobile
        }
      },result => {
        this.codeBtnVal = 60;
        this.timeout = setInterval(() => {
          if(this.codeBtnVal <= 0) {
            this.codeBtnVal = '获取验证码';
            clearInterval(this.timeout);
            this.timeout = null
          } else {
            this.codeBtnVal = this.codeBtnVal - 1;
          }
        },1000)
      },error => {
        this.$message({
          message:error.message || '未知错误！',
          type:'error'
        })
      })
    },
    toRecharge() {
      window.open('/#/marketingSmsRecharge');
      this.topUpDialog = false;
      point('37977.39406.39458')
    },
    smsDetail() {
      point('37977.39406.39459')
    },
    close(cb) {
        cb && cb();
      }
  }
}
</script>
<style lang="less">
  .membership-box {
    padding:20px;
    height:96px;
    box-sizing: border-box;
    background: #FAFAFA;
    margin-bottom:10px;
    .open-card-show {
      display: inline-block;
      margin-left:8px;
      width:66px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: #FFF6F7;
      font-size: 14px;
      color: #F5222D;
      border-radius: 12px;
      &.active {
        background: #F2FFED;
        color: #4CC312;
      }
    }
    .left_box{
      float: left;
      margin-right:100px;
    }
    .right_box {
      float:left;
      .recharge_btn{
        border: 0; border-radius: 3px;
        padding: 2px 8px; margin: 0 5px;
        color: #fff; background: #f90;
        &:hover{
            background: #f60;
        }
      }
    }
  }
  .el-switch {
    margin-left:20px;
    vertical-align: top;
    margin-bottom:12px;
  }
  // .el-dialog__header{
  //   padding:0;
  // }
  .el-dialog--tiny{
    width:450px;
    box-sizing: border-box;
  }
  .el-dialog__body {
    padding: 0 30px;
  }
  .topup-dialog {
    .header {
      font-size:18px;
      color:#333;
      .sms-count {
        color:#F5222D;
      }
    }
    .content {
      padding:20px 0;
      text-indent:30px;
      font-size:15px;
      color:#999;
      line-height:30px;
    }
    .footer {
      text-align: center;
      padding:20px 0;
    }
  }
  .phone-dialog {
    .header {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width:40px;
        margin-right:8px;
      }
    }
    .content {
      font-size:14px;
      color:#666;
      margin-top:20px;
      li{
        margin-bottom:10px;
      }
      .ipt-li {
        .el-input {
          width:280px;
          display:inline-block;
          vertical-align: middle;
        }
        .el-input__inner {
          height: 100%;
          width: 100%;
        }
        .get-code-btn{
          margin-left:10px;
        }
      }
    }
    .footer {
      text-align: center;
      padding:20px 0;
      .bind-btn{
        &.disabled {
          background:#999;
          border-color:#999;
        }
      }
    }
  }
  .phoneContent {
    padding-left:50px;


  }
</style>
