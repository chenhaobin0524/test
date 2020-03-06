<template>
    <div id="approver-dialog">
        <el-dialog
            title='添加成员'
            :visible.sync="visible"
            width="840px">
            <div class="content">
                <div class="left">
                    <div class="search-container">
                        <svg class="icon iconfont1" aria-hidden="true">
                            <use xlink:href="#icon-iflow-zuzhijiagou"></use>
                        </svg>
                        <span>组织架构</span>
                        <el-input
                            placeholder="搜索员工"
                            v-model="selectValue"
                            @keyup.enter.native="search">
                            <svg slot="suffix" class="icon" aria-hidden="true">
                                <use xlink:href="#icon-iflow-sousuo"></use>
                            </svg>
                        </el-input>
                    </div>
                    <div class="org-container">
                        <div class="tree-container">
                            <el-tree
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
                        <div class="member-container">
                            <div class="member-line" v-for="(item, index) in memberList" :key="index">
                                <div class="top">
                                    <el-checkbox v-model="item.isCheck" @change="selectChange(item)"></el-checkbox>
                                    <div v-if="item.sex === 1" style="display:inline-block;color:#67D7D9" class="icon font_family icon-iflow-nanshi"></div>
                                    <div v-else style="display:inline-block;color:#FFA79F" class="icon font_family icon-iflow-nvshi"></div>
                                    <div class="name">{{item.userName}}</div>
                                    <span>{{item.mainPostName}}</span>
                                </div>
                                <div :class="{bottom: true, hidden: isHideOrg}">
                                    {{item.orgName}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="right-top">
                        <div class="select-desc">
                            已选
                            <span style="color:#12C0C3">{{selectList.length}}</span>
                            人
                        </div>
                        <div class="clear" @click="clear">
                            清空
                        </div>
                    </div>
                    <div class="right-content">
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
    </div>
</template>
<script>
import { organizations, searchUser } from './org';

export default {
    name: 'approver-dialog',
    data() {
        return {
            visible: false,
            selectValue: '',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            memberList: [],
            selectList: [],
            isHideOrg: true
        };
    },
    methods: {
        showDialog(visible) {
            this.reset();
            this.visible = visible;
        },
        loadNode(node, resolve) {
            if (node.level === 0) {
                this.resolve = resolve;
                this._organizations().then(res => {
                    if (res.data) {
                        return resolve(res.data);
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
            if (item.isCheck) {
                this.selectList.push(item);
            } else {
                this.selectList.forEach((it, id) => {
                    if (item.userCode === it.userCode) {
                        this.selectList.splice(id, 1);
                    }
                });
            }
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
            this.selectList = [];
            this.memberList.forEach((it) => {
                it.isCheck = false;
            });
        },
        del(item, index) {
            this.selectList.splice(index, 1);
            this.memberList.forEach((it) => {
                if (it.userCode === item.userCode) {
                    it.isCheck = false;
                }
            });
        },
        save() {
            this.visible = false;
            this.$emit('saveClick', this.selectList);
        },
        reset() {
            this.selectValue = '';
            this.memberList = [];
            this.selectList = [];
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
#approver-dialog{
    ::-webkit-scrollbar-track {
        background-color: transparent;
    }
    ::-webkit-scrollbar {
        background-color: transparent;
    }
    div{
        box-sizing: border-box;
    }
    .el-dialog__body{
        padding: 0px !important;
    }
    .content{
        width: 100%;
        height: 500px;
        display: flex;
        border-bottom: 1px solid #F0F0F0;
        .left{
            width: 72%;
            height: 100%;
            padding-top: 15px;
            padding-left: 15px;
            padding-right: 10px;
            border-right: 1px solid #F0F0F0;
            .search-container{
                width: 100%;
                height: 40px;
                background-color: #F2F2F2;
                display: flex;
                direction: row;
                align-items: center;
                .iconfont1{
                    padding-left: 10px;
                    padding-right: 10px;
                    color: #CECECE;
                }
                span{
                    width: 200px;
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    color: #666666;
                }
                .el-input{
                    width: 330px !important;
                    margin: 5px;
                    width: 60%;
                    input{
                        border: none !important;
                    }
                    .el-input__suffix{
                        margin-top: -5px;
                        padding-right: 0px;
                        width: 20px;
                    }
                    .el-input__inner{
                        padding: 8px 12px !important;
                    }
                }
            }
            .org-container{
                width: 100%;
                height: 445px;
                display: flex;
                .tree-container{
                    width: 40%;
                    height: 100%;
                    border-right: 1px solid #F0F0F0;
                    overflow: scroll;
                    .el-tree{
                        margin-top: 10px;
                        .el-tree-node__content{
                            height: 32px;
                        }
                    }
                }
                .member-container{
                    width: 60%;
                    height: 100%;
                    padding: 10px;
                    padding-right: 0px;
                    overflow: scroll;
                    .member-line{
                        width: 100%;
                        .top{
                            width: 100%;
                            height: 40px;
                            display: flex;
                            direction: row;
                            align-items: center;
                            .el-checkbox{
                                margin-left: 10px;
                                margin-right: 15px;
                            }
                            .name{
                                display: inline-block;
                                width: 60px;
                                margin-left: 10px;
                                margin-right: 10px;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                            }
                            span{
                                color: #999999;
                            }
                        }
                        .bottom{
                            width: 100%;
                            padding-left: 60px;
                            padding-bottom: 5px;
                            color: #999999;
                        }
                        .hidden{
                            display: none;
                        }
                    }
                    :hover{
                        background-color: #F0F8FA;
                    }
                }
            }
        }
        .right{
            width: 28%;
            height: 100%;
            padding-top: 15px;
            padding-left: 10px;
            padding-right: 9px;
            .right-top{
                display: flex;
                height: 40px;
                line-height: 40px;
                background-color: #F2F2F2;
                margin-right: 6px;
                .select-desc{
                    width: 60%;
                    height: 100%;
                    padding-left: 20px;
                }
                .clear{
                    width: 40%;
                    height: 100%;
                    text-align: right;
                    padding-right: 10px;
                }
            }
            .right-content{
                width: 100%;
                height: 445px;
                overflow: scroll;
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
                }
                :hover{
                    background-color: #F0F8FA;
                }
            }
        }
    }
}
</style>
