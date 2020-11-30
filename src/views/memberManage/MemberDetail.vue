<template>
    <div class="app-container">
        <div class="filter-container">
            <el-row :gutter="20" class="searchToolbar">
                <el-col :span="24" class="todoWarp">
                    <el-button
                        type
                        size="small"
                        @click="dialogShow('editPointsDialog-model')"
                        v-if="isNORMAL"
                    >修改可用积分</el-button>
                    <el-button
                        :type="isNORMAL ? '': 'primary'"
                        size="small"
                        @click="dialogShow('pointsDialog-model')"
                    >{{isNORMAL ? '冻结': '解冻'}}可用积分</el-button>
                    <el-button
                        type
                        size="small"
                        @click="dialogShow('addPointBlackDialog-model')"
                        v-if="!isPointBlack"
                    >移入积分黑名单</el-button>
                    <el-button
                        type="primary"
                        size="small"
                        @click="dialogShow('delPointBlackDialog-model')"
                        v-if="isPointBlack"
                    >移出积分黑名单</el-button>
                    <!-- <el-button
                        type
                        size="small"
                        @click="dialogShow('addCouponsBlackDialog-model')"
                        v-if="!isCouponBlack"
                    >移入优惠券黑名单</el-button>-->
                </el-col>
            </el-row>

            <el-tabs type="border-card" v-model="activeTab">
                <el-tab-pane>
                    <span slot="label">
                        详细信息
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <!-- <div class="todoWarpTop">
                        <el-button type="primary" size="small" icon="el-icon-edit-outline">编辑</el-button>
                    </div>-->

                    <div class="baseDetailWarp">
                        <div class="baseDetailTitle">
                            <span>账号信息</span>
                        </div>
                        <el-form
                            :inline="true"
                            :model="baseDataDetail"
                            class="baseDataDetail"
                            label-width="170px"
                            size="small"
                        >
                            <el-form-item label="客户账号：">{{baseData.uid}}</el-form-item>
                            <el-form-item label="可用积分：">
                                <span class="mianColor">{{baseData.availableAmount}}</span>
                            </el-form-item>
                            <el-form-item label="客户名称：">{{baseData.customerName}}</el-form-item>
                            <el-form-item label="待入账积分：">
                                <span class="errorColor">{{baseData.disabledAmount}}</span>
                            </el-form-item>
                            <el-form-item label="客户类型：">{{baseData.customerGroupName}}</el-form-item>
                            <el-form-item label="即将过期清零积分：">{{baseData.expireThisYear}}</el-form-item>
                            <!-- <el-form-item label="使用状态：">{{baseData.memberLevelName}}</el-form-item> -->
                            <el-form-item label="历史获得积分：">{{baseData.historyGetAmount}}</el-form-item>
                            <el-form-item label="积分状态：">
                                <span class="errorColor">{{baseData.pointStateName}}</span>
                            </el-form-item>
                            <el-form-item label="已过期清零积分：">{{baseData.expireAmount}}</el-form-item>
                        </el-form>
                    </div>
                    <div class="baseDetailWarp">
                        <div class="baseDetailTitle">
                            <span>联系信息</span>
                        </div>
                        <el-form
                            :inline="true"
                            :model="baseDataDetail"
                            class="baseDataDetail"
                            label-width="170px"
                            size="small"
                        >
                            <el-form-item label="联系人：">{{baseDataDetail.contact}}</el-form-item>
                            <el-form-item label="QQ：">{{baseDataDetail.qq}}</el-form-item>
                            <el-form-item label="岗位：">{{baseDataDetail.jobs}}</el-form-item>
                            <el-form-item label="店庆日：">{{baseDataDetail.anniversary}}</el-form-item>
                            <el-form-item
                                label="temp"
                                v-for="(item, index) in baseDataDetail.secPhones"
                                :key="item"
                            >
                                <span slot="label" class>副手机号{{index+1}}：</span>
                                {{item}}
                            </el-form-item>

                            <el-form-item label="生日：">{{baseDataDetail.brithday}}</el-form-item>
                            <el-form-item label="微信号：">{{baseDataDetail.wechat}}</el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>

                <el-tab-pane name="AvailablePoints">
                    <span slot="label">
                        可用积分明细
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <keep-alive>
                        <availablePoints-detail
                            v-if="activeTab=='AvailablePoints'"
                            @updataBaseData="_getCustomerBase"
                            :isNORMAL="isNORMAL"
                        ></availablePoints-detail>
                    </keep-alive>
                </el-tab-pane>

                <el-tab-pane name="StayPoints">
                    <span slot="label">
                        待入账积分明细
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <keep-alive>
                        <stayPoints-detail v-if="activeTab=='StayPoints'"></stayPoints-detail>
                    </keep-alive>
                </el-tab-pane>

                <!-- <el-tab-pane name="Tickets">
                    <span slot="label">优惠券明细<i class="el-icon-arrow-down"></i></span>
                    <keep-alive>
                        <tickets-detail v-if="activeTab=='Tickets'"></tickets-detail>
                    </keep-alive>                    
                </el-tab-pane>-->

                <!-- <el-tab-pane name="Prize">
                    <span slot="label">
                        奖品信息
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <keep-alive>
                        <prize-detail v-if="activeTab=='Prize'"></prize-detail>
                    </keep-alive>
                </el-tab-pane>-->

                <el-tab-pane name="History">
                    <span slot="label">
                        修改历史
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <keep-alive>
                        <history-detail v-if="activeTab=='History'"></history-detail>
                    </keep-alive>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!--======== 以下是弹出层 ========-->
        <!-- 冻结/解冻积分points -->
        <dialogModel
            class="pointsDialog-model"
            ref="pointsDialog-model"
            :title="isNORMAL ? '冻结积分': '解冻积分'"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <div
                    class="warnWarp"
                >{{isNORMAL ? '冻结期间，客户不可使用积分，请补充冻结原因': '解冻积分后，客户可正常获得及使用其可用积分，请补充解冻原因'}}</div>
                <el-form
                    :inline="true"
                    :model="freezeOrRemoveData"
                    ref="freezeOrRemoveData"
                    :rules="rules"
                    class
                    size="small"
                    label-width="100px"
                >
                    <el-form-item
                        label="客户信息："
                        prop
                    >{{baseData.uid}} &nbsp;&nbsp; {{baseData.customerName}}</el-form-item>
                    <el-form-item label="可用积分：" prop>{{baseData.availableAmount}}</el-form-item>
                    <el-form-item label="待入账积分：" prop>{{baseData.disabledAmount}}</el-form-item>
                    <el-form-item label="temp" prop="pointsReason">
                        <span slot="label" class>{{isNORMAL ? '冻结': '解冻'}}原因：</span>
                        <el-input
                            minlength="1"
                            maxlength="50"
                            type="textarea"
                            rows="4"
                            v-model="freezeOrRemoveData.pointsReason"
                            placeholder="必填（50字内）"
                            class="w300"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="freezeOrRemove('freezeOrRemoveData')"
                    :loading="freezeOrRemoveLoading"
                >{{isNORMAL ? '冻结' : '解冻'}}</el-button>

                <el-button
                    size="small"
                    @click="dialogHideMeg('pointsDialog-model', isNORMAL ? '冻结': '解冻', 'freezeOrRemoveData')"
                >取消</el-button>
            </div>
        </dialogModel>

        <!-- 移入积分黑名单确认弹窗 -->
        <dialogModel
            class="addPointBlackDialog-model"
            ref="addPointBlackDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <el-form
                    :inline="true"
                    :model="blackReasonData"
                    ref="blackReasonData"
                    :rules="rules"
                    class
                    size="small"
                >
                    <div class="warnWarp">
                        是否确认将客户 {{baseData.uid}} &nbsp;&nbsp;
                        <span
                            class="errorColor"
                        >{{baseData.customerName}}</span>加入积分黑名单？
                    </div>
                    <div class="noteWarp">加入黑名单后，客户在客户端不可见所有积分系统相关的入口、图标、提示等所有展示，也不再参与积分的计算。</div>
                    <el-form-item label prop="addBlackReason">
                        <el-input
                            minlength="1"
                            maxlength="50"
                            type="textarea"
                            rows="4"
                            v-model="blackReasonData.addBlackReason"
                            placeholder="请备注黑名单原因（50字内）"
                            class="w400"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="addBlack('blackReasonData')"
                    :loading="addBlackLoading"
                >移入积分黑名单</el-button>
                <el-button
                    size="small"
                    @click="dialogHideMeg('addPointBlackDialog-model', '移入', 'blackReasonData')"
                >取消</el-button>
            </div>
        </dialogModel>

        <!-- 移入积分黑名单成功弹窗 -->
        <dialogModel
            class="addPointBlackSuccessDialog-model successDialog"
            ref="addPointBlackSuccessDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <div class="successNoteWarp">
                    客户
                    <b class="errorColor">{{baseData.uid}} &nbsp;{{baseData.customerName}}</b> 已成功加入积分黑名单，其客户信息不再在积分会员列表显示。但其历史积分记录仍然保存，如需查看请进入积分黑名单会员列表。
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('addPointBlackSuccessDialog-model')">知道了</el-button>
            </div>
        </dialogModel>

        <!-- 移出积分黑名单确认弹窗 -->
        <dialogModel
            class="delPointBlackDialog-model"
            ref="delPointBlackDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <div class="warnWarp">
                    是否确认将客户 {{baseData.uid}} &nbsp;&nbsp;
                    <span
                        class="errorColor"
                    >{{baseData.customerName}}</span>移出积分黑名单，恢复为积分会员？
                </div>
                <div class="noteWarp">移出黑名单后，客户在客户端可见所有积分系统相关的入口、图标、提示等所有展示，也可参与积分的计算。</div>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="delBlack"
                    :loading="delBlackLoading"
                >移出积分黑名单</el-button>
                <el-button
                    size="small"
                    @click="dialogHideMeg('delPointBlackDialog-model', '移出', 'blackReasonData')"
                >取消</el-button>
            </div>
        </dialogModel>

        <!-- 移出积分黑名单成功弹窗 -->
        <dialogModel
            class="delPointBlackSuccessDialog-model successDialog"
            ref="delPointBlackSuccessDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <div class="successNoteWarp">
                    客户
                    <b class="errorColor">{{baseData.uid}} &nbsp;{{baseData.customerName}}</b> 已成功移出积分黑名单，恢复为积分会员。其客户信息不再在积分黑名单会员列表显示。如需查看请进入积分会员列表。
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('delPointBlackSuccessDialog-model')">知道了</el-button>
            </div>
        </dialogModel>

        <!-- 移入优惠券黑名单确认弹窗 -->
        <dialogModel
            class="addCouponsBlackDialog-model"
            ref="addCouponsBlackDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <el-form
                    :inline="true"
                    :model="couponsReasonData"
                    ref="couponsReasonData"
                    :rules="rules"
                    class
                    size="small"
                >
                    <div class="warnWarp">
                        是否确认将客户 {{baseData.uid}} &nbsp;&nbsp;
                        <span
                            class="errorColor"
                        >{{baseData.customerName}}</span>加入黑名单，禁止其优惠券使用、获取功能？
                    </div>
                    <div class="noteWarp">加入优惠券黑名单后，客户将不可使用其原有的优惠券、也不可获得新优惠券。</div>
                    <el-form-item label prop="addCouponsReason">
                        <el-input
                            minlength="1"
                            maxlength="50"
                            type="textarea"
                            rows="4"
                            v-model="couponsReasonData.addCouponsReason"
                            placeholder="请备注黑名单原因（50字内）"
                            class="w400"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="addCoupons('couponsReasonData')"
                    :loading="addCouponsLoading"
                >移入优惠券黑名单</el-button>
                <el-button
                    size="small"
                    @click="dialogHideMeg('addCouponsBlackDialog-model', '移入', 'couponsReasonData')"
                >取消</el-button>
            </div>
        </dialogModel>

        <!-- 移入优惠券黑名单成功弹窗 -->
        <dialogModel
            class="addCouponsBlackSuccessDialog-model successDialog"
            ref="addCouponsBlackSuccessDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <div class="successNoteWarp">
                    客户
                    <b class="errorColor">{{baseData.uid}} &nbsp;{{baseData.customerName}}</b> 已成功加入优惠券黑名单，无法使用及获取优惠券。
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    size="small"
                    @click="dialogHide('addCouponsBlackSuccessDialog-model')"
                >知道了</el-button>
            </div>
        </dialogModel>

        <!-- 移出优惠券黑名单确认弹窗 -->
        <dialogModel
            class="delCouponsBlackDialog-model"
            ref="delCouponsBlackDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <div class="warnWarp">
                    是否确认将客户 {{baseData.uid}} &nbsp;&nbsp;
                    <span
                        class="errorColor"
                    >{{baseData.customerName}}</span>移出优惠券黑名单，恢复为起优惠券功能？
                </div>
                <div class="noteWarp">移出黑名单后，客户将可继续获得、使用优惠券，其原有优惠券也将按原有效期生效。</div>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="delCoupons"
                    :loading="delCouponsLoading"
                >移出优惠券黑名单</el-button>
                <el-button
                    size="small"
                    @click="dialogHideMeg('delCouponsBlackDialog-model', '移出', 'couponsReasonData')"
                >取消</el-button>
            </div>
        </dialogModel>

        <!-- 移出优惠券黑名单成功弹窗 -->
        <dialogModel
            class="delCouponsBlackSuccessDialog-model successDialog"
            ref="delCouponsBlackSuccessDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <div class="successNoteWarp">
                    客户
                    <b class="errorColor">{{baseData.uid}} &nbsp;{{baseData.customerName}}</b> 已成功移出优惠券黑名单，其优惠券已恢复正常使用。
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    size="small"
                    @click="dialogHide('delCouponsBlackSuccessDialog-model')"
                >知道了</el-button>
            </div>
        </dialogModel>

        <!-- 修改可用积分 -->
        <dialogModel
            class="editPointsDialog-model"
            ref="editPointsDialog-model"
            :title="dialog.dialogTitle"
            width="480"
        >
            <div class="dialog-model-content">
                <div class="noteWarp">积分修改后将立即生效，此修改明细也将在客户端展示，渠道为“系统修改”</div>
                <el-form
                    :inline="true"
                    :model="dialog"
                    ref="dialog"
                    :rules="rules"
                    class
                    size="small"
                    label-width="110px"
                >
                    <el-form-item
                        label="客户信息："
                        prop
                    >{{baseData.uid}} &nbsp;&nbsp; {{baseData.customerName}}</el-form-item>
                    <el-form-item label="当前可用积分：" prop>{{baseData.availableAmount}}</el-form-item>
                    <el-form-item label="修改积分值：" prop="points">
                        <el-input
                            v-model="dialog.points"
                            autocomplete="off"
                            placeholder="请输入整数，正数为加，负数为减"
                            class="w300"
                            @keyup.native="formatPoints(dialog.points)"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="修改后剩余积分：" prop>{{dialog.remainPoints}}</el-form-item>
                    <el-form-item label="修改原因：" prop="editPointsReason">
                        <el-input
                            minlength="1"
                            maxlength="50"
                            type="textarea"
                            rows="4"
                            v-model="dialog.editPointsReason"
                            placeholder="必填（50字内）"
                            class="w300"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-model-footer">
                <el-button type="primary" size="small" @click="save('dialog')">确定</el-button>
                <el-button size="small" @click="dialogHide('editPointsDialog-model')">取消</el-button>
            </div>
        </dialogModel>
    </div>
