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

# loader 的参数获取

通过 `loader-utils` 的 `getOptions` 方法获取

```js
const loaderUtils = require('loader-utils');

module.exports = function (content) {
  const { name } = loaderUtils.getOptions(this);
}
```

# loader 异常处理

- `loader` 内直接通过 `throw` 抛出（同步）
- 通过 `this.callback` 传递错误（同步）

```ts
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
);
```

# loader 的异步处理

通过 `this.async` 来返回一个异步函数，第一个参数是 `error`，第二个参数是处理结果

```js
module.exports = function (input) {
  const callback = this.async();

  callback(null, input);
}
```

# 在 loader 中使用缓存

`Webpack` 中默认开启缓存，可以使用 `this.cacheable(false)` 关闭缓存

缓存条件：`loader` 的结果在相同的输入下有确定的输出（有依赖的 `loader` 无法使用缓存）

# loader 的文件输出

通过 `this.emitFile` 进行文件写入

```js
const loaderUtils = require('loader-utils');

module.exports = function (content) {
  const url = loaderUtils.interpolateName(this, '[hash].[ext]', {
    content
  });

  this.emitFile(url, content);

  const path = `__webpack_public_path__ + ${JSON.stringify(url)};`;
  return `export default ${path}`;
}
```

# 自动合成雪碧图 loader

## 支持语法

`background: url('a.png?__sprite');` + `background: url('b.png?__sprite');` => `background: url('sprite.png');`

## 准备知识

如何将两张图片合成一张图片？

使用 [spritesmith](https://www.npmjs.com/package/spritesmith)

```js
const sprits = ['./images/1.jpg', './images/2.jpg'];

Spritesmith.run({ src: sprites }, function handleRresult(err, result) {
  result.image;
  result.coordinates,
  result.properties
});
```
