<template>
    <div class="wrapper-tree">
        <div class="select-top">
            <el-input class="select-input"
                      v-model="selectValue"
                      placeholder="请输入组织名称"
                      size="mini"
                      @keyup.enter.native="enterSelect"></el-input>
            <el-button class="plus-btn"
                       type="primary"
                       size="mini"
                       @click="handleOpen">
                <i class="el-icon-plus"></i>
            </el-button>
        </div>
        <div class="ele-tree">
            <el-tree
                class="my-tree"
                :load="loadNode"
                lazy
                node-key="code"
                :props="defaultProps"
                ref="tree"
                @node-click="nodeClick"
                highlight-current>
            </el-tree>
        </div>
        <el-dialog
            title="新建"
            :visible.sync="dialogVisible"
            width="30%"
            @close="handleClose">
            <div>
                <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                    <el-form-item label="归属组织">
                        <el-input v-model="form.affiliationOrg" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="组织名称" prop="orgName">
                        <el-input v-model="form.orgName"></el-input>
                    </el-form-item>
                    <el-form-item label="组织全称">
                        <el-input v-model="form.orgFullName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="组织类型">
                        <el-select v-model="form.orgType" placeholder="" class="orgType">
                            <el-option label="供应商" value="1"></el-option>
                            <el-option label="经销商" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="text-right">
                <el-button type="text" @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="save">保 存</el-button>
                <el-button type="primary" @click="saveAndAdd">保存并建租户</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { organizations, organization } from '../../../api/Organization';
export default {
    data() {
        const validateNull = (rule, value, callback) => {
            if (/\s+/.test(value)) {
                return callback(new Error('请勿输入空格'));
            }
            callback();
        };
        return {
            selectValue: '',
            treeData: [],
            defaultProps: {
                label: 'name',
                children: 'children'
            },
            dialogVisible: false,
            form: {
                affiliationOrg: '',
                orgName: '',
                orgFullName: '',
                orgType: ''
            },
            tempText: '',
            rules: {
                orgName: [
                    { required: true, message: '请输入组织名称', trigger: 'blur' },
                    { validator: validateNull, trigger: 'blur' }
                ]
            },
            currentData: {}
        };
    },
    computed: {
        getOrgName() {
            return this.form.orgName;
        }
    },
    methods: {
        _organizations(params) {
            return new Promise((resolve, reject) => {
                organizations(params).then(res => {
                    if (res && +res.code === 0) {
                        resolve(res);
                    }
                });
            });
        },
        _save(flag) {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const { orgName, orgFullName, orgType } = this.form;
                    organization({
                        name: orgName,
                        fullName: orgFullName,
                        businessType: orgType,
                        parentCode: this.currentData.code,
                        tenantFlag: flag
                    }).then(res => {
                        if (res && +res.code === 0) {
                            this.$message.success('保存成功!');
                            this.dialogVisible = false;
                            this.$refs.form.clearValidate();
                            this.currentNodeUpdate();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        save() {
            this._save(0);
        },
        saveAndAdd() {
            this._save(1);
        },
        handleChangeOrgName(val) {
        },
        handleClose() {
            this.dialogVisible = false;
            this.form.affiliationOrg = '';
            this.form.orgName = '';
            this.form.orgFullName = '';
            this.form.orgType = '';
            this.$refs.form.clearValidate();
        },
        resetCurrentNode(id, data) {
            if (id && data && data.length) {
                const tempObj = data.find(item => {
                    return item.id === id;
                });
                this.currentData = tempObj || {}; // 选中data
                this.$emit('nodeClick', tempObj || {}); // 传递给rightTb的选中data
                this.$nextTick(() => {
                    if (tempObj && tempObj.code) {
                        this.$refs.tree.setCurrentKey(tempObj.code); // 高亮选中的节点
                        this.currentNode = this.$refs.tree.getNode(tempObj.code); // 设置当前的currentNode以便重复修改，可以拿到当前node
                    }
                });
            }
        },
        loadNode(node, resolve, id) {
            this.currentNode = node;
            if (node.level !== 0) {
                this.currentNode['resolve'] = resolve;
            }
            this.currentResolve = resolve;
            if (node.level === 0) {
                this.resolve = resolve; // 第一次请求时，获取根节点之后储存resolve，搜索用
                this._organizations({
                    queryParam: this.selectValue ? this.selectValue : null
                }).then(res => {
                    this.resetCurrentNode(id, res.data);
                    if (res.data) {
                        return resolve(res.data);
                    }
                });
                return false;
            }
            this._organizations({ parentCode: node.data.code }).then(res => {
                this.resetCurrentNode(id, res.data);
                if (res.data) {
                    return resolve(res.data);
                } else {
                    return resolve([]);
                }
            });
        },
        nodeClick(data, node, obj) {
            this.currentData = data;
            this.$emit('nodeClick', data);
        },
        enterSelect(id) { // 搜索回车时调用
            if (this.$refs.tree.root.childNodes.length) {
                this.$refs.tree.root.childNodes = [];
            }
            this.$refs.tree.store.load(this.$refs.tree.root, this.resolve, id); // 请求覆盖当前节点
        },
        currentNodeUpdate() {
            this.$refs.tree.store.load(this.currentNode, this.currentResolve); // 请求覆盖当前节点
        },
        parentNodeUpdate() {
            const { id } = this.$refs.tree.getCurrentNode();
            if (this.currentNode.parent.id) {
                this.$refs.tree.store.load(this.currentNode.parent, this.currentNode.parent.resolve, id); // 请求覆盖当前节点
            } else {
                this.enterSelect(id);
            }
        },
        handleOpen() {
            const { code, name, fullName } = this.currentData;
            if (!code) {
                this.$message.error('请选中组织!');
                return false;
            }
            if (name && fullName) {
                this.form.affiliationOrg = name;
                this.form.orgFullName = `${fullName}_`;
                this.tempText = `${fullName}_`;
            }
            this.dialogVisible = true;
        }
    },
    watch: {
        getOrgName(val) {
            this.form.orgFullName = this.tempText + val;
        }
    }
};
</script>
<style lang="less">
.wrapper-tree{
    display: flex;
    flex-direction: column;
    height: 100%;
    .select-top{
        display: flex;
        .select-input{
            flex: 1;
            margin-right: 10px;
        }
        .plus-btn{
            flex: 0 0 40px;
        }
    }
    .ele-tree {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        overflow: hidden;
        .my-tree {
            flex: 1;
            overflow-y: auto;
        }
        .el-tree-node__content {
            height: 40px;
            position: relative;
        }
        .floot-btn{
            text-align: right;
        }
    }
    .orgType{
        width: 100%;
    }
}
</style>
