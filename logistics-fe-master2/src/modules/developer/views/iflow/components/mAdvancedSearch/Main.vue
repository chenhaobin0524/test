<template>
    <el-dialog
        :append-to-body="shadeState"
        :title="advanceLabel"
        :visible.sync="showState"
        width="50%">
  <div id="advanced-search">
        <el-select v-model="selectData" class="select-box">
            <el-option label="全部" value="all"></el-option>
            <el-option
            v-for="(val, index) in advanceConfig"
            :key=index
            :label="val.value"
            :value="val.prop">
            </el-option>
        </el-select>
        <el-input class="search-box" placeholder="请输入" v-model="searchDate"></el-input>
        <el-button @click="() =>clickInquire(advanceUrl)" type="primary">查 询</el-button>
        <el-button @click="reset">重 置</el-button>
        <el-row :gutter="20">
            <el-col :span="8" v-if="multiple">
                <el-table :data="advanceList" class="table-box" height="300" highlight-current-row>
                    <el-table-column :prop="name.prop" :label="name.value"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="60">
                        <template slot-scope="scope">
                            <el-button class="deleteBtn" @click=deleteDate(scope.$index) size="small" type='text'>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="multiple?16:24">
                <el-table :data="tableData" class="table-box" height="300" highlight-current-row @row-click="selectionRow" @row-dblclick="dblrow">
                    <el-table-column v-for="(val, index) in advanceConfig" :key=index  :prop="val.prop" :label="val.value"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div>
            <div v-if="mPageState">
            <m-page class="left" :pageData="pageConfig" :total="pageTotal" @on-page-change="pageChange" @on-size-change="sizeChange" ref="handcurrenPage"></m-page>
            </div>
            <span class="footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
            <span class="clear"></span>
        </div>
  </div>

    </el-dialog>
</template>

<script>
import popSit from './api';
import mPage from '../mPage';

