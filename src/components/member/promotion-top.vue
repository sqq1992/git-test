<template>
    <nav class="view_nav">
        <router-link :to="{name: 'promotion'}" class="view_nav_item">活动管理</router-link>
        <router-link :to="{name: 'promotionList'}" class="view_nav_item">参与记录</router-link>
        <el-tooltip content="因京东接口升级，我们只能获取会员的加密账号，
        系统会每天将会员加密账号同步替换为明文账号（非会员无法更新），
        会员账号筛选条件对明文和加密账号同时生效" popper-class="my_poper" placement="top" style="top:0;right:10px;">
         <span class="mi_box">
           什么是<span class="mi_icon">密</span>?
          </span>
        </el-tooltip>
    </nav>
</template>

<script>
export default {

}
</script>


<style lang="less">
.view_nav{
    height: 46px;
    border-bottom: 1px solid #ccc;
    line-height: 46px;
    position: relative;
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
}
</style>
