<template>
  <el-tree
    :data="treeData"
    ref="tree"
    lazy
    accordion
    show-checkbox
    :node-key="treeConfig.key"
    :highlight-current="true"
    :expand-on-click-node="true"
    :check-strictly="true"
    :props="treeConfig.defaultProps"
    :default-checked-keys="defaultChecked"
    :load="loadNode"
    :render-content="treeContent"
    :filter-node-method="filterNode"
    @check-change="handleCheckChange"
    @node-expand="handleExpand"></el-tree>
</template>
<script>
import { organizations } from './org';
export default {
    name: 'm-tree',
    props: {
        treeConfig: {
            type: Object
        }
    },
    data() {
        return {
            filterData: [],
            treeData: [],
            originData: [],
            keywork: '',
            imgUrl: require('@/components/lots/Dialog/img/zuzhi.png')
        };
    },
    methods: {
        loadNode(node, resolve) {
            if (this.$refs.tree !== undefined) this.checkedKeys = this.$refs.tree.getCheckedKeys();
            if (node.level === 0) {
                this._organizations().then(res => {
                    if (res.data) {
                        this.originData = res.data;
                        return resolve(res.data);
                    }
                });
                return false;
            } else {
                this._organizations({ parentCode: node.data.code }).then(res => {
                    if (res.data) {
                        return resolve(res.data);
                    } else {
                        return resolve([]);
                    }
                });
            }
            if (this.$refs.tree !== undefined) this.$refs.tree.setCheckedKeys(this.checkedKeys);
        },
        _organizations(params) {
            return organizations(params);
        },
        filterTree(val) {
            this.keywork = val;
            this._organizations({ name: val }).then(res => {
                if (res.data) {
                    this.treeData = res.data;
                    return this.$refs.tree.filter(val);
                }
            });
        },
        getCheckedKeys() {
            this.$refs.tree.getCheckedKeys();
        },
        setCheckedKeys(val) {
            this.$refs.tree.setCheckedKeys(val);
        },
        filterNode(value, data) {
            let same = true;
            this.filterData.forEach(e => {
                if (e.code === data.code) {
                    same = false;
                }
            });
            this.filterData.push(data);
            if (!value) {
                this.treeData = this.originData;
                return true;
            }
            return data.name.indexOf(value) !== -1 && same;
        },
        handleCheckChange(data, checked) {
            if (checked) {
                this.treeConfig.checkedList.push(data);
            } else {
                this.clearOne(data);
            }
        },
        handleExpand(data, node, tree) {
            this.checkedKeys = this.treeConfig.checkedList.map(val => {
                return val.code;
            });
            this.$refs.tree.setCheckedKeys(this.checkedKeys);
        },
        treeContent(h, { node, data, store }) {
            return (
                <span>
                    <img src={this.imgUrl} style="vertical-align: text-top;"/>
                    <span style="margin-left:5px" class="showHighlight">{node.label}</span>
                </span>
            );
        },
        clearOne(data) {
            let setCheckedKeys = [];
            const checkedList = this.treeConfig.checkedList;
            this.treeConfig.checkedList = [];
            if (data) {
                checkedList.forEach(val => {
                    if (val.code !== data.code) {
                        setCheckedKeys.push(val.code);
                        this.treeConfig.checkedList.push(val);
                    }
                });
            } else {
                setCheckedKeys = this.$refs.tree.getCheckedKeys();
            }

            this.checkedKeys = setCheckedKeys;
            this.$refs.tree.setCheckedKeys(setCheckedKeys);
        }
    },
    computed: {
        defaultChecked() {
            const codeArr = this.treeConfig.checkedList.map(val => {
                return val.code;
            });
            return codeArr;
        }
    },
    watch: {
        keywork(val) {
            const arr = document.querySelectorAll('.showHighlight');
            const len = arr.length;
            for (let i = 0; i < len; i++) {
                const html = (arr[i].innerHTML);
                if (html.indexOf(val) >= 0 && val !== '') {
                    arr[i].classList.add('showStart');
                } else {
                    arr[i].classList.remove('showStart');
                }
            }
            this.filterData = [];
        }
    }
};
</script>
<style lang="less">
.showStart {
    color: red;
}
</style>
