<template>
	<div>
		<welfare-top></welfare-top>
		<div class="center">
			<div class="center-item">
				<a href="javascript:;" @click="checkAuthority(0)">
					<img src="../../../assets/images/collage.png" alt="">
					<h3>拼团</h3>
					<p>会员邀请好友参与拼团，拼团成功所有参与者均可享受商品折扣</p>
				</a>
			</div>
			<div class="center-item">
				<a href="javascript:;" @click="checkAuthority(1)">
					<img src="../../../assets/images/bargain.png" alt="">
					<h3>砍价</h3>
					<p>会员邀请好友砍价，砍价成功后会员可享受商品折扣</p>
				</a>
			</div>
			<div class="center-item" style="display: none;">
				<a href="javascript:;" @click="checkAuthority(2)">
					<img src="../../../assets/images/partition.png" alt="">
					<h3>瓜分优惠券</h3>
					<p>会员邀请好友瓜分优惠券</p>
				</a>
			</div>
		</div>
		<authority-dialog ref="authority"  :linkArr="linkArr"></authority-dialog>
		<guide-dialog ref="guideDialog"></guide-dialog>
	</div>
</template>

<script>
import welfareTop from 'src/components/integral-interaction/welfare-top';
import authorityDialog from 'src/components/authority/authority';
import guideDialog from 'src/components/guide/guide.vue';
import {point} from 'src/common/point.js';
	export default{
		data() {
			return{
				linkArr: ['/collage','/bargain','partition']
			}
		},
		created(){
      point('37977.39405.39452')
		},
		components: {
			welfareTop,
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
				// const h = this.$createElement;
				// this.$msgbox({
				// 	title: '温馨提示',
				// 	message: h('div', null, [
				// 		h('p', null, '尊敬的商家：'),
				// 		h('p', null, '为确保大促期间会员中心页面能在微信端正常访问，应京麦服务市场要求，系统将于2018年10月18日起暂时关闭积分互动模块的微信分享功能，并预计在2018年11月12日重新开放。在此期间将无法新建【邀请好友关注店铺】、【拼团】和【砍价】活动。给您带来不便，敬请谅解。'),
				// 	])
				// });
				// return;
				this.$refs.authority.checkPower(type);
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
			&:hover {
				border-color: #ccc;
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
