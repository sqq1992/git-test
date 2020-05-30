<template>
	<div class="m-content diaWidth create-member-box" v-loading="fullscreenLoading">
		<div class="m-content-main main_height inputSet" id="createMembere" v-loading="loadingPage">
			<div class="row_line m_b10 activeNamediv">
				<span>活动名称：</span>
				<el-input :maxlength="20" @blur="checkName" v-model.trim="activeName" class="activeName" placeholder="请输入活动名称"></el-input>
				<div class="red" v-if="activeName.length > 20">
					活动名称最长不超过20个字
				</div>
				<div class="red" v-if="existed">
					当前活动名称已存在，请重新输入
				</div>
				<div class="red" v-if="noName">
					请输入活动名称
				</div>
			</div>
			<div class="row_line m_b10 activeNamediv">
				<span>活动时间：</span>
			    <el-date-picker
			    	:editable="false"
			    	class="row_date"
			    	:disabled="isStartEdit"
			      	v-model="dateOne"
			      	type="datetime"
			      	placeholder="选择日期时间"
			      	align="right"
			      	:picker-options="pickerLeft">
			    </el-date-picker>
			    <span class="">-</span>
			    <el-date-picker
			    	:editable="false"
			    	class="row_date"
			      	v-model="dateTwo"
			      	type="datetime"
			      	placeholder="选择日期时间"
			      	align="right"
			      	:picker-options="pickerRight">
			    </el-date-picker>
			    <div class="red" v-if="setTime">
					请设置活动起止时间
				</div>
			</div>

			<div class="clearfix m_b10">
				<span class="f-fl">活动信息：</span>
				<ul class="activeMess f-fl">
					<li class="row_line m_b5 activeRow">
						<span class="row_name">优惠券：</span>
						<span>{{chooseObj.name ? chooseObj.name : '--'}}</span>
						<el-button type="text" size="small" @click="choose(chooseObj)" style="margin-left: 10px;">{{chooseObj.name ? '重新选择' : '选择优惠券'}}</el-button>
						<a class="blueColor" href="https://prom.shop.jd.com/coupon/init.action" target="_blank" style="margin-left: 10px;">创建优惠券</a>
						<span style="margin-left: 10px;color: #666;font-size: 14px;">请创建【免费领取】【不公开】【全平台】优惠券</span>
						<div class="reds">
							<!-- 领券链接 -->
						</div>
					</li>
					<li class="row_line m_b5 activeRow">
						<span class="row_name">优惠券类型：</span>
						<span>{{chooseObj.bindType ? (chooseObj.bindType == 1 ? '店铺优惠券' : '商品优惠券') : '--'}}</span>
					</li>
					<li class="row_line m_b5 activeRow">
						<span class="row_name">使用门槛：</span>
						<span>满{{chooseObj.quota ? chooseObj.quota : '--'}}元可用</span>
					</li>
					<li class="row_line m_b5 activeRow">
						<span class="row_name">优惠券面值：</span>
						{{chooseObj.discount ? chooseObj.discountType == 1 ? chooseObj.discount : chooseObj.discount * 10 : '--'}}<span>{{chooseObj.discountType == 1 ? "元" : '折'}}</span>
					</li>
					<li class="row_line m_b5 activeRow">
						<span class="row_name">可领取会员：</span>
						<el-checkbox-group
						    v-model="checkedList">
						    <el-checkbox v-for="item in lists" :label="item.memberLevel" :key="item.memberLevel">{{item.name || item.nameSource}}</el-checkbox>
					  	</el-checkbox-group>
					</li>
					<li class="row_line m_b5 activeRow" v-if="member == 1">
						<span class="row_name">入会时长：</span>
						<span>激活会员后</span>
						<el-input @blur="blurInp('day')" v-model.trim="day" class="price"></el-input>
						<span>天内可领取</span>
						<div v-if="setDay" class="reds">
							请输入天数
						</div>
					</li>
				</ul>
			</div>
			<div class="sureBut">
				<el-button size="small" @click="goHistory">取消</el-button>
				<el-button type="primary" size="small" @click="sureChange">确定</el-button>
			</div>
		</div>
		<!-- <el-dialog
		  	title="选择优惠券"
		  	:close-on-click-modal="false"
		  	:close-on-press-escape="false"
		  	:visible.sync="dialogVisible">
		  	<div v-loading="loadingDia" class="fontClass inputSet">
		  		<div class="row_line">
		  			<el-form :inline="true" :model="formInline" class="demo-form-inline">
					  	<el-form-item label="优惠券名称：">
					    	<el-input @keyup.native.enter="couponQuery" class="inpWidth" v-model="formInline.user" placeholder=""></el-input>
					  	</el-form-item>
					  	<el-form-item label="使用范围：">
					    	<el-select @change="couponQuery" class="inpWidth" v-model="formInline.region" placeholder="">
					      		<el-option label="不限" value=""></el-option>
					      		<el-option label="全店铺" value="1"></el-option>
					      		<el-option label="限定商品" value="2"></el-option>
					      		<el-option label="限定某些商品不参加" value="3"></el-option>
					    	</el-select>
					  	</el-form-item>
					  	<el-form-item class="f-fr">
					    	<el-button size="small" type="text" @click="couponQuery">查询</el-button>
					  	</el-form-item>
					</el-form>
		  		</div>
		  		<ul class="coupon">
		  			<li v-for="item in coupons" class="clearfix">
		  				<div class="couponIcon f-fl">
		  					<img src="../../assets/images/u2181.png" height="64" width="64">
		  					<p >
		  						<span v-if="item.discountType == 2">{{item.discount*10}}折</span>
		  						<span  v-if="item.discountType == 1">¥{{item.discount}}</span>
		  					</p>
		  					<p>{{item.bindType == 1 ? '店铺优惠券' : '商品优惠券'}}</p>
		  				</div>
		  				<div class="couponMess f-fl">
		  					<span>{{item.name}}</span><br />
		  					<span class="leftSpan oneLine">满{{item.quota}}元可用</span>
		  					<span class="rightSpan f-fr">{{item.bindType == 1 ? '全店可用' : '部分可用'}}</span><br />
		  					<span class="leftSpan oneLine m_r10">总数量：{{item.num}}</span>
		  					<span class="rightSpan f-fr m_l10">已发放：{{item.takeNum}}</span>
		  				</div>
		  				<div class="couponBut blueColor cursor f-fr" @click="chooseItem(item)">
		  					{{item.couponId == chooseObj.couponId ? '已选取' : '选取'}}
		  				</div>
		  			</li>
		  		</ul>
		  		<div class="text-center" v-if="pageInfo.total">
		  			<el-pagination
			  			:current-page="pageInfo.pageNo"
			  			@current-change="handleCurrentChange"
				  		:page-size="pageInfo.pageSize"
					    layout="prev, pager, next"
					    :total="pageInfo.total">
				  	</el-pagination>
		  		</div>
		  	</div>
		</el-dialog> -->
		<coupon-dialog ref="addCoupon" @showCoupon="showCouponMsg" :data="currentAcitveData"></coupon-dialog>
	</div>
