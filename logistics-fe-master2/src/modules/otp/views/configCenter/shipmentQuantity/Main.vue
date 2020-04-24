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
                <span v-has="'05110001'"><el-button type="primary" @click="redomet">删 除</el-button></span>
                <span style="margin-left: 10px;" v-has="'05110002'"><el-button type="primary" @click="saveData">保 存</el-button></span>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import { messageBox } from '../../../utils/messageBox';
import { shipmentQuantity, shipmentQuantityAdd, shipmentQuantityDelete } from '../../../api/configCenter';
import { isInt, maxLength, isBigDecimal } from '../../../judge/configCenter';

export default {
    name: 'shipmentQuantity',
    components: { mPane, paper },
    data() {
        return {
            config: config,
            loading: false,
            optionNum: '',
            totalData: [],
            searchTotalTitle: config.searchTotalTitle,
            pageTotal: 0,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            selectRow: []
        };
    },
    methods: {
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
            this.$refs.tablePage.$refs.table.addRow();
        },
        saveData(data) {
            // 表格新增修改后返回数据
            const params = this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData();
            if (!params.length && params !== false) {
                this.$message.warning('请选择要保存的数据');
                return;
            }
            if (!params) {
                this.$message.error('必填项不能为空');
                return;
            }
            for (let i = 0; i < params.length; i++) {
                if (!isInt(params[i].qty)) {
                    this.$message.error('件数只能为正整数');
                    return;
                }
                if (!isBigDecimal(params[i].volume + '', 6, 2)) {
                    this.$message.error('方量只能为整数不超过6位,小数不超过2位的数字');
                    return;
                }
                if (!maxLength(params[i].qty + '', 8)) {
                    this.$message.error('件数不能超过8位数');
                    return;
                }
            }
            shipmentQuantityAdd(params).then(res => {
                if (res.code === '0') {
                    this.$message.success('操作成功');
                    this.getList();
                }
            });
        },
        redomet(data) {
            // 这是删除方法
            const params = this.selectRow;
            if (!params.length) {
                this.$message.warning('请选择要删除的数据');
                return;
            }
            const idList = [];
            params.map(item => {
                if (item.id) {
                    idList.push(item.id);
                }
            });
            if (!idList.length) {
                this.getList();
                return;
            }
            const id = idList.join(',');
            messageBox(this).then(() => {
                shipmentQuantityDelete(params, id).then(res => {
                    if (res.code === '0') {
                        this.$message.success('删除成功');
                        this.getList();
                    }
                });
            });
        },
        refresh() {
            // 表格内刷新按钮
        },
        async getList(params = {}) {
            const res = await shipmentQuantity(this.searchParams);
            if (res) {
                if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.getList();
                } else {
                    this.totalData = res.data.list || [];
                    this.pageTotal = res.data.totalCount;
                }
            } else {
                this.totalData = [];
            }
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
