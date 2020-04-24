<template>
    <div class="geomagnetismManage tabContent">
        <el-row>
            <el-col :span='21'>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-select v-model="searchData.whCode" placeholder="仓库编码" @change='whCodeChange' clearable style="width: 100%">
                            <el-option
                                v-for="item in whCodeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-select v-model="searchData.crenelCode" placeholder="垛口号" clearable style="width: 100%">
                            <el-option
                                v-for="item in crenelOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-input v-model.trim='searchData.equipmentCode' placeholder='设备号' clearable></el-input>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-input v-model.trim='searchData.berthCode' placeholder='车位号' clearable></el-input>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <el-button type='primary' @click='queryBtn'>查 询</el-button>
                </el-col>
            </el-col>
        </el-row>

        <div class="table-content" style="margin-top: 10px;">
            <el-table
                :data="tableData"
                style="width: 100%;"
                border
                v-loading='loading'>
                <el-table-column prop="whCode" label="仓库编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="crenelName" label="垛口号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="equipmentCode" label="设备号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="berthCode" label="车位号" show-overflow-tooltip></el-table-column>
                <el-table-column fixed="right" label="操作" align='center'>
                    <template slot-scope="scope">
                        <el-button @click="editBtn(scope.row)" type="text" size="small">编辑</el-button>
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

        <!-- 编辑弹框 -->
        <el-dialog
            :before-close='beforeClose'
            :closeOnClickModal='false'
            title="编辑"
            :visible.sync="visible"
            width="30%">
            <el-form label-width="80px" :model="formData">
                <el-form-item label="仓库编码">
                    <el-select v-model="formData.whCode" placeholder="仓库编码" disabled style="width: 100%">
                        <el-option
                            v-for="item in whCodeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="垛口号">
                    <el-select v-model="formData.crenelCode" placeholder="垛口号" clearable style="width: 100%">
                        <el-option
                            v-for="item in editCrenelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备号">
                    <div v-html='formData.equipmentCode'></div>
                </el-form-item>
                <el-form-item label="车位号">
                    <div v-text='formData.berthCode'></div>
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
            editCrenelOptions: [],
            crenelOptions: [],
            whCodeOptions: [],
            formData: {},
            visible: false,
            pageConfig: {
                layout: 'total, sizes, prev, pager, next, jumper',
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                total: 0,
                currentPage: 1
            },
            loading: false,
            tableData: [],
            searchData: {
                whCode: '',
                crenelCode: '',
                equipmentCode: '',
                berthCode: ''
            },
            searchObj: {}
        };
    },
    methods: {
        getEditCrenel(whCode) {
            api.PGCrenels(whCode).then(res => {
                if (res) {
                    this.editCrenelOptions = res.data.list.map(item => ({ label: item.crenelName, value: item.crenelCode }));
                } else {
                    this.visible = false;
                }
            }).catch(() => {
                this.visible = false;
            });
        },
        // 获取仓库编码
        getwhCode() {
            api.PGCrenelsWhList().then(res => {
                if (res) {
                    this.whCodeOptions = res.data.map(item => ({ label: item, value: item }));
                }
            }).catch(() => {
            });
        },
        // 获取垛口号
        getCrenel(whCode) {
            api.PGCrenels(whCode).then(res => {
                if (res) {
                    this.crenelOptions = res.data.list.map(item => ({ label: item.crenelName, value: item.crenelCode }));
                }
            }).catch(() => {
            });
        },
        whCodeChange(data) {
            this.searchData.crenelCode = '';
            this.crenelOptions = [];
            if (data !== '') {
                this.getCrenel(data);
            }
        },
        beforeClose() {
            this.$confirm('你确定要取消编辑吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.visible = false;
            }).catch(() => {
            });
        },
        confirm() {
            this.editCrenelOptions.find(item => {
                if (item.value === this.formData.crenelCode) {
                    this.formData.crenelName = item.label;
                    return true;
                }
            });
            const { version, id, whCode, crenelCode, crenelName, equipmentCode, berthCode } = this.formData;
            api.mobileLocGeoRelations({ version, id, whCode, crenelCode, crenelName, equipmentCode, berthCode }).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                    this.visible = false;
                    this.getDataList(this.searchObj);
                }
            }).catch(() => {
            });
        },
        queryBtn() {
            this.searchObj = { ...this.searchObj, ...this.searchData };
            this.searchObj.pageNo = 1;
            this.getDataList(this.searchObj);
        },
        // 编辑按钮
        editBtn(row) {
            this.formData = Object.assign({}, row);
            this.visible = true;
            this.getEditCrenel(this.formData.whCode);
        },
        sizeChange(data) {
            this.searchObj.pageSize = data;
            this.searchObj.pageNo = 1;
            this.getDataList(this.searchObj);
        },
        pageChange(data) {
            this.searchObj.pageNo = data;
            this.getDataList(this.searchObj);
        },
        // 获取列表数据
        getDataList({ whCode, crenelCode, equipmentCode, berthCode, pageNo, pageSize } = { pageNo: 1, pageSize: 10 }) {
            const params = { whCode, crenelCode, equipmentCode, berthCode, pageNo, pageSize };
            this.searchObj = params;
            this.pageConfig.currentPage = pageNo;
            this.loading = true;
            api.mobileLocGeoRelationsList(params).then(res => {
                if (res) {
                    this.tableData = res.data.list;
                    this.pageConfig.total = res.data.totalCount;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        }
    },
    created () {
        // 获取列表数据
        this.getDataList();
        // 获取仓库编码
        this.getwhCode();
    }
};
</script>

<style lang="less">
.geomagnetismManage {

    .table-content {
        height: calc(100vh - 201px);
        overflow-y: auto;
    }
}
</style>
