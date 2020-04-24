<template>
    <div class="template-manage">
        <div class="temp-title">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="addTemp">新增</el-button>
        </div>
        <div class="temp-list">
            <el-table
                v-loading="false"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.3)"
                class="template-list"
                :data="tableData">

                <el-table-column
                  :render-header="renderHeader"
                  type="selection"
                  width="55">
                </el-table-column>

                <!--循环生成数据列------------------begin----------------------->
                <el-table-column
                  :sortable="th.sortable"
                  :fixed="th.fixed"
                  :min-width="th.minWidth"
                  :headerFilter="th.headerFilter"
                  fit="true"
                  v-for="(th,key) in tableHeaders"
                  :key="key"
                  :prop="th.prop"
                  :render-header="renderHeader"
                  :label="th.label">
                  <template slot-scope="scope">
                    <div v-if="!scope.row.editing">
                      <span>{{ scope.row[th.prop] | format(th.format) }}</span>
                    </div>
                    <div v-else>
                      <el-input v-model="scope.row[th.prop]" placeholder="th.placeholder"></el-input>
                    </div>
                    <div v-if="th.oper" class="operate-groups">
                        <div class="left-area">
                          <el-button
                            type="primary"
                            size="mini"
                            v-if="!scope.row.editing"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                          </el-button>
                          <el-button
                            type="primary"
                            size="mini"
                            v-if="scope.row.editing"
                            class="no-margin-left"
                            @click="handleSave(scope.$index, scope.row)">保存
                          </el-button>
                          <el-button
                            size="mini"
                            type="danger"
                            v-if="!scope.row.editing"
                            class="no-margin-left"
                            @click="handleDelete(scope.$index, scope.row)">删除
                          </el-button>
                          <el-button
                            class="no-margin-left"
                            size="mini"
                            type="warning"
                            v-if="scope.row.editing"
                            @click="handleCancel(scope.$index, scope.row)">取消
                          </el-button>
                        </div>
                        <div v-if="false" class="upAndDown">
                          <el-button
                            plain
                            class="up no-margin-left"
                            type="primary"
                            size="mini"
                            icon="el-icon-arrow-up"
                            @click="handleUp(scope.$index, scope.row)">
                          </el-button>
                          <el-button
                            plain
                            class="down no-margin-left"
                            type="primary"
                            size="mini"
                            icon="el-icon-arrow-down"
                            @click="handleDown(scope.$index, scope.row)">
                          </el-button>
                        </div>
                    </div>
                  </template>
                </el-table-column>
                <!--循环生成数据列------------------end---------------------------->
            </el-table>
        </div>
    </div>
</template>
<script>
import moment from 'moment';

const options = {
    filters: {
        dateFormat(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
            const formatStr = {
                date: 'YYYY-MM-DD',
                dateTime: 'YYYY-MM-DD HH:mm',
                shortDateTime: 'YY/MM/DD HH:mm',
                time: 'HH:mm'
            };
            return moment(dataStr).format(formatStr[pattern] ? formatStr[pattern] : pattern);
        }
    }
};
export default {
    data() {
        return {
            headerFilterNames: {}
        };
    },
    props: {
        tableData: {
            type: Array,
            default: function () {
                return [];
            }
        },
        tableHeaders: {
            type: Array,
            qdefault: function () {
                return [];
            }
        },
        loading: {
            type: Boolean,
            default: true
        },
        headerFilterCb: {
            type: Function,
            default: function() { }
        }
    },
    methods: {
        // 上下自由调整表格数据
        swapItems (arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        },
        handleUp ($index, row) {
            if ($index === 0) {
                return;
            }
            this.swapItems(this.tableData, $index, $index - 1);
        },
        handleDown ($index, row) {
            if ($index === this.tableData.length - 1) {
                return;
            };
            this.swapItems(this.tableData, $index, $index + 1);
        },
        // 编辑
        handleEdit ($index, row) {
            debugger;
            this.$set(this.tableData[$index], 'editing', true);
        },
        // 保存
        handleSave ($index, row) {
            this.$set(this.tableData[$index], 'editing', false);
            localStorage.setItem('tableData', JSON.stringify(this.tableData));
        },
        // 取消
        handleCancel ($index, row) {
            this.$set(this.tempList[$index], 'editing', false);
        },
        rowDblclick (row, event, column) {
        },
        // 新增一条模板数据
        addTemp () {
            debugger;
            this.tempList = this.tempList || [];
            this.tempList.push({
                name: '',
                pre: '',
                next: '',
                editing: true
            });
        },
        // 删除
        handleDelete ($index, row) {
            this.$confirm('此操作将永久删除该条模板, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tempList.splice($index, 1);
                localStorage.setItem('tempList', JSON.stringify(this.tempList));
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch((err) => {
                this.$message({
                    type: 'error',
                    message: err
                });
            });
        },
        renderHeader (h, data) {
            const header = this.$props.tableHeaders[data.$index - 1] || {};
            const isShowHeaderFilter = header.headerFilter;
            return (
                <span>
                    <el-input
                        value={this.headerFilterNames[header.prop]}
                        on-input={ (val) => { this.fetch(header.prop, val); } }
                        size="mini"
                        clsss={isShowHeaderFilter ? 'edit-table-input' : 'edit-table-input-hidden'}
                    ></el-input>
                    <br/>
                    <span class='data-column-lable'>{data.column.label}</span>
                </span>
            );
        },
        fetch(name, val) {
            this.$set(this.headerFilterNames, name, val);
            const params = {};
            params[name] = val;
            // TODO 可能有set的异步导致的bug
            this.$props.headerFilterCb(this.headerFilterNames);
        }
    },
    mounted () {
    },
    filters: {
        format(val, formation) {
            if (formation instanceof Function) {
                return formation(val);
            } else {
                // 内置过滤器
                const formatMethods = {
                    date: 'dateFormat',
                    dateTime: 'dateFormat',
                    shortDateTime: 'dateFormat',
                    time: 'dateFormat'
                };
                const formatMethodName = formatMethods[formation];
                return formatMethodName ? options.filters[formatMethodName](val, formation) : val;
            }
        }
    }
};
</script>
<style scoped lang="less">
.template-manage {
  width: 100%;
  margin: 0 auto;
  .temp-title {
    display: flex;
    justify-content: space-between;
    height: 30px;
    margin-top: 20px;
    over-flow: auto;
    .template-list{
        width: 100%;
    }
  }
  .el-table {
    background-color: #f7f7f7;
    margin-top: 20px;
    th>.cell {
      text-align: center !important;
   }
  }
  .operate-groups {
    display: flex;
    justify-content: flex-start;
    .left-area {
       display: flex;
       flex-direction: column;
    };
    .no-margin-left {
       margin-left: 0;
    };
    .upAndDown {
      display: flex;
      flex-direction: column;
      .el-button--mini {
        padding: 0;
        width: 30px;
        margin-left: 0;
      }
      .down {
        margin-top: 2px;
      }
    }
  }
  .edit-table-input {
      margin-bottom: -15px;
      margin-left: -10px;
      visibility: visible;
  }
  .edit-table-input-hidden {
      margin-bottom: -15px;
      margin-left: -10px;
      visibility: hidden;
  }
  .data-column-lable{
      height: 34px;
      display: inline-block;
      line-height: 34px;
  }
}
</style>