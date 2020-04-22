<template>
    <div id="dialogBox">
        <el-dialog
            class="frame-dialog"
            :modal-append-to-body="false"
            :title="dialog.title"
            :visible.sync="visible"
            :width="dialogWidth"
            :before-close="handleClose"
        >
            <div>
                <el-row :gutter="dialog.layout.gutter" v-if="dialog.layout" class="module">
                    <el-col
                        class="moduleContent"
                        v-for="(item,index) in dialog.layout.colList"
                        :key="index"
                        :span="item.span"
                    >
                        <div class="layoutContent">{{item.text}}</div>
                    </el-col>
                </el-row>
                <mForm
                    :dialogForm="dialog.dialogForm"
                    :addressSelectVisible="visible"
                    :gutter="dialog.gutter"
                    :type="dialog.type"
                    :mFormValue="mFormData"
                    @dialogCheck="dialogCheck"
                    @search="search"
                    @getAddressLabels="getAddressLabels"
                    ref="dialogForm"
                    v-if="dialog.type=='normal'"
                ></mForm>
                <dialogTable
                    :tableData="tableData"
                    :dialogTable="dialog.dialogTable"
                    v-if="!dialog.hideTable"
                    ref="dialogTable"
                    @dialogDelRow="dialogDelRow"
                >
                    <slot name="tableHeader" slot="myHeader"></slot>
                    <slot name="tableFooter" slot="myFooter"></slot>
                </dialogTable>
            </div>
            <div v-if="dialog.type=='date'" class="dateDialog">
                <div class="calendar" :style="'width:'+ dialog.calendarWidth">
                    <el-calendar v-model="mDate" ref="calendar"></el-calendar>
                    <div class="time">{{time}}</div>
                    <el-select v-if="showTimePick" v-model="detailTime" placeholder="预约时间" style="float: right; width: 100px;">
                        <el-option
                            v-for="item in timeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="formBox" :style="'width:'+ dialog.formBoxWidth">
                    <mForm
                        :dialogForm="dialog.dialogForm"
                        :addressSelectVisible="visible"
                        :gutter="dialog.gutter"
                        :type="dialog.type"
                        :mFormValue="mFormData"
                        @dialogCheck="dateDialogCheck"
                        @search="search"
                        @getAddressLabels="getAddressLabels"
                        ref="dialogForm"
                    >
                        <slot name="formHeader" slot="myHeader"></slot>
                    </mForm>
                    <span slot="footer" class="dialog-footer formbtn">
                        <el-button
                            :type="item.type=='sure'?'primary':null"
                            @click="handleClose(item.type)"
                            v-for="(item,index) in dialog.btnList"
                            :key="index"
                        >{{item.text}}</el-button>
                    </span>
                </div>
            </div>
            <span slot="footer" class="dialog-footer" v-if="dialog.type=='normal'">
                <el-button
                    :type="item.type=='sure'?'primary':null"
                    @click="handleClose(item.type)"
                    v-for="(item,index) in dialog.btnList"
                    :key="index"
                >{{item.text}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import mForm from './mForm';
import dialogTable from './dialogTable';
export default {
    data() {
        return {
            dateFormValue: {},
            mDate: new Date(),
            time: '',
            mFormData: {},
            detailTime: null
        };
    },
    mounted() {
        this.setTime();
        if (Object.keys(this.mFormValue).length) {
            this.mFormData = { ...this.mFormValue };
        }
        if (this.dialog.type === 'date') {
            if (!this.dialog.detailTime) {
                this.detailTime = '';
            } else if (this.dialog.detailTime === 'now') {
                const now = new Date();
                const hour = now.getHours() >= 10 ? now.getHours() : '0' + now.getHours();
                const minuite = now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes();
                const second = now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds();
                this.detailTime = hour + ':' + minuite + ':' + second;
            } else {
                this.detailTime = this.dialog.detailTime;
            }
        }
        if (this.dialog.dateConnect) {
            this.$set(
                this.mFormData,
                this.dialog.dateConnect,
                this.GetDateT(this.mDate) + (this.dialog.cutDetailTime ? '' : ' ' + this.detailTime)
            );
            this.mFormData = Object.assign({}, this.mFormData);
        }
    },
    computed: {
        dialogWidth() {
            return this.dialog.width;
        },
        timeOptions() {
            return Array(24).fill(1).map((val, key) => {
                const str = `0${key}`.substr(-2);
                return {
                    label: `${str}:00:00`,
                    value: `${str}:00:00`
                };
            });
        }
    },
    watch: {
        mFormValue: {
            handler(val) {
                this.mFormData = { ...val };
            },
            deep: true
        },
        mDate(val) {
            if (this.dialog.type === 'date' && this.dialog.disabled) {
                const keys = Object.keys(this.mFormData);
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i] === this.dialog.disabled.field && this.mFormData[keys[i]] === this.dialog.disabled.value) {
                        return;
                    }
                }
            }
            if (this.dialog.dateType === 'future') {
                const select = new Date(val).getTime() + 24 * 1000 * 3600 - 1;
                const now = new Date().getTime();
                if (now > select) {
                    this.$message.warning('选择的日期不得小于当前时间');
                    return;
                }
            }
            if (this.dialog.dateConnect) {
                this.mFormData[this.dialog.dateConnect] =
                    this.GetDateT(val) + (this.dialog.cutDetailTime ? '' : ' ' + this.detailTime);
                this.mFormData = Object.assign({}, this.mFormData);
            }
            this.$emit('calendarChange', this.mDate);
        },
        'detailTime'(val) {
            if (this.dialog.dateConnect) {
                this.mFormData[this.dialog.dateConnect] =
                    this.GetDateT(this.mDate) + (this.dialog.cutDetailTime ? '' : ' ' + val);
                this.mFormData = Object.assign({}, this.mFormData);
            }
        },
        visible(val) {
            if (val) {
                this.detailTime = this.dialog.detailTime;
            }
        }
    },

    props: {
        dialog: Object,
        visible: Boolean,
        tableData: {
            type: Array,
            default() {
                return [];
            }
        },
        mFormValue: {
            type: Object,
            default() {
                return {};
            }
        },
        showTimePick: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    components: { mForm, dialogTable },
    methods: {
        setDayHeight(height) {
            this.$nextTick(() => {
                const day = document.querySelectorAll('.el-calendar-day');
                for (let i = 0; i < day.length; i++) {
                    day[i].style.height = height;
                }
            });
        },
        GetDateT(d) {
            var s;
            s = d.getYear() + 1900 + '-';
            s =
                s +
                (d.getMonth() + 1 < 10
                    ? '0' + (d.getMonth() + 1)
                    : d.getMonth() + 1) +
                '-';
            s += d.getDate() < 10 ? '0' + d.getDate() : d.getDate() + '';
            return s;
        },
        handleClose(type) {
            let params = { visible: false, mFormData: this.mFormData };
            if (type === 'sure') {
                if (this.$refs.dialogForm) {
                    this.$refs.dialogForm.showMustFill = false;
                }
                let flag = false;
                if (this.$refs.dialogForm) {
                    flag = this.$refs.dialogForm.changeShowMustFill();
                }
                let tableFlag = false;
                if (this.$refs.dialogTable) {
                    tableFlag = this.$refs.dialogTable.tableShowMustFill();
                }
                // 下面data为表格选中列，如果没有复选框则默认全部选中
                // let data = this.$refs.dialogTable.getDialogTableData();
                if (flag || tableFlag) {
                    this.$message.error('必填项不能为空');
                    this.$refs.dialogForm.showMustFill = true;
                    return;
                }
                let mTableData;
                if (this.$refs.dialogTable) {
                    mTableData = this.$refs.dialogTable.getDialogTableData();
                    // mTableData.map(item => {
                    //     if (item.editRow) {
                    //         delete item.editRow;
                    //     }
                    // });
                }
                params = {
                    ...params,
                    mTableData,
                    dateData: this.GetDateT(this.mDate) + ' ' + this.detailTime
                };
            } else {
                params = {};
            }
            if (this.$refs.dialogForm) {
                this.$refs.dialogForm.showMustFill = false;
            }

            this.$emit('closeDialog', params, type);
        },
        search(value) {
            this.$emit('search', value);
        },
        dialogCheck(value, col) {
            this.$emit('dialogCheck', value, col);
            this.mFormData = value;
        },
        dateDialogCheck(value, col) {
            this.$emit('carDialogCheck', value, col);
            this.mFormData = value;
        },
        getAddressLabels(data) {
            this.$emit('getAddressLabels', data);
        },
        setTime() {
            setInterval(() => {
                const initTime = function(time) {
                    if (time < 10) {
                        time = '0' + time;
                    }
                    return time;
                };
                const hour = initTime(new Date().getHours());
                const minutes = initTime(new Date().getMinutes());
                const second = initTime(new Date().getSeconds());
                this.time = hour + ':' + minutes + ':' + second;
            }, 1000);
        },
        dialogDelRow(row, index, tableData) {
            this.$emit('dialogDelRow', row, index, tableData);
        }
    }
};
</script>

