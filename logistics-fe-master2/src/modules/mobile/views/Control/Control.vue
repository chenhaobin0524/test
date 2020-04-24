<template >
  <div class="main">
    <el-tabs v-model="activeName">
      <el-tab-pane label="调度排队" name="first">
        <Queue ref='Queue'></Queue>
      </el-tab-pane>
      <el-tab-pane label="垛口设置" name="second">
        <SetCrenel></SetCrenel>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SetCrenel from './SetCrenel';
import Queue from './Queue';
export default {
    // name: 'DanoneConsole',
    components: { SetCrenel, Queue },
    data() {
        return {
            activeName: 'first'
        };
    },
    methods: {},
    beforeRouteLeave(to, from, next) {
        if (this.$refs.Queue) {
            clearInterval(this.$refs.Queue.timer);
        }
        next();
    }
};
</script>
<style lang="less">
  .main {
    margin: 10px;
    background: #fff;
    padding: 10px;
  }
</style>