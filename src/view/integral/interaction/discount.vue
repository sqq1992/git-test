<template>
    <div>
        <div class="discount_dialog m-content discountWidth">
            <el-dialog
                :title="step == 1 ? '选择商品':'设置折扣'"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :visible.sync="dialogVisible">
                <div class="fontClass inputSet set-discount-box" style="width: 100%">
                    <div class="step-goods" v-if="step == 1" style="width: 100%">
                        <div class="discount-tip" style="line-height: 20px;">
                            <p><span>1. 商品折扣和店铺满减活动、优惠券同时生效，请谨慎使用。</span></p>
                            <p><span>2. 设置的商品折扣不得低于店铺最低折扣</span><a href="https://prom.shop.jd.com/promotion/limit/mainPromoLimit.action" target="_blank">查看店铺最低折扣</a></p>
                            <p><span>3. 请勿选择近期参加平台秒杀的商品，否则促销将无法生效。</span><a href="https://jdprice.shop.jd.com/discount/query" target="_blank">查看店铺优惠监控</a></p>
                        </div>
                        <div class="mb_10">
                            <el-select v-model="queryType" placeholder="请选择" style="width: 110px;">
                                <el-option label="商品名称" :value="0"></el-option>
                                <el-option label="商品编号" :value="1"></el-option>
                            </el-select>
                            <el-input class="w200 ml_5" v-model="queryData.searchKey" auto-complete="off"></el-input>
                            <el-button type="text" class="ml_5" size='small' @click="getShopList()">查询</el-button>
                        </div>
                        <div class="discount-shop-box">
                           <div class="discount-shop-top">
                              <div>商品信息</div>
                              <div>操作</div>
                           </div>
                           <div class="discount-shop-tab">
                              <ul v-for="item in goodList">
                                  <li>
                                      <img :src="item.logo" alt="">
                                      <p>{{item.title}}</p>
                                      <p>¥{{item.price}}</p>
                                  </li>
                                  <li>
                                      <el-button type="text" class="ml_5" size='small' @click="checkGoods(item)">选取</el-button>
                                  </li>
                              </ul>
                           </div>
                        </div>
                        <div class="table_footer" v-if="queryData.total">
                            <el-pagination
                                layout="prev, pager, next"
                                :current-page="queryData.pageNo"
                                :page-size="queryData.pageSize"
                                @current-change="getShopList"
                                :total="queryData.total">
                            </el-pagination>
                        </div>
                    </div>
                    <div class="step-discount" v-if="step == 2" style="width: 100%">
                        <div class="discount-tip">
                            <span>商品折扣和店铺满减活动、优惠券同时生效，请谨慎使用；设置的商品折扣不得低于店铺最低折扣。</span>
                            <a href="https://prom.shop.jd.com/promotion/limit/mainPromoLimit.action" target="_blank">查看详情</a>
                        </div>
                        <!-- 查看的情况下 隐藏库存为0切换 -->
                        <div v-if="!editType == 'detail'"><el-checkbox v-model="showStockNumNullFlg">当前已{{showStockNumNullFlg ? '展示' : '隐藏'}}库存为0的sku数据</el-checkbox></div>
                         <skusTable
                          ref="skusTable"
                          :skusData="tableData"
                          :goodData="currentGood"
                          :status="!!tableData"
                          type="multi"
                        />
                        <div class="table_footer" v-if="discountTotal">
                            <el-pagination
                                layout="prev, pager, next"
                                :current-page="discountData.pageNo"
                                :page-size="discountData.pageSize"
                                @current-change="getActivityList"
                                :total="discountTotal">
                            </el-pagination>
                        </div>
                        <div class="mt_10" v-if="editType != 'detail'">
                            <el-form :label-position="labelPosition" label-width="100px" :model="setData">
                                <el-form-item label="优惠限制:">
                                    <p><el-radio v-model="setData.discountLimit" label="3">一个会员只能享受一次专享折扣优惠，第二次购买时恢复商品原价</el-radio></p>
                                    <p><el-radio v-model="setData.discountLimit" label="1">不限优惠次数，活动下架后恢复商品原价</el-radio></p>
                                </el-form-item>
                                <el-form-item label="单次购买限制:">
                                    <p><el-radio v-model="setData.buyLimit" label="1">单次购买<el-input @blur="blurInt('min')" class="w50 ml_5" v-model="setData.min" auto-complete="off"></el-input><span class="mr_5 ml_5">至</span><el-input @blur="blurInt('max')" v-model="setData.max" class="w50 mr_5" auto-complete="off"></el-input>件任意指定sku商品才能享受专享折扣优惠</el-radio></p>
                                    <p id="discountTip" class="error-tip red" v-if="Number(setData.min) > Number(setData.max)">单次购买开始值不能大于结束值！</p>
                                    <p id="discountTip" class="error-tip red" v-if="(Number(setData.min) > 10 || Number(setData.max) > 10) && Number(setData.min) <= Number(setData.max)">单次购买最大数量不能大于10！</p>
                                    <p><el-radio v-model="setData.buyLimit" label="0">不限单次购买数量</el-radio></p>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="discount-btn" v-if="editType != 'detail'">
                            <el-button size='small' @click="step=1">上一步</el-button>
			            	<el-button type="primary" @click="saveDisCount()" size='small'>确定</el-button>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import http from 'src/api/index.js';
