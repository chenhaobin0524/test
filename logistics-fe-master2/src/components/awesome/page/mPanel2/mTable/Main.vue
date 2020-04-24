<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      v-for="(item, index) in totalDate.columns"
      :key=index
      :prop=item.prop
      :label=item.label
      :sortable="item.sort"
      :width="item.width?item.width : ''">
      <template slot="header">
        <el-input
          style="padding: 0"
          size="mini"
          @blur="searchChange"
          @keyup.enter.native="searchChange"
          v-model="searchDate[item.prop]"/>
        <span>{{item.label}}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-if="totalDate.leftOperation"
      fixed="right"
      label="操作">
      <template slot-scope="scope">
        <el-button
          v-for="(item, index) in totalDate.action"
          :key=index
          @click=btnEvent(scope.row,item.event)
          :type=item.type
          :size=item.size>
          {{item.label}}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
    name: 'mTable',
    data() {
        return {
            searchDate: {}
        };
    },
    props: {
        totalDate: Object,
        tableData: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    methods: {
        handleSelectionChange(selection) {
            this.$emit('on-selection-change', selection);
        },
        btnEvent(selection, event) {
            const self = this;
            if (event === 'view') {
                self.$emit('btnView', selection);
            } else if (event === 'edit') {
                self.$emit('btnEdit', selection);
            } else if (event === 'delete') {
                self.$emit('btnDelete', selection);
            }
        },
        searchChange() {
            this.$emit('onSearchChange', this.searchDate);
        }
    },
    created() {
        this.totalDate.columns.map(data => {
            this.$set(this.searchDate, data.prop, '');
        });
    }
};
</script>
<style lang="less">
</style>
