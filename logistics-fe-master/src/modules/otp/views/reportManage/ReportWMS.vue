<template>
    <paper>
        <iframe-report/>
    </paper>
</template>

<script>
import iframeReport from '@/components/lots/IframeReport';
import Paper from '@/components/core/paper/Paper';
export default {
    name: 'reportWMS',
    components: { iframeReport, Paper }
};
</script>
