<template>
    <nav class="view_nav">
        <router-link :to="{name: 'welfare'}" class="view_nav_item">会员福利社</router-link>
        <router-link :to="{name: 'welfareList'}" class="view_nav_item">活动列表</router-link>
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