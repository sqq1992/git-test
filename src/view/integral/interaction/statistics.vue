<template>
	<div v-loading="loading">
		<welfare-top v-if="actType == 'welfare'"></welfare-top>
        <interaction-top v-else></interaction-top>
		<div class="act-msg" v-if="msg">
           <div class="act-msg-item">
              <span class="act-msg-lab">活动名称：</span>
			  <span>{{msg.activityName}}</span>
		   </div>
		   <div class="act-msg-item">
              <span class="act-msg-lab">活动起止时间：</span>
			  <span>{{msg.startTime}}</span><span> 至 </span><span>{{msg.endTime}}</span>
		   </div>
		   <div v-if="activityType == 1">
			   <div>
					<div class="act-msg-item">
							<span class="act-msg-lab">每日签到奖励：</span>
							<span>每日签到可获得{{ereryData[0].pointValue}}个积分</span>
					</div>
				</div>
				<div v-if="continuedData[0].continueSign">
					<div class="act-msg-item">
							<span class="act-msg-lab">连续签到奖励：</span>
							<p style="display: inline;">每连续签到{{continuedData[0].continueDays}}天可获得额外<span v-if="continuedData[0].rewardType.indexOf('points') != -1">{{continuedData[0].pointValue}}个积分</span><span v-if="continuedData[0].rewardType.indexOf('points') != -1 && continuedData[0].rewardType.indexOf('coupon') != -1">，同时获得</span><span v-if="continuedData[0].rewardType.indexOf('coupon') != -1">"{{continuedData[0].giftName}}"（{{continuedData[0].bindType == 1 ? '店铺优惠券' : '商品优惠券'}}，满{{continuedData[0].quota || '-'}}元可用，优惠券面值:{{continuedData[0].couponValue}}{{continuedData[0].couponCheckType == 1 ? '元' : '折'}}）</span></p>
					</div>
				</div>
				<div v-if="totalData[0].totalSign">
					<div class="act-msg-item list">
							<span class="act-msg-lab">累计签到奖励：</span>
							<p v-for="(item,key) in totalData"><span v-if="totalData.length>1">{{key+1}}.</span>累计签到{{item.totalDays}}天可获得额外<span v-if="item.rewardType.indexOf('points') != -1">{{item.pointValue}}个积分</span><span v-if="item.rewardType.indexOf('points') != -1 && item.rewardType.indexOf('coupon') != -1">，同时获得</span><span v-if="item.rewardType.indexOf('coupon') != -1">"{{item.giftName}}"（{{item.bindType == 1 ? '店铺优惠券' : '商品优惠券'}}，满{{item.quota || '-'}}元可用，优惠券面值:{{item.couponValue}}{{item.couponCheckType == 1 ? '元' : '折'}}）</span></p>
					</div>
				</div>
		   </div>
		   <div v-if="activityType == 2">
			   <div v-if=" msg.awardSetting.length > 0">
					<div class="act-msg-item list reward">
							<span class="act-msg-lab">奖项设置：</span>
							<div v-for="(item,key) in msg.awardSetting">
								<p>
									<span v-if="msg.awardSetting.length>1">{{key+1}}.</span>
									<span v-if="item.type == 'dynamic_point'">{{item.rewardTypeValue}}个积分，</span>
									<span v-else-if="item.type == 'dynamic_coupon'">{{item.price}}{{item.couponCheckType==1?'元店铺优惠券':'折商品优惠券'}}，数量：{{item.num}}，</span>
									<span v-else-if="item.type == 'dynamic_commodity'">{{item.giftName}}，</span>
									<span>中奖概率：{{item.rate}}%</span>
								</p>
							</div>
					</div>
				</div>
		   </div>
		   <div v-if="activityType == 3">
			   <div v-if=" msg.awardSetting.length > 0">
					<div class="act-msg-item list reward">
							<span class="act-msg-lab">奖项设置：</span>
							<div v-for="(item,key) in msg.awardSetting">
								<p>
									<span v-if="msg.awardSetting.length>1">{{key+1}}.</span>
									<span v-if="item.type == 'dynamic_point'">{{item.rewardTypeValue}}个积分，</span>
									<span v-else-if="item.type == 'dynamic_coupon'">{{item.price}}{{item.couponCheckType==1?'元店铺优惠券':'折商品优惠券'}}</span>
									<span v-else-if="item.type == 'dynamic_wareDiscount'">{{item.shopName}}专属折扣</span>
								</p>
							</div>
					</div>
				</div>
		   </div>
		   <div v-if="activityType == 4">
			   <div v-if=" msg.awardSetting.ruleDesc.length > 0">
					<div class="act-msg-item list reward">
							<span class="act-msg-lab">奖项设置：</span>
							<div v-for="(item,key) in msg.awardSetting.ruleDesc">
								<p v-if="msg.awardSetting.rewardType == 'fixed'">
									<span>每成功邀请一位好友关注店铺即可获得{{item.pointValue}}个积分，受邀的好友必须是之前未关注过店铺的用户。</span>
								</p>
								<p v-else>
                                    <span v-if="msg.awardSetting.ruleDesc.length>1">{{key+1}}.</span>
									<span>成功邀请第{{item.peopleCount}}位好友关注店铺即可获得{{item.pointValue}}积分</span>
								</p>
							</div>
					</div>
				</div>
		   </div>
		</div>
		<div class="act-box" v-if="msg">
			<div class="act-box-top">
				<a v-bind:class="{ current: isActive == 1 }" @click="tabChange(1)" href="javascript:;">活动分析</a>
				<a v-if="activityType != 3 && activityType != 5 && activityType != 6" v-bind:class="{ current: isActive == 2 }" @click="tabChange(2)" href="javascript:;">会员统计</a>
				<a v-if="(activityType == 3 && hasSkus) || activityType == 5 || activityType == 6" v-bind:class="{ current: isActive == 3 }" @click="tabChange(3)" href="javascript:;">订单统计</a>
				<p v-if="msg.lastModifyTime"><span>数据最近更新时间：</span><span>{{msg.lastModifyTime}}</span></p>
			</div>
			<div>
              <interaction-content v-if="isActive == 1" :data="msg" :type="activityType" :id="activityId"></interaction-content>
			  <interaction-member v-if="isActive == 2" :data="msg" :type="activityType" :id="activityId"></interaction-member>
			  <interaction-order v-if="isActive == 3" :data="msg" :type="activityType" :id="activityId"></interaction-order>
			</div>
		</div>
	</div>
