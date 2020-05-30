<template>
  <el-form
    class="reset-el-form"
    ref="customForm"
    :model="form"
    :disabled="isDisabled"
    :rules="rules">
    <el-checkbox
      v-if="options.checkAllText"
      v-model="checkAll"
      :disabled="isDisabled"
      @change="handleCheckAllChange"
      class="m_r10"
      style="line-height: 28px;">
      {{options.checkAllText}}
    </el-checkbox>
    <el-form-item prop="formValue" :label="options.label">
      <el-checkbox-group v-model="form.formValue" @change="handleCheckChange" :disabled="isDisabled">
        <el-checkbox
          v-for="item in options.list"
          :label="item.value"
          :key="item.value">
          {{item.label}}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script>
  import mixin from './mixin';
  import { getProperValue } from "@/common/utils";
  export default {
    name: "jd-marketing-tag-checkbox",
    mixins: [mixin],
    props: {
      // 组件配置
      options: {
        type: Object,
        default() {
          return {
            label: '',
            // 备选值
            list: [],
            // 全选按钮文案。空字符或false均认为不需要全选按钮
            checkAllText: '全选',
            // 默认选中的值
            defaultValue: []
          };
        }
      }
    },
    data() {
      const {
        name = '值'
      } = this.tag || {};
      const form = this.initForm();
      return {
        form,
        rules: {
          formValue: [{
            required: true, message: `${name}不能为空！`
          }]
        },
        // 是否全选
        checkAll: this.isAllChecked(form)
      };
    },
    computed: {
      valueList() {
        return this.getValueList()
      }
    },
    methods: {
      initForm(data) {
        const campaignData = data || this.campaignData || {}; // 所有标签的数据
        let valueFromApi = void(0);
        const {
          // 接口字段
          value = ''
        } = this.tag || {};
        try {
          const thisFormInfo = campaignData[value] || {};
          valueFromApi = thisFormInfo.matchContent || '';
        } catch (e) {
          console.warn('无接口值，采用默认值', e);
        }
        // 优先取接口值，其次默认值
        let list = valueFromApi || this.options.defaultValue || [];
        return {
          formValue: list.reduce((arr, val) => {
            // 转为number
            arr.push(typeof val === 'number' ? val : +val);
            return arr;
          }, [])
        };
      },
      // overwrite mixin getData
      getData() {
        const {
          // 接口字段
          value = ''
        } = this.tag || {};
        const form = this.form || {};
        const {
          formValue = []
        } = form;
        return {
          key: value,
          matchMode: 'terms',
          matchContent: formValue
        };
      },
      // 全选
      handleCheckAllChange(event) {
        this.form.formValue = event.target.checked ? this.valueList : [];
      },
      // 选择change
      handleCheckChange() {
        this.checkAll = this.isAllChecked();
      },
      getValueList() {
        const {
          list = []
        } = this.options || {};
        return list.map(item => item.value);
      },
      // 是否全选
      isAllChecked(form) {
        const valueList = this.getValueList();
        const {
          formValue = []
        } = form || this.form || {};
        return formValue.length > 0 && formValue.length === valueList.length;
      }
    }
  }
</script>


