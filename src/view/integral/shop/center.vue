<template>
	<div>
		<integral-top></integral-top>
		<div class="center">
			<div class="center-item">
				<a href="javascript:;" @click="checkAuthority(0)">
					<img src="../../../assets/images/tb_coupon.png" alt="">
					<h3>店铺/商品优惠券</h3>
					<p>通过优惠券引导会员进店购买，提升互动转化</p>
				</a>
			</div>
			<div class="center-item">
				<a href="javascript:;" @click="checkAuthority(1)">
					<img src="../../../assets/images/matter.png" alt="">
					<h3>实物礼品</h3>
					<p>自定义奖品，需要商家手工发放。</p>
				</a>
			</div>
			<div class="center-item">
				<a href="javascript:;" @click="checkAuthority(2)">
					<img src="../../../assets/images/discount.png" alt="">
					<h3>商品折扣</h3>
					<p>积分兑换指定商品的专属折扣</p>
				</a>
			</div>
		</div>
		<authority-dialog ref="authority"  :linkArr="linkArr"></authority-dialog>
		<guide-dialog ref="guideDialog"></guide-dialog>
	</div>
</template>

<script>
import integralTop from 'src/components/integral-interaction/integral-top';
import authorityDialog from 'src/components/authority/authority';
import guideDialog from 'src/components/guide/guide.vue';
import {point} from 'src/common/point.js';
	export default{
		data() {
			return{
				linkArr: ['/jdGiftCoupon','/matter', '/discount']
			}
		},
		created(){
      point('37977.39404.39439')
		},
		components: {
			integralTop,
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
			display: inline-block;
			width: 170px;
			height: 200px;
			box-sizing: border-box;
			text-align: center;
			padding: 10px;
			border: 1px solid #ededed;
			border-radius: 4px;
			transition: borderColor ease .5s;
			position: relative;
			vertical-align: top;
			margin-right: 10px;
			&:hover {
				border-color: #ccc;
			}
		img {
			width: 150px;
			height: 102px;
			border-radius: 4px;
			overflow: hidden;
		}
		a {
			display: block;
		}
		p {
			font-size: 12px;
			color: #888;
			text-align: left;
		}
		h3 {
			font-weight: bold;
			font-size: 14px;
			padding: 10px 0 5px 0;
		}
   }
}
</style>
