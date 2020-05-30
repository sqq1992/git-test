<template>
	<div>
		<interaction-top></interaction-top>
		<div class="center">
			<div class="center-item">
				<a href="javascript:void(0)" @click="checkAuthority(0)">
					<img :src="signIn" alt="">
					<h3>每日签到</h3>
					<p>培养会员每日访问店铺习惯，提升店铺的会员粘性。</p>
				</a>
				<!-- <a href="javascript:void(0)" class="editIcon" @click.stop="showEditDialog">修改图标</a> -->
			</div>
			<div class="center-item">
				<a href="javascript:void(0)" @click="checkAuthority(1)">
					<img :src="luckDraw" alt="">
					<h3>大转盘</h3>
					<p>常见有效的会员互动形式，通过奖励调动会员参与积极性。</p>
				</a>
			</div>
			<div class="center-item">
				<a href="javascript:void(0)" @click="checkAuthority(2)">
					<img :src="shop" alt="">
					<h3>关注店铺</h3>
					<p>引导会员关注店铺，增加店铺关注量，提升店铺权重。</p>
				</a>
				<!-- <a href="javascript:void(0)" class="editIcon" @click.stop="showEditDialog">修改图标</a> -->
			</div>
			<!-- <div class="center-item">
				<a href="javascript:void(0)" @click="checkAuthority(3)">
					<img src="../../../assets/images/focusGoods.png" alt="">
					<h3>收藏有礼</h3>
					<p>通过优惠券等权益引导会员收藏，提升宝贝权重</p>
				</a>
			</div>
			<div class="center-item">
				<a href="javascript:void(0)" @click="checkAuthority(4)">
					<img src="../../../assets/images/goods.png" alt="">
					<h3>宝贝加购</h3>
					<p>通过优惠券等权益引导会员加购，提升宝贝权重</p>
				</a>
			</div> -->
			<div class="center-item">
				<a href="javascript:void(0)" @click="checkAuthority(5)">
					<img :src="inviting" alt="">
					<h3>邀请好友关注店铺</h3>
					<p>引导会员邀请好友关注店铺，增加店铺关注量，提升店铺权重。</p>
				</a>
			</div>
			<div class="center-item">
				<a href="javascript:void(0)" @click="checkAuthority(6)">
					<img :src="perfect" alt="">
					<h3>完善会员信息</h3>
					<p>引导会员完善个人信息，便于店铺进行会员关怀营销</p>
				</a>
			</div>
		<!-- <div class="center-item">
			<a href="javascript:void(0)" @click="checkAuthority(7)">
				<img :src="membership" alt="">
				<h3>{{inBrand ? '开卡奖励' : '新人入会礼'}}</h3>
				<p>引导新人入会，增加店铺会员</p>
			</a>
		</div> -->
		<div class="center-item new">
			<a href="javascript:void(0)" @click="checkAuthority(8)">
				<img :src="h5GameImg" alt="">
				<h3>趣味小游戏</h3>
				<p>通过趣味小游戏，吸引用户每天访问店铺，提升会员粘性，同时也提供了更多的积分消费渠道</p>
			</a>
		</div>
		<div class="center-item new" v-if="!isZiying">
			<a href="javascript:void(0)" @click="checkAuthority(9)">
				<img :src="purchaseImg" alt="">
				<h3>加购关注商品有礼</h3>
				<p>引导会员加购关注商品，提升商品权重</p>
			</a>
		</div>
		<div class="center-item new" v-if="!isZiying">
			<a href="javascript:void(0)" @click="checkAuthority(10)">
				<img :src="invitePurchaseImg" alt="">
				<h3>邀请加购关注商品</h3>
				<p>引导会员邀请好友加购关注商品，提升商品权重</p>
			</a>
		</div>
		</div>
		<authority-dialog ref="authority"  :linkArr="linkArr"></authority-dialog>
		<guide-dialog ref="guideDialog"></guide-dialog>
	</div>
</template>

<script>
import interactionTop from 'src/components/integral-interaction/interaction-top';
import authorityDialog from 'src/components/authority/authority';
import guideDialog from 'src/components/guide/guide.vue';
import ajax from 'src/api/index.js';
import signIn from 'src/assets/images/sign-in.svg';
import luckDraw from 'src/assets/images/luck-draw.svg';
import shop from 'src/assets/images/shop-icon.png';
import inviting from 'src/assets/images/inviting.png';
import perfect from 'src/assets/images/perfect.png';
import membership from 'src/assets/images/membership.png';
import h5GameImg from 'src/assets/images/h5Game.png';
import purchaseImg from 'src/assets/images/purchase.png';
import invitePurchaseImg from 'src/assets/images/invitePurchase.png'
export default{
	data() {
		return {
			linkArr: ['/sign','/turntable','/followShop','/focusGoods','/buyGoods','/inviting','/perfectMsg','/newMembership','/h5Game','/purchase','invitePurchase'],
			signIn,
			luckDraw,
			shop,
			inviting,
			perfect,
			membership,
			h5GameImg,
			inBrand:this.$store.state.user.inBrand,
			purchaseImg,
			invitePurchaseImg,
			isZiying:this.$store.state.ziying.isZiying,
		}
	},
	created(){
	},
	components: {
		interactionTop,
		authorityDialog,
		guideDialog
	},
	mounted() {
		//引导
		let _guide = this.$route.query.guide;
		if(_guide) {
			this.$refs.guideDialog.show(_guide, 2);
		}
	},
	methods: {
		checkAuthority(type) {
			const h = this.$createElement;
			let vm = this;
			if(type == 6) {
				ajax({
					api_name: 'getMemberRuleById'
				}, result => {
					vm.$refs.authority.checkPower(type);
				}, error => {
					vm.$message.error(error.message || '存在已启用的完善会员信息活动');
				});
			} else if(type == 7){
				ajax({
					api_name: 'checkIfExists'
				}, result => {
					vm.$refs.authority.checkPower(type);
				}, error => {
					vm.$message.error(error.message || `存在已启用的${this.inBrand ? '开卡奖励' : '新人入会礼'}活动`);
				});
			}else {
				vm.$refs.authority.checkPower(type);
			}
		}
	}
}
</script>

<style lang="less" scoped>
.center {
	padding: 10px;
	font-size: 0px;
	   .center-item {
			width: 300px;
			padding: 10px 10px 10px 108px;
			height: 105px;
			display: inline-block;
			box-sizing: border-box;
			border: 1px solid #ededed;
			border-radius: 4px;
			transition: borderColor ease .5s;
			position: relative;
			margin: 0 10px 10px 0;
      vertical-align: middle;
      position: relative;
      overflow: hidden;
			&:hover {
				border-color: #ccc;
      }
      &.new {
        &::after {
          content: 'new';
          color: #fff;
          text-align: center;
          font-size: 15px;
          display: block;
          height: 20px;
          line-height: 16px;
          background: red;
          width: 100px;
          transform: rotate(40deg);
          position: absolute;
          right: -32px;
		  top: 5px;
        }
      }
		img {
			width: 68px;
			height: 68px;
			position: absolute;
			top: 50%;
			margin-top: -34px;
			left: 20px;
		}
		a {
			display: block;
		}
		p {
			font-size: 12px;
			color: #888;
		}
		h3 {
			font-weight: bold;
			font-size: 14px;
			padding: 10px 0 5px 0;
		}
		.editIcon{
			position: absolute;
			font-size: 12px;
			top: 10px;
			right: 10px;
			color: #3089dc;
		}
   }
}
</style>
<style lang="less">
.center-dialog-box {
	.el-dialog--small {
		width: 400px;
	}
}
</style>
