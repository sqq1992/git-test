<template>
    <nav class="view_nav">
        <router-link :to="{name: 'cardSetting'}" class="view_nav_item">会员卡设置</router-link>
        <router-link :to="{name: 'iconSetting'}" class="view_nav_item" v-if="hide">图标设置</router-link>
        <router-link :to="{name: 'tagSetting'}" class="view_nav_item">头像徽章设置</router-link>
        <router-link :to="{name: 'lockRecord'}" class="view_nav_item">解锁记录</router-link>
    </nav>
</template>

<script>
import { friendBlockList } from 'src/config';
import { mapState } from "vuex";
export default {
    created() {
    },
    computed: {
        ...mapState({
            user: state => state.user
        }),
        hide(){
            let venderId = this.user.venderId && this.user.venderId.toString();
            return friendBlockList.indexOf(venderId) == -1;
        }
    }
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