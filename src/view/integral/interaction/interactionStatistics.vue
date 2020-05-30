<template>
    <div>
        <statistics-temp :actType="actType"></statistics-temp>
    </div>
</template>

<script>
import statisticsTemp from './statistics.vue';
export default {
    data(){
        return {
            actType: 'interaction'
        }
    },
    methods: {
        
    },
    components: {
        statisticsTemp
    }
}
</script>

