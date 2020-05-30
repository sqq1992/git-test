<template>
    <div class="m-content">
		<div class="m-content-main main_height">
			<p class="page_top">
				发布会员中心：
				<el-switch
					v-model="userCenterShow"
					on-color="#13ce66"
					off-color="#ff4949"
					on-value="true"
					off-value="false"
					on-text="已发布"
					off-text="未发布"
					:width="75"
					@change="changePubFlg">
				</el-switch>
				<span v-if="userCenterShow == 'true'">已将“会员中心”发布至App店铺首页</span>
				<span class="gradientBtn" @click="showGuide">查看配置教程</span>
			</p>
			<div class="page_group">
				<div class="page_group_item">
					<div class="page_group_item_icon"><img src="../../assets/images/user.png" alt=""></div>
					<div class="page_group_item_title">会员中心</div>
					<div class="page_group_item_desc">装修移动端会员中心页面内容，突出会员权益，增强会员互动</div>
					<div class="page_group_item_tongji">
						<div class="page_group_item_tongji_item">
              pv
              <div>
                <i class="el-icon-loading" v-if="data.MEMBER_CENTER.visitCount == null"></i>
                <span v-else>{{data.MEMBER_CENTER.visitCount | numFormat}}</span>
              </div>
            </div>
						<div class="page_group_item_tongji_item">
              uv
              <div>
                <i class="el-icon-loading" v-if="data.MEMBER_CENTER.customerCount == null"></i>
                <span v-else>{{data.MEMBER_CENTER.customerCount | numFormat}}</span>
              </div>
            </div>
					</div>
					<router-link :to="{path: 'userCenter'}"></router-link>
					<div class="page_group_item_text"><router-link :to="{path: 'userCenter'}">点击进入编辑</router-link></div>
				</div>
				<div class="page_group_item">
					<div class="page_group_item_icon"><img src="../../assets/images/shop.png" alt=""></div>
					<div class="page_group_item_title">品牌故事</div>
					<div class="page_group_item_desc">展示店铺海报，突出店铺特色，引导会员关注店铺、收藏商品</div>
					<div class="page_group_item_tongji">
						<div class="page_group_item_tongji_item">
              pv
              <div>
                <i class="el-icon-loading" v-if="data.SHOP_STORY.visitCount == null"></i>
                <span v-else>{{data.SHOP_STORY.visitCount | numFormat}}</span>
              </div>
            </div>
						<div class="page_group_item_tongji_item">
              uv
              <div>
                <i class="el-icon-loading" v-if="data.SHOP_STORY.customerCount == null"></i>
                <span v-else>{{data.SHOP_STORY.customerCount | numFormat}}</span>
              </div>
            </div>
					</div>
					<router-link :to="{path: 'shopList'}"></router-link>
					<div class="page_group_item_text"><router-link :to="{path: 'shopList'}">点击进入编辑</router-link></div>
				</div>
				<div class="page_group_hint">已发布会员中心，但在店铺首页没有找到会员中心的入口？<a href="/static/help/userCenterHelp.html" target="_blank">点我查看</a></div>
			</div>
		</div>
		<guide-dialog ref="guideDialog"></guide-dialog>
	</div>
</template>

