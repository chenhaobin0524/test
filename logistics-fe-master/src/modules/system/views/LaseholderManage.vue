<template>
    <div class="flex-layout">
        <list-layout-paper class="laseholder-manage" v-if="status === 'index'">
            <div slot="header-search">
                <el-input v-model="nameFilter" placeholder="租户名/编码查询" size="mini" @keyup.enter.native="() => {load(1)}"></el-input>
                <el-button type="primary" size="mini" @click="() => {load(1)}">查 询</el-button>
            </div>
            <div slot="header-button">
                <el-tooltip class="item" effect="dark" content="新增子租户" placement="bottom">
                    <el-dropdown split-button type="primary" @click="handleAdd">
                        <i class="el-icon-plus"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item><el-button size='mini' type='text' @click="handleAdd">新建子租户</el-button></el-dropdown-item>
                            <el-dropdown-item>
                                <div>
                                    <el-upload action='/api/tenant/import' :on-success='handleImport'
                                            :show-file-list="false" :before-upload="beforeUpload"
                                            accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                                        <el-button size='mini' type='text'>批量新增子租户</el-button>
                                    </el-upload>
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-tooltip>
                <el-tooltip effect="dark" content="模板下载" placement="bottom">
                    <el-button size='mini' icon="el-icon-document" @click="handleDownload"></el-button>
                </el-tooltip>
            </div>
            <el-table slot="list" slot-scope="props" :height="props.tableHeight" border :data="userData" stripe>
                <el-table-column prop="logoUrl" label="图标" width="60" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <img :src="scope.row.logoUrl" class="iconSize">
                    </template>
                </el-table-column>
                <el-table-column prop="tenantName" label="租户名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="tenantCode" label="租户编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="customCode" label="自定义租户编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="updateTime" label="修改时间" width="110" show-overflow-tooltip>
                    <template slot-scope="scope">
                            {{formatDate(scope.row.updateTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="updateUserCode" label="修改人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
                <el-table-column prop="action" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleAuthority(scope.$index, scope.row)">用户管理</el-button>
                        <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination slot="footer"
                    class="text-right"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 50, 100]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </list-layout-paper>
        <LaseholderUsers v-if="status === 'manage'" :id='currentId' @goback="status = 'index'" />
        <el-dialog :title="isEdit? '修改' : '新增'" :visible.sync="dialogVisible" width="500px" @close="handleClose">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="100px" size="mini">
                <el-form-item label="租户编码" prop="customCode">
                    <el-input v-model="form.customCode" placeholder="自动生成不可更改" :disabled="codeDisable">
                    <el-button type="text" slot="suffix" @click="codeDisable=false">自定义</el-button>
                </el-input>
                </el-form-item>
                <el-form-item label="租户名称" prop="tenantName">
                    <el-input v-model="form.tenantName"></el-input>
                </el-form-item>
                <el-form-item v-if="isEdit" label="组织">
                    <el-input type="text" disabled :value="editValue" />
                </el-form-item>
                <el-form-item label="组织" prop="orgCode" v-else>
                    <el-select
                        style="width: 100%"
                        v-model="form.orgCode"
                        clearable
                        filterable
                        remote
                        placeholder="请输入关键词"
                        :remote-method="loadOrganizations"
                        :loading="loading">
                        <el-option
                        v-for="item in options"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="租户域名" prop="tenantDomain">
                    <el-input v-model="form.tenantDomain"></el-input>
                </el-form-item>
                <el-form-item label="租户图标URL" prop="logoUrl">
                    <el-input v-model="form.logoUrl"></el-input>
                </el-form-item>
                <el-form-item label="过期时间" prop="expireDate">
                    <el-date-picker
                        v-model="form.expireDate"
                        type="datetime"
                        placeholder="请选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
                <div class="dialog-buttons">
                    <div><el-button @click="showVisi(form.id)" size="mini" type="danger" plain v-show="isEdit">删 除</el-button></div>
                    <div>
                        <el-button @click="dialogVisible=false" size="mini">取 消</el-button>
                        <el-button plain v-if="!isEdit" @click="() => {addAction()}" size="mini">新建租户组织</el-button>
                        <el-button type="primary" @click="() => {addAction(true)}" size="mini">确 定</el-button>
                    </div>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
import utils from '@/utils/common';
import { deleteTenantList, getTenantList, saveTenantList, updataTenantList, getOrganizations, tenantOrganizationByTenantCode } from '../api/LaseholderManageApi.js';
import LaseholderUsers from './LaseholderUsers';
export default {
    name: 'laseholder',
    components: { ListLayoutPaper, LaseholderUsers },
    data() {
        const validateLength36 = (rule, value, callback) => {
            if (value && value.length > 36) {
                return callback(new Error('长度不能超过36'));
            }
            callback();
        };
        const validateLength255 = (rule, value, callback) => {
            if (value && value.length > 255) {
                return callback(new Error('长度不能超过255'));
            }
            callback();
        };
        const validateNull = (rule, value, callback) => {
            if (/\s+/.test(value)) {
                return callback(new Error('请勿输入空格'));
            }
            callback();
        };
        return {
            editValue: '',
            currentId: '',
            status: 'index',
            currentPage: 1,
            total: 0,
            pageSize: 10,
            dialogVisible: false,
            nameFilter: '',
            userData: [],
            isEdit: false,
            form: {},
            selectItem: {},
            codeDisable: true,
            loading: false,
            options: [],
            rules: {
                customCode: [
                    { validator: validateLength36, trigger: 'blur' },
                    { validator: validateNull, trigger: 'blur' }
                ],
                tenantDomain: [
                    { validator: validateLength255, trigger: 'blur' }
                ],
                logoUrl: [
                    { validator: validateLength255, trigger: 'blur' }
                ],
                remark: [
                    { validator: validateLength255, trigger: 'blur' }
                ],
                tenantName: [
                    { required: true, message: '请输入租户名称', trigger: 'blur' },
                    { validator: validateLength36, trigger: 'blur' },
                    { validator: validateNull, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        _tenantOrganizationByTenantCode(id) {
            tenantOrganizationByTenantCode(id).then(res => {
                if (res && +res.code === 0) {
                    this.editValue = res.data.name || '';
                }
            });
        },
        handleClose() {
            this.editValue = '';
            this.form = {};
            this.options = [];
            this.$refs.form.clearValidate();
        },
        load(currentPage) {
            const param = {};
            if (this.nameFilter.length > 0) {
                param.queryParam = this.nameFilter;
            }
            param.pageSize = this.pageSize;
            param.pageNo = currentPage || this.currentPage;
            getTenantList(param).then(res => {
                if (res.data) {
                    this.userData = res.data.list;
                    this.total = res.data.totalCount;
                }
            });
        },
        handleAdd() {
            this.isEdit = false;
            this.form = {};
            this.dialogVisible = true;
        },
        addAction(flag) {
            if (flag && !this.form.orgCode && !this.isEdit) {
                this.$message({ type: 'error', message: '请选择组织!' });
                return false;
            }
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.isEdit) {
                        updataTenantList(this.form.id, this.form).then(res => {
                            this.currentPage = 1;
                            this.load(1);
                            this.dialogVisible = false;
                            this.codeDisable = true;
                        });
                    } else {
                        let params;
                        if (!flag) {
                            params = Object.assign({}, this.form, { organizationFlag: 1 });
                        } else {
                            params = Object.assign({}, this.form); // 确定按钮需要校验组织是否存在, 新建租户组织不需要校验组织编码,但是请求体加上organizationFlag=1
                        }
                        saveTenantList(params).then(res => {
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
            this.currentId = row.tenantCode;
            // this.$router.push({
            //     name: 'laseholderUsers',
            //     params: {
            //         id: row.tenantCode
            //     }
            // });
        },
        handleEdit(index, row) {
            this.isEdit = true;
            this.form = row;
            this._tenantOrganizationByTenantCode(row.tenantCode);
            this.dialogVisible = true;
        },
        handleDelete(id) {
            deleteTenantList(id).then(res => {
                this.dialogVisible = false;
                if (+res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.currentPage = 1;
                    this.load(1);
                }
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
            this.$confirm('此操作不可逆, 是否继续删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.handleDelete(id);
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        handleImport(obj) {
            if (obj.code === '0') {
                this.$message({ type: 'success', message: '上传成功!' });
            } else {
                this.$message({ type: 'error', message: obj.msg });
            }
        },
        beforeUpload(file) {
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                this.$message.error('上传文件不能大于5M');
            }
            return isLt5M;
        },
        handleDownload() {
            var a = document.createElement('a');
            a.href = 'http://lgsit.midea.com:8080/file/static/租户批量导入模板_v1.0.xlsx';
            a.click();
        },
        loadOrganizations(query) {
            if (query !== '') {
                this.loading = true;
                const param = { name: query };
                getOrganizations(param).then(res => {
                    this.loading = false;
                    this.options = res.data;
                });
            } else {
                this.options = [];
            }
        }
    },
    mounted() {
        this.load(1);
    }
};
</script>

<style lang="less">
.laseholder-manage{
    .iconSize{
        display: inline-block;
        height: auto;
        max-width: 100%;
        vertical-align: middle;
    }
}
</style>
