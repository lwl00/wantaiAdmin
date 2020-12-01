<template>
  <div>
    <BaseProductAdd :isDiscountPage="isDiscountPage"></BaseProductAdd>
  </div>

</template>

<script>

	import BaseProductAdd from '@/views/product/components/BaseProductAdd'
	export default {
	  components: {
	    BaseProductAdd,
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
