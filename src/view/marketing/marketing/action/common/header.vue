<template>
    <div>
      <el-form-item label="活动名称：">
        <!-- <el-input size="small" :value="activityName" @change="handlerInput" :maxlength="20" style="width:250px"/> -->
        <input v-model="activityName" maxlength="20" style="width:250px;"/>
      </el-form-item>
      <el-form-item label="发送时间：">
        <el-radio v-model="immediate" label="1">立即发送</el-radio>
        <el-radio v-model="immediate" label="2">定时发送</el-radio>
        <el-date-picker
          v-show="immediate === '2'"
          class="m_l20"
          size="small"
          v-model="setTime"
          :editable="false"
          type="datetime"
          :clearable="false"
          :picker-options="pickerOptions"
          placeholder="选择日期时间"/>
        <!-- <div>营销短信发送时间为早8点到晚22点，超出时间会自动顺延至第二天发送</div> -->
      </el-form-item>
    </div>
</template>

<script>
  import {formatDate, handlerStr} from "@/common/utils"
  import dateFormat from "@/common/dateFormat.js"
  const now = new Date(formatDate("yyyy/MM/dd 00:00:00"))
  export default {
        name: '',
        props: {
          name: String,
          type: {
            type: String,
            default: 'member',
            required: true,
            validator: function (value) {
              return ['member','mobile','assignMember'].includes(value)
            }
          },
          activityData: Object
        },
        created() {
          this.setData();
        },
        data() {
          const activityNames = {'member':'会员营销','mobile': '指定号码', 'assignMember': '指定旺旺'}
            return {
              immediate: '1',
              targetMember: '2',
              setTime: '',
              activityName: this.name || activityNames[this.type]+formatDate("yyyyMMddHHmmss"),
              pickerOptions:{
                disabledDate(time){
                  return time < now
                }
              },
            }
        },
        watch:{
          activityName() {
            this.activityName = handlerStr(this.activityName);
            this.setData();
          },
          setTime() {
            if(this.setTime){
              this.setTime && (this.setTime = dateFormat(this.setTime,'YY-MM-DD HH:MM:SS'))
              this.setData();
              this.immediate = '2';
            }
          },
          immediate() {
            this.setData();
          },
          activityData() {
            const {activityName, sendTime} = this.activityData;
            this.activityName = activityName;
            if(sendTime) {
              this.immediate = '2';
              this.setTime = sendTime;
            }
          }
        },
        methods: {
          setData() {
            this.$emit('setData',{
              activityName:this.activityName,
              sendTime:this.immediate == 2 ? this.setTime : ''
            })
          },
          // handlerInput(val) {
          //   this.activityName = handlerStr(val);
          //   console.log(this.activityName);
          //   this.setData();
          // }
        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">

</style>
