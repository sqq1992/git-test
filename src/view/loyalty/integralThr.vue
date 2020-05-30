<template>
	<div class="m-content integralThr" v-loading="loadingPage">
		<!-- <div class="m-content-main main_height"> -->
			<div class="tips">
				满足以下规则的订单可在获得京东官方购物积分的同时获得奖励积分。若同时满足多个奖励规则奖励叠加。最多可添加5个奖励规则。
			</div>
			<div class="clearfix m_b10 m_t20 hidden">
				<span>单笔订单最大奖励积分上限：{{maxIntegral}}</span>
				<el-button @click="setIntegralDia = true" type="text" size="small" class="m_l20">重新设置</el-button>
				<el-button @click="addNew" type="primary" size="small" class="m_l20 f-fr">添加奖励规则</el-button>
			</div>
			<ul class="listTable">
				<li v-for="item in tableData" class="m_b10">
					<div class="clearfix hidden header">
						<span class="f-fl ruleName">{{item.ruleName}}</span>
						<span :class="{'red': !item.isOn, 'green': item.isOn}" class="m_l10 font12 inline_block f-fl">{{item.isOn ? '生效中' : '未生效'}}</span>
						<span @click="deleteRow(item)" class="f-fr font12 deleteSpan cursor">删除</span>
						<span @click="editRow(item)" class="f-fr font12 editSpan cursor">编辑</span>
					</div>
					<div class="clearfix detail hidden">
						<div class="f-fl detail_left">
							<div class="clearfix hidden row_line">
								<div class="f-fl every">
									<span class="span_name_l span_name">下单时间：</span>
									<span>{{item.orderDateType == 3 ? (item.orderStartTime ? (item.orderStartTime + '至' + item.orderEndTime) : '--') : (item.orderDateType == 1 ? (item.orderStartDate ? ('每周周' + weekObj[item.orderStartDate] + '至周' + weekObj[item.orderEndDate]) : '--') : (item.orderDateType == 2 ? ('每月' + item.orderStartDate + '号至' + item.orderEndDate + '号') : '--'))}}</span>
								</div>
								<div class="f-fl every">
									<span class="span_name_r span_name">实付金额（不含邮费）：</span><span>{{item.compareType == 0 ? "不限" : (item.compareType == 1 ? ('≥' + item.paid + '元') : ('≤' + item.paid + '元')) | numFormat}}</span>
								</div>
								<div class="f-fl every">
									<span class="span_name_l span_name">付款时间：</span>
									<span>{{item.payDateType == 3 ? (item.payStartTime ? (item.payStartTime + '至' + item.payEndTime) : '--') : (item.payDateType == 1 ? (item.payStartDate ? ('每周周' + weekObj[item.payStartDate] + '至周' + weekObj[item.payEndDate]) : '--') : (item.payDateType == 2 ? ('每月' + item.payStartDate + '号至' + item.payEndDate + '号') : '--'))}}</span>
								</div>
								<div class="f-fl every">
									<span class="span_name_r span_name">屏蔽优惠订单：</span><span>{{item.shieldDiscountOrder ? '屏蔽' : '不屏蔽'}}</span>
								</div>
								<div class="f-fl every">
									<span class="span_name_l span_name">交易完成时间：</span>
									<span>{{item.tradeDateType == 3 ? (item.tradeStartTime ? (item.tradeStartTime + '至' + item.tradeEndTime) : '--') : (item.tradeDateType == 1 ? (item.tradeStartDate ? ('每周周' + weekObj[item.tradeStartDate] + '至周' + weekObj[item.tradeEndDate]) : '--') : (item.tradeDateType == 2 ? ('每月' + item.tradeStartDate + '号至' + item.tradeEndDate + '号') : '--'))}}</span>
								</div>
								<div class="f-fl every">
									<span class="span_name_r span_name">
										会员等级：
									</span>
									<span v-if="item.memberType && JSON.parse(item.memberType).length">
										<span v-for='list,index in (item.memberType ? JSON.parse(item.memberType) : [])'>
											{{levelName[list]}}<span v-if="index < (JSON.parse(item.memberType).length - 1)">、</span>
										</span>
									</span>
									<span v-else>--</span>
								</div>
								<div class="f-fl every">
									<span class="span_name_l span_name">包含指定商品：</span>
									<el-button v-if="item.skus && JSON.parse(item.skus).length" type="text" size="small" @click="goodsDetail(item)">查看</el-button>
									<span v-else>--</span>
								</div>
							</div>
						</div>
						<div class="f-fr detail_right">
							同时满足所有条件，相应订单即可获得奖励积分：
							<div class="m_l20 m_t10">
								{{item.scoreType == 1 ? `固定${item.score}积分` : `成交金额的${item.score}倍` | numFormat}}
							</div>
						</div>
					</div>
				</li>
			</ul>
		<!-- </div> -->
		<el-dialog
		    :style="{'opacity': dialogOpacity}"
			class="inputSet"
		  	:title="title"
		  	:close-on-click-modal="false"
		  	:close-on-press-escape="false"
		  	:visible.sync="dialogVisible">
			<rewardRule :goodsMsg="goodsMsg"  @showGoods="showGoods" :tableData="tableData" @sureBut="sureBut" :dialogVisible="dialogVisible" :rowObj="rowObj" :levelName="levelName" :levelList="levelList"></rewardRule>
		</el-dialog>
		<goods-choose :selectIdList="selectIdList" :checkGoodsList="goodList" :config="config" :type="goodsType" v-if="goodsVisible" @close="closeGoods" @check="checkDialog"></goods-choose>
		<div class="setMaxDia">
			<el-dialog
				class="inputSet"
			  	title="奖励积分设置"
			  	:close-on-click-modal="false"
			  	:close-on-press-escape="false"
			  	:visible.sync="setIntegralDia">
				<div class="setMax row_line">
					<span>单笔奖励积分上限：</span>
					<el-input @blur="blurInp('setMaxIntegral')" v-model.trim="setMaxIntegral" class="setMaxWidth"></el-input>
					<div class="red" v-if="Number(setMaxIntegral) > 9999">单笔奖励积分最大值为9999</div>
					<div class="red" v-if="maxNull">单笔奖励积分上限不能为空</div>
				</div>
				<div class="text-center sureBut">
					<el-button size="small" @click="setIntegralDia = false">取消</el-button>
					<el-button type="primary" size="small" @click="checkInte">确定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import http from './../../api/index.js';
