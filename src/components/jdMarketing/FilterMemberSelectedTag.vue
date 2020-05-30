<template>
  <div class="reset-el-input-wrap">
    <h3 class="headline with-border-bottom" style="position: relative;">
      设置已选标签
      <el-button
        v-if="!isDisabled"
        type="text"
        @click="handleDelete('')"
        style="position: absolute;right: 10px;top: 4px;">
        全删
      </el-button>
    </h3>
    <div class="select-tag-container">
      <div
        class="select-tag-item"
        v-for="(tag, index) in selectedTagList"
        :key="tagMap[tag].key">
        <el-button
          v-if="!isDisabled"
          type="text"
          :class="['del', isHideConditionType(index) ? '' : 'with-condition']"
          @click="handleDelete(tagMap[tag].key)">
          删除
        </el-button>
        <condition-type
          :ref="tagMap[tag].key + '_condition_type'"
          :is-disabled="isDisabled"
          :value="campaignData[tagMap[tag].value]?campaignData[tagMap[tag].value].conditionType:''"
          :hide-condition-type="isHideConditionType(index)">
        </condition-type>
        <h4 class="tag-title">{{tagMap[tag].name}}</h4>
        <p class="fc--gray m_b5">{{tagMap[tag].desc}}</p>
        <component
          v-if="tagMap[tag].component === 'custom'"
          :ref="tagMap[tag].key"
          :is-disabled="isDisabled"
          :tag="tagMap[tag]"
          :campaignData="campaignData"
          :is="tagMap[tag].key">
        </component>
        <common
          v-else-if="!tagMap[tag].component || !tagMap[tag].component.name"
          :ref="tagMap[tag].key"
          :is-disabled="isDisabled"
          :options="tagMap[tag].component.options || {}"
          :tag="tagMap[tag]">
        </common>
        <component
          :is="tagMap[tag].component.name"
          :ref="tagMap[tag].key"
          :is-disabled="isDisabled"
          :campaignData="campaignData"
          :options="tagMap[tag].component.options || {}"
          :tag="tagMap[tag]">
        </component>
      </div>
    </div>
    <div v-if="isDisabled" class="text-center">
      <el-button type="primary" @click="$emit('close')">关闭</el-button>
    </div>
  </div>
</template>

<script>
  // FIXME WARNING: 注意所有自定义的标签交互组件都需要暴露validate和getData这两个方法分别用于校验和获取最终的参数(tag/mixin默认注入了validate和getData)
  import { propsCampaignData } from './tag/mixin';
  import common from './tag/Common';
  import { tagMap } from './filterMemberUtil';
  import priceGroup from './tag/PriceGroup';
  import countGroup from './tag/CountGroup';
  import dateRange from './tag/DateRange';
  import dateTimeRange from './tag/DateTimeRange';
  import checkbox from './tag/Checkbox';
  import skus from './tag/Skus';
  import dist from './tag/Dist';
  import clickResponse from './tag/ClickResponse';
  import conditionType from './tag/ConditionType';
  export default {
    name: "jd-marketing-selected-tag",
    mixins: [propsCampaignData],
    props: {
      // 当前选择的标签
      selectedTagMap: {
        type: Array,
        default() {
          return [];
        }
      },
      // 是否禁用
      isDisabled: {
        type: Boolean,
        default: false
      }
    },
    components: {
      common, priceGroup, countGroup, dateRange, dateTimeRange, checkbox, skus, dist, conditionType, clickResponse
    },
    data() {
      return {
        tagMap
      };
    },
    computed: {
      // 当前选择的标签列表
      selectedTagList() {
        let list = this.selectedTagMap;
        // for (let i in this.selectedTagMap) {
        //   this.selectedTagMap[i] && list.push(tagMap[i]);
        // }
        return list;
      },
      selectedTagKeys() {
        return this.selectedTagList;
      }
    },
    methods: {
      /**
       * 删除已选标签
       * 不传key或key为空时，代表删除所有标签
       * @param {String | void} key
       */
      handleDelete(key) {
        if (!key && !this.selectedTagList.length) {
          // 全删标签时先判断是否存在已选标签，避免不必要的遍历对象操作
          return false;
        }
        this.$emit('update:delete', key);
      },
      // 获取组件实例
      getRef(key = '') {
        if (!key) return false;
        const $refs = this.$refs;
        if (!$refs[key] || !$refs[key].length) return false;
        return $refs[key][0];
      },
      /**
       * 校验所有的标签
       * @return {Array<Promise>}
       */
      validate() {
        const that = this;
        const selectedTagKeys = this.selectedTagKeys || [];
        if (!selectedTagKeys.length) return [Promise.reject('请至少选择一个人群标签！')];
        return selectedTagKeys.reduce((promiseList, key) => {
          const $ref = that.getRef(key);
          // 所有自定义标签交互组件或公共标签交互组件都需要暴露一个validate方法用于校验
          $ref && $ref['validate'] && promiseList.push($ref.validate());
          return promiseList;
        }, []);
      },
      /**
       * 获取所有已选择的标签的参数
       * 所有自定义标签交互组件或公共标签交互组件都需要暴露一个getData方法用于获取参数
       * @return {Object}
       */
      getData() {
        const that = this;
        return this.selectedTagKeys.reduce((arr, key) => {
          const $ref = that.getRef(key);// 各筛选条件
          const $refConditionType = that.getRef(key + '_condition_type');// 各筛选条件的交并差
          if ($ref &&
            $ref['getData'] &&
            $refConditionType &&
            $refConditionType['getData']
          ) {
            let data = $ref.getData();
            let conditionType = $refConditionType.getData();
            // 针对array和object分别处理
            if (Object.prototype.toString.call(data) === '[object Array]') {
              data.forEach(item => {
                item.conditionType = conditionType;
              });
              arr = arr.concat(data);
            } else {
              data.conditionType = conditionType;
              arr.push(data);
            }
          }
          return arr;
        }, []);
      },
      /**
       * 是否隐藏交并差
       * @param index
       * @return {boolean}
       */
      isHideConditionType(index = 0) {
        const selectedTagList = this.selectedTagList || [];
        return !selectedTagList.length || index === 0;
        // fixme 暂时隐藏所有交并差
        // return true;
      }
    }
  }
</script>
