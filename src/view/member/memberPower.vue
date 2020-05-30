<template>
	<div class="m-content">
		<div class="m-content-main main_height">
			<ul class="power clearfix">
				<li @click="routerPush(item,index)" v-for="(item,index) in itemArr" :key="index" :class="item.className" class="f-fl">
					<span class="item_name">{{item.name}}</span>
					<div class="item_desc m_b5">
						{{item.desc}}
					</div>
					<div class="font12 item_num">
						<span>已创建：{{item.arealy}}</span>
						<span class="m_l5" v-show="item.className !== 'powerFou'">生效中：{{item.doing}}</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import http from './../../api/index.js';
import {mapMutations} from 'vuex';
	export default{
		data() {
			return{
				itemArr: [{
					className: 'powerOne',
					name: '会员专享券',
					desc: '会员专享满减东券，将在会员中心展示',
					arealy: '--',
					doing: '--',
					link: '/onlymember'
				}, {
					className: 'powerUser',
					name: '新会员专享券',
					desc: '新会员专享满减东券，新会员可在会员中心领取',
					arealy: '--',
					doing: '--',
					link: '/newmember'
				}
				, {
					className: 'powerPro',
					name: '会员专享价',
					desc: '允许指定等级的店铺会员在活动页面中领取商品专属折扣',
					arealy: '--',
					doing: '--',
					link: '/promotion'
				},
				{
					className: 'powerFou',
					name: '开卡礼包',
					desc: '新会员开卡入会后，可领取礼包奖励',
					arealy: '--',
					link: '/memberCardList'
				}
				// , {
				// 	className: 'powerPro',
				// 	name: '会员专享促销',
				// 	desc: '指定会员专享的店铺商品促销，可在 会员中',
				// 	arealy: 10,
				// 	doing: 1,
				// 	link: '/promotion'
				// }
				]
			}
		},
		created(){
			this.init();
		},
		components: {
		},
		mounted() {
			this.memberLevelList();
		},
		methods: {
			...mapMutations(['SET_MEMBER', 'SET_MEMBER_AJAX', 'SET_MEMBER_LEBEL']),
			routerPush(item,index) {
				this.SET_MEMBER(index);
				this.$router.push({path: item.link});
			},
			init() {
				http({
					api_name: 'couponStatus',
					vm: this,
					data: {}
				}, (res) => {
					let arr = res.data ? (res.data.couponTypeList ? res.data.couponTypeList : []) : [];
					arr.forEach((item, index) => {
						if(item.memberType == 0) {
							this.itemArr[0].doing = item.on;
							this.itemArr[0].arealy = item.total;
						} else if(item.memberType == 1) {
							this.itemArr[1].doing = item.on;
							this.itemArr[1].arealy = item.total;
						}else if(item.memberType == 3) {
							this.itemArr[2].doing = item.on;
							this.itemArr[2].arealy = item.total;
						}else if(item.memberType == 4) {
							this.itemArr[3].arealy = item.total;
						}
					});
				}, (error) => {

				})
			},
			memberLevelList() {			//会员等级规则
				let _self = this;
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
					_self.SET_MEMBER_AJAX(obj);
					_self.SET_MEMBER_LEBEL(lebelObj);
				}, (error) => {
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.m-content-main{
		box-sizing: border-box;
		padding: 25px 25px 30px 33px;
		font-size: 14px;
		color: #333;
		.power{
			width: 100%;
			li{
				box-sizing: border-box;
				width: 268px;
				height: 173px;
				// border: 1px solid rgb(215,215,215);
				// box-shadow: 1px 1px 1px 0px rgb(215,215,215);
				box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.2); 
				margin-right: 40px;
				margin-bottom: 40px;
				text-align: center;
				padding: 30px 14px 0; 
				cursor: pointer;
				color: white;
				position: relative;
				.item_desc{
					margin-top: 20px;
				}
				.item_name{
					font-size: 16px;
					margin-left: 38px;
				}
				.item_num{
					position: absolute;
					bottom: 11px;
					text-align: center;
					color: #999999;
					width: 238px;
				}
			}
			.powerOne{
				background: url(./../../assets/images/memberone.png) no-repeat center;
			}
			.powerUser{
				background: url(./../../assets/images/membertwo.png) no-repeat center;
			}
			.powerPro{
				background: url(./../../assets/images/memberthr.png) no-repeat center;
			}
			.powerFou{
				background: url(./../../assets/images/memberfou.png) no-repeat center;
				background-size: contain;
			}
		}
	}
</style>