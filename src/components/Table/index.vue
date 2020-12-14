<template>
    <div class="cmyyTable">
        <el-table
            :data="table.tableData"
            highlight-current-row
            v-loading="table.tableLoading"
            :max-height="table.tableHeight"
            @cell-dblclick="dblclick"
            @selection-change="handleSelectionChange"
            :row-class-name="rowClassName"
        >
            <el-table-column
              type="selection"
              width="40"
              align="center">
            </el-table-column>
            <el-table-column type="index" :index="getIndex" width="40" align="center"></el-table-column>

            <el-table-column
                v-for="(item, index) in table.title"
                :key="index"
                :label="item.label"
                :property="item.field"
                :align="item.align ? item.align : 'center'"
                :width="item.width ? item.width : ''"
                :min-width="90"
                :fixed="item.type == 'operat' ? 'right' : ''"
            >
                <template slot-scope="{row}">
                    <!-- 链接 -->
                    <div v-if="item.type == 'link'">
                      <span
                        v-if="row[item.field] || row[item.field] == 0"
                        class="link"
                        @click="handleLink(item.click, row)"
                        >{{row[item.field]}}</span>
                      <span v-else>--</span>
                    </div>

                    <!-- radio是否 -->
                    <div v-else-if="item.type == 'radio'">
                      <span>{{row[item.field] ? '是' : '否'}}</span>
                    </div>

                    <!-- radioProductStatus产品上下架 -->
                    <div v-else-if="item.type == 'radioProductStatus'">
                      <span>{{row[item.field] ? '已上架' : '已下架'}}</span>
                    </div>

                    <!-- 时间 -->
                    <div v-else-if="item.type == 'dateTime'">
                        <span>{{formatterDate(row, item.field)}}</span>
                    </div>

                    <!-- 操作栏 -->
                    <div v-else-if="item.type == 'operat'">
                        <span
                            v-for="(option, optionIndex) in item.options"
                            v-if="option.type == 'gift'? (option.show && (row['categoryGiftCount'] > 0)) : option.show"
                            :key="optionIndex"
                            :class="['operatBtn', 'operatBtn_'+option.type]"
                            @click="handleOperat(option.click, row, option)"
                        >{{option.name}}</span>
                    </div>

                    <!-- Switch -->
                    <div v-else-if="item.type == 'operatSwitch'">
                        <el-switch
                            v-model="row[item.field]"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="handleSwitch(item.click, row, $event)"
                        ></el-switch>
                    </div>

                    <!-- image -->
                    <div v-else-if="item.type == 'image'">
                        <img v-if="row.imageUrl" :src="row.imageUrl" class="productAvatar">
                    </div>

                    <!-- 其他正常 -->
                    <div
                        v-else
                    >{{(row[item.field] || row[item.field] == 0) ? row[item.field] : '--'}}</div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { formatDateTimes, today, dateToStamp, deleteBlankSpace, formatSearch, calculateTableHeight } from 'common/js/dom';
export default {
    name: "Table",
    components: {},
    props: {
        table: {
            type: Object,
            default: null
        },
    },
    data() {
        return {

        }
    },
    computed: {

    },
    created() {

    },
    mounted() {

    },
    methods: {
        // 把每一行的索引放进row.row_index
        rowClassName({row, rowIndex}) {
            row.row_index = rowIndex+1;
        },
        // 分页序号
        getIndex: function (index) {
            return (this.table.pageNum - 1) * this.table.pageSize + index + 1
        },
        // 双击
        dblclick(e) {
            this.$emit('dblclick', e)
        },
        // 链接
        handleLink(cb, row) {
            cb ? cb(row) : null
        },
        // 操作栏
        handleOperat(cb, row, option) {
            console.log('点击行数据== ', row)
            console.log('按钮type== ', option.type)
            console.log('按钮name== ', option.name)
            // 【查看】按钮不做权限，直接调用双击行，跳转详情页
            if (option.type == 'view') {
                this.$emit('dblclick', row)
                return
            }
            // 【编辑】【删除】【禁用】回调方法，调用页面写接口逻辑
            cb ? cb(row, option) : null
        },
        // 格式化日期--有效日期
        formatterDate: function (e, field) {
            return formatDateTimes(e[field])
        },
        // Switch切换
        handleSwitch(cb, row, val) {
            cb ? cb(row, val) : null
        },
        // 多选
        handleSelectionChange(e) {
          this.$emit('handleSelectionChange', e)
        }
    }
}
</script>

<style lang="scss" scoped>
.cmyyTable {
    .link {
        color: #ff6633;
        cursor: pointer;
    }
    .link:hover {
        text-decoration: underline;
    }
    .operatBtn {
        margin: 0 2px;
        cursor: pointer;
        &_view {
            color: #ff6633;
        }
        &_update {
            color: #67c23a;
        }
        &_delete {
            color: #f56c6c;
        }
        &_disable {
            color: #f56c6c;
        }
        &_gift {
            color: #fe6900;
        }
    }
    .operatBtn:hover {
        text-decoration: underline;
    }
}
</style>
