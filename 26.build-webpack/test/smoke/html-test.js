const glob = require('glob');

describe('Checking generated html files', () => {
  it('Should generated html files', (done) => {
    const files = glob.sync([
      './dist/index.html',
      './dist/search.html'
    ]);

    if (files.length > 0) {
      done();
    } else {
      throw new Error('No html files generated');
    }
  });
});
