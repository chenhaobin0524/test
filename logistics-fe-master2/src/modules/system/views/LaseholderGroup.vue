<template>
    <div class="flex-layout laseholder-group">
        <list-layout-paper v-if="status === 'index'">
            <div slot="header-search">
                <el-input v-model="nameFilter" placeholder="租户名/编码查询" size="mini" @keyup.enter.native="load"></el-input>
                <el-button type="primary" size="mini" @click="load">查 询</el-button>
            </div>
            <div slot="header-button">
                <el-tooltip effect="dark" content="新建租户组" placement="bottom">
                    <el-button size='mini' type="primary" @click="handleAdd" icon="el-icon-plus"></el-button>
                </el-tooltip>
            </div>
            <el-table slot-scope="props" :height="props.tableHeight" slot="list" border :data="userData" stripe>
                <el-table-column prop="groupName" label="租户名"></el-table-column>
                <el-table-column prop="groupCode" label="租户组编码"></el-table-column>
                <el-table-column prop="customCode" label="自定义编码"></el-table-column>
                <el-table-column prop="applicationName" label="应用名称"></el-table-column>
                <el-table-column prop="action" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleAuthority(scope.$index, scope.row)">管理</el-button>
                        <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination slot="footer"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 50, 100]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </list-layout-paper>
        <LaseholderGroupManager v-else-if="status === 'manage'" :id="currentId" @goback="status = 'index'" />
        <el-dialog :title="isEdit? '修改' : '新增'" :visible.sync="dialogVisible"  width="500px">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="100px" size="mini">
                <el-form-item label="租户编码" prop="customCode">
                <el-input v-model="form.customCode" placeholder="自动生成不可更改" :disabled="codeDisable">
                    <el-button type="text" slot="suffix" @click="codeDisable=false">自定义</el-button>
                </el-input>
                </el-form-item>
                <el-form-item label="租户组名称" prop="groupName">
                <el-input v-model="form.groupName"></el-input>
                </el-form-item>
                <el-form-item label="应用名称" prop="applicationCode">
                <el-select v-model="form.applicationCode" placeholder="请选择系统" ref="select">
                    <el-option  v-for="item in applications" :value="item.applicationCode" :label="item.applicationName" :key="item.applicationCode"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="是否启用" prop="enableFlag">
                <el-switch  v-model="form.enableFlag"
                                active-text="启用"
                                inactive-text="禁用"
                                :active-value="1"
                                :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-buttons">
                <div><el-button @click="showVisi(form.id)" size="mini" type="danger" plain v-show="isEdit">删 除</el-button></div>
                <div>
                    <el-button @click="dialogVisible=false" size="mini">取 消</el-button>
                    <el-button type="primary" @click="addAction" size="mini">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
import utils from '@/utils/common';
import { deleteTenantGroupList, getTenantGroupList, saveTenantGroupList, updataTenantGroupList } from '../api/LaseholderManageApi.js';
import { getAllResourceList } from '../api/RolesApi.js';
import LaseholderGroupManager from './LaseholderGroupManager';
export default {
    name: 'laseholderGroup',
    components: { ListLayoutPaper, LaseholderGroupManager },
    data() {
        const validateNull = (rule, value, callback) => {
            if (/\s+/.test(value)) {
                return callback(new Error('请勿输入空格'));
            }
            callback();
        };
        return {
            currentId: '',
            status: 'index',
            currentPage: 1,
            total: 0,
            pageSize: 10,
            dialogVisible: false,
            nameFilter: '',
            userData: [],
            isEdit: false,
            form: { enableFlag: false },
            selectItem: {},
            codeDisable: true,
            applications: [],
            rules: {
                customCode: [
                    {
                        min: 1, max: 36, message: '长度在 1 到 36 个字符', trigger: 'blur'
                    },
                    { validator: validateNull, trigger: 'blur' }
                ],
                groupName: [
                    { required: true, message: '请输入租户组名称', trigger: 'blur' },
                    {
                        min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'
                    },
                    { validator: validateNull, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        load() {
            const param = {};
            if (this.nameFilter.length > 0) {
                param.queryParam = this.nameFilter;
            }
            param.pageSize = this.pageSize;
            param.pageNo = this.currentPage;
            getTenantGroupList(param).then(res => {
                if (res.data) {
                    this.userData = res.data.list;
                    this.total = res.data.totalCount;
                }
            });
        },
        handleAdd() {
            this.isEdit = false;
            this.form = { enableFlag: false };
            this.dialogVisible = true;
        },
        addAction() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.isEdit) {
                        updataTenantGroupList(this.form.id, this.form).then(res => {
                            this.load();
                            this.dialogVisible = false;
                            this.codeDisable = true;
                        });
                    } else {
                        saveTenantGroupList(this.form).then(res => {
                            this.load();
                            this.dialogVisible = false;
                            this.codeDisable = true;
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        handleAuthority(index, row) {
            this.status = 'manage';
            this.currentId = row.groupCode;
            // this.$router.push({
            //     name: 'laseholderGroupManager',
            //     params: {
            //         id: row.groupCode
            //     }
            // });
        },
        handleEdit(index, row) {
            this.isEdit = true;
            this.form = row;
            this.dialogVisible = true;
        },
        handleDelete(id) {
            deleteTenantGroupList(id).then(res => {
                this.load();
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.load();
        },
        formatDate(date) {
            return utils.formatDate(date);
        },
        showVisi(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.handleDelete(id);
                    this.dialogVisible = false;
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        loadApplications() {
            getAllResourceList().then(res => {
                if (res.data) {
                    this.applications = res.data.list;
                }
            });
        }
    },
    mounted() {
        this.load();
        this.loadApplications();
    }
};
</script>