<template>
  <P-dialog
    :append-to-body='true'
    :dialog="config"
    @closePerDialog="closePerDialog"
    @confirmPerDialog="confirmPerDialog"
    @before-close="hideDialog"
    id="person-dialog">
    <div class="data-show" slot="left">
        <div class="data-search">
            <span>组织架构</span>
            <el-input
                v-model="searchPer"
                placeholder="搜索员工"
                @change="search">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
        </div>
        <P-tree ref="tree" :keywork="searchOrg" :treeConfig="treeConfig" class="structure-tree"></P-tree>
        <div class="member-container">
            <div class="member-line" v-for="(item, index) in treeConfig.memberList" :key="index">
                <div class="top">
                    <el-checkbox v-model="item.isCheck" @change="selectChange(item)"></el-checkbox>
                    <div v-if="item.sex === 1" style="display:inline-block;color:#67D7D9" class="icon font_family icon-iflow-nanshi"></div>
                    <div v-else style="display:inline-block;color:#FFA79F" class="icon font_family icon-iflow-nvshi"></div>
                    <div class="name">{{item.userName}}</div>
                    <span>{{item.mainPostName}}</span>
                </div>
                <div :class="{bottom: true, hidden: treeConfig.isHideOrg}">
                    {{item.orgName}}
                </div>
            </div>
        </div>
    </div>
    <div class="checked-list" slot="right">
        <div class="checked-list-title">
            <span class="checked-num">已选<i>&nbsp;{{treeConfig.selectList.length}}&nbsp;</i></span>
            <span class="clear-all" @click="clearAll">清空</span>
        </div>
        <div class="right-content">
            <el-tooltip class="select-line" placement="left-start" v-for="(item, index) in treeConfig.selectList" :key="index">
                <div slot="content">{{item.userName}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.mainPostName}}<br/><br/>{{item.orgName}}</div>
                <div class="line-content">
                    <div style="width:80%;paddingLeft:20px">
                        <div v-if="item.sex === 1" style="display:inline-block;color:#67D7D9" class="icon font_family icon-iflow-nanshi"></div>
                        <div v-else style="display:inline-block;color:#FFA79F" class="icon font_family icon-iflow-nvshi"></div>
                        <span style="padding-left:10px">{{item.userName}}</span>
                    </div>
                    <div style="width:20%;text-align:right;cursor: pointer" @click="del(item,index)">
                        <i class="el-icon-close" style="padding-right:10px"></i>
                    </div>
                </div>
            </el-tooltip>
        </div>
        </div>
  </P-dialog>
</template>
<script>
import PDialog from './PDialog';
import PTree from './pTree';
import { searchUser } from '../org';
export default {
    name: 'Person-dialog',
    components: {
        PDialog,
        PTree
    },
    props: {
        config: {
            type: Object
        }
    },
    data() {
        return {
            treeConfig: {
                memberList: [],
                selectList: [],
                isHideOrg: true
            },
            searchPer: ''
        };
    },
    methods: {
        search() {
            searchUser({ userName: this.searchPer }).then(res => {
                this.treeConfig.memberList = [];
                if (+res.code === 0) {
                    res.data.list.forEach(it => {
                        const a = this.treeConfig.selectList.filter(e => e.userCode === it.userCode);
                        if (a.length > 0) {
                            it.isCheck = true;
                        } else {
                            it.isCheck = false;
                        }
                        this.treeConfig.memberList.push(it);
                    });
                }
            });
        },
        hideDialog(val) {
            this.$emit('before-close', val);
        },
        closePerDialog(val) {
            this.$emit('closePerDialog', val);
        },
        confirmPerDialog(val) {
            val.selectList = this.treeConfig.selectList;
            this.$emit('confirmPerDialog', val);
        },
        selectChange(item) {
            if (item.isCheck) {
                this.treeConfig.selectList.push(item);
            } else {
                this.treeConfig.selectList.forEach((it, id) => {
                    if (item.userCode === it.userCode) {
                        this.treeConfig.selectList.splice(id, 1);
                    }
                });
            }
        },
        del(item, index) {
            // 删一条
            this.treeConfig.selectList.splice(index, 1);
            this.treeConfig.memberList.forEach((it) => {
                if (it.userCode === item.userCode) {
                    it.isCheck = false;
                }
            });
        },
        clearAll() {
            // 清空
            const a = [...this.treeConfig.selectList];
            this.treeConfig.selectList = [];
            a.forEach(e => {
                this.treeConfig.memberList.forEach(el => {
                    if (e.userCode === el.userCode) {
                        el.isCheck = false;
                    }
                });
            });
        }
    },
    computed: {
        searchOrg: {
            set(val) {
                this.config.value = val;
            },
            get() {
                return this.config.value;
            }
        }
    },
    watch: {
        config: {
            handler(n, o) {
                this.treeConfig.selectList = n.selectList.map(v => {
                    return v;
                });
                this.treeConfig = Object.assign(this.treeConfig, n.tree);
            },
            deep: true
        }
    }
};
</script>
<style lang="less">
    #person-dialog {
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
        .right-content{
            width: 100%;
            height: calc(100% - 50px);
            margin-top: 10px;
            overflow: auto;
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
            float: left;
            margin-top: 10px;
            height: calc(100% - 50px);
            width: 40%;
            box-sizing: border-box;
            overflow: auto;
            border-right: 1px solid #E6E6E6;
        }
        .member-container {
            margin-top: 10px;
            padding: 0 0 0 10px;
            box-sizing: border-box;
            float: left;
            width: 60%;
            height: calc(100% - 50px);
            overflow: auto;
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
        }
    }
</style>
