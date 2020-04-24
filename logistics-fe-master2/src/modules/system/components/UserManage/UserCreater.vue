<template>
    <div class="user-creater-wrap">
        <el-form :model="userData" :rules="rules" label-width="80px" ref="userForm" @submit.native.prevent>
            <el-form-item label="登录名" prop="userCode">
                <el-input v-model="userData.userCode"></el-input>
            </el-form-item>
            <div v-loading="loading">
                <div v-if="isAdd">
                </div>
                <div v-else>
                    <div>
                        <el-form-item label="姓名">
                            <el-input v-model="recover.name" disabled/>
                        </el-form-item>
                        <el-form-item label="部门">
                            <el-input v-model="recover.org" disabled/>
                        </el-form-item>
                        <el-form-item label="岗位">
                            <el-input v-model="recover.station" disabled/>
                        </el-form-item>
                    </div>
                </div>
            </div>
        </el-form>
        <div slot="footer" class="dialog-buttons">
            <el-button type="text" @click="cancle">取消</el-button>
            <el-button type="primary" @click="createNewUser">{{saveText}}</el-button>
        </div>
    </div>
</template>
<script>
import { addToTenant, queryFourA, syncFourA, userAdd } from '../../api/AcountManageApi.js';

export default {
    props: {
        tenantCode: {
            type: String,
            default: () => {
                return '';
            }
        }
    },
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.userData.enterPassWord !== '') {
                    this.$refs.userForm.validateField('enterPassWord');
                }
                callback();
            }
        };
        const validateEnterPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.userData.passWord) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        const validateUserCode = (rule, value, callback) => {
            this.recover.name = '';
            this.recover.org = '';
            this.recover.station = '';
            if (value) {
                this.loading = true;
                queryFourA({ userCode: value }).then(res => {
                    if (res && +res.code === 0) {
                        this.userFlag = +res.data.userFlag;
                        if (+res.data.userFlag === 0) {
                            this.saveText = '保存';
                            this.verifyData = false;
                            this.isAdd = true;
                            callback(new Error('用户不存在!'));
                        }
                        if (+res.data.userFlag === 1) {
                            this.saveText = '绑定';
                            this.verifyData = false;
                            this.isAdd = false;
                            this.recover.name = res.data.userName;
                            this.recover.org = res.data.orgName;
                            this.recover.station = res.data.positionName;
                            this.syncData = res.data;
                            callback();
                        }
                        if (+res.data.userFlag === 2) {
                            this.saveText = '同步并绑定';
                            this.recover.name = res.data.userName;
                            this.recover.org = res.data.orgName;
                            this.recover.station = res.data.positionName;
                            this.syncData = res.data;
                            this.verifyData = true;
                            this.isAdd = false;
                            callback();
                        }
                    }
                    this.loading = false;
                });
            } else {
                this.verifyData = false;
            }
        };
        return {
            options: [{
                label: '美的用户',
                value: 1
            }, {
                label: '司机',
                value: 2
            }, {
                label: '承运商',
                value: 3
            }, {
                label: '供应商',
                value: 4
            }],
            userData: {
                userCode: ''
            },
            recover: {
                name: '',
                org: '',
                station: ''
            },
            rules: {
                userCode: [
                    { required: true, message: '请输入登录名', trigger: 'blur' },
                    { validator: validateUserCode, trigger: 'blur' }
                ],
                userType: [
                    { required: true, message: '请选择用户类型', trigger: 'change' }
                ],
                passWord: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ],
                enterPassWord: [
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
                    { validator: validateEnterPass, trigger: 'blur' }
                ],
                mobile: [
                    // { type: 'mobile', required: true, message: '请输入正确手机号码', trigger: 'blur' }
                ]
            },
            isAdd: true,
            verifyData: false,
            syncData: {},
            userFlag: null,
            saveText: '绑定',
            loading: false
        };
    },
    methods: {
        syncDataFn() {
            syncFourA(this.syncData).then(res => {
                if (res && +res.code === 0) {
                    this.verifyData = false;
                    this.recover.name = res.data.userName;
                    this.recover.org = res.data.orgName;
                    this.recover.station = res.data.positionName;
                }
            });
            this.isAdd = false;
        },
        cancle() {
            this.userData = {};
            this.saveText = '绑定';
            this.$refs['userForm'].resetFields();
            this.verifyData = false;
            this.isAdd = true;
            this.recover.name = '';
            this.recover.org = '';
            this.recover.station = '';
            this.$emit('closeCreateDialog', null);
        },
        saveSuccess() {
            this.cancle();
        },
        selectOrganization(data) {
            this.userData.orgCode = (data && data.length > 0) ? data[data.length - 1] : null;
        },
        createNewUser() {
            // if (+this.userFlag === 0) {
            //     this.$message({
            //         type: 'error',
            //         message: '用户不存在'
            //     });
            //     return false;
            // }
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    if (this.userFlag === 0) {
                        const temp = this.userData;
                        temp['secretKey'] = this.userData.passWord;
                        delete temp.passWord;
                        delete temp.enterPassWord;
                        if (this.tenantCode.length > 0) {
                            temp.tenantCode = this.tenantCode;
                        }
                        userAdd(temp).then(res => {
                            if (res.code === '0') {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功'
                                });
                                this.saveSuccess();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '保存失败'
                                });
                            }
                        });
                    } else {
                        if (this.tenantCode.length > 0) {
                            this.syncData.tenantCode = this.tenantCode;
                        }
                        addToTenant(this.syncData).then(res => {
                            if (res && +res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功'
                                });
                                this.saveSuccess();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '保存失败'
                                });
                            }
                        });
                    }
                }
            });
        }
    }
};
</script>
<style lang="less">
.user-creater-wrap {
    padding: 10px;
    .verify-panel {
        display: flex;
        justify-content: space-between;
        margin-left: 80px;
        .tips-text{
            color: red;
        }
    }
    .text-right{
        text-align: right;
    }
    .setting-width{
        width: 100%;
    }
    .el-form-item {
        margin-bottom: 12px;
        .el-form-item__error {
            padding-top: 0px;
        }
    }
    .position-info {
        color: #666;
    }
    .el-row {
        margin: 2em 0;
        &:nth-child(1) {
            margin-top: 0;
        }
    }
}
</style>
