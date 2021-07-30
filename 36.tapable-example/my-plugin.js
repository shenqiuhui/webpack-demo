const Compiler = require('./compiler');

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
