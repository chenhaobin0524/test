<template>
    <el-upload
            class="upload-demo"
            action="upload"
            :headers="{'Certification': certification}"
            :before-upload="getUploadInfo"
            :http-request="submitUpload"
            :show-file-list="false"
        >
        <el-button size="small" type="primary">{{text}}</el-button>
    </el-upload>
</template>

<script>
import { getCertBySDK, upload, getUploadId, multiUpload, completeMultiUpload, saveUserUpload } from './api';
import md5 from 'js-md5';
import config from '@/config/user.env';
const BYTES_PER_CHUNK = 10 * 512 * 1024; // 每个文件切片大小定为10MB
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
            const index = file.name.lastIndexOf('.');
            const originName = file.name.substring(0, index);
            const originNameType = file.name.substring(index, file.length);
            this.uploadName = originName + '_' + new Date().getTime() + originNameType;
            this.contentLength = file.size;
        },
        submitUpload(uploadData) {
            if (uploadData.file.size > BYTES_PER_CHUNK) {
                this.multipleUpload(uploadData);
            } else {
                this.simpleUpload(uploadData);
            }
        },
        async simpleUpload(uploadData) {
            if (!this.certification) {
                this.certification = await this.getCertification();
            }
            const file = new File([uploadData.file], this.uploadName, {
                type: uploadData.file.type
            });
            upload(file, {
                appid: this.appid,
                bucket: this.bucket,
                object: this.uploadName,
                certification: this.certification,
                callback: null
            }).then(() => {
                saveUserUpload({
                    ossBucket: this.bucket,
                    ossObject: this.uploadName,
                    localFileName: this.uploadName,
                    fileSize: this.contentLength + ''
                }).then(() => {
                    this.$emit('callback');
                });
            });
        },
        async multipleUpload(uploadData) {
            if (!this.certification) {
                this.certification = await this.getCertification();
            }
            getUploadId({
                appid: this.appid,
                bucket: this.bucket,
                object: this.uploadName,
                certification: this.certification
            }).then(uploadRes => {
                this.createSlices(uploadData, uploadRes.data.uploadid);
            });
        },
        async getCertification() {
            const res = await getCertBySDK({ appid: this.appid });
            if (res.data && res.data.certification) {
                return res.data.certification;
            }
        },
        async createSlices(uploadData, id) {
            const blob = uploadData.file;
            let start = 0;
            let end;
            let index = 0;
            const prm = [];
            const parts = [];
            while (start < blob.size) {
                end = start + BYTES_PER_CHUNK;
                if (end > blob.size) {
                    end = blob.size;
                }
                const chunk = blob.slice(start, end);
                const etag = await this.getEtag(chunk);
                parts.push({
                    partid: (index + 1) + '',
                    size: end - start,
                    etag: '"' + etag + '"'
                });
                prm.push(multiUpload(chunk, {
                    appid: this.appid,
                    bucket: this.bucket,
                    object: this.uploadName,
                    certification: this.certification,
                    index: index + 1,
                    uploadid: id,
                    size: end - start
                }));
                start = end;
                index++;
            }
            Promise.all(prm).then(() => {
                completeMultiUpload({
                    appid: this.appid,
                    bucket: this.bucket,
                    object: this.uploadName,
                    certification: this.certification,
                    uploadid: id,
                    parts: parts
                }).then(() => {
                    saveUserUpload({
                        ossUrl: '',
                        ossBucket: this.bucket,
                        ossObject: this.uploadName,
                        localFileName: this.uploadName,
                        fileSize: this.contentLength,
                        appId: this.appid,
                        tenantCode: ''
                    }).then(() => {
                        this.$emit('callback');
                    });
                });
            });
        },
        async getEtag(chunk) {
            const a = await this.getFileMd5(chunk);
            return a;
        },
        getFileMd5(chunk) {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(chunk);
            return new Promise(function(resolve) {
                fileReader.onload = function (e) {
                    resolve(md5(e.target.result));
                };
            });
        }
    }
};
</script>
