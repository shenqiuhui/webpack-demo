# 开始：从 Webpack 命令行说起

通过 `npm scripts` 运行 `webpack`

- 开发环境 `npm run dev`
- 生产环境 `npm run build`

通过 `webpack` 直接运行

- `webpack entry.js bundle.js`

## 查找 Webpack 入口文件

在命令行运行以上命令后，`npm` 会让命令行工具进入 `node_modules\.bin` 目录查找是否存在 `webpack.sh` 或者 `webpack.cmd` 文件，如果存在，就执行，不存在，就抛出错误。

实际的入口文件是：`node_modules\webpack\bin\webpack.js`

## 分析 Webpack 的入口文件 webpack.js

```js
// 1、正常执行返回
process.exitCode = 0;

// 2、运行某个命令
const runCommand = (command, args) => { /* ... */ };

// 3、判断某个包是否安装
const isInstalled = packageName => { /* ... */ };

// 4、webpack 可用的 CLI:webpack-cli 和 webpack-command
const CLIs = [ /* ... */ ];

// 5、判断两个 CLI 是否安装
const installedClis = CLIs.filter(cli => cli.installed);

// 6、根据安装数量进行处理
if (installedClis.length === 0) {
  /* ... */
} else if (installedClis.length === 1) {
  /* ... */
} else {
  /* ... */
}
```

**启动后的结果：**

`Webpack` 最终找到 `webpack-cli` 这个 `npm` 包，并且执行 `CLI`
