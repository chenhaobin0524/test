<template>
    <Paper class="example">
        <div class="departure">
            <div class="content">
                <speed></speed>
            </div>
            <vehicle></vehicle>
            <div class="tab1">
                <template>
                    <el-table :data="tableData" border>
                        <el-table-column prop="date" label="订单号" width="120"></el-table-column>
                        <el-table-column prop="name" label="运输单号" width="120"></el-table-column>
                        <el-table-column prop="address" label="合同编号"></el-table-column>
                        <el-table-column prop="date" label="订单号" width="120"></el-table-column>
                        <el-table-column prop="name" label="运输单号" width="120"></el-table-column>
                        <el-table-column prop="address" label="合同编号"></el-table-column>
                        <el-table-column prop="date" label="订单号" width="120"></el-table-column>
                        <el-table-column prop="name" label="运输单号" width="120"></el-table-column>
                        <el-table-column prop="address" label="合同编号"></el-table-column>
                        <el-table-column prop="date" label="订单号" width="120"></el-table-column>
                        <el-table-column prop="name" label="运输单号" width="120">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.roleName"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" label="合同编号"></el-table-column>
                        <el-table-column prop="date" label="订单号" width="120"></el-table-column>
                        <el-table-column prop="name" label="运输单号" width="120"></el-table-column>
                        <el-table-column prop="address" label="合同编号"></el-table-column>
                    </el-table>
                </template>
            </div>

            <template>
                <el-table :data="tableData" border>
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                        header-align="center"
                        align="center"
                    ></el-table-column>
                    <el-table-column prop="date" label="站点名称" width="120"></el-table-column>
                    <el-table-column prop="name" label="站点编码" width="120"></el-table-column>
                    <el-table-column prop="address" label="站点地址"></el-table-column>
                    <el-table-column prop="date" label="站点作用" width="120"></el-table-column>
                    <el-table-column prop="name" label="总件数" width="120"></el-table-column>
                    <el-table-column prop="address" label="总重量(kg)"></el-table-column>
                    <el-table-column prop="date" label="总体积(m)" width="120"></el-table-column>
                    <el-table-column prop="name" label="实际抵达时间" width="120"></el-table-column>
                    <el-table-column prop="address" label="实际装货时间"></el-table-column>
                    <el-table-column prop="date" label="实际卸货时间" width="120"></el-table-column>
                </el-table>
            </template>
        </div>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import speed from '../components/speed';
import vehicle from '../components/vehicle';
export default {
    data() {
        return {
            tableData: [
                {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },
                {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                },
                {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                },
                {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }
            ]
        };
    },
    mounted() {},
    methods: {},
    components: { Paper, speed, vehicle }
};
</script>
<style lang='less'>
@import "../distributeManage/styles/common.less";
.tab1 {
    margin: 30px 0;
}
</style>