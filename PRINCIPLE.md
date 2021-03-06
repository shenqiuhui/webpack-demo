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

## webpack-cli 做了哪些事情

- 引入 `yargs`，对命令进行定制
- 分析命令行参数，对各个参数进行转换，组成编译配置项
- 引用 `webpack`，根据配置项进行编译和构建

### 从 NON_COMPILATION_CMD 分析出不需要编译的命令

```js
const NON_COMPILATION_ARGS = [
  "init",                         // 创建一份 webpack 配置文件
  "migrate",                      // 进行 webpack 版本迁移
  "add",                          // 往 webpack 配置中增加属性
  "remove",                       // 从 webpack 配置中删除属性
  "serve",                        // 运行 webpack-serve
  "generate-loader",              // 生成 webpack loader 代码
  "generate-plugin",              // 生成 webpack plugin 代码
  "info"                          // 返回与本地环境相关的一些信息
]
```

### 命令行工具包 yargs 介绍

- 提供命令和分组参数
- 动态生成 `help` 帮助信息

### 参数分组（config/config-args.js）将命令划分为 9 类

- `Config options`: 配置相关参数（文件名称，运行环境等）
- `Basic options`: 基础参数（`entry` 设置、`debug` 模式设置、`watch` 监听设置、`devtool` 设置）
- `Module options`: 模块参数，给 `loader` 设置扩展
- `Output options`: 输出参数（输出路径，输出文件名称）
- `Advanced options`: 高级用法（记录设置、缓存设置、监听频率、`bail` 等）
- `Resolving options`: 解析参数（`alias` 和解析的文件后缀设置）
- `Optimizing options`: 优化参数
- `Stats options`: 统计参数
- `options`: 通用参数（帮助命令、版本信息等）

### webpack-cli 执行结果

- `webpack-cli` 对配置文件和命令行参数进行转换，最终生成配置选项参数 `options`
- 最终会根据配置参数实例化 `webpack` 对象，然后执行构建流程

# Webpack 的本质

可以将 `Webpack` 理解是一种基于事件流的编程范例，一些列的插件运行。

## Tapable 是什么

`Tapable` 是一个类似于 `Node.js` 的 `EventEmitter` 的库，主要是控制钩子函数的发布与订阅，控制着 `Webpack` 的插件系统。

### Table 钩子

**`Tapable` 库暴露了很多钩子类，为插件提供挂载的钩子**

- `SyncHook`: 同步钩子
- `SyncBailHook`: 同步熔断钩子
- `SyncWaterfallHook`: 同步流水钩子
- `SyncLoopHook`: 同步循环钩子
- `AsyncParallelHook`: 异步并发钩子
- `AsyncParallelBailHook`: 异步并发熔断钩子
- `AsyncSeriesHook`: 异步串行钩子
- `AsyncSeriesBailHook`: 异步串行熔断钩子
- `AsyncSeriesWaterfallHook`: 异步串行流水钩子

**`Tapable` 钩子关键词：**

| type | funciton |
| ------ | ------ |
| `Hook` | 所有钩子的后缀 |
| `Waterfall` | 同步方法，但是它会传值给下一个函数 |
| `Bail` | 熔断：当函数有任何值返回，就会在当前执行函数停止 |
| `Loop` | 监听函数返回 `true` 表示继续循环，返回 `undefined` 表示结束循环 |
| `Sync` | 同步方法 |
| `AsyncSeries` | 异步串行钩子 |
| `AsyncParallel` | 异步并行钩子 |

### Tapable 的使用

**`new Hook` 新建钩子：**

`Tapable` 暴露出来的都是类方法，`new` 一个类方法获得我们需要的钩子，`class` 接收数组参数 `options`，非必传，类方法会根据传参接受同样数量的参数。

```js
const hook = new SyncHook(['arg1', 'arg2', 'arg3']);
```

**钩子的绑定与执行：**

`Tapable` 提供了同步&异步绑定钩子的方法，并且他们都有绑定事件和执行事件对应的方法

| Async* | Sync* |
| ------ | ------ |
| 绑定：`tapAsync/tapPromise/tap` | 绑定：`tap` |
| 执行：`callAsync/promise` | 执行：`call` |

```js
const hook = new SyncHook(['arg1', 'arg2', 'arg3']);

// 绑定事件到 webpack 事件流
hook.tap('hookname', (arg1, arg2, arg3) => console.log(arg1, arg2, arg3)); // 1 2 3

// 执行绑定的事件
hook.call(1, 2, 3);
```

### Tapable 与 Webpack 是如何关联起来的

**模拟 `Compiler.js`**