import { clone } from 'src/common/public.js';
import skusTable from "src/components/skusTable/index";
export default {
    components:{
      skusTable
    },
    data(){
        return {
            editType: '',
            checkDiscount: false,
            dialogVisible: false,
            labelPosition: 'right',
            currentGood:{},
            step: 1,
            queryData: {
                pageNo: 1,
                pageSize: 5,
                total: 0
            },
            setData: {
                discountLimit: '3',
                buyLimit: '1',
                max: 1,
                min: 1
            },
            goodList: [],
            discountData: {
                pageNo: 1,
                pageSize: 20,
            },
            discountTotal: 0,
            queryType: 0,
            showStockNumNullFlg: false,
            checkSkuId:''
        }
    },
    methods: {
        setDiscount(type,skus) {
            this.dialogVisible = true;
            if(type) {
               this.step = 2;
               this.editType = type;
               let _arr = [];
               skus.forEach(item => {
                  _arr.push({
                      skuName: item.skuName,
                      jdPrice: Number(item.jdPrice),
                      finalPrice: Number(item.promoPrice),
                      discount:item.discount
                  })
               });
               this.tableData = _arr;
               console.log(this.tableData)
            }else {
               this.getShopList();
            }
        },
        getActivityList(page){
            this.queryData.pageNo = page || this.queryData.pageNo;

        },
        getShopList(pageNo){
            this.queryData.pageNo = pageNo || this.queryData.pageNo;
            let data = clone(this.queryData);
            if(this.queryType == 0){
                data.title = data.searchKey;
                data.wareIdStr = '';
            } else {
                data.wareIdStr = data.searchKey;
                data.title = '';
            }
            delete data.searchKey;
            http({
                api_name: 'activityQueryWare',
                data: data,
                vm: this
            }, (result) => {
                this.goodList = result.data.wareList;
                this.queryData.total = result.data.totalItem;
            });
        },
        checkGoods(json) {
            this.step = 2;
            if(this.setData.wareId && this.setData.wareId == json.wareId) {
                return false;
            }else {
                this.setData= {
                    discountLimit: '3',
                    buyLimit: '1',
                    max: 1,
                    min: 1
                };
                this.setData.activityName = json.title.substring(0,10);
                this.setData.wareId = json.wareId;
                this.setData.wareLogo = json.logo;
                this.currentGood = json;
            }
        },
        saveDisCount() {
            let vm = this,
                _sku = [],
                _price = '',
                _skuLen = '',
                _discount = '',
               _skusData = this.$refs.skusTable.getData(),
               _skusList = [];
            vm.checkDiscount = true;
            console.log(_skusData);
            if (Object.prototype.toString.call(_skusData) !== "[object Array]") {
              this.$message.error(_skusData.msg);
              return false;
            }
            _skusData.forEach((item,index) => {
               _sku.push({
                  skuId: item.skuId,
                  promoPrice: item.finalPrice || item.jdPrice,
                  bindType: 1
              })
              _skusList.push({
                skuId: item.skuId,
                promoPrice: item.finalPrice || item.jdPrice,
                skuName: item.skuName,
                wareLogo: this.setData.wareLogo,
                jdPrice: item.jdPrice,
                discount:item.discount
              })
            })
            if(!_skusList.length) {
                this.$message.error('请完成专享折扣设置！');
                return false;
            };
            if(document.getElementById('discountTip')) {
                return false;
            }
            let json = {
                activityName: vm.setData.activityName,
                freqBound: vm.setData.discountLimit,
                perMaxNum: vm.setData.buyLimit == 1 ? vm.setData.max : 0,
                perMinNum: vm.setData.buyLimit == 1 ? vm.setData.min : 0,
                promotionSkus: _sku,
                price: _skusList[0].jdPrice,//原价
                discount: _skusList[0].promoPrice,//这里 discount 作为到手价 不知道为什么之前这么定义参数名
                skuLen: _skusList.length,
                wareId: this.setData.wareId,
                wareLogo: this.setData.wareLogo,
                skus: _skusList
            };
            vm.$emit('getDisCountData',json);
            vm.dialogVisible = false;
        },
        blurInt(item) {
            let obj = this['setData'][item];
            if(!obj) {
                this.$set(this.setData,item, '1');
                return;
            }else if(isNaN(Number(obj)) || /\./.test(obj) || /\+/.test(obj) || Number(obj <= 0)) {
                this.$message.error('只能输入正整数！');
                this.$set(this.setData,item, '1');
                return;
            };
            return;
        },
		filterStockNumNull(row, index){
      let className = '';
      //查看情况下 不隐藏库存为0的商品
			if(row.isDefault || row.stockNum > 0 || this.showStockNumNullFlg || this.editType == 'detail'){
				className = '';
			} else {
				className = 'disNone';
			}
			return className
        }
    }
}
</script>

