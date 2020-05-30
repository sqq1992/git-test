<template>
  <div class="analysis-content">
    <a href="javascript:window.history.go(-1)" class="goback">&lt;&lt;返回效果分析列表</a>
    <el-tabs v-model="activeName">
      <el-tab-pane label="活动详情" name="1">
        <MsgDetail :id="id"/>
      </el-tab-pane>
      <el-tab-pane label="效果分析" name="2">
        <Analysis :id="id" :type="type" :sendTime="sendTime"/>
      </el-tab-pane>
      <el-tab-pane label="客户明细" name="3">
        <BuyerInfo :id="id" :sendTime="sendTime"/>
      </el-tab-pane>
      <el-tab-pane label="商品明细" name="4">
        <GoodsDetail :id="id" :sendTime="sendTime"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Analysis from './analysisPage/analysis'
import MsgDetail from './msgDetail'
import BuyerInfo from './buyerInfo'
import GoodsDetail from './goodsDetail'
export default {
  components:{
    Analysis,
    MsgDetail,
    BuyerInfo,
    GoodsDetail
  },
  data() {
    let {id, sendTime,type} = this.$route.query;
    return {
      activeName:'2',
      id,
      sendTime,
      type
    }
  },
  created() {
    console.log(this.$route);
  }
}
</script>
<style lang="less" scoped>
  .analysis-content {
    padding:17px 25px 30px 15px;
    position: relative;
    .goback {
      position:absolute;
      right:30px;
      top:20px;
      color:#20a0ff;
      z-index:99;
    }
  }
</style>
