<template>
    <div class="today_box" v-loading="loading">
        <search-box link="todayData" :headers="headers" @getData="setLoading"></search-box>
    </div>
</template>

<script>
import searchBox from '../search_top/index.vue';
export default {
    data(){
      let inBrand = this.$store.state.user.inBrand;
      let headers = [
        {
          name: '日期',
          key: 'date'
        },

        {
            name: '访问会员人数',
            key: 'memberVisit'
        },
        {
            name: '互动参与次数',
            key: 'interactCount'
        },
        {
            name: '互动参与人数',
            key: 'interactPeoples'
        },
        {
            name: '礼品兑换次数',
            key: 'giftCount'
        },
        {
            name: '礼品兑换人数',
            key: 'giftPeoples'
        }
      ]
      if(!inBrand) {
        headers.splice(1,0,...[
          {
            name: '访问pv',
            key: 'pv'
          },
          {
              name: '访问uv',
              key: 'uv'
          },
        ])
      }
        return {
            headers,
            loading:true
        }
    },
    mounted() {
      console.log(this.headers)
    },
    methods: {
      setLoading() {
        this.loading = false;
      }
    },
    components: {
        searchBox
    }
}
</script>

<style lang="less" scoped>
    .today_box{
        padding: 12px;
    }
</style>
