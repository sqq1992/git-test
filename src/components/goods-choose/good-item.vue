<template>
    <li class="choose-item">
        <div class="good-img">
            <img :src="item.logo" alt="">
        </div>
        <div class="good-info">
            <div class="good-name">{{item.title}}</div>
            <div class="good-price" v-if="item.price">¥ {{item.price}}</div>
            <span></span>
        </div>
        <div class="good-btns">
            <slot></slot>
        </div>
    </li>
</template>

<script>
export default {
    props: {
        item: {
            type: Object
        }
    }
}
</script>

<style lang="less" scoped>
    .choose-item{
        padding: 13px 10px;
        border-bottom: 1px solid #eaeaea;
        display: flex;
    }
    .good-img{
        width: 75px;
        height: 75px;
        display: inline-block;
        vertical-align: top;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .good-info{
        flex: 1;
        display: inline-block;
        line-height: 26px;
        height: 75px;
        font-size: 14px;
        color: #666;
        vertical-align: top;
        margin: 0 10px 0 10px;
        position: relative;
        .good-name{
            height: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            -moz-line-clamp: 2;
            -moz-box-orient: vertical;
            display: -moz-box;
        }
        .good-price{
            height: 25px;
        }
        a{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
        }
    }
    .good-btns{
        display: inline-block;
        width: 70px;
        padding-top: 20px;
    }
</style>
