<template>
    <Paper class='app-manage-resource'>
        <div class="topTab">
            <el-button class="back" icon="el-icon-arrow-left" size="mini" @click='goBack()'>返回</el-button>
            <div class="title">资源管理</div>
        </div>
        <div class="tree">
            <el-tree
                :data="originResources"
                v-loading="treeLoading"
                node-key="id"
                default-expand-all
                :props="defaultProps"
                :expand-on-click-node="false"
                :render-content="renderContent"
            ></el-tree>
        </div>
        <el-dialog width="500px" :title='titlename' :visible.sync="visible" @close="() => {this.$refs.ruleForm.clearValidate();}">
            <el-form :model='activeCode' :rules='rules' label-width='100px' ref="ruleForm">
                <el-form-item v-if="!modify" label='父级名称' >
                    <el-input :disabled="true" v-model='activeCode.resourceName' placeholder='请输入名称'></el-input>
                </el-form-item>
                <el-form-item label='名称' prop="activeCodeName">
                    <el-input v-model='activeCode.activeCodeName' placeholder='请输入名称'></el-input>
                </el-form-item>
                <el-form-item label='类型'>
                      <el-select v-model="optionsValue" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                     </el-select>
                </el-form-item>
                <el-form-item label='编码' v-if="optionsValue === 3">
                    <el-input v-model='resourceId' placeholder='请输入编码'></el-input>
                </el-form-item>
                <el-form-item label='序号' prop='sortNo'>
                    <el-input v-model='activeCode.sortNo' placeholder='请输入序号'></el-input>
                </el-form-item>
                <el-form-item label='图标URL' prop='resourceUrl'>
                    <el-input v-model='activeCode.resourceUrl' placeholder='请输入图标URL'></el-input>
                </el-form-item>
                <el-form-item label='禁用' >
                    <el-checkbox  v-model='activeCodeChecked'></el-checkbox>
                </el-form-item>
                <template v-if="optionsValue === 2">
                    <el-form-item label='扩展属性' prop='extendAttr1'>
                        <el-input v-model='activeCode.extendAttr1' placeholder='请输入'></el-input>
                    </el-form-item>
                    <el-form-item label='前端地址' prop='frontUrl'>
                        <el-input v-model='activeCode.frontUrl' placeholder='请输入前端地址'></el-input>
                    </el-form-item>
                    <el-form-item label='后端地址' >
                    <el-table :data="activeCode.endUrls">
                        <el-table-column label='URL'>
                            <template slot-scope="scope" prop="endUrl">
                                <el-input v-if="scope.row.isEdit" v-model="scope.row.endUrl"></el-input>
                                <span v-else>{{scope.row.endUrl}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column  width='150' label='操作'>
                            <template slot-scope="scope" >
                                <el-button v-if="scope.row.isEdit" type='text' size='mini' @click="pathListSave(scope)">保存</el-button>
                                <el-button v-else type='text' size='mini' @click="pathListEdit(scope)">编辑</el-button>
                                <el-button type='text' size='mini' @click="pathListDel(scope)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </el-form-item>
                </template>

            </el-form>
            <span slot='footer'>
                <el-button  v-if="optionsValue>1" @click='pathListAdd'>添加后端地址</el-button>
                <el-button v-if="modify && +activeCode.parentCode !== 0" @click='deleteResource()'>删除当前资源</el-button>
                <el-button @click="() => {
                    this.visible = false;
                    this.$refs.ruleForm.clearValidate();
                    }">取 消</el-button>
                <el-button type='primary' @click="submitAppend()">确 定</el-button>
            </span>
        </el-dialog>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import appManageAPI from '../api/AppManageAPI';
import resource from '../api/ResourceAPI';

