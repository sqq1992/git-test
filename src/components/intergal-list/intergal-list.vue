<template>
    <ul class="intergal_list">
        <div class="intergal_list_title">积分兑礼</div>
        <li class="ui-filter-item" v-for="(item, index) in list" :key="'list_'+index">
            <div class="item-left" :style="item.type == 'coupon' ? '' : 'background: none;'">
                <div v-if="item.type == 'coupon'">
                    <p class="coupons_item_number" v-if="item.faceType == 1">￥<span>{{item.faceValue}}</span></p>
                    <p class="coupons_item_number" v-if="item.faceType == 2"><span>{{item.faceValue}}</span>折</p>
                    <p>{{item.coupon.bindType == 1 ? '店铺' : '商品'}}优惠券</p>
                </div>
                <img :src="item.picUrl" alt="" width="100%" height="100%" v-if="item.type == 'commodity'">
                <img :src="item.picUrl" alt="" width="100%" height="100%" v-if="item.type == 'gift_wareDiscount'">
            </div>
            <div class="item-cont">
                <div>{{item.giftName}}</div>
                <div class="item-hint">{{item.needPoint | numFormat}}积分 {{item.type == 'gift_wareDiscount' ? `+￥${item.finalPrice || 0}元换购` : '' | nullFormat(' ') | numFormat}}</div>
                <div class="item-time" v-if="item.endTime">{{item.endTime}} 截止</div>
            </div>
            <div class="item-right">
                <round-loading :percentage="item.rate" :stock="item.haveCount"></round-loading>
                <a href="javascript:void(0);" class="btn" :class="{'btn-primary': item.haveCount > 0, 'btn-gray': item.haveCount == 0}" :style="item.haveCount > 0 ? 'background: '+color : ''">立即兑换</a>
            </div>
        </li>
    </ul>
</template>

<script>
import roundLoading from 'src/components/intergal-list/round-loading';
export default {
    props: {
        list: {
            type: Array,
            default(){
                return []
            }
        }
    },
    data(){
        return {
            color: ''
        }
    },
    components: {
        roundLoading
    }
}
</script>

<style lang="less" scoped>
    .intergal_list{
        margin-top: 10px;
        background: #fff;
    }
    .intergal_list_title{
        font-size: 14px;
        color: #3d4134;
        height: 48px;
        line-height: 48px;
        padding: 0 12px;
    }
    .ui-filter-item{
        background: #fff;
        border-radius: 2px;
        padding: 10px;
        margin-top: 10px;
        position: relative;
        &:first-child{
            margin-top: 0;
        }
        &:after, &:before{
            content: '';
            display: inline-block;
            width: 10px;
            height: 10px;
            background: #f2f3f7;
            border-radius: 50%;
            left: 70%;
            position: absolute;
        }
        &:after{
            top: -5px;
        }
        &:before{
            bottom: -5px;
        }
        .item-left{
            display: inline-block;
            width: 83px;
            vertical-align: top;
            height: 65px;
            background: #e0b971;
            border-radius: 4px;
            color: rgba(255,255,255,0.7);
            text-align: center;
            box-sizing: border-box;
            overflow: hidden;
            position: relative;
            p {
                font-size: 11px;
                margin-top: 5px;
                line-height: 1.5;
            }
            .coupons_item_number {
                font-size: 10px;
                vertical-align: bottom;
                border-bottom: 1px dashed #d1a149;
                font-weight: 900;
                color: #fff;
                height: 35px;
                line-height: 35px;
                span {
                    font-size: 20px;
                }
            }
            div{
                padding: 0 10px;
            }
            img{
                width: auto;
                height: auto;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                max-width: 100%;
                max-height: 100%;
            }
        }
        .item-cont{
            width: 150px;
            margin-left: 10px;
            display: inline-block;
            vertical-align: top;
            font-size: 12px;
            color: #333;
            line-height: 1.5;
            .item-hint{
                color: #FF893A;
                margin-top: 7px;
                span{
                    font-size: 10px;
                    color: #888;
                    margin-left: 10px;
                }
            }
            .item-time{
                color: #888;
            }
        }
        .item-right{
            width: 60px;
            // margin-left: 40px;
            vertical-align: top;
            display: inline-block;
            float: right;
            text-align: center;
            .btn{
                font-size: 12px;
            }
        }
        .item-empty {
            line-height: 60px;
            text-align: center;
            font-size: 16px;
        }
        a.link{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
        }
    }
</style>
