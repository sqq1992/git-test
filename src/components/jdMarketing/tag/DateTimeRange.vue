<template>
  <el-form
    ref="customForm"
    :inline="true"
    :disabled="isDisabled"
    class="reset-el-form"
    :rules="rules"
    :model="form">
    <el-form-item prop="gte" label="时间范围">
      <el-date-picker
        v-model="form.gte"
        align="right"
        type="datetime"
        placeholder="选择起始时间"
        :picker-options="pickerOptions">
      </el-date-picker>
    </el-form-item>
    <span class="m_r10">至</span>
    <el-form-item prop="lte">
      <el-date-picker
        v-model="form.lte"
        align="right"
        type="datetime"
        placeholder="选择结束时间"
        :picker-options="pickerOptions">
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
  import mixin, { dateRangeMethodsMixin } from './mixin';
  import { formatDate, getDiffDate } from '@/common/utils';
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
      const endDateTime = +new Date(formatDate("yyyy/MM/dd 23:59:59"));
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
              } else if (that.form.lte) {// 当起始时间不为空且结束时间不为空时，起始时间必须小于结束时间
                value > that.form.lte
                  ? callback(new Error('起始时间不能大于结束时间'))
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
              } else if (that.form.gte) {// 当结束时间不为空且起始时间不为空时，结束时间必须大于起始时间
                value < that.form.gte
                  ? callback(new Error('结束时间不能小于起始时间'))
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
    }
  }
</script>
