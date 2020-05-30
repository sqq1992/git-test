<template>
  <div class="crm-table__marketing dialog_cla">
    <el-form inline>
      <el-form-item label="活动名称">
        <el-input size="small" v-model="activityName"></el-input>
      </el-form-item>
      <el-form-item label="短信发送时间">
        <el-date-picker
          v-model="date"
          size="small"
          type="daterange"
          placeholder="选择日期范围">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动状态" class="inputSet">
        <el-select  :clearable="true" v-model="status" class="el_inp el_select row_line" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      class="fontClass"
      :data="tableData"
      :border="false"
       v-loading="loading"
       style="width: 100%">
      <el-table-column label="活动名称" prop="activityName" min-width="140" />
      <el-table-column label="短信发送时间" prop="sendTime" min-width="120" />
      <el-table-column label="短信内容"  min-width="120" >
        <template scope="scope">
            <el-button  type="text" @click="handleShowSms(scope.row.messageContent)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="目标人数" prop="memberCount" min-width="120" />
      <el-table-column label="短信数" prop="sendMsgCount" min-width="120" />
      <el-table-column v-if="type == 'member'" label="目标会员" min-width="120" >
        <template scope="scope">
          <BaseDialog :modal="false" :appendToBody="true" :onlyCansel="true" v-if="!scope.row.isCrowd" title="目标会员">
            <el-button slot="button" type="text" >点击查看</el-button>
            <MemberDialog style="position:relative;zIndex:9999;" :crowRule="scope.row.crowRules"/>
            <!-- @click="handleShowMember(scope.row.crowRules)" -->
          </BaseDialog>
          <el-button type="text" v-else @click="showCrowdDialog(scope.row)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="活动状态" min-width="120">
        <template scope="scope">
          <span :class="{'fc--red':scope.row.status == 2 || scope.row.status == 5}">
            {{
              scope.row.status == 0 ? '待发送' :
              scope.row.status == 1 ? '审核中' :
              scope.row.status == 2 ? '审核不通过' :
              scope.row.status == 3 ? '发送中' :
              scope.row.status == 4 ? '发送成功' :
              scope.row.status == 5 ? '发送失败' :
              scope.row.status == 6 ? '取消发送' : ''
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120">
        <template scope="scope">
          <Buttons v-bind="scope" :type="type" @click="handleOperation"/>
        </template>
      </el-table-column>
  </el-table>
  <div class="table_footer" v-if="queryData.total">
    <el-pagination
      layout="prev, pager, next"
      :current-page="queryData.pageNo"
      :page-size="queryData.pageSize"
      @current-change="handleCurrentChange"
      :total="queryData.total">
    </el-pagination>
  </div>
  <el-dialog
    class="inputSet"
    title="目标人群"
    :modal="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible">
    <smallPeopleDialog  @sureBut="sureBut" :readOnly="true" :dialogVisible="dialogVisible" :rowObj="rowObj" :levelName="levelName" :levelList="levelList"></smallPeopleDialog>
  </el-dialog>
  </div>
</template>

<script>
  import Buttons from './buttons'
  import http from 'src/api'
  import dateFormat from '@/common/dateFormat.js'
  import BaseDialog from 'src/components/baseDialog'
  import MemberDialog from './memberDialog.vue'
  import smallPeopleDialog from '../../../vipManage/smartProple/smallPeopleDialog.vue'
  import {point} from 'src/common/point.js'
  function getType(type) {
    return {
      'member':53,
      'mobile':54
    }[type]
  }
  export default{
    data() {
      return{
        dialogVisible: false,
        vipDetail: {},
        statusObj: {
          '0': '未激活',
          '1': '已激活'
        },
        options:[
          {name:'全部',value:''},
          {name:'待发送',value:0},
          {name:'审核中',value:1},
          {name:'审核不通过',value:2},
          {name:'发送中',value:3},
          {name:'发送成功',value:4},
          {name:'发送失败',value:5},
          {name:'取消发送',value:6}
        ],
        tableData:[
          {}
        ],
        activityName:'',
        date:[],
        queryData:{
          pageNo:1,
          pageSize:20,
          total:0
        },
        status:'',
        loading:true,
        rowObj:{},
        levelName:'',
        levelList:'',
      }
    },
    props:{
      type:{
        type:String,
        defatule:'member',
        required: true,
        validator: function (value) {
          return ['member','mobile','assignMember'].includes(value)
        }
      }
    },
    created(){
      this.searchData();
      this.memberLevelList();
    },
    methods: {
      sureBut(){
        this.dialogVisible = false;
      },
      memberLevelList() {			//会员等级规则
				let _self = this;
				http({
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
				}, (error) => {
				})
			},
      showCrowdDialog(item) {
        point('37977.39401.39429')
        item = {
          activityName: "会员营销20191110162246",
          activityType: 53,
          crowRules: '{"fType":2,"maxLastTradeDate":180,"maxLastTradeTime":"2019-02-15 18:27:58","minLastTradeDate":91,"minTradeCount":1,"modelName":"沉睡会员 ","rType":1,"timeType":1,"venderId":749081}',
          crowdDesc: "最近交易时间距今超过90天但在180天内的成交会员",
          crowdName: "沉睡会员",
          groupName: "默认分组",
          id: 14,
          isCrowd: true,
          memberCount: 333,
          // messageContent: "【素姬旗舰店】惊喜双11！0—3点下单即送叠加好礼，爆款限量抢购低至11.11，谷胱甘肽原液首降至88，错过再等一年，狂欢尽在JD素姬https://suji.jd.com/ 退订回TD",
          messageContent: "【素姬旗舰店】惊喜双11！0—3点下单即送叠加好礼，爆款限量抢购低至11.11，谷胱甘肽原液首降至88，错过再等一年，狂欢尽在JD素姬https://suji.jd.com/ 回T退",
          sendMsgCount: 666,
          sendTime: "2019-11-10 16:23:01",
          status: 4
        }
        item.dealSet = JSON.parse(item.crowRules);
        this.rowObj = item;
        this.dialogVisible = true;
      },
      handleCurrentChange(e) {
        this.queryData.pageNo = Number(e);
        this.searchData();
      },
      searchData() {
        let data = {
          name:this.activityName,
          pageNo:this.queryData.pageNo,
          pageSize:this.queryData.pageSize,
          startTime:this.date[0] ? dateFormat(this.date[0],'YY-MM-DD') : '',
          endTime:this.date[1] ? dateFormat(this.date[1],'YY-MM-DD') : '',
          status:this.status,
          type:getType(this.type)
        }
        this.loading = true;
        http({
          api_name:'marketingGetMarketingList',
          data
        },({data}) =>{
            this.tableData = data.list;
            this.queryData.total = data.total;
            this.loading = false;
        },error => {
            this.loading = false;
        })
      },
      // 显示短信内容
      handleShowSms(content) {
        point('37977.39401.39428')
        const message = content;
        const h = this.$createElement;
        const smsCount = message.length <= 70 ? 1 :Math.ceil(message.length / 67);
        this.$msgbox({
          title: '短信内容',
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: '关闭',
          message: h('div',{class: 'fc-333'},[
              h('div',message),
              h('span',{class: 'fc-999'}, [
                `（共${message.length}个字，${smsCount}条短信）`
              ])
            ])
        }).then(() => {
          console.log('http提交黑名单信息')
        }).catch(() => {})
      },
      handleShowMember(member){
        console.log(member);
      },

      /**
       * 操作按钮事件
       * @param {String} type [
       *    cancel: 取消发送,
       *    recreate: 重新创建 ,
       *    delete: 删除,
       *    immediate: 立即发送,
       *    log: 发送日志,
       *    analysis: 营销效果
       * ]
       * @param data
       */
      handleOperation(type,data) {
        let api_name;
        if(type == 'reCreate') {
          let name = this.type == 'member' ? 'marketingMember' : this.type == 'mobile' ? 'marketingMobile' : '';
          this.$router.push({name,query:{id:data.id}})
          return;
        }
        switch(type) {
          case 'cancel':
            api_name = 'marketingCancel'
          break;
          case 'delete':
            api_name = 'marketingRemove'
          break;
          case 'immediate':
            api_name = 'marketingSendImmediately'
          break;
          default:break;
        }
        this.loading = true;
        this.handlePerform(api_name,data.id);
      },
      handlePerform(api_name,id){
        http({
          api_name,
          data:{activityId:id}
        },res => {
          this.searchData();
          this.loading = false;
        },error => {
          this.$message.error(error.message)
          this.loading = false;
        })
      },
    },
    components: {
      Buttons,
      BaseDialog,
      MemberDialog,
      smallPeopleDialog
    }
  }
</script>

<style lang="less" scoped>
  // .inputSet {
  //   position: relative;
  //   z-index:9999;
  // }
  .table_footer{
    text-align: right;
  }
</style>