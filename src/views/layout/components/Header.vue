<template>
    <div class="container" id="headerWarp">
        <div class="logo">
            <router-link to="/dashboard">
                <img src="~common/images/logo.png" />
            </router-link>产品管理系统
        </div>
        <div class="userinfo">
            <span class>
                <i class="fa fa-user" aria-hidden="true"></i>
                {{name}}
            </span>
            <span class="userinfoItem" @click="modifypassword">
                <i class="fa fa-cog" aria-hidden="true"></i> 修改密码
            </span>
            <span class="userinfoItem" @click="_logout">
                <i class="fa fa-sign-out" aria-hidden="true"></i> 退出
            </span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getCookie } from 'common/js/dom';
import { logout } from 'api/interface';

export default {
    name: "headerWarp",
    computed: {
        ...mapGetters([
            'name',
            'roles'
        ])
    },
    data() {
        return {
            collapsed: false,
        }
    },
    methods: {
        //退出登录
        _logout: function () {
            var _this = this;
            _this.$confirm('确认退出吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('LogOut').then(() => {
                    _this.$router.push('/login');
                    location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                })
            }).catch(() => {
                console.log('取消退出')
            });
        },
        //折叠导航栏
        collapse: function () {
            this.collapsed = !this.collapsed;
        },
        modifypassword: function () {
            this.$router.push('/user/modifypassword');
        }
    }
}
</script>

<style lang="scss" scoped>
#headerWarp {
    position: fixed;
    top: 0px;
    bottom: 0px;
    z-index: 1999;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #332c2b;
    color: #fff;
    .userinfo {
        text-align: right;
        padding-right: 35px;
        float: right;
        .userinfoItem {
            cursor: pointer;
            margin-left: 30px;
            color: #fafafa;
        }

        .userinfo-inner {
            cursor: pointer;
            color: #fff;
            img {
                width: 40px;
                height: 40px;
                border-radius: 20px;
                margin: 20px 0px 20px 10px;
                float: right;
            }
        }
    }
    .logo {
        height: 60px;
        font-size: 22px;
        line-height: 78px;
        padding-left: 20px;
        padding-right: 20px;
        text-align: left;
        float: left;
        img {
            display: inline-block;
            vertical-align: top;
            height: 38px;
            margin: 11px 21px;
        }
        .txt {
            color: #fff;
        }
    }
    .tools {
        padding: 0px 23px;
        width: 14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
    }
}
</style>
