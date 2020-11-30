<template>
    <div class="app-container">
        <div class="filter-container" v-loading="loading" style="padding-bottom:20px;">
            <el-row :gutter="20" class="searchToolbar">
                <el-col :span="24">
                    <div class="message">订单信息</div>
                    <span class="borderBottm"></span>
                    <el-form :inline="true" :model="search" ref class="searchWarp" size="small">
                        <el-form-item label="电商单号：" prop class="inforWidth">{{ordersDetail.code}}</el-form-item>
                        <el-form-item label="客户ID：" prop class="inforWidth">{{customer.uid}}</el-form-item>
                        <el-form-item
                            label="ERP单号："
                            prop
                            class="inforWidth"
                        >{{ordersDetail.erpCode}}</el-form-item>
                        <el-form-item
                            label="客户名称："
                            prop
                            class="inforWidth"
                        >{{customer.customerName}}</el-form-item>
                        <el-form-item
                            label="订单状态："
                            prop
                            class="inforWidth"
                        >{{ordersDetail.statusName}}</el-form-item>
                        <el-form-item label="收货联系人：" prop class="inforWidth">{{address.firstName}}</el-form-item>
                        <el-form-item label="订单积分：" prop class="inforWidth">{{ordersDetail.point}}</el-form-item>
                        <el-form-item label="收货联系电话：" prop class="inforWidth">{{address.phone}}</el-form-item>
                        <el-form-item
                            label="下单平台："
                            prop
                            class="inforWidth"
                        >{{ordersDetail.application}}</el-form-item>
                        <el-form-item label="收货地址：" prop class="inforWidth">{{address.streetName}}</el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="table-container">
                <el-col :span="24">
                    <div class="message">礼品信息</div>
                    <span class="borderBottm" style="margin-bottom: 20px;"></span>
                    <div class="cmyyTable" style="margin-bottom:40px;">
                        <Table :table="table" @dblclick="handleDblclick"></Table>
                    </div>
                </el-col>
                <el-col :span="24">
                    <div class="message">物流信息</div>
                    <span class="borderBottm" style="margin-bottom: 20px;"></span>
                    <div class="cmyyTable">
                        <Table :table="orderLogisTable" @dblclick="handleDblclick"></Table>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { onlineDateTime, todayEndTime, formatDate, dataToString, routerLinkPage } from 'common/js/dom';
import { getOrdersDetail, getGiftCode, getAddressCode } from 'api/interface';
import Table from '@/components/Table'

export default {
    components: {
        Table
    },
    name: "GiftOrdersDetail",
    data() {
        return {
            loading: false,
            search: {
                siteValue: '',
                orderStatus: '',
                application: '',

            },
            table: {
                title: [
                    {
                        label: '商品编号',
                        field: 'productCode',
                        type: 'link',
                        click: this.handleDblclick
                    },
                    {
                        label: '礼品描述',
                        field: 'giftName',
                    },
                    {
                        label: '规格',
                        field: 'giftSpecifications',
                    },
                    {
                        label: '厂牌',
                        field: 'giftEan',
                    },
                    {
                        label: '单位',
                        field: 'giftMinUnit',
                    },
                    {
                        label: '所需积分',
                        field: 'basePoint',
                    },
                    {
                        label: '兑换数量',
                        field: 'quantity',
                    },
                    {
                        label: '积分小计',
                        field: 'totalPoint',
                    },
                    {
                        label: '备注',
                        field: '',
                    }
                ],
                tableData: [],
                totalPage: 20,
                pageSize: 20,
                pageNum: 1,
                // tableLoading: false,
                tableHeight: '450px',
            },
            orderLogisTable: {
                title: [{
                    label: '时间',
                    field: 'creationDate',
                }, {
                    label: '物流详情',
                    field: 'info',
                }],
                tableData: [],
                totalPage: 20,
                pageSize: 20,
                pageNum: 1,
                // tableLoading: false,
                tableHeight: '450px',

            },
            tableData: {
                id: '',
            },
            ordersDetail: {
                code: '',
                erpCode: '',
                status: '',
                point: '',
                channelName: '',
                addressCode: ''
            },
            customer: {
                uid: '',
                customerName: '',
                cellphone: '',
            },
            giftId: '',
            address: {

            }
        }
    },
    created() {
        this._getOrdersDetail()
    },

    methods: {
        //获取用户列表
        _getOrdersDetail: function () {

            var params = {
                code: this.$route.query.code
            }

            this.table.tableLoading = true
            this.loading = true
            getOrdersDetail(params).then(res => {
                this.loading = false
                this.table.tableLoading = false
                if (res.status == 200 && res.data) {
                    this.ordersDetail = res.data
                    this.customer = res.data.customer
                    if (res.data.items) {
                        //组成自己所需字段
                        res.data.items.forEach(item => {
                            if (item.pointGiftVO.productCode) {
                                item.productCode = item.pointGiftVO.productCode
                            }
                            if (item.pointGiftVO.id) {
                                item.giftId = item.pointGiftVO.id
                            }
                            if (item.pointGiftVO.remark) {
                                item.giftName = item.pointGiftVO.remark
                            } else {
                                item.giftName = item.pointGiftVO.giftName
                            }
                            if (item.pointGiftVO.minUnit) {
                                item.giftMinUnit = item.pointGiftVO.minUnit
                            }
                            if (item.pointGiftVO.specifications) {
                                item.giftSpecifications = item.pointGiftVO.specifications
                            }
                            if (item.pointGiftVO.ean) {
                                item.giftEan = item.pointGiftVO.ean
                            }
                        });


                        this.table.tableData = res.data.items
                        this.orderLogisTable.tableData = res.data.orderLogis
                    }
                    if (this.ordersDetail.addressCode != null) {
                        this._getAddressCode()
                    }
                }
            })

        },
        //查询礼品ID
        _getGiftCode: function () {
            var params = {
                id: this.giftId
            }
            getGiftCode(params).then(res => {
                if (res.status == 200) {
                    this.table.tableData = [res.data]
                }
            })
        },
        //查询客户收货地址数据
        _getAddressCode: function () {
            var params = {
                addressCode: this.ordersDetail.addressCode
            }
            getAddressCode(params).then(res => {
                if (res.status == 200) {
                    this.address = res.data
                }
            })
        },
        //点击查询
        _getSearchUser: function () {
            this._getOrderList(this.table.pageNum, this.table.pageSize)
        },

        //分页序号
        getIndex: function (index) {
            return (this.table.pageNum - 1) * this.table.pageSize + index + 1
        },

        //转换时间值
        formatterDate: function (row, column) {
            var date = new Date(row.createdTime)
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        },
        //跳转到详情页
        handleDetail: function (index) {
            this.$router.push(index)
        },
        // 双击行
        handleDblclick(row) {
            let query = {
                id: row.giftId
            }
            routerLinkPage(this, 'IntegralGiftDetail', query)
        },
    }
}   
</script>

<style lang="scss" scoped>
.inforWidth {
    width: 48%;
}
.message {
    width: 96px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background-color: #909399;
}
.borderBottm {
    display: block;
    height: 1px;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 10px;
}
</style>
