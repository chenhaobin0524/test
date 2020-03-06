<template>
      <el-dropdown class="header-org-style">
          <span class="el-dropdown-link">
              <img src="./orgImg.png" alt="" class="headerOrg">
              {{checkedOrganization}}
            </span>
          <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item><span> 库存组织</span><span style="float:right"> 默认</span></el-dropdown-item>
              <el-dropdown-item v-for='(item ,index) in settingLists' :key='index' :command="item.orgId">
                  <a href="javascript:void(0)" class="orgStyle">
                      <span @click="selectNode(item.orgId)">{{item.orgShortName}}</span>
                      <i class="el-icon-circle-check icon-special" @click='clickIcon(item.orgId)' size="14px" v-if="isDefault === item.isDefault"/>
                      <i class="el-icon-circle-check " @click='clickIcon(item.orgId)' size="14px" v-else />
                  </a>
              </el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
</template>
<script>
import http from '@/utils/http';
import { mapGetters } from 'vuex';
export default {
    name: 'headerOrg',
    data () {
        return {
            settingLists: [],
            checkedOrganization: '',
            isDefault: '',
            isClick: false,
            isCheck: '',
            isSpanCheck: ''
        };
    },
    created() {
        this.getOtherUserInfo();
    },
    methods: {
        getOtherUserInfo() {
            http.get('/lmes/user/login', {
            // 传参形式
                params: {
                    orgId: '',
                    loginName: this.user.userCode
                }
            }).then(res => {
                if (res.code === '0') {
                    this.settingLists = res.data.userOrgs.data;
                    this.settingLists.forEach((item, index) => {
                        if (item.orgSelected === 1) {
                            this.checkedOrganization = item.orgShortName;
                            this.isCheck = item.orgId;
                            this.isSpanCheck = item.orgId;
                        }
                        if (item.isDefault === 1) {
                            this.isDefault = item.isDefault;
                        }
                    });
                    // 将下拉框数据存储在session里面
                    const str = res.data.userParams.data;
                    const userOrgsStr = res.data.userOrgs.data;
                    const userParams = (str);
                    const userOrgs = (userOrgsStr);

                    // sessionStorage.setItem('userParams', JSON.stringify(userParams));
                    // sessionStorage.setItem('userOrgs', JSON.stringify(userOrgsStr));

                    const userJson = {

                    };
                    // console.log(userParams);
                    userParams.forEach(item => {
                        // userJson[item.code] = item.code;
                        if (userJson[item.code]) {
                            const paramsObj = {
                                paramCode: '',
                                paramValue: ''
                            };
                            if (userJson[item.code].list && userJson[item.code].list.length > 0) {
                                paramsObj.paramCode = item.paramCode;
                                paramsObj.paramValue = item.paramValue;
                                userJson[item.code].list.push(paramsObj);
                            } else {
                                paramsObj.paramCode = item.paramCode;
                                paramsObj.paramValue = item.paramValue;
                                userJson[item.code].list = [];
                                userJson[item.code].list.push(paramsObj);
                            }
                        } else {
                            const arrList = [];
                            const paramsObj = {
                                paramCode: '',
                                paramValue: ''
                            };
                            paramsObj.paramCode = item.paramCode;
                            paramsObj.paramValue = item.paramValue;
                            arrList.push(paramsObj);
                            userJson[item.code] = {
                                list: arrList
                            };
                        }
                    });
                    this.$store.commit('UPDATE_LMES_USERPARAMS', userJson);
                    this.$store.commit('UPDATE_LEMS_USER', res.data.user);
                    this.$store.commit('UPDATE_LEMS_USERORGS', userOrgs);
                }
            });
        },
        // 点击span，选中当前的库存组织，但是默认图标仍为上次勾选的默认图标
        selectNode(val) {
            const _this = this;
            _this.isSpanCheck = val;
            _this.isClick = false;
            // 切换选中的组织事件函数
            http.get('/lmes/user/login', {
            // 传参形式
                params: {
                    orgId: val,
                    loginName: this.user.userCode
                }
            }).then(res => {
                if (res.code === '0') {
                    this.$router.go(0);
                } else {
                    this.$Message.error('切换失败');
                }
            });
        },
        // 点击默认图标，切换库存组织，且默认图标为当前勾选图标
        clickIcon(val) {
            const _this = this;
            _this.isCheck = val;
            _this.isSpanCheck = val;
            _this.isClick = false;
            // 切换选中的组织事件
            http.get('/lmes/user/login', {
            // 传参形式
                params: {
                    orgId: val,
                    loginName: this.user.userCode
                }
            }).then(res => {
                if (res.code === '0') {
                    this.$router.go(0);
                } else {
                    this.$Message.error('切换失败');
                }
            });
            // 切换默认的组织事件函数
            http.get('meswms/sysOrgUserUpdateIsDefault/' + val).then(res => {
                if (res.code === '0') {
                    this.$router.go(0);
                } else {
                    this.$Message.error('切换失败');
                }
            });
        }
    },
    computed: {
        ...mapGetters(['user', 'visitedViews', 'cachedViews', 'appList', 'tenantInfo', 'currentTenant'])
    }
};
</script>
<style lang="less">
    .header-org-style{
        margin-right:20px;
        .headerOrg{
            vertical-align:middle;
        }
        .orgStyle{
            display: block;
            width: 100%;
            position: relative;
            span{
                display: block;
                width: 400px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            i{
                position: absolute;
                right:5px;
                top:10px;
            }
            .icon-special{
                color:#2B85E4;
            }
        }
    }
</style>
