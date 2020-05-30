<template>
    <div>
        <div class="coupons_choose_dialog m-content">
            <el-dialog
                title="选择优惠券"
                width="35%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :visible.sync="dialogVisible">
                <nav class="view_nav">
                    <a href="javascript:;" v-if="showCouponBtn" class="view_nav_item" :class="{'active': showTab == 1}" @click="tabSwitch(1)">选择优惠券</a>
                    <a href="javascript:;" class="view_nav_item" :class="{'active': showTab == 2}" @click="tabSwitch(2)">手动添加</a>
                </nav>
                <div class="tips">活动设置仅为兑换限制，优惠券链接存在传播的风险，请控制优惠面额，避免资损。</div>
                <div v-loading="loadingDia" class="fontClass inputSet" v-if="showTab == 1">
                    <div class="row_line">
                        <a class="blueColor" href="https://prom.shop.jd.com/coupon/init.action" target="_blank">新建优惠券</a>
                        <el-button style="margin-left:10px;" type="text" @click="getCouponsList">刷新</el-button>
                        <span style="font-size: 12px;color: #666;">请创建【当前有效】【免费领取】【不公开】【全平台】优惠券</span>
                    </div>
                    <div class="row_line">
                        <el-form :inline="true" :model="formInline" class="demo-form-inline">
                            <el-form-item label="优惠券名称：">
                                <el-input @keyup.native.enter="getCouponsList" class="inpWidth" v-model="formInline.user" placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item label="使用范围：">
                                <el-select @change="getCouponsList" class="inpWidth" v-model="formInline.region" placeholder="">
                                    <el-option label="不限" value=""></el-option>
                                    <el-option label="全店铺" value="1"></el-option>
                                    <el-option label="限定商品" value="2"></el-option>
                                    <el-option label="限定某些商品不参加" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="f-fr">
                                <el-button size="small" type="text" @click="getCouponsList">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <ul class="coupon">
                        <div v-if="coupons.length > 0" >
                            <li v-for="(item, index) in coupons" :key="index" class="clearfix">
                                <div class="couponIcon f-fl">
                                    <img src="../../../assets/images/u2181.png" height="64" width="64">
                                    <p >
                                        <span v-if="item.discountType == 2">{{item.discount*10}}折</span>
                                        <span  v-if="item.discountType == 1">¥{{item.discount}}</span>
                                    </p>
                                    <p>{{item.bindType == 1 ? '店铺优惠券' : '商品优惠券'}}</p>
                                </div>
                                <div class="couponMess f-fl">
                                    <span>{{item.name}}</span><br />
                                    <span class="leftSpan oneLine">满{{item.quota}}元可用</span>
                                    <span class="rightSpan f-fr">{{item.bindType == 1 ? '全店可用' : '部分可用'}}</span><br />
                                    <span class="leftSpan oneLine m_r10">总数量：{{item.num}}</span>
                                    <span class="rightSpan f-fr m_l10">已发放：{{item.takeNum}}</span>
                                </div>
                                <div v-if="item.couponId != checkedId" class="couponBut blueColor cursor f-fr" @click="chooseItem(item)">选取</div>
                                <div v-else class="couponBut cursor f-fr">已选取</div>
                            </li>
                        </div>
                        <li v-if="!coupons.length" class="no-data">暂无数据</li>
                    </ul>
                    <div class="text-center" v-if="pageInfo.total">
                        <el-pagination
                            :current-page="pageInfo.pageNo"
                            @current-change="handleCurrentChange"
                            :page-size="pageInfo.pageSize"
                            layout="prev, pager, next"
                            :total="pageInfo.total">
                        </el-pagination>
                    </div>
                </div>
                <div v-else class="manual-box">
                    <el-form :inline="true" :model="customCoupon" class="demo-form-inline">
                        <el-form-item label="优惠券名称：">
                            <el-input class="w200" v-model="customCoupon.name" placeholder=""></el-input>
                            <span>{{customCoupon.name.length}}/20</span>
                            <p class="error-tip red" v-if="customCoupon.name.length > 20">优惠券名称最多20个字！</p>
                            <p class="error-tip red" v-if="!customCoupon.name && customOk">优惠券名称不能为空！</p>
                        </el-form-item>
                        <el-form-item label="领券链接：">
                            <el-input class="w320" v-model="customCoupon.link" placeholder="请复制优惠券的移动端链接（coupon.m.jd.com）"></el-input>
                            <a class="fc_blue ml_5" href="https://prom.shop.jd.com/coupon/listNew.action" target="_blank">复制链接</a>
                            <p class="error-tip red" v-if="!customCoupon.link && customOk">领券链接不能为空！</p>
                            <p class="error-tip red" v-if="customCouponLinkError  && customOk">领券链接格式不正确！</p>
                        </el-form-item>
                        <el-form-item label="优惠券类型：">
                            <el-radio class="radio" v-model="customCoupon.bindType" label="1">店铺优惠券</el-radio>
                            <el-radio class="radio" v-model="customCoupon.bindType" label="2">商品优惠券</el-radio>
                        </el-form-item>
                        <el-form-item label="使用门槛：">
                            <span>满</span>
                            <el-input class="w50" @blur="blurInp('quota')" v-model="customCoupon.quota" placeholder=""></el-input>
                            <span>元可用</span>
                            <p class="error-tip red" v-if="!customCoupon.quota && customOk">使用门槛金额不能为空！</p>
                        </el-form-item>
                        <el-form-item label="优惠券面值：" style="display: block">
                            <el-input class="w75 mr_10" @blur="blurInp('discount')" v-model="customCoupon.discount" placeholder=""></el-input>
                            <el-radio class="radio" v-model="customCoupon.discountType" label="1">元</el-radio>
                            <el-radio class="radio" v-model="customCoupon.discountType" label="2">折</el-radio>
                            <p class="error-tip red" v-if="!customCoupon.discount && customOk">优惠券面值不能为空！</p>
                            <p class="error-tip red" v-if="customCoupon.quota && customCoupon.discount && customCoupon.discountType == 1 && Number(customCoupon.discount) > Number(customCoupon.quota)">优惠券面值不能大于{{customCoupon.quota}}元！</p>
                        </el-form-item>
                        <el-form-item style="text-align: center;display: block;">
                            <el-button size='small' @click="confirm" type="primary" class="w75">确定</el-button>
                            <el-button size='small' @click="cancelCoupon" class="w75">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
        </div>
        <el-dialog
            class="diaWidth"
            title="优惠券折扣提示"
            :visible.sync="noticeDialog"
        >
            <p class="indent">
                活动设置仅为兑换限制，<span class="red">优惠券链接存在传播风险</span>，
                您当前设置<span class="red">优惠券折扣已低于5折</span>，为避免资损，请确认是否继续使用该优惠券
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="noticeDialog = false">重新选择</el-button>
                <el-button type="primary" @click="doubleConfirm">确认使用</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import http from 'src/api/index.js';
