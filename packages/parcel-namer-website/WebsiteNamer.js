const {Namer} = require('@parcel/plugin');
const path = require('path');

module.exports = new Namer({
  name({bundle, options}) {
    if (bundle.needsStableName) {
      let filePath = bundle.getMainEntry().filePath;
      let relative = path.relative(options.projectRoot, filePath);
      return relative.replace(/^(_site|src[\\/]home|src)[\\/]/, '');
    }
  }
});
