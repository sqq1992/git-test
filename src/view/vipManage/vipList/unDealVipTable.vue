<template>
	<div class="dealVipTable">
		<el-table
			class="fontClass"
	    	:data="tableData"
	    	:border="false"
	    	style="width: 100%">
		    <el-table-column label="会员账号" min-width="140" align="left">
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
		    <el-table-column label="会员昵称" min-width="140" align="left">
		        <template scope="scope">
		            <el-row>
		                <el-col>
							{{scope.row.userNick}}
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
		    <el-table-column label="手机号" align="left" min-width="120">
		        <template scope="scope">
		            <el-row>
		                <el-col class="">
		                	{{scope.row.mobile}}
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
		    <el-table-column label="会员激活状态" align="left" min-width="120">
		        <template scope="scope">
		            <el-row>
		                <el-col class="">
		                	{{statusObj[scope.row.activationState]}}
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
		    <el-table-column label="操作" align="left" min-width="80">
		        <template scope="scope">
		            <el-row>
		                <el-col>
		                	<el-button type="text" @click="detail(scope.row)">详情</el-button>
							<el-button type="text" @click="handleAddBlackName(scope.row)">加入黑名单</el-button>
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
	  	</el-table>
	  	<el-dialog
		  	title="会员详情"
		  	:close-on-click-modal="false"
		  	:close-on-press-escape="false"
		  	:visible.sync="dialogVisible">
			<vipDetail :vipDetail="vipDetail" @closeDia="closeDia"></vipDetail>
		</el-dialog>
	</div>
</template>

<script>
import http from 'src/api/index.js';
import vipDetail from './vipDetail';
	export default{
		data() {
			return{
				dialogVisible: false,
				vipDetail: {},
				statusObj: {
					'0': '未激活',
					'1': '已激活'
				}
			}
		},
		props: {
			tableData: Array
		},
		methods: {
			detail(item) {
				this.dialogVisible = true;
				this.vipDetail = item;
			},
			closeDia() {
				this.dialogVisible = false;
			},
			handleAddBlackName({pin,mobile,customerPin}) {
				this.$confirm(`确定将${pin||customerPin}及${mobile}添加至黑名单？`,{title:'加入黑名单'}).then(() => {
          http({
            api_name:'addBlackListPin',
            data:{
              pin: pin || customerPin
            }
          },res => {
            this.$message.success('添加成功！');
          })
				}).catch(() => {})
			}
		},
		components: {
			vipDetail
		}
	}
</script>

<style lang="less" scoped>

</style>
