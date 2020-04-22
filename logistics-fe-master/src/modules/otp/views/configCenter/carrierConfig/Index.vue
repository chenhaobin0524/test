<template>
    <paper>
        <mPane
            ref="tablePage"
            :config="config"
            :searchTotalTitle="config.searchTotalTitle"
            :loading="loading"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :currentPage="searchParams.pageNo"
            @searchChange="searchChange"
            @selectChange="selectChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange">

            <div slot='table-module-btn'>
                <el-tooltip effect="dark" content="新增" placement="bottom">
                    <el-button icon='el-icon-plus' size="mini" @click="addBtn"></el-button>
                </el-tooltip>
                <el-tooltip effect='dark' content='导出' placement='bottom'>
                    <el-button icon='el-icon-download' size='mini' @click='downLoad'></el-button>
                </el-tooltip>
                <el-tooltip effect='dark' content='导入' placement='bottom'>
                    <el-button icon='el-icon-upload2' size='mini' @click='uploadVisible = true'></el-button>
                </el-tooltip>
            </div>

            <div slot="page-module-btn">
                <span><el-button type="primary" @click="deleteBtn">删 除</el-button></span>
                <span style="margin-left: 10px;"><el-button type="primary" @click="saveBtn">保 存</el-button></span>
            </div>

        </mPane>
        <!-- 文件上传 -->
        <upload :uploadShow.sync='uploadVisible' v-if='uploadVisible' @refreshList='getDataList'></upload>
    </paper>
</template>

<script>
import paper from '@/components/core/paper/Paper';
import mPane from '@/components/otpPanel';
import config from './config.js';
import upload from './upload.vue';
import api from '@/modules/otp/api/carrierConfig.js';
import { carrierConfig } from '@/modules/otp/api/export.js';

export default {
    components: { paper, mPane, upload },
    data() {
        return {
            config,
            loading: false,
            totalData: [],
            pageTotal: 0,
            checkedData: [], // 已选中数据
            uploadVisible: false,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            mustFillParams: { // 必有字段，编辑需要
                whName: '',
                senderCode: '',
                receiverCode: '',
                orderType: '',
                carrierName: '',
                sourceSystem: '',
                customerName: '',
                scPosFlag: '',
                configStatus: ''
            }
        };
    },
    methods: {
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
                api.deleteByIds(this.checkedData.map(item => item.id)).then(res => {
                    if (res) {
                        this.$message.success('删除成功');
                        this.getDataList();
                    }
                }).catch(() => {});
            }).catch(() => {
            });
        },
        addBtn() {
            // 表格新增方法
            this.$refs.tablePage.$refs.table.addRow();
        },
        saveBtn() {
            if (!this.checkedData.length) {
                this.$message({
                    type: 'warning',
                    message: '请选择需要保存的数据!'
                });
                return false;
            }
            // 表单未选校验
            const msg = this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData();
            if (!msg) {
                return false;
            }
            this.checkedData.forEach(item => {
                if (item.senderCode instanceof Array) {
                    item.senderCode = item.senderCode.pop();
                    item.senderName = item.senderName.split(' / ').pop();
                }
                if (item.receiverCode instanceof Array) {
                    item.receiverCode = item.receiverCode.pop();
                    item.receiverName = item.receiverName.split(' / ').pop();
                }
            });
            api.saveOrUpdate(this.checkedData).then(res => {
                if (res) {
                    this.$message.success('保存成功');
                    this.getDataList();
                }
            }).catch(() => {});
        },
        selectChange(data) {
            this.checkedData = data;
        },
        downLoad() {
            if (!this.checkedData.length) {
                this.$message({
                    type: 'warning',
                    message: '请选择需要导出的数据!'
                });
                return false;
            }
            carrierConfig(this.checkedData.map(item => item.id)).then(res => {
                if (res) {
                    this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
                }
            });
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
        searchChange({ whCode, senderCode, receiverCode, configStatus, sourceSystem, orderType, customerCode, scPosFlag, carrierCode } = {}) {
            senderCode = senderCode.pop();
            receiverCode = receiverCode.pop();
            this.searchParams.pageNo = 1;
            this.searchParams = { ...this.searchParams,
                whCode,
                senderCode,
                receiverCode,
                configStatus,
                sourceSystem,
                orderType,
                customerCode,
                scPosFlag,
                carrierCode
            };
            this.getDataList();
        },
        getDataList() {
            this.loading = true;
            api.carrierConfigs(this.searchParams).then(res => {
                if (res) {
                    if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                        this.searchParams.pageNo = res.data.totalPage;
                        this.getDataList();
                        return false;
                    }
                    setTimeout(() => {
                        this.totalData = res.data.list.map(item => ({ ...this.mustFillParams, ...item }));
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