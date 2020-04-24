<template>
    <paper>
        <mPane
            ref="tablePage"
            :config="config"
            :loading="loading"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :currentPage="searchParams.pageNo"
            @searchChange="searchChange"
            @selectChange="selectChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            @detail-btn="detailBtn"
            @addRowResponse-btn="addRowResponse"
            @editdetail-btn="editdetailBtn"
            @element-change="elementChange"
            >

            <div slot='table-module-btn'>
                <el-tooltip effect="dark" content="新增" placement="bottom">
                    <el-button icon='el-icon-plus' size="mini" @click="addBtn"></el-button>
                </el-tooltip>
            </div>

            <div slot="page-module-btn">
                <span><el-button type="primary" @click="deleteBtn">删 除</el-button></span>
                <span style="margin-left: 10px;"><el-button type="primary" @click="saveBtn">保 存</el-button></span>
            </div>

        </mPane>
        <limit-dialog v-if="limitDialog" :visiableDialog.sync="limitDialog"
        @handleClose="handleClose" @response="response"
        :row="row" :readonly="readonly"></limit-dialog>
    </paper>
</template>

<script>
import paper from '@/components/core/paper/Paper';
import mPane from '@/components/otpPanel';
import limitDialog from './LimitDialog';
import config from './config.js';
import { deleteByIds, getList, batchCreateOrUpdate } from '@/modules/otp/api/writeOff';

export default {
    components: { paper, mPane, limitDialog },
    data() {
        return {
            config,
            loading: false,
            totalData: [],
            pageTotal: 0,
            checkedData: [], // 已选中数据
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            mustFillParams: {
                businessMode: '',
                sourceSystem: '',
                orderSource: '',
                orderType: '',
                isNeedRelation: '',
                detail: ''
            },
            readonly: false,
            limitDialog: false,
            row: {},
            relationData: {}
        };
    },
    methods: {
        response(row) {
            if (row.extendEntity.relation.orderType === '' && row.extendEntity.relation.isDelivery === '0') {
                row.isNeedRelation = '0';
            }
            this.limitDialog = false;
        },
        elementChange(data) {
            if (data.prop === 'isNeedRelation' && data.val === '1') {
                if (!(data.row.sourceSystem === 'CCS' && data.row.orderType === 'RRI')) {
                    this.$message.warning('只有CCS来源的拒收入库单才允许开启原出库单限制');
                    data.row.isNeedRelation = '0';
                    return false;
                }
                if (data.row.extendEntity.relation.orderType === '' && data.row.extendEntity.relation.isDelivery === '0') {
                    this.editdetailBtn(data.row);
                }
            }
        },
        detailBtn(data) {
            this.row = data;
            this.readonly = true;
            this.limitDialog = true;
        },
        editdetailBtn(data) {
            this.row = data;
            this.readonly = false;
            this.limitDialog = true;
        },
        deleteBtn() {
            if (!this.checkedData.length) {
                this.$message({
                    type: 'warning',
                    message: '请选择需要删除的数据!'
                });
                return false;
            }
            this.$confirm('您确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteByIds(this.checkedData.map(item => item.id)).then(res => {
                    if (res) {
                        this.$message.success('删除成功');
                        this.getDataList();
                    }
                }).catch(() => {});
            }).catch(() => {
            });
        },
        addBtn() {
            this.$refs.tablePage.$refs.table.addRow();
        },
        addRowResponse(row) {
            row.extendEntity = {
                relation: {
                    orderType: '',
                    isDelivery: '0'
                },
                isNeedRelation: '0'
            };
        },
        saveBtn() {
            if (!this.checkedData.length) {
                return this.$message.warning('请选择需要保存的数据!');
            }
            // 表单未选校验
            const msg = this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData();
            if (!msg) {
                return false;
            }
            let count = 0;
            const selectData = this.checkedData.map(item => {
                if (item.isNeedRelation === '1' && !item.extendEntity.relation.orderType) {
                    ++count;
                }
                item.extendEntity.isNeedRelation = item.isNeedRelation;
                const obj = item.id ? { id: item.id } : {};
                const { orderSource, businessMode, orderType, sourceSystem, version, extendEntity } = item;
                return { orderSource, businessMode, orderType, sourceSystem, version, extendEntity, ...obj };
            });
            if (count) {
                return this.$message.warning('存在原出库单限制开启状态，未选择原出库单订单类型的数据');
            }
            batchCreateOrUpdate(selectData).then(res => {
                if (res) {
                    this.$message.success('保存成功');
                    this.getDataList();
                }
            }).catch(() => {});
        },
        selectChange(data) {
            this.checkedData = data;
        },
        pageChange(pageNo) {
            this.searchParams.pageNo = pageNo;
            this.getDataList();
        },
        sizeChange(pageSize) {
            this.searchParams.pageNo = 1;
            this.searchParams.pageSize = pageSize;
            this.getDataList();
        },
        searchChange(data) {
            this.searchParams.pageNo = 1;
            this.searchParams = { ...this.searchParams,
                ...data
            };
            this.getDataList();
        },
        getDataList() {
            this.loading = true;
            getList(this.searchParams).then(res => {
                if (res) {
                    if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                        this.searchParams.pageNo = res.data.totalPage;
                        this.getDataList();
                        return false;
                    }
                    setTimeout(() => {
                        this.totalData = res.data.list.map(item => {
                            const obj = {
                                ...this.mustFillParams, ...item
                            };
                            obj.isNeedRelation = obj.extendEntity.isNeedRelation;
                            return obj;
                        });
                        this.pageTotal = res.data.totalCount;
                    }, 100);
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        handleClose() {
            this.limitDialog = false;
        }
    },
    mounted() {
        this.getDataList();
    }
};
</script>
