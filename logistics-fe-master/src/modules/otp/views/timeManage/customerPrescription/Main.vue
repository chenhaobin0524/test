<template>
    <paper id="customerPrescription">
        <m-pane
            ref="tablePage"
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
            searchId="test"
            pageID="test"
        >
            <div slot="table-module-btn">
                <el-tooltip class="item" effect="dark" content="新增" placement="bottom" v-has="'06020001'">
                    <el-button size="mini" icon="el-icon-plus" @click="addData"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="导入" placement="bottom">
                    <span v-has="'06020004'" class="mgl-10">
                    <el-button icon="el-icon-upload2" size="mini" @click="orderImportC"></el-button>
                    </span>
                </el-tooltip>
                <el-tooltip effect="dark" content="导出" placement="bottom">
                    <span v-has="'06020005'" class="mgl-10">
                    <el-button icon="el-icon-download" size="mini" @click="exportEvent"></el-button>
                    </span>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span v-has="'06020002'">
                    <el-button type="primary" @click="redomet">停 用</el-button>
                </span>
                <span style="margin-left: 15px;" v-has="'06020003'">
                    <el-button type="primary" @click="saveData">启 用</el-button>
                </span>
            </div>
        </m-pane>
        <Import
            ref="Import"
            :ImportConfig="config.table.ImportConfig"
            :ImportContent="config.table.ImportContent"
            @getUploadResult="getUploadResult"
        ></Import>
        <Dialog
            :dialog="dialog"
            :visible="visible"
            :mFormValue="formValue"
            @closeDialog="closeDialog"
            @dialogDelRow="dialogDelRow"
            :tableData="tableData"
            ref="Dialog"
        >
            <template slot="tableHeader">
                <div class="tableHeader">
                    <div class="tagList">
                        <div
                            class="tag"
                            v-for="(item,index) in tabList"
                            :key="index"
                            :class="{'active':current===index}"
                            @click="changeActive(index)"
                        >
                            <p>{{item.label}}</p>
                        </div>
                    </div>
                </div>
            </template>
            <template slot="tableFooter">
                <div class="tableFooter">
                    <el-button type="text" @click="addDialogRow" :disabled="!config.dialog.dialogTable.btnActive">+ 添加明细</el-button>
                </div>
            </template>
        </Dialog>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.js';
import paper from '@/components/core/paper/Paper';
import Import from '../../../components/common/Import';
import Dialog from '../../../components/dialog/dialog';
import { getCustomerList, getCustomerDetail, customerAdd, customerStop, customerStart, getAgingProduct } from '../../../api/timeManage';
import {
    exportCustomerAgingConfig
} from '../../../api/export';
import { isInt } from '../../../judge/configCenter';

