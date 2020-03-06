<template>
    <div id="transTable_table">
        <el-row class="row">
            <el-col :span="19">
                <el-input placeholder="请输入搜索内容"></el-input>
            </el-col>
            <el-col :span="3" :offset="2">
                <el-button type="primary">搜索</el-button>
            </el-col>
        </el-row>
        <div>
            <el-table ref='table' :data="tableData" border @selection-change="selectChange">
                <el-table-column
                    v-for="(column,index) in leftColumns"
                    :key="index"
                    :label="column.label"
                    :property="column.prop"
                    :width="column.width"
                ></el-table-column>
                <el-table-column type="selection" width="36" fixed="right" v-if="tableType==='left'"></el-table-column>
                <el-table-column label="操作" width="80" fixed="right" v-else>
                    <template slot-scope='scope'>
                        <el-button type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    props: {
        leftColumns: Array,
        tableData: Array,
        tableType: String
    },
    methods: {
        selectChange(selection) {
            this.$emit('selectChange', { selection });
        },
        deleteRow(row) {
            this.$emit('deleteRow', row);
        }
    }
};
</script>

<style lang="less">
    #transTable_table{
        .row{
            margin-bottom:16px;
        }
    }
</style>
