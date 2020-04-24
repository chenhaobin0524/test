<template>
    <Paper>
        <div class="netTask-details">
            <table-info class="table-info" :tableConf="data.transportTable" :tableColumns="data.transportTable.columns" :tableData="transportTableData"></table-info>
            <el-card class="box-card">
                <div class="table-header">
                    <div class="table-header-left">
                        <span>
                            &nbsp;&nbsp;总里程：{{totalMileage}}Km（ 装货补贴里程：{{loadSubsidyMileage}}Km&nbsp;&nbsp;/&nbsp;&nbsp;
                            卸货补贴里程：{{unloadSubsidyMileage}}Km&nbsp;&nbsp;/&nbsp;&nbsp; 串点里程：{{subsidyMileage}}Km ）
                        </span>
                    </div>
                    <span v-has="'10040002'"><el-button class="table-header-right" type="primary" @click="handleAdjust"
                        v-if="!(inOutType === 'IN' || +pushBmsStatus === 1)">调 整</el-button></span>
                </div>
                <table-info :tableConf="data.dispatchItems" :tableColumns="data.dispatchItems.columns" :tableData="dispatchItemsData"></table-info>
                <table-info :tableConf="data.dispatchListsItems" :tableColumns="data.dispatchListsItems.columns" :tableData="dispatchListsItemsData"></table-info>
            </el-card>
        </div>
        <adjust-dialog v-if='isShowAdjust' :showAdjust.sync="isShowAdjust" @adjustClose="adjustClose"></adjust-dialog>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import data from './data.js';
import _ from '@/components/lots/utils';
import { getSearchdetails, getOptimizationLists, dictLists } from '../../../../api/netDeparture.js';
import TableInfo from '../../components/SimpleTable/Table';
import AdjustDialog from './AdjustDialog';
export default {
    name: 'netDepartureDetails',
    components: { Paper, TableInfo, AdjustDialog },
    data() {
        return {
            process: {},
            infoData: [],
            transportTableData: [],
            dispatchItemsData: [],
            dispatchListsItemsData: [],
            data,
            isShowAdjust: false,
            totalMileage: '',
            loadSubsidyMileage: '',
            unloadSubsidyMileage: '',
            subsidyMileage: '',
            inOutType: '',
            pushBmsStatus: ''
        };
    },
    methods: {
        getBusinessType() {
            const params = {
                dictCode: 'BUSINESS_TYPE'
            };
            dictLists(params).then(res => {
                const taskObj = {};
                for (let index = 0; index < res.data.list.length; index++) {
                    taskObj[res.data.list[index].code] = res.data.list[index].name;
                }
                sessionStorage.setItem('BUSINESS_TYPE', JSON.stringify(taskObj));
            });
        },
        operation() {},
        load() {
            this.loadOpionsList();
            this.loadOptimizationLists();
        },
        loadOpionsList() {
            getSearchdetails(this.$route.query.dispatchInventedNo).then(res => {
                if (res) {
                    this.transportTableData = res.data || [];
                    this.transportTableData.map(item => {
                        item.businessTypeName = window.sessionStorage.BUSINESS_TYPE ? JSON.parse(window.sessionStorage.BUSINESS_TYPE)[item.businessType] : item.businessType;
                    });
                }
            });
        },
        loadOptimizationLists() {
            this.dispatchItemsData = [];
            this.dispatchListsItemsData = [];
            getOptimizationLists(this.$route.query.dispatchInventedNo).then(res => {
                if (res) {
                    const data = res.data;
                    this.dispatchItemsData = data.loadList || [];
                    this.dispatchListsItemsData = data.unloadList || [];
                    this.totalMileage = data.totalMileage;
                    this.loadSubsidyMileage = data.loadSubsidyMileage;
                    this.subsidyMileage = data.subsidyMileage;
                    this.unloadSubsidyMileage = data.unloadSubsidyMileage;
                }
            });
        },
        handleAdjust() {
            this.isShowAdjust = true;
        },
        adjustClose() {
            this.isShowAdjust = false;
        }
    },
    mounted() {
        this.load();
    },
    created() {
        this.inOutType = this.$route.query.inOutType;
        this.pushBmsStatus = this.$route.query.pushBmsStatus;
        this.process = _.clone(data.process);
        this.infoData = _.clone(data.infoData);
        this.getBusinessType();
    },
    activated() {
        this.load();
    }
};
</script>
<style lang="less">
    .netTask-details {
        .table-info {
            margin: 10px 0 20px 0;
        }
        .el-card__body {
            padding: 0;
        }
        .table-header {
            margin: 10px 0 5px 0;
            overflow: hidden;
            padding-right: 8px;
        }
        .table-header-left {
            float: left;
        }
        .table-header-right {
            float: right;
        }
    }
</style>