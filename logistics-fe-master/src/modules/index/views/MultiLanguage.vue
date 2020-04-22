<template>
    <Paper>
        <div class="language" v-html="$t('index.multiLanguage.desc')">
        </div>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
export default {
    name: 'multi_language',
    components: { Paper }
};

</script>
