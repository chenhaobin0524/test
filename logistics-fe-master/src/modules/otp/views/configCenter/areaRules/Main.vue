<template>
    <div class="configCenterAreaRules">
        <approver-dialog ref='approverDialog' @saveClick='saveClick'></approver-dialog>
        <el-row>
            <el-col :span='21'>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-input v-model="searchData.areaName" placeholder="片区名称" clearable></el-input>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <div class="searchItem">
                        <!-- <el-date-picker
                            style='width: 100%'
                            v-model="searchData.updateTimeArr"
                            size="mini"
                            :clearable="false"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickerOptions"
                            type='datetimerange'
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker> -->
                        <el-input
                            @focus='$event.target.blur()'
                            @input='areaInput'
                            :value="searchData.chargeName"
                            placeholder='责任人'
                            clearable>
                            <el-button slot="append" @click='showDialog(searchData)' icon="el-icon-search"></el-button>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <div class="searchItem">
                        <otp-advance
                            :params='params'
                            @getAdvanceValue='getAdvanceValue'>
                        </otp-advance>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <el-button type='primary' @click='queryBtn'>查 询</el-button>
                </el-col>
            </el-col>
            <div style="float: right">
                <el-tooltip effect="dark" content="新增" placement="bottom">
                    <el-button icon='el-icon-plus' size="mini" @click="addBtn"></el-button>
                </el-tooltip>
                <el-tooltip effect='dark' content='导出' placement='bottom'>
                    <el-button icon='el-icon-download' size='mini' @click='downLoad'></el-button>
                </el-tooltip>
                <el-tooltip effect='dark' content='导入' placement='bottom'>
                    <el-button icon='el-icon-upload2' size='mini' @click='upload'></el-button>
                </el-tooltip>
            </div>
        </el-row>

        <div class="table-content" style="margin-top: 10px;">
            <el-table
                v-loading='loading'
                border
                :data="dataList"
                tooltip-effect='dark'
                @row-dblclick='rowDblclick'
                @selection-change='selectionChange'>
                <!-- 复选框 -->
                <el-table-column type="selection" width="40" fixed></el-table-column>
                <!-- 中间字段 -->
                <el-table-column v-for="(item, index) in columns" :key='index'
                    :prop='item.prop' :label='item.label' :min-width="item.minWidth ? item.minWidth : ''" :show-overflow-tooltip="true">

                    <template slot-scope="scope">
                        <div v-if="item.type === 'switch'">
                            <el-switch
                                class="demo"
                                v-model="scope.row[item.prop]"
                                @change="switchChange(scope.row)"
                                active-text="启用"
                                inactive-text="停用">
                            </el-switch>
                        </div>
                        <div v-else>{{scope.row[item.prop]}}</div>
                    </template>

                </el-table-column>
                <!-- 操作 -->
                <el-table-column fixed="right" label="操作" :width='100' align='center'>
                    <template slot-scope="scope">
                        <el-button @click.stop='editBtn(scope.row)' type='text' v-if='!scope.row.areaStatus'>编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 文件上传 -->
            <upload :uploadShow.sync='uploadShow' v-if='uploadShow' @getTableDataList='getTableDataList'></upload>

            <!-- 新增弹框 -->
            <add-dialog :addDialogVisible.sync='addDialogVisible' v-if='addDialogVisible' @getTableDataList='getTableDataList'></add-dialog>

            <!-- 编辑弹框 -->
            <edit-dialog :editDialogVisible.sync='editDialogVisible' v-if='editDialogVisible' @getTableDataList='getTableDataList' :dataRow='dataRow'></edit-dialog>

            <!-- 查看弹框 -->
            <detail-dialog :detailDialogVisible.sync='detailDialogVisible' v-if='detailDialogVisible' :dataRow='dataRow'></detail-dialog>
        </div>

        <!-- 底部分页区域 -->
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="12" class="page-text">
                <div>
                    已选<span class="text-color">{{checkedNum}}</span>项
                </div>
            </el-col>
            <el-col :span="12">
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
            </el-col>
        </el-row>
    </div>
</template>
<script>
import upload from './upload.vue';
import editDialog from './editDialog';
import addDialog from './addDialog';
import detailDialog from './detailDialog';
import approverDialog from '../../../components/approverDialog';
import { getAreaList, updateStatus } from '../../../api/areaRules';
import { exportAreaPost } from '../../../api/export';
import otpAdvance from '@/components/lots/otpAdvance';

