# 一个最简单的 loader 代码结构

定义：`loader` 只是一个导出为函数的 `JavaScript` 模块定义

```js
module.exports = function (source) {
  return source;
}
```

# 多 loader 时的执行顺序

多个 `loader` 串行执行，顺序从后到前，如下代码，先执行 `less-loader`，再执行 `css-loader`，最后执行 `style-loader`，每个 `loader` 都会将执行后返回的结果传递给下一个 `loader`

```js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  }
};
```

**函数组合的两种情况：**

- `Unix` 中的 `Pipeline`
- `Compose`，`Webpack` 采用的方式

```js
const compose = (f, g) => (...args) => f(g(...args));
```

# loader-runner 介绍

`loader-runner` 允许在不安装 `Webpack` 的情况下执行 `loaders`，作用：

- 作为 `Webpack` 的依赖，在 `Webpack` 源码中使用 `loader-runner` 执行 `loaders`
- 进行 `loader` 的开发和调试

```js
import { runLoaders } from 'loader-runner';

runLoaders({
  resource: '/abs/path/to/file.txt?query', // 解析静态资源的路径（绝对路径）
  loaders: ['/abs/path/to/loader.js?query'], // 多个 loaders（绝对路径）
  context: { minimize: true }, // 提供基础上下文以外的其他 loader 上下文
  readResource: fs.readFile.bind(fs) // 查询 resource 的方式（函数）
}, function (err, result) {
  // err 错误信息
  // result 执行后的结果
});
```