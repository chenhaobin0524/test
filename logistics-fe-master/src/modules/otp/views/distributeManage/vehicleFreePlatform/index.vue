<template>
    <paper class="vehicleFreePlatform">
        <el-tabs v-model="activeName">
            <el-tab-pane label="路歌" name="first">
                <road-song></road-song>
            </el-tab-pane>
            <el-tab-pane label="G7" name="second">
                <g-seven></g-seven>
            </el-tab-pane>
        </el-tabs>
    </paper>
</template>
<script>
import roadSong from './roadSong/roadSong';
import paper from '@/components/core/paper/Paper';
import GSeven from './GSeven/Main';

export default {
    components: { paper, roadSong, GSeven },
    data() {
        return {
            activeName: 'first'
        };
    },
    methods: {},
    mounted() {}
};
</script>

<style lang="less">
</style>
