<template>
    <div class="list_warpper">
        <div class="list_warpper_title">会员福利社</div>
        <div class="list_item" v-for="(item, index) in list" :key="'list_'+index">
            <div class="list_left" :style="item.type == 'coupon' ? 'background-color: #e0b971' : ''">
                <div v-if="item.type == 'coupon'">
                    <p class="coupons_item_number" v-if="item.faceType == 1">￥<span>{{item.faceValue}}</span></p>
                    <p class="coupons_item_number" v-if="item.faceType == 2"><span>{{item.faceValue}}</span>折</p>
                    <p>{{item.coupon.bindType == 1 ? '店铺' : '商品'}}优惠券</p>
                </div>
                <img :src="item.wareLogo" alt="" width="100%" height="100%" v-if="item.type == 'dynamic_bargain' || item.type == 'collage'">
            </div>
            <div class="list_cont">
                <div class="list_name">{{item.activityName}}</div>
                <div class="list_info">
                    <div class="list_info_left">
                        <span class="list_info_left_oen">￥<span>{{item.discount}}</span></span>
                        <span class="list_info_left_two">￥{{item.price}}</span>
                    </div>
                    <div class="list_info_right">{{item.numberLowerLimit}}人{{item.type == 'dynamic_bargain' ? '砍价' : item.type == 'collage' ? '团' : ''}}</div>
                </div>
                <div class="list_hint">{{type == 'record' ? '参与时间' : '截止时间'}}：{{type == 'record' ? item.gmtTime : item.endTime}}</div>
            </div>
            <div class="list_right" v-if="type != 'record'">
                <span class="btn gray" v-if="status == 'end'">即将开始</span>
                <span class="btn orange" v-else>发起{{item.type == 'dynamic_bargain' ? '砍价' : item.type == 'collage' ? '拼团' : ''}}</span>
                <slot></slot>
            </div>
            <div class="list_right" v-else>
                <span class="text" :class="{'green': item.status == 1, 'gray': item.status == 0, 'red': item.status == -1}">{{returnStatusStr(item.status)}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import {point} from 'src/common/point.js';
export default {
    props: {
        type: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            default: 'start'
        },
        list: {
            type: Array,
            default(){
                return []
            }
        }
    },
    created() {
      point('37977.39405.39453')
    },
    computed: {
        activityStr(){
            let text = '';
            switch(this.item.type){
                case 'collage':
                    text = '拼团';
                    break;
                case 'dynamic_bargain':
                    text = '砍价';
                    break;
            }
            return text;
        }
    },
    methods: {
        returnStatusStr(status){
            let text = '';
            switch(Number(status)){
                case 0:
                    text = `待${this.activityStr}`;
                    break;
                case 1:
                    text = `${this.activityStr}成功`;
                    break;
                case -1:
                    text = `${this.activityStr}失败`;
                    break;
                default:
                    break;
            }
            return text;
        }
    }
}
</script>

<style lang="less" scoped>
    @import '../../assets/less/pl-less.less';
    .position();
    .list_warpper{
        background: #fff;
        margin-top: 10px;
    }
    .list_warpper_title{
        font-size: 14px;
        color: #3d4134;
        height: 48px;
        line-height: 48px;
        padding: 0 12px;
    }
    .list_item{
        .rel;
        padding: 10px 0;
        &:after{
            content: '';
            display: inline-block;
            width: 292px;
            height: 1px;
            background: #DCDEE3;
            .abs;
            right: 0;
            bottom: 0;
        }
        &.noBorder:after{
            display: none;
        }
        .list_left{
            .wh(64px);
            border-radius: 5px;
            display: inline-block;
            vertical-align: top;
            margin-left: 10px;
            .ta(center);
            box-sizing: border-box;
            overflow: hidden;
            color: rgba(255,255,255,0.7);
            border: 1px solid #ccc;
            border-radius: 2px;
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
                padding: 0 5px;
            }
        }
        .list_cont{
            display: inline-block;
            height: 64px;
            vertical-align: middle;
            padding: 0 10px;
            width: 200px;
            box-sizing: border-box;
            font-size: 12px;
            color: #3D4145;
            .list_name{
                .ellipsis();
            }
            .list_info{
                margin-top: 10px;
                .list_info_left{
                    display: inline-block;
                    vertical-align: bottom;
                    width: 120px;
                    .list_info_left_oen{
                        color: #E40F10;
                        span{
                            font-size: 15px;
                        }
                    }
                    .list_info_left_two{
                        text-decoration: line-through;
                        margin-left: 5px;
                    }
                }
                .list_info_right{
                    display: inline-block;
                    vertical-align: bottom;
                    width: 54px;
                    .l-h(18px);
                    border: 1px solid #DCDEE3;
                    .ta(center);
                    border-radius: 18px;
                }
            }
            .list_hint{
                margin-top: 7px;
            }
        }
        .list_right{
            display: inline-block;
            width: 64px;
            vertical-align: middle;
            float: right;
            margin: 20px 10px 20px 0;
            .rel;
            .btn{
                display: inline-block;
                width: 100%;
                .l-h(30px);
                font-size: 12px;
                .ta(center);
                color: #fff;
                border-radius: 30px;
                &.orange{
                    background: #EBC37D;
                }
                &.gray{
                    background: #DCDEE3;
                }
            }
            .text{
                display: inline-block;
                width: 100%;
                .l-h(30px);
                font-size: 15px;
                .ta(center);
                border-radius: 30px;
                &.green{
                    color: #09bb07;
                }
                &.gray{
                    color: #888;
                }
                &.red{
                    color: red;
                }
            }
        }
        a{
            .abs;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>
