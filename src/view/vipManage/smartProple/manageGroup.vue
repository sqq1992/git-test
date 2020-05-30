<template>
	<div class="m-content dialog_cla" id="manageGroup" v-loading="loadingPage">
		<div class="m-content-main main_height inputSet">
			<div class="header m_b20">
				<el-button class="" type="primary" size="small" @click="create">新建分组</el-button>
				<span class="font12 m_l20">
					当前已有{{num}}个智能分组，还可新建{{(num >= 10) ? 0 : (10 - num)}}个
				</span>
			</div>
			<el-table
				class="fontClass"
		    	:data="tableData"
		    	:border="false"
		    	style="width: 100%">
			    <el-table-column label="分组名称" min-width="160" align="left">
			        <template scope="scope">
			            <el-row>
			                <el-col>
								{{scope.row.groupName}}
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
			    <el-table-column label="创建时间" min-width="160" align="left">
			        <template scope="scope">
			            <el-row>
			                <el-col>
								{{scope.row.created}}
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
			    <el-table-column label="更新时间" min-width="160" align="left">
			        <template scope="scope">
			            <el-row>
			                <el-col>
			                	{{scope.row.modified}}
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
			    <el-table-column label="人群数量" align="left" min-width="160">
			        <template scope="scope">
			            <el-row>
			                <el-col class="blueColor">
			                	{{scope.row.crowdCount | numFormat}}
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
			    <el-table-column label="操作" align="left" min-width="100">
			        <template scope="scope">
			            <el-row>
			                <el-col v-if="(scope.row.index)">
			                	<el-button type="text" @click="edit(scope.row)">编辑</el-button>
			                	<el-button class="m_l20" type="text" @click="deleterow(scope.row)">删除</el-button>
			                </el-col>
			            </el-row>
			        </template>
			    </el-table-column>
		  	</el-table>
		</div>
		<el-dialog
			class="inputSet"
		  	:title="title"
		  	:close-on-click-modal="false"
		  	:close-on-press-escape="false"
		  	:visible.sync="dialogVisible">
			<div class="row_line diaGroupName">
				<span>分组名称：</span>
				<el-input :maxlength="15" v-model.trim="groupName" class="groupName"></el-input>
				<div v-if="nullName" class="red font12 nullName">分组名称不能为空</div>
			</div>
			<p class="m_t10 text-right">
				<el-button size="small" @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" size="small" @click="sureBut">确 定</el-button>
			</p>
		</el-dialog>
	</div>
</template>

<script>
import http from './../../../api/index.js';
	export default{
		data() {
			return{
				nullName: false,
				title: '新建分组',
				num: 0,
				tableData: [],
				groupName: '',
				dialogVisible: false,
				loadingPage: false,
				editOrcreate: false,
				editObj: {}
			}	
		},
		created() {
			this.crmGroupList();
			this.$emit('navTextChange', {
				name: '会员管理',
				href: '/intePeople',
				childer: {
					name: '管理分组',
					href:'/manageGroup'
				}
			});
		},
		watch: {
			groupName() {
				this.nullName = false;
			}
		},
		methods: {
			crmGroupList() {			//查询分组列表
				this.loadingPage = true;
				http({
					api_name: 'crmGroupList',
					vm: this,
					data: {}
				}, (res) => {
					this.loadingPage = false;
					this.tableData = res.data ? (res.data.crmGroupList ? res.data.crmGroupList : []) : [];
					this.num = this.tableData.length - 1;
					this.tableData.forEach((item,index) => {
						this.$set(item, 'index', index);
					});
				}, (error) => {this.loadingPage = false;});
			},
			create() {
				this.title = '新建分组';
				this.editOrcreate = false;
				this.dialogVisible = true;
				this.groupName = '';
			},
			edit(item) {
				this.editOrcreate = true;
				this.title = '编辑分组';
				this.editObj = item;
				this.dialogVisible = true;
				this.groupName = item.groupName;
			},
			sureBut() {			//确定
				if(!this.groupName) {
					this.nullName = true;
					return
				}
				let data = {
					groupName: this.groupName
				}
				if(this.editOrcreate) {
					data.id = this.editObj.id
				}
				this.crmGroupEdit(data)
			},
			crmGroupEdit(data) {		//分组修改
				http({
					api_name: 'crmGroupEdit',
					vm: this,
					data: data
				}, (res) => {
					this.dialogVisible = false;
					this.crmGroupList();
				}, (error) => {
				});
			},
			deleterow(item) {
				this.$confirm('删除后分组下的人群将被移至“默认”分组中，确认删除？', '删除提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'info'
		        }).then(() => {
		        	this.loadingPage = true;
		          	http({
		          		api_name: 'crmGroupDelete',
		          		vm: this,
		          		data: {
		          			id: item.id
		          		}
		          	}, (res) => {
		          		this.crmGroupList();
		          	}, (error) => {
		          		this.loadingPage = false;
		          	});
		        }).catch(() => {
		        });
			}
		}
	}
</script>

<style lang="less" scoped>
	.m-content-main{
		font-size: 14px;
		padding: 17px 25px 30px 15px;
		box-sizing: border-box;
		min-width: 1050px;
	}
	.header{
		height: 28px;
		line-height: 28px;
	}
	.diaGroupName{
		height: 120px;
	}
	.groupName{
		width: 208px;
	}
	.nullName{
		padding-left: 74px;
	}
</style>