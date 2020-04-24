<template>
    <div class="distribution">
        <el-table :data="allocateData" v-loading="tableLoading">
        <el-table-column property label width="50" center>
          <template slot-scope="scope">
            <el-radio
              v-model="radio"
              class="radio"
              :disabled="scope.row.radioDisabled"
              :label="scope.$index"
              @change.native="getCurrentRow(scope.row, scope.$index)"
            >&nbsp;</el-radio>
          </template>
        </el-table-column>
        <!-- <el-table-column property="distributionSiteName" label="服务平台" width="120"></el-table-column> -->
        <el-table-column property="distributionWhName" label="一级分拨仓"></el-table-column>
        <el-table-column property label width="50" center>
          <template slot-scope="scope">
            <el-radio
              class="radio"
              v-model="nextRadio"
              :disabled="scope.row.nextRadioDisabled"
              :label="scope.$index"
              @change.native="getCurrentNextRow(scope.row, scope.$index)"
            >&nbsp;</el-radio>
          </template>
        </el-table-column>
        <!-- <el-table-column property="nextDistributionSiteName" label="服务平台" width="120"></el-table-column> -->
        <el-table-column property="nextDistributeWhName" label="二级分拨仓"></el-table-column>
      </el-table>
      <div class="dis-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleAllocate">确 定</el-button>
      </div>
    </div>
</template>
<script>
import { getStorageData, getAllocate } from '../../../../api/dispatchCenter';
export default {
    props: {
        rowData: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            tableVisible: false,
            allocateData: [],
            radio: false,
            nextRadio: false,
            tableLoading: false,
            checkedWarehouse: []
        };
    },
    methods: {
        handleAllocate() {
            if (this.checkedWarehouse.length === 0) {
                this.$message.warning('至少勾选一个分拨仓库');
                return;
            };
            if (this.allocateData.length === 1) {
                if (this.allocateData[0].radioDisabled && this.allocateData[0].nextRadioDisabled) return this.$message.warning('没有可分拨的仓库');
            }
            const obj = {
                ...this.checkedWarehouse,
                taskNo: this.rowData.taskNo
            };
            getAllocate(obj).then(res => {
                if (+res.code === 0) {
                    this.$message.success('分拨成功');
                    this.radio = false;
                    this.nextRadio = false;
                    this.$emit('distributionOk');
                };
            });
        },
        handleCancel() {
            this.$emit('distributionCancel');
        },
        getTableList(data) {
            const params = { orderNo: data.orderNo };
            this.tableLoading = true;
            getStorageData(params).then(res => {
                this.tableLoading = false;
                if (res && res.data) {
                    let filterData = [];
                    if (res.data.length > 0) {
                        filterData = res.data.filter(item => JSON.stringify(item) !== '{}');
                    }
                    if (this.rowData.taskType === 'OUT') {
                        filterData.map(item => {
                            item.radioDisabled = false;
                            item.nextRadioDisabled = false;
                        });
                    } else if (this.rowData.taskType === 'DO' || this.rowData.taskType === 'RDO') {
                        filterData.map(item => {
                            item.radioDisabled = true;
                            item.nextRadioDisabled = false;
                        });
                    }
                    this.allocateData = filterData;
                    if (this.allocateData.length <= 0) {
                        this.$message.warning('无分拨仓数据，请核实是否已配置');
                    } else if (this.allocateData.length === 1) {
                        if (!this.allocateData[0].distributionWhCode && !this.allocateData[0].nextDistributeWhCode) {
                            this.allocateData[0].radioDisabled = true;
                            this.allocateData[0].nextRadioDisabled = true;
                            this.radio = false;
                            this.nextRadio = false;
                            this.checkedWarehouse = [];
                        } else if (this.allocateData[0].distributionWhCode && this.allocateData[0].nextDistributeWhCode) {
                            this.allocateData[0].nextRadioDisabled = false;
                            this.allocateData[0].radioDisabled = false;
                        } else if (this.allocateData[0].distributionWhCode) {
                            this.allocateData[0].nextRadioDisabled = true;
                            this.radio = 0;
                            this.checkedWarehouse = {
                                distributionSiteCode: this.allocateData[0].distributionSiteCode || '',
                                distributionSiteName: this.allocateData[0].distributionSiteName || '',
                                distributionWhCode: this.allocateData[0].distributionWhCode,
                                distributionWhName: this.allocateData[0].distributionWhName
                            };
                        } else if (this.allocateData[0].nextDistributeWhCode) {
                            this.allocateData[0].radioDisabled = true;
                            this.nextRadio = 0;
                            this.checkedWarehouse = {
                                nextDistributeSiteCode: data.nextDistributeSiteCode || '',
                                nextDistributeSiteName: data.nextDistributeSiteName || '',
                                nextDistributeWhCode: data.nextDistributeWhCode,
                                nextDistributeWhName: data.nextDistributeWhName
                            };
                        }
                    } else {
                        this.allocateData.map(item => {
                            if (!item.distributionWhCode && !item.nextDistributeWhCode) {
                                item.radioDisabled = true;
                                item.nextRadioDisabled = true;
                            } else if (item.distributionWhCode && item.nextDistributeWhCode) {
                                item.radioDisabled = false;
                                item.nextRadioDisabled = false;
                            } else if (item.distributionWhCode) {
                                item.radioDisabled = false;
                                item.nextRadioDisabled = true;
                            } else if (item.nextDistributeWhCode) {
                                item.radioDisabled = true;
                                item.nextRadioDisabled = false;
                            }
                        });
                    }
                }
            }).catch(() => {
                this.tableLoading = false;
            });
        },
        getCurrentRow(data, index) {
            this.nextRadio = false;
            this.radio = index;
            this.checkedWarehouse = {
                distributionSiteCode: data.distributionSiteCode || '',
                distributionSiteName: data.distributionSiteName || '',
                distributionWhCode: data.distributionWhCode,
                distributionWhName: data.distributionWhName
            };
        },
        getCurrentNextRow(data, index) {
            this.radio = false;
            this.nextRadio = index;
            this.checkedWarehouse = {
                nextDistributeSiteCode: data.nextDistributeSiteCode || '',
                nextDistributeSiteName: data.nextDistributeSiteName || '',
                nextDistributeWhCode: data.nextDistributeWhCode,
                nextDistributeWhName: data.nextDistributeWhName
            };
        }
    },
    mounted() {
        this.getTableList(this.rowData);
    }
};
</script>
<style lang="less">
    .distribution {
        .dis-footer {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
