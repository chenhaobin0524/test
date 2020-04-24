<template>
  <paper>
    <m-pane ref="tablePage" :config="config" :totalData="totalData" :pageTotal="pageTotal" :optionNum="optionNum"
      :loading="loading" @saveData="saveData" @edit-btn="editBtn" @searchChange="searchChange" @pageChange="pageChange"
      @sizeChange="sizeChange" @selectChange="selectChange" searchId="test" pageID="test">
      <div slot="table-module-btn">
        <el-tooltip class="item" effect="dark" content="新增" placement="bottom" v-has="'05160001'">
          <el-button size="mini" icon='el-icon-plus' @click="addData"></el-button>
        </el-tooltip>
      </div>
      <div slot="page-module-btn">
        <span v-has="'05160002'">
          <el-button type="primary" @click="saveData">保 存</el-button>
        </span>
        <span style="margin-left: 10px;" v-has="'05160003'">
          <el-button type="primary" @click="blockUP">停用</el-button>
        </span>
        <span style="margin-left: 10px;" v-has="'05160004'">
          <el-button type="primary" @click="startUse">启用</el-button>
        </span>
      </div>
    </m-pane>
  </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.js';
import paper from '@/components/core/paper/Paper';
import { bacchIncrease, batchStart, batchStop, inquireList } from '../../../api/limit';
export default {
    name: 'limit',
    components: { mPane, paper },
    data () {
        return {
            config: config,
            loading: false,
            optionNum: '',
            totalData: [],
            pageTotal: 0,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            selectRow: []
        };
    },
    methods: {
        rowDBclick (row) {
            // 表格内双击事件
        },
        checkBtn (data) {
            // 表格内按钮查看事件;
        },
        editBtn (data) {
            // 表格内按钮修改事件;
        },
        delBtn (data) {
            // 表格内按钮删除事件;
        },
        selectChange (data) {
            // 表格内选择变化
            this.selectRow = data;
        },
        switchChange (data) {
            // 表格内switch切换事件
        },
        searchChange (data) {
            // 提交搜索框
            this.searchParams = { ...this.searchParams, ...data, pageNo: 1 };
            this.fetchData();
        },
        pageChange (data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.fetchData();
        },
        sizeChange (data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            this.fetchData();
        },
        addData () {
            // 表格新增方法
            this.$refs.tablePage.$refs.table.addRow();
        },
        showImport () {
            this.$refs.Import.orderImportC();
        },
        saveData (data) {
            // 表格新增修改后返回数据
            const mData = this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData();
            if (mData.length <= 0 && mData !== false) {
                this.$message.warning('请至少选择一项');
                return;
            }
            if (!mData) {
                this.$message.error('必填项不能为空');
                return;
            }
            const selectData = mData.map(item => {
                item.enabledFalg = item.enabledFalg === 'Y' ? 1 : 0;
                // 新增时，没有ID
                const obj = item.id ? { id: item.id } : {};
                const { version, enabledFalg, upperReceverName, receiverAddress } = item;
                return {
                    version,
                    enabledFalg,
                    upperReceverName,
                    receiverAddress,
                    ...obj
                };
            });
            bacchIncrease(selectData).then((res) => {
                if (res && res.code === '0') {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.fetchData();
                }
            });
        },
        blockUP () {
            // 批量停用
            const data = this.selectRow;
            if (!data.length) {
                this.$message.warning('请至少选择一项');
                return;
            }
            const idList = [];
            data.map(item => {
                if (item.id) {
                    idList.push(item.id);
                }
            });
            if (idList.length === 0) {
                this.fetchData();
                return;
            };
            batchStop(idList).then(res => {
                if (res.code === '0') {
                    this.$message({
                        message: '停用成功',
                        type: 'success'
                    });
                    this.fetchData();
                }
            });
        },
        startUse () {
            // 批量启用
            const data = this.selectRow;
            if (!data.length) {
                this.$message.warning('请至少选择一项');
                return;
            }
            const idList = [];
            data.map(item => {
                if (item.id) {
                    idList.push(item.id);
                }
            });
            if (idList.length === 0) {
                this.fetchData();
                return;
            }
            batchStart(idList).then(res => {
                if (res.code === '0') {
                    this.$message({
                        message: '启用成功',
                        type: 'success'
                    });
                    this.fetchData();
                };
            });
        },
        getTableConfigList (data) {
        },
        async fetchData () {
            const res = await inquireList(this.searchParams);
            if (res) {
                // 当前页码大于数据总页数的时候，取最大页数并重新获取数据
                if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.fetchData();
                } else {
                    this.totalData = res.data.list.map(item => {
                        item.enabledFalg = item.enabledFalg + '' === '1' ? 'Y' : 'N';
                        return { ...item };
                    });
                    this.pageTotal = res.data.totalCount;
                }
            } else {
                this.totalData = [];
            }
        }
    },
    created () {
    // 调用请求数据的方法
        this.fetchData();
    }
};
</script>
