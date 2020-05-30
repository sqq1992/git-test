<template>
	<div>
        <div class="list fontClass" v-loading="listLoading">
			<div>
				<span class="ui-filter-item-group">
                    <span class="ui-filter-hd">会员账号：</span>
                    <el-input v-model="queryData.pin" style="width: auto;"></el-input>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd w100">订单编号：</span>
                    <el-input v-model="queryData.orderId" style="width: auto;"></el-input>
                </span>
			</div>
			<div>
				<span class="ui-filter-item-group">
                    <span class="ui-filter-hd w_85" style="width: 85px;">订单创建时间：</span>
                    <el-date-picker
                        v-model="queryData.orderStartTime"
                        type="date"
                        placeholder="选择日期"
                        class="ui-filter-pd"
                        :picker-options="pickerStartTime">
                    </el-date-picker> - 
                    <el-date-picker
                        v-model="queryData.orderEndTime"
                        type="date"
                        placeholder="选择日期"
                        class="ui-filter-pd"
                        :picker-options="pickerEndTime">
                    </el-date-picker>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">订单状态：</span>
                    <el-select v-model="queryData.orderState" class="ui-filter-pd">
                        <el-option v-for="(item,key) in orderStateMap" :value="key" :label="item"></el-option>
                    </el-select>
                </span>
                <el-button size='small' @click="getPartakeList(1)" class="queryBtn">查询</el-button>
			</div>
			<div class="list_table">
                <el-table
                    :data="tableData"
                    :border="false"
                    style="width: 100%">
                    <el-table-column label="订单编号" min-width="15%" align="left">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.orderId}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="会员账号" min-width="15%" align="left">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.pin}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="货款金额" align="left" min-width="15%">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.totalPrice}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单金额" align="left" min-width="15%">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.paymentPrice}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单创建时间" align="left" min-width="15%">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.orderStartTime}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单状态" align="left" min-width="25%">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.orderState}}
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
                        @current-change="getPartakeList"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
	    </div>
	</div>
</template>

<script>
import ajax from 'src/api/index.js';
import { clone } from 'src/common/public.js';
import dateFormat from 'src/common/dateFormat.js';
	export default{
        props: {
            data: {
                type: Object,
                default: {},
            },
            type: String,
            id: Number
        },
		data() {
			return{
                tableData: [],
                orderStateMap: {
                    '': '不限',
                    'WAIT_SELLER_DELIVERY': '等待发货',
                    'FINISHED_L': '交易完成',
                    'TRADE_CANCELED': '交易关闭',
                },
				listLoading: false,
				queryData: {
					pageNo: 1,
					pageSize: 20,
					orderStartTime: '',
					orderEndTime: '',
                    userNick: '',
                    level: '',
					id: ''
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
			}
		},
		watch: {
			'queryData.orderStartTime'(val){
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
			'queryData.orderEndTime'(val){
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
            this.getPartakeList();
		},
		components: {
			
		},
		methods: {
			getPartakeList(page) {
                this.queryData.activityId = this.id;
				this.queryData.pageNo = page || this.queryData.pageNo;
				this.listLoading = true;
				let queryData = clone(this.queryData);
				queryData.orderStartTime = queryData.orderStartTime ? (dateFormat(queryData.orderStartTime,'YY-MM-DD HH:MM:SS')) : '';
                queryData.orderEndTime = queryData.orderEndTime ? (dateFormat(queryData.orderEndTime,'YY-MM-DD')+' 23:59:59') : '';
				ajax({
					api_name: 'activityOrderRecord',
					data: queryData,
					vm: this
				}, result => {
					this.tableData = result.data.list;
					this.total = result.data.total;
					this.listLoading = false;
				});
            },
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
            &.w100{
                width: 100px;
            }
            &.w85{
                width: 85px;
            }
        }
        .w_auto {
            width: auto;
        }
        .w_85 {
            width: 85px;
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
    }
</style>
