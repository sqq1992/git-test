<template>
    <div v-loading="listLoading">
		<promotion-top></promotion-top>
		<div class="m-content list">
			<div class="record_top">
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">活动名称：</span>
                    <el-input v-model="queryData.name" style="width: auto;"></el-input>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">活动状态：</span>
                    <el-select v-model="queryData.status" class="ui-filter-pd">
                        <el-option :value="''" label="不限"></el-option>
                        <el-option :value="'wait'" label="未开始"></el-option>
                        <el-option :value="'valid'" label="进行中"></el-option>
						<el-option :value="'invalid'" label="已结束"></el-option>
                    </el-select>
                </span>
                <el-button size='small' @click="getMemberDiscountList()" class="queryBtn">查询</el-button>
            </div>
			<div class="m-content-main main_height">
				<el-button type="primary" size="small" class="m_b10" @click="createNew">新建活动</el-button>
				<el-button type="primary" size="small" class="m_b10" @click="setActShow">设置活动页面展示</el-button>
				<list-sort type="promotion" :getList="getAllActivityList" :header="headers" :data="allActivityList" :sort1="descOrder" :sort2="ascOrder" @checkSortList="checkSortList"></list-sort>
                <a class="f-fr monitor"  href="https://jdprice.shop.jd.com/discount/query" target="_blank">查看店铺优惠监控</a>
				<el-table
					:data="tableData"
					:border="false"
					style="width: 100%">
					<el-table-column label="活动名称" min-width="140" prop="activityName" align="left" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="活动开始时间" min-width="120" align="left">
						<template scope="scope">
							<el-row>
								<el-col>
									{{scope.row.startTime}}
								</el-col>
							</el-row>
						</template>
					</el-table-column>
					<el-table-column label="活动结束时间" min-width="120" align="left">
						<template scope="scope">
							<el-row>
								<el-col>
									{{scope.row.endTime}}
								</el-col>
							</el-row>
						</template>
					</el-table-column>
					<el-table-column label="活动状态" align="left" min-width="100">
						<template scope="scope">
							<el-row>
								<el-col>
									<span class="state_span" :class="statusClass[scope.row.status]">{{statusName[scope.row.status]}}</span>
								</el-col>
							</el-row>
						</template>
					</el-table-column>
					<el-table-column label="参与人数" min-width="100" align="left">
						<template scope="scope">
							<el-row>
								<el-col>
									{{scope.row.participantPeoples}}
								</el-col>
							</el-row>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="left" min-width="240">
						<template scope="scope">
							<el-row>
								<el-col>
									<div v-if="scope.row.status == 'valid'">
										<el-button type="text" @click="editAct(scope.row)">编辑</el-button>
										<el-button type="text" class="ml_5" @click="jumpList(scope.row)">参与记录</el-button>
										<el-button type="text" class="ml_5" @click="preview(scope.row)">提取链接</el-button>
										<el-button type="text" class="ml_5" @click="down(scope.row)">立即结束</el-button>
										<el-button type="text" class="ml_5" @click="appendMember(scope.row)">追加会员</el-button>
									</div>
									<div v-else-if="scope.row.status == 'wait'">
										<el-button type="text" @click="editAct(scope.row)">编辑</el-button>
										<el-button type="text" class="ml_5" @click="preview(scope.row)">提取链接</el-button>
										<el-button type="text" class="ml_5" @click="down(scope.row)">立即结束</el-button>
									</div>
									<div v-else>
                                        <el-button type="text" @click="editAct(scope.row)">查看</el-button>
										<el-button type="text" class="ml_5" @click="jumpList(scope.row)">参与记录</el-button>
										<el-button type="text" class="ml_5" @click="deleterow(scope.row)">删除</el-button>
									</div>
								</el-col>
							</el-row>
						</template>
					</el-table-column>
				</el-table>
				<div class="text-right" v-if="total">
					<el-pagination
						:pageSize="queryData.pageSize"
						layout="prev, pager, next"
						:total="total">
					</el-pagination>
				</div>

			</div>
		</div>
		<qr-dialog ref="qrDetail"></qr-dialog>
		<append-member ref="appendM" @appendFn="appendFn"></append-member>
		<show-act ref="showAct" @setConfig="setConfig"></show-act>
	</div>
</template>

