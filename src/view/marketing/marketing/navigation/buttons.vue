<template>
    <span>
      <el-button v-if="canShow('cancel')" type="text" @click="handleCancel">取消发送</el-button>
      <el-button v-if="canShow('reCreate')" type="text" @click="handleRecreate">重新创建</el-button>
      <el-button v-if="canShow('delete')" type="text" @click="handleDelete">删除</el-button>
      <el-button v-if="canShow('immediate')" type="text" @click="handleImmediate">立即发送</el-button>
      <el-button v-if="canShow('log')" type="text" @click="handleLog">发送日志</el-button>
      <el-button v-if="canShow('agagin')" type="text" @click="handleRecreate">再次发送</el-button>
      <el-button v-if="canShow('analysis')" type="text" @click="handleAnalysis">营销效果</el-button>
    </span>
</template>

<script>
  import store from 'src/store.js';
  import {point} from 'src/common/point.js';
  import {PlatFormType} from "@/config";
  export default {
    props:{
      row: Object,
      $index: Number,
      type:String,
      remark:String
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
        if((this.type == 'member' || this.type == 'mobile') && type != 'analysis') return false;
        //0-待发送，1-审核中，2-审核不通过，3-发送中，4-发送成功，5-发送失败，6-取消发送
        let {status} = this.row;
        switch(type) {
          case 'cancel':
            return [0,1].includes(status);
            break;
          case 'reCreate':
            return [2,5,6].includes(status);
            break;
          case 'delete':
            return [2,5,6].includes(status);
            break;
          case 'immediate':
            return status == 0;
            break;
          case 'log':
            return status == 4;
            break;
          case 'analysis':
            //指定号码自营店隐藏营销效果分析
            // return (this.type == 'mobile' && this.$store.state.ziying.isZiying) ? false : status == 4;
            return status == 4;
            break;
          case 'agagin':
            return status == 4 && this.type == 'mobile';
            break;
          case 'failed':
            return this.type == 'failed';
            break;
          deatault :
            break;
        }
      },
      handleCancel() {
        this.$confirm('确认取消该营销活动？','取消发送').then(() => {
          this.$emit('click','cancel',this.row)
        }).catch(() => {})
      },

      handleDelete() {
        this.$confirm('确认删除该营销活动？','删除活动').then(() => {
          this.$emit('click','delete',this.row)
        }).catch(() => {})
      },

      handleRecreate() {
        // 判断 活动类型 定向到不同的编辑页面
         this.$emit('click','reCreate',this.row)
      },

      handleAnalysis() {
        this.$router.push({
          //自营店与非自营店使用不同营销效果页面
          name: 'analysis',
          query: {
            sendTime: this.row.sendTime,
            id: this.row.id,
            type: 1
          }
        });
      },

      handleLog() {
        point('37977.39401.39430');
        // 判断 活动类型 定向到不同的发送日志
        let sendFlag = this.$store.state.sendLog.sendFlag;
        store.dispatch('updateSendLog',{
          id:this.row.id,
          flg:!sendFlag
        });
      },
      handleAgain() {
        // 判断 活动类型 执行再次发送接口 响应刷新列表
      },

      handleImmediate() {
        this.$confirm('确认立即执行该营销活动？','立即发送').then(() => {
          this.$emit('click','immediate',this.row)
        }).catch(() => {})
      },

      handleDownload() {

      },

      handleSendPhone() {

      },

      handleFail() {
        this.$alert(this.remark, '失败原因', {
          confirmButtonText: '确定',
          callback: action => {
            console.log(action)
          }
        });
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">

</style>
