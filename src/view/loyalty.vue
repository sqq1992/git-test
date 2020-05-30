<template>
	<div class="m-content">
		<div class="m-content-main main_height">
			<h3 class="noPadding tips">
				销售中产品
			</h3>
		</div>
	</div>
</template>

<script>
	export default{
		data() {
			return{
				type: 'online'
			}
		},
		created(){
			this.$emit('navTextChange', '销售中产品');
		},
		components: {
		}
	}
</script>

<style lang="less" scoped>
</style>