export default {
    components: { mPage },
    data() {
        return {
            searchDate: '',
            searchName: '',
            searchCode: '',
            name: '',
            multiple: false,
            selectData: 'all',
            showState: false,
            currentPage: 1,
            tableData: [],
            pageSize: 10,
            pageTotal: 0,
            pageConfig: {
                layout: 'total, prev, pager, next',
                pageSize: 10,
                pageSizes: [10, 20, 30, 50, 100]
            },
            selectCode: [],
            advanceConfig: [],
            advanceList: [],
            advanceUrl: '',
            shadeState: true,
            cusAdvancePrefix: '',
            ajaxTypeUrl: '',
            acceptParams: {},
            mPageState: true
        };
    },
    props: {
        advanceLabel: {
            type: String,
            default() {
                return '';
            }
        },
        advancePrefix: String
    },
    methods: {
        clickInquire(url) {
            this.currentPage = 1;
            this.mPageState = false;
            this.inquire(url);
            this.$nextTick(() => {
                this.mPageState = true;
            });
        },
        cancel() {
            this.showState = false;
            this.$emit('detali-search-cel');
            this.reset();
        },
        confirm() {
            this.showState = false;
            if (this.multiple) {
                const searchName = [];
                const searchCode = [];
                this.advanceList.map(item => {
                    searchName.push(item[this.advanceConfig[1].prop]);
                    searchCode.push(item[this.advanceConfig[0].prop]);
                });
                this.searchName = searchName.join(',');
                this.searchCode = searchCode.join(',');
            } else {
                if (this.advanceList === undefined) {
                } else {
                    this.searchName = this.advanceList[this.advanceConfig[1].prop];
                    this.searchCode = this.advanceList[this.advanceConfig[0].prop];
                }
            }
            this.$emit('detali-search-sure', this.searchName, this.searchCode, this.advanceList);
            this.tableData = [];
            this.reset();
        },
        reset() {
            this.searchDate = '';
            this.selectData = 'all';
            this.searchName = '';
            this.searchCode = '';
            this.advanceList = [];
        },
        inquire(url, value, item, type, code, ajaxType, acceptParams) {
            if (url) {
                this.advanceUrl = url;
            }
            if (item && item.advancePrefix) {
                this.cusAdvancePrefix = item.advancePrefix;
            }
            if (item && item.advanceConfig) {
                this.advanceConfig = item.advanceConfig;
                this.multiple = item.multiple;
                this.name = this.advanceConfig[1];
                this.selectData = 'all';
            }
            if (this.multiple) {
                if (code) {
                    const codeDate = code.split(',');
                    const valueDate = value.split(',');
                    codeDate.map((item, index) => {
                        const data = {};
                        data[this.advanceConfig[1].prop] = valueDate[index];
                        data[this.advanceConfig[0].prop] = item;
                        this.advanceList.push(data);
                    });
                } else {
                    this.advanceList = [];
                }
            } else {
                if (value && value !== '') {
                    this.searchDate = value;
                }
            }
            const params = {
                pageSize: this.pageSize,
                pageNo: this.currentPage
            };
            if (this.selectData === 'all') {
                this.advanceConfig.map(item => {
                    params[item.prop] = this.searchDate;
                });
            } else if (this.selectData !== '') {
                params[this.selectData] = this.searchDate;
            }
            if (item === undefined) {
            } else {
                params.pageNo = 1;
                this.ajaxTypeUrl = ajaxType;
                if (this.$refs.handcurrenPage !== undefined) {
                    this.$refs.handcurrenPage.handlecurrentPage();
                }
            }

            const advancePrefix = this.cusAdvancePrefix ? this.cusAdvancePrefix : this.advancePrefix;
            if (JSON.stringify(acceptParams) === '{}') {
            } else {
                if (acceptParams !== undefined) {
                    this.acceptParams = acceptParams;
                    Object.assign(params, this.acceptParams);
                } else {
                    Object.assign(params, this.acceptParams);
                }
            }
            popSit(advancePrefix, this.advanceUrl, params, this.ajaxTypeUrl).then(res => {
                this.tableData = res.data.list;
                this.pageTotal = res.data.totalCount;
            }).then(() => {
                if ((this.tableData.length === 0 || this.tableData.length === 1) && type && !this.multiple) {
                    this.selectionRow(this.tableData[0]);
                    this.confirm();
                    this.showState = false;
                }
            });
        },
        sizeChange(val) {
            this.pageSize = val;
            this.inquire();
        },
        pageChange(val) {
            this.currentPage = val;
            this.inquire();
        },
        deleteDate(index) {
            this.advanceList.splice(index, 1);
        },
        dblrow(currentRow) {
            if (!this.multiple) {
                this.advanceList = currentRow;
                this.confirm();
            }
        },
        selectionRow(currentRow) {
            if (this.multiple) {
                let num = 0;
                if (this.advanceList.length === 10) {
                    this.$message({
                        message: '最多选中10条数据',
                        type: 'warning'
                    });
                } else {
                    this.advanceList.map(item => {
                        if (item[this.advanceConfig[0].prop] === currentRow[this.advanceConfig[0].prop]) {
                            num += 1;
                        }
                    });
                    if (num === 0) {
                        this.advanceList.push(currentRow);
                    }
                }
            } else {
                this.advanceList = currentRow;
            }
        }
    }
};
</script>

<style lang="less">
  #advanced-search{
      padding-bottom: 20px;
    .select-box{
        width: 140px;
        margin-right: 10px;
    }
    .search-box{
        width: 200px;
        margin-right: 10px;
    }
    .table-box{
        width: 100%;
        margin: 10px 0;
    }
    .el-table {
        min-height: 300px !important;
        max-height: 300px !important;
    }
    .left {
        float: left;
    }
    .deleteBtn{
        padding: 0;
    }
    .footer {
        float: right;
        padding: 2px 5px;
    }
    .clear {
        clear: both;
    }
    .el-dialog__body {
        padding-bottom: 50px;
        padding-top: 10px;
    }
    .el-dialog__header {
        padding: 10px 20px;
    }
    .el-dialog__headerbtn {
        top: 15px;
    }
  }
</style>
