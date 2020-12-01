<template>
  <div>
    <BaseProductDetail :isDiscountPage="isDiscountPage"></BaseProductDetail>
  </div>

</template>

<script>

	import BaseProductDetail from '@/views/product/components/BaseProductDetail'
	export default {
	  components: {
	    BaseProductDetail,
	  },
	  name: "ProductNormalList",
	  data() {
	    return {
        isDiscountPage: true,
      }
		}
	}

</script>

<style>
</style>
