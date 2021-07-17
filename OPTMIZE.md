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
