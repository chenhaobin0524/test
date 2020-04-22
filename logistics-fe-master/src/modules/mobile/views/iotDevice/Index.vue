<template >
    <div class="iot-device">
        <el-tabs v-model="active" @tab-click='tabClick'>
            <el-tab-pane label="道闸记录" name="signoRecord">
                <signoRecord v-if='active === "signoRecord"'></signoRecord>
            </el-tab-pane>
            <el-tab-pane label="人证记录" name="witnessRecord">
                <witnessRecord v-if='active === "witnessRecord"'></witnessRecord>
            </el-tab-pane>
            <el-tab-pane label="地磁记录" name="geomagnetismRecord">
                <geomagnetismRecord v-if='active === "geomagnetismRecord"'></geomagnetismRecord>
            </el-tab-pane>
            <el-tab-pane label="垛口计划" name="crenelPlan">
                <crenelPlan v-if='active === "crenelPlan"'></crenelPlan>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>

import signoRecord from './signoRecord';
import witnessRecord from './witnessRecord';
import geomagnetismRecord from './geomagnetismRecord';
import crenelPlan from './crenelPlan';

export default {
    // name: 'IotDevice',
    components: { signoRecord, witnessRecord, geomagnetismRecord, crenelPlan },
    data() {
        return {
            active: 'signoRecord'
        };
    },
    methods: {
        tabClick(data) {
        }
    }
};
</script>
<style lang="less">
.iot-device {
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