import rewardRule from './rewardRule';
import dateFormat from './../../common/dateFormat.js'
import goodsChoose from 'src/components/goods-choose/goods-choose';
import {point} from 'src/common/point.js';
	export default{
		data() {
			return{
				config: {
				   title: '设置商品',
				   hideHint: true,
				   maxCheckNum: 5
				},
				goodsType: 'checkbox',
				goodsVisible: false,
				selectIdList: [],
				goodList: [],
				dialogOpacity: 1,
				maxNull: false,
				loadingPage: false,
				setIntegralDia: false,
				dialogVisible: false,
				title: '编辑奖励规则',
				maxIntegral: 100,
				setMaxIntegral: '',
				tableData: [],
				levelName: {},
				levelList: {},
				rowObj: {},
				CrmUser: {},
				goodsMsg: {
					goodsNum: 0,
				    skuList: []
				},
				weekObj: {
					1: '一',
					2: '二',
					3: '三',
					4: '四',
					5: '五',
					6: '六',
					7: '日',
				}
			}
		},
		created(){
      point('37977.39407.39463');
			this.memberLevelList();
			this.memberLook();
			this.memberQuery();
		},
		computed: {
			isZiying(){
				return this.$store.state.ziying.isZiying
			}
		},
		components: {
			rewardRule,
			goodsChoose
		},
		watch: {
			setMaxIntegral(val) {
				this.maxNull = false;
			},
			setIntegralDia(val) {
				this.setMaxIntegral = this.maxIntegral;
			}
		},
		methods: {
			goodsDetail(item) {
				this.goodsType =  'detail';
				this.goodsVisible = true;
				this.config = {
				   title: ' ',
				   hideHint: true,
				   hideSearch: true,
				   appointType: item.filterSkusType,
				   close: false,
				   goodsList: item.skus ? JSON.parse(item.skus) : []
				};
			},
			checkDialog(checkList, checkGoodsIdList) {
			   let num =  checkList.length;
			   if(num > 5) {
				   this.$message.error('最多可指定5件商品！');
				   return false;
			   };
			   this.selectIdList = checkGoodsIdList;
			   console.log(checkGoodsIdList)
			   this.goodList = checkList;
			   this.goodsMsg = {
				   goodsNum: num,
				   skuList: checkList
			   }
			   this.closeGoods();
			},
			closeGoods() {
				this.goodsVisible = false;
				this.dialogOpacity = 1;
			},
			showGoods(list) {
			   let _id = [];
			   if(list && list.length) {
					list.forEach(item => {
					_id.push(item.wareId);
					});
			   }
			   this.selectIdList = _id;
			   this.goodList = list || [];
			   this.goodsType =  'checkbox';
			   this.config = {
				   title: '设置商品',
				   hideHint: true,
				   maxCheckNum: 5
				};
			   this.goodsVisible = true;
			   this.dialogOpacity = 0;
			},
			//获取最大奖励积分上限
			memberQuery() {
				http({
					api_name: 'memberquery',
					vm: this,
					data: {}
				}, (res) => {
					this.maxIntegral = res.data.CrmUser ? (res.data.CrmUser.maxPointsPerOrder ? res.data.CrmUser.maxPointsPerOrder : 100) : 100;
					this.CrmUser = res.data.CrmUser ? res.data.CrmUser : {pin: '', id: ''};
				});
			},
			sureBut(text) {		//子组件
				this.dialogVisible = false;
				if(!text) {
					this.memberLook();
				}
			},
			memberLook() {			//查询奖励规则
				this.loadingPage = true;
				http({
					api_name: 'memberLook',
					vm: this,
					data: {}
				}, (res) => {
					this.tableData = res.data.list;
					this.tableData.forEach(item => {
						item.orderStartTime = item.orderStartTime ? dateFormat(item.orderStartTime, 'YY-MM-DD') : '';
						item.orderEndTime = item.orderEndTime ? dateFormat(item.orderEndTime, 'YY-MM-DD') : '';
						item.payStartTime = item.payStartTime ? dateFormat(item.payStartTime, 'YY-MM-DD') : '';
						item.payEndTime = item.payEndTime ? dateFormat(item.payEndTime, 'YY-MM-DD') : '';
						item.tradeStartTime = item.tradeStartTime ? dateFormat(item.tradeStartTime, 'YY-MM-DD') : '';
						item.tradeEndTime = item.tradeEndTime ? dateFormat(item.tradeEndTime, 'YY-MM-DD') : '';
					});
					this.loadingPage = false;
				}, (error) => {
					this.loadingPage = false;
				});
			},
			addNew() {				//添加奖励规则
				if(this.isZiying){
					this.$alert('该功能暂不支持自营店铺', '温馨提示');
					return
				}
				if(this.tableData.length >= 5) {
					this.$message.error('最多可添加5个奖励规则。');
					return
				}
				this.title = '新建奖励规则';
				this.rowObj = 0;
				this.goodsMsg = {};
				this.dialogVisible = true;
			},
			editRow(item) {
				this.title = '编辑奖励规则';
				this.rowObj = item;
				this.dialogVisible = true;
			},
			deleteRow(item) {
				this.$confirm('确定删除次奖励积分规则吗？', '删除提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'info'
		        }).then(() => {
		          	this.loadingPage = true;
					http({
						api_name: 'memberdelete',
						vm: this,
						data: {
							ruleId: item.id
						}
					}, (res) => {
						this.memberLook();
					}, (error) => {
						this.loadingPage = false;
					});
		        }).catch(() => {
		        });
			},
			blurInp(item) {			//失焦事件
				if(isNaN(Number(this[item])) || /\./.test(this[item]) || /\+/.test(this[item])) {
					this.$message.error('只能输入正整数！');
					this[item] = '';
					return
				}
				if(Number(this[item] < 0)) {
					this.$message.error('只能输入正整数！');
					this[item] = '';
					return
				}
			},
			checkInte() {				//设置单笔奖励积分
				if(!this.setMaxIntegral) {
					this.maxNull = true;
					return
				}
				if(Number(this.setMaxIntegral) > 9999) return
				http({
					api_name: 'memberSetPoints',
					vm: this,
					data: {
						maxPointsPerOrder: this.setMaxIntegral,
						id: this.CrmUser.id
					}
				}, (res) => {
					this.setIntegralDia = false;
					this.maxIntegral = this.setMaxIntegral;
					this.memberQuery();
				}, (error) => {
				});
			},
			memberLevelList() {			//会员等级规则
				http({
					api_name: 'memberLevelList',
					vm: this,
					data: {}
				}, (res) => {
					let obj = {};
					let lebelObj = {};
					let arr = res.data ? (res.data.levelList ? res.data.levelList : []) : [];
					arr.forEach(item => {
						obj[item.memberLevel] = item.name ? item.name : item.nameSource;
						if(item.name) {
							lebelObj[item.name] = item.memberLevel;
						} else {
							lebelObj[item.nameSource] = item.memberLevel;
						}

					});
					this.levelName = obj;
					this.levelList = lebelObj;
				}, (error) => {
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.m-content-main{
	font-size: 14px;
	padding: 0 25px 30px 15px;
	box-sizing: border-box;
	.tips{
		border: 1px solid rgb(251,225,185);
		padding: 10px 22px;
		background: rgb(254,249,241);
	}
	.listTable{
		width: 100%;
		color: #666;
		li{
			//width: 100%;
			border: 1px solid rgba(204,204,204,1);
			.header{
				padding: 0 15px;
				height: 36px;
				line-height: 36px;
				border-bottom: 1px solid rgb(228, 228, 288);
				background: rgb(242,242,242);
				.green{
					color: #52C41A;
					width:49px;
					height:22px;
					background:rgba(246,255,237,1);
					border-radius:4px;
					border:1px solid rgba(183,235,143,1);
					margin-top: 7px;
					line-height: 22px;
					text-align: center;
				}
				.red{
					color: #F5222D;
					width:55px;
					height:22px;
					background:rgba(255,241,240,1);
					border-radius:4px;
					border:1px solid rgba(255,163,158,1);
					margin-top: 7px;
					line-height: 22px;
					text-align: center;
				}
				.ruleName{
					color: #333;
					font-size: 16px;
				}
			}
			.detail{
				padding: 10px;
				.detail_left{
					border-right: 1px solid rgba(204,204,204,1);
					width: 65%;
					padding-right: 20px;
					box-sizing: border-box;
				}
				.detail_right{
					width: 33%;
					div{
						color: #333;
					}
				}
				.row_line{
					.span_name{
						display: inline-block;
						text-align: right;
					}
					.span_name_l{
						width: 105px;
					}
					.span_name_r{
						width: 155px;
					}
					.every{
						width: 49%;
						line-height: 28px;
					}
				}
			}
			.deleteSpan{
				display: inline-block;
				width:39px;
				height:22px;
				border-radius:3px;
				border:1px solid rgba(204,204,204,1);
				line-height: 22px;
				margin-top: 7px;
				color: #666666;
				text-align: center;
				margin-left: 10px;
			}
			.editSpan{
				width:39px;
				height:22px;
				border-radius:3px;
				border:1px solid rgba(58,154,246,1);
				line-height: 22px;
				margin-top: 7px;
				color: #3A9AF6;
				text-align: center;
			}
		}
	}
	.setMaxWidth{
		width: 120px;
	}
	.setMax{
		height: 80px;
	}
	.sureBut{
		button{
			width: 80px;
		}
	}
}
</style>
