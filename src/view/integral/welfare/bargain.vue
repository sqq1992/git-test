<template>
    <div>
        <welfare-temp :welfareParent="welfareParent"></welfare-temp>
    </div>
</template>

<script>
import http from 'src/api/index.js';
import welfareTemp from './welfare.vue';
export default {
    data(){
        return {
            welfareParent: {
                welfareType: 2,
                hsitoryUrl: ''
            }
        }
    },
    beforeRouteEnter(to, from, next){
		next(vm => {
			vm.welfareParent.hsitoryUrl = from.path;
		})
	},
    methods: {
        
    },
    components: {
        welfareTemp
    }
}
</script>

