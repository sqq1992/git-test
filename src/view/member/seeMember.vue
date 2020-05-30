<template>
	<div class="m-content" v-loading="fullscreenLoading">
		<div class="m-content-main main_height inputSet" id="createMembere">
			<div class="row_line m_b10">
				<span>活动名称：</span>
				<span>{{seeItem.activityName}}</span>
			</div>
			<div class="row_line m_b10">
				<span>活动时间：</span>
				<span>{{seeItem.activityStartTime}} - {{seeItem.activityEndTime}}</span>
			</div>
			<div class="clearfix m_b10">
				<span class="f-fl">活动信息：</span>
				<ul class="activeMess f-fl">
					<li class="row_line m_b10">
						<span class="row_name">优惠券：</span>
						{{seeItem.name}}
					</li>
					<li class="row_line m_b5 activeRow">
						<span class="row_name">优惠券类型：</span>
						<span>{{seeItem.bindType ? (seeItem.bindType == 1 ? '店铺优惠券' : '商品优惠券') : '--'}}</span>
					</li>
					<li class="row_line m_b10">
						<span class="row_name">使用门槛：</span>
						<span>满{{seeItem.quota ? Number(seeItem.quota).toFixed(2) : '-'}}元可用</span>
					</li>
					<li class="row_line m_b10">
						<span class="row_name">优惠券面值：</span>
						<span>{{seeItem.discount}} {{seeItem.discountType == 1 ? '元' : '折'}}</span>						
					</li>
					<li class="row_line m_b10">
						<span class="row_name">可领取会员：</span>
						<el-checkbox-group 
						    v-model="checkedList">
						    <el-checkbox v-for="item in lists" disabled :label="item.memberLevel" :key="item.memberLevel">{{item.name || item.nameSource}}</el-checkbox>
					  	</el-checkbox-group>
					</li>
					<li class="row_line m_b10" v-if="member == 1">
						<span class="row_name">入会时长：</span>
						<span>激活会员后{{seeItem.memberDay}}天内可领取</span>
					</li>
				</ul>
			</div>
			<!-- <div class="sureBut">
				<el-button size="small" @click="goHistory">取消</el-button>
				<el-button type="primary" size="small" @click="goHistory">确定</el-button>
			</div> -->
		</div>
	</div>
</template>

<script>
import ajax from 'src/api/index.js';
export default{
	data() {
		return {
            fullscreenLoading: true,
			input: '',
			dateOne: '',
			dateTwo: '',
			radio: '1',
			lists: ['注册会员', '一星会员', '二星会员', '三星会员', '四星会员', '五星会员'],
			checkedList: [],
			obj: {
				'0': '/onlymember',
				'1': '/newmember',
				'2': '/promotion'
			},
			seeItem: {}
		}
	},
	created() {
		this.getCouponDetail();
		this.memberLevelList();
	},
	computed: {
		member() {
			return this.$store.state.member;
		},
		memberAjax() {
			return this.$store.state.memberAjax;
		},
		memberList() {
			return this.$store.state.memberList;
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.setNav();
		});
	},
	methods: {
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
							name: '查看' + (this.$route.query.type == 'old' ? '会员专享券' : '新会员专享券')
						}
					}
				}
			};
			this.$emit('navTextChange', obj);
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
			}, (error) => {
			})
		},
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
			});
		},
		goHistory() {
			this.$router.push({path: this.obj[this.member]});
		}
	}
}
</script>

<style lang="less" scoped>
	.m-content-main{
		padding: 23px;
		font-size: 14px;
		color: #333;
		.activeName{
			width: 200px;
		}
		.row_date{
			width: 150px;
		}
		.m_b10{
			margin-bottom: 15px;
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
		}
		.sureBut{
			margin-left: 70px;
			button{
				width: 78px;
			}
		}
	}
</style>