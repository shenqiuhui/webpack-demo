const fs = require('fs');
const path = require('path');
const Spritesmith = require('spritesmith');

const sprites = ['./loaders/images/google.png', './loaders/images/baidu.png'];

Spritesmith.run({ src: sprites }, (err, result) => {
  console.log(result.image);
  console.log(result.coordinates);
  console.log(result.properties);

  fs.writeFileSync(path.join(__dirname, 'dist/sprite.png'), result.image);
});