</template>

<script>
import interactionTop from 'src/components/integral-interaction/interaction-statistics-top';
import welfareTop from 'src/components/integral-interaction/welfare-statistics-top';
import interactionContent from 'src/components/integral-interaction/interaction-act';
import interactionMember from 'src/components/integral-interaction/interaction-member';
import interactionOrder from 'src/components/integral-interaction/interaction-order';
import { clone } from 'src/common/public.js';
import ajax from 'src/api/index.js';
	export default{
		props: {
			actType: {
				type: String,
				default: 'interaction'
			}
		},
		data() {
			return{
				index: 0,
				isActive: 1,
				activityType: '',
				activityId: '',
				msg: '',
				loading: false,
				ereryData: [],
				continuedData: [],
				totalData: [],
				hasSkus: false
			}
		},
		created(){
			let json = JSON.parse(sessionStorage.getItem('interactionMsg'));
			this.activityType = json.type;
			this.activityId = json.id;
			this.getActMsg(json.id,json.type)
		},
		components: {
			interactionTop,
			welfareTop,
			interactionContent,
			interactionMember,
			interactionOrder
		},
		computed: {
		},
		methods: {
			tabChange(num) {
				this.isActive = num;
			},
			getActMsg(id,type) {
				let vm = this;
				vm.loading = true;
				ajax({
					api_name: 'activityAnalyze',
					vm: this,
					data: {
						id: id,
						dataType: type
					}
				}, (res) => {
				   vm.loading = false;
				   let _msg = res.data;
				   if(type == 1) {
					   _msg.everydaySignSetting = JSON.parse(_msg.everydaySignSetting);
					   _msg.continuedAward = JSON.parse(_msg.continuedAward);
					   _msg.totalAward = JSON.parse(_msg.totalAward);
					   vm.$set(vm,'ereryData',_msg.everydaySignSetting.signRuleDesc);
					   vm.$set(vm,'continuedData',_msg.continuedAward.signRuleDesc);
					   vm.$set(vm,'totalData',_msg.totalAward.signRuleDesc);
				   }else if(type == 4) {
					   _msg.awardSetting = JSON.parse(_msg.awardSetting);
				   } else if(type == 11 || type == 12) {
            _msg.awardSetting = JSON.parse(_msg.awardSetting);
           } else {
					   let newArr = [];
					   JSON.parse(_msg.awardSetting).forEach((item,key) => {
						   if(item.type != 'thanks') {
							  newArr.push(item);
						   };
						   if(item.type == 'dynamic_wareDiscount') {
                               vm.hasSkus = true;
						   }
					   });
					   _msg.awardSetting = newArr;
				   }
				   vm.$set(vm,'msg',_msg)
				}, (error) => {
					this.$message.error(error.message);
				});
			}
		}
	}
</script>

<style lang="less" scoped>
.act-msg {
	padding: 10px 20px 20px 20px;
	border-bottom: 10px solid #edf2f8;
	.act-msg-item {
		display: inline-block;
		margin: 10px 20px 0 0;
		position: relative;
		&.list {
			padding-left: 100px;
			&.reward {
				padding-left: 75px;
			}
			.act-msg-lab {
				position: absolute;
				top: 0;
				left: 0;
			}
		}
	}
}
.act-box {
	padding: 10px 20px 20px 20px;
	.act-box-top {
		font-size: 0;
		a {
			font-size: 14px;
			padding: 6px 20px;
			display: inline-block;
			text-decoration: none;
			color: #3089dc;
			border: 1px solid #3089dc;
			border-left: none;
			&:first-child {
				border-left: 1px solid #3089dc;
			}
			&.current {
				background: #3089dc;
                color: #fff;
			}
		}
	    p {
			display: inline-block;
			font-size: 12px;
			color: #999;
			margin-left: 10px;
		}
	}
}
</style>
