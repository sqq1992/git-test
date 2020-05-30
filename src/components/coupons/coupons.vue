<template>
    <div>
        <div class="module_control" v-if="data.coupons">
            <div class="module_title">
                会员专享券
                <div class="moduke_title_hint">（最多可添加10张会员专享券）</div>
            </div>
            <div class="module_content">
                <div class="module_coupons_item" v-for="(coupons, index) in data.coupons" :key="'coupons_'+index">
                    <span>{{coupons.activityName}}</span>
                    <a href="javascript:void(0)" class="el-icon-close" @click="delCoupons(index)"></a>
                </div>
                <div class="module_coupons_btn">
                    <a href="javascript:void(0);" @click="addCoupons()">添加会员专享券</a>
                </div>
            </div>
        </div>
        <div class="module_control" v-if="data.newUserCoupons">
            <div class="module_title">
                新会员专享券
                <div class="moduke_title_hint">（最多可添加6张新会员专享券）</div>
            </div>
            <div class="module_content">
                <div class="module_coupons_item" v-for="(newUserCoupons, index) in data.newUserCoupons" :key="'newUserCoupons_'+index">
                    <span>{{newUserCoupons.activityName}}</span>
                    <a href="javascript:void(0)" class="el-icon-close" @click="delCoupons(index)"></a>
                </div>
                <div class="module_coupons_btn">
                    <a href="javascript:void(0);" @click="addCoupons()">添加新会员专享券</a>
                </div>
            </div>
        </div>
        <div class="coupons_choose_dialog">
            <el-dialog :title="'选择'+(pageData.couponType == 'NEW_USER_COUPON' ? '新' : '')+'会员专享券'" :visible.sync="dialogTableVisible">
                <ul class="coupons_box">
                    <li class="coupons_item" v-for="item in couponsList" :key="item.id">
                        <div class="coupons_img">
                            <p class="coupons_price" v-if="item.discountType == 1">￥<span>{{item.discount}}</span></p>
                            <p class="coupons_price" v-if="item.discountType == 2"><span>{{item.discount}}</span>折</p>
                            <p>店铺优惠券</p>
                        </div>
                        <div class="coupons_info">
                            <div class="coupons_info_title">{{item.activityName}}</div>
                            <div class="coupons_info_desc">{{item.quotaStr}}</div>
                            <div class="coupons_info_hint">{{item.memberDayStr || item.levelsStr}}</div>
                        </div>
                        <div class="coupons_btn" @click="checkCoupons(item)">{{ couponsIdList.indexOf(item.id) == -1 ? '选取' : '已选取'}}</div>
                    </li>
                </ul>
                <div class="coupons_choose_bottom">
                    <el-pagination
                        layout="prev, pager, next"
                        :pageSize="pageData.pageSize"
                        :total="pageData.pageTotal"
                        :current-page="pageData.pageNo"
                        @current-change="changeCounponsList">
                    </el-pagination>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import http from 'src/api/index.js';
