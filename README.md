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

零配置 `Webpack` 配置：

```js
module.exports = {
  entry: './src/index.js',
  output: './dist/main.js'
}
```
