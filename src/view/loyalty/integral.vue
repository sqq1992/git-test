<template>
	<div class="m-content">
		<div class="m-content-main main_height">
			<el-tabs v-model="activeName" @tab-click="tabClick">
			    <el-tab-pane label="积分规则" name="1" ref="firstTab">
			    	<integralOne></integralOne>
			    </el-tab-pane>
			    <el-tab-pane label="奖励积分规则" name="3">
					<basicTemp v-if="replace"></basicTemp>
			    	<integralThr v-else></integralThr>
			    </el-tab-pane>
			    <el-tab-pane label="会员积分" name="2">
					<basicTemp v-if="replace"></basicTemp>
			    	<integralTwo v-else></integralTwo>
			    </el-tab-pane>
				<el-tab-pane label="批量修改积分" name="4">
					<basicTemp v-if="replace"></basicTemp>
			    	<integralFour v-else></integralFour>
			    </el-tab-pane>
		  	</el-tabs>
        <el-tooltip content="因京东接口升级，我们只能获取会员的加密账号，
        系统会每天将会员加密账号同步替换为明文账号（非会员无法更新），
        会员账号筛选条件对明文和加密账号同时生效" popper-class="my_poper" placement="top">
         <span class="mi_box">
           什么是<span class="mi_icon">密</span>?
          </span>
        </el-tooltip>
		</div>
	</div>
</template>

<script>
import integralOne from './integralOne';
import integralTwo from './integralTwo';
import integralThr from './integralThr';
import integralFour from './integralFour';
import basicTemp from 'src/view/basicBlock';
// import $ from 'jquery'
	export default{
		data() {
			return{
				activeName: '1',
				replace: false
			}
		},
		created(){
			// if(!this.$store.state.user.versionRank){
			// 	this.replace = true;
			// } else {
			// 	this.replace = false;
			// }
			this.activeName = this.$route.query.name || '1';
		},
		components: {
			integralOne,
			integralTwo,
			integralThr,
			basicTemp,
			integralFour
		},
		methods: {
			tabClick(tab, event){
				if(tab.name == 3 && this.$store.state.ziying.isZiying){
					this.$alert('该功能暂不支持自营店铺', '温馨提示');
					this.$nextTick(() => {
						this.activeName = '1';
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
.m-content-main{
	font-size: 14px;
	padding: 17px 25px 30px 15px;
	box-sizing: border-box;
	color: #333;
  position: relative;
}
</style>
