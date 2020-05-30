<template>
	<div class="m-content">
		<div class="m-content-main main_height">
		 	<el-tabs v-model="activeName">
         <!-- 品牌会员 -->
			   <template v-if="inBrand">
            <el-tab-pane label="品牌会员" name="1">
              <brandList></brandList>
            </el-tab-pane>
            <el-tab-pane label="历史会员" name="2">
              <component :is="historyList"></component>
            </el-tab-pane>
            <el-tab-pane label="黑名单" name="3">
              <component :is="blackName"></component>
            </el-tab-pane>
         </template>
         <!-- 非品牌会员 -->
         <template v-else>
           <el-tab-pane label="成交会员" name="1">
              <dealVip></dealVip>
            </el-tab-pane>
            <el-tab-pane label="未成交会员" name="2">
              <component :is="unDealVip"></component>
            </el-tab-pane>
            <el-tab-pane label="黑名单" name="3">
              <component :is="blackName"></component>
            </el-tab-pane>
            <el-tab-pane label="非会员" name="4">
              <component :is="nonMember"></component>
            </el-tab-pane>
         </template>
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
  import dealVip from './vipList/dealVip';
  import brandList from './vipList/brandList';
  import {point} from 'src/common/point.js';
	export default{
		data() {
			return{
        activeName: '1',
        historyList:'',
        blackName: '',
        unDealVip: '',
        nonMember: '',
        inBrand:this.$store.state.user.inBrand || false,
			}
		},
		created(){
      point('37977.39399');
			let name = this.$route.query.name;
			this.activeName = name ? name.toString() : this.activeName;
		},

    watch: {
		  // tab懒加载处理
      activeName: {
        handler(val) {
          if(this.inBrand) {
             switch(val) {
              case '2':
                this.historyList = 'historyList'
                break
              case '3':
                this.blackName = 'blackName'
                break
            }
          } else {
            switch(val) {
              case '2':
                this.unDealVip = 'unDealVip'
                break
              case '3':
                this.blackName = 'blackName'
                break
              case '4':
                this.nonMember = 'nonMember'
                break;
            }
          }

        },
        immediate:false // 如果有直接到tab2的需求 请直接执行
      }
    },
		components: {
      dealVip,
      brandList,
      historyList: resolve => require(['./vipList/historyMemberList'], resolve),
      unDealVip: resolve => require(['./vipList/unDealVip'], resolve),
      blackName: resolve => require(['./vipList/blackname'], resolve),
      nonMember: resolve => require(['./vipList/nonMember'], resolve)
		},
		methods: {

		}
	}
</script>

<style lang="less" scoped>
.m-content-main{
	font-size: 14px;
	padding: 17px 25px 30px 15px;
  box-sizing: border-box;
  position:relative;
}
</style>
