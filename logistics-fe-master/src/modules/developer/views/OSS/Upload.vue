<template>
    <Paper>
        <upload-button
            :bucket="'lc_sit'"
            :text="'上传'"
            >
        </upload-button>
        <upload-sdk-button
            :bucket="'lc_sit'"
            :text="'使用SDK上传'"
            >
        </upload-sdk-button>
    </Paper>
</template>

<script>
import uploadButton from '@/components/lots/OSS/UploadBtn';
import uploadSdkButton from '@/components/lots/OSS/UploadSDKBtn';
import Paper from '@/components/core/paper/Paper';
export default {
    components: {
        Paper,
        uploadButton,
        uploadSdkButton
    },
    data() {
        return {};
    },
    methods: {
    }
};
</script>
