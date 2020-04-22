<template>
    <Paper>
        <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="待处理" name="first">
                    <el-table
                        :data="runningData.list"
                        style="width: 100%">
                        <el-table-column
                            prop="fdId"
                            label="流程"
                            width="200">
                        </el-table-column>
                        <el-table-column
                            prop="fdSubject"
                            label="标题">
                            <template slot-scope="scope">
                                <a class="link-title" v-if="scope.row.fdUrl" :href="scope.row.fdUrl" target="_blank">{{ scope.row.fdSubject }}</a>
                                <span v-else="">{{ scope.row.fdSubject }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="fdNodeId"
                            label="当前序号"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="fdNodeName"
                            label="当前节点"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="docCreatorName"
                            label="创建者"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="fdHandlerName"
                            label="当前处理人"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="fdStatus"
                            label="状态"
                            width="100">
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        class="process-list-pagination"
                        @size-change="handleSizeChange('runningData', $event)"
                        @current-change="handleCurrentChange('runningData', $event)"
                        :current-page="runningData.page"
                        :page-sizes="[10, 20, 30 ,50, 100]"
                        :page-size="10"
                        :background="true"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="runningData.total">
                    </el-pagination>
                </el-tab-pane>

                <el-tab-pane label="已审批/处理" name="second">
                    <el-table
                        :data="workedData.list"
                        style="width: 100%">
                        <el-table-column
                            prop="fdId"
                            label="流程"
                            width="200">
                        </el-table-column>
                        <el-table-column
                            prop="fdSubject"
                            label="标题">
                            <template slot-scope="scope">
                                <a class="link-title" v-if="scope.row.fdUrl" :href="scope.row.fdUrl" target="_blank">{{ scope.row.fdSubject }}</a>
                                <span v-else="">{{ scope.row.fdSubject }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="fdNodeName"
                            label="当前节点"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="docCreatorName"
                            label="创建者"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="fdHandlerName"
                            label="当前处理人"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="fdStatus"
                            label="状态"
                            width="100">
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        class="process-list-pagination"
                        @size-change="handleSizeChange('workedData', $event)"
                        @current-change="handleCurrentChange('workedData', $event)"
                        :current-page="workedData.page"
                        :page-sizes="[10, 20, 30 ,50, 100]"
                        :page-size="10"
                        :background="true"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="workedData.total">
                    </el-pagination>
                </el-tab-pane>

                <el-tab-pane label="已启动" name="third">
                    <el-table
                        :data="startData.list"
                        style="width: 100%">
                        <el-table-column
                            prop="fdRelId"
                            label="流程"
                            width="200">
                        </el-table-column>
                        <el-table-column
                            prop="docSubject"
                            label="标题">
                            <template slot-scope="scope">
                                <a class="link-title" v-if="scope.row.fdUrl" :href="scope.row.fdUrl" target="_blank">{{ scope.row.docSubject }}</a>
                                <span v-else="">{{ scope.row.docSubject }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="创建时间"
                            width="200">
                            <template slot-scope="scope">
                                {{ formatDate(scope.row.docCreateTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="docStatus"
                            label="状态"
                            width="100">
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        class="process-list-pagination"
                        @size-change="handleSizeChange('startData', $event)"
                        @current-change="handleCurrentChange('startData', $event)"
                        :current-page="startData.page"
                        :page-sizes="[10, 20, 30 ,50, 100]"
                        :page-size="10"
                        :background="true"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="startData.total">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import moment from 'moment';
import { getMyRunningProcess, getMyWorkedProcess, getMyStartProcess } from '../../api/iflow-common.js';

export default {
    components: {
        Paper
    },
    data() {
        return {
            activeName: 'first',
            runningData: {
                list: [],
                page: 1,
                pageSize: 10,
                total: 0
            },
            workedData: {
                list: [],
                page: 1,
                pageSize: 10,
                total: 0
            },
            startData: {
                list: [],
                page: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    computed: {
        loginName() {
            return this.$store.state.user.userCode;
        }
    },
    methods: {
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        getMyRunningData() {
            const { loginName } = this;
            const { pageSize, page } = this.runningData;
            getMyRunningProcess({
                loginName,
                pageSize,
                page
            }).then(res => {
                if (res.data.list && res.code === '0') {
                    this.runningData.list = res.data.list;
                    this.runningData.total = res.data.rowCount;
                }
            });
        },
        getWorkedData() {
            const { loginName } = this;
            const { pageSize, page } = this.workedData;
            getMyWorkedProcess({
                loginName,
                pageSize,
                page
            }).then(res => {
                if (res.data.list && res.code === '0') {
                    this.workedData.list = res.data.list;
                    this.workedData.total = res.data.rowCount;
                }
            });
        },
        getMyStartData() {
            const { loginName } = this;
            const { pageSize, page } = this.startData;
            getMyStartProcess({
                loginName,
                pageSize,
                page
            }).then(res => {
                if (res.data.list && res.code === '0') {
                    this.startData.list = res.data.list;
                    this.startData.total = res.data.rowCount;
                }
            });
        },
        handleSizeChange(type, size) {
            switch (type) {
            case 'runningData':
                this.runningData.pageSize = size;
                this.getMyRunningData();
                break;
            case 'workedData':
                this.workedData.pageSize = size;
                this.getWorkedData();
                break;
            case 'startData':
                this.startData.pageSize = size;
                this.getMyStartData();
                break;
            default:
            }
        },
        handleCurrentChange(type, page) {
            switch (type) {
            case 'runningData':
                this.runningData.page = page;
                this.getMyRunningData();
                break;
            case 'workedData':
                this.workedData.page = page;
                this.getWorkedData();
                break;
            case 'startData':
                this.startData.page = page;
                this.getMyStartData();
                break;
            default:
            }
        },
        formatDate(timestamp) {
            return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    mounted() {
        this.getMyRunningData();
        this.getWorkedData();
        this.getMyStartData();
    }
};
</script>
<style lang="less" scoped>
// .link-title {

// }
.process-list-pagination {
    margin-top: 20px;
    float: right;

    /deep/ & {
        .btn-prev, .btn-next, .el-pager li {
            background-color: rgb(255, 255, 255);
            border: 1px solid rgb(204, 204, 204);
        }
    }
}
</style>
