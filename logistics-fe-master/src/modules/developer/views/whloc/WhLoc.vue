<template>
    <Paper class='wharea'>
        <m-panel
        ref="tablePage"
        :config="config"
        :totalData="totalData"
        :pageTotal="pageTotal"
        :loading="loading"
        @selectChange="selectChange"
        @searchChange="searchChange"
        @pageChange="pageChange"
        @sizeChange="sizeChange"
        @saveData="saveData"
        :verification="verification"
        pageID="wh_loc"
        optionNum="SYS_WM_YES_NO">
        <div slot="table-module-btn">
            <div class="icon-button">
                <el-tooltip class="item" effect="dark" content="新增" placement="bottom" v-has='13000003'>
                    <el-button type='primary' size="mini" icon='el-icon-plus' @click="addData"></el-button>
                </el-tooltip>
                <el-tooltip class='item' effect='dark' content='导出' placement='bottom' v-has='13000005'>
                    <mExport :url="exportURl" :params="exportParams" :name="exportName" @exportSearchChange="exportSearchChange"></mExport>
                </el-tooltip>
            </div>
        </div>
        <div slot="page-module-btn"  v-has='13000002'>
            <m-import :templateName='templateName' :templateUrl='templateUrl' :uploadUrl='uploadUrl'><span slot="button-name">导 入</span></m-import>
        </div>
        </m-panel>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import mPanel from '@/components/awesome/page/mPanel3';
import mImport from '@/components/awesome/page/fileHandle/import';
import mExport from '@/components/awesome/page/fileHandle/export';
import config from './config.json';
import api from './whLoc';
export default {
    data() {
        return {
            btnPermissions: [],
            config: config,
            totalData: [],
            pageTotal: 100,
            selectedRows: [],
            loading: false,
            pageNo: 1,
            pageSize: 10,
            searchTerm: {},
            templateName: '库位表模板.xls',
            templateUrl: '/api-gwms/basic/whLocs/template',
            uploadUrl: '/api-gwms/basic/whLocs/upload',
            verification: {
                locCode: [{ required: true, message: '库位编码不能为空', trigger: 'blur' }],
                zoneName: [{ required: true, message: '库区名称不能为空', trigger: 'change' }],
                areaName: [{ required: true, message: '区域名称不能为空', trigger: 'change' }],
                whName: [{ required: true, message: '物理仓名称不能为空', trigger: 'change' }],
                maxPl: [{ required: true, message: '最大托盘数不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (value !== '' && value !== null) {
                                if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                    callback(new Error('请填写大于0的数字'));
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        }
                    }],
                length: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && value !== null) {
                            if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                callback(new Error('请填写大于0的数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                width: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && value !== null) {
                            if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                callback(new Error('请填写大于0的数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                height: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && value !== null) {
                            if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                callback(new Error('请填写大于0的数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                floor: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && value !== null) {
                            if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                callback(new Error('请填写大于0的数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                maxCount: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && value !== null) {
                            if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                callback(new Error('请填写大于0的数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                maxWeight: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && value !== null) {
                            if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                callback(new Error('请填写大于0的数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                maxCubic: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && value !== null) {
                            if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                callback(new Error('请填写大于0的数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                maxMixSku: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && value !== null) {
                            if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                callback(new Error('请填写大于0的数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                x: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && value !== null) {
                            if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                callback(new Error('请填写大于0的数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                y: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && value !== null) {
                            if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                callback(new Error('请填写大于0的数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                z: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && value !== null) {
                            if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                callback(new Error('请填写大于0的数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                maxMixLot: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && value !== null) {
                            if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                                callback(new Error('请填写大于0的数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                }
            },
            exportURl: '/api-gwms/basic/whLocs/export',
            exportName: '库位信息列表.xls',
            exportParams: {}
        };
    },
    methods: {
        exportSearchChange() {
            const data = this.$refs.tablePage.$refs.searchList.onSearchChange(null, true);
            var params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                ...data
            };
            this.exportParams = params;
        },
        selectChange(data) {
            this.selectedRows = data;
        },
        searchChange(data) {
            this.pageNo = 1;
            this.searchTerm = data;
            this.loadData();
        },
        pageChange(data) {
            this.pageNo = data;
            this.loadData();
        },
        sizeChange(data) {
            this.pageSize = data;
            this.loadData();
        },
        addData() {
            this.$refs.tablePage.$refs.table.addData();
        },
        saveData(data) {
            [data].map(item => {
                item.length = item.length ? Number(item.length) : '';
                item.width = item.width ? Number(item.width) : '';
                item.height = item.height ? Number(item.height) : '';
                item.floor = item.floor ? Number(item.floor) : '';
                item.maxCount = item.maxCount ? Number(item.maxCount) : '';
                item.maxWeight = item.maxWeight ? Number(item.maxWeight) : '';
                item.maxCubic = item.maxCubic ? Number(item.maxCubic) : '';
                item.maxPl = item.maxPl ? Number(item.maxPl) : '';
                item.x = item.x ? Number(item.x) : '';
                item.y = item.y ? Number(item.y) : '';
                item.z = item.z ? Number(item.z) : '';
                item.maxMixSku = item.maxMixSku ? Number(item.maxMixSku) : '';
                item.maxMixLot = item.maxMixLot ? Number(item.maxMixLot) : '';
            });
            api.save([data]).then(res => {
                if (res) {
                    this.loadData();
                    this.$refs.tablePage.statusChange(false);
                }
            });
        },
        loadData() {
            this.loading = true;
            var params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                ...this.searchTerm
            };
            api.get(params).then(res => {
                if (res) {
                    this.pageTotal = res.data.totalCount;
                    this.totalData = res.data.list;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        }
    },
    created() {
        this.loadData();
    },
    components: { Paper, mPanel, mImport, mExport }
};
</script>
<style lang='less'>
</style>
