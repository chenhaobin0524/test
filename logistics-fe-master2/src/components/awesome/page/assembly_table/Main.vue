<template>
    <div>
        <p v-if="tableTitle" :style="{marginBottom: '6px', fontSize: '16px', fontWeight: 'bold'}">
            <i type="grid"></i>&nbsp;{{$t(tableTitle)}}
        </p>
        <el-collapse v-if="settings.needSearch" value="1">
            <el-collapse-item name="1">&nbsp;&nbsp;<b>{{$t('page.assemblyTable.searchCondition')}}</b>&nbsp;<i type="search"></i>
                <div slot="content">
                    <page-form @onSubmit="onSubmit" :formData="formData" :needValidation="settings.needValidation"></page-form>
                </div>
            </el-collapse-item>
        </el-collapse>
        <m-table :loading="loading" :data="data" :columns="columns" :table-buttons="tableButtons"
                @onView="onView" @onEdit="onEdit" @onDelete="onDelete" @rowClick="onRowClick" @select="onSelect"
                @onSelectionChange="onSelectionChange" @selectAll="onSelectAll" @onSysAdd="onSysAdd"
                @onSysEdit="onSysEdit" @onSysDelete="onSysDelete" @onSysImport="onSysImport" @onSysExport="onSysExport">
        </m-table>
        <m-pagination class="no-top-border" v-if="settings.needPager" :showElevator="settings.showElevator"
                :showSizer="settings.showSizer" :pageSize="pageSize" :total="total" :pageSizeOpts="settings.pageSizeOpts"
                @on-page-size-change="onPageSizeChange" @on-current-page-change="onCurrentPageChange"></m-pagination>
    </div>
</template>
<script>
import pageForm from '../form/index';
import mTable from '../table/index';
import mPagination from '../pagination/index';

export default {
    name: 'mAssemblyTable',
    components: { pageForm, mTable, mPagination },
    data() {
        return {
            current: 1,
            pageSize: 10,
            condition: {}
        };
    },
    props: {
        tableButtons: {
            type: Object,
            default () {
                return {};
            }
        },
        loading: {
            type: Boolean,
            default: false
        },
        tableTitle: {
            type: String,
            default: ''
        },
        formData: {
            type: Object,
            default () {
                return {
                    items: [],
                    row: 0,
                    buttons: {}
                };
            }
        }, // 查询条件配置
        columns: {
            type: Object,
            default () {
                return {
                    showCheckbox: { type: Boolean, default: true },
                    columns: { type: Array, default () { return []; } },
                    buttons: {
                        type: Object,
                        default () {
                            return {
                                view: {
                                    type: Boolean,
                                    default: false
                                },
                                edit: {
                                    type: Boolean,
                                    default: false
                                },
                                delete: {
                                    type: Boolean,
                                    default: false
                                },
                                selfDef: {
                                    type: Array,
                                    default () {
                                        return [];
                                    }
                                }
                            };
                        }
                    }
                };
            }
        }, // 数据列定义
        data: {
            type: Array,
            default () {
                return [];
            }
        }, // 表格数据
        total: {
            type: Number,
            default: 0
        }, // 总记录数
        settings: {
            type: Object,
            default () {
                return {
                    needPager: {
                        type: Boolean,
                        default: true
                    }, // 是否需要分页，默认true
                    showElevator: {
                        type: Boolean,
                        default: true
                    }, // 分页组件是否显示电梯导航，默认true
                    showSizer: {
                        type: Boolean,
                        default: true
                    }, // 是否显示每页显示多少条数据的下拉框，默认true
                    pageSizeOpts: {
                        type: Array,
                        default () {
                            return [10, 30, 50, 80];
                        }
                    }, // 每页显示多少条数据配置
                    needSearch: {
                        type: Boolean,
                        default: true
                    }, // 是否需要查询条件，默认true
                    needValidation: {
                        type: Boolean,
                        default: false
                    } // 查询条件是否需要验证，默认false
                };
            }
        }
    },
    methods: {
        // 提交按钮点击时触发
        onSubmit(condition) {
            this.condition = condition;
            this.$emit('onSubmit', this.current, this.pageSize, this.condition);
        },
        // 页容量改变时触发
        onPageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.$emit('onPageSizeChange', this.current, this.pageSize, this.condition);
        },
        // 当前页改变时触发
        onCurrentPageChange(current) {
            this.current = current;
            this.$emit('onCurrentPageChange', this.current, this.pageSize, this.condition);
        },
        onView(row, column, index) {
            this.$emit('onView', row, column, index);
        },
        onEdit(row, column, index) {
            this.$emit('onEdit', row, column, index);
        },
        onDelete(row, column, index) {
            this.$emit('onDelete', row, column, index);
        },
        onRowClick(row, index) {
            this.$emit('onRowClick', row, index);
        },
        onSelect(selection, row) {
            this.$emit('onSelect', selection, row);
        },
        onSelectionChange(selection) {
            this.$emit('onSelectionChange', selection);
        },
        onSelectAll(selection) {
            this.$emit('onSelectAll', selection);
        },
        onSysExport() {
            this.$emit('onSysExport');
        },
        onSysImport() {
            this.$emit('onSysImport');
        },
        onSysAdd() {
            this.$emit('onSysAdd');
        },
        onSysEdit(selection) {
            this.$emit('onSysEdit', selection);
        },
        onSysDelete(selection) {
            this.$emit('onSysDelete', selection);
        }
    }
};
</script>
<style lang="less" scoped>
h4 {
    letter-spacing: 2px;
}

.tableButtons {
    padding: 12px 0;
}

.m-card-body>.m-collapse {
    border-bottom: 0;
}

.no-top-border {
    border: 1px solid #dddee1;
    border-top: 0;
}
</style>
<style lang="less">
.m-collapse>.m-collapse-item>.m-collapse-header {
    padding-left: 16px;
}
</style>