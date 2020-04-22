<template>
    <div class="flex-layout post-manage">
        <list-layout-paper v-if="currenPage === 'index'">
            <div slot="header-search">
                <Cascader @change="handleOrgNameChange" value="name" placeholder="请选择组织搜索"/>
                <el-input placeholder="请输入岗位名搜索" v-model="positionName"></el-input>
                <el-button type="primary" @click="_positions">查询</el-button>
            </div>
            <div slot="header-button">
                <el-button type="primary" @click="_syncUserAuth(null)">批量同步用户权限</el-button>
                <el-button type="primary" @click="Add" icon="el-icon-plus"></el-button>
            </div>
            <div slot="list" slot-scope="props">
                <el-table
                    v-loading="tbLoading"
                    border
                    :height="props.tableHeight"
                    stripe
                    :data='list'>
                    <el-table-column prop="positionName" label="岗位名称" show-overflow-tooltip width="180">
                    </el-table-column>
                    <el-table-column prop="positionCode" label="岗位编码" show-overflow-tooltip width="150">
                    </el-table-column>
                    <el-table-column prop="orgName" label="组织名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="orgFullName" label="组织全称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="enableFlag" label='是否启用' show-overflow-tooltip width="80">
                        <template slot-scope='scope'>
                            <el-switch
                                v-model="scope.row.enableFlag"
                                @change="_updateFlag(scope.row)"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orgCode" label='组织编码' show-overflow-tooltip width="150">
                    </el-table-column>
                    <el-table-column prop="createUserCode" label='创建人' show-overflow-tooltip width="100">
                    </el-table-column>
                    <el-table-column prop="updateUserCode" label='修改人' show-overflow-tooltip width="100">
                    </el-table-column>
                    <el-table-column prop="ihrCount" label='IHR岗位数量' show-overflow-tooltip width="100">
                    </el-table-column>
                    <el-table-column prop="action" label='操作' width="300">
                        <template slot-scope='scope'>
                            <el-button type="text" @click="_syncUserAuth(scope.row.positionCode)">同步用户权限</el-button>
                            <el-button type="text" @click="handleAmend(scope.row)">修改</el-button>
                            <el-button type="text" @click="
                            curUserData = scope.row;
                            currenPage = 'role';
                            ">关联角色</el-button>
                            <el-button type="text" @click="IHR(scope.row)">关联IHR岗位</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                slot="footer"
                @size-change="SizeChange"
                :current-page.sync='currentPage'
                @current-change="CurrentChange"
                size="small"
                layout='total, sizes, prev, pager, next, jumper'
                :total='total'
            ></el-pagination>
        </list-layout-paper>
        <RelevanceRole v-if="currenPage === 'role'"
                       :curUserData="curUserData"
                       @goback="currenPage = 'index'"/>
        <RelevancePost v-if="currenPage === 'post'"
                       @goback="currenPage = 'index'"
                       :currentNode="currentNode"/>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-form :model='created' :rules='rules' label-width='100px' ref="ruleForm">
                <el-form-item label='组织' prop='org'>
                    <Cascader ref="cascader" @change="handleCreatedOrg" value="name" placeholder="请输入组织" style="width: 100%"/>
                </el-form-item>
                <el-form-item label='岗位名称' prop='postName'>
                    <el-input v-model='created.postName' placeholder='请输入岗位名称'></el-input>
                </el-form-item>
                <el-form-item label='是否启用' prop='enable'>
                    <el-switch v-model="created.enable"
                               :active-value="1"
                               :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot='footer' style="display: flex;justify-content: space-between;">
                <div>
                    <el-button @click="handleDelete" type="danger" plain v-if="dialogTitle === '修改'">删除</el-button>
                </div>
                <div>
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type='primary' @click="handleOk">确 定</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import RelevanceRole from '../components/postManage/RelevanceRole';
import RelevancePost from '../components/postManage/RelevancePost';
import { positions, position, syncUserAuth, updatePosition, deletePosition } from '../api/PostManage';
import Cascader from '../components/postManage/Cascader';
import { mapGetters } from 'vuex';
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
export default {
    name: 'PostManage',
    data() {
        const validateNull = (rule, value, callback) => {
            if (/\s+/.test(value)) {
                return callback(new Error('请勿输入空格'));
            }
            callback();
        };
        const validateLength50 = (rule, value, callback) => {
            if (value && value.length > 50) {
                return callback(new Error('长度不能超过50'));
            }
            callback();
        };
        return {
            currenPage: 'index',
            tbLoading: false,
            curUserData: {},
            list: [{
                postName: '前端主任开发工程师',
                postCode: 'P20190723001',
                orgName: '物流IT',
                orgFull: '美的_美的集团_职能_IT_物流IT',
                able: true,
                orgCode: 'G20190723001',
                creator: 'lixl8',
                modifier: 'chendz7',
                IHRPostNum: '400'
            }],
            orgName: '',
            positionName: '',
            currentCheckedNodes: {},
            total: 0,
            currentPage: 1,
            pageSize: 10,
            dialogTitle: '新建',
            dialogVisible: false,
            created: {
                org: '',
                postName: '',
                enable: 1,
                id: null,
                version: null
            },
            rules: {
                org: [
                    { required: true, message: '请选择组织', trigger: 'change' }
                ],
                postName: [
                    { required: true, message: '请输入岗位', trigger: 'change' },
                    { validator: validateNull, trigger: 'change' },
                    { validator: validateLength50, trigger: 'change' }
                ]
            },
            currentNode: {}
        };
    },
    components: {
        RelevanceRole,
        RelevancePost,
        Cascader,
        ListLayoutPaper
    },
    computed: {
        ...mapGetters(['currentTenant'])
    },
    methods: {
        // 是否启用
        _updateFlag(row) {
            this.$nextTick(() => {
                const { enableFlag } = row;
                updatePosition({
                    data: {
                        enableFlag: enableFlag,
                        version: row.version
                    },
                    id: row.id
                }).then(res => {
                    if (res && +res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '保存成功!'
                        });
                        this._positions();
                    } else {
                        this.$message({
                            type: 'error',
                            message: '保存失败!'
                        });
                    }
                });
            });
        },
        // 修改岗位
        _updatePosition() {
            const { org, postName, enable, id, version } = this.created;
            const { code, fullName } = this.currentCheckedNodes;
            updatePosition({
                data: {
                    orgName: org,
                    positionName: postName,
                    enableFlag: enable,
                    orgCode: code,
                    orgFullName: fullName,
                    version: version,
                    tenantCode: this.currentTenant.tenantCode
                },
                id: id
            }).then(res => {
                if (res && +res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                    this.dialogVisible = false;
                    this._positions();
                } else {
                    this.$message({
                        type: 'error',
                        message: '保存失败!'
                    });
                }
            });
        },
        // 同步用户权限
        _syncUserAuth(positionCode) {
            syncUserAuth({ positionCode }).then(res => {
                if (res && +res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '同步成功!'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '同步失败!'
                    });
                }
            });
        },
        // 新增岗位
        _position() {
            const { org, postName, enable } = this.created;
            const { code, fullName } = this.currentCheckedNodes;
            position({
                orgName: org,
                positionName: postName,
                enableFlag: enable,
                orgCode: code,
                orgFullName: fullName,
                tenantCode: this.currentTenant.tenantCode
            }).then(res => {
                if (res && +res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '新建成功!'
                    });
                    this.dialogVisible = false;
                    this._positions();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 岗位列表查询
        _positions() {
            this.tbLoading = true;
            positions({
                pageNo: this.currentPage,
                pageSize: this.pageSize,
                positionName: this.positionName || undefined,
                orgName: this.orgName || undefined
            }).then(res => {
                if (res && +res.code === 0 && res.data) {
                    this.list = res.data.list;
                    this.total = res.data.totalCount;
                }
                this.tbLoading = false;
            });
        },
        // 删除岗位
        _deletePosition() {
            const { id } = this.created;
            deletePosition({
                id
            }).then(res => {
                if (res && +res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.handleClose();
                    this._positions();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        Add() {
            this.dialogTitle = '新建';
            this.dialogVisible = true;
        },
        CurrentChange(val) {
            this.currentPage = val;
            this._positions();
        },
        SizeChange(val) {
            this.pageSize = val;
            this._positions();
        },
        handleClose() {
            this.dialogVisible = false;
            this.created.org = '';
            this.created.postName = '';
            this.created.enable = 1;
            this.created.id = null;
            this.created.version = null;
            this.currentCheckedNodes = {};
            this.$refs.cascader.$refs.cascader.presentText = '';
            this.$refs.ruleForm.clearValidate();
        },
        handleOk() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    if (this.dialogTitle === '新建') {
                        this._position();
                    }
                    if (this.dialogTitle === '修改') {
                        this._updatePosition();
                    }
                }
            });
        },
        handleDelete() {
            this.$confirm('此操作不可逆, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(res => {
                this._deletePosition();
            });
        },
        handleOrgNameChange(val) {
            this.orgName = val.slice(-1).join('');
        },
        handleCreatedOrg(val, node) {
            this.currentCheckedNodes = node[0].data;
            this.created.org = val.slice(-1).join('');
        },
        handleAmend(row) {
            this.created.org = row.orgName;
            this.created.postName = row.positionName;
            this.created.enable = row.enableFlag;
            this.created.id = row.id;
            this.created.version = row.version;
            this.currentCheckedNodes['code'] = row.orgCode;
            this.currentCheckedNodes['fullName'] = row.orgFullName;
            this.dialogTitle = '修改';
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.cascader.$refs.cascader.presentText = row.orgFullName;
            });
        },
        IHR(row) {
            this.currentNode = row;
            this.currenPage = 'post';
        }
    },
    mounted() {
        this._positions();
    }
};
</script>
<style lang="less">
.post-manage{
    flex-direction: column;
}
</style>