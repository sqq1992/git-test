<template>
  <div class="comp-full-calendar">
    <!-- header pick month -->
    <fc-header :current-date="currentDate" 
      :title-format="titleFormat"
      :first-day="firstDay"
      :month-names="monthNames"
      @change="emitChangeMonth">

      <div slot="header-left">
        <slot name="fc-header-left">
        </slot>
      </div>

      <div slot="header-right">
        <slot name="fc-header-right">
          发送状态筛选：
          <el-select v-model="type" class="selType">
            <el-option :value="''" label="不限"></el-option>
            <el-option :value="'designing'" label="设计中"></el-option>
            <el-option :value="'not_through'" label="审核不通过"></el-option>
            <el-option :value="'not_send'" label="未发送"></el-option>
            <el-option :value="'sended'" label="已发送"></el-option>
          </el-select>
        </slot>
      </div>
    </fc-header>
    <!-- body display date day and events -->
    <fc-body :current-date="currentDate" :events="events" :month-names="monthNames" 
      :week-names="weekNames" :first-day="firstDay" :eventList="eventList"
      @eventclick="emitEventClick" @dayclick="emitDayClick"
      @moreclick="emitMoreClick">
      <div slot="body-card">
        <slot name="fc-body-card">
        </slot>
      </div>
    </fc-body>
  </div>
</template>
<script type="text/babel">
  import langSets from './dataMap/langSets';
  import http from './../../../../api/index.js';
  export default {
    props : {
      events : { // events will be displayed on calendar
        type : Array,
        default : []
      },
      lang : {
        type : String,
        default : 'en'
      },
      firstDay : {
        type : Number | String,
        validator (val) {
          let res = parseInt(val)
          return res >= 0 && res <= 6
        },
        default : 0
      },
      titleFormat : {
        type : String,
        default () {
          return langSets[this.lang].titleFormat
        }
      },
      monthNames : {
        type : Array,
        default () {
          return langSets[this.lang].monthNames
        } 
      },
      weekNames : {
        type : Array,
        default () {
          let arr = langSets[this.lang].weekNames
          return arr.slice(this.firstDay).concat(arr.slice(0, this.firstDay))
        }
      },
      eventUrl : {
        type: String,
        default : ''
      }
    },
    data () {
      return {
        currentDate : new Date(),
        eventList: '',
        type:''
      }
    },
    watch: {
      type(val) {
        this.getMarketingDateEvents(this.eventUrl,val);
      }
    },
    created() {
      this.getMarketingDateEvents(this.eventUrl,this.type);
    },
    methods : {
      emitChangeMonth (start, end, currentStart, current) {
        this.currentDate = current
        this.$emit('changeMonth', start, end, currentStart)
      },
      emitEventClick (event, jsEvent, pos) {
        this.$emit('eventClick', event, jsEvent, pos)
      },
      emitDayClick (day, jsEvent) {
        this.$emit('dayClick', day, jsEvent)
      },
      emitMoreClick (day, events, jsEvent) {
        this.$emit('moreClick', day, event, jsEvent)
      },
      getMarketingDateEvents(api,type) {
        http({
          api_name:api,
          data:{
            type
          },
        },res => {
            this.eventList = res.data.list;
        },error => {

        })
      }
    },
    components : {
      'fc-body'   : require('./components/body'),
      'fc-header' : require('./components/header')
    }
  }
  
</script>
<style lang="less">
  .comp-full-calendar{
    // font-family: "elvetica neue", tahoma, "hiragino sans gb";
    padding:20px;
    background: #fff;
    // max-width: 1160px;
    margin:0 auto;
    ul,p{
      margin:0;
      padding:0;
      font-size: 14px;
    }
    .selType{
      input{
        width: 100%;
        height: 28px;
        padding: 3px 10px;
      }
    }
  }
</style>