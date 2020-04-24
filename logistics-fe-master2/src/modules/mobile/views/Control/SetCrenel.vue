<template>
    <div>
        <div class="button"><el-button size="medium" type="primary" @click="handleAdd()">新增</el-button></div>
        <el-table
        border
        size="medium"
        :data="tableData"
        style="width: 100%">
        <el-table-column
            prop="crenelName"
            label="垛口名称"
            >
        </el-table-column>
        <el-table-column
            prop="crenelStatus"
            label="垛口状态"
            align="center"
            width="200">
            <template slot-scope="scope">
                <span v-if="scope.row.crenelStatus==0">停用</span>
                <span v-if="scope.row.crenelStatus==10">呼叫中</span>
                <span v-if="scope.row.crenelStatus==20">作业中</span>
                <span v-if="scope.row.crenelStatus==30">空闲</span>
            </template>
        </el-table-column>
        <el-table-column
            width="200"
            align="center"
            label="操作">
                <template slot-scope="scope">
                <el-button
                type="primary" size="mini"
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <!--el-button
                size="mini"
                type="primary"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button-->
            </template>
        </el-table-column>
        </el-table>
        <div class='my-pagination'>
            <el-pagination
                @size-change="handleSizeChange"
                :current-page.sync='currentPage'
                @current-change="handleCurrentChange"
                :page-sizes="[10, 20, 30, 40, 50,60, 70, 80, 90, 100]"
                :page-size='10'
                layout='total, sizes, prev, pager, next, jumper'
                :total='totalCount'
            ></el-pagination>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="100px">
                <el-form-item label="垛口名称" >
                <el-input style="width:150px;" maxlength="10" show-word-limit v-model="form.crenelName" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="垛口序号" >
                <el-input style="width:150px;" type="number" min="1" v-model="form.serialNumber" placeholder="请输入序号"></el-input>
                </el-form-item>
                <el-form-item label="垛口状态" >
                <el-switch
                @change="switchChange"
                :disabled="form.switchDisabled"
                v-model="form.crenelStatusBool">
                </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleOK()">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>
<script>
import { getCrenels, addCrenel, enableCrenel } from '../../api/control/SetCrenel.js';
export default {
    data() {
        return {
            currentPage: 1,
            totalCount: 0,
            pageSize: 10,
            dialogFormVisible: false,
            dialogTitle: '垛口修改',
            form: {
                crenelName: '',
                crenelStatus: 30,
                crenelStatusBool: true,
                switchDisabled: false,
                serialNumber: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
                value1: true
            },
            tableData: [{
                date: 'A01',
                name: true,
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: 'A02',
                name: false,
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: 'A03',
                name: true,
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: 'A04',
                name: false,
                address: '上海市普陀区金沙江路 1516 弄'
            }]
        };
    },
    methods: {
        handleOK() {
            this.dialogFormVisible = false;
            var data = {};
            var _this = this;
            data.crenelName = this.form.crenelName;
            data.serialNumber = this.form.serialNumber;
            data.crenelStatus = this.form.crenelStatus;
            if (this.dialogTitle === '垛口新增') {
                addCrenel(data).then(res => {
                    if (res.code === '0') {
                        this.$message({
                            type: 'success',
                            message: '新增成功!'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '新增失败!'
                        });
                    }
                    _this.load(_this.currentPage, _this.pageSize);
                });
            } else {
                enableCrenel(this.form.id, this.form.crenelCode, this.form.crenelName,
                    this.form.crenelStatus, this.form.serialNumber, this.form.version).then(res => {
                    if (res.code === '0') {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '修改失败!'
                        });
                    }
                    _this.load(_this.currentPage, _this.pageSize);
                });
            }
        },
        switchChange(val) {
            if (val) {
                this.form.crenelStatus = 30;
            } else {
                this.form.crenelStatus = 0;
            }
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.load(this.currentPage, this.pageSize);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load(this.currentPage, this.pageSize);
        },
        handleEdit(index, row) {
            this.dialogFormVisible = true;
            this.dialogTitle = '垛口修改';
            this.form.crenelName = row.crenelName;
            this.form.crenelStatusBool = row.crenelStatus !== 0;
            this.form.serialNumber = row.serialNumber;
            this.form.crenelStatus = row.crenelStatus;
            this.form.switchDisabled = row.crenelStatus === 10 || row.crenelStatus === 20;
            this.form.id = row.id;
            this.form.version = row.version;
            this.form.crenelCode = row.crenelCode;
        },
        handleAdd(inde, row) {
            this.dialogFormVisible = true;
            this.dialogTitle = '垛口新增';
            this.form.crenelName = '';
            this.form.crenelStatusBool = true;
            this.form.serialNumber = '';
            this.form.switchDisabled = false;
            this.form.crenelStatus = 30;
        },
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        load(page, pageSize) {
            getCrenels(page, pageSize).then(res => {
                if (res.code === '0') {
                    this.tableData = res.data.list;
                    this.totalCount = res.data.totalCount;
                }
            });
        }
    },
    mounted() {
        this.load(this.currentPage, this.pageSize);
    }
};
</script>
<style lang="less">
.main{
    margin:10px;
    background:#fff;
    padding:10px;
}
.button{
    margin-bottom:10px;
    margin-right:10px;
    margin-left:10px;
    display:flex;
    flex-direction :row;
    justify-content:flex-end;
    align-items:center;
}
.my-pagination {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
}
.el-pagination {
    display: inline-block;
}
</style>