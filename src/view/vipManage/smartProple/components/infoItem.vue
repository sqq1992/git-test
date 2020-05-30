<template>
  <div class="m_t5" :label="label" :error="errorMessage">
    <el-select :disabled="disabled" v-if="prop === 'date'" class="lastSelect" v-model="dateType" >
      <el-option label="指定时间" :value="1"/>
      <el-option label="相对最近时间" :value="2"/>
    </el-select>

    <template v-if="prop === 'date' && dateType === 1">
      <el-date-picker
        :disabled="disabled"
        :editable="false"
        :clearable="false"
        class="date-width"
        size="small"
        v-model="date1"
        type="date"
        placeholder="选择日期"/>
      <span>至</span>
      <el-date-picker
        :disabled="disabled"
        :editable="false"
        :clearable="false"
        class="date-width"
        v-model="date2"
        size="small"
        type="date"
        placeholder="选择日期"/>
    </template>
    <template v-else>
      <el-select :disabled="disabled"  class="way-width" size="small" v-model="mode">
        <el-option v-for="({label,value}) in modeMap" :label="label" :value="value"/>
      </el-select>
      <el-input :disabled="disabled"  v-show="mode < 2"  size="small" @blur="blurInp('value1',value1)" class="day-width" v-model.trim="value1"/>
      <span v-show="mode === 1">至</span>
      <el-input :disabled="disabled"  v-show="mode > 0"  size="small" @blur="blurInp('value2',value2)" class="day-width" v-model.trim="value2"/>
      <span class="m_l5">{{unit}}</span>
    </template>
  </div>
</template>
<script>
  export default {
    props: {
      label: String,
      prop: String,
      unit: String,
      leftVal: [String,Number,Date],
      rightVal: [String,Number,Date],
      initDateType: Number,
      disabled:[String,Boolean]
    },
    data() {

      const initDateTypeOf = this.initDateType === 1

      const value1 = initDateTypeOf ? '' : this.leftVal
      const value2 = initDateTypeOf ? '' : this.rightVal

      console.log('initDateType',this.initDateType)
      return {
        modeMap:[
          {label: '小于等于', value: 2},
          {label: '大于等于', value: 0},
          {label: '介于', value: 1}
        ],
        dateType: this.initDateType || 1,
        value1,
        value2,
        date1: initDateTypeOf ? this.leftVal : (new Date()),
        date2: initDateTypeOf ? this.rightVal : (new Date(((new Date).setDate((new Date).getDate() + 30)))),
        errorMessage: '',
        mode: !!value2 - !!value1 + 1, // 取决于 value1 和 value2 存在方式
      }
    },

    watch: {
      // 箭筒mode 当介于前开始值大于结束值是 交换
      mode: function(val) {
        if(val === 0) {
          const {value1,value2} = this
          if(value1 - value2 > 0) {
            // 当介于时 开始值必须小于等于结束值 否则交换
            this.value1 = value2
            this.value2 = value1
          }
        }
      },

      initDateType(val) {
        this.dateType = val
      },

      // 重置leftVal受控值
      leftVal(val) {
        if(this.prop === 'date' && this.initDateType === 1) {
          this.date1 = val
        }else {
          this.value1 = val
        }
      },
      // 重置rightVal受控值
      rightVal(val) {
        if(this.prop === 'date' && this.initDateType === 1) {
          this.date2 = val
        }else {
          this.value2 = val
        }
      }
    },
    methods: {
      blurInp(key,value) {
        if(value && !/^[1-9][\d]*$/.test(value)) {
          this[key] = value.replace(/[^\d]/g,'').replace(/^[^1-9]/,'');
        }
      },
      getValue() {
        if(this.prop === 'date' && this.dateType === 1) {
          return [this.date1,this.date2,this.mode,this.dateType]
        }
        if(this.value1 - this.value2 > 0) {
          return [this.value2,this.value1,this.mode]
        }else {
          return [this.value1,this.value2,this.mode]
        }
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .date-width{
    width: 113px;
  }
  .way-width{
    width: 92px;
  }
  .day-width{
    width: 66px;
  }
  .lastSelect{
    width: 120px;
  }
</style>

