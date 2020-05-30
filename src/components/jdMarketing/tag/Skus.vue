<template>
  <el-form
    ref="customForm"
    :disabled="isDisabled"
    :model="form"
    :rules="rules"
    class="reset-el-form"
    @submit.native.prevent>
    <el-form-item prop="ids">
      <el-input v-model="form.ids" :disabled="isDisabled"/>
    </el-form-item>
    <p class="fc--gray">
      请输入<span class="fc--red">SKU ID</span>，多个ID以","号分隔
    </p>
  </el-form>
</template>

<script>
  import mixin from './mixin';
  export default {
    name: 'jd-marketing-tag-skus',
    mixins: [mixin],
    props: {
      // 组件配置
      options: {
        type: Object
      }
    },
    data() {
      return {
        form: this.initForm(),
        rules: {
          ids: [{
            required: true, message: '请选择商品'
          }]
        }
      };
    },
    methods: {
      // 针对sku组件的特殊设置
      initForm(data) {
        const {
          // 接口字段
          value = ''
        } = this.tag || {};
        const campaignData = data || this.campaignData || {}; // 所有标签的数据
        const {
          matchContent = [] // skuId 集合
        } = campaignData[value] || {};
        return {
          ids: matchContent.join(',')
        };
      },
      // overwrite mixin getData
      getData() {
        const {
          // 接口字段
          value = ''
        } = this.tag || {};
        const {
          ids = []
        } = this.form || {};
        // 当matchMode是terms时
        // 格式为matchContent: [1,2]
        // 例如checkbox/选择商品组件等是terms
        return {
          key: value,
          matchMode: 'terms',
          matchContent: ids.replace(/，/gi, ',').split(',')
        };
      },
      handleSave() {

      }
    }
  }
</script>