</template>

<script>
import dateFormat from './../../common/dateFormat.js';
import ajax from './../../api/index.js';
import couponDialog from 'src/view/integral/interaction/coupons.vue';
	export default{
		data() {
			return{
				currentAcitveData: {},
				chooseObj: {},
				couponName: '',
				coupons: [],
				pageInfo: {
					pageNo: 1,
					pageSize: 5,
					total: 0
				},
				dialogVisible: false,
				loadingDia: false,
				loadingPage: false,
				existed: false,
				activeName: '',
				day: '',
				dateOne: '',
				dateTwo: '',
				lists: ['全体成员', '注册会员', '铜牌会员', '银牌会员', '金牌会员', '铂金会员', '钻石会员'],
				checkedList: [],
				obj: {
					'0': '/onlymember',
					'1': '/newmember',
					'2': '/promotion'
				},
				pickerLeft: {
		          	disabledDate(time) {
		            	return time.getTime() < Date.now() - 8.64e7;
		          	}
		        },
		        pickerRight: {
		          	disabledDate(time) {
		            	return time.getTime() < Date.now() - 8.64e7;
		          	}
		        },
		        setTime: false,
		        setDay: false,
		        noName: false,
		        formInline: {
		          	user: '',
		          	region: ''
		        },
		        allData: [],
		        stateObj: {
					'未开始': 0,
					'进行中': 1,
					'已结束': 2,
				},
				fullscreenLoading: true,
				seeItem: {},
				isStartEdit: false
			}
		},
		created() {
			this.couponQuery();
		},
		computed: {
			member() {
				return this.$store.state.member;
			},
			editOrCreate() {
				return this.$store.state.editOrCreate;
			}
		},
		mounted() {
			this.checkedList = [];
			this.lists = []
			for (let i in this.memberAjax) {
				this.lists.push(this.memberAjax[i]);
			}
			this.dateOne = new Date();
			this.dateTwo = ((new Date).setDate((new Date).getDate() + 30));
			if(this.$route.query.id){
				this.getCouponDetail();
			}
			this.setNav();
			this.memberLevelList();
		},
		watch: {
			dateOne(val) {
				if(val && this.dateTwo) {
					this.setTime = false;
				}
				if(val) {
					this.pickerRight = {
						disabledDate(time) {
			            	return time.getTime() < new Date(val) - 8.64e7;
			          	}
					}
				} else {
					this.pickerRight = {
			          	disabledDate(time) {
			            	return time.getTime() < Date.now() - 8.64e7;
			          	}
			        }
				}
			},
			dateTwo(val) {
				if(val && this.dateOne) {
					this.setTime = false;
				}
			},
			activeName(val) {
				this.doFalse(val, 'noName');
			},
			day(val) {
				this.doFalse(val, 'setDay');
			}
		},
		components: {
			couponDialog
		},
		methods: {
			showCouponMsg(data) {
				this.chooseObj = data;
			},
			// 优惠券查询
			getCouponDetail(){
				ajax({
					api_name: 'getCouponDetail',
					data: {
						id: this.$route.query.id
					},
					vm: this
				}, result => {
					console.log(result);
					this.seeItem = result.data;
					this.fullscreenLoading = false;
					this.checkedList = [];
					if(this.seeItem.levelValues) {
						let arr = JSON.parse(this.seeItem.levelValues);
						this.checkedList = arr;
					}
					this.day = this.seeItem.memberDay;
					this.activeName = this.seeItem.activityName;
					this.dateOne = this.seeItem.activityStartTime;
					this.dateTwo = this.seeItem.activityEndTime;
					this.chooseObj = this.seeItem;
					if(new Date(this.seeItem.activityStartTime) * 1 < new Date() * 1){
						this.isStartEdit = true;
					}

				});
			},
			//会员等级规则
			memberLevelList() {
				let _self = this;
				ajax({
					api_name: 'memberLevelList',
					vm: this,
					data: {}
				}, (res) => {
					let arr = res.data ? (res.data.levelList ? res.data.levelList : []) : [];
					this.lists = arr;
					this.fullscreenLoading = false;
				}, (error) => {
				})
			},
			// 优惠券查询
			couponQuery(cb) {
				this.pageInfo.pageNo = 1;
				ajax({
					api_name: 'couponQuery',
					vm: this,
					data: {
						bindType: this.formInline.region,
						couponName: this.formInline.user
					}
				}, (res) => {
					this.allData = res.data ? (res.data.couponList ? res.data.couponList : []) : [];
					this.pageInfo.total = this.allData.length;
					this.coupons = this.allData.slice(0, 5);
					cb && cb();
				}, (error) => {});
			},
			chooseItem(item) {		//选取
				this.chooseObj = item;
				this.dialogVisible = false;
			},
			choose(obj) {			//选择优惠券
				// this.couponQuery(() => {
				// 	this.dialogVisible = true;
				// });
				let custom = '';
				if(obj.name && !obj.couponId) {
                   custom = {
					    bindType: obj.bindType,
						name: obj.name,
						discountType: obj.discountType,
						quota: obj.quota,
						discount: obj.discount,
						link: obj.couponUrl
				   }
				};
				this.$refs.addCoupon.addCoupons('',obj.couponId,custom);
			},
			handleCurrentChange(e) {
				this.pageInfo.pageNo = Number(e);
				let startIndex = (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize;
				let endIndex = (startIndex + this.pageInfo.pageSize) > this.pageInfo.total ? this.pageInfo.total : (startIndex + this.pageInfo.pageSize);
				this.coupons = this.allData.slice(startIndex, endIndex);
			},
			setNav(){
				let obj = {
					name: '权益中心',
					href: '/memberPower',
					childer: {
						name: '会员专享权益',
						href: '/memberPower',
						childer: {
							name: this.$route.query.type == 'old' ? '会员专享券' : '新会员专享券',
							href: this.$route.query.type == 'old' ? '/onlymember' : '/newmember',
							childer: {
								name: (this.$route.query.do == 'edit' ? '编辑' : '新建') + (this.$route.query.type == 'old' ? '会员专享券' : '新会员专享券')
							}
						}
					}
				};
				this.$emit('navTextChange', obj);
			},
			doFalse(val,item) {
				if(val) {
					this[item] = false;
				}
			},
			checkName() {
				if(!this.activeName) {
					this.existed = false; return
				}
				ajax({
					api_name: 'couponNameCheck',
					vm: this,
					data: {
						activityName: this.activeName,
						id: this.$route.query.id
					}
				}, (res) => {
					this.existed = res.data ? res.data.existed : true;
				}, (error) => {

				})
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

			goHistory() {		//取消
				this.$router.push({path: this.obj[this.member]});
			},
			sureChange() {		//确定
				if(!this.chooseObj.name) {
					this.$message.error('请选择优惠券！');
					return
				}
				if(this.existed) {
					this.$message.error('当前活动名称已存在，请重新输入');
					return
				}
				if(!this.activeName) {
					this.noName = true;
					return
				} else {
					this.noName = false;
				}
				if(!this.dateOne || !this.dateTwo){
					this.setTime = true;
					return
				} else {
					this.setTime = false;
				}
				let arr = this.checkedList;
				// this.checkedList.forEach(item => {
				// 	console.log(item);
				// 	if(item) {
				// 		arr.push(this.setMemberLevel[item]);
				// 	}
				// });
				if(!arr.length) {
					this.$message.error('请选择可领取会员！');
					return
				}
				if(this.member == 1 && !this.day) {
					this.setDay = true;
					return
				} else {
					this.setDay = false;
				}
				if(new Date(this.dateOne) > new Date(this.dateTwo)){
					this.$message.error('开始时间不能大于结束时间');
					return
        }
				let start = this.dateOne ? (dateFormat(this.dateOne,'YY-MM-DD HH:MM:SS')) : '';
				let end = this.dateTwo ? (dateFormat(this.dateTwo,'YY-MM-DD HH:MM:SS')) : '';
				let data = this.chooseObj;

				data.activityName = this.activeName,
				data.levelValues = JSON.stringify(arr),
				data.memberType = Number(this.member),
				data.activityStartTime = start,
				data.activityEndTime = end

				if(data.status) {
					data.status = this.stateObj[data.status];
				}
				if(this.member == 1) {
					if(!this.day || this.day == 0){
						this.$message.error('只能输入正整数！');
						return;
					}
					data.memberDay = this.day;
				}
				let api_name = (this.$route.query.do && this.$route.query.do == 'edit') ? 'couponEdit' : 'couponAdd';
				data.id = this.$route.query.id;
        this.loadingPage = true;
				ajax({
					api_name: api_name,
					vm: this,
					data: data
				}, (res) => {
					if(api_name == 'couponAdd') {
						let _point = this.$route.query.type == 'old' ? '37977.39408.39473.39476' : '37977.39408.39474.39477';
						point(_point);
					}
					this.loadingPage = false;
					this.$router.push({path: this.obj[this.member]});
				}, (error) => {
					this.loadingPage = false;
				})
			},
		}
	}
</script>

<style lang="less">
.create-member-box {
	.el-input{
		height: 30px;
		line-height: 28px;
		.gray {
		  color: #666;
		  font-size: 12px;
		}
		&.w200 {
			width: 200px;
		}
		&.w150 {
			width: 150px;
		}
		&.w50 {
			width: 50px;
		}
		.el-input__inner{
			width: 100%;
			height: 100%;
		}
	}
	.el-form-item {
		margin-bottom: 10px;
	}
}
</style>
<style lang="less" scoped>
	.m-content{
		.inpWidth{
			width: 110px;
		}
		.coupon{
			width: 100%;
			li{
				width: 100%;
				box-sizing: border-box;
				height: 94px;
				border: 1px solid #ddd;
				border-bottom: none;
				padding: 12px;
				overflow: hidden;
				.couponIcon{
					position: relative;
					overflow: hidden;
					height: 100%;
					width: 64px;
					img{
						position: absolute;
						z-index: -1;
						top: 0;
					    display: block;
					    transform-origin:center center; //旋转中心要是正中间 才行
					    transform: rotate(90deg);
					    -webkit-transform: rotate(90deg);
					    -moz-transform: rotate(90deg);
					    -ms-transform: rotate(90deg);
					    -o-transform: rotate(90deg);
					}
					p{
						margin-top: 10px;
						color: white;
						text-align: center;
						font-size: 12px;
						font-weight: 700;
						span{
							font-size: 16px;
						}
					}
					p:last-child{
						margin-top: 5px;
					}
				}
				.couponMess{
					//max-width: 360px;
					margin-left: 50px;
					overflow: hidden;
					span{
						display: inline-block;
						height: 21px;
						line-height: 21px;
					}
					.leftSpan{
						// min-width: 100px;
						max-width: 230px;
						// overflow: hidden;
					}
					.rightSpan{
						width: 98px;
						overflow: hidden;
					}
				}
				.couponBut{
					line-height: 68px;
				}
			}
			li:last-child{
				border-bottom: 1px solid #ddd;
			}
		}
	}
	.m-content-main{
		padding: 23px;
		font-size: 14px;
		color: #333;
		.activeName{
			width: 200px;
		}
		.row_date{
			width: 180px;
		}
		.m_b10{
			margin-bottom: 15px;
		}
		.activeNamediv{
			margin-bottom: 0;
			height: 50px;
			.red{
				margin-left: 74px;
				font-size: 12px;
			}
		}
		.activeMess{
			background: #FAFAFA;
			padding: 20px 20px 40px 0;
			min-width: 790px;
			li{
				.row_name{
					display: inline-block;
					width: 101px;
					text-align: right;
				}
				.row_link{
					width: 400px;
				}
				.go_link{
					text-decoration: none;
					color: #3089DE;
				}
				.price{
					width: 100px;
				}
				.el-checkbox-group{
					display: inline-block;
				}
			}
			.activeRow{
				height: 50px;
				.reds{
					color: red;
					font-size: 12px;
					margin-left: 106px;
				}
			}
		}
		.sureBut{
			margin-left: 70px;
			button{
				width: 78px;
			}
		}

	}
</style>
