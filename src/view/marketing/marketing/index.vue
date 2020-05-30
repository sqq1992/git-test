<template>
  <div class="m-content">
    <div class="m-content-main main_height">
      <el-tabs v-model="activeName">
        <el-tab-pane label="智能营销" name="1">
          <Navigation />
        </el-tab-pane>
        <!-- <el-tab-pane label="发送日志" name="2">
          <Log/>
        </el-tab-pane> -->
      </el-tabs>
      <el-tooltip content="因京东接口升级，我们只能获取会员的加密账号，
        系统会每天将会员加密账号同步替换为明文账号（非会员无法更新），
        会员账号筛选条件对明文和加密账号同时生效" popper-class="my_poper" placement="top">
         <span class="mi_box">
           什么是<span class="mi_icon">密</span>?
          </span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  import Navigation from './navigation'
  import Log from './log'
  export default{
    watch:{
      sendFlag() {
        this.activeName = '2';
      }
    },
    data() {
      return{
        activeName: '1',
      }
    },
    components: {
      Navigation,Log
    },
    computed:{
      sendFlag() {
        return this.$store.state.sendLog.sendFlag;
      }
    },
  }
</script>

<style lang="less" scoped>
  .m-content-main{
    font-size: 14px;
    padding: 17px 25px 30px 15px;
    box-sizing: border-box;
    position: relative;
  }
</style>
