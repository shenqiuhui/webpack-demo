# 为什么需要构建工具？

- 转换 `ESNEXT` 语法
- 转换 `JSX` 和 `Vue` 语法
- `CSS` 前缀补全/预处理
- 代码混淆
- 资源压缩
- 图片压缩

# 前端构建演变之路

`ant` + `YUI Tool` => `grunt` => `fis3`/`gulp` => `rollup`/`webpack`/`parcel`/`vite`

# 为什么选择 Webpack？

- 社区活跃度，`Star` 数量、下载量具有绝对优势
- 社区生态丰富
- 配置灵活和插件化扩展
- 官方更新迭代速度快

# 初识配置文件

`Webpack` 默认配置文件 `webpack.config.js`，可以通过 `webpack --config` 指定配置文件。

**零配置 `Webpack` 配置：**

```js
module.exports = {
  entry: './src/index.js',
  output: './dist/main.js'
}
```

# 核心概念 Loaders

`Webpack` 开箱即用只支持 `.js` 和 `.json` 两种文件类型，通过 `Loaders` 去支持其他文件类型并且把他们转换成有效模块，并可以添加到依赖图中，`Loaders` 本身只是一个函数，接受源文件作为参数，返回转换后的结果。

**常见 `Loaders`:**

| 名称 | 描述 |
| ------------ | ------------ |
| babel-loader | 转换 `ESNext` 等 `JS` 语法新特性 |
| css-loader | 支持 `.css` 文件加载和解析 |
| less-loader | 将 `.less` 文件转换成 `CSS` |
| ts-loader | 将 `.ts` 转换成 `JS` |
| file-loader | 处理图片字体等 |
| raw-loader | 将文件以字符串的格式导入 |
| thread-loader | 多进程打包 `JS` 和 `CSS` |

# 核心概念 Plugins

`Plugins` 用于增强 `Webpack` 构建功能，如优化 `bundle` 文件，资源管理和环境变量注入，可以作用于整个构建流程中的环节。

**常见 `Plugins`:**

| 名称 | 描述 |
| ------------ | ------------ |
| CommonsChunkPlugin | 将 `chunks` 相同模块代码提取成公共的 `js` |
| CleanWebpackPlugin | 清理构建目录 |
| ExtractTextWebpackPlugin | 将 `CSS` 从 `bundle` 文件中提取出单独的 `.css` 文件 |
| CopyWebpackPlugin | 将文件或者文件夹拷贝到构建的输出目录 |
| HtmlWebpackPlugin | 创建 `.html` 文件去引用输出的 `bundle` |
| UglifyjsWebpackPlugin | 压缩 `JS` |
| ZipWebpackPlugin | 将打包出的资源生成一个 `zip` 包 |

# Mode

- `production`
  - 设置 `process.env.NODE_ENV` 的值为 `production`
  - 开启 `FlagDependencyUsagePlugin`
  - 开启 `FlagIncludeChunksPlugin`
  - 开启 `ModuleConcatenationPlugin`
  - 开启 `NoEmitOnErrorPlugin`
  - 开启 `OccurrenceOrderPlugin`
  - 开启 `SideEffectsFlagPlugin`
  - 开启 `TerserPlugin`
- `development`
  - 设置 `process.env.NODE_ENV` 的值为 `development`
  - 开启 `NamedChunksPlugin`，`NamedModulesPlugin`（在控制台打印热更新的模块和文件信息）
- `none`
  - 不开启任何优化项

`Webpack 4` 之后，设置 `mode` 可以使用不同模式下内置的函数，默认值 `production`。

# 解析 CSS

- `css-loader`: 用于加载 `.css` 文件，并且转换成 `commmonjs` 对象
- `style-loader`: 将样式通过 `<style>` 标签插入到 `<head>` 中
- `less-loader`: 将 `.less` 解析成 `CSS`

# 解析字体和图片

- `file-loader`: 处理图片和字体
- `url-loader`: 功能与 `file-loader` 相似，支持设置构建阈值进行转换图片文件或者 `base64`

# 文件监听

## 方式

文件监听是发现源码发生变化时，自动重新构建出新的输出文件。

`Webpack` 开启监听的两种模式：

