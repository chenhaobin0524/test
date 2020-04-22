<template>
    <div class="wrapper-info">
        <div class="top">
            <span>组织信息</span>
            <div class="btn-group">
                <el-button type="primary" @click="asyc">同步</el-button>
                <el-button v-if="isEdit" @click="isEdit = !isEdit">取消</el-button>
                <el-button type="primary" v-if="isEdit" @click="update">保存</el-button>
                <el-button v-if="!isEdit" @click="isEdit = !isEdit">修改</el-button>
            </div>
        </div>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules" class="wrapper-form">
            <el-form-item label="组织编码">
                <el-input v-model="form.code" disabled></el-input>
            </el-form-item>
            <el-form-item label="组织名称" prop="orgName">
                <el-input v-model="form.orgName" :disabled="isDisabled"></el-input>
            </el-form-item>
            <el-form-item label="组织全称">
                <el-input v-model="form.orgFullName" disabled></el-input>
            </el-form-item>
            <el-form-item label="业务类型">
                <el-select v-model="form.orgType" placeholder="" class="orgType" :disabled="isDisabled">
                    <el-option label="供应商" value="1"></el-option>
                    <el-option label="经销商" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="权限类型">
                <el-select v-model="form.authType" placeholder="" class="orgType" :disabled="!isEdit">
                    <el-option label="组织" :value="1"></el-option>
                    <el-option label="部门" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="公司编码">
                <el-input v-model="form.companyCode" :disabled="isDisabled"></el-input>
            </el-form-item>
            <el-form-item label="平台编码">
                <el-input v-model="form.siteCode" :disabled="isDisabled"></el-input>
            </el-form-item>
            <!-- <el-form-item label="权限层级">
                <el-input v-model="form.authHierarchy" :disabled="!isEdit && currentNode.source === 0"></el-input>
            </el-form-item> -->
            <el-form-item label="启用状态">
                <el-switch v-model="form.enableFlag" :disabled="!isEdit"></el-switch>
            </el-form-item>
        </el-form>
        <div class="flex-layout">
            <list-layout>
                <el-table slot="list" :data="tableData"
                        border>
                    <el-table-column prop="userName"
                                    label="名称">
                    </el-table-column>
                    <el-table-column prop="orgName"
                                    label="部门"
                                    show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="userCode"
                                    label="用户账号">
                    </el-table-column>
                    <el-table-column prop="employeeId"
                                    label="员工工号">
                    </el-table-column>
                    <el-table-column prop="nameEn"
                                    label="英文名">
                    </el-table-column>
                    <el-table-column prop="tellPhone"
                                    label="办公电话">
                    </el-table-column>
                    <el-table-column prop="mobile"
                                    label="移动电话">
                    </el-table-column>
                    <el-table-column prop="email"
                                    label="邮件地址">
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
            </list-layout>
        </div>
    </div>
</template>
<script>
import ListLayout from '@/components/lots/listLayout/Index';
import { getUserList } from '../../../api/AcountManageApi';
import { updateOrg, synchronizeOrganization } from '../../../api/Organization';
export default {
    components: { ListLayout },
    props: {
        currentNode: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            isEdit: false,
            form: {
                code: '',
                orgName: '',
                orgFullName: '',
                orgType: '',
                enableFlag: false,
                authType: '',
                companyCode: '',
                siteCode: '',
                authHierarchy: ''
            },
            rules: {
                orgName: [
                    { required: true, message: '请输入组织名称', trigger: 'blur' }
                ]
            },
            tempText: ''
        };
    },
    methods: {
        _getUserInfos() {
            const { code } = this.currentNode;
            if (!code) {
                this.$message.error('请选中组织!');
                return false;
            }
            getUserList({
                orgCode: code,
                pageNo: this.currentPage,
                pageSize: this.pageSize
            }).then(res => {
                if (res && res.list) {
                    this.tableData = res.list;
                    this.total = res.totalCount;
                }
            });
        },
        _updateOrg() {
            const { id, version } = this.currentNode;
            const { orgName, orgFullName, orgType, enableFlag, authType, companyCode, siteCode } = this.form;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    updateOrg({
                        id,
                        data: {
                            version,
                            name: orgName,
                            fullName: orgFullName,
                            businessType: orgType,
                            authType: authType,
                            companyCode: companyCode,
                            siteCode: siteCode,
                            enableFlag: Number(enableFlag)
                        }
                    }).then(res => {
                        if (res && +res.code === 0) {
                            this.$message.success('保存成功!');
                            this.isEdit = !this.isEdit;
                            this.$emit('parentNodeUpdate');
                        } else {
                            this.$message.error('保存失败!');
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        asyc() {
            const { code, fullName } = this.currentNode;
            if (!code) {
                this.$message.error('请选中组织!');
                return false;
            }
            synchronizeOrganization({ fullName }).then(res => {
                if (res && +res.code === 0) {
                    this.$message.success('同步成功!');
                    this.$emit('updateNode');
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this._getUserInfos();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this._getUserInfos();
        },
        update() {
            const { code } = this.currentNode;
            if (!code) {
                this.$message.error('请选中组织!');
                return false;
            }
            this._updateOrg();
        },
        renderForm(newValue) {
            let temp = newValue.fullName;
            temp = temp.split('_').slice(0, -1).join('_');
            this.form.code = newValue.code;
            this.form.orgName = newValue.name;
            this.form.orgFullName = `${newValue.fullName}_`;
            this.form.companyCode = newValue.companyCode || '';
            this.form.siteCode = newValue.siteCode || '';
            this.form.orgType = newValue.businessType;
            this.form.authType = newValue.authType;
            this.form.enableFlag = !!newValue.enableFlag;
            this.tempText = `${temp}_`;
        }
    },
    computed: {
        getOrgName() {
            return this.form.orgName;
        },
        isDisabled() {
            return !(this.isEdit && this.currentNode.source === 1);
        }
    },
    watch: {
        currentNode(newValue) {
            if (newValue.code) {
                this.renderForm(newValue);
                this._getUserInfos();
            }
        },
        getOrgName(val) {
            this.form.orgFullName = this.tempText + val;
        }
    }
};
</script>
<style lang="less">
.wrapper-info{
    padding: 10px 0;
    flex-direction: column;
    display: flex;
    flex-direction: column;
    flex: 1 auto;
    .top{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .wrapper-form{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .el-form-item{
            width: 40%;
        }
        .orgType{
            width: 100%;
            .el-input__inner{
                height: 28px !important;
            }
        }
    }
}
</style>
