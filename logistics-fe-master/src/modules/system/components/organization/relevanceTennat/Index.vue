<template>
    <div class="flex-layout">
        <list-layout>
            <div slot="header-search">
                <el-input v-model="SelectValue"
                          placeholder="搜索租户编码/名字"
                          class="select-input"
                          size="mini"></el-input>
                <el-button size="mini"
                           type="primary"
                           @click="_queryTenantsFromOrg">
                    搜索
                </el-button>
            </div>
            <div slot="header-button">
                <el-button size="mini"
                           type="primary"
                           @click="handleAdd">
                    <i class="el-icon-plus"></i>
                </el-button>
            </div>
            <el-table slot="list" :data="tableData"
                    border>
                <el-table-column prop="tenantName"
                                label="租户列表"
                                show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="tenantCode"
                                label="租户编码"
                                show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button @click="handleDelete(scope.row)"
                                type="text"
                                size="mini">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination slot="footer" class="text-right"
                   ref="aaa"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[10, 20, 30, 50, 100]"
                   :page-size="10"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
            </el-pagination>
        </list-layout>
        <AddGroup ref="addGroup"
                    :currentNode="currentNode"
                    @close="handleClose"
                    title="新增"
                    :visible="dialogVisible"
                    width="900px"/>
    </div>
</template>
<script>
import ListLayout from '@/components/lots/listLayout/Index';
import AddGroup from './AddGroup';
import { queryTenantsFromOrg, deleteTenantOrganizationByCodes } from '../../../api/Organization';
export default {
    components: {
        AddGroup, ListLayout
    },
    data() {
        return {
            SelectValue: '',
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            dialogVisible: false
        };
    },
    props: {
        currentNode: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    methods: {
        _queryTenantsFromOrg() {
            const { code } = this.currentNode;
            if (!code) {
                this.$message.error('请选中组织!');
                return false;
            }
            queryTenantsFromOrg({
                pageNo: this.currentPage,
                pageSize: this.pageSize,
                organizationCode: code,
                tenantFlag: 1,
                tenantCode: this.SelectValue
            }).then(res => {
                if (res && +res.code === 0) {
                    this.tableData = res.data.list;
                    this.total = res.data.totalCount;
                }
            });
        },
        _deleteTenantOrganizationByCodes(id) {
            const { code } = this.currentNode;
            deleteTenantOrganizationByCodes({
                organizationCode: code,
                tenantCode: id
            }).then(res => {
                if (res && +res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this._queryTenantsFromOrg();
                } else {
                    this.$message({
                        type: 'error',
                        message: '删除失败'
                    });
                }
            });
        },
        handleDelete(row) {
            this._deleteTenantOrganizationByCodes(row.tenantCode);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this._queryTenantsFromOrg();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this._queryTenantsFromOrg();
        },
        handleAdd() {
            const { code } = this.currentNode;
            if (!code) {
                this.$message.error('请选中组织!');
                return false;
            }
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.addGroup._queryTenantsFromOrg();
            });
        },
        handleClose() {
            this.dialogVisible = false;
            this._queryTenantsFromOrg();
        }
    },
    watch: {
        currentNode(newValue) {
            if (newValue.code) {
                this._queryTenantsFromOrg();
            }
        }
    }
};
</script>
