const assert = require('assert');

describe('webpack.base.js test case', () => {
  const baseConfig = require('../../lib/webpack.base.conf');

  it('entry', () => {
    assert.strictEqual(baseConfig.entry.index, '/Users/shenqiuhui/Demo/webpack-demo/26.build-webpack/test/smoke/template/src/pages/index/index.js');
    assert.strictEqual(baseConfig.entry.search, '/Users/shenqiuhui/Demo/webpack-demo/26.build-webpack/test/smoke/template/src/pages/search/index.js');
  });
});

