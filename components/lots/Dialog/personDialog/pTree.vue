<template>
  <el-tree
    ref="tree"
    lazy
    accordion
    :node-key="treeConfig.key"
    :highlight-current="true"
    :expand-on-click-node="true"
    :check-strictly="true"
    :props="treeConfig.defaultProps"
    :load="loadNode"
    :render-content="treeContent"
    :filter-node-method="filterNode"
    @node-click="nodeClick"></el-tree>
</template>
<script>
import { organizations } from '../org';
export default {
    name: 'm-tree',
    props: {
        treeConfig: {
            type: Object
        }
    },
    data() {
        return {
            keywork: '',
            imgUrl: require('@/components/lots/Dialog/img/zuzhi.png')
        };
    },
    methods: {
        loadNode(node, resolve) {
            if (node.level === 0) {
                this._organizations().then(res => {
                    if (res.data) {
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
        },
        _organizations(params) {
            return organizations(params);
        },
        filterTree(val) {
            this.keywork = val;
            this.$refs.tree.filter(val);
        },
        getCheckedKeys() {
            this.$refs.tree.getCheckedKeys();
        },
        setCheckedKeys(val) {
            this.$refs.tree.setCheckedKeys(val);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        treeContent(h, { node, data, store }) {
            return (
                <span>
                    <img src={this.imgUrl} style="vertical-align: text-top;"/>
                    <span style="margin-left:5px" class="showHighlight">{node.label}</span>
                </span>
            );
        },
        nodeClick(data, node, obj) {
            this.treeConfig.isHideOrg = true;
            this.treeConfig.memberList = [];
            this._organizations({ tenantFlag: 0, withUserFlag: 1, code: node.data.code }).then(res => {
                if (res.data) {
                    res.data.forEach((it) => {
                        it.users.forEach((member) => {
                            this.treeConfig.selectList.forEach((item) => {
                                if (member.userCode === item.userCode) {
                                    member.isCheck = true;
                                }
                            });
                            this.treeConfig.memberList.push(member);
                        });
                    });
                } else {
                    this.treeConfig.memberList = [];
                }
            });
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
        }
    }
};
</script>
<style lang="less">
.showStart {
    color: red;
}
</style>
