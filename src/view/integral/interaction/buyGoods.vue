<template>
    <div>
        <goods-temp :goodsType="goodsType"></goods-temp>
    </div>
</template>

<script>
import http from 'src/api/index.js';
import goodsTemp from './goods.vue';
export default {
    data(){
        return {
            goodsType: 2
        }
    },
    methods: {
        
    },
    components: {
        goodsTemp
    }
}
</script>

