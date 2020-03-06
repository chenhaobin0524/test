<template>
    <div>
        <process-table
            :fdId="fdId"
            :fdTemplateId="fdTemplateId"
        />
        <process-approve-log-table
            :fdId="fdId"
            :fdTemplateId="fdTemplateId"
        />
    </div>
</template>
<script>
import ProcessTable from './ProcessTable';
import ProcessApproveLogTable from './ProcessApproveLogTable';

export default {
    props: {
        fdId: {
            default: function () {
                return '';
            }
        },
        fdTemplateId: {
            default: function () {
                return '';
            }
        }
    },
    components: {
        ProcessTable,
        ProcessApproveLogTable
    },
    methods: {}
};
</script>
<style>

</style>
