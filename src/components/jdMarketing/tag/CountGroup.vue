<template>
  <el-form
    :inline="true"
    ref="customForm"
    :disabled="isDisabled"
    :model="form"
    class="reset-el-form"
    :rules="rules">
    <el-form-item prop="start" :label="options.label">
      <el-input v-model="form.start" :disabled="isDisabled"/>
    </el-form-item>
    <span class="m_r10">
      ~
    </span>
    <el-form-item prop="end">
      <el-input v-model="form.end" :disabled="isDisabled"/>
    </el-form-item>
  </el-form>
</template>

<script>
  import mixin from './mixin';
  import { getRuleCount } from '../filterMemberUtil';
  import { getProperValue } from "@/common/utils";
  export default {
    name: "jd-marketing-tag-count-group",
    mixins: [mixin],
    props: {
      // 组件配置
      options: {
        type: Object,
        default() {
          return {
            label: ''
          };
        }
      }
    },
    data() {
      return {
        form: this.initForm(),
        rules: getRuleCount.call(this)
      };
    }
  }
</script>


