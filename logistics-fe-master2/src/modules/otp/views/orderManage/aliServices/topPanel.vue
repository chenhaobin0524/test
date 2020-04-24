<template>
    <div class="wrapper-toole">
        <div>
            <el-input v-model="inputValue" placeholder="订单号" class="setting-width"></el-input>
            <el-select v-model="type" placeholder="服务类型" class="setting-width">
                <el-option
                    label="服务类型"
                    value="1">
                </el-option>
            </el-select>
            <el-select v-model="status" placeholder="订单状态" class="setting-width">
                <el-option
                    label="订单状态"
                    value="1">
                </el-option>
            </el-select>
            <el-button type="primary" style="width: 80px;">查 询</el-button>
        </div>
        <div>
            <el-button><i class="el-icon-upload2"></i></el-button>
            <el-button><i class="el-icon-refresh"></i></el-button>
            <el-button><i class="el-icon-set-up"></i></el-button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            inputValue: '',
            type: '',
            status: ''
        };
    }
};
</script>
<style lang="less">
.wrapper-toole{
    display: flex;
    justify-content: space-between;
}
.setting-width{
    width: 160px;
    margin-right: 10px;
}
</style>
