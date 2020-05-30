<template>
  <el-form class="marketing-marketing-member-page" label-position="right" label-width="6em">
    <Header type="assignMember"/>
    <el-form-item label="目标号码：">
      <div>
        <el-upload
          ref="upload"
          action="/gift/importCommodityGiftList"
          accept="application/vnd.ms-excel"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :file-list="fileList"
          :on-success="onSuccess"
          :auto-upload="false">
          <el-button size="small" type="text" slot="trigger">批量导入</el-button>
          <span slot="tip" class="el-upload__tip">（支持xls、xlsx格式文件）<el-button type="text" size="small">下载导入模板</el-button></span>
        </el-upload>
        <div class="mobile-num-wrapper">
          <el-input
            type="textarea"
            :disabled="mobileCount > 10000"
            placeholder="一次性可最多输入10000个会员账号，每行一个，系统会自动过滤重复会员账号"
            v-model="mobiles"
            :autosize="{ minRows: 8, maxRows: 8}"
            resize="none"
          ></el-input>
          <div class="mobile-num">
            当前已输入<span class="fc--orange p5">{{mobileCount.toLocaleString()}}</span>个手机号
          </div>
        </div>
      </div>
    </el-form-item>
    <Sms/>
  </el-form>
</template>

<script>
  import Sms from 'components/sms'
  import Header from '../common/header.vue'
  import {splitPhone} from 'src/common/utils'
  export default {
    components: {
      Sms,Header
    },
    data() {
      return {
        mobiles: '',
        fileList:[],
      }
    },
    computed: {
      mobileCount:function() {
        return splitPhone(this.mobiles).filterPhones.length
      }
    },
    watch: {
      targetMember:function(val,oldVal) {
        console.log(val)
      }
    },
    methods: {
      queryMember() {

      },

      // 删除添加的文件
      handleRemove() {
        this.fileList = []
      },

      // 浏览文件按钮
      handleChange(file,fileList) {
        if(file.status == "ready"){
          if(this.beforeAvatarUpload(file)) {
            this.fileList = [file]
          }else {
            this.fileList = []
          }

        }
      },
      // 文件验证
      beforeAvatarUpload(file) {
        let type = file.name.substr(file.name.lastIndexOf(".")+1).toLowerCase()
        const size = file.size / 1024 / 1024
        const isLt2M = size < LIMIT
        if (!TYPE.includes(type)) {
          this.$message.error(`只支持${TYPE.join('、')}格式文件！`)
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 ' + LIMIT + 'MB!')
        }
        return isLt2M
      },

      onSuccess(response, file, fileList) {
        if(response.result != 100){
          this.$message.error(response.message);
        }else {
          this.$alert("已成功导入XXX条记录")
        }
      },
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .marketing-marketing-member-page {
    padding:16px 20px;

    .mobile-num-wrapper {
      width: 500px;
      position: relative;
    }
    .mobile-num {
      position: absolute;

      width: 100%;
      left: calc(~'100% + 16px');
      bottom: 0;
    }
  }

  .el-form-item { margin-bottom: 12px; }

</style>

