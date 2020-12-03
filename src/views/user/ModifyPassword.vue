<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :model="modifyForm" :rules="rules" ref="modifyForm" label-width="100px" class="demo-ruleForm modifyWarp" size="small">
                <el-form-item label="原密码" prop="oldPassword">
                    <el-input
                        type="password"
                        v-model="modifyForm.oldPassword"
                        placeholder="请输入原登录密码"
                        maxlength="16"
                        minlength="6"
                        show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                    <el-input
                        type="password"
                        v-model="modifyForm.pass"
                        placeholder="请输入6位新登录密码"
                        autocomplete="off"
                        maxlength="16"
                        minlength="6"
                        show-password></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="checkPass">
                    <el-input
                        type="password"
                        v-model="modifyForm.checkPass"
                        placeholder="请再次6位输入新登录密码"
                        autocomplete="off"
                        maxlength="16"
                        minlength="6"
                        show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="submitForm('modifyForm')">保存</el-button>
                    <el-button
                        type=""
                        @click="resetForm('modifyForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { modifyPassword } from 'api/interface';
    import { getToken, setToken, removeToken, getCookiesUserName, setCookiesUserName, removeCookiesUserName } from '@/utils/auth'

    export default {
        name: '',
        data () {
            var checkOldPassword = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('原密码不能为空'));
                }else {
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('新密码不能为空'));
                }else if(value === this.modifyForm.oldPassword) {
                    callback(new Error('您输入的新旧密码一样'));
                }else {
                    if (this.modifyForm.checkPass !== '') {
                        this.$refs.modifyForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('确认新密码不能为空'));
                }else if (value !== this.modifyForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                }else {
                    callback();
                }
            };
            return {
                modifyForm: {
                    usersname: getCookiesUserName(),
                    oldPassword: '',
                    pass: '',
                    checkPass: ''
                },
                rules: {
                    oldPassword: [
                        { validator: checkOldPassword, trigger: 'blur' }
                    ],
                    pass: [
                        { validator: validatePass, trigger: 'blur' },
                        { pattern: /^[0-9a-zA-Z]+$/, message: '密码只能为数字或者英文',}
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' },
                        { pattern: /^[0-9a-zA-Z]+$/, message: '密码只能为数字或者英文',}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        var params = {
                            usersname: this.modifyForm.usersname,
                            currentPassword: this.modifyForm.oldPassword,
                            password: this.modifyForm.checkPass,
                        }
                        console.log(params)
                        modifyPassword(params).then(res => {
                            console.log(res)
                            if(res.status == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功'
                                });
                                this.$store.dispatch('LogOut').then(() => {
                                    this.$router.push('/login');
                                })
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: res.message
                                });
                            }
                        })

                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$message('修改密码已重置');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .filter-container {
        box-sizing: border-box;
        height: calc( 100vh - 210px);
        min-height: 600px;
        position: relative;
        .modifyWarp {
            box-sizing: border-box;
            width: 372px;
            height: 229px;
            padding: 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -114px;
            margin-left: -186px;
        }
    }
</style>
