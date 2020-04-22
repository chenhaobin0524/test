<template>
    <Paper class='user-center'>
        <el-row>
            <el-col :span='16' class="uc-card">
                <div class='information'>
                    <div class="card-header">
                        <span class="title">基本信息</span>
                        <span class="subtitle">同步时间：{{userInfo.updateTime}}</span>
                    </div>
                    <div class='card-body'>
                        <div class='head-portrait'>
                            <img v-if="userInfo.picUrl" src="userInfo.picUrl" alt="">
                            <div v-else class="head-spare"></div>
                            <h4 class="usr-name">{{userInfo.userName}}</h4>
                        </div>
                        <el-row class="basic-info">
                            <el-col class='text-line' :span='12'>账号： {{userInfo.userCode}}</el-col>
                            <!-- <el-col class='text-line' :span='12'>状态： {{userInfo.name}}</el-col> -->
                            <el-col class='text-line' :span='12'>手机： {{userInfo.mobile}}</el-col>
                            <el-col class='text-line' :span='12'>员工编码： {{userInfo.employeeId}}</el-col>
                            <el-col class='text-line' :span='24'>邮箱地址： {{userInfo.email}}</el-col>
                            <el-col class='text-line' :span='24'>部门职位： {{userInfo.orgName}} {{userInfo.positionName ? userInfo.positionName : ''}}</el-col>
                        </el-row>
                    </div>
                </div>
            </el-col>
            <el-col :span='8' class="uc-card" style="border-left: 10px solid #fafafa;">
                <div class="account-info">
                    <div class="card-header">
                        <span class="title">账号信息</span>
                    </div>
                    <div class='card-body'>
                        <ul>
                            <li v-for="account in userAccount" :key="account.id" class="acc-li">
                                <img v-if="account.picUrl" src="account.picUrl" class="head-spare" alt="">
                                <div v-else class="head-spare"></div>
                                <span class="acc-wrapper">
                                    <p class="acc-text">{{account.account}}</p>
                                    <p class="subtext">{{accountTypeMap[account.accountType]}}</p>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span='24' class="uc-card" style="border-top: 10px solid #fafafa;">
                <el-tabs value="role">
                    <el-tab-pane label="角色权限" name="role">
                        <el-table stripe :data='roles'>
                            <el-table-column prop='roleName' label='角色名称'></el-table-column>
                            <el-table-column prop='applicationName' label='应用'></el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="应用权限" name="resource">
                        <el-tree :data="resouces" :props="defaultResouceProps"></el-tree>
                    </el-tab-pane>
                    <el-tab-pane label="租户权限" name="tenant">
                        <el-table stripe :data='tenants'>
                            <el-table-column prop='tenantName' label='租户列表'></el-table-column>
                            <el-table-column prop='tenantCode' label='编码名称'></el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import UserCenterApi from '../api/UserCenterApi';
import { getUserInfoResources } from '../api/AcountManageApi.js';

export default {
    name: 'userCenter',
    data() {
        return {
            userInfo: {},
            userAccount: [],
            accountTypeMap: {
                0: '集团用户',
                1: '微信',
                2: '手机',
                3: '第三方授权appkey用户',
                99: '游客'
            },
            roles: [],
            resouces: [],
            tenants: [],
            defaultResouceProps: {
                children: 'subResources',
                label: 'resourceName'
            }
        };
    },
    mounted() {
        UserCenterApi.getUserInfo().then(res => {
            if (res && res.data) {
                this.userInfo = res.data;
                UserCenterApi.getUserRoles(this.userInfo.userCode).then(res => {
                    if (res && res.data) {
                        this.roles = res.data || [];
                    }
                });
                getUserInfoResources({ userCode: this.userInfo.userCode }).then(res => {
                    if (res && res.data) {
                        this.resouces = [{
                            resourceName: '应用',
                            subResources: res.data || []
                        }];
                    }
                });
                UserCenterApi.getUserTenants(this.userInfo.userCode).then(res => {
                    if (res && res.data) {
                        this.tenants = res.data || [];
                    }
                });
            };
        });
        UserCenterApi.getAccount().then(res => {
            if (res && res.data) {
                this.userAccount = res.data.list || [];
            };
        });
    },
    components: { Paper }
};
</script>
<style lang='less'>
.user-center {
    background: #f6f8fa;
    .uc-card {
        background: #fff;
        .card-header {
            padding: 15px;
            font-size: 14px;
            border-bottom: 2px solid #f6f8fa;
            .subtitle {
                float: right;
                font-size: 12px;
                color: #aaa;
            }
        }
        .card-body {
            display: flex;
            padding: 15px;
            .head-portrait {
                text-align: center;
                margin: 15px 50px 0 30px;
                .usr-name{
                    color: #333;
                    font-weight: normal;
                }
            }
            .head-spare {
                height: 72px;
                width: 72px;
                border-radius: 50%;
                flex-shrink: 0;
                background: #e4e4e4;
            }
        }

        .el-tab-pane{
            padding: 0 15px 15px 15px;
        }
        .el-tabs__nav{
            margin-left: 25px;
            height: 46px;
            padding-top: 6px;
        }
    }
    .account-info {
        .card-body {
            flex-direction: column;
            height: 151.53px;
            overflow: overlay;
            .acc-li {
                &:not(:last-child){
                    margin-bottom: 15px;
                }
                .head-spare {
                    width: 44px;
                    height: 44px;
                    float: left;
                }
                .acc-wrapper {
                    display: inline-block;
                    padding-left: 10px;
                    .acc-text {
                        margin: 5px 0;
                        color: #333;
                        font-size: 14px;
                    }
                    .subtext {
                        color: #aaa;
                        font-size: 12px;
                    }
                }
            }
        }
    }
    .basic-info {
        width: 100%;
        font-size: 12px;
        color: #333;
        .text-line {
            margin: 10px 0;
        }
    }
    .el-input.is-disabled .el-input__inner {
        background-color: #ffffff;
        border-color: #e4e7ed;
        color: #101010;
        cursor: auto;
    }
    .el-form-item__label {
        color: #999999;
        font-weight: normal;
    }
    .el-tabs__item {
        font-weight: normal;
    }
}
</style>