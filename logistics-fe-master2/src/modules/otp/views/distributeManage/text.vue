<template>
    <Paper>
         <div>
            <el-button @click="seeData">查看</el-button>
        </div>

        <Main
        :visible.sync="visible"
        :tableData='tableData'
        :items='items'
        :title="title"
        @handleClose='handleClose'
        ></Main>
    </Paper>
</template>

<script>
import Paper from '@/components/core/paper/Paper';
import Main from '../../components/dispatchPopup/dispatchList/Main';

export default {
    components: {
        Paper,
        Main
    },
    data() {
        return {
            visible: false,
            title: '查看123',
            tableData: [
                {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }
            ],
            items: [
                {
                    prop: 'date',
                    label: 'name1',
                    type: 'normal'
                },
                {
                    prop: 'date',
                    label: 'name2',
                    type: 'normal'
                },
                {
                    prop: 'date',
                    label: 'name3',
                    type: 'normal'
                },
                {
                    prop: 'date',
                    label: 'name4',
                    type: 'normal'
                },
                {
                    prop: 'date',
                    label: 'name5',
                    type: 'normal'
                },
                {
                    prop: 'date',
                    label: 'name6',
                    type: 'normal'
                }
            ]
        };
    },
    methods: {
        seeData() {
            this.visible = true;
        },
        handleClose() {
            this.visible = false;
        }
    }
};
</script>

<style lang="less">

</style>