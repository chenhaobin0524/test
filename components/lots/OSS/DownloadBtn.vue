<template>
    <el-button @click="download">{{text}}</el-button>
</template>
<script>
import { getCert } from './api';
import md5 from 'js-md5';
import config from '@/config/user.env';
export default {
    props: {
        bucket: String,
        text: String,
        fileName: String
    },
    data() {
        return {
            certification: '',
            uploadName: '',
            appid: config.uploadAppId,
            appkey: config.uploadAppKey
        };
    },
    methods: {
        download() {
            const ts = (new Date()).getTime().toString();
            getCert({
                appid: this.appid,
                ts,
                signature: md5(this.appid + ts + this.appkey),
                Int: 18000
            }).then(res => {
                this.certification = res.data.certification;
                window.location.href = `/oss-download/userDownload/${this.appid}/${this.bucket}/${this.fileName}?certification=${this.certification}`;
            });
        }
    }
};
</script>