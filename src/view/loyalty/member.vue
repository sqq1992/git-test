<template>
	<div class="m-content" id="member" v-loading="loadingpage">
		<div class="m-content-main main_height">
			<div class="clearfix">
        <h3 class="noPadding linTips">
          会员等级规则
        </h3>
        <div class="m_b20 clearfix" style="float:left;margin-left:60px;">
          <span>店铺会员等级：<span :class="{'noOpen': !whether, 'hasOpen': whether}">{{whether ? '已开启' : '未开启'}}</span></span>
          <span class="m_l10 setMember font12">{{ whether ? '（现在可设置店铺的会员等级规则及等级信息）' : '（开启后可设置店铺的会员等级规则及等级信息）'}}</span>
        </div>
        <div class="clearfix m_b20">
          <el-button class="f-fr" type="primary" size="small" v-if="whether"><a href="https://crm.shop.jd.com/crm/shopLevel/customerLevelAtShop.action" target="_blank" class="white" @click="clickOpen">修改会员设置</a></el-button>
        </div>
      </div>
	  <!-- v-if="!inBrand" -->
      <membershipBanner v-if="false"></membershipBanner>
			<div class="mt_20">
				<el-button type="primary" size="small" v-if="!whether"><a href="https://crm.shop.jd.com/crm/shopLevel/customerLevelAtShop.action" target="_blank" class="white" @click="clickOpen">开启会员等级</a></el-button>
				<memberTable v-else :tableData="tableData"></memberTable>
			</div>
		</div>
	</div>
</template>

<script>
import http from './../../api/index.js';
import memberTable from './memberTable';
import membershipBanner from './membershipBanner';
	export default{
		data() {
			return{
				whether: false,
				tableData: [],
        loadingpage: false,
        // showOpenCard:this.$store.state.user.jdCollarCardMode > 1
        showOpenCard:true,
        inBrand:this.$store.state.user.inBrand
			}
		},
		created(){
			this.init();
		},
		methods: {
			clickOpen() {
				this.$confirm('请在“京东营销中心-用户营销-会员等级”中设置会员等级规则', '设置会员等级', {
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
					api_name: 'memberLevelList',
					vm: this,
					data: {}
				}, (res) => {
					this.loadingpage = false;
					this.whether = res.data ? res.data.on : false;
					this.tableData = res.data ? (res.data.levelList ? res.data.levelList : []) : [];
					this.tableData.forEach((item, index) => {
						this.$set(item, 'index', index);
						this.$set(item, 'name', (item.name ? item.name : ''));
					});
				}, (error) => {
					this.loadingpage = false;
					this.tableData = [];
				});
			}
		},
		components: {
      memberTable,
      membershipBanner
		}
	}
</script>

<style lang="less" scoped>
	.m-content-main{
		font-size: 14px;
		padding: 17px 25px 30px 15px;
		box-sizing: border-box;
		color: #333;
		.linTips{
			line-height: 22px;
			font-size: 16px;
      color: #333;
      float:left;
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
	}
</style>
