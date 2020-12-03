<template>
    <div class="search-warp">
        <el-collapse v-model="activeName" @change="handleChange">
            <el-collapse-item name="open" class="">
                <template slot="title">
                    <span>查询条件</span>
                    <div style="float: right;">
                        <ButtonGroup :buttonList="buttonList"></ButtonGroup>
                    </div>
                </template>

                <el-form
                    :inline="true"
                    :model="dynamicValidateForm"
                    ref="dynamicValidateForm"
                    class="searchWarp"
                    size="mini"
                    label-width="69px"
                >
                    <el-row :gutter="0" class="query">
                        <el-col
                            :xs="24"
                            :sm="(item.type == 'inputImport' || item.type === 'datetimerange') ? 24 : 12"
                            :md="(item.type == 'inputImport' || item.type === 'datetimerange') ? 24 : 12"
                            :lg="(item.type == 'inputImport' || item.type === 'datetimerange') ? 12 : 6"
                            :xl="(item.type == 'inputImport' || item.type === 'datetimerange') ? 8 : 4"
                            v-for="(item, index) in dynamicValidateForm.searchOptions"
                            :key="index + '_s'"
                            v-show="!item.hide"
                        >
                            <div v-if="item.scopedSlot">
                                <el-form-item :label="item.label">
                                    <slot :name="item.scopedSlot.customRender"></slot>
                                </el-form-item>
                            </div>

                            <div v-else>
                                <!-- 下拉框 -->
                                <el-form-item
                                    :label="item.label"
                                    v-if="item.type == 'select'"
                                    :prop="'searchOptions.' + index + '.value'"
                                >
                                    <el-select
                                        v-model="item.value"
                                        @change="handleSelect(item.handleSelect, item.field, $event)"
                                    >
                                        <el-option
                                            v-for="option in item.options"
                                            :key="option.value"
                                            :label="option.name"
                                            :value="option.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>

                                <!-- 角色 下拉框  -->
                                <el-form-item
                                    :label="item.label"
                                    v-if="item.type == 'selectRole'"
                                    :prop="'searchOptions.' + index + '.value'"
                                >
                                    <el-select
                                        v-model="item.value"
                                        @change="handleSelect(item.handleSelect, item.field, $event)"
                                    >
                                        <el-option
                                            v-for="option in item.options"
                                            :key="option.code"
                                            :label="option.name"
                                            :value="option.code"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>

                                <!-- 输入框 -->
                                <el-form-item
                                    :label="item.label"
                                    v-if="item.type == 'input'"
                                    :prop="'searchOptions.' + index + '.value'"
                                >
                                    <el-input
                                        v-model="item.value"
                                        :placeholder="'请输入'+item.label"
                                        @keyup.enter.native="handleSearch('dynamicValidateForm')"
                                    ></el-input>
                                </el-form-item>

                                <!-- 时间 -->
                                <el-form-item
                                    :label="item.label"
                                    v-if="item.type == 'datetimerange'"
                                    :prop="'searchOptions.' + index + '.value'"
                                >
                                    <el-date-picker
                                        v-model="item.value"
                                        type="datetimerange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :default-time="['00:00:00', '23:59:59']"
                                    ></el-date-picker>
                                </el-form-item>

                                <!-- 下拉选择输入框 -->
                                <el-form-item
                                    :label="item.label"
                                    v-if="item.type == 'selectWithInput'"
                                    :prop="'searchOptions.' + index + '.value'"
                                >
                                    <el-input
                                        :placeholder="'请输入'+item.placeholder"
                                        v-model="item.value[1]"
                                        class="input-with-select"
                                        @keyup.enter.native="handleSearch('dynamicValidateForm')"
                                    >
                                        <el-select
                                            v-model="item.value[0]"
                                            slot="prepend"
                                            @change="handleSelectWithInput(item, item.field, $event)"
                                        >
                                            <el-option
                                                v-for="option in item.options"
                                                :key="option.value"
                                                :label="option.name"
                                                :value="option.value"
                                            ></el-option>
                                        </el-select>
                                    </el-input>
                                </el-form-item>

                                <!-- 联动选择 -->
                                <el-form-item
                                  :label="item.label"
                                  v-if="item.type == 'cascader'"
                                  :prop="'searchOptions.' + index + '.value'"
                                >
                                    <el-cascader
                                        :placeholder="'请选择'+item.label"
                                        v-model="item.chooseOptions"
                                        :options="item.options"
                                        :props="{ checkStrictly: true }"
                                        clearable></el-cascader>
                                </el-form-item>

                            </div>
                        </el-col>
                    </el-row>

                    <el-row class="query-btn">
                        <el-button
                            type="primary"
                            size="mini"
                            @click="handleSearch('dynamicValidateForm')"
                        >查询</el-button>
                        <el-button size="mini" @click="handleReset('dynamicValidateForm')">重置</el-button>
                    </el-row>
                </el-form>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import ButtonGroup from '@/components/ButtonGroup'
import { formatSearch, deleteBlankSpace } from 'common/js/dom';
export default {
    name: 'Search',
    components: {
        ButtonGroup,
    },
    props: {
        buttonList: {
            type: Array,
            default: null,
        },
        searchOptions: {
            type: Array,
            default: null,
        },
    },
    data() {
        return {
            // 查询条件默认展开
            activeName: 'open',

            // 查询条件表单
            dynamicValidateForm: {
                searchOptions: this.searchOptions
            },

            isExcel: false,
        }
    },
    created() {

    },
    methods: {
        handleChange(val) {
            let flag = val[0] === 'open' ? true : false
            this.$emit('change', flag)
        },
        // 查询
        handleSearch(formName) {
            this.$emit('search', formatSearch(this.dynamicValidateForm.searchOptions))
        },
        // 查询-重置
        handleReset(formName) {
            this.$refs[formName].resetFields();

            this.$emit('reset', formatSearch(this.dynamicValidateForm.searchOptions))
        },
        // 下拉框
        handleSelect(ck, field, value) {
            ck ? ck(field, value) : null
        },
        // 下拉选择输入框
        handleSelectWithInput(item, field, value) {
            item.value[1] = ''
            item.placeholder = item.options.filter(item => item.value === value)[0].name
        },
    },
    watch: {
        dynamicValidateForm(newVal, oldVal) {
            console.log(newVal)
            console.log(oldVal)
        }
    }
}
</script>

<style lang="scss" scoped>
.search-warp {
    background-color: #fff;
    .el-collapse {
        padding: 0 15px;
        .query {
            padding-top: 15px;
            .el-col {
                height: 44px;
                .el-form-item--mini.el-form-item {
                    margin: 0;
                }
            }
        }
        .query-btn {
            padding: 5px 15px;
            font-size: 0;
            border-top: 1px solid #ebeef5;
            text-align: right;
        }
    }
}
</style>
<style>
.search-warp .el-collapse-item__header {
    display: block;
    height: 40px;
    line-height: 40px;
}
.search-warp .el-collapse-item__header.is-active {
    border-color: #ebeef5;
}
.search-warp .el-collapse-item__content {
    padding: 0;
}
.search-warp .el-collapse-item__header .el-collapse-item__arrow {
    float: initial;
}
.search-warp .el-form-item__label {
    padding-right: 5px;
    font-size: 12px;
}
.search-warp .el-input__inner {
    width: 163px;
}
.search-warp .input-with-select .el-input .el-input__inner {
    width: 100px;
}
.search-warp .el-date-editor--datetimerange.el-input__inner {
    width: auto;
}
.search-warp .el-upload-list {
    display: none;
}
.searchWarp_tooltip {
    max-width: 600px;
}
</style>
