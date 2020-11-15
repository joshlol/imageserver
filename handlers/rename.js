const path = require('path');
const sharp = require('sharp');

function randomString(length) {
  const pos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890.-?/';
  let str = 0;
  for (let i = 0; i < length; i++) {
    str += pos.charAt(Math.floor(Math.random() * pos.length));
  }
  return str;
}

class rename {
  constructor(folder) {
    this.folder = folder;
  }
  async save(buffer) {
    const filename = rename.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer).png().toFile(filepath);
    
    return filename;
  }
  static filename() {
    return `${randomString(5)}.png`;
  }
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`);
  }
}
module.exports = rename;