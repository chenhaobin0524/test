<template>
    <paper>
        <m-pane ref="tablePage"
                :config="config"
                :totalData="totalData"
                :pageTotal="pageTotal"
                :optionNum="optionNum"
                :loading="loading"
                :searchTotalTitle="searchTotalTitle"
                @saveData="saveData"
                @row-db-click="rowDBclick"
                @getTableConfigList="getTableConfigList"
                @check-btn="checkBtn"
                @edit-btn="editBtn"
                @del-btn="delBtn"
                @switch-change="switchChange"
                @selectChange="selectChange"
                @searchChange="searchChange"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
                @element-change="elementChange"
                searchId="distribution_rule"
                pageID="distribution_rule">
            <div slot="table-module-btn">
                <el-tooltip class="item"
                            effect="dark"
                            content="新增"
                            placement="bottom">
                    <el-button size="mini"
                               icon='el-icon-plus'
                               @click="addData"></el-button>
                </el-tooltip>
                <el-tooltip effect='dark'
                    content='导入'
                    placement='bottom'>
                    <span v-has="'05140004'" class="mgl-10">
                        <el-button icon='el-icon-upload2'
                            size='mini' @click="showImport"></el-button>
                    </span>
                </el-tooltip>
                <el-tooltip effect='dark'
                    content='导出'
                    placement='bottom'>
                    <span v-has="'05140005'" class="mgl-10">
                        <el-button icon='el-icon-download'
                            size='mini' @click="exportEvent"></el-button>
                    </span>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span v-has="'05020001'"><el-button type="primary" @click="redomet">删 除</el-button></span>
                <span style="margin-left: 10px;" v-has="'05020002'"><el-button type="primary" @click="saveData">保 存</el-button></span>
            </div>
        </m-pane>
        <Import
            ref="Import"
            :ImportConfig="config.import.ImportConfig"
            :ImportContent="config.import.ImportContent"
            @getUploadResult="getUploadResult"
        ></Import>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.js';
