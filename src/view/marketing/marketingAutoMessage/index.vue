<template>
  <div class="m-content">
    <el-tabs v-model="activeName">
      <el-tab-pane label="催付提醒" name="1">
        <Payment v-if="this.activeName == 1"/>
      </el-tab-pane>
      <el-tab-pane label="发货提醒" name="2">
        <Delivery v-if="this.activeName == 2"/>
      </el-tab-pane>
    </el-tabs>
    <el-tooltip content="因京东接口升级，我们只能获取会员的加密账号，
      系统会每天将会员加密账号同步替换为明文账号（非会员无法更新），
      会员账号筛选条件对明文和加密账号同时生效" popper-class="my_poper" placement="top">
        <span class="mi_box">
          什么是<span class="mi_icon">密</span>?
        </span>
    </el-tooltip>
  </div>
</template>
<script>
import Payment from './messages/payment'
import Delivery from './messages/delivery'
import {point} from 'src/common/point.js'
export default {
  name:'marketingAutoMessage',
  components: {
    Payment,
    Delivery
  },
  created() {
    point('37977.40528');
  },
  data() {
    let activeName = '1';
    if(this.$route.query.type) {
      switch(this.$route.query.type) {
        case 'cftx':
          activeName = '1';
        break;
        case 'fhtx':
          activeName = '2'
        break;
      }
    }

    return {
      activeName
    }
  }
}
</script>
<style lang="less">
  .row_line {
    input {
      // width:100%;
      height:28px;
      // padding:3px 10px;
    }
  }
</style>
<style lang="less" scoped>
  .m-content{
    font-size: 14px;
    padding: 17px 25px 30px 15px;
    box-sizing: border-box;
    position: relative;
  }
</style>
