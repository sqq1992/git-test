<template>
  <div class="testMobile">
    <el-dialog
      title="测试手机号"
      :visible.sync="visible"
    >
      <p v-for="mobile in mobiles" :key="mobile">{{mobile}}</p>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible:false,
      mobiles:[]
    }
  },
  methods: {
    showDialog(data) {
      this.visible = true;
      this.mobiles = data;
    }
  }
}
</script>
<style lang="less" scoped>
  .testMobile p {
    display:inline-block;
    width:25%;
  }
</style>