- 启动 `webpack` 命令时带上 `--watch` 参数，缺点是每次都需要手动刷新浏览器
- 在 `webpack.config.js` 中设置 `watch: true`

## 原理

轮询判断文件的最后编辑时间是否变化，某个文件变化并不会立即告诉监听者，而是先缓存起来，等待 `aggregateTimeout`

```js
module.exports = {
  // 是否开启监听，默认为 false
  watch: true,
  watchOptions: {
    // 默认为空，不监听文件或文件夹，支持正则匹配
    ignore: /node_modules/,
    // 监听到变化后会等 300ms 再去执行，默认值 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停的询问指定的文件实现的，默认每秒询问 1000 次
    poll: 1000
  }
};
```

# 热更新原理

- `Webpack Compiler`: 将 `JS` 编译成 `Bundle`
- `HMR Server`: 将热更新的文件输出给 `HMR Runtime`
- `Bundle Server`: 提供文件在浏览器访问
- `HMR Runtime`: 会注入到浏览器，更新文件变化
- `bundle.js`: 构建输出文件

**启动阶段：**

`Text Editer` => `File System` => `Webpack Compiler` => `Bundle Server` => `bundle.js`

**更新阶段：**

`Text Editer` => `File System` => `Webpack Compiler` => `HMR Server` => `HMR Runtime`

# 文件指纹

- `hash`: 和整个项目的构建有关，只要项目文件有修改，整个项目的 `hash` 都会修改
- `chunkhash`: 和 `Webpack` 打包的 `chunk` 有关，不同的 `entry` 会生成不同的 `chunkhash`
- `contenthash`: 根据文件内容来定义 `hash`，文件内容不变，则 `contenthash` 不变

**占位符：**

| 占位符名称 | 含义 |
| ------------ | ------------ |
| [ext] | 资源后缀名 |
| [name] | 文件名称 |
| [path] | 文件的相对路径 |
| [folder] | 文件所在的文件夹 |
| [contenthash] | 文件的内容 `hash`，默认由 `md5` 生成 |
| [hash] | 图片和字体文件的 `hash`，与 `js` 和 `css` 的 `hash` 有所区别，默认由 `md5` 生成 |
| [emoji] | 一个随机指代文件内容的 `emoji` |

# 代码压缩

## JS 压缩

`Webpack 4` 之后内置了 `uglifyjs-webpack-plugin` 插件，`mode=production` 的时候默认执行压缩。

## CSS 压缩

使用 `css-minimizer-webpack-plugin` 进行压缩。

## HTML 压缩

使用 `html-webpack-plugin` 提供的压缩参数 `minify` 配置

# 构建前自动清理产出目录

每次构建时候不会自动清理构建目录，造成构建的输出目录文件越来越多。

- `rm -rf ./dist && webpack`，手动删除
- `rimraf ./dist && webpack`，手动删除
- `clean-webpack-plugin`，自动删除

# 私有前缀

**常见浏览器内核及私有前缀：**

- `IE`: `Trident`（`-ms`）
- `Firefox`: `Geko`（`-moz`）
- `Chrome`: `Webkit`（`webkit`）
- `Opera`: `Presto`（`-o`）