<script>
import promotionTop from 'src/components/member/promotion-top';
import qrDialog from 'src/components/integral-interaction/qrcode.vue';
import listSort from 'src/components/list-sort/list-sort.vue';
import appendMember from 'src/components/member/appendMember.vue';
import showAct from 'src/components/member/actShow.vue';
import ajax from 'src/api/index.js';
import {mapMutations} from 'vuex';
import { clone } from 'src/common/public.js';
import {point} from 'src/common/point.js';
	export default{
		data() {
			return{
				listLoading: false,
				tableData: [],
				queryData: {
					pageNo: 1,
					pageSize: 20,
					name: '',
					status: '',
				},
				total: 0,
				headers: [
					{
						key: 'activityName',
						text: '活动名称',
						width: 150
					},
					{
						key: 'startTime',
						text: '开始时间'
					},
					{
						key: 'endTime',
						text: '结束时间'
					},
					{
						key: 'allCount',
						text: '剩余数量'
					}
				],
				allActivityList: [],
				statusClass: {
					valid: 'ing',
					wait: 'not_begin',
					invalid: 'over'
				},
				statusName: {
					wait: '未开始',
					valid: '进行中',
					invalid: '已结束'
				}
			}
		},
		created() {
      point('37977.39408.39475')
			this.getMemberDiscountList();
		},
		methods: {
			jumpList(data) {
				sessionStorage.setItem('promotionName', data.activityName);
                this.$router.push({path: '/promotionList'});
			},
			editAct(data) {
				this.$router.push({path: '/memberDiscount',query:{id: data.id}});
			},
			createNew() {
				this.$router.push({
					path: '/memberDiscount'
				});
			},
			descOrder(a, b){
				return new Date(b.startTime.replace(/\-/g, '/')).getTime() - new Date(a.startTime.replace(/\-/g, '/')).getTime();
			},
			ascOrder(a, b){
				 return b.allCount - a.allCount;
			},
			getMemberDiscountList(page) {
				this.queryData.pageNo = page || this.queryData.pageNo;
				this.listLoading = true;
				let queryData = clone(this.queryData);
                ajax({
					api_name: 'getMembershipDiscountRule',
					vm: this,
					data: queryData,
				}, result => {
					this.listLoading = false;
					this.tableData = result.data.list;
					this.total = result.data ? (result.data.total ? result.data.total  : 0) : 0;
				}, (error) => {
					this.listLoading = false;
					this.tableData = [];
					this.total = 0;
				});
			},
			getAllActivityList(){
				ajax({
					api_name: 'getValidAndSortedDiscountActivities',
					vm: this
				}, result => {
					this.allActivityList = result.data.activities;
				});
			},
			appendFn(data) {
				if(!data.pins) {
				   this.$refs.appendM.cancel();
				   return false;
				};
				this.listLoading = true;
				ajax({
					api_name: 'appendMembershipDiscountPins',
					data: data,
					vm: this
				}, (res) => {
					this.$message({
						message: '追加会员成功!',
						type: 'success'
					});
					this.$refs.appendM.cancel();
					this.listLoading = false;
				}, (error) => {
					this.$message({
						message: error.message || '追加会员失败!',
						type: 'error'
					});
					this.$refs.appendM.cancel();
					this.listLoading = false;
				})
			},
			checkSortList(dataList){
				let metaData = clone(this.allActivityList).reduce((a, b) => {
					return a.concat([b.id])
				}, []);
				dataList = dataList.reduce((a, b) => {
					return a.concat([b.id])
				}, []);
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
					api_name: 'sortedDiscountActivities',
					data: {
						afterIds: dataList,
						beforeIds: metaData
					},
					vm: this
				}, result => {
					this.$message({
						message: '排序成功',
						type: 'success'
					});
				});
			},
			deleterow(item) {
				this.$confirm('确认要删除当前活动？确认删除后已领取商品专享价但仍未下单购买的用户将无法继续享受商品专享价', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info'
				}).then(() => {
					this.listLoading = true;
					ajax({
						api_name: 'deleteActivity',
						data: {
							id: item.id
						},
						vm: this
					}, (res) => {
						this.getMemberDiscountList();
						this.$message({
							message: '删除成功'
						});
					}, (error) => {
						this.listLoading = false;
					});
				}).catch(() => {
				});
			},
			down(item) {
				this.$confirm('确定结束该活动吗？', '操作提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info'
				}).then(() => {
					this.listLoading = true;
					ajax({
						api_name: 'onOrOff',
						data: {
							id: item.id,
							type:"invalid"
						},
						vm: this
					}, (res) => {
						this.getMemberDiscountList();
						this.$message({
							message: '活动结束成功'
						});
					}, (error) => {
						this.listLoading = false;
					});
				}).catch(() => {
				});
			},
			preview(data) {
				data.activityType = 'promotion';
				this.$refs.qrDetail.showMsg(data,'interaction');
			},
			appendMember(data) {
                this.$refs.appendM.showDialog(data);
			},
			setActShow() {
				this.listLoading = true;
				ajax({
					api_name: 'getMembershipDiscountConfig',
					vm: this
				}, (res) => {
					this.listLoading = false;
					this.$refs.showAct.showDialog(res.data);
				}, (error) => {
					this.$message({
						message: error.message || '获取页面展示设置失败!',
						type: 'error'
					});
					this.listLoading = false;
				})
			},
			setConfig(data) {
				this.listLoading = true;
				ajax({
					api_name: 'setMembershipDiscountConfig',
					vm: this,
					data: data
				}, (res) => {
					this.listLoading = false;
					this.$message({
						message: '页面展示设置成功!',
						type: 'success'
					});
					this.$refs.showAct.cancel();
				}, (error) => {
					this.$message({
						message: error.message || '页面展示设置失败!',
						type: 'error'
					});
					this.listLoading = false;
				})
			}
		},
		components: {
			promotionTop,
			listSort,
			qrDialog,
			appendMember,
			showAct
		}
	}
</script>

<style lang="less" scoped>
	.m-content-main{
		padding: 10px 20px 40px;
		.sort_btn {
			display: inline-block;
			margin-left: 5px;
		}
		.monitor {
			color: #20a0ff;
			margin-top: 20px;
			&:hover {
				color: #4db3ff;
			}
		}
	}
	.list {
		.record_top {
			padding: 10px 20px;
		}
	}
</style>
