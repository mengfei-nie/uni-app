## 项目介绍
```
1. 项目技术栈的搭建基于UniApp + Vue2.0 + Typescript等。
2. 开发人员需掌握小程序、UniApp、Typescript、es6类、装饰器等相关前端技能。
```
## 目录结构

```
┌──.vscode vscode 编辑器配置目录
├──src   
│   ├── api 接口文档目录                   
│   ├── assets 
│   ├── components 符合 vue 组件规范的 uni-app 组件目录  
│   │   └──comp-a.vue 可复用的 a 组件  
│   ├── pages 业务页面文件存放的目录  
│   │    │──index  
│   │    │ └──index.vue index 页面  
│   ├── static 存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此  
│   ├── utils 公共库，包括常量  
│   │    │──config.ts 全局配置   
│   │    │──constants.ts 常量配置  
│   │    │──validator.ts 自定义校验器  
│   │    │──plugin.ts vue插件  
│   │    └──decorator.ts 装饰器配置  
│   ├── wxcomponents 存放小程序组件的目录  
│   ├── main.ts Vue 初始化入口文件  
│   ├── App.vue 应用配置，用来配置 App 全局样式以及监听 应用生命周期  
│   ├── manifest.json 配置应用名称、appid、logo、版本等打包信息  
│   ├── pages.json 配置页面路由、导航条、选项卡等页面类信息  
├── .eslint.js eslint 代码校验配置文件  
├── .stylelint.json stylelint 代码校验配置文件  
├── vue.config.js webpack配置文件  
├── postcss.config.js css预处理器
├── httpServer.js 启动本地图片资源服务脚本
└── package.json

```

## 项目启动

```
1. 安装依赖包
yarn install

2. 启动项目
yarn serve
```

## 项目发版
```
1. 项目打包
npm run build

2.上传生成的图片源码包cdnStatic目录放到服务器

3.上传源码包到微信服务器

4.设置体验包
```

## 注意
```
##图片处理
1.本地背景图片资源不超过20k，超过会处理成网络图片  
2.image标签资源大小无限制，不过建议使用背景图片替代，避免static资源过大  
3.image本地资源引入，建议用@/static开头引入  

##ui组件
已经引入uni-ui组件库，可通过<uni-popup>使用

##webview交互
已经统一定义webview交互承载页面/webview/webview/index

##样式命名
采用中横线连接(my-name)

##待补充
```

#### 参考文档
1. [Uniapp官网](https://uniapp.dcloud.io/)
2. [类组件开发](https://class-component.vuejs.org/)
3. [Vue属性装饰器](https://github.com/kaorun343/vue-property-decorator)
4. [Es6语法入门-阮一峰](https://es6.ruanyifeng.com/)
5. [vuex装饰器](https://github.com/ktsn/vuex-class)




