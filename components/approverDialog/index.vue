<template>
    <el-dialog
        class='otp-user-seletor-dialog'
        title='添加成员'
        :visible.sync="visible"
        append-to-body
        width="840px">

        <div class="content">
            <div class="content-tree">
                <div class="tree-search">
                    <span class="zuzhijiagou">组织架构</span>
                    <el-input
                        class="searchInput"
                        placeholder="搜索员工"
                        v-model="selectValue"
                        @keyup.enter.native="search">
                    </el-input>
                </div>
                <div class="tree-org">
                    <div class="tree-org-treeBox">
                        <el-tree
                            v-if='treeShow'
                            ref="tree"
                            node-key="code"
                            highlight-current
                            :props="defaultProps"
                            lazy
                            :load="loadNode"
                            @node-click="nodeClick"
                            :render-content="treeContent">
                        </el-tree>
                    </div>
                    <div class="tree-org-memberBox">
                        <div class="tree-org-memberBox-line" v-for="(item, index) in memberList" :key="index">
                            <div class="lines">
                                <el-radio v-model="radioCheck" @change="selectChange(item)" :label='item.userCode'></el-radio>
                                <div v-if="item.sex === 1" style="display:inline-block;color:#67D7D9" class="icon font_family icon-iflow-nanshi"></div>
                                <div v-else style="display:inline-block;color:#FFA79F" class="icon font_family icon-iflow-nvshi"></div>
                                <div class="name">{{item.userName}}</div>
                                <span class="mainPostName">{{item.mainPostName}}</span>
                            </div>
                            <div :class="{orgName: true, hidden: isHideOrg}">
                                {{item.orgName}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="seletedContent">
                <div class="seletedContent-num">
                    <div class="select-desc">
                        已选
                        <span style="color:#12C0C3">{{selectList.length}}</span>
                        人
                    </div>
                    <div class="clear" @click="clear">
                        清空
                    </div>
                </div>
                <div class="seletedContent-member">
                    <el-tooltip class="select-line" placement="left-start" v-for="(item, index) in selectList" :key="index">
                        <div slot="content">{{item.userName}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.mainPostName}}<br/><br/>{{item.orgName}}</div>
                        <div class="line-content">
                            <div style="width:80%;paddingLeft:20px">
                                <div v-if="item.sex === 1" style="display:inline-block;color:#67D7D9" class="icon font_family icon-iflow-nanshi"></div>
                                <div v-else style="display:inline-block;color:#FFA79F" class="icon font_family icon-iflow-nvshi"></div>
                                <span style="padding-left:10px">{{item.userName}}</span>
                            </div>
                            <div style="width:20%;text-align:right" @click="del(item,index)">
                                <i class="el-icon-close" style="padding-right:10px"></i>
                            </div>
                        </div>
                    </el-tooltip>
                </div>
            </div>
        </div>

        <div slot="footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>

    </el-dialog>
</template>
<script>
import { organizations, searchUser } from './org';

