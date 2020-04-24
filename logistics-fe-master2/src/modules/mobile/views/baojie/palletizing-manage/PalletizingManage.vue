<template >
    <div class="palletizing-manage tabContent">
        <div class="add-new-btn">
            <el-button type="primary" @click="addBtn">新 增</el-button>
        </div>

        <div class="table-content" style="margin-top: 10px;">
            <el-table
                :data="tableData"
                style="width: 100%;"
                border
                v-loading='loading'>
                <el-table-column prop="crenelName" label="垛口号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="locsString" label="关联备货区" show-overflow-tooltip></el-table-column>
                <el-table-column label="垛口状态" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <el-switch
                            v-if='row.crenelStatus !== 20'
                            class="demo"
                            @change="switchChange(row)"
                            v-model="row.switchStatus"
                            active-text='启用'
                            inactive-text='停用'>
                        </el-switch>
                        <div v-else>作业中</div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align='center'>
                    <template slot-scope="scope">
                        <el-button @click="editBtn(scope.row)" type="text" size="small" v-if='scope.row.crenelStatus !== 20'>编辑</el-button>
                        <el-button @click="deleteBtn(scope.row)" type="text" size="small" v-if='scope.row.crenelStatus !== 20'>刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="table-pagination">
            <el-pagination
                class="is-background"
                :pager-count="5"
                :layout="pageConfig.layout"
                :total="pageConfig.total"
                :current-page="pageConfig.currentPage"
                :page-sizes="pageConfig.pageSizes"
                :page-size="pageConfig.pageSize"
                @size-change='sizeChange'
                @current-change='pageChange'>
            </el-pagination>
        </div>

        <!-- 新增与编辑弹框 -->
        <el-dialog
            :before-close='beforeClose'
            :closeOnClickModal='false'
            :title="title"
            :visible.sync="visible"
            width="30%">
            <el-form label-width="80px" :model="formData">
                <el-form-item label="垛口号">
                    <el-input v-model.trim="formData.crenelName"></el-input>
                </el-form-item>
                <el-form-item label="关联备货区">
                    <el-select v-model="formData.locCodes" multiple placeholder="请选择" style="width: 100%">
                        <el-option
                            v-for="item in locCodes"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="垛口状态">
                    <el-switch
                        class="demo"
                        v-model="formData.crenelStatus"
                        active-color="#00BCBF"
                        inactive-color="#CECECE"
                        active-text='启用'
                        inactive-text='停用'>
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="beforeClose">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import api from '@/modules/mobile/api/njdc/njdc.js';

export default {
    data() {
        return {
            visible: false,
            title: '',
            formData: { crenelName: '', locCodes: [], crenelStatus: false },
            loading: false,
            tableData: [],
            locCodes: [],
            pageConfig: {
                layout: 'total, sizes, prev, pager, next, jumper',
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                total: 0,
                currentPage: 1
            },
            searchParams: {},
            currentRow: {}
        };
    },
    methods: {
        beforeClose() {
            if (this.title === '编辑') {
                this.$confirm('你确定要取消编辑吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.visible = false;
                }).catch(() => {
                });
            } else {
                this.visible = false;
            }
        },
        switchChange(row) {
            const params = {};
            params.crenelStatus = row.switchStatus ? 30 : 0;
            params.crenelCode = row.crenelCode;
            params.version = row.version;
            params.method = 'put';
            this.loading = true;
            api.crenels(params).then(res => {
                this.loading = false;
                if (res) {
                    this.$message.success('状态切换成功');
                    this.getDataList(this.searchParams);
                } else {
                    row.switchStatus = !row.switchStatus;
                }
            }).catch(() => {
                row.switchStatus = !row.switchStatus;
                this.loading = false;
            });
        },
        sizeChange(data) {
            this.searchParams.pageSize = data;
            this.searchParams.pageNo = 1;
            this.getDataList(this.searchParams);
        },
        pageChange(data) {
            this.searchParams.pageNo = data;
            this.getDataList(this.searchParams);
        },
        addBtn() {
            this.getLocCodes();
            this.title = '新增';
            this.formData = { crenelName: '', locCodes: '', crenelStatus: true };
            this.visible = true;
        },
        deleteBtn(row) {
            api.crenels({ method: 'delete', crenelCode: row.crenelCode }).then(res => {
                if (res) {
                    this.$message.success('删除成功');
                    this.getDataList();
                }
            }).catch(() => {
            });
        },
        editBtn(row) {
            this.getLocCodes();
            this.title = '编辑';
            this.currentRow = row;
            const params = {};
            params.crenelName = row.crenelName;
            params.locCodes = row.locList.map(item => item.locCode);
            params.crenelStatus = !!row.crenelStatus;
            this.formData = params;
            this.visible = true;
        },
        confirm() {
            const params = Object.assign({}, this.formData);
            params.crenelStatus = params.crenelStatus ? 30 : 0; // 0=停用  30=启用
            params.crenelCode = this.currentRow.crenelCode || undefined;
            if (params.crenelCode) {
                params.method = 'put';
                params.version = this.currentRow.version;
                api.crenels(params).then(res => {
                    if (res) {
                        this.$message.success('修改成功');
                        this.visible = false;
                        this.getDataList();
                    }
                }).catch(() => {
                });
            } else {
                api.crenel(params).then(res => {
                    if (res) {
                        this.$message.success('新增成功');
                        this.visible = false;
                        this.getDataList();
                    }
                }).catch(() => {
                });
            }
            this.currentRow = {};
        },
        // 获取列表数据
        getDataList({ pageSize, pageNo } = { pageSize: 10, pageNo: 1 }) {
            const params = { pageSize, pageNo };
            this.searchParams = params;
            this.pageConfig.currentPage = pageNo;
            this.loading = true;

            params.method = 'get';
            api.crenels(params).then(res => {
                if (res) {
                    res.data.list.forEach(item => {
                        item.switchStatus = !!item.crenelStatus;
                        item.locsString = item.locList.map(item => item.locCode).join('，');
                    });
                    this.tableData = res.data.list;
                    this.pageConfig.total = res.data.totalCount;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        // 获取关联备货区
        getLocCodes() {
            api.crenelLoc().then(res => {
                if (res) {
                    this.locCodes = res.data.map(item => item.locCode);
                }
            }).catch(() => {
            });
        }
    },
    mounted() {
        // 获取列表数据
        this.getDataList();
    }
};
</script>
<style lang="less">
.palletizing-manage {

    .table-content {
        height: calc(100vh - 201px);
        overflow-y: auto;
    }
    .add-new-btn {
        text-align: right;
    }
}
</style>