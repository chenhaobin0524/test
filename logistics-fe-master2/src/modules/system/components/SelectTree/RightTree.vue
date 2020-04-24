<template>
    <div class="wrap">
        <div class="tree-list">
            <div class="selectAll">
                <span class="title-row">菜单 / 页面</span>
                <el-checkbox v-model="isSelectAll"
                            size="mini"
                            @change="handleTreeAllChange"
                            class="check-all">
                    全选
                </el-checkbox>
            </div>
            <div class="wrapper-tree">
                <el-tree
                    class="my-tree"
                    :data="treeData"
                    show-checkbox
                    node-key="resourceCode"
                    :props="defaultProps"
                    ref="tree"
                    @node-click="nodeClick"
                    @check="checks"
                    :default-checked-keys="hasSelect"
                    highlight-current>
                </el-tree>
            </div>
        </div>
        <div class="subTree">
            <div class="selectAll">
                <span class="title-row">元素</span>
                <el-checkbox v-model="isSubSelectAll"
                            size="mini"
                            @change="handleTreeSubAllChange"
                            class="check-all">
                    全选
                </el-checkbox>
            </div>
            <div class="el-tree-node__content" v-for="(item, index) in rightTree" :key="index">
                <span class="is-leaf el-tree-node__expand-icon el-icon-caret-right"></span>
                <el-checkbox :value="getCheckValue(item.resourceCode)" @change="val => {
                    handleChangeCheck(val, item);
                    }"></el-checkbox>
                <span class="el-tree-node__label">{{item.resourceName}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import common from '@/utils/common';
export default {
    data() {
        return {
            isSelectAll: false,
            isSubSelectAll: false,
            rightTree: [],
            rightTreeCheck: this.hasRightSelect
        };
    },
    props: {
        defaultProps: {
            type: Object,
            default: () => {
                return {
                    children: 'subResources',
                    label: 'resourceCode'
                };
            }
        },
        treeData: {
            type: Array,
            default: () => {
                return [];
            }
        },
        hasSelect: {
            type: Array,
            default: () => {
                return [];
            }
        },
        hasRightSelect: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    methods: {
        AddOrDeleteArrItem(item, arr) {
            if (arr.indexOf(item) > -1) {
                arr.splice(arr.indexOf(item), 1);
            } else {
                arr.push(item);
            }
            return arr;
        },
        handleChangeCheck(val, item) {
            if (val) {
                this.hasRightSelect.push(item.resourceCode);
            } else {
                this.hasRightSelect.splice(this.hasRightSelect.indexOf(item.resourceCode), 1);
            }
            this.judgeRightChected();
            this.$emit('rightChecks', this.hasRightSelect);
        },
        nodeClick(data) {
            this.rightTree = data.childNode || [];
            this.judgeRightChected();
        },
        handleTreeAllChange(val) {
            const { tree } = this.$refs;
            if (val) {
                tree.setCheckedKeys(this.getDirectoryId);
            } else {
                tree.setCheckedKeys([]);
            }
            this.$emit('checks', tree.getCheckedKeys());
        },
        handleTreeSubAllChange(val) {
            if (val) {
                const filterItem = this.rightTree.filter(item => {
                    return this.hasRightSelect.indexOf(item.resourceCode) === -1;
                });
                this.$emit('rightChecks', this.hasRightSelect.concat(filterItem.map(item => item.resourceCode)));
            } else {
                this.rightTree.forEach(item => {
                    this.hasRightSelect.splice(this.hasRightSelect.indexOf(item.resourceCode), 1);
                });
                this.$emit('rightChecks', this.hasRightSelect);
            }
        },
        cancle() {
            this.$emit('closeDialog');
        },
        save() {
            this.$emit('save');
        },
        checks(data) {
            const { tree } = this.$refs;
            this.judgeChected();
            this.$emit('checks', tree.getCheckedKeys());
        },
        judgeChected () {
            const { tree } = this.$refs;
            if (this.getDirectoryId.length && (tree.getCheckedKeys().length || this.hasSelect.length)) {
                // 第一个数组在第二个数组内，小于等于第二个数组
                const flag = common.judgeArray(this.getDirectoryId, this.hasSelect.length ? this.hasSelect : tree.getCheckedKeys());
                if (flag) {
                    this.isSelectAll = true;
                } else {
                    this.isSelectAll = false;
                }
            } else {
                this.isSelectAll = false;
            }
        },
        judgeRightChected() {
            if (this.rightTree.length && this.hasRightSelect.length) {
                const temp = this.rightTree.map(item => item.resourceCode);
                const flag = common.judgeArray(temp, this.hasRightSelect);
                if (flag) {
                    this.isSubSelectAll = true;
                } else {
                    this.isSubSelectAll = false;
                }
            } else {
                this.isSubSelectAll = false;
            }
        },
        getResourceIds(v) {
            getId(v);
            function getId(v) {
                v.forEach(item => {
                    if (+item.resourceType === 2) {
                        item.childNode = item.subResources;
                        item.subResources = [];
                    } else if (+item.resourceType === 1 && item.subResources) {
                        getId(item.subResources);
                    }
                });
            }
            return v;
        },
        getCheckValue(code) {
            return this.hasRightSelect.indexOf(code) > -1;
        }
    },
    computed: {
        getDirectoryId() {
            return this.treeData.map(item => {
                return item['resourceCode'];
            });
        }
    },
    watch: {
        hasSelect() {
            this.judgeChected();
        },
        treeData(newValue, oldValue) {
            if (newValue.length) {
                this.getResourceIds(newValue);
            }
            if (newValue !== oldValue) {
                this.rightTree = [];
            }
        }
    }
};
</script>
<style lang="less">
.wrap{
    display: flex;
    height: 100%;
    .tree-list {
        display: flex;
        flex-direction: column;
        border-left: 1px solid #e6e6e6;
        flex: 1;
        padding-right: 15px;
        box-sizing: border-box;
        .selectAll{
            display: flex;
            justify-content: space-between;
            align-items:center;
            padding: 0 10px 0 20px;
            margin-bottom: 10px;
            .title-row {
                margin-bottom: 10px;
                font-size: 14px;
            }
        }
        .check-all{
            .el-checkbox__input{
                float: right;
                margin-top: 3px;
            }
            .el-checkbox__label{
                padding-right: 10px;
            }
        }
        .wrapper-tree {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding-left: 20px;
            overflow-y: auto;
            .my-tree {
                flex: 1;
                overflow-y: auto;
            }
            .el-tree-node__content {
                height: 40px;
                position: relative;
                .el-checkbox{
                    position: absolute;
                    right: 0;
                }
            }
            .floot-btn{
                text-align: right;
            }
        }
    }
    .subTree{
        flex: 1;
        border-left: 1px solid #e6e6e6;
        overflow-y: auto;
        padding: 0 15px;
        box-sizing: border-box;
        .selectAll{
            display: flex;
            justify-content: space-between;
            align-items:center;
            padding: 0 10px 0 20px;
            margin-bottom: 10px;
            .title-row {
                margin-bottom: 10px;
                font-size: 14px;
            }
        }
        .check-all{
            .el-checkbox__input{
                float: right;
                margin-top: 3px;
            }
            .el-checkbox__label{
                padding-right: 10px;
            }
        }
        .el-tree-node__content {
            height: 40px;
            position: relative;
            color: #555757;
            .el-checkbox{
                position: absolute;
                right: 0;
            }
        }
    }
}
</style>
