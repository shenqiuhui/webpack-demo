# 初级分析

使用 `Webpack` 内置的 `stats`（构建的统计信息）

- 可以通过 `Node` 脚本执行（如冒烟测试），将构建配置传递给 `webpack` 函数，通过回调函数的参数获取到 `stats` 信息
- 也可以在 `package.json` 中配置命令，命令执行会输出 `stats` 信息的 `json` 文件

```json
{
  "scripts": {
    "build:stats": "webpack --env production --json > stats.json"
  }
}
```

**缺点：信息颗粒度比较粗，不容易定位问题**

# 速度分析

使用 `speed-measure-webpack-plugin`

- 分析打包的总耗时
- 可以看到每一个 `loader` 和 `plugin` 的执行耗时

# 体积分析

使用 `webpack-bundle-analyzer`

- 依赖第三方模块文件大小
- 业务里面的组件代码大小

# 使用高版本的 Webpack 和 NodeJS

`Webpack 4` 比 `Webpack 3` 在构建速度上提升了 `60%` ~ `98%`

**使用 `Webpack 4` 优化原因：**

- `V8 6.0` 带来的优化（`for of` 代替 `forEach`、`Map` 和 `Set` 代替 `Object`、`includes` 代替 `indexOf`）
- 默认使用更快的 `md4 hash` 替代 `md5 hash` 算法
- `webpacks AST` 可以直接从 `loader` 传递给 `AST`，减少解析时间
- 使用字符串方法代替正则表达式

# 多进程多实例的构建

**可选方案：**

- `thread-loader`（`Webacpk 4` 默认使用）
- `parallel-webpack`
- `happypack`（`Webpack 4` 被原生替换）

**`HappyPack` 原理：**

每次 `Webpack` 解析一个模块，`HappyPack` 会将它及它的依赖分配给 `worker` 线程中

**多进程/多实例并行压缩：**

- `parallel-uglify-plugin`
- `uglifyjs-webpack-plugin`
- `terser-webpack-plugin`（`Webpack 4` 默认使用，支持压缩 `ESNext` 语法）

# 分包 DLL

**分包的方式：**

- `splitchunks`: `Webpack4` 默认支持的分包方式，将代码公共部分按照分包策略进行分析
- `html-webpack-externals-plugin`: 分离依赖库，使用 `cdn` 的方式引入
- `DllPlugin`: 预编译资源模块，对多个框架库进行提取，打包成一个 `bundle` 文件
- `DllReferencePlugin`: 引用 `dll-plugin` 生成的 `manifest.json` 文件

**`DLL` 分包：**

思路：将 `react`、`react-dom`、`redux`、`react-redux` 基础包和业务基础包打成一个文件

方法：使用 `DllPlugin` 进行分包，`DllReferencePlugin` 对 `manifest.json` 引用

# 构建缓存

目的：提升二次构建速度

**缓存思路：**

- `babel-loader`: 编译 `JS` 开启缓存
- `terser-webpack-plugin`: 代码压缩阶段开启缓存
- `cache-loader` 或者 `hard-source-webpack-plugin`: 开启模块转换阶段的缓存

# 缩小构建目标

目的：尽可能的少构建模块

比如 `babel-loader` 不解析 `node_modules`

- 优化 `resolve.modules` 配置（减少模块搜索层级）
- 优化 `resolve.mainFields` 配置（可以将 `package.json` 中的字段作为入口文件解析，如 `main` 字段，跳过默认查找的过程）
- 优化 `resolve.extensions` 配置（模块文件名后缀查找规则）
- 合理使用 `alias`（缩短公共库查找时间）

# Tree shaking 删除无用 CSS

- `PurifyCSS`: 遍历代码，识别已经用到的 `CSS class`
- `uncss`: `HTML` 需要通过 `jsdom` 加载，所有的样式通过 `PostCSS` 解析，通过 `document.querySelector` 来识别在 `HTML` 文件中不存在的选择器

使用 `purgecss-webpack-plugin` 配合 `mini-css-extract-plugin`

# 图片体积压缩优化

要求：基于 `Node` 库的 `imagemin` 或者 `tinypng API`

使用：配置 `image-webpack-loader`（基于 `imagemin` 实现）

**`imagemin` 优点：**

- 有很多定制选项
- 可以引入更多第三方优化插件，如 `pngquant`
- 可以处理多种图片格式

`pngquant`: 是一款 `PNG` 压缩器，通过将图片转换为具有 `alpha` 通道（通常比 `24/32` 位 `PNG` 文件小 `60% ~ 80%`）的更高效的 `8` 位 `PNG` 格式，可以显著减小文件大小

`pngcrush`: 其主要目的是通过尝试不同的压缩级别和 `PNG` 过滤方法来降低 `PNG IDAT` 数据流的大小

`optipng`: 其设计灵感来自于 `pngcrush`，`optipng` 可将图像文件重新压缩为更小尺寸而不丢失任何信息

`tinypng`: 也是将 `24` 位 `PNG` 文件转化更小有索引的 `8` 位图片，同时所有非必要的 `metadata` 也会被剥离掉

# 动态 Polyfill

| 方案 | 优点 | 缺点 | 是否采用 |
| ---------- | ---------- | ---------- | ---------- |
| `babel-polyfill` | `React 16` 官方推荐 | 包体积 `200k+`，难以抽离 `Map`、`Set`，项目中是单独引用的 `cdn`，如果要用它，单独构建一份放在 `React` 前加载 | 否 |
| `babel-plugin-transform-runtime` | 能只 `polyfill` 到类或方法，相对体积较小 | 不能 `polyfill` 原型上的方法，不适用于业务项目环境复杂的开发 | 否 |
| 自己编写 `Map`、`Set` 的 `polyfill` | 定制化高，体积小 | 重复造轮子，容易日后年久失修称为坑，即使体积小依然要所有用户加载 | 否 |
| `polyfill-service` | 只给用户返回需要的 `polyfill`，社区维护 | 部分国内浏览器 `UA` 无法识别 | 是 |

`polyfill-service`: https://polyfill.io/v3/polyfill.min.js

```html
<script src="https://polyfill.io/v3/polyfill.min.js"></script>
```

# 总结

**体积优化策略**

- `Scope hoisting`
- `Tree shaking`
- 公共资源分离
- 图片压缩
- 动态 `Polyfill`

**项目优化：**

- 渲染优化：
  - 首页、列表页、详情页、采用 `SSR` 或者 `Native` 渲染；
  - 个人中心等高频访问的页面使用 `pre-render`
- 弱网优化：
  - 使用离线包、`PWA` 等离线缓存技术
- `Webview` 优化：
  - 打开 `Webview` 的同时并行的加载页面数据
