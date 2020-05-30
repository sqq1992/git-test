<template>
    <div>
        <reward-temp :actType="actType"></reward-temp>
    </div>
</template>

<script>
import rewardTemp from './reward.vue';
export default {
    data(){
        return {
            actType: 'interaction'
        }
    },
    methods: {
        
    },
    components: {
        rewardTemp
    }
}
</script>
