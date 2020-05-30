<template>
  <div class="simulate-table" style="font-size: 14px;">
    <div class="simulate-table-cell with-border">
      <toggle-tag
        ref="toggleTag"
        :campaign-data="campaignData"
        :selected-tag-map="selectedTagListed"
        @update:toggle="handleToggleTag">
      </toggle-tag>
    </div>
    <div class="simulate-table-cell" style="width: 20px;"></div>
    <div class="simulate-table-cell with-border">
      <selected-tag
        ref="selectedTag"
        :campaign-data="campaignData"
        :selected-tag-map="selectedTagListed"
        @update:delete="handleDeleteTag">
      </selected-tag>
    </div>
  </div>
</template>

<script>
  import { propsCampaignData } from './tag/mixin';
  import toggleTag from './FilterMemberToggleTag';
  import selectedTag from './FilterMemberSelectedTag';
  import {initSelectedTagList, initSelectedTagMap} from './filterMemberUtil';
  import {uniq} from 'lodash';
  export default {
    mixins: [propsCampaignData],
    // fixme name
    name: 'jd-marketing-manage-tag',
    components: {
      toggleTag, selectedTag
    },
    data() {
      return {
        selectedTagMap: initSelectedTagMap(this.campaignData),
        selectedTagListed: initSelectedTagList(this.conditions)
      };
    },
    methods: {
      // 处理删除标签
      // key不存在或key为空时，代表删除所有标签
      handleDeleteTag(key = '') {
        if (!key) {
          // 删除所有已选标签
          this.selectedTagListed = [];
          return false;
        }
        // 删除单个标签
        this.toggleTag(key, false);
      },
      // 处理标签按钮点击行为
      handleToggleTag(key = '') {
        if (!key) return false;
        const isCurrentlySelected = this.selectedTagListed.includes(key);// 当前是否处于选中状态
        this.toggleTag(key, !isCurrentlySelected);
      },
      /**
       * 更新标签选中状态
       * @param {String} key 标签key
       * @param {Boolean} newState 标签新的选中状态
       * @return {boolean}
       */
      toggleTag(key = '', newState = true) {
        if(key){
          if(newState){
            this.selectedTagListed.push(key);
          }else {
            this.selectedTagListed = this.selectedTagListed.filter((elem) => {
              return elem !== key;
            });
          }
          this.selectedTagListed = uniq(this.selectedTagListed);
        }
      },
      /**
       * 校验所有的标签
       * @return {Array<Promise>}
       */
      validate() {
        return this.$refs.selectedTag.validate();
      },
      /**
       * 获取所有已选择的标签的参数
       * @return {Object}
       */
      getData() {
        return this.$refs.selectedTag.getData();
      }
    }
  }
</script>
