<template>
	<div id="integralOne">
		<div class="m_t20 m_b10 m_l20 clearfix">
			<span>店铺购物积分规则：<span :class="{'noOpen': !whether, 'hasOpen': whether}">{{whether ? '已开启' : '未开启'}}</span></span>
			<span class="m_l10 setMember font12">{{ whether ? '（现在可设置购物奖励积分规则）' : '（开启后可设置店铺购物奖励积分规则）'}}</span>
		</div>
		<div class="m_l20">
			<el-button type="primary" size="small" v-if="!whether"><a href="https://crm.shop.jd.com/crm/points/points_pointsSetting.action" target="_blank" class="white" @click="clickOpen">开启积分规则</a></el-button>
			<div class="clearfix" v-else>
				<div class="f-fl shopRuleName">购物积分规则：</div>
				<ul class="shopRule f-fl" v-if="tabledata.length">
					<li v-for="item in tabledata">
						<span class="itemName text-right">{{item.name}}</span>：购物奖励积分值=单笔订单成交金额 * {{item.multiple}} 倍积分
					</li>
					<div class="text-right">
						<el-button class="f-fr" type="text" size="small" v-if="whether"><a href="https://crm.shop.jd.com/crm/points/points_pointsSetting.action" target="_blank" class='changeRule' @click="clickOpen">修改规则</a></el-button>
					</div>
				</ul>
				<ul class="shopRule f-fl" v-else>
					<li>暂无积分规则</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import http from './../../api/index.js';
import {point} from 'src/common/point.js'
	export default{
		data() {
			return{
				whether: false,
				tabledata: []
			}
		},
		created() {
      point('37977.39407.39462');
			this.init();
		},
		methods: {
			clickOpen() {
				this.$confirm('请在“京东营销中心-用户营销-开启店铺积分”中设置店铺购物积分规则', '设置积分规则', {
		          	confirmButtonText: '已设置成功',
		          	cancelButtonText: '取消'
		        }).then(() => {
		          	this.init();
		        }).catch(() => {

		        });
			},
			init() {
				this.loadingpage = true;
				http({
					api_name: 'memberScoreRules',
					vm: this,
					data: {}
				}, (res) => {
					this.loadingpage = false;
					this.whether = res.data ? res.data.on : false;
					this.tabledata = res.data ? (res.data.ruleList ? res.data.ruleList : []) : [];
					this.tabledata.forEach((item, index) => {
						this.$set(item, 'index', index);
					});
				}, (error) => {
					this.loadingpage = false;
					this.tabledata = [];
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	#integralOne{
		color: #333;
	}
	.noOpen{
		color: #F5222D;
		width:66px;
		height:24px;
		background:rgba(255,246,247,1);
		border-radius: 12px ;
		text-align: center;
	    line-height: 24px;
	    display: inline-block;
	}
	.hasOpen{
		color: #4CC312;
		width: 66px;
	    height: 24px;
	    background: rgba(242,255,237,1);
	    border-radius: 12px;
	    display: inline-block;
	    text-align: center;
	    line-height: 24px;
	}
	.setMember{
		color: #666666;
	}
	.white{
		text-decoration: none;
		display: block;
		width: 92px;
	}
	.shopRuleName{
		width: 126px;
		text-align: right;
	}
	.shopRule{
		// margin-left: 88px;
		margin-left: 10px;
		border: 1px solid #E6E6E6;
		display: inline-block;
		padding: 5px 15px 15px;
		background: #FAFAFA;
		min-width: 400px;
		li{
			height: 36px;
			line-height: 36px;
			// border-bottom: 1px solid #E6E6E6;
		}
	}
	.itemName{
		display: inline-block;
		min-width: 112px;
	}
	.changeRule{
		color: #3089DE;
		font-size: 14px;
	}
</style>
