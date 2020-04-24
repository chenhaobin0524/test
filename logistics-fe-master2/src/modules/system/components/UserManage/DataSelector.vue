<template>
    <div class="data-selector">
        <span class="title-row">数据类型</span>
        <el-row>
            <el-col :span="8">
                <div class="type-list">
                    <el-menu class="type-menu" :default-active="activeIndex">
                        <el-menu-item class="type-menu-item" v-for="(item, index) in types"
                            :index="item.dataType" :key="item.dataType" @click="() => {
                                    handleLeftClick(index);
                                }">{{item.dataName}}</el-menu-item>
                    </el-menu>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="table-selector">
                    <div class="table-search">
                        <el-input v-model="roleName" @keyup.enter.native="getTable" size="mini" placeholder="请输入内容" clearable></el-input>
                    </div>
                    <div class="table-list">
                        <el-checkbox-group v-model="checkedTables" @change="handleCheckedTablesChange">
                            <el-checkbox class="table-checkbox" v-for="item in tables"
                                :key="item.authCode" :label="item.authCode">{{item.authName}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div class="table-footer">
                        <el-checkbox v-model="checkAll" @change="handleCheckAllChange" class="pull-left check-all">全选</el-checkbox>
                        <div class="text-right">
                            <el-button type="text" @click="cancle()">取消</el-button>
                            <el-button type="primary" @click="saveTablesSetting">保存</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { getDataTypeList, getDataAuthQuery, saveDataAuths } from '../../api/AcountManageApi.js';
export default {
    props: ['userData'],
    data() {
        return {
            types: [],
            checkAll: false,
            tables: [],
            checkedTables: [],
            activeIndex: null,
            roleName: '',
            currentSystems: ''
        };
    },
    mounted() {
        this.getDataTypes();
    },
    methods: {
        getDataTypes() {
            getDataTypeList().then(res => {
                if (res.data && res.data.list) {
                    this.types = res.data.list;
                    this.currentSystems = 0;
                    this.getTable();
                }
            });
        },
        getTable() {
            this.activeIndex = this.types[this.currentSystems].dataType;
            const params = {
                tableName: this.types[this.currentSystems].tableName,
                tableColumn: this.types[this.currentSystems].tableColumn,
                roleName: this.roleName
            };
            getDataAuthQuery(params).then(res => {
                if (res.data) {
                    this.tables = res.data;
                }
            });
        },
        handleLeftClick(index) {
            this.currentSystems = index;
            this.getTable();
        },
        cancle() {
            this.checkedTables = [];
            this.$emit('closeDialog');
        },
        saveTablesSetting() {
            const dataAuths = this.checkedTables.map(item => this.tables.filter(tableItem => tableItem.authCode === item)[0]);
            const data = {
                userCodes: [this.userData.userCode],
                dataAuths: dataAuths,
                dataType: this.activeIndex
            };
            saveDataAuths(data).then(res => {
                if (res.code === '0') {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.cancle();
                } else {
                    this.$message({
                        type: 'error',
                        message: '保存失败'
                    });
                }
            });
        },
        switchType(index) {
            this.getTable(index);
        },
        handleClick() {},
        handleCheckAllChange(value) {
            this.checkedTables = value ? this.tables.map((item) => item.authCode) : [];
        },
        handleCheckedTablesChange(value) {
            const checkedCount = value.length;
            this.checkAll = checkedCount === this.tables.length;
        }
    },
    watch: {
        tables(newValue) {
            const checkedCount = this.checkedTables.length;
            this.checkAll = checkedCount === newValue.length;
        }
    }
};
</script>
<style lang="less">
.data-selector {
    .title-row {
        display: block;
        margin-bottom: 10px;
        font-size: 14px;
    }
    .table-selector {
        padding: 0 0 0 10px;
        border-left: 1px solid #e6e6e6;
    }

    .type-list {
        .type-menu {
            border-right: 0;
            height: 345px;
            overflow-y: auto;
        }
        .type-menu-item {
            width: auto;
            height: 42px;
            line-height: 42px;
        }
    }

    .table-list {
        height: 260px;
        overflow: auto;
        margin: 10px 0 0 0;
        font-weight: normal;
        .table-checkbox {
            box-sizing: border-box;
            margin: 0 10px 10px 0;
            padding: 0 10px;
            line-height: 2em;
        }
    }
    .table-footer {
        display: flex;
        justify-content: space-between;
        .check-all {
            padding: 0 10px;
            line-height: 40px;
        }
        .text-right{
            line-height: 40px;
            .el-button {
                margin-left: 15px;
            }
        }
    }

}
</style>