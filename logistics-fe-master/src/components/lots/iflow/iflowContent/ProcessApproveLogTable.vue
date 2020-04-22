<template>
    <div>
        <div class="process-head">流转日志</div>
        <m-table
        ref="table"
        :totalDate="config.table"
        :tableData="totalData"
        :loading="false"
        :tableList='tableList'
        @onSelectionChange="selectChange"
        @row-db-click="rowDBclick"
        @column-filter-search="columnFilterSearch"
        ></m-table>
        <el-collapse class="process-graph" @change=handleGraphChange>
            <el-collapse-item>
                <template slot="title">流转图</template>
                <iframe v-if="graphVisible" :src="iFrameSrc" width="100%" height="300" frameborder="0"></iframe>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import mTable from '@/components/awesome/page/mPanel3/mTable';
import { parseTime } from '@/utils';
import infoConfig from './processApproveLogInfo.json';
import { getApprovalRecords } from '../api';

export default {
    components: { mTable },
    props: {
        fdId: {
            default() {
                return '';
            }
        }
    },
    data() {
        return {
            graphVisible: false,
            config: infoConfig,
            totalData: [],
            tableList: '',
            iFrameSrc: `http://iflowsit.midea.com/mse/resource/flowchart/index.html?role=outsider&fdId=${this.fdId}&appId=null&viewPage=true`
        };
    },
    computed: {
        ...mapState({
            fdStatus: state => state.fdStatus, // 当前流程状态
            fdStatusSetTime: state => state.fdStatusSetTime
        })
    },
    methods: {
        getTableTitle() {
            let laberString = [];
            this.config.table.columns.map(data => {
                laberString.push(data.label);
            });
            laberString = laberString.join(',');
            this.tableList = laberString;
        },
        selectChange(selection) {
            this.$emit('selectChange', selection);
        },
        rowDBclick(row) {
            this.$emit('rowDBclick', row);
        },
        columnFilterSearch(data) {
            this.$emit('columnFilterSearch', data);
        },
        getApprovalRecordsData() {
            // 获取流程审批记录
            getApprovalRecords({
                'fdId': this.fdId
            }).then(res => {
                if (res.code === '0') {
                    this.totalData = res.data.map(item => {
                        if (item.fdHandlerTime) {
                            item.fdHandlerTime = parseTime(item.fdHandlerTime);
                        }
                        return item;
                    });
                }
            });
        },
        handleGraphChange(data) {
            if (data.length > 0) {
                this.graphVisible = true;
            } else {
                this.graphVisible = false;
            }
        }
    },
    mounted() {
        this.getTableTitle();
        if (this.fdId) {
            this.getApprovalRecordsData();
        }
    },
    watch: {
        fdId(val, oldVal) {
            if (val && val !== oldVal) {
                this.getApprovalRecordsData();
            }
        },
        fdStatusSetTime: function (val, oldVal) {
            if (val !== oldVal && this.fdId) {
                this.getApprovalRecordsData();
            }
        }
    }
};
</script>
<style lang="less">
.process-head {
    font-size: 15px;
    font-weight:bold;
    margin: 10px 0;
}
.process-foot {
    font-size: 15px;
    font-weight:bold;
    margin: 10px 0;
}
.process-graph {
    .el-collapse-item__header {
        padding-left: 25px;
        font-size: 15px;
        font-weight: bold;
        position: relative;

        .el-collapse-item__arrow {
            position: absolute;
            left: 0;
        }
    }
}
</style>
