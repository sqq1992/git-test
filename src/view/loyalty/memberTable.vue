<template>
	<div id="memberTable" class="integralTable fontClass">
		<el-table
	    	:data="tableData"
	    	:border="false"
	    	style="width: 100%">
		    <el-table-column label="会员等级" min-width="160" align="left">
		        <template scope="scope">
		            <el-row>
		                <el-col>
							{{scope.row.nameSource}}
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
		    <el-table-column label="等级规则" min-width="200" align="left">
		        <template scope="scope">
		            <el-row>
		                <el-col>
		                	{{scope.row.rule}}
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
		    <el-table-column label="等级名称" align="left" min-width="140">
		        <template scope="scope">
		            <el-row>
		                <el-col>
		                	{{scope.row.name}}
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
		    <el-table-column label="等级折扣" align="left" min-width="120">
		        <template scope="scope">
		            <el-row>
		                <el-col>
		                	{{scope.row.discount ? (scope.row.discount + '折') : '未设置'}}
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
		    <el-table-column label="操作" align="left" min-width="120">
		        <template scope="scope">
		            <el-row>
		                <el-col>
		                	<el-button type="text" @click="setName(scope.row)">设置等级名称</el-button>
		                	<el-button type="text" @click="setDiscount(scope.row)" v-if="scope.row.memberLevel != 0">输入等级折扣</el-button>
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
	  	</el-table>

	  	<el-dialog
		  	title="设置等级名称"
		  	:close-on-click-modal="false"
		  	:close-on-press-escape="false"
		  	:visible.sync="dialogVisible">
		  	<div class="m_b10">
		  		{{checkItem.nameSource}}：{{checkItem.rule}}
		  	</div>
		  	<div class="memberTable">
		  		<div class="clearfix">
		  			<span class="f-fl roeName">等级名称：</span>
		  			<!-- <el-input @keypress.native="keyupset" :maxlength="8" class="levelName f-fl" v-model.trim="input" placeholder=""></el-input> -->

					<input class="f-fl diaInp" type="text" v-model="input" maxlength="6" @keydown="keyupset">

		  			<span class="m_l10 font12 f-fl Inplen">{{input.length}}/6</span>
		  		</div>
		  		<div class="red">
		  			<span v-if="hasAler">当前等级名称已存在，请重新设置</span>
		  			<span v-if="nullInp">请设置等级名称</span>
		  			<span v-if="nametype">名称仅支持输入中英文和数字</span>
		  		</div>
		  	</div>
		  	<span slot="footer" class="dialog-footer">
			    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
			    <el-button size="small" type="primary" @click="sureName">确 定</el-button>
		  	</span>
		</el-dialog>

	  	<el-dialog
		  	title="设置等级折扣"
		  	:close-on-click-modal="false"
		  	:close-on-press-escape="false"
		  	:visible.sync="discountDialogVisible">
			<div class="intel_tip m_b10"><div class="intel_Warn">在此设置的会员等级折扣仅作会员中心展示用途，实际折扣请在商家后台设置</div></div>
		  	<div class="memberTable">
		  		<div class="clearfix">
		  			<span class="f-fl roeName">{{checkItem.nameSource}}等级折扣：</span>
					<input class="f-fl diaInp" type="text" v-model="checkItem.discount" maxlength="6" @keydown="keyupNumber">
					<span class="f-fl roeName" style="margin-left: 5px;">折</span>
		  		</div>
		  		<div class="red">{{discountError}}</div>
		  	</div>
		  	<span slot="footer" class="dialog-footer">
			    <el-button size="small" @click="discountDialogVisible = false">取 消</el-button>
			    <el-button size="small" type="primary" @click="sureDiscount">确 定</el-button>
		  	</span>
		</el-dialog>
	</div>

</template>

