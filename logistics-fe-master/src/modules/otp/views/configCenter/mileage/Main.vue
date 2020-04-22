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
                searchId="test"
                pageID="test">
            <div slot="table-module-btn">
                <el-tooltip class="item"
                            effect="dark"
                            content="新增"
                            placement="bottom">
                    <el-button size="mini"
                               icon='el-icon-plus'
                               @click="addData"></el-button>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <el-button type="primary"
                           @click="redomet">删 除</el-button>
                <el-button type="primary"
                           @click="saveData">保 存</el-button>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import { isBigDecimal } from '../../../judge/configCenter';
import { messageBox } from '../../../utils/messageBox';
import { getMileageList, addMileage, deleteMileage } from '../../../api/configCenter';

export default {
    name: 'mileage',
    components: { mPane, paper },
    data() {
        return {
            config: config,
            columns: config.table.columns,
            loading: false,
            optionNum: '',
            totalData: [],
            pageTotal: 10,
            searchTotalTitle: config.searchTotalTitle,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            selectRow: [],
            mustFillParams: {
                startLevel: '',
                endLevel: '',
                endAddressCode: '',
                startAddressCode: '',
                mileage: ''
            }
        };
    },
    methods: {
        getList() {
            getMileageList(this.searchParams).then(res => {
                if (res) {
                    if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                        this.searchParams.pageNo = res.data.totalPage;
                        this.getList();
                    } else {
                        res.data.list = res.data.list.map(item => {
                            return { ...this.mustFillParams, ...item };
                        });
                        this.totalData = res.data.list || [];
                        this.pageTotal = res.data.totalCount;
                    }
                } else {
                    this.totalData = [];
                }
            });
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
            this.selectRow = data;
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        searchChange(data) {
            // 提交搜索框
            if (!data.startAddressCode.length) {
                data.startAddressCode = '';
            } else {
                data.startAddressCode = data.startAddressCode[data.startAddressCode.length - 1];
            }
            if (!data.endAddressCode.length) {
                data.endAddressCode = '';
            } else {
                data.endAddressCode = data.endAddressCode[data.endAddressCode.length - 1];
            }
            this.searchParams = { ...this.searchParams, ...data, pageNo: 1 };
            this.getList();
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.getList();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            this.getList();
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
        judge(level, obj, str) {
            if (level === 'DISTRICT') {
                if (obj.length !== 7) {
                    this.$message.warning(`${str}与选择的${str}级别不符，请重新选择`);
                    return true;
                }
                return false;
            } else if (level === 'TOWN') {
                if (obj.length !== 10) {
                    this.$message.warning(`${str}与选择的${str}级别不符，请重新选择`);
                    return true;
                }
                return false;
            } else {
                this.$message.warning(`请先选择${str}级别`);
            }
        },
        validatePropsIsDisabled(row) {
            const arr = [];
            if (!row.startLevel) {
                arr.push('startAddressCode');
            }
            if (!row.endLevel) {
                arr.push('endAddressCode');
            }
            row.disableProps = arr;
        },
        elementChange({ prop, val, row, index }) {
            const PLACE_TYPE = {
                DISTRICT: 3,
                TOWN: 4
            };
            if (prop === 'startLevel') {
                row.startAddressCode = [];
                row.startAddressCodeLayers = PLACE_TYPE[val];
            } else if (prop === 'endLevel') {
                row.endAddressCode = [];
                row.endAddressCodeLayers = PLACE_TYPE[val];
            }
            this.validatePropsIsDisabled(row);
        },
        saveData(data) {
            // 表格新增修改后返回数据
            const list = JSON.parse(JSON.stringify(this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData()));
            if (!list.length && list !== false) {
                this.$message.warning('请先勾选要保存的数据');
                return;
            }
            if (!list) {
                this.$message.error('必填项不能为空');
                return;
            }
            for (let i = 0; i < list.length; i++) {
                if (list[i].startAddressCode && typeof list[i].startAddressCode !== 'string') {
                    list[i].startAddressCode = list[i].startAddressCode[list[i].startAddressCode.length - 1];
                }
                if (this.judge(list[i].startLevel, list[i].startAddressCode, '起始地')) {
                    return;
                }
                if (list[i].endAddressCode && typeof list[i].endAddressCode !== 'string') {
                    list[i].endAddressCode = list[i].endAddressCode[list[i].endAddressCode.length - 1];
                }
                if (this.judge(list[i].endLevel, list[i].endAddressCode, '目的地')) {
                    return;
                }
                if (!isBigDecimal(list[i].mileage + '', 8, 2)) {
                    this.$message.error('请输入最大八位整数位两位小数位的数字');
                    return;
                }
                list[i].mileage = parseFloat(list[i].mileage);
            }
            addMileage(list).then(res => {
                if (res.code === '0') {
                    this.$message.success('操作成功');
                    this.getList();
                }
            });
        },
        redomet(data) {
            // 这是删除方法
            const list = this.selectRow;
            if (!list.length) {
                this.$message.warning('请先勾选要删除的数据');
                return;
            }
            const idList = [];
            list.map(item => {
                if (item.id) {
                    idList.push(item.id);
                }
            });
            if (!idList.length) {
                this.getList();
                return;
            }
            messageBox(this).then(() => {
                deleteMileage(idList).then(res => {
                    if (res.code === '0') {
                        this.$message.success('删除成功');
                        this.getList();
                    }
                });
            });
        },
        getTableConfigList(data) {
        },
        refresh() {
            // 表格内刷新按钮
        }
    },
    created() {
        this.getList();
    }
};
</script>
