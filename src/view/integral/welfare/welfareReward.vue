<template>
    <div>
        <reward-temp :actType="actType"></reward-temp>
    </div>
</template>

<script>
import rewardTemp from '../interaction/reward.vue';
export default {
    data(){
        return {
            actType: 'welfare'
        }
    },
    methods: {
        
    },
    components: {
        rewardTemp
    }
}
</script>