</template>

<script type="text/ecmascript-6">
import Dialog from 'base/Dialog';
import AvailablePointsDetail from '@/views/memberManage/AvailablePointsDetail';
import StayPointsDetail from '@/views/memberManage/StayPointsDetail';
import TicketsDetail from '@/views/memberManage/TicketsDetail';
import PrizeDetail from '@/views/memberManage/PrizeDetail';
import HistoryDetail from '@/views/memberManage/HistoryDetail';
import { getCustomerBase, customerOperate, customerPointEdit } from 'api/interface';
import { deleteBlankSpace, integer } from 'common/js/dom'

export default {
    components: {
        'dialogModel': Dialog,
        'availablePoints-detail': AvailablePointsDetail,
        'stayPoints-detail': StayPointsDetail,
        'tickets-detail': TicketsDetail,
        'prize-detail': PrizeDetail,
        'history-detail': HistoryDetail
    },
    name: "MemberDetail",
    data() {
        let validatePoints = (rule, value, callback) => {
            setTimeout(() => {
                if (value === '') {
                    callback(new Error('积分值不能为空'));
                } else if (value == '-') {
                    callback(new Error('请修改积分值'))
                } else {
                    callback()
                }
            }, 0)
        };
        return {
            loading: true,
            freezeOrRemoveLoading: false,  // 冻结/解冻
            addBlackLoading: false,  // 移入积分黑名单
            delBlackLoading: false,  // 移出积分黑名单
            addCouponsLoading: false,  // 移入积分优惠券黑名单
            delCouponsLoading: false,  // 移出积分优惠券黑名单
            activeTab: '',
            baseData: {}, // 基础信息
            baseDataDetail: {},  // 详细信息
            isNORMAL: null,             // 积分状态是否正常
            isPointBlack: null,         // 是否积分黑名单
            isCouponBlack: null,        // 是否优惠券黑名单
            dialog: {
                dialogWidth: '470px',
                dialogTitle: '提示',

                maxPoints: 200, // 修改最大积分
                points: 0, // 修改积分
                remainPoints: null, // 剩余积分
                editPointsReason: ''
            },
            freezeOrRemoveData: {
                pointsReason: '',       // 冻结/解冻原因
            },
            blackReasonData: {
                addBlackReason: '',     // 加入积分黑名单备注
            },
            couponsReasonData: {
                addCouponsReason: '',   // 加入优惠券黑名单备注
            },


            rules: {
                pointsReason: [
                    { required: true, message: '请完善原因', trigger: 'blur' }
                ],
                addBlackReason: [
                    { required: true, message: '请完善移入积分黑名单原因', trigger: 'blur' }
                ],
                addCouponsReason: [
                    { required: true, message: '请完善移入优惠券黑名单原因', trigger: 'blur' }
                ],
                points: [
                    { validator: validatePoints, trigger: 'blur' }
                ],
                editPointsReason: [
                    { required: true, message: '请完善原因', trigger: 'blur' }
                ],

            },
        }
    },
    created() {
        this._getCustomerBase(this.$route.query.uid)
    },
    methods: {
        // 获取数据
        _getCustomerBase: function (uid) {
            this.loading = true
            var params = {
                uid: this.$route.query.uid
            }
            getCustomerBase(params).then(res => {
                this.loading = false
                if (res.status == 200) {
                    this.baseData = res.data.customerInfo
                    if (res.data.data) {
                        this.baseDataDetail = res.data.data
                    }
                    // 积分状态是否正常
                    if (res.data.customerInfo.pointState == 'NORMAL') {
                        this.isNORMAL = true
                    } else {
                        this.isNORMAL = false
                    }
                    // 是否积分黑名单
                    if (res.data.customerInfo.pointBlack) {
                        this.isPointBlack = true
                    } else {
                        this.isPointBlack = false
                    }
                    // 是否优惠券黑名单
                    if (res.data.customerInfo.couponBlack) {
                        this.isCouponBlack = true
                    } else {
                        this.isCouponBlack = false
                    }

                    //修改可用积分
                    this.dialog.remainPoints = Number(this.baseData.availableAmount) + Number(this.dialog.points)
                }
            })
        },
        // 显示弹窗
        dialogShow: function (type) {
            this.$refs[type].showModel();
        },
        // 关闭弹窗
        dialogHideMeg: function (type, info, dialogData) {
            this.$refs[type].hideModel();
            this.$refs[dialogData].resetFields();
            this.$message('已取消' + info)
        },
        // 关闭弹窗
        dialogHide: function (type, info) {
            this.$refs[type].hideModel();
        },
        // 确定冻结/解冻
        freezeOrRemove: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        uid: this.baseData.uid,
                        remark: deleteBlankSpace(this.freezeOrRemoveData.pointsReason),
                    }
                    if (this.isNORMAL) {
                        params.customerOperate = 'FREEZE'
                    } else {
                        params.customerOperate = 'UNFREEZE'
                    }
                    this.freezeOrRemoveLoading = true
                    customerOperate(params).then(res => {
                        if (res.status == 200) {
                            this.$refs['pointsDialog-model'].hideModel();
                            this._getCustomerBase(this.$route.query.uid)
                            this.$refs['freezeOrRemoveData'].resetFields();
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'error'
                            })
                        }
                        this.freezeOrRemoveLoading = false
                    })
                } else {
                    this.$message({
                        message: '请完善信息',
                        type: 'warning'
                    })
                    return false;
                }
            });
        },
        // 移入黑名单
        addBlack: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        uid: this.baseData.uid,
                        customerOperate: 'JOINPOINTBLACK',
                        remark: deleteBlankSpace(this.blackReasonData.addBlackReason),
                    }
                    this.addBlackLoading = true
                    customerOperate(params).then(res => {
                        if (res.status == 200) {
                            this.$refs['addPointBlackDialog-model'].hideModel();
                            this.$refs['addPointBlackSuccessDialog-model'].showModel();
                            this._getCustomerBase(this.$route.query.uid)
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'error'
                            })
                        }
                        this.addBlackLoading = false
                    })
                } else {
                    this.$message({
                        message: '请完善信息',
                        type: 'warning'
                    })
                    return false;
                }
            });
        },
        // 移出黑名单
        delBlack: function () {
            var params = {
                uid: this.baseData.uid,
                customerOperate: 'REMOVEPOINTBLACK',
                remark: '',
            }
            this.delBlackLoading = true
            customerOperate(params).then(res => {
                if (res.status == 200) {
                    this.$refs['delPointBlackDialog-model'].hideModel();
                    this.$refs['delPointBlackSuccessDialog-model'].showModel();
                    this._getCustomerBase(this.$route.query.uid)
                }
                this.delBlackLoading = false
            })
        },
        // 移入优惠券黑名单
        addCoupons: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        uid: this.baseData.uid,
                        customerOperate: 'JOINCOUPONBLACK',
                        remark: deleteBlankSpace(this.couponsReasonData.addCouponsReason),
                    }
                    this.addCouponsLoading = true
                    customerOperate(params).then(res => {
                        if (res.status == 200) {
                            this.$refs['addCouponsBlackDialog-model'].hideModel();
                            this.$refs['addCouponsBlackSuccessDialog-model'].showModel();
                            this._getCustomerBase(this.$route.query.uid)
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'error'
                            })
                        }
                        this.addCouponsLoading = false
                    })
                } else {
                    this.$message({
                        message: '请完善信息',
                        type: 'warning'
                    })
                    return false;
                }
            });
        },
        // 移出黑名单
        delCoupons: function () {
            var params = {
                uid: this.baseData.uid,
                customerOperate: 'REMOVECOUPONBLACK',
                remark: '',
            }
            this.delCouponsLoading = true
            customerOperate(params).then(res => {
                if (res.status == 200) {
                    this.$refs['delCouponsBlackDialog-model'].hideModel();
                    this.$refs['delCouponsBlackSuccessDialog-model'].showModel();
                    this._getCustomerBase(this.$route.query.uid)
                } else {
                    this.$refs['delCouponsBlackDialog-model'].hideModel();
                    this.$message({
                        message: '请求失败',
                        type: 'error'
                    })
                    return false;
                }
                this.delCouponsLoading = false
            })
        },
        // 修改积分值取整数
        formatPoints: function (val) {
            var value = this.dialog.points = integer(val)
            var MathabsValue = Math.abs(value)  // 绝对值

            if (Number(value) < 0) {
                if (MathabsValue > this.baseData.availableAmount) {
                    this.$message({
                        type: 'error',
                        message: '最小为-' + this.baseData.availableAmount
                    });
                    this.dialog.points = -Number(this.baseData.availableAmount)
                }
            } else {
                if (Number(value) > this.dialog.maxPoints) {
                    this.$message({
                        type: 'error',
                        message: '最大为' + this.dialog.maxPoints
                    });
                    this.dialog.points = Number(this.dialog.maxPoints)
                }
            }

            this.dialog.remainPoints = Number(this.baseData.availableAmount) + Number(this.dialog.points)
        },
        // 编辑保存
        save: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        uid: this.baseData.uid,
                        amount: this.dialog.points,
                        remark: deleteBlankSpace(this.dialog.editPointsReason)
                    }

                    customerPointEdit(params).then(res => {
                        if (res.status == 200) {
                            this.$message({
                                message: '修改可用积分成功',
                                type: 'success'
                            })
                            this.$refs['editPointsDialog-model'].hideModel();
                            this.$refs['dialog'].resetFields();
                            this._getCustomerBase(this.$route.query.uid)
                        }
                    })
                } else {
                    this.$message({
                        message: '请完善信息',
                        type: 'warning'
                    })
                    return false;
                }
            });
        }
    }
}   
</script>

