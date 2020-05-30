<template>
  <div class="recharge_card_con">
    <div class="recharge_card" v-for="(item,index) in rechargeCardData" :key="item.smsLink">
      <div class="card_left">
        <span class="card_title">{{index == 0 ? isFristPay ? '首充特惠' : '限时特惠' : '推荐'}}</span>
        <p class="sms_box">
          <span class="sms_count">{{item.msgCount}}</span>
          <span>条短信</span>
        </p>
        <p class="info">
          特惠：{{item.discountPrice}}元 {{item.unitPrice}}分/条
        </p>
      </div>
      <div class="card_right">
        <span @click="buyConfirm(item)" target="_blank" class="recharge_btn" :class="{'lonly' : !isFristPay}" >立即充值</span>
        <p v-if="isFristPay">2选1，仅享1次</p>
      </div>
    </div>
  </div>
</template>
<script>
import {point} from 'src/common/point.js';
export default {
  props:{
    isFristPay:Boolean,
    agreeDate:String,
    showAgreement:Function,
    rechargeCardData:Array
  },
  created() {
    console.log(this.rechargeCardData)
  },
  methods:{
     buyConfirm(data) {
        if(!this.agreeDate) {
          this.$emit("showAgreement");
          return;
        }
        const {smsLink,msgCount} = data;
        if(msgCount == 31580) {
          point('37977.37978.37979');
        } else if(msgCount == 62800) {
          point('37977.37978.37980');
        }
        point('37977.39402.39432');
        window.open(smsLink);
        this.$confirm(`若已充值成功，请点击“充值成功”按钮`,
          {
            title:'短信充值确认结果',
            confirmButtonText:'充值成功'
          }
        ).then(() => {
          window.location.reload();
        }).catch(() => {})
      }
  }
}
</script>
<style lang="less" scoped>
  .recharge_card_con {
    margin:20px;
    display:flex;
    justify-content: center;
    .recharge_card {
      font-family: none;
      overflow: hidden;
      width:50%;
      height:170px;
      background:linear-gradient(to bottom,rgb(255,246,240),rgb(255,236,207));
      border-radius: 10px;
      margin-right:140px;
      display: inline-block;
      position:relative;
      &:last-child {
        background:linear-gradient(to bottom,rgb(255,240,203),rgb(255,205,115));
        margin-right:0;
        .card_left .card_title {
          background: rgb(17,112,188);
          top: 10px;
          left: -28px;
          height: 25px;
          line-height: 25px;
          width: 100px;
          text-align: center;
          transform: rotate(-45deg);
        }
      }
      &::before {
        content:'';
        display:block;
        width:50px;
        height:50px;
        position:absolute;
        background:#fff;
        top:-25px;
        left:~"calc(60% - 25px)";
        border-radius:50%;
        z-index: 99;
      }
      &::after {
        content:'';
        display:block;
        width:50px;
        height:50px;
        position:absolute;
        background:#fff;
        bottom:-25px;
        left:~"calc(60% - 25px)";
        border-radius:50%;
        z-index: 99;
      }
      &>div {
        position: relative;
        float:left;
        height:170px;
      }
      .card_left {
        width:60%;
        border-right:1px dashed rgb(255,211,130);
        .card_title {
          position:absolute;
          top:0;
          left:10px;
          width:80px;
          height:30px;
          line-height:30px;
          text-align: center;
          color:#fff;
          border-radius:0 0 5px 5px;
          background:linear-gradient(to right,rgb(255,78,0),rgb(255,148,6))
        }
        .sms_box {
          margin-top:45px;
          text-align: center;
          font-size:16px;
          .sms_count {
            font-size:36px;
            font-weight: bold;
          }
        }
        .info {
          width:210px;
          padding:5px;
          text-align: center;
          font-size:16px;
          border-radius:5px;
          color:rgb(255,78,0);
          background:#fff;
          margin:0 auto;
        }
      }
      .card_right {
        width:39%;
        box-sizing: border-box;
        font-size: 16px;
        text-align: center;
        .recharge_btn {
          &.lonly {
            margin-top:70px;
          }
          cursor: pointer;
          display: block;
          margin: 0 auto;
          margin-top:55px;
          width:150px;
          padding:8px 0;
          border-radius:30px;
          text-align: center;
          font-size:16px;
          color:#fff;
          background:linear-gradient(to right,rgb(255,78,0),rgb(255,148,6));
          margin-bottom:10px;
        }
      }
    }
  }

</style>
