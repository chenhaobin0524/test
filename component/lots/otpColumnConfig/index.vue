<template>
    <el-dialog :visible.sync="dialogVisible">
        <div slot="title" class="column-config_title">
            列配置<small>请选择要显示的列(可拖拽排序)</small>
        </div>
        <div class="component-container">
            <div class="clearfix">
                <div class="all-column selected" :draggable="true" v-for="(item, index) in selectedColumns"
                        :key="'selected' + index">
                    <el-button :draggable="true"
                            @dragstart.native="handleItemDragStart($event, item, index)"
                            @dragend.native="handleItemDragEnd($event)"
                            @dragenter.native="handleItemDragEnter($event, item, index)">
                        {{item.label}}
                    </el-button>
                    <i class="btn-icon el-icon-error" v-if="!item.columnStick" @click="handleSelectedClose(item, index)"></i>
                </div>
                <div class="all-column" v-for="(item, index) in closedColumns" :key="'columns' + index"
                        :class="{ disabled: item.disabled}">
                    <el-button @click="handleSelectClick(item)">
                        {{item.label}}
                    </el-button>
                    <i @click="handleSelectClick(item)" class="btn-icon"
                        :class="item.disabled ? 'el-icon-circle-check' : 'el-icon-circle-plus'"></i>
                </div>
            </div>
            <div class="config-footer">
                <el-row>
                    <el-col :span="12">
                        <el-button class="pull-left" @click="handleSelectAll">全选</el-button>
                        <el-button class="pull-left" @click="handleReset">重置</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-button type="text" @click="handleCancel">取消</el-button>
                        <el-button type="primary" @click="handleSave">确定</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex';
import { columnsConfigApi } from '../api';
import { clone } from '../utils';
export default {
    computed: {
        ...mapGetters(['menus'])
    },
    data() {
        return {
            dialogVisible: false,
            columns: [],
            selectedColumns: null,
            closedColumns: null,
            dragEl: null,
            dragElData: null,
            resourceCode: ''
        };
    },
    props: {
        pageID: String,
        initColumns: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    methods: {
        show(status = false) {
            this.columns = clone(this.initColumns);
            this.backupColumns = clone(this.initColumns);
            this.dialogVisible = status;
        },
        // 刷新页面数据
        refresh() {
            this.columns = [...this.columns];
        },
        deepMenu(node) {
            const nodes = [];
            if (node) {
                nodes.push(node);
                const childrens = node.subResources;
                if (childrens) {
                    for (let i = 0; i < childrens.length; i++) {
                        if (childrens[i].frontUrl === this.$route.path) {
                            this.resourceCode = childrens[i].resourceCode;
                        } else {
                            this.deepMenu(childrens[i]);
                        }
                    }
                }
            }
        },
        // 添加显示列
        handleSelectClick(item) {
            item.hiddenColumn = false;
            this.refresh();
        },
        // 取消显示列
        handleSelectedClose(item, index) {
            item.hiddenColumn = true;
            this.refresh();
        },
        // 拖拽钩子
        handleItemDragStart(ev, item, key) {
            this.dragElData = { item, key };
            this.dragEl = ev.target;
            this.dragEl.classList.add('draging');
        },
        handleItemDragEnd(ev) {
            if (ev.preventDefault) {
                ev.preventDefault();
            }
            this.dragEl.classList.remove('draging');
            this.dragEl = null;
            this.dragElData = null;
        },
        handleItemDragEnter(ev, item, key) {
            if (item.prop !== this.dragElData.item.prop) {
                this.selectedColumns.splice(this.dragElData.key, 1);
                this.selectedColumns.splice(key, 0, this.dragElData.item);
                this.dragElData.key = key;
            }
        },
        // 全选
        handleSelectAll() {
            this.closedColumns.forEach(element => {
                element.hiddenColumn = false;
            });
            this.refresh();
        },
        handleReset() {
            this.columns = clone(this.backupColumns);
        },
        handleCancel() {
            this.show(false);
        },
        // 确定，返回操作之后的表头列表
        handleSave() {
            this.$emit('getTableConfigList', this.selectedColumns.concat(this.closedColumns));
            this.show(false);

            // 保存表头数据
            if (!this.pageID) return;
            let allColumns = [];
            let allColumnsprop = [];
            for (const item of this.selectedColumns) {
                allColumns.push(item.label);
                allColumnsprop.push(item.prop);
            }
            allColumns = allColumns.join(',');
            allColumnsprop = allColumnsprop.join(',');
            const params = {
                'configName': allColumnsprop,
                'configNameCn': allColumns,
                'subjectType': this.pageID,
                'moduleCode': this.resourceCode
            };
            columnsConfigApi.save(params).then(() => {});
        }
    },
    watch: {
        columns(val) {
            this.selectedColumns = this.columns.filter(item => !item.hiddenColumn);
            this.closedColumns = this.columns.filter(item => item.hiddenColumn);
        }
    },
    async created() {
        // 没传pageID，不获取数据
        if (!this.pageID) return;
        const menu = { subResources: clone(this.menus) };
        await this.deepMenu(menu);
        const columns = clone(this.initColumns);
        const params = {
            'moduleCode': this.resourceCode,
            'subjectType': this.pageID
        };
        const res = await columnsConfigApi.get(params);
        if (res && res.data) {
            // 获取保存的表头数据，改变this.columns的hiddenColumn状态
            const selectedColumns = [];
            const configName = res.data.configName || '';
            if (configName) {
                columns.forEach(item => { item.hiddenColumn = true; });
                configName.split(',').forEach(prop => {
                    const columnIndex = columns.findIndex(c => c.prop === prop);
                    if (columnIndex !== -1) {
                        columns[columnIndex].hiddenColumn = false;
                        selectedColumns.push(columns[columnIndex]);
                        columns.splice(columnIndex, 1);
                    }
                });
            }
            // 页面初始化时给父级返回表头数据
            this.$emit('getTableConfigList', selectedColumns.concat(columns));
        }
    }
};

</script>

<style lang="less">
.column-config_title{
    small{
        margin-left: 25px;
    }
}
.component-container {
    .all-column {
        float: left;
        cursor: pointer;
        margin: 0 10px 10px 0;
        position: relative;

        button {
            width: 138px;
        }

        .el-button {
            background: #f2f2f2;
        }

        &.disabled {
            display: none;
        }

        .btn-icon {
            position: absolute;
            right: -6px;
            top: -6px;
            color: #00BCBF;
        }

        .el-icon-circle-check {
            color: #C3C7C7;
            display: none;
        }

        .el-icon-circle-check:hover {
            cursor: not-allowed;
        }

        .el-icon-error {
            color: #FF3300;
        }

        &.selected {
            .el-button,
            .el-button.is-disabled,
            .el-button.is-disabled:hover,
            .el-button.is-disabled:focus {
                color: #555757;
                border-color: #CECECE;
            }

            .el-button {
                background: #fff;
            }
        }

    }

    .config-footer {
        text-align: right;
        margin-top: 18px;
    }

    .box-card {
        margin-top: 20px;
    }

    .pull-left {
        float: left;
    }

    .clearfix:after {
        height: 0;
        content: '';
        display: block;
        visibility: hidden;
        clear: both;
    }
}

</style>