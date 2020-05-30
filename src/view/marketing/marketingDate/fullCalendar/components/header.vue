<template>
  <div class="full-calendar-header">
    <div class="header-left">
      <slot name="header-left">
      </slot>
    </div>
    <div class="header-center">
      <span class="prev-month" @click.stop="goPrev">
        <b></b>
      </span>
      <span class="title">{{title}}</span>
      <span class="next-month" @click.stop="goNext">
        <b class="rt"></b>
      </span>
      <span class="todayBtn" @click.stop="today">今天</span>
    </div>
    <div class="header-right">
      <slot name="header-right">
      </slot>
    </div>
  </div>
</template>
<script type="text/babel">
  import dateFunc from './dateFunc'

  export default {
    created () {
      this.dispatchEvent()
    },
    props : {
      currentDate : {},
      titleFormat : {},
      firstDay    : {},
      monthNames  : {}
    },
    data () {
      return {
        title      : '',
        leftArrow  : '<',
        rightArrow : '>',
        headDate : new Date()
      }
    },
    watch : {
      currentDate (val) {
        if (!val) return
        this.headDate = val
        console.log('currentDate', val)
        // this.headDate = JSON.parse(JSON.stringify(val))
      }
    },
    methods : {
      goPrev () {
        this.headDate = this.changeMonth(this.headDate, -1)
        this.dispatchEvent()
      },
      goNext () {
        this.headDate = this.changeMonth(this.headDate, 1)
        this.dispatchEvent()
      },
      today () {
        this.headDate = new Date();
        this.dispatchEvent()
      },
      changeMonth (date, num) {
        let dt = new Date(date)
        return new Date(dt.setMonth(dt.getMonth() + num))
      },
      dispatchEvent() {
        this.title = dateFunc.format(this.headDate, this.titleFormat, this.monthNames)

        let startDate = dateFunc.getStartDate(this.headDate)
        let curWeekDay = startDate.getDay()

        // 1st day of this monthView
        let diff = parseInt(this.firstDay) - curWeekDay
        if (diff) diff -= 7
        startDate.setDate(startDate.getDate() + diff) 

        // the month view is 6*7
        let endDate = dateFunc.changeDay(startDate, 41)

        // 1st day of current month
        let currentDate = dateFunc.getStartDate(this.headDate)

        this.$emit('change', 
          dateFunc.format(startDate, 'yyyy-MM-dd'),
          dateFunc.format(endDate, 'yyyy-MM-dd'),
          dateFunc.format(currentDate,'yyyy-MM-dd'),
          this.headDate
        )
      }
    }
  }
</script>
<style lang="less">
.full-calendar-header{
  display: flex;
  align-items: center;
  .header-left,.header-right{
    flex:1;
  }
  .header-center{
    flex:3;
    text-align:center;
    .title{
      margin: 0 10px;
      position: relative;
      bottom:9px;
    }
    .todayBtn{
      border:1px solid #ddd;
      border-radius: 5px;
      padding:5px 15px;
      cursor: pointer;
      position: relative;
      bottom:10px;
      margin-left:20px;
      &:hover{
        color:#20a0ff;
        border-color:#20a0ff;
      }
    }
    .prev-month,.next-month{
      cursor: pointer;
    }
    .next-month,.prev-month{
      width: 28px;
      height: 28px;
      display: inline-block;
      border: 1px solid #ccc;
      border-radius: 4px;
      position: relative;
      b{
        position: absolute;
        left: 50%;
        top: 50%;
        width: 0;
        height: 0;
        margin: -4px 0 0 -2px;
        overflow: hidden;
        border-width: 4px 4px 4px 0px;
        border-style: solid;
        border-color: transparent #000 transparent transparent;
        &.rt{
          border-width: 4px 0 4px 4px;
          border-color: transparent transparent transparent #000;
        }
      }
    }
    .prev-month:hover{
      border-color:#20a0ff;
      b{
        border-color:transparent #20a0ff transparent transparent;
      }
    }
    .next-month:hover{
      border-color:#20a0ff;
      b{
        border-color: transparent transparent transparent #20a0ff;
      }
    }
  }
}
</style>
