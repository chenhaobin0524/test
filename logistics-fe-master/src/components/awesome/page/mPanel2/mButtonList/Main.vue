<template>
    <el-row type="flex" class="btn-bg">
        <el-col>
          <el-button size="small" v-for="(item, index) in list" :key=index :type="item.type?'primary' : ''" :disabled=!item.type>{{item.name}}</el-button>
        </el-col>
    </el-row>
</template>
<script>
export default {
    name: 'mButtonList',
    props: {
        list: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    methods: {
        handleChange(page) {
            this.$emit('on-change', page);
        },
        handlePageSizeChange(pageSize) {
            this.$emit('on-page-size-change', pageSize);
        }
    }
};
</script>
<style scoped>
  .btn-bg{
    padding: 20px;
    background: #FFF;
  }
</style>
