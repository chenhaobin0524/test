<template>
   <div class="demo-import">
        <el-button :type="disabled?'defult':'primary'" :disabled="disabled" @click="dialogVisible = true"><slot name="button-name"></slot></el-button>
        <el-dialog
        title="导入"
        :visible.sync="dialogVisible"
        width="50%">
           <el-row>
               <el-upload
                    class='upload-demo'
                    ref="upload"
                    action=''
                    :on-remove='handleRemove'
                    :on-change='onchange'
                    :limit='1'
                    :on-exceed='handleExceed'
                    :file-list='fileList'
                    :show-file-list='false'
                    :auto-upload='false'
                    :http-request = "addAttachment"
                    >
                    <el-button type='primary'>选择文件</el-button>
                </el-upload>
                <el-button type="pirmary" @click="TemplateDownload">下载模板</el-button>
           </el-row>
           <el-row>
               <el-table
                :data="fileList"
                stripe
                border>
                    <el-table-column prop="name" label="文件名称" width="180">
                    </el-table-column>
                    <el-table-column prop="size" label="大小" width="180">
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleRemove(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
           </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUpload">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import request from '@/utils/http';
export default {
    name: 'mImport',
    data() {
        return {
            fileList: [],
            dialogVisible: false
        };
    },
    props: {
        templateName: String,
        templateUrl: String,
        uploadUrl: String,
        disabled: Boolean
    },
    computed: {
        myHeader() {
            return {
                'Content-Type': 'multipart/form-data'
            };
        }
    },
    methods: {
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        handleRemove(row) {
            this.fileList.splice(row, 1);
        },
        onchange(file, fileList) {
            this.fileList = fileList;
        },
        TemplateDownload() {
            return request({
                url: this.templateUrl,
                method: 'post',
                responseType: 'arraybuffer'
            }).then(res => {
                const blob = new Blob([res], {
                    type: 'application/x-excel;charset=UTF-8'
                });
                const objectUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = objectUrl;
                a.download = this.templateName;
                a.click();
                this.$message.success('下载成功');
            });
        },
        addAttachment(file) {
            const param = new FormData();
            param.append('file', file.file);
            return request({
                url: this.uploadUrl,
                method: 'post',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: param
            }).then(res => {
                if (res) {
                    this.$message.success('文件导入成功！');
                    this.dialogVisible = false;
                }
            });
        }
    },
    mounted() {
    },
    components: {}
};
</script>
<style lang='less'>
    .demo-import {
        display: inline-block;
        .upload-demo {
            margin-bottom: 10px;
            display: inline-block;
            margin-right: 10px;
        }
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
        .el-table th, .el-table td {
            text-align: center
        }
        .el-table {
            min-height: 200px !important;
            max-height: 200px !important;
        }
    }
</style>