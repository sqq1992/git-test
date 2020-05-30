<template>
    <div>
        <integral-top></integral-top>
        <div class="list fontClass" v-loading="listLoading">
            <div class="record_top">
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">礼品名称：</span>
                    <el-input v-model="queryData.giftName" style="width: auto;"></el-input>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">礼品类型：</span>
                    <el-select v-model="queryData.giftType" class="ui-filter-pd">
                        <el-option :value="''" label="不限"></el-option>
                        <el-option :value="'coupon,jd_coupon_activity'" label="优惠券"></el-option>
                        <el-option :value="'commodity'" label="实物奖品"></el-option>
                        <el-option :value="'gift_wareDiscount'" label="商品折扣"></el-option>
                    </el-select>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">上架状态：</span>
                    <el-select v-model="queryData.status" class="ui-filter-pd">
                        <el-option :value="''" label="不限"></el-option>
                        <el-option :value="'valid'" label="已上架"></el-option>
                        <el-option :value="'wait'" label="待上架"></el-option>
                        <el-option :value="'invalid'" label="已下架"></el-option>
                    </el-select>
                </span>
                <el-button size='small' @click="getActivityList(1)" class="queryBtn">查询</el-button>
            </div>
            <list-sort type='gift' :getList="getAllGiftList" :header="headers" :data="allGiftList" :sort1="descOrder" :sort2="ascOrder" :sort3="descIntegral" :sort4="ascIntegral" @checkSortList="checkSortList"></list-sort>
            <div class="list_table gift_list_tab">
                <el-table
                    :data="tableData"
                    :border="false"
                    style="width: 100%">
                    <el-table-column label="礼品名称" min-width="120" align="left" prop="giftName" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="礼品类型" min-width="80" align="left">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{giftMap[scope.row.giftType]}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="面值" align="left" min-width="80">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    <el-tooltip class="itemPrice" effect="dark" :content="scope.row.price+(scope.row.couponCheckType == 2 ? '折' : '元')" placement="top-start">
                                        <div class="itemPrice" v-if="scope.row.price">
                                            <span>{{scope.row.price | numFormat(scope.row.price.toString().indexOf('.') != -1 ? scope.row.couponCheckType == 2 ? 1 : 2 : 0)}}{{scope.row.couponCheckType == 2 ? '折' : '元'}}</span>
                                        </div>
                                        <div class="itemPrice">--</div>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <!-- TODO -->
                    <el-table-column label="所需积分" align="left" min-width="80">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    <div class="itemPrice">
                                        <span>{{scope.row.needPoint}}积分</span>
                                    </div>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="总库存" align="left" min-width="60">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.allCount | numFormat}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="剩余库存" align="left" min-width="60">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.balanceCount | numFormat}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="上下架时间" align="left" min-width="180">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    <p>上架：{{scope.row.upTime}}</p>
                                    <p>下架：{{scope.row.downTime}}</p>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="上架状态" align="left" min-width="80">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{statusMap[scope.row.status]}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" min-width="200">
                        <template scope="scope">
                            <el-row>
                                <el-col v-if="scope.row.status == 'valid'">
                                    <el-button type="text" class="m_r5" @click="edit(scope.row)">编辑</el-button>
                                    <!-- <el-button class="m_r5" type="text" @click="delStock(scope.row)">扣减库存</el-button> -->
                                    <el-button class="m_r5" type="text" @click="down(scope.row)">立即下架</el-button>
                                    <el-button v-if="scope.row.giftType == 'gift_wareDiscount'" class="m_r5" type="text" @click="promotionAudit(scope.row)">促销审核</el-button>
                                    <el-button type="text" @click="preview(scope.row)">提取链接</el-button>
                                </el-col>
                                <el-col v-else-if="scope.row.status == 'wait'">
                                    <el-button class="m_r5" type="text" @click="edit(scope.row)">编辑</el-button>
                                    <el-button class="m_r5" type="text" v-if="scope.row.giftType !== 'jd_coupon_activity'" @click="upGift(scope.row)">立即上架</el-button>
                                    <el-button v-if="scope.row.giftType == 'gift_wareDiscount'" class="m_r5" type="text" @click="promotionAudit(scope.row)">促销审核</el-button>
                                    <el-button class="m_r5" type="text" @click="preview(scope.row)">提取链接</el-button>
                                    <el-button type="text" @click="deleterow(scope.row)">删除</el-button>
                                </el-col>
                                <el-col v-else-if="scope.row.status == 'invalid'">
                                    <el-button class="m_r5" type="text" @click="edit(scope.row)">查看</el-button>
                                    <el-button class="m_r5" type="text" @click="edit(scope.row, 'copy')">快速拷贝</el-button>
                                    <el-button type="text" @click="deleterow(scope.row)">删除</el-button>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="table_footer">
                    <el-pagination
                        layout="prev, pager, next"
                        :current-page="queryData.pageNo"
                        :page-size="queryData.pageSize"
                        @current-change="getActivityList"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <qr-dialog ref="qrDetail"></qr-dialog>
        <del-stock ref="delStock"></del-stock>
        <discount-tip-dialog ref="discountTip"></discount-tip-dialog>
    </div>
