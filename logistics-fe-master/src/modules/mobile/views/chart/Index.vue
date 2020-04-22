<template >
    <div class="chart-control">
        <el-tabs v-model="active" @tab-click='tabClick'>
            <el-tab-pane label="装卸总览" name="loadUnloadDetail">
                <load-unload-detail v-if='active === "loadUnloadDetail"'></load-unload-detail>
            </el-tab-pane>
            <el-tab-pane label="车辆节点" name="vehicleNode">
                <vehicle-node v-if='active === "vehicleNode"'></vehicle-node>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>

import loadUnloadDetail from './loadUnloadDetail';
import vehicleNode from './vehicleNode';

export default {
    // name: 'Chart',
    components: { loadUnloadDetail, vehicleNode },
    data() {
        return {
            active: 'loadUnloadDetail'
        };
    },
    methods: {
        tabClick(data) {
        }
    }
};
</script>
<style lang="less">
.chart-control {
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
}
</style>