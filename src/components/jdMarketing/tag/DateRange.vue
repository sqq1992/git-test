<template>
  <el-form
    ref="customForm"
    :inline="true"
    :disabled="isDisabled"
    class="reset-el-form"
    :rules="rules"
    :model="form">
    <el-form-item prop="gte" label="日期范围">
      <el-date-picker
        v-model="form.gte"
        align="right"
        type="date"
        placeholder="选择起始日期"
        :picker-options="pickerOptions">
      </el-date-picker>
    </el-form-item>
    <span class="m_r10">至</span>
    <el-form-item prop="lte">
      <el-date-picker
        v-model="form.lte"
        align="right"
        type="date"
        placeholder="选择结束日期"
        :default-time="['00:00:00', '23:59:59']"
        :picker-options="pickerOptions">
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
  import mixin, { dateRangeMethodsMixin } from './mixin';
  import { getDiffDate } from '@/common/utils';
  import { getTimeData } from "@/components/jdMarketing/filterMemberUtil";
  export default {
    name: "jd-marketing-tag-date-time-range",
    mixins: [mixin, dateRangeMethodsMixin],
    props: {
      options: {
        type: Object,
        default() {
          return {
            // 禁用起始日期与当前日期的间隔
            // Boolean | Number
            disabledDateDiff: false
          };
        }
      }
    },
    data() {
      const that = this;
      const {
        disabledDateDiff = false
      } = this.options || {};
      const endDate = new Date();
      const endDateTime = +endDate;
      // 往前推90天
      const startDateTime = getDiffDate(endDateTime, disabledDateDiff || -90);
      return {
        form: this.initForm(),
        rules: {
          gte: [{
            validator(rule, value, callback) {
              if (!value) {// 可以为空
                that.form.lte
                  ? callback()
                  : callback(new Error('起始时间和结束时间不能都为空'));
              } else if (that.form.lte) {// 当起始日期不为空且结束日期不为空时，起始日期必须小于结束日期
                value > that.form.lte
                  ? callback(new Error('起始日期不能大于结束日期'))
                  : callback();
              } else {
                callback()
              }
            }
          }],
          lte: [{
            validator(rule, value, callback) {
              if (!value) {// 可以为空
                that.form.gte
                  ? callback()
                  : callback(new Error('起始时间和结束时间不能都为空'));
              } else if (that.form.gte) {// 当结束日期不为空且起始日期不为空时，结束日期必须大于起始日期
                value < that.form.gte
                  ? callback(new Error('结束日期不能小于起始日期'))
                  : callback();
              } else {
                callback()
              }
            }
          }]
        },
        pickerOptions: {
          disabledDate(time) {
            const _time = time.getTime();
            return disabledDateDiff ? _time > endDateTime || _time < startDateTime : _time > endDateTime;
          },
          shortcuts: [{
            text: '一周前',
            onClick(picker) {
              const end = new Date();
              const start = getDiffDate(end, -7);
              picker.$emit('pick', start);
            }
          }, {
            text: '一个月前',
            onClick(picker) {
              const end = new Date();
              const start = getDiffDate(end, -30);
              picker.$emit('pick', start);
            }
          }, {
            text: '三个月前',
            onClick(picker) {
              const end = new Date();
              const start = getDiffDate(end, -90);
              picker.$emit('pick', start);
            }
          }]
        }
      };
    },
    methods: {
      // 针对日期范围组件的取值
      // 覆盖mixin中的getData
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
          // 将结束日期格式化为 23:59:59
          const date = new Date(form.lte);
          matchContent.lte = getTimeData(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' 23:59:59');
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
