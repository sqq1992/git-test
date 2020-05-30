<template>
  <div class="analysisZY" v-loading="isLoading">
    <div>
      活动名称：{{actName}}
      <a href="javascript:window.history.go(-1)" class="goback fc--blue">&lt;&lt;返回效果分析列表</a>
    </div>
    <el-button type="text" @click="handleShowConditions">查看筛选条件</el-button>
    <!-- <el-button type="text" @click="getDetail">
      查看筛选条件
      <i v-if="showConditon" class="el-icon-caret-top"></i>
      <i v-else class="el-icon-caret-bottom"></i>
    </el-button> -->
    <!-- <div :class="['conditon-box',{hide:!showConditon}]">
       <MemberDialog v-if="crowData.crowRules" :crowRule="crowData.crowRules"/>
    </div> -->
    <div>
      分析时间：营销开始后的:
      <el-select size="small" style="width:100px;" v-model="lastDay">
        <el-option value="3" label="3天内"></el-option>
        <el-option value="5" label="5天内"></el-option>
        <el-option value="7" label="7天内"></el-option>
      </el-select>
      <!-- <el-select size="small" style="width:100px;float:right;" v-model="analysType">
        <el-option value="touch" label="触达效果"></el-option>
        <el-option value="click" label="点击效果"></el-option>
      </el-select> -->
      <span>
        {{sendTime}} - {{endTime}}
      </span>
      <div class="analysis-info-box">
          <div class="info-title">营销效果数据</div>
          <div class="info-content">
            <Content :analysisData="analysisData"/>
            <!-- <Content :analysisData="analysisData" :analysType="analysType"/> -->
          </div>
      </div>
      <div class="analysis-info-box">
          <div class="info-title">转化数据</div>
          <div class="info-content">
            <FunnelChart :chartData="analysisData"/>
          </div>
      </div>
      <div class="analysis-info-box">
          <div class="info-title">数据趋势</div>
          <div class="info-content">
            <DataChart :chartData="chartList"/>
          </div>
      </div>
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
  </div>
</template>
<script>
import ajax from 'src/api/index.js';
import moment from 'moment';
import Content from './content';
import FunnelChart from './funnelChart';
import DataChart from './dataChart';
import selectedTag from 'components/jdMarketing/FilterMemberSelectedTag';
import MemberDialog from 'src/view/marketing/marketing/navigation/memberDialog.vue';
import { initSelectedTagMap, formatConditions } from "components/jdMarketing/filterMemberUtil";
import {PlatFormType} from "@/config";
export default {
  components:{
    Content,
    FunnelChart,
    DataChart,
    MemberDialog,
    selectedTag
  },
  data() {
    let {id, sendTime, actName} = this.$route.query;
    return {
      lastDay: "7",
      id,
      sendTime,
      actName,
      endTime: '',
      analysisData: {},
      isLoading: false,
      showConditon: false,
      chartList: [],
      analysType: 'touch',
      crowData: {
        crowRules: ''
      },
      dialog: {
        visible: false, // 是否展示
        title: '', // 弹窗标题
        props: {}, // 动态组件props
        name: '' // 动态组件名称(与在components中注册的名称相同)
      }
    };
  },
  created() {
    this.calcTime();
    this.queryData();
  },
  watch: {
    'lastDay'() {
      this.calcTime();
      this.queryData();
    }
  },
  methods:{
    calcTime() {
      let endTime = new Date(this.sendTime).getTime() + (this.lastDay - 1) * 86400000;
      this.endTime = moment(endTime).format("YYYY/MM/DD HH:mm:ss");
    },
    queryData() {
      this.isLoading = true;
      const {id, sendTime, endTime} = this;

      ajax({
        api_name:'getSmsEffect',
        data: {
          marketingId:id,
          startDate:new Date(sendTime).getTime(),
          endDate:new Date(endTime).getTime()
        }
      },result => {
        this.isLoading = false;
        this.analysisData = result.data;
        this.chartList = result.data.chartList;
      },error => {
        this.isLoading = false;
        this.$message({
          message: error || '未知错误！',
          type: 'error'
        });
      })

    },
    getDetail() {
      if(!this.showConditon) {
        this.loading = true;
        ajax({
          api_name: 'jdMarketing_detail',
          data: {
            id:this.id
          }
        },result => {
          this.crowData = result.data;
          this.showConditon = true;
        },error => {
          this.loading = false;
          this.$message.error(error.message);
        })
      } else {
        this.showConditon = false;
      }
    },
     /**
       * 查看活动筛选条件
       * @param {Number | String} id 活动id
       * @return {boolean}
       */
    handleShowConditions() {
      let {id} = this;
      ajax({
        api_name: 'jdMarketing_detail',
        data:{ id }
      }, ({ data = {} }) => {
        const { conditions } = data.activity;
        const campaignData = formatConditions(conditions);
        const selectedTagMap = initSelectedTagMap(campaignData);
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
    handleCloseDialog() {
      this.dialog.visible = false;
    },
  }
}
</script>
<style lang="less" scoped>
  .goback {
    float:right;
  }
  .conditon-box {
    transition:height linear 1s;
    margin-bottom:5px;
    overflow: hidden;
    &.hide {
      transition:height linear 1s;
      height:0;
    }
  }
  .analysisZY {
    padding:20px;
  }
</style>
