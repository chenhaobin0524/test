<template>
    <div class="flex-layout">
        <list-layout-paper>
            <div slot="header-search">
                <el-input class="" v-model='searchvalueName' placeholder='请输入名称' @change="changeSearchName" ></el-input>
                <el-button class='search' type='primary' @click='load(searchvalueName)'>查询</el-button>
            </div>
            <div slot="header-button">
                <el-tooltip content="新建URL" placement="bottom" effect="dark">
                    <el-button type='primary' @click='add' size="mini" icon="el-icon-plus"></el-button>
                </el-tooltip>
            </div>
            <el-table slot="list" slot-scope="props" :height="props.tableHeight" v-loading="appLoading" border stripe :data='data'>
                <el-table-column prop='applicationName' label='应用名称' width='200'></el-table-column>
                <el-table-column prop='name' label='名称' width='200'></el-table-column>
                <el-table-column prop='url' label='URL'></el-table-column>
                <el-table-column prop='enableFlag' label='是否启用' width='80'>
                    <template slot-scope='scope'>
                        <label v-if="scope.row.enableFlag===1">是</label>
                        <label v-else>否</label>
                    </template>
                </el-table-column>
                <el-table-column prop='blacklistFlag' label='是否黑名单' width='100'>
                    <template slot-scope='scope'>
                        <label v-if="scope.row.blacklistFlag===1">是</label>
                        <label v-else>否</label>
                    </template>
                </el-table-column>
                <el-table-column label='操作' width='80'>
                    <template slot-scope='scope'>
                        <el-button @click='show(scope)' type='text' size='mini'>修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-pagination
                    @size-change="handleSizeChange"
                    :current-page.sync='currentPage'
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 30, 50, 100]"
                    :page-size='10'
                    layout='total, sizes, prev, pager, next, jumper'
                    :total='totalCount'
                ></el-pagination>
            </div>
        </list-layout-paper>
        <el-dialog :title='titlename' width="500px" :visible.sync='visiable' @close="handleClose">
            <el-form :model='activeCode' :rules='rules' label-width='100px' ref="ruleForm">
                <el-form-item label='应用名称' prop='applicationCode'>
                    <el-select
                        v-model="activeCode.applicationCode"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        style="width: 100%;"
                        >
                        <el-option
                        v-for="item in options"
                        :key="item.applicationCode"
                        :label="item.applicationName"
                        :value="item.applicationCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='名称' prop='name'>
                    <el-input v-model='activeCode.name' placeholder='请输入别名'></el-input>
                </el-form-item>
                <el-form-item label='URL' prop='url'>
                    <el-input v-model='activeCode.url' placeholder='请输入URL'></el-input>
                </el-form-item>
                <el-form-item label='是否启用' >
                    <el-switch
                        v-model="enableFlag"
                        inactive-color="#cccccc"
                        active-color="#00BCBF"
                    >
                    </el-switch>
                </el-form-item>
                <el-form-item label='是否黑名单' >
                    <el-switch
                        v-model="blacklistFlag"
                        inactive-color="#cccccc"
                        active-color="#00BCBF"
                    >
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot='footer'>
                <div class="dialog-buttons">
                    <div>
                        <el-button v-if="titlename === '编辑'" @click="deleteUrl">删 除</el-button>
                    </div>
                    <div>
                        <el-button @click="handleClose">取 消</el-button>
                        <el-button type='primary' @click="onOk('ruleForm')">确 定</el-button>
                    </div>
                </div>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
import appManageAPI from '../api/AppManageAPI';

export default {
    components: { ListLayoutPaper },
    name: 'UrlBlackWhite',
    data() {
        const validateNull = (rule, value, callback) => {
            if (/\s+/.test(value)) {
                return callback(new Error('请勿输入空格'));
            }
            callback();
        };
        return {
            appLoading: false,
            searchvalue: '',
            searchvalueName: '',
            titlename: '',
            visiable: false,
            activeCode: {},
            activeName: 'tenant',
            currentPage: 1,
            totalCount: 0,
            pageSize: 10,
            enableFlag: true,
            blacklistFlag: false,
            data: [],
            options: [],
            rules: {
                applicationCode: [
                    {
                        required: true,
                        message: '请输入应用名称',
                        trigger: 'blur'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    },
                    {
                        min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'
                    },
                    { validator: validateNull, trigger: 'blur' }
                ],
                url: [
                    {
                        required: true,
                        message: '请输入URL',
                        trigger: 'blur'
                    },
                    {
                        min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'
                    },
                    { validator: validateNull, trigger: 'blur' }
                ],
                applicationDomain: [
                    {
                        required: false,
                        message: '请输入应用域名',
                        trigger: 'blur'
                    }
                ],
                customDomain: [
                    {
                        required: false,
                        message: '请输入自定义域名',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        handleClose() {
            this.visiable = false;
            this.enableFlag = true;
            this.blacklistFlag = false;
        },
        deleteUrl() {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                appManageAPI.deleteUrl(this.activeCode.id).then(res => {
                    this.visiable = false;
                    this.load();
                    if (res.code === '0') {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '删除失败'
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        remoteMethod(query) {
            appManageAPI.get(10, 1, '', query).then(res => {
                if (res.code === '0') {
                    this.options = res.data.list;
                }
            });
        },
        show(item) {
            this.visiable = true;
            this.activeCode = item.row;
            this.titlename = '编辑';
            this.enableFlag = this.activeCode.enableFlag === 1;
            this.blacklistFlag = this.activeCode.blacklistFlag === 1;
            this.searchvalue = this.activeCode.applicationCode;
        },
        add() {
            this.visiable = true;
            this.activeCode = {};
            this.titlename = '新增';
        },
        goToResoureManage(applicationCode) {
            this.$router.push({ name: 'resoureManage', params: { applicationCode: applicationCode } });
        },
        goToAppManageWhiteList(applicationCode, type) {
            this.$router.push({ name: 'AppManageWhiteList', params: { applicationCode: applicationCode, type: type } });
        },
        onOk(formName) {
            var self = this;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.titlename === '编辑') {
                        var id = this.activeCode.id;
                        const params = {
                            name: self.activeCode.name,
                            url: self.activeCode.url,
                            applicationCode: self.activeCode.applicationCode,
                            blacklistFlag: this.blacklistFlag ? 1 : 0,
                            version: self.activeCode.version,
                            enableFlag: this.enableFlag ? 1 : 0
                        };
                        appManageAPI.updateUrl(id, params).then(res => {
                            self.load();
                            self.visiable = false;
                            this.enableFlag = true;
                            this.blacklistFlag = false;
                            if (res.code === '0') {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功'
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '修改失败'
                                });
                            }
                        });
                    } else {
                        const params = {
                            name: self.activeCode.name,
                            url: self.activeCode.url,
                            applicationCode: self.activeCode.applicationCode,
                            blacklistFlag: this.blacklistFlag ? 1 : 0,
                            version: self.activeCode.version,
                            enableFlag: this.enableFlag ? 1 : 0
                        };
                        appManageAPI.saveUrlLists(params).then(res => {
                            self.load();
                            self.visiable = false;
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.load();
        },
        load(name) {
            this.appLoading = true;
            var self = this;
            appManageAPI.getUrlLists(self.pageSize, self.currentPage, name).then(res => {
                this.appLoading = false;
                this.data = res.data.list;
                this.totalCount = res.data.totalCount;
            });
            this.remoteMethod();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load();
        },
        changeSearch(val) {
            this.searchvalue = val;
        },
        changeSearchName(val) {
            this.searchvalueName = val;
        }
    },
    mounted() {
        this.load();
    }
};
</script>