export default {
    name: 'approver-dialog',
    data() {
        return {
            treeShow: true,
            radioCheck: '', // 单选框当前选择项
            visible: false,
            selectValue: '',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            memberList: [],
            selectList: [],
            isHideOrg: true,
            currentRow: ''
        };
    },
    methods: {
        showDialog(row) {
            if (this.currentRow !== row || !row.selectList) {
                this.radioCheck = '';
                this.selectValue = '';
                this.memberList = [];
                this.selectList = [];
                this.treeShow = false;
                setTimeout(() => {
                    this.treeShow = true;
                });
            }
            if (row.selectList) {
                this.selectList = [].concat(row.selectList);
                this.radioCheck = row.chargeCode;
            }

            this.currentRow = row;
            this.visible = true;
        },
        loadNode(node, resolve) {
            if (node.level === 0) {
                this.resolve = resolve;
                this._organizations({ parentCode: 100000 }).then(res => {
                    if (res.data) {
                        const annto = res.data.filter(item => item.code === '30003357');
                        return resolve(annto);
                    }
                });
                return false;
            }
            this._organizations({ parentCode: node.data.code }).then(res => {
                if (res.data) {
                    return resolve(res.data);
                } else {
                    return resolve([]);
                }
            });
        },
        nodeClick(data, node, obj) {
            this.isHideOrg = true;
            this.memberList = [];
            this._organizations({ tenantFlag: 0, withUserFlag: 1, code: node.data.code }).then(res => {
                if (res.data) {
                    res.data.forEach((it) => {
                        it.users.forEach((member) => {
                            this.selectList.forEach((item) => {
                                if (member.userCode === item.userCode) {
                                    member.isCheck = true;
                                }
                            });
                            this.memberList.push(member);
                        });
                    });
                } else {
                    this.memberList = [];
                }
            });
        },
        selectChange(item) {
            this.selectList.splice(0, 1);
            this.selectList.push(item);
        },
        search(val) {
            this.isHideOrg = false;
            this.memberList = [];
            searchUser({ queryParam: this.selectValue }).then(res => {
                if (res.code === '0') {
                    res.data.list.forEach((it) => {
                        this.memberList.push(it);
                    });
                }
            });
        },
        treeContent(h, { node, data, store }) {
            return (
                <span class="icon font_family icon-iflow-zuzhiwenjian">
                    <span style="margin-left:5px">{node.label}</span>
                </span>
            );
        },
        clear() {
            this.radioCheck = '';
            this.selectList = [];
            this.memberList.forEach((it) => {
                it.isCheck = false;
            });
        },
        del(item, index) {
            this.radioCheck = '';
            this.selectList.splice(index, 1);
            this.memberList.forEach((it) => {
                if (it.userCode === item.userCode) {
                    it.isCheck = false;
                }
            });
        },
        save() {
            this.visible = false;
            this.$emit('saveClick', this.selectList, this.currentRow);
        },
        _organizations(params) {
            return new Promise((resolve, reject) => {
                organizations(params).then(res => {
                    if (res && +res.code === 0) {
                        resolve(res);
                    }
                });
            });
        }
    }
};
</script>
<style lang="less">
.otp-user-seletor-dialog{
    ::-webkit-scrollbar-track, ::-webkit-scrollbar {
        background-color: transparent;
    }
    .content{
        height: 500px;
        display: flex;
        border-bottom: 1px solid #F0F0F0;
    }
    .content-tree{
        flex: 7;
        height: 100%;
        padding: 15px 10px 0 15px;
        border-right: 1px solid #F0F0F0;
    }
    .tree-search{
        background-color: #F2F2F2;
        display: flex;
        line-height: 40px;
        padding: 0 50px 0 20px;
        .zuzhijiagou {
            flex: 1;
            font-size: 16px;
            color: #666666;
        }
        .searchInput {
            width: 220px;
        }
    }
    .tree-org{
        height: 445px;
        display: flex;
    }
    .tree-org-treeBox{
        flex: 4;
        height: 100%;
        border-right: 1px solid #F0F0F0;
        overflow: auto;
        position: relative;
        .el-tree {
            position: absolute;
        }
    }
    .el-tree{
        margin-top: 10px;
        .el-tree-node__content{
            height: 32px;
        }
    }
    .tree-org-memberBox{
        flex: 6;
        height: 100%;
        padding: 10px 0 10px 0px;
        overflow: auto;
    }
    .tree-org-memberBox-line{
        .lines{
            height: 40px;
            display: flex;
        }
        .el-checkbox{
            margin: 0px 15px 0px 10px;
        }
        .name{
            display: inline-block;
            width: 60px;
            margin: 0 10px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
        .mainPostName{
            color: #999999;
        }
        .orgName{
            width: 100%;
            padding: 0px 0px 5px 60px;
            color: #999999;
        }
        .hidden{
            display: none;
        }
        &:hover{
            background-color: #F0F8FA;
        }
    }
    .seletedContent{
        flex: 3;
        height: 100%;
        padding: 15px 9px 0 10px;
    }
    .seletedContent-num{
        display: flex;
        line-height: 40px;
        background-color: #F2F2F2;
        margin-right: 6px;
        .select-desc{
            flex: 6;
            height: 100%;
            padding-left: 20px;
        }
        .clear{
            flex: 4;
            height: 100%;
            text-align: right;
            padding-right: 10px;
        }
    }
    .seletedContent-member{
        width: 100%;
        height: 445px;
        overflow: scroll;
    }
    .select-line{
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        .line-content{
            width: 100%;
            height: 40px;
            display: flex;
        }
        &:hover{
            background-color: #F0F8FA;
        }
    }
}
</style>
