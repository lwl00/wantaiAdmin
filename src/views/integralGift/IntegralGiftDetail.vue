<template>
    <div class="app-container">
        <div class="filter-container" style="position:relative;">
            <div class="todoWarpTop">
                <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit-outline"
                    @click="handleEdit('/integralGift/IntegralGiftEdit')"
                    v-if="isEditPermission"
                >编辑礼品</el-button>
            </div>
            <el-tabs type="border-card" v-model="activeTab">
                <el-tab-pane>
                    <span slot="label">
                        详细信息
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <!-- 礼品基础信息 -->
                    <div class="giftCommonInfo">
                        <div class="message">礼品配置信息</div>
                        <span class="borderBottm"></span>
                        <el-form
                            label-width="120px"
                            class="datailForm"
                            size="small"
                            style="margin-top: 20px;"
                            v-loading="loading"
                        >
                            <el-form-item
                                label="商品编号："
                                size="small"
                                class="text-left"
                            >{{giftDetailData.productCode}}</el-form-item>
                            <el-form-item label="站点：" class="text-left">
                                <div
                                    class="text-left"
                                    style="display: inline-block;"
                                >{{giftDetailData.companyName}}</div>
                            </el-form-item>
                            <el-form-item
                                label="商品名称："
                                class="text-left"
                            >{{giftDetailData.productName}}</el-form-item>
                            <el-form-item
                                label="规格："
                                class="text-left"
                            >{{giftDetailData.specifications}}</el-form-item>
                            <el-form-item label="生产厂家：" class="text-left">{{giftDetailData.ean}}</el-form-item>
                            <el-form-item
                                label="小类："
                                class="text-left"
                                prop="realStock"
                            >{{giftDetailData.superCategories}}</el-form-item>
                            <el-form-item
                                label="经营范围："
                                class="text-left"
                            >{{giftDetailData.saleScope}}</el-form-item>
                            <el-form-item label="库存：" class="text-left" prop="price">
                                {{giftDetailData.realStock}}
                                <span
                                    class="routerLink mianColor"
                                    v-if="giftDetailData.realStock"
                                    @click="_getStocks"
                                    style="margin-left:10px;"
                                >刷新库存</span>
                            </el-form-item>
                            <el-form-item
                                label="电商线上标识："
                                class="text-left"
                                :class="giftDetailData.realOnlineFlag=='0'?'errorColor':''"
                            >{{giftDetailData.onlineFlagName}}</el-form-item>
                        </el-form>
                    </div>
                    <!-- 礼品配置信息 -->
                    <div class="giftInfo">
                        <div class="message">礼品配置信息</div>
                        <span class="borderBottm"></span>
                        <el-form
                            ref
                            label-width="120px"
                            class="datailForm"
                            size="small"
                            style="margin-top: 20px;"
                        >
                            <el-form-item label="积分商城礼品描述：">{{giftDetailData.remark}}</el-form-item>
                            <el-form-item label="所需积分：">{{giftDetailData.point}}</el-form-item>
                            <el-form-item label="商家状态：">{{giftDetailData.statusName}}</el-form-item>
                            <el-form-item label="礼品缩略图：">
                                <div class="giftImageSmall">
                                    <img class="imageSmall" :src="giftDetailData.imageSmall" alt />
                                </div>
                            </el-form-item>
                            <el-form-item label="礼品大图：">
                                <div class="giftImageSmall">
                                    <img class="imageSmall" :src="giftDetailData.image" alt />
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>

                <!-- 浏览记录 -->
                <el-tab-pane name="BrowsingHistory">
                    <span slot="label">
                        浏览记录
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <!-- :model="recordForm" ref="recordForm" -->
                    <keep-alive>
                        <browsing-history v-if="activeTab == 'BrowsingHistory'"></browsing-history>
                    </keep-alive>
                </el-tab-pane>

                <!-- 兑换记录 -->
                <el-tab-pane name="ForRecord">
                    <span slot="label">
                        兑换记录
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <keep-alive>
                        <for-record v-if="activeTab == 'ForRecord'"></for-record>
                    </keep-alive>
                </el-tab-pane>

                <!-- 修改历史 -->
                <el-tab-pane name="ModifyHistory" v-if="isOperationHistoryPermission">
                    <span slot="label">
                        修改历史
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <keep-alive>
                        <modify-history v-if="activeTab == 'ModifyHistory'"></modify-history>
                    </keep-alive>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { formatDateTimes, deleteBlankSpace } from 'common/js/dom';
import Dialog from 'base/Dialog';

import BrowsingHistory from '@/views/integralGift/BrowsingHistory';
import ForRecord from '@/views/integralGift/ForRecord';
import ModifyHistory from '@/views/integralGift/ModifyHistory';
import HistoryList from 'base/HistoryList';