使用 `autoprefixer` 插件，配合 `postcss-loader`、 [Can I use](https://caniuse.com) 规则。

# rem 自动转换

定义：`font-size of root element`

`rem` 和 `px` 的对比：

- `rem`: 相对单位
- `px`: 绝对单位

使用 `px2rem-loader` 或 [lib-flexible](https://github.com/amfe/lib-flexible)

# 资源内联到 HTML

**资源内联的意义：**

- 页面框架的初始化脚本
- 上报埋点相关
- 首屏 `CSS` 内联避免页面闪动
- 小图片或字体内联减少 `HTTP` 请求

**内联方法：**

- `HTML` 和 `JS` 内联：`raw-loader`
- `CSS` 内联：
  - `style-loader`: `options.singleton=true`，将所有 `style` 标签合并成一个
  - `html-inline-css-webpack-plugin`:

# 多页面应用 MPA

每一次跳转的时候，服务端都会返回一个新的 `.html` 文件，这种类型的网站就叫做 `MPA`（多页面应用）。

**优势：**

- 每个页面之间是解耦的
- 对 `SEO` 更加友好

**多页面打包思路：**

每个页面对应一个 `entry` 和一个 `html-webpack-plugin` 的实例，缺点是每次增加和删除页面都需要更改 `Webpack` 配置，使用 `glob` 库在每次构建时动态读取约定好的页面目录动态生成 `entry` 和 `html-webpack-plugin` 的实例。

# SourceMap

作用：通过 `SourceMap`（[科普文](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)）定位到源代码，开发环境开启，线上环境关闭，线上主要是将 `SourceMap` 文件上传到监控系统，用于报警后的问题排查和定位。

**`Source Map` 类型关键字：**

- `eval`: 使用 `eval` 包裹代码块，代码块后面存在 `source map` 的 `URL` 指定信息
- `source map`: 产生 `.map` 文件
- `cheap`: 不包含列信息
- `inline`: 将 `.map` 作为 `DataURL` 嵌入，不单独生成 `.map`
- `module`: 包含 `loader` 的 `source map`

| devtool | 首次构建 | 二次构建 | 是否适合生产环境 | 可以定位的代码 |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| (none) | +++ | +++ | yes | 最终输出的代码 |
| eval | +++ | +++ | no | `Webpack` 生成的代码（一个个的模块） |
| cheap-eval-source-map | + | ++ | no | 经过 `loader` 转换后的代码（只能看到行） |
| cheap-module-eval-source-map | o | ++ | no | 源代码（只能看到行） |
| eval-source-map | -- | + | no | 源代码 |
| cheap-source-map | + | o | yes | 经过 `loader` 转换后的代码（只能看到行） |
| cheap-module-source-map | o | - | yes | 源代码（只能看到行） |
| inline-cheap-source-map | + | o | no | 经过 `loader` 转换后的代码（只能看到行） |
| inline-cheap-module-source-map | o | - | no | 源代码（只能看到行） |
| source-map | -- | -- | yes | 源代码 |
| inline-source-map | -- | -- | no | 源代码 |
| hidden-source-map | -- | -- | yes | 源代码 |

# 基础库分离

**思路：**

- 比如 `React` 项目，将 `react`、`react-dom` 基础包通过 `cdn` 引入，不打入 `bundle` 中，使用 `html-webpack-externals-plugin`
- 也可以利用 `Webpack 4` 内置的 `SplitChunksPlugin`，通过配置 `splitchunks` 实现

**`chunks` 参数说明：**

- `async`: 异步引入的库进行分离（默认）
- `initial`: 同步引入
- `all`: 所有引入的库进行分离（推荐）

```js
// https://webpack.docschina.org/plugins/split-chunks-plugin/
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        }
      }
    }
  }
};
```

# Tree shaking

## 概念

借鉴了 `Rollup`，在 `Webpack 2` 版本支持。

概念：一个模块可能有多个方法，只要其中某个方法被使用到了，则整个文件都会被打包到 `bundle` 中，`Tree shaking` 就是把没有使用的方法在打包过程中擦除掉，只把使用的方法打包到 `bundle` 中。

使用：`Webpack 4+` 默认支持，在 `.babelrc` 中设置 `modules: false` 即可，在 `production mode` 的情况下默认开启。

要求：必须是 `ESModule` 语法，`CommonJS` 语法不支持。

**`Tree Shaking` 的条件 `DCE`(`Dead Code Elimination`)**

- 代码不会被执行，不可触达
- 代码执行的结果不会被使用到
- 死变量，只写不读
- 未使用函数必须为纯函数，不能存在副作用

```js
if (false) {
  console.log('不可触达');
}
```

```js
function fn() {
  console.log('未被使用到');
}

function fun() {
  console.log('被使用到');
}

fun();
```

```js
const a = 1; // 死变量
const b = 2;

console.log(b);
```

## 原理

**利用 `ESModule` 的静态特性：**

- 只能作为模块顶层的语句出现
- `import` 的模块名只能是常量
- `import binding` 是 `immutable` 的

代码擦除：在 `ESModule` 阶段进行静态分析，将要擦除的代码进行注释标记，`Uglify` 阶段擦除无用代码。

# Scope Hoisting

借鉴了 `Rollup`，在 `Webpack 3` 版本支持，在 `Webpack 4+` 默认支持，在 `production mode` 的情况下默认开启。

要求：必须是 `ESModule` 语法，`CommonJS` 语法不支持。

## `Webpack` 在处理 `ESModule` 代码逻辑

- 最外层会包裹一层 `IIFE`，即匿名闭包（浏览器端的 `CommonJS`）
- `import` 会转换成 `_webpack_require`，用来加载模块，返回 `module.exports`
- `__webpack_modules__` 是一个数组用来管理 `IIFE` 的模块
- `__webpack_require__(0)` 来启动程序

## 未开启 `Scope Hoisting` 会导致的问题

- 大量模块函数闭包包裹的代码，导致体积增大（模块越多越明显）
- 代码运行时创建的函数作用域变多，内存开销变大

## Scope Hoisting 原理

原理：将所有模块的代码按照引用顺序放在一个函数作用域里（被依赖模块在前），然后适当的重命名一些变量防止变量名冲突，通过 `Scope Hoisting` 可以大大减少函数声明的代码和内存开销。

当被多个模块引用，`Scope Hoisting` 将不会提升作用域。

# 代码分割

对于大部分 `Web` 应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当某些代码是在某些特殊时候才会被使用到，`Webpack` 有一个功能就是将你的代码分割成 `chunks`，当代码运行到他们的时候再进行加载。

## 适用场景

- 抽离相同代码到一个共享块
- 按需加载，使得初始下载的代码更小

**按需加载脚本的方式：**

- `CommonJS`: `require.ensure`
- `ESModule`: 动态 `import`，目前原生还没有被所有浏览器厂商所支持，需要 `babel` 转换

## 动态 import 支持

> npm install @babel/plugin-syntax-dynamic-import -D

```json
{
  "plugins": [
    "@babel/plugin-syntax-dynamic-import"
  ]
}
```

# ESLint 使用

优秀的 `ESLint` 规范实践：

- `eslint-config-airbnb`
- `eslint-config-airbnb-base`

开发 `ESLint` 规范结合原则：

- 不重复造轮子，`eslint:recommend` 配置并改进
- 能够发现代码错误的规则全部开启
- 帮助团队保持统一的代码风格，而不是限制开发体验。

落地方案：

- 和 `CI/CD` 集成，将代码检查放在发布流的 `pipeline` 中
- 和 `Webpack` 等构建工具集成（会针对所有的文件进行检查，适用于新项目）
- 本地增加 `precommit` 钩子，结合 `husky` 配置文件检查（增量检查，适用于旧项目）

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  }
}
```

```json
{
  "scripts": {
    "precommit": "lint-staged",
  },
  "lint-staged": {
    "linters": {
      "*.{js,css}": ["eslint --fix", "git add"]
    }
  }
}
```

# 打包自主开发的基础库

**`Webpack` 除了可以打包应用，也可以打包 `js` 库：**

- 需要打包压缩和非压缩版本
- 支持 `AMD/CommonJS/ESModule` 模块引入
- 支持 `script` 标签引入

> `RollUp` 打包基础库更加适合，因为相对于 `Webpack` 打包更加纯粹，配置更加简单

**如何将库暴露出去：**

- `library`: 指定库的全局变量
- `libraryExport`: 默认设置为 `default`，默认导出的情况下方便库的访问和使用
- `libraryTarget`: 支持库引入的方式

> 压缩版本使用 `TerserPlugin` 可以兼容压缩 `ESNext` 语法，基于 `UglifyJS 3.0` 版本开发，旧版 `UglifyJS` 遇到 `ESNext` 语法则会报错

# SSR 构建

## 服务端渲染（SSR）是什么？

客户端渲染：`HTML` + `CSS` + `JS` + `Data` + 渲染后的 `HTML`

服务端渲染：

- 所有模板等资源都存储在服务端
- 内网机器拉取数据更快
- 一个 `HTML` 返回的所有数据

## 客户端渲染和服务端渲染对比

|  | 客户端渲染 | 服务端渲染 |
| ------------ | ------------ | ------------ |
| 请求 | 多个请求（`HTML`、数据等） | 1 个请求 |
| 加载过程 | `HTML` 和数据串行加载 | 1 个请求返回 `HTML` 和数据 |
| 渲染 | 客户端渲染 | 服务端渲染 |
| 可交互 | 图片等静态资源加载完成，`JS` 逻辑执行完成可交互 | 图片等静态资源加载完成，`JS` 逻辑执行完成可交互 |

> 总结：服务端渲染（`SSR`）的核心是减少请求

## 服务端渲染的优势

- 减少白屏时间
- 对 `SEO` 友好

## SSR 代码实现思路

**服务端（如 `React` 技术栈）：**

- 使用 `react-dom/server` 的 `renderToString` 方法将 `React` 组件渲染成字符串
- 服务端路由返回对应的模板

**客户端：**

- 打包针对服务端的组件

## SSR 容易遇到的问题

- 浏览器全局变量（`NodeJS` 中不存在 `window`、`document`）
  - 组件适配：将不兼容的组件根据打包进行适配
  - 请求适配：将 `fetch`、`ajax` 发送请求换成 `isomorphic-fetch` 或者 `axios`

- 样式问题（`NodeJS` 无法解析 `css`）
  - 方案一：服务端打包通过 `ignore-loader` 忽略掉 `CSS` 的解析
  - 方案二：将 `style-loader` 替换成 `isomorphic-style-loader`（`CSS` in `JS` 写法）

**解决样式问题：**

- 使用打包出来的浏览器 `HTML` 为模板，设置占位符动态插入组件

**首屏数据如何处理**

- 服务端获取数据
- 替换占位符

# 构建日志

默认情况下，用 `Webpack` 构建会展示一大堆日志，很多并不需要开发者关注

**统计信息 `stats`:**

| Preset | Alternative | Description |
| ------------ | ------------ | ------------ |
| `errors-only` | none | 只在发生错误时输出 |
| `minimal` | none | 只在发生错误或有新编译时输出 |
| `none` | false | 没有输出 |
| `normal` | true | 标准输出 |
| `verbose` | none | 全部输出 |

同时可以使用 `friendly-errors-webpack-plugin` 配合 `stats` 设置优化日志

# 构建异常和终端处理

在 `CI/CD` 的 `Pipeline` 或者发布系统需要知道当前构建状态，可以通过命令 `echo $?` 查看，返回 0 代表构建成功，否则失败

在 `Webpack 4` 之前的版本构建错误不会抛出错误码，在之前的版本可以通过插件监听 `hooks` 的 `done` 事件自行添加错误状态和信息

`NodeJS` 中 `process.exit` 规范：

- 0 表示成功完成，回调函数中 `err` 为 `null`
- 非 0 表示执行失败，回调函数中 `err` 为对象，`err.code` 就是错误码

# 构建配置抽离
## 构建配置抽离成 npm 包的意义

- 通用性
  - 业务开发者无需关注构建配置
  - 统一团队构建脚本
- 可维护性
  - 构建配置合理拆分
  - `README` 文档、`ChangeLog` 文档等
- 质量
  - 冒烟测试、单元测试、测试覆盖率
  - 持续集成

## 构建配置管理的可选方案

- 通过多个配置文件管理不同环境的构建，`webpack --config` 参数进行控制
- 构建配置设置成一个库，比如 `hjs-webpack`、`Neutrino`、`webpack-blocks`
- 抽成一个工具进行管理，比如 `create-react-app`、`kyt`、`nwb`
- 将所有配置放置在一个文件，通过 `--env` 参数控制分支选择

## 构建包设计

**通过多个配置文件管理不同环境的 `webpack` 配置：**

- 基础配置：`webpack.base.js`
- 开发环境：`webpack.dev.conf.js`
- 生产环境：`webpack.prod.conf.js`
- `SSR` 环境：`webpack.ssr.conf.js`

**抽离称一个 `npm` 包统一管理：**

- 规范：`Git Commit` 日志、`README`、`ESLint` 规范、`Semver` 规范
- 质量：冒烟测试、单元测试、测试覆盖率和 `CI`

## 冒烟测试

冒烟测试：是指对提交测试的软件在进行详细深入的测试之前而进行的预测试，这种测试的主要目的是暴露导致软件需要重新发布基本功能失效等严重问题。

- 构建是否成功（在示例项目里运行构建，看看是否有报错）
- 每次构建完 `build` 产出目录是否有内容输出（编写 `mocha` 测试用例）
  - 是否有 `js`、`css` 等静态文件输出
  - 是否有 `html` 文件输出