export default {
    props: {
        data: {
            type: Object,
            default: {}
        }
    },
    data(){
        return {
            pageData: {
                pageSize: 5,
                pageTotal: 20,
                pageNo: 1
            },
            couponsList: [],
            couponsIdList: [],
            dialogTableVisible: false
        }
    },
    methods: {
        getCouponsList(callback){
            let vm = this;
            http({
                api_name: 'memberCenterCouponList',
                vm: this,
                data: this.pageData
            }, result => {
                vm.pageData.pageTotal = result.data.total;
                vm.couponsList = result.data.coupons;
                callback && callback();
            }, result => {});
        },
        getCouponsIdList(){
            this.couponsIdList = [];
            let array = [];
            if(this.data.coupons && this.data.coupons.length > 0){
                array = this.data.coupons;
            } else if(this.data.newUserCoupons && this.data.newUserCoupons.length > 0){
                array = this.data.newUserCoupons;
            }
            array.forEach(item => {
                this.couponsIdList.push(item.id);
            });
        },
        addCoupons(){
            this.pageData.pageNo = 1;
            this.pageData.couponType = this.data.coupons ? 'COUPON' : 'NEW_USER_COUPON';
            this.getCouponsList(() => {
                this.dialogTableVisible = true;
                this.getCouponsIdList();
            });
        },
        delCoupons(index){
            if(this.data.coupons && this.data.coupons.length > 0){
                this.data.coupons.splice(index, 1);
            } else if(this.data.newUserCoupons && this.data.newUserCoupons.length > 0){
                this.data.newUserCoupons.splice(index, 1);
            }
        },
        checkCoupons(data){
            let array = [];
            if(this.data.coupons){
                array = this.data.coupons;
            } else if(this.data.newUserCoupons){
                array = this.data.newUserCoupons;
            }
            let index = this.couponsIdList.indexOf(data.id);
            if(index != -1){
                array.splice(index, 1);
            } else {
                array.push(data);
            }
            this.getCouponsIdList();
            this.dialogTableVisible = false;
        },
        changeCounponsList(pageNo){
            this.pageData.pageNo = pageNo;
            this.getCouponsList();
        }
    }
}
</script>

<style lang="less" scoped>
    .module_control {
        border: 1px solid #e6e6e6;
        padding: 12px;
        border-radius: 4px;
        background: #fafafa;
        color: #666;
        margin-top: 15px;
        .module_title {
            border-bottom: 1px solid #f0f0f0;
            font-size: 12px;
            padding-bottom: 5px;
            overflow: hidden;
            .moduke_title_hint {
                display: inline-block;
            }
        }
        .module_content {
            padding: 10px 0;
            font-size: 0;
            .module_coupons_item {
                color: #3089DE;
                position: relative;
                margin-top: 7px;
                height: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 30%;
                font-size: 12px;
                padding-right: 20px;
                box-sizing: border-box;
                display: inline-block;
                margin-right: 3%;
                &:first-child {
                    margin-top: 0;
                }
                a {
                    position: absolute;
                    right: 0;
                    color: #888;
                    font-size: 11px;
                    top: 4px;
                }
            }
            .module_coupons_btn {
                margin-top: 20px;
                font-size: 12px;
                a {
                    color: #3089DE;
                    display: inline-block;
                    width: 126px;
                    height: 26px;
                    border: 1px solid #3089DE;
                    border-radius: 2px;
                    text-align: center;
                    line-height: 26px;
                }
            }
        }
    }
    .coupons_choose_dialog{
        .coupons_box{
            .coupons_item{
                padding: 10px 0;
                .coupons_img{
                    display: inline-block;
                    width: 110px;
                    height: 75px;
                    vertical-align: top;
                    background: #E0B971;
                    border-radius: 4px;
                    color: rgba(255,255,255,0.7);
                    text-align: center;
                    padding: 0 5px;
                    box-sizing: border-box;
                    overflow: hidden;
                    p{
                        font-size: 12px;
                        &.coupons_price{
                            font-size: 11px;
                            vertical-align: bottom;
                            border-bottom: 1px dashed #D1A149;
                            font-weight: 900;
                            color: #fff;
                            span{
                                font-size: 30px;
                            }
                        }
                    }
                }
                .coupons_info{
                    display: inline-block;
                    width: ~'calc(100% - 200px)';
                    margin-left: 20px;
                    overflow: hidden;
                    vertical-align: top;
                    .coupons_info_title{
                        font-size: 14px;
                        color: #333;
                        margin-top: 5px;
                    }
                    .coupons_info_desc{
                        font-size: 12px;
                        color: #666;
                        margin: 5px 0;
                    }
                    .coupons_info_hint{
                        color: red;
                    }
                }
                .coupons_btn{
                    vertical-align: top;
                    display: inline-block;
                    width: 60px;
                    text-align: center;
                    line-height: 55px;
                    cursor: pointer;
                    color: #3089DE;
                }
            }
        }
        .coupons_choose_bottom{
            text-align: right;
        }
    }
</style>

