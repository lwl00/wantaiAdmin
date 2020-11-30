<template>
    <div class="app-container">
        <div class="filter-container" v-loading="loading">
            <el-tabs type="border-card" v-model="activeTab">
                <el-tab-pane>
                    <span slot="label">
                        详细信息
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <el-form ref label-width="110px" class="datailForm baseDatail" size="small">
                        <!-- 基础 -->
                        <el-form-item label="商品编号：">{{giftDetailData.productCode}}</el-form-item>
                        <el-form-item label="商品名称：">{{giftDetailData.productName}}</el-form-item>
                        <el-form-item label="规格：">{{giftDetailData.specifications}}</el-form-item>
                        <el-form-item label="厂家：">{{giftDetailData.ean}}</el-form-item>
                        <el-form-item label="小类：">{{giftDetailData.superCategories}}</el-form-item>
                        <el-form-item label="经营范围：">{{giftDetailData.saleScope}}</el-form-item>
                        <el-form-item label="积分礼品关联站点：">{{giftDetailData.releLocation}}</el-form-item>
                    </el-form>
                </el-tab-pane>
                <!-- <el-tab-pane name="HistoryList" v-if="isOperationHistoryPermission">
                    <span slot="label">
                        修改记录
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <keep-alive>
                        <HistoryList
                            v-if="activeTab=='HistoryList'"
                            :entity="history.entity"
                            :targetId="history.targetId"
                        ></HistoryList>
                    </keep-alive>
                </el-tab-pane>-->
            </el-tabs>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import Dialog from 'base/Dialog';
import HistoryList from 'base/HistoryList';
import { formatDateTimes } from 'common/js/dom';
import { getBaseGiftDetail, getApplyProductTypesView, getApplyUserTypesView } from 'api/interface';

export default {
    components: {
        'dialogModel': Dialog,
        'HistoryList': HistoryList,
    },
    name: "BaseGiftDetail",
    data() {
        return {
            loading: true,
            isDrug: false,
            isVouchers: true,
            activeTab: '',
            giftDetailData: {
            },

        }
    },
    created() {
        // this.getPermissions()
        this._getBaseGiftDetail(this.$route.query.id)
    },
    methods: {
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            var permissionsMenuArr = localStorage.getItem("permissionsMenu");
            if (permissionsBtnArr.includes("gift:gifts:create")) {
                this.isAddPermission = true
            } else {
                this.isAddPermission = false
            }
            if (permissionsBtnArr.includes("gift:gifts:update")) {
                this.isEditPermission = true
            } else {
                this.isEditPermission = false
            }
            if (permissionsBtnArr.includes("gift:gifts:delete")) {
                this.isDeletePermission = true
            } else {
                this.isDeletePermission = false
            }

            if (permissionsMenuArr.includes("system:operationRecords:read")) {
                this.isOperationHistoryPermission = true
            } else {
                this.isOperationHistoryPermission = false
            }
        },
        // 获取数据
        _getBaseGiftDetail: function (id) {
            var params = {
                id: id
            }
            this.loading = true
            getBaseGiftDetail(params).then(res => {
                this.loading = false
                console.log(res)
                if (res.status == 200) {
                    this.giftDetailData = res.data
                }
            })
        }
    }
}  
</script>

<style lang="scss" scoped>
</style>
