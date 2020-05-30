<template>
    <div>
        <partake-temp :actType="actType"></partake-temp>
    </div>
</template>

<script>
import partakeTemp from './partake.vue';
export default {
    data(){
        return {
            actType: 'interaction'
        }
    },
    methods: {
        
    },
    components: {
        partakeTemp
    }
}
</script>
