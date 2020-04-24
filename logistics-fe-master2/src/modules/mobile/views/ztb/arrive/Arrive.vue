<template>
    <Paper class="arrive-register">
        <m-search-list
            popPrefix="/api-mdm/dictionaryDetail/dict" ref="searchList" :list="config.searchList" :optionNum="optionNum"
            configurationUrl='/api-auth' longPrefix="/api-gwms/es/comboBox" advancePrefix="/api-mdm"
            @onSearchChange="searchChange" :loading="loading">
        </m-search-list>
        <el-row class="arrive-content">
            <el-col :span="15">
                <list-content ref="listContent" @handleListChange='handleListChange' @handleCarItem='handleCarItem' :searchItem='searchItem' :dictData='dictData'></list-content>
            </el-col>
            <el-col :span="9" class="vehicle-detail-col">
                <vehicle-detail :currentItem='currentItem' :recordList='recordList' :dictData='dictData' @refresh='searchChange'></vehicle-detail>
            </el-col>
        </el-row>
    </Paper>
</template>
<script>
import mSearchList from '@/components/awesome/page/mPanel3/mSearchList';
import Paper from '@/components/core/paper/Paper';
import listContent from './ListContent.vue';
import vehicleDetail from './VehicleDetail.vue';
import config from './config.json';
import { mapGetters } from 'vuex';
import api from '../../../api/ztb/arrive';

export default {
    name: 'arrive-register',
    components: { mSearchList, Paper, listContent, vehicleDetail },
    computed: {
        ...mapGetters(['currentTenant'])
    },
    data() {
        return {
            config: config,
            optionNum: 'QUEUE_STATUS,QUEUE_TYPE',
            loading: false,
            currentItem: {},
            searchItem: {},
            recordList: [],
            dictData: {}
        };
    },
    methods: {
        // 搜索内容变化
        searchChange(data) {
            if (data && data.companyCode) {
                data.companyCode = data.companyCode[data.companyCode.length - 1];
            }
            this.searchItem = data;
            if (data.cdwhName) {
                delete data.cdwhName;
            }
            this.$refs.listContent.getVehicleList(data);
        },
        handleListChange(val) {
        },
        handleCarItem(val, list) {
            this.currentItem = val;
            this.recordList = list;
        },
        // 获取数据字典
        getDict() {
            const params = {
                dictCodes: 'QUEUE_TYPE,QUEUE_STATUS',
                tenantCode: this.currentTenant.tenantCode
            };
            api.dict(params).then(res => {
                this.dictData = res.data;
            });
        },
        orgOptiong() {
            api.getOrgOptions().then(res => {
                this.config.searchList.searchTxt[0].options = res.data.list;
            });
        },
        composeTree(list) {
            const data = JSON.parse(JSON.stringify(list)); // 浅拷贝不改变源数据
            const result = [];
            if (!Array.isArray(data)) {
                return result;
            }
            data.forEach(item => {
                delete item.children;
            });
            const map = {};
            data.forEach(item => {
                map[item.escoCompanyNo] = item;
            });
            data.forEach(item => {
                const parent = map[item.escoCompanyParentNo];
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    result.push(item);
                }
            });
            return result;
        }
    },
    mounted() {
        this.orgOptiong();
    },
    created() {
        this.getDict();
    }
};
</script>
<style lang='less'>
.arrive-register {
    .el-cascader {
        width: 100%
    }
    .arrive-content {
        height: calc(~ '100vh - 130px');
    }
    .vehicle-detail-col {
        border-left: 1px solid #EBEEF5;
    }
}
</style>