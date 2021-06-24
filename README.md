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
