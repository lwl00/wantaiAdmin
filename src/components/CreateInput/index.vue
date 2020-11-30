<template>
  <!-- 暂时不用 -->
  <div class="createInput">
    <el-form :model="addGiftForm" ref="addGiftForm" :rules="rules" label-width="170px" class="" size="small">
123
      <div
        v-for="(item, index) in  createOptions"
        :key="index">
        <!-- select -->
        <el-form-item label="礼品类型：" required v-if="item.type=='select'">
          <!-- <el-select v-model="giftTypeValue" class="w180" @change="changeGiftTypeName">
            <el-option
              v-for="item in giftTypeData"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select> -->
        </el-form-item>

        <!-- input -->
        <el-form-item :label="item.title" :prop="item.field" v-if="item.type=='input'">
          <el-input
            v-model="item.defaultValue"
            placeholder="请填写"
            class="w400"
            maxlength="60"></el-input>
        </el-form-item>

      </div>

    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import Dialog from 'base/Dialog';

export default {
  components: {
    'dialogModel': Dialog,
  },
  name: "CreateInput",
  props: {
    //表单数据
    createOptions: {
      type: Array,
      default: null
    },
  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style>
</style>
