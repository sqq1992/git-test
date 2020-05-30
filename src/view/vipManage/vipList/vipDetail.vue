<template>
	<div>
		<div class="diaVipDetail">
			<div class="row_line m_b20">
				<span :title="vipDetail.pin || vipDetail.customerPin">会员账号：{{vipDetail.pin || vipDetail.customerPin | nullFormat}}</span>
				<span>会员昵称：{{vipDetail.userNick | nullFormat}}</span>
				<span v-if="vipDetail.showTrueMobile">会员手机号：{{vipDetail.showTrueMobile | nullFormat}}</span>
				<span v-else>会员手机号：{{vipDetail.mobile | nullFormat}}<a v-if="vipDetail.mobile" class="detail-mobile" @click="detailMobile(vipDetail)" href="javascript:;">查看</a></span>
			</div>
			<div class="row_line m_b20">
				<span>会员等级：{{vipDetail.gradeName | nullFormat}}</span>
				<span>会员积分：{{vipDetail.customerPoints | nullFormat}}</span>
				<span>性别：{{vipDetail.gender === 0 ? '男' : (vipDetail.gender == 1 ? '女' : '未知')}}</span>
			</div>
			<!-- <div class="row_line m_b20">
				<span>所在省：{{vipDetail.provinceName ? vipDetail.provinceName : '--'}}</span>
			</div> -->
			<div class="row_line m_b20">
				<span>年龄：{{vipDetail.birthdayDate ? getAgeFn(vipDetail.birthdayDate) : '--'}}</span>
				<span>生日：{{vipDetail.birthday ? vipDetail.birthday + '（'+getAstro(vipDetail.birthday)+'座）' : '--'}}</span>
				<!-- <span>生日：{{getAstro(04,03)}}座</span> -->
				<span>职业：{{vipDetail.profession || '--'}}</span>
			</div>
			<div class="row_line m_b20 last_row">
				<span>会员状态：{{vipStatus[vipDetail.customerStatus] | nullFormat}}</span>
				<span>激活状态：{{statusObj[vipDetail.activationState]}}</span>
				<span>激活时间：{{vipDetail.activationTime | nullFormat}}</span>
			</div>
			<div class="row_line m_b20">
				<span>成交金额：{{vipDetail.tradeAmount ? '￥' : ''}}{{vipDetail.tradeAmount | nullFormat | numFormat}}</span>
				<span>成交次数：{{vipDetail.tradeCount | nullFormat | numFormat}}</span>
				<span>平均客单价：{{vipDetail.avgPrice ? '￥' : ''}}{{vipDetail.avgPrice | nullFormat | numFormat}}</span>
			</div>
			<div class="row_line m_b20">
				<span>关闭交易金额：{{vipDetail.closeTradeAmount ? '￥' : ''}}{{vipDetail.closeTradeAmount | nullFormat | numFormat}}</span>
				<span>关闭交易次数：{{vipDetail.closeTradeCount | nullFormat | numFormat}}</span>
				<span>购买商品件数：{{vipDetail.itemNum | nullFormat | numFormat}}</span>
			</div>
			<div class="row_line m_b20">
				<span>首次下单：{{vipDetail.firstOrderDate | nullFormat}}</span>
				<span>最后交易：{{vipDetail.lastOrderDate | nullFormat}}</span>
			</div>
      <!-- <div class="row_line m_b20">
				<span>最近营销时间：{{vipDetail.lastMarketingDate | nullFormat}}</span>
			</div> -->
		</div>
		<p class="m_t10 text-right">
			<el-button size="small" @click="close">取 消</el-button>
			<el-button type="primary" size="small" @click="close">确 定</el-button>
		</p>
	</div>
</template>

<script>
import getAge from 'src/common/getAge.js';
import http from './../../../api/index.js';
	export default{
		data() {
			return{
				vipStatus: {
					1: '正式会员',
					2: '预会员',
					3: '流失会员'
				},
				statusObj: {
					'0': '未激活',
					'1': '已激活'
				}
			}
		},
		props: {
			vipDetail: Object
		},
		methods: {
			close() {
				this.$emit("closeDia", false)
			},
			getAstro(date) {
			let m =	date.split('-')[0],
				d = date.split('-')[1];
				return "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(m*2-(d<"102223444433".charAt(m-1)- -19)*2,2);
			},
			getAgeFn(data) {
				return getAge(data);
			},
			detailMobile(detailInfo = {}) {
			  const {
          pin = '',
          id = ''
        } = detailInfo;
				let vm = this;
				http({
					api_name: 'mobileGet',
					vm: this,
					data: {
						pin,
            id
					}
				}, (res) => {
					vm.$set(vm.vipDetail,'showTrueMobile', res.data.mobile);
				}, (error) => {
					this.$message.error('手机号查看失败！');
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.diaVipDetail{
		.row_line{
			height: 28px;
			line-height: 28px;
			span{
				display: inline-block;
				width: 220px;
				overflow: hidden;
			    text-overflow:ellipsis;
			    white-space: nowrap;
				height: 28px;
				.detail-mobile {
					margin-left: 10px;
					color: #20a0ff;
				}
			}
		}
		.last_row{
			padding-bottom: 20px;
			border-bottom: 1px solid #ddd;
		}
	}
	.text-right{
		button{
			width: 80px;
		}
	}
</style>
