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
