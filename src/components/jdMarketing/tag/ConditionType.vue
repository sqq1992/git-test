<template>
  <div v-if="hideConditionType"></div>
  <el-form
    v-else
    :model="form"
    class="condition-type-wrap"
    @submit.native.prevent>
    <div class="condition-type-list">
      <div
        v-for="item in conditionTypeList"
        :class="['condition-type-item', { 'active': form.conditionType === item.value }]"
        @click="update(item.value)"
        :key="item.value">
        {{item.label}}
      </div>
    </div>
  </el-form>
</template>

<script>
  import { conditionTypeList } from '../filterMemberUtil';
  export default {
    name: "jd-marketing-tag-condition-type",
    props: {
      // 是否隐藏交并差
      hideConditionType: {
        type: Boolean,
        default: true
      },
      value:{
        type: String,
        default: 'must'
      }
    },
    data() {
      return {
        conditionTypeList,
        form: {
          conditionType: this.value || 'must'
        }
      };
    },
    methods: {
      update(value = '') {
        if (this.isDisabled) return false;
        this.form.conditionType = value;
      },
      getData() {
        return this.hideConditionType ? 'must' : this.form.conditionType;
      }
    }
  }
</script>

<style lang="less" scoped>
  .condition-type-wrap {
    height: 32px;
    position: relative;
  &:after {
     display: block;
     content: '';
     border-top: 1px solid #dfe6ec;
     position: absolute;
     top: 16px;
     left: -10px;
     right: -10px;
   }
  }
  .condition-type-list {
    display: table;
    table-layout: fixed;
    border-collapse: collapse;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -48px;
    z-index: 1;
  }
  .condition-type-item {
    display: table-cell;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #c4c4c4;
    cursor: pointer;
    background-color: #fff;
  &.active {
     background-color: #20a0ff;
     color: #fff;
     border-color: #20a0ff;
   }
  }
</style>
