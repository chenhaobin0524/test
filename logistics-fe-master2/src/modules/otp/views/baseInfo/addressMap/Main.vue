<template>
    <paper>
        <m-pane ref="tablePage"
                :config="config"
                :totalData="totalData"
                :pageTotal="pageTotal"
                :optionNum="optionNum"
                :loading="loading"
                :searchTotalTitle="searchTotalTitle"
                @saveData="saveData"
                @row-db-click="rowDBclick"
                @getTableConfigList="getTableConfigList"
                @check-btn="checkBtn"
                @edit-btn="editBtn"
                @del-btn="delBtn"
                @switch-change="switchChange"
                @selectChange="selectChange"
                @searchChange="searchChange"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
                searchId="distribution_rule"
                pageID="distribution_rule">
            <div slot="table-module-btn">
                <el-tooltip class="item"
                            effect="dark"
                            content="新增"
                            placement="bottom">
                    <el-button size="mini"
                               icon='el-icon-plus'
                               @click="addData"></el-button>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span v-has="'05020001'"><el-button type="primary" @click="redomet">删 除</el-button></span>
                <span style="margin-left: 10px;" v-has="'05020002'"><el-button type="primary" @click="saveData">保 存</el-button></span>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import _ from '@/components/lots/utils';
import mPane from '@/components/otpPanel';
import config from './config.js';
import paper from '@/components/core/paper/Paper';
import { addressMappings, deleteAddressMapping, addAddressMapping } from '../../../api/baseInfoApi';
import { messageBox } from '../../../utils/messageBox';
export default {
    name: 'distribution',
    components: { mPane, paper },
    data() {
        return {
            config: config,
            loading: false,
            optionNum: '',
            totalData: [],
            pageTotal: 10,
            searchTotalTitle: config.searchTotalTitle,
            selectRow: [],
            searchParams: {
                pageNo: 1,
                pageSize: 10
            },
            mustFillParams: {
                upperProvince: '',
                upperCity: '',
                upperDistrict: '',
                upperTown: '',
                location: []
            }
        };
    },
    methods: {
        async fetchData() {
            const res = await addressMappings({ ...this.searchParams });
            if (res) {
                if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.fetchData();
                } else {
                    res.data.list.map(item => {
                        item.location = [item.provinceCode, item.cityCode, item.districtCode, item.townCode].filter(o => o);
                        item.locationName = [item.provinceName, item.cityName, item.districtName, item.townName].filter(o => o).join('/');
                    });
                    this.totalData = res.data.list.map(item => {
                        return { ...this.mustFillParams, ...item };
                    });
                    this.pageTotal = res.data.totalCount;
                }
            } else {
                this.totalData = [];
            }
        },
        rowDBclick(row) {
            // 表格内双击事件
        },
        checkBtn(data) {
            // 表格内按钮查看事件;
        },
        editBtn(data) {
            // 表格内按钮修改事件;
        },
        delBtn(data) {
            // 表格内按钮删除事件;
        },
        selectChange(data) {
            // 表格内选择变化
            this.selectRow = data;
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        searchChange(data) {
            // 提交搜索框
            if (data.location) {
                [data.provinceCode, data.cityCode, data.districtCode, data.townCode] = data.location;
                Reflect.deleteProperty(data, 'location');
            }
            this.searchParams = {
                pageNo: 1,
                pageSize: this.searchParams.pageSize,
                ...data
            };
            this.fetchData();
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.fetchData();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            this.fetchData();
        },
        addData() {
            // 表格新增方法
            this.$refs.tablePage.$refs.table.addRow();
        },
        saveData(data) {
            // 表格新增修改后返回数据
            const rows = _.clone(this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData());
            if (!rows.length && rows !== false) {
                this.$message.warning('请勾选要保存的数据');
                return;
            }
            if (!rows) {
                // this.$message.warning('请确保必填数据不为空');
                return;
            }
            rows.forEach((item, index) => {
                if (item.location && _.isArray(item.location)) {
                    [item.provinceCode, item.cityCode, item.districtCode, item.townCode] = item.location;
                    [item.provinceName, item.cityName, item.districtName, item.townName] = item.locationName.split('/');
                }
                Reflect.deleteProperty(item, 'location');
                Reflect.deleteProperty(item, 'locationName');
            });
            addAddressMapping(rows).then(res => {
                if (res.code === '0') {
                    this.$message.success('操作成功');
                    this.fetchData();
                }
            });
        },
        redomet(data) {
            // 这是删除方法
            const rows = this.selectRow;
            if (!rows.length) {
                this.$message.warning('请勾选需要删除的数据');
                return;
            }
            const idList = [];
            rows.map(item => {
                if (item.id) {
                    idList.push(item.id);
                }
            });
            if (!idList.length) {
                this.fetchData();
                return;
            }
            messageBox(this).then(() => {
                deleteAddressMapping(idList).then(res => {
                    if (res.code === '0') {
                        this.$message.success('删除成功');
                        this.fetchData();
                    }
                });
            });
        },
        getTableConfigList(data) {
        },
        refresh() {
            // 表格内刷新按钮
        }
    },
    created() {
        this.fetchData();
    }
};
</script>
