<template>
    <el-dialog
      id="myDialog"
      :title="title"
      :visible.sync="centerDialogVisible"
      :width="width"
      top="20vh"
      left>
        <slot></slot>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: ''
            },
        },
        name: "",
        data () {
            return {
               centerDialogVisible: false,
            }
        },
        methods: {
            showModel: function() {
                this.centerDialogVisible = true
            },
            hideModel: function() {
                this.centerDialogVisible = false
            },
        }
    }
</script>

<style lang="scss">
    #myDialog {
        .el-dialog {
            border-radius: 5px;
            .el-dialog__header {
                height: 40px;
                line-height: 40px;
                padding: 0 15px;
                background-color: #59697b;
                text-align: left;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                .el-dialog__title {
                    color: #fff;
                    font-size: 14px;
                }
                .el-dialog__headerbtn {
                    top: 12px;
                    .el-dialog__close {
                        color: #fff;
                    }
                }
            }
            .el-dialog__body {
                padding: 20px 30px;
                .dialog-model-content {
                    margin-bottom: 20px;
                }
            }
        }

    }

</style>
