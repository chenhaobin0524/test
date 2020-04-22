<template>
    <paper>
        <m-pane
                ref="tablePage"
                :config="config"
                :totalData="totalData"
                :pageTotal="pageTotal"
                :optionNum="optionNum"
                :loading="loading"
                @saveData="saveData"
                @edit-btn="editBtn"
                @searchChange="searchChange"
                @selectChange="selectChange"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
                @element-change="elementChange"
                searchId="test"
                pageID="test">
            <div slot="table-module-btn">
                <el-tooltip class="item" effect="dark" content="新增" placement="bottom">
                    <el-button size="mini" icon='el-icon-plus' @click="addData"></el-button>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span v-has="'05080001'"><el-button type="primary" @click="redomet">删 除</el-button></span>
                <span style="margin-left: 10px;" v-has="'05080002'"><el-button type="primary" @click="saveData">保 存</el-button></span>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import { messageBox } from '../../../utils/messageBox';
import {
    getWmsConfirmRules,
    batchUpdateWmsConfirmRules,
    batchDeleteWmsConfirmRules
} from '../../../api/configCenter';

export default {
    name: 'wms',
    components: { mPane, paper },
    data() {
        return {
            config: config,
            columns: config.table.columns,
            loading: false,
            optionNum: '',
            totalData: [],
            // 选中的行数
            selectData: [],
            pageTotal: 0,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            }
        };
    },
    methods: {
        async fetchData() {
            const res = await getWmsConfirmRules(this.searchParams);
            if (res) {
                if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.fetchData();
                } else {
                    res.data.list.forEach(element => {
                        // element.partFlag = element.partFlag === 1 ? 'Y' : 'N';
                        // element.batchFlag = element.batchFlag === 1 ? 'Y' : 'N';
                        // element.statusCheck = element.statusCheck === 1 ? 'Y' : 'N';
                        element.itemStatus = element.itemStatus ? element.itemStatus.split(',') : '';
                        // 判断默认禁用字段
                        if (element.statusCheck === 1) {
                            element.disableProps = ['itemStatus'];
                        }
                    });
                    this.totalData = res.data.list || [];
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
            this.selectData = data;
        },
        elementChange(data) {
            this.validatePropsIsDisabled(data.row);
        },
        // 校验属性禁用规则
        validatePropsIsDisabled(row) {
            if (row['statusCheck'] === 1) {
                row.itemStatus = '';
                row.disableProps = ['itemStatus'];
            } else {
                row.disableProps = [];
            }
        },
        searchChange(data) {
            // 提交搜索框
            this.searchParams = { ...this.searchParams, ...data, pageNo: 1 };
            this.fetchData();
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
        async saveData() {
            if (!this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData()) {
                return;
            }
            if (this.selectData.length < 1) {
                this.$message.warning('至少勾选一条数据进行操作');
                return;
            }
            // 表格新增修改后返回数据
            const selectData = this.selectData.map(item => {
                const obj = item.id ? { id: item.id } : {};
                let { sourceSystem, orderType, partFlag, batchFlag, statusCheck, itemStatus, version } = item;
                // partFlag = partFlag === 'Y' ? 1 : 0;
                // batchFlag = batchFlag === 'Y' ? 1 : 0;
                // statusCheck = statusCheck === 'Y' ? 1 : 0;
                itemStatus = itemStatus ? itemStatus.join(',') : '';
                return {
                    sourceSystem,
                    orderType,
                    partFlag,
                    batchFlag,
                    statusCheck,
                    itemStatus,
                    version,
                    ...obj
                };
            });
            const res = await batchUpdateWmsConfirmRules(selectData);
            if (res) {
                this.$message.success('保存成功');
                this.fetchData();
            }
        },
        async redomet() {
            // 这是删除方法
            if (this.selectData.length < 1) {
                this.$message.warning('至少勾选一条数据进行操作');
                return;
            }
            // 表格删除后返回数据
            const selectData = this.selectData.filter(item => item.id).map(item => item.id);
            if (selectData.length > 0) {
                messageBox(this).then(async () => {
                    const res = await batchDeleteWmsConfirmRules(selectData);
                    if (res) {
                        this.$message.success('删除成功');
                    }
                    this.fetchData();
                });
            }
        },
        getTableConfigList(data) {
        },
        refresh() {
            // 表格内刷新按钮
        }
    },
    mounted() {
        this.fetchData();
    }
};
</script>
