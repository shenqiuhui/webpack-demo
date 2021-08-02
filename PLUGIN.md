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
