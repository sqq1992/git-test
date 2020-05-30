<template>
    <div class="m-content-main">
      <div>
        <h4>新建智能营销</h4>
        <div class="flex">
          <nav class="nav-router" v-for="({title,route,desc}) in nav" :key="route.name">
            <div>{{title}}</div>
            <div class="nav-router-desc">{{desc}}</div>
            <router-link :to="route"><el-button size="small" type="primary">立即创建</el-button></router-link>
          </nav>
        </div>
      </div>
      <div>
        <h4 class="m_t20">营销活动列表</h4>
        <el-tabs v-model="activeName">
          <el-tab-pane label="会员营销" name="1">
            <!-- v-if="isZiYing || inBrand" -->
            <JdTable/>
            <!-- <CommonTable v-else type="member"/> -->
          </el-tab-pane>
          <el-tab-pane label="指定号码营销" name="2">
            <!-- <CommonTable type="mobile"/> -->
            <MobileTable />
          </el-tab-pane>
          <!-- <el-tab-pane v-if="isWhiteList" label="会员营销2" name="3">
            <JdTable />
          </el-tab-pane> -->
          <!-- <el-tab-pane label="指定会员营销" name="3">
            <CommonTable />
            <div>指定会员营销</div>
          </el-tab-pane>
          <el-tab-pane label="订单营销" name="4">
            <CommonTable />
            <div>订单营销</div>
          </el-tab-pane> -->
        </el-tabs>
      </div>

    </div>
</template>

<script>
  import CommonTable from './commonTable'
  import JdTable from './jdTable'
  import MobileTable from './mobileTable'
    export default {
        components: {
          CommonTable,
          MobileTable,
          JdTable
        },
        data() {
            let isWhiteList = this.$store.state.whiteList.indexOf(this.$store.state.user.shopName) != -1;
            let isZiYing = this.$store.state.ziying.isZiying;
            let inBrand = this.$store.state.user.inBrand;
            let nav = [
                {
                  title:'会员营销',desc:'对指定会员进行各种场景的短信营销',
                  route:{
                    name:'memberZY'
                    // name: (isZiYing || inBrand) ? 'memberZY' : 'marketingMember' //自营店铺与非自营店铺使用不同页面
                  }
                },
                // {title:'会员营销',desc:'对指定会员进行各种场景的短信营销', route:{name:'memberZY'}},
                {title:'指定号码营销',desc:'批量添加手机号码进行定向营销', route:{name:'marketingMobile'}},
                // {title:'指定会员营销',desc:'批量输入会员账号进行匹配，向匹配成功的会员进行营销', route:{name:'marketingAssignMember'}},
            ]
            return {
              isWhiteList,
              isZiYing,
              inBrand,
              activeName: '1',
              nav
            }
        },
        methods: {
        },
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .m-content-main{
    font-size: 14px;
    padding: 0 25px 30px 15px;
    box-sizing: border-box;
  }


  .nav-router {
    text-align: center;
    margin-top:16px;
    box-shadow:0px 4px 12px 0px rgba(248,248,248,1);
    border:1px solid rgba(240,240,240,1);
    padding:16px;
    & + .nav-router {
      margin-left:20px;
    }
  }

  .nav-router-desc {
    width:168px;
    font-size:12px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:17px;
    text-align: left;
    padding: 8px 0;
    height: 40px;

    line-height:1.5
  }
</style>
