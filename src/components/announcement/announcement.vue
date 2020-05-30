<!--
 * @Author: your name
 * @Date: 2020-03-09 23:07:22
 * @LastEditTime: 2020-03-12 10:25:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /superboss-dptwd-crm/src/components/announcement/announcement.vue
 -->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
  >
    <p slot="title" class="title">京东官方短信通道上线公共</p>
    <div class="content">
      <p style="font-size:14px;text-indent:20px;">
        应京东官方要求：为保障京东用户和商家数据信息安全，会员营销短信需统一对接官方短信通道。指定号码发送及订单关怀暂时不受影响。官方通道需要重新申请短信签名，请您在【智能营销】-【会员营销】-【编辑短信内容】中申请签名，以免对您的营销产生影响
      </p>
      <img :src="img" style="width:500px;">
      <p style="font-size:14px;text-indent:20px;color:red;">官方通道开通后增加了：店铺浏览加购/商品行为/客户偏好/客户画像等多个筛选标签，供您精准触达会员，提升营销效果</p>
      <!-- <h3>会员开卡发布上线</h3> -->
      <!-- <ul>
        <li>
          1、旺店会员于8月31日，上线会员开卡功能，功能上线后，除成交自动成为会员外，还可以通过领卡成为会员；
        </li>
        <li>
          2、您可以在等级规则中，开启会员开卡功能，入会时需发送短信验证会员手机号码，请保持短信余量充足；
        </li>
        <li>
          3、之前的注册会员，需要重新领卡成为会员，成交会员不受影响；
        </li>
        <li>
        </li>
      </ul> -->
    </div>
    <div slot="footer" style="text-align:center;">
      <el-button type="primary" size="large" @click="dialogVisible=false">知道了</el-button>
    </div>
  </el-dialog>
</template>
<script>
import http from '../../api/index.js'
import img from "@/assets/img/announce/2020-03-09.png"
export default {
  data() {
    return {
      isZiying:this.$store.state.ziying.isZiying,
      dialogVisible:false,
      img
    }
  },
  created() {
    if(new Date() > new Date("2020/03/20")) return;
    const shopId = this.$store.state.user.shopId;
    let local = localStorage.annonce_20190309;
    local = local ? JSON.parse(local) : [];
    if(local.indexOf(shopId) == -1) {
      local.push(shopId);
      localStorage.annonce_20190309 = JSON.stringify(local);
      this.dialogVisible = true;
    }
  }
}
</script>
<style lang="less" scoped>
  .el-dialog__body {
    padding: 10px 20px;
  }
  .title {
    font-size:22px;
    text-align: center;
    font-weight: bold;
    margin-bottom:10px;
  }
  .content {
    line-height: 22px;
  }
  ul {
    padding:0 10px;
    li {
      margin-bottom:15px;
    }
  }
</style>
