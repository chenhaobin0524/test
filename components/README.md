# 前端公共子模块

[TOC]

此项目文件夹为前端项目 logistics-framework-fe 的公共子模块，不可单独运行。

## 目录结构

├── awesome                                         // 由美的MUI的 awesome 模块修改而来
│   ├── organization                                // 组织架构组件（将抽离到lots）
│   └── page                                        // 页面常用组件
│       └── mPanel3                                 // 常用面板
├── core                                            // 由美的MUI的核心模块修改而来
│   ├── core_page                                   // 401/404 页面
│   ├── Paper                                       // 卡片页效果
│   ├── tags_nav                                    // 标签页
│   ├── tags_view                                   // 标签页
│   └── themes                                      // 主题文件
│       ├── default                                 // 默认主题
│       │   ├── components                          // 主题组件
│       │   ├── CoreHeader.vue                      // 主题头部
│       │   ├── CoreSidebar.vue                     // 侧边栏
│       │   ├── CoreSidebarMenus.vue                // 侧边栏菜单
│       │   ├── index.js                            // 余额说明
│       │   └── SidebarItem.vue                     // 侧边栏
│       └── core.js                                 // 切换主题代码
├── lots                                            // 物流云组件
│   └── OSS                                         // OSS 文件上传下载组件
└── utils                                           // 公共方法

## 常用面板

