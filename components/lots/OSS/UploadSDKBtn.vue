<template>
    <div>
        <el-upload
                class="upload-demo"
                action="/api-file/mdmFileStorage/upload"
                :before-upload="getUploadInfo"
                :http-request="submitUpload"
                :show-file-list="false"
            >
            <el-button size="small" type="primary">{{text}}</el-button>
        </el-upload>
    </div>
</template>

<script>
import { uploadBySDK } from './api';
import config from '@/config/user.env';
const FILE_LENG_LIMITED = 20;
const FILE_LENG_LIMITED_BYTE = FILE_LENG_LIMITED * 1024 * 1024;
const FILE_EXT_LIMITED = ['exe', 'com', 'bat'];
export default {
    props: {
        bucket: String,
        text: String
    },
    data() {
        return {
            certification: '',
            contentLength: 0,
            uploadName: '',
            appid: config.uploadAppId,
            appkey: config.uploadAppKey
        };
    },
    methods: {
        getUploadInfo(file) {
            this.uploadName = file.name;
            this.contentLength = file.size;
        },
        submitUpload(uploadData) {
            this.sdkUpload(uploadData);
        },
        sdkUpload(uploadData) {
            const fd = new FormData();
            this.getUploadInfo(uploadData.file);
            if (this.getFileExt(this.uploadName) === '' ||
                    FILE_EXT_LIMITED.includes(this.getFileExt(this.uploadName))) {
                this.$message.error('请勿上传不明文件或可执行文件！');
                return false;
            }
            if (this.contentLength <= FILE_LENG_LIMITED_BYTE) {
                fd.append('file', uploadData.file);
                uploadBySDK(fd, this.bucket).then(res => {
                    this.$message(res.msg);
                    this.$emit('callback', res);
                });
            } else {
                this.$message.error('文件超过限制大小 ' + FILE_LENG_LIMITED + 'M！');
            }
        },
        getFileExt(fileName) {
            return fileName && fileName.replace(/^.+\./, '').toLowerCase();
        }
    }
};
</script>
