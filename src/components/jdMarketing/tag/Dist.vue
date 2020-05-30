<template>
  <pick-district
    v-model="form.dist"
    :isDisabled="isDisabled">
  </pick-district>
</template>

<script>
  import mixin from './mixin';
  import pickDistrict from '@/components/pickDistrict/Index';
  export default {
    name: "jd-marketing-tag-district",
    mixins: [mixin],
    components: {
      pickDistrict
    },
    data() {
      return {
        form: this.initForm()
      };
    },
    methods: {
      /**
       * 初始化表单字段
       * @return {Object}
       */
      initForm(data) {
        const campaignData = data || this.campaignData || {}; // 所有标签的数据
        // 解析省份
        const {
          matchContent: {
            value: province = ''
          } = {}
        } = campaignData['opdata_base_province'] || {};
        // 解析市
        const {
          matchContent: {
            value: city = ''
          } = {}
        } = campaignData['opdata_base_city'] || {};
        // 解析区县
        const {
          matchContent: {
            value: ditrict = ''
          } = {}
        } = campaignData['opdata_base_county'] || {};
        return {
          dist: [province, city, ditrict]
        };
      },
      // 重写mixin里的validate方法，默认返回Promise.resolve
      validate() {
        return Promise.resolve();
      },
      // overwrite mixin getData
      getData() {
        // fixme 京东的省市区的值与当前省区市json的值可能不匹配
        let {
          dist = [],
        } = this.form || {};
        return [
          {
            key: 'opdata_base_province',
            matchMode: 'term',
            matchContent: {
              value: dist[0] || ''
            }
          },
          {
            key: 'opdata_base_city',
            matchMode: 'term',
            matchContent: {
              value: dist[1] || ''
            }
          }
          // {
          //   key: 'opdata_base_county',
          //   matchMode: 'term',
          //   matchContent: {
          //     value: dist[2] || ''
          //   }
          // }
        ];
      }
    }
  }
</script>


