<template>
    <div class="flex-layout app-manage">
        <list-layout-paper v-if="type === 'index'">
            <div slot="header-search">
                <el-input v-model='searchvalue' placeholder='请输入应用编码' @change="changeSearch" ></el-input>
                <el-input class="" v-model='searchvalueName' placeholder='请输入应用名称' @change="changeSearchName" ></el-input>
                <el-button class='search' type='primary' size="mini" @click='load(searchvalue,searchvalueName)'>查询</el-button>
            </div>
            <div slot="header-button">
                <el-tooltip content="新建应用" placement="bottom" effect="dark">
                    <el-button type='primary' @click='add' size="mini" icon="el-icon-plus"></el-button>
                </el-tooltip>
            </div>
            <el-table slot="list" slot-scope="props" :height="props.tableHeight" v-loading="appLoading" border stripe :data='data'>
                <el-table-column prop='applicationCode' label='应用编码' width='150' show-overflow-tooltip></el-table-column>
                <el-table-column prop='applicationName' label='应用名称' width='200' show-overflow-tooltip></el-table-column>
                <el-table-column prop='aliasName' label='别名' width='150' show-overflow-tooltip></el-table-column>
                <el-table-column prop='tenantCode' label='所属租户' width='180' show-overflow-tooltip></el-table-column>
                <el-table-column prop='iconUrl' label='图标URL' show-overflow-tooltip></el-table-column>
                <el-table-column fixed='right' label='操作' width='220'>
                    <template slot-scope='scope'>
                        <el-button @click="goToAppManageWhiteList(scope.row.applicationCode,'whiteList')" type='text' size='mini'>白名单</el-button>
                        <el-button @click="goToAppManageWhiteList(scope.row.applicationCode,'blackList')" type='text' size='mini'>黑名单</el-button>
                        <el-button
                            v-if="currentTenant.tenantCode === scope.row.tenantCode"
                            @click="goToResoureManage(scope.row.applicationCode)"
                            type='text'
                            size='mini'>资源管理
                        </el-button>
                        <el-button
                            v-if="currentTenant.tenantCode === scope.row.tenantCode"
                            @click='show(scope)'
                            type='text'
                            size='mini'>修改
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                :current-page.sync='currentPage'
                @current-change="handleCurrentChange"
                :page-sizes="[10, 20, 30, 50, 100]"
                :page-size='10'
                layout='total, sizes, prev, pager, next, jumper'
                :total='totalCount'
                slot="footer"
            ></el-pagination>
        </list-layout-paper>
        <appManageResoure v-else-if="type === 'resource'"
                        :appCode='applicationCode'
                        @goback="type = 'index'"/>
        <AppManageWhiteList v-else-if="type === 'whiteList' || 'blackList'"
                            :appCode='applicationCode'
                            :type='type'
                            @goback="type = 'index'"/>
        <el-dialog width="500px" :title='titlename' :visible.sync='visiable' @close="() => {this.$refs.ruleForm.clearValidate();}">
            <el-form :model='activeCode' :rules='rules' label-width='100px' ref="ruleForm">
                <el-form-item label='应用名称' prop='applicationName'>
                    <el-input v-model='activeCode.applicationName' placeholder='请输入名称'></el-input>
                </el-form-item>
                <el-form-item label='别名' prop='aliasName'>
                    <el-input v-model='activeCode.aliasName' placeholder='请输入别名'></el-input>
                </el-form-item>
                <el-form-item label='图标URL' prop='iconUrl'>
                    <el-input v-model='activeCode.iconUrl' placeholder='请输入图标地址'></el-input>
                </el-form-item>
                <el-form-item label='应用域名' prop='applicationDomain'>
                    <el-input v-model='activeCode.applicationDomain' placeholder='请输入应用域名'></el-input>
                </el-form-item>
                <el-form-item label='自定义域名' prop='customDomain'>
                    <el-input v-model='activeCode.customDomain' placeholder='请输入自定义域名'></el-input>
                </el-form-item>
            </el-form>
            <span slot='footer'>
                <el-button @click="() => {
                    this.visiable = false;
                    this.$refs.ruleForm.clearValidate();
                    }">取 消</el-button>
                <el-button type='primary' @click="onOk('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
