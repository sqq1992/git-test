<template>
    <div>
        <act-list :actType="actType"></act-list>
    </div>
</template>

<script>
import actList from './actList.vue';
export default {
    data(){
        return {
            actType: 'interaction'
        }
    },
    methods: {
        
    },
    components: {
        actList
    }
}
</script>

