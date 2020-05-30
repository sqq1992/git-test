<template>
    <div>
        <full-calendar :events="fcEvents" lang="zh" @dayClick="print" :eventUrl="eventUrl" @changeMonth="monthChange" ></full-calendar>
    </div>
</template>

<script>
    import fullCalendar from './fullCalendar/index'
    export default {
        name: 'marketingDate',
        components: {
            fullCalendar
        },
        data() {
            return {
                fcEvents: [],
                eventUrl:'getMarketingDateEvents'
            }
        },
        methods: {
            monthChange (month) {
                console.log(month)
            },
            print (day) {
                console.log(day)
            }
        }
    }
</script>

