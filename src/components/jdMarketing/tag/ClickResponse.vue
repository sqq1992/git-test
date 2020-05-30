<template>
  <div></div>
</template>

<script>
  // 针对短信敏感人群标签
  import mixin from './mixin';
  export default {
    name: 'jd-marketing-tag-click-response',
    mixins: [mixin],
    methods: {
      validate() {
        return Promise.resolve();
      },
      // overwrite mixin getData
      getData() {
        return [
          {
            key: 'opdata_platform_sms_click_response',
            matchMode: 'terms',
            matchContent: [3, 4, 5]
          }
        ];
      }
    }
  }
</script>

