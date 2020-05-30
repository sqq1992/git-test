<template>
    <div>
        <statistics-temp :actType="actType"></statistics-temp>
    </div>
</template>

<script>
import statisticsTemp from '../interaction/statistics.vue';
export default {
    data(){
        return {
            actType: 'welfare'
        }
    },
    methods: {
        
    },
    components: {
        statisticsTemp
    }
}
</script>

