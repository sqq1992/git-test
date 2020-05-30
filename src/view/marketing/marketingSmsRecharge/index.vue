<template>
    <div class="m-content">
    <div class="m-content-main main_height">
      <el-tabs v-model="activeName">
        <el-tab-pane label="短信充值" name="1">
            <recharge></recharge>
        </el-tab-pane>
        <el-tab-pane label="充值记录" name="2">
            <rechargeRecord></rechargeRecord>
        </el-tab-pane>
        <el-tab-pane label="返还记录" name="3">
            <returnRecord></returnRecord>
        </el-tab-pane>
        <el-tab-pane label="使用记录" name="4">
            <useRecord></useRecord>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
    import recharge from './recharge.vue'
    import rechargeRecord from './rechargeRecord.vue'
    import useRecord from './useRecord.vue'
    import returnRecord from './returnRecord.vue'
    export default {
        name: 'index',
        components: {
            recharge,
            rechargeRecord,
            useRecord,
            returnRecord
        },
        data() {
            return {
                activeName: '1',
                isWhiteList: this.$store.state.whiteList.indexOf(this.$store.state.user.shopName) != -1
            }
        },
        methods: {}
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
.m-content-main{
    font-size: 14px;
    padding: 17px 25px 30px 15px;
    box-sizing: border-box;
}
</style>
