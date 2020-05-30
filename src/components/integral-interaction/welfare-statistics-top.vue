<template>
    <div class="view_nav_cont">
      <nav class="view_nav">
        <router-link :to="{name: 'welfareStatistics'}" class="view_nav_item">活动统计</router-link>
        <router-link :to="{name: 'welfarePartake'}" class="view_nav_item">参与记录</router-link>
        <el-button size='small' @click="back" class="back">返回</el-button>
      </nav>
      <el-tooltip content="因京东接口升级，我们只能获取会员的加密账号，
      系统会每天将会员加密账号同步替换为明文账号（非会员无法更新），
      会员账号筛选条件对明文和加密账号同时生效" popper-class="my_poper" placement="top" style="right:70px;top:13px;">
        <span class="mi_box">
          什么是<span class="mi_icon">密</span>?
        </span>
      </el-tooltip>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        back() {
            this.$router.push({path: '/welfareList'});
        }
    }
}
</script>


<style lang="less">
.view_nav_cont {
  position: relative;
  .view_nav{
    height: 46px;
    border-bottom: 1px solid #ccc;
    line-height: 46px;
    .view_nav_item{
        width: 100px;
        display: inline-block;
        text-align: center;
        height: 43px;
        line-height: 46px;
        border-bottom: 3px solid transparent;
    }
    .router-link-exact-active{
        border-color: #3089dc;
        color: #3089dc;
    }
    .back {
        float: right;
        margin: 7px 10px 0 0;
    }
  }
}
</style>