<style lang="scss" scoped>
.editPointsDialog-model {
    .el-form-item {
        display: block;
        margin-bottom: 5px;
        color: #666;
    }
    .noteWarp {
        color: #666;
        font-size: 12px;
        margin-bottom: 20px;
        line-height: 18px;
    }
}
.pointsDialog-model,
.addPointBlackDialog-model,
.delPointBlackDialog-model,
.addCouponsBlackDialog-model,
.delCouponsBlackDialog-model {
    .el-form-item {
        display: block;
        margin-bottom: 0;
        color: #666;
    }
    .warnWarp {
        color: #333;
        font-size: 18px;
        text-align: center;
        margin-bottom: 10px;
        font-weight: bold;
        line-height: 26px;
    }
    .noteWarp {
        color: #666;
        font-size: 12px;
        margin-bottom: 20px;
        line-height: 18px;
    }
}

.successDialog {
    .successNoteWarp {
        font-size: 14px;
        line-height: 20px;
    }
}

.searchToolbar {
    .searchWarp {
        .el-form-item {
            width: 45%;
            // width: 300px;
            // margin-bottom: 10px;
        }
    }
    .todoWarp {
        .el-button {
            margin-bottom: 10px;
        }
    }
}

.baseDetailWarp {
    margin-bottom: 15px;
    font-size: 12px !important;
    .baseDetailTitle {
        border-bottom: 1px solid #eee;
        text-align: left;
        margin-bottom: 15px;
        span {
            display: inline-block;
            font-size: 12px;
            color: #505d6b;
            background-color: #eee;
            padding: 6px 10px 3px 10px;
        }
    }
    .baseDataDetail {
        text-align: left;
        .el-form-item {
            width: 45%;
            margin-bottom: 5px;
        }
    }
}
</style>
<style type="text/css" media="screen">
.searchToolbar {
}
.searchToolbar .el-form-item__label {
    color: #9ca2ac;
    font-size: 13px;
}
.searchToolbar .el-form-item__content {
    color: #505d6b;
    font-size: 13px;
}

.baseDetailWarp {
}
.baseDetailWarp .el-form-item__label {
    color: #9ca2ac;
}
.baseDetailWarp .el-form-item__content {
    color: #505d6b;
}

.el-form-item__label,
.el-form-item__content {
    font-size: 12px;
}
</style>
