<template>
    <el-dialog class="role-manager-add" :title="isEdit  ? '修改' : '新增'" :visible.sync="visible" width="500px" @close="close">
        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="80px" size="mini">
            <el-form-item label="角色名" prop="roleName">
                <el-input v-model="form.roleName"></el-input>
            </el-form-item>
            <el-row>
                <el-form-item label="角色类型" prop="roleType">
                    <el-select v-model="form.roleType" placeholder="请选择角色类型" ref="select">
                        <el-option v-for="item in typeData" :value="item.value" :label="item.label" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-form-item label="所属系统" prop="applicationCodes">
                <el-select v-model="form.applicationCodes" placeholder="请选择系统" ref="select" multiple>
                    <el-option v-for="item in systemModuleList" :value="item.applicationCode" :label="item.applicationName" :key="item.applicationCode"></el-option>
                </el-select>
            </el-form-item>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="禁用">
                        <el-checkbox v-model="form.enableFlag" :true-label="value0" :false-label="value1"></el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="是否报表角色" label-width="100px">
                        <el-checkbox v-model="form.reportFlag" :true-label="value1" :false-label="value0"></el-checkbox>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="描述" prop="desc">
                <el-input type="textarea" v-model="form.detail"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-buttons">
            <div>
                <el-button @click="showVisi(form.id)" size="mini" type="danger" plain v-if="isEdit">删 除</el-button>
            </div>
            <div>
                <el-button @click="close" size="mini">取 消</el-button>
                <el-button type="primary" @click="onSubmit" size="mini">保 存</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import { addRole, editRole, deleteRole } from '../../api/RolesApi.js';
export default {
    data() {
        const validateNull = (rule, value, callback) => {
            if (/\s+/.test(value)) {
                return callback(new Error('请勿输入空格'));
            }
            callback();
        };
        const validateLength255 = (rule, value, callback) => {
            if (value && value.length > 255) {
                return callback(new Error('长度不能超过255'));
            }
            callback();
        };
        return {
            visible: true,
            isEdit: false,
            selectModule: null,
            form: {},
            value1: 1,
            value0: 0,
            rules: {
                roleName: [
                    { required: true, message: '请输入角色名', trigger: 'blur' },
                    { min: 1, max: 32, message: '长度在32个字符以内', trigger: 'blur' },
                    { validator: validateNull, trigger: 'blur' }
                ],
                roleType: [
                    { required: true, message: '请选择角色类型', trigger: 'change' }
                ],
                applicationCodes: [
                    { type: 'array', required: true, message: '请至少选择一个系统', trigger: 'change' }
                ],
                detail: [
                    { validator: validateLength255, trigger: 'blur' },
                    { validator: validateNull, trigger: 'blur' }
                ]
            },
            typeData: [
                { label: '普通角色', value: 2 },
                { label: '跨租户角色', value: 3 },
                { label: '父租户角色', value: 4 }
            ]
        };
    },
    mounted() {
        this.visible = this.dialogVisible;
        if (!this.user && typeof this.user !== 'undefined') {
            this.isEdit = false;
            this.form = { roleType: 2, roleName: '', enableFlag: 1, reportFlag: 0 };
        } else {
            this.isEdit = true;
            this.form = this.user;
        }
    },
    props: {
        dialogVisible: Boolean,
        user: Object,
        systemModuleList: Array
    },
    methods: {
        close() {
            this.visible = false;
            if (!this.isEdit) {
                this.form = {};
                this.form.roleType = 2;
            };
            this.$emit('close');
        },
        handleDelete(id) {
            deleteRole(id).then(res => {
                if (res.code === '0') {
                    this.close();
                }
            });
        },
        showVisi(id) {
            this.$confirm('此操作不可逆, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleDelete(id);
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
        onSubmit() {
            var self = this;
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.isEdit) {
                        const formId = this.form.id;
                        const data = {
                            roleName: self.form.roleName,
                            roleType: self.form.roleType,
                            detail: self.form.detail,
                            applicationCodes: self.form.applicationCodes,
                            enableFlag: self.form.enableFlag,
                            reportFlag: self.form.reportFlag,
                            version: self.form.version
                        };
                        editRole(formId, data).then(res => {
                            if (res.code === '0') {
                                this.$emit('submitUser', res.data);
                            };
                            this.visible = false;
                        });
                    } else {
                        const data = {
                            roleName: self.form.roleName,
                            detail: self.form.detail,
                            roleType: self.form.roleType,
                            applicationCodes: self.form.applicationCodes,
                            enableFlag: self.form.enableFlag,
                            reportFlag: self.form.reportFlag
                        };
                        return addRole(data).then(res => {
                            if (res.code === '0') {
                                this.$emit('submitUser', res.data);
                            };
                            this.visible = false;
                        });
                    }
                }
            });
        }
    }
};

</script>
