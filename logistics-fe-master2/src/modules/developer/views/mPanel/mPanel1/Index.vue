<template>
    <m-panel :config="config" dataSourceUrl="/api/usrInfos" @on-input-event="handleInputEvent" @on-add="handleAdd">
    </m-panel>
</template>
<script>
import mPanel from '@/components/awesome/page/mPanel';
import config from './config.json';

export default {
    components: { mPanel },
    data() {
        return {
            config: config
        };
    },
    methods: {
        handleAdd() {
        },
        handleEdit() {
        },
        handleView() {
        },
        handleDelete() {
        },
        handleInputEvent(on, item, event) {
            switch (on) {
            case 'on-change':
                if (item.field === 'envName') {
                }
                break;
            }
        },
        handleSelectChange(selection) {
        }
    },
    mounted() {
    }
};
</script>