<style lang="less">
.discountWidth {
    .redInput {
        input {
            border-color: red !important;
        }
    }
    .el-dialog {
        &.el-dialog--small {
            width: 1000px;
        }
    }
    table {
        width: 100% !important;
        .redTab {
            .cell {
                color: red !important;
            }
        }
    }
    .el-table__empty-block {
        width: 100% !important;
    }
}
.step-discount {
    .el-table__body-wrapper {
        overflow-x: hidden;
    }
}
</style>
<style lang="less" scoped>
.m-content{
    .step-discount {
        .el-input {
             padding-bottom: 1px;
        }
        .w75 {
            width: 75px;
        }
        .el-table__body-wrapper {
            overflow-x: hidden;
        }
    }
    .discount-tip {
       font-size: 14px;
       margin-bottom: 20px;
       span {
           color: red;
       }
       a {
           color: #3089DE;
       }
    }
    .mt_10 {
        margin-top: 10px;
    }
    .ml_5 {
        margin-left: 5px;
    }
    .mr_5 {
        margin-right: 5px;
    }
    .mb_10 {
        margin-bottom: 10px;
    }
    .discount-btn {
        text-align: center;
        padding: 10px 0 0 0;
        border-top: 1px solid #ccc;
        button {
            width: 65px;
        }
    }
    .table_footer {
        text-align: right;
    }
    .discount-shop-box {
        .discount-shop-top {
            background: #eef1f6;
            line-height: 40px;
            border: 1px solid #dfe6ec;
            div {
                display: inline-block;
                padding: 0 18px;
                font-size: 12px;
                &:first-child {
                   width: 80%;
                }
            }
        }
        .discount-shop-tab {
            ul {
                border: 1px solid #dfe6ec;
                border-top: none;
                &:hover {
                    background: #eef1f6;
                }
                li {
                    display: inline-block;
                    position: relative;
                    min-height: 48px;
                    padding: 10px 18px;
                    &:first-child {
                    width: 80%;
                    }
                    img {
                        position: absolute;
                        top: 12px;
                        left: 18px;
                        width: 48px;
                        height: 48px;
                        display: block;
                    }
                    p {
                        padding-left: 60px;
                    }
                }
            }
        }
    }
}
</style>

