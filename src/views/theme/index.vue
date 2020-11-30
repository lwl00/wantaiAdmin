<template>
  <div class="app-container">
    <!-- <ButtonGroup :buttonList="buttonList"></ButtonGroup> -->
    <Search
      :searchOptions="searchOptions"
      :buttonList="buttonList"
      @search="handleSearch"
      @reset="handleReset">
        <template slot="instructionImage">
          <el-input
            v-model="instructionImageValue"
            placeholder="请输入"
            @keyup.enter.native="handleSearchEnter"></el-input>
        </template>
      </Search>

      <Table
        :table="table"
        @dblclick="handleDblclick">
        <template slot="slot1" slot-scope="chacao">
          {{table.tableData[0]}}
        </template>
      </Table>
  </div>
</template>

<script>
  import ButtonGroup from '@/components/ButtonGroup'
  import Search from '@/components/Search'
  import Table from '@/components/Table'
  import { today, dateTimeToStamp, deleteBlankSpace, positiveInteger, onlineDateTime, todayEndTime, formatSearch } from 'common/js/dom'
  export default {
    name: '',
    components: {
      ButtonGroup,
      Search,
      Table,
    },
    data() {
      return {
        buttonList: [
          {
            name: 'add',
            type: 'primary',
            icon: 'el-icon-circle-plus-outline',
            text: '新增',
            class: '',
            show: true,
            loading: false,
            click(e){},
          },
          {
            name: 'export',
            type: '',
            icon: 'el-icon-download',
            text: '导出',
            class: '',
            show: true,
            loading: false,
            click(e){},
          },
        ],
        searchOptions: [
          {
            label: '名称',
            field: 'sbuId',
            value: '默认值',
            type: 'input',
          },
          {
            label: '编号',
            field: 'code',
            value: '',
            type: 'input',
          },
          {
            label: '性别',
            field: 'six',
            value: '',
            type: 'select',
            options: [
              { name: '全部', value: '' },
              { name: '男', value: '0' },
              { name: '女', value: '1' },
            ],
            handleSelect: this.changeSix
          },
          {
            label: '时间',
            field: 'date',
            value: [ onlineDateTime(), todayEndTime() ],
            type: 'datetimerange',
            fields: ['startDate', 'etartDate'],
          },
          {
            label: '',
            field: 'selectInput',
            value: ['01', ''],
            type: 'selectWithInput',
            fields: ['codeType', 'codeValue'],
            options: [
              {name: '订单编码', value: '01'},
              {name: '客户ID', value: '02'},
              {name: '客户名称', value: '03'},
              {name: 'ERP编号', value: '04'},
            ],
            placeholder: '订单编码',
          },
          {
            label: '',
            field: 'selectInput',
            value: ['01', ''],
            type: 'selectWithInput',
            fields: ['codeType1', 'codeValue1'],
            options: [
              {name: '订单编码1', value: '01'},
              {name: '客户ID1', value: '02'},
              {name: '客户名称1', value: '03'},
              {name: 'ERP编号1', value: '04'},
            ],
            placeholder: '订单编码1',
          },
          {
            label: '说明书图片',
            field: 'instructionImage',
            scopedSlots: { customRender: 'instructionImage' },
            value: '111',
          },
        ],
        instructionImageValue: '',

        table: {
          title: [
            {
              label: '客户编码',
              field: 'uid',
              width: '100',
              link: true,
            },
            {
              label: '站点',
              field: 'companyName',
              width: '100',
              link: true,
            },
            {
              label: '站点编码',
              field: 'companyCode',
              width: '100',
              link: false,
            },
            {
              label: '状态',
              field: 'changedStateName',
              width: '100',
            },
            {
              label: '创建时间',
              field: 'createdTime',
              width: '300',
            },
            {
              label: '操作',
              field: '',
              width: '150',
              operat: true,
              options: [
                {name: '查看', type: 'view'},
                {name: '编辑', type: 'edit'},
                {name: '删除', type: 'delete'},
                {name: '禁用', type: 'disable'},
              ]
            },
            {
              label: '插槽',
              field: 'chacao',
              width: '300',
              scopedSlots: {
                customRender: 'chacao',
              }
            },
          ],
          tableData: [
            {
              changedStateName: "可用0",
              companyCode: "1000",
              companyName: "汕头",
              createdTime: "2020-06-04T09:41:38.000+0000",
              uid: "1054151000",
              id: 1,
            },
            {
              changedStateName: "可用1",
              companyCode: "",
              companyName: "汕头",
              createdTime: "2020-06-04T09:41:38.000+0000",
              uid: "1054151000",
              id: 2,
            },
            {
              changedStateName: "",
              companyCode: "1000",
              companyName: "汕头",
              createdTime: "2020-06-04T09:41:38.000+0000",
              uid: "1054151000",
              id: 3,
            },
            {
              changedStateName: "可用3",
              companyCode: "1000",
              companyName: "汕头",
              createdTime: "2020-06-04T09:41:38.000+0000",
              uid: "1054151000",
              id: 4,
            },
          ],
          totalPage: 20,
          pageSize: 20,
          pageNum: 1,
          tableLoading: false,
          tableHeight: '450px',
        },
      }
    },
    created() {
      this.instructionImageValue = this.searchOptions.filter(item => item.field === 'instructionImage')[0].value
    },
    methods: {
      // 查询
      handleSearch(e) {
        console.log('查询条件', e)
      },
      // 查询-重置
      handleReset(e) {
        console.log('查询-重置', e)
      },
      // 下拉选择
      changeSix(field, value) {
        console.log('key值', field)
        console.log('value值', value)
      },
      // scopedSlot输入框enter键
      handleSearchEnter() {
        console.log('查询条件1', formatSearch(this.searchOptions))
      },
      // 双击行
      handleDblclick(e) {
        console.log(e.id)
        // this.$router.push({
        //   name: 'EmployeeDetail',
        //   query: {
        //     id: e.row.id
        //   }
        // })
      }
    },
    watch: {
      instructionImageValue(newVal, oldVal) {
        this.searchOptions.filter(item => item.field === 'instructionImage')[0].value = newVal
      }
    }
  }
</script>

<style>
</style>
