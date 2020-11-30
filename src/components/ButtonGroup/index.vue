<template>
  <div class="button-warp">
    <el-button
      v-for="(item,i) in buttonList"
      :type="item.type"
      :key="i"
      :icon="item.icon"
      :class="item.class"
      :disabled="item.disabled"
      v-if="item.show"
      size="mini"
      @click.stop="click(item.click, item.name)"
      :loading="item.loading">{{item.text}}</el-button>
  </div>
</template>

<script>
  export default {
    name: 'ButtonGroup',
    props: {
      buttonList: {
        type: Array,
        default: null,
      },
    },
    created() {

    },
    methods: {
      click(a, name) {
        a ? a(name) : null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .button-warp {
    text-align: right;
  }
  .add-page-button-warp .button-warp {
    text-align: left;
  }
</style>