import store from 'src/store';
export default {
    props: {
        data: {
            type: Object,
            default: {},
        }
    },
    data(){
        return {
            showCouponBtn: false,
            customOk: false,
            rewardIndex: '',
            checkedId: '',
            pageInfo: {
                pageNo: 1,
                pageSize: 5,
                total: 0
            },
            customCouponLinkError: false,
            dialogVisible: false,
            loadingDia: false,
            formInline: {
                user: '',
                region: ''
            },
            customCoupon: {
               bindType: "1",
               name: "",
               discountType: "1",
               quota: "",
               discount: "",
               link: ""
            },
            coupons: [],
            allData: [],
            couponsList: [],
            couponsIdList: [],
            showTab: 1,
            noticeDialog: false,
            chooseData: {}
        }
    },
    watch: {
        'dialogVisible' (val){
            this.customOk = false;
        },
        'customCoupon.discountType'(val) {
            if(val == 2 && this.customCoupon.discount > 10) {
               this.customCoupon.discount = '10';
            }else if(val == 1) {
                this.customCoupon.discount = this.customCoupon.discount ? parseInt(this.customCoupon.discount) : '';
            }
        }
    },
    mounted(){

    },
    beforeDestroy(){

    },
    methods: {
        tabSwitch(index) {
            this.showTab = index;
        },
        addCoupons(index,checkedId, custom){
            //自营
            if(store.state.ziying.isZiying) {
               this.showTab = 2;
               this.showCouponBtn = false;
            }else {
               this.showCouponBtn = true;
            };
            //自定义优惠券
            if(custom) {
                this.showTab = 2;
                custom.bindType += '';
                custom.discountType += '';
                if (custom.discountType == 2 && custom.discount < 1) custom.discount = custom.discount * 10
                this.$set(this,'customCoupon', custom);

            }else {
                this.showTab = store.state.ziying.isZiying ? 2 : 1;
                this.customCoupon = {
                    bindType: "1",
                    name: "",
                    discountType: "1",
                    quota: "",
                    discount: "",
                    link: ""
                };
            }
            this.rewardIndex = index;
            this.checkedId = checkedId;
            this.pageInfo.pageNo = 1;
            this.getCouponsList();
        },
        getCouponsList() {
            http({
                api_name: 'couponQuery',
                vm: this,
                data: {
                    bindType: this.formInline.region,
                    couponName: this.formInline.user
                }
            }, (res) => {
                this.dialogVisible = true;
                this.allData = res.data ? (res.data.couponList ? res.data.couponList : []) : [];
                this.pageInfo.total = this.allData.length;
                this.coupons = this.allData.slice(0, 5);
            }, (error) => {});
        },
        chooseItem(item) {//选取
            let countDiscount = parseFloat(item.discount / item.quota)
            this.chooseData = item // 存到公共变量里
            if (item.discountType == 2 && item.discount <= 0.5) { // 低于5折时设置double click提示
                this.noticeDialog = true
            } else if (item.discountType == 1 && countDiscount >= 0.5) { // 满减计算低于5折(50%)
                this.noticeDialog = true
            } else { //大于5折直接执行
               this.confirmChoose()
            }
        },
        confirmChoose() { // 自动添加
            this.dialogVisible = false;
            this.chooseData.couponSource = this.showTab;
            this.$emit('showCoupon',this.chooseData,this.rewardIndex);
        },
        handleCurrentChange(e) {
            this.pageInfo.pageNo = Number(e);
            let startIndex = (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize;
            let endIndex = (startIndex + this.pageInfo.pageSize) > this.pageInfo.total ? this.pageInfo.total : (startIndex + this.pageInfo.pageSize);
            this.coupons = this.allData.slice(startIndex, endIndex);
        },
        confirm() { // 手动添加
            // 校验通过才能判断是否5折
            let vm = this,
            isOk = true;
            vm.customOk = true;
            vm.customCouponLinkError = false;
            for(let item in vm.customCoupon) {
                if(!vm.customCoupon[item]) {
                    isOk = false;
                }else if(item == 'link' && (vm.customCoupon[item].indexOf('coupon.jd.com/ilink/couponSendFront/send_index.action') == -1 && vm.customCoupon[item].indexOf('coupon.m.jd.com/coupons/show.action') == -1)) {
                    vm.customCouponLinkError = true;
                    isOk = false;
                }else if(item == 'discount' && vm.customCoupon.discount && vm.customCoupon.discountType == 1 && Number(vm.customCoupon.discount) > Number(vm.customCoupon.quota)) {
                    isOk = false;
                }else if(item == 'name' && vm.customCoupon[item].length > 20) {
                    isOk = false;
                }
            };
            let countDiscount = parseFloat(vm.customCoupon.discount / vm.customCoupon.quota)
            if (isOk) {
                if (vm.customCoupon.discountType == 2 && vm.customCoupon.discount <= 5) { // 低于5折时设置double click提示
                    vm.noticeDialog = true
                } else if (vm.customCoupon.discountType == 1 && countDiscount >= 0.5) { // 满减计算低于5折(50%)
                    vm.noticeDialog = true
                } else { //大于5折直接执行
                    this.createCoupon()
                }
            }
        },
        doubleConfirm() {
            if (this.showTab == 1 ) {
                this.confirmChoose()
            } else {
                this.createCoupon()
            }
            this.noticeDialog = false // 先关闭提示弹窗
        },
        createCoupon() {
            let vm = this
            vm.customCoupon.couponSource = vm.showTab;
            if(vm.customCoupon.discountType == 2) {
                vm.customCoupon.discount = vm.customCoupon.discount / 10;
            }
            vm.$emit('showCoupon',vm.customCoupon,vm.rewardIndex);
            vm.dialogVisible = false;
        },
        cancelCoupon() {
          this.dialogVisible = false;
        },
        blurInp(item) {
            let obj = this['customCoupon'][item],
                isZK = item == 'discount' && this.customCoupon.discountType == 2,
                isDecimal = isZK ? false : /\./.test(obj);
            if(!obj) {
                this['customCoupon'][item] = '1';
                return;
            }else if(isNaN(Number(obj)) || isDecimal || /\+/.test(obj) || Number(obj <= 0)) {
                this.$message.error(isDecimal ? '只能输入数字！' : '只能输入正整数！');
                this['customCoupon'][item] = '1';
                return;
            }else if(isZK) {
                    if(Number(obj > 10)) {
                     this.$message.error('折扣不能大于10！');
                     this['customCoupon'][item] = '10';
                    }else if(true) {
                        if(obj.split('.')[1] && obj.split('.')[1].length > 1) {
                            this['customCoupon'][item] = Math.floor(Number(obj) * 10) / 10
                        }
                    }
            }
            return;
        },
    }
}
</script>

<style lang="less">
.coupons_choose_dialog {
    .el-dialog__body {
        padding-top: 0px;
    }
}
</style>
<style lang="less" scoped>
    .view_nav{
        height: 46px;
        border-bottom: 1px solid #ccc;
        line-height: 46px;
        margin-bottom: 10px;
        .view_nav_item{
            width: 100px;
            display: inline-block;
            text-align: center;
            height: 43px;
            line-height: 46px;
            border-bottom: 3px solid transparent;
        }
        .active{
            border-color: #3089dc;
            color: #3089dc;
        }
    }
	.m-content{
		.inpWidth{
			width: 110px;
        }
        .w50 {
            width: 50px;
        }
        .w75 {
            width: 75px;
        }
        .mr_10 {
            margin-right: 10px;
        }
        .w200 {
            width: 200px;
        }
        .w300 {
            width: 300px;
        }
        .w320 {
            width: 320px;
        }
        .fc_blue {
            color: #3089dc;
        }
        .ml_5 {
            margin-left: 5px;
        }
		.coupon{
			width: 100%;
			li{
				width: 100%;
				box-sizing: border-box;
				height: 94px;
				border: 1px solid #ddd;
				border-bottom: none;
				padding: 12px;
                overflow: hidden;
                &.no-data {
                    text-align: center;
                    line-height: 69px;
                }
				.couponIcon{
					position: relative;
					overflow: hidden;
					height: 100%;
					width: 64px;
					img{
						position: absolute;
						z-index: -1;
						top: 0;
					    display: block;
					    transform-origin:center center; //旋转中心要是正中间 才行
					    transform: rotate(90deg);
					    -webkit-transform: rotate(90deg);
					    -moz-transform: rotate(90deg);
					    -ms-transform: rotate(90deg);
					    -o-transform: rotate(90deg);
					}
					p{
						margin-top: 10px;
						color: white;
						text-align: center;
						font-size: 12px;
						font-weight: 700;
						span{
							font-size: 16px;
						}
					}
					p:last-child{
						margin-top: 5px;
					}
				}
				.couponMess{
					//max-width: 360px;
					margin-left: 50px;
					overflow: hidden;
					span{
						display: inline-block;
						height: 21px;
						line-height: 21px;
					}
					.leftSpan{
						// min-width: 100px;
						max-width: 230px;
						// overflow: hidden;
					}
					.rightSpan{
						width: 98px;
						overflow: hidden;
					}
				}
				.couponBut{
					line-height: 68px;
				}
			}
			li:last-child{
				border-bottom: 1px solid #ddd;
            }
        }
        .error-tip {
		   line-height: 14px;
		   font-size: 12px;
	    }
    }
</style>

