<template>
	<div class="m-content">
		<div class="m-content-main main_height fontClass" v-loading="loadingPage">
			<div class="clearfix">
				<el-button type="primary" size="small" class="m_b10 f-fr" @click="createNew">新建新会员专享券</el-button>
			</div>
			<el-table
		    	:data="tableData"
		    	:border="false"
		    	style="width: 100%">
			    <el-table-column label="活动名称" min-width="160" align="left">
			        <template scope="scope">
			            <el-row>
			                <el-col>
								{{scope.row.activityName}}
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
			    <el-table-column label="活动开始时间" min-width="160" align="left">
			        <template scope="scope">
			            <el-row>
			                <el-col>
								{{scope.row.activityStartTime}}
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
			    <el-table-column label="活动结束时间" min-width="160" align="left">
			        <template scope="scope">
			            <el-row>
			                <el-col>
			                	{{scope.row.activityEndTime}}
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
			    <el-table-column label="活动状态" align="left" min-width="160">
			        <template scope="scope">
			            <el-row>
			                <el-col>
			                	<span class="state_span" :class="{'ing': (scope.row.status == '进行中'), 'not_begin': (scope.row.status == '未开始'), 'over': (scope.row.status == '已结束')}">{{scope.row.status}}</span>
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
			    <el-table-column label="操作" align="left" min-width="180">
			        <template scope="scope">
			            <el-row>
			                <el-col>
			                	<el-button type="text" v-if="scope.row.status == '已结束'" @click="seeMember(scope.row)">查看</el-button>
			                	<div v-else>
			                		<el-button type="text" @click="editMember(scope.row)">编辑</el-button>
			                		<el-button v-if="scope.row.status == '未开始'" type="text" @click="startNow(scope.row)" class="ml_5">立即开始</el-button>
			                		<el-button v-else @click="endNow(scope.row)" type="text" class="ml_5">立即结束</el-button>
			                	</div>
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
		  	</el-table>
		  	<div class="text-right" v-if="pageInfo.total">
		  		<el-pagination
			  		:current-page="pageInfo.pageNo"
		  			@current-change="handleCurrentChange"
			  		:page-size="pageInfo.pageSize"
				    layout="prev, pager, next"
				    :total="pageInfo.total">
			  	</el-pagination>
		  	</div>

		</div>
	</div>
</template>

<script>
import http from './../../api/index.js';
import {point} from 'src/common/point.js';
	export default{
		data() {
			return{
				tableData: [],
				pageInfo: {
					pageNo: 1,
					pageSize: 10,
					total: 32
				},
				stateObj: {
					'0': '未开始',
					'1': '进行中',
					'2': '已结束'
				},
				loadingPage: false
			}
		},
		created() {
      point('37977.39408.39474');
			this.couponList();
		},
		methods: {
			createNew() {			//新建
				this.$router.push({
					path: '/createMembere',
					query: {
						type: 'new',
						do: 'create'
					}
				});
			},
			seeMember(item) {		//查看
				this.$router.push({
					path: '/seeMember'
				});
			},
			editMember(item) {		//编辑
				this.$router.push({
					path: '/createMembere',
					query: {
						type: 'new',
						do: 'edit',
						id: item.id
					}
				});
			},
			couponList() {
				this.loadingPage = true;
				http({
					api_name: 'couponList',
					vm: this,
					data: {
						memberType: 1,
						pageNum: this.pageInfo.pageNo,
						pageSize: this.pageInfo.pageSize
					}
				}, (res) => {
					this.loadingPage = false;
					this.tableData = res.data ? (res.data.couponList ? res.data.couponList : []) : [];
					this.tableData.forEach((item, index) => {
						item.status = this.stateObj[item.status];
					});
					this.pageInfo.total = res.data ? (res.data.total ? res.data.total  : 0) : 0;
				}, (error) => {
					this.loadingPage = false;
					this.tableData = [];
					this.pageInfo.total = 0;
				});
			},
			handleCurrentChange(e) {		//翻页
				this.pageInfo.pageNo = Number(e);
				this.couponList();
			},
			startNow(item) {
				this.nowDoAjax("couponStartNow", item.id);
			},
			endNow(item) {
				this.nowDoAjax("couponEndNow", item.id);
			},
			nowDoAjax(api_name, id) {
				this.loadingPage = true;
				http({
					api_name: api_name,
					vm: this,
					data: {
						id: id
					}
				}, (res) => {
					this.couponList();
				}, (error) => {
					this.loadingPage = false;
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.m-content-main{
		padding: 12px 16px 40px;
		color: #333;
	}
</style>