export default {
    name: 'customerPrescription',
    components: { mPane, paper, Import, Dialog },
    data() {
        return {
            config: config,
            loading: false,
            dialog: config.dialog,
            optionNum: '',
            totalData: [],
            pageTotal: 0,
            searchTotalTitle: config.searchTotalTitle,
            visible: false,
            current: 0,
            tabList: [{ label: '节点时效配置' }],
            tableData: [],
            formValue: {},
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            selectData: [],
            exportType: false,
            isAddData: true
        };
    },
    methods: {
        getCustomerList() {
            getCustomerList(this.searchParams).then(res => {
                if (res.code === '0') {
                    res.data.list.map(item => {
                        if (item.receiveTown) {
                            item.receiveTown = `${item.receiveProvince}/${item.receiveCity}/${item.receiveDistrict}/${item.receiveTown}`;
                        }
                        if (item.receiveDistrict && !item.receiveTown) {
                            item.receiveTown = `${item.receiveProvince}/${item.receiveCity}/${item.receiveDistrict}`;
                        }
                        if (item.sendTown) {
                            item.sendTown = `${item.sendProvince}/${item.sendCity}/${item.sendDistrict}/${item.sendTown}`;
                        }
                        if (item.sendDistrict && !item.sendTown) {
                            item.sendTown = `${item.sendProvince}/${item.sendCity}/${item.sendDistrict}`;
                        }
                    });
                    this.totalData = res.data.list || [];
                    this.pageTotal = res.data.totalCount;
                }
            });
        },
        getUploadResult(flag) {
            if (flag) {
                this.getCustomerList();
            }
        },
        setTimeOption(round, ms) {
            const arr = [];
            for (let i = 0; i < round; i++) {
                if (i <= 23) {
                    if (i < 10) {
                        arr.push({
                            label: `0${i % 24}:${ms}:${ms}`,
                            value: `0${i % 24}:${ms}:${ms}`
                        });
                    } else {
                        arr.push({
                            label: `${i % 24}:${ms}:${ms}`,
                            value: `${i % 24}:${ms}:${ms}`
                        });
                    }
                } else {
                    if (i % 24 < 9) {
                        arr.push({
                            label: `(前一天) 0${i % 24}:${ms}:${ms}`,
                            value: `-0${i % 24}:${ms}:${ms}`
                        });
                    } else {
                        arr.push({
                            label: `(前一天) ${i % 24}:${ms}:${ms}`,
                            value: `-${i % 24}:${ms}:${ms}`
                        });
                    }
                }
            }
            return arr;
        },
        setBeginOption() {
            this.config.dialog.dialogForm.inputList.map(item => {
                if (item.value === 'orderStartTime') {
                    item.options = this.setTimeOption(48, '00');
                }
                if (item.value === 'orderEndTime') {
                    item.options = this.setTimeOption(24, '59');
                }
                if (item.value === 'agingStartTime') {
                    item.options = [...this.setTimeOption(24, '00'), {
                        label: '(第二天) 00:00:00',
                        value: '+00:00:00'
                    }];
                }
            });
            this.config.searchTotalTitle.map(item => {
                if (item.value === 'orderStartTime') {
                    item.options = this.setTimeOption(48, '00');
                }
                if (item.value === 'orderEndTime') {
                    item.options = this.setTimeOption(24, '59');
                }
                if (item.value === 'agingStartTime') {
                    item.options = [...this.setTimeOption(24, '00'), {
                        label: '(第二天) 00:00:00',
                        value: '+00:00:00'
                    }];
                }
            });
        },
        rowDBclick(row) {
            // 表格内双击事件
        },
        checkBtn(data) {
            // 表格内按钮查看事件;
            this.formValue = {};
            this.tableData = [];
            this.config.dialog.dialogForm.inputList.map(item => {
                item.readOnly = true;
            });
            this.config.dialog.dialogTable.btnActive = false;
            this.visible = true;
            this.isAddData = false;
            getCustomerDetail({}, data.id).then(res => {
                if (res.code === '0') {
                    // if (res.data.receiveDistrictCode && !res.data.receiveTownCode) {
                    //     res.data.receiveTownCode = res.data.receiveDistrictCode;
                    // }
                    // if (res.data.sendDistrictCode && !res.data.sendTownCode) {
                    //     res.data.sendTownCode = res.data.sendDistrictCode;
                    // }
                    res.data.receive = res.data.receiveTownCode || res.data.receiveDistrictCode;
                    res.data.send = res.data.sendTownCode || res.data.sendDistrictCode;
                    this.formValue = res.data;
                    this.tableData = res.data.customerAgingConfigDatailList.map(row => {
                        row.status = row.status ? '' + row.status : '';
                        row.begainStatus = row.begainStatus ? '' + row.begainStatus : '';
                        return row;
                    }) || [];
                    if (res.data.customerAgingConfigDatailList) {
                        delete res.data.customerAgingConfigDatailList;
                    }
                }
            });
        },
        editBtn(data) {
            // 表格内按钮修改事件;
            this.formValue = {};
            this.tableData = [];
            this.config.dialog.dialogForm.inputList.map(item => {
                item.readOnly = false;
            });
            this.config.dialog.dialogTable.btnActive = true;
            this.visible = true;
            this.isAddData = true;
            getCustomerDetail({}, data.id).then(res => {
                if (res.code === '0') {
                    // if (res.data.receiveDistrictCode && !res.data.receiveTownCode) {
                    //     res.data.receiveTownCode = res.data.receiveDistrictCode;
                    // }
                    // if (res.data.sendDistrictCode && !res.data.sendTownCode) {
                    //     res.data.sendTownCode = res.data.sendDistrictCode;
                    // }
                    res.data.receive = res.data.receiveTownCode || res.data.receiveDistrictCode;
                    res.data.send = res.data.sendTownCode || res.data.sendDistrictCode;
                    this.formValue = res.data;
                    this.tableData = res.data.customerAgingConfigDatailList.map(row => {
                        row.status = row.status ? '' + row.status : '';
                        row.begainStatus = row.begainStatus ? '' + row.begainStatus : '';
                        return row;
                    }) || [];
                    // console.log(this.tableData);
                    if (res.data.customerAgingConfigDatailList) {
                        delete res.data.customerAgingConfigDatailList;
                    }
                }
            });
        },
        delBtn(data) {
            // 表格内按钮删除事件;
        },
        selectChange(data) {
            // 表格内选择变化
            this.selectData = data;
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        searchChange(data) {
            // 提交搜索框
            if (this.exportType) {
                const actions = {
                    orderType: '订单类型',
                    businessMode: '业务模式',
                    deliveryType: '配送方式'
                };
                let searchLimitStr = '';
                Object.keys(actions).forEach(key => {
                    if (!this.searchParams[key]) searchLimitStr += `${actions[key]} & `;
                });
                searchLimitStr = searchLimitStr.substring(0, searchLimitStr.length - 2);
                if (searchLimitStr) {
                    this.exportType = false;
                    return this.$message.warning(`导出时，查询条件 ${searchLimitStr}不能为空`);
                }
                this.searchParams.pageNo = 1;
                this.searchParams = { ...this.searchParams, ...data };
                const searchParams = JSON.parse(JSON.stringify(this.searchParams));
                delete searchParams.pageSize;
                delete searchParams.pageNo;
                exportCustomerAgingConfig(searchParams).then(res => {
                    this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
                });
                this.exportType = false;
            } else {
                if (data.receiveTownCode && data.receiveTownCode.length) {
                    [data.receiveProvinceCode, data.receiveCityCode, data.receiveDistrictCode, data.receiveTownCode] = data.receiveTownCode;
                } else {
                    [data.receiveProvinceCode, data.receiveCityCode, data.receiveDistrictCode, data.receiveTownCode] = ['', '', '', ''];
                }
                if (data.sendTownCode && data.sendTownCode.length) {
                    [data.sendProvinceCode, data.sendCityCode, data.sendDistrictCode, data.sendTownCode] = data.sendTownCode;
                } else {
                    [data.sendProvinceCode, data.sendCityCode, data.sendDistrictCode, data.sendTownCode] = ['', '', '', ''];
                }
                const key = Object.keys(data);
                key.map(item => {
                    if (!data[key]) {
                        delete data[key];
                    }
                });
                this.searchParams = { ...this.searchParams, ...data, pageNo: 1 };
                this.getCustomerList();
            };
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.getCustomerList();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            this.getCustomerList();
        },
        addData() {
            // 表格新增方法
            // this.$refs.tablePage.$refs.table.addRow();
            this.config.dialog.dialogForm.inputList.map(item => {
                item.readOnly = false;
            });
            this.config.dialog.dialogTable.btnActive = true;
            this.isAddData = true;
            this.formValue = {};
            this.tableData = [];
            this.visible = true;
        },
        saveData(data) {
            // 表格新增修改后返回数据
            const idList = [];
            this.selectData.map(item => {
                idList.push(item.id);
            });
            customerStart(idList).then(res => {
                if (res.code === '0') {
                    this.$message.success('启用成功');
                    this.getCustomerList();
                }
            });
        },
        redomet(data) {
            // 这是删除方法
            const idList = [];
            this.selectData.map(item => {
                idList.push(item.id);
            });
            customerStop(idList).then(res => {
                if (res.code === '0') {
                    this.$message.success('停用成功');
                    this.getCustomerList();
                }
            });
        },
        getTableConfigList(data) {},
        refresh() {
            // 表格内刷新按钮
        },
        orderImportC() {
            this.$refs.Import.orderImportC();
        },
        exportEvent() {
            this.exportType = true;
            this.$refs.tablePage.$refs.searchList.onSearchChange();
        },
        changeActive(index) {
            this.current = index;
        },
        closeDialog(params, type) {
            if (!this.isAddData) {
                this.visible = false;
                return;
            }

            if (type === 'sure') {
                if (!params.mTableData || !params.mTableData.length) {
                    this.$message.error('节点时效不能为空');
                    return;
                } else {
                    for (let i = 0; i < params.mTableData.length; i++) {
                        if (!isInt(params.mTableData[i].agingHour)) {
                            this.$message.error('时效要求必须为正整数');
                            return;
                        }
                    }
                }
                const customerAgingConfigDatailList = params.mTableData;
                const formData = params.mFormData;
                //  ['sendProvince','sendCity','sendDistrict','sendTown']
                const del = function(arr) {
                    const keys = Object.keys(formData);
                    keys.map(item => {
                        arr.map(child => {
                            if (item === child) {
                                delete formData[item];
                            }
                        });
                    });
                };
                del(['sendProvince', 'sendCity', 'sendDistrict', 'sendTown', 'receiveProvince', 'receiveCity', 'receiveDistrict', 'receiveTown']);
                if (params.mFormData.send && (params.mFormData.send instanceof Array)) {
                    if (formData.send.length === 4) {
                        [formData.sendProvinceCode, formData.sendCityCode, formData.sendDistrictCode, formData.sendTownCode] = params.mFormData.send;
                    } else if (formData.send.length === 3) {
                        [formData.sendProvinceCode, formData.sendCityCode, formData.sendDistrictCode] = params.mFormData.send;
                        formData.sendTownCode = '';
                    } else {
                        formData.sendProvinceCode = formData.sendCityCode = formData.sendDistrictCode = formData.sendTownCode = '';
                    }
                }
                delete formData.send;

                if (params.mFormData.receive && (params.mFormData.receive instanceof Array)) {
                    if (formData.receive.length === 4) {
                        [formData.receiveProvinceCode, formData.receiveCityCode, formData.receiveDistrictCode, formData.receiveTownCode] = formData.receive;
                    } else if (formData.receive.length === 3) {
                        [formData.receiveProvinceCode, formData.receiveCityCode, formData.receiveDistrictCode] = formData.receive;
                        formData.receiveTownCode = '';
                    } else {
                        formData.receiveProvinceCode = formData.receiveCityCode = formData.receiveDistrictCode = formData.receiveTownCode = '';
                    }
                }
                delete formData.receive;

                const obj = { ...formData, customerAgingConfigDatailList };
                customerAdd(obj).then(res => {
                    if (res.code === '0') {
                        this.$message.success('操作成功');
                        this.getCustomerList(this.searchParams);
                        this.visible = false;
                    } else {
                        this.visible = true;
                    }
                });
            } else {
                this.visible = false;
            }
        },
        addDialogRow() {
            this.$refs.Dialog.$refs.dialogTable.addRow();
        },
        dialogDelRow(row, index, data) {
            data.splice(index, 1);
            this.tableData = data;
        }
    },
    mounted() {
        // 初始化时效产品的下拉框选项
        const agingProductSearchItem = this.config.searchTotalTitle.find(item => item.value === 'agingProduct');
        const agingProductFormItem = this.config.dialog.dialogForm.inputList.find(item => item.value === 'agingProduct');
        getAgingProduct({
            pageNo: 1,
            pageSize: 9999
        }).then(res => {
            if (res && res.code === '0') {
                agingProductSearchItem.options = agingProductFormItem.options = res.data.list.filter(item => item.agingProductType === 'STANDARD').map(item => {
                    return {
                        label: item.agingProductName,
                        value: item.agingProductCode
                    };
                });
            }
        });
        this.getCustomerList();
        this.setBeginOption();
    }
};
</script>
<style lang="less">
#customerPrescription {
    .tableHeader {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        .tagList {
            flex: 1;
            display: flex;
            .active {
                color: #00bcbf;
                border-bottom: 2px solid #00bcbf;
                box-sizing: border-box;
            }
            .tag {
                text-align: center;
                font-size: 13px;
                width: 120px;
                height: 100%;
                p {
                    line-height: 40px;
                    margin: 0;
                }
            }
        }
    }
    .tableFooter {
        text-align: center;
        width: 100%;
        padding: 3px 0;
        border-bottom: 1px solid #eee;
    }
}
</style>
