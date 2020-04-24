<template>
    <paper>
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :optionNum="optionNum"
            :loading="loading"
            :searchTotalTitle="searchTotalTitle"
            @saveData="saveData"
            @row-db-click="rowDBclick"
            @getTableConfigList="getTableConfigList"
            @check-btn="checkBtn"
            @edit-btn="editBtn"
            @del-btn="delBtn"
            @switch-change="switchChange"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            searchId="test"
            pageID="test"
        >
            <div slot="table-module-btn">
                <!-- <el-tooltip class="item"
                            effect="dark"
                            content="新增"
                            placement="bottom">
                    <el-button size="mini"
                               icon='el-icon-plus'
                               @click="addData"></el-button>
                </el-tooltip>-->
            </div>
            <div slot="page-module-btn">
                <span v-has="'07010001'"><el-button type="primary" @click="orderHandle">处 理</el-button></span>
                <span style="margin-left: 15px;" v-has="'07010002'"><el-button type="primary" @click="orderClose">关 闭</el-button></span>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import { getOrderExceptions, closes, orderExceptionsHandles } from '../../../api/orderException';
import { dateTimes, dateTime } from '../../../judge/configCenter';

export default {
    name: 'orderException',
    components: { mPane, paper },
    data() {
        return {
            config: config,
            loading: false,
            optionNum: '',
            totalData: [],
            pageTotal: 0,
            searchParams: {
                pageSize: 10,
                pageNo: 1,
                orderBy: 'create_time',
                orderByType: 'desc',
                exceptionStatus: 10
            },
            searchTotalTitle: config.searchTotalTitle
        };
    },
    methods: {
        async fetchData() {
            const res = await getOrderExceptions(this.searchParams);
            if (res) {
                if (
                    res.data.totalPage !== 0 &&
                    this.searchParams.pageNo > res.data.totalPage
                ) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.fetchData();
                } else {
                    const list = res.data.list || [];
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].exceptionStatus === '20' || list[i].exceptionStatus === '99') {
                            list[i].timeInterval = this.intervalTime(list[i].createTime, list[i].updateTime);
                        } else {
                            list[i].timeInterval = this.intervalTime(list[i].createTime, dateTime());
                        }
                    }
                    this.totalData = list;
                    this.pageTotal = res.data.totalCount;
                }
            } else {
                this.totalData = [];
            }
        },
        rowDBclick(row) {
            // 表格内双击事件
        },
        checkBtn(data) {
            // 表格内按钮查看事件;
        },
        editBtn(data) {
            // 表格内按钮修改事件;
        },
        delBtn(data) {
            // 表格内按钮删除事件;
        },
        selectChange(data) {
            // 表格内选择变化
            this.selectData = data;
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        searchChange(data) {
            // 提交搜索框
            let createStartTime, createEndTime;
            if (data.createTime && data.createTime.length) {
                createStartTime = dateTimes(data.createTime[0]);
                createEndTime = dateTimes(data.createTime[1]);
            }
            delete data.createTime;

            this.searchParams = {
                ...this.searchParams,
                ...data,
                createStartTime,
                createEndTime,
                pageNo: 1
            };
            this.fetchData();
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.fetchData();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            this.fetchData();
        },
        addData() {
            // 表格新增方法
            this.$refs.tablePage.$refs.table.addData();
        },
        saveData(data) {
            // 表格新增修改后返回数据
        },
        redomet(data) {
            // 这是删除方法
        },
        getTableConfigList(data) {},
        refresh() {
            // 表格内刷新按钮
        },
        // 关闭
        orderClose() {
            const ids = [];
            for (let i = 0; i < this.selectData.length; i++) {
                ids.push(this.selectData[i].id);
            }
            closes(ids).then(res => {
                if (res.code === '0') {
                    this.$message.success('关闭成功！');
                    this.fetchData();
                }
            });
        },
        // 计算时间差
        intervalTime(startTime, endTime) {
            var date1 = new Date(startTime.replace(/-/g, '/'));
            var date2 = new Date(endTime.replace(/-/g, '/'));
            var date3 = date2.getTime() - date1.getTime();
            // 计算出相差天数
            var days = Math.floor(date3 / (24 * 3600 * 1000));
            // 计算出小时数

            var leave1 = date3 % (24 * 3600 * 1000);
            var hours = Math.floor(leave1 / (3600 * 1000));
            // 计算相差分钟数
            var leave2 = leave1 % (3600 * 1000);
            var minutes = Math.floor(leave2 / (60 * 1000));
            // 计算相差秒数
            var leave3 = leave2 % (60 * 1000);
            var seconds = Math.round(leave3 / 1000);
            return (days + '天 ' + hours + '小时 ' + minutes + '分钟 ' + seconds + '秒');
        },
        // 处理
        orderHandle() {
            const ids = [];
            for (let i = 0; i < this.selectData.length; i++) {
                ids.push(this.selectData[i].id);
            }
            orderExceptionsHandles(ids).then(res => {
                if (res.code === '0') {
                    this.$message.success('处理完成！');
                    this.fetchData();
                }
            });
        }
    },
    mounted() {
        this.fetchData();
    }
};
</script>
