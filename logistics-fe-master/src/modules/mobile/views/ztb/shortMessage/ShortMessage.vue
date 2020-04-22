<template>
    <Paper class='short-message'>
        <m-panel
        ref="tablePage"
        :config="config"
        :totalData="totalData"
        :pageTotal="pageTotal"
        :loading="loading"
        @searchChange="searchChange"
        @pageChange="pageChange"
        @sizeChange="sizeChange">
        <div slot="table-module-btn">
            <div class="icon-button">
                <el-button type="primary" @click="sentMessage">短信发送</el-button>
            </div>
        </div>
        <div slot="custom-table-column-qty" slot-scope='props'>
            <span :class="{'column-status-normal': props.value.value <= 30, 'column-status': props.value.value > 30}">{{props.value.value}}</span>
        </div>
        </m-panel>
        <el-dialog
            title="发送短信"
            :visible.sync="sentMessageDialog"
            width="40%">
            <el-form  :model="messageInfo" label-width="60px">
                <el-form-item label="手机号" prop="phoneNo">
                    <el-input type="textarea" v-model="messageInfo.phoneNo" rows="5" placeholder="多个用英文，号隔开"></el-input>
                </el-form-item>
                <el-form-item label="信息内容" prop="messageContent">
                    <el-input type="textarea" v-model="messageInfo.messageContent" rows="5" placeholder="多个用英文，号隔开"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sentMessageDialog = false">取 消</el-button>
                <el-button type="primary" @click="dataSure">确 定</el-button>
            </span>
        </el-dialog>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import mPanel from '@/components/awesome/page/mPanel3';
import config from './config.json';
import api from '../../../api/ztb/warehouse.js';
export default {
    name: 'orderInfo',
    data() {
        return {
            config: config,
            totalData: [],
            pageTotal: 0,
            selectedRows: [],
            loading: false,
            pageNo: 1,
            pageSize: 10,
            searchTerm: {},
            sentMessageDialog: false,
            messageInfo: {
                type: '',
                phoneNo: '',
                messageContent: ''
            }
        };
    },
    methods: {
        searchChange(data) {
            this.pageNo = 1;
            this.config.page.pageSize = this.pageSize;
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
        loadData() {
            this.loading = true;
            const params = {
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
        },
        sentMessage() {
            this.sentMessageDialog = true;
        },
        dataSure() {
            this.sentMessageDialog = false;
        }
    },
    mounted() {
        this.loadData();
    },
    components: { Paper, mPanel }
};
</script>
<style lang='less'>
.short-message {
    .el-cascader {
        width: 100%
    }
    .column-status {
        color: #FF3300;
    }
    .column-status-normal {
        color: #00BCBF;
    }
}
</style>