```js
module.exports = class Compiler {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['newspeed']),
      brake: new SyncHook(),
      calculateRoutes: new AsyncSeriesHook(['source', 'target', 'routesList'])
    }
  }
  run() {
    this.accelerate(10);
    this.break();
    this.calculateRoutes('Async', 'hook', 'demo');
  }
  accelerate(speed) {
    this.hooks.accelerate.call(speed);
  }
  break() {
    this.hooks.brake.call();
  }
  calculateRoutes() {
    this.hooks.calculateRoutes.promise(...arguments).then(() => {
    }, (err) => {
      console.error(err);
    });
  }
}
```

**模拟插件**

```js
const Compiler = require('./Compiler');

class MyPlugin {
  apply(compiler) {
    compiler.hooks.brake.tap('WarningLampPlugin', () => {
      console.log('WarningLampPlugin');
    });
    compiler.hooks.accelerate.tap('LoggerPlugin', (newSpeed) => {
      console.log(`Accelerating to ${newSpeed}`);
    });
    compiler.hooks.calculateRoutes.tapPromise('calculateRoutes tapPromise', (source, target, routesList) => {
      return new Promise((resolve, reject)=>{
        setTimeout(()=>{
          console.log(`tapPromise to ${source} ${target} ${routesList}`);
          resolve();
        }, 1000);
      });
    });
  }
}
```

**模拟插件执行**

```js
const myPlugin = new MyPlugin();

const options = {
  plugins: [
    myPlugin,
  ]
};

const compiler = new Compiler();

for (const plugin of options.plugins) {
  if (plugin && typeof plugin === 'function') {
    plugin.call(compiler, compiler);
  } else {
    plugin.apply(compiler);
  }
}

compiler.run();
```

# Webpack 流程

`entry-option`: 初始化 `option`
  => `run`: 开始编译
  => `make`: 从 `entry` 开始递归的分析依赖，对每个依赖进行 `build`
  => `before-resolve`: 对模块位置进行解析
  => `build-module`: 开始构建模块
  => `normal-module-loader`: 将 `loader` 加载完成的 `module` 进行编译，生成 `AST` 树
  => `program`: 遍历 `AST`，当遇到 `require` 等一些调用表达式时，收集依赖
  => `seal`: 所有依赖 `build` 完成，开始优化
  => `emit`: 输出到 `dist` 目录

## 准备阶段

`WebpackOptionsApply` 作用：将所有的配置 `options` 参数转换成 `Webpack` 内部插件挂载到 `Compiler` 的实例上

**使用默认插件列表：**

- `output.library` => `LibraryTemplatePlugin`
- `externals` => `ExternalsPlugin`
- `devtool` => `EvalDevtoolModulePlugin`, `SourceMapDevtoolPlugin`
- `AMDPlugin, CommonJsPlugin`
- `RemoveEmptyChunksPlugin`

**`Compiler hooks`**

- 流程相关：
  - (`before-`)`run`
  - (`before-/after-`)`compile`
  - `make`
  - (`after-`)`emit`
  - `done`
- 监听相关：
  - `watch-run`
  - `watch-close`

**`Compilation`**

`Compiler` 调用 `Compilation` 生命周期方法

- `addEntry` => `addModuleChain`
- `finish`: 上报模块错误
- `seal`: 构建完成文件生成和优化阶段

## 模块构建和 chunk 生成

### ModuleFactory

- `NormalModuleFactory`: 普通模块，直接通过模块名引入的模块
- `ContextModuleFactory`: 带路径引入的模块

### Module

- `NormalModule`: 普通模块
- `ContextModule`: 带路径引入的模块
- `ExternalModule`: `module.exports = jQuery` 类似的模块
- `DelegatedModule`: `manifest` 引入的模块
- `MutilModule`: `entry` 引入的模块

**`Build`**

- 使用 `loader-runner` 运行 `loaders`
- 通过 `Parser` 解析（内部 `acron`）
- `ParserPlugins` 添加依赖

**`Compiler hooks`**

- 模块相关：
  - `build-module`
  - `failed-module`
  - `succeed-module`
- 资源生成相关：
  - `module-asset`
  - `chunk-asset`
- 优化和 `seal` 相关：
  - (`after-`)`seal`
  - `optimize`
  - `optimize-modules`(`-basic/advanced`)
  - `after-optimize-modules`
  - `after-optimize-chunks`
  - `after-optimize-tree`
  - `optimize-chunk-modules`(`-basic/advanced`)
  - `after-optimize-chunk-modules`
  - `optimize-module/chunk-order`
  - `before-module/chunk-ids`
  - (`after-`)`optimize-module/chunk-ids`
  - (`before/after-`)`hash`

### chunk 生成算法

- `Webpack` 先将 `entry` 中对应的 `module` 都生成一个新的 `chunk`
- 遍历 `module` 的依赖列表，将依赖的 `module` 也加入到 `chunk` 中
- 如果一个依赖 `module` 是动态引入的模块，那么就会根据这个 `module` 创建一个新的 `chunk`，继续遍历依赖
- 重复上面过程知道得到所有 `chunk`

## 文件生成
