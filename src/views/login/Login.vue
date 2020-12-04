<template>
    <div class="login" :style="note">
        <div class="containerWarp">
            <div class="container">
                <div class="loginImg pull-left">
                    <img src="~common/images/logo_login.png" />
                </div>
                <div class="loginMain pull-right">
                    <h2>
                        万泰产品管理系统后台
                        <br />
                        <span>Wantai management system background</span>
                    </h2>
                    <div class="formItem" style="padding-left: 55px;">
                        <span :class="isWarn ? 'warnWarp' : 'errorWarp'">{{errorMsg}}</span>
                    </div>
                    <div class="formItem">
                        <label>用户名：</label>
                        <el-input v-model="loginData.username" size="small" placeholder></el-input>
                    </div>
                    <div class="formItem">
                        <label>密&nbsp;&nbsp;&nbsp;码：</label>
                        <el-input
                            type="password"
                            v-model="loginData.password"
                            placeholder
                            size="small"
                            @keyup.enter.native="_login"
                        ></el-input>
                    </div>
                    <div class="formItem">
                        <label></label>
                        <el-checkbox v-model="keepMindPassword">记住密码</el-checkbox>
                    </div>
                    <div class="formItem">
                        <label></label>
                        <el-button
                            type="primary"
                            class="loginBtn"
                            @click="_login"
                            v-if="isLogin"
                            :loading="loading"
                        >登 录</el-button>
                        <el-button type="info" class="loginBtn" disabled v-else>登 录</el-button>
                    </div>
                </div>
            </div>
            <!-- <div class="icpText">
                <a
                    target="_blank"
                    href="http://www.beian.miit.gov.cn/"
                    style="color: #606266;margin-bottom:10px;"
                >粤ICP备05008078号</a>
                <p style="margin-top:6px;">Copyright © CHARMACY PHARMACEUTICAL CO., LTD.</p>
            </div> -->
        </div>
    </div>
</template>


<script type="text/ecmascript-6">
import Qs from 'qs'
import { setCookie, getCookie, clearCookie } from 'common/js/dom'
import { login } from 'api/interface'


export default {
    name: "login",
    data() {
        return {
            loading: false,
            errorMsg: '',
            isWarn: false,
            loginData: {
                username: '',
                password: ''
            },
            keepMindPassword: true,
            isLogin: false,
            note: {
                backgroundImage: "url(" + require("../../common/images/login_bg.jpg") + ")",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
            },
        }
    },
    created() {
        if (this.loginData.username != '' && this.loginData.password != '') {
            this.isLogin = true
        } else {
            this.isLogin = false
        }
        this.getlocalStorage()
    },
    methods: {
        _login: function () {
            if (this.loginData.username == '' || this.loginData.password == '') {
                this.$message({
                    message: '请输入账号或密码',
                    type: 'warning'
                });
            } else {
                if (this.keepMindPassword) {
                    this.setlocalStorage(this.loginData.username, this.loginData.password)
                } else {
                    this.setlocalStorage('', '')
                }

                var data = {
                    'username': this.loginData.username,
                    'password': this.loginData.password
                }
                this.loading = true
                this.$store.dispatch('Login', data).then(() => {
                    this.loading = false
                    this.$router.push({ path: this.redirect || '/' })
                }).catch(() => {
                    this.loading = false
                    console.log('error')
                })
            }
        },
        // 设置localStorage里存的用户名和密码
        setlocalStorage(name, pwd) {
            localStorage.siteName = name
            localStorage.sitePassword = pwd
        },
        // 获取localStorage里存入用户名和密码
        getlocalStorage: function () {
            if (localStorage.getItem('siteName')) {
                this.loginData.username = localStorage.getItem('siteName')
            }
            if (localStorage.getItem('sitePassword')) {
                this.loginData.password = localStorage.getItem('sitePassword')
            }
        }
    },
    watch: {
        loginData: {  // 监听对象值的改变
            handler(curVal, oldVal) {
                if (curVal.username != '' && curVal.password != '') {
                    this.isLogin = true
                } else {
                    this.isLogin = false
                    this.errorMsg = ''
                }

                if (curVal.username == '') {
                    this.loginData.password = ''
                }
            },
            deep: true,
        },
        keepMindPassword: function (curVal, oldVal) {  // 监听属性值得改变
            if (curVal) {
                this.errorMsg = '公共场所不建议记住密码，以防账号丢失'
                this.isWarn = true
                this.setlocalStorage(this.loginData.username, this.loginData.password)
            } else {
                this.isWarn = false
                this.errorMsg = ''
                this.setlocalStorage('', '')
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.login {
    width: 100%;
    height: 100%;
    .containerWarp {
        box-sizing: border-box;
        width: 606px;
        height: 317px;
        padding: 7px;
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 0.5);
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -303px;
        margin-top: -158px;
        .container {
            box-sizing: border-box;
            width: 592px;
            height: 303px;
            padding: 30px;
            border-radius: 4px;
            background-color: rgba(255, 255, 255, 0.8);
            .loginImg {
                height: 210px;
                margin-top: 16px;
                padding-right: 45px;
                border-right: 2px solid #ccc;
                img {
                    width: 105px;
                    height: 105px;
                    margin-top: 50px;
                    margin-left: 20px;
                }
            }
            .loginMain {
                width: 330px;
                h2 {
                    font-size: 22px;
                    span {
                        display: inline-block;
                        font-size: 12px;
                        color: #999;
                        position: relative;
                        top: -10px;
                    }
                }
                .formItem {
                    font-size: 12px;
                    margin-bottom: 10px;
                    label {
                        display: inline-block;
                        width: 50px;
                    }
                    .el-checkbox {
                        display: inline-block;
                        width: 205px;
                        text-align: left;
                    }
                    .errorWarp {
                        display: inline-block;
                        width: 220px;
                        text-align: left;
                        color: #ff3a32;
                        padding-left: 15px;
                        background: url(~common/images/error.png) no-repeat 0
                            center;
                    }
                    .warnWarp {
                        display: inline-block;
                        text-align: left;
                        color: #ff6700;
                        padding-left: 15px;
                        background: url(~common/images/warn.png) no-repeat 0
                            center;
                    }
                    .el-input {
                        width: auto;
                    }
                    .loginBtn {
                        width: 205px;
                        height: 34px;
                        line-height: 34px;
                        padding: 0;
                        border-radius: 18px;
                        -webkit-transition: all 0.2s linear;
                        -moz-transition: all 0.2s linear;
                        -ms-transition: all 0.2s linear;
                        -o-transition: all 0.2s linear;
                        transition: all 0.2s linear;
                    }
                }
            }
        }
        .icpText {
            text-align: center;
            margin-top: 20px;
            background: rgba(255, 255, 255, 0.6);
            color: #606266;
            border-radius: 4px;
            padding: 4px 0px;
        }
    }
}
</style>

<style type="text/css" media="screen">
.loginMain .el-input__inner:focus {
    box-shadow: 0 0 3px #00c4ff;
}
.loginMain .el-form-item__label,
.loginMain .el-checkbox__label {
    font-size: 12px;
}

.loginMain .el-input__inner {
    width: 205px;
    border-radius: 18px;
}
</style>