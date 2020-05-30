<template>
    <div>
        <nav class="view_nav">
            <router-link :to="{name: 'cardSetting'}" class="view_nav_item">会员卡设置</router-link>
            <router-link :to="{name: 'tagSetting'}" class="view_nav_item">头像徽章设置</router-link>
            <router-link :to="{name: 'lockRecord'}" class="view_nav_item">解锁记录</router-link>
        </nav>
        <router-view style="margin-top: 10px;"></router-view>
    </div>
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