import paper from '@/components/core/paper/Paper';
import _ from '@/components/lots/utils';
import Import from '../../../components/common/Import';
import { getShippingTypeRules, deleteShippingTypeRules, addShippingTypeRules } from '../../../api/configCenter';
import {
    exportShippingType
} from '../../../api/export';
import { messageBox } from '../../../utils/messageBox';
export default {
    name: 'distribution',
    components: { mPane, paper, Import },
    data() {
        return {
            config: config,
            loading: false,
            optionNum: '',
            totalData: [],
            pageTotal: 10,
            searchTotalTitle: config.searchTotalTitle,
            selectRow: [],
            columns: config.table.columns,
            searchParams: {
                pageNo: 1,
                pageSize: 10
            },
            mustFillParams: {
                whName: '',
                businessMode: '',
                townCode: [],
                customerName: '',
                deliveryType: ''
            },
            exportType: false
        };
    },
    methods: {
        async fetchData() {
            const res = await getShippingTypeRules({ ...this.searchParams });
            if (res) {
                if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.fetchData();
                } else {
                    res.data.list.map(item => {
                        if (item.districtName) {
                            item.location = item.districtCode;
                            const itemTownName = item.townName || '';
                            item.locationName = `${item.provinceName}/${item.cityName}/${item.districtName}/${itemTownName}`;
                        }
                    });
                    this.totalData = res.data.list.map(item => {
                        return { ...this.mustFillParams, ...item };
                    });
                    this.pageTotal = res.data.totalCount;
                }
            } else {
                this.totalData = [];
            }
        },
        rowDBclick(row) {
            // 表格内双击事件
        },
        checkBtn(data) {
            // 表格内按钮查看事件;
        },
        editBtn(data) {
            // 表格内按钮修改事件;
        },
        delBtn(data) {
            // 表格内按钮删除事件;
        },
        selectChange(data) {
            // 表格内选择变化
            data.map(item => {
                this.validatePropsIsDisabled(item);
            });
            this.selectRow = data;
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        getUploadResult(flag) {
            if (flag) {
                this.fetchData();
            }
        },
        searchChange(data) {
            // 提交搜索框
            if (data.location) {
                // 配送方式规则：1、仓库，业务模式，配送方式必填， 地址、客户不是必填，若地址选择，选择到三级就可以了 by lj
                ['provinceCode', 'cityCode', 'districtCode', 'townCode'].forEach((key, index) => {
                    data[key] = data.location[index] || '';
                });
                Reflect.deleteProperty(data, 'location');
            }
            this.searchParams = {
                pageNo: 1,
                pageSize: this.searchParams.pageSize,
                ...data
            };
            if (this.exportType) {
                exportShippingType(this.searchParams).then(res => {
                    this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
                });
                this.exportType = false;
            } else {
                // console.log(this.searchParams);
                this.fetchData();
            };
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.fetchData();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            this.fetchData();
        },
        addData() {
            // 表格新增方法
            const row = this.columns.reduce((result, col) => {
                result[col.prop] = col.defaultValue || '';
                return result;
            }, {});
            row.edit = 2;
            this.validatePropsIsDisabled(row);
            this.totalData.unshift(row);
            this.$refs.tablePage.$refs.table.$refs.mNewTable.$refs.moduleTable.toggleRowSelection(row, true);
        },
        showImport() {
            this.$refs.Import.orderImportC();
        },
        saveData(data) {
            // 表格新增修改后返回数据
            const rows = _.clone(this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData());
            if (!rows.length && rows !== false) {
                this.$message.warning('请勾选要保存的数据');
                return;
            }
            if (!rows) {
                // this.$message.warning('请确保必填数据不为空');
                return;
            }
            rows.forEach((item, index) => {
                if (item.location && _.isArray(item.location)) {
                    // 为数组时表示有进行修改操作，需重新赋值
                    if (item.locationName) {
                        [item.provinceName, item.cityName, item.districtName, item.townName = ''] = item.locationName.split('/');
                    }

                    if (item.location.length > 0) {
                        [item.provinceCode, item.cityCode, item.districtCode, item.townCode = ''] = item.location;
                    } else {
                        item.provinceCode =
                        item.provinceName =
                        item.cityCode =
                        item.cityName =
                        item.districtCode =
                        item.districtName = '';
                        item.townCode =
                        item.townName = '';
                    }
                }
                Reflect.deleteProperty(item, 'location');
                Reflect.deleteProperty(item, 'locationName');
                Reflect.deleteProperty(item, 'disableProps');
            });
            addShippingTypeRules(rows).then(res => {
                if (res.code === '0') {
                    this.$message.success('操作成功');
                    this.fetchData();
                }
            });
        },
        redomet(data) {
            // 这是删除方法
            const rows = this.selectRow;
            if (!rows.length) {
                this.$message.warning('请勾选需要删除的数据');
                return;
            }
            const idList = [];
            rows.map(item => {
                if (item.id) {
                    idList.push(item.id);
                }
            });
            if (!idList.length) {
                this.fetchData();
                return;
            }
            messageBox(this).then(() => {
                deleteShippingTypeRules(idList).then(res => {
                    if (res.code === '0') {
                        this.$message.success('删除成功');
                        this.fetchData();
                    }
                });
            });
        },
        getTableConfigList(data) {
        },
        refresh() {
            // 表格内刷新按钮
        },
        exportEvent() {
            this.exportType = true;
            this.$refs.tablePage.$refs.searchList.onSearchChange();
        },
        // 校验属性禁用规则
        validatePropsIsDisabled(row) {
            if (!row['whCode']) {
                [row.businessMode, row.locationName, row.location, row.customerName, row.customerCode] = [null, '', null, '', null];
                row.disableProps = ['businessMode', 'locationName', 'location', 'customerName'];
            } else if (!row['businessMode']) {
                [row.locationName, row.location, row.customerName, row.customerCode] = ['', null, '', null];
                row.disableProps = ['locationName', 'location', 'customerName'];
            } else if (!row['location'] || row['location'].length === 0) {
                [row.customerName, row.customerCode] = ['', null];
                row.disableProps = ['customerName'];
            } else {
                row.disableProps = [];
            }
        },
        elementChange(data) {
            if (data.row) {
                this.validatePropsIsDisabled(data.row);
            } else {
                this.validatePropsIsDisabled(data.val);
            }
        }
    },
    created() {
        this.fetchData();
    }
};
</script>
