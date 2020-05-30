<template>
  <el-form
    :inline="true"
    :disabled="isDisabled"
    ref="customForm"
    :model="form"
    class="reset-el-form"
    :rules="rules">
    <el-form-item prop="start" :label="options.label">
      <el-input v-model="form.start" :disabled="isDisabled"/>
    </el-form-item>
    {{options.suffix}}<span class="m_r10 ml10">
      ~
    </span>
    <el-form-item prop="end">
      <el-input v-model="form.end" :disabled="isDisabled"/>
    </el-form-item>{{options.suffix}}
  </el-form>
</template>

<script>
  import mixin from './mixin';
  import { getRulePrice } from '../filterMemberUtil';
  import { getProperValue } from "@/common/utils";
  export default {
    name: "jd-marketing-tag-price-group",
    mixins: [mixin],
    props: {
      // 组件配置
      options: {
        type: Object,
        default() {
          return {
            suffix: '元',
            label: '金额',
            matchMode: 'range'
          };
        }
      }
    },
    data() {
      return {
        form: this.initForm(),
        rules: getRulePrice.call(this)
      };
    },
    methods: {
      // 针对金额范围组件的初始化
      // 覆盖default mixin中的initForm
      initForm(data) {
        const {
          // 接口字段
          value = ''
        } = this.tag || {};
        const campaignData = data || this.campaignData || {}; // 所有标签的数据
        const {
          matchContent = {}
        } = campaignData[value] || {};
        // 当matchMode是range时
        // 格式为matchContent: {gte: '', lte: ''}
        // 例如输入框组，日期范围组件等是range
        let {
          gte = '', lte = ''
        } = matchContent;
        // 接口金额以分为单位，解析成员
        if (gte) gte = gte / 100;
        if (lte) lte = lte / 100;
        return {
          start: gte,
          end: lte
        };
      },
      // 针对金额范围组件的取值
      // 覆盖default mixin中的getData
      getData() {
        const {
          // 接口字段
          value = ''
        } = this.tag || {};
        const form = this.form || {};
        let matchContent = {};
        if (form.start !== '') {
          matchContent.gte = Number(form.start) * 100;
        }
        if (form.end !== '') {
          matchContent.lte = Number(form.end) * 100;
        }
        return {
          key: value,
          matchMode: 'range',
          matchContent
        };
      }
    }
  }
</script>


