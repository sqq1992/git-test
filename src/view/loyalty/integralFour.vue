<template>
	<div id="integralFour" v-loading="listLoading" :element-loading-text="loadingText">
		<div>
			<el-button type="primary" size='small' class="upload-btn" @click="uploadIntergal">导入积分</el-button>
			<a class="down_temp" href="/points/downloadTemplateFile" target="_blank">下载导入模板</a>
		</div>
		<div class="tab_list">
			<el-table
				:data="tableData"
				:border="false"
				style="width: 100%">
				<el-table-column label="导入文件名" min-width="120" prop="fileName" align="left" :show-overflow-tooltip="true">
                </el-table-column>
				<el-table-column label="导入总记录数" min-width="80" align="left">
					<template scope="scope">
						<el-row>
							<el-col>
								{{scope.row.totalCount | numFormat}}
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column label="导入状态" align="left" min-width="60">
					<template scope="scope">
						<el-row>
							<el-col :class="statusMap[scope.row.status]">
								{{scope.row.status}}
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column label="操作人" min-width="120" align="left">
					<template scope="scope">
						<el-row>
							<el-col>
								{{scope.row.nick}}
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column label="导入成功数" min-width="100" align="left">
					<template scope="scope">
						<el-row>
							<el-col >
								<span v-if="scope.row.status == '导入成功'">{{scope.row.successCount | numFormat}}</span>
								<span v-else>-</span>
								<a class="blue" :href="`/points/downloadDetailFile?id=${scope.row.id}&status=1`" v-if="scope.row.status == '导入成功' && scope.row.successCount != 0">下载明细</a>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column label="导入失败数" min-width="100" align="left">
					<template scope="scope">
						<el-row>
							<el-col>
								<span v-if="scope.row.status == '导入成功'">{{scope.row.errorCount | numFormat}}</span>
								<span v-else>-</span>
								<a class="blue" :href="`/points/downloadDetailFile?id=${scope.row.id}&status=0`" v-if="scope.row.status == '导入成功' && scope.row.errorCount != 0">下载明细</a>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column label="导入时间" min-width="120" align="left">
					<template scope="scope">
						<el-row>
							<el-col>
								{{scope.row.time}}
							</el-col>
						</el-row>
					</template>
				</el-table-column>
			</el-table>
			<div class="table_footer" v-if="tableData.length">
                <el-pagination
                    layout="prev, pager, next"
                    :page-size="10"
                    :current-page="pageNo"
                    @current-change="getActivityList"
                    :total="total">
                </el-pagination>
            </div>
		</div>
		<intergal-dialog ref="intergalUpload" @toSubmitFinish="toSubmitFinish" @toSubmit="toSubmit"></intergal-dialog>
	</div>
</template>

<script>
import intergalDialog from 'src/components/intergal-upload/intergal-dialog';
import ajax from 'src/api/index.js';
import { setTimeout } from 'timers';
import {point} from 'src/common/point.js';
	export default{
		data() {
			return{
				loadingText: '',
				listLoading: false,
				tableData: [],
				total: 0,
				pageNo: 1,
				statusMap: {
					'导入成功': 'green',
					'导入失败': 'red',
					'正在导入': 'blue',
				}
			}
		},
		components: {
			intergalDialog
		},
		created() {
      point('37977.39407.39465');
			this.getActivityList();
		},
		watch: {

		},
		methods: {
			uploadIntergal() {
                this.$refs.intergalUpload.show();
			},
			getActivityList(page = 1){
				let vm = this;
				vm.pageNo = page;
				ajax({
					api_name: 'searchExtemalRecode',
					vm: this,
					data: {
						pageNo: page,
						pageSize: 10
					}
				}, result => {
					vm.tableData = result.data.list;
					vm.total = result.data.total;
					vm.listLoading = false;
				});
			},
			toSubmitFinish() {
               this.listLoading = false;
			   this.loadingText = '';
			   if(this.pageNo == 1) {
				   this.getActivityList();
			   }else {
				   this.pageNo = 1;
			   }
			},
			toSubmit() {
			   this.listLoading = true;
               this.loadingText = '文件上传中...';
			}
		}
	}
</script>

<style lang="less" scoped>
	#integralFour {
		padding: 12px 16px 40px;
		.down_temp {
			color: #3089DE;
			margin-left: 10px;
		}
		.tab_list {
            margin-top: 10px;
		}
		.red {
			color: red;
		}
		.green {
			color: green;
		}
		.blue {
			color: #20a0ff;
		}
	}
</style>
