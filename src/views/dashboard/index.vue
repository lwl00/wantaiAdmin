<template>
  <div class="dashboard-container">
    <el-row :gutter="30">
      <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="3" class="dashboard-aside">
        <el-menu
          unique-opened="true"
          default-active="2"
          class="brandAside"
          @open="handleOpen"
          @close="handleClose">
          <el-menu-item index="1" @click="handleChangeAllserie"><i class="el-icon-menu"></i> 全部系列</el-menu-item>
          <el-submenu
            v-for="(brandItem, brandIndex) in brandTreeData"
            :key="brandIndex"
            :index="(brandIndex+1+'')">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{brandItem.name}}</span>
            </template>
            <el-menu-item
              v-for="(serieItem, serieIndex) in brandItem.children"
              :key="serieIndex"
              :index="(brandIndex+'_'+serieIndex+1+'')"
              @click="handleChangeserie(serieItem)"
              >{{serieItem.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :xs="16" :sm="18" :md="20" :lg="20" :xl="21" class="dashboard-main">
        <!-- 查询条件 -->
        <section class="searchWarp">
          <div class="searchItem">
            <div class="searchItem_title">工艺</div>
            <div class="searchItem_main">
              <el-radio-group v-model="options.crafts">
                <el-radio
                  v-for="item in options.craftsOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                  size="mini"
                  @change="handleChangeRadio('crafts', $event)">
                  {{item.name}}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="searchItem">
            <div class="searchItem_title">分类</div>
            <div class="searchItem_main">
              <el-radio-group v-model="options.categorys">
                <el-radio
                  v-for="item in options.categorysOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                  size="mini"
                  @change="handleChangeRadio('categorys', $event)">
                  {{item.name}}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
        </section>

        <!-- 列表展示 -->
        <section class="showWarp">
          <!-- 网格模式 -->
          <div class="showTable" v-loading="table.tableLoading" v-if="table.tableData.length > 0">
            <el-row :gutter="15">
              <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4"
                v-for="(item, index) in table.tableData"
                :key="index">
                <div class="proItem">
                  <div class="imgWarp">
                    <el-image
                      class="proImg"
                      :src="item.imgMainSrc"
                      alt=""
                      fit="contain"
                      :preview-src-list="table.srcList"
                      lazy
                      ref="foo">
                    </el-image>
                  </div>
                  <div class="infoWarp">
                    <div class="name">
                      {{item.name}}
                    </div>
                    <div class="spec clear" v-if="item.specificationList.length > 0">
                      <div class="specText pull-left" :title="item.specificationList[0].size">{{item.specificationList[0].size}}</div>
                      <div class="specTextMore pull-right" @mouseenter="item.isShowProLayer = !item.isShowProLayer">更多规格</div>
                    </div>
                    <div class="price clear" v-if="item.specificationList.length > 0">
                      <div class="priceText pull-left">￥<span>{{item.specificationList[0].unitPrice}}</span></div>
                    </div>
                  </div>

                  <!-- 蒙层 -->
                  <div class="proLayer" v-show="item.isShowProLayer" @mouseleave="item.isShowProLayer = !item.isShowProLayer">
                    <div class="title">规格</div>
                    <dl v-for="(specItem, specIndex) in item.specificationList">
                      <dt>{{specItem.size}}</dt>
                      <dd>￥<span>{{specItem.unitPrice}}</span></dd>
                    </dl>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- 暂无商品 -->
          <div class="noDataWarp"  v-if="table.tableData.length == 0">
            暂无商品
          </div>

          <!-- 分页 -->
          <el-pagination
            class="wt_pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="table.pageNum"
            :page-sizes="[20, 50, 100]"
            :page-size="table.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="table.totalPage"
          ></el-pagination>
        </section>

      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { formatBrandTreeData, setlocalStorage } from 'common/js/dom';
  import { getDictsData, getBrandTree, getProductList } from 'api/interface';

  export default {
    name: 'Dashboard',
    computed: {
      ...mapGetters([
        'name',
        'roles',
        'device',
      ])
    },
    components: {

    },
    data() {
      return {
        brandTreeData: [],
        // options
        options: {
          crafts: '',
          craftsOptions: [],

          categorys: '',
          categorysOptions: [],
        },

        table: {
          srcList: [],
          tableData: [],
          totalPage: 20,
          pageSize: 20,
          pageNum: 1,
          tableLoading: false,
        },

        search: {
          name: '',
          number: '',
          brandId: '',
          seriesId: '',
          crafts: '',
          categorys: '',
          status: true,
          discount: false,
        },

      }
    },
    created() {
      setlocalStorage('brandId', '')
      setlocalStorage('seriesId', '')
      setlocalStorage('crafts', '')
      setlocalStorage('categorys', '')

      this._getDictsData()
      this._getBrandTree()
      this._getProductList(this.table.pageNum, this.table.pageSize);

    },
    methods: {
      // 数据字典
      _getDictsData: function () {
        // 工艺
        var paramsCraft = {
          isAll: true,
          code: 'Craft'
        }
        getDictsData(paramsCraft).then(res => {
          this.options.craftsOptions = res.data
        })
        // 分类
        var paramsCategory = {
          isAll: true,
          code: 'Category'
        }
        getDictsData(paramsCategory).then(res => {
          this.options.categorysOptions = res.data
        })
      },
      // 获取数据
      _getBrandTree() {
        var _this = this
        this.loading = true
        getBrandTree().then(res => {
          this.loading = false
          if (res.status == 200) {
            this.brandTreeData = formatBrandTreeData(res.data.brandList)
          }
        })
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      // 选择系列（查询数据）
      handleChangeserie(row) {
        setlocalStorage('brandId', row.brandId)
        setlocalStorage('seriesId', row.id)
        this._getProductList(this.table.pageNum, this.table.pageSize);
      },
      // 选择全部系列（查询数据）
      handleChangeAllserie() {
        setlocalStorage('brandId', '')
        setlocalStorage('seriesId', '')
        this._getProductList(this.table.pageNum, this.table.pageSize);
      },
      // 工艺/分类选择
      handleChangeRadio(type, val) {
        setlocalStorage(type, val)
        this._getProductList(this.table.pageNum, this.table.pageSize);
      },
      // 获取列表数据
      _getProductList: function (pageNum, pageSize) {
        var params = {
          name: localStorage.getItem('name') || '',
          number: localStorage.getItem('number') || '',
          brandId: localStorage.getItem('brandId') || '',
          seriesId: localStorage.getItem('seriesId') || '',
          crafts: localStorage.getItem('crafts') || '',
          categorys: localStorage.getItem('categorys') || '',
          status: true,
          discount: false,
          pageNum: pageNum,
          pageSize: pageSize,
        }

        this.table.tableLoading = true
        getProductList(params).then(res => {
          this.table.tableLoading = false
          this.loading = false
          if (res.status == 200) {
            this.table.srcList = []
            res.data.data.forEach((item, index) => {
              item.isShowProLayer = false
              if(!item.imgMain) {
                item.imgMainSrc = '/src/common/images/image.png'
              }
              this.table.srcList.push(item.imgMainSrc)
            })
            this.table.tableData = res.data.data
            this.table.totalPage = res.pageVO.total
          }
        })
      },

      // 每页显示条数
      handleSizeChange: function (val) {
        this.table.pageSize = val
        this._getProductList(this.table.pageNum, this.table.pageSize);
      },
      // 翻页
      handleCurrentChange: function (val) {
        this.table.pageNum = val
        this._getProductList(this.table.pageNum, this.table.pageSize);
      },
    }
  }
</script>
<style type="text/css" media="screen">
  .brandAside {
    border: 0;
  }
  .brandAside .el-menu {
    width: 100%;
  }
  .brandAside .el-menu .el-menu-item {
    width: 50%;
    height: 50px;
    line-height: 50px;
    min-width: auto;
    padding: 0 !important;
    text-align: center;
    float: left;
  }
  .brandAside .el-menu {
    background-color: #f5f5f5;
  }
  .brandAside>.el-menu-item {
    height: 35px;
    line-height: 35px;
    padding: 0 10px !important;
  }

  .brandAside .el-submenu .el-submenu__title {
    height: 35px;
    line-height: 35px;
    padding-left: 10px !important;
  }


  .dashboard-main .el-radio {
    margin: 0 0 0 13px;
    margin-bottom: 8px;
  }
  .dashboard-main .el-radio__inner {
    opacity: 0;
  }
  .dashboard-main .el-radio__label {
    padding: 0;
  }
  .el-image-viewer__close {
    top: 120px;
    color: #fff;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./element-variables.scss";
.dashboard {
  &-container {
    margin: 20px 30px;
  }
  &-aside {
    padding: 0px !important;
    background-color: #fff;
  }
  &-main {
    padding-right: 0 !important;
    // 搜素
    .searchWarp {
      background-color: #fff;
      padding: 5px 20px;
      .searchItem {
        display: flex;
        margin: 20px;
        .searchItem_title {
          width: 60px;
          font-size: 18px;
          font-weight: 500;
        }
        .searchItem_main {
          flex: 1;
          .el-radio-button {
          }


        }
      }
    }

    // 展示
    .showWarp {
      .showTable{
        background-color: #fff;
        margin-top: 20px;
        padding: 15px;

        .proItem:hover {
          box-shadow: 0 2px 12px 0 rgba(0,0,0,0.5);
        }
        .proItem {
          box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
          position: relative;
          margin-bottom: 15px;
          transition: 0.5s;
          background-color: #fff;
          // imgWarp
          .imgWarp {
            position: relative;
            min-height: 140px;
            .proImg {
              display: block;
              width: 100%;
            }
          }

          // infoWarp
          .infoWarp {
            padding: 12px;
            font-size: 14px;
            // line-height: 30px;
            color: $--color-text-regular;
            .name {
              font-size: 16px;
              color: $--color-text-primary;
              font-weight: bold;
              height: 25px;
              line-height: 25px;
              margin-bottom: 10px;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              line-clamp: 1;
              -webkit-box-orient: vertical;
            }
            .spec {
              display: flex;
              margin: 15px 0;
              .specText {
                flex: 1;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                line-clamp: 1;
                -webkit-box-orient: vertical;
              }
              .specTextMore {
                width: 60px;
                color: $--color-primary;
                cursor: pointer;
              }
            }
            .price {
              .priceText {
                color: $--color-primary;
                span {
                  font-size: 24px;
                  font-weight: bold;
                }
              }
              .priceBtn {

              }
            }
          }

          // proLayer
          .proLayer {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            padding: 30px 25px;
            font-size: 14px;
            .title {
              margin-bottom: 15px;
            }
            dl {
              overflow: hidden;
              margin-top: 8px;
              dt {
                float: left;
              }
              dd {
                float: right;
                color: $--color-primary;
                span {
                  font-weight: bold;
                }
              }
            }
          }
        }

      }

      /* 暂无数据 */
      .noDataWarp {
        padding: 50px 0;
        text-align: center;
        background-color: #fff;
        color: #999;
      }

      /* 分页 */
      .wt_pagination{
        padding: 0px 0 20px 0;
        text-align: center;
        background-color: #fff;
      }
    }

  }
}
</style>
