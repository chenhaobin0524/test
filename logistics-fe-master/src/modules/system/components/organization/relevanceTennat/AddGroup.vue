<template>
    <Transfer :width="width"
                :titlename="title"
                :visible="visible"
                rowKey="id"
                :leftList="dialog.leftList"
                :leftLoading="dialog.leftLoading"
                @closeAdd="closeAdd"
                @saveWhiteList="saveDialog">
            <div slot="left-header">
                <el-input class="my-input" v-model='dialog.leftSelectValue' placeholder='请输入编码'></el-input>
                <el-button type="primary" size="mini" @click="() => {_queryTenantsFromOrg()}">查询</el-button>
            </div>
            <div slot="left-list">
                <el-table-column prop="tenantName"
                                label="租户列表"
                                show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="tenantCode"
                                label="租户编码"
                                show-overflow-tooltip>
                </el-table-column>
            </div>
            <div slot="left-footer">
                <el-pagination
                    @size-change="leftSizeChange"
                    :current-page.sync='dialog.leftCurrentPage'
                    @current-change="leftCurrentChange"
                    size="small"
                    layout='total, prev, pager, next'
                    :total='dialog.leftTotal'
                ></el-pagination>
            </div>
            <div slot="right-header">
                <div class="empty-slot"></div>
            </div>
            <div slot="right-list">
                <el-table-column prop="tenantName"
                                label="已选租户列表"
                                show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="tenantCode"
                                label="租户编码"
                                show-overflow-tooltip>
                </el-table-column>
            </div>
    </Transfer>
</template>
<script>
import Transfer from '@/components/lots/transfer/Index';
import { queryTenantsFromOrg, batchAddTenantOrganizations } from '../../../api/Organization';
export default {
    components: { Transfer },
    mounted() {
        // this._queryTenantsFromOrg();
    },
    data() {
        return {
            dialog: {
                leftSelectValue: '',
                rightSelectValue: '',
                leftLoading: false,
                leftList: [],
                leftCurrentPage: 1,
                leftPageSize: 10,
                leftTotal: 0,
                rightList: []
            }
        };
    },
    props: {
        currentNode: {
            type: Object,
            default: () => {
                return {};
            }
        },
        visible: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    },
    methods: {
        _batchAddTenantOrganizations(list) {
            const { code } = this.currentNode;
            const data = {
                orgCode: code,
                tenantCodes: list.map(item => item.tenantCode)
            };
            batchAddTenantOrganizations(data).then(res => {
                if (res && res.code === '0') {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.closeAdd();
                } else {
                    this.$message({
                        type: 'error',
                        message: '保存失败'
                    });
                }
            });
        },
        _queryTenantsFromOrg(currentPage = 1) {
            const { code } = this.currentNode;
            const parm = {
                pageNo: currentPage,
                pageSize: this.dialog.leftPageSize,
                organizationCode: code,
                tenantFlag: 0 // 查询租户在组织的标识,0标识不在(里面页的列表),1表示在(外面页的列表)
            };
            if (this.dialog.leftSelectValue.length) {
                parm['tenantCode'] = this.dialog.leftSelectValue;
            }
            this.dialog.leftLoading = true;
            queryTenantsFromOrg(parm).then(res => {
                if (res && +res.code === 0) {
                    const { list, totalCount } = res.data;
                    this.dialog.leftList = list;
                    this.dialog.leftTotal = totalCount;
                }
                this.dialog.leftLoading = false;
            });
        },
        selectionChange(selection) {
            this.dialog.rightList = selection;
        },
        leftSizeChange(val) {
            this.dialog.leftPageSize = val;
            this._queryTenantsFromOrg();
        },
        leftCurrentChange(val) {
            this.dialog.leftCurrentPage = val;
            this._queryTenantsFromOrg(val);
        },
        delDialogSelect(row) {
            for (let i = 0; i < this.dialog.leftList.length; i++) {
                if (this.dialog.leftList[i].id === row.id) {
                    this.$refs.multipleTable.toggleRowSelection(this.dialog.leftList[i]);
                    return;
                }
            }
            this.$refs.multipleTable.toggleRowSelection(row, false);
        },
        closeAdd() {
            this.dialog.leftSelectValue = '';
            this.dialog.rightSelectValue = '';
            this.dialog.leftList = [];
            this.dialog.leftCurrentPage = 1;
            this.dialog.leftPageSize = 10;
            this.dialog.leftTotal = 0;
            this.dialog.rightList = [];
            this.$emit('close');
        },
        saveDialog(list) {
            this._batchAddTenantOrganizations(list);
        }
    }
};
</script>
<style lang="less">
.add-laseholder {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    border: 1px solid #dbdbdb;
    .my-table-left,
    .my-table-right {
        width: 50%;
        padding: 15px;
        box-sizing: border-box;
    }
    .my-table-left {
        border-right: 1px solid #dbdb;
    }
}
</style>
