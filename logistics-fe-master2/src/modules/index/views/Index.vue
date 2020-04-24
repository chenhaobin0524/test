<template>
    <Paper>
        <div class="about">
            <h1>简介</h1>
            <p>{{introduction}}</p>
            <h1>目录结构</h1>
            <pre>{{directory}}</pre>
        </div>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
export default {
    name: 'index_page',
    components: { Paper },
    data() {
        return {
            directory: `
                ├─.dockerignore
                ├─.editorconfig
                ├─.env.production         生产环境相关配置
                ├─.env.sit                sit环境相关配置
                ├─.gitignore
                ├─babel.config.js         babel相关配置
                ├─Dockerfile              docker相关配置
                ├─package.json
                ├─README.md               使用前必读文件
                ├─vue.config.js
                ├─.git
                ├─config
                ├─public                  不经过打包可直接访问的文件
                └─src                     
                  ├─assets                
                  ├─components            组件相关文件夹
                  │  ├─awesome            自定义组件
                  │  └─core               核心组件
                  ├─config                配置文件文件夹
                  │  └─user.env.js        环境变量
                  ├─modules               模块文件夹
                  │  ├─demo               demo模块
                  │  └─index              index模块
                  ├─store                 vuex相关
                  │  └─modules            
                  ├─styles                样式文件夹
                  │  ├─vars.less
                  │  └─fonts
                  └─utils                 工具
                      ├─directive         自定义指令
                      │  └─display.js     用于授权组件是否显示
                      ├─http.js           基于axios封装的ajax请求
                      └─index.js          通用的js方法
      `,
            introduction: `midea-admin是一套采用前后端分离开发模式，基于Vue的后台管理系统前端解决方案，UI框架采用了由开发云开发的基于UED设计标准的MUI。
                midea-admin2.0脱离1.x版本进行重构，换用Webpack4.0 + Vue-cli3.0作为基本开发环境。内置了开发后台管理系统常用的逻辑功能，
                和开箱即用的业务组件，旨在让开发者能够以最小的成本开发后台管理系统，降低开发量。`
        };
    }
};

</script>
