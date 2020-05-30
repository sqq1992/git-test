<template>
  <el-form
    ref="tagCommonForm"
    :disabled="isDisabled"
    :model="form"
    :rules="rules"
    class="reset-el-form">
    <template v-if="type === 'select'">
      <el-form-item prop="formValue">
        <el-select v-model="form.formValue" placeholder="请选择" :disabled="isDisabled">
          <el-option
            v-for="item in options.list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </template>
    <template v-else-if="type === 'radio'">
      <el-form-item prop="formValue">
        <el-radio-group v-model="form.formValue" :disabled="isDisabled">
          <el-radio
            v-for="item in options.list"
            :key="item.value"
            :label="item.value">
            {{item.label}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import mixin from './mixin';
export default {
  mixins: [mixin],
  props: {
    // 组件配置
    options: {
      type: Object,
      default() {
        return {
          // 输入类型 radio/select
          type: '',
          // 默认值
          defaultValue: '',
          // 接口字段
          value: '',
          // 备选值
          list: []
        };
      }
    }
  },
  name: "jd-marketing-tag-common",
  data() {
    return {
      form: this.initForm()
    };
  },
  computed: {
    // 组件类型 checkbox/select/radio
    type() {
      const {
        type = ''
      } = this.options || {};
      return type;
    },
    // 表单校验规则
    rules() {
      if (!this.type) return {};
      const {
        name = '值'
      } = this.tag || {};
      return {
        formValue: [{
          required: true, message: `${name}不能为空！`
        }]
      };
    }
  },
  methods: {
    /**
     * 校验
     * @return {Promise<any>}
     */
    validate() {
      const type  = this.type;
      const $refs = this.$refs;
      const tag = this.tag || {};
      return new Promise((resolve, reject) => {
        if (!type) {
          resolve();
        } else {
          $refs.tagCommonForm.validate(isValid => {
            isValid
              ? resolve()
              : reject(tag.name || 'common');
          });
        }
      });
    }
  }
}
</script>
