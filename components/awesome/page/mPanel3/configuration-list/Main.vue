<template>
    <div class="table-config">
        <div class="clearfix">
            <div class="all-column selected" :draggable="true" v-for="(item, index) in selectedColumns"
                    :key="'selected' + index"
                    @dragstart="handleDragStart($event, item)"
                    @dragend="handleDragEnd($event)">
                <el-button :draggable="true"
                        @dragstart.native="handleItemDragStart($event, item, index)"
                        @dragend.native="handleItemDragEnd($event)"
                        @dragenter.native="handleItemDragEnter($event, item, index)">
                    {{item.label}}
                </el-button>
                <i class="btn-icon el-icon-error" @click="handleSelectedClose(item, index)"></i>
            </div>
            <div class="all-column" v-for="(item, index) in selectAllColumns" :key="'columns' + index"
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
                    <el-button @click="handleCancel">取消</el-button>
                    <el-button type="primary" @click="handleSave">确定</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        selectAllColumns: {
            type: Array,
            default () {
                return [];
            }
        },
        checkedList: {
            type: String,
            default () {
                return '';
            }
        },
        columnNum: Number
    },
    data() {
        return {
            itemsClass: { li: {}, icon: {} },
            selectDisabled: false,
            dragEl: null,
            dragElData: null,
            selectedColumns: []
        };
    },
    methods: {
        handleSelectClick(item) {
            if (item.disabled) {
                return;
            }
            if (this.columnNum && this.selectedColumns.length >= this.columnNum) {
                this.$message.warning('最多选择' + this.columnNum + '列！');
                return;
            }
            item.disabled = true;
            this.selectedColumns.push(item);
        },
        handleSelectedClose(item, index) {
            if (this.selectedColumns.length === 1) {
                this.$message.warning('至少保留一列！');
                return;
            }
            item.disabled = false;
            this.selectAllColumns.map(column => {
                if (column.prop === item.prop) {
                    column.disabled = false;
                }
            });
            this.selectedColumns.splice(index, 1);
        },
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
        handleDragStart() {},
        handleDragEnd() {},
        handleItemDragEnter(ev, item, key) {
            if (item.prop !== this.dragElData.item.prop) {
                this.selectedColumns.splice(this.dragElData.key, 1);
                this.selectedColumns.splice(key, 0, this.dragElData.item);
                this.dragElData.key = key;
            }
        },
        handleSelectAll() {
            if (this.columnNum && this.selectAllColumns.length > this.columnNum) {
                this.$message.warning('最多选择' + this.columnNum + '列！');
                return;
            }
            this.selectedColumns = Array.from(new Set(this.selectAllColumns));
            this.selectAllColumns.map(data => {
                data.disabled = true;
            });
        },
        handleReset() {
            this.initData();
        },
        handleCancel() {
            this.$emit('tableConfigClose');
        },
        handleSave() {
            let laberString = [];
            let propString = [];
            this.selectedColumns.map(data => {
                laberString.push(data.label);
                propString.push(data.prop);
            });
            laberString = laberString.join(',');
            propString = propString.join(',');
            this.$emit('getTableConfigList', laberString, propString);
        },
        initData() {
            const datas = this.checkedList.split(',');
            if (datas.length >= 1 && datas[0] !== '') {
                this.selectAllColumns.map(data => {
                    data.disabled = false;
                });
                this.selectedColumns = [];
                datas.map(title => {
                    this.selectAllColumns.map(data => {
                        if (data.label === title) {
                            data.disabled = true;
                            this.selectedColumns.push(data);
                        }
                    });
                });
            }
        }
    },
    computed: {
        selections() {
            return this.selectAllColumns;
        }
    },
    watch: {
        checkedList: function () {
            this.initData();
        }
    },
    created() {
        this.$set(this.selectAllColumns, 'disabled', false);
        this.initData();
    }
};

</script>

<style lang="less">
.table-config {
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
