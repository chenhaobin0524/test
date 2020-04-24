<template>
    <Paper>
        <download-button
            bucket="lc_sit"
            fileName="1.md"
            text="下载"
        />
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import downloadButton from '@/components/lots/OSS/DownloadBtn';
export default {
    components: {
        Paper,
        downloadButton
    },
    data() {
        return {
        };
    },
    methods: {
    }
};
</script>