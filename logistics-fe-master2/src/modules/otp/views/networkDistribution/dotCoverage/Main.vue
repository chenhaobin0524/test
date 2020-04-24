<template>
    <paper class="dot-coverage">
        <m-pane
            ref="tablePage"
            :config="config"
            :pageTotal="pageTotal"
            :loading="loading"
            :totalData="totalData"
            @edit-btn="editBtn"
            @saveData="saveData"
            @save-btn="saveData"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange">
            <div slot="table-module-btn">
                <el-tooltip effect="dark" content="新增" placement="bottom">
                    <span class="mgl-10">
                    <el-button icon="el-icon-plus" size="mini" @click="addData"></el-button>
                    </span>
                </el-tooltip>
                <el-tooltip effect="dark" content="导入" placement="bottom">
                    <span v-has="'10020001'" class="mgl-10">
                    <el-button icon="el-icon-upload2" size="mini" @click="handleImport"></el-button>
                    </span>
                </el-tooltip>
                <el-tooltip effect="dark" content="导出" placement="bottom">
                    <span v-has="'10020002'" class="mgl-10">
                    <el-button icon="el-icon-download" size="mini" @click="exportFile"></el-button>
                    </span>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span class="page-module-btn" v-has="'10020003'"><el-button type="primary" @click="saveData">保 存</el-button></span>
                <span class="page-module-btn" v-has="'10020004'"><el-button type="primary" @click="handleDisable">停 用</el-button></span>
                <span class="page-module-btn" v-has="'10020005'"><el-button type="primary" @click="handleEable">启 用</el-button></span>
            </div>
        </m-pane>
        <Import
            ref="Import"
            :ImportConfig="config.table.ImportConfig"
            :ImportContent="config.table.ImportContent"
            @getUploadResult="getUploadResult"
        ></Import>
    </paper>
</template>

<script>
import mPane from '@/components/otpPanel';
import paper from '@/components/core/paper/Paper';
import config from './config.js';
import { getLists, batchCreateOrUpdate, netCoverExports, batchStart, batchStop } from '../../../api/netCover';
import _ from '@/components/lots/utils';
import Import from '../../../components/common/Import';
export default {
    components: { paper, mPane, Import },
    data() {
        return {
            config,
            pageTotal: 0,
            loading: false,
            selected: [],
            totalData: [],
            searchParams: {
                pageSize: 10,
                pageNo: 1
            }
        };
    },
    methods: {
        getList() {
            this.loading = true;
            getLists(this.searchParams).then(res => {
                this.loading = false;
                if (res && +res.code === 0) {
                    this.totalData = res.data.list || [];
                    this.totalData.map(item => {
                        if (item.customerTownName) {
                            item.customerAddrCodeArr = item.customerTownCode;
                            item.customerAddrName = `${item.customerProvinceName}/${item.customerCityName}/${item.customerDistrictName}/${item.customerTownName}`;
                        }
                    });
                    this.pageTotal = res.data.totalCount;
                }
            }).catch(() => {
                this.loading = false;
            });
        },
        load() {
            this.getList();
        },
        searchChange(data) {
            const address = {};
            if (data.customerAddr && data.customerAddr.length) {
                address['customerProvinceCode'] = data.customerAddr[0];
                address['customerCityCode'] = data.customerAddr[1];
                address['customerDistrictCode'] = data.customerAddr[2];
                address['customerTownCode'] = data.customerAddr[3];
            } else {
                address['customerProvinceCode'] = '';
                address['customerCityCode'] = '';
                address['customerDistrictCode'] = '';
                address['customerTownCode'] = '';
            }
            delete data.customerAddr;
            this.searchParams = {
                ...this.searchParams,
                ...data,
                ...address
            };
            this.getList();
        },
        pageChange(data) {
            this.searchParams.pageNo = data;
            this.getList();
        },
        sizeChange(data) {
            this.searchParams.pageSize = data;
            this.getList();
        },
        selectChange(data) {
            data.map(item => {
                this.validatePropsIsDisabled(item);
            });
            this.selected = data;
        },
        validatePropsIsDisabled() {},
        handleImport() {
            this.$refs.Import.orderImportC();
        },
        exportFile() {
            const params = { ...this.searchParams };
            Reflect.deleteProperty(params, 'pageNo');
            Reflect.deleteProperty(params, 'pageSize');
            netCoverExports(params).then(res => {
                if (res) this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
            });
        },
        addData() {
            // 表格新增方法
            this.$refs.tablePage.$refs.table.addRow();
        },
        editBtn(data) {
            // 表格内按钮修改事件;
        },
        saveData(data) {
            if (!this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData()) return false;
            if (this.selected.length < 1) return this.$message.warning('至少勾选一条数据进行操作');
            this.selected.forEach((item, index) => {
                if (item.customerAddrCodeArr && _.isArray(item.customerAddrCodeArr)) {
                    if (item.customerAddrName) {
                        [item.customerProvinceName, item.customerCityName, item.customerDistrictName, item.customerTownName] = item.customerAddrName.split('/');
                    }
                    if (item.customerAddrCodeArr.length > 0) {
                        [item.customerProvinceCode, item.customerCityCode, item.customerDistrictCode, item.customerTownCode] = item.customerAddrCodeArr;
                    } else {
                        item.customerProvinceCode =
                        item.customerProvinceName =
                        item.customerCityCode =
                        item.customerCityName =
                        item.customerDistrictCode =
                        item.customerDistrictName =
                        item.customerTownCode =
                        item.customerTownName = '';
                    }
                }
                item.customerAddr = item.customerAddrName;
            });
            const selectData = this.selected.map(item => {
                const obj = item.id ? { id: item.id } : {};
                const { version, customerProvinceCode, customerProvinceName, customerCityCode, customerCityName,
                    customerDistrictCode, customerDistrictName, customerTownCode, customerTownName,
                    customerAddr, netCode, usingStatus } = item;
                return {
                    version,
                    customerProvinceCode,
                    customerProvinceName,
                    customerCityCode,
                    customerCityName,
                    customerDistrictCode,
                    customerDistrictName,
                    customerTownCode,
                    customerTownName,
                    customerAddr,
                    netCode,
                    usingStatus,
                    ...obj
                };
            });
            batchCreateOrUpdate(selectData).then(res => {
                if (res) {
                    this.$message.success('操作成功');
                    this.getList();
                }
            });
        },
        handleDisable() {
            if (this.selected.length < 1) return this.$message.warning('至少选择一下一条数据操作');
            const ids = this.selected.map(item => item.id);
            batchStop(ids).then(res => {
                if (res) {
                    this.$message.success('批量停用成功');
                    this.getList();
                }
            });
        },
        handleEable() {
            if (this.selected.length < 1) return this.$message.warning('至少选择一下一条数据操作');
            const ids = this.selected.map(item => item.id);
            batchStart(ids).then(res => {
                if (res) {
                    this.$message.success('批量启用成功');
                    this.getList();
                }
            });
        },
        getUploadResult(flag) {
            if (flag) this.getList();
        }
    },
    mounted() {
        this.load();
    }
};
</script>
<style lang="less">
    .dot-coverage {
        .page-module-btn {
            margin-left: 10px;
        }
    }
</style>