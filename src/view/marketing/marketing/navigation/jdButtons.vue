<template>
    <span>
      <el-button v-if="canShow('cancel')" type="text" @click="handleCancel">取消发送</el-button>
      <el-button v-if="canShow('reCreate')" type="text" @click="handleRecreate">重新创建</el-button>
      <el-button v-if="canShow('analysis')" type="text" @click="handleAnalysis">营销效果</el-button>
      <el-button v-if="canShow('statusRemark')" type="text" @click="showStatusRemark">失败原因</el-button>
      <!-- <el-button v-if="canShow('agagin')" type="text" @click="handleRecreate">再次发送</el-button> -->
    </span>
</template>

<script>
  import store from 'src/store.js';
  import {JdMarketingTypeMap, PlatFormType} from "@/config";
  export default {
    props:{
      row: Object,
      $index: Number,
    },
    data() {
      return {
        msg: ''
      }
    },
    created() {
    },
    methods: {
      canShow(type) {
      //waiting-待提交，commited-已提交，jd_ready-京东准备开始，jd_sending-京东执行中，jd_sended-京东执行结束，jd_error-京东错误，failed-发送失败,cancel-已取消
        let {status, statusRemark} = this.row;
        if(this.row.type == 2) return false;//测试发送没有任何操作
        switch(type) {
          case 'cancel':
            // 待提交的不能取消发送
            return ['waiting','commited','jd_ready'].includes(status);
            break;
          case 'reCreate':
            return ['jd_sended','jd_error','failed','cancel'].includes(status);
            break;
          case 'analysis':
            return status == 'jd_sended';
            break;
          case 'statusRemark':
            return !!statusRemark;
            break;
          default :
            break;
        }
      },
      handleCancel() {
        this.$confirm('确认取消该营销活动？','取消发送').then(() => {
          this.$emit('click','cancel',this.row)
        }).catch(() => {})
      },
      handleRecreate() {
        // 判断 活动类型 定向到不同的编辑页面
         this.$emit('click','reCreate',this.row)
      },

      handleAnalysis() {
        let typeConfig = JdMarketingTypeMap[this.row.type];
        this.$router.push({
          name: typeConfig.path ,
          query:{
            sendTime:this.row.sendTime.replace(/-/g,'/'),
            id:this.row.id,
            actName:this.row.name,
            type: typeConfig.paramType
          }
        })
      },
      showStatusRemark() {
        this.$msgbox({
          title: '失败原因',
          message: this.row.statusRemark
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">

</style>
