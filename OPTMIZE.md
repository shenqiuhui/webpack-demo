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