export default {
    name: 'areaRules',
    components: { upload, editDialog, addDialog, detailDialog, otpAdvance, approverDialog },
    data() {
        return {
            pageConfig: {
                layout: 'total, sizes, prev, pager, next, jumper',
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                total: 0,
                currentPage: 1
            },
            uploadShow: false,
            loading: false,
            params: {
                name: '服务平台',
                value: 'siteName',
                advanceLabel: '选择平台',
                advanceConfig: [
                    { prop: 'escoCompanyNameCn', 'value': '平台' },
                    { prop: 'escoCompanyNo', 'value': '编码' }
                ],
                tableConfig: [
                    { prop: 'escoCompanyNameCn', 'value': '平台名称' },
                    { prop: 'escoCompanyNo', 'value': '平台编码' }
                ],
                advanceUrl: '/searchPlatform',
                cbParams: [
                    'escoCompanyNo#siteCode',
                    'escoCompanyNameCn#siteName'
                ]
            },
            // pickerOptions: {
            //     shortcuts: [{
            //         text: '最近一周',
            //         onClick(picker) {
            //             const start = new Date();
            //             start.setHours(0);
            //             start.setMinutes(0);
            //             start.setSeconds(0);
            //             start.setMilliseconds(0);
            //             const end = new Date();
            //             end.setHours(23);
            //             end.setMinutes(59);
            //             end.setSeconds(59);
            //             end.setMilliseconds(0);
            //             start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
            //             picker.$emit('pick', [start, end]);
            //         }
            //     }, {
            //         text: '最近一个月',
            //         onClick(picker) {
            //             const start = new Date();
            //             start.setHours(0);
            //             start.setMinutes(0);
            //             start.setSeconds(0);
            //             start.setMilliseconds(0);
            //             const end = new Date();
            //             end.setHours(23);
            //             end.setMinutes(59);
            //             end.setSeconds(59);
            //             end.setMilliseconds(0);
            //             start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            //             picker.$emit('pick', [start, end]);
            //         }
            //     }, {
            //         text: '最近三个月',
            //         onClick(picker) {
            //             const start = new Date();
            //             start.setHours(0);
            //             start.setMinutes(0);
            //             start.setSeconds(0);
            //             start.setMilliseconds(0);
            //             const end = new Date();
            //             end.setHours(23);
            //             end.setMinutes(59);
            //             end.setSeconds(59);
            //             end.setMilliseconds(0);
            //             start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            //             picker.$emit('pick', [start, end]);
            //         }
            //     }]
            // },
            dataRow: {},
            addDialogVisible: false,
            editDialogVisible: false,
            dataList: [],
            columns: [
                {
                    prop: 'areaName',
                    label: '片区名称',
                    minWidth: ''
                },
                {
                    prop: 'siteName',
                    label: '服务平台',
                    minWidth: ''
                },
                {
                    prop: 'areaStatus',
                    label: '状态',
                    minWidth: '',
                    type: 'switch'
                },
                {
                    prop: 'chargeName',
                    label: '责任人',
                    minWidth: ''
                },
                {
                    prop: 'updateUserName',
                    label: '修改人',
                    minWidth: ''
                },
                {
                    prop: 'updateTime',
                    label: '修改时间',
                    minWidth: ''
                }
            ],
            searchData: {
                areaName: '',
                siteName: '',
                siteCode: '',
                chargeCode: '',
                chargeName: ''
                // updateTimeArr: []
            },
            searchObj: {},
            checkedData: [], // 已选中数据
            checkedNum: 0,
            detailDialogVisible: false
        };
    },
    methods: {
        showDialog(row) {
            this.$refs.approverDialog.showDialog(row);
        },
        // chargeName 变化触发
        areaInput() {
            this.searchData.chargeName = '';
            this.searchData.chargeCode = '';
            delete this.searchData.selectList;
        },
        saveClick(data) {
            if (data[0]) {
                this.searchData.selectList = data;
                this.searchData.chargeName = data[0].userName;
                this.searchData.chargeCode = data[0].userCode;
            } else {
                delete this.searchData.selectList;
                this.searchData.chargeName = '';
                this.searchData.chargeCode = '';
            }
        },
        getAdvanceValue(data) {
            this.searchData.siteName = data.siteName;
            this.searchData.siteCode = data.siteCode;
        },
        rowDblclick(row, column, event) {
            if (row.areaStatus) {
                this.dataRow = row;
                this.detailDialogVisible = true;
            }
        },
        // 查询按钮
        queryBtn() {
            const params = {};
            params.areaName = this.searchData.areaName;
            params.siteName = this.searchData.siteName;
            params.siteCode = this.searchData.siteCode;
            params.pageSize = this.searchObj.pageSize;
            params.pageNo = 1;
            // params.startCreateTime = this.searchData.updateTimeArr ? this.searchData.updateTimeArr[0] : '';
            // params.endCreateTime = this.searchData.updateTimeArr ? this.searchData.updateTimeArr[1] : '';
            params.chargeCode = this.searchData.chargeCode;

            this.searchObj = params;
            this.getTableDataList(params);
        },
        // 获取表格选中数据
        selectionChange(checkedData) {
            this.checkedData = checkedData;
            this.checkedNum = checkedData.length;
        },
        // 页码改变
        pageChange(pageNum) {
            this.searchObj.pageNo = pageNum;
            this.getTableDataList(this.searchObj);
        },
        // 页容量改变
        sizeChange(pageSize) {
            this.searchObj.pageSize = pageSize;
            this.searchObj.pageNo = 1;
            this.getTableDataList(this.searchObj);
        },
        // 新增按钮
        addBtn() {
            this.addDialogVisible = true;
        },
        upload() {
            this.uploadShow = true;
        },
        downLoad() {
            if (!this.checkedData.length) {
                this.$message({
                    type: 'warning',
                    message: '请选择需要导出的数据!'
                });
                return false;
            }
            exportAreaPost(this.checkedData.map(item => item.areaCode)).then(res => {
                this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
            });
        },
        // 编辑
        editBtn(row) {
            this.dataRow = row;
            this.editDialogVisible = true;
        },
        switchChange(row) {
            var cloneRow = Object.assign({}, row);
            cloneRow.areaStatus = cloneRow.areaStatus ? 1 : 0;
            this.loading = true;
            updateStatus(cloneRow).then(res => {
                if (res) {
                    this.$message({
                        type: 'success',
                        message: res.msg
                    });
                    this.getTableDataList(this.searchObj);
                } else {
                    row.areaStatus = !row.areaStatus;
                    this.loading = false;
                }
            }).catch(() => {
                row.areaStatus = !row.areaStatus;
                this.loading = false;
            });
        },
        // 获取首页列表数据
        // eslint-disable-next-line
        // getTableDataList({ areaName, siteName, siteCode, startCreateTime, endCreateTime, pageSize, pageNo } = { areaName: '', siteName: '', siteCode: '', startCreateTime: '', endCreateTime: '', pageSize: 10, pageNo: 1 }) {
        //     const params = { areaName, siteName, siteCode, startCreateTime, endCreateTime, pageSize, pageNo };
        getTableDataList({ areaName, siteName, siteCode, chargeCode, pageSize, pageNo } = { areaName: '', siteName: '', siteCode: '', chargeCode: '', pageSize: 10, pageNo: 1 }) {
            const params = { areaName, siteName, siteCode, chargeCode, pageSize, pageNo };
            this.pageConfig.currentPage = params.pageNo;
            this.searchObj = params;
            this.loading = true;
            getAreaList(params).then(res => {
                if (res) {
                    res.data.list.forEach(item => {
                        item.areaStatus = !!item.areaStatus;
                    });
                    this.dataList = res.data.list || [];
                    this.pageConfig.total = res.data.totalCount;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        }
    },
    created() {
        // 获取首页列表数据
        this.getTableDataList();
    }
};
</script>

<style lang="less">
.configCenterAreaRules {
    background: #fff;
    padding: 16px;
    margin: 10px;

    .el-table__fixed::before, .el-table__fixed-right::before {
        height: 0;
    }
    .el-button--text {
        padding: 0;
    }
    .table-content {
        height: calc(100vh - 160px);
        overflow-y: auto;
    }
    .searchItem {
        margin-right: 8px;

        .searchFull {
            width: 100%;
            font-size: 12px;
        }
    }
    .el-pager {
        > li.active {
            border: 1px solid #00bcbf;
        }
        > li.active + li {
            border-left: 1px solid #ccc;
        }
        > li {
            border: 1px solid #ccc;
        }
    }
    .row-bg {
        margin-top: 10px;

        .page-text {
            display: flex;
        }
        .page-text > div {
            height: 28px;
            line-height: 28px;
            font-size: 12px;
            margin-right: 10px;
        }
        .text-color {
            color: #00BCBF;
            padding: 0 10px;
        }
        .table-pagination {
            float: inherit;
            text-align: end;
        }
    }
    .demo .el-switch__label {
        position: absolute;
        display: none;
        color: #fff;
    }
    /*打开时文字位置设置*/
    .demo .el-switch__label--right {
        z-index: 1;
        right: -10px;
    }
    /*关闭时文字位置设置*/
    .demo .el-switch__label--left {
        z-index: 1;
        left: 26px;
    }
    /*显示文字*/
    .demo .el-switch__label.is-active {
        display: block;
    }
    .demo.el-switch .el-switch__core,
    .el-switch .el-switch__label {
        width: 60px !important;
    }
    .dialog {
        .table-content {
            max-height: 200px;
            overflow-y: auto;
            margin-bottom: 30px;
        }
        .table-content:last-child {
            margin-bottom: 0;
        }
        .addGroup {
            margin-top: -1px;
            border-left: 0;
            text-align: center;
            height: 40px;
            line-height: 40px;
        }
    }
}
</style>