const path = require('path');
const { getAST, getDependencies, transform } = require('./parser');

const ast = getAST(path.join(__dirname, '../src/index.js'))
console.log(ast);
console.log(getDependencies(ast));
console.log(transform(ast));
