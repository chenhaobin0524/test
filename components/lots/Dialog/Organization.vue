<template>
  <m-dialog
    :dialog="config"
    @closePerDialog="closePerDialog"
    @confirmPerDialog="confirmPerDialog"
    @before-close="hideDialog"
    id="organ-dialog">
    <div class="data-show" slot="left">
        <div class="data-search">
            <span>组织架构</span>
            <el-input
                v-model="searchOrg"
                placeholder="搜索组织"
                @change="search">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
        </div>
        <m-tree ref="tree" :keywork="searchOrg" :treeConfig="treeConfig" class="structure-tree"></m-tree>
    </div>
    <div class="checked-list" slot="right">
            <div class="checked-list-title">
                <span class="checked-num">已选<i>&nbsp;{{checkedList.length}}&nbsp;</i></span>
                <span class="clear-all" @click="clearAll">清空</span>
            </div>
            <div class="checked-items">
                <div v-for="(item, index) in checkedList" :key="index">
                    <div class="checked-every">
                        <span>{{item.name}}</span>
                        <span @click="clearOne(item)"><i class="el-icon-close" style="font-size: 12px;"></i></span>
                    </div>
                </div>
            </div>
        </div>
  </m-dialog>
</template>
<script>
import MDialog from './MDialog';
import MTree from './mTree';
export default {
    name: 'organization-dialog',
    components: {
        MDialog,
        MTree
    },
    props: {
        config: {
            type: Object
        }
    },
    data() {
        return {
            searchFlag: true,
            treeConfig: {
                checkedList: []
            }
        };
    },
    methods: {
        search(str) {
            this.$refs.tree.filterTree(str);
        },
        hideDialog(val) {
            this.$emit('before-close', val);
        },
        closePerDialog(val) {
            this.$emit('closePerDialog', val);
        },
        confirmPerDialog(val) {
            val.checkedList = this.treeConfig.checkedList;
            this.$emit('confirmPerDialog', val);
        },
        clearOne(data) {
            let setCheckedKeys = [];
            const checkedList = this.checkedList;
            this.checkedList = [];
            if (data) {
                checkedList.forEach(val => {
                    if (val.code === data.code) {
                        setCheckedKeys.splice(setCheckedKeys.indexOf(val), 1);
                        this.checkedList.splice(this.checkedList.indexOf(data), 1);
                    }
                });
            } else {
                setCheckedKeys = this.$refs.tree.getCheckedKeys();
            }
            this.$refs.tree.setCheckedKeys(setCheckedKeys);
        },
        clearAll() {
            this.treeConfig.checkedList = [];
            this.$refs.tree.setCheckedKeys([]);
        }
    },
    computed: {
        searchOrg: {
            set(val) {
                this.config.value = val;
                this.searchFlag = false;
            },
            get() {
                return this.config.value;
            }
        },
        checkedList: {
            set(val) { },
            get() {
                return this.treeConfig.checkedList;
            }
        }
    },
    watch: {
        config: {
            handler(n, o) {
                if (this.searchFlag) {
                    this.treeConfig.checkedList = n.checkedList.map(v => {
                        return v;
                    });
                }
                this.treeConfig = Object.assign(this.treeConfig, n.tree);
            },
            deep: true
        }
    }
};
</script>
<style lang="less">
    #organ-dialog {
        .dialog-body {
            width: 100%;
            height: 444px;
            overflow: hidden;
        }
        .el-dialog__body {
            padding: 0;
            border-bottom: 1px solid #E6E6E6;
        }
        .data-show {
            margin-left: 16px;
            padding-top: 16px;
            padding-right: 10px;
            float: left;
            height: 100%;
            width: 65%;
            border-right: 1px solid #E6E6E6;
            /*background-color: blue;*/
            box-sizing: border-box;
        }
        .checked-list {
            margin: 0 16px 16px 10px;
            padding-top: 16px;
            height: 100%;
            width: 30%;
            float: left;
            box-sizing: border-box;
        }
        .checked-list-title {
            width: 100%;
            height: 40px;
            background-color: #F2F2F2;
            line-height: 38px;
            color: #666666;
            padding: 0 10px 0 20px;
            box-sizing: border-box;
        }
        .checked-num i {
            font-style: normal;
            color: #3EA4EB;
        }
        .clear-all {
            float: right;
            cursor: pointer;
        }
        .checked-every {
            width: 100%;
            height: 38px;
            line-height: 38px;
            color: #666666;
            padding: 0 10px 0 20px;
            box-sizing: border-box;
        }
        .checked-every:hover {
            background-color: #F0F8FA;
        }
        .checked-every span:last-child{
            float: right;
            cursor: pointer;
            color: #AAAAAA;
            font-size: 18px;
        }
        .checked-items {
            width: 100%;
            height: 90%;
            overflow-y: scroll;
        }
        .data-search {
            background-color: #F2F2F2;
            height: 40px;
            width: 100%;
            line-height: 40px;
            padding: 0 5px 0 10px;
            box-sizing: border-box;
        }
        .data-search span:first-child {
            color: #666666;
            font-size: 14px;
            float: left;
        }
        .data-search .el-input {
            width: 45%;
            float: right;
        }
        .structure-tree.el-tree {
            margin-top: 10px;
            height: calc(100% - 50px);
            width: 100%;
            box-sizing: border-box;
            overflow: auto;
        }
        .el-tree-node__content .el-checkbox {
            position: absolute;
            right: 0;
        }
    }
</style>
