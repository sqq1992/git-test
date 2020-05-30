<template>
  <el-form-item class="el-form-item__info" :label="label" :error="errorMessage">
    <el-select class="date-width mr_15" size="small" v-model="mode">
      <el-option v-for="({label,value}) in modeMap" :label="label" :value="value"/>
    </el-select>
    <template v-if="modeType === 'date' && mode === 1">
      <el-date-picker
        :editable="false"
        :clearable="false"
        class="date-width"
        size="small"
        v-model="value1"
        type="date"
        placeholder="选择日期"
        @change="checkAndSave('value1')"
        >
      </el-date-picker>
      <span class="m_r10 m_l10">至</span>
      <el-date-picker
        :editable="false"
        :clearable="false"
        class="date-width"
        v-model="value2"
        size="small"
        type="date"
        placeholder="选择日期"
        @change="checkAndSave('value2')"
        >
      </el-date-picker>
    </template>
    <template v-else>
      <el-input v-show="mode > 2" :key="'min'" size="small" @blur="blurInp('value1',value1)" class="date-width" v-model.trim="value1"></el-input>
      <span v-show="mode === 4" class="m_r10 m_l10">至</span>
      <el-input v-show="mode === 4 || mode === 2" :key="'max'" size="small" @blur="blurInp('value2',value2)" class="date-width" v-model.trim="value2"></el-input>
      <!--<span class="m_l5">次</span>-->
    </template>
  </el-form-item>
</template>
<script>
  import dateFormat from '@/common/dateFormat.js';
  import Vue from 'vue';
  function getModeMap(type) {
    const selectDate = [{label: '不限', value: 0}, {label: '指定日期', value: 1}]
    const selectUnDate = [
      {label: '不限', value: 0},
      {label: '小于等于', value: 2},
      {label: '大于等于', value: 3},
      {label: '介于', value: 4}
    ]
    const modeMapArr = {
      firstOrderCheck: {type: 'date',},
      timeCheck: {type: 'date',},
      countCheck: {type: 'unDate',},
      amountCheck: {type: 'unDate',},
      priceCheck: {type: 'unDate',},
      itemNumCheck: {type: 'unDate',},
      closeTradeCountCheck: {type: 'unDate',},
      closeTradeAmountCheck: {type: 'unDate',},
    }
    const modeType = modeMapArr[type].type
    return {
      modeType,
      modeMap: modeType === 'date' ? selectDate : selectUnDate
    }
  }
  export default {
    props: {
      itemData:Object
    },
    data() {
      const {name, type, minVal, maxVal} = this.itemData;
      const {modeType, modeMap} = getModeMap(type);
      return {
        label:name,
        modeType,
        modeMap,
        mode: 0,
        value1: minVal || '',
        value2: maxVal || '',
        errorMessage: ''
      }
    },

    watch: {
      mode: function(val) {
        if(val === 4) {
          const {value1,value2} = this
          if(value1 - value2 > 0) {
            // 当介于时 开始值必须小于等于结束值 否则交换
            this.value1 = value2
            this.value2 = value1
          }
        }
        //清空条件
        this.$emit('delData',this.itemData.type);
        this.value1 = '';
        this.value2 = '';
        // if(val == 2) {
        //     this.value2 = '';
        // } else if(val == 3) {
        //     this.value1 = ''
        // } else if(val == 4) {
        //     this.value1 = '';
        //     this.value2 = '';
        // }
      },
      itemData(val){
        const {minVal, maxVal} = this.itemData;
        if(this.modeType == 'date') {
          if(minVal || maxVal) {
            this.mode = 1;
          }
        } else {
          if(minVal && maxVal) {
            this.mode = 4;
          } else if (minVal) {
            this.mode = 3;
          } else if (maxVal) {
            this.mode = 2;
          }
        }
        Vue.nextTick(() => {
          minVal && (this.value1 = minVal);
          maxVal && (this.value2 = maxVal);
        })
      }
    },
    methods: {
      blurInp(key,value) {
        if(value && !/^[0-9][\d]*$/.test(value)) {
          this[key] = value.replace(/[^\d]/g,'').replace(/^[^1-9]/,'');
        }
        if(this.value1 && this.value2 && (Number(this.value1) > Number(this.value2))) {
          this[key] = '';
          this.$message.warning('最小值不得大于最大值！');
          return;
        }

        let data = this.mode == 2 ? this.value2 : this.mode == 3 ? this.value1 : [this.value1,this.value2];
        this.$emit('saveData',data,this.itemData.type,this.mode);
      },
      checkAndSave(key) {
        this.value1 && (this.value1 = dateFormat(this.value1, 'YY-MM-DD'));
        this.value2 && (this.value2 = dateFormat(this.value2, 'YY-MM-DD'));
        if(this.value1 && this.value2 && (new Date(this.value2) < new Date(this.value1))) {
          this[key] = '';
          this.$message.warning('开始时间不得大于结束时间！');
          return;
        } else {
          this.$emit('saveData',[this.value1,this.value2],this.itemData.type)
        }
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .date-width{
    width: 125px;
  }
  .day-width{
    width: 74px;
  }
</style>
<style>
  .el-form-item__info .el-form-item__error {
    position: static;
  }
</style>
