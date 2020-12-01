<template>
  <div>
    <BaseProductList :isDiscountPage="isDiscountPage"></BaseProductList>
  </div>

</template>

<script>

	import BaseProductList from '@/views/product/components/BaseProductList'
	export default {
	  components: {
	    BaseProductList,
	  },
	  name: "ProductDiscountList",
	  data() {
	    return {
        isDiscountPage: true,
      }
		}
	}

</script>

<style>
</style>
