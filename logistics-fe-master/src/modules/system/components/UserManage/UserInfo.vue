<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="userInfo">
            <div class="user-info-wrap">
                <el-row>
                    <el-col :span="4">
                        <!-- <img /> -->
                        <div class="avatar"></div>
                    </el-col>
                    <el-col :span="20">
                        <h4 style="font-size: 18px;">{{userData.userName}}</h4>
                        <p class="position-info">{{userData.mainPostName}} | {{userData.orgCode}}</p>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">用户编号：{{userData.id}}</el-col>
                    <el-col :span="12">用户账号：{{userData.userCode}}</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">用户邮箱：{{userData.email}}</el-col>
                    <el-col :span="12">账户状态：{{userData.tenantUserEnableFlag === 1 ? '启用' : '停用'}}</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">手机号码：{{userData.mobile}}</el-col>
                    <el-col :span="12">加入时间：{{formatDate(userData.registerDate)}}</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">用户类型：{{userData.userTypeName}}</el-col>
                    <el-col :span="12"></el-col>
                </el-row>
            </div>
        </el-tab-pane>
        <el-tab-pane label="权限信息" name="authorityInfo">
            <el-tree :data="dataTree" :props="defaultProps" class="tree-wrapper"></el-tree>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import utils from '@/utils/common';
import { getUserInfoResources } from '../../api/AcountManageApi.js';
export default {
    props: ['userData'],
    data() {
        return {
            TENANT: ['美的', '供应商', '司机'],
            activeName: 'userInfo',
            dataTree: [],
            defaultProps: {
                children: 'subResources',
                label: 'resourceName'
            }
        };
    },
    methods: {
        _getUserInfoResources() {
            getUserInfoResources({ userCode: this.userData.userCode }).then(res => {
                if (res && +res.code === 0) {
                    this.dataTree = res.data;
                }
            });
        },
        formatDate(date) {
            return utils.formatDate(date);
        },
        handleClick(tab) {
            if (tab.name === 'authorityInfo') {
                this._getUserInfoResources();
            }
        }
    }
};
</script>
<style lang="less">
.user-info-wrap {
    padding: 10px;
    .avatar{
        width: 55px;
        height: 55px;
        border-radius: 50%;
        background-color: #FF6100;
    }
    .position-info {
        color: #666;
    }
    .el-row {
        margin: 2em 0;
        &:nth-child(1) {
            margin-top: 0;
        }
    }
}
.tree-wrapper{
    height: 400px;
    overflow-y: auto;
}
</style>