import { getGiftCode, getApplyProductTypesView, getApplyUserTypesView, getDictsData, getStocks } from 'api/interface';
export default {
    components: {
        'browsing-history': BrowsingHistory,
        'for-record': ForRecord,
        'dialogModel': Dialog,
        'HistoryList': HistoryList,
        'ModifyHistory': ModifyHistory,
    },
    name: "IntegralGiftDetail",
    data() {
        return {
            giftDetailData: {},     //详情数据
            siteData: [],        //线上标识
            onlineData: [],     //线上标识

            loading: false,     //加载loading
            activeTab: '',
            giftApi: 'http://10.16.17.229/',    //缩略图礼品图接收的前缀 
            isAddPermission: false,  // 新增按钮权限
            isEditPermission: false,  // 编辑按钮权限
            isDeletePermission: false,  // 删除按钮权限  
            isOperationHistoryPermission: false,  // 操作历史tab权限
        }
    },
    created() {
        this._getDictsData()
        this.getPermissions()
        this._getGiftCode(this.$route.query.id)
    },
    methods: {
        // 加载数据字典
        _getDictsData: function () {
            //站点
            let siteData = {
                isAll: false,
                code: 'CompanyCode'
            }
            getDictsData(siteData).then(res => {
                if (res.status == 200) {
                    this.siteData = res.data
                }
            })
            //线上标识
            let onFlagData = {
                isAll: false,
                code: 'OnlineFlag'
            }
            getDictsData(onFlagData).then(res => {
                if (res.status == 200) {
                    this.onlineData = res.data
                }
            })
        },
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            var permissionsMenuArr = localStorage.getItem("permissionsMenu");
            if (permissionsBtnArr.includes("gift:pointGift:create")) {
                this.isAddPermission = true
            } else {
                this.isAddPermission = false
            }
            if (permissionsBtnArr.includes("gift:pointGift:update")) {
                this.isEditPermission = true
            } else {
                this.isEditPermission = false
            }
            if (permissionsBtnArr.includes("gift:pointGift:delete")) {
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
        //加载列表
        _getGiftCode: function (id) {
            var params = {
                id: id
            }
            this.loading = true
            getGiftCode(params).then(res => {
                if (res.status == 200) {
                    this.loading = false
                    if (res.data.pointProduct.status == '1') {
                        res.data.pointProduct.statusName = '已上架'
                    } else {
                        res.data.pointProduct.statusName = '已下架'
                    }
                    this.siteData.forEach(item => {
                        if (item.value == res.data.pointProduct.companyCode) {
                            res.data.pointProduct.companyName = item.name
                        }
                    })
                    this.onlineData.forEach(item => {
                        if (item.value == res.data.pointProduct.onlineFlag) {
                            res.data.pointProduct.onlineFlagName = item.name
                        }
                    })
                    res.data.pointProduct.specifications = res.data.product.specifications
                    res.data.pointProduct.saleScope = res.data.product.saleScope
                    res.data.pointProduct.superCategories = res.data.product.superCategories


                    this.giftDetailData = res.data.pointProduct
                }
            })
        },
        //刷新库存
        _getStocks: function () {
            let params = {
                productCode: this.giftDetailData.productCode,
                companyCode: this.giftDetailData.companyCode
            }
            console.log(params)
            getStocks(params).then(res => {
                if (res.status == 200) {
                    this.$message('刷新库存成功')
                    this.giftDetailData.realStock = res.data.realStock
                }
            })
        },
        // 返回上一层             
        back() {
            this.$router.go(-1);
        },
        //跳到编辑
        handleEdit: function (index) {
            this.$router.push({
                path: index,
                query: {
                    // giftCode: this.$route.query.giftCode,
                    id: this.$route.query.id
                }
            })
        },

    }
}   
</script>

<style lang="scss" scoped>
.todoWarpTop {
    position: absolute;
    top: 21px;
    right: 40px;
    z-index: 20;
}
.giftImageSmall {
    margin-left: 18px;
    margin-bottom: 9px;
    .imageSmall {
        width: 120px;
        height: 120px;
        border: 1px solid #e6e6e6;
    }
    span {
        display: inline-block;
        margin-top: 98px;
        margin-left: 10px;
        font-size: 12px;
        color: #606266;
        vertical-align: bottom;
    }
}
.giftInfo {
    margin-top: 30px;
}
.giftImage {
    float: left;
    width: 220px;
    text-align: center;
    margin-bottom: 10px;
    .images {
        width: 180px;
        height: 180px;
    }
    span {
        font-size: 12px;
        color: #606266;
    }
}
</style>