<script>
	import http from 'src/api/index.js';
  import guideDialog from 'src/components/guide/guide.vue';
  import {point} from 'src/common/point.js';
	const debug = process.env.NODE_ENV === 'development' || window.location.hostname == 'testpcjdcrm.wangdiankeji.com';
	export default{
		data() {
			return{
				type: 'online',
				data: {
					MEMBER_CENTER: {},
					SHOP_STORY: {}
				},
				userCenterShow: "false",
				guide: ''
			}
		},
		created(){
			http({
				api_name: 'getPublishPageInfo',
				vm: this,
				data: {}
			}, result => {
				this.userCenterShow = result.data.isPublish ? 'true' : 'false';
				http({
					api_name: 'queryVisitInfoStatistics',
					vm: this,
					data: {}
				}, result => {
					this.data = result.data;
				});
			});
		},
		watch: {
			$route() {
				this.guide = this.$route.query.guide
			},
			guide() {
				this.guideShow();
			}
		},
		mounted() {
		    //引导
			this.guide = this.$route.query.guide;
		},
		methods: {
			showGuide() {
				document.getElementById('module-user-leftNav').scrollTo(0,300)
                this.$refs.guideDialog.show(1, 1);
			},
			guideShow() {
				if(this.guide) {
					this.$refs.guideDialog.show(this.guide, 2);
				}
			},
      changePubFlg(value){
				this.$confirm(value == 'true' ? '确认将“会员中心”发布至店铺首页？' : '确认下线当前“会员中心”，使用官方会员中心页？', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info'
				}).then(() => {
					http({
						api_name: 'changePublishStatus',
						data: {
							isPublish: value == 'true' ? true : false,
							check: debug ? false : true
						},
						vm: this
					}, result => {
            point('37977.39409.39479');
            const h = this.$createElement;
            this.$msgbox({
              title: '温馨提示',
              message: h('p', null, [
                h('p', null, value == 'true' ? '已将“会员中心”发布至店铺首页' : '已切换至官方会员中心页',),
                h('p', { style: 'color: #999;font-size:12px;margin-top:10px;' }, '在商家后台设置的活动将生效但不显示（除会员折扣和兑换礼品优惠外），工具到期将自动恢复为官方页面')
              ]),
                showCancelButton: false,
                cancelButtonText: '取消',
              }).then(action => {
            });
					});
				}).catch(() => {
					this.userCenterShow = value == 'true' ? 'false' : 'true';
				});
            },
		},
		components: {
			guideDialog
		}
	}
</script>

<style lang="less" scoped>
	.m-content-main{
		height: 100%;
		background: #fff;
		padding: 20px;
		box-sizing: border-box;
	}
	.page_top{
		font-size: 14px;
		color: #333;
		span{
			color: #888;
			margin-left: 10px;
			&.gradientBtn {
				height: 28px;
				background: -webkit-linear-gradient(304deg, #e42bff 0%, #7c39ff 100%);
				background: linear-gradient(146deg, #e42bff 0%, #7c39ff 100%);
				border-radius: 18px;
				margin-left: 20px;
				cursor: pointer;
				display: inline-block;
				line-height: 28px;
				color: #fff;
				text-align: center;
				padding: 0 15px;
				color: #fff;
			}
		}
	}
	.page_group{
		margin-top: 20px;
	}
	.page_group_item{
		display: inline-block;
		width: 236px;
		height: 230px;
		border: 1px solid rgba(0,0,0,0.2);
		background: #fff;
		cursor: pointer;
		position: relative;
		padding: 19px;
		box-sizing: border-box;
		text-align: center;
		margin-right: 30px;
		&:after,&:before{
			content: '';
			display: inline-block;
			width: 20px;
			height: 20px;
			background: #fff;
			position: absolute;
			top: 140px;
			border-radius: 50%;
			border: 1px solid rgba(0,0,0,0.2);
		}
		&:after{
			left: -9px;
			border-top: none;
			border-left: none;
			transform: rotate(-45deg);
		}
		&:before{
			right: -9px;
			border-bottom: none;
			border-right: none;
			transform: rotate(-45deg);
		}
		.page_group_item_icon{
			height: 35px;
		}
		.page_group_item_title{
			margin-top: 15px;
			color: #333;
			font-size: 16px;
		}
		.page_group_item_desc{
			color: #999;
			font-size: 14px;
			line-height: 1.5;
			text-align: left;
		}
		.page_group_item_tongji{
			width: 196px;
			border-top: 1px solid #f0f0f0;
			margin-top: 15px;
			height: 75px;
			display: flex;
			align-items: center;
			.page_group_item_tongji_item{
				flex: 1;
				// display: flex;
				justify-content: center;
				align-items: center;
				color: #999;
				line-height: 2;
				font-size: 14px;
				position: relative;
				&:first-child:after{
					content: '';
					display: inline-block;
					width: 1px;
					height: 100%;
					border-left: 1px solid #f0f0f0;
					top: 0;
					right: 0;
					position: absolute;
				}
			}
		}
		a{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 3;
		}
		.page_group_item_text{
			position: absolute;
			width: 100%;
			text-align: center;
			bottom: -30px;
			height: 30px;
			line-height: 30px;
			left: 0;
			a{
				color:  #3089dc;
			}
		}
	}
	.page_group_hint{
		margin-top: 40px;
		a{
			color: #3089dc;
			margin-left: 5px;
		}
	}
</style>
