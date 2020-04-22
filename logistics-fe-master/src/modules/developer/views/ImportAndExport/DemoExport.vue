<template>
    <Paper class='demo-el-export'>
        <el-card class='box-card'>
            <div slot='header' class='clearfix'>
                <h1>demo</h1>
                <el-row :gutter='10'>
                    <el-col :span='3'>
                        <el-button size='small' type='primary' @click='exportUser'>导出账户</el-button>
                    </el-col>
                    <el-col :span='5'>
                        <el-select v-model='queryOptions.enableFlag' clearable placeholder='用户状态' size='small' @change='() => getUsers()'>
                            <el-option v-for='item in statusList' :key='item.value' :label='item.name' :value='item.value'>{{item.name}}</el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <div class='table-wrap'>
                    <el-table stripe :data='userData'>
                        <el-table-column prop='userName' label='账户名称'></el-table-column>
                        <el-table-column prop='userCode' label='用户账号'></el-table-column>
                        <el-table-column prop='orgCode' label='部门'></el-table-column>
                        <el-table-column prop='mainPostName' label='岗位'></el-table-column>
                        <el-table-column label='类型'>
                            <template slot-scope='scope'>{{tenant[scope.row.tenant + 1]}}</template>
                        </el-table-column>
                        <el-table-column label='加入时间'>
                            <template slot-scope='scope'>{{formatDate(scope.row.registerDate)}}</template>
                        </el-table-column>
                        <el-table-column label='账户状态'>
                            <template slot-scope='scope'>
                                <el-switch v-model='scope.row.enableFlag' active-text='启用' inactive-text='禁用' :active-value='1' :inactive-value='0' disabled></el-switch>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-card>
        <el-card class='box-card'>
            <div slot='header' class='clearfix'>
                <h1>code</h1>
            </div>
            <pre>
            &lt;el-button size='small' type='primary' @click='exportUser'&gt;导出账户&lt;/el-button&gt;
            &lt;script&gt;
                export default {
                    data() {
                        return {
                            queryOptions: {
                                enableFlag: null,
                                orgCode: null,
                                userName: null,
                                pageNo: 1,
                                pageSize: 10
                            }
                        };
                    },
                    methods: {
                        exportUser() {
                            request({
                                url: '/api/usrInfos/export',
                                method: 'get',
                                params: this.queryOptions,
                                responseType: 'arraybuffer'
                            }).then(res => {
                                const blob = new Blob([res], {
                                    type: 'application/x-excel;charset=UTF-8'
                                });
                                const objectUrl = URL.createObjectURL(blob);
                                var a = document.createElement('a');
                                a.href = objectUrl;
                                a.download = '用户列表.xlsx';
                                a.click();
                            });
                        }
                    }
                }
            &lt;/script&gt;
            </pre>
        </el-card>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import request from '@/utils/http';
import utils from '@/utils/common';
export default {
    components: { Paper },
    data() {
        return {
            tenant: ['美的', '供应商', '司机'],
            total: 0,
            userName: '',
            queryOptions: {
                enableFlag: null,
                orgCode: null,
                userName: null,
                pageNo: 1,
                pageSize: 10
            },
            statusList: [
                {
                    name: '启用',
                    value: 1
                },
                {
                    name: '禁用',
                    value: 0
                }
            ],
            userData: []
        };
    },
    destroyed() {
        const scroll = document.getElementsByClassName('el-main')[0].scrollTop;
        window.sessionStorage.setItem('scroll', scroll);
    },
    mounted() {
        let flag = true;
        this.$store.state.tagsView.visitedViews.forEach((v, i) => {
            if (v.path === '/demo-export') flag = false;
        });
        if (flag) {
            this.getUsers();
        } else {
            const userData = window.sessionStorage.getItem('userData');
            const total = window.sessionStorage.getItem('total');
            this.userData = JSON.parse(userData);
            this.total = total;
            const scroll = window.sessionStorage.getItem('scroll');
            setTimeout(function () {
                document.getElementsByClassName('el-main')[0].scrollTop = scroll;
            }, 300);
        }
    },
    methods: {
        getUsers() {
            request({
                url: '/api/usrInfos',
                method: 'get',
                params: this.queryOptions
            }).then(res => {
                if (res.data && res.data.list) {
                    this.userData = res.data.list;
                    this.total = res.data.totalCount;
                    window.sessionStorage.setItem('userData', JSON.stringify(this.userData));
                    window.sessionStorage.setItem('total', this.total);
                }
            });
        },
        exportUser() {
            request({
                url: '/api/usrInfos/export',
                method: 'get',
                params: this.queryOptions,
                responseType: 'arraybuffer'
            }).then(res => {
                const blob = new Blob([res], {
                    type: 'application/x-excel;charset=UTF-8'
                });
                const objectUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = objectUrl;
                a.download = '用户列表.xlsx';
                a.click();
            });
        },
        formatDate(data) {
            return utils.formatDate(data);
        }
    }
};
</script>
<style lang='less'>
    .demo-el-export {
        overflow: auto;
        .table-wrap {
            margin-top: 15px;
        }
        .m-table-row:hover td,
        .m-table-stripe .m-table-body tr:nth-child(2n):hover td {
            background: #ebf7ff;
        }
        .user-auth-dialog {
            .el-dialog__headerbtn {
                z-index: 9;
            }
            .el-dialog__header {
                border-bottom: 0;
                padding: 0;
            }
            .user-info {
                margin: 2em 0 3em 0;
            }
        }
        h1 {
            font-size: 1.5em
        }
    }
</style>