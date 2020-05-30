<template>
  <div>
    <h3 class="headline with-border-bottom">选择人群标签</h3>
    <div class="tag-wrap" v-for="tagType in tagTypeList" :key="tagType.value">
      <h4 class="tag-type with-border-bottom">{{tagType.name}}</h4>
      <div class="tag-container">
        <!--template循环中要放一个空的span标签是因为如果要使tag-container的justify生效，tag-item结束标签后面必须留有空格或换行-->
        <template v-for="tag in tagType.children">
          <el-button
            :key="tag.key"
            :class="['tag-item', 'btn-checked', selectedTagMap.includes(tag.key) ? 'active' : '']"
            size="small"
            @click="handleToggleTag(tag.key)">
            {{tag.name }}
          </el-button>
          <span></span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import { propsCampaignData } from './tag/mixin';
  import { tagMap, tagTypeList } from './filterMemberUtil';
  export default {
    name: "jd-marketing-toggle-tag",
    mixins: [propsCampaignData],
    props: {
      // 当前选择的标签
      selectedTagMap: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        // 人群标签
        tagTypeList
      };
    },
    methods: {
      // 处理标签按钮点击行为
      handleToggleTag(key = '') {
        this.$emit('update:toggle', key);
      }
    }
  };
</script>
