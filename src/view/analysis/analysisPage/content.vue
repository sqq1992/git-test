<template>
    <div>
      <div class="content-title">
        ROI(投入产出比) {{analysisData.ROI}}
      </div>
      <ul class="analysis-list">
        <li class="analysis-list-warp">
          <div class="item-top">目标客户</div>
          <div class="analysis-list-item">
            目标客户数：{{analysisData.planSendCount}}
          </div>
          <div class="analysis-list-item">
            发送成功客户数：{{analysisData.sendPeopleCount}}
          </div>
          <div class="analysis-list-item">
            短信条数：{{analysisData.sendSmsCount}}
          </div>
        </li>
        <li class="analysis-list-warp">
          <div class="item-top">
            沉默客户
            <el-tooltip class="item" effect="dark" content="目标客户中未下单的客户" placement="top">
              <i type="primary" class="el-icon-information"></i>
            </el-tooltip>
          </div>
          <div class="analysis-list-item">
            沉默客户数：{{analysisData.noTradePeopleCount}}
          </div>
          <div class="analysis-list-item">
            沉默客户比例：{{analysisData.noTradeRatio}}
          </div>
        </li>
        <li class="analysis-list-warp">
          <div class="item-top">
            下单客户
            <el-tooltip class="item" effect="dark" content="拍下订单的客户" placement="top">
              <i type="primary" class="el-icon-information"></i>
            </el-tooltip>
          </div>
          <div class="analysis-list-item">
            下单客户数：{{analysisData.tradePeopleCountTotal}}
          </div>
          <div class="analysis-list-item">
            下单响应率
            <el-tooltip class="item" effect="dark" content="下单客户数÷发送成功客户数*100%" placement="top">
              <i type="primary" class="el-icon-information"></i>
            </el-tooltip>
            ：
            {{analysisData.tradeRatioTotal}}
          </div>
          <div class="analysis-list-item">
            下单订单数：{{analysisData.traderCountTotal}}
          </div>
          <div class="analysis-list-item">
            下单金额：{{analysisData.tradeAmountTotal}}
          </div>
        </li>
        <li class="analysis-list-warp">
          <div class="item-top">
            成交客户
            <el-tooltip class="item" effect="dark" content="成功付款客户" placement="top">
              <i type="primary" class="el-icon-information"></i>
            </el-tooltip>
          </div>
          <div class="analysis-list-item">
            成交客户数：{{analysisData.payPeopleCountTotal}}
          </div>
          <div class="analysis-list-item">
            成交响应率
            <el-tooltip class="item" effect="dark" content="成交客户数÷发送成功客户数*100%" placement="top">
              <i type="primary" class="el-icon-information"></i>
            </el-tooltip>
            ：{{analysisData.payTradeRatioTotal}}
          </div>
          <div class="analysis-list-item">
            成交订单数：{{analysisData.payTraderCountTotal}}
          </div>
          <div class="analysis-list-item">
            成交金额：{{analysisData.payTradeAmountTotal}}
          </div>
        </li>
        <li class="analysis-list-warp">
          <div class="item-top">
            意向客户
            <el-tooltip class="item" effect="dark" content="指下单后交易关闭的客户" placement="top">
              <i type="primary" class="el-icon-information"></i>
            </el-tooltip>
          </div>
          <div class="analysis-list-item">
            意向客户数：{{analysisData.tradeClosePeopleCountTotal}}
          </div>
          <div class="analysis-list-item">
            意向响应率
            <el-tooltip class="item" effect="dark" content="意向客户数÷发送成功客户数*100%" placement="top">
              <i type="primary" class="el-icon-information"></i>
            </el-tooltip>
            ：{{analysisData.tradeCloseRatioTotal}}
          </div>
          <div class="analysis-list-item">
            意向订单数：{{analysisData.tradeCloseCountTotal}}
          </div>
          <div class="analysis-list-item">
            意向金额：{{analysisData.tradeCloseAmountTotal}}
          </div>
        </li>
      </ul>
    </div>
</template>
<script>
export default {
  props:['analysisData'],
  // watch:{
  //   'analysisData'() {
  //     for(let key in this.analysisData) {
  //       this[key] = this.analysisData[key];
  //     }
  //   }
  // },
  // data() {
  //   return {
  //     ...this.analysisData
  //   }
  // }
}
</script>
<style lang="less" scoped>
  .content-title {
      font-size:16px;
      text-align:center;
      margin-bottom:10px;
    }
    .analysis-list {
      padding-left: 15px;
      padding-bottom:15px;
      display: flex;
      justify-content: center;
      .analysis-list-warp {
        padding: 10px;
        margin-right: 20px;
        border: 1px solid #eaeaea;
        width: 170px;
        height: 200px;
        .item-top {
          padding-top:5px;
          padding-bottom:15px;
          font-size:14px;
          text-align: center;
        }
        .analysis-list-item {
          padding-bottom:5px;
        }
      }
    }
</style>