<script>
import http from './../../api/index.js';
import { isNum } from 'src/common/validation'
import {point} from 'src/common/point.js'
	export default{
		data() {
			return {
				nullInp: false,
				dialogVisible: false,
				discountDialogVisible: false,
				input: '',
				_index: -1,
				checkItem: {},
				hasAler: false,
				loadingBut: false,
				nametype: false,
				discountError: ''
			}
		},
		props: {
			tableData: Array
		},
		watch: {
			dialogVisible() {
				this.nullInp = false;
				this.hasAler = false;
				// this.input = '';
			},
			input(val) {
				this.nullInp = false;
				this.nametype = false;
			}
		},
		methods: {
			setName(item) {
				this.checkItem = {};
				for(let i in item) {
					this.checkItem[i] = item[i];
				}
				this._index = item.index;
				this.input = item.name;
				this.dialogVisible = true;
			},
			sureName() {
				this.memberLevelNameCheck();
			},
			memberLevelNameCheck() {		//校验名称是否存在
				if(!this.input) {
					// this.$message.error('等级名称不可为空！');
					this.nullInp = true;
					return
				}
				let reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
				if(!reg.test(this.input)) {
					this.nametype = true;
					return
				}

				this.loadingBut = true;
				http({
					api_name: 'memberLevelNameCheck',
					vm: this,
					data: {
						memberLevel: this.checkItem.memberLevel,
						name: this.input
					}
				}, (res) => {
          point('37977.39406.39460')
					this.hasAler = res.data ? res.data.existed : true;
					if(!this.hasAler) {
						this.memberLevelName();
					} else {
						this.loadingBut = false;
					}
				}, (error) => {
					this.loadingBut = false;
				})
			},
			memberLevelName() {			//设置等级名称
				http({
					api_name: 'memberLevelName',
					vm: this,
					data: {
						memberLevel: this.checkItem.memberLevel,
						name: this.input,
						nameSource: this.checkItem.nameSource
					}
				}, (res) => {
					this.loadingBut = false;
					this.tableData[this._index].name = this.input;
					this.dialogVisible = false;
				}, (error) => {
					this.loadingBut = false;
				})
			},
			keyupset(e) {
				if(e.keyCode == 8 || e.keyCode == 229 || ((e.keyCode >= 48 && e.keyCode <= 57) && !(/[!|@|#|\$|%|\^|&|\*|(|)|！|¥|）|（|…]/.test(e.key)) && !(e.code == 'Digit6' && e.key != 6)) || (e.keyCode >= 65 && e.keyCode <= 90)) {
				} else {
					e.preventDefault();
				}
			},
			keyupNumber(e){
				if((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 190 || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 8 || e.keyCode == 110){} else {
					e.preventDefault();
				}
			},
			setDiscount(item){
				this.checkItem = {};
				for(let i in item) {
					this.checkItem[i] = item[i];
				}
				this._index = item.index;
				this.input = item.discount || 10;
				this.discountDialogVisible = true;
				this.discountError = '';
			},
			sureDiscount(){
				let { discount } = this.checkItem;
				if(discount){
					if(!isNum(discount)){
						this.discountError = '请输入正确的等级折扣';
						return
					}
					discount *= 10;
					if(discount.toString().indexOf('.') != -1){
						this.discountError = '仅支持一位小数';
						return
					} else if(discount > 100){
						this.discountError = '折扣最大为10折';
						return
					}
				}
				if(this.loadingBut){ return }
				this.loadingBut = true;
				http({
					api_name: 'memberLevelDiscount',
					vm: this,
					data: {
						memberLevel: this.checkItem.memberLevel,
						discount: this.checkItem.discount || 0
					}
				}, result => {
          point('37977.39406.39461')
					this.loadingBut = false;
					this.tableData[this._index].discount = this.checkItem.discount;
					this.discountDialogVisible = false;
					this.discountError = '';
				}, error => {
					this.loadingBut = false;
					this.discountError = error.message
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	#memberTable{
		color: #333;
	}
	.levelName{
		width: 160px;
	}
	.memberTable{
		height: 70px;
		.red{
			padding-left: 70px;
			line-height: 30px;
		}
		.roeName{
			margin-top: 4px;
		}
		.Inplen{
			margin-top: 13px;
		}
	}
	.dialog-footer button{
		width: 60px;
	}
	.diaInp{
		outline: none;
	}
	.intel_Warn{
		height: auto;
		line-height: 1.5;
		padding: 10px 10px 10px 50px;
	}
</style>
