# plugin 和 loader 的区别

- `loader` 作用是用来处理各种各样的静态资源，有独立的上下文和运行环境，所以可以使用 `loader-runner` 去运行
- `plugin` 的功能更加强大，可以处理 `Webpack` 初始化一直到文件生成中间所有的过程，没有独立的运行环境，只能在 `Webpack` 里面运行

# plugin 的基本结构

**基本结构：**

```js
class MyPlugin {                                        // 插件名称
  apply(compiler) {                                     // 插件 apply 方法
    compiler.hooks.done.tap('My plugin', (stats) => {   // 插件的 hooks（compiler 和 compilation 两部分）
      console.log('Hello my Plugin');                   // 插件处理逻辑
    });
  }
}

module.exports = MyPlugin;
```

**插件使用：**

```js
module.exports = {
  // ...
  plugins: [
    new MyPlugin()
  ]
  // ...
};
```

# plugin 参数获取

通过 `plugin` 的构造函数进行获取

```js
class MyPlugin {
  constructor(options) {
    this.options = options;
  }
  apply() {
    console.log('options', this.options);
  }
}

module.exports = MyPlugin;
```

# plugin 的错误处理

- 参数校验阶段可以直接 `throw` 的方式抛出错误
- 通过 `compilation` 对象的 `warnings` 和 `errors` 接收

```js
// throw 抛出
throw new Error('Error message');

// compilation 传递
compilation.warnings.push('warning');
compilation.errors.push('error');
```

# 通过 Compilation 进行文件写入

`Compilation` 上的 `assets` 可以用于文件写入，可以将 `.zip` 包资源设置到 `assets` 对象上（发生在 `init` 阶段，`emit` 钩子中，是 `AsyncSeriesHook`，一个异步串行钩子）

文件写入需要使用 [webpack-sources](https://www.npmjs.com/package/webpack-sources)

```js
const { RawSource } = require('webpack-sources');

class MyPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    const { name } = this.options;
    compiler.hooks.emit.tapAsync('Plugin', (compilation, callback) => {
      compilation.assets[name] = new RawSource('code');
      callback();
    });
  }
}
```

# 编写 plugin 的 plugin

`plugin` 也可以通过暴露 `hooks` 的方式进行自身扩展，以 `html-webpack-plugin` 为例（社区一些 `plugin` 都是基于 `html-webpack-plugin` 开发的）

- `html-webpack-plugin-after-chunks` (`Sync`)
- `html-webpack-plugin-before-html-generation` (`Async`)
- `html-webpack-plugin-after-asset-tags` (`Async`)
- `html-webpack-plugin-after-html-processing` (`Async`)
- `html-webpack-plugin-after-emit` (`Async`)

# 压缩构建资源为 zip 包的 plugin

## 支持功能

- 生成 `zip` 包文件名称可以通过插件传入
- 需要使用 `compiler` 对象上的 `hooks` 进行资源的生成

## 准备知识

使用 [jszip](https://www.npmjs.com/package/jszip)

```js
const zip = new JSZip();
zip.file('hello.txt', 'Hello world\n');

const img = zip.folder("images");
img.file('simple.gif', imgData, { base64: true });

zip.generateAsync({ type: 'blob' }).then((content) => {
  SaveAs(content, 'example.zip');
});
```
