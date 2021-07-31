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
