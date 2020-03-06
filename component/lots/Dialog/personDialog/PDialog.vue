<template>
  <el-dialog
    :append-to-body='true'
    :title="dialog.title"
    :visible.sync="dialog.showDialog"
    :before-close="closeDialog"
    top="4%"
    width="960px"
    height="600px">
        <div class="dialog-body">
          <slot name="left"></slot>
          <slot name="mid"></slot>
          <slot name="right"></slot>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button
            v-for="(btnItem, idx) in dialog.operation"
            :key="idx"
            :type="btnItem.type"
            v-text="btnItem.label"
            @click="btnEvent(btnItem.Event, dialog)"></el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props: {
        dialog: {
            type: Object
        },
        showDialog: {
            type: Boolean
        }
    },
    methods: {
        btnEvent(eventName, value) {
            this.$emit(`${eventName}`, value);
        },
        closeDialog() {
            this.show = false;
            this.$emit('before-close', this.dialog);
        }
    },
    computed: {
        show: {
            set(val) {
                this.$emit(`update:showDialog`, val);
            },
            get() {
                return this.showDialog;
            }
        }
    }
};
</script>
