<template>
    <div>
        <integral-top></integral-top>
        <div class="list fontClass" v-loading="listLoading" :element-loading-text="loadingText">
            <div class="record_top">
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">会员账号：</span>
                    <el-input v-model="queryData.pin" style="width: auto;"></el-input>
                </span>
                <!-- <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">会员昵称：</span>
                    <el-input v-model="queryData.nick" style="width: auto;"></el-input>
                </span> -->
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">礼品名称：</span>
                    <el-input v-model="queryData.pointsResource" style="width: auto;"></el-input>
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
                    <span class="ui-filter-hd w100">提交时间：</span>
                    <el-date-picker
                        v-model="queryData.startTime"
                        type="date"
                        placeholder="选择日期"
                        class="ui-filter-pd"
                        :picker-options="pickerStartTime">
                    </el-date-picker> -
                    <el-date-picker
                        v-model="queryData.endTime"
                        type="date"
                        placeholder="选择日期"
                        class="ui-filter-pd"
                        :picker-options="pickerEndTime">
                    </el-date-picker>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">发放状态：</span>
                    <el-select v-model="queryData.giveStatus" class="ui-filter-pd">
                        <el-option :value="''" label="不限"></el-option>
                        <el-option :value="'9'" label="发放成功"></el-option>
                        <el-option :value="'0'" label="未发放"></el-option>
                        <el-option :value="'-2'" label="发放失败"></el-option>
                    </el-select>
                </span>
                <el-button size='small' @click="getActivityList(1)" class="queryBtn">查询</el-button>
                <el-button size="small" type="primary" @click="exportRecord()" class="queryBtn">导出记录</el-button>
            </div>
            <div class="record_btns">
                <a href="/gift/exportCommodityGiftList?giveStatus=0" class="primary_btn" target="_blank">批量导出未发放实物礼品兑换记录</a>
                <el-upload
                    action="/gift/importCommodityGiftList"
                    :on-success="handleFileSuccess"
                    :before-upload="beforeFileUpload"
                    :showFileList=false
                    :on-error="handleFileError"
                    style="display: inline-block;margin-left: 20px;">
                    <el-button type="primary">批量发放实物礼品</el-button>
                </el-upload>
                <router-link class="link" :to="{name: 'promotionExchange'}" target="_blank">如何批量发放实物礼品？</router-link>
            </div>
            <div class="list_table">
                <el-table
                    :data="tableData"
                    :border="false"
                    style="width: 100%">
                    <el-table-column label="会员账号" min-width="170" align="left">
                      <template scope="scope">
                        <el-row>
                          <el-col>
                            <span v-if="scope.row.pin">{{scope.row.pin}}</span>
                            <el-tooltip :content="scope.row.customerPin" popper-class="my_poper" placement="top" v-else-if="scope.row.customerPin">
                              <span class="clamp_two_row">
                                <span class="mi_icon">密</span>
                                {{scope.row.customerPin}}
                              </span>
                            </el-tooltip>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column label="会员昵称" min-width="150" prop="nick" align="left" :show-overflow-tooltip="true">
                    </el-table-column> -->
                    <el-table-column label="礼品名称" align="left" prop="giftName" min-width="150" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="礼品类型" align="left" min-width="100">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{giftMap[scope.row.giftType]}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="礼品面值" align="left" min-width="100">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    <span>{{scope.row.price | numFormat(scope.row.price.toString().indexOf('.') != -1 ? scope.row.couponCheckType == 2 ? 1 : 2 : 0)}}{{scope.row.couponCheckType == 2 ? '折' : '元'}}</span>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="消耗积分" align="left" min-width="100">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.giveStatus == -2 ? '0' : scope.row.point}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="提交时间" align="left" min-width="200">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.createdTime}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="发放状态" align="left" min-width="100">
                        <template scope="scope">
                            <el-row>
                                <el-col :class="{'green': scope.row.giveStatus == '9'}">
                                    {{statusMap[scope.row.giveStatus]}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="关联订单" align="left" min-width="100">
                        <template scope="scope">
                            <el-row>
                                <el-col :class="{'blue': scope.row.orderId, 'hover': scope.row.giftType == 'gift_wareDiscount'}">
                                    <div @click="shwOrderDetail(scope.row.orderId, scope.row)" v-if="scope.row.giftType == 'gift_wareDiscount'">{{scope.row.orderId | nullFormat}}</div>
                                    <div v-else>--</div>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" min-width="120">
                        <template scope="scope">
                            <el-row>
                                <el-col v-if="scope.row.giveStatus == '0'">
                                    <el-button type="text" @click="sendGift(scope.row,'send')">发放</el-button>
                                </el-col>
                                <el-col v-else-if="scope.row.giveStatus == '9'">
                                    <el-button type="text" @click="sendGift(scope.row,'detail')">查看</el-button>
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
        <send-dialog ref="sendDetail" @getList="getActivityList" :data="sendMsg"></send-dialog>
	  	<el-dialog
		  	title="订单详情"
		  	:close-on-click-modal="false"
		  	:close-on-press-escape="false"
		  	:visible.sync="dialogVisible">
			<orderDetail @closeDia="closeDia" :orderData="orderData"></orderDetail>
		</el-dialog>
    </div>
</template>

<script>
import integralTop from 'src/components/integral-interaction/integral-top';
import ajax from 'src/api/index.js';
import { clone } from 'src/common/public.js';
import dateFormat from '../../../common/dateFormat.js';
import sendDialog from './sendDetail.vue';
import orderDetail from './orderDetail.vue';
import {point} from 'src/common/point.js';
export default {
    data(){
        return {
            tableData: [],
            dialogVisible: false,
            queryData: {
                pageNo: 1,
                pageSize: 20,
                startTime: '',
                endTime: '',
                nick: '',
                giftType: '',
                giveStatus: '',
                pointsResource:''
            },
            giftMap: {
                'coupon':'优惠券',
                'commodity':'实物奖品',
                'gift_wareDiscount': '商品折扣',
                'jd_coupon_activity': '优惠券',
            },
            statusMap: {
                '0': '未发放',
                '9': '发放成功',
                '-2': '发放失败'
            },
            sendMsg: {
                type: 'detail'
            },
            total: 0,
            pickerStartTime: {
                disabledDate(time){
                    return false;
                }
            },
            pickerEndTime: {
                disabledDate(time){
                    return false;
                }
            },
            listLoading: true,
            loadingText: '',
            orderData: {}
        }
    },
    watch: {
        'queryData.startTime'(val){
            if(val){
                this.pickerEndTime = {
                    disabledDate(time) {
                        return time.getTime() < new Date(val);
                    }
                }
            } else {
                this.pickerEndTime = {
                    disabledDate(time){
                        return false;
                    }
                };
            }
        },
        'queryData.endTime'(val){
            if(val){
                this.pickerStartTime = {
                    disabledDate(time) {
                        return time.getTime() > new Date(val);
                    }
                }
            } else {
                this.pickerStartTime = {
                    disabledDate(time){
                        return false;
                    }
                };
            }
        }
    },
    created(){
        point('37977.39404.39441');
        this.getActivityList(1);
    },
    methods: {
        getActivityList(page){
            this.queryData.pageNo = page || this.queryData.pageNo;
            this.listLoading = true;
            let queryData = clone(this.queryData);
            queryData.startTime = queryData.startTime ? (dateFormat(queryData.startTime,'YY-MM-DD HH:MM:SS')) : '';
            queryData.endTime = queryData.endTime ? (dateFormat(queryData.endTime,'YY-MM-DD')) + ' 23:59:59' : '';
            ajax({
                api_name: 'giveList',
                data: queryData,
                vm: this
            }, result => {
                this.tableData = result.data.list;
                this.total = result.data.total;
                this.listLoading = false;
            });
        },
        exportRecord() {
          let queryData = clone(this.queryData);
          queryData.startTime = queryData.startTime ? (dateFormat(queryData.startTime,'YY-MM-DD HH:MM:SS')) : '';
          queryData.endTime = queryData.endTime ? (dateFormat(queryData.endTime,'YY-MM-DD')) + ' 23:59:59' : '';
          delete queryData.pageNo;
          delete queryData.pageSize;
          let params = '',currentData;
          for(let key in queryData) {
            currentData = queryData[key];
            if(currentData) {
              params += `${key}=${currentData}&`
            }
          }
          window.open(`http://${location.hostname}/gift/exportCommodityGiftList?${params}`);
        },
        sendGift(item,type) {
            this.sendMsg.type = type;
            ajax({
                api_name: 'giveGiftInfo',
                data: {
                    id: item.id,
                    nick: item.pin
                },
                vm: this
            }, result => {
                this.$refs.sendDetail.showMsg(result,item.id,item.giftType);
            });
        },
        beforeFileUpload(file){
            let reg = /^.*\.(?:xls|xlsx)$/i;//文件名可以带空格
            if (!reg.test(file.name)) {//校验不通过
                this.$message.error('请上传excel格式的文件!');
                return false;
            }
            this.listLoading = true;
            this.loadingText = '文件上传中...';
            return true;
        },
        handleFileSuccess(file){
            this.listLoading = false;
            this.loadingText = '';
            if(file.result != 100){
                this.$message.error(file.message);
                return;
            }
            this.getActivityList(1);
        },
        handleFileError(){
            this.listLoading = false;
            this.loadingText = '';
            this.$message.error('当前网络发生错误，请重新上传');
        },
        closeDia(){
            this.dialogVisible = false;
        },
        shwOrderDetail(orderId, scope){
            if(!orderId){ return; }
            if(scope.giftType == 'gift_wareDiscount'){
                ajax({
                    api_name: 'getGiftOrderDetail',
                    data: { orderId },
                    vm: this
                }, result => {
                    this.dialogVisible = true;
                    this.orderData = result.data;
                });
            }
        }
    },
    components: {
        integralTop,
        sendDialog,
        orderDetail
    }
}
</script>

<style lang="less" scoped>
    .record_btns{
        margin-top: 20px;
        .primary_btn{
            display: inline-block;
            line-height: 1;
            white-space: nowrap;
            cursor: pointer;
            background: #fff;
            border: 1px solid #c4c4c4;
            color: #1f2d3d;
            margin: 0;
            padding: 10px 15px;
            border-radius: 4px;
            color: #fff;
            background-color: #20a0ff;
            border-color: #20a0ff;
            &:hover,&:focus{
                background: #4db3ff;
                border-color: #4db3ff;
                color: #fff;
            }
        }
        .link{
            color: #3089DE;
            font-size: 12px;
            margin-left: 10px;
        }
    }
    .list{
        padding: 10px 20px;
        .list_table{
            margin-top: 20px;
            .green{
                color: #4CC312;
            }
            .blue{
                color: #3089DE;
                &.hover{
                    cursor: pointer;
                }
            }
        }
        .table_footer{
            text-align: right;
        }
        .queryBtn{
            vertical-align: middle;
            margin-top: 3px;
        }
    }
</style>
