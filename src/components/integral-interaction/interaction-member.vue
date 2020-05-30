<template>
	<div>
        <div class="list fontClass" v-loading="listLoading">
			<div>
				<span class="ui-filter-item-group">
                    <span class="ui-filter-hd">会员账号：</span>
                    <el-input v-model="queryData.userNick" style="width: auto;"></el-input>
                </span>
				<span class="ui-filter-item-group">
                    <span class="ui-filter-hd">会员等级：</span>
                    <el-select v-model="queryData.level" class="ui-filter-pd">
                        <el-option v-for="(item,key) in memberArr" :value="key" :label="item"></el-option>
                    </el-select>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd w100" v-if="type == 1">连续签到天数：</span>
                    <span class="ui-filter-hd w100" v-else-if="type == 2">累计抽奖次数：</span>
                    <span class="ui-filter-hd w100" v-else-if="type == 4">累计成功邀请：</span>
                    <el-input v-model="queryData.continueDayStart" style="width: auto;"></el-input> 至
                    <el-input v-model="queryData.continueDayEnd" style="width: auto;"></el-input>
                </span>
			</div>
			<div>
				<span class="ui-filter-item-group">
                    <span class="ui-filter-hd w85" v-if="type == 1">累计签到天数：</span>
                    <span class="ui-filter-hd w85" v-else-if="type == 2">累计中奖次数：</span>
                    <span class="ui-filter-hd w85" v-else-if="type == 4">累计邀请次数：</span>
                    <el-input v-model="queryData.totalDayStart" style="width: auto;"></el-input> 至
                    <el-input v-model="queryData.totalDayEnd" style="width: auto;"></el-input>
                </span>
				<span class="ui-filter-item-group">
                    <span class="ui-filter-hd w100" v-if="type == 1">最近签到时间：</span>
                    <span class="ui-filter-hd w100" v-else-if="type == 2">最近抽奖时间：</span>
                    <span class="ui-filter-hd w100" v-else-if="type == 4">最近邀请时间：</span>
                    <el-date-picker
                        v-model="queryData.signStartTime"
                        type="date"
                        placeholder="选择日期"
                        class="ui-filter-pd"
                        :picker-options="pickerStartTime">
                    </el-date-picker> -
                    <el-date-picker
                        v-model="queryData.signEndTime"
                        type="date"
                        placeholder="选择日期"
                        class="ui-filter-pd"
                        :picker-options="pickerEndTime">
                    </el-date-picker>
                </span>
                <el-button size='small' @click="getPartakeList(1)" class="queryBtn">查询</el-button>
			</div>
			<div class="list_table">
                <el-table
                    :data="tableData"
                    :border="false"
                    style="width: 100%">
                    <el-table-column label="会员账号" min-width="15%" align="left">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    <span v-if="scope.row.pin">{{scope.row.pin}}</span>
                                    <el-tooltip
                                      :content="scope.row.customerPin"
                                      popper-class="my_poper"
                                      placement="top"
                                      v-else-if="scope.row.customerPin"
                                    >
                                      <span class="clamp_two_row">
                                        <span class="mi_icon">密</span>
                                        {{scope.row.customerPin}}
                                      </span>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="会员昵称" min-width="15%" align="left">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.userNick}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="会员等级" align="left" min-width="15%">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{memberArr[scope.row.level]}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column :label="labelMapOne[type]" align="left" min-width="15%">
                        <template scope="scope">
                            <el-row>
                                <el-col v-if="type == 4 || type == 12">
                                    {{scope.row.totalDay}}
                                </el-col>
                                <el-col v-else>
                                    {{scope.row.continueDay}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column :label="labelMapTwo[type]" align="left" min-width="15%">
                        <template scope="scope">
                            <el-row>
                                <el-col v-if="type == 4 || type == 12">
                                    {{scope.row.continueDay}}
                                </el-col>
                                <el-col v-else>
                                    {{scope.row.totalDay}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column :label="labelMapThree[type]" align="left" min-width="25%">
                        <template scope="scope">
                            <el-row>
                                 <el-col v-if="(type == 4 || type == 12) && scope.row.continueDay != 0">
                                    {{scope.row.modifyTime}}
                                </el-col>
                                <el-col v-else-if="type != 4">
                                    {{scope.row.modifyTime}}
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
                memberArr: {},
				listLoading: false,
				queryData: {
					pageNo: 1,
					pageSize: 20,
					signStartTime: '',
					signEndTime: '',
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
                labelMapOne: {
                    '1': '连续签到天数',
                    '2': '累计抽奖次数',
                    '4': '累计邀请次数',
                    '12': '累计邀请次数'
                },
                labelMapTwo: {
                    '1': '累计签到天数',
                    '2': '累计中奖次数',
                    '4': '累计成功邀请',
                    '12': '累计成功邀请'
                },
                labelMapThree: {
                    '1': '最近签到时间',
                    '2': '最近抽奖时间',
                    '4': '最近成功邀请时间',
                    '12' : '最近成功邀请时间'
                },
			}
		},
		watch: {
			'queryData.signStartTime'(val){
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
			'queryData.signEndTime'(val){
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
            this.getMemberSet();
            this.getPartakeList();
		},
		components: {

		},
		methods: {
			getPartakeList(page) {
                this.queryData.id = this.id;
				this.queryData.pageNo = page || this.queryData.pageNo;
				this.listLoading = true;
				let queryData = clone(this.queryData);
				queryData.signStartTime = queryData.signStartTime ? (dateFormat(queryData.signStartTime,'YY-MM-DD HH:MM:SS')) : '';
                queryData.signEndTime = queryData.signEndTime ? (dateFormat(queryData.signEndTime,'YY-MM-DD')+' 23:59:59') : '';
				ajax({
					api_name: 'customerStats',
					data: queryData,
					vm: this
				}, result => {
					this.tableData = result.data.list;
					this.total = result.data.total;
					this.listLoading = false;
				});
            },
            //获取设置的会员名称
            getMemberSet() {
            let vm = this,
                _arr = {'': '不限'};
            ajax({
                    api_name: 'memberLevelList',
                }, (res) => {
                    if(res.data.levelList && res.data.levelList.length) {
                        res.data.levelList.forEach(item => {
                         _arr[item.memberLevel] = item.name || item.nameSource;
                        })
                    }else {
                        _arr = {
                            '': '不限',
                            '0': '注册会员',
                            '1': '一星会员',
                            '2': '二星会员',
                            '3': '三星会员',
                            '4': '四星会员',
                            '5': '五星会员',
                        };
                    }
                    vm.$set(vm, 'memberArr', _arr);
                }, (error) => {
                    this.$message.error(error.errorMessage);
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
