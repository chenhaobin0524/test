<template >
    <div class="njdc-control">
        <el-tabs v-model="activeName" @tab-click='tabClick'>
            <el-tab-pane label="预约概览" name="overviewReserve">
                <OverviewReserve v-if='activeName === "overviewReserve"' ref='OverviewReserve'></OverviewReserve>
            </el-tab-pane>
            <el-tab-pane label="预约单列表" name="reservesList">
                <ReservesList v-if='activeName === "reservesList"'></ReservesList>
            </el-tab-pane>
            <el-tab-pane label="备货区管理" name="storageAreaManage">
                <StorageAreaManage v-if='activeName === "storageAreaManage"'></StorageAreaManage>
            </el-tab-pane>
            <el-tab-pane label="垛口管理" name="palletizingManage">
                <PalletizingManage v-if='activeName === "palletizingManage"'></PalletizingManage>
            </el-tab-pane>
            <el-tab-pane label="地磁管理" name="geomagnetismManage">
                <GeomagnetismManage v-if='activeName === "geomagnetismManage"'></GeomagnetismManage>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import OverviewReserve from './overview-reserve/OverviewReserve.vue';
import ReservesList from './reserves-list/ReservesList.vue';
import StorageAreaManage from './storage-area-manage/StorageAreaManage.vue';
import PalletizingManage from './palletizing-manage/PalletizingManage.vue';
import GeomagnetismManage from './geomagnetism-manage/GeomagnetismManage.vue';

export default {
    // name: 'NJDC',
    components: { OverviewReserve, ReservesList, StorageAreaManage, PalletizingManage, GeomagnetismManage },
    data() {
        return {
            activeName: 'overviewReserve'
        };
    },
    methods: {
        tabClick(data) {
            if (data.name !== 'overviewReserve' && this.$refs.OverviewReserve) {
                clearTimeout(this.$refs.OverviewReserve.$refs.TimeLine.timeNum);
                this.$refs.OverviewReserve.$refs.TimeLine.cancelRequest();
                clearTimeout(this.$refs.OverviewReserve.timeNum);
                this.$refs.OverviewReserve.cancelRequest();
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.$refs.OverviewReserve) {
            clearTimeout(this.$refs.OverviewReserve.$refs.TimeLine.timeNum);
            this.$refs.OverviewReserve.$refs.TimeLine.cancelRequest();
            clearTimeout(this.$refs.OverviewReserve.timeNum);
            this.$refs.OverviewReserve.cancelRequest();
        }
        next();
    }
};
</script>
<style lang="less">
.njdc-control {
    margin: 10px;
    display: block;
    min-width: 1200px;

    .tabContent {
        background: #fff;
        padding: 10px;

        .el-button--text {
            padding: 0;
        }
        .table-pagination {
            margin-top: 10px;
            text-align: end;
        }
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
    .el-tabs__item {
        height: 28px;
        line-height: 28px;
    }
    .el-tabs__header {
        padding: 10px 16px 0 16px;
        border-radius: 4px 0;
        margin: 0;
        background: #ffffff;
    }
    .el-tabs__nav-wrap {
        overflow: initial;
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
}
</style>