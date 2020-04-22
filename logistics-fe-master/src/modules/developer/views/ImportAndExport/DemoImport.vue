<template>
    <Paper class='demo-import'>
        <el-card class='box-card'>
            <div slot='header' class='clearfix'>
                <h1>demo</h1>
            </div>
            <el-upload class='upload-demo' action='/api/excel/inport' :on-success='handleSuccess' :on-remove='handleRemove'
                :before-remove='beforeRemove' multiple :limit='1' :on-exceed='handleExceed' :file-list='fileList'>
                <el-button size='small' type='primary'>导入文件</el-button>
                <div slot='tip' class='el-upload__tip'>只能上传Excel文件，且不超过500kb</div>
            </el-upload>
            <template>
                <el-table :data='tableData' stripe style='width: 100%'>
                    <el-table-column prop='integer' label='INTEGER'></el-table-column>
                    <el-table-column prop='long' label='LONG'></el-table-column>
                    <el-table-column prop='double' label='DOUBLE'></el-table-column>
                    <el-table-column prop='datetime' label='DATETIME' width="250"></el-table-column>
                    <el-table-column prop='date' label='DATE'></el-table-column>
                    <el-table-column prop='string' label='STRING'></el-table-column>
                </el-table>
            </template>
        </el-card>
        <el-card class='box-card'>
            <div slot='header' class='clearfix'>
                <h1>code</h1>
            </div>
            <pre>
            &lt;el-upload
                class='upload-demo'
                action='/api/excel/inport'
                :on-success='handleSuccess'
                :on-remove='handleRemove'
                :before-remove='beforeRemove'
                multiple
                :limit='1'
                :on-exceed='handleExceed'
                :file-list='fileList'
            &gt;
                &lt;el-button size='small' type='primary'&gt;导入文件&lt;/el-button&gt;
                &lt;div slot='tip' class='el-upload__tip'&gt;只能上传Excel文件，且不超过500kb&lt;/div&gt;
            &lt;/el-upload&gt;
            &lt;template&gt;
                &lt;el-table :data='tableData' stripe style='width: 100%'&gt;
                    &lt;el-table-column prop='integer' label='INTEGER'&gt;&lt;/el-table-column&gt;
                    &lt;el-table-column prop='long' label='LONG'&gt;&lt;/el-table-column&gt;
                    &lt;el-table-column prop='double' label='DOUBLE'&gt;&lt;/el-table-column&gt;
                    &lt;el-table-column prop='datetime' label='DATETIME' width="250"&gt;&lt;/el-table-column&gt;
                    &lt;el-table-column prop='date' label='DATE'&gt;&lt;/el-table-column&gt;
                    &lt;el-table-column prop='string' label='STRING'&gt;&lt;/el-table-column&gt;
                &lt;/el-table&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
                data() {
                    return {
                        fileList: [],
                        tableData: []
                    };
                },
                methods: {
                    handleRemove(file, fileList) {
                        this.tableData = [];
                    },
                    handleSuccess(file) {
                        const currentdata = [];
                        file.map(item => {
                            var col = {
                                integer: item.row[0],
                                long: item.row[1],
                                double: item.row[2],
                                datetime: item.row[3],
                                date: item.row[4],
                                string: item.row[5]
                            };
                            currentdata.push(col);
                        });
                        this.tableData = currentdata;
                    },
                    handleExceed(files, fileList) {
                        this.$message.warning(
                            `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
                        );
                    },
                    beforeRemove(file, fileList) {
                        return this.$confirm(`确定移除 ${file.name}？`);
                    }
                }
            };
            &lt;/script&gt;
            </pre>
        </el-card>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
export default {
    data() {
        return {
            fileList: [],
            tableData: []
        };
    },
    methods: {
        handleRemove(file, fileList) {
            this.tableData = [];
        },
        handleSuccess(file) {
            const currentdata = [];
            file.map(item => {
                var col = {
                    integer: item[0],
                    long: item[1],
                    double: item[2],
                    datetime: item[3],
                    date: item[4],
                    string: item[5]
                };
                currentdata.push(col);
            });
            this.tableData = currentdata;
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        }
    },
    destroyed() {
        var scroll = document.getElementsByClassName('el-main')[0].scrollTop;
        window.sessionStorage.setItem('scroll2', scroll);
    },
    mounted() {
        let flag = true;
        this.$store.state.tagsView.visitedViews.forEach((v, i) => {
            if (v.path === '/demo-import') {
                flag = false;
            }
        });
        if (!flag) {
            const scroll = window.sessionStorage.getItem('scroll2');
            setTimeout(function () {
                document.getElementsByClassName('el-main')[0].scrollTop = scroll;
            }, 300);
        }
    },
    components: { Paper }
};
</script>
<style lang='less'>
    .demo-import {
        overflow: auto;
        .el-progress {
            display: inline-block;
            width: 200px;
        }
        .el-upload__input {
            display: none;
        }
        h1 {
            font-size: 1.5em
        }
    }
</style>