import { getTimeData } from "../filterMemberUtil";
// campaignData props mixin
export const propsCampaignData = {
  props: {
    // 活动数据
    campaignData: {
      type: Object,
      default() {
        return {};
      }
    },
    conditions:{
      type: String,
      default() {
        return '';
      }
    }
  }
};
// 日期范围类型组件的方法mixin
export const dateRangeMethodsMixin = {
  methods: {
    // 针对日期范围组件的初始化
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
      // 接口传值时，保留到秒，这里要解析成毫秒
      if (gte) gte *= 1000;
      if (lte) lte *= 1000;
      return {
        gte, lte
      };
    },
    // 针对日期范围组件的取值
    // 覆盖default mixin中的getData
    getData() {
      const {
        // 接口字段
        value = ''
      } = this.tag || {};
      const form = this.form || {};
      let matchContent = {};
      if (form.gte) {
        matchContent.gte = getTimeData(form.gte);
      }
      if (form.lte) {
        matchContent.lte = getTimeData(form.lte);
      }
      return {
        key: value,
        matchMode: 'range',
        matchContent
      };
    }
  }
};
export default {
  props: {
    // 活动数据
    campaignData: propsCampaignData.props.campaignData,
    // 控件对应的标签
    tag: {
      type: Object,
      default() {
        return {};
      }
    },
    // 是否禁用
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * 初始化表单字段
     * 省市区联动 等一些多字段合并的组件需要重写initForm
     * @return {Object}
     */
    initForm(data) {
      let {
        // 匹配类型
        matchMode = '',
        defaultValue = ''
      } = this.options;
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
      if (matchMode === 'range') {
        const {
          gte = '', lte = ''
        } = matchContent;
        return {
          start: gte,
          end: lte
        };
      }
      // 当matchMode是term时
      // 格式为matchContent: {value: ''}
      // 例如radio/select单选组件等是term
      if (matchMode === 'term') {
        const value = matchContent.value !== undefined ? matchContent.value : defaultValue;
        return {
          formValue: value
        };
      }
      // 当matchMode是terms时
      // 格式为matchContent: [1,2]
      // 例如checkbox/选择商品组件等是terms
      if (matchMode === 'terms') {
        return {
          formValue: matchContent
        };
      }
      // default
      return {};
    },
    /**
     * 校验
     * @return {Promise<any>}
     */
    validate() {
      const $refs = this.$refs;
      const tag = this.tag || {};
      return new Promise((resolve, reject) => {
        $refs.customForm.validate(isValid => {
          isValid
            ? resolve()
            : reject(`${tag.name || 'tag component'}填写有误或为空`);
        });
      });
    },
    /**
     * 获取参数
     * 业务组件可能需要重写这个方法
     * 返回的参数应当是这种格式：
     * {
          'opdata_shop_complete_ord_amount': {
            key: 'opdata_shop_complete_ord_amount',
            matchMode: 'range',
            matchContent: {gte: 1, lte: 2}
          }
        }
     * @return {Object}
     */
    getData() {
      const {
        // 匹配类型
        matchMode = '',
        defaultValue = ''
      } = this.options;
      const {
        // 接口字段
        value = '',
        component: {
          name = ''
        } = {}
      } = this.tag || {};
      // name不存在时 说明不可交互，所以不需要解析form
      if (!name) {
        return {
          key: value,
          matchContent: defaultValue,
          matchMode
        };
      }
      const form = this.form || {};
      let obj = {
        key: value
      };
      if (matchMode) {
        obj.matchMode = matchMode;
      }
      // 当matchMode是range时
      // 格式为matchContent: {gte: '', lte: ''}
      // 例如输入框组，日期范围组件等是range
      if (matchMode === 'range') {
        let result = {};
        if (form.start !== '') {
          result.gte = form.start;
        }
        if (form.end !== '') {
          result.lte = form.end;
        }
        obj.matchContent = result;
      }
      // 当matchMode是term时
      // 格式为matchContent: {value: ''}
      // 例如radio/select单选组件等是term
      if (matchMode === 'term') {
        obj.matchContent = {
          value: form.formValue
        };
      }
      // 当matchMode是terms时
      // 格式为matchContent: [1,2]
      // 例如checkbox/选择商品组件等是terms
      if (matchMode === 'terms') {
        obj.matchContent = form.formValue || [];
      }
      return obj;
    }
  }
};
