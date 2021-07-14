const glob = require('glob');

describe('Checking generated css&js files', () => {
  it('Should generated css&js files', (done) => {
    const files = glob.sync([
      './dist/index.*.js',
      './dist/index.*.css',
      './dist/search.*.js',
      './dist/search.*.css'
    ]);

    if (files.length > 0) {
      done();
    } else {
      throw new Error('No css&js files generated');
    }
  });
});
