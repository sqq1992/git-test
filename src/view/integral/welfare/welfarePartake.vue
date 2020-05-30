<template>
    <div>
        <partake-temp :actType="actType"></partake-temp>
    </div>
</template>

<script>
import partakeTemp from '../interaction/partake.vue';
export default {
    data(){
        return {
            actType: 'welfare'
        }
    },
    methods: {
        
    },
    components: {
        partakeTemp
    }
}
</script>
