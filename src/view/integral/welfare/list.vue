<template>
    <div>
        <act-list :actType="actType"></act-list>
    </div>
</template>

<script>
import actList from '../interaction/actList.vue';
export default {
    data(){
        return {
            actType: 'welfare'
        }
    },
    methods: {
        
    },
    components: {
        actList
    }
}
</script>