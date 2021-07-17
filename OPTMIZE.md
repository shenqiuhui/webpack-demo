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
