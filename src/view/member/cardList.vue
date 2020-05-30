<template>
	<div class="m-content">
		<div class="m-content-main main_height fontClass" v-loading="loadingPage">
			<div class="clearfix m_b20">
				<el-button type="primary" size="medium" class="m_b10 f-fr" @click="createNew">新建开卡礼包</el-button>
			</div>
			<el-table
		    	:data="tableData"
		    	:border="false"
		    	style="width: 100%">
			    <el-table-column label="活动名称" min-width="160" align="left">
			        <template scope="scope">
			            <el-row>
			                <el-col>
								{{scope.row.name}}
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
			    <el-table-column label="活动开始时间" min-width="160" align="left">
			        <template scope="scope">
			            <el-row>
			                <el-col>
								{{scope.row.startTime}}
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
			    <el-table-column label="活动结束时间" min-width="160" align="left">
			        <template scope="scope">
			            <el-row>
			                <el-col>
			                	{{scope.row.endTime}}
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
			    <el-table-column label="活动状态" align="left" min-width="160">
			        <template scope="scope">
			            <el-row>
			                <el-col>
			                	<span class="state_span" :class="{'ing': (scope.row.statusName == '进行中'), 'not_begin': (scope.row.statusName == '未开始'), 'over': (scope.row.statusName == '已结束')}">{{scope.row.statusName}}</span>
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
			    <el-table-column label="操作" align="left" min-width="180">
			        <template scope="scope">
			            <el-row>
			                <el-col>
			                	<el-button type="text"  @click="seeMember(scope.row)">查看</el-button>
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
		this.cardList();
	},
	methods: {
		createNew() {			//新建
			this.$router.push({
				path: '/createCard'
			});
		},
		seeMember(item) {		//查看
			this.$router.push({
				path: '/checkCard',
				query: {id:item.id,name: item.name, start: item.startTime,end: item.endTime}
			});
		},
		formatDate(timestamp) {
			var date = new Date(timestamp-0);
        	var year = date.getFullYear(),
            month = ((date.getMonth()+1) > 9) ? (date.getMonth()+1) : ('0' + (date.getMonth()+1).toString()),
            day = (date.getDate() > 9) ? date.getDate() : ('0' + date.getDate().toString()),
            hours = (date.getHours() > 9) ? date.getHours() : ('0' + date.getHours().toString()),
            minute = (date.getMinutes() > 9) ? date.getMinutes() : ('0' + date.getMinutes().toString()),
			second = (date.getSeconds() > 9) ? date.getSeconds() : ('0' + date.getSeconds().toString());
			return (year + '-' + month + '-' + day + ' ' +hours + ':' + minute + ':' + second);
		},
		cardList() {
			this.loadingPage = true;
			http({
				api_name: 'memberCardList',
				vm: this,
				data: {
					pageNo: this.pageInfo.pageNo,
					pageSize: this.pageInfo.pageSize
				}
			}, (res) => {
				this.loadingPage = false;
				this.tableData = res.data ? (res.data.list ? res.data.list : []) : [];
				this.tableData.forEach((item, index) => {
					item.status = this.stateObj[item.status];
					item.startTime = this.formatDate(item.startTime, true)
					item.endTime = this.formatDate(item.endTime, true)
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
			this.cardList();
		}
	}
}
</script>

<style lang="less" >
.m-content{
    .m-content-main{
		padding: 12px 16px 40px;
		color: #333;
    }
    .el-select .el-input__inner {
       height: 100%;
       width: 100%;
    }
}
.el-select-dropdown__item.selected{
    color: #333 !important;
    background-color: #fff !important;
}
</style>
