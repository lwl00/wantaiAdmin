<!-- 安装 npm i -S vuedraggable  -->
<template>
<div class="app-container">
    <h5>可拖动菜单</h5>
    <div class="">
        <el-menu
          default-active=""
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose">

            <Menu :router="menu" :routerr="demo1.list2" @change="change" @start="start" @end="end" @move="move"></Menu>
        </el-menu>
    </div>



        <div class="draggableWarp" id="demo1">
            <draggable :options="{group:'people',animation:150,ghostClass:'sortable-ghost',chosenClass:'chosenClass',scroll:true,scrollSensitivity:200}"
              v-model="demo1.list1"
              @change="change"
              @start="start"
              @end="end"
              :move="move"
              style="display: inline-block; width:190px;height: 200px;background: #eee;overflow: auto">
                <li v-for="(item, index) in demo1.list1"
                    :key="index">
                  {{item.name}}
                </li>
            </draggable>
        </div>


        <div class="draggableWarp" id="demo2">
            <draggable :options="{group:'people',animation:150,ghostClass:'sortable-ghost',chosenClass:'chosenClass',scroll:true,scrollSensitivity:200}"
              v-model="demo1.list2"
              @change="change"
              @start="start"
              @end="end"
              :move="move"
              style="display: inline-block; width:190px;height: 200px;background: #eee;overflow: auto">
                <li v-for="(item, index) in demo1.list2"
                    :key="index">
                  {{item.name}}
                </li>
            </draggable>
        </div>



    </div>
</template>

<script>
    import draggable from 'vuedraggable';
    import Menu from './Menu.vue';

    export default {
        components: {
            'draggable': draggable,
            'Menu': Menu,
        },
        name: "dndList",
        data() {
            return {
                demo1: {
                    list2: [],
                    list1: [
                        {index: '1', name: 'Join'},
                        {index: '2', name: '李四'},
                        {index: '3', name: 'LEL'},
                        {index: '4', name: '张三'},
                        {index: '5', name: '王五'},
                    ]
                },
                menu: [
                    {
                        id: 1,
                        name: '一级 1',
                        label: '1',
                        children: [
                            {id: 101, name: '二级 1-1', label: '1-1', children: []},
                            {
                                id: 102,
                                name: '二级 1-2',
                                label: '1-2',
                                children: [
                                    {id: 10201, name: '三级 1-2-1', label: '1-2-1', children: []},
                                    {id: 10202, name: '三级 1-2-2', label: '1-2-2', children: []},
                                ],
                            },
                            {
                                id: 103,
                                name: '二级 1-3',
                                label: '1-3',
                                children: [
                                    {id: 10301, name: '三级 1-3-1', label: '1-3-1', children: []},
                                    {id: 10302, name: '三级 1-3-2', label: '1-3-2', children: []},
                                    {id: 10303, name: '三级 1-3-3', label: '1-3-3', children: []},
                                ],
                            },
                        ]
                    }, {
                        id: 2,
                        name: '一级 2',
                        label: '2',
                        children: [
                            {id: 201, name: '二级 2-1', label: '2-1', children: []},
                            {id: 203, name: '二级 2-2', label: '2-2', children: []},
                        ]
                    }, {
                        id: 3,
                        name: '一级 3',
                        label: '3',
                        children: [
                            {id: 301, name: '二级 3-1', label: '3-1', children: []},
                            {id: 303, name: '二级 3-2', label: '3-2', children: []},
                        ]
                    },{
                        id: 4,
                        name: '一级 4',
                        label: ' 4',
                        children: []
                    },
                ],

            }
        },
        created() {

        },
        mounted() {

        },
        methods: {
            change() {},
            start() {},
            end() {},
            move() {},


            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        },
        watch: {

        }
    }
</script>

<style>
    .draggableWarp {
        border: 1px solid red;
    }
</style>
