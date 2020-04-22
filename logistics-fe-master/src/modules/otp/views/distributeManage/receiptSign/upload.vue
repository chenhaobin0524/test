<template>
    <div>
        <el-upload
            v-if='showFileList'
            class="receipt"
            ref='upload'
            action=''
            :before-upload="beforeUpload"
            :http-request="httpRequest"
            :show-file-list='showFileList'
            :on-preview="onPreview"
            multiple
            :with-credentials="true"
            list-type="picture-card">
            <slot name='batch'></slot>
        </el-upload>

        <el-upload
            v-else
            class="upload-demo"
            action=''
            :before-upload="beforeUpload"
            :http-request="httpRequest"
            multiple
            :with-credentials="true"
            :show-file-list='false'>
            <slot></slot>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible" append-to-body v-if='showFileList'>
            <img width="100%" :src="dialogImageUrl">
        </el-dialog>
    </div>
</template>

<script>
import { upload, getCertBySDK, getUploadId, multiUpload, completeMultiUpload } from '@/components/lots/OSS/api.js';
import md5 from 'js-md5';
import config from '@/config/user.env';
const BYTES_PER_CHUNK = 10 * 512 * 1024; // 每个文件切片大小定为5MB
const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 小文件上传的最大限制10M
export default {
    props: {
        dialogLoading: {
            type: Function,
            default() {
                return () => {};
            }
        },
        showFileList: {
            type: Boolean,
            default() {
                return false;
            }
        },
        loading: {
            type: Boolean,
            default() {
                return false;
            }
        },
        batchFlag: {
            type: String,
            default() {
                return '';
            }
        }
    },
    data() {
        return {
            uploadResArr: [], // 响应的集合
            uploadDataArr: [], // 上传文件集合
            isReady: 0,
            dialogVisible: false,
            dialogImageUrl: '',
            bucket: 'lcloud',
            certification: '',
            appid: config.uploadAppId,
            appkey: config.uploadAppKey
        };
    },
    methods: {
        getData() {
            return this.$refs.upload.uploadFiles;
        },
        onPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        cancelRequest() {
            clearTimeout(this.isReady);
            this.uploadDataArr = [];
            this.$emit('update:loading', false);
            return false;
        },
        beforeUpload(file) {
            this.$emit('update:loading', true);
            var extArr = ['jpg', 'jpeg', 'png', 'tif', 'bmp'];
            if (!extArr.includes(this.getFileExt(file.name))) {
                this.$message({
                    type: 'warning',
                    message: '文件格式只能为 JPG / JPEG / PNG / TIF / BMP',
                    duration: 5000,
                    showClose: true
                });
                return this.cancelRequest();
            }

            if (this.batchFlag === 'contractNo') { // 合同号
                if (!/^HT/.test(file.name)) {
                    this.$message.warning('文件名必须以 HT 开头');
                    return this.cancelRequest();
                }
            } else if (this.batchFlag === 'dispatchNo') { // 发车单号
                if (!/^CP/.test(file.name)) {
                    this.$message.warning('文件名必须以 CP 开头');
                    return this.cancelRequest();
                }
            }

            if (file.size > 100 * 1024 * 1024) {
                this.$message.warning('文件超过限制大小 ' + 100 + 'M！');
                return this.cancelRequest();
            }

            const fileNamelength = file.name.split('').reduce((accumulator, item, index) => {
                return file.name.charCodeAt(index) > 127 ? accumulator + 2 : accumulator + 1;
            }, 0);
            if (fileNamelength > 100) {
                this.$message.warning('文件名称超过限制长度 100 字节');
                return this.cancelRequest();
            }
            const index = file.name.lastIndexOf('.');
            const originName = file.name.substring(0, index);
            const originNameType = file.name.substring(index);

            file.uploadName = originName + '_' + new Date().getTime() + originNameType;
            file.uploadName = file.uploadName.replace(/\s/g, '');
        },
        sendFiles() {
            this.dialogLoading();
            this.uploadDataArr.forEach(item => {
                if (item.file.size > FILE_SIZE_LIMIT) {
                    this.multipleUpload(item);
                } else {
                    this.simpleUpload(item);
                }
            });
        },
        httpRequest(uploadData) {
            this.uploadDataArr.push(uploadData);
            clearTimeout(this.isReady);
            this.isReady = setTimeout(() => {
                this.sendFiles();
            }, 150);
        },
        async getCertification() {
            const res = await getCertBySDK({ appid: this.appid });
            if (res) {
                return res.data.certification;
            }
        },
        // 小文件上传
        async simpleUpload(uploadData) {
            if (!this.certification) {
                this.certification = await this.getCertification();
                if (!this.certification) return false;
            }
            const file = new File([uploadData.file], this.uploadName, {
                type: uploadData.file.type
            });
            const uploadName = uploadData.file.uploadName;
            upload(file, {
                appid: this.appid,
                bucket: this.bucket,
                object: uploadName,
                certification: this.certification,
                callback: null
            }).then(() => {
                const res = {
                    // data: { downUrl: `${window.location.origin}/oss-download/userDownload/${this.appid}/${this.bucket}/${uploadName}` },
                    data: { downUrl: `${config.apiUrl}/api-file/ossDown/${this.appid}/${this.bucket}/${uploadName}` },
                    name: uploadData.file.name
                };
                this.uploadResArr.push(res);

                if (this.uploadResArr.length === this.uploadDataArr.length) {
                    this.$emit('callback', [].concat(this.uploadResArr));
                    this.uploadDataArr = [];
                    this.uploadResArr = [];
                    this.dialogLoading(false);
                }
                if (this.showFileList) {
                    this.getData().find(item => item.uid === uploadData.file.uid).response = res;
                }
            }).catch(() => {
                this.uploadDataArr = [];
                this.uploadResArr = [];
                this.dialogLoading(false);
                if (this.showFileList) {
                    const clipIndex = this.getData().findIndex(item => item.uid === uploadData.file.uid);
                    this.getData().splice(clipIndex, 1);
                }
            });
        },
        // 大文件上传
        async multipleUpload(uploadData) {
            if (!this.certification) {
                this.certification = await this.getCertification();
                if (!this.certification) return false;
            }
            getUploadId({
                appid: this.appid,
                bucket: this.bucket,
                object: uploadData.file.uploadName,
                certification: this.certification
            }).then(res => {
                this.createSlices(uploadData, res.data.uploadid);
            });
        },
        async createSlices(uploadData, id) {
            const uploadName = uploadData.file.uploadName;
            delete uploadData.file.uploadName;
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
                    object: uploadName,
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
                    object: uploadName,
                    certification: this.certification,
                    uploadid: id,
                    parts: parts
                }).then(() => {
                    const res = {
                        // data: { downUrl: `${window.location.origin}/oss-download/userDownload/${this.appid}/${this.bucket}/${uploadName}` },
                        data: { downUrl: `${config.apiUrl}/api-file/ossDown/${this.appid}/${this.bucket}/${uploadName}` },
                        name: uploadData.file.name
                    };
                    this.uploadResArr.push(res);

                    if (this.uploadResArr.length === this.uploadDataArr.length) {
                        this.$emit('callback', [].concat(this.uploadResArr));
                        this.uploadDataArr = [];
                        this.uploadResArr = [];
                        this.dialogLoading(false);
                    }
                    if (this.showFileList) {
                        this.getData().find(item => item.uid === uploadData.file.uid).response = res;
                    }
                }).catch(() => {
                    this.uploadDataArr = [];
                    this.uploadResArr = [];
                    this.dialogLoading(false);
                    if (this.showFileList) {
                        const clipIndex = this.getData().findIndex(item => item.uid === uploadData.file.uid);
                        this.getData().splice(clipIndex, 1);
                    }
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
        },
        getFileExt(fileName) {
            return fileName && fileName.replace(/^.*\./, '').toLowerCase();
        }
    }
};
</script>
