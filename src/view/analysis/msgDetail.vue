<template>
  <div class="msg-detail dialog_cla">
    <ul>
      <li>
        <label>发送时间：</label>
        {{data.sendTime}}
      </li>
      <li>
        <label>发送状态：</label>
        {{getStatus(data.status)}}
      </li>
      <li>
        <label>发送内容：</label>
        {{data.content}}
      </li>
      <li v-if="crowData.crowRules">
        <label>筛选条件：</label>
        <BaseDialog :onlyCansel="true" v-if="crowData.isCrowd == false" title="目标会员">
          <el-button slot="button" type="primary" size="mall">点击查看</el-button>
          <MemberDialog :crowRule="crowData.crowRules"/>
        </BaseDialog>
        <el-button  v-else type="primary" size="mall" @click="showCrowdDialog()">点击查看</el-button>
      </li>
      <el-dialog
        class="inputSet"
        title="目标人群"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogVisible">
          <smallPeopleDialog  @sureBut="sureBut" :readOnly="true" :dialogVisible="dialogVisible" :rowObj="crowData" :levelName="levelName" :levelList="levelList"></smallPeopleDialog>
      </el-dialog>
    </ul>
  </div>
</template>
<script>
import ajax from 'src/api/index.js'
import BaseDialog from 'src/components/baseDialog'
import MemberDialog from 'src/view/marketing/marketing/navigation/memberDialog.vue'
import SmallPeopleDialog from 'src/view/vipManage/smartProple/smallPeopleDialog.vue'
export default {
  props:{
    id:[String,Number]
  },
  components: {
    MemberDialog,
    SmallPeopleDialog,
    BaseDialog
  },
  data() {
    return {
      data:{},
      levelName:'',
      levelList:'',
      crowData:{
        crowRules:''
      },
      rowObj:{},
      dialogVisible:false
    }
  },
  mounted() {
    this.queryData();
    this.memberLevelList();
  },
  methods: {
    sureBut(){
        this.dialogVisible = false;
    },
    getStatus(status) {
      return status == 4 ? '已发送' : '';
    },
    showCrowdDialog() {
      this.crowData.dealSet = JSON.parse(this.crowData.crowRules);
      this.dialogVisible = true;
    },
    queryData() {
      ajax({
        api_name: 'marketingSendMsgDetail',
        data: {
          activityId:this.id
        }
      },result => {
        this.data = result.data.list[0];
      },error => {

      })
    },
    getDetail() {
      ajax({
        api_name: 'marketingGetDetail',
        data: {
          activityId:this.id
        }
      },result => {
        this.crowData = result.data;
      },error => {
        this.loading = false;
        this.$message.error(error.message);
      })
    },
    memberLevelList() {			//会员等级规则
      let _self = this;
      ajax({
        api_name: 'memberLevelList',
        vm: this,
        data: {}
      }, (res) => {
        let obj = {};
        let lebelObj = {};
        let arr = res.data ? (res.data.levelList ? res.data.levelList : []) : [];
        arr.forEach(item => {
          obj[item.memberLevel] = item.name ? item.name : item.nameSource;
          if(item.name) {
            lebelObj[item.name] = item.memberLevel;
          } else {
            lebelObj[item.nameSource] = item.memberLevel;
          }

        });
        this.levelName = obj;
        this.levelList = lebelObj;
        this.getDetail(this.id);
      }, (error) => {
      })
    },
  }
}
</script>
<style lang="less" scoped>
  .msg-detail {

  }
</style>
