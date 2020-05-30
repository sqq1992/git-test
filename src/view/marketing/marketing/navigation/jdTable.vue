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
        <BaseDialog
          v-if="showHistoryBtn"
          :onlyCansel="true"
          :size="'big'"
          title="历史发送日志查询"
        >
          <el-button slot="button" type="text">历史发送记录</el-button>
          <CommonTable type="member"/>
        </BaseDialog>

      </el-form-item>
    </el-form>
    <el-table
      class="fontClass"
      :data="tableData"
      :border="false"
       v-loading="loading"
       style="width: 100%">
      <el-table-column label="活动名称" prop="name" min-width="140" />
      <el-table-column label="短信发送时间" prop="sendTime" min-width="120" />
      <el-table-column label="短信内容"  min-width="120" >
        <template scope="scope">
            <el-button  type="text" @click="handleShowSms(scope.row.content)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="目标人数" prop="memberCount" min-width="120" />
      <el-table-column label="短信数" prop="msgCount" min-width="120" />
      <el-table-column label="目标会员" min-width="120" >
        <template scope="scope">
          <el-button type="text" v-if="scope.row.type == 2" @click="showTestMobile(scope.row.extra)">点击查看</el-button>
          <el-button type="text" v-else @click="handleShowConditions(scope.row.id)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="活动状态" min-width="120">
        <template scope="scope">
          <span :class="{'fc--red':scope.row.status == 'failed' || scope.row.status == 'jd_error'}">
            {{
              scope.row.status == 'waiting' ? '待提交' :
              scope.row.status == 'commited' ? '已提交' :
              scope.row.status == 'jd_ready' ? '京东准备开始' :
              scope.row.status == 'jd_sending' ? '京东执行中' :
              scope.row.status == 'jd_sended' ? '京东执行结束' :
              scope.row.status == 'jd_error' ? '京东错误' :
              scope.row.status == 'failed' ? '发送失败' :
              scope.row.status == 'cancel' ? '已取消' : ''
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120">
        <template scope="scope">
          <Jd-buttons v-bind="scope" @click="handleOperation"/>
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
      :title="dialog.title"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialog.visible"
      @close="handleCloseDialog">
      <component
        v-if="dialog.visible"
        :is="dialog.name"
        v-bind="dialog.props"
        @close="handleCloseDialog">
      </component>
    </el-dialog>
    <TestMobile ref="testMobile"/>
  </div>
</template>

<script>
  import CommonTable from './commonTable';
  import BaseDialog from 'src/components/baseDialog'
  import JdButtons from './jdButtons'
  import http from 'src/api'
  import dateFormat from '@/common/dateFormat.js'
  import selectedTag from 'components/jdMarketing/FilterMemberSelectedTag';
  import { initSelectedTagMap, formatConditions, initSelectedTagList } from "components/jdMarketing/filterMemberUtil";
  import TestMobile from './testMobile';
  export default{
    data() {
      return{
        dialogVisible: false,
        showHistoryBtn:false,
        vipDetail: {},
        options:[
          {name:'全部',value:''},
          {name:'待提交',value:'waiting'},
          {name:'已提交',value:'commited'},
          {name:'京东准备开始',value:'jd_ready'},
          {name:'京东执行中',value:'jd_sending'},
          {name:'京东执行结束',value:'jd_sended'},
          {name:'京东错误',value:'jd_error'},
          {name:'发送失败',value:'failed'},
          {name:'已取消',value:'cancel'}
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
        // 弹窗配置项
        dialog: {
          visible: false, // 是否展示
          title: '', // 弹窗标题
          props: {}, // 动态组件props
          name: '' // 动态组件名称(与在components中注册的名称相同)
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
        console.log(item.crowRules)
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
          status:this.status
        }
        this.loading = true;
        Promise.all([
          new Promise((resolve,reject) => {
            http({
              api_name:'jdMarketing_list',
              data: {
                name:this.activityName,
                pageNo:this.queryData.pageNo,
                pageSize:this.queryData.pageSize,
                startTime:this.date[0] ? dateFormat(this.date[0],'YY-MM-DD') : '',
                endTime:this.date[1] ? dateFormat(this.date[1],'YY-MM-DD') : '',
                status:this.status,
                type: '1,2'
              }
            },data => {
              resolve(data)
            },err => {
              reject()
            })
          }),
          new Promise((resolve,reject) => {
            http({
              api_name:'marketingGetMarketingList',
              data
            },data => {
              resolve(data)
            },err => {
              reject()
            })
          })
        ]).then(([res1,res2]) => {
          this.tableData = res1.data.list;
          this.queryData.total = res1.data.total;
          this.loading = false;
          this.showHistoryBtn = res2.data.total;
        }).catch(err => {
           this.loading = false;
        })

      },
      // 显示短信内容
      handleShowSms(content) {
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
       *    analysis: 营销效果
       * ]
       * @param data
       */
      handleOperation(type,data) {
        let api_name;
        if(type == 'reCreate') {
          this.$router.push({name:'memberZY',query:{id:data.id}})
          return;
        }
        if(type == 'cancel') {
           this.handlePerform('stopMsgboxActivity',data.id);
        }
        this.loading = true;

      },
      handlePerform(api_name,id){
        http({
          api_name,
          data:{id}
        },res => {
          this.searchData();
          this.loading = false;
        },error => {
          this.$message.error(error.message)
          this.loading = false;
        })
      },
      handleCloseDialog() {
        this.dialog.visible = false;
      },
      /**
       * 查看活动筛选条件
       * @param {Number | String} id 活动id
       * @return {boolean}
       */
      handleShowConditions(id) {
        if (!id) return false;
        http({
          api_name: 'jdMarketing_detail',
          data:{ id }
        }, ({ data = {} }) => {
          const { conditions } = data.activity;
          const campaignData = formatConditions(conditions);
          const selectedTagMap = initSelectedTagList(conditions);
          this.dialog.title = '查看活动条件';
          this.dialog.props = {
            campaignData,
            selectedTagMap,
            isDisabled: true
          };
          this.dialog.name = 'selectedTag';
          this.dialog.visible = true;
        }, (error) => {
          error && this.$message.error(error.message || '请求失败!');
        });
      },
      showTestMobile(extra) {//显示测试手机号
        extra = JSON.parse(extra);
        let _list = [];
        extra.testSentIds.forEach(item => {
          item = typeof item == 'string' ? JSON.parse(item) : item;
          _list.push(item.telephone);
        })
        this.$refs.testMobile.showDialog(_list);
      },
       close(cb) {
        cb && cb()
      }
    },
    components: {
      JdButtons,
      selectedTag,
      TestMobile,
      CommonTable,
      BaseDialog
    }
  }
</script>

<style lang="less" scoped>
  .table_footer{
    text-align: right;
  }
</style>
