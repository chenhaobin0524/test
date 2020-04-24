<template>
    <el-dialog title="流程表单信息" class="iflow-form" :visible.sync="formVisible" width="80%" :before-close="handleFormClose">
        <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
            <el-form-item label="标题">
                <el-input v-model="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="内容">
                <editor :content="formData.content" @changeContent="changeContent"></editor>
            </el-form-item>
            <el-form-item label="参考附件">
                <el-button type="text" @click.native="AllFilesDownLoad">全部下载</el-button>
                <ul>
                    <li v-for="(checkFile, index) in checkFiles" :key="index">
                        <span>{{checkFile.name}}<span class="file-size">{{checkFile.size}}</span>
                        <el-button type="text" @click.native="filePriview(index)">预览</el-button>
                        <el-button type="text" @click.native="fileDownLoad(index)">下载</el-button>
                    </span>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item label="上传附件">
                <upload :onBeforeUpload="beforeUpload"  @callback='uploadResponse' :showFileList="true"
                    listType="text" :fileList="fileList" :onPreviewDialog="false" @onPreview="onPreview" @fileRemove="fileRemove">
                    <el-button slot='batch' size="small" type="primary">点击上传</el-button>
                </upload>
            </el-form-item>
            <el-form-item label="业务类型" prop="input">
                <el-radio-group v-model="formData.input">
                    <el-radio label="A">基地业务，配送中心业务</el-radio>
                    <el-radio label="B">电商中心、服务中心业务</el-radio>
                    <el-radio label="C">托盘业务</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleFormClose">取 消</el-button>
            <el-button type="primary" @click="handleFormSubmit" :loading="loading">提交</el-button>
        </span>
    </el-dialog>
</template>
<script>
import editor from './WangEditor';
import upload from '../../../../components/upload/Upload';
import { createMipForm, createMipFile } from '../../../../api/orderCenter';
import { filePreview } from './preview.js';
import configs from '@/config/user.env';
import { config } from './config';
export default {
    components: { upload, editor },
    props: {
        formVisible: {
            type: Boolean,
            dafault: false
        },
        orderNo: {
            type: String,
            dafault: ''
        }
    },
    data() {
        return {
            formData: {
                title: '',
                content: `<p><span style="font-family: 宋体;">
                <span style="font-size: medium;">领导好，</span>
                <br style="font-size: 12px;"><span style="font-size: 12px;">&nbsp;&nbsp;</span>
                <span style="font-size: medium;">【中心名称】进行库存账务调整，详情如下：</span><br style="font-size: 12px;">
                <span style="font-size: medium;">1、调账原因（必填）：（库存差异/未按规范操作/配合客户调帐/系统异常/库存切换等）
                <br style="">2、责任主体（必填）：（分公司/客户/系统/其他）
                <br style="">3、调整原因简述（必填）：？？？？？？？？？？？？？？
                <br style="">4、处理方案（必填）：？？？？？？？？？？？？？？
                <br style="">5、调账后对上游系统（CIMS、CCS、ECM）账务的影响（如上游是否同步等），如果有影响，后续如何处理达到账账、账实一致。？？？？？？？？？？？？？？
                <br style="">6、是否有产生直接经济损失：<br style="">&nbsp; &nbsp; 有（填损失金额）/无&nbsp;</span></span></p>
                <p><br></p><p><span style="font-family: 宋体;"><span style="font-size: medium;">&nbsp;</span></span><br></p>`,
                fileUrl: '',
                input: ''
            },
            fileUrls: [],
            fileList: [],
            loading: false,
            rules: {
                input: [
                    { required: true, message: '请选择业务类型', trigger: 'change' }
                ]
            },
            checkFiles: []
        };
    },
    methods: {
        changeContent(html) {
            this.formData.content = html;
        },
        handleFormClose() {
            this.$emit('handleFormClose');
        },
        getFileExt (fileName) {
            return fileName && fileName.replace(/^.*\./, '').toLowerCase();
        },
        beforeUpload (file) {
            // var extArr = ['jpg', 'jpeg', 'png', 'tif', 'bmp'];
            // if (!extArr.includes(this.getFileExt(file.name))) {
            //     this.$message({
            //         type: 'warning',
            //         message: '文件格式只能为 JPG / JPEG / PNG / TIF / BMP',
            //         duration: 5000,
            //         showClose: true
            //     });
            //     return false;
            // }
            return file;
        },
        uploadResponse(response) {
            response.forEach(item => {
                this.fileUrls.push(
                    {
                        fileName: item.name,
                        filePath: item.data.downUrl,
                        fileSize: item.size,
                        orderNo: this.orderNo
                    }
                );
            });
        },
        fileRemove(file) {
            this.fileUrls = this.fileUrls.filter(item => item.filePath !== file.response.data.downUrl);
        },
        onPreview(file) {
            filePreview(
                {
                    name: file.name,
                    size: file.size,
                    url: file.response.data.downUrl,
                    id: file.uid
                }
            );
        },
        handleFormSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const params = {
                        ...this.formData,
                        orderNo: this.orderNo
                    };
                    Promise.all([createMipForm(params), createMipFile(this.fileUrls)]).then(res => {
                        if ((res[0] && +res[0].code === 0) && (res[1] && +res[1].code === 0)) {
                            this.$emit('handleFormOk');
                            this.$message.success('附件上传成功');
                            this.$message.success('提交成功！');
                        } else if (!res[0] || +res[0].code !== 0) {
                            this.$message.error('表单提交失败！');
                        } else if (!res[1] || +res[1].code !== 0) {
                            this.$message.error('附件上传失败');
                        }
                    }).catch(() => {
                        this.$message.error('提交数据有误');
                    });
                }
            });
        },
        downLoads(url) {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.height = 0;
            iframe.src = url;
            document.body.appendChild(iframe);
            setTimeout(() => {
                iframe.remove();
            }, 2 * 60 * 1000);
        },
        AllFilesDownLoad() {
            for (let i = 0; i < this.checkFiles.length; i++) {
                this.downLoads(this.checkFiles[i].url + '?certification=' + this.certification);
            }
        },
        fileDownLoad(index) {
            window.location = this.checkFiles[index].url + '?certification=' + this.certification;
        },
        filePriview(index) {
            filePreview(this.checkFiles[index]);
        }
    },
    created() {
        if (configs.filePreviewUrl === 'http://imip.midea.com/') {
            this.checkFiles = config.pro;
        } else {
            this.checkFiles = config.uat;
        }
    }
};
</script>
<style lang="less">
.iflow-form {
    .file-size {
        margin: 0 20px;
    }
}
</style>