</template>

<script>
import integralTop from 'src/components/integral-interaction/integral-top';
import ajax from 'src/api/index.js';
import { clone } from 'src/common/public.js';
import dateFormat from '../../../common/dateFormat.js';
import qrDialog from 'src/components/integral-interaction/qrcode.vue';
import delStock from 'src/components/integral-interaction/delStock.vue';
import discountTipDialog from 'src/components/integral-interaction/discountTip.vue';
import listSort from 'src/components/list-sort/list-sort.vue';
import {point} from 'src/common/point.js';
export default {
    data(){
        return {
            tableData: [],
            queryData: {
                pageNo: 1,
                pageSize: 20,
                giftName: '',
                giftType: '',
                status: ''
            },
            giftMap: {
                'coupon': '优惠券',
                'commodity': '实物奖品',
                'gift_wareDiscount': '商品折扣',
                'jd_coupon_activity': '优惠券',
            },
            statusMap: {
                'wait': '待上架',
                'valid': '已上架',
                'invalid': '已下架'
            },
            total: 0,
            listLoading: true,
            headers: [
                {
                    key: 'giftName',
                    text: '礼品名称',
                    width: 150
                },
                {
                    key: 'upTime',
                    text: '上架时间'
                },
                {
                    key: 'downTime',
                    text: '下架时间'
                },{
                    key: 'balanceCount',
                    text: '剩余库存'
                },{
                    key: 'needPoint',
                    text: '积分'
                }
            ],
            allGiftList: []
        }
    },
    created(){
        point('37977.39404.39440');
        this.queryData.giftName = sessionStorage.getItem('sendGiftMsgName') || '';
        sessionStorage.removeItem('sendGiftMsgName');
        this.getActivityList(1);
    },
    methods: {
        getActivityList(page){
            this.queryData.pageNo = page || this.queryData.pageNo;
            this.listLoading = true;
            let queryData = clone(this.queryData);
            ajax({
                api_name: 'giftList',
                data: queryData,
                vm: this
            }, result => {
                this.tableData = result.data.list;
                this.total = result.data.total;
                this.listLoading = false;
            });
        },
        deleterow(item) {
            this.$confirm('确定删除该礼品吗？', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.listLoading = true;
                ajax({
                    api_name: 'removeGift',
                    data: {
                        id: item.id
                    },
                    vm: this
                }, (res) => {
                    this.getActivityList(1);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }, (error) => {
                    this.getActivityList(1);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                });
            }).catch(() => {
            });
        },
        down(item) {
            this.$confirm('确定下架该礼品吗？', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.listLoading = true;
                ajax({
                    api_name: 'giftOnOff',
                    data: {
                        id: item.id,
                        type:"invalid"
                    },
                    vm: this
                }, (res) => {
                    this.getActivityList();
                    this.$message({
                        message: '礼品下架成功'
                    });
                }, (error) => {
                    this.listLoading = false;
                });
            }).catch(() => {
            });
        },
        //促销审核
        promotionAudit(item) {
            let vm = this;
            ajax({
                api_name: 'giftById',
                data: {
                    id: item.id
                }
            }, result => {
                let json = result.data.discountJson,
                    promoId = '';
                json = JSON.parse(json);
                promoId = json.promoId;
                //促销审核请求
                ajax({
                    api_name: 'approveUnitPromotionWrite',
                    data: {
                        promoId: promoId
                    }
                }, result => {
                    vm.$refs.discountTip.show("close", {
                        title: '促销审核',
                        content: '已审核，请致<a href="https://prom.shop.jd.com/promotion/info/info_queryPromotions.action" target="_blank">商家后台-促销列表</a>查看对应商品促销是否已生效。',
                        okVal: '确定'
                    });
                }, error => {
                    vm.$message.success('促销已审核！');
                });
            }, error => {
                vm.$message.success('促销已审核！');
            });
        },
        upGift(item) {
            this.$confirm('确定立即上架该礼品吗？', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.listLoading = true;
                ajax({
                    api_name: 'giftOnOff',
                    data: {
                        id: item.id,
                        type:"valid"
                    },
                    vm: this
                }, (res) => {
                    this.getActivityList();
                    this.$message({
                        message: '礼品上架成功'
                    });
                }, (error) => {
                    this.listLoading = false;
                });
            }).catch(() => {
            });
        },
        edit(data, type = '') {
            switch (data.giftType) {
                case 'commodity':
                    this.$router.push({path: '/matter',query:{id: data.id, type}});
                    break;
                case 'coupon':
                    this.$router.push({path: '/giftCoupon',query:{id: data.id, type}});
                    break;
                case 'jd_coupon_activity':
                    this.$router.push({path: '/jdGiftCoupon',query:{id: data.id, type}});
                    break;
                case 'gift_wareDiscount':
                    this.$router.push({path: '/discount',query:{id: data.id, type}});
                    break;
                default:
                    break;
            }
        },
        preview(data) {
            this.$refs.qrDetail.showMsg(data,'gift');
        },
        descOrder(a, b){
            return new Date(b.upTime.replace(/\-/g, '/')).getTime() - new Date(a.upTime.replace(/\-/g, '/')).getTime();
        },
        ascOrder(a, b){
            return b.balanceCount - a.balanceCount;
        },
        descIntegral(a, b){
            return parseInt(b.needPoint) - parseInt(a.needPoint);
        },
        ascIntegral(a, b){
            return parseInt(a.needPoint) - parseInt(b.needPoint);
        },
        checkSortList(dataList){
            let metaData = clone(this.allGiftList).reduce((a, b) => {
                return a.concat([b.id])
            }, []);
            dataList = dataList.reduce((a, b) => {
                return a.concat([b.id])
            }, []);
            console.log(metaData, dataList);

            metaData = metaData.join(',');
            dataList = dataList.join(',');
            // 如果一致就不上传了
            if(metaData == dataList){
                this.$message({
                    message: '排序成功',
                    type: 'success'
                });
                return;
            }
            ajax({
                api_name: 'saveGiftOrderList',
                data: {
                    afterId: dataList,
                    beforeId: metaData
                },
                vm: this
            }, result => {
                this.$message({
                    message: '排序成功',
                    type: 'success'
                });
            });
        },
        getAllGiftList(){
            ajax({
                api_name: 'giftList',
                data: {
                    isMobile: 1,
                    pageSize: 1000
                },
                vm: this
            }, result => {
                this.allGiftList = result.data.list;
            });
        },
        delStock(data) {
            this.$refs.delStock.showStock(data);
        }
    },
    components: {
        integralTop,
        qrDialog,
        discountTipDialog,
        listSort,
        delStock
    }
}
</script>

<style lang="less">
    .ui-filter-item-group{
        display: inline-block;
        margin-right: 20px;
        margin-top: 10px;
        .ui-filter-hd{
            display: inline-block;
            width: 60px;
            text-align: right;
            font-size: 12px;
        }
        .w100{
            width: 100px;
        }
        .el-input{
            height: 30px;
            .el-input__inner{
                height: 100%;
            }
        }
        .ui-filter-pd{
            width: 140px;
        }
    }
    .gift_list_tab .el-button+.el-button {
        margin-left: 0;
    }
</style>

<style lang="less" scoped>
    .list{
        padding: 10px 20px;
        .list_table{
            margin-top: 20px;
        }
        .table_footer{
            text-align: right;
        }
        .queryBtn{
            vertical-align: middle;
            margin-top: 3px;
        }
        .itemPrice{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
</style>
