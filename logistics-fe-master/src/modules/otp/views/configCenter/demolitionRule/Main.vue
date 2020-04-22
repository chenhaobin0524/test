<template>
    <paper>
        <m-pane ref="tablePage"
                :config="config"
                :totalData="totalData"
                :pageTotal="pageTotal"
                :optionNum="optionNum"
                :loading="loading"
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
                <span v-has="'05040001'"><el-button type="primary" @click="redomet">删 除</el-button></span>
                <span style="margin-left: 10px;" v-has="'05040002'"><el-button type="primary" @click="saveData">保 存</el-button></span>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import { saveArr, empty, doubleDate, doubleDateDecimal, doubleDateInteger } from '../../../judge/configCenter';
import { messageBox } from '../../../utils/messageBox';
import {
    getApartRules,
    batchCreateOrUpdate,
    batchDeleteByBusinessKey
} from '../../../api/configCenter';

export default {
    name: 'orderSplit',
    components: { mPane, paper },
    data() {
        return {
            config: config,
            loading: false,
            optionNum: '',
            totalData: [],
            // 选中的行数
            selectData: [],
            pageTotal: 10,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            }
        };
    },
    methods: {
        async fetchData() {
            const res = await getApartRules(this.searchParams);
            if (res) {
                // 当前页码大于数据总页数的时候，取最大页数并重新获取数据
                if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.fetchData();
                } else {
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
        switchChange(data) {
            // 表格内switch切换事件
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
            this.$refs.tablePage.$refs.table.addRow();
        },
        getTableConfigList(data) {
        },
        refresh() {
            // 表格内刷新按钮
        },
        async saveData() {
            const msg = this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData();
            if (!msg) {
                return;
            }
            if (!saveArr(msg)) {
                this.$message.error('至少勾选一条数据进行操作');
                return;
            }
            for (let i = 0; i < msg.length; i++) {
                if (!empty(msg[i].orderType)) {
                    return;
                }
                if (!msg[i].apartType) {
                    return;
                }
                msg[i].volume = msg[i].volume.replace(/(^\s*)|(\s*$)/g, '');
                if (empty(msg[i].volume)) {
                    if (doubleDate(msg[i].volume)) {
                        this.$message.error('【默认值】请输入数字！');
                        return;
                    }
                    if (!doubleDate(msg[i].volume)) {
                        if (doubleDateDecimal(msg[i].volume, 2) > 2) {
                            this.$message.error('【默认值】请输入两位小数！');
                            return;
                        }
                    }
                    if (doubleDateInteger(msg[i].volume, 4) > 4) {
                        this.$message.error('【默认值】最大输入4位整数！');
                        return;
                    }
                }
            }
            // 表格新增修改后返回数据
            const selectData = this.selectData.map(item => {
                const obj = item.id ? { id: item.id } : {};
                const { sourceSystem, orderType, apartType, volume } = item;
                return { sourceSystem, orderType, apartType, volume, ...obj };
            });
            const res = await batchCreateOrUpdate(selectData);
            if (res.code === '0') {
                this.$message.success('保存成功');
            }
            this.fetchData();
        },
        async redomet() {
            // 这是删除方法
            if (this.selectData.length < 1) {
                this.$message.warning('至少勾选一条数据进行操作');
                return;
            }
            // 表格删除后返回数据
            const selectData = this.selectData.map(item => item.id);
            messageBox(this).then(async () => {
                const res = await batchDeleteByBusinessKey(selectData);
                if (res.code === '0') {
                    this.$message.success('删除成功');
                }
                this.fetchData();
            });
        }
    },
    mounted() {
        this.fetchData();
    }
};
</script>
