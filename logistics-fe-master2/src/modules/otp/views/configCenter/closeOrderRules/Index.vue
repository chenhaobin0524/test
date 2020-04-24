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

        <limitDialog v-if="visible" :visible.sync='visible' :row="row" :readonly="readonly" @response="response"></limitDialog>
    </paper>
</template>

<script>
import paper from '@/components/core/paper/Paper';
import mPane from '@/components/otpPanel';
import limitDialog from './LimitDialog';
import config from './config.js';
import api from '@/modules/otp/api/closeOrderRules.js';

export default {
    components: { paper, mPane, limitDialog },
    data() {
        return {
            config,
            visible: false,
            loading: false,
            readonly: false,
            totalData: [],
            pageTotal: 0,
            checkedData: [], // 已选中数据
            row: {},
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            mustFillParams: { // 必有字段，编辑需要 有的字段接口可能没有返回 编辑会报错 所以手动补全
                businessMode: '',
                sourceSystem: '',
                orderSource: '',
                orderType: '',
                isNeedRelation: '',
                detail: '',
                zeroInClose: ''
            }
        };
    },
    methods: {
        response(row) {
            if (row.extendEntity.relation.orderType === '' && row.extendEntity.relation.isDelivery === '0') {
                row.isNeedRelation = '0';
            }
        },
        elementChange(data) { // 这个事件在编辑时，字段的值变化就会触发
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
            this.visible = true;
        },
        editdetailBtn(data) {
            this.row = data;
            this.readonly = false;
            this.visible = true;
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
                api.batchDeleteByBusinessKey(this.checkedData.map(item => item.id)).then(res => {
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
        // 新增一行返回事件
        addRowResponse(row) {
            row.extendEntity = {
                relation: {
                    orderType: '',
                    isDelivery: '0'
                },
                isNeedRelation: '0',
                zeroInClose: '0'
            };
        },
        saveBtn() {
            if (!this.checkedData.length) {
                this.$message({
                    type: 'warning',
                    message: '请选择需要保存的数据!'
                });
                return false;
            }
            // 表单校验
            const msg = this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData();
            if (!msg) {
                return false;
            }
            this.checkedData.forEach(item => {
                item.extendEntity.isNeedRelation = item.isNeedRelation;
                item.extendEntity.zeroInClose = item.zeroInClose;
            });

            api.batchCreateOrUpdate(this.checkedData).then(res => {
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
            api.closeRules(this.searchParams).then(res => {
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
                            obj.zeroInClose = obj.extendEntity.zeroInClose;
                            return obj;
                        });
                        this.pageTotal = res.data.totalCount;
                    }, 100);
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        }
    },
    mounted() {
        this.getDataList();
    }
};
</script>