import appManageAPI from '../api/AppManageAPI';
import AppManageWhiteList from './AppManageWhiteList';
import appManageResoure from './AppManageResoure';
import { mapGetters } from 'vuex';

export default {
    name: 'app',
    components: { ListLayoutPaper, AppManageWhiteList, appManageResoure },
    data() {
        const validateLength50 = (rule, value, callback) => {
            if (value && value.length > 50) {
                return callback(new Error('长度不能超过50'));
            }
            callback();
        };
        const validateLength12 = (rule, value, callback) => {
            if (value && value.length > 12) {
                return callback(new Error('长度不能超过12'));
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
            type: 'index',
            applicationCode: '',
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
            data: [],
            rules: {
                applicationName: [
                    {
                        required: true,
                        message: '请输入应用名称',
                        trigger: 'blur'
                    },
                    { validator: validateLength50, trigger: 'blur' },
                    { validator: validateNull, trigger: 'blur' }
                ],
                aliasName: [
                    {
                        required: true,
                        message: '请输入应用别名',
                        trigger: 'blur'
                    },
                    { validator: validateLength12, trigger: 'blur' },
                    { validator: validateNull, trigger: 'blur' }
                ],
                iconUrl: [
                    {
                        required: false,
                        message: '请输入图标URL',
                        trigger: 'blur'
                    },
                    { validator: validateLength255, trigger: 'blur' },
                    { validator: validateNull, trigger: 'blur' }
                ],
                applicationDomain: [
                    {
                        required: true,
                        message: '请输入应用域名',
                        trigger: 'blur'
                    },
                    { validator: validateLength255, trigger: 'blur' },
                    { validator: validateNull, trigger: 'blur' }
                ],
                customDomain: [
                    {
                        required: false,
                        message: '请输入自定义域名',
                        trigger: 'blur'
                    },
                    { validator: validateLength255, trigger: 'blur' },
                    { validator: validateNull, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        show(item) {
            this.visiable = true;
            this.activeCode = JSON.parse(JSON.stringify(item.row));
            this.titlename = '编辑';
        },
        add() {
            this.visiable = true;
            this.activeCode = {};
            this.titlename = '新增';
        },
        goToResoureManage(applicationCode) {
            this.type = 'resource';
            this.applicationCode = applicationCode;
            // this.$router.push({ name: 'resoureManage', params: { applicationCode: applicationCode } });
        },
        goToAppManageWhiteList(applicationCode, type) {
            this.type = type;
            this.applicationCode = applicationCode;
            // this.$router.push({ name: 'AppManageWhiteList', params: { applicationCode: applicationCode, type: type } });
        },
        onOk(formName) {
            var self = this;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.titlename === '编辑') {
                        var id = this.activeCode.id;
                        const params = {
                            aliasName: self.activeCode.aliasName,
                            applicationName: self.activeCode.applicationName,
                            iconUrl: self.activeCode.iconUrl,
                            version: self.activeCode.version,
                            applicationDomain: self.activeCode.applicationDomain,
                            customDomain: self.activeCode.customDomain
                        };
                        appManageAPI.update(id, params).then(res => {
                            self.load(self.searchvalue, self.searchvalueName);
                            self.visiable = false;
                        });
                    } else {
                        const params = this.activeCode;
                        params['tenantCode'] = 'midea';
                        appManageAPI.save(params).then(res => {
                            self.load(self.searchvalue, self.searchvalueName);
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
            this.load(this.searchvalue, this.searchvalueName);
        },
        load(value, name, currentPage = 1) {
            this.appLoading = true;
            var self = this;
            appManageAPI.get(self.pageSize, currentPage, value, name).then(res => {
                this.appLoading = false;
                this.data = res.data.list;
                this.totalCount = res.data.totalCount;
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load(this.searchvalue, this.searchvalueName, val);
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
    },
    computed: {
        ...mapGetters(['currentTenant'])
    }
};
</script>
<style lang='less'>
.app-manage {
    overflow: hidden;
}
</style>
