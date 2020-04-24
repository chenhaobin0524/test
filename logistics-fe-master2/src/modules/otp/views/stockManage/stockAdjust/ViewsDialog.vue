<template>
    <div>
        <el-dialog
            title="信息"
            :visible.sync="show"
            width="600px">
            <div class="comp-container">
                <el-form ref="ruleForm" label-position="right" label-width="100px" :model="formData" style="height: 55vh;overflow-y:auto">
                      <el-form-item v-for="(col, idx) in formRows" :key="idx" :label="col.label" style="margin-bottom: 0">
                        <template>
                          <span v-text="col.value"></span>
                        </template>
                      </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="show = false;">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    components: { },
    props: {
        viewVisible: {
            type: Boolean,
            default: false
        },
        formItem: {
            type: Array,
            default() {
                return [];
            }
        },
        data: {
            type: Object
        }
    },
    data() {
        return {
            formData: {
            }
        };
    },
    computed: {
        formRows() {
            const formitem = [];
            this.formItem.forEach(item => {
                formitem.push({
                    label: item.label + '：',
                    value: this.data[item.prop]
                });
            });
            return formitem;
        },
        show: {
            set(val) {
                this.$emit('update:viewVisible', val);
            },
            get() {
                return this.viewVisible;
            }
        }
    }
};
</script>