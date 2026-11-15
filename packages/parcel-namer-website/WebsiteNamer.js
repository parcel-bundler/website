const {Namer} = require('@parcel/plugin');
const path = require('path');

module.exports = new Namer({
  name({bundle, options}) {
    if (bundle.needsStableName) {
      let filePath = bundle.getMainEntry().filePath;
      let relative = path
        .relative(options.projectRoot, filePath)
        .replace(/^(_site|src[\\/]home|src)[\\/]/, '');
      let index = relative.lastIndexOf('.');
      return relative.slice(0, index + 1) + bundle.type;
    }
  }
});
