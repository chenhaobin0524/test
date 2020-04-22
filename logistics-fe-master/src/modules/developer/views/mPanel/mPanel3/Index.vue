<template>
    <paper>
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :searchTotalTitle="searchTotalTitle"
            :optionNum="optionNum"
            :loading="loading"
            :verification="verification"
            searchId="test"
            pageID="test"
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
            :pickerOptionsCustom='pickerOptionsCustom'>
            <div slot="table-module-btn">
                <el-button @click="addData" v-if="config.table.clickState?config.table.clickState:false">新增</el-button>
            </div>
            <div slot="page-module-btn"></div>
        </m-pane>
    </paper>
</template>
<script>
import mPane from '@/components/awesome/page/mPanel3';
import config from './config.json';
import paper from '@/components/core/paper/Paper';

export default {
    components: { mPane, paper },
    data() {
        return {
            config: config,
            loading: false,
            optionNum: 'SYS_WM_ASN_STATUS,SYS_WM_SO_STATUS',
            totalData: [{
                informNum: '2016-05-02',
                orderNum: '32134132412',
                number: '上海市普陀区金沙江路 1518 弄',
                users: 'N'
            }, {
                informNum: '2016-05-03',
                orderNum: '32134132412',
                number: '上海市普陀区金沙江路 1518 弄',
                users: 'Y'
            }],
            pageTotal: 100,
            searchTotalTitle: [
                {
                    name: '订单号',
                    value: 'orderNum',
                    type: 'input'
                }, {
                    name: '入库通知单号',
                    value: 'test1',
                    type: 'input'
                }, {
                    name: '客户',
                    value: 'test2',
                    type: 'input',
                    data: '12345'
                }, {
                    name: '服务平台',
                    value: 'platform',
                    type: 'select',
                    optionNum: 'SYS_WM_ASN_STATUS'
                },
                {
                    name: '高级弹框',
                    value: 'order',
                    type: 'advance',
                    multiple: true,
                    advanceConfig: [{ prop: 'suppliersCode', value: '供应商编码' }, { prop: 'suppliersNameCn', value: '供应商中文名' }, { prop: 'supplierNameEn', value: '供应商英文名' }],
                    advanceUrl: '/ebSupplier/popSupplier',
                    advanceCode: 'advanceCode'
                },
                {
                    name: '仓库',
                    value: 'warehouse',
                    type: 'time',
                    timeNum: 7
                }, {
                    name: '状态',
                    value: 'state',
                    type: 'autocomplete',
                    ganged: 'orderNumCode',
                    tableName: 'WH_LOC'
                }
            ],
            verification: {
                number:
                    {
                        validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error('年龄不能为空'));
                            }
                            setTimeout(() => {
                                if (!Number.isInteger(value)) {
                                    callback(new Error('请输入数字值'));
                                } else {
                                    if (value < 18) {
                                        callback(new Error('必须年满18岁'));
                                    } else {
                                        callback();
                                    }
                                }
                            }, 300);
                        },
                        trigger: 'blur'
                    },
                warehouse:
                    {
                        validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error('年龄不能为空'));
                            }
                            setTimeout(() => {
                                if (!Number.isInteger(value)) {
                                    callback(new Error('请输入数字值'));
                                } else {
                                    if (value < 18) {
                                        callback(new Error('必须年满18岁'));
                                    } else {
                                        callback();
                                    }
                                }
                            }, 300);
                        },
                        trigger: 'blur'
                    }
            },
            pickerOptionsCustom: [{
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const start = new Date();
                        start.setHours(0);
                        start.setMinutes(0);
                        start.setSeconds(0);
                        start.setMilliseconds(0);
                        const end = new Date();
                        end.setHours(23);
                        end.setMinutes(59);
                        end.setSeconds(59);
                        end.setMilliseconds(0);
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        picker.$emit('pick', end);
                    }
                }]
            }]
        };
    },
    methods: {
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
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        searchChange(data) {
            // 提交搜索框
        },
        pageChange(data) {
            // 分页器页数变化
        },
        sizeChange(data) {
            // 分页器页数大小变化
        },
        addData() {
            // 表格新增方法
            this.$refs.tablePage.$refs.table.addData();
        },
        saveData(data) {
            // 表格新增修改后返回数据
        },
        getTableConfigList(data) {
        }
    },
    mounted() {
        this.totalData = [{
            informNum: 'wqew',
            orderNum: '32134132412',
            number: '上海市普陀区金沙江路 1518 弄',
            users: 'N'
        }, {
            informNum: '2016-05-03',
            orderNum: '32134132412',
            number: '上海市普陀区金沙江路 1518 弄',
            users: 'Y'
        }];
    }
};
</script>