<style lang="less">
#dialogBox {
    .module {
        margin-bottom: 30px;
        .moduleContent {
            margin-bottom: 12px;
        }
    }
    .layoutContent {
        padding: 0 16px;
    }
    .dialogTable {
        padding: 0 16px;
    }
    .dateDialog {
        display: flex;
        .formBox {
            padding-left: 16px;
            position: relative;
            .formbtn {
                position: absolute;
                right: 0;
                bottom: 0;
            }
        }
        .calendar {
            border-right: 1px solid #ccc;
            padding-right: 16px;
            .time {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 4px;
                border: 1px solid #ccc;
                min-height: 12px;
                min-width: 47px;
            }
            .el-calendar__header {
                display: flex;
                -webkit-box-pack: justify;
                justify-content: space-between;
                padding: 0px 20px 12px;
                border-bottom: 1px solid #ebeef5;
            }
            .el-calendar__body {
                padding-bottom: 15px;
            }
            .el-calendar-table {
                table-layout: fixed;
                width: 100%;
            }
            table:not(.is-range) td.prev {
                color: #c0c4cc;
            }
            .el-calendar-table tr td:first-child {
                border-left: 1px solid #ebeef5;
            }
            .el-calendar-table tr:first-child td {
                border-top: 1px solid #ebeef5;
            }
            .el-calendar-table td {
                border-bottom: 1px solid #ebeef5;
                border-right: 1px solid #ebeef5;
                vertical-align: top;
                -webkit-transition: background-color 0.2s ease;
                transition: background-color 0.2s ease;
            }
            .el-calendar-table .el-calendar-day {
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
            }
            .el-calendar-table .el-calendar-day {
                height: 30px;
                padding: 3px;
            }
            .el-calendar__title {
                color: #000;
                -ms-flex-item-align: center;
                align-self: center;
            }
            .el-calendar-table thead th {
                padding: 12px 0;
                color: #606266;
                font-weight: 400;
            }
            .el-calendar-table:not(.is-range) td.prev {
                color: #c0c4cc;
            }
            .demo-calendar.demo-block .is-selected {
                color: #1989fa;
            }

            .el-calendar-table td.is-selected {
                background-color: #e6f8f9;
            }
            .el-calendar-table td.is-today {
                color: #00bcbf;
            }
            .el-calendar-table:not(.is-range) td.next,
            .el-calendar-table:not(.is-range) td.prev {
                color: #c0c4cc;
            }
        }
    }
}
</style>
