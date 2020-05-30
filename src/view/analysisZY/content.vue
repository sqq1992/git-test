<template>
  <div>
      <div class="content-title">
        ROI(投入产出比) {{analysisData.ROI}}
      </div>
      <ul class="analysis-list">
        <li class="analysis-list-warp">
          <div class="item-top">覆盖人群</div>
          <div class="analysis-list-item">
            营销用户：{{analysisData.peopleSentNum}}
          </div>
          <div class="analysis-list-item">
            发送短信条数：{{analysisData.smsSentNum}}
          </div>
          <!-- 点击效果才有 -->
          <!-- <div class="analysis-list-item" v-if="analysType == 'click'">
            链接点击人数：{{analysisData.linkUv}}
          </div>
          <div class="analysis-list-item" v-if="analysType == 'click'">
            点击转化率：{{analysisData.linkUvRate}}
          </div> -->
        </li>
        <li class="analysis-list-warp">
          <div class="item-top">
            店铺访客
            <el-tooltip class="item" effect="dark" content="目标客户中未下单的客户， 客户数量按日去重" placement="top">
              <i type="primary" class="el-icon-information"></i>
            </el-tooltip>
          </div>
          <div class="analysis-list-item">
            访问店铺首页：{{analysisData.shopUv}}
          </div>
          <div class="analysis-list-item">
            访问商品详情页：{{analysisData.skuUv}}
          </div>
          <div class="analysis-list-item">
            收藏商品：{{analysisData.followSkuPins}}
          </div>
          <div class="analysis-list-item">
            加购商品：{{analysisData.cartPins}}
          </div>
        </li>
        <li class="analysis-list-warp">
          <div class="item-top">
            下单客户
            <el-tooltip class="item" effect="dark" content="拍下订单的客户， 客户数量按日去重" placement="top">
              <i type="primary" class="el-icon-information"></i>
            </el-tooltip>
          </div>
          <div class="analysis-list-item">
            下单客户：{{analysisData.orderPins}}
          </div>
          <div class="analysis-list-item">
            下单订单数：{{analysisData.orderNum}}
          </div>
          <div class="analysis-list-item">
            下单金额：{{analysisData.orderAmount}}
          </div>
          <div class="analysis-list-item">
            下单转化率
            <el-tooltip class="item" effect="dark" content="下单客户数÷发送成功客户数*100%" placement="top">
              <i type="primary" class="el-icon-information"></i>
            </el-tooltip>
            ：
            {{analysisData.orderPinsRate}}
          </div>
        </li>
        <li class="analysis-list-warp">
          <div class="item-top">
            成交客户
            <el-tooltip class="item" effect="dark" content="成功付款客户， 客户数量按日去重" placement="top">
              <i type="primary" class="el-icon-information"></i>
            </el-tooltip>
          </div>
          <div class="analysis-list-item">
            成交客户：{{analysisData.payPins}}
          </div>
          <div class="analysis-list-item">
            成交订单数：{{analysisData.payNum}}
          </div>
          <div class="analysis-list-item">
            成交金额：{{analysisData.payAmount}}
          </div>
          <div class="analysis-list-item">
            成交转化率
            <el-tooltip class="item" effect="dark" content="成交客户数÷下单客户数*100%" placement="top">
              <i type="primary" class="el-icon-information"></i>
            </el-tooltip>
            ：{{analysisData.payPinsRate}}
          </div>
        </li>
        <!-- <li class="analysis-list-warp">
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
            意向影响率
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
        </li> -->
      </ul>
  </div>
</template>
<script>
export default {
  props:['analysisData','analysType'],
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
        height: 150px;
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
    .analysis-info-box {
    margin-top:10px;
    i {
      color:#20a0ff;
    }
    .info-title {
      height: 42px;
      padding: 0 10px;
      background: #f5f5f5;
      border: 1px solid #eaeaea;
      line-height: 42px;
      color: #333;
      font-size: 16px;
      font-family: microsoft yahei;
    }
    .info-content {
      margin-top: -1px;
      padding: 10px;
      border: 1px solid #eaeaea;
      background: #fff;
    }
  }
</style>
