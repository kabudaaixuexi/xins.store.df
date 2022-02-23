<span class="color1">xins.store.df （全局数据流管理）</span>
===
> 基于JS Proxy为应用程序提供全局数据管理（数据层 + 单向数据流）


***

### **介绍**

storedf 是一个小型的状态管理库，也可以看成是一个函数，不依赖任何外部库，也无关开发模式，核心是利用proxy的代理特性进行数据监听调用相应回调，类似vue2源码中的两个构造函数observer和watcher。

兼容性同 [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy 'Proxy')

<span class="color1">使用方式（以vue项目为例）</span>

+ 安装
```
npm i xins.store.df
```
+ 初始化store

```
// 根目录新建store/index.ts 代码如下

// 引入
import moon from 'xins.store.df'

// 数据只做一级监听，比如这里可以监听 userInfo 或 defaultPath
const state = {
    userInfo : {
        name: 'test'
    },
    defaultPath : {
        url1 : 'https://www.npmjs.com/package/xins.store.df'
    }
}

// 接收三个参数
// 第一个参数为初始化的全局数据（必传）
// 第二个参数为要挂载的实例对象（必传），比如window，vue全局实例对象，如果不需要任何挂载传入false
// 第三个参数为是否开启持久化（非必传），默认为不开启
export default moon(state, false, true)
```
+ 全局注入
```
import { createApp } from 'vue'
import moon from './store'

// 这里也可以写在store/index,自由发挥
const store = (app: App) => {
    moon
}

createApp(app).use(store).mount('#app')
```

+ 组件内使用
```
import moon from '@/store'

// 获取全局状态，参数可选，不传的话返回全部状态
moon.$_getData('userInfo')

// 监听某个状态，一般在当前组件更新全局状态并在当前组件使用该状态时使用，第三个参数为可选项，是否在初始化时监听
moon.$_watch('userInfo',(new_val,old_val)=>{
    console.log(new_val,'new_val-userInfo');
    console.log(old_val,'old_val-userInfo')

    state.userInfo = new_val
}, true)

// 更新全局状态，会查找对应键名，当前全局状态没有的话则新增，不会影响未传入的键名对象
moon.$_set({
    userInfo: {
        name: '张三'
    }
})
```


### **总结**

storedf是一个很小型的工具函数，核心代码约30行，本意是实现一个微型的redux，只做数据层的处理，所以当涉及到视图层的时候需要利用watch函数主动更新视图，代码比较简单

[webpack5联邦模块学习点击这里](https://webpack.docschina.org/blog/2020-12-08-roadmap-2021/#hot-module-replacement-for-module-federation "Module Federation")