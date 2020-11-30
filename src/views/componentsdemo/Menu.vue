<template>
    <div class="wrapper">
        <div v-for="(item, $index1) in router">
            <!-- 有下级菜单 -->
            <el-submenu  :index="item.label" v-if="item.children.length > 0">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{item.name}}</span>
                </template>

                <!-- 递归操作 -->
                <Menu :router="item.children"></Menu>
            </el-submenu>

            <!-- 无下级菜单 -->
            <el-menu-item :index="item.label" v-else>
                <div class="draggableWarp" id="demo2">
                    <draggable :options="{group:'people',animation:150,ghostClass:'sortable-ghost',chosenClass:'chosenClass',scroll:true,scrollSensitivity:200}"
                      @change="change"
                      @start="start"
                      @end="end"
                      :move="move"
                      style="">
                        <i class="el-icon-menu"></i>
                        <span slot="title">{{item.name}}</span>
                    </draggable>
                </div>
            </el-menu-item>
        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable';

    export default {
        name: "Menu",
        props: {
            router: {
                type: Array, // Menu 组件接受一个 router 作为菜单数据
                default: []
            },
            routerr: {
                type: [Object, Array], // Menu 组件接受一个 menu 作为菜单数据
                default: ()=> {}
            }
        },
        components: {
            draggable,
        },
        data() {
            return {

            };
        },
        methods: {
            change() {
                this.$emit('change');
            },
            start() {
                this.$emit('start');
            },
            end() {
                this.$emit('end');
            },
            move() {
                this.$emit('move');
            },
        }
    };
</script>
