<template>
    <el-row :gutter="20" class="searchToolbar">
        <el-col :span="19">
            <el-form :inline="true" :model="search" ref="search" class="searchWarp" size="small">   
                优惠券明细            
                <el-form-item label="类型：" prop="ruleTypeValue">
                    <el-select v-model="search.ruleTypeValue" class="w150">
                        <el-option
                            v-for="item in search.ruleTypeData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="站点：" prop="siteValue">
                    <el-select v-model="search.siteValue" class="w100">
                        <el-option
                            v-for="item in search.siteData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>                        
                <el-form-item label="状态：" prop="enableValue">
                    <el-select v-model="search.enableValue" class="w100">
                        <el-option
                            v-for="item in search.enableData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>                        
                <el-form-item label="性质：" prop="ruleNatureValue">
                    <el-select v-model="search.ruleNatureValue" class="w100">
                        <el-option
                            v-for="item in search.ruleNatureData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>                        
                <el-form-item label="" prop="ruleDesc">
                    <el-input 
                        v-model="search.ruleDesc" 
                        placeholder="请输入规则说明" 
                        class="w150"
                        @keyup.enter.native="_getSearch"></el-input>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="_getSearch">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="resetSearchForm('search')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="5" class="todoWarp">
            <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="routerLinkPage('/integralRules/IntegralRulesAdd')">新增</el-button>
            <el-button type="primary" icon="el-icon-download" size="small" @click="_getExport">导出excel</el-button>
        </el-col>
    </el-row> 


</template>

<script type="text/ecmascript-6">
    import { getExport, getDictsData } from 'api/interface';
    export default {   
        name: "",    
        data() {
            return {
                search: {

                }
            }
        },
        created() {
            this._getDictsData()
            // this._getPointRule(this.table.pageNum, this.table.pageSize);
        },        
        methods: {
            // 查询数据字典
            _getDictsData: function() { 
                // 类型
                var paramsChangedState = {
                    isAll: true,
                    code: 'ChangedState'
                }                
                getDictsData(paramsChangedState).then(res=> {
                    // this.search.ruleTypeData = res.data
                }) 
            },
            // 获取数据
            _getPointRule: function(pageNum, pageSize) {
                // var params = {
                //     ruleType: this.search.ruleTypeValue,
                //     companyCode: this.search.siteValue,
                //     enable: this.search.enableValue,
                //     ruleNature: this.search.ruleNatureValue,
                //     ruleDesc: deleteBlankSpace(this.search.ruleDesc),
                //     pageNum: pageNum,
                //     pageSize: pageSize,
                //     export: false,
                //     nameStr: '',
                //     fieldStr: '',
                // }

                // this.table.tableLoading = true
                // getPointRule(params).then(res=> {
                //     this.table.tableLoading = false
                //     if(res.status == 200) {
                //         this.table.tableData = res.data
                //         this.table.totalPage = res.pageVO.total
                //     }
                // })
            },            
            // 查询条件重置
            resetSearchForm: function(formName) {
                this.$refs[formName].resetFields();
                // this._getPointRule(1, this.table.pageSize)
                this.$message('重置成功');
            },
            // 查询
            _getSearch: function() {
                // this._getPointRule(1, this.table.pageSize)
            },
            // 导出
            _getExport: function() {            
                    
            }

        } 
    }   
</script>

<style lang="scss" scoped>

</style>