export default {
    data() {
        const validateNull = (rule, value, callback) => {
            if (/\s+/.test(value)) {
                return callback(new Error('请勿输入空格'));
            }
            callback();
        };
        const validateLength32 = (rule, value, callback) => {
            if (value && value.length > 32) {
                return callback(new Error('长度不能超过32'));
            }
            callback();
        };
        return {
            searchvalue: '',
            optionsValue: 1,
            originResources: [],
            titlename: '',
            visible: false,
            activeCode: { endUrls: [] },
            activeCodeChecked: false,
            resourceId: '',
            activeName: 'tenant',
            currentPage: 1,
            totalCount: 0,
            pageSize: 10,
            treeLoading: false,
            data: [],
            id: 100,
            modify: false,
            options: [{
                value: 1,
                label: '菜单'
            }, {
                value: 2,
                label: '页面'
            }, {
                value: 3,
                label: '元素'
            }],
            resources: [],
            defaultProps: {
                children: 'subResources',
                label: 'resourceName'
            },
            rules: {
                resourceName: [
                    {
                        required: true,
                        message: '请输入父级名称',
                        trigger: 'blur'
                    }
                ],
                activeCodeName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                },
                { validator: validateNull, trigger: 'change' },
                { validator: validateLength32, trigger: 'change' }],
                frontUrl: [
                    {
                        required: true,
                        message: '请输入前端地址',
                        trigger: 'blur'
                    }
                ]
            },
            dialogAuthVisible: false
        };
    },
    props: {
        appCode: {
            type: String,
            default: ''
        }
    },
    methods: {
        pathListDel(scode) {
            this.activeCode.endUrls.splice(scode.$index, 1);
        },
        pathListEdit(scode) {
            this.activeCode.endUrls[scode.$index].isEdit = true;
        },
        pathListSave(scode) {
            this.activeCode.endUrls[scode.$index].isEdit = false;
        },
        pathListAdd() {
            if (this.activeCode.endUrls == null) {
                this.activeCode.endUrls = [];
            }
            this.activeCode.endUrls.unshift({ isEdit: true, endUrl: '' });
        },
        goBack() {
            this.$emit('goback');
        },
        append(data) {
            this.activeCode = {};
            this.activeCodeChecked = false;
            this.titlename = '添加子资源';
            this.visible = true;
            this.activeCode.parentCode = data.resourceCode;
            this.activeCode.resourceName = data.resourceName;
            this.activeCode.resourceType = data.resourceType;
            this.resourceId = '';
            this.optionsValue = 1;
            this.activeCode.endUrls = [];
            this.modify = false;
        },
        submitAppend() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if (this.modify) {
                        var data = {
                            resourceType: this.optionsValue,
                            applicationCode: this.appCode,
                            resourceName: this.activeCode.activeCodeName,
                            sortNo: this.activeCode.sortNo,
                            resourceUrl: this.activeCode.resourceUrl,
                            enableFlag: this.activeCodeChecked ? 0 : 1,
                            version: this.activeCode.version
                        };
                        if (this.optionsValue === 3) {
                            data.resourceId = this.resourceId;
                        }
                        if (this.optionsValue > 1) {
                            data.frontUrl = this.activeCode.frontUrl;
                            data.extendAttr1 = this.activeCode.extendAttr1;
                            data.endUrls = [];
                            for (var i = 0; i < this.activeCode.endUrls.length; i++) {
                                data.endUrls.push({ endUrl: this.activeCode.endUrls[i].endUrl });
                            }
                        }
                        this.editResource(data);
                    } else {
                        if (this.activeCode.resourceType === 1 && this.optionsValue === 3) {
                            this.$message.error('菜单下不允许添加按钮元素!');
                            return false;
                        } else if (this.activeCode.resourceType === 2 && this.optionsValue === 1) {
                            this.$message.error('页面下不允许添加菜单!');
                            return false;
                        } else if (this.activeCode.resourceType === 2 && this.optionsValue === 2) {
                            this.$message.error('页面下不允许添加页面!');
                            return false;
                        }
                        var data2 = {
                            resourceType: this.optionsValue,
                            applicationCode: this.appCode,
                            resourceName: this.activeCode.activeCodeName,
                            sortNo: this.activeCode.sortNo,
                            resourceUrl: this.activeCode.resourceUrl,
                            parentCode: this.activeCode.parentCode,
                            enableFlag: this.activeCodeChecked ? 0 : 1
                        };
                        if (this.optionsValue === 3) {
                            data2.resourceId = this.resourceId;
                        }
                        if (this.optionsValue > 1) {
                            data2.frontUrl = this.activeCode.frontUrl;
                            data2.extendAttr1 = this.activeCode.extendAttr1;
                            data2.endUrls = [];
                            for (i = 0; i < this.activeCode.endUrls.length; i++) {
                                data2.endUrls.push({ endUrl: this.activeCode.endUrls[i].endUrl });
                            }
                        }
                        this.appendResource(data2);
                    }
                }
            });
        },
        editResource(data) {
            return resource.editResource(data, this.activeCode.id).then(res => {
                if (res.code === '0') {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.visible = false;
                    this.$refs.ruleForm.clearValidate();
                    this.activeCode = {};
                    this.getResources();
                } else {
                    this.$message({
                        type: 'error',
                        message: '保存失败'
                    });
                }
            });
        },
        deleteResource() {
            this.visible = false;
            return resource.deleteResource(this.activeCode.id).then(res => {
                if (res.code === '0') {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.getResources();
                } else {
                    this.$message({
                        type: 'error',
                        message: '删除失败'
                    });
                }
            });
        },
        appendResource(data) {
            return resource.appendResource(data).then(res => {
                if (res.code === '0') {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.visible = false;
                    this.$refs.ruleForm.clearValidate();
                    this.activeCode = {};
                    this.getResources();
                } else {
                    this.$message({
                        type: 'error',
                        message: '保存失败'
                    });
                }
            });
        },
        getResources() {
            this.treeLoading = true;
            return resource.getResources(this.appCode).then(res => {
                this.treeLoading = false;
                if (res.data) {
                    this.originResources = res.data;
                }
            });
        },
        dataValueBatch(batchdata, parentName) {
            return batchdata.map(({ parentCode, resourceCode, resourceName, subResInfos, id, frontUrl, extendAttr1, endUrl, resourceType, buttonId, resourceId }) => (subResInfos ? {
                parentCode: parentCode,
                parentName: parentName,
                resourceName: resourceName,
                resourceCode: resourceCode,
                label: resourceName,
                id: id,
                frontUrl: frontUrl,
                extendAttr1: extendAttr1,
                endUrl: endUrl,
                resourceId: resourceId,
                resourceType: resourceType,
                buttonId: buttonId,
                children: this.dataValueBatch(subResInfos, resourceName)
            } : {
                parentCode: parentCode,
                resourceName: resourceName,
                resourceCode: resourceCode,
                label: resourceName,
                id: id,
                frontUrl: frontUrl,
                extendAttr1: extendAttr1,
                endUrl: endUrl,
                resourceId: resourceId,
                resourceType: resourceType,
                buttonId: buttonId,
                parentName: parentName
            }));
        },
        remove(node, data) {
            this.activeCode = {};
            this.titlename = '修改/删除资源';
            this.visible = true;
            this.activeCode = data;
            this.activeCodeChecked = data.enableFlag !== 1;
            this.optionsValue = data.resourceType;
            this.resourceId = data.resourceId;
            this.modify = true;
            this.$set(this.activeCode, 'activeCodeName', data.resourceName);
            resource.getTenantResourceUrls(data.resourceCode).then(res => {
                var endUrls = [];
                if (res.code === '0') {
                    for (var i = 0; i < res.data.list.length; i++) {
                        endUrls.push({ endUrl: res.data.list[i].endUrl, isEdit: false });
                    }
                }
                this.$set(this.activeCode, 'endUrls', endUrls);
            });
        },
        renderContent(h, { node, data, store }) {
            return (
                <span class="custom-tree-node">
                    <span>{data.resourceName}</span>
                    <span>
                        <el-button size="mini" type="text" on-click={ () => {
                            if (!this.validResourceType(data)) {
                                return false;
                            }
                            this.append(data);
                        }}>添加子资源</el-button>
                        <el-button size="mini" type="text" on-click={ () => {
                            this.remove(node, data);
                        }}>修改</el-button>
                    </span>
                </span>);
        },
        validResourceType(data) {
            if (+data.resourceType === 3) {
                this.$message.error('按钮元素不允许添加子资源!');
                return false;
            }
            return true;
        },
        load(value) {
            var self = this;
            appManageAPI.get(self.pageSize, self.currentPage, value).then(res => {
                this.data = res.data.list;
                this.totalCount = res.data.totalCount;
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load();
        },
        changeSearch(val) {
            this.searchvalue = val;
        },
        editAuthority(row) {
            this.dialogAuthVisible = true;
            this.activeCode = JSON.parse(JSON.stringify(row));
        },
        closeAuthDialog() {
            this.dialogAuthVisible = false;
        }
    },
    mounted() {
        this.load();
        // this.appCode = this.$route.params.applicationCode;
        this.getResources();
    },
    components: { Paper }
};
</script>
<style lang='less'>
.app-manage-resource {
    display: flex;
    flex-direction: column;
    .topTab {
        margin-bottom: 10px;
        .title {
            display: inline-block;
            vertical-align: middle;
            padding: 0 20px;
        }
    }
    .tree {
        flex: 1 auto;
        border: 1px solid #dbdbdb;
        padding: 15px;
        overflow-y: auto;
    }
    .url {
        margin-right: 5px;
    }
    .custom-tree-node {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
    }
}
</style>
