<template>
	<view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
      onLoad(options){
          const eventChannel = this.getOpenerEventChannel();
          eventChannel.emit('callInPage', {data: 'data from test page'});
      }
	}
</script>

<style lang="scss